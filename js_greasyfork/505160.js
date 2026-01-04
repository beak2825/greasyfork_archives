// ==UserScript==
// @name         Hide standings codeforces
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Improved dark mode for Codeforces
// @author       Der_Vlapos
// @match        https://codeforces.com/contest/*
// @match        http://codeforces.com/contest/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505160/Hide%20standings%20codeforces.user.js
// @updateURL https://update.greasyfork.org/scripts/505160/Hide%20standings%20codeforces.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isContestRunning() {
        const state = document.querySelector('.contest-state-phase');
        if (state && (state.textContent.includes('Соревнование идет') || state.textContent.includes('Contest is running'))) {
            return true;
        }
        return false;
    }

    function hideHowManySolved() {
        const rows = document.querySelectorAll('.problems tr');
        rows.forEach(row => {
            const tds = row.querySelectorAll('td:nth-child(4)');
            tds.forEach(td => {
                const links = td.querySelectorAll('a');
                links.forEach(link => {
                    link.style.display = 'none';
                });
            });
        });
    }

    function hideStandingsButton() {
        const lists = document.querySelectorAll('ul.second-level-menu-list');
        lists.forEach(list => {
            const items = list.querySelectorAll('li');
            items.forEach(item => {
                const link = item.querySelector('a');
                if (link && (link.textContent.includes('Standings') || link.textContent.includes('Положение'))) {
                    item.style.display = 'none';
                }
            });
        });
    }


    if (isContestRunning()) {
        hideHowManySolved();
        hideStandingsButton();
    }
})();