// ==UserScript==
// @name         Restore original links in outlook / stop safelinks
// @description  Outlook is wrapping all links in emails with their own server. undo that and restore the original links.
// @description:en  It is annoying when Outlook is wrapping all links in emails with their own server. undo that and restore the original links.
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      2025-08-27
// @author       Oria
// @match        https://outlook.office.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547462/Restore%20original%20links%20in%20outlook%20%20stop%20safelinks.user.js
// @updateURL https://update.greasyfork.org/scripts/547462/Restore%20original%20links%20in%20outlook%20%20stop%20safelinks.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function magic() {
        [...document.querySelectorAll("[originalsrc][href]")].forEach(
        (e) => {
            e.href=e.getAttribute("originalsrc");
            e.removeAttribute("originalsrc");
        });
    }
    setInterval(magic,400);
})();