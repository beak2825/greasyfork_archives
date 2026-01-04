// ==UserScript==
// @name         B站去除高赞弹幕标识
// @namespace    _s7util__
// @version      0.5.11
// @description  去掉B站弹幕的高赞标识
// @author       shc0743
// @grant        none
// @license      GPL-3.0
// @run-at       document-start
// @match        http*://*.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/470230/B%E7%AB%99%E5%8E%BB%E9%99%A4%E9%AB%98%E8%B5%9E%E5%BC%B9%E5%B9%95%E6%A0%87%E8%AF%86.user.js
// @updateURL https://update.greasyfork.org/scripts/470230/B%E7%AB%99%E5%8E%BB%E9%99%A4%E9%AB%98%E8%B5%9E%E5%BC%B9%E5%B9%95%E6%A0%87%E8%AF%86.meta.js
// ==/UserScript==

(function () {
    const cssText = `
    .bpx-player-row-dm-wrap .bili-high-icon {
        display: none !important;
    }
    `;
   try {
       // 新方法
       const css = new CSSStyleSheet();
       css.replace(cssText);
       document.adoptedStyleSheets.push(css);
   } catch (error) {
       // fallback
       const css = document.createElement('style');
       css.innerHTML = cssText;
       try {
            (document.head || document.documentElement).append(css);
       } catch (error) {
           (document.head || document.documentElement).appendChild(css);
       }
   }
}())