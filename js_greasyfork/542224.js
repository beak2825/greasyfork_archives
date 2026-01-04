// ==UserScript==
// @name         Fans/Watched Ratio - Letterboxd
// @namespace    https://greasyfork.org/users/
// @version      1.0
// @description  Calculates and appends the fans-to-watched percentage once elements are available.
// @author       -
// @match        https://letterboxd.com/film/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542224/FansWatched%20Ratio%20-%20Letterboxd.user.js
// @updateURL https://update.greasyfork.org/scripts/542224/FansWatched%20Ratio%20-%20Letterboxd.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function parseNumber(text) {
        if (!text) return 0;
        console.log('Parsing number from text:', text);

        text = text
            .replace(/&nbsp;/g, ' ')
            .replace(/Watched by /i, '')
            .replace(/members?/i, '')
            .replace(/fans/i, '')
            .replace(/\s+/g, '')
            .toUpperCase();

        console.log('Cleaned text:', text);

        if (text.includes('K')) return parseFloat(text.replace('K', '')) * 1000;
        if (text.includes('M')) return parseFloat(text.replace('M', '')) * 1000000;

        const parsed = parseFloat(text.replace(/[^0-9.]/g, '')) || 0;
        console.log('Parsed number:', parsed);
        return parsed;
    }

    function tryInject() {
        console.log('Running tryInject...');
        const fansElement = document.querySelector('a[href*="/fans/"]');
        const watchedElement = document.querySelector('a.tooltip[href*="/members/"]');
        const span = document.querySelector('span.name.js-widont.prettify');

        console.log('fansElement:', fansElement);
        console.log('watchedElement:', watchedElement);
        console.log('span:', span);

        if (fansElement && watchedElement && span && !span.dataset.ratioInjected) {
            const fansText = fansElement.textContent.trim();
            const watchedAttr = watchedElement.getAttribute('data-original-title');

            console.log('fansText:', fansText);
            console.log('watchedAttr:', watchedAttr);

            const fans = parseNumber(fansText);
            const watched = parseNumber(watchedAttr);

            console.log('Parsed fans:', fans);
            console.log('Parsed watched:', watched);

            if (fans && watched && watched !== 0) {
                const ratio = fans / watched;
                const percentage = (ratio * 100).toFixed(2);
                console.log(`Calculated ratio: ${ratio} (${percentage}%)`);

                span.textContent += ` (${percentage}%)`;
                span.dataset.ratioInjected = 'true';
                console.log('Injected percentage into span.');
            } else {
                console.warn('Could not calculate ratio - invalid numbers');
            }
        }
    }

    // Run immediately and set up observer
    console.log('Script loaded, attempting initial injection...');
    tryInject();

    const observer = new MutationObserver((mutations) => {
        console.log('DOM mutation observed, re-running tryInject...');
        tryInject();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
