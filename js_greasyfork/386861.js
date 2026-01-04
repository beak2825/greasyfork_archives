// ==UserScript==
// @name         linkToDub
// @namespace    https://shikimori.one
// @version      0.2
// @description  Add Links to Dub Projects
// @author       grin3671
// @match        https://shikimori.one/*
// @match        https://shikimori.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386861/linkToDub.user.js
// @updateURL https://update.greasyfork.org/scripts/386861/linkToDub.meta.js
// ==/UserScript==

'use strict';

var links = {
  'Crunchyroll': 'https://www.crunchyroll.com/ru',
  'YakuSub Studio': 'https://vk.com/yakusub_studio',
  'Японская Таверна': 'https://vk.com/nippontavern',
  'Akari GROUP': 'https://akari-anime.com/',
  'Amazing Dubbing': 'https://vk.com/amazing_dubbing',
  'AniDUB': 'https://vk.com/anidub',
  'AniFilm': 'https://anifilm.tv/',
  'AniLibria': 'https://www.anilibria.tv/',
  'AniMaunt': 'https://animaunt.tv/',
  'AniMedia': 'https://online.animedia.tv/',
  'AnimeVost': 'http://animevost.club/',
  'AniStar': 'https://anistar2.org/',
  'AniPlay': 'https://aniplay.tv/',
  'Anything Group': 'https://a-g.site/',
  'New Dawn Studio': 'https://vk.com/club181824650',
  'Onibaku Group': 'https://vk.com/onibaku_group',
  'Risens Team': 'https://risens.team/',
  'SEKAI PROJECT': 'https://vk.com/sekaiproject',
  'SovetRomantica': 'https://sovetromantica.com/',
  'SHIZA Project': 'http://shiza-project.com/',
  'Wakanim': 'https://www.wakanim.tv/ru/v2',
  'XDUB DORAMA': 'https://vk.com/xdubdorama',
  'youmiteru': 'https://youmiteru.ru/',
}

function createLink (link, text) {
  var l = document.createElement('a'),
      t = document.createTextNode(text);
  l.href= link;
  l.appendChild(t);
  return l;
}

function linkToDub () {
  var menuLines = document.querySelectorAll('.b-menu-line');

  for (var i = 0; i < menuLines.length; i++) {
    var title = menuLines[i].title;
    if (links.hasOwnProperty(title)) {
      menuLines[i].innerHTML = '';
      menuLines[i].appendChild(createLink(links[title], title));
    }
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

ready(linkToDub);