// ==UserScript==
// @name         ADN display episode release dates
// @version      1.1
// @description  Fetches season API to show release dates of episodes.
// @match        https://animationdigitalnetwork.com/*/video/*
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/1493482
// @downloadURL https://update.greasyfork.org/scripts/542200/ADN%20display%20episode%20release%20dates.user.js
// @updateURL https://update.greasyfork.org/scripts/542200/ADN%20display%20episode%20release%20dates.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function onUrlChange(callback) {
        let currentUrl = location.href;
        const observer = new MutationObserver(() => {
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                callback();
            }
        });
        observer.observe(document, { subtree: true, childList: true });
        callback();
    }

    function showReleaseDates() {
        const showMatch = location.pathname.match(/\/video\/(\d+)-/);
        const langMatch = location.pathname.match(/^\/([a-z]{2})\//);

        if (!showMatch) return;

        const showId = showMatch[1];
        const distribution = langMatch ? langMatch[1] : 'fr'; // fallback 'fr'
        const apiUrl = `https://gw.api.animationdigitalnetwork.com/video/show/${showId}?limit=50&offset=0&order=asc&season=`;

        fetch(apiUrl, {
            headers: {
                'Accept': 'application/json',
                'x-target-distribution': distribution
            }
        })
            .then(res => res.json())
            .then(data => {
                if (!data.videos) return;

                const releaseMap = new Map();
                for (const ep of data.videos) {
                    if (ep.releaseDate) {
                        const date = new Date(ep.releaseDate);
                        const formatted = date.toLocaleDateString(navigator.languages?.[0] || navigator.language || distribution + '-' + distribution.toUpperCase(), {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                        releaseMap.set(ep.urlPath, formatted);
                    }
                }

                const tryInsert = () => {
                    document.querySelectorAll(`a[href^="/${distribution}/video/"]`).forEach((link) => {
                        const epPath = link.getAttribute('href');
                        if (!epPath || !releaseMap.has(epPath)) return;
                        if (link.querySelector('.release-date-insert')) return;

                        const titleContainer = link.querySelector('h3');
                        if (titleContainer) {
                            const span = document.createElement('div');
                            span.className = 'release-date-insert';
                            span.style.fontSize = '1.2em';
                            span.style.opacity = '0.8';
                            span.style.marginTop = '0.2em';
                            span.textContent = `🗓️ ${releaseMap.get(epPath)}`;
                            titleContainer.parentElement?.appendChild(span);
                        }
                    });
                };

                for (let i = 0; i < 10; i++) {
                    setTimeout(tryInsert, i * 1000);
                }
            })
            .catch(err => console.error('display episode release dates error: ', err));
    }

    onUrlChange(() => {
        if (location.pathname.includes('/video/')) {
            showReleaseDates();
        }
    });
})();
