// ==UserScript==
// @name         Notion Fixed TOC
// @name:zh-CN   Notion 浮动 TOC
// @namespace    https://notion.cx/
// @version      0.2.0
// @description  Make Notion TOC Fixed.
// @description:zh-cn 让 Notion 的 TOC 浮动显示。
// @author       Ruter Lü
// @match        https://www.notion.so/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406498/Notion%20Fixed%20TOC.user.js
// @updateURL https://update.greasyfork.org/scripts/406498/Notion%20Fixed%20TOC.meta.js
// ==/UserScript==

(function() {
    'use strict';

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
                toc_p.style.maxHeight = '50vh';
            }
        });
    };
    const observer = new MutationObserver(callback);
    let notionApp = document.getElementById('notion-app');
    const config = { childList: true, subtree: true };
    observer.observe(notionApp, config);
})();