// ==UserScript==
// @name         changeSize
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修改b站视频播放列表的大小，原来的太小了，给官方提了问题也不改
// @author       liuxudong
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458283/changeSize.user.js
// @updateURL https://update.greasyfork.org/scripts/458283/changeSize.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function changeSize() {
        const target = document.getElementsByClassName("video-sections-content-list")
        const len = target.length
        if (len > 0) {
            const d = target[0]
            d.style.height = '500px'
            d.style.maxHeight = '500px'
        }
    }

    setTimeout(changeSize, 2000)

    // Your code here...
})();