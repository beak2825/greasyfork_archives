// ==UserScript==
// @name         C++参考手册搜索引擎替换
// @namespace    https://github.com/guitarandherandher
// @version      0.1
// @description  在zh.cppreference.com上的搜索引擎从DuckDuckGo替换为百度
// @author       吉他及她
// @license      MIT
// @match        https://zh.cppreference.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520302/C%2B%2B%E5%8F%82%E8%80%83%E6%89%8B%E5%86%8C%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/520302/C%2B%2B%E5%8F%82%E8%80%83%E6%89%8B%E5%86%8C%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待DOM完全加载
    window.addEventListener('load', function() {
        var searchForm = document.querySelector('form[action="https://duckduckgo.com/"]');
        if (searchForm) {
            searchForm.action = 'https://www.baidu.com/s';
            var searchInput = searchForm.querySelector('input[name="q"]');
            if (searchInput) {
                searchInput.name = 'wd';
                searchForm.addEventListener('submit', function() {
                    searchInput.value += ' site:zh.cppreference.com';
                });
            }
        }
    });
})();