// ==UserScript==
// @name          MyAnimeList List Fixer
// @namespace     http://myanimelist.net/profile/mysticflute
// @description   fix list page. hide media icons;
// @match         https://myanimelist.net/animelist/*
// @grant         GM_addStyle
// @version       0.1
// @copyright     2016
// @downloadURL https://update.greasyfork.org/scripts/23912/MyAnimeList%20List%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/23912/MyAnimeList%20List%20Fixer.meta.js
// ==/UserScript==

(function() {
  GM_addStyle('a.icon-watch { display: none; }');
})();
