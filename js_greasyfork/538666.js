// ==UserScript==
// @name         Grok Easy Delete Chat
// @namespace    nisc
// @version      2025.06.08-A
// @description  Delete Grok chat with only Cmd/Ctrl+Shift+Delete, auto-confirms popup
// @homepageURL  https://github.com/nisc/grok-userscripts/
// @author       nisc
// @match        https://grok.com/*
// @icon         https://grok.com/favicon.ico
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538666/Grok%20Easy%20Delete%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/538666/Grok%20Easy%20Delete%20Chat.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Configuration object containing all adjustable settings and constants
  const CONFIG = {
    platform: {
      isMac: navigator.userAgent.includes('Mac')
    },
    shortcut: {
      key: navigator.userAgent.includes('Mac') ? 'Backspace' : 'Delete',
      modifier: navigator.userAgent.includes('Mac') ? 'metaKey' : 'ctrlKey',
      shift: true
    },
    // Timing delays (in ms) for various operations
    delays: {
      RETRY: 200,               // Delay between retries when finding chat element
      HOVER: 75,                // Delay after simulating hover events
      KEY_PRESS: 75,            // Delay between key press events
      MENU_OPEN: 125,           // Delay for menu to open after clicking history
      CLICK_TO_DELETE: 125,     // Delay between click and delete command
      DELETE_TO_ENTER: 125,     // Delay between delete and enter press
      FINAL_ESCAPE: 250,        // Final delay before pressing escape
    },
    // Key codes for special keys
    keyCodes: {
      Enter: {
        code: 'Enter',
        keyCode: 13
      },
      Escape: {
        code: 'Escape',
        keyCode: 27
      }
    },
    // DOM selectors used throughout the script
    selectors: {
      historyButton: 'button[aria-label="History"]',
      dialog: '[role="dialog"]',
      clickableArea: '.cursor-pointer',
      cmdkItem: '[cmdk-item]',
      queryBar: '.query-bar',
      privateClasses: ['bg-purple-50', 'dark:bg-purple-1000']
    },
    // Mouse event simulation coordinates
    mouse: {
      clientX: 100,
      clientY: 100
    },
    // Maximum retries for finding elements
    maxRetries: 5,
    // Text constants
    text: {
      current: 'Current'
    }
  };

  /**
   * Utility functions for common operations
   */
  const utils = {
    delay: ms => new Promise(resolve => setTimeout(resolve, ms)),
    querySelector: (selector, context = document) => context.querySelector(selector),
    querySelectorAll: (selector, context = document) => Array.from(context.querySelectorAll(selector)),
    hasClass: (element, className) => {
      if (!element) return false;

      // Check the element itself
      if (element.classList.contains(className)) return true;

      // Check parent elements
      let parent = element;
      while (parent) {
        if (parent.classList && parent.classList.contains(className)) {
          return true;
        }
        parent = parent.parentElement;
      }

      return false;
    }
  };

  /**
   * DOM Cache for frequently accessed elements
   */
  const domCache = {
    _queryBar: null,
    get queryBar() {
      if (!this._queryBar) {
        this._queryBar = utils.querySelector(CONFIG.selectors.queryBar);
      }
      return this._queryBar;
    },
    clearCache() {
      this._queryBar = null;
    }
  };

  /**
   * Event simulation utilities
   */
  const eventSimulator = {
    createMouseEvent(eventType) {
      return new MouseEvent(eventType, {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: CONFIG.mouse.clientX,
        clientY: CONFIG.mouse.clientY
      });
    },

    createKeyEvent(key, options = {}, type = 'keydown') {
      return new KeyboardEvent(type, {
        key,
        code: this._getKeyCode(key),
        bubbles: true,
        cancelable: true,
        keyCode: this._getKeyCodeNumber(key),
        ...options
      });
    },

    _getKeyCode(key) {
      return CONFIG.keyCodes[key]?.code || `Key${key.toUpperCase()}`;
    },

    _getKeyCodeNumber(key) {
      return CONFIG.keyCodes[key]?.keyCode || key.toUpperCase().charCodeAt(0);
    },

    async simulateMouseEvent(element, eventType) {
      element.dispatchEvent(this.createMouseEvent(eventType));
    },

    async simulateHover(element) {
      const parent = element.parentElement;
      if (parent) {
        ['mouseover', 'mouseenter'].forEach(event => this.simulateMouseEvent(parent, event));
        await utils.delay(CONFIG.delays.HOVER);
      }

      ['mouseover', 'mouseenter'].forEach(event => this.simulateMouseEvent(element, event));
      await utils.delay(CONFIG.delays.HOVER);

      element.classList.add('hover');
    },

    async simulateKeyPress(element, key, options = {}) {
      element.focus();
      await utils.delay(CONFIG.delays.KEY_PRESS);

      ['keydown', 'keyup'].forEach(async (type) => {
        element.dispatchEvent(this.createKeyEvent(key, options, type));
        document.dispatchEvent(this.createKeyEvent(key, options, type));
        await utils.delay(CONFIG.delays.KEY_PRESS);
      });
    }
  };

  /**
   * Chat operations handling
   */
  const chatOperations = {
    isValidInput(target) {
      return target.tagName === 'TEXTAREA' ||
        (!['INPUT'].includes(target.tagName) && !target.isContentEditable);
    },

    isPrivateChat() {
      const queryBar = domCache.queryBar;
      if (!queryBar) return false;

      // Check for purple classes either directly on the query bar or in its parent containers
      return CONFIG.selectors.privateClasses.some(className => utils.hasClass(queryBar, className));
    },

    clickHistoryButton() {
      const button = utils.querySelector(CONFIG.selectors.historyButton);
      if (button) {
        button.click();
        return true;
      }
      return false;
    },

    findSelectedChat(retryCount = 0) {
      const findElement = () => {
        const dialog = utils.querySelector(CONFIG.selectors.dialog);
        if (!dialog) return null;

        const currentSpan = utils.querySelectorAll('span', dialog)
          .find(span => span.textContent.trim() === CONFIG.text.current);
        if (!currentSpan) return null;

        return currentSpan.closest(CONFIG.selectors.cmdkItem);
      };

      return new Promise((resolve, reject) => {
        const element = findElement();
        if (element) {
          resolve(element);
        } else if (retryCount < CONFIG.maxRetries) {
          setTimeout(() => this.findSelectedChat(retryCount + 1).then(resolve).catch(reject), CONFIG.delays.RETRY);
        } else {
          reject(new Error('Selected chat not found'));
        }
      });
    },

    simulatePrivateChatShortcut() {
      return eventSimulator.simulateKeyPress(document.body, 'j', {
        metaKey: CONFIG.platform.isMac,
        ctrlKey: !CONFIG.platform.isMac,
        shiftKey: true
      });
    },

    async triggerDeleteSequence() {
      try {
        const currentChat = await this.findSelectedChat();
        const clickableArea = currentChat.querySelector(CONFIG.selectors.clickableArea);
        if (!clickableArea) throw new Error('Clickable area not found');

        await eventSimulator.simulateHover(currentChat);
        await eventSimulator.simulateHover(clickableArea);

        ['mousedown', 'click'].forEach(event => eventSimulator.simulateMouseEvent(clickableArea, event));
        await utils.delay(CONFIG.delays.CLICK_TO_DELETE);

        await eventSimulator.simulateKeyPress(clickableArea, 'd', {
          metaKey: CONFIG.platform.isMac,
          shiftKey: true
        });

        await utils.delay(CONFIG.delays.DELETE_TO_ENTER);
        await eventSimulator.simulateKeyPress(clickableArea, 'Enter');

        await utils.delay(CONFIG.delays.FINAL_ESCAPE);
        await eventSimulator.simulateKeyPress(document.body, 'Escape');

        return true;
      } catch {
        return false;
      }
    }
  };

  /**
   * Main keyboard event handler
   */
  const handleKeyDown = (e) => {
    if (!chatOperations.isValidInput(document.activeElement)) return;

    if (e.key === CONFIG.shortcut.key &&
        e[CONFIG.shortcut.modifier] &&
        e.shiftKey &&
        !e.altKey) {
      e.preventDefault();
      e.stopPropagation();

      if (chatOperations.isPrivateChat()) {
        chatOperations.simulatePrivateChatShortcut();
      } else if (chatOperations.clickHistoryButton()) {
        setTimeout(chatOperations.triggerDeleteSequence.bind(chatOperations), CONFIG.delays.MENU_OPEN);
      }
    }
  };

  /**
   * Initialize the script
   */
  const init = () => {
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', () => domCache.clearCache());
  };

  init();
})();