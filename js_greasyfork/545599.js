// ==UserScript==
// @name         Zed.city Hide All Stats
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hide all user stats containers on Zed.city and its subdomains
// @author       ChatGPT
// @match        *http://*zed.city/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545599/Zedcity%20Hide%20All%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/545599/Zedcity%20Hide%20All%20Stats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        const keywords = [
            'stat', 'stats', 'user-info', 'user-stats', 'profile-stats', 'userpanel', 'sidebar'
        ];

        keywords.forEach(keyword => {
            document.querySelectorAll(`[class*="${keyword}"]`).forEach(el => {
                el.style.display = 'none';
            });
            document.querySelectorAll(`[id*="${keyword}"]`).forEach(el => {
                el.style.display = 'none';
            });
        });

        document.querySelectorAll('[data-stat]').forEach(el => {
            el.style.display = 'none';
        });
    });
})();
