// ==UserScript==
// @name         旋转bilibili视频
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  较少的视频作者会将竖屏视频横放，在手机端只要旋转手机实体即可，操作门槛低，但是对于电脑端操作门槛变高，为这种稀有视频买一个旋转支架太不划算，所以在视频上添加一个按钮旋转视频。
// @author       beibeibeibei
// @license      MIT
// @match        https://www.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475404/%E6%97%8B%E8%BD%ACbilibili%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/475404/%E6%97%8B%E8%BD%ACbilibili%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 创建一个新的 button 元素
    var btn = document.createElement("BUTTON");
    // 设置按钮的文本
    btn.innerHTML = "旋转视频";
    // 设置按钮的其他属性
    btn.id = "beibeibeibei-rotate-video-button";
    btn.className = "rotate-video-button";
    btn.style.width = "70px";
    btn.style.height = "30px";
    btn.style.backgroundColor = "#1890FF";
    btn.style.border = "none";
    btn.style.color = "#fff";
    btn.style.fontSize = "12px";
    btn.style.borderRadius = "5px";
    btn.style.transition = "all 0.3s ease";
    btn.style.cursor = "pointer";
    btn.style.pointerEvents = "all";
    // 添加事件
    btn.addEventListener("click", function () {
        if (window.getComputedStyle(document.querySelector("video")).rotate == 'none') {
            document.querySelector("video").style.rotate = '90deg';
            document.querySelector("video").parentElement.style.scale = '56.26%';
        } else if (window.getComputedStyle(document.querySelector("video")).rotate == '90deg') {
            document.querySelector("video").style.rotate = '270deg';
            document.querySelector("video").parentElement.style.scale = '56.26%';
        } else if (window.getComputedStyle(document.querySelector("video")).rotate == '270deg') {
            document.querySelector("video").style.rotate = 'none';
            document.querySelector("video").parentElement.style.scale = '100%';
        }
    });
    btn.addEventListener("mouseover", function () {
        this.style.backgroundColor = "#1800FF";
    });
    btn.addEventListener("mouseout", function () {
        this.style.backgroundColor = "#1890FF";
    });
    btn.addEventListener("mousedown", function () {
        this.style.backgroundColor = "#18ccff";
        this.style.scale = "0.95";
        this.style.opacity = "0.5";
    });
    btn.addEventListener("mouseup", function () {
        this.style.backgroundColor = "#1800FF";
        this.style.scale = "1";
        this.style.opacity = "1";
    });
    // 添加到的元素
    document.querySelector("div.bpx-player-top-left").appendChild(btn);
    // Your code here...
})();
