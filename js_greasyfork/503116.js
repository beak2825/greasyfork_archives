// ==UserScript==
// @name         Reddit - Remove "See Reddit in..." for Mobile
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove that pesky shit. Bye bye.
// @author       Threeskimo
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503116/Reddit%20-%20Remove%20%22See%20Reddit%20in%22%20for%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/503116/Reddit%20-%20Remove%20%22See%20Reddit%20in%22%20for%20Mobile.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        let button = document.getElementById('secondary-button');
        if (button) {
            button.click();
        }
    }, 500);
})();