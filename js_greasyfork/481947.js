// ==UserScript==
// @name         提瓦特大地图标点替换工具
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  解决米哈游官方大地图标点点开是空白的问题
// @author       NyanKoSenSei
// @license      MIT
// @match        https://webstatic.mihoyo.com/ys/app/interactive-map/*
// @icon         https://webstatic.mihoyo.com/ys/app/interactive-map/mapicon.png
// @downloadURL https://update.greasyfork.org/scripts/481947/%E6%8F%90%E7%93%A6%E7%89%B9%E5%A4%A7%E5%9C%B0%E5%9B%BE%E6%A0%87%E7%82%B9%E6%9B%BF%E6%8D%A2%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/481947/%E6%8F%90%E7%93%A6%E7%89%B9%E5%A4%A7%E5%9C%B0%E5%9B%BE%E6%A0%87%E7%82%B9%E6%9B%BF%E6%8D%A2%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 原始请求拦截
    const originOpen = XMLHttpRequest.prototype.open;
    // 执行体
    XMLHttpRequest.prototype.open = function (method, url) {
        // 判断是否是get请求，且路径是【https://waf-api-takumi.mihoyo.com/】开头
        let flag = url.indexOf("https://waf-api-takumi.mihoyo.com/common/map_user/ys_obc/v1/map/point/info") != -1;
        if (method === "GET" && flag) {
            arguments[1] = url.replace("https://waf-api-takumi.mihoyo.com/common/map_user/ys_obc/v1/map/point/info", "https://api-takumi.mihoyo.com/common/map_user/ys_obc/v1/map/point/info");
        }
        // 执行请求
        originOpen.apply(this, arguments);
    };
})();
