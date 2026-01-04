// ==UserScript==
// @name         YouTube - Disable Inline Playback ("Keep hovering to play")
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Disable the Inline Playback feature ("keep hovering to play") on YouTube even when logged out
// @author       yeggog
// @match        *://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438569/YouTube%20-%20Disable%20Inline%20Playback%20%28%22Keep%20hovering%20to%20play%22%29.user.js
// @updateURL https://update.greasyfork.org/scripts/438569/YouTube%20-%20Disable%20Inline%20Playback%20%28%22Keep%20hovering%20to%20play%22%29.meta.js
// ==/UserScript==

(function() {
  document.getElementById("preview").remove();
  var sheet = document.createElement('style')
		sheet.innerHTML = "ytd-thumbnail-overlay-loading-preview-renderer {display: none!important;}";
		document.body.appendChild(sheet);;
}
 )();