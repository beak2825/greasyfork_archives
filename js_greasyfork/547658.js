// ==UserScript==
// @name         GitHub Total Last 100 Releases Download Counter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description   Displays the total number of downloads for the last 100 releases on the main page of a GitHub repository.
// @author       OpenAI
// @match        https://github.com/*
// @grant        GM_xmlhttpRequest
// @connect      api.github.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547658/GitHub%20Total%20Last%20100%20Releases%20Download%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/547658/GitHub%20Total%20Last%20100%20Releases%20Download%20Counter.meta.js
// ==/UserScript==

(function () {
    'use strict';


    function isRepoRootPage() {
        return /^\/[^\/]+\/[^\/]+\/?$/.test(location.pathname);
    }

    function getOwnerRepo() {
        const match = location.pathname.match(/^\/([^\/]+)\/([^\/]+)\/?$/);
        return match ? { owner: match[1], repo: match[2] } : null;
    }

    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const interval = 200;
            let elapsed = 0;
            const check = () => {
                const el = document.querySelector(selector);
                if (el) return resolve(el);
                elapsed += interval;
                if (elapsed >= timeout) return reject('Timeout');
                setTimeout(check, interval);
            };
            check();
        });
    }

    function fetchDownloadTotal(owner, repo) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.github.com/repos/${owner}/${repo}/releases?per_page=100`,
                headers: {
                    'Accept': 'application/vnd.github+json',
                },
                onload: function (response) {
                    if (response.status !== 200) return reject('GitHub API error');
                    try {
                        const releases = JSON.parse(response.responseText);
                        const total = releases.reduce((sum, r) => {
                            return sum + r.assets.reduce((aSum, asset) => aSum + asset.download_count, 0);
                        }, 0);
                        resolve(total);
                    } catch (e) {
                        reject(e);
                    }
                }
            });
        });
    }

    function isDarkTheme() {
        const body = document.body;
        const hasDark = body.classList.contains('color-mode-dark') || body.classList.contains('theme-dark');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return hasDark || prefersDark;
    }

    function injectCounter(total) {
        if (document.getElementById('release-download-counter')) return;

        const isDark = isDarkTheme();

        const counter = document.createElement('div');
        counter.id = 'release-download-counter';
        counter.style.margin = '8px 0';
        counter.style.padding = '6px 12px';
        counter.style.border = '1px solid';
        counter.style.borderRadius = '6px';
        counter.style.fontSize = '14px';
        counter.style.fontWeight = '500';
        counter.style.color = isDark ? '#c9d1d9' : '#24292f';
        counter.style.background = isDark ? '#161b22' : '#f6f8fa';
        counter.style.borderColor = isDark ? '#30363d' : '#d0d7de';
        counter.textContent = `📦 Total downloads (last 100 versions): ${total.toLocaleString()}`;

        waitForElement('.Layout-main').then(main => {
            main.prepend(counter);
        }).catch(() => {
            console.warn('Unable to inject the counter (Layout-main not found)');
        });
    }

    function run() {
        if (!isRepoRootPage()) return;
        const repoInfo = getOwnerRepo();
        if (!repoInfo) return;

        fetchDownloadTotal(repoInfo.owner, repoInfo.repo)
            .then(total => injectCounter(total))
            .catch(err => console.warn('Error Github API:', err));
    }

    // GitHub support for single-page application (SPA) navigation
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            if (isRepoRootPage()) {
                setTimeout(run, 1000);
            }
        }
    }).observe(document.body, { childList: true, subtree: true });

    // First boot
    setTimeout(run, 1000);
})();
