// ==UserScript==
// @name            Foxnews - close sticky video
// @description     Disables Foxnews floating video on scrolling down
// @namespace       https://greasyfork.org/en/users/758587-barn852
// @version         1.1
// @author          barn852
// @include         http*://*.foxnews.com/*
// @include         http*://*.foxbusiness.com/*
// @grant           none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/439374/Foxnews%20-%20close%20sticky%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/439374/Foxnews%20-%20close%20sticky%20video.meta.js
// ==/UserScript==

// source: http://forums.mozillazine.org/viewtopic.php?p=14752083#p14752083

setTimeout(function handler() {
  var element = document.querySelector("a.close");
  if (element && document.querySelector(".featured-video.sticky-video")) {
    element.click();
  } else {
    setTimeout(handler, 100);
  }
}, 1000);
