// ==UserScript==
// @name         谷歌搜索结果统一字体
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  Modify Google search result lang attribute to navigator.language
// @author       entrpia
// @match        https://www.google.com/search*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465906/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E7%BB%9F%E4%B8%80%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/465906/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E7%BB%9F%E4%B8%80%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log(navigator.language);
    function modifySearchResults() {
        // 获取所有搜索结果的 div 元素
        var searchResults = document.querySelectorAll('div');

        // 遍历搜索结果并修改 lang 属性
        for (var i = 0; i < searchResults.length; i++) {
            var result = searchResults[i];
            var langAttribute = result.getAttribute('lang');

            // 检查 lang 属性是否为浏览器语言
            if (langAttribute != navigator.language && langAttribute !=null) {
                console.log(langAttribute);
                console.log(result);
                result.setAttribute('lang', navigator.language);
            }
        }
    }
    modifySearchResults();
    // 监听滚动事件
    window.addEventListener('scroll', () => {
        modifySearchResults();
    });
})();
