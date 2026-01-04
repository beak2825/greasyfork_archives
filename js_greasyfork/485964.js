// ==UserScript==
// @name         Copy RYM Genres to Clipboard
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Copies genres from RYM to clipboard. Multi-valued genres are separated by semi-colons, primary and secondary are separated by a newline.
// @author       Skeeb
// @match        https://rateyourmusic.com/*
// @grant        GM_setClipboard
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/485964/Copy%20RYM%20Genres%20to%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/485964/Copy%20RYM%20Genres%20to%20Clipboard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .genre-button {
            border: none;
            min-width: 3em;
            text-align: center;
            background-color: var(--mono-db);
            border-radius: 4px;
            margin: 0em .3em .3em .3em;
            padding: .25em .8em;
            font-size: .8em;
            color: var(--mono-4);
            position: relative;
            cursor: pointer;
        }
    `;

    const tooltipStyle = `
        .copy-tooltip {
            visibility: hidden;
            min-width: 70px;
            max-width: 140px;
            background-color: rgba(0, 0, 0, 0.7);
            color: rgba(192, 192, 192, 0.7);
            text-align: center;
            border-radius: 4px;
            padding: 5px 0;
            position: absolute;
            z-index: 1;
            opacity: 0;
            transition: opacity 0.3s;
            white-space: normal;
            word-wrap: break-word;
        }

        .copy-tooltip.show {
            visibility: visible;
            opacity: 1;
        }
    `;
    styleSheet.textContent += tooltipStyle;
    document.head.appendChild(styleSheet);

    function getGenres() {
        return Array.from(document.querySelectorAll('.release_genres .release_pri_genres, .release_genres .release_sec_genres'))
            .map(genresContainer => Array.from(genresContainer.querySelectorAll('a.genre'))
                 .map(genre => genre.textContent.trim()).join('; '))
            .join('\n');
    }

    const tooltip = document.createElement('div');
    tooltip.className = 'copy-tooltip';
    tooltip.textContent = 'Copied!';
    document.body.appendChild(tooltip);

    const genreButton = document.createElement('button');
    genreButton.textContent = 'Copy genres to clipboard';
    genreButton.classList.add('genre-button');
    genreButton.addEventListener('click', function() {
        const genres = getGenres();
        GM_setClipboard(genres);

        tooltip.classList.add('show');
        tooltip.style.left = (event.clientX + 10 + window.scrollX) + 'px';
        tooltip.style.top = (event.clientY + 10 + window.scrollY) + 'px';

        setTimeout(() => {
            tooltip.classList.remove('show');
        }, 1000);
    });

    const genresRow = document.querySelector('.release_genres');
    if (genresRow) {
        genresRow.querySelector('th').appendChild(genreButton);
    }
})();