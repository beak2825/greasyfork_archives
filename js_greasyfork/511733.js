// ==UserScript==
// @name         Auto Fix Hidden Content and Remove All Signup Prompts from Daily Mail
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Automatically remove max-height, overflow hidden, and remove subscription pop-ups
// @author       Simpson
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511733/Auto%20Fix%20Hidden%20Content%20and%20Remove%20All%20Signup%20Prompts%20from%20Daily%20Mail.user.js
// @updateURL https://update.greasyfork.org/scripts/511733/Auto%20Fix%20Hidden%20Content%20and%20Remove%20All%20Signup%20Prompts%20from%20Daily%20Mail.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        // Fix hidden content
        document.querySelectorAll('[itemprop="articleBody"]').forEach(function(element) {
            element.style.maxHeight = 'none';
            element.style.overflow = 'visible';
        });

        // Remove subscription popup and the top strip text
        let signupPrompt = document.querySelector('.signUpInner-D8IiK');
        if (signupPrompt) {
            signupPrompt.remove();
        }

        let signupTopStrip = document.querySelector('.signUpTopStripText-19DC9c');
        if (signupTopStrip) {
            signupTopStrip.remove();
        }
    });
})();
