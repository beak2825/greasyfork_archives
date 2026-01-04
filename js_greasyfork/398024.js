// ==UserScript==
// @name        New script - pornhub.com
// @namespace   Violentmonkey Scripts
// @match       https://rt.pornhub.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 16.03.2020, 16:01:05
// @downloadURL https://update.greasyfork.org/scripts/398024/New%20script%20-%20pornhubcom.user.js
// @updateURL https://update.greasyfork.org/scripts/398024/New%20script%20-%20pornhubcom.meta.js
// ==/UserScript==

var removeBanner = function() {
  if (window.jQuery && window.jQuery.ui) {
    console.log("remove")
    jQuery("#age-verification-container").remove()
    jQuery("#age-verification-wrapper").remove()
  } else {
    console.log("wait")
    setTimeout(removeBanner, 100);
  }
}

setTimeout(removeBanner, 100);