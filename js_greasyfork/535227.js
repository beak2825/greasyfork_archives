// ==UserScript==
// @name         Cursor SheerID CN国家添加
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  将SheerID验证服务的响应中添加CN（中国）国家代码
// @author       You
// @match        https://my.sheerid.com/*
// @match        https://*.sheerid.com/*
// @match        https://www.cursor.com/cn/student/*
// @match        https://www.cursor.com/cn/student-verified/*
// @match        https://cursor.com/cn/student/*
// @match        https://services.sheerid.com/verify/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535227/Cursor%20SheerID%20CN%E5%9B%BD%E5%AE%B6%E6%B7%BB%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/535227/Cursor%20SheerID%20CN%E5%9B%BD%E5%AE%B6%E6%B7%BB%E5%8A%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个拦截和修改响应的函数
    const originalFetch = window.fetch;
    window.fetch = async function(url, options) {
        const response = await originalFetch(url, options);

        // 只拦截特定的URL
        if (url.includes('/rest/v2/program/681044b7729fba7beccd3565/theme') ||
            url.includes('theme?locale=') ||
            url.includes('/rest/v2/program/') && url.includes('/theme')) {
            try {
                // 克隆响应以便修改
                const clonedResponse = response.clone();
                const responseBody = await clonedResponse.json();

                // 检查并修改countries数组
                if (responseBody && responseBody.config && Array.isArray(responseBody.config.countries)) {
                    // 检查CN是否已存在
                    if (!responseBody.config.countries.includes('CN')) {
                        console.log('添加CN到国家列表中...');
                        // 在合适的位置添加CN，按字母顺序
                        // CH和CI之间是CN的合适位置
                        const chIndex = responseBody.config.countries.indexOf('CH');
                        if (chIndex !== -1) {
                            responseBody.config.countries.splice(chIndex + 1, 0, 'CN');
                        } else {
                            // 如果没找到CH，就直接添加到数组中
                            responseBody.config.countries.push('CN');
                        }

                        // 添加CN对应的标签
                        if (responseBody.config.orgSearchCountryTags) {
                            responseBody.config.orgSearchCountryTags['CN'] = ["HEI", "qualifying_hs", "qualifying_ps"];
                        }

                        console.log('成功添加CN到国家列表');
                    }

                    // 创建一个新的响应对象
                    return new Response(JSON.stringify(responseBody), {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                }
            } catch (e) {
                console.error('处理fetch响应时出错:', e);
                return response;
            }
        }
        return response;
    };

    // 如果网站使用XMLHttpRequest，同样需要拦截
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._url = url;
        return originalXHROpen.apply(this, [method, url, ...rest]);
    };

    XMLHttpRequest.prototype.send = function(body) {
        const xhr = this;

        if (xhr._url && (xhr._url.includes('/rest/v2/program/681044b7729fba7beccd3565/theme') ||
                        xhr._url.includes('theme?locale=') ||
                        xhr._url.includes('/rest/v2/program/') && xhr._url.includes('/theme'))) {
            const originalOnReadyStateChange = xhr.onreadystatechange;
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    try {
                        const responseBody = JSON.parse(xhr.responseText);

                        if (responseBody && responseBody.config && Array.isArray(responseBody.config.countries)) {
                            // 检查CN是否已存在
                            if (!responseBody.config.countries.includes('CN')) {
                                console.log('添加CN到国家列表中...(XHR)');
                                // 在合适的位置添加CN，按字母顺序
                                const chIndex = responseBody.config.countries.indexOf('CH');
                                if (chIndex !== -1) {
                                    responseBody.config.countries.splice(chIndex + 1, 0, 'CN');
                                } else {
                                    responseBody.config.countries.push('CN');
                                }

                                // 添加CN对应的标签
                                if (responseBody.config.orgSearchCountryTags) {
                                    responseBody.config.orgSearchCountryTags['CN'] = ["HEI", "qualifying_hs", "qualifying_ps"];
                                }

                                console.log('成功添加CN到国家列表(XHR)');
                            }

                            // 使用定义属性的方式替换responseText
                            Object.defineProperty(xhr, 'responseText', {
                                get: function() {
                                    return JSON.stringify(responseBody);
                                }
                            });
                        }
                    } catch (e) {
                        console.error('处理XHR响应时出错:', e);
                    }
                }

                if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.apply(xhr);
                }
            };
        }

        return originalXHRSend.apply(this, [body]);
    };

    console.log('Cursor SheerID CN国家添加脚本已加载');
})();