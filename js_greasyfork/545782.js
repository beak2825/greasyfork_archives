// ==UserScript==
// @name         Gemini Conversation Navigator
// @namespace    https://greasyfork.org
// @version      1.0
// @description  Displays a floating container on the right with every message you sent in the current Gemini conversation
// @author       Bui Quoc Dung
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545782/Gemini%20Conversation%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/545782/Gemini%20Conversation%20Navigator.meta.js
// ==/UserScript==

(function () {
  'use strict';

const moveLeftStyle = `
  body.navigator-expanded .chat-history-scroll-container {
    margin-left: 0 !important;
    margin-right: 300px !important;
    max-width: calc(100% - 300px) !important;
    transition: margin-right 0.3s ease;
  }
`;
  GM_addStyle(moveLeftStyle);

  let userMsgCounter = 0;

  function updateBodyClassForLayout() {
    const container = document.getElementById('gemini-message-nav');
    const content = document.getElementById('gemini-message-nav-content');
    if (container && container.style.display !== 'none' && content && content.style.display !== 'none') {
      document.body.classList.add('navigator-expanded');
    } else {
      document.body.classList.remove('navigator-expanded');
    }
  }

  function createContainer() {
    let container = document.getElementById('gemini-message-nav');
    if (!container) {
      container = document.createElement('div');
      container.id = 'gemini-message-nav';
      container.style.position = 'fixed';
      container.style.top = '55px';
      container.style.right = '20px';
      container.style.width = '250px';
      container.style.maxHeight = '90vh';
      container.style.overflowY = 'auto';
      container.style.background = '#fff';
      container.style.color = '#000';
      container.style.borderRadius = '5px';
      container.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.3)';
      container.style.fontSize = '14px';
      container.style.fontFamily = 'Calibri, sans-serif';
      container.style.zIndex = '9999';
      container.style.transition = 'width 0.3s, padding 0.3s';

      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.alignItems = 'center';
      header.style.padding = '5px';
      header.style.cursor = 'pointer';
      header.style.fontWeight = 'bold';
      header.textContent = 'Your Prompts';

      const toggleBtn = document.createElement('button');
      toggleBtn.textContent = '⯈';
      toggleBtn.style.background = 'none';
      toggleBtn.style.border = 'none';
      toggleBtn.style.cursor = 'pointer';
      toggleBtn.style.fontSize = '16px';
      header.appendChild(toggleBtn);

      const content = document.createElement('div');
      content.id = 'gemini-message-nav-content';
      content.style.padding = '5px';

      container.appendChild(header);
      container.appendChild(content);
      document.body.appendChild(container);

      const collapsed = GM_getValue('geminiMessageNavCollapsed', false);
      if (collapsed) {
        content.style.display = 'none';
        container.style.width = '130px';
        toggleBtn.textContent = '⯆';
      }

      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (content.style.display === 'none') {
          content.style.display = 'block';
          container.style.width = '250px';
          toggleBtn.textContent = '⯈';
          GM_setValue('geminiMessageNavCollapsed', false);
        } else {
          content.style.display = 'none';
          container.style.width = '130px';
          toggleBtn.textContent = '⯆';
          GM_setValue('geminiMessageNavCollapsed', true);
        }
        updateBodyClassForLayout();
      });

      updateBodyClassForLayout();
    }
    return container;
  }

  function assignIdToMessage(msgElem) {
    if (!msgElem.id) {
      userMsgCounter++;
      msgElem.id = 'user-msg-' + userMsgCounter;
      msgElem.dataset.index = userMsgCounter;
    }
  }

  function createListItem(msgElem) {
    const index = msgElem.dataset.index || '?';
    const text = msgElem.innerText.trim();
    const preview = text.length > 80 ? text.slice(0, 80) + '...' : text;

    const listItem = document.createElement('li');
    listItem.textContent = `${index}. ${preview}`;
    listItem.style.cursor = 'pointer';
    listItem.style.padding = '5px 10px';
    listItem.style.borderBottom = '1px solid #ccc';
    listItem.addEventListener('mouseenter', () => listItem.style.background = '#eee');
    listItem.addEventListener('mouseleave', () => listItem.style.background = 'transparent');

    listItem.addEventListener('click', () => {
      msgElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return listItem;
  }

  function updateMessageList() {
    const container = createContainer();
    const content = document.getElementById('gemini-message-nav-content');
    if (!content) return;

    let list = content.querySelector('ul');
    if (!list) {
      list = document.createElement('ul');
      list.style.padding = '0';
      list.style.margin = '0';
      list.style.listStyle = 'none';
      content.appendChild(list);
    }

    const userMessages = document.querySelectorAll('user-query span.user-query-bubble-with-background');
    const existingListItems = list.querySelectorAll('li');

    if (userMessages.length < existingListItems.length) {
      list.innerHTML = '';
    }

    if (userMessages.length > existingListItems.length) {
      for (let i = existingListItems.length; i < userMessages.length; i++) {
        const msgElem = userMessages[i];
        assignIdToMessage(msgElem);
        const listItem = createListItem(msgElem);
        list.appendChild(listItem);
      }
    }
  }

  function observeConversation() {
    const mainElem = document.querySelector('main');
    if (!mainElem) return;
    new MutationObserver(() => updateMessageList())
      .observe(mainElem, { childList: true, subtree: true });
  }

  function waitForChatToLoad() {
    const interval = setInterval(() => {
      const mainElem = document.querySelector('main');
      if (mainElem && document.querySelector('user-query span.user-query-bubble-with-background')) {
        clearInterval(interval);
        userMsgCounter = 0;
        const content = document.getElementById('gemini-message-nav-content');
        if (content) {
          const list = content.querySelector('ul');
          if (list) list.innerHTML = '';
        }
        updateMessageList();
        observeConversation();
      }
    }, 500);
  }

  waitForChatToLoad();

  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      waitForChatToLoad();
    }
  }).observe(document.body, { childList: true, subtree: true });
})();
