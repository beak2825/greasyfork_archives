// ==UserScript==
// @name         Character pages Fix - MAL
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      1
// @description  Shows a next page button on the Top character pages and lets you see all Top character pages on MAL.
// @author       hacker09
// @match        https://myanimelist.net/character.php?limit=*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481291/Character%20pages%20Fix%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/481291/Character%20pages%20Fix%20-%20MAL.meta.js
// ==/UserScript==
(function() {
  'use strict';
  if (document.querySelector(".next") === null) {
    document.querySelector(".icon-top-ranking-page").insertAdjacentHTML('AfterEnd', `<span class="di-ib ml8 icon-top-ranking-page">  <a href="https://myanimelist.net/character.php?limit=${parseInt(location.href.match(/\d+/)[0])+50}" class="link-blue-box next">Next 50<i class="fa-solid fa-chevron-right ml4"></i></a></span>`);
  }
})();