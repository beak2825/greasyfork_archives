// ==UserScript==
// @name         石之家 Icon
// @namespace    https://ff14risingstones.web.sdo.com/pc/index.html#/post/detail/77674
// @version      1.2
// @description  为《石之家》移动端添加 iOS Web App 和 Android PWA 图标
// @author       ShadyWhite
// @match        https://ff14risingstones.web.sdo.com/mob/*
// @icon         https://ff14risingstones.web.sdo.com/pc/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483162/%E7%9F%B3%E4%B9%8B%E5%AE%B6%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/483162/%E7%9F%B3%E4%B9%8B%E5%AE%B6%20Icon.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // iOS Web App
    // 添加图标
    var iconLink = document.createElement('link');
    iconLink.rel = 'apple-touch-icon-precomposed';
    iconLink.sizes = '192x192'; // 设置图标尺寸
    iconLink.href = 'https://ff14risingstones.web.sdo.com/pc/favicon.ico'; // 设置图标 URL
    document.head.appendChild(iconLink);

    // 添加启动画面
    // var splashLink = document.createElement('link');
    // splashLink.rel = 'apple-touch-startup-image';
    // splashLink.href = '替换为你想要的启动画面URL.png'; // 设置启动画面 URL
    // document.head.appendChild(splashLink);

    // 添加标题
    // var titleMeta = document.createElement('meta');
    // titleMeta.name = 'apple-mobile-web-app-title';
    // titleMeta.content = '替换为你想要的 Web App 标题'; // 设置 Web App 标题
    // document.head.appendChild(titleMeta);

    // Android PWA
    // 创建 manifest.json 文件
    var manifest = {
        "name": "FF14 Rising Stones icon",
        "short_name": "FF14",
        "start_url": "/mob/index.html#/index",
        "display": "standalone",
        "icons": [
            {
                "src": "https://ff14risingstones.web.sdo.com/pc/favicon.ico",
                "sizes": "192x192",
                "type": "image/x-icon"
            }
       ]
    };

    var manifestJson = JSON.stringify(manifest);

    var manifestUrl = URL.createObjectURL(new Blob([manifestJson], {
        type: "application/json"
    }));

    var PWAiconlink = document.createElement("link");
    PWAiconlink.rel = "manifest";
    PWAiconlink.href = manifestUrl;

    document.head.appendChild(PWAiconlink);

})();