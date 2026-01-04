// ==UserScript==
// @name        ChatGPT Message Logger + Injector + Submitter
// @description  Listen for postMessage from parent, log to console, enter it into the chat input, and submit
// @match        https://chatgpt.com/*
// @version 0.0.1.20251216132646
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/535809/ChatGPT%20Message%20Logger%20%2B%20Injector%20%2B%20Submitter.user.js
// @updateURL https://update.greasyfork.org/scripts/535809/ChatGPT%20Message%20Logger%20%2B%20Injector%20%2B%20Submitter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let queueArray = [];
  let cycleInProgress = false;

  window.addEventListener('message', function (event) {

    // Handle search button clicks

    if (event.data && event.data.type === 'searchButtonClicked') {
      const searchBtn1 = document.querySelector('[data-testid="composer-button-search"]');

      const searchButton2 = document.getElementById('system-hint-button');

      if (searchBtn1) {
        searchBtn1.click();
        console.log
        return;
      }

      if (searchButton2) {
        searchButton2.focus(); // Sometimes needed to simulate a real user
        searchButton2.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));

        for (const div of document.querySelectorAll('[id^="radix-"] > div > div')) {
          console.log(div);
          if (div.textContent.trim() === 'Search the web') {
            console.log('search the web button found')
            div.style.border = '2px solid red'; // highlight with a red border

            div.click();
            break;
          }
        }

      };
      return;
    }

    //handle reason

    if (event.data && event.data.type === 'reasonButtonClicked') {
      const reasonBtn1 = document.querySelector('[data-testid="composer-button-reason"]');

      const reasonButton2 = document.getElementById('system-hint-button');

      if (reasonBtn1) reasonBtn1.click();

      if (reasonButton2) {
        reasonButton2.focus(); // Sometimes needed to simulate a real user
        reasonButton2.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));

        for (const div of document.querySelectorAll('[id^="radix-"] > div > div')) {
          if (div.textContent.trim() === 'Think for longer') {
            div.click();
            break;
          }
        }

      }

      return;

    }

    //new chat

    if (event.data && event.data.type === 'newChatButtonClicked') {

      // Click the "New chat" anchor link

      const newChatLink = document.querySelector('a[aria-label="New chat"][href="/"]');

      if (newChatLink) newChatLink.click();

      if (!newChatLink) {
        window.location.href = 'https://chatgpt.com'
      }

      queueArray = [];

      cycleInProgress = false;

      return;

    }

    let chatgptCssStyleId = document.getElementById('chatgptCssStyleId');

    let chatMessageInput = document.querySelector('#thread-bottom-container');
    let chatMessageInputRule = '#thread-bottom-container {display: none !important;}';

    let header = document.querySelector('header#page-header');
    let headerRule = 'header#page-header {display: none !important;}';

    //if event data type is defaultChatMessageInputDisplay
    if (event.data?.type === 'defaultChatMessageInputDisplay') {
      console.log('default');
      if (chatMessageInput) {

        chatgptCssStyleId.innerHTML = chatgptCssStyleId.innerHTML.replace(`${chatMessageInputRule}`, '');
        chatgptCssStyleId.innerHTML = chatgptCssStyleId.innerHTML.replace(`${headerRule}`, '');

        //header.style.removeProperty('display');

        //return

        return;
      }
    }

    if (event.data?.type === 'customizeChatMessageInputDisplay') {
      console.log('customize');
      if (chatMessageInput) {

        chatgptCssStyleId.innerHTML += `${chatMessageInputRule}`
        chatgptCssStyleId.innerHTML += `${headerRule}`

        //header.style.display = 'none';

        //return

        return;
      }
    }

    //on prompt
    if (event.data.type !== 'prompt') return;

    //1 push to the array
    queueArray.push(event.data.content);
    console.log('queueArray: ' + queueArray)

    //2 define the queue function
    function queue() {
      console.log('cycleInProgress' + cycleInProgress)
      if (cycleInProgress || queueArray.length === 0) { return };
      cycleInProgress = true;


      // Locate ProseMirror composer
      const composer = document.querySelector('.ProseMirror');
      if (!composer) return;

      // Focus and inject the text
      composer.focus();

      let lines = queueArray[0].split('\n');
      let html = lines
        .map(line => `<p>${line
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')}</p>`)
        .join('');
      composer.innerHTML = html;

      composer.dispatchEvent(new InputEvent('input', { bubbles: true }));

      // Observe DOM changes until the send button is enabled
      const observer = new MutationObserver(function (mutations, obs) {
        const sendBtn = document.querySelector('[data-testid="send-button"]');
        if (sendBtn && !sendBtn.disabled) {
          obs.disconnect();
          sendBtn.click();
          console.log('queue array value shifted: ' + queueArray.shift())

          cycleInProgress = false;
          queue();

        }
      });
      observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['disabled']
      });
    }
    queue();
  });
})();