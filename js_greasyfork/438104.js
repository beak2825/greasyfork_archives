// ==UserScript==
// @name         闲鱼webclip助手
// @namespace    https://rabit.pw/
// @version      0.1
// @description  优化闲鱼页面数据，使之对webclipper插件更友好。
// @author       ttimasdf
// @license      GPLv3
// @match        https://market.m.taobao.com/app/idleFish-F2e/*
// @icon         https://icons.duckduckgo.com/ip2/taobao.com.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438104/%E9%97%B2%E9%B1%BCwebclip%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/438104/%E9%97%B2%E9%B1%BCwebclip%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    setTimeout(function() {
        // 点击“展开查看全部”按钮
        var allElements = document.querySelectorAll(".rax-scrollview > div > div > div > div > div > span");
        var element = allElements[allElements.length - 1];
        if (element !== null) {
            console.log("Found element:", element);
            element.click();
        }
        else {
            console.log("Button not found!");
        }
    }, 500);

    setInterval(function() {
        // 循环查找页面中的低清晰度图片，将之替换为高清原图。
        // 因为商品描述中的图片都是动态载入的。所以需要将页面划到底部才能成功加载所有图片。
        var images = document.querySelectorAll("img");
        console.log(`Found ${images.length} images`);
        for(var i = 0;i < images.length; i++){
            var image = images[i];
            image.src = image.src.replace(/fleamarket.jpg_.*$/, "fleamarket.jpg");
        }
    }, 1000);
})();
