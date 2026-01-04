// ==UserScript==
// @name         FIX for "Bing Search returns to the top" !
// @namespace    http://tampermonkey.net/
// @version      0.20.1
// @description  Stop doing weird things, Bing ;)
// @author       Geekness
// @match        http*://*.bing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461790/FIX%20for%20%22Bing%20Search%20returns%20to%20the%20top%22%20%21.user.js
// @updateURL https://update.greasyfork.org/scripts/461790/FIX%20for%20%22Bing%20Search%20returns%20to%20the%20top%22%20%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Disable the scroll to top functionality
    function disableScrollToTop() {
        window.scrollTo = function(x, y) {
            if (y !== 0) {
                window.scrollTo.originalFunc(x, y);
            }
        };
        window.scrollTo.originalFunc = window.scrollTo;
    }

    // Listen for 'focus' events on the window
    window.addEventListener('focus', disableScrollToTop);
})();