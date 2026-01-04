// ==UserScript==
// @name         fofo影院优化-自动跳下一集
// @namespace    chulong.script
// @version      0.1
// @date         2024-04-23
// @description  fofo影院优化,自动跳下一集，再也不用频繁手动点击了，尤其是看短剧
// @author       chulong
// @match        https://www.fofoyy.com/dianshiju/*
// @match        https://www.fofoyy.com/dongman/*
// @icon         https://www.fofoyy.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493359/fofo%E5%BD%B1%E9%99%A2%E4%BC%98%E5%8C%96-%E8%87%AA%E5%8A%A8%E8%B7%B3%E4%B8%8B%E4%B8%80%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/493359/fofo%E5%BD%B1%E9%99%A2%E4%BC%98%E5%8C%96-%E8%87%AA%E5%8A%A8%E8%B7%B3%E4%B8%8B%E4%B8%80%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    const video = document.getElementById('video')
    if (!video) {
        return;
    }
    video.addEventListener("ended", (event) => {
      
        let 当前播放集 = document.querySelector('div > ul > li.on')
        if (当前播放集) {
            if (当前播放集.nextElementSibling) {
                当前播放集.nextElementSibling.firstElementChild.click()
            }
        } else { // 刚打开页面没有选中，自动播放第一集
            let 第2集 = document.querySelector('#slider > div > div > div:nth-child(2) > ul > li:nth-child(2) > a')
            if (第2集) {
                第2集.click()
            }
        }
    })
})();