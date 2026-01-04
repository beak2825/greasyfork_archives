// ==UserScript==
// @name Youtube Shorts fullscreen
// @description Watch Youtube Shorts as a normal youtube video!
// @grant none
// @match *://www.youtube.com/*
// @version 1.0
// @license MIT
// @namespace Theo's Tech Tips
// @author Theo's Tech Tips
// @runat document-idle
// @downloadURL https://update.greasyfork.org/scripts/472437/Youtube%20Shorts%20fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/472437/Youtube%20Shorts%20fullscreen.meta.js
// ==/UserScript==

//Redirect to the youtube watch page
document.body.addEventListener("yt-navigate-finish", function() {
  if (window.location.pathname.split("/")[1] == "shorts") {
    	window.location.href = window.location.origin + "/watch?v=" + window.location.pathname.split("/")[2]
  }
});