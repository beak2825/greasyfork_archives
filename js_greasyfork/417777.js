// ==UserScript==
// @name         MAL • Links to Shikimori
// @namespace    https://github.com/grin3671/userscript/
// @version      1.4
// @description  Provide links to Shikimori mirror pages.
// @author       grin3671
// @match        https://myanimelist.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shikimori.one
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417777/MAL%20%E2%80%A2%20Links%20to%20Shikimori.user.js
// @updateURL https://update.greasyfork.org/scripts/417777/MAL%20%E2%80%A2%20Links%20to%20Shikimori.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Initial data
  const supportedCategories = ['anime', 'manga', 'character', 'people'];
  const shikimoriCategories = ['animes', 'mangas', 'characters', 'people']

  const createShikimoriLink = (category, id) => {
    let a = document.createElement('a');
    let i = document.createElement('i');
    i.className = 'fa-solid fa-external-link-square mr4';
    a.append(i, 'Shikimori');
    a.style.marginLeft = '10px';
    a.href = 'https://shikimori.one/' + category + '/' + id + '?utm_source=mal_external';
    return a;
  };

  const isPHP = location.pathname.substring(location.pathname.length - 4) == '.php';
  const divider = isPHP ? '.php' : '/';

  const currentURL = location.pathname.substring(1).split(divider);
  const categoryIndex = supportedCategories.indexOf(currentURL[0]);

  const id = isPHP ? new URLSearchParams(location.search).get('id') : currentURL[1];

  if ( categoryIndex >= 0 ) {
    const header = document.querySelector('.header-right');
    if (!header) return;
    header.append(createShikimoriLink(shikimoriCategories[categoryIndex], id));
  }

})();
