// ==UserScript==
// @name        Ebay - Sponsored products remover
// @namespace   https://greasyfork.org/en/users/2755-robotoilinc
// @author      RobotOilInc
// @version     0.2.2
// @license     MIT
// @description Removes sponsored/suggested/SEO junk from eBay. Made for personal use, shared because why not.
// @match       https://www.ebay.com/*
// @match       https://*.ebay.com/*
// @match       https://www.ebay.nl/*
// @match       https://*.ebay.nl/*
// @match       https://www.ebay.de/*
// @match       https://*.ebay.de/*
// @run-at      document-end
// @icon        https://i.imgur.com/B95SqF6.png
// @downloadURL https://update.greasyfork.org/scripts/515042/Ebay%20-%20Sponsored%20products%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/515042/Ebay%20-%20Sponsored%20products%20remover.meta.js
// ==/UserScript==

// Levenshtein distance (fuzzy match for "sponsored")
const levenshtein = (a, b) => {
    const matrix = Array.from({ length: a.length + 1 }, (_, i) => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1, // deletion
                matrix[i][j - 1] + 1, // insertion
                matrix[i - 1][j - 1] + (a[i - 1] !== b[j - 1] ? 1 : 0) // substitution
            );
        }
    }
    return matrix[a.length][b.length];
};

// Normalize visible text content
const normalizeText = text => text
.normalize("NFKD")
.replace(/[\u0300-\u036f]/g, "") // Remove diacritics
.replace(/[\u200B-\u200D\uFEFF]/g, "") // Remove zero-width
.replace(/\s+/g, "") // Remove whitespace
.replace(/[\u0435]/g, "e") // Cyrillic e → Latin e
.replace(/[^\x00-\x7F]/g, "") // Remove any remaining non-ASCII
.toLowerCase();

// Detect if label is a sponsored match
const isSponsoredLabel = (text, threshold = 2) =>
levenshtein(normalizeText(text), "sponsored") <= threshold;

// Remove all matching selectors
const removeAll = (selectors) => {
    selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => el.remove());
    });
};

// Mutation observer for dynamic content
new MutationObserver(() => {
    // Remove container blocks (ads, suggestions, SEO, etc.)
    removeAll([
        '.b-seo-product-list',
        '.b-seo-ymal',
        '.s-feedback',
        '.seo-content',
        '.seo-footer-container',
        '.seo-gallery-view',
        '.seo-product-carousel',
        '.srp-river-answer',
        '.vod-ads-placement',
        '.x-rx-slot',
        '.x-rx-slot-btf',
        '[class*=SEO_TEXT_BLURB]',
        '[data-testid="ux-navigator-seo-interlink"]',
        '[data-testid="x-pda-placements"] > div',
        '[data-testid="x-seo-footer"]',
        '[data-testid="x-seo-related-search"]',
    ]);

    // Remove sponsored product listings
    document.querySelectorAll('.su-sponsored-label').forEach(el => {
        const visibleText = normalizeText(el.innerText);
        if (visibleText == "" || !isSponsoredLabel(visibleText)) return;

        const parent = el.closest('li');
        if(parent) parent.remove();
    });
}).observe(document.body, { childList: true, subtree: true });