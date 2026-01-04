// ==UserScript==
// @name        Coloured Like/Dislike ratio
// @namespace   Violentmonkey Scripts
// @match       *://*.youtube.com/*
// @grant       none
// @version     1.1
// @author      diehardzg
// @description Added colours to the ratio bar
// @downloadURL https://update.greasyfork.org/scripts/436327/Coloured%20LikeDislike%20ratio.user.js
// @updateURL https://update.greasyfork.org/scripts/436327/Coloured%20LikeDislike%20ratio.meta.js
// ==/UserScript==

var css = document.createElement("style");
css.innerHTML=`
  #return-youtube-dislike-bar-container, #ryd-bar-container
  {
    background: red !important;
  }
  
  #return-youtube-dislike-bar, #ryd-bar
  {
    background: lime !important;
  }
`;
document.head.appendChild(css);