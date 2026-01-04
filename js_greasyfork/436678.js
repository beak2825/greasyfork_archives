// ==UserScript==
// @name         Notion Fixed TOC(removed toc scroll bar)
// @name:zh-CN   Notion 浮动 TOC(去除目录滚动条)
// @namespace    https://notion.cx/
// @version      0.2.0
// @description  Make Notion TOC Fixed and removed the scroll bar.
// @description:zh-cn 让 Notion 的 TOC 浮动显示, 并且去除目录滚动条。
// @author       Kevin Axel
// @match        https://www.notion.so/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436678/Notion%20Fixed%20TOC%28removed%20toc%20scroll%20bar%29.user.js
// @updateURL https://update.greasyfork.org/scripts/436678/Notion%20Fixed%20TOC%28removed%20toc%20scroll%20bar%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let addRule = (function (style) {
        let sheet = document.head.appendChild(style).sheet;
        return function (selector, css) {
            let propText = typeof css === "string" ? css : Object.keys(css).map(function (p) {
                return p + ":" + (p === "content" ? "'" + css[p] + "'" : css[p]);
            }).join(";");
            sheet.insertRule(selector + "{" + propText + "}", sheet.cssRules.length);
        };
    })(document.createElement("style"));

    addRule(".hidden-scrollbar::-webkit-scrollbar", {
        width: '0px'
    });

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
    /* Helper function to wait for the element ready */

    let callback = function(mutations) {
        waitFor('.notion-table_of_contents-block').then(([el]) => {
            const toc = document.querySelector('.notion-table_of_contents-block');
            if (toc) {
                const toc_p = toc.parentElement;
                if (!toc_p.classList.contains('notion-column-block')) {
                    return;
                }

                toc_p.style.position = 'sticky';
                toc_p.style.top = '0';
                toc_p.style.overflowY = 'scroll';
                toc_p.style.maxHeight = '90vh';

                // hidden scrollbar
                toc_p.id = 'hidden_scrollbar';
                document.getElementById("hidden_scrollbar").classList.add('hidden-scrollbar');
            }
        });
    };
    const observer = new MutationObserver(callback);
    let notionApp = document.getElementById('notion-app');
    const config = { childList: true, subtree: true };
    observer.observe(notionApp, config);
})();