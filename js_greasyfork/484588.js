// ==UserScript==
// @name        REPAIR Play Next (MD)
// @namespace   Instant Play
// @match       https://www.youtube.com/watch*
// @grant       none
// @version     0.1
// @author      Pr0m
// @license      FOR All
// @description Fix playing the next video if it's playing from the playlist or other cases
// @downloadURL https://update.greasyfork.org/scripts/484588/REPAIR%20Play%20Next%20%28MD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/484588/REPAIR%20Play%20Next%20%28MD%29.meta.js
// ==/UserScript==


document.querySelector("#movie_player > div.html5-video-container > video")?.addEventListener("ended", (e)=>{
    if(e.returnValue)
document.querySelector("[class*=video-]").parentElement.querySelector(`a[data-title-no-tooltip*="xt"]`)?.click();});