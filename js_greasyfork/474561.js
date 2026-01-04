// ==UserScript==
// @name         手机百度搜索结果去除重定向
// @version      2.0
// @description  去除手机百度搜索结果中的重定向链接
// @author       ChatGPT
// @match        https://m.baidu.com/*
// @match        https://www.baidu.com/*
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/474561/%E6%89%8B%E6%9C%BA%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%8E%BB%E9%99%A4%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/474561/%E6%89%8B%E6%9C%BA%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%8E%BB%E9%99%A4%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = window.location.href;

    if (url.indexOf("wd=") !== -1 || url.indexOf("word=") !== -1) {
        function executeScriptWithDelay() {
            var elements = document.querySelectorAll('.c-result');

            elements.forEach(function(element) {
                var dataLog = element.getAttribute('data-log');
                var logObj = JSON.parse(dataLog);
                var muValue = logObj.mu;
                var urlValue = logObj.url;

                // 找到当前元素内的后代元素 article
                var articles = element.getElementsByTagName('article');

                for (var i = 0; i < articles.length; i++) {
                    var article = articles[i];
                    if (!article.hasAttribute('rl-link-data-url')) {
                        // 将 muValue 设置为当前 article 元素的 rl-link-href 属性值
                        article.setAttribute('rl-link-href', muValue);
                    }
                }
            });
        }

        executeScriptWithDelay();

        var timeoutId;

        document.addEventListener('click', function(e) {
            e.stopPropagation();
            clearTimeout(timeoutId); // 清除之前的定时器
            timeoutId = setTimeout(executeScriptWithDelay, 4000); // 创建新的定时器
        });
    }
})();