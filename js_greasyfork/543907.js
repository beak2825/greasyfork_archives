// ==UserScript==
// @name         z Paste
// @description  Paste text into z textarea from main page
// @match        *://chat.z.ai/*
// @version 0.0.1.20251112123007
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/543907/z%20Paste.user.js
// @updateURL https://update.greasyfork.org/scripts/543907/z%20Paste.meta.js
// ==/UserScript==

(function () {
  'use strict';

  window.addEventListener("message", event => {
    const data = event.data;

    if (event.data === 'reload') {
      window.location.reload();
    }

    if (event.data?.type === 'newChatButtonClicked') {
      const customNewChatButton = document.querySelector('#new-chat-button');
      if (customNewChatButton) customNewChatButton.click();
    }

    let zCssStyleId = document.getElementById('zCssStyleId');

    let chatMessageInput = document.querySelector('div:has(> div > div > div > div > form > div > div > textarea[id="chat-input"])');
    let chatMessageInputRule = 'div:has(> div > div > div > div > form > div > div > textarea[id="chat-input"]) {display: none !important;}';

    let header = document.querySelector('nav.sticky:has(> div > div > div > div > div > button#sidebar-toggle-button)');
    let headerRule = 'nav.sticky:has(> div > div > div > div > div > button#sidebar-toggle-button) {display: none !important;}';
    //if event data type is defaultChatMessageInputDisplay
    if (event.data?.type === 'defaultChatMessageInputDisplay') {
      console.log('default');
      if (chatMessageInput) {

        zCssStyleId.innerHTML = zCssStyleId.innerHTML.replace(`${chatMessageInputRule}`, '');

        zCssStyleId.innerHTML = zCssStyleId.innerHTML.replace(`${headerRule}`, '');

        //header.style.removeProperty('display');

        //return
        return;
      }
    }

    if (event.data?.type === 'customizeChatMessageInputDisplay') {
      console.log('customize');
      if (chatMessageInput) {

        zCssStyleId.innerHTML += `${chatMessageInputRule}`
        zCssStyleId.innerHTML += `${headerRule}`

        //header.style.display = 'none';


        //return
        return;
      }
    }

    if (event.data.type === "prompt" && event.data.content.trim()) {
      const textarea = document.querySelector('textarea[id="chat-input"]');
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

        const sendButton = document.querySelector('button[id="send-message-button"]');
        if (!sendButton.hasAttribute('disabled')) {
          sendButton.click();
        } else {
          const observer = new MutationObserver(() => {
            if (!sendButton.disabled) {
              observer.disconnect();
              sendButton.click();
            }
          });
          observer.observe(sendButton, { attributes: true, attributeFilter: ['disabled'] });
        }
      }
    }
  });
})();