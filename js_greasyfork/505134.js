// ==UserScript==
// @name         Auto Complete Video
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Automatically complete video watching
// @match        https://www.cmechina.net/study2.jsp*
// @match        https://www.cmechina.net/cme/study2.jsp*
// @match        https://dxjj.haoyisheng.com/*
// @match        https://bjsqypx.haoyisheng.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505134/Auto%20Complete%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/505134/Auto%20Complete%20Video.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加一个按钮到页面
    function addButton() {
        const button = document.createElement('button');
        button.textContent = '完成视频';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.addEventListener('click', completeVideo);
        document.body.appendChild(button);
    }

    // 模拟视频完成的函数
    function completeVideo() {
        // 使用你提供的控制台命令来跳转到视频的最后一秒
        if (window.cc_js_Player) {
            window.cc_js_Player.jumpToTime(window.cc_js_Player.getDuration() - 1);
            console.log('视频已完成');
        } else {
            console.error('window.cc_js_Player 未定义');
        }
    }

    // 网页加载完成后添加按钮
    window.addEventListener('load', addButton);
})();