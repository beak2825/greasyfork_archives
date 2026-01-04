// ==UserScript==
// @name        bili字幕 - greasyfork.org
// @namespace   Violentmonkey Scripts
// @match       https://www.bilibili.com/*/*
// @grant       none
// @version     1.0.1
// @author      -
// @description 2023/9/19 01:20:15
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475598/bili%E5%AD%97%E5%B9%95%20-%20greasyforkorg.user.js
// @updateURL https://update.greasyfork.org/scripts/475598/bili%E5%AD%97%E5%B9%95%20-%20greasyforkorg.meta.js
// ==/UserScript==
const video = document.querySelector("video");
window.onload=function(){
video.addEventListener("loadeddata", (event) => {
  const timer = setInterval(() => {
        if (document.querySelector(".bpx-player-control-bottom-right:has(*)")) {
            document.querySelector("[aria-label='字幕'] span")?.click();
          clearInterval(timer)
        }
    }, 500)
}
                      )
}