// ==UserScript==
// @name       PCworld stop sidebar autoplay video
// @namespace  https://infovikol.ch/
// @version    0.1
// @description  fuck PCworld
// @match      http*://*.pcworld.com/*
// @grant   none
// @downloadURL https://update.greasyfork.org/scripts/24812/PCworld%20stop%20sidebar%20autoplay%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/24812/PCworld%20stop%20sidebar%20autoplay%20video.meta.js
// ==/UserScript==

function stop() {  
    this.pause();  
    this.currentTime=0;
}

document.getElementById("bcplayer-rightrail_html5_api").addEventListener("timeupdate", stop, false);