// ==UserScript==
// @name         腾讯、爱奇艺、B站、芒果、优酷
// @namespace     http://tampermonkey.net/
// @version       0.9
// @description   鼠标放右下角
// @author        zzc
// @match      *://*.bilibili.com/*
// @match      *://*.youku.com/*
// @match      *://*.qq.com/x/cover/*
// @match      *://*.qq.com/x/page/*
// @match      *://*.qq.com/play*
// @match      *://*.qq.com/cover*
// @match      *://*tv.sohu.com/*
// @match      *://*.iqiyi.com/*
// @match      *://*.le.com/ptv/vplay/*
// @match      *://*.tudou.com/*
// @match      *://*.mgtv.com/b/*
// @match      *://*.qq.com/*
// @match      *://*x.com/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/491574/%E8%85%BE%E8%AE%AF%E3%80%81%E7%88%B1%E5%A5%87%E8%89%BA%E3%80%81B%E7%AB%99%E3%80%81%E8%8A%92%E6%9E%9C%E3%80%81%E4%BC%98%E9%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/491574/%E8%85%BE%E8%AE%AF%E3%80%81%E7%88%B1%E5%A5%87%E8%89%BA%E3%80%81B%E7%AB%99%E3%80%81%E8%8A%92%E6%9E%9C%E3%80%81%E4%BC%98%E9%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义要使用的解析链接
    var parseLinks = [
        'https://jx.m3u8.tv/jiexi/?url=',
        'https://video.isyour.love/player/getplayer?url=',
        'https://jx.yparse.com/index.php?url=',
        'https://jx.xmflv.com/?url='
    ];

    // 创建一个包含所有按钮的容器
    var buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.bottom = '20px';
    buttonContainer.style.right = '20px';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';
    buttonContainer.style.alignItems = 'flex-end';
    buttonContainer.style.zIndex = '9999';
    buttonContainer.style.opacity = '0'; // 初始状态为透明（隐藏）
    buttonContainer.style.transition = 'opacity 0.5s ease'; // 添加过渡效果

    // 遍历链接数组，为每个链接创建一个按钮
    parseLinks.forEach(function(link, index) {
        var button = document.createElement('button');
        button.innerHTML = '解 ' + (index + 1);
        button.style.marginBottom = '10px';
        button.style.padding = '5px 10px';
        button.style.backgroundColor = '#4CAF50'; // 绿色背景
        button.style.color = 'white'; // 白色文字
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.onclick = function() {
            var currentUrl = window.location.href;
            var targetUrl = link + encodeURIComponent(currentUrl);
            window.open(targetUrl, '_blank');
        };

        buttonContainer.appendChild(button);
    });

    // 将按钮容器添加到页面上
    document.body.appendChild(buttonContainer);

    // 添加鼠标进入和离开事件
    var mouseInTimer = null; // 用于存储setTimeout返回的ID
    var buttonContainerRect = buttonContainer.getBoundingClientRect(); // 获取按钮容器的位置和大小

    document.addEventListener('mousemove', function(event) {
        // 检查鼠标是否移动到按钮容器的区域内
        if (event.clientX > buttonContainerRect.left &&
            event.clientX < buttonContainerRect.right &&
            event.clientY > buttonContainerRect.top &&
            event.clientY < buttonContainerRect.bottom) {
            // 鼠标在按钮容器内，显示按钮
            buttonContainer.style.opacity = '1';

            // 清除之前的定时器（如果存在的话）
            clearTimeout(mouseInTimer);

            // 设置新的定时器，5秒后隐藏按钮
            mouseInTimer = setTimeout(function() {
                buttonContainer.style.opacity = '0'; // 隐藏按钮
            }, 400);
        }
    });

    // 当鼠标离开页面时，也隐藏按钮
    document.addEventListener('mouseout', function(event) {
        if (event.relatedTarget === null) { // 如果鼠标是离开整个文档（例如移出浏览器窗口）
            buttonContainer.style.opacity = '0'; // 隐藏按钮
            clearTimeout(mouseInTimer); // 清除定时器
        }
    });
})();