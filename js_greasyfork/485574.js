// ==UserScript==
// @name         将 bangumi 的顶栏搜索替换为 chii.ai 搜索
// @namespace    http://tampermonkey.net/
// @version      1
// @description  将 bgm.tv bangumi.tv 和 chii.in 的顶栏搜索替换为 chii.ai 搜索
// @author       onebyten
// @match        *://bgm.tv/*
// @match        *://bangumi.tv/*
// @match        *://chii.in/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485574/%E5%B0%86%20bangumi%20%E7%9A%84%E9%A1%B6%E6%A0%8F%E6%90%9C%E7%B4%A2%E6%9B%BF%E6%8D%A2%E4%B8%BA%20chiiai%20%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/485574/%E5%B0%86%20bangumi%20%E7%9A%84%E9%A1%B6%E6%A0%8F%E6%90%9C%E7%B4%A2%E6%9B%BF%E6%8D%A2%E4%B8%BA%20chiiai%20%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加搜索表单提交事件监听器
    document.querySelector('#headerSearch form').addEventListener('submit', function(event) {
        // 阻止默认的表单提交行为
        event.preventDefault();

        // 获取选择的搜索类别和搜索关键词
        var catValue = document.getElementById('siteSearchSelect').value;
        var searchTextValue = document.getElementById('search_text').value;

        // 替换搜索类别
        var catMapping = {
            'all': 'subject',
            '2': 'anime',
            '1': 'book',
            '4': 'game',
            '3': 'music',
            '6': 'real',
            'person': 'celebrity'
        };

        var catReplacement = catMapping[catValue] || catValue;

        // 构造跳转的 URL
        var redirectURL = 'https://chii.ai/search?q=' + encodeURIComponent(searchTextValue) + '&type=' + encodeURIComponent(catReplacement);

        // 跳转到指定的 URL
        window.location.href = redirectURL;
    });
})();