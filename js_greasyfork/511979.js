// ==UserScript==
// @name         VOZ - Remove tag [HN]
// @version              0.1.8
// @namespace    VOZ
// @description  VOZ - Remove tag [HN] in the alert page
// @author       N.Duong
// @license              MIT
// @match        https://voz.vn/*
// @run-at               document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=voz.vn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511979/VOZ%20-%20Remove%20tag%20%5BHN%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/511979/VOZ%20-%20Remove%20tag%20%5BHN%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function safeRemoveHNItems() {
        try {
            const items = document.querySelectorAll('li[data-alert-id]');
            let removedCount = 0;
            items.forEach(item => {
                try {
                    const labelSpan = item.querySelector('span.label.label--green');
                    if (labelSpan && labelSpan.textContent.trim() === 'HN') {
                        item.remove();
                        removedCount++;
                    }
                } catch (err) {
                    console.warn('Error checking/removing item:', err);
                }
            });
            if (removedCount > 0) {
                console.log(`Removed ${removedCount} HN items`);
            }
        } catch (err) {
            console.error('Error removing HN items:', err);
        }
    }

    safeRemoveHNItems();

    let observer = null;

    function setupObserver() {
        if (observer) {
            observer.disconnect();
        }

        observer = new MutationObserver((mutations) => {
            let shouldCheck = false;
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldCheck = true;
                    break;
                }
            }

            if (shouldCheck) {
                clearTimeout(window.hnRemoveTimeout);
                window.hnRemoveTimeout = setTimeout(safeRemoveHNItems, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('MutationObserver started for HN removal');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            safeRemoveHNItems();
            setupObserver();
            tryInjectBadge();
        });
    } else {
        safeRemoveHNItems();
        setupObserver();
        tryInjectBadge();
    }

    function tryInjectBadge() {
        let attempts = 0;
        const maxAttempts = 10;
        const intervalMs = 500;

        const retryInterval = setInterval(() => {
            attempts++;

            try {
                const alertLink = safeQuery('a[data-nav-id="ALERTS"]');
                const numberOfAlert = safeQuery('a[href="/account/alerts"]');

                if (alertLink && numberOfAlert) {
                    clearInterval(retryInterval);

                    const badgeValue = numberOfAlert.getAttribute('data-badge') || '0';
                    console.log("FOUND ALERTS link, badge =", badgeValue);

                    if (!alertLink.querySelector('.vn-alert-badge')) {
                        const badge = document.createElement('span');
                        badge.textContent = badgeValue;
                        badge.className = 'vn-alert-badge';
                        badge.style.cssText = `
                            background: red;
                            color: white;
                            border-radius: 21%;
                            padding: 2px 6px;
                            font-size: 12px;
                            margin-left: 6px;
                        `;
                        alertLink.appendChild(badge);
                    }
                }

                if (attempts >= maxAttempts) {
                    clearInterval(retryInterval);
                    console.warn("ALERTS link not found after 10 attempts.");
                }
            } catch (err) {
                console.error('Error during badge injection attempt:', err);
            }
        }, intervalMs);
    }

    function safeQuery(selector) {
        try {
            return document.querySelector(selector);
        } catch (err) {
            console.error(`Query failed for selector: ${selector}`, err);
            return null;
        }
    }

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            setTimeout(safeRemoveHNItems, 500);
        }
    });

})();