// ==UserScript==
// @name         Minecraft Fandom to Minecraft Wiki Redirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirect from Minecraft Fandom to Minecraft Wiki
// @author       You
// @match        https://minecraft.fandom.com/zh/wiki/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/498441/Minecraft%20Fandom%20to%20Minecraft%20Wiki%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/498441/Minecraft%20Fandom%20to%20Minecraft%20Wiki%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前URL
    var currentUrl = window.location.href;

    // 提取$1参数（即URL中'/wiki/'之后的部分）
    var pageName = currentUrl.split('/wiki/')[1];

    // 如果找到了页面名，并且它不是空的
    if (pageName && pageName.trim() !== '') {
        // 构造新的URL
        var newUrl = 'https://zh.minecraft.wiki/w/' + pageName;

        // 重定向到新URL
        window.location.href = newUrl;
    }
})();