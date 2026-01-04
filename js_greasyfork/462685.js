// ==UserScript==
// @name         Github加速访问插件
// @namespace    http://tampermonkey
// @version      1.0
// @description  通过加速Github的CDN加速节点，提高Github的访问速度
// @author       wll
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462685/Github%E5%8A%A0%E9%80%9F%E8%AE%BF%E9%97%AE%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/462685/Github%E5%8A%A0%E9%80%9F%E8%AE%BF%E9%97%AE%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的URL
    var currentUrl = window.location.href;

    // 判断当前页面是否为Github的文件页面
    if (currentUrl.indexOf("github.com") > -1 && currentUrl.indexOf("/blob/") > -1) {

        // 获取当前页面的文件路径
        var filePath = currentUrl.split("/blob/")[1];

        // 获取当前页面的文件所在的仓库名
        var repoName = currentUrl.split("/blob/")[0].split("github.com/")[1];

        // 构造加速后的URL
        var newUrl = "https://cdn.jsdelivr.net/gh/" + repoName + "@" + "master" + "/" + filePath;

        // 替换当前页面的URL
        window.location.replace(newUrl);
    }
})();