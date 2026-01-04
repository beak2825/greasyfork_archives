// ==UserScript==
// @name         traduccionesamistosas
// @namespace    http://realidadscans.org
// @version      2025-04-13
// @description  Reader Mod
// @author       AngelXex
// @match        https://traduccionesamistosas.topmanhuas.org/manga/*/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=topmanhuas.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532749/traduccionesamistosas.user.js
// @updateURL https://update.greasyfork.org/scripts/532749/traduccionesamistosas.meta.js
// ==/UserScript==

(function() {
    'use strict';

   const paddedit = document.getElementsByClassName("container");
Array.prototype.forEach.call(paddedit, function(el) {
    el.classList.remove("container");

});

const paddedit2 = document.getElementsByClassName("reading-content");
Array.prototype.forEach.call(paddedit2, function(el) {
    el.classList.remove("reading-content");

});



let temp = document.getElementsByClassName("icon ion-ios-bookmark");
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


document.getElementById('ad-container4').remove();
})();