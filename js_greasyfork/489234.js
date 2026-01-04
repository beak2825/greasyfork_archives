// ==UserScript==
// @name        bibliotik search button
// @namespace   Violentmonkey Scripts
// @match       https://bibliotik.me/*
// @grant       none
// @version     0.1
// @author      -
// @description display submit button for torrents search
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/489234/bibliotik%20search%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/489234/bibliotik%20search%20button.meta.js
// ==/UserScript==

const search = document.querySelector('#search_header');
if (search) {
  const button = search.parentNode.querySelector('input[type="submit"]');
  button.style.display = '';
  button.value = "Search";
}
