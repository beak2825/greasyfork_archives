// ==UserScript==
// @name         Ikigai Mangas Wordeh
// @namespace    http://tampermonkey.net/
// @version      2025-09-13
// @description  Ikigai Mangas Fullscreen script
// @author       AngelXex
// @match        https://visualikigai.bwal.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ikigaimangas.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528809/Ikigai%20Mangas%20Wordeh.user.js
// @updateURL https://update.greasyfork.org/scripts/528809/Ikigai%20Mangas%20Wordeh.meta.js
// ==/UserScript==

(function() {
    'use strict';

document.getElementById('close-teaser3').remove();
document.getElementById('close-teaser4').remove();
document.getElementById('close-teaser5').remove();

var temp = document.getElementsByClassName("my-4");
temp[0].addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {
openFullscreen();
}
/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;


/* View in fullscreen */
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}
})();