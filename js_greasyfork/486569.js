// ==UserScript==
// @name         Wayback Machine
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add context menu option to open links in the latest archive on the Wayback Machine
// @author       sfortis
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486569/Wayback%20Machine.user.js
// @updateURL https://update.greasyfork.org/scripts/486569/Wayback%20Machine.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastRightClickedElement = null;

    document.addEventListener('contextmenu', function(event) {
        lastRightClickedElement = event.target.closest('a'); // Capture the right-clicked link element
    }, true);

    GM_registerMenuCommand("Open in Wayback Machine", function() {
        if (lastRightClickedElement && lastRightClickedElement.href) {
            const waybackUrl = `https://web.archive.org/web/2/${lastRightClickedElement.href}`; // "2" redirects to the latest archive
            GM_openInTab(waybackUrl, { active: true });
        }
    });
})();
