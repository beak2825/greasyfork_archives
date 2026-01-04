// ==UserScript==
// @name         Hi, Ant Design Component Dashboard (5.x)🚀
// @namespace    https://github.com/xianghongai/Tampermonkey-UserScript
// @version      1.0.10
// @description  将 Ant Design 的 Menu 转为 Dashboard 交互（按住 Shift 点击则恢复 Menu 模式）
// @author       Nicholas Hsiang
// @match        *://ant.design/*
// @match        *://ant-design.antgroup.com/*
// @icon         https://gw.alipayobjects.com/zos/rmsportal/rlpTLlbMzTNYuZGGCVYM.png
// @grant        GM_addStyle
// @grant        GM_info
// @run-at       document-end
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530923/Hi%2C%20Ant%20Design%20Component%20Dashboard%20%285x%29%F0%9F%9A%80.user.js
// @updateURL https://update.greasyfork.org/scripts/530923/Hi%2C%20Ant%20Design%20Component%20Dashboard%20%285x%29%F0%9F%9A%80.meta.js
// ==/UserScript==

(function () {
  'use strict';
  console.log(GM_info.script.name);

  const logoSelector = 'img[alt="logo"]';
  const navSelector = '.ant-app>header';
  const menuSelector = '.ant-app>main>.ant-col:nth-child(1)';
  const groupSelector = '.ant-menu>.ant-menu-item-group';
  const componentItemSelector = '.ant-menu-item';
  const titleSelector = '.ant-menu-item-group-title';

  let wrapperElement = null;
  let isCounted = false;

  main();

  /**
   * Main function to execute when the script is loaded.
   */
  function main() {
    ready(() => {
      poll(navSelector, handler, 500);
    });
  }

  const wrapperId = 'x-menu-wrapper';
  const wrapperClassName = 'x-menu-wrapper';
  const toggleClassName = 'x-toggle';
  const bodyStateClassName = 'x-menu--open';

  function handler() {
    const toggleElement = document.createElement('span');
    toggleElement.className = toggleClassName;
    toggleElement.innerHTML = icon();

    toggleElement.addEventListener('click', (event) => {
      // hold shift key to reset
      if (event.shiftKey) {
        reset();
        return;
      }

      // init
      if (!wrapperElement || wrapperElement.id !== wrapperId) {
        // wrapper element add id
        wrapperElement = setMenuWrapper();
        // add event listener to component item
        componentItemClickEventListener(wrapperElement, componentItemSelector);
        // handle component page class (hide 'overview' menu item)
        handleComponentPageClass(wrapperElement);
        // count components
        countComponents(wrapperElement);
        // open the menu dashboard
        open();
        return;
      }

      toggle();
    });

    document.body.appendChild(toggleElement);
    // add event listener to navbar
    navClickEventListener();
  }

  /**
   * Click the navbar element, handle the component page (hide 'overview' menu item).
   */
  function navClickEventListener() {
    const navElement = document.querySelector(navSelector);

    if (navElement) {
      navElement.addEventListener('click', () => {
        wrapperElement = document.querySelector(menuSelector);
        setTimeout(() => {
          if (wrapperElement) {
            handleComponentPageClass(wrapperElement);
            countComponents(wrapperElement);
          }
        }, 100);
      });
    }
  }

  /**
   * Handle the component page class.
   * @param {Element} wrapperElement - The wrapper element
   */
  function handleComponentPageClass(wrapperElement) {
    if (isComponentPage()) {
      wrapperElement.classList.add(wrapperClassName);
    } else {
      wrapperElement.classList.remove(wrapperClassName);
    }
  }

  /**
   * Click the component item, hide the menu wrapper.
   * @param {Element} wrapperElement - The wrapper element
   * @param {string} componentItemSelector - The selector of the component item
   */
  function componentItemClickEventListener(wrapperElement, componentItemSelector) {
    wrapperElement.addEventListener('click', (event) => {
      if (matches(event.target, componentItemSelector)) {
        close();
      }
    });
  }

  /**
   * Set the menu wrapper element.
   * @returns {Element} - The menu wrapper element
   */
  function setMenuWrapper() {
    wrapperElement = document.querySelector(menuSelector);
    wrapperElement.setAttribute('id', wrapperId);
    return wrapperElement;
  }

  /**
   * Count the components in the wrapper element.
   * @param {Element} wrapperElement - The wrapper element
   */
  function countComponents(wrapperElement) {
    if (!isComponentPage() || isCounted) {
      return;
    }

    const groupElements = Array.from(wrapperElement.querySelectorAll(groupSelector));
    const componentCounts = [];

    groupElements.forEach((item) => {
      const itemElements = Array.from(item.querySelectorAll(componentItemSelector));
      const length = itemElements.length;
      const titleElement = item.querySelector(titleSelector);
      const title = titleElement.textContent;
      titleElement.textContent = `${title} (${length})`;
      componentCounts.push(length);
    });

    const totalCount = componentCounts.reduce((acc, curr) => acc + curr, 0);
    const totalText = `🚀 共有组件 ${totalCount} 个`;
    const logoElement = document.querySelector(logoSelector);

    if (logoElement) {
      logoElement.title = totalText;
    }

    console.log(totalText);
    isCounted = true;
  }

  function isComponentPage() {
    return window.location.href.includes('component');
  }

  function open() {
    document.body.classList.add(bodyStateClassName);
  }

  function reset() {
    wrapperElement.removeAttribute('id');
    wrapperElement.style.display = 'block';
  }

  function open() {
    wrapperElement.style.display = 'grid';
    document.body.classList.add(bodyStateClassName);
  }

  function close() {
    wrapperElement.style.display = 'none';
    document.body.classList.remove(bodyStateClassName);
  }

  function toggle() {
    if (wrapperElement.style.display === 'none') {
      open();
    } else {
      close();
    }
  }

  /**
   * Execute a function when the document is ready.
   * @param {function} eventHandler - Function to execute when the document is ready
   */
  function ready(eventHandler) {
    if (document.readyState !== 'loading') {
      eventHandler();
    } else {
      document.addEventListener('DOMContentLoaded', eventHandler);
    }
  }

  /**
   * Wait for an element to be found on the page using polling.
   * @param {string} selector - CSS selector for the element to wait for
   * @param {function} callback - Function to execute when the element is found
   * @param {number} maxAttempts - Maximum number of attempts to find the element
   * @returns {number} intervalId - ID of the interval used to poll for the element
   */
  function poll(selector, callback, maxAttempts = 10) {
    let attempts = 0;

    const intervalId = setInterval(() => {
      attempts++;
      const element = document.querySelector(selector);

      if (element) {
        clearInterval(intervalId);
        if (callback && typeof callback === 'function') {
          callback(element);
        }
      } else if (attempts >= maxAttempts) {
        clearInterval(intervalId);
        console.log(`Element ${selector} not found after ${maxAttempts} attempts.`);
      }
    }, 1000);

    return intervalId;
  }

  /**
   * Check if an element matches a CSS selector.
   * @param {Element} currentElement - The element to check for a match
   * @param {string} selector - CSS selector to match against
   * @returns {boolean} - True if the selector matches, false otherwise
   */
  function matches(currentElement, selector) {
    while (currentElement !== null && currentElement !== document.body) {
      if (currentElement.matches(selector)) {
        return true;
      }
      currentElement = currentElement.parentElement;
    }

    // 检查 body 元素
    return document.body.matches(selector);
  }

  function icon() {
    return `<?xml version="1.0" encoding="UTF-8"?><svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4Z" fill="#2F88FF" stroke="#333" stroke-width="3" stroke-linejoin="round"/><path d="M18 28H6C4.89543 28 4 28.8954 4 30V42C4 43.1046 4.89543 44 6 44H18C19.1046 44 20 43.1046 20 42V30C20 28.8954 19.1046 28 18 28Z" fill="#2F88FF" stroke="#333" stroke-width="3" stroke-linejoin="round"/><path d="M42 4H30C28.8954 4 28 4.89543 28 6V18C28 19.1046 28.8954 20 30 20H42C43.1046 20 44 19.1046 44 18V6C44 4.89543 43.1046 4 42 4Z" fill="#2F88FF" stroke="#333" stroke-width="3" stroke-linejoin="round"/><path d="M28 28H44" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M36 36H44" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 44H44" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  const style = `
  .${bodyStateClassName} {
    height: 100vh !important;
    overflow: hidden !important;
  }

  .${toggleClassName} {
    position: fixed;
    top: 24px;
    right: 720px;
    z-index: 99999;
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 0.3s ease-in-out;
  }

  .${toggleClassName}:hover {
    opacity: 1;
  }

  #${wrapperId} {
    position: fixed !important;
    top: 64px !important;
    right: 0 !important;
    bottom: 0 !important;
    left: 0 !important;
    z-index: 9999 !important;
    max-width: 100% !important;
    max-height: calc(100vh - 64px) !important;
    padding: 16px !important;
    background: #fff !important;
    border-block-start: 1px solid rgba(5, 5, 5, 0.06) !important;
  }

  [data-prefers-color="dark"] #${wrapperId} {
    background: rgb(20, 20, 20) !important;
  }

  #${wrapperId}>.ant-menu {
    display: grid !important;
    grid-auto-flow: column !important;
    grid-auto-columns: max-content !important;
    max-width: max-content !important;
    gap: 16px !important;
    overflow: auto;
    margin-inline: auto !important;
    border-inline-end: none !important;
  }

  #${wrapperId}.${wrapperClassName}>.ant-menu > .ant-menu-item-only-child {
    display: none !important;
  }

  #${wrapperId}>.ant-menu > .ant-menu-item-group {
    display: grid !important;
    grid-template-rows: auto 1fr;
    overflow: hidden !important;
  }

  #${wrapperId}>.ant-menu > .ant-menu-item-group > .ant-menu-item-group-list {
    overflow: auto !important;
  }

  #${wrapperId} .ant-menu > .ant-menu-item-group > .ant-menu-item-group-list > .ant-menu-item {
    height: 28px !important;
    line-height: 28px !important;
  }

  #${wrapperId}>.ant-menu > .ant-menu-item-group .ant-menu-item-group-title {
    margin-block-start: 0 !important;
  }

  `;
  GM_addStyle(style);
})();
