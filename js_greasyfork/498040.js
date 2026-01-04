// ==UserScript==
// @name         MoeGirl Redirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirect zh.moegirl.org.cn to moegirl.icu
// @author       Your Name
// @match        http://zh.moegirl.org.cn/*
// @match        https://zh.moegirl.org.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498040/MoeGirl%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/498040/MoeGirl%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前的URL
    var currentUrl = window.location.href;

    // 匹配并提取条目名称
    var match = currentUrl.match(/https?:\/\/zh\.moegirl\.org\.cn\/[^\/]+\/(.+)/);
    
    if (match) {
        // 构造新的URL
        var newUrl = 'https://moegirl.icu/' + match[1];
        
        // 重定向到新的URL
        window.location.replace(newUrl);
    }
})();
