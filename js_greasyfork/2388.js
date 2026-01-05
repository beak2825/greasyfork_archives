// ==UserScript==
// @name        Switch Flash embed to secure
// @description Workaround for Flash 14 on Firefox 30 not loading Flash videos on HTTP pages
// @author      Jefferson Scher
// @namespace   JeffersonScher
// @include     http://www.youtube.com/*
// @version     0.1
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/2388/Switch%20Flash%20embed%20to%20secure.user.js
// @updateURL https://update.greasyfork.org/scripts/2388/Switch%20Flash%20embed%20to%20secure.meta.js
// ==/UserScript==

function fixURLs(e){
  var embeds = document.querySelectorAll("embed[type='application/x-shockwave-flash']");
  for (var i=0; i<embeds.length; i++){
    // If the player is on s.ytimg.com change http: to https:
    if (embeds[i].getAttribute("src").indexOf("http:\/\/s.ytimg.com\/") > -1)
      embeds[i].setAttribute("src", embeds[i].getAttribute("src").replace("http:", "https:"));
  }
}

// Allow 1 second delay for page to settle down
window.setTimeout(fixURLs, 1000);