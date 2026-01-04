// ==UserScript==
// @name         Open GitHub Links in Gmail
// @namespace    https://wiki.gslin.org/wiki/Open_GitHub_Links_in_Gmail
// @version      0.20190514.0
// @description  Open all GitHub links in Gmail using "i".
// @author       Gea-Suan Lin <darkkiller@gmail.com>
// @match        https://mail.google.com/*
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/382985/Open%20GitHub%20Links%20in%20Gmail.user.js
// @updateURL https://update.greasyfork.org/scripts/382985/Open%20GitHub%20Links%20in%20Gmail.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('keydown', ev => {
        if ('i' === ev.key) {
            for (let el of document.querySelectorAll('div[role="listitem"]:first-child a[href^="https://github.com/"]')) {
                GM_openInTab(el.getAttribute('href'), true);
            }
        }
    });
})();
