// ==UserScript==
// @name         AnimeStars Card ID Overlay
// @namespace    Violentmonkey
// @version      1.3
// @description  Show data-id on cards (updates live) and color by highest-lowest
// @match        https://astars.club/*
// @match        https://asstars.club/*
// @match        https://asstars1.astars.club/*
// @match        https://animestars.org/*
// @match        https://as1.astars.club/*
// @match        https://asstars.tv/*
// @match        https://ass.astars.club/*
// @match        https://as2.asstars.tv/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547152/AnimeStars%20Card%20ID%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/547152/AnimeStars%20Card%20ID%20Overlay.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Tunables
    const MAX_ID = 60000; // treat this as "very new"
    const MIN_ID = 1; // oldest baseline
    const SCAN_INTERVAL_MS = 1000; // safety scan

    const BADGE_CLASS = 'lb-id-badge';

    // Map id → color (0..120 hue = red→green)
    function idToColor(id) {
        const ratio = Math.min(1, Math.max(0, (id - MIN_ID) / (MAX_ID - MIN_ID)));
        const hue = ratio * 120; // 0 red → 120 green
        return `hsl(${hue}, 100%, 45%)`;
    }

    // Create/update a badge in the top-right of a .lootbox__card
    function setBadge(cardEl, idNum) {
        let b = cardEl.querySelector(`.${BADGE_CLASS}`);
        const color = idToColor(idNum);

        if (!b) {
            b = document.createElement('div');
            b.className = BADGE_CLASS;
            Object.assign(b.style, {
                position: 'absolute',
                top: '6px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '2px 6px',
                borderRadius: '10px',
                background: 'rgba(0,0,0,0.55)',
                color,
                font: 'bold 12px/1.2 -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial, sans-serif',
                textShadow: '0 1px 1px rgba(0,0,0,.35)',
                border: `1px solid ${color}`,
                boxShadow: '0 1px 3px rgba(0,0,0,.25)',
                zIndex: 10,
                pointerEvents: 'none'
            });
            // ensure the card is positioned so the absolute badge anchors correctly
            const cs = getComputedStyle(cardEl);
            if (cs.position === 'static') cardEl.style.position = 'relative';
            cardEl.appendChild(b);
        }

        b.textContent = String(idNum);
        b.style.color = color;
        b.style.borderColor = color;
        b.title = `ID: ${idNum} • freshness ${(Math.min(1, Math.max(0, (idNum - MIN_ID) / (MAX_ID - MIN_ID))) * 100).toFixed(1)}%`;
    }

    function updateAll() {
        // 1) normal cards
        const cards = document.querySelectorAll('.lootbox__card, .anime-cards__item');
        cards.forEach(el => {
            const id = Number(el.getAttribute('data-id')) || 0;
            if (!id) return;
            setBadge(el, id);
        });

        // 2) trade items
        const tradeItems = document.querySelectorAll('a.trade__main-item[href*="id="]');
        tradeItems.forEach(el => {
            try {
                const url = new URL(el.href, location.origin);
                const id = Number(url.searchParams.get('id')) || 0;
                if (!id) return;
                setBadge(el, id);
            } catch (_) {}
        });
    }

    // Debounced observer to react to dynamic swaps
    let rafPending = false;
    function scheduleUpdate() {
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(() => {
            rafPending = false;
            updateAll();
        });
    }

    new MutationObserver(scheduleUpdate).observe(document.body, { childList: true, subtree: true });
    setInterval(updateAll, SCAN_INTERVAL_MS); // safety net
    updateAll();
})();