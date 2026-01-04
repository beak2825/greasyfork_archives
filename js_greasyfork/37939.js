// ==UserScript==
// @name Google Translate: Clear textarea on drag-n-drop
// @description Select and drag desired text to Google Translate, the script will clear the contents of text area before dropping in it. Usefull if you using Google Translate as a Vivaldi webpanel (in this case try Violentmonkey instead of Tampermonkey).
// @author bimlas
// @homepage https://greasyfork.org/hu/scripts/37939-google-translate-clear-textarea-on-drag-n-drop
// @supportURL https://github.com/bimlas/userscript-google-translate-clear-textarea-on-drag-n-drop
// @icon https://translate.google.com/favicon.ico
// @namespace Violentmonkey Scripts
// @match *://translate.google.com/*
// @grant none
// @version 0.0.1.20180129071520
// @downloadURL https://update.greasyfork.org/scripts/37939/Google%20Translate%3A%20Clear%20textarea%20on%20drag-n-drop.user.js
// @updateURL https://update.greasyfork.org/scripts/37939/Google%20Translate%3A%20Clear%20textarea%20on%20drag-n-drop.meta.js
// ==/UserScript==

var target = document.getElementById('source');

// Clear text entry.
target.addEventListener('dragover', function( event ) {
  event.target.value = '';
});

// Without this, the text area is not expanded (only the first line is visible).
target.addEventListener('drop', function( event ) {
  setTimeout(function () {
    event.target.dispatchEvent(new Event('focus'));
  }, 100);
});
