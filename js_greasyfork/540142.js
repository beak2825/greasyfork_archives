// ==UserScript==
// @name         Blank Page on Specific URL
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Delete all content from a specific page
// @match        https://www.reddit.com/r/all/
// @match        https://www.instagram.com/
// @match        https://www.facebook.com/
// @match        https://www.businessinsider.com/
// @match        https://apnews.com/
// @match        https://reuters.com/
// @match        https://x.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540142/Blank%20Page%20on%20Specific%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/540142/Blank%20Page%20on%20Specific%20URL.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.documentElement.innerHTML = '';
    document.documentElement.style.backgroundColor = 'black';
})();
