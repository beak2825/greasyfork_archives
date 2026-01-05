// ==UserScript==
// @name        Always Autoplay Embedded YouTube
// @namespace   AlwaysAutoplayEmbeddedYouTube
// @description Always autoplay embedded YouTube video
// @author      jcunews
// @include     https://www.youtube.com/embed?*
// @include     https://www.youtube.com/embed/*
// @version     1.0.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28853/Always%20Autoplay%20Embedded%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/28853/Always%20Autoplay%20Embedded%20YouTube.meta.js
// ==/UserScript==

if (!(/[?&]autoplay=1/).test(location.search)) {
  document.querySelector(".ytp-large-play-button").click();
}
