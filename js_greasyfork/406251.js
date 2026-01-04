// ==UserScript==
// @name         Notion Page Words Counter
// @name:zh-CN   Notion 页面字数统计
// @namespace    https://notion.cx/
// @version      0.1.0
// @description  Count current page words.
// @description:zh-cn 统计当前页面的字数。
// @author       Ruter Lü
// @match        https://www.notion.so/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406251/Notion%20Page%20Words%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/406251/Notion%20Page%20Words%20Counter.meta.js
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

    /* Word Count Function */
    let pattern = /[a-zA-Z0-9_\u0392-\u03c9\u00c0-\u00ff\u0600-\u06ff\u0400-\u04ff]+|[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g;

    function wordCount(str) {
        let m = str.match(pattern);
        let count = 0;
        if (!m) {
            return 0;
        }
        for (let i = 0; i < m.length; i++) {
            if (m[i].charCodeAt(0) >= 0x4e00) {
                count += m[i].length;
            } else {
                count += 1;
            }
        }
        return count;
    };
    /* Word Count Function */

    /* Word Count Element */
    const countCss = '-webkit-user-select: none; cursor: auto; position: absolute; display: flex; align-items: center; justify-content: center; bottom: 0px; right: 32px; height: 32px; font-size: 12px; z-index: 100; opacity: 1; background-position: initial initial; background-repeat: initial initial;';
    const countEl = document.createElement('div');
    countEl.setAttribute('class', 'notion-word-count');
    countEl.style.cssText = countCss;
    countEl.innerHTML = 'Word count: <span class="notion-word-counter">0</span>';
    /* Word Count Element */

    /* Word Count Observer */
    let isCounterSet = false;
    let oldHref = '';
    let callback = function(mutations) {
        if (oldHref != document.location.href) {
            oldHref = document.location.href;
            const pageObserver = new MutationObserver(() => {
                const firstContent = document.querySelector('div.notion-page-content');
                // Whether if the word count element was set
                if (firstContent) {
                    if (!isCounterSet) {
                        isCounterSet = true;
                        const helpBtn = document.querySelector('div.notion-help-button');
                        helpBtn.after(countEl);
                    }
                    countEl.children[0].innerText = wordCount(firstContent.innerText);
                }
            });
            waitFor('div.notion-page-content').then(([el]) => {
                let pageContent = document.querySelector('div.notion-page-content');
                pageObserver.observe(pageContent, { childList: true, subtree: true, characterData: true });
            });
        }
    };
    const observer = new MutationObserver(callback);
    // Start observe
    waitFor('div.notion-page-content').then(([el]) => {
        // let pageContent = document.querySelector('div.notion-page-content');
        let notionApp = document.getElementById('notion-app');
        const config = { childList: true, subtree: true };
        observer.observe(notionApp, config);
    });
    /* Word Count Observer */
})();