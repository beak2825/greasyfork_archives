// ==UserScript==
// @name                Bilibili WideScreen Helper
// @name:zh-CN          Bilibili 宽屏助手
// @description         Auto widescreen.（Forked from Bilibili Helper）
// @description:zh-CN   自动宽屏.（Forked from Bilibili Helper）
// @namespace           bilibili-widescreen-helper
// @version             1.1.1
// @author              everbrez
// @author              sabertaz
// @license             MIT License
// @match               *://www.bilibili.com/video/*
// @match               *://www.bilibili.com/bangumi/play/*
// @match               *://www.bilibili.com/blackboard/*
// @match               *://www.bilibili.com/watchlater/*
// @match               *://www.bilibili.com/list/*
// @match               *://player.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/411825/Bilibili%20WideScreen%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/411825/Bilibili%20WideScreen%20Helper.meta.js
// ==/UserScript==

"use strict";

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

  function main() {
    const selectorList = ['[role="button"][aria-label="宽屏"]'];
    selectorList.forEach(selector => autoClickElement(selector));
  }

  main();
})();