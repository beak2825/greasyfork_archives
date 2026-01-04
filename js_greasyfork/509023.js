// ==UserScript==
// @name         拦截修改xhr和fetch响应
// @namespace    https://github.com/dadaewqq/fun
// @version      1.6
// @description  修改fetch，xhr等请求
// @author       dadaewqq
// @match        https://hio.oppo.com/app/course/detail*
// @match        https://hio.oppo.com/app/module/report*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509023/%E6%8B%A6%E6%88%AA%E4%BF%AE%E6%94%B9xhr%E5%92%8Cfetch%E5%93%8D%E5%BA%94.user.js
// @updateURL https://update.greasyfork.org/scripts/509023/%E6%8B%A6%E6%88%AA%E4%BF%AE%E6%94%B9xhr%E5%92%8Cfetch%E5%93%8D%E5%BA%94.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("User script started");

    // 维护一个策略映射，根据不同的网址使用不同的修改策略
    const urlStrategies = {
        "/app/module/getTstReportDetail": modifyResponseForDaTi,
        //"/yyy": modifyResponseForYYY,
        // 可以继续添加其他网站和它们的修改策略
    };

    function modifyResponseForDaTi(responseText) {
        let parsedResponse = JSON.parse(responseText);
        parsedResponse.hashMap.mod_showInd = true;
        parsedResponse.hashMap.mod_passedInd = true;
        return JSON.stringify(parsedResponse);
    }

    function modifyResponseForYYY(responseText) {
        let parsedResponse = JSON.parse(responseText);
        //parsedResponse.exampleField = "New Value";
        return JSON.stringify(parsedResponse);
    }

    // 劫持 XHR 请求
    function hijackXHR() {
        const originalSend = XMLHttpRequest.prototype.send;
        const originalOpen = XMLHttpRequest.prototype.open;

        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            this._url = url;
            originalOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function(data) {
            this.addEventListener('readystatechange', function() {
                if (this.readyState === 4) {
                    for (const [url, strategy] of Object.entries(urlStrategies)) {
                        if (this._url.includes(url)) {
                            console.log(`Intercepted xhr request to URL: ${this._url}`);

                            try {
                                const modifiedData = strategy(this.responseText);
                                console.log("Modified  xhr response:", url);
                                Object.defineProperty(this, "responseText", { value: modifiedData });
                            } catch (err) {
                                console.error('Error modifying xhr response', err);
                            }

                            break;
                        }
                    }
                }
            });

            originalSend.apply(this, arguments);
        };
    }

    // 劫持 fetch 请求
    function hijackFetch() {
        const originalFetch = window.fetch;

        window.fetch = async function(resource, init) {
            const response = await originalFetch(resource, init);
            const clonedResponse = response.clone();

            const url = (typeof resource === 'string') ? resource : resource.url;
            for (const [u, strategy] of Object.entries(urlStrategies)) {
                if (url.includes(u)) {
                    console.log(`Intercepted fetch request to URL: ${url}`);

                    try {
                        const text = await clonedResponse.text();
                        const modifiedText = strategy(text);
                        console.log("Modified  fetch response:", url);
                        const modifiedBlob = new Blob([modifiedText], { type: 'application/json' });
                        const modifiedResponse = new Response(modifiedBlob, {
                            status: clonedResponse.status,
                            statusText: clonedResponse.statusText,
                            headers: clonedResponse.headers
                        });
                        return modifiedResponse;
                    } catch (err) {
                        console.error('Error modifying fetch response', err);
                    }

                    break;
                }
            }

            return response;
        };
    }

    // 劫持 jQuery AJAX 请求
    function hijackjQuery() {
        // 确保 jQuery 已经加载
        if (typeof jQuery === 'undefined') {
            console.log("Waiting for jQuery to load...");
            setTimeout(hijackjQuery, 100);
            return;
        }

        console.log("jQuery loaded, hijacking $.ajax");

        // 保存原始的 jQuery ajax 方法
        const originalAjax = jQuery.ajax;
        // 创建代理 jQuery ajax 方法
        jQuery.ajax = function (options) {
            const originalSuccess = options.success;

            options.success = function (data, textStatus, jqXHR) {
                console.log("This URL is  jQuery AJAX:", options.url);

                for (const [url, strategy] of Object.entries(urlStrategies)) {
                    if (options.url && options.url.includes(url)) {
                        console.log("URL matched for interception with jQuery AJAX:",options.url);

                        try {
                            // 在这里修改返回的 JSON 数据
                            const modifiedData = strategy(JSON.stringify(data));
                            console.log("Modified  jQuery AJAX response:", options.url);

                            // 调用用户定义的成功处理器，传递修改后的数据
                            if (originalSuccess) {
                                originalSuccess.call(this, JSON.parse(modifiedData), textStatus, jqXHR);
                            }

                            return;
                        } catch (err) {
                            console.error('Error modifying jQuery AJAX response', err);
                        }
                    }
                }

                // 调用用户定义的成功处理器
                if (originalSuccess) {
                    originalSuccess.call(this, data, textStatus, jqXHR);
                }
            };

            // 调用原始的 jQuery ajax 方法
            return originalAjax.call(this, options);
        };

        console.log("$.ajax is hijacked");
    }

    // 保证在 XMLHttpRequest、fetch 和 jQuery ajax 劫持操作执行
    hijackXHR();
    hijackFetch();

   // hijackXHR()更底层，应该是包含了所有ajax请求
    //hijackjQuery();

})();