// ==UserScript==
// @name         Daraz/Lazada URL Cleaner
// @namespace    Violent Monkey Script
// @version      1.1.1
// @description  Cleans Daraz/Lazada product URLs everywhere: link hrefs, on click, and even in the address bar after loading the page.
// @author       Grizz1e
// @match        *://*.daraz.com.np/*
// @match        *://*.daraz.pk/*
// @match        *://*.daraz.com.bd/*
// @match        *://*.daraz.lk/*
// @match        *://*.lazada.com.ph/*
// @match        *://*.lazada.vn/*
// @match        *://*.lazada.co.id/*
// @match        *://*.lazada.com.my/*
// @match        *://*.lazada.sg/*
// @match        *://*.lazada.co.th/*
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/538071/DarazLazada%20URL%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/538071/DarazLazada%20URL%20Cleaner.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const productUrlPattern = /^https:\/\/(?:www\.)?(daraz|lazada)\.[^\/]+\/products\/(?:[^\/]*-)?(i\d+-s\d+)\.html(?:\?.*)?$/;

    function getCleanProductUrl(url) {
        const match = url.match(productUrlPattern);
        return match ? `https://${location.hostname}/products/${match[2]}.html` : null;
    }

    function cleanAllLinks() {
        const links = document.querySelectorAll('a[href*="/products/"]');
        links.forEach(link => {
            const clean = getCleanProductUrl(link.href);
            if (clean) link.href = clean;
        });
    }

    function interceptClicks() {
        document.addEventListener('click', e => {
            const link = e.target.closest('a[href*="/products/"]');
            if (!link) return;
            const clean = getCleanProductUrl(link.href);
            if (clean && clean !== link.href) {
                e.preventDefault();
                window.location.href = clean;
            }
        }, true);
    }

    function cleanAddressBar() {
        const current = window.location.href;
        const clean = getCleanProductUrl(current);
        if (clean && clean !== current) {
            history.replaceState(null, '', clean);
        }
    }

    // Run on load
    cleanAllLinks();
    interceptClicks();
    cleanAddressBar();

    // Re-clean on DOM changes (AJAX)
    const observer = new MutationObserver(() => cleanAllLinks());
    observer.observe(document.body, { childList: true, subtree: true });
})();
