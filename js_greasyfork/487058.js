// ==UserScript==
// @name         [Twitter] Fix scroll
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  My very crude attempt at fixing twitter scrolling to top of page on moving back from sub-tweets.
// @author       SL1900
// @match        *://*.twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487058/%5BTwitter%5D%20Fix%20scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/487058/%5BTwitter%5D%20Fix%20scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let session_store = {};

    setInterval(()=>{
        if(window.scrollY < 50 && session_store[window.location.href] && session_store[window.location.href] > 300)
        {
            console.log(session_store[window.location.href]);
            window.scroll(window.scrollX, session_store[window.location.href]);
        }

        if(window.scrollY > 150) session_store[window.location.href] = window.scrollY;
    }, 100);
})();