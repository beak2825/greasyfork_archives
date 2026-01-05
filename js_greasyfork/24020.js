// ==UserScript==
// @name         Unfilter web pages
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Just disable for web pages which roughly use CSS filter to the websites, update @match may needed to suit you personal usage.
// @author       anonymous
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24020/Unfilter%20web%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/24020/Unfilter%20web%20pages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.body.style.filter = 'none';
    document.getElementsByTagName('html')[0].style.filter = 'none';
})();