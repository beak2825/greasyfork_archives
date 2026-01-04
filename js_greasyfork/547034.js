// ==UserScript==
// @name         Letterboxd Poster Ratings (Fixed with Slug)
// @namespace    https://greasyfork.org/
// @version      8.0
// @description  Show average rating badges on Letterboxd posters reliably using data-item-slug
// @author       Shuvrato
// @match        *://letterboxd.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547034/Letterboxd%20Poster%20Ratings%20%28Fixed%20with%20Slug%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547034/Letterboxd%20Poster%20Ratings%20%28Fixed%20with%20Slug%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const POSTER_COMPONENT_SELECTOR = '.react-component[data-component-class="globals.comps.LazyPoster"]';
    const CACHE_KEY = 'lbx_ratings_cache_v8';
    let cache = JSON.parse(sessionStorage.getItem(CACHE_KEY) || '{}');
    const inProgress = new Set();

    // CSS badge
    const style = document.createElement('style');
    style.textContent = `
        .lbx-badge { position:absolute;top:6px;left:6px;z-index:20;font-size:12px;font-weight:700;padding:2px 6px;border-radius:4px;color:white;box-shadow:0 1px 3px rgba(0,0,0,0.5);pointer-events:none; }
        .lbx-green { background:#2ea44f; }
        .lbx-yellow { background:#f0ad4e; color:#111; }
        .lbx-red { background:#d9534f; }
        .lbx-relative { position:relative; display:inline-block; }
    `;
    document.head.appendChild(style);

    async function fetchRating(slug) {
        if (cache[slug] !== undefined) return cache[slug];
        if (inProgress.has(slug)) return null;
        inProgress.add(slug);
        try {
            const res = await fetch(`https://letterboxd.com/film/${slug}/`);
            const text = await res.text();
            const jsonMatch = text.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
            let rating = null;
            if (jsonMatch) {
                const json = JSON.parse(jsonMatch[1]);
                if (json.aggregateRating && json.aggregateRating.ratingValue) {
                    rating = parseFloat(json.aggregateRating.ratingValue);
                }
            }
            cache[slug] = rating;
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
            return rating;
        } catch {
            cache[slug] = null;
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
            return null;
        } finally {
            inProgress.delete(slug);
        }
    }

    function addBadge(posterDiv, rating) {
        if (!posterDiv) return;
        posterDiv.classList.add('lbx-relative');
        const existingBadge = posterDiv.querySelector('.lbx-badge');
        if (existingBadge) existingBadge.remove();
        const badge = document.createElement('div');
        badge.className = 'lbx-badge';
        if (rating === null) { badge.textContent='–'; badge.classList.add('lbx-red'); }
        else {
            badge.textContent = rating.toFixed(1);
            if (rating >= 3.5) badge.classList.add('lbx-green');
            else if (rating >= 3.0) badge.classList.add('lbx-yellow');
            else badge.classList.add('lbx-red');
        }
        posterDiv.appendChild(badge);
    }

    async function processPosterComponent(el) {
        if (el.dataset.processed) return;
        const slug = el.dataset.itemSlug;
        const posterDiv = el.querySelector('.poster.film-poster');
        if (!slug || !posterDiv) return;

        el.dataset.processed = 'true'; // mark as processed
        const rating = await fetchRating(slug);
        addBadge(posterDiv, rating);
    }

    function processAll() {
        const components = Array.from(document.querySelectorAll(POSTER_COMPONENT_SELECTOR)).filter(el => !el.dataset.processed);
        components.forEach(el => processPosterComponent(el));
    }

    // Observe DOM changes
    const mo = new MutationObserver(() => processAll());
    mo.observe(document.body, { childList: true, subtree: true });

    // Initial run
    setTimeout(processAll, 2000);
})();
