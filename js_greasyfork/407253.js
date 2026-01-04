// ==UserScript==
// @name         Reddit - Remove email verification banner.
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       erjb
// @match        https://www.reddit.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/407253/Reddit%20-%20Remove%20email%20verification%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/407253/Reddit%20-%20Remove%20email%20verification%20banner.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeBanner() {
        const selectors = ['.kEQVd8aneM1tVkcIKUyDT', '#POPUP_CONTAINER'];
        selectors.forEach(selector => {
            if (document.querySelector(selector)) {
            if (document.querySelector(selector).parentElement.children) {
                if (
                     document.querySelector(selector).textContent.includes('Verify your email') ||
                     document.querySelector(selector).textContent.includes('Emailadresse hinzu')
                ) {
                    document.querySelector(selector).remove();
                    clearInterval(interval);
                }
            }
        }
       });
    }
    var interval = setInterval(removeBanner, 1000);
})();