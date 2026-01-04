// ==UserScript==
// @name         Mistral paste
// @description  Inject prompt into Mistral's contenteditable div
// @match        https://chat.mistral.ai/*
// @run-at       document-idle
// @version 0.0.1.20251113091202
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/536636/Mistral%20paste.user.js
// @updateURL https://update.greasyfork.org/scripts/536636/Mistral%20paste.meta.js
// ==/UserScript==

(function () {
  window.addEventListener('message', event => {

    if (event.data?.type === 'newChatButtonClicked') {
      document.querySelector('a[href="/chat"]')?.click();
      return;
    }

    if (event.data === 'reload') {
      window.location.reload();
    }

    let mistralCssStyleId = document.getElementById('mistralCssStyleId');

    let chatMessageInput = document.querySelector('div:has(> form > div > div > div > div > div > div > div > div[contenteditable])');
    let chatMessageInputRule = 'div:has(> div > form > div > div > div > div > div > div > div > div[contenteditable]) {display: none !important;}';

    //let header = document.querySelector('div:has(> div > button > svg > path[d="M9 3v18"])');
    let headerRule = 'div:has(> div > button > svg > path[d="M9 3v18"]) {display: none !important;}';
    //if event data type is defaultChatMessageInputDisplay
    if (event.data?.type === 'defaultChatMessageInputDisplay') {
      console.log('default');
      if (chatMessageInput) {

        mistralCssStyleId.innerHTML = mistralCssStyleId.innerHTML.replace(`${chatMessageInputRule}`, '');
        mistralCssStyleId.innerHTML = mistralCssStyleId.innerHTML.replace(`${headerRule}`, '');

        //return
        return;
      }
    }

    if (event.data?.type === 'customizeChatMessageInputDisplay') {
      console.log('customize');
      if (chatMessageInput) {

        mistralCssStyleId.innerHTML += `${chatMessageInputRule}`
        mistralCssStyleId.innerHTML += `${headerRule}`

        //return
        return;
      }
    }

    if (event.data.type === "prompt" && event.data.content.trim()) {
      const editor = document.querySelector('[contenteditable="true"].ProseMirror');
      if (editor) {
        // Focus the editor first
        editor.focus();

        // Create a new text node with the prompt
        const textNode = document.createTextNode(event.data.content);

        // Remove any existing children
        while (editor.firstChild) {
          editor.removeChild(editor.firstChild);
        }

        // Append a paragraph <p> with the text content
        const p = document.createElement('p');
        p.appendChild(textNode);
        editor.appendChild(p);

        // Manually dispatch an input event to trigger updates
        const inputEvent = new Event('input', { bubbles: true });
        editor.dispatchEvent(inputEvent);

        // submit
        // Select the submit button
        const submitButton = document.querySelector('button[type="submit"][aria-disabled="false"]');

        // If the button exists initially, click it
        if (submitButton) {
          submitButton.click();
        } else {
          // Create a MutationObserver to detect when the specific button appears in the DOM
          const mutationObserver = new MutationObserver((mutationsList, observer) => {
            // Look for the specific submit button by matching both the button type and aria-disabled attributes
            const newSubmitButton = document.querySelector('button[type="submit"][aria-disabled="false"]');

            if (newSubmitButton) {
              // If the button is found, click it and disconnect the observer
              newSubmitButton.click();
              observer.disconnect();  // Disconnect the observer after it's done
            }
          });

          // Start observing the document for changes to add the specific button
          mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
          });
        }
      }
    }
  });
})();