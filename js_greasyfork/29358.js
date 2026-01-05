// ==UserScript==
// @name        Show Absolute Time On Reddit Posts
// @namespace   ShowAbsoluteTimeOnRedditPosts
// @description Show absolute time of Reddit posting time in addition to the relative time. Applies for links, comments, and messages.
// @version     1.1.1
// @author      jcunews
// @include     https://*.reddit.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29358/Show%20Absolute%20Time%20On%20Reddit%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/29358/Show%20Absolute%20Time%20On%20Reddit%20Posts.meta.js
// ==/UserScript==

(function() {
  var eles = document.querySelectorAll(".tagline > time, .head > time"), i, parentNode, ele;
  for (i = eles.length-1; i >= 0; i--) {
    eles[i].classList.remove("live-timestamp");
    eles[i].textContent += " (" + eles[i].getAttribute("title") + ")";
  }
})();
