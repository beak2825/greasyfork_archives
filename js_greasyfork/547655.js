// ==UserScript==
// @name         GitHub Release Download Count
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Displays the number of downloads for each asset on all GitHub release pages.
// @author       OpenAI
// @match        https://github.com/*
// @grant        GM_xmlhttpRequest
// @connect      api.github.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547655/GitHub%20Release%20Download%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/547655/GitHub%20Release%20Download%20Count.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Retrieves the name of the repo
    const repoMatch = window.location.pathname.match(/^\/([^\/]+)\/([^\/]+)/);
    if (!repoMatch) return;
    const owner = repoMatch[1];
    const repo = repoMatch[2];

    // API call: up to 100 releases
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/releases?per_page=100`;

    // Main function
    function fetchReleasesAndInject() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            headers: {
                'Accept': 'application/vnd.github+json',
            },
            onload: function (response) {
                if (response.status !== 200) {
                    console.warn('GitHub API error:', response.statusText);
                    return;
                }

                try {
                    const releases = JSON.parse(response.responseText);
                    const counts = {};

                    releases.forEach(release => {
                        release.assets.forEach(asset => {
                            counts[asset.browser_download_url] = asset.download_count;
                        });
                    });

                    insertCounts(counts);
                } catch (e) {
                    console.error('Erreur parsing JSON:', e);
                }
            }
        });
    }

    // Inject the counter
    function insertCounts(counts) {
        const links = document.querySelectorAll('a[href*="/download/"]');

        links.forEach(link => {
            const url = link.href;
            const count = counts[url];

            // Do not re-inject if already present
            if (count !== undefined && !link.parentElement.querySelector('.download-count')) {
                const countSpan = document.createElement('span');
                countSpan.className = 'download-count';
                countSpan.style.marginLeft = '10px';
                countSpan.style.fontSize = 'smaller';
                countSpan.style.color = '#6a737d';
                countSpan.textContent = `(${count.toLocaleString()} downloads)`;
                link.parentElement.appendChild(countSpan);
            }
        });
    }

    // Wait for the DOM to stabilize, also observe the “Show more”
    function waitAndObserve() {
        const observer = new MutationObserver((mutations) => {
            const hasNewDownloadLinks = [...mutations].some(m =>
                [...m.addedNodes].some(node =>
                    node.nodeType === 1 && node.querySelector?.('a[href*="/download/"]')
                )
            );
            if (hasNewDownloadLinks) {
                fetchReleasesAndInject();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Launch once after initial delay
        setTimeout(fetchReleasesAndInject, 1000);
    }

    waitAndObserve();
})();