// ==UserScript==
// @name         Add Web Archive Button to Search Engines
// @namespace    http://github.com/dreamking60
// @version      1.0
// @description  Add a button to access web archive for each search result on search engine pages
// @match        https://www.google.com/search*
// @match        https://www.bing.com/search*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479229/Add%20Web%20Archive%20Button%20to%20Search%20Engines.user.js
// @updateURL https://update.greasyfork.org/scripts/479229/Add%20Web%20Archive%20Button%20to%20Search%20Engines.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var searchEngine = determineSearchEngine();

    // 遍历每个搜索结果
    var searchResults = document.querySelectorAll(getSelectorForSearchEngine(searchEngine));
    searchResults.forEach(function(result) {
        // 创建一个新按钮
        var archiveButton = document.createElement('a');
        archiveButton.className = 'web-archive-button';
        archiveButton.textContent = 'Web Archive';
        archiveButton.href = 'http://web.archive.org/save/' + result.querySelector('a').href;
        archiveButton.target = '_blank';

        // 将按钮添加到搜索结果后面
        result.appendChild(archiveButton);
    });

    // 确定当前搜索引擎
    function determineSearchEngine() {
        if (window.location.hostname.includes('google.com')) {
            return 'google';
        } else if (window.location.hostname.includes('bing.com')) {
            return 'bing';
        } else {
            return 'unknown';
        }
    }

    // 获取不同搜索引擎的选择器
    function getSelectorForSearchEngine(engine) {
        switch (engine) {
            case 'google':
                return '.tF2Cxc'; // Google的选择器
            case 'bing':
                return '.b_algo'; // Bing的选择器
            default:
                return ''; // 默认选择器
        }
    }
})();
