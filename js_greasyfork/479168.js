// ==UserScript==
// @name           AFF - Check on IMDb and Letterboxd
// @name:pl        AFF - Zobacz na IMDb i Letterboxd
// @namespace      https://greasyfork.org/en/users/1212025-tebowy
// @version        1.0
// @description    Adds buttons to imdb.com and letterboxd.com
// @description:pl Dodaje przyciski do imdb.com i letterboxd.com
// @author         cphxxx based on script by Pabli
// @license        MIT
// @match          https://www.americanfilmfestival.pl/*
// @icon           https://icons.duckduckgo.com/ip3/www.americanfilmfestival.pl.ico
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/479168/AFF%20-%20Check%20on%20IMDb%20and%20Letterboxd.user.js
// @updateURL https://update.greasyfork.org/scripts/479168/AFF%20-%20Check%20on%20IMDb%20and%20Letterboxd.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let titleElement = document.querySelector('.czolowka .tytulorg.nag');
    let title = titleElement ? titleElement.innerText.split('/')[0].trim() : document.querySelector('.czolowka h1').innerText;
    title = encodeURIComponent(title);

    let detailsElement = document.querySelector('.czolowka .tytulorg.nag + .nag');
    let year = detailsElement ? detailsElement.innerText.match(/\b\d{4}\b/)[0] : '';

    let section = document.querySelector('.top.opmargines');

    function link(search, website, name) {
        let div = document.createElement('div');
        div.className = 'linkWrapper';
        div.innerHTML = `<a href='${search}' title='Zobacz na ${website}' class='zobaczna' target='_blank'><img src='https://icons.duckduckgo.com/ip3/www.${website}.ico'><span>${name}</span></a>`;
        section.appendChild(div);
    }

    link(`https://letterboxd.com/search/${title} ${year}`, 'letterboxd.com', 'Letterboxd');
    link(`https://www.imdb.com/find?q=${title} ${year}`, 'imdb.com', 'IMDb');
    link(`https://www.filmweb.pl/search#/?query=${title} ${year}`, 'filmweb.pl', 'Filmweb');

    GM_addStyle(`
        .top.opmargines {
            display: flex;
            justify-content: center;
            flex-wrap: nowrap;
        }
        .linkWrapper {
            display: block;
            text-align: center;
            margin: 0rem;
            margin-top: 15%;
        }
        .zobaczna {
            display: inline-flex;
            align-items: center;
            color: #ccc;
            border-radius: 0.125rem;
            border: 1px solid var(--main-border-color, rgba(172, 172, 172, .3));
            transition: border-color .3s cubic-bezier(.25,.46,.45,.94);
            padding: 5px 10px;
            text-decoration: none;
        }
        .zobaczna:hover {
            border-color: #888;
        }
        .zobaczna img {
            width: 16px;
            margin-right: 5px;
            }
        .socialscont {
            display: none;
        }
    `);
})();
