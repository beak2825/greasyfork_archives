// ==UserScript==
// @name        CAPSLOCK DAY SCRIPT
// @namespace   yichizhng@gmail.com
// @description CAPPY HAPSLOCK DAY
// @include     /https?://(www\.)?animecubedgaming\.com/billy/bvs/.*/
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34438/CAPSLOCK%20DAY%20SCRIPT.user.js
// @updateURL https://update.greasyfork.org/scripts/34438/CAPSLOCK%20DAY%20SCRIPT.meta.js
// ==/UserScript==

if (new Date().toLocaleString('en-US', {timeZone: 'America/Chicago'}).startsWith('10/22')) {
  document.body.style.textTransform = 'uppercase';
  document.title = document.title.toLocaleUpperCase();
}