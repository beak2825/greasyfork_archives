// ==UserScript==
// @name         FSD Variable Storage
// @namespace    https://almedawaterwell.com/
// @version      1.8
// @description  Finds the text in the FSD description div, stores it as a variable, and copies it to the clipboard. Also sets focus to "details" in Google Calendar so user can paste description text.
// @author       Luke Pyburn
// @match        https://reveal.us.fleetmatics.com/fsd/*
// @match        https://reveal.fleetmatics.com/fsd/*
// @match        *://calendar.google.com/calendar/u/*/r/eventedit?text*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/403898/FSD%20Variable%20Storage.user.js
// @updateURL https://update.greasyfork.org/scripts/403898/FSD%20Variable%20Storage.meta.js
// ==/UserScript==

var descUntouchedGlobal;
var descTouchedGlobal;
var multipleTransfersGlobal;
var $ = window.jQuery;
var checkExist = setInterval(startCheck, 100);
function startCheck() {
   if ($('#fsd-sd-text-area__input\\ ng-untouched\\ ng-pristine\\ ng-valid').length) {
     descUntouchedGlobal = document.getElementById("fsd-sd-text-area__input ng-untouched ng-pristine ng-valid").value;
        console.log("Exists!");
        console.log(descUntouchedGlobal);
     clearInterval(checkExist);
   }
     if ($('#fsd-sd-text-area__input\\ ng-pristine\\ ng-valid\\ ng-touched').length) {
      descTouchedGlobal = document.getElementById("fsd-sd-text-area__input\\ ng-pristine\\ ng-valid\\ ng-touched").value;
          console.log("Exists!");
          console.log(descTouchedGlobal);
      clearInterval(checkExist);
   }
     if ($('#description').length) {
      multipleTransfersGlobal = document.getElementById("description").value;
          console.log("Exists!");
          console.log(multipleTransfersGlobal);
          GM_setClipboard(multipleTransfersGlobal);
     clearInterval(checkExist);
          }
}

window.addEventListener('load', function checkGoogleCalendar() {
    var checkGoogleCalendar = setInterval (function() {
    if ($('#T2Ybvb0').length) {
        $("#T2Ybvb0").focus();
        clearInterval(checkExist);}
    }, 500); // Checks every 500 milliseconds
}, false);