// ==UserScript==
// @name         MAL Views Tracker
// @namespace    Violentmonkey Scripts
// @description  Track new views for profile, animelist, and mangalist in the My Statistics panel
// @match        https://myanimelist.net/*
// @icon         https://myanimelist.net/favicon.ico
// @grant        none
// @version      0.1.3
// @license      MIT
// @author       Sab_
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/531067/MAL%20Views%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/531067/MAL%20Views%20Tracker.meta.js
// ==/UserScript==

(function() {
    function createViewsTracker(rowText, localStorageKey) {
        // find row in my statistics div
        const row = Array.from(document.querySelectorAll('.left .my_statistics tr, .right .my_statistics tr'))
            .find(row => row.cells[0].textContent.trim() === rowText);

        if (!row) return;

        const currentViewsCell = row.cells[1];
        const currentViews = parseInt(currentViewsCell.textContent.replace(/,/g, ''), 10);

        // load previous data (default if none exists)
        const previousData = JSON.parse(
            localStorage.getItem(localStorageKey) ||
            '{"views": 0, "timestamp": 0, "lastChangeTimestamp": 0}'
        );
        const { views: previousViews, timestamp: previousTimestamp, lastChangeTimestamp } = previousData;

        const newViews = currentViews - previousViews;
        const currentTime = Date.now();

        // prevents from creating more than 1 indicator
        const existingIndicator = currentViewsCell.querySelector('.views-indicator');
        existingIndicator?.remove();

        // Self explanatory
        const indicator = document.createElement('span');
        indicator.className = 'views-indicator';
        indicator.style.marginLeft = '10px';
        indicator.style.fontWeight = 'bold';
        indicator.style.cursor = 'help';

        if (newViews > 0) {
            indicator.textContent = `+${newViews}`;
            indicator.style.color = 'green';
        } else {
            indicator.textContent = '+0';
            indicator.style.color = 'grey';
        }

        // css when hover
        const tooltip = document.createElement('div');
        tooltip.style.display = 'none';
        tooltip.style.position = 'absolute';
        tooltip.style.background = '#222';
        tooltip.style.color = 'white';
        tooltip.style.padding = '5px';
        tooltip.style.borderRadius = '3px';
        tooltip.style.zIndex = '1000';

        if (newViews > 0) {
            tooltip.textContent = `+${newViews} view${newViews !== 1 ? 's' : ''} since ${formatTimeDifference(currentTime - previousTimestamp)}`;
        } else {
            const lastViewTime = lastChangeTimestamp > 0 ? formatTimeDifference(currentTime - lastChangeTimestamp) : 'never';
            tooltip.textContent = `No new views (last view was ${lastViewTime})`;
        }

        // Show/hide tooltip on hover
        indicator.addEventListener('mouseenter', (e) => {
            tooltip.style.display = 'block';
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
            document.body.appendChild(tooltip);
        });

        indicator.addEventListener('mouseleave', () => {
            tooltip.remove();
        });

        currentViewsCell.appendChild(indicator);

        // updating
        localStorage.setItem(localStorageKey, JSON.stringify({
            views: currentViews,
            timestamp: currentTime,
            lastChangeTimestamp: newViews > 0 ? currentTime : lastChangeTimestamp
        }));
    }


    function formatTimeDifference(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days !== 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    }

    function trackAllViews() {
        createViewsTracker('Profile Views', 'mal_previous_profile_views');
        createViewsTracker('AnimeList Views', 'mal_previous_animelist_views');
        createViewsTracker('MangaList Views', 'mal_previous_mangalist_views');
    }

    // Run after page loads or instantly if already loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', trackAllViews);
    } else {
        trackAllViews();
    }
})();