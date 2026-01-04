// ==UserScript==
// @name          ChatGPT automatic JavaScript executor
// @description   Automatically execute JavaScript that ChatGPT generates using eval() and feed results back to ChatGPT
// @author        Tom
// @namespace     Dummyuniquenamespace.abc
// @version       1.0
// @license       MIT
// @match         *://chatgpt.com/*
// @match         *://chat.openai.com/*
// @icon          https://cdn.jsdelivr.net/gh/KudoAI/chatgpt.js@2.9.3/starters/greasemonkey/media/images/icons/robot/icon48.png
// @icon64        https://cdn.jsdelivr.net/gh/KudoAI/chatgpt.js@2.9.3/starters/greasemonkey/media/images/icons/robot/icon64.png
// @require       https://cdn.jsdelivr.net/npm/@kudoai/chatgpt.js@2.9.3/dist/chatgpt.min.js
// @grant         GM_getValue
// @grant         GM_setValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/498635/ChatGPT%20automatic%20JavaScript%20executor.user.js
// @updateURL https://update.greasyfork.org/scripts/498635/ChatGPT%20automatic%20JavaScript%20executor.meta.js
// ==/UserScript==

// NOTE: This script relies on the powerful chatgpt.js library @ https://chatgpt.js.org © 2023–2024 KudoAI & contributors under the MIT license


/*

I am a chrome extension running inside the users browser.  I am going to give you instructions in plain English (which will start with the word INSTRUCTION) that explain a task the user is trying to achieve.  You are allowed to give me a JavaScript code block to execute in the browser console that will allow you to achieve that task.  Each time you provide a JavaScript command I will execute it and provide a reply starting with the word RESULT followed by the contents of the `code_output` variable.  If your code generates an exception then I will provide you with a reply starting with the word ERROR followed by the stacktrace.  If you want to know the result of running the code you should make sure the code sets the value of `code_output` directly without using the const, var or let keywords.  You can also ask the user clarification questions and provide them with English outputs (which could also contain markup) at appropriate moments, for example when you are finished with your task. If you want me to run Javascript code, start your response with the word EXECUTE and provide a single block of Javascript afterwards. If you want me to ask the user a question or provide them an output then start your response with the word USER.

Code you provide starting with EXECUTE should aim to complete a step of your goal.  As you will be provided with the `code_output` variable value, you don't need to plan all the steps required in one go, you can create the next step based on the output of the first step.  For example if the user wanted you to use Gmail to send an email to someone, your first step might be to open the Gmail tab and then search their previous emails to see if they have received an email from that named person before so you can get their email address.  When the Javascript executes, and you are provided with the results, your next step might be different depending on the results, for example if the name was not found you might ask the user for the email address, or ask where you might find it.

Once you reply I will execute the code and check for the value of the `code_output` variable to give back to you immediately.  If your code executes asynchronously and you want me to wait a certain number of milliseconds before checking the value of `code_output` and responding then please put the number of milliseconds to wait directly after the EXECUTE keyword in your response e.g. EXECUTE 10000.

Once you believe you have accomplished the task you can provide a response that starts with the word COMPLETED and then describes the results.

As you complete more tasks you will build up knowledge of the user's favourite websites and tools (for example the fact they use Gmail for their email), but if you don't know what website to use, you can ask the user.  You can use the `gpt_knowledge` key of the localStorage javascript property to store these in a data structure.  If you want to know the contents of localStorage to know what knowledge is contained within it, you can simply ask me to run a javascript block containing a call localStorage.getItem(‘gpt_knowledge’) and ensure your code stores the results of this call in the `code_output` variable.

INSTRUCTION

Calculate the approximate value of Pi.


*/

(async () => {

    // Init config
    const config = { prefix: 'chatgptScript' };
    loadSetting('skipAlert');

    // Print chatgpt.js methods
    //await chatgpt.isLoaded(); chatgpt.printAllFunctions(); // to console

    // Show alert
    if (!config.skipAlert) {
        chatgpt.alert('≫ ChatGPT script loaded! 🚀', // title
            'Success! Press Ctrl+Shift+' // msg
                + ( navigator.userAgent.indexOf('Firefox') > -1 ? 'K' : 'J' )
                + ' to view all chatgpt.js functions.',
            function getHelp() { // button
                window.open('https://github.kudoai.com/chatgpt.js-greasemonkey-starter/issues', '_blank', 'noopener'); },
            function dontShowAgain() { // checkbox
                saveSetting('skipAlert', !config.skipAlert); });
    }

    let pastResponses = new Set();

    function waitForMilliseconds(milliseconds) {
      return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    async function sendReply(reply) {
      await setTimeout(() => {
        chatgpt.send(reply)
      }, 500)
      setTimeout(() => {
        if (!chatgpt.getSendButton().disabled) {
          chatgpt.getSendButton().click();
        }
      }, 1000);
    }

    function processLastResponse() {
      if (chatgpt.isIdle()) {
        (async () => {
          let response = await chatgpt.getLastResponse();
          if (response.length > 1) {
            if (!pastResponses.has(response)) {

              // It is a real response and we haven't already processed it
              console.log('---RESPONSE---' + Date.now());
              console.log(response);
              console.log('--------------');
              pastResponses.add(response);

              // If it contains code, execute it and give chatgpt the results
              if (response.startsWith('EXECUTE')) {
                let next_prompt = '';
                let scriptCode = chatgpt.code.extract(response);
                let delay = 0;

                const regexPattern = /^EXECUTE\s(\d+)/;

                const matchResult = response.match(regexPattern);

                if (matchResult && matchResult[1]) {
                    delay = parseInt(matchResult[1], 10);
                    console.log('---DELAY DETECTED--- ' + delay + ' - ' + Date.now());
                }

                if (scriptCode.length > 1 && response.toLowerCase().includes('```javascript')) {
                  console.log('---EXECUTING CODE---' + Date.now());
                  console.log(scriptCode);
                  console.log('--------------------');

                  try {
                    let code_output = 'Your code does not set the value of the code_output variable correctly.';
                    eval(scriptCode);
                    await waitForMilliseconds(delay);
                    next_prompt = "RESULT " + code_output;

                  } catch (error) {
                    next_prompt = "ERROR " + error.stack;
                  }
                } else {
                  next_prompt = "Sorry that response did not contain any javascript code.  Either try again or start your next response with USER so I can reply."
                }

                console.log('---SENDING RESULTS TO CHATGPT---' + Date.now());
                console.log(next_prompt);
                console.log('--------------------------------');
                sendReply(next_prompt);

              } else if (response.includes('EXECUTE')) {
                sendReply('Sorry if you want me to execute code your response must start with the word EXECUTE.  Do not combine USER and EXECUTE together in one response')
              }
            }
          }
        })();
      }
    }

    // Create a MutationObserver to watch for changes to the button's content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          console.log("---BUTTON STATE CHANGE DETECTED---" + Date.now())
          processLastResponse();
        }
      });
    });


    chatgpt.isLoaded().then(() => {
      const button = chatgpt.getSendButton();
      observer.observe(button, { childList: true });
      console.log("---OBSERVER ACTIVE---" + Date.now());
    })



    // Define HELPER functions
    function loadSetting(...keys) { keys.forEach(key => { config[key] = GM_getValue(config.prefix + '_' + key, false); });}
    function saveSetting(key, value) { GM_setValue(config.prefix + '_' + key, value); config[key] = value; }

})();