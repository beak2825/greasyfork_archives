// ==UserScript==
// @name         Leetcode Question Difficulty Hider
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide the difficulty tag on a leetcode question page with a reveal option.
// @author       DoubleX
// @match        https://leetcode.com/problems/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496002/Leetcode%20Question%20Difficulty%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/496002/Leetcode%20Question%20Difficulty%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

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

    function revealDiff(selector, diffcolor, difftext) {
        waitForElm(selector).then((ele) => {
            ele.style.backgroundColor = "black";
            ele.style.color = "white";
            ele.innerText = "Reveal";
            ele.style.cursor = "pointer";
            ele.toggled = false;
            ele.onclick = (e) => {
                if (ele.toggled) {
                    ele.style.backgroundColor = "black";
                    ele.style.color = "white";
                    ele.innerText = "Reveal";
                    ele.toggled = false;
                }
                else {
                    ele.style.backgroundColor = "var(--fill-secondary)";
                    ele.style.color = diffcolor;
                    ele.innerText = difftext;
                    ele.toggled = true;
                }
            }
        });
    }

    function setup(){
        revealDiff(".text-difficulty-hard", "var(--difficulty-hard)", "Hard");
        revealDiff(".text-difficulty-medium", "var(--difficulty-medium)", "Medium");
        revealDiff(".text-difficulty-easy", "var(--difficulty-easy)", "Easy");
    };

    if (document.readyState !== 'loading') {
        setup();
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            setup();
        });
    }
})();