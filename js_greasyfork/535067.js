// ==UserScript==
// @name         Google Search: Stremio Links
// @namespace    https://github.com/sinazadeh/userscripts
// @version      2.0.0
// @description  Adds "Open in Stremio" buttons to Google search results and knowledge panels for IMDb titles.
// @author       TheSina
// @match        *://www.google.*/*
// @exclude      *://*.google.*/recaptcha/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535067/Google%20Search%3A%20Stremio%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/535067/Google%20Search%3A%20Stremio%20Links.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STREMIO_ICON_URL =
        'https://www.stremio.com/website/stremio-logo-small.png';

    const addStremioButtonToGoogle = () => {
        let seriesOptions = document.querySelector(
            "div[data-attrid='kc:/tv/tv_program:media_actions_wholepage']",
        );
        let movieOptions = document.querySelector(
            "div[data-attrid='kc:/film/film:media_actions_wholepage']",
        );
        let filmReviewContainer = document.querySelector(
            "div[data-attrid='kc:/film/film:reviews']",
        );
        let seriesReviewContainer = document.querySelector(
            "div[data-attrid='kc:/tv/tv_program:reviews']",
        );

        let watchOption = null;
        let reviewContainer = null;
        let contentType = 'movie';
        let imdbCode = null;

        if (seriesOptions) {
            watchOption = seriesOptions;
            reviewContainer = seriesReviewContainer;
            contentType = 'series';
        } else if (movieOptions) {
            watchOption = movieOptions;
            reviewContainer = filmReviewContainer;
        }

        if (watchOption === null) {
            return;
        }

        if (reviewContainer != null) {
            let imdbEle = reviewContainer.querySelector(
                "a[href*='https://www.imdb.com/']",
            );

            if (imdbEle) {
                let imdbParts = imdbEle.href.split('/');
                imdbCode = imdbParts.pop() || imdbParts.pop();
            }
        }

        if (imdbCode === null) {
            let imdbLink = document.querySelector(
                "a[href*='https://www.imdb.com/']",
            )?.href;
            imdbCode = imdbLink?.match(/title\/(tt\d+)/)?.[1];
        }

        if (imdbCode === null) {
            return;
        }

        let childCount =
            watchOption.firstElementChild.firstElementChild.childElementCount;

        let watchNowEle =
            watchOption.firstElementChild.firstElementChild.firstElementChild;

        if (childCount === 2) {
            let divEle = document.createElement('div');
            watchNowEle =
                watchOption.firstElementChild.firstElementChild.insertBefore(
                    divEle,
                    watchNowEle,
                );
        }

        // Remove previous button if exists
        let prev = watchNowEle.querySelector('.stremio-cta__href');
        if (prev) prev.remove();

        // Inject custom CSS for styling (no black background) and diamond icon
        if (!document.getElementById('stremio-cta-style')) {
            const style = document.createElement('style');
            style.id = 'stremio-cta-style';
            style.textContent = `
        .stremio-cta__href {
          display: flex;
          align-items: center;
          gap: 14px;
          border-radius: 8px;
          padding: 6px 0;
          margin: 8px 0;
          text-decoration: none !important;
        }
        .stremio-cta__icon-wrap {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border-radius: 6px;
          box-shadow: none;
        }
        .stremio-cta__icon { /* keep inner content upright */
          transform: none;
          display:flex;
          align-items:center;
          justify-content:center;
        }
        .stremio-png-icon {
          width: 36px;
          height: 36px;
          object-fit: contain;
          transform: none;
          display: block;
        }
        .stremio-play {
          width: 22px;
          height: 22px;
          clip-path: polygon(10% 0%, 100% 50%, 10% 100%);
          background: white;
          opacity: 0.95;
        }
        .stremio-cta__texts {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .stremio-cta__title {
          font-family: 'Segoe UI', 'Arial', sans-serif;
          font-size: 16px;
          color: #ffffff;
          font-weight: 600;
          line-height: 1.1;
          margin:0;
        }
        .stremio-cta__subtitle {
          font-family: 'Segoe UI', 'Arial', sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,0.75);
          margin-top:4px;
        }
        /* When page uses light background, slightly adapt colors */
        .stremio-cta__href.light .stremio-cta__icon-wrap {
          background: linear-gradient(135deg,#6f4df0 0%,#3aa1ff 100%);
        }
        .stremio-cta__href.light .stremio-cta__title { color: #181818; }
        .stremio-cta__href.light .stremio-cta__subtitle { color: #666; }
        `;
            document.head.appendChild(style);
        }

        // Determine if surrounding area is dark to flip text color
        const isAreaDark = (() => {
            try {
                const bg =
                    window.getComputedStyle(watchOption).backgroundColor || '';
                if (!bg) return true; // default to dark for Google knowledge panels
                // crude check for rgb darkness
                const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                if (!m) return true;
                const r = Number(m[1]),
                    g = Number(m[2]),
                    b = Number(m[3]);
                const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                return lum < 128;
            } catch (e) {
                return true;
            }
        })();

        const lightClass = isAreaDark ? '' : 'light';

        // Try to use the repo PNG; fall back to CSS-drawn icon if it fails to load
        watchNowEle.innerHTML = `
        <a class="stremio-cta__href ${lightClass}" href='stremio:///detail/${contentType}/${imdbCode}'>
          <div class="stremio-cta__icon-wrap">
            <img class="stremio-png-icon" src="${STREMIO_ICON_URL}" alt="Stremio icon" />
            <div class="stremio-cta__icon css-fallback"><div class="stremio-play"></div></div>
          </div>
          <div class="stremio-cta__texts">
            <div class="stremio-cta__title">Stremio</div>
            <div class="stremio-cta__subtitle">Freedom to stream</div>
          </div>
        </a>
      `;

        // If PNG loads, hide the CSS fallback. If it errors, keep fallback visible.
        const img = watchNowEle.querySelector('.stremio-png-icon');
        const fallback = watchNowEle.querySelector('.css-fallback');
        if (img && fallback) {
            img.addEventListener('load', () => {
                img.style.display = 'block';
                fallback.style.display = 'none';
            });
            img.addEventListener('error', () => {
                img.style.display = 'none';
                fallback.style.display = 'flex';
            });
            // initial style
            img.style.display = 'none';
            fallback.style.display = 'flex';
        }
    };

    // Run on page load and after navigation (for Google SPA)
    const runScript = () => {
        addStremioButtonToGoogle();
    };

    window.addEventListener('load', runScript);
    // For Google SPA navigation
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            runScript();
        }
    }, 1000);
})();
