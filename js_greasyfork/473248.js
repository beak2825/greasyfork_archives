// ==UserScript==
// @name         讯飞星火 移除背景水印
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  移除星火聊天界面背景水印 截图不泄露信息
// @author       You
// @match        https://xinghuo.xfyun.cn/chat?id=*
// @match        https://xinghuo.xfyun.cn/desk
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xfyun.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473248/%E8%AE%AF%E9%A3%9E%E6%98%9F%E7%81%AB%20%E7%A7%BB%E9%99%A4%E8%83%8C%E6%99%AF%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/473248/%E8%AE%AF%E9%A3%9E%E6%98%9F%E7%81%AB%20%E7%A7%BB%E9%99%A4%E8%83%8C%E6%99%AF%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() {
        let watermark = document.getElementById('watermark-wrapper');
        if (watermark) {
            watermark.remove();
        } else {
            let timer = setInterval(function() {
                let watermark = document.getElementById('watermark-wrapper');
                if (watermark) {
                    watermark.remove();
                    clearInterval(timer);
                }
            }, 1000);
        }
    }, 1000);
})();