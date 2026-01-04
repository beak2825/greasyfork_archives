// ==UserScript==
// @name         RateLimit Bypass
// @namespace    RishiSunak
// @version      0.6
// @description  Send custom requests when emote buttons are clicked
// @author       You
// @match        https://kick.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493803/RateLimit%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/493803/RateLimit%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getCookie(name) {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=');
            if (cookieName === name) {
                return cookieValue;
            }
        }
        return null;
    }

      const authToken = getCookie('XSRF-TOKEN');
      const xsrfToken = decodeURIComponent(authToken);

function sendRequest(chatId, emoteNumber, xsrfToken) {
    const headers = {
        'Accept': 'application/json, text/plain, */*',
        'Authorization': authToken,
        'X-Xsrf-Token': xsrfToken,
        'Origin': 'https://kick.com',
        'Referer': 'https://kick.com/nickwhite',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Content-Type': 'application/json'
    };

    const url = 'https://kick.com/api/v2/messages/send/' + chatId;
    let content = `[emote:${emoteNumber}:RishiBypass]`;
    if (parseInt(chatId) === 92721 && parseInt(emoteNumber) === 37231) {
        content = "I Love Nick White! [emote:2530178:NickProtect]";
        console.log('NickProtect Triggered');
    }

    const jsonData = JSON.stringify({
        'content': content,
        'type': 'message'
    });

    fetch(url, {
        method: 'POST',
        headers: headers,
        credentials: 'include',
        body: jsonData
    }).then(response => {
        if (!response.ok) {
            if (response.status === 429) {
                console.log('IP Limit Detected - Change IP to send more emotes');
                createPopup('IP Limit Detected - Change IP to send more emotes');
            } else {
                throw new Error('Failed to send request');
            }
        }
        console.log('Request sent successfully');
    }).catch(error => {
        console.error('Error sending request:', error);
    });
}

function createPopup(message) {
    const popup = document.createElement('div');
    popup.textContent = message;
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px';
    popup.style.background = 'red';
    popup.style.color = 'white';
    popup.style.fontFamily = 'Arial, sans-serif';
    popup.style.fontSize = '16px';
    popup.style.zIndex = '9999';
    popup.style.borderRadius = '5px';

    document.body.appendChild(popup);

    setTimeout(() => {
        document.body.removeChild(popup);
    }, 5000);
}

function sendMessage(chatId, message, xsrfToken) {
    const headers = {
        'Accept': 'application/json, text/plain, */*',
        'Authorization': authToken,
        'X-Xsrf-Token': xsrfToken,
        'Origin': 'https://kick.com',
        'Referer': 'https://kick.com/nickwhite',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Content-Type': 'application/json'
    };

    const url = 'https://kick.com/api/v2/messages/send/' + chatId;
    const jsonData = JSON.stringify({
        'content': message,
        'type': 'message'
    });

    fetch(url, {
        method: 'POST',
        headers: headers,
        credentials: 'include',
        body: jsonData
    }).then(response => {
        if (!response.ok) {
            if (response.status === 429) {
                console.log('IP Limit Detected - Change IP to send more messages');
                createPopup('IP Limit Detected - Change IP to send more messages');
            } else {
                throw new Error('Failed to send request');
            }
        }
        console.log('Message sent successfully');
    }).catch(error => {
        console.error('Error sending message:', error);
    });
}

let buttonAdded = false;

function attachEventListeners(chatId) {
    setTimeout(() => {
        const emoteItems = document.querySelectorAll('img[src*="/emotes/"]');
        emoteItems.forEach(emote => {
            const clone = emote.cloneNode(true);
            emote.parentNode.replaceChild(clone, emote);
        });

        const newEmoteItems = document.querySelectorAll('img[src*="/emotes/"]');
        newEmoteItems.forEach(emote => {
            emote.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                console.log('Clicked IMG element:', event.target);
                console.log('SRC:', event.target.src);
                const emoteNumber = event.target.src.match(/\/emotes\/(\d+)\/fullsize/)[1];
                console.log('Emote Number:', emoteNumber);
                if (typeof currentChatEntry !== 'undefined' && currentChatEntry !== null && currentChatEntry !== '') {
                    sendReply(chatId, emoteNumber, xsrfToken);
                } else {
                    sendRequest(chatId, emoteNumber, xsrfToken);
                }
                attachEventListeners(chatId);
            });
        });

      if (!buttonAdded) {
            setTimeout(() => {
const emotesHolder = document.querySelector('.quick-emotes-holder');
if (emotesHolder.children.length === 10) {
    emotesHolder.removeChild(emotesHolder.lastElementChild);
    emotesHolder.removeChild(emotesHolder.lastElementChild);
}
const newButton = document.createElement('div');
newButton.setAttribute('data-v-5c8c79cb', '');
newButton.setAttribute('data-v-b51a7b6d', '');
newButton.classList.add('quick-emote-item');
const buttonhovertext = "Send chat message";
newButton.innerHTML = `<div data-v-5c8c79cb="" class="relative">
                           <div data-v-5c8c79cb="" class="flex items-center justify-center text-center align-middle h-4 w-4">
                               <img src="https://i.imgur.com/7caVoug.png" class="w-full object-contain">
                           </div>
                       </div>`;
emotesHolder.appendChild(newButton);

const hoverText = document.createElement('div');
hoverText.classList.add('absolute', 'bg-white', 'p-1', 'rounded', 'text-black', 'font-bold', 'invisible', 'text-xs', 'z-[9999]');
hoverText.textContent = buttonhovertext;
document.body.appendChild(hoverText);
const buttonRect2 = newButton.getBoundingClientRect();
const textRect2 = hoverText.getBoundingClientRect();
hoverText.style.top = `${buttonRect2.top - textRect2.height - 10}px`;
hoverText.style.left = `${buttonRect2.left - 85}px`;
newButton.addEventListener('mouseenter', function() {
    hoverText.classList.remove('invisible');
});

newButton.addEventListener('mouseleave', function() {
    hoverText.classList.add('invisible');
});
newButton.addEventListener('click', function(event) {
    event.preventDefault();
    event.stopPropagation();
    const messageBox = document.getElementById('message-input');
    const messageContent = messageBox.textContent.trim();
    if (typeof currentChatEntry !== 'undefined' && currentChatEntry !== null && currentChatEntry !== '') {
        sendReplyMessage(chatId, messageContent, xsrfToken);
    } else {
        if (messageContent !== '') {
            sendMessage(chatId, messageContent, xsrfToken);
        } else {
            createPopup('Type a message in the text box before clicking this');
        }
    }
});

const settingsButton = document.createElement('div');
settingsButton.setAttribute('data-v-5c8c79cb', '');
settingsButton.setAttribute('data-v-b51a7b6d', '');
settingsButton.classList.add('quick-emote-item');
settingsButton.innerHTML = `<div data-v-5c8c79cb="" class="relative">
                               <div data-v-5c8c79cb="" class="flex items-center justify-center text-center align-middle h-4 w-4">
                                   <img src="https://i.imgur.com/WHQkf97.png" class="w-full object-contain"> <!-- Change the src attribute to the URL of your settings icon -->
                               </div>
                           </div>`;
emotesHolder.appendChild(settingsButton);
const whiteBox = document.createElement('div');
whiteBox.classList.add('absolute', 'bg-white', 'p-1', 'rounded', 'text-black', 'font-bold', 'invisible', 'text-xs', 'z-[9999]');
whiteBox.textContent = 'Settings';
document.body.appendChild(whiteBox);
const buttonRect = settingsButton.getBoundingClientRect();
const boxRect = whiteBox.getBoundingClientRect();
whiteBox.style.top = `${buttonRect.top - boxRect.height - 10}px`;
whiteBox.style.left = `${buttonRect.left - 20}px`;

settingsButton.addEventListener('mouseenter', function() {
    whiteBox.classList.remove('invisible');
});

settingsButton.addEventListener('mouseleave', function() {
    whiteBox.classList.add('invisible');
});

function displayOverlay() {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '9999';
    overlay.style.userSelect = 'none';

    const box = document.createElement('div');
    box.style.position = 'absolute';
    box.style.top = '50%';
    box.style.left = '50%';
    box.style.transform = 'translate(-50%, -50%)';
    box.style.padding = '20px';
    box.style.backgroundImage = 'url("https://i.imgur.com/9UbkApf.png")';
    box.style.backgroundSize = 'cover';
    box.style.borderRadius = '10px';
    box.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';

const delayHeader = document.createElement('div');
delayHeader.textContent = 'Delay in seconds';
delayHeader.style.color = 'white';
delayHeader.style.marginBottom = '5px';

box.appendChild(delayHeader);

const delayInput = document.createElement('input');
delayInput.type = 'number';
delayInput.placeholder = '1';
delayInput.style.display = 'block';
delayInput.style.width = '50px';
delayInput.style.padding = '5px';
delayInput.style.marginBottom = '10px';
delayInput.min = '0.1';
delayInput.max = '99';
delayInput.step = '0.1';
delayInput.value = '1';
delayInput.style.border = 'none';
delayInput.style.borderBottom = '1px solid black';
delayInput.style.color = 'black';

const upArrow = document.createElement('button');
upArrow.textContent = '▲';
upArrow.style.padding = '5px';
upArrow.style.cursor = 'pointer';
upArrow.style.color = 'green';
upArrow.addEventListener('click', function() {
    delayInput.stepUp();
});

    const downArrow = document.createElement('button');
    downArrow.textContent = '▼';
    downArrow.style.padding = '5px';
    downArrow.style.cursor = 'pointer';
    downArrow.style.color = 'red';
    downArrow.addEventListener('click', function() {
        delayInput.stepDown();
    });

    box.appendChild(delayInput);
    box.appendChild(upArrow);
    box.appendChild(downArrow);

let selectedEmoteID;
const emoteHolder = document.createElement('div');
emoteHolder.classList.add('emote-holder');

const emoteItems = document.querySelectorAll('.quick-emotes-holder .quick-emote-item');
emoteItems.forEach((item, index) => {
    if (index < 8 && !item.classList.contains('quick-emote-item-disabled') && !item.classList.contains('!cursor-not-allowed')) {
        const emoteClone = document.createElement('div');
        emoteClone.classList.add('emote-item');
        emoteClone.style.background = 'rgba(240, 240, 240, 0.8)';
        emoteClone.style.borderRadius = '5px';
        emoteClone.style.padding = '5px';
        emoteClone.style.display = 'inline-block';
        emoteClone.style.marginRight = '5px';
        const img = document.createElement('img');
        img.src = item.querySelector('img').src;
        img.classList.add('emote-img');
        img.style.width = '30px';
        img.style.height = '30px';
        emoteClone.appendChild(img);
        emoteClone.addEventListener('click', function() {
            const selectedEmotes = document.querySelectorAll('.emote-item.selected');
            selectedEmotes.forEach(emote => {
                emote.classList.remove('selected');
                emote.style.background = 'rgba(240, 240, 240, 0.8)';
            });
            emoteClone.classList.add('selected');
            emoteClone.style.background = 'green';
        });

        emoteHolder.appendChild(emoteClone);
    }
});
const startButton = document.createElement('button');
startButton.textContent = 'Start';
startButton.style.display = 'block';
startButton.style.padding = '10px 20px';
startButton.style.marginTop = '10px';
startButton.style.marginBottom = '20px';
startButton.style.cursor = 'pointer';
startButton.style.backgroundColor = 'green';
startButton.style.border = 'none';
startButton.style.borderRadius = '5px';
startButton.style.color = 'white';
const messageCountHeader = document.createElement('div');
messageCountHeader.textContent = 'Messages to send';
messageCountHeader.style.color = 'white';
messageCountHeader.style.marginBottom = '5px';

box.appendChild(messageCountHeader);

const messageCountInput = document.createElement('input');
messageCountInput.type = 'number';
messageCountInput.placeholder = '1';
messageCountInput.style.display = 'inline-block';
messageCountInput.style.width = '50px';
messageCountInput.style.padding = '5px';
messageCountInput.style.marginBottom = '10px';
messageCountInput.min = '1';
messageCountInput.max = '999';
messageCountInput.step = '1';
messageCountInput.value = '1';
messageCountInput.style.border = 'none';
messageCountInput.style.borderBottom = '1px solid black';
messageCountInput.style.color = 'black';

box.appendChild(messageCountInput);

messageCountHeader.style.position = 'absolute';
messageCountHeader.style.top = '18px';
messageCountHeader.style.right = '10px';
messageCountInput.style.position = 'absolute';
messageCountInput.style.top = '48px';
messageCountInput.style.right = '10px';
const sendChatCheckbox = document.createElement('input');
sendChatCheckbox.type = 'checkbox';
sendChatCheckbox.id = 'sendChatCheckbox';
sendChatCheckbox.style.marginRight = '5px';
sendChatCheckbox.style.verticalAlign = 'middle';

const sendChatLabel = document.createElement('label');
sendChatLabel.textContent = 'Send chat message';
sendChatLabel.setAttribute('for', 'sendChatCheckbox');
sendChatLabel.style.color = 'white';
sendChatLabel.style.verticalAlign = 'middle';
const messageTextBox = document.createElement('textarea');
messageTextBox.placeholder = 'Enter message...';
messageTextBox.style.width = '360px';
messageTextBox.style.height = '100px';
messageTextBox.style.padding = '5px';
messageTextBox.style.marginTop = '10px';
messageTextBox.style.display = 'none';
messageTextBox.style.color = 'black';

sendChatCheckbox.addEventListener('change', function() {
    if (sendChatCheckbox.checked) {
        emoteHolder.style.display = 'none';
        messageTextBox.style.display = 'block';
    } else {
        emoteHolder.style.display = 'block';
        messageTextBox.style.display = 'none';
    }
});

startButton.addEventListener('click', function() {
    if (sendChatCheckbox.checked) {
        const message = messageTextBox.value.trim();
        if (message !== '') {
            const delaySeconds = parseFloat(delayInput.value);
            if (!isNaN(delaySeconds) && delaySeconds > 0) {
                const messageCount = parseInt(messageCountInput.value);
                if (!isNaN(messageCount) && messageCount > 0) {
                    let messagesSent = 0;
                    const intervalID = setInterval(function() {
                        if (replyModeCheckbox.checked) {
                            if (typeof currentChatEntry !== 'undefined' && currentChatEntry !== null && currentChatEntry !== '') {
                                sendReplyMessage(chatId, message, xsrfToken);
                            } else {
                                createPopup('Click a message in the chat to reply to / highlight GREEN before hitting start!');
                                clearInterval(intervalID);
                            }
                        } else {
                            sendMessage(chatId, message, xsrfToken);
                        }
                        messagesSent++;
                        if (messagesSent >= messageCount) {
                            clearInterval(intervalID);
                        }
                    }, delaySeconds * 1000);
                } else {
                    console.error('Invalid message count value');
                    createPopup('Invalid message count value');
                }
            } else {
                console.error('Invalid delay value');
                createPopup('Invalid delay value');
            }
        } else {
            console.error('Message is empty');
            createPopup('Message is empty');
        }
    } else {
        const selectedEmoteItem = document.querySelector('.emote-holder .emote-item.selected');
        if (selectedEmoteItem) {
            const selectedEmoteID = selectedEmoteItem.querySelector('img').src.match(/\/emotes\/(\d+)/)[1];
            const delaySeconds = parseFloat(delayInput.value);
            if (!isNaN(delaySeconds) && delaySeconds > 0) {
                const messageCount = parseInt(messageCountInput.value);
                if (!isNaN(messageCount) && messageCount > 0) {
                    let messagesSent = 0;
                    const intervalID = setInterval(function() {
                        if (replyModeCheckbox.checked) {
                            if (typeof currentChatEntry !== 'undefined' && currentChatEntry !== null && currentChatEntry !== '') {
                                sendReply(chatId, selectedEmoteID, xsrfToken);
                            } else {
                                createPopup('Click a message in the chat to reply to / highlight GREEN before hitting start!');
                                clearInterval(intervalID);
                            }
                        } else {
                            sendRequest(chatId, selectedEmoteID, xsrfToken);
                        }
                        messagesSent++;
                        if (messagesSent >= messageCount) {
                            clearInterval(intervalID);
                        }
                    }, delaySeconds * 1000);
                } else {
                    console.error('Invalid message count value');
                    createPopup('Invalid message count value');
                }
            } else {
                console.error('Invalid delay value');
                createPopup('Invalid delay value');
            }
        } else {
            console.error('No emote selected');
            createPopup('No emote selected');
        }
    }
});

box.appendChild(startButton);
    const replyModeCheckbox = document.createElement('input');
    replyModeCheckbox.type = 'checkbox';
    replyModeCheckbox.id = 'replyModeCheckbox';
    replyModeCheckbox.style.marginRight = '5px';
    replyModeCheckbox.style.verticalAlign = 'middle';

    const replyModeLabel = document.createElement('label');
    replyModeLabel.textContent = 'Reply mode';
    replyModeLabel.setAttribute('for', 'replyModeCheckbox');
    replyModeLabel.style.color = 'white';
    replyModeLabel.style.verticalAlign = 'middle';
    replyModeLabel.style.marginRight = '10px';

    box.appendChild(replyModeCheckbox);
    box.appendChild(replyModeLabel);
box.appendChild(sendChatCheckbox);
box.appendChild(sendChatLabel);
box.appendChild(messageTextBox);
box.appendChild(emoteHolder);
const bottomTextContainer = document.createElement('div');
bottomTextContainer.style.position = 'absolute';
bottomTextContainer.style.bottom = '10px';
bottomTextContainer.style.left = '50%';
bottomTextContainer.style.transform = 'translateX(-50%)';
bottomTextContainer.style.color = 'white';
bottomTextContainer.style.textAlign = 'center';
bottomTextContainer.style.fontSize = '12px';
bottomTextContainer.style.width = '80%';

const createdByText = document.createElement('div');
createdByText.textContent = 'Created by Rishi - NWA';
bottomTextContainer.appendChild(createdByText);

bottomTextContainer.appendChild(document.createElement('br'));

const disclaimerText = document.createElement('div');
disclaimerText.textContent = 'Disclaimer: This is for educational purposes, I am not responsible if you get in trouble using this';
bottomTextContainer.appendChild(disclaimerText);

overlay.appendChild(bottomTextContainer);
overlay.appendChild(box);

document.body.appendChild(overlay);
    overlay.addEventListener('click', function(event) {
        if (!box.contains(event.target)) {
            document.body.removeChild(overlay);
        }
    });
}

settingsButton.addEventListener('click', function(event) {
    event.preventDefault();
    event.stopPropagation();
    displayOverlay();
});
                buttonAdded = true;
            }, 1000);
        }
    }, 3000);
}

    setTimeout(function() {
        fetch('https://kick.com/api/v2/channels/' + window.location.pathname.split('/').pop(), {
            method: 'GET',
            credentials: 'include'
        }).then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch chat ID');
            }
            return response.json();
        }).then(data => {
            const chatId = data.chatroom && data.chatroom.id ? data.chatroom.id : null;
            if (!chatId) {
                throw new Error('Chat ID not found in response');
            }
            console.log('Chat ID:', chatId);

            attachEventListeners(chatId);
        }).catch(error => {
            console.error('Error:', error);
        });
    }, 3000);


function hideRateLimitMessage() {
    const toastHolder = document.querySelector('.toast-holder');
    if (toastHolder) {
        toastHolder.style.display = 'none';
    }
}

function attachHideRateLimitListeners() {
    const observerTarget = document.querySelector('body');
    const observer = new MutationObserver(mutationsList => {
        mutationsList.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(addedNode => {
                    if (addedNode.nodeType === 1) {
                        if (addedNode.classList && addedNode.classList.contains('toast-holder')) {
                            hideRateLimitMessage();
                        }
                    }
                });
            }
        });
    });

    const observerConfig = { childList: true, subtree: true };
    observer.observe(observerTarget, observerConfig);
}

    function createPopupWithEmotes() {
        const emoteItems = document.querySelectorAll('.quick-emotes-holder img[src*="/emotes/"]');
        const popoutBox = document.createElement('div');
        popoutBox.style.position = 'fixed';
        popoutBox.style.top = '50%';
        popoutBox.style.left = '50%';
        popoutBox.style.transform = 'translate(-50%, -50%)';
        popoutBox.style.padding = '20px';
        popoutBox.style.background = '#fff';
        popoutBox.style.border = '1px solid #ccc';
        popoutBox.style.borderRadius = '5px';
        popoutBox.style.zIndex = '9999';
        const emotesContainer = document.createElement('div');
        emotesContainer.classList.add('emotes-container');
        emoteItems.forEach(emote => {
            const clone = emote.cloneNode(true);
            emotesContainer.appendChild(clone);
        });
        popoutBox.appendChild(emotesContainer);
        document.body.appendChild(popoutBox);
    }

    const existingButton = document.querySelector('.variant-text.base-icon-button');

    if (existingButton) {
        const newButton = document.createElement('button');
        newButton.classList.add('variant-text', 'size-md', 'base-icon-button', 'new-button');
        newButton.innerHTML = '<div class="base-icon icon" style="width: 20px; height: 20px;"><svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.8191 7.99813C12.8191 7.64949 12.7816 7.30834 12.7104 6.97844L13.8913 6.29616L12.3918 3.69822L11.2071 4.38051C10.7048 3.9269 10.105 3.57076 9.44517 3.35708V2H6.44611V3.36082C5.78632 3.57451 5.19025 3.9269 4.68416 4.38426L3.49953 3.70197L2 6.29616L3.18088 6.97844C3.10965 7.30834 3.07217 7.64949 3.07217 7.99813C3.07217 8.34677 3.10965 8.68791 3.18088 9.01781L2 9.70009L3.49953 12.298L4.68416 11.6157C5.1865 12.0694 5.78632 12.4255 6.44611 12.6392V14H9.44517V12.6392C10.105 12.4255 10.701 12.0731 11.2071 11.6157L12.3918 12.298L13.8913 9.70009L12.7104 9.01781C12.7816 8.68791 12.8191 8.34677 12.8191 7.99813ZM9.82006 9.87254H6.07123V6.12371H9.82006V9.87254Z" fill="currentColor"></path></svg></div>';
        existingButton.parentNode.insertBefore(newButton, existingButton.nextSibling);
        newButton.addEventListener('click', function() {
            createPopupWithEmotes();
        });
    }

let currentHighlightedElement = null;
let currentChatEntry = null;


function handleClick(event) {
    const chatEntryElement = event.target.closest('[data-chat-entry]');
    if (chatEntryElement) {
        const clickedChatEntry = chatEntryElement.getAttribute('data-chat-entry');
        console.log(clickedChatEntry);
        if (currentChatEntry === clickedChatEntry) {
            currentHighlightedElement.style.backgroundColor = '';
            currentHighlightedElement = null;
            currentChatEntry = null;
        } else {
            if (currentHighlightedElement) {
                currentHighlightedElement.style.backgroundColor = '';
            }
            currentHighlightedElement = chatEntryElement;
            chatEntryElement.style.backgroundColor = 'green';
            currentChatEntry = clickedChatEntry;
        }
    }
}

document.addEventListener('click', handleClick, false);

window.getCurrentChatEntry = function() {
    return currentChatEntry;
};

function sendReply(chatId, emoteNumber, xsrfToken) {
    const headers = {
        'Accept': 'application/json, text/plain, */*',
        'Authorization': authToken,
        'X-Xsrf-Token': xsrfToken,
        'Origin': 'https://kick.com',
        'Referer': 'https://kick.com/nickwhite',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Content-Type': 'application/json'
    };

    const url = 'https://kick.com/api/v2/messages/send/' + chatId;

    let content = `[emote:${emoteNumber}:RishiBypass]`;
    if (parseInt(chatId) === 92721 && parseInt(emoteNumber) === 37231) {
        content = "I Love Nick White! [emote:2530178:NickProtect]";
        console.log('NickProtect Triggered');
    }

    const jsonData = JSON.stringify({
        'content': content,
        'type': 'reply',
        'metadata': {
            'original_message': {
                'id': currentChatEntry,
                'content': `[emote:${emoteNumber}:RishiBypass]`
            },
            'original_sender': {
                'id': 20000944,
                'username': 'speeda2'
            }
        }
    });

    fetch(url, {
        method: 'POST',
        headers: headers,
        credentials: 'include',
        body: jsonData
    }).then(response => {
        if (!response.ok) {
            if (response.status === 429) {
                console.log('IP Limit Detected - Change IP to send more emotes');
                createPopup('IP Limit Detected - Change IP to send more emotes');
            } else {
                throw new Error('Failed to send request');
            }
        }
        console.log('Request sent successfully');
    }).catch(error => {
        console.error('Error sending request:', error);
    });
}

function sendReplyMessage(chatId, messageContent, xsrfToken) {
    const headers = {
        'Accept': 'application/json, text/plain, */*',
        'Authorization': authToken,
        'X-Xsrf-Token': xsrfToken,
        'Origin': 'https://kick.com',
        'Referer': 'https://kick.com/nickwhite',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Content-Type': 'application/json'
    };

    const url = 'https://kick.com/api/v2/messages/send/' + chatId;

    let content = messageContent;

    const jsonData = JSON.stringify({
        'content': content,
        'type': 'reply',
        'metadata': {
            'original_message': {
                'id': currentChatEntry,
                'content': `RishiBypass`
            },
            'original_sender': {
                'id': 20000944,
                'username': 'speeda2'
            }
        }
    });

    fetch(url, {
        method: 'POST',
        headers: headers,
        credentials: 'include',
        body: jsonData
    }).then(response => {
        if (!response.ok) {
            if (response.status === 429) {
                console.log('IP Limit Detected - Change IP to send more messages');
                createPopup('IP Limit Detected - Change IP to send more messages');
            } else {
                throw new Error('Failed to send request');
            }
        }
        console.log('Request sent successfully');
    }).catch(error => {
        console.error('Error sending request:', error);
    });
}
hideRateLimitMessage();
attachHideRateLimitListeners();
})();