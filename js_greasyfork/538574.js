// ==UserScript==
// @name         osu! Replace Hit Labels (Great/Ok/Meh → 300/100/50)
// @namespace    https://osu.ppy.sh
// @version      1.2
// @description  Zamienia "great", "ok", "meh" na "300", "100", "50" na wynikach, beatmapach i meczach w osu!
// @author       (you)
// @match        https://osu.ppy.sh/scores/*
// @match        https://osu.ppy.sh/beatmapsets/*
// @match        https://osu.ppy.sh/community/matches/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/538574/osu%21%20Replace%20Hit%20Labels%20%28GreatOkMeh%20%E2%86%92%2030010050%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538574/osu%21%20Replace%20Hit%20Labels%20%28GreatOkMeh%20%E2%86%92%2030010050%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const replacements = {
        'great': '300',
        'ok': '100',
        'meh': '50',
    };

    function replaceTextInElements(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            const text = el.textContent.trim().toLowerCase();
            if (replacements[text]) {
                el.textContent = replacements[text];
            }
        });
    }

    function runReplacementsForCurrentPage() {
        const url = window.location.href;

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
    }

    // Initial run
    runReplacementsForCurrentPage();

    // Re-run on dynamic content load
    const observer = new MutationObserver(() => {
        runReplacementsForCurrentPage();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Handle back/forward navigation
    window.addEventListener('popstate', () => {
        // Small delay to ensure DOM is fully loaded after navigation
        setTimeout(runReplacementsForCurrentPage, 100);
    });
})();