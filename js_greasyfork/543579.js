// ==UserScript==
// @name        Remove promoted products
// @namespace   https://github.com/Hillev/emag-promoted-removal
// @match       *://*.emag.*/*
// @grant       none
// @version     2.0
// @author      Hillev
// @license     MIT; https://opensource.org/licenses/MIT
// @description Removes eMag promoted products across all eMag domains (Romania, Bulgaria, Hungary)
// @downloadURL https://update.greasyfork.org/scripts/543579/Remove%20promoted%20products.user.js
// @updateURL https://update.greasyfork.org/scripts/543579/Remove%20promoted%20products.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // Keywords for "promoted" in different languages used by eMag
    const BADGE_KEYWORDS = [
        // Romanian
        'promovat', 'promotat', 'sponsorizat',
        // Bulgarian (Cyrillic)
        'промотиран', 'спонсориран', 'реклама',
        // Bulgarian (Latin transliteration - sometimes used)
        'promotiran', 'sponsoriran', 'reklama',
        // Hungarian
        'támogatott', 'szponzorált', 'hirdetés', 'promóciós',
        // English (sometimes used on international versions)
        'promoted', 'sponsored', 'advertisement', 'promo'
    ];

    function getVisibleText(element) {
        return Array.from(element.childNodes)
            .filter(node =>
                node.nodeType === Node.TEXT_NODE ||
                (node.nodeType === Node.ELEMENT_NODE && !(node.classList.contains('hidden')))
            )
            .map(node => node.textContent)
            .join('')
            .trim()
            .toLowerCase();
    }

    function filterCards() {
        try {
            document.querySelectorAll('.card-v2:not([data-processed])').forEach(card => {
                // Mark as processed to avoid redundant checks
                card.setAttribute('data-processed', 'true');

                const badge = card.querySelector('.card-v2-badge-cmp');
                if (badge) {
                    const cleanText = getVisibleText(badge);
                    if (BADGE_KEYWORDS.some(keyword => cleanText.includes(keyword))) {
                        // Get product title and link for logging
                        const titleElement = card.querySelector('.card-v2-title');
                        const productTitle = titleElement ? titleElement.textContent.trim() : 'Unknown product';
                        const productLink = titleElement ? titleElement.href : 'No link found';

                        const gridItem = card.closest('.card-item');
                        if (gridItem) {
                            console.log('Removing promoted product:', {
                                title: productTitle,
                                link: productLink,
                                badge: cleanText
                            });
                            gridItem.remove();
                        }
                    }
                }
            });
        } catch (error) {
            console.warn('Error filtering promoted products:', error);
        }
    }

    let timeout;
    const observer = new MutationObserver(() => {
        clearTimeout(timeout);
        timeout = setTimeout(filterCards, 200);
    });

    // Start observing
    observer.observe(document.body, { childList: true, subtree: true });

    // Run initial filter
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', filterCards);
    } else {
        filterCards();
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        observer.disconnect();
    });
})();
