// ==UserScript==
// @name         Drawaria.online Ignore by Users
// @version      2025-05-14
// @description  Drawaria.online IgnoredUser
// @author       Mr Robot
// @match        https://drawaria.online/*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/536113/Drawariaonline%20Ignore%20by%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/536113/Drawariaonline%20Ignore%20by%20Users.meta.js
// ==/UserScript==

(function () {
  'use strict';

   //12/05/2025, 20:01:15 (Updated Fixes and Improvements)

  function toggleElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.style.display = element.style.display === 'none' ? 'block' : 'none';
    } else {
      console.warn(`Element not found: ${selector}`);
    }
  }

  const leftBar = document.querySelector('#leftbar');
  const chatBox = document.querySelector('#chatbox_messages');

  if (leftBar) leftBar.style.display = 'block';
  if (chatBox) chatBox.style.display = 'block';

  const target = document.querySelector('#extmenu > div > div > div');
  if (target) {
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'btn btn-outline-info btn-block mb-3 extmenu-button';
    toggleBtn.dataset.action = 'toggle';
    toggleBtn.textContent = 'Ignore by users';

    toggleBtn.addEventListener('click', function () {
      toggleElement('#leftbar > div');
      toggleElement('#chatbox_messages');
    });

    target.appendChild(toggleBtn);
  } else {
    console.error('Target element for button not found.');
  }

  if (typeof jQuery !== 'undefined') {
    console.log('jQuery detected, enhancing toggling with jQuery.');

    $(document).on('click', '.extmenu-button', function () {
      $('#leftbar > div, #chatbox_messages').each(function () {
        const el = $(this);
        el.css('display', el.css('display') === 'none' ? 'block' : 'none');
      });
    });
  } else {
    console.warn('jQuery is not loaded. Using vanilla JavaScript for toggling.');
  }

  if (chatBox) {
    const observerConfig = { childList: true, subtree: true };
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        console.log('Mutation detected in #chatbox_messages:', {
          type: mutation.type,
          addedNodes: mutation.addedNodes,
          removedNodes: mutation.removedNodes,
        });
      });
    });

    observer.observe(chatBox, observerConfig);
    console.log('MutationObserver is now observing #chatbox_messages for changes.');
  } else {
    console.warn('#chatbox_messages element not found. MutationObserver not initialized.');
  }
})();