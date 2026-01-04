// ==UserScript==
// @name         addNewLinksToMenu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds links to ongoing and current season to top menu.
// @author       grin3671
// @match        https://shikimori.one/*
// @match        https://shikimori.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387254/addNewLinksToMenu.user.js
// @updateURL https://update.greasyfork.org/scripts/387254/addNewLinksToMenu.meta.js
// ==/UserScript==

'use strict';

function addNewLinksToMenu () {
  var el, cd, cm, cy, link1, link2;

  el = document.querySelector('.l-top_menu-v2 .menu-dropdown.main .submenu');
  cd = new Date();
  cm = cd.getMonth();
  cy = cd.getFullYear();
  link1 = newEl('a');
  link2 = newEl('a');

  // Ссылка на онгоинги
  link1.href = '/animes/status/ongoing';
  link1.textContent = 'Онгоинги';

  // Ссылка на текущий сезон
  switch (cm) {
    case 0:
    case 1:
      // Winter
      link2.href = '/animes/season/winter_' + cy;
      link2.textContent = 'Зимний сезон';
      break;
    case 2:
    case 3:
    case 4:
      // Spring
      link2.href = '/animes/season/spring_' + cy;
      link2.textContent = 'Весенний сезон';
      break;
    case 5:
    case 6:
    case 7:
      // Summer
      link2.href = '/animes/season/summer_' + cy;
      link2.textContent = 'Летний сезон';
      break;
    case 8:
    case 9:
    case 10:
      // Fall
      link2.href = '/animes/season/fall_' + cy;
      link2.textContent = 'Осенний сезон';
      break;
    case 11:
      // Winter
      link2.href = '/animes/season/winter_' + (cy + 1);
      link2.textContent = 'Зимний сезон';
      break;
  }

  el.insertBefore(link1, el.childNodes[4]);
  el.insertBefore(link2, el.childNodes[5]);

  function newEl (t, c) {
    var e = document.createElement(t);
    e.className = c ? c : '';
    return e;
  }
}

function ready (f) {
  document.addEventListener('page:load', f);
  document.addEventListener('turbolinks:load', f);

  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
    f();
  } else {
    document.addEventListener('DOMContentLoaded', f);
  }
}

ready(addNewLinksToMenu);