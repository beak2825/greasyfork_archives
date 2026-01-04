// ==UserScript==
// @name         [防检测]图寻pro插件pro max
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  按下1、2、3时有惊喜
// @author       YourName
// @match         *://tuxun.fun/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500924/%5B%E9%98%B2%E6%A3%80%E6%B5%8B%5D%E5%9B%BE%E5%AF%BBpro%E6%8F%92%E4%BB%B6pro%20max.user.js
// @updateURL https://update.greasyfork.org/scripts/500924/%5B%E9%98%B2%E6%A3%80%E6%B5%8B%5D%E5%9B%BE%E5%AF%BBpro%E6%8F%92%E4%BB%B6pro%20max.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建白屏遮罩层
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'white';
    overlay.style.zIndex = '99';
    overlay.style.display = 'none';
    document.body.appendChild(overlay);

    // 监听键盘事件
    document.addEventListener('keydown', function(event) {
        if (event.key === '1' || event.key === '2' || event.key === '3') {
            overlay.style.display = 'block';
            disableInteractions();
        }
    });

    // 禁用页面交互
    function disableInteractions() {
        document.body.style.pointerEvents = 'none'; // 禁用所有点击事件
        document.body.style.userSelect = 'none';    // 禁用文本选择
    }

    // 启用页面交互
    function enableInteractions() {
        document.body.style.pointerEvents = ''; // 启用所有点击事件
        document.body.style.userSelect = '';    // 启用文本选择
    }
})();