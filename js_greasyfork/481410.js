// ==UserScript==
// @name         Graphite to GitHub Redirector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  Redirects from graphite.dev GitHub PR page to GitHub's PR page
// @author       Walker Hildebrand
// @match        https://app.graphite.dev/github/pr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481410/Graphite%20to%20GitHub%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/481410/Graphite%20to%20GitHub%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract information from the current URL
    function extractInfoFromURL() {
        const match = window.location.pathname.match(/^\/github\/pr\/([\w-]+)\/([\w-]+)\/(\d+)/);
        if (match) {
            const org = match[1];
            const repo = match[2];
            const prNumber = match[3];
            return { org, repo, prNumber };
        } else {
            console.log('Invalid URL format for GitHub PR.');
            return null;
        }
    }

    // Function to redirect to GitHub PR page
    function redirectToGitHub() {
        const info = extractInfoFromURL();
        if (info) {
            const { org, repo, prNumber } = info;
            const githubURL = `https://github.com/${org}/${repo}/pull/${prNumber}`;
            console.log('Redirecting to GitHub:', githubURL);
            window.location.href = githubURL;
        }
    }

    // Execute the redirect function when the page is loaded
    window.addEventListener('load', redirectToGitHub);
})();
