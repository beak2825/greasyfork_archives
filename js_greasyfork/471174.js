// ==UserScript==
// @name         GitHub Star History Tracker
// @namespace    https://github.com/mefengl
// @version      0.0.2
// @description  Track visited GitHub repositories, generate a star history link based on the visits within the last 10 minutes, and open the link in a new tab.
// @author       mefengl
// @match        https://github.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471174/GitHub%20Star%20History%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/471174/GitHub%20Star%20History%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TEN_MINUTES = 10 * 60 * 1000;

    function getRepoFromUrl() {
        const match = window.location.pathname.match(/\/([^\/]+\/[^\/]+)/);
        return match ? match[1] : null;
    }

    function getStoredRepos() {
        const repoString = GM_getValue('repos', '[]');
        return JSON.parse(repoString);
    }

    function setStoredRepos(repos) {
        const repoString = JSON.stringify(repos);
        GM_setValue('repos', repoString);
    }

    function removeExpiredRepos(repos) {
        const now = Date.now();
        return repos.filter(({ time }) => now - time < TEN_MINUTES);
    }

    function storeCurrentRepo() {
        const repo = getRepoFromUrl();
        if (!repo) return;

        let repos = getStoredRepos();
        repos = removeExpiredRepos(repos);

        const existingRepo = repos.find(({ name }) => name === repo);
        if (!existingRepo) {
            repos.push({ name: repo, time: Date.now() });
            setStoredRepos(repos);
        }
    }

    function generateStarHistoryLink() {
        let repos = getStoredRepos();
        repos = removeExpiredRepos(repos);

        const repoNames = repos.map(({ name }) => name);
        const link = `https://star-history.com/#${repoNames.join('&')}`;

        GM_openInTab(link, {active: true, insert: true}); // Open in a new tab and switch focus

        // Clear all links after opening the tab
        setStoredRepos([]);
    }

    GM_registerMenuCommand('Go to star history', generateStarHistoryLink);

    storeCurrentRepo();
})();
