// ==UserScript==
// @name         Entry History - MAL
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      7
// @description  Get a detailed anime/manga history with the exact month/day/year and hour:minute of when you modified the watched/completed episode number of the entry.
// @author       hacker09
// @include      /^https:\/\/myanimelist\.net\/((anime|manga)(id=)?(\.php\?id=)?)(\/)?([\d]+)/
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443786/Entry%20History%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/443786/Entry%20History%20-%20MAL.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.querySelector(".js-anime-update-button, .js-manga-update-button")?.nextElementSibling.insertAdjacentHTML('afterEnd', `<small><a href="https://myanimelist.net/ajaxtb.php?detailed${location.href.split('/')[3] === 'anime' ? 'a' : 'm'}id=${location.href.match(/\d+/)[0]}" target="_blank" style="color: #fff; float: right; background-color: #4065ba; border-radius: 4px; padding: 2px 6px; font-family: lucida grande, tahoma, verdana, arial, sans-serif; font-size: 11px; text-decoration: none;"> History</a></small>`); //Show the History button
})();