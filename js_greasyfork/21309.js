// ==UserScript==
// @name           9gag.com video controls on hover
// @namespace      pl.srsbiz
// @description    Show video controls on mouse hover
// @include        https://9gag.com/*
// @grant          none
// @license        MIT
// @version        1.0.0
// @downloadURL https://update.greasyfork.org/scripts/21309/9gagcom%20video%20controls%20on%20hover.user.js
// @updateURL https://update.greasyfork.org/scripts/21309/9gagcom%20video%20controls%20on%20hover.meta.js
// ==/UserScript==

document.querySelector('body').addEventListener('mouseover', function(evt){
  let video = evt.target;
  if (video.tagName === "VIDEO") {
    video.setAttribute("controls", "controls");
  }; 
});