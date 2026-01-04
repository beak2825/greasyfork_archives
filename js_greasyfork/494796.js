// ==UserScript==
// @name         2024智慧树知自动播放
// @namespace    Muketool
// @version      1.0.0
// @description  智慧树自动播放-油猴、篡改猴脚本，自动播放、自动下一节
// @author       Muketool
// @match        *://*.zhihuishu.com/*
// @connect      api.muketool.com
// @connect      api2.muketool.com
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @supportURL   https://docs.muketool.com
// @homepage     https://www.muketool.com
// @downloadURL https://update.greasyfork.org/scripts/494796/2024%E6%99%BA%E6%85%A7%E6%A0%91%E7%9F%A5%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/494796/2024%E6%99%BA%E6%85%A7%E6%A0%91%E7%9F%A5%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function () {
        for (var i = 0; i < document.getElementsByTagName('video').length; i++) {
            var current_video = document.getElementsByTagName('video')[i]
            // 静音
            current_video.volume = 0.1

            // 2倍速,不被系统认可
            current_video.playbackRate = 1.5

            // 视频播放结束后，模拟点击“下一课”
            if (current_video.ended) {
                console.log("下一课")

                var chapterNodeList = document.querySelectorAll('.chapter-tree-74 .left')
                var isPlay = 0
                var j = 0

                for (; j < chapterNodeList.length; j++ ) {
                    if (1 == isPlay) {
                        break
                    }
                    var parentDiv = chapterNodeList[j].parentNode
                    //console.log(parentDiv)

                    var isFinish = parentDiv.querySelector('.right')
                    //console.log(isFinish)
                    if (!isFinish) {
                        console.log('未完成视频，马上播放，j--==' + j)
                        isPlay = 1
                        break
                    }
                    console.log(isFinish.innerText)
                    if ('已完成' !== isFinish.innerText) {
                        console.log('未完成视频，马上播放，j==' + j)
                        isPlay = 1
                        break
                    }
                }
                //console.log(j)
                chapterNodeList[j].click()
            }

            // 如果视频被暂停，重新播放
            if (current_video.paused) {
                current_video.play()
            }
        }
    }, 2000)
})();

