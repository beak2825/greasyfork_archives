// ==UserScript==
// @name         CSDN屏蔽动态背景
// @version      1.0
// @description  屏蔽CSDN某个博客主题的动态GIF背景。该主题会导致大量资源占用，CPU温度飙升、风扇狂转，在笔记本电脑尤为明显。
// @author       Your Name
// @match        https://blog.csdn.net/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1298872
// @downloadURL https://update.greasyfork.org/scripts/494473/CSDN%E5%B1%8F%E8%94%BD%E5%8A%A8%E6%80%81%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/494473/CSDN%E5%B1%8F%E8%94%BD%E5%8A%A8%E6%80%81%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 图片链接
    var blockedImageUrl = 'https://csdnimg.cn/release/blogv2/dist/pc/themesSkin/skin-whitemove/images/bg.gif';

    // 获取所有图片元素
    var images = document.querySelectorAll('img');

    // 遍历图片元素
    for (var i = 0; i < images.length; i++) {
        var image = images[i];
        
        // 检查图片链接是否与被屏蔽的链接相同
        if (image.src === blockedImageUrl) {
            // 隐藏图片
            image.style.display = 'none';
        }
    }
})();
