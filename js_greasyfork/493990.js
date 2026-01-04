// ==UserScript==
// @name         模擬匿名瀏覽模式並使用IP地址遮蔽服務
// @namespace    http://www.youtube.com/c/ScottDoha
// @version      1.6
// @description  匿名瀏覽模式並使用IP地址遮蔽服務
// @author       You
// @match        *://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493990/%E6%A8%A1%E6%93%AC%E5%8C%BF%E5%90%8D%E7%80%8F%E8%A6%BD%E6%A8%A1%E5%BC%8F%E4%B8%A6%E4%BD%BF%E7%94%A8IP%E5%9C%B0%E5%9D%80%E9%81%AE%E8%94%BD%E6%9C%8D%E5%8B%99.user.js
// @updateURL https://update.greasyfork.org/scripts/493990/%E6%A8%A1%E6%93%AC%E5%8C%BF%E5%90%8D%E7%80%8F%E8%A6%BD%E6%A8%A1%E5%BC%8F%E4%B8%A6%E4%BD%BF%E7%94%A8IP%E5%9C%B0%E5%9D%80%E9%81%AE%E8%94%BD%E6%9C%8D%E5%8B%99.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 監聽 XMLHttpRequest
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        blockRequest(url);
        open.call(this, method, 'http://127.0.0.1/');
    };

    // 監聽 fetch 請求
    var originalFetch = window.fetch;
    window.fetch = function(url, options) {
        blockRequest(url);
        return originalFetch.call(this, 'http://127.0.0.1/', options);
    };

    // 監聽 WebSocket 請求
    var originalWebSocket = window.WebSocket;
    window.WebSocket = function(url) {
        blockRequest(url);
        return new originalWebSocket('ws://127.0.0.1/');
    };

    // 監聽其他請求
    // 例如：使用 Image()、Audio()、Video() 等方式載入資源
    function blockOtherRequests() {
        ['Image', 'Audio', 'Video', 'FetchEvent', 'EventSource', 'XMLHttpRequestEventTarget'].forEach(function(type) {
            var originalConstructor = window[type];
            if (originalConstructor) {
                window[type] = function() {
                    blockRequest(arguments[0]);
                    return new originalConstructor(arguments[0]);
                };
            }
        });
    }

    // 阻止請求並輸出到控制台
    function blockRequest(url) {
        console.log('Blocked request:', url);
    }

    // 初始化
    blockOtherRequests();

})();