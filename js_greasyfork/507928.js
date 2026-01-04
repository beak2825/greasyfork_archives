// ==UserScript==
// @name         Remove RetroAchievements Redirects
// @namespace    https://metalsnake.space/
// @version      1.1
// @description  Replace redirect links on RetroAchievements with direct links and replace Google search links with Ecosia
// @author       MetalSnake
// @match        http*://retroachievements.org/*
// @icon         https://retroachievements.org/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507928/Remove%20RetroAchievements%20Redirects.user.js
// @updateURL https://update.greasyfork.org/scripts/507928/Remove%20RetroAchievements%20Redirects.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function rewriteGoogleSearchToEcosia(rawUrl) {
        try {
            const u = new URL(rawUrl);
            const isGoogleCom = u.hostname === 'google.com' || u.hostname === 'www.google.com';
            if (isGoogleCom && u.pathname === '/search') {
                u.hostname = 'www.ecosia.org';
                u.protocol = 'https:';
                return u.toString();
            }
        } catch (_) {
            // ignore invalid URLs
        }
        return rawUrl;
    }

    // Get all anchor tags on the page
    const links = document.querySelectorAll('a[href*="/redirect?url="]');
    links.forEach(link => {
        try {
            // Extract the URL parameter
            const urlParam = link.href.match(/\/redirect\?url=([^&]+)/);
            if (urlParam && urlParam[1]) {
                // Decode the URL
                const decodedUrl = decodeURIComponent(urlParam[1]);
                const rewrittenUrl = rewriteGoogleSearchToEcosia(decodedUrl);
                // Replace the href with the decoded direct link
                link.href = rewrittenUrl;
                // Optional: add a tooltip to indicate replacement
                link.title = 'Direct link (fixed by userscript)';
            }
        } catch (e) {
            // If something goes wrong, do nothing
            // console.error("[RALinkFixer] - Error fixing link", link, e);
        }
    });

    const googleSearchLinks = document.querySelectorAll('a[href^="https://www.google.com/search"], a[href^="https://google.com/search"], a[href^="http://www.google.com/search"], a[href^="http://google.com/search"]');
    googleSearchLinks.forEach(link => {
        try {
            link.href = rewriteGoogleSearchToEcosia(link.href);
        } catch (_) {
            // ignore
        }
    });
})();
