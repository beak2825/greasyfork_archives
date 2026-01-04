// ==UserScript==
// @name         Highlight Username in Chain Report
// @namespace    vassilios
// @version      2025-07-25
// @description  Highlight the matching username and stats row in dark green with black text in chain report list.
// @author       vassilios
// @match        https://www.torn.com/war.php?step=chainreport&chainID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/543609/Highlight%20Username%20in%20Chain%20Report.user.js
// @updateURL https://update.greasyfork.org/scripts/543609/Highlight%20Username%20in%20Chain%20Report.meta.js
// ==/UserScript==

function waitForElement(selector, callback) {
    const interval = setInterval(() => {
        const el = document.querySelector(selector);
        if (el) {
            clearInterval(interval);
            callback(el);
        }
    }, 300);
}

waitForElement('.report-members-stats-content', () => {
    const link = document.querySelector('a[href^="/profiles.php"][class^="menu-value"]');
    if (!link) return;

    const username = link.textContent.trim();

    const container = document.querySelector('.report-members-stats-content');
    const nameList = container.querySelector('ul.members-names-rows');
    if (!nameList) return;

    const nameItems = Array.from(nameList.children);
    const matchIndex = nameItems.findIndex(li => li.textContent.includes(username));

    if (matchIndex !== -1) {
        const matchedNameLi = nameItems[matchIndex];
        matchedNameLi.style.backgroundColor = '#2e7d32'; // dark green
        // Leave text color alone for the name

        // Now also highlight the stats row at the same index
        const statsList = container.querySelector('ul.members-stats-rows');
        if (statsList && statsList.children.length > matchIndex) {
            const matchedStatsLi = statsList.children[matchIndex];
            matchedStatsLi.style.backgroundColor = '#2e7d32'; // dark green

            // Make all child text black, assuming username isn't here
            matchedStatsLi.querySelectorAll('*').forEach(el => {
                el.style.color = 'black';
            });
        }
    }
});
