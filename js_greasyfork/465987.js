// ==UserScript==
// @name         广东药师继续教育刷网课
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  网课视频自动播放下一级 有问题可以通过邮箱ymxmy@sina.com反馈问题
// @author       Ymx
// @match        https://www.gdzsyyzp.org.cn/index.php/Home/Video/learn_video/id/*
// @icon         https://img1.baidu.com/it/u=2298832174,71113162&fm=26&fmt=auto
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465987/%E5%B9%BF%E4%B8%9C%E8%8D%AF%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%88%B7%E7%BD%91%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/465987/%E5%B9%BF%E4%B8%9C%E8%8D%AF%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%88%B7%E7%BD%91%E8%AF%BE.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    // Your code here...
         const vdp = document.getElementById("video");
         // 监听播放
         var myVar = setInterval(function () {
            vdp.play();
            vdp.addEventListener('play', function () {
                    vdp.playbackSpeed=Number(5);

                });
            clearInterval(myVar);
        }, 500)
})();