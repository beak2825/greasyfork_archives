// ==UserScript==
// @name         Netflix Video Aspect Ratio Change for Fullscreen
// @namespace    https://www.primevideo.com/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.netflix.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404765/Netflix%20Video%20Aspect%20Ratio%20Change%20for%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/404765/Netflix%20Video%20Aspect%20Ratio%20Change%20for%20Fullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';
    

    // Also allow manual trigger of aspect ratio change using "a" key on keyboard. This is required for consecutive episodes being played back to back
// MAKE SURE TO FIRST FULLSCREEN THE VIDEO AND THEN PRESS a
    window.addEventListener('keydown', function (e) {
  if (e.keyCode == 65) {
    if(document.getElementsByTagName('video').length > 0){
//document.getElementsByClassName('vsc-initialized')[1].style["object-fit"] = "fill";
    document.getElementsByTagName("video")[0].style["object-fit"] = "fill";
        document.getElementsByTagName("video")[0].height = "112.5%";
    }
  }
});
})();

