// ==UserScript==
// @name         Baidu Ass Attacher
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动为用户在百度中搜索的内容后面加上 "-李彦宏 -robin"
// @author       GitHub Copilot
// @match        https://www.baidu.com/*
// @grant        none
// @license WTFPL
// @downloadURL https://update.greasyfork.org/scripts/523089/Baidu%20Ass%20Attacher.user.js
// @updateURL https://update.greasyfork.org/scripts/523089/Baidu%20Ass%20Attacher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifySearchQuery() {
        // 获取搜索框和搜索按钮
        var searchInput = document.querySelector('input[name="wd"]');
        var searchButton = document.querySelector('input[type="submit"]');

        if (searchInput && searchButton) {
            // 修改搜索内容
            var originalQuery = searchInput.value;
            if (originalQuery && !originalQuery.includes("-李彦宏") && !originalQuery.includes("-robin")) {
                searchInput.value = originalQuery + " -李彦宏 -robin";
                // 自动提交搜索表单
                searchButton.click();
            }
        }
    }

    // 等待页面加载完成
    window.addEventListener('load', modifySearchQuery);

    // 监听搜索表单的提交事件
    var searchForm = document.querySelector('form[name="f"]');
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            modifySearchQuery();
            // 阻止默认提交行为
            event.preventDefault();
            // 手动提交表单
            searchForm.submit();
        });
    }
})();