// ==UserScript==
// @name         ID网页辅助工具 (使用LocalStorage)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  识别ID网页，显示ID并提供跳转功能，使用LocalStorage缓存网址数据
// @author       
// @match        *://*/*
// @grant        none
// @license      LGPL
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/508319/ID%E7%BD%91%E9%A1%B5%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7%20%28%E4%BD%BF%E7%94%A8LocalStorage%29.user.js
// @updateURL https://update.greasyfork.org/scripts/508319/ID%E7%BD%91%E9%A1%B5%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7%20%28%E4%BD%BF%E7%94%A8LocalStorage%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // LocalStorage的键名
    const CACHED_URL_KEY = 'cachedIdPageUrl';

    // 获取当前网址
    var currentUrl = window.location.href;

    // 检查当前网址是否为ID网页
    function isIdPage(url) {
        var idPagePattern = /\/(\d+)\.(html|jsp|htm|php)$/i;
        return idPagePattern.test(url);
    }

    // 提取数字ID
    function extractId(url) {
        var idMatch = url.match(/\/(\d+)\.(html|jsp|htm|php)$/i);
        return idMatch ? parseInt(idMatch[1], 10) : null;
    }

    // 显示ID
    function showId(id) {
        var idElement = document.createElement('div');
        idElement.style.position = 'fixed';
        idElement.style.bottom = '10px';
        idElement.style.right = '10px';
        idElement.style.fontSize = '36px';
        idElement.style.color = 'orange';
        idElement.textContent = id;
        document.body.appendChild(idElement);
    }

    // 缓存网址到LocalStorage
    function cacheUrl(url) {
        localStorage.setItem(CACHED_URL_KEY, url);
    }

    // 从LocalStorage获取缓存的网址
    function getCachedUrl() {
        return localStorage.getItem(CACHED_URL_KEY);
    }

    // 清除LocalStorage中的缓存网址
    function clearCachedUrl() {
        localStorage.removeItem(CACHED_URL_KEY);
    }

    // 跳转功能
    function navigate(event) {
        if (event.ctrlKey) {
            var currentId = extractId(currentUrl);
            var cachedUrl = getCachedUrl();
            var newId, newUrl;

            if (currentId !== null) {
                // 当前是ID网页
                if (event.key === 'ArrowRight') {
                    newId = currentId + 1;
                } else if (event.key === 'ArrowLeft') {
                    newId = currentId - 1;
                }
            } else if (cachedUrl) {
                // 当前不是ID网页，使用缓存网址
                var cachedId = extractId(cachedUrl);
                if (cachedId !== null) {
                    if (event.key === 'ArrowRight') {
                        newId = cachedId + 1;
                    } else if (event.key === 'ArrowLeft') {
                        newId = cachedId - 1;
                    }
                } else {
                    return;
                }
            } else {
                return;
            }

            newUrl = currentUrl.replace(/(\d+)(?=\.(html|jsp|htm|php))/, newId);
            // 如果新URL与当前URL不同域，则可能需要使用其他方法跳转，这里简单处理为直接赋值
            // 在实际应用中，可能需要更复杂的逻辑来处理跨域跳转
            if (new Url(newUrl).origin !== window.location.origin) {
                window.open(newUrl, '_blank'); // 在新标签页中打开
            } else {
                window.location.href = newUrl; // 在当前标签页中跳转
            }
        }
    }

    // 初始化
    if (isIdPage(currentUrl)) {
        var currentId = extractId(currentUrl);
        cacheUrl(currentUrl);  // 存入缓存网址变量
        showId(currentId);  // 显示ID
    } else {
        // 如果当前不是ID网页，但之前访问过ID网页，则可以使用缓存的网址进行跳转
        // 这里可以根据需求决定是否要清除缓存（例如，在用户手动跳转到非ID网页时）
        // clearCachedUrl(); // 可选：清除缓存
    }

    // 监听键盘事件
    window.addEventListener('keydown', navigate);

})();