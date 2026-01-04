// ==UserScript==
// @name         DMM Top Filter Buttons (Stable + Cached)
// @namespace    http://tampermonkey.net/
// @version      1.61
// @description  Adds filter buttons to DMM with robust InstantRD and Cached filtering. Persistent active background for all buttons. Buttons remain first children in correct order.
// @author       Waseem
// @match        https://debridmediamanager.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/546847/DMM%20Top%20Filter%20Buttons%20%28Stable%20%2B%20Cached%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546847/DMM%20Top%20Filter%20Buttons%20%28Stable%20%2B%20Cached%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function setReactValue(element, value) {
        const nativeSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype, 'value'
        ).set;
        nativeSetter.call(element, value);
        element.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function normalizeText(txt) {
        return (txt || '').toLowerCase().replace(/\s+/g, ' ').trim();
    }

    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    let instantRDActive = false;
    let cachedActive = false;

    const buttons = [
        { text: '⚡instantRD', value: '__bgonly__', class: 'dmm-bgonly', instantRD: true, color: '#166534' },
        { text: 'Cached', class: 'dmm-cached', cached: true, color: '#f59e0b' }, // amber
        { text: '4K', value: '2160p|4k', class: 'dmm-4k', color: '#1e40af' },
        { text: '1080p', value: '1080p', class: 'dmm-1080p', color: '#1e40af' },
        { text: '720p', value: '720p', class: 'dmm-720p', color: '#1e40af' },
        { text: 'Dolby Vision', value: 'dovi|dv|dolby|vision', class: 'dmm-dolbyvision', color: '#1e40af' },
        { text: 'HDR', value: 'hdr', class: 'dmm-hdr', color: '#1e40af' },
        { text: 'Remux', value: 'remux', class: 'dmm-remux', color: '#1e40af' }
    ];
    const qualityValues = ['2160p|4k', '1080p', '720p'];

    function getGrid() {
        return document.querySelector(
            '#__next > div > div.mx-1.my-1.grid.grid-cols-1.gap-2.overflow-x-auto.sm\\:grid-cols-2.md\\:grid-cols-3.lg\\:grid-cols-4.xl\\:grid-cols-6'
        );
    }

    function cardHasInstantRD(card) {
        const btns = card.querySelectorAll('button');
        for (const b of btns) {
            const t = normalizeText(b.textContent);
            if (t.includes('instant rd')) return true;
            if (t.includes('rd (100%)')) return true;
        }
        return false;
    }

    function cardHasCached(card) {
        const btns = card.querySelectorAll('button');
        for (const b of btns) {
            const t = normalizeText(b.textContent);
            if (t.includes('rd (100%)')) return true;
        }
        return false;
    }

    function applyFilters() {
        const grid = getGrid();
        if (!grid) return;

        const cards = grid.querySelectorAll(':scope > div');
        cards.forEach(card => {
            const instantRDKeep = !instantRDActive || cardHasInstantRD(card);
            const cachedKeep = !cachedActive || cardHasCached(card);
            card.style.display = (instantRDKeep && cachedKeep) ? '' : 'none';
        });

        updateButtonActiveStates();
    }

    function showAllCards() {
        const grid = getGrid();
        if (!grid) return;
        const cards = grid.querySelectorAll(':scope > div');
        cards.forEach(card => (card.style.display = ''));
    }

    function updateButtonActiveStates() {
        const input = document.querySelector('#query');
        if (!input) return;
        const val = input.value.trim();

        buttons.forEach(btn => {
            const span = document.querySelector(`span.${btn.class}`);
            if (!span) return;
            let active = false;
            if (btn.instantRD) active = instantRDActive;
            else if (btn.cached) active = cachedActive;
            else if (val.includes(btn.value)) active = true;

            if (active) {
                span.classList.add('active');
                span.style.setProperty('background-color', btn.color, 'important');
            } else {
                span.classList.remove('active');
                span.style.removeProperty('background-color');
            }
        });
    }

    function addFilterButtons() {
        const container = document.querySelector(
            '#__next > div > div.mb-2.flex.items-center.gap-2.overflow-x-auto.p-2 > div'
        );
        const input = document.querySelector('#query');
        if (!container || !input) return;

        const reference = container.firstChild;

        buttons.forEach(btn => {
            if (container.querySelector(`span.${btn.class}`)) return;

            const span = document.createElement('span');
            span.textContent = btn.text;
            span.className =
                `${btn.class} cursor-pointer whitespace-nowrap rounded border border-blue-500 bg-blue-900/30 px-2 py-0.5 text-xs text-blue-100 transition-colors hover:bg-blue-800/50`;
            span.dataset.color = btn.color;

            if (reference) container.insertBefore(span, reference);
            else container.appendChild(span);

            span.addEventListener('click', () => {
                if (btn.instantRD) {
                    instantRDActive = !instantRDActive;
                    if (instantRDActive) applyFilters();
                    else {
                        showAllCards();
                        applyFilters();
                    }
                    updateButtonActiveStates();
                    return;
                }

                if (btn.cached) {
                    cachedActive = !cachedActive;
                    applyFilters();
                    return;
                }

                let current = input.value.trim();
                if (qualityValues.includes(btn.value)) {
                    const clickedQuality = btn.value;
                    const escaped = escapeRegex(clickedQuality);
                    const regex = new RegExp(`(^|\\||\\s)${escaped}($|\\||\\s)`);
                    if (current.match(regex)) {
                        const parts = current.split(' ');
                        const filteredParts = parts.map(part => {
                            const qualityRegex = new RegExp(`(^|\\|)${escaped}($|\\|)`);
                            let cleaned = part.replace(qualityRegex, (match, before, after) => {
                                if (before === '|' && after === '|') return '|';
                                return '';
                            });
                            cleaned = cleaned.replace(/\|{2,}/g, '|').replace(/^\|+|\|+$/g, '');
                            return cleaned;
                        }).filter(Boolean);
                        current = filteredParts.join(' ').trim();
                        setReactValue(input, current);
                        applyFilters();
                        updateButtonActiveStates();
                        return;
                    }

                    let lastFound = null;
                    qualityValues.forEach(q => {
                        const idx = current.lastIndexOf(q);
                        if (idx !== -1) lastFound = { value: q, index: idx };
                    });

                    if (lastFound) {
                        const before = current.slice(0, lastFound.index + lastFound.value.length);
                        const after = current.slice(lastFound.index + lastFound.value.length);
                        current = before + '|' + clickedQuality + after;
                    } else current = current ? current + ' ' + clickedQuality : clickedQuality;

                    current = current.replace(/\|{2,}/g, '|').replace(/^\|+|\|+$/g, '');
                    current = current.replace(/\s+/g, ' ').trim();
                    setReactValue(input, current);
                    applyFilters();
                    updateButtonActiveStates();
                    return;
                }

                if (current.includes(btn.value)) {
                    const regex = new RegExp(`\\s*\\b${escapeRegex(btn.value)}\\b\\s*`, 'g');
                    current = current.replace(regex, ' ').trim();
                    current = current.replace(/\s+/g, ' ');
                    setReactValue(input, current);
                } else {
                    current = current ? current + ' ' + btn.value : btn.value;
                    setReactValue(input, current);
                }
                applyFilters();
                updateButtonActiveStates();
            });
        });

        updateButtonActiveStates();
        applyFilters();
    }

    function setupGlobalListeners() {
        const input = document.querySelector('#query');
        if (!input) return;

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') setReactValue(input, '');
        });

        input.addEventListener('input', () => {
            applyFilters();
        });
    }

    const observer = new MutationObserver(() => {
        addFilterButtons();
        setupGlobalListeners();
        applyFilters();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    addFilterButtons();
    setupGlobalListeners();
    applyFilters();
})();
