// ==UserScript==
// @name         Twitter remove content warning
// @name:zh-CN   Twitter 移除内容警告
// @name:zh-TW   Twitter 移除内容警告
// @icon         https://twitter.com/favicon.ico
// @namespace    https://github.com/Tsuk1ko
// @version      1.0.2
// @description        Remove twitter content warning
// @description:zh-CN  移除 twitter 的敏感内容警告
// @description:zh-TW  移除 twitter 的敏感内容警告
// @author       神代綺凛
// @include      https://x.com/*
// @include      https://twitter.com/*
// @include      https://mobile.twitter.com/*
// @license      MIT
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/492352/Twitter%20remove%20content%20warning.user.js
// @updateURL https://update.greasyfork.org/scripts/492352/Twitter%20remove%20content%20warning.meta.js
// ==/UserScript==

(async () => {
  'use strict';

  const css = (strings, ...values) => GM_addStyle(String.raw({ raw: strings }, ...values));

  /**
   * @template {Function} T
   * @param {T} func
   * @param {number} timeout
   * @returns {ReturnType<T>}
   */
  const waitValue = (func, timeout = 10000) =>
    new Promise((resolve, reject) => {
      const val = func();
      if (val) {
        resolve(val);
        return;
      }
      const timeoutTimer = setTimeout(() => {
        clearInterval(timer);
        reject();
      }, timeout);
      const timer = setInterval(() => {
        const val = func();
        if (val) {
          clearTimeout(timeoutTimer);
          clearInterval(timer);
          resolve(val);
        }
      }, 500);
    });

  const findBlurCssRule = () => {
    for (const ss of document.styleSheets) {
      for (const rule of ss.cssRules) {
        if (!(rule instanceof CSSStyleRule)) continue;
        if (rule.style.filter === 'blur(30px)') {
          return rule;
        }
      }
    }
  };

  const rule = await waitValue(findBlurCssRule);
  if (!rule) {
    console.warn('[trcw] css rule not found');
    return;
  }

  css`
    ${rule.selectorText} {
      filter: none !important;
    }
    ${rule.selectorText} + div {
      display: none !important;
    }
  `;

  console.log('[trcw] done', rule.selectorText);
})();
