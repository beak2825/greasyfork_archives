// ==UserScript==
// @name        Mangahub Page Cleaner
// @author      Totem#0001
// @description Automatically removes spaces between pages caused by page count (e.g. 1/10, 2/10, 3/10 below each image) on Mangahub.io
// @match       *://*.mangahub.io/*
// @run-at      document-end
// @version     1.0.0
// @grant       none
// @require     http://code.jquery.com/jquery-3.4.1.min.js
// @license     Creative Commons Attribution 4.0 International Public License; http://creativecommons.org/licenses/by/4.0/
// @namespace https://greasyfork.org/users/1078112
// @downloadURL https://update.greasyfork.org/scripts/467287/Mangahub%20Page%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/467287/Mangahub%20Page%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.jQuery;
    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    waitForElm('._3w1ww').then((elm) => {
        $('._3w1ww').each(function() {
            this.remove()
        })
    });

    setInterval(function() {
        $('._3w1ww').each(function() {
            this.remove()
        })
    }, 100);
})();