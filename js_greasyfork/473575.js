// ==UserScript==
// @name         百度网盘视频边栏宽度缩放按钮
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为百度网盘视频边栏（视频/课件/文稿）添加宽度缩放按钮
// @author       weixiaorucimeimiao
// @match        *://pan.baidu.com/pfile/video*
// @icon         https://nd-static.bdstatic.com/m-static/v20-main/favicon-main.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/473575/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E8%BE%B9%E6%A0%8F%E5%AE%BD%E5%BA%A6%E7%BC%A9%E6%94%BE%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/473575/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E8%BE%B9%E6%A0%8F%E5%AE%BD%E5%BA%A6%E7%BC%A9%E6%94%BE%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

window.onload = function() {
    'use strict';

    setTimeout(function() {
        console.log("ACTION!")
        const header = document.querySelector("div.vp-tabs__header");
        const scaleControls = document.createElement("div");
        scaleControls.className = "vp-tabs__header-item";
        scaleControls.style = "margin-left: auto; margin-right: 0px";
        scaleControls.innerHTML = `
            <div class="vp-tabs__header-item plus"><span style="font-size: 20px;">+</span></div>
            <div class="vp-tabs__header-item reset"><span style="font-size: 20px;">↻</span></div>
            <div class="vp-tabs__header-item minus" style="margin-right: 0px"><span style="font-size: 20px;">−</span></div>
        `;
        header.appendChild(scaleControls);

        const vpAside = document.querySelector("section.vp-personal-home-layout > section.vp-layout > aside.vp-aside");
        const plus = document.querySelector("div.vp-tabs__header-item.plus");
        const minus = document.querySelector("div.vp-tabs__header-item.minus");
        const reset = document.querySelector("div.vp-tabs__header-item.reset");

        vpAside.style.width = GM_getValue("latestWidth", "450px"); // 使用保存的最新宽度，如果没有则为默认 450px

        let plusTimer, minusTimer;

        plus.addEventListener("mouseenter", function(event) {
            plusTimer = setInterval(function() {
                vpAside.style.width = (parseInt(vpAside.style.width) + 1) + "px";
                GM_setValue("latestWidth", vpAside.style.width);
            }, 0);
        });
        plus.addEventListener("mouseup", function(event) { clearInterval(plusTimer); });
        plus.addEventListener("mouseout", function(event) { clearInterval(plusTimer); });
        plus.addEventListener("click", function(event) {
            vpAside.style.width = (parseInt(vpAside.style.width) + 20) + "px";
            GM_setValue("latestWidth", vpAside.style.width);
        });

        minus.addEventListener("mouseenter", function(event) {
            minusTimer = setInterval(function() {
                vpAside.style.width = (parseInt(vpAside.style.width) - 1) + "px";
                GM_setValue("latestWidth", vpAside.style.width);
            }, 0);
        });
        minus.addEventListener("mouseup", function(event) { clearInterval(minusTimer); });
        minus.addEventListener("mouseout", function(event) { clearInterval(minusTimer); });
        minus.addEventListener("click", function(event) {
            vpAside.style.width = (parseInt(vpAside.style.width) - 20) + "px";
            GM_setValue("latestWidth", vpAside.style.width);
        });

        reset.addEventListener("click", function(event) {
            vpAside.style.width = "450px"; // 设置默认宽度
            GM_setValue("latestWidth", vpAside.style.width); // 保存宽度到存储中
        });

        const observer = new MutationObserver(function(mutations) { // 当宽度意外恢复默认时，重新赋值最新宽度
            vpAside.style.width = GM_getValue("latestWidth", "450px");
        });
        observer.observe(vpAside, { attributes: true });

        GM_addStyle(".ai-draft__filter { width: auto !important; display: none; }"); // 文稿底部滤镜

        GM_addStyle(`
/* 进度条背景 */
.video-js .vjs-control-bar {
    background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .5) 100%);
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .5) 100%);
}
/* 字幕 */
.vp-video .vp-video__subtitle-text {
    bottom: 14px;
    /* background: radial-gradient(circle, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%); */
    background: none;
    text-shadow:
        -1px -1px 1px #000,
        1px -1px 1px #000,
        -1px 1px 1px #000,
        1px 1px 1px #000,
        -1px 0 1px #000,
        1px 0 1px #000,
        0 -1px 1px #000,
        0 1px 1px #000;
    pointer-events: none; /* 禁止鼠标事件以免遮挡进度条 */
}
/* 字幕logo */
.vp-video .vp-video__subtitle-text::after {
    content: "";
    display: none;
}
/* 大播放按钮 */
.vjs-paused .vjs-big-play-button, .video-js:hover .vjs-big-play-button {
    background: rgba(3, 11, 26, .35);
}
/* 总体最大宽度 */
.vp-layout {
    max-width: 100vw;
}

/* 边栏导航去除padding，尺寸与展开时统一 */
.vp-personal-aside-guide {
    padding: 0;
    height: 72px;
    width: 19px; /* 本为18px */
    border-bottom-left-radius: 20px;
    border-top-left-radius: 20px;
}
/* 边栏展开按钮去除上横线 */
.vp-personal-aside-guide .vp-personal-aside-guide__operate-block--list:last-child {
    border-top: none;
    padding-top: 0;
}
/* 隐藏“展开”二字 */
.vp-personal-aside-guide .vp-personal-aside-guide__operate-block--list:last-child .text {
    display: none;
}
/* 隐藏边栏导航的AI和课件按钮 */
.vp-personal-aside-guide .vp-personal-aside-guide__operate-block--list:not(:last-child) {
    display: none;
}
        `);

    }, 1000);
};