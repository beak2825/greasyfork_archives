// ==UserScript==
// @name         WhatsApp Web: Unblur with Scroll
// @namespace    wwpb_robust_cleaned_minimal
// @version      1.0
// @description  Blur WhatsApp Web content (names, DPs, media, emojis) with last 3 messages unblurred. Robust on scroll/load. Hover unblurs. Stable & maintainable.
// @author       https://greasyfork.org/en/users/1356925-govind-rajulu & Perplexity AI
// @match        https://web.whatsapp.com/
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544514/WhatsApp%20Web%3A%20Unblur%20with%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/544514/WhatsApp%20Web%3A%20Unblur%20with%20Scroll.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const UNCENSOR_LAST_N = 3;

  const CLS = {
    MSG_BLUR: 'wwpb-blur-msg',
    MEDIA_BLUR: 'wwpb-blur-media',
    DP_BLUR: 'wwpb-blur-dp',
    NAME_BLUR: 'wwpb-blur-name'
  };

  const SELECTORS = {
    SIDEBAR_AVATARS: [
      'img._ao3e',
      'img[class*="_ao3e"]',
      'img[class*="x1n2onr6"]',
      'img[class*="xh8yej3"]',
      'img._2WP9Q',
      'img[src*="blob"]',
      'img[decoding="async"]',
      'div.x10l6tqk.x1agz8ms.xiy17q3.x18d0r48.xso031l.x1q0q8m5.x1jpdw5n.x5yr21d.x10l6tqk.xh8yej3[style*="background-image"]'
    ].join(','),
    SIDEBAR_NAMES: [
      '#pane-side ._21S-L span[dir]',
      '#pane-side span[title]',
      '#pane-side ._21S-L span'
    ].join(','),

    CHAT_MESSAGES: 'div.message-in, div.message-out',
    CHAT_MSG_TEXT: 'span.selectable-text',
    CHAT_SPECIAL_SPANS: [
      'span._ahxu',
      'span[class*="_ahxu"]',
      'span._ao3e',
      'span[class*="_ao3e"]',
      'span[class*="x1iyjqo2"]'
    ].join(','),
    CHAT_EMOJIS: [
      'img[data-emoji]',
      'img.emoji',
      'img[alt*="emoji"]',
      'img[src*="emoji"]',
      'span._ahiu',
      'span[class*="_ahiu"]'
    ].join(','),
    CHAT_MEDIA: 'img, video',

    CHAT_HEADER_NAMES: [
      '#main header span[title]',
      '#main header div[role="heading"] span',
      '#main header span[dir="auto"][title]'
    ].join(','),

    CHAT_HEADER_SPECIAL_SPANS: [
      'span._ao3e',
      'span[class*="_ao3e"]',
      'span._ahxu',
      'span[class*="_ahxu"]',
      'span[class*="x1iyjqo2"]'
    ].join(','),
    CHAT_HEADER_AVATAR: '#main header img',
    CHAT_HEADER_DIV_AVATAR: '#main header div[style*="background-image"]',

    CHAT_SIDE_NAMES: 'span._21S-L, span._3FuDI, span[title]'
  };

  const STYLE_ID = 'wwpb-blur-style-robust-cleaned-minimal';
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .${CLS.MSG_BLUR},
      .${CLS.MEDIA_BLUR},
      .${CLS.DP_BLUR} {
        filter: blur(5px);
        transition: filter 0.16s;
        cursor: pointer;
        display: inline-block;
      }
      .${CLS.DP_BLUR} {
        filter: blur(10px);
      }
      .${CLS.MSG_BLUR}:hover,
      .${CLS.MEDIA_BLUR}:hover,
      .${CLS.DP_BLUR}:hover,
      .${CLS.MEDIA_BLUR}:hover img,
      .${CLS.MSG_BLUR}:hover img {
        filter: none !important;
      }
      .${CLS.NAME_BLUR} {
        color: transparent;
        text-shadow: 0 0 5px rgba(0,0,0,0.6);
        user-select: none;
        cursor: pointer;
        transition: color 0.12s, text-shadow 0.12s;
      }
      .${CLS.NAME_BLUR}:hover {
        color: inherit;
        text-shadow: none;
      }
    `;
    document.head.appendChild(style);
  }

  // toggleClass
  function toggleClass(elements, className, condition) {
    elements.forEach(el => {
      if (el && el.classList) {
        condition ? el.classList.add(className) : el.classList.remove(className);
      }
    });
  }

  // debounce
  function debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // getActiveMessageList
  function getActiveMessageList() {
    return (
      document.querySelector('div[tabindex="-1"][role="region"]') ||
      document.querySelector('div[aria-label="Message list"]') ||
      document.querySelector('div[data-testid="chat-list"]') ||
      document.querySelector('#main')
    );
  }

  // blurContactsSidebar
  function blurContactsSidebar() {
    const pane = document.getElementById('pane-side');
    if (!pane) return;
    toggleClass(Array.from(pane.querySelectorAll(SELECTORS.SIDEBAR_NAMES)), CLS.NAME_BLUR, true);
    toggleClass(Array.from(pane.querySelectorAll(SELECTORS.SIDEBAR_AVATARS)), CLS.DP_BLUR, true);
  }

  // blurChatMessages
  function blurChatMessages() {
    const messages = Array.from(document.querySelectorAll(SELECTORS.CHAT_MESSAGES));
    const total = messages.length;

    messages.forEach((msg, idx) => {
      const shouldBlur = total > UNCENSOR_LAST_N && idx < total - UNCENSOR_LAST_N;

      Array.from(
        msg.querySelectorAll(
          [
            SELECTORS.CHAT_MSG_TEXT,
            SELECTORS.CHAT_SPECIAL_SPANS,
            SELECTORS.CHAT_EMOJIS,
            SELECTORS.CHAT_MEDIA
          ].join(',')
        )
      ).forEach(el => {
        el.classList.remove(CLS.MSG_BLUR);
        el.classList.remove(CLS.MEDIA_BLUR);
      });

      if (shouldBlur) {
        toggleClass(Array.from(msg.querySelectorAll(SELECTORS.CHAT_MSG_TEXT)), CLS.MSG_BLUR, true);
        toggleClass(Array.from(msg.querySelectorAll(SELECTORS.CHAT_SPECIAL_SPANS)), CLS.MSG_BLUR, true);
        Array.from(msg.querySelectorAll(SELECTORS.CHAT_EMOJIS)).forEach(el => el.classList.add(CLS.MEDIA_BLUR));
      }
    });
  }

  // blurChatMedia
  function blurChatMedia() {
    const messages = Array.from(document.querySelectorAll(SELECTORS.CHAT_MESSAGES));
    const total = messages.length;

    messages.forEach((msg, idx) => {
      const shouldBlur = total > UNCENSOR_LAST_N && idx < total - UNCENSOR_LAST_N;
      Array.from(msg.querySelectorAll(SELECTORS.CHAT_MEDIA)).forEach(el => {
        if (shouldBlur && !el.classList.contains('emoji') && !el.classList.contains(CLS.MEDIA_BLUR)) {
          el.classList.add(CLS.MEDIA_BLUR);
        } else if (!shouldBlur && !el.classList.contains('emoji')) {
          el.classList.remove(CLS.MEDIA_BLUR);
        }
      });
    });
  }

  // blurChatHeader
  function blurChatHeader() {
    const header = document.querySelector('#main header');
    if (!header) return;
    toggleClass(Array.from(header.querySelectorAll(SELECTORS.CHAT_HEADER_NAMES)), CLS.NAME_BLUR, true);
    toggleClass(Array.from(header.querySelectorAll(SELECTORS.CHAT_HEADER_SPECIAL_SPANS)), CLS.NAME_BLUR, true);

    const avatarImg = header.querySelector(SELECTORS.CHAT_HEADER_AVATAR);
    if (avatarImg && avatarImg.classList) avatarImg.classList.add(CLS.DP_BLUR);

    const avatarDiv = header.querySelector(SELECTORS.CHAT_HEADER_DIV_AVATAR);
    if (avatarDiv && avatarDiv.classList) avatarDiv.classList.add(CLS.DP_BLUR);
  }

  // blurChatSideNames
  function blurChatSideNames() {
    toggleClass(Array.from(document.querySelectorAll(SELECTORS.CHAT_SIDE_NAMES)), CLS.NAME_BLUR, true);
  }

  // blurAllChatElements
  function blurAllChatElements() {
    blurChatMessages();
    blurChatMedia();
    blurChatHeader();
    blurChatSideNames();
  }

  const debouncedBlurAllChatElements = debounce(blurAllChatElements, 150);

  // observeContactSidebarChanges
  function observeContactSidebarChanges() {
    const pane = document.getElementById('pane-side');
    if (!pane) return;
    blurContactsSidebar();
    const observer = new MutationObserver(debounce(blurContactsSidebar, 100));
    observer.observe(pane, { childList: true, subtree: true });
  }

  // observeChatChanges
  function observeChatChanges() {
    const msgList = getActiveMessageList();
    if (!msgList) return;

    blurAllChatElements();

    const observer = new MutationObserver(() => {
      debouncedBlurAllChatElements();
    });
    observer.observe(msgList, { childList: true, subtree: true });

    let scrollTimeout;
    msgList.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        blurAllChatElements();
      }, 250);
    });

    msgList.addEventListener('mousemove', () => {
      setTimeout(() => blurAllChatElements(), 200);
    });
  }

  // delayedBlurAllChatElements
  function delayedBlurAllChatElements(delay = 800) {
    setTimeout(blurAllChatElements, delay);
  }

  // setupObserversAndEvents
  function setupObserversAndEvents() {
    observeContactSidebarChanges();
    observeChatChanges();

    ['focus', 'mouseup', 'hashchange'].forEach(evt => {
      window.addEventListener(evt, () => delayedBlurAllChatElements(800));
    });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) setTimeout(blurAllChatElements, 200);
    });

    setInterval(() => {
      const anyUnblurred = !!document.querySelector(
        'div.message-in span.selectable-text:not(.' + CLS.MSG_BLUR + '), ' +
        'div.message-out span.selectable-text:not(.' + CLS.MSG_BLUR + ')'
      );
      if (anyUnblurred) blurAllChatElements();
    }, 2500);
  }

  // waitForElement
  function waitForElement(selector, root = document.body, timeout = 8000) {
    return new Promise((resolve, reject) => {
      const el = root.querySelector(selector);
      if (el) {
        resolve(el);
        return;
      }
      const observer = new MutationObserver((mutations, obs) => {
        const found = root.querySelector(selector);
        if (found) {
          obs.disconnect();
          resolve(found);
        }
      });
      observer.observe(root, { childList: true, subtree: true });
      if (timeout) {
        setTimeout(() => {
          observer.disconnect();
          console.warn(`Timeout waiting for selector "${selector}". Retrying...`);
          reject(new Error(`Timeout waiting for selector: ${selector}`));
        }, timeout);
      }
    });
  }

  // init
  async function init() {
    try {
      await waitForElement('#pane-side');
      await waitForElement('#main');
      setupObserversAndEvents();
    } catch (error) {
      console.error('wwpb: Initialization failed:', error);
      setTimeout(init, 1000);
    }
  }

  init();

})();
