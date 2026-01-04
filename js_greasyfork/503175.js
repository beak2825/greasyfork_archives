// ==UserScript==
// @name         Bilibili哔哩哔哩B站播放页优化自适应宽屏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自适应宽屏
// @author       weixiaorucimeimiao
// @match        https://www.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503175/Bilibili%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9B%E7%AB%99%E6%92%AD%E6%94%BE%E9%A1%B5%E4%BC%98%E5%8C%96%E8%87%AA%E9%80%82%E5%BA%94%E5%AE%BD%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/503175/Bilibili%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9B%E7%AB%99%E6%92%AD%E6%94%BE%E9%A1%B5%E4%BC%98%E5%8C%96%E8%87%AA%E9%80%82%E5%BA%94%E5%AE%BD%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement("style");
    style.innerHTML = `
/* 追番 */
.main-container {
    margin: 30px 60px;
    width: auto;
}
/* 右 */
.main-container .plp-r.sticky {
    position: absolute;
    top: 10px;
    bottom: unset;
    left: unset;
}
/* 新版播放器 */
.video_playerNormal__VwqTs {
    height: auto;
}
/* 页头去除悬浮 */
.fixed-header .bili-header__bar {
    position: absolute !important;
}
/* 顶部遮罩 */
.bpx-player-top-mask {
    height: 120px;
    opacity: 0.9;
}
/* 遮罩 */
.bpx-player-container[data-ctrl-hidden=false] .bpx-player-control-mask {
    opacity: 0.6;
}
/* 控制栏整体 */
.bpx-player-control-entity {height: unset;}
@media screen and (min-width: 750px) {
    .bpx-player-container[data-screen=full] .bpx-player-control-entity,
    .bpx-player-container[data-screen=full] .bpx-player-control-wrap,
    .bpx-player-container[data-screen=web] .bpx-player-control-entity,
    .bpx-player-container[data-screen=web] .bpx-player-control-wrap {
        height: unset;
    }
}
/* 进度条 */
.bpx-player-control-top {bottom: 32px;}
@media screen and (min-width: 750px) {
    .bpx-player-container[data-screen=full] .bpx-player-control-top,
    .bpx-player-container[data-screen=web] .bpx-player-control-top {
        bottom: 32px;
    }
}
.bpx-player-progress-area .bpx-player-progress-wrap .bpx-player-progress {
    height: 2px !important;
}
/* 按钮 */
.bpx-player-control-bottom {height: 30px;}
@media screen and (min-width: 750px) {
    .bpx-player-container[data-screen=full] .bpx-player-control-bottom,
    .bpx-player-container[data-screen=web] .bpx-player-control-bottom {
        height: 35px;
    }
}
/* 高能进度条 */
.bpx-player-pbp.show {bottom: 38px;}
.bpx-player-container[data-screen=full] .bpx-player-pbp.show,
.bpx-player-container[data-screen=web] .bpx-player-pbp.show {
    bottom: 38px;
}
/* 底部进度条 */
.bpx-player-shadow-progress-area {
    height: 1px;
}
/* 悬浮评论框
.fixed-reply-box {
    display: none;
} */
/* 宽屏按钮，已排除追番的WEB-OGV新版播放器
#playerWrap .bpx-player-ctrl-wide {
    display: none;
} */
/* 视频 */
.bpx-player-video-wrap video {
    max-height: 100vh;
}
/* */
#mirror-vdcon.video-container-v1 {margin: 0 60px;}
.left-container {width: auto; max-width: 65vw;}
#bilibili-player {width: auto; height: auto; min-width: 668px; min-height: 422px;} /* height: 95vh; */
#playerWrap {height: auto;}
    `;
/*
    document.head.append(style);

    setTimeout(function() {
        document.head.append(style); // 移至最后
        document.querySelector(".bpx-player-progress").style = "height: 2px"; // 进度条高度；内联样式原为4px，而样式表的为2px
        document.querySelector(".bpx-player-video-inputbar").style = "height: 26px !important;"; // 弹幕输入栏，该样式在网页全屏时会被顶掉，故加上!important
    }, 3000);
*/
    const maxTimeToCheck = 15000; // 最多检查 15000 毫秒，即 15 秒
    let elapsedTime = 0;

    function adjust() {
        elapsedTime += 100;
        console.log(elapsedTime);
        if (document.querySelector("div.bpx-player-progress")) { // 出现进度条即停止循环
            clearInterval(intervalId); // 清除定时器，停止检查
            document.head.appendChild(style); // 添加样式表
            document.querySelector(".bpx-player-video-inputbar").style = "height: 26px !important"; // 弹幕输入栏，该样式在网页全屏时会被顶掉，故加上!important
            // 为宽屏按钮设置EventListener
            const wideBtn = document.querySelector(".bpx-player-ctrl-btn.bpx-player-ctrl-wide");
            wideBtn?.addEventListener("click", function() {
                const widened = document.querySelector(".bpx-player-ctrl-btn.bpx-player-ctrl-wide.bpx-state-entered");
                if (widened) {
                    console.log("widened");
                    style.innerHTML = style.innerHTML.replace(/.left-container {width: auto; max-width: 65vw;}|#bilibili-player {width: auto; height: auto; min-width: 668px; min-height: 422px;}/g, ``); // 修改样式表
                    document.head.appendChild(style);
                } else {
                    console.log("not widened");
                    style.innerHTML += `.left-container {width: auto; max-width: 65vw;} #bilibili-player {width: auto; height: auto; min-width: 668px; min-height: 422px;}`; // 修改样式表
                    document.head.appendChild(style);
                }
            }); // 在冒泡阶段

        } else if (elapsedTime >= maxTimeToCheck) {
            clearInterval(intervalId); // 清除定时器，停止检查
        }
    }
    const intervalId = setInterval(adjust, 100);
    // .left-container和#bilibili-player的修改将影响宽屏功能
})();