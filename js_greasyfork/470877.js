// ==UserScript==
// @name         网易云音乐高清专辑原图
// @namespace    MAIDPUNK
// @version      1.0
// @author       MAIDPUNK
// @description  自动加载网易云音乐高清专辑原图
// @match        https://music.163.com/*
// @grant        none
// @icon         https://s1.music.126.net/style/favicon.ico
// @license      MAIDPUNK 提交于 Greasy Fork
// @downloadURL https://update.greasyfork.org/scripts/470877/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E9%AB%98%E6%B8%85%E4%B8%93%E8%BE%91%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/470877/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E9%AB%98%E6%B8%85%E4%B8%93%E8%BE%91%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取所有符合条件的专辑图元素
    var albumCovers = document.querySelectorAll('div.cover.u-cover.u-cover-alb img[src*="?param=177y177"]');

    // 遍历每个元素并修改图片链接
    albumCovers.forEach(function(cover) {
        var src = cover.getAttribute('src');
        cover.setAttribute('src', src.replace('?param=177y177', ''));
    });
})();
