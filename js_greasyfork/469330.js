// ==UserScript==
// @name         MZ - Link Enhancements for League and Match Pages
// @namespace    douglaskampl
// @version      2.1
// @description  Updates team links on league pages and adds missing league links to youth match pages
// @author       Douglas
// @match        https://www.managerzone.com/?p=league&type=*
// @match        https://www.managerzone.com/?p=match&sub=result&mid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469330/MZ%20-%20Link%20Enhancements%20for%20League%20and%20Match%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/469330/MZ%20-%20Link%20Enhancements%20for%20League%20and%20Match%20Pages.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const currentUrl = window.location.href;

    if (currentUrl.includes('?p=league&type=')) {
        const observer = new MutationObserver(() => {
            const leagueRows = document.querySelectorAll('.nice_table tbody tr');
            if (leagueRows.length) {
                let updatedCount = 0;
                leagueRows.forEach(row => {
                    const link = row.querySelector('a[href^="/?p=league&type="]');
                    if (link && link.href.includes('&tid=')) {
                         const teamId = link.href.match(/tid=(\d+)/)?.[1];
                         if (teamId) {
                            link.href = `https://www.managerzone.com/?p=team&tid=${teamId}`;
                            updatedCount++;
                         }
                    }
                });
                 if (updatedCount > 0 || leagueRows.length > 0) {
                     observer.disconnect();
                 }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    else if (currentUrl.includes('?p=match&sub=result&mid=')) {
        function getUniqueTeamLinks(matchInfoWrapper) {
            const allLinks = matchInfoWrapper.querySelectorAll('a[href*="/?p=team"]');
            const teamIds = new Set();
            const uniqueLinks = [];

            allLinks.forEach(link => {
                const tidMatch = link.href.match(/tid=(\d+)/);
                if (tidMatch) {
                    const tid = tidMatch[1];
                    if (!teamIds.has(tid)) {
                        teamIds.add(tid);
                        uniqueLinks.push(link);
                    }
                }
            });

            return uniqueLinks;
        }

        function extractLeagueInfo(dd) {
            const link = dd.querySelector('a');
            if (!link) return null;

            const url = link.getAttribute('href');
            if (!url) return null;

            const sidMatch = url.match(/[?&]sid=(\d+)/);
            if (!sidMatch) return null;

            return {
                name: link.textContent.trim(),
                url: url,
                sid: sidMatch[1]
            };
        }

        function findLeagueEntries(teamHtml, ageGroup) {
            const doc = new DOMParser().parseFromString(teamHtml, 'text/html');
            const teamInfo = doc.querySelector('#infoAboutTeam');
            if (!teamInfo) return [];

            return Array.from(teamInfo.querySelectorAll('dd'))
                .slice(5)
                .filter(dd => dd.textContent.includes(ageGroup))
                .map(dd => extractLeagueInfo(dd))
                .filter(info => info !== null);
        }

        async function fetchTeamPage(url) {
            try {
                const response = await fetch(url);
                return response.ok ? await response.text() : null;
            } catch { return null; }
        }

        function findMatchingLeagues(team1Leagues, team2Leagues) {
            return team1Leagues.filter(league1 =>
                team2Leagues.some(league2 => league1.sid === league2.sid)
            );
        }

        async function updateMatchHeader() {
            const matchInfoWrapper = document.querySelector('#match-info-wrapper');
            if (!matchInfoWrapper) return;

            const header = matchInfoWrapper.querySelector('h2');
            if (!header || header.textContent.trim()) return;

            const matchHeader = matchInfoWrapper.querySelector('h1');
            if (!matchHeader) return;

            const ageGroup = ['18', '21', '23'].find(age =>
                matchHeader.textContent.trim().includes(age));
            if (!ageGroup) return;

            const teamLinks = getUniqueTeamLinks(matchInfoWrapper);
            if (teamLinks.length !== 2) return;

            const team1Html = await fetchTeamPage(teamLinks[0].href);
            const team2Html = await fetchTeamPage(teamLinks[1].href);
            if (!team1Html || !team2Html) return;

            const team1Leagues = findLeagueEntries(team1Html, ageGroup);
            const team2Leagues = findLeagueEntries(team2Html, ageGroup);

            const matchingLeagues = findMatchingLeagues(team1Leagues, team2Leagues);
            if (!matchingLeagues.length) return;

            header.innerHTML = matchingLeagues.map(league => { const cleanedUrl = league.url.replace(/&tid=\d+/, ''); return `<a href="${cleanedUrl}">${league.name}</a>`; }).join(' | ');
        }

        updateMatchHeader();
    }
})();
