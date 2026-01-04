// ==UserScript==
// @name         White Background - MAL
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      2
// @description  Makes MAL always use the default white background color.
// @author       hacker09
// @match        https://myanimelist.net/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440432/White%20Background%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/440432/White%20Background%20-%20MAL.meta.js
// ==/UserScript==
 
(function() {
  'use strict';
  document.querySelector("html").className = 'appearance-none white;-mode'; //Make sure the website uses the white mode
  document.body.style.backgroundColor = 'white'; //Change the BG Color to white
})();