"use strict";
// ==UserScript==
// @name                bilibili Helper
// @name:zh-CN          bilibili 助手
// @description         Auto widescreen
// @description:zh-CN   自动宽屏
// @namespace           bilibili-helper
// @version             2022.06.11.2
// @author              everbrez
// @license             MIT License
// @match               *://www.bilibili.com/video/*
// @match               *://www.bilibili.com/bangumi/play/*
// @match               *://www.bilibili.com/blackboard/*
// @match               *://www.bilibili.com/watchlater/*
// @match               *://player.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/401374/bilibili%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/401374/bilibili%20Helper.meta.js
// ==/UserScript==
(function () {
  /**
   * wait for an element to render
   * @usage
   * const targetElement = await waitForElement('.target')
   * // then do something
   * if the rootElement is not exist, waitForElement will throw an error
   *
   * @param {string} targetSelector the target element query selector
   * @param {string} [rootSelector='body'] default search root element: body
   * @param {number} [wait] how long to cancal watch this element to render, default: wait forever
   * @returns {Promise<Element>} return the target element dom object
   */
  function waitForElement(targetSelector, rootSelector = 'body', wait) {
    const rootElement = document.querySelector(rootSelector);
    if (!rootElement) {
      console.log('root element is not exist');
      return Promise.reject('root element is not exist');
    }
    // check if the element is already rendered
    const targetElement = rootElement.querySelector(targetSelector);
    if (targetElement) {
      return Promise.resolve(targetElement);
    }
    return new Promise((resolve, reject) => {
      const callback = function (matationList, observer) {
        const targetElement = rootElement.querySelector(targetSelector);
        if (targetElement) {
          // found
          resolve(targetElement);
          // then cancel to watch the element
          observer.disconnect();
        }
      };
      const observer = new MutationObserver(callback);
      observer.observe(rootElement, {
        subtree: true,
        childList: true
      });
      if (wait !== undefined) {
        // if wait is set, then cancel to watch the element to render after wait times
        setTimeout(() => {
          observer.disconnect();
        }, wait);
      }
    });
  }
  async function autoClickElement(targetSelector, rootSelector, now = false) {
    if (now) {
      const parent = rootSelector ? document.querySelector(rootSelector) : document;
      if (parent) {
        const target = parent.querySelector(targetSelector);
        if (target) {
          target.click();
          return true;
        }
      }
      return false;
    }
    const target = await waitForElement(targetSelector, rootSelector);
    target.click();
  }

  function detectIsInputing() {
    const activeElement = document.activeElement;
    return activeElement instanceof HTMLInputElement ||
      activeElement instanceof HTMLTextAreaElement;
  }

  function addHotKeys() {
    document.addEventListener('keypress', async (event) => {
      const isInputing = detectIsInputing();
      if (isInputing) {
        return;
      }
      switch (event.key) {
          // d 切换弹幕开关
        case 'd':
        case 'D':
          return autoClickElement('input.bui-switch-input');
          // s 收藏
        case 's':
        case 'S':
          // 如果已经打开了收藏，则关闭
          const hasOpenedCollect = await autoClickElement('[class*="bili-dialog"] .close', undefined, true);
          if (hasOpenedCollect) {
            return;
          }
          return autoClickElement('.collect[title*="收藏"]');
          // c 投币
        case 'c':
        case 'C':
          // 如果已经打开了硬币，则关闭
          const hasOpenedCoin = await autoClickElement('[class*="bili-dialog"] .close', undefined, true);
          if (hasOpenedCoin) {
            return;
          }
          return autoClickElement('.coin[title*="硬币"]');
      }
    });
  }

  function main() {
    const selectorList = ['button[data-text="宽屏模式"]', '.squirtle-video-widescreen:not(.active)'];
    selectorList.forEach(selector => autoClickElement(selector));
    // addHotKeys();
  }
  main();
})();