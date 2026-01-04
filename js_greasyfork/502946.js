// ==UserScript==
// @name         B站广告清除
// @namespace    http://tampermonkey.net/clearbilibili
// @version      0.0.1
// @description  ANMUZ  of GouChuang Middle School
// @author       暗木z
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502946/B%E7%AB%99%E5%B9%BF%E5%91%8A%E6%B8%85%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/502946/B%E7%AB%99%E5%B9%BF%E5%91%8A%E6%B8%85%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clearwindow() {
        const IdList = ["right-bottom-banner", "activity_vote","bannerAd"];
        const DataVList = ["div[data-v-b0d4be26][data-v-76fb7def]", "div[data-v-3c535736]"];
        const ClassList = [".right-entry-item"];
        const leftEntries = document.querySelectorAll('.left-entry');

        IdList.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.remove();
            }
        });

        DataVList.forEach(selector => {
            document.querySelectorAll(selector).forEach(div => {
                div.remove();
            });
        });

        ClassList.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.remove();
            });
        });
    }


    function init(){
        console.log("等待页面初始化完成...")
        const div = document.querySelector(".harmony-font.header-v2.win");
        if (div && document.querySelector(".v-popover-wrap.header-avatar-wrap")) {
            clearwindow();
            console.log("已经清除广告")
            clearInterval(InitSetInterval);
            console.log("已销毁定时任务")
        }else {
            console.log("页面未加载完成")
        }
    }

    const div = document.querySelector(".harmony-font.header-v2.win");
    if (div && document.querySelector(".v-popover-wrap.header-avatar-wrap")) {
        console.log("这里是手动销毁操作")
        div.addEventListener("click", function() {
            clearwindow();
        });
    }else{
        console.log("未发现广告")
    }

    var InitSetInterval = setInterval(init, 1000);

})();;