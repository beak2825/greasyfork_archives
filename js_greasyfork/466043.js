// ==UserScript==
// @name         国际站页面跳转
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一个跳转到网页底部的脚本
// @author       韩冬
// @match      *://post.alibaba.com/product/*
// @icon         https://www.google.com/s2/favicons?domain=alibaba.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466043/%E5%9B%BD%E9%99%85%E7%AB%99%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/466043/%E5%9B%BD%E9%99%85%E7%AB%99%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var box = document.getElementById("struct-nav");
    var input = document.createElement("input");
    input.type = "button";
    input.id = "han"
    input.value = "跳转到底部"
    box.appendChild(input);
    document.getElementById("han").style.background="#fff";
    document.getElementById("han").style.borderColor = "#fffff";
    document.getElementById("han").style.border = "1px solid #1047f5";
    document.getElementById("han").style.color= "#1047f5";
    document.getElementById("han").style.display = "block";
    document.getElementById("han").style.width = "100px";
    document.getElementById("han").style.height = "32px";
    document.getElementById("han").style.borderRadius="18px";
    document.getElementById("han").style.marginTop="12px";
    document.getElementById("han").style.marginBottom="12px";
    document.getElementById("han").style.float="right";
    document.getElementById("han").onclick = function() {
        window.scrollTo(0,document.body.scrollHeight);}

})();