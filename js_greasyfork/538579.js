// ==UserScript==
// @name         osu! remove CL and change Hit Labels
// @namespace    https://osu.ppy.sh
// @version      1.3
// @description  Changes "Great", "ok", "meh" back to 300,100,50 and removes CL mod from top plays, restores yellow rank color
// @author       MrTerror
// @match        https://osu.ppy.sh/scores/*
// @match        https://osu.ppy.sh/beatmapsets/*
// @match        https://osu.ppy.sh/community/matches/*
// @match        https://osu.ppy.sh/users/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/538579/osu%21%20remove%20CL%20and%20change%20Hit%20Labels.user.js
// @updateURL https://update.greasyfork.org/scripts/538579/osu%21%20remove%20CL%20and%20change%20Hit%20Labels.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        .beatmap-score-rank,
        .score-rank,
        [class*="score-rank"] {
            color: #f5c639 !important;
            background-color: transparent !important;
        }
        .mod--type-DifficultyIncrease {
            --type-bg-colour: #f5c639;
            --type-fg-colour: color-mix(in srgb-linear, #000, #f5c639 10%);/
            --type-extender-colour: color-mix(in srgb, #000, #f5c639 26.3%);
        }
    `;
    document.head.appendChild(style);

    // Replace hit labels (great/ok/meh → 300/100/50)
    const replacements = {
        'great': '300',
        'ok': '100',
        'meh': '50'
    };

    function replaceTextInElements(selector) {
        document.querySelectorAll(selector).forEach(el => {
            const text = el.textContent.trim().toLowerCase();
            if (replacements[text]) {
                el.textContent = replacements[text];
            }
        });
    }

    // Remove Classic (CL) mod
    function removeClassicMod() {
        document.querySelectorAll('.mod__icon--CL').forEach(mod => mod.remove());
    }

    // Run replacements and mod removal based on current page
    function processCurrentPage() {
        const url = window.location.href;

        // Handle hit label replacements
        if (url.includes('/scores/')) {
            replaceTextInElements('.score-stats__stat-row--label');
        }
        if (url.includes('/beatmapsets/')) {
            replaceTextInElements('.beatmap-score-top__stat-header');
            replaceTextInElements('.beatmap-scoreboard-table__header--hitstat');
        }
        if (url.includes('/community/matches/')) {
            replaceTextInElements('.score-stats__stat-row--label');
            replaceTextInElements('.mp-history-player-score__stat-label');
        }
        // Handle Classic mod removal
        if (url.includes('/users/')) {
            removeClassicMod();
        }
    }

    // Initial run
    processCurrentPage();

    // Delayed check to ensure changes are applied after dynamic content loads
    setTimeout(processCurrentPage, 1500);

    // Observe specific container for relevant content
    const getTargetContainer = () => (
        document.querySelector('.js-react--score-page') ||
        document.querySelector('.js-react--beatmapset-page') ||
        document.querySelector('.js-react--match-page') ||
        document.querySelector('.js-react--user-page') ||
        document.querySelector('.user-profile') ||
        document.querySelector('.score-stats') ||
        document.querySelector('.beatmap-scoreboard') ||
        document.querySelector('.score-list') ||
        document.querySelector('.js-profile-page-top-scores') ||
        document.body
    );

    let targetContainer = getTargetContainer();
    const observer = new MutationObserver(() => {
        processCurrentPage();
        const newContainer = getTargetContainer();
        if (newContainer !== targetContainer) {
            targetContainer = newContainer;
            observer.observe(targetContainer, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
        }
    });

    observer.observe(targetContainer, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

    // Update observer on navigation
    function updateObserver() {
        const newContainer = getTargetContainer();
        if (newContainer !== targetContainer) {
            targetContainer = newContainer;
            observer.observe(targetContainer, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
        }
        processCurrentPage();
        setTimeout(processCurrentPage, 1000);
    }

    // Handle navigation
    window.addEventListener('popstate', updateObserver);
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
        originalPushState.apply(this, args);
        updateObserver();
    };
    const originalReplaceState = history.replaceState;
    history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        updateObserver();
    };
})();