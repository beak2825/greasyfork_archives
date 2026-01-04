// ==UserScript==
// @name         CSDN beautification
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  CSDN 界面美化
// @author       lihaji
// @match        https://blog.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481994/CSDN%20beautification.user.js
// @updateURL https://update.greasyfork.org/scripts/481994/CSDN%20beautification.meta.js
// ==/UserScript==

(function () {
    'use strict';


    // 设置元素居中排列
    // 获取 #mainBox 元素
    const mainBoxElement = document.getElementById("mainBox");
    // 设置元素样式为 flex 布局
    mainBoxElement.style.display = "flex";
    // 设置子元素居中排列
    mainBoxElement.style.justifyContent = "center";
    mainBoxElement.style.marginRight = "0";

    // 获取带有类名 "nodata" 的 body 元素
    var body = document.querySelector("body.nodata");

    // 修改背景颜色为白色
    body.style.backgroundColor = "#000000";




    document.querySelector("#mainBox > aside").remove();
    document.querySelector("#toolbarBox").remove();
    document.querySelector(".csdn-side-toolbar").remove();
    document.querySelector("#rightAside").remove();
})();