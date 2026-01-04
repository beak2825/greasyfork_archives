// ==UserScript==
// @name         ChatGPT Conversation Navigator (Advanced)
// @namespace    https://greasyfork.org/users/1427520
// @version      1.3
// @description  Displays a floating container on the right with every message you sent in the current conversation
// @author       Bui Quoc Dung
// @match        https://chatgpt.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://i.ibb.co/jZ3HpwPk/pngwing-com.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539161/ChatGPT%20Conversation%20Navigator%20%28Advanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539161/ChatGPT%20Conversation%20Navigator%20%28Advanced%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const moveLeftStyle = `
    body.navigator-expanded .mx-auto,
    body.navigator-expanded .md\\:max-w-3xl,
    body.navigator-expanded .xl\\:max-w-\\[48rem\\],
    body.navigator-expanded .max-w-2xl,
    body.navigator-expanded .lg\\:px-2 {
      margin-left: 0 !important;
      margin-right: 130px !important;
    }

    body.navigator-expanded main,
    body.navigator-expanded main > div,
    body.navigator-expanded main article > div,
    body.navigator-expanded div.flex.flex-col.items-center.text-sm {
      margin-left: 0 !important;
      margin-right: auto !important;
      max-width: 100% !important;
    }

    body.navigator-expanded div.ProseMirror {
      margin-left: 0 !important;
      margin-right: auto !important;
    }

    body.navigator-expanded .xl\\:max-w-\\[48rem\\] {
      width: 800px !important;
      max-width: 100% !important;
    }
  `;
  GM_addStyle(moveLeftStyle);

  let chatID = '';
  let userMsgCounter = 0;

  function updateBodyClassForLayout() {
    const container = document.getElementById('chatgpt-message-nav');
    const content = document.getElementById('chatgpt-message-nav-content');
    if (container && container.style.display !== 'none' && content && content.style.display !== 'none') {
      document.body.classList.add('navigator-expanded');
    } else {
      document.body.classList.remove('navigator-expanded');
    }
  }

  function createContainer() {
    let container = document.getElementById('chatgpt-message-nav');
    if (!container) {
      container = document.createElement('div');
      container.id = 'chatgpt-message-nav';
      container.style.position = 'fixed';
      container.style.top = '35px';
      container.style.right = '20px';
      container.style.width = '250px';
      container.style.maxHeight = '90vh';
      container.style.overflowY = 'auto';
      container.className = "text-token-text-primary bg-token-main-surface-primary rounded-lg shadow-lg";
      container.style.zIndex = '9999';
      container.style.borderRadius = '2px';
      container.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.3)';
      container.style.fontSize = '14px';
      container.style.transition = 'width 0.3s, padding 0.3s, opacity 0.3s, transform 0.3s';

      const header = document.createElement('div');
      header.id = 'chatgpt-message-nav-header';
      header.style.display = 'flex';
      header.style.alignItems = 'center';
      header.style.justifyContent = 'space-between';
      header.style.padding = '5px';
      header.style.paddingTop = '5px';
      header.style.cursor = 'pointer';
      header.style.position = 'sticky';
      header.style.top = '-7px';
      header.style.background = 'inherit';
      header.style.zIndex = '1';

      const title = document.createElement('div');
      title.id = 'chatgpt-message-nav-title';
      title.style.fontWeight = 'bold';
      title.innerText = 'Your Prompts';

      const toggleBtn = document.createElement('button');
      toggleBtn.id = 'chatgpt-message-nav-toggle';
      toggleBtn.style.background = 'none';
      toggleBtn.style.border = 'none';
      toggleBtn.style.color = 'currentColor';
      toggleBtn.style.fontSize = '16px';
      toggleBtn.style.cursor = 'pointer';
      toggleBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg" class="icon-md text-token-text-primary">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M12 21C11.7348 21 11.4804 20.8946 11.2929 20.7071L4.29289 13.7071C3.90237 13.3166 3.90237 12.6834 4.29289 12.2929C4.68342 11.9024 5.31658 11.9024 5.70711 12.2929L11 17.5858V4C11 3.44772 11.4477 3 12 3C12.5523 3 13 3.44772 13 4V17.5858L18.2929 12.2929C18.6834 11.9024 19.3166 11.9024 19.7071 12.2929C20.0976 12.6834 20.0976 13.3166 19.7071 13.7071L12.7071 20.7071C12.5196 20.8946 12.2652 21 12 21Z"
          fill="currentColor"></path></svg>`;
      toggleBtn.style.rotate = '-90deg';
      toggleBtn.style.transition = 'rotate 0.3s';
      header.appendChild(title);
      header.appendChild(toggleBtn);

      const content = document.createElement('div');
      content.id = 'chatgpt-message-nav-content';
      content.style.padding = '5x';
      content.style.paddingTop = '0px';

      container.appendChild(header);
      container.appendChild(content);
      document.body.appendChild(container);

      const collapsed = GM_getValue('chatgptMessageNavCollapsed', false);
      if (collapsed) {
        content.style.display = 'none';
        container.style.width = 'min-content';
        container.style.padding = '5px';
        title.style.display = 'none';
        toggleBtn.style.rotate = '90deg';
        header.style.paddingTop = '10px';
      }

      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (content.style.display === 'none') {
          content.style.display = 'block';
          container.style.width = '250px';
          container.style.padding = '7px';
          title.style.display = 'block';
          toggleBtn.style.rotate = '-90deg';
          header.style.paddingTop = '15px';
          GM_setValue('chatgptMessageNavCollapsed', false);
        } else {
          content.style.display = 'none';
          container.style.width = 'min-content';
          container.style.padding = '5px';
          title.style.display = 'none';
          toggleBtn.style.rotate = '90deg';
          header.style.paddingTop = '10px';
          GM_setValue('chatgptMessageNavCollapsed', true);
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
    const messageWithPrefix = `${index}. ${preview}`;

    const listItem = document.createElement('li');
    listItem.style.cursor = 'pointer';
    listItem.style.padding = '5px 10px';
    listItem.style.marginTop = '5px';
    listItem.style.borderRadius = '5px';
    listItem.style.borderBottom = '1px solid var(--main-surface-primary-inverse)';
    listItem.style.transition = 'background 0.2s';
    listItem.addEventListener('mouseenter', () => listItem.style.background = '#c5c5c54d');
    listItem.addEventListener('mouseleave', () => listItem.style.background = 'transparent');
    listItem.style.whiteSpace = 'normal';
    listItem.style.overflow = 'hidden';
    listItem.style.textOverflow = 'ellipsis';
    listItem.innerHTML = messageWithPrefix;

    listItem.addEventListener('click', () => {
      const target = document.getElementById(msgElem.id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    return listItem;
  }

  function updateMessageList() {
    const container = createContainer();
    const content = document.getElementById('chatgpt-message-nav-content');
    if (!content) return;

    let list = content.querySelector('ul');
    if (!list) {
      list = document.createElement('ul');
      list.style.padding = '0';
      list.style.margin = '0';
      list.style.listStyle = 'none';
      content.appendChild(list);
    }

    const userMessages = document.querySelectorAll('div[data-message-author-role="user"]');
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

  function getChatID() {
    const chatURL = window.location.pathname;
    return chatURL.includes('/c/') ? chatURL.split('/c/')[1] : 'global';
  }

  let conversationObserver = null;
  function observeConversation() {
    if (conversationObserver) conversationObserver.disconnect();
    const mainElem = document.querySelector('main');
    if (!mainElem) return;

    conversationObserver = new MutationObserver(() => updateMessageList());
    conversationObserver.observe(mainElem, { childList: true, subtree: true });
  }

  function toggleContainerVisibility() {
    const container = document.getElementById('chatgpt-message-nav');
    const isChatPage = window.location.pathname.startsWith('/c/');
    if (container) container.style.display = isChatPage ? 'block' : 'none';
    updateBodyClassForLayout();
  }

  function initializeOrReinitialize() {
    toggleContainerVisibility();
    if (window.location.pathname.startsWith('/c/')) {
      createContainer();
      chatID = getChatID();
      userMsgCounter = 0;
      const content = document.getElementById('chatgpt-message-nav-content');
      if (content) {
        const list = content.querySelector('ul');
        if (list) list.innerHTML = '';
      }
      updateMessageList();
      observeConversation();
    } else {
      if (conversationObserver) conversationObserver.disconnect();
    }
    updateBodyClassForLayout();
  }

  function waitForChatToLoad() {
    const interval = setInterval(() => {
      const mainElem = document.querySelector('main');
      if (mainElem && mainElem.querySelector('div[data-message-author-role]')) {
        clearInterval(interval);
        initializeOrReinitialize();
      } else if (mainElem && !window.location.pathname.startsWith('/c/')) {
        clearInterval(interval);
        initializeOrReinitialize();
      }
    }, 500);
  }

  waitForChatToLoad();

  let lastUrl = location.href;
  const urlObserver = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      waitForChatToLoad();
    }
  });
  urlObserver.observe(document.body, { childList: true, subtree: true });
})();
