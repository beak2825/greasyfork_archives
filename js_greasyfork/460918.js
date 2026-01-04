// ==UserScript==
// @name         修改Bing IP示例
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  修改Bing的X-Forwarded-For请求头，使得Bing认为你是从美国访问的
// @match        https://*/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460918/%E4%BF%AE%E6%94%B9Bing%20IP%E7%A4%BA%E4%BE%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/460918/%E4%BF%AE%E6%94%B9Bing%20IP%E7%A4%BA%E4%BE%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 拦截页面上所有的 fetch 请求，并替换为自定义的 GM_xmlhttpRequest 请求
    window.fetch = function(url, options) {
        // 创建一个新的 Promise 对象
        return new Promise(function(resolve, reject) {
            // 调用 GM_xmlhttpRequest 函数发送请求
            GM_xmlhttpRequest({
                method: options.method || 'GET', // 请求方法，默认为 GET
                url: url, // 请求 URL
                headers: { // 请求头部，可以自定义或者复制原始请求的头部
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9', // 修改语言为英文
                    'X-Forwarded-For': '208.115.243.40' // 修改 IP 地址为美国 Google 的 DNS 服务器地址（仅作示例，不一定有效）
                },
                data: options.body || null, // 请求数据，默认为空
                onload: function(response) { // 请求成功时的回调函数
                    console.log('GM_xmlhttpRequest success:', response); // 打印响应对象到控制台

                    // 创建一个 Response 对象，并将 GM_xmlhttpRequest 的响应数据转换为合适的格式（根据实际情况修改）
                    var res = new Response(response.responseText, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.responseHeaders,
                        url: response.finalUrl,
                        redirected: response.finalUrl !== url,
                        ok: response.status >= 200 && response.status < 300,
                        type: 'basic'
                    });

                    resolve(res); // 将 Response 对象作为 Promise 的结果返回
                },
                onerror: function(error) { // 请求失败时的回调函数
                    console.log('GM_xmlhttpRequest error:', error); // 打印错误对象到控制台

                    reject(error); // 将错误对象作为 Promise 的结果返回
                }
            });
        });
    };
})();