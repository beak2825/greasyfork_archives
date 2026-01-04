// ==UserScript==
// @name         Notion Sticky TOC (2022 Available)
// @name:zh-CN   Notion 固定左侧 TOC (2022 亲测可用)
// @namespace    https://github.com/soraliu
// @version      0.6.0
// @description  Set Notion TOC Sticky.
// @description:zh-cn TOC 左侧固定
// @author       Sora Liu<soraliu.dev@gmail.com>
// @match        https://www.notion.so/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440659/Notion%20Sticky%20TOC%20%282022%20Available%29.user.js
// @updateURL https://update.greasyfork.org/scripts/440659/Notion%20Sticky%20TOC%20%282022%20Available%29.meta.js
// ==/UserScript==

/* jshint esversion:6 */
(function() {
    'use strict';
    // selectors
    const SELECTOR_NOTION_APP = 'notion-app';
    const SELECTOR_NOTION_SCROLLER = '.notion-scroller';
    const SELECTOR_NOTION_TOC = '.notion-table_of_contents-block';
    const SELECTOR_MODAL_PAGE = '.notion-peek-renderer'; // the selector which used to check if the page is in any modal

    // toc config
    const TOC_CONFIG_WIDTH = '168px';
    const TOC_CONFIG_LEFT = '256px';

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
        };
        f();
    });

    // for performance
    const LISTENED_SELECTORS = new WeakMap();
    const addScrollListener = (selectors, fn) => {
        let lastKnownScrollPosition = 0;
        let ticking = false;

        fn(lastKnownScrollPosition); // init once

        selectors.forEach(selector => {
            if (LISTENED_SELECTORS.has(selector)) {
                return;
            }
            // set listened
            LISTENED_SELECTORS.set(selector, true);

            selector.addEventListener('scroll', function(e) {
                lastKnownScrollPosition = window.scrollY;

                if (!ticking) {
                    window.requestAnimationFrame(function() {
                        fn(lastKnownScrollPosition);
                        ticking = false;
                    });

                    ticking = true;
                }
            }, false);
        });
    };

    const callback = function(mutations) {
        waitFor(SELECTOR_NOTION_TOC).then(([el]) => {
            const toc = document.querySelector(SELECTOR_NOTION_TOC);
            const modal = document.querySelector(SELECTOR_MODAL_PAGE);
            if (!modal && toc) {
                toc.style.position = 'fixed';
                toc.style.top = '50%';
                toc.style.transform= 'translateY(-50%)';
                toc.style.zIndex = 999
                toc.style.maxHeight = 'calc(100vh - 168px)'
                toc.style.overflowY = 'auto'

                const sidebarWidth = window.innerWidth - toc.closest(SELECTOR_NOTION_SCROLLER).clientWidth
                toc.style.left = `${sidebarWidth + 16}px`;
                toc.style.width = `${(toc.closest(SELECTOR_NOTION_SCROLLER).clientWidth - 900) / 2}px`
            }
        });
    };

    const observer = new MutationObserver(callback);
    observer.observe(document.getElementById(SELECTOR_NOTION_APP), { childList: true, subtree: true } );
})();