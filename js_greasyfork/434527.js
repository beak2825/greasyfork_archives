// ==UserScript==
// @name        Youtube: Remove Overlays
// @namespace   https://greasyfork.org/en/users/221281-klaufir
// @match       https://www.youtube.com/embed/*
// @match       https://www.youtube.com/*
// @match       https://www.youtube-nocookie.com/*
// @grant       none
// @version     1.12
// @author      -
// @description 04/26/2023, 11:35:27 AM
// @downloadURL https://update.greasyfork.org/scripts/434527/Youtube%3A%20Remove%20Overlays.user.js
// @updateURL https://update.greasyfork.org/scripts/434527/Youtube%3A%20Remove%20Overlays.meta.js
// ==/UserScript==
function addStyle(style)
{
    var headelem = document.getElementsByTagName("head")[0];
    var styleelem = document.createElement("style");
    styleelem.setAttribute("id","remove-overlays");
    styleelem.type="text/css";
    styleelem.appendChild(document.createTextNode(style));
    headelem.appendChild(styleelem);
}

function getRuleForClasses() {
  var classes = [
        'ytp-paid-content-overlay',  // paid promotion notification overlay in the bottom left corner
        'ytp-pause-overlay',         // "More Videos" overlay on paused embeds
        'ytp-ce-element',            // covering overlays at the end of the video
        'iv-branding',               // branding overlay in the bottom right corner
        'ytp-cards-teaser',          // info cards in the top right corner
        'ytp-cards-button-icon',     // info cards in the top right corner
        'ytp-cards-button-title',    // info cards in the top right corner
        'ytp-endscreen-content',     // endscreen recommended videos
        'ytp-spinner',               // remove spinner stuck on screen
        'ytd-reel-shelf-renderer'
      ];
  var style="";
  classes.forEach(cls => {
    style += "." + cls + " { visibility: hidden !important; }\n";
  });
  return style;
}

addStyle(getRuleForClasses());
