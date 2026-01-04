// ==UserScript==
// @name         Colours by Sam
// @license MIT
// @namespace    https://cluesbysam.com/userscripts
// @version      2025.08.11
// @description  Colorises hint name mentions and highlights mentioned cards on hover (Shadow DOM + MutationObserver safe).
// @author       @whi-tw
// @match        https://cluesbysam.com/*
// @match        https://www.cluesbysam.com/*
// @icon         https://cluesbysam.com/images/favicon.ico
// @grant        none
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/545402/Colours%20by%20Sam.user.js
// @updateURL https://update.greasyfork.org/scripts/545402/Colours%20by%20Sam.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let started = false;
    const state = { people: [], byName: new Map(), paletteByCoord: new Map() };
    let cardClickListenerAttached = false;
    let domObserver;

    // ----- config -----
    const PALETTE_20 = [
        '#F3C300','#875692','#F38400','#A1CAF1','#BE0032',
        '#C2B280','#848482','#008856','#E68FAC','#0067A5',
        '#F99379','#604E97','#F6A600','#B3446C','#DCD300',
        '#882D17','#8DB600','#654522','#E25822','#2B3D26'
    ];
    const COLOR_STRATEGY = 'coord'; // 'coord' | 'nameHash'

    // ---------- helpers ----------
    const normalize = (s) => (s ?? '').toString().normalize('NFKC').trim().toLowerCase();

    function tokenize(text) {
        const t = normalize(text).replace(/(['’]s)\b/g, ''); // helen's -> helen
        return t.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
    }
    function nameTokens(name) { return normalize(name).split(/\s+/).filter(Boolean); }
    function containsNameTokens(hintTokens, targetNameTokens) {
        if (!hintTokens.length || !targetNameTokens.length) return false;
        for (let i = 0; i <= hintTokens.length - targetNameTokens.length; i++) {
            let ok = true;
            for (let j = 0; j < targetNameTokens.length; j++) {
                if (hintTokens[i + j] !== targetNameTokens[j]) { ok = false; break; }
            }
            if (ok) return true;
        }
        return false;
    }
    function djb2(str) { let h = 5381; for (let i=0;i<str.length;i++) h=((h<<5)+h)^str.charCodeAt(i); return h>>>0; }
    function parseCoord(coord) {
        const m = String(coord).trim().match(/^([A-Za-z]+)\s*(\d+)$/);
        if (!m) return { colLabel: '', rowNumber: NaN };
        return { colLabel: m[1].toUpperCase(), rowNumber: parseInt(m[2], 10) };
    }
    function whenCardsReady(cb) {
        if (document.querySelector('.card')) return cb();
        const mo = new MutationObserver(() => {
            if (document.querySelector('.card')) { mo.disconnect(); cb(); }
        });
        mo.observe(document.documentElement, { childList: true, subtree: true });
    }

    // ---------- extraction & analysis ----------
    function extractPeople() {
        const cards = Array.from(document.querySelectorAll('.card'));
        return cards.map(card => {
            const name = normalize(card.querySelector('.name')?.textContent ?? '');
            const profession = normalize(card.querySelector('.profession')?.textContent ?? '');
            const coord = (card.querySelector('p.coord')?.textContent ?? '').trim();
            const flipped = card.classList.contains('flipped');
            const hintEl = card.querySelector('p.hint');
            const hint = flipped ? (hintEl?.textContent ?? '').trim() : '';
            return { el: card, name, profession, coord, hint, hintEl, flipped, mentions: [], color: '' };
        });
    }

    function buildNameIndex(people) {
        const m = new Map();
        for (const p of people) if (p.name) m.set(p.name, p);
        return m;
    }

    function annotateMentions(people) {
        const all = people.map(p => ({ name: p.name, tokens: nameTokens(p.name) }));
        for (const p of people) {
            p.mentions = [];
            if (!p.hint) continue;
            const htoks = tokenize(p.hint);
            for (const other of all) if (other.name && containsNameTokens(htoks, other.tokens)) p.mentions.push(other.name);
            p.mentions = [...new Set(p.mentions)];
        }
    }

    // ---------- contrast helpers ----------
    function hexToRgb(hex){ let h=hex.replace('#',''); if(h.length===3) h=[...h].map(c=>c+c).join(''); return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16),1]; }
    function parseCssColor(s){
        if(!s) return null;
        s = s.trim().toLowerCase();
        if (s === 'transparent') return [0,0,0,0];
        if (s.startsWith('#')) return hexToRgb(s);
        const m = s.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
        if (m) return [Number(m[1]), Number(m[2]), Number(m[3]), m[4] == null ? 1 : Number(m[4])];
        return null;
    }
    function isTransparentRGBA(rgba){ return !rgba || rgba[3] === 0; }
    function srgbToLin(c){ c/=255; return c<=0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); }
    function luminance([r,g,b]){ return 0.2126*srgbToLin(r)+0.7152*srgbToLin(g)+0.0722*srgbToLin(b); }
    function contrastRatio(fg,bg){
        const L1 = luminance(fg), L2 = luminance(bg);
        const [mx, mn] = [Math.max(L1,L2), Math.min(L1,L2)];
        return (mx + 0.05) / (mn + 0.05);
    }
    function mixRgb(a,b,t){ return [0,1,2].map(i => Math.round(a[i]*(1-t)+b[i]*t)).concat(1); }
    function rgbToHex([r,g,b]){ return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('').toUpperCase(); }

    // climb DOM (and out of shadow) to find a non-transparent background
    function getEffectiveBgColor(el){
        let n = el;
        while (n) {
            const cs = getComputedStyle(n);
            const bg = parseCssColor(cs.backgroundColor);
            if (!isTransparentRGBA(bg)) return bg;
            // step up (handles shadow hosts too)
            const root = n.getRootNode && n.getRootNode();
            n = n.parentElement || (root && root.host) || null;
        }
        return parseCssColor(getComputedStyle(document.body).backgroundColor) || [255,255,255,1];
    }

    // nudge foreground towards white/black until reaching target contrast
    function adjustForContrast(fgHex, bgCssOrRgb, target=4.5){
        const bg = Array.isArray(bgCssOrRgb) ? bgCssOrRgb : (parseCssColor(bgCssOrRgb) || [0,0,0,1]);
        let fg = hexToRgb(fgHex);
        if (contrastRatio(fg, bg) >= target) return fgHex;

        const lighten = luminance(bg) < 0.5;
        const pole = lighten ? [255,255,255,1] : [0,0,0,1];
        let lo = 0, hi = 1, best = fg, bestR = contrastRatio(fg,bg);

        for (let i=0;i<22;i++){
            const t = (lo+hi)/2;
            const cand = mixRgb(fg, pole, t);
            const r = contrastRatio(cand, bg);
            if (r >= target){ best = cand; bestR = r; hi = t; } else { lo = t; }
        }
        // if still short, pick black/white with max contrast
        if (bestR < target){
            const cw = contrastRatio([255,255,255,1], bg);
            const cb = contrastRatio([0,0,0,1], bg);
            best = cw > cb ? [255,255,255,1] : [0,0,0,1];
        }
        return rgbToHex(best);
    }

    // ----- highlight helpers -----
    const highlighted = new Set();
    let currentHoverCard = null;

    function indexByElement(people) {
        const wm = new WeakMap();
        for (const p of people) wm.set(p.el, p);
        return wm;
    }

function clearHighlights() {
  for (const el of highlighted) {
    el.style.borderColor = '';
    el.style.boxShadow = '';
  }
  highlighted.clear();
}

function highlightMentionsFor(person) {
  clearHighlights();
  if (!person || !person.hintEl || !person.hint || !person.mentions?.length) return;

  const hostBg = getEffectiveBgColor(person.hintEl);

  for (const name of person.mentions) {
    const target = state.byName.get(name);
    if (!target) continue;
    const el = target.el;

    const base = target.color;
    const adjusted = adjustForContrast(base, hostBg, 4.5);

    // Keep border width unchanged (no reflow); just recolor it
    el.style.borderColor = adjusted;

    // Add a non-layout ring; preserve the site's drop shadow
    el.style.boxShadow = `0 0 0 2px ${adjusted}, 0 1px 6px var(--shadow-color-secondary)`;

    highlighted.add(el);
  }
}

    // ----- color assignment -----
    function computeGridOrdering(people) {
        const cols = new Set(), rows = new Set();
        for (const p of people) {
            const { colLabel, rowNumber } = parseCoord(p.coord);
            if (colLabel) cols.add(colLabel);
            if (!Number.isNaN(rowNumber)) rows.add(rowNumber);
        }
        const colsArr = [...cols].sort((a, b) => a.localeCompare(b));
        const rowsArr = [...rows].sort((a, b) => a - b);
        return { colsArr, rowsArr };
    }

    function assignColorsByCoord(people) {
        const { colsArr, rowsArr } = computeGridOrdering(people);
        const gridSlots = colsArr.length * rowsArr.length;
        if (PALETTE_20.length < gridSlots) return assignColorsByNameHash(people);

        state.paletteByCoord.clear();
        for (const p of people) {
            const { colLabel, rowNumber } = parseCoord(p.coord);
            const ci = colsArr.indexOf(colLabel);
            const ri = rowsArr.indexOf(rowNumber);
            if (ci === -1 || ri === -1) continue;
            const paletteIndex = ci * rowsArr.length + ri; // column-major
            const color = PALETTE_20[paletteIndex % PALETTE_20.length];
            state.paletteByCoord.set(p.coord, color);
            p.color = color;
            p.el.setAttribute('data-person-color', color);
        }
    }

    function assignColorsByNameHash(people) {
        const used = new Set();
        for (const p of people) {
            const idx = djb2(p.name || p.coord) % PALETTE_20.length;
            let k = idx, steps = 0;
            while (used.has(k) && steps < PALETTE_20.length) { k = (k + 7) % PALETTE_20.length; steps++; }
            used.add(k);
            p.color = PALETTE_20[k];
            p.el.setAttribute('data-person-color', p.color);
        }
    }

    function assignColors(people) {
        if (COLOR_STRATEGY === 'coord') assignColorsByCoord(people);
        else assignColorsByNameHash(people);
    }

    // Render colored names into a Shadow DOM so the app can't clobber what the user sees
    function paintHintMentions(people) {
        const names = people.map(p => p.name).filter(Boolean).sort((a, b) => b.length - a.length);
        if (!names.length) return;

        const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
        const alt = names.map(esc).join('|');
        const re = new RegExp(`(^|[^\\p{L}\\p{N}])(${alt})(['’]s)?(?=$|[^\\p{L}\\p{N}])`, 'giu');

        for (const p of people) {
            if (!p.hintEl || !p.hint) continue;

            // Get or create a shadow root on the hint element
            const host = p.hintEl;
            const hostBg = getEffectiveBgColor(host);
            host.style.cursor = 'pointer'; // make the whole hint show a hand
            const lightText = (host.textContent || '').trim();

            // If the element was replaced, we need to rebuild; the data attrs would be gone
            let sr = host.shadowRoot;
            if (!sr) sr = host.attachShadow({ mode: 'open' });

            // Skip if already painted for this exact text
            if (host.dataset._decoratedFor === lightText) continue;

            // Build shadow content fresh from the light DOM text
            const frag = document.createDocumentFragment();

            // Scoped styles inside the shadow root; site CSS can’t undo this
            const style = document.createElement('style');
            style.textContent = `
        :host { all: initial; display: block; white-space: pre-wrap; font: inherit; color: inherit; }
        .hint-name { font-weight: 600; }
      `;
            frag.appendChild(style);

            let lastIndex = 0;
            re.lastIndex = 0;
            let m;
            while ((m = re.exec(lightText)) !== null) {
                const [ , prefix, nameMatch, poss ] = m;
                const matchStart = m.index;
                const matchEnd = re.lastIndex;

                if (matchStart > lastIndex) frag.appendChild(document.createTextNode(lightText.slice(lastIndex, matchStart)));
                if (prefix) frag.appendChild(document.createTextNode(prefix));

                const normalized = normalize(nameMatch).replace(/\s+/g, ' ');
                const person = state.byName.get(normalized);
                const color = person?.color || '#000';

                const span = document.createElement('span');
                span.className = 'hint-name';
                span.textContent = nameMatch;
                const adjusted = adjustForContrast(color, hostBg, 4.5);
                span.style.color = adjusted;
                // optional extra safety for noisy backgrounds:
                span.style.textShadow = '0 1px 1px rgba(0,0,0,.6), 0 0 2px rgba(0,0,0,.4)';
                frag.appendChild(span);

                if (poss) frag.appendChild(document.createTextNode(poss));
                lastIndex = matchEnd;
            }
            if (lastIndex < lightText.length) frag.appendChild(document.createTextNode(lightText.slice(lastIndex)));

            // Swap visible content
            sr.replaceChildren(frag);
            host.dataset._decoratedFor = lightText; // idempotence key
        }
    }

    function debugPrint(people) {
        for (const p of people) {
            console.log(`${p.coord}: ${p.name} (${p.profession}) - ${p.hint}`);
            const mentions = p.hint ? (p.mentions.length ? p.mentions.join(', ') : '(none)') : '(no hint)';
            console.log(`   mentions: ${mentions} | color: ${p.color}`);
        }
    }

    function refreshState({ log = true } = {}) {
        state.people = extractPeople();
        state.byName = buildNameIndex(state.people);
        state.byEl = indexByElement(state.people);
        annotateMentions(state.people);
        assignColors(state.people);
        paintHintMentions(state.people);
        if (log) debugPrint(state.people);
    }

    // ---------- observers ----------
    function startDomObserver() {
        if (domObserver) return;

        let scheduled = false;
        const schedule = () => {
            if (scheduled) return;
            scheduled = true;
            // Let the app finish its render tick, then repaint once
            requestAnimationFrame(() => {
                scheduled = false;
                refreshState({ log: false });
            });
        };

        domObserver = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.type === 'characterData') {
                    if (m.target.parentElement?.matches?.('p.hint')) { schedule(); break; }
                } else if (m.type === 'childList') {
                    // New/changed cards or hints
                    const added = [...m.addedNodes].some(n =>
                                                         n.nodeType === 1 && (n.matches?.('.card, p.hint') || n.querySelector?.('.card, p.hint'))
                                                        );
                    const removed = [...m.removedNodes].some(n =>
                                                             n.nodeType === 1 && (n.matches?.('.card, p.hint') || n.querySelector?.('.card, p.hint'))
                                                            );
                    if (added || removed || m.target?.matches?.('.card, p.hint')) { schedule(); break; }
                }
            }
        });

        domObserver.observe(document.documentElement, {
            subtree: true,
            childList: true,
            characterData: true
        });
    }

    // ---------- lifecycle ----------
    let hoverListenerAttached = false;

    function main() {
        if (started) return;
        started = true;

        whenCardsReady(() => {
            refreshState({ log: true });
            startDomObserver();
        });

        if (!cardClickListenerAttached) {
            document.addEventListener('click', (e) => {
                const card = e.target.closest('.card');
                if (!card) return;
                queueMicrotask(() => refreshState({ log: true }));
            }, true);
            cardClickListenerAttached = true;
        }

        // --- hover highlighting ---
        if (!hoverListenerAttached) {
            document.addEventListener('pointerover', (e) => {
                const card = e.target.closest('.card');
                if (!card || card === currentHoverCard) return;

                currentHoverCard = card;
                const person = (state.byEl && state.byEl.get(card)) || state.people.find(p => p.el === card);
                if (person && person.hint) {
                    highlightMentionsFor(person);
                } else {
                    clearHighlights();
                }
            }, true);

            document.addEventListener('pointerout', (e) => {
                if (!currentHoverCard) return;
                // Ignore pointerout events that stay within the current card
                const toEl = e.relatedTarget;
                if (toEl && currentHoverCard.contains(toEl)) return;
                // Only clear when actually leaving the hovered card
                const fromCard = e.target.closest && e.target.closest('.card');
                if (fromCard && fromCard === currentHoverCard) {
                    currentHoverCard = null;
                    clearHighlights();
                }
            }, true);

            hoverListenerAttached = true;
        }
        const style = document.createElement('style');
        style.textContent = `.card{ transition: border-color .12s ease, border-width .12s ease, box-shadow .12s ease; }`;
        document.documentElement.appendChild(style);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main, { once: true });
    } else {
        main();
    }
})();
