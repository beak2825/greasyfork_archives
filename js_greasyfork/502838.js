// ==UserScript==
// @name         Swap 3dmm.com Footer Buttons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Swaps the "Mark as read" and "Show banned" buttons on 3dmm.com's main page
// @author       Plopilpy
// @match        https://*.3dmm.com/*
// @icon         https://*.3dmm.com/favicon_3dmmcom_logo.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502838/Swap%203dmmcom%20Footer%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/502838/Swap%203dmmcom%20Footer%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var footer, showBanned, markRead, forumLeads;
    markRead = document.querySelector(`.tfoot a[href="forumdisplay.php?do=markread"]`);
    showBanned = document.querySelector(`.tfoot a[href="showbans.php"]`);
    forumLeads = document.querySelector(`.tfoot a[href="showgroups.php"]`);
    footer = markRead.parentNode;
    console.log(markRead)
    console.log(showBanned)
    footer.insertBefore(showBanned, markRead)
    footer.insertBefore(forumLeads, markRead)
    showBanned.style.marginRight = "10px"
    forumLeads.style.marginRight = "10px"
})();