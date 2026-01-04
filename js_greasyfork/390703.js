// ==UserScript==
// @name         Erogedownload link scrapper
// @namespace    https://greasyfork.org/en/users/381705-takase1121
// @version      1.0
// @description  Scrape free download links from Erogedownload and put them into your clipboard
// @author       Takase
// @match        *://erogedownload.com/downloads/*
// @grant      GM_registerMenuCommand
// @grant      GM_setClipboard
// @grant      GM_notification
// @downloadURL https://update.greasyfork.org/scripts/390703/Erogedownload%20link%20scrapper.user.js
// @updateURL https://update.greasyfork.org/scripts/390703/Erogedownload%20link%20scrapper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_registerMenuCommand('Copy links to clipboard', function() {
        // select the proper download div
        var links = Array.prototype.slice.call(document.querySelector('div[data-title="Free download"]').children);
        var filteredLinks = [];
        for (var i = 0; i < links.length; i++) {
            if (links[i].nodeName !== 'A') continue;
            filteredLinks.push(links[i].href);
        }
        GM_setClipboard(filteredLinks.join('\n'), 'text');
        GM_notification(filteredLinks.length + ' link' + (links.length > 1 ? 's are' : ' is') + ' copied to clipboard', 'Links copied to clipboard');
    })
})();