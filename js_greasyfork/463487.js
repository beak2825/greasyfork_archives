// ==UserScript==
// @name         Double Click to Rewind Video
// @namespace    https://greasyfork.org/users/169007
// @version      0.2
// @description  try to take over the world!
// @author       ZZYSonny
// @match        https://www.bilibili.com/video/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/463487/Double%20Click%20to%20Rewind%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/463487/Double%20Click%20to%20Rewind%20Video.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const waitUntil = (cond) =>
        new Promise((resolve, _) => {
            var timer = setInterval(() => {
                if (cond()) {
                    clearInterval(timer);
                    resolve();
                }
            }, 200);
        })

    waitUntil(() => document.getElementsByTagName("video").length > 0
                 && document.getElementsByTagName("video")[0].currentSrc.startsWith("blob")).then(() => {
        console.log("[Rewind]: Function Added")
        var vid = document.getElementsByTagName("video")[0]
        var lastPauseTime = -1
        console.log(vid.currentSrc)

        vid.addEventListener("play", (ev) => {
            lastPauseTime = Date.now()
        })

        vid.addEventListener("pause", (ev) => {
            if(lastPauseTime>0){
                var nowPauseTime = Date.now()
                console.log(nowPauseTime - lastPauseTime)
                if(nowPauseTime - lastPauseTime < 500){
                    vid.currentTime -= 10
                    vid.play()
                }

            }
            lastPauseTime = -1
        })
    })


})();