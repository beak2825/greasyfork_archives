// ==UserScript==
// @name         stepfun Paste
// @description  a
// @match        *://stepfun.ai/*
// @version 0.0.1.20250821064001
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/544680/stepfun%20Paste.user.js
// @updateURL https://update.greasyfork.org/scripts/544680/stepfun%20Paste.meta.js
// ==/UserScript==

(function () {
  'use strict';

  window.addEventListener("message", event => {
    const data = event.data;

    if (event.data?.type === 'newChatButtonClicked') {
      const customNewChatButton = document.querySelector('button:has(> svg.custom-icon-newtopic-outline > path[d^="M24 6.5C14.2576 6.5"])');
      if (customNewChatButton) customNewChatButton.click();
    }

    let stepfunCssStyleId = document.getElementById('stepfunCssStyleId');

    let chatMessageInput = document.querySelector('div:has(> div > div > div > div > div > div > textarea[class*="Publisher_textarea"])');
    let chatMessageInputRule = 'div:has(> div > div > div > div > div > div > textarea[class*="Publisher_textarea"]) {display: none !important;}';

    let suggestionDiv = document.querySelector('div:has(> div > div > button > div > svg.custom-icon-image-edit-new-outline)');
    let suggestionDivRule = 'div:has(> div > div > button > div > svg.custom-icon-image-edit-new-outline) {display: none !important;}';

    let newChatSuggestionDivRule = 'div:has(> div > button > div > svg.custom-icon-img-outline > path[d*="M4.5 12C4.5 7.85787"]) {display: none !important;}';

    let header = document.querySelector('header');
    let headerRule = 'header {display: none !important;}';
    //if event data type is defaultChatMessageInputDisplay
    if (event.data?.type === 'defaultChatMessageInputDisplay') {
      console.log('default');
      if (chatMessageInput) {

        stepfunCssStyleId.innerHTML = stepfunCssStyleId.innerHTML.replace(`${chatMessageInputRule}`, '');
        stepfunCssStyleId.innerHTML = stepfunCssStyleId.innerHTML.replace(`${suggestionDivRule}`, '');
        stepfunCssStyleId.innerHTML = stepfunCssStyleId.innerHTML.replace(`${newChatSuggestionDivRule}`, '');
        stepfunCssStyleId.innerHTML = stepfunCssStyleId.innerHTML.replace(`${headerRule}`, '');

        //return
        return;
      }
    }

    if (event.data?.type === 'customizeChatMessageInputDisplay') {
      console.log('customize');
      if (chatMessageInput) {

        stepfunCssStyleId.innerHTML += `${chatMessageInputRule}`
        stepfunCssStyleId.innerHTML += `${suggestionDivRule}`
        stepfunCssStyleId.innerHTML += `${newChatSuggestionDivRule}`
        stepfunCssStyleId.innerHTML += `${headerRule}`

        //return
        return;
      }
    }

    if (event.data.type === "prompt" && event.data.content.trim()) {
      const textarea = document.querySelector('textarea[class*="Publisher_textarea"]');
      if (textarea) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        nativeInputValueSetter.call(textarea, event.data.content); // Set like the browser would

        // Now trigger a React-compatible InputEvent
        const inputEvent = new InputEvent('input', {
          bubbles: true,
          cancelable: true,
          inputType: 'insertText',
          data: event.data.content,
        });

        textarea.dispatchEvent(inputEvent);

        const sendButton = document.querySelector('button:has(> svg.custom-icon-send-outline > path[d^="M25.4874 10.6629C25.1081"])');
        if (!sendButton.classList.contains('cursor-not-allowed')) {
          sendButton.click();
        } else {
          const observer = new MutationObserver(() => {
            if (!sendButton.classList.contains('cursor-not-allowed')) {
              observer.disconnect();
              sendButton.click();
            }
          });
          observer.observe(sendButton, { attributes: true, attributeFilter: ['class'] });
        }
      }
    }
  });
})();