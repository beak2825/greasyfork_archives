// ==UserScript==
// @name        DeepSeek paste
// @description  a
// @match       https://chat.deepseek.com/*
// @version 0.0.1.20251127140117
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/535677/DeepSeek%20paste.user.js
// @updateURL https://update.greasyfork.org/scripts/535677/DeepSeek%20paste.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let queueArray = [];
  let cycleInProgress = false;

  // Cache the native setter for HTMLTextAreaElement.value
  const valueSetter = Object.getOwnPropertyDescriptor(
    HTMLTextAreaElement.prototype, 'value'
  ).set;

  window.addEventListener('message', event => {

    // find all primary filled buttons
    const buttons = document.querySelectorAll(
      'div[role="button"].ds-button--primary.ds-button--filled'
    );

    if (event.data && event.data.type === 'searchButtonClicked') {

      // click the one whose visible label is “Search”
      for (const btn of buttons) {
        if (btn.textContent.trim() === 'Search') {
          btn.click();
          break;
        }
      }
      return;
    }

    if (event.data && event.data.type === 'reasonButtonClicked') {

      // click the one whose visible label is “DeepThink (R1)”
      for (const btn of buttons) {
        if (btn.textContent.trim() === 'DeepThink (R1)') {
          btn.click();
          break;
        }
      }
      return;
    }

    //new chat
    if (event.data?.type === 'newChatButtonClicked') {
      document.querySelector('svg path[d*="M10 1.22943C5.15604"]').closest('div').click();
      queueArray = [];
      cycleInProgress = false;
      return;
    }

    //toggle display of distractions

    let deepseekCssStyleId = document.getElementById('deepseekCssStyleId');

    let chatMessageInput = document.querySelector('div:has(> div > div > div > div > textarea[placeholder="Message DeepSeek"])');
    let chatMessageInputRule = 'div:has(> div > div > div > div > textarea[placeholder="Message DeepSeek"]) {display: none !important;}';

    let header = document.querySelector('div:has( > div > div[role=\'button\'] > div.ds-icon > svg > path[d*=\'M17.2027 4.90036V6.43657H2.\'])');
    let headerRule = 'div:has( > div > div[role=\'button\'] > div.ds-icon > svg > path[d*=\'M17.2027 4.90036V6.43657H2.\']) {display: none !important;}';

    //if event data type is defaultChatMessageInputDisplay
    if (event.data?.type === 'defaultChatMessageInputDisplay') {
      if (chatMessageInput) {
        console.log('default');

        deepseekCssStyleId.innerHTML = deepseekCssStyleId.innerHTML.replace(`${chatMessageInputRule}`, '');

        deepseekCssStyleId.innerHTML = deepseekCssStyleId.innerHTML.replace(`${headerRule}`, '');


        //return
        return;
      }
    }

    if (event.data?.type === 'customizeChatMessageInputDisplay') {
      console.log('customize');
      if (chatMessageInput) {

        deepseekCssStyleId.innerHTML += `${chatMessageInputRule}`
        deepseekCssStyleId.innerHTML += `${headerRule}`


        //return
        return;
      }
    }

    //on prompt
    if (event.data.type !== 'prompt') return;

    queueArray.push(event.data.content);
    console.log(queueArray);

    function queue() {

      //if theres a cycle in progress return
      //if theres nothing in the queue return
      console.log('cycleInProgress: ' + cycleInProgress)
      if (cycleInProgress || queueArray.length === 0) { return };

      //start the cycle
      cycleInProgress = true;
      console.log('cycle started');
      //locate the textarea
      const textarea = document.querySelector('textarea[placeholder="Message DeepSeek"]');
      //if theres no text area return
      if (!textarea) return;
      //inject the text
      // 1. Update both DOM and React state without shifting focus
      valueSetter.call(textarea, queueArray[0]);

      // 2. Notify React/Vue/etc. of the change
      textarea.dispatchEvent(new InputEvent('input', { bubbles: true }));

      //send the text
      const sendBtn = document.querySelector('div[role="button"][aria-disabled="false"]:has(> div.ds-icon > svg > path[d*="M8.3125"])');

      console.log(sendBtn);

      if (sendBtn) {
        sendBtn.click();
        console.log('button found')
      }
      //now wait for the stop button to disappear
      //create an observer
      //let the function take the mutation record array as a parameter / argument
      //and define the function
      let observer = new MutationObserver(function (mutationRecordArray) {
        //for each mutation
        mutationRecordArray.forEach(function (mutationRecord) {
          console.log('mutation record old value: ', mutationRecord.oldValue);
          console.log('mutation record: ', mutationRecord);
          console.log('mutation record target: ', mutationRecord.target);

          if (mutationRecord.oldValue === 'false' && mutationRecord.target.matches('div[role="button"][aria-disabled="true"]:has(> div.ds-icon > svg)')) {

            //if (mutationRecord.oldValue === 'true') {
            console.log('button with true aria disabled has been removed');
            //disconect the observer since the cycle has finished and a response has been generated
            observer.disconnect();
            //as the response has completed lets remove the first value in the queue which we presumably just got a
            //response for
            console.log(queueArray.shift())
            //lets indicate theat the cycle has ended
            cycleInProgress = false;
            //lets call the queue function again to see if there are more items in the queue array
            queue();
          };
        })
      })
      //observe aria disabled attribute
      observer.observe(document.body, { subtree: true, attributeFilter: ["aria-disabled"], attributeOldValue: true })
    }
    queue();
  });
})();