// ==UserScript==
// @name         Desktop Mode - MAL
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      5
// @description  Forces MAL always be opened on Desktop View Mode.
// @author       hacker09
// @match        https://myanimelist.net/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445195/Desktop%20Mode%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/445195/Desktop%20Mode%20-%20MAL.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (document.querySelector('.footer-desktop-button') !== null) //If the cookie wasn't already set
  { //Starts the if condition
    location.reload(); //Reloads the page
  } //Finishes the if condition
  document.cookie = 'view=pc;path=/;Expires=' + new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365).toGMTString() + ';'; //Set the desktop mode cookie
})();