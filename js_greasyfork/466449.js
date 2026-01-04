// ==UserScript==
// @name         Tab Icon and Name Changer
// @version      3.0
// @description  Allows you to change the tab icon and name
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @license MIT
// @namespace http://your-namespace.com
// @downloadURL https://update.greasyfork.org/scripts/466449/Tab%20Icon%20and%20Name%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/466449/Tab%20Icon%20and%20Name%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to change the tab icon
    function changeTabIcon(iconUrl) {
        const link = document.querySelector("link[rel*='icon']");
        if (link) {
            link.href = iconUrl;
        } else {
            const newLink = document.createElement('link');
            newLink.rel = 'icon';
            newLink.href = iconUrl;
            document.head.appendChild(newLink);
        }
    }

    // Function to change the tab title
    function changeTabTitle(newTitle) {
        document.title = newTitle;
    }

    // Create menu button in Tampermonkey menu
    GM_registerMenuCommand("Tab Icon and Name Changer", function() {
        const iconUrl = prompt("Enter the URL of the new tab icon:");
        if (iconUrl) {
            changeTabIcon(iconUrl);
        }

        const newTitle = prompt("Enter the new tab title:");
        if (newTitle) {
            changeTabTitle(newTitle);
        }
    });
})();
