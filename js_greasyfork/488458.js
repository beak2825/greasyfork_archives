// ==UserScript==
// @name         Fix Home, End, Page Up and Page Down keys for Superpower ChatGPT and OpenAI broken chats
// @description  For some Superpower ChatGPT and OpenAI chats the Home, End, Page Up and Page Down keys stop working, this script fixes the problem
// @author       NWP
// @namespace    https://greasyfork.org/users/877912
// @version      0.6
// @license      MIT
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488458/Fix%20Home%2C%20End%2C%20Page%20Up%20and%20Page%20Down%20keys%20for%20Superpower%20ChatGPT%20and%20OpenAI%20broken%20chats.user.js
// @updateURL https://update.greasyfork.org/scripts/488458/Fix%20Home%2C%20End%2C%20Page%20Up%20and%20Page%20Down%20keys%20for%20Superpower%20ChatGPT%20and%20OpenAI%20broken%20chats.meta.js
// ==/UserScript==

(function () {
  'use strict';
  
  document.addEventListener('keydown', function (event) {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      return;
    }

    const scrollableContainer = Array.from(document.querySelectorAll('div')).find(div => /^react-scroll-to-bottom--css-\S+$/.test(div.className)) || // OpenAI
                                document.querySelector('#conversation-inner-div'); // Superpower ChatGPT

    if (!scrollableContainer) {
      console.error("No scrollable container found.");
      return;
    }

    switch (event.key) {
      case 'Home':
      case 'End':
        scrollToEnds(event, scrollableContainer);
        break;
      case 'PageUp':
      case 'PageDown':
        scrollByPage(event, scrollableContainer);
        break;
    }
  });

  function scrollToEnds(event, container) {
    event.preventDefault();
    const position = event.key === 'Home' ? 0 : container.scrollHeight;
    container.scrollTo({ top: position, behavior: 'instant' });
  }

  function scrollByPage(event, container) {
    event.preventDefault();
    const amount = event.key === 'PageUp' ? -container.clientHeight * 0.75 : container.clientHeight * 0.75;
    container.scrollBy({ top: amount, behavior: 'instant' });
  }
})();
