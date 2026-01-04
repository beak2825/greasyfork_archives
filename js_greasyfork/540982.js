// ==UserScript==
// @name         Letterboxd Link Badges
// @namespace    https://github.com/sinazadeh/userscripts
// @version      1.1.6
// @description  Enhances Letterboxd film pages by replacing IMDb/TMDb text links with icons and adding direct "Watch on Stremio" badges.
// @author       TheSina
// @match        https://letterboxd.com/film/*
// @match        https://letterboxd.com/*/film/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540982/Letterboxd%20Link%20Badges.user.js
// @updateURL https://update.greasyfork.org/scripts/540982/Letterboxd%20Link%20Badges.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
(function () {
    'use strict';

    // 1) Inject CSS overrides + badge styles
    GM_addStyle(`
        p.text-link.text-footer {
            display: flex !important;
            align-items: center !important;
            flex-wrap: nowrap !important;
        }
        p.text-link.text-footer a.micro-button {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            margin: 0 8px !important;
            padding: 2px !important;
            position: relative !important;   /* for badge positioning */
        }
        p.text-link.text-footer img {
            width: 36px !important;
            height: 36px !important;
            vertical-align: middle !important;
        }
        .stremio-badge {
            position: absolute;
            top: -4px;
            right: -4px;
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            color: white;
            border-radius: 3px;
            background: linear-gradient(to bottom right, #8e44ad, #3498db);
        }
    `);

    function createStremioButton(imdbId, type) {
        const isApp = type === 'app';
        const href = isApp
            ? `stremio://detail/movie/${imdbId}`
            : `https://web.stremio.com/#/detail/movie/${imdbId}/${imdbId}`;

        const link = document.createElement('a');
        link.className = 'micro-button track-event';
        link.dataset.trackAction = `Stremio ${isApp ? 'App' : 'Web'}`;
        link.href = href;
        link.title = `Open in Stremio ${isApp ? 'App' : 'Web'}`;
        if (!isApp) {
            link.target = '_blank';
        }

        const img = document.createElement('img');
        img.src =
            'https://www.google.com/s2/favicons?domain=web.stremio.com&sz=64';
        link.appendChild(img);

        const badge = document.createElement('span');
        badge.className = 'stremio-badge';
        badge.textContent = isApp ? 'A' : 'W';
        link.appendChild(badge);

        return link;
    }

    function injectBadges() {
        const footer = document.querySelector('p.text-link.text-footer');
        if (!footer || footer.dataset.sbInjected) return;
        footer.dataset.sbInjected = 'true';

        const imdbLink = footer.querySelector('a[data-track-action="IMDb"]');
        const tmdbLink = footer.querySelector('a[data-track-action="TMDB"]');
        if (!imdbLink || !tmdbLink) return;

        const imdbIdMatch = imdbLink.href.match(/tt\d+/);
        if (!imdbIdMatch) return;
        const imdbId = imdbIdMatch[0];

        // Replace text with favicons
        const swapFavicon = (link, domain) => {
            link.textContent = '';
            const img = document.createElement('img');
            img.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
            link.appendChild(img);
        };
        swapFavicon(imdbLink, 'imdb.com');
        swapFavicon(tmdbLink, 'themoviedb.org');

        // Create and inject Stremio buttons
        const stremioAppButton = createStremioButton(imdbId, 'app');
        const stremioWebButton = createStremioButton(imdbId, 'web');
        tmdbLink.after(stremioAppButton, stremioWebButton);
    }

    // Run on initial load, PJAX navigations, and DOM changes
    injectBadges();
    document.addEventListener('pjax:complete', injectBadges);
    new MutationObserver(injectBadges).observe(document.body, {
        childList: true,
        subtree: true,
    });
})();
