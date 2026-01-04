// ==UserScript==
// @name         piracyHide
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hide sticky announcements content
// @author       gookie
// @match        https://piracy.vip/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478335/piracyHide.user.js
// @updateURL https://update.greasyfork.org/scripts/478335/piracyHide.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const elementsToHide = document.querySelectorAll('.cAnnouncementsContent');
    for (const element of elementsToHide) {
        element.style.display = 'none';
    }
})();