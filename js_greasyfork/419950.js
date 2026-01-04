// ==UserScript==
// @name     Comrade: Stack Bot for Zoom
// @description Bot that manages stack for meetings. Active if your name is "Comrade" when you join.
// @version  2.1
// @grant    none
// @include https://zoom.us/j/*
// @include https://*.zoom.us/j/*
// @include https://zoom.us/s/*
// @include https://*.zoom.us/s/*
// @include https://*.zoom.us/wc/*
// @namespace https://greasyfork.org/users/22981
// @downloadURL https://update.greasyfork.org/scripts/419950/Comrade%3A%20Stack%20Bot%20for%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/419950/Comrade%3A%20Stack%20Bot%20for%20Zoom.meta.js
// ==/UserScript==


/*
ANTI-CAPITALIST SOFTWARE LICENSE (v 1.4)

Copyright © 2021 Adam Novak

This is anti-capitalist software, released for free use by individuals and
organizations that do not operate by capitalist principles.

Permission is hereby granted, free of charge, to any person or organization
(the "User") obtaining a copy of this software and associated documentation
files (the "Software"), to use, copy, modify, merge, distribute, and/or sell
copies of the Software, subject to the following conditions:

1. The above copyright notice and this permission notice shall be included in
   all copies or modified versions of the Software.

2. The User is one of the following:
  a. An individual person, laboring for themselves
  b. A non-profit organization
  c. An educational institution
  d. An organization that seeks shared profit for all of its members, and
     allows non-members to set the cost of their labor

3. If the User is an organization with owners, then all owners are workers and
   all workers are owners with equal equity and/or equal vote.

4. If the User is an organization, then the User is not law enforcement or
   military, or working for or under either.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT EXPRESS OR IMPLIED WARRANTY OF ANY
KIND, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

//// CONFIG

const BOT_NAME = 'Comrade'
const QUEUE_KEYWORD = 'stack'
const DEQUEUE_KEYWORD = 'pop'
const GIVEUP_KEYWORD = 'unstack'
const REMIND_KEYWORD = 'who'
const HELP_KEYWORD = 'help'

const HELP_TEXT = `
${BOT_NAME} is a bot who can stack. Type:
1. "${QUEUE_KEYWORD}" to put yourself on stack.
2. "${DEQUEUE_KEYWORD}" when you are done so the bot can announce who is next.
3. "${GIVEUP_KEYWORD}" if you are on stack but don't want to be.
4. "${REMIND_KEYWORD}" if you forgot who is on stack.

Type "${HELP_KEYWORD}" to see this message again.
`

// How many pixels can we be scrolled from the bottom and still think all
// messages we see are the latest ones?
const END_OF_HISTORY_HEIGHT = 10

//// LIBRARY

// Let async code wait.
// See: <https://stackoverflow.com/a/39914235>
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Find a button by text. Returns the button element, or undefined.
function findButton(text) {
  let all_buttons = document.getElementsByTagName('button')
  let this_button = undefined
  for (let button of all_buttons) {
    if (!this_button && button.innerText.includes(text)) {
      this_button = button
    }
  }
  return this_button
}

//// ENSURE WEB CLIENT ACCESSIBLE

function showWebClientLink() {
  let results = document.getElementsByClassName('webclient')
 
  if (results[0]) {
    results[0].classList.remove('hideme')
  }
}

// We may be on a non-meeting page. Make sure people can join.
showWebClientLink()


//// BOT

// Wait for the client to start, open necessary panes, and set name
async function botStartup() {
  try {
    while (true) {
      // Wait until ready. We assume we are ready when the join audio button comes up
      console.log('Waiting for join audio button...')
      let audio_button = document.getElementsByClassName('join-audio-by-voip__join-btn')[0]
      if (audio_button && audio_button.offsetParent != null) {
        // It exists and is visible
        break
      }
      await sleep(1000)
    }
    console.log('Audio button visible')
    
    while (true) {
      // Wait for the chat and participants buttons
      // They may be in the bore button.
      let more_button = document.getElementsByClassName('more-button')[0]
      let participants_button = findButton('Participants')
      // TODO: look in more menu
      
      if (participants_button) {
        // The button exists, so click it and move on
        participants_button.click()
        break
      }
      
      // Otherwise try again
      console.log('Waiting for participants button...')
      await sleep(1000)
    }
    
    // We only want to operate if we joined with the correct name.
    // That way you can leave the script enabled and join the meeting as you
    // and as the bot.
    let named_right = false;
    
    while (true) {
      // When the user list comes up, find and hover over ourselves
      console.log('Waiting for own participant entry...')
      // We are always at the top
      let user_entry = document.getElementById('participants-list-0')
      
      if (user_entry) {
        // The entry exists
        let user_name = user_entry.innerText.split('\n')[0].trim()
        console.log('I am: ', user_name)
        if (user_name.includes(BOT_NAME) || BOT_NAME.includes(user_name)) {
          // We should be the bot
          named_right = true;
        }
        break
      }
      
      // Otherwise try again
      await sleep(1000)
    }
    
    if (named_right) {
      // Be the bot!
      
      await enforceChat()
    
      console.log(BOT_NAME + ' is ready.')
      
      // Introduce ourselves
      await sleep(3000)
      await say(BOT_NAME + ' is ready.')
      await say(await showHelp())
      
      // Move on to the main loop.
      mainLoop()
    } else {
      console.log('Name is not ' + BOT_NAME + ': not running')
    }
    
  } catch (e) {
    console.error('Comrade initialization error: ', e)
  }
}

// Make the chat and participants panes come up, and attach the chat mutation listener.
// No-op if they are visible already.
// Need to run periodically in case screen sharing minimizes them.
async function enforceChat() {

  let opened_pane = false

  while (true) {
    // Wait for the chat and participants buttons
    // They may be in the bore button.
    let more_button = document.getElementsByClassName('more-button')[0]
    let chat_button = findButton('Chat')

    // TODO: look in more menu
    
    if (chat_button) {
      // The button exists
      
      if (chat_button.getAttribute('aria-label') == 'open the chat pane') {
        // Pane isn't open yet
        chat_button.click()
        opened_pane = true
      }
      
      break
    }
    
    // Otherwise try again
    console.log('Waiting for chat button...')
    await sleep(1000)
  }
  
  if (opened_pane) {
    // Now grab the chat log
    let chat_log = document.getElementsByClassName('chat-virtualized-list')[0]
    console.log('Chat log: ', chat_log)
    
    // Watch for chats
    let chat_watcher = new MutationObserver(chatChange)
    chat_watcher.observe(chat_log, {childList: true, subtree: true, characterDataOldValue: true})
    console.log('Watching with: ', chat_watcher)
  }
}

// Return the lowest parent node with the given class name, or undefined 
function getAncestorByClassName(element, class_name) {
  while (element) {
    if (element.classList && element.classList.contains(class_name)) {
      return element
    }
    element = element.parentElement
  }
}

// Handle changes to the chat log and translate them into internal chat message calls
function chatChange(mutations, chat_watcher) {
  try {
    // Find the chat scrolling element
    let chat_scroller = document.getElementsByClassName('chat-virtualized-list')[0]
    
    // Scroll it to the end so we don't get off of history.
    // TODO: this will break scrolling chat manually
    chat_scroller.scrollTo(0, chat_scroller.scrollTopMax)
 
    for (let record of mutations) {
    
      // class lsits have contains while arrays have includes for some reason
      if ((record.addedNodes.length == 0 && record.type != 'characterData') || (record.addedNodes.length == 1 && record.addedNodes[0].classList.contains('chat-item__chat-info-time-stamp'))) {
        // These are noise
        continue
      }
      
      
      
      if (record.nextSibling) {
        // Zoom pages the chat messages in and out as we scroll the chat, and also when it feels like.
        // We can skip most of them here, but they will be re-seen if we are scrolling up and down.
        continue
      }
      
      // We may get new nodes, or changed text.
      if (record.type == 'characterData') {
        // New message from the same person as last time. Assume it is an append.
        let chat_message_root = getAncestorByClassName(record.target.parentElement, 'chat-item__chat-info')
        let chat_sender_item = chat_message_root.getElementsByClassName('chat-item__sender')[0]
        if (chat_sender_item) {
          // Who said it?
          let chat_sender = chat_sender_item.innerText
          // Is the chat private to me?
          let chat_private = (chat_message_root.getElementsByClassName('chat-privately')[0] !== undefined)
          
          // Trim off the old text and the intervening newline
          let chat_content = record.target.textContent.substr(record.oldValue.length + 1)
          console.log(chat_sender + (chat_private ? ' privately' : '') + ' also says: ' + chat_content)
          onChat(chat_sender, chat_content, chat_private)
        } else {
          console.log('Skipping new character data because we are missing a sender') 
        }
      }
      
      if (chat_scroller && chat_scroller.scrollTopMax - chat_scroller.scrollTop > END_OF_HISTORY_HEIGHT) {
        // We are probably scrolling around the list and not getting new messages.
        // TODO: if you scroll up and new messages come in they will be skipped!
        console.log('Skipping new nodes as we are not at the end of history: ' + chat_scroller.scrollTop + '/' + chat_scroller.scrollTopMax)
        continue
      }
      
      for (let modified of record.addedNodes) {
        // We got a new element. Find its content.
        let chat_content_item = modified.getElementsByClassName('chat-message-text-content')[0]
        // Then the parent of it and the sender info
        let chat_message_root = getAncestorByClassName(chat_content_item, 'chat-item__chat-info')
        
        if (!chat_message_root) {
          console.log('Skipping new node because message root could not be found')
          continue
        }
        
        // Then the sender info down from that.
        let chat_sender_item = chat_message_root.getElementsByClassName('chat-item__sender')[0]
        
        if (chat_sender_item && chat_content_item) {
          // Who said it?
          let chat_sender = chat_sender_item.innerText
          
          // Is the chat private to me?
          let chat_private = (chat_message_root.getElementsByClassName('chat-privately')[0] !== undefined)
          
          let chat_content = chat_content_item.innerText
          if (chat_sender !== undefined && chat_content !== undefined) {
            console.log(chat_sender + (chat_private ? ' privately' : '') + ' says: ' + chat_content)
            onChat(chat_sender, chat_content, chat_private)
          }
        } else {
          console.log('Skipping new node because we are missing a sender or content') 
        }
      }
      
    }
  } catch (e) {
    console.error('Comrade element watch error: ', e)
  }

}


// Keep track of the meeting stack
let stack = []

// All the command functions return a result string.

// Put a person on the stack, if not on stack already
// Special handling of a successful add: tell everyone, even if add was
// private.
async function addToStack(who) {
  let result = ''
  if (stack.includes(who)) {
    return (who + ' is already on stack.')
  } else {
    stack.push(who)
    await say(await reportStack())
    return undefined
  }
}

// Remove the oldest person from the stack
async function popFromStack() {
  let result = ''
  removed = stack[0]
  stack = stack.slice(1)
  
  if (removed) {
    await say(await reportStack())
    result += ('Removed ' + removed + ' from stack.')
  }
  return result
}

// Drop the given person from stack
async function removeFromStack(who) {
  let result = ''
  let new_stack = []
  let removed = false
  let removed_first = (stack.length == 1 && who == stack[0])
  
  for (let person of stack) {
    if (person != who) {
      new_stack.push(person)
    } else {
      removed = true
    }
  }
  stack = new_stack
  
  if (removed) {
    result += ('Removed ' + who + ' from stack')
    await say(await reportStack())
  } else {
    result += (who + 'was not on stack')
  }
  
  return result
}

// Read out the stack
async function reportStack() {
  let result = ''
  if (stack.length == 0) {
    result += 'Stack is empty'
  } else {
    result += ('\nNext on stack is: ' + stack[0])
    if (stack.length > 1) {
      result += '\nAfter that:'
      for (let i = 1; i < stack.length; i++) {
        result += ('\n' + i + '. ' + stack[i])
      }
    }
  }
  return result
}

// Print the help text
async function showHelp() {
  let result = HELP_TEXT
  return result
}

// We use this queue to make sure we completely process one incoming message before the next one starts being handled.
// It holds arrays of name, message, private flag
let incoming_messages = []

// Called when a new chat message comes in.
// Just adds it to the queue fro processing.
function onChat(sender, message, private) {
  incoming_messages.push([sender, message, private])
}

// Main loop that handles chat messages off the incoming queue
async function mainLoop() {
  try {
    await enforceChat()
    if (incoming_messages.length > 0) {
      // We have mail!
      
      // Pop a message
      let [sender, message, private] = incoming_messages[0]
      incoming_messages = incoming_messages.slice(1)
      
      // And handle it, waiting
      await processChat(sender, message, private)
      console.log('Ready for next message.')
    }
  } catch (e) {
    console.error('Comrade main loop exception: ', e)
  }

  // Run again
  setTimeout(mainLoop, 100)
}

// Function that actually processes a chat message.
// MUST NOT have two copies running at once. MUST be awaited.
async function processChat(sender, message, private) {
  try {
    // For getting on stack, we want to accept things like "ash stack" or "ash" from user "Ash Ketchum (he/him)".
    // So we need to break everything into words.
    let command_words = message.toLowerCase().split(' ').filter((x) => x != '')
    let user_words = sender.toLowerCase().split(' ').filter((x) => x != '')
    
    let reply = undefined
    
    if (command_words.length == 1) {
      // Just one command
      let command = command_words[0]
      
      if (command == 'ping') {
        reply = 'pong'
      } else if (command == QUEUE_KEYWORD || user_words.includes(command)) {
        reply = await addToStack(sender)
      } else if (command == DEQUEUE_KEYWORD) {
        reply = await popFromStack()
      } else if (command == GIVEUP_KEYWORD) {
        reply = await removeFromStack(sender)
      } else if (command == REMIND_KEYWORD) {
        reply = await reportStack()
      } else if (command == HELP_KEYWORD) {
        reply = await showHelp()
      } else if (private) {
        reply = `Unrecognized command. Say "${HELP_KEYWORD}" for help.`
      }
    } else if (command_words.length > 1) {
      // If all the words in the command are either the stack command or parts of the
      // user's name, put them on stack.
      let all_stacky = true
      for (let word of command_words) {
        if (word != QUEUE_KEYWORD && !user_words.includes(word)) {
          all_stacky = false
          break
        }
      }
      
      if (all_stacky) {
        reply = await addToStack(sender)
      }
    }
    
    if (reply !== undefined) {
      // This merits a response
      if (private) {
        // Reply directly
        await whisper(sender, reply)
      } else {
        // Reply to everyone
        await say(reply)
      }
    }
  } catch (e) {
    console.error('Comrade message interpretation error: ', e)
  }
}

// Type in the chat.
async function say(message) {
  // Just whisper by saying to everyone...
  await whisper("Everyone", message)
}

// Type to someone in chat
async function whisper(who, message) {
  try {
    console.log('Sending to ' + who + ': ' + message)
    
    // Open the menu of people
    let chat_picker = document.getElementById('chatReceiverMenu')
    chat_picker.click()
    
    await sleep(100)
    
    // Find the dropdown
    let chat_dropdown = document.getElementsByClassName('chat-receiver-list__scrollbar')[0]
    
    // It is full of links. Find the link to click.
    let found = false
    for (let link of chat_dropdown.getElementsByTagName('a')) {
      if (link.innerText == who || link.innerText == (who + "(Host)") || (who == "Everyone" && link.innerText == "Everyone (in Meeting)")) {
        // What "Everyone" looks like depends on if you are the host or not.
        link.click()
        found = true
      } else {
        console.log('"' + link.innerText + '" is not "' + who + '"')
      }
    }
    
    if (!found) {
      console.log('Cound not find ' + who + ' to talk to')
      return
    } else {
      // Wait to take effect
      await sleep(100)
    }
  
    let chat_box = document.getElementsByClassName('chat-box__chat-textarea')[0]
    console.log('Chat box: ', chat_box)
    
    chat_box.value = message
  
    let change_event = new Event('change', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      })
    chat_box.dispatchEvent(change_event)
    
    // All the keyboard event properties are read only so we have to set them up front.
    let enter_event = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      code: "Enter",
      key: "Enter",
      keyCode: 13,
      which: 13
    })
    chat_box.dispatchEvent(enter_event)
  } catch (e) {
    console.error('Comrade whisper transmission error: ', e)
  }
}


botStartup()







