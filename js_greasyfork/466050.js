// ==UserScript==
// @name         Notion去除不可编辑提示
// @version      0.0.3
// @namespace http://tampermonkey.net/undefined
// @description  去除不可编辑提示
// @author       bynhack
// @match        *://www.notion.so/*
// @match        *://*.notion.site/*
// @copyright    202, reamd7
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466050/Notion%E5%8E%BB%E9%99%A4%E4%B8%8D%E5%8F%AF%E7%BC%96%E8%BE%91%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/466050/Notion%E5%8E%BB%E9%99%A4%E4%B8%8D%E5%8F%AF%E7%BC%96%E8%BE%91%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";
  /* Helper function to wait for the element ready */
    const waitFor = (...selectors) => new Promise(resolve => {
        const delay = 500;
        const f = () => {
            const elements = selectors.map(selector => document.querySelector(selector));
            if (elements.every(element => element != null)) {
                resolve(elements);
            } else {
                setTimeout(f, delay);
            }
        }
        f();
    });
    waitFor('div.notion-topbar').then(([el]) => {
        // let pageContent = document.querySelector('div.notion-page-content');
        var notionTopbar = document.querySelector(".notion-topbar");
        console.log(notionTopbar)
        var siblingElement = notionTopbar.nextElementSibling;
        siblingElement.style.display = "none";
    });
    /* Helper function to wait for the element ready */


})()
