// ==UserScript==
// @name         Letterboxd Titles
// @namespace    https://letterboxd.com/
// @version      3.25
// @description  Force titles to be displayed above movie posters (on some pages only)
// @author       n00bCod3r
// @match        https://letterboxd.com/*/films*
// @match        https://letterboxd.com/films/*
// @match        https://letterboxd.com/director/*
// @match        https://letterboxd.com/actor/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/418462/Letterboxd%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/418462/Letterboxd%20Titles.meta.js
// ==/UserScript==

GM_addStyle(`
:root {
  --w: 70px;
}

.fancy-title {
  text-align: center;
  overflow-wrap: break-word;
  max-width: var(--w);
  font-size: 10px;
}

.carousel .fancy-title { // Deal with bigger posters
  max-width: 100%;
}

ul.poster-list, ul.grid {
  align-items: flex-end; //force elements to be vertically aligned at the end
}
`);

'use strict';

const body = document.querySelector('body');
const r = document.querySelector(':root');
const config = {
  childList: true,
  subtree: true
};
const MAX_TITLE_LENGTH = 23;
const SELECTOR = 'li div.react-component';

let titlesLoaded = false;

const observer = new MutationObserver(mutationRecords => {
  if (!titlesLoaded) {
    const movies = [...document.querySelectorAll(SELECTOR)]; // NodeList to Array
    // console.log('Found', movies.length, 'movies');

    const allMoviesLoaded = movies.every(m => { // every movie has a title
      return Boolean(m.dataset.itemName);
    });

    if (allMoviesLoaded) {
      // console.log('All movies loaded!');
      addTitles();
      titlesLoaded = true;
      observer.disconnect();
    }

  }
});

observer.observe(body, config);

document.addEventListener('scroll', () => {
    addTitles()
}, false);

function addTitles() {
  document.querySelectorAll(SELECTOR)
    .forEach(poster => {
      // console.log(poster.dataset.itemName);


      const fullTitle = poster.dataset.itemName;
      if (poster.dataset.tweaked || !fullTitle) return; // skip tweaked

      r.style.setProperty('--w', `${poster.offsetWidth}px`)

      // mark tweaked posters
      poster.dataset.tweaked = 'true';

      // get title and year
      const { title, year } = parseTitleAndYear(fullTitle);


      // trim title
      const shortenedTitle = title.length > MAX_TITLE_LENGTH
               ? title.substring(0, MAX_TITLE_LENGTH - 3) + '...'
               : title;

      const movieInfo = year ? `${shortenedTitle} (${year})` : shortenedTitle;

      // create elem, add classes, content and place it
      const divNode = document.createElement("div");
      divNode.classList.add('fancy-title');
      divNode.textContent = movieInfo;
      poster.parentNode.insertBefore(divNode, poster); // insert div above the poster image
    });
}

// avoid titles with parenthesis from being caught
function parseTitleAndYear(text) {
  const m = text.trim().match(/^(.*)\s\((\d{4})\)$/);
  if (m) {
    return { title: m[1].trim(), year: m[2] };
  }
  return { title: text.trim(), year: '' };
}