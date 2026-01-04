// ==UserScript==
// @name         YoutubeCommentsRemover
// @namespace    http://tampermonkey.net/
// @version      0.51
// @description  try to take over the world!
// @author       Acguy
// @match        https://www.youtube.com/*
// @grant        none
// @@licence     MIT
// @downloadURL https://update.greasyfork.org/scripts/422853/YoutubeCommentsRemover.user.js
// @updateURL https://update.greasyfork.org/scripts/422853/YoutubeCommentsRemover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("YoutubeCommentsRemover.");

    let isDisplayNone = false;
    let timer;
    let nowLocate

    document.addEventListener('yt-navigate-finish', (event) => {
        console.log("yt-navigate-finish");
        console.log("nowLocate: ", nowLocate, " location:", location.href);
        if(nowLocate && nowLocate != location.href) {
            console.log("location changed!!");
            location.reload();
        }
        nowLocate = location.href;
        console.log("setLocate: ", nowLocate);
    });


    timer = setInterval(()=>{
        if(isDisplayNone) {
            stopTimer();
        }
        let frame = document.querySelector('#chatframe');
        if(frame && frame.contentWindow) {
            console.info("frame Find!!!");
            const elem = frame.contentWindow.document.querySelector('#chat');
            if(elem && elem.style) {
                console.info("elem Find!!!");
                elem.style.display="none";
                isDisplayNone = true;
            }
        }

    }, 100);

    function stopTimer() {
        if(timer) {
            clearInterval(timer);
        }
    }

})();