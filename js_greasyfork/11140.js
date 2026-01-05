// ==UserScript==
// @name        Add Controls to HTML5 videos
// @namespace   video-controls-html5
// @version     3
// @description Adds controls to HTML5 videos
// @grant none
// @exclude        *//*.youtube.com/*
// @include *
// @downloadURL https://update.greasyfork.org/scripts/11140/Add%20Controls%20to%20HTML5%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/11140/Add%20Controls%20to%20HTML5%20videos.meta.js
// ==/UserScript==

document.addEventListener("DOMContentLoaded", function() {
  for (var e of document.getElementsByTagName('video')) e.setAttribute('controls', true);
});