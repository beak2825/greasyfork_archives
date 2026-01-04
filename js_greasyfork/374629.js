// ==UserScript==
// @name       MangaFox mature gate auto-click 2018
// @namespace  https://greasyfork.org/en/scripts/374629-mangafox-mature-gate-auto-click-2018
// @version    1.1
// @description  Automatically clicks the mature age gate prompt on the the MangaFox website thus loading the page like normal.
// @match      http://fanfox.net/*
// @match      https://fanfox.net/*
// @copyright  2018+, coldasice
// @author     coldasice
// @downloadURL https://update.greasyfork.org/scripts/374629/MangaFox%20mature%20gate%20auto-click%202018.user.js
// @updateURL https://update.greasyfork.org/scripts/374629/MangaFox%20mature%20gate%20auto-click%202018.meta.js
// ==/UserScript==

window.setInterval( function() {
  let link = document.getElementById('checkAdult')
  if(link) {
    link.click()
  }
}, 1000 );