// ==UserScript==
// @name         Remove New Roblox Colour Theme
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the new colour scheme
// @author       boiby
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522461/Remove%20New%20Roblox%20Colour%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/522461/Remove%20New%20Roblox%20Colour%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        const links = document.querySelectorAll('link[data-bundlename="ColorUpdate"]');

        links.forEach(link => {
            link.remove();
        });
    });
})();
