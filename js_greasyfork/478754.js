// ==UserScript==
// @name         一键下载 youtube 高清视频（最高支持 4K 视频）
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  在YouTube视频浏览页的左下角生成一个下载按钮，点击可以一键下载Youtube1080P高清视频
// @author       Cantan Tam
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478754/%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%20youtube%20%E9%AB%98%E6%B8%85%E8%A7%86%E9%A2%91%EF%BC%88%E6%9C%80%E9%AB%98%E6%94%AF%E6%8C%81%204K%20%E8%A7%86%E9%A2%91%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/478754/%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%20youtube%20%E9%AB%98%E6%B8%85%E8%A7%86%E9%A2%91%EF%BC%88%E6%9C%80%E9%AB%98%E6%94%AF%E6%8C%81%204K%20%E8%A7%86%E9%A2%91%EF%BC%89.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Create SVG element
    var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("width", "30px");
    svgElement.setAttribute("height", "30px");
    svgElement.setAttribute("viewBox", "93.3979 161.13086 4.2560406 5.1727986");
    svgElement.innerHTML = `
        <path d="m 94.96875,161.13086 c -0.282379,0 -0.513672,0.23276 -0.513672,0.51562 v 2.11719 h -0.644531 c -0.166394,0 -0.316713,0.10244 -0.38086,0.25586 -0.06378,0.15341 -0.02872,0.33109 0.08984,0.44922 l 1.714844,1.71484 c 0.159838,0.15983 0.421924,0.15901 0.582031,0 l 1.716797,-1.71484 c 0.117734,-0.11815 0.153013,-0.29583 0.08984,-0.44922 -0.06418,-0.15361 -0.214391,-0.25586 -0.38086,-0.25586 h -0.644531 v -2.11719 c 0,-0.28285 -0.230938,-0.51562 -0.513672,-0.51562 z m 0,0.21289 h 1.115234 c 0.168328,0 0.300782,0.13413 0.300782,0.30273 v 2.33008 h 0.857421 c 0.08118,0 0.153889,0.0473 0.185547,0.12305 0.03087,0.075 0.01292,0.1607 -0.04492,0.21875 l -1.714843,1.71484 v 0.002 c -0.07896,0.0793 -0.205608,0.0776 -0.285157,-0.002 l -1.714843,-1.71484 c -0.05824,-0.058 -0.07412,-0.14382 -0.04297,-0.21875 0.03179,-0.076 0.104451,-0.12305 0.185547,-0.12305 h 0.855469 v -2.33008 c 0,-0.16859 0.135003,-0.30273 0.302734,-0.30273 z" style="color:#000000;fill:#cccccc;-inkscape-stroke:none" />
    `;//通过svg生代码成下载图标

    // Create button element
    var buttonElement = document.createElement("button");
    buttonElement.style.border = "none"; // 移除图标边框
    buttonElement.style.background = "none"; // 移除图标背景
    buttonElement.appendChild(svgElement);

    // Style the button
    buttonElement.style.position = "fixed";
    buttonElement.style.bottom = "10px";
    buttonElement.style.left = "5px";
    buttonElement.style.zIndex = "9999";
    buttonElement.style.display = "none"; // 隐藏图标

    // 将按钮添加到页面
    document.body.appendChild(buttonElement);

    // 添加自定义样式
    GM_addStyle(`
        svg {
            display: block;
        }
    `);

    // 添加鼠标监听事件
    document.addEventListener("mousemove", function(event) {
        var mouseX = event.clientX;
        var mouseY = event.clientY;

        if (mouseX < 100 && mouseY > window.innerHeight - 100) {
            buttonElement.style.display = "block";
        } else {
            buttonElement.style.display = "none";
        }
    });

    // 添加鼠标点击事件
    buttonElement.addEventListener("click", function() {
        var currentURL = window.location.href;
        var newURL = currentURL.replace(/www\.youtube\.com\/watch\?v=/, "//youtube4kdownloader.com/download/video/https%253A%252F%252Fwww.youtube.com%252Fwatch%253Fv%253D");
        newURL = newURL.replace(/&t=.*/, ""); // 移除 "&t=" 字符以及后面所有的字符
        newURL = newURL.replace(/&list=.*/, ""); // 移除 "&list=" 字符以及后面所有的字符
        newURL = newURL.replace(/www\.youtube\.com\/shorts\//, "//youtube4kdownloader.com/download/video/https%253A%252F%252Fwww.youtube.com%252Fwatch%253Fv%253D");
        window.open(newURL, "_blank");
    });
})();
