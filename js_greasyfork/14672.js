// ==UserScript==
// @name        Remove video crap from SMH
// @namespace   SMH
// @description Removes the video element from SMH site
// @include     http://www.smh.com.au/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14672/Remove%20video%20crap%20from%20SMH.user.js
// @updateURL https://update.greasyfork.org/scripts/14672/Remove%20video%20crap%20from%20SMH.meta.js
// ==/UserScript==

var targetDiv = document.getElementById("video-player-content");
targetDiv.parentElement.removeChild(targetDiv);
