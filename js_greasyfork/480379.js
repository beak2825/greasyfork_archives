// ==UserScript==
// @name         ABA Liga - Druga.aba-liga
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Skript pro Abu
// @author       Michal
// @match        https://www.aba-liga.com/match/*
// @match        https://druga.aba-liga.com/calendar/*
// @match        https://www.aba-liga.com/calendar/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480379/ABA%20Liga%20-%20Drugaaba-liga.user.js
// @updateURL https://update.greasyfork.org/scripts/480379/ABA%20Liga%20-%20Drugaaba-liga.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const rewriteUrl = () => {
        const currentUrl = window.location.href;
        const matchPattern = /https:\/\/www\.aba-liga\.com\/match\/(\d+)\/(\d+)\/(\d+)\/Teamcomp\/q1\/1\/home\/(.+?)-(.+)/;

        if (matchPattern.test(currentUrl)) {
            const delay = 1000;
            setTimeout(() => {
                const newUrl = currentUrl.replace('/match/', '/match-live/');
                history.pushState(null, '', newUrl);
            }, delay);
        }
    };

    const generateButtons = () => {
        const hiddenXSElements = document.querySelectorAll('.hidden-xs');

        hiddenXSElements.forEach(hiddenXSElement => {
            const matchLinks = hiddenXSElement.querySelectorAll('a[href*="/match/"], a[href*="/match-live/"]');

            matchLinks.forEach(link => {
                const href = link.getAttribute('href');
                const parts = href.split('/');

                const leagueId = parts[4];
                const date = parts[5];
                const round = parts[6];
                const homeTeam = parts[8].replace(/-/g, ' ');
                const awayTeam = parts[9].replace(/-/g, ' ');

                const liveURL = `https://www.aba-liga.com/match/${leagueId}/${date}/${round}/Teamcomp/q1/1/home/${homeTeam}-${awayTeam}/`;

                const button = document.createElement('a');
                button.textContent = `Live URL`;
                button.style.margin = '3px';
                button.style.width = '70px';
                button.style.padding = '5px 8px';
                button.style.cursor = 'pointer';
                button.setAttribute('href', liveURL);

                const tdScoreTable = document.createElement('td');
                tdScoreTable.classList.add('scoretable');
                tdScoreTable.style.width = '1%';
                tdScoreTable.style.whiteSpace = 'nowrap';

                tdScoreTable.appendChild(button);

                const parentRow = hiddenXSElement.closest('tr');
                if (parentRow) {
                    parentRow.insertBefore(tdScoreTable, hiddenXSElement.nextElementSibling);
                }
            });
        });
    };

    if (window.location.href.includes("druga.aba-liga.com/calendar") || window.location.href.includes("www.aba-liga.com/calendar")) {
        generateButtons();
    } else if (window.location.href.includes("www.aba-liga.com/match")) {
        rewriteUrl();
    }
})();