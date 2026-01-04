// ==UserScript==
// @name           Remove Like Animation
// @description    Disable Youtube's disgusting like button animation
// @author         Zachary Rude
// @match          *://*.youtube.com/*
// @grant          none
// @run-at         document-end
// @version        1.0.0
// @namespace https://greasyfork.org/users/976469
// @downloadURL https://update.greasyfork.org/scripts/453906/Remove%20Like%20Animation.user.js
// @updateURL https://update.greasyfork.org/scripts/453906/Remove%20Like%20Animation.meta.js
// ==/UserScript==

var ytIcons = document.getElementsByTagName("yt-icon");

setInterval(function() {
for (var i = 0; i < ytIcons.length; i++) {
  if (ytIcons[i].innerHTML.startsWith("<yt-animated-icon class=\"style-scope yt-icon\" animated-icon-type=\"LIKE\">")) {
      ytIcons[i].innerHTML = '<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;transform: rotateZ(180deg) !important;" class="style-scope yt-icon"><g class="style-scope yt-icon"><path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" class="style-scope yt-icon"></path></g></svg>';
      break;
  }
}
}, 1);

console.log("Animation Stopper ran successfully");