// ==UserScript==
// @name         Freepik Hide Premium & Distractions
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Hides premium items, footer, and ads on Freepik, without affecting Free-video previews
// @author       Kraptor
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freepik.com
// @match        https://www.freepik.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534733/Freepik%20Hide%20Premium%20%20Distractions.user.js
// @updateURL https://update.greasyfork.org/scripts/534733/Freepik%20Hide%20Premium%20%20Distractions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideElements() {
        try {
            const path = location.pathname.toLowerCase();

            // Hide premium resources when not on free-video pages
            if (!path.startsWith('/free-video/')) {
                document.querySelectorAll('article[data-cy="resource-thumbnail"]').forEach(article => {
                    const wrapper = article.closest('div._wvoqhw3') || article;
                    const badge = article.querySelector('span[data-cy="premium-resource-crown"]');
                    const link = article.querySelector('a[href]');
                    const isPremiumLink = link && /\/premium(?:-|\/)\w+/i.test(link.href);
                    if (badge || isPremiumLink) {
                        wrapper.style.display = 'none';
                    }
                });
            }

            // Hide footer entirely
            document.querySelectorAll('footer').forEach(el => el.style.display = 'none');

            // Hide redirect ads (e.g., Shutterstock banners)
            document.querySelectorAll('a[href*="/redirect?"]').forEach(adLink => {
                const overlay = adLink.closest('div');
                if (overlay) overlay.style.display = 'none';
            });
        } catch (e) {
            console.error('hideElements error:', e);
        }
    }

    // Observe DOM changes
    new MutationObserver(hideElements).observe(document.body, { childList: true, subtree: true });

    // Patch history methods for SPA
    ['pushState', 'replaceState'].forEach(method => {
        const orig = history[method];
        history[method] = function() {
            const res = orig.apply(this, arguments);
            setTimeout(hideElements, 200);
            return res;
        };
    });
    window.addEventListener('popstate', () => setTimeout(hideElements, 200));

    // Initial invocation
    hideElements();
})();