// ==UserScript==
// @name        Desidime Redirect Removal
// @version     5
// @run-at      document-start
// @description Remove URL Tracking/Redirects from Desidime.com
// @include     https://www.desidime.com/*
// @author      kunalagra
// @license     MIT
// @namespace   https://greasyfork.org/users/878597
// @supportURL  https://github.com/kunalagra/
// @run-at      document-end
// @icon        https://play-lh.googleusercontent.com/Xzge4MB_HwymEGmd0iz_6ZOR6tPGaJYqNa1wVwggioBH_JvVoURc5_O-itr3jctyig
// @downloadURL https://update.greasyfork.org/scripts/440342/Desidime%20Redirect%20Removal.user.js
// @updateURL https://update.greasyfork.org/scripts/440342/Desidime%20Redirect%20Removal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fixDesiDimeLinks() {
        document.querySelectorAll("a[data-href*='links?ref']").forEach(link => {;
            try {
                const dataHrefValue = link.getAttribute('data-href');
                const targetURL = decodeURIComponent(new URL(dataHrefValue).searchParams.get('url')) || link.getAttribute('data-href-alt');

                if (targetURL) {
                    link.setAttribute('data-href', targetURL);
                    link.href = targetURL;
                    link.setAttribute('target', '_blank');
                    link.removeAttribute('data-href-alt');
                }
            } catch (error) {
                console.error('Error processing data-href URL:', error);
            }
        });

        // Handle standard 'href' attribute links
        document.querySelectorAll("a[href*='links?ref']").forEach(link => {
            try {
                const originalURL = new URL(link.href, window.location.origin).searchParams.get('url');

                if (originalURL) {
                    link.href = decodeURIComponent(originalURL);
                }
            } catch (error) {
                console.error('Error processing href URL:', error);
            }
        });
    }

    // Debounced handler to avoid excessive calls to fixDesiDimeLinks
    let mutationTimeout;
    function handleDOMChanges(mutationsList) {
        if (mutationTimeout) clearTimeout(mutationTimeout);
        mutationTimeout = setTimeout(() => {
            fixDesiDimeLinks();
        }, 100);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const observer = new MutationObserver(handleDOMChanges);
        observer.observe(document.body, {
            attributes: true,
            childList: true,
            subtree: true
        });
    });
})();