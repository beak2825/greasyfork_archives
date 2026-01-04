// ==UserScript==
// @name         MAL: Watching Covers v1.4
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Displays covers outside the Watching table on MyAnimeList, expands rows to fit, and adds hover-zoom.
// @author       Madhuvrata
// @match        https://myanimelist.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542285/MAL%3A%20Watching%20Covers%20v14.user.js
// @updateURL https://update.greasyfork.org/scripts/542285/MAL%3A%20Watching%20Covers%20v14.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const log = console.log.bind(console, '[TM MAL v1.4]');
    log('Script started');

    const listSurround = document.getElementById('list_surround');
    if (!listSurround) {
        console.warn('[TM MAL v1.4] #list_surround not found—exiting');
        return;
    }

    // Configuration
    const IMG_W  = 50,    // thumbnail width
          IMG_H  = 70,    // thumbnail height
          GAP    = 8,     // gap between table and images
          INDENT = IMG_W + GAP;

    // Shift table right to free space for image column
    listSurround.style.paddingLeft = `${INDENT}px`;

    // Collect entries in the "Watching" section
    const tables = Array.from(document.querySelectorAll('#list_surround > table'));
    let inSection = false;
    const entries = [];

    for (const t of tables) {
        const cls = t.className.trim();
        if (!inSection) {
            if (cls === 'header_cw') inSection = true;
            continue;
        }
        if (cls.startsWith('header_') && cls !== 'header_cw') break;
        const txt0 = t.querySelector('td')?.textContent.trim().slice(0,20);
        if (txt0 === 'Anime Title') continue;
        const anchor = t.querySelector('a.animetitle');
        if (!anchor) continue;

        const url = new URL(anchor.getAttribute('href'), location.origin).href;
        const id  = url.split('/anime/')[1]?.split('/')[0];
        if (!id) continue;

        // Expand row height and center content
        t.style.height = `${IMG_H}px`;
        t.querySelectorAll('td').forEach(td => td.style.verticalAlign = 'middle');

        entries.push({ id, title: anchor.textContent.trim(), url, tableEl: t });
    }

    log(`Collected ${entries.length} entries`);

    if (!entries.length) return;

    // Compute X coordinate for image column
    const rect = listSurround.getBoundingClientRect();
    const columnX = window.scrollX + rect.left;

    // Create zoom container
    let zoomImg = document.createElement('img');
    Object.assign(zoomImg.style, {
        position:     'fixed',
        width:        '200px',
        height:       '280px',
        objectFit:    'cover',
        pointerEvents:'none',
        zIndex:       '10000',
        display:      'none'
    });
    document.body.appendChild(zoomImg);
    log('Zoom image initialized');

    // Insert thumbnail placeholders and hover listeners
    entries.forEach(e => {
        const r   = e.tableEl.getBoundingClientRect();
        const top = window.scrollY + r.top + (r.height - IMG_H) / 2;
        const img = document.createElement('img');
        img.alt = e.title;
        Object.assign(img.style, {
            position:   'absolute',
            top:        `${top}px`,
            left:       `${columnX}px`,
            width:      `${IMG_W}px`,
            height:     `${IMG_H}px`,
            objectFit:  'cover',
            background: '#ddd',
            cursor:     'zoom-in',
            zIndex:     '9999'
        });
        document.body.appendChild(img);
        e.imgEl = img;

        img.addEventListener('mouseenter', evt => {
            zoomImg.src = img.src;
            zoomImg.style.display = 'block';
            zoomImg.style.left = `${evt.clientX + 10}px`;
            zoomImg.style.top = `${evt.clientY + 10}px`;
        });
        img.addEventListener('mousemove', evt => {
            zoomImg.style.left = `${evt.clientX + 10}px`;
            zoomImg.style.top = `${evt.clientY + 10}px`;
        });
        img.addEventListener('mouseleave', () => {
            zoomImg.style.display = 'none';
        });
    });

    // Load covers with rate-limit + fallback
    const delay = ms => new Promise(r => setTimeout(r, ms));
    for (const { id, url, imgEl } of entries) {
        await delay(160);

        let coverUrl = '';

        // 1) Jikan API
        try {
            const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
            if (res.ok) {
                const json = await res.json();
                coverUrl = json.data?.images?.jpg?.image_url || '';
            }
        } catch {}

        // 2) Fallback: OG:image from MAL page
        if (!coverUrl) {
            try {
                const pr = await fetch(url);
                if (pr.ok) {
                    const html = await pr.text();
                    const doc  = new DOMParser().parseFromString(html, 'text/html');
                    coverUrl = doc.querySelector('meta[property="og:image"]')?.content || '';
                }
            } catch {}
        }

        if (coverUrl) {
            imgEl.src = coverUrl;
            log(`Loaded cover for id=${id}`);
        } else {
            imgEl.style.background = '#f00';
            console.warn(`[TM MAL v1.4] Failed to load cover id=${id}`);
        }
    }

    log('Script finished');
})();
