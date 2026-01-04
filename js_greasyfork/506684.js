// ==UserScript==
// @name         E-Z Auto Expand
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically Open Panels on E-Z's Dashboard
// @author       Pnda (+https://e-z.bio/pnda, +https://greasyfork.org/en/users/1362722-pnda)
// @match        *://e-z.gg/*
// @match        *://e-z.host/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-z.gg
// @license      MIT
// @charset      UTF-8
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506684/E-Z%20Auto%20Expand.user.js
// @updateURL https://update.greasyfork.org/scripts/506684/E-Z%20Auto%20Expand.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * MIT License
     * 
     * Copyright (c) 2024 Pnda (+https://e-z.bio/pnda). All rights reserved.
     * 
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     * 
     * The above copyright notice and this permission notice shall be included in all
     * copies or substantial portions of the Software.
     * 
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
     * SOFTWARE.
     */

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    function expandPanels() {
        waitForElm('.p-4.items-center.justify-between.w-full.flex-row.flex').then(() => {
            const btns = document.querySelectorAll('.p-4.items-center.justify-between.w-full.flex-row.flex');
            if (btns.length) {
                btns.forEach(element => {
                    if (!element.classList.contains('expanded')) {
                        element.click();
                        element.classList.add('expanded');
                    }
                });
            }
        });
    }

    expandPanels();

    function observeUrlChanges() {
        let oldHref = document.location.href;

        const observer = new MutationObserver(() => {
            if (oldHref !== document.location.href) {
                oldHref = document.location.href;
                setTimeout(expandPanels, 100);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        window.addEventListener('popstate', () => {
            setTimeout(expandPanels, 100);
        });

        const originalPushState = history.pushState;
        history.pushState = function () {
            originalPushState.apply(this, arguments);
            setTimeout(expandPanels, 100);
        };

        const originalReplaceState = history.replaceState;
        history.replaceState = function () {
            originalReplaceState.apply(this, arguments);
            setTimeout(expandPanels, 100);
        };
    }

    observeUrlChanges();

})();
