// ==UserScript==
// @name         Mastodon Search External Link Filter
// @description  Hides Mastodon Search posts with external links (skipping virtual‑scroll placeholders)
// @match        https://mastodon.social/search?*
// @version 0.0.1.20250502160211
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/534739/Mastodon%20Search%20External%20Link%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/534739/Mastodon%20Search%20External%20Link%20Filter.meta.js
// ==/UserScript==

(function () {
    // 1) Grab every <article> in the search results panel
    function getPosts() {
        return document.querySelectorAll('.explore__search-results article');
    }

    // 2) Detect links not pointing to this Mastodon instance
    function isExternalLink(a) {
        return a.href && !a.href.includes(location.hostname);
    }

    // 3) Detect virtual‑scroll placeholder articles
    function isPlaceholder(article) {
        const style = getComputedStyle(article);
        return parseFloat(style.opacity) === 0;
    }

    // 4) Hide any fully rendered article containing at least one external link
    function hidePostsWithExternalLinks() {
        getPosts().forEach(article => {
            if (isPlaceholder(article)) return;             // skip placeholders
            const links = article.querySelectorAll('a[href]');
            if (Array.from(links).some(isExternalLink)) {
                article.style.display = 'none';
            }
        });
    }

    // 5) Observe the search-results container for new articles (infinite scroll)
    function observeSearchResults() {
        const container = document.querySelector('.explore__search-results');
        if (!container) return;
        new MutationObserver(hidePostsWithExternalLinks)
            .observe(container, { childList: true, subtree: true });
        hidePostsWithExternalLinks();
    }

    // 6) Kick off: watch the body for the panel to appear, then observe it
    new MutationObserver(observeSearchResults)
        .observe(document.body, { childList: true, subtree: true });
    observeSearchResults();
})();
