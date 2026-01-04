// ==UserScript==
// @name         動畫瘋廣告禁音
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自動把廣告禁音
// @author       axzxc1236
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @grant        unsafeWindow
// @require https://code.jquery.com/jquery-3.4.1.slim.min.js#md5=d9b11ca4d877c327889805b73bb79edd,sha256=a5ab2a00a0439854f8787a0dda775dea5377ef4905886505c938941d6854ee4f
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012#md5=fd6775a03daee426e576e1394ab2a3b4,sha256=e582c20607e3e723a2e2437ca0546570b1531bf302d4a89cbd99964ccd73e995
// @downloadURL https://update.greasyfork.org/scripts/390794/%E5%8B%95%E7%95%AB%E7%98%8B%E5%BB%A3%E5%91%8A%E7%A6%81%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/390794/%E5%8B%95%E7%95%AB%E7%98%8B%E5%BB%A3%E5%91%8A%E7%A6%81%E9%9F%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    waitForKeyElements("#adSkipButton", btn => {
        const video = videojs(document.querySelector("#ani_video"));
        console.log("<info> detect AD button.");
        video.muted(true);
        console.log("<info> video muted.");
        video.on("durationchange", unmute)
    }, true)

    waitForKeyElements(".VPAID-container", () => {
        const video = videojs(document.querySelector("#ani_video"));
        console.log("<info> 3rd party AD detected.");
        video.muted(true);
        console.log("<info> video muted.");
        video.on("durationchange", unmute)
    }, true)

    function unmute() {
        const video = videojs(document.querySelector("#ani_video"));
        if (document.querySelector("#adSkipButton") || document.querySelector(".VPAID-container")) return;
        video.muted(false);
        console.log("<info> video un-muted.");

        //Fix visual error in volume bar.
        let percentage = video.volume()*100;
        document.querySelector(".vjs-volume-level").style.width = percentage.toString() + "%";
    }
})();