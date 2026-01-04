// ==UserScript==
// @name         基金从业人员远程培训系统工具
// @namespace
// @version      1.0
// @description  zh-cn
// @author       听说你很会玩
// @match        https://peixun.amac.org.cn/*
// @icon         https://peixun.amac.org.cn/favicon.ico
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/852316
// @downloadURL https://update.greasyfork.org/scripts/518451/%E5%9F%BA%E9%87%91%E4%BB%8E%E4%B8%9A%E4%BA%BA%E5%91%98%E8%BF%9C%E7%A8%8B%E5%9F%B9%E8%AE%AD%E7%B3%BB%E7%BB%9F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/518451/%E5%9F%BA%E9%87%91%E4%BB%8E%E4%B8%9A%E4%BA%BA%E5%91%98%E8%BF%9C%E7%A8%8B%E5%9F%B9%E8%AE%AD%E7%B3%BB%E7%BB%9F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 获取video元素
    const video = document.getElementById("vidplayer").firstElementChild;
    console.log(video);

    // 2. 添加播放事件监听器
    video.addEventListener('play', function () {
        console.log('视频开始播放了');

        // 这里还可以添加更多自定义操作，比如更新页面上显示视频播放状态的提示信息等
         video.playbackRate = 2;//自动二倍速播放
    });
    video.addEventListener('pause', function () {
        video.playbackRate = 2;
        video.play();
        console.log('视频又播放了');
        // 可以在这里执行暂停相关的自定义操作，例如暂停页面上与视频同步的动画效果等
    });
// window.onload = function () {
//     const dianji = document.getElementsByClassName("outter")[0];
//     dianji.click();
// }
    const dianji = document.getElementsByClassName("outter")[0];
    dianji.addEventListener("click",function () {
            video.playbackRate = 2;
    })

    setInterval(function () {
        const currentSpeed = video.playbackRate;
        console.log(`当前视频播放速度为：${currentSpeed}倍`);
        // 这里还可以根据当前速度进行更多逻辑判断和操作，比如判断速度是否超出合理范围等
    }, 1000);


})();