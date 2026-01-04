// ==UserScript==
// @name         通用视频加减调速
// @namespace    https://yeyu1024.xyz
// @version      1.0
// @description  通用视频调速，突破0到16倍速
// @author       夜雨
// @run-at       document-end
// @match        *://*/*
// @compatible   Chrome
// @compatible   Firefox
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481933/%E9%80%9A%E7%94%A8%E8%A7%86%E9%A2%91%E5%8A%A0%E5%87%8F%E8%B0%83%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/481933/%E9%80%9A%E7%94%A8%E8%A7%86%E9%A2%91%E5%8A%A0%E5%87%8F%E8%B0%83%E9%80%9F.meta.js
// ==/UserScript==

(function() {


    'use strict';

    //host, selector
    const urlList = {
        bilibili: 'bwp-video',
        douyin: ".xg-video-container video"
    };

    try {
        GM_registerMenuCommand("减速/加速", function (event) {
            let rateVal =  prompt("请输入您的速率(0-16)", "2.0");
            if (!isNaN(rateVal)) {
                console.log(rateVal)
                if (rateVal > 16 || rateVal < 0) {
                    alert("无效数值")
                    return
                }
                let video_ = null
                for (let key in urlList) {
                    if(location.host.replace(/\./g,"").includes(key)){
                        document.querySelector(urlList[key])
                        break
                    }
                }

                if(!video_){
                    video_ = document.querySelector("video")
                }
                console.warn("video_:", video_)
                video_.playbackRate = parseFloat(rateVal);
            }else{
                alert("无效数值")
            }
        }, "rate");
    }catch (e) { }

})();
