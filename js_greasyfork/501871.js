// ==UserScript==
// @name         Remove Overflow Hidden
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove overflow: hidden style from body on 123.com
// @author       Your Name
// @match        *://*.yyk07.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501871/Remove%20Overflow%20Hidden.user.js
// @updateURL https://update.greasyfork.org/scripts/501871/Remove%20Overflow%20Hidden.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function removeOverflowHidden() {
        var body = document.querySelector('body[style*="overflow: hidden;"]');
        if (body) {
            body.style.overflow = '';
           // clearInterval(checkInterval);
        }
    }

    // Run the function every 500ms until the condition is met
    var checkInterval = setInterval(removeOverflowHidden, 500);
})();