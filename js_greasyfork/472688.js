// ==UserScript==
// @name         Twitter Favicon
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  Restores the original Twitter favicon
// @author       ChatGPT4U
// @license      MIT
// @match        https://twitter.com/*
// @icon         https://abs.twimg.com/favicons/twitter.2.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472688/Twitter%20Favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/472688/Twitter%20Favicon.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var link = document.querySelector('link[rel="shortcut icon"]') || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'https://abs.twimg.com/favicons/twitter.2.ico'; // replace with previous favicon URL
    document.getElementsByTagName('head')[0].appendChild(link);
})();