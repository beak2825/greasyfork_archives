// ==UserScript==
// @name         Google Search Prompt
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Prompt for search input when clicking on Google search box
// @author       You
// @license      MIT
// @match        https://www.google.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482856/Google%20Search%20Prompt.user.js
// @updateURL https://update.greasyfork.org/scripts/482856/Google%20Search%20Prompt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听搜索框的点击事件
    document.querySelector('input[name="q"]').addEventListener('click', function() {
        // 弹窗提示输入搜索内容
        var searchInput = prompt('请输入你想要搜索的内容:');
        
        // 如果用户输入了内容，将内容填入搜索框
        if (searchInput !== null) {
            this.value = searchInput;
        }
    });
})();
