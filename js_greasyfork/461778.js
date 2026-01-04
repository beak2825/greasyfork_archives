// ==UserScript==
// @name         BiliBili 隐藏所有与视频无关的元素
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  总是感觉B站界面内容太复杂，太多诱惑。这个脚本只保留了最基本的视频播放功能，避免丢失焦点，减少无意义的时间消耗
// @author       You
// @match        *://www.bilibili.com/video/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461778/BiliBili%20%E9%9A%90%E8%97%8F%E6%89%80%E6%9C%89%E4%B8%8E%E8%A7%86%E9%A2%91%E6%97%A0%E5%85%B3%E7%9A%84%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/461778/BiliBili%20%E9%9A%90%E8%97%8F%E6%89%80%E6%9C%89%E4%B8%8E%E8%A7%86%E9%A2%91%E6%97%A0%E5%85%B3%E7%9A%84%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const theMask = document.createElement("div")
    theMask.style.cssText = `
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        background-color: white;
        z-index: 8;
    `
    document.body.appendChild(theMask)

    const styleSheetText = `
        .left-container {
            position: static !important;
            z-index: initial !important;
        }

        #playerWrap {
            z-index: 11;
        }

        #multi_page, #danmukuBox, #v_desc, #arc_toolbar_report{
            z-index: 10;
        }

        .right-container-inner{
            position: static !important;
        }

        #danmukuBox, #arc_toolbar_report {
            position: relative !important;
        }

        .ad-report, .bpx-player-ending-panel{
            display: none !important;
        }


    `
    const addOnStyleSheet = document.createElement("style")
    addOnStyleSheet.innerHTML = styleSheetText
    document.body.appendChild(addOnStyleSheet)

    localStorage.setItem("recommend_auto_play", "close")



    // Your code here...
})();