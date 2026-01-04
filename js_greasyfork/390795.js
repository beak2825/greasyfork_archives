// ==UserScript==
// @name         動畫瘋逐幀切換
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  動畫太快看不清楚每幀細節?這個腳本可以幫你
// @author       axzxc1236
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @grant        unsafeWindow
// @require https://code.jquery.com/jquery-3.4.1.slim.min.js#md5=d9b11ca4d877c327889805b73bb79edd,sha256=a5ab2a00a0439854f8787a0dda775dea5377ef4905886505c938941d6854ee4f
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012#md5=fd6775a03daee426e576e1394ab2a3b4,sha256=e582c20607e3e723a2e2437ca0546570b1531bf302d4a89cbd99964ccd73e995
// @downloadURL https://update.greasyfork.org/scripts/390795/%E5%8B%95%E7%95%AB%E7%98%8B%E9%80%90%E5%B9%80%E5%88%87%E6%8F%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/390795/%E5%8B%95%E7%95%AB%E7%98%8B%E9%80%90%E5%B9%80%E5%88%87%E6%8F%9B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const frametime = 1/24;

    waitForKeyElements("#ani_video", vid => {
        const video = videojs(document.querySelector("#ani_video"));
        document.addEventListener("keypress", event => {
            let char = event.which || event.keyCode;
            if (char == 44 || char == 60) { //, or <
                if (video.currentTime() > frametime) {
                    video.pause(true);
                    video.currentTime(video.currentTime()-frametime);
                } else {
                    console.error("<error> video playtime is less than a frame");
                }

            } else if (char == 46 || char == 62) { //. or >
                if (video.remainingTime() > frametime) {
                    video.pause(true);
                    video.currentTime(video.currentTime()+frametime);
                } else {
                    console.error("<error> You are playing the last frame of video.");
                }
            } else console.log("<debug> pressed " + event.keyCode);
        })
    }, true);

})();