// ==UserScript==
// @name         Poki Title and Favicon Changer to Smartschool
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Makes Poki look like Smartschool (title & icon)
// @author       Lowie Theuwis
// @match        https://*poki.com/*
// @icon         https://smartschool.be/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530358/Poki%20Title%20and%20Favicon%20Changer%20to%20Smartschool.user.js
// @updateURL https://update.greasyfork.org/scripts/530358/Poki%20Title%20and%20Favicon%20Changer%20to%20Smartschool.meta.js
// ==/UserScript==

(function () {
    'use strict';

window.addEventListener('load', () => {
    document.title = "Smartschool";
});

    // Replace favicon
    const newFaviconUrl = 'https://smartschool.be/favicon.ico'; // Your base64 image here

    // Remove existing favicons
    const oldIcons = document.querySelectorAll('link[rel*="icon"]');
    oldIcons.forEach(icon => icon.remove());

    // Create new favicon
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = newFaviconUrl;
    document.head.appendChild(favicon);

})();
