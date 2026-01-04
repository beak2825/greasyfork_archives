// ==UserScript==
// @name         思特奇大学视频观看脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  思特奇大学视频后台观看，刷时长
// @author       fankq
// @match        http://training.si-tech.com.cn/uni/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=si-tech.com.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503618/%E6%80%9D%E7%89%B9%E5%A5%87%E5%A4%A7%E5%AD%A6%E8%A7%86%E9%A2%91%E8%A7%82%E7%9C%8B%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/503618/%E6%80%9D%E7%89%B9%E5%A5%87%E5%A4%A7%E5%AD%A6%E8%A7%86%E9%A2%91%E8%A7%82%E7%9C%8B%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        window.addEventListener("visibilitychange", function name(params) {
            console.log('----------------脚本触发-------------------')
        })
    }, 10000)

    // Your code here...
})();