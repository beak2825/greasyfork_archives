// ==UserScript==
// @name         falcon
// @description  Listen for postMessage from parent, log to console, enter it into the chat input, and submit
// @match        https://chat.falconllm.tii.ae/*
// @version 0.0.1.20251209141918
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/536735/falcon.user.js
// @updateURL https://update.greasyfork.org/scripts/536735/falcon.meta.js
// ==/UserScript==

(function () {
  'use strict';

  window.addEventListener("message", (event) => {

    if (event.data && event.data.type === 'newChatButtonClicked') {

      // Click the "New Chat" button
      const newChatButton = document.querySelector('a[href="/"]');
      if (newChatButton) {
        newChatButton.click();
                         }
      return;
    }

if (event.data === 'reload') {
window.location.reload();
}

    let falconCssStyleId = document.getElementById('falconCssStyleId');

    let chatMessageInput = document.querySelector('div:has(> div > div > div > div > form > div > div > textarea#chat-input)');
    let chatMessageInputRule = 'div:has(> div > div > div > div > form > div > div > textarea#chat-input) {display: none !important;}';

    let header = document.querySelector('nav.sticky:has(> div > div > div > div > div[aria-label="Controls"])');
    let headerRule = 'nav.sticky:has(> div > div > div > div > div[aria-label="Controls"]) {display: none !important;}';

    //if event data type is defaultChatMessageInputDisplay
    if (event.data?.type === 'defaultChatMessageInputDisplay') {
      console.log('default');
      if (chatMessageInput) {

        falconCssStyleId.innerHTML = falconCssStyleId.innerHTML.replace(`${chatMessageInputRule}`, '');

        falconCssStyleId.innerHTML = falconCssStyleId.innerHTML.replace(`${headerRule}`, '');


        //return
        return;
      }
    }

    if (event.data?.type === 'customizeChatMessageInputDisplay') {
      console.log('customize');
      if (chatMessageInput) {

        falconCssStyleId.innerHTML += `${chatMessageInputRule}`
        falconCssStyleId.innerHTML += `${headerRule}`


        //return
        return;
      }
    }

    if (event.data?.type === "prompt") {
  const input = document.getElementById("chat-input");
  const button = document.getElementById("send-message-button");

  // Set the textarea value
  input.value = event.data.content;

  // Fire an input event so React updates state
  input.dispatchEvent(new Event("input", { bubbles: true }));

  const observer = new MutationObserver(() => {
    if (!button.hasAttribute("disabled")) {
      button.click();
      observer.disconnect();
    }
  });

  observer.observe(button, { attributes: true, attributeFilter: ["disabled"] });
}

  });
})();