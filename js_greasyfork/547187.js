// ==UserScript==
// @name         MZ - Badges & Flags
// @namespace    douglaskampl
// @version      2.0
// @description  Adds team badges and country flags to league and cup tables
// @author       Douglas
// @match        https://www.managerzone.com/?p=league*
// @match        https://www.managerzone.com/?p=friendlyseries*
// @match        https://www.managerzone.com/?p=private_cup*
// @match        https://www.managerzone.com/?p=cup*
// @match        https://www.managerzone.com/?p=match&sub=played
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547187/MZ%20-%20Badges%20%20Flags.user.js
// @updateURL https://update.greasyfork.org/scripts/547187/MZ%20-%20Badges%20%20Flags.meta.js
// ==/UserScript==

(() => {
    'use strict';

    /**
     * Configuration for script features.
     * @type {{showBadges: boolean, showFlags: boolean}}
     */
    const config = {
        showBadges: true,
        showFlags: true
    };

    /**
     * Fetches the country code for a given team ID from the ManagerZone API.
     * @param {string} teamId The ID of the team.
     * @returns {Promise<string|null>} A promise that resolves to the two-letter country code or null if an error occurs.
     */
    const getCountryCode = async (teamId) => {
        try {
            const response = await fetch(`https://www.managerzone.com/xml/manager_data.php?sport_id=1&team_id=${teamId}`);
            if (!response.ok) {
                throw new Error(`HTTP error status: ${response.status}`);
            }
            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "application/xml");
            const userData = xmlDoc.querySelector('UserData');

            if (userData) {
                const countryShortname = userData.getAttribute('countryShortname');
                if (countryShortname) {
                    return countryShortname;
                }
            }
            return null;
        } catch (error) {
            console.error(`[MZ-B&F] Failed to fetch country for team ID ${teamId}:`, error);
            return null;
        }
    };

    /**
     * Creates and configures a team badge image element.
     * @param {string} teamId The ID of the team.
     * @returns {HTMLImageElement} The configured image element for the badge.
     */
    const createBadgeElement = (teamId) => {
        const badgeImg = document.createElement('img');
        badgeImg.src = `https://www.managerzone.com/dynimg/badge.php?team_id=${teamId}&sport=soccer&location=team_main`;
        badgeImg.width = 10;
        badgeImg.height = 15;
        badgeImg.className = 'mz-enhancer-badge';
        badgeImg.style.marginRight = '4px';
        badgeImg.style.verticalAlign = 'middle';
        return badgeImg;
    };

    /**
     * Creates and configures a flag image element.
     * @param {string} countryCode The two-letter country code.
     * @returns {HTMLImageElement} The configured image element for the flag.
     */
    const createFlagElement = (countryCode) => {
        const flagImg = document.createElement('img');
        flagImg.src = `https://www.managerzone.com/img/flags/12/${countryCode.toLowerCase()}.png`;
        flagImg.width = 12;
        flagImg.height = 12;
        flagImg.title = countryCode;
        flagImg.className = 'mz-enhancer-flag';
        flagImg.style.marginRight = '4px';
        flagImg.style.verticalAlign = 'middle';
        return flagImg;
    };

    /**
     * Adds a team badge before the specified team link element if it doesn't already exist.
     * @param {HTMLAnchorElement} teamLink The team anchor element.
     * @param {string} teamId The ID of the team.
     */
    const addBadge = (teamLink, teamId) => {
        if (!config.showBadges || teamLink.previousElementSibling?.classList.contains('mz-enhancer-badge')) {
            return;
        }
        const badgeElement = createBadgeElement(teamId);
        teamLink.before(badgeElement);
    };

    /**
     * Fetches and adds a country flag to the specified table cell if it doesn't already exist.
     * @param {HTMLTableCellElement} teamCell The table cell containing the team link.
     * @param {string} teamId The ID of the team.
     */
    const addFlag = async (teamCell, teamId) => {
        if (!config.showFlags || teamCell.querySelector('.mz-enhancer-flag')) {
            return;
        }
        const countryCode = await getCountryCode(teamId);
        if (countryCode) {
            const flagElement = createFlagElement(countryCode);
            teamCell.prepend(flagElement);
        }
    };

    /**
     * Processes a single table row to add badges and flags.
     * @param {HTMLTableRowElement} row The table row element to process.
     */
    const processTableRow = (row) => {
        const teamLink = row.querySelector('a[href*="p=team&tid="]');
        if (!teamLink) return;

        const teamCell = teamLink.closest('td');
        const urlParams = new URLSearchParams(teamLink.search);
        const teamId = urlParams.get('tid');
        const isLeaguePage = window.location.search.includes('p=league');

        if (!teamCell || !teamId) return;

        addBadge(teamLink, teamId);
        if (!isLeaguePage) {
            addFlag(teamCell, teamId);
        }
    };

    /**
     * Finds and processes all tables within a container.
     * @param {Element} container The parent element to search within.
     */
    const processTables = (container) => {
        const tables = container.matches('table.nice_table') ? [container] : container.querySelectorAll('table.nice_table');
        tables.forEach(table => {
            if (table.dataset.mzEnhanced) return;
            table.dataset.mzEnhanced = 'true';
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach((row, index) => {
                setTimeout(() => processTableRow(row), index * 100);
            });
        });
    };

    /**
     * The callback function for the MutationObserver.
     * @param {MutationRecord[]} mutationsList An array of mutations.
     */
    const observerCallback = (mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        processTables(node);
                    }
                });
            }
        }
    };

    processTables(document.body);

    const observer = new MutationObserver(observerCallback);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();