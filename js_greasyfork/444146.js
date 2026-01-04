// ==UserScript==
// @name         Rateyourmusic Movie Genre Chart Button
// @description  Adds a button to the movie genre page to open the chart, and redirects "genre" links to the corresponding "film_genre" page.
// @version      1.3.2
// @namespace    https://greasyfork.org/users/908137
// @match        *://rateyourmusic.com/charts/*/film/*
// @match        *://rateyourmusic.com/film_genre/*
// @run-at       document-start
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/444146/Rateyourmusic%20Movie%20Genre%20Chart%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/444146/Rateyourmusic%20Movie%20Genre%20Chart%20Button.meta.js
// ==/UserScript==

const GENRES_NEEDING_SUFFIX = ['comedy', 'experimental', 'satire'];

const formatGenreName = (path, toFilmGenre = false) => {
    let genre = path.split('/')[2].toLowerCase();
    return toFilmGenre
        ? genre.replace('-1', '').replace('-', '+')
        : genre.replace('+', '-').concat(GENRES_NEEDING_SUFFIX.includes(genre) ? '-1' : '');
};

(() => {
    const { pathname } = window.location;

    document.addEventListener('DOMContentLoaded', () => {
        if (pathname.startsWith('/charts/')) {
            document.querySelectorAll('a.genre')
                .forEach(link => link.href = `/film_genre/${formatGenreName(link.pathname, true)}`);
        }

        else if (pathname.startsWith('/film_genre/')) {
            const button = Object.assign(document.createElement('a'), {
                textContent: 'View genre chart',
                href: `/charts/top/film/all-time/g:${formatGenreName(pathname)}`,
                style: 'display: inline-block; float: right;'
            });

            document.getElementById('page_breadcrumb')?.appendChild(button);
        }
    });
})();