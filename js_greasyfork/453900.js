// ==UserScript==
// @name         MOOC 视频流地址获取
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  获取 MOOC 播放视频的真实地址，通过 console 查看！
// @author       dfface
// @match        https://www.icourse163.org/learn/*
// @icon         https://www.google.com/s2/favicons?domain=icourse163.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453900/MOOC%20%E8%A7%86%E9%A2%91%E6%B5%81%E5%9C%B0%E5%9D%80%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/453900/MOOC%20%E8%A7%86%E9%A2%91%E6%B5%81%E5%9C%B0%E5%9D%80%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

let arrays = [[]];  // bug: 必须初始化为二维数组！

(function() {
    'use strict';
    console.log("请先：右键->显示统计信息");
    setInterval(function() {
        let video_info = document.querySelector("p.j-content");
        if (video_info !== null) {
            let video_arrays = video_info.textContent.matchAll(/"urls":\["(.*?)"\]/g);  // bug: 必须/ / 必须? 必须g
            video_arrays = [...video_arrays]
            if (video_arrays.length > 0) {
                for (let i in video_arrays) {
                    let wait_to_print = video_arrays[i][1];
                    let already_print = arrays.length == video_arrays.length ? arrays[i][1]: "";
                    if (wait_to_print !== already_print) {
                        console.log(i + ": ");
                        console.log(wait_to_print);
                    }
                }
                arrays = video_arrays;
            }
        }
    }, 3000);
})();