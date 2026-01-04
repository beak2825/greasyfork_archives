// ==UserScript==
// @name         Hide Verified Replies ✓
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Hides replies from verified accounts
// @author       bmpq
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512905/Hide%20Verified%20Replies%20%E2%9C%93.user.js
// @updateURL https://update.greasyfork.org/scripts/512905/Hide%20Verified%20Replies%20%E2%9C%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const whitelist = ["Cat_Auras", "xkcd"];

    function hideVerifiedAccountPosts() {
        const currentPage = window.location.pathname;

        // doing this instead of userscript match because twitter is an SPA
        if (!currentPage.includes('/status/'))
            return;

        const articles = document.querySelectorAll('article');
        articles.forEach(article => {
            const authorLink = article.querySelector('a[href^="/"][role="link"]');
            const verifiedSvg = article.querySelector('svg[data-testid="icon-verified"]');

            if (verifiedSvg && authorLink) {
                let profileUrl = authorLink.getAttribute('href');
                let username = authorLink.getAttribute('href').substring(1);

                // dont hide the original post
                if (currentPage.includes(profileUrl)) {
                    return;
                }

                if (whitelist.includes(username)) {
                    return;
                }

                const infoDiv = document.createElement('div');
                infoDiv.style.color = 'rgb(113, 118, 123)';
                infoDiv.style.fontFamily = 'TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
                infoDiv.style.padding = '10px 10px';

                const link = document.createElement('a');
                link.href = profileUrl;
                link.textContent = `@${username}`;
                link.style.color = 'inherit';
                link.style.textDecoration = 'none';

                infoDiv.textContent = `Hidden verified post from `;
                infoDiv.appendChild(link);

                article.replaceWith(infoDiv);
            }
        });
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            hideVerifiedAccountPosts();
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();