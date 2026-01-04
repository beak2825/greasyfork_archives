// ==UserScript==
// @name         淘系手机号***搜索替换
// @namespace    http://tampermonkey.net/
// @license      There are licenses for that.
// @version      1.3.2
// @description  仅在手机号管理页面生效，将手机号中的 * 替换为 %
// @author       17630583910@163.com
// @match        https://freechess-manage.leqeegroup.com/*
// @icon         https://leqee.com/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/547452/%E6%B7%98%E7%B3%BB%E6%89%8B%E6%9C%BA%E5%8F%B7%2A%2A%2A%E6%90%9C%E7%B4%A2%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/547452/%E6%B7%98%E7%B3%BB%E6%89%8B%E6%9C%BA%E5%8F%B7%2A%2A%2A%E6%90%9C%E7%B4%A2%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const LOG_PREFIX = '[手机号请求拦截]';

    // 只在目标页面运行
    if (window.location.hash !== '#/resource_manage/phone_manage') {
        console.log(LOG_PREFIX, '非目标页面，不启用脚本');
        return;
    }

    console.log(LOG_PREFIX, '脚本已注入，准备拦截 XMLHttpRequest');

    // 保存原始的 open 和 send 方法
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    // 当前请求的 URL
    let currentUrl = null;

    // 拦截 open，获取请求 URL
    XMLHttpRequest.prototype.open = function (method, url, ...args) {
        currentUrl = url;
        return originalOpen.apply(this, [method, url, ...args]);
    };

    // 拦截 send，修改请求体
    XMLHttpRequest.prototype.send = function (body) {
        // 检查是否是目标接口
        if (currentUrl && typeof currentUrl === 'string') {
            const isTargetUrl = currentUrl.includes('/ee/proxy/auto-manage/web/phone/manage/list');
            if (isTargetUrl && body && typeof body === 'string') {
                try {
                    const data = JSON.parse(body);

                    // 检查是否有 fuzzyPhoneNumber 字段
                    if (data.fuzzyPhoneNumber && typeof data.fuzzyPhoneNumber === 'string') {
                        const originalValue = data.fuzzyPhoneNumber;
                        // 将所有 * 替换为 %
                        const newValue = originalValue.replace(/\*+/g, '%');

                        if (newValue !== originalValue) {
                            data.fuzzyPhoneNumber = newValue.trim();
                            const newBody = JSON.stringify(data);

                            console.log(LOG_PREFIX, '✅ 请求拦截并修改:', {
                                url: currentUrl,
                                原值: originalValue,
                                新值: newValue
                            });

                            // 使用修改后的 body 发送请求
                            return originalSend.call(this, newBody);
                        }
                    }
                } catch (e) {
                    console.warn(LOG_PREFIX, '❌ 解析 JSON 失败，跳过:', e);
                }
            }
        }

        // 非目标请求，原样发送
        return originalSend.call(this, body);
    };

    console.log(LOG_PREFIX, 'XMLHttpRequest 拦截已启用');
})();