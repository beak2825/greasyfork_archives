// ==UserScript==
// @name         IMDb to Stremio
// @namespace    zero404
// @license      MIT
// @version      1.0
// @description  Adds Stremio App link next to IMDb movie and TV series title.
// @author       zero404
// @match        https://www.imdb.com/title/tt*/*
// @match        https://www.imdb.com/*/title/tt*/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/7/72/Stremio_logo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535374/IMDb%20to%20Stremio.user.js
// @updateURL https://update.greasyfork.org/scripts/535374/IMDb%20to%20Stremio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function parseImdbInfo() {
        const pathMatch = window.location.pathname.match(/\/(?:[a-z]{2}\/)?title\/(tt\d+)/i);
        if (!pathMatch) return null;
        const imdbId = pathMatch[1];

        const script = document.querySelector('script[type="application/ld+json"]');
        if (!script) return null;
        let data;
        try {
            data = JSON.parse(script.textContent);
        } catch {
            return null;
        }

        const atype = String(data['@type'] || '').toLowerCase();
        let type;
        if (atype === 'movie') {
            type = 'movie';
        } else if (atype === 'tvseries') {
            type = 'series';
        } else {
            return null;
        }

        return { imdbId, type };
    }

    function insertStremioIcon() {
        const info = parseImdbInfo();
        if (!info) return;

        const link = document.createElement('a');
        link.href = `stremio:///detail/${info.type}/${info.imdbId}`;
        link.title = 'Open in Stremio';
        link.style.display = 'inline-block';
        link.style.marginLeft = '0.3em';

        const img = document.createElement('img');
        img.src = 'https://upload.wikimedia.org/wikipedia/commons/7/72/Stremio_logo.png';
        img.alt = 'Stremio';
        img.style.width = '36px';
        img.style.height = '36px';
        img.style.verticalAlign = 'middle';

        link.appendChild(img);

        const titleEl = document.querySelector('h1') || document.querySelector('[data-testid="hero-title-block__title"]');
        if (titleEl) {
            titleEl.appendChild(link);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertStremioIcon);
    } else {
        insertStremioIcon();
    }
})();