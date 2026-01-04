// ==UserScript==
// @name         allenai paste
// @description  a
// @match        https://playground.allenai.org/*
// @version 0.0.1.20251125073424
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/535679/allenai%20paste.user.js
// @updateURL https://update.greasyfork.org/scripts/535679/allenai%20paste.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let queueArray = [];
  let cycleInProgress = false;

  function setNativeValue(element, value) {
    const lastValue = element.value;
    element.value = value;
    const tracker = element._valueTracker;
    if (tracker) {
      tracker.setValue(lastValue);
    }
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }

  window.addEventListener('message', event => {

    if (event.data?.type === 'newChatButtonClicked') {
      const newChatLink = document.querySelector('a[aria-label="Create a new thread"]');
      if (newChatLink) {
        newChatLink.click();
      }
      return;
    }

    //hide shit
    //inline properties get swept away
    //need properties to be set in style element

    let allenAiCssStyleId = document.getElementById('allenAiCssStyleId');

    let chatMessageInput = document.querySelector('div:has(> div > div > div > form > div > div > div > div > textarea[name=\'content\'])');

    let header = document.querySelector('header');
    let termsParagraph = document.querySelector('div:has(> p > a[href="https://allenai.org/terms"])');
    let termsParagraphRule = 'div:has(> p > a[href="https://allenai.org/terms"]) {display: none !important;}';

    let termsHr = document.querySelector('div:has(> p > a[href="https://allenai.org/terms"]) + hr');
    let termsHrRule = 'div:has(> p > a[href="https://allenai.org/terms"]) + hr {display: none !important;}';

    let modelSelector = document.querySelector('div:has(> div > div > svg > path[d="M7 10l5 5 5-5z"])');
    //if event data type is defaultChatMessageInputDisplay
    if (event.data?.type === 'defaultChatMessageInputDisplay') {
      console.log('default');
      if (chatMessageInput) {

        //delete the rules here
        chatMessageInput.style.removeProperty('display');
        header.style.removeProperty('display');

        allenAiCssStyleId.innerHTML = allenAiCssStyleId.innerHTML.replace(`${termsParagraphRule}`, '');
        allenAiCssStyleId.innerHTML = allenAiCssStyleId.innerHTML.replace(`${termsHrRule}`, '');

        //termsHr.style.removeProperty('display');
        modelSelector.style.removeProperty('display');

        //return
        return;
      }
    }

    if (event.data?.type === 'customizeChatMessageInputDisplay') {
      console.log('customize');
      if (chatMessageInput) {

        //add the rules here
        chatMessageInput.style.display = 'none';
        header.style.display = 'none';

        allenAiCssStyleId.innerHTML += `${termsParagraphRule}`
        allenAiCssStyleId.innerHTML += `${termsHrRule}`

        //termsHr.style.display = 'none';
        modelSelector.style.display = 'none';

        //return
        return;
      }
    }

    if (event.data.type !== 'prompt' || event.data.content === 'recaptcha-setup') return;

    let message = event.data.content;

    //add message to queue array
    queueArray.push(message);

    //show queue array in console
    console.log(queueArray);

    function queue() {

      //in fact, we should not even look for the textarea for 2 unless 1 full cyucle has finished

      //this means that we have to wait for 1 full cycle before going further
      //we should set a flag somewhere that should say that 1 full cycle has finished

      //if there's a cycle already in progress then return, as the function will activate the queue function on its own

      //if there are no items in the queue left, then return as there's no need to run the queue function
      if (cycleInProgress || queueArray.length === 0) { return };

      //tell everyone that the cycle is in progress
      cycleInProgress = true;

      //find the textarea
      const textarea = document.querySelector(
        'textarea[name="content"], textarea[aria-label="Message OLMo"]'
      );
      if (!textarea) return;

      //set the value of the textarea for react
      setNativeValue(textarea, queueArray[0]);

      const sendButton = document.querySelector('button[aria-label="Submit prompt"]');

      if (sendButton) {

        //send the text
        sendButton.click();
        console.log(queueArray[0] + 'clicked the send button and found the button with aria label submit promtp')

        //observe document.body and subtree aria labels
        let observer = new MutationObserver(function (mutationRecordArray) {
          //for each mutation
          mutationRecordArray.forEach(function (mutationRecord) {
            console.log(mutationRecord.oldValue);
            if (mutationRecord.oldValue === 'Stop response generation') {
              //disconect the observer since the cycle has finished and a response has been generated
              observer.disconnect();
              //as the response has completed lets remove the first value in the queue which we presumably just got a
              //response for
              console.log(queueArray.shift())
              //lets indicate theat the cycle has ended
              cycleInProgress = false;
              //lets call the queue function again to see if there are more items in the queue array
              queue();
            }
          })
        })
        observer.observe(document.body, { subtree: true, attributeFilter: ["aria-label"], attributeOldValue: true })
      }
    }

    //call the queue function to activate it if it's not activated already
    queue();
  });
})();