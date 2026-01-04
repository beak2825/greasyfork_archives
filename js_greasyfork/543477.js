// ==UserScript==
// @name         获取 ZStack 网盘直接下载链接 (终极版)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在 ZStack 网盘 (pan.zstack.run) 页面上，通过捕获并修改 API 请求来获取文件的长期有效直接下载链接，方便 wget/curl 等工具使用。
// @author       Your Name
// @match        https://pan.zstack.run/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @icon         https://pan.zstack.run/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543477/%E8%8E%B7%E5%8F%96%20ZStack%20%E7%BD%91%E7%9B%98%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%20%28%E7%BB%88%E6%9E%81%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543477/%E8%8E%B7%E5%8F%96%20ZStack%20%E7%BD%91%E7%9B%98%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%20%28%E7%BB%88%E6%9E%81%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置项 ---
    const EXPIRE_SEC = 115200; // 链接有效期, 115200 秒 = 32 小时
    // --- 配置项结束 ---

    console.log('ZStack 网盘直链获取脚本 (终极版) 已加载。');

    const TARGET_URL_PART = '/v2/file/get_download_url';

    /**
     * 核心处理函数：接收请求体和请求头，发起新请求，并弹出直链
     * @param {string} bodyString - JSON 格式的请求体字符串
     * @param {object} originalHeaders - 原始请求的请求头对象
     * @returns {boolean} - 是否成功处理
     */
    function processAndDisplayLink(bodyString, originalHeaders) {
        try {
            const body = JSON.parse(bodyString);
            if (!body.file_id || !body.share_id) {
                return false; // 不是目标请求
            }

            console.log(`[脚本拦截] 捕获到文件 "${body.file_name}" 的下载请求。`);

            // 从原始请求头中提取关键的 x-share-token
            // 请求头中的键名可能是小写或大写，做兼容处理
            const shareToken = originalHeaders['x-share-token'] || originalHeaders['X-Share-Token'];

            if (!shareToken) {
                console.error('[脚本错误] 无法从原始请求中捕获 x-share-token。无法继续。');
                alert('脚本错误：无法捕获到必要的认证令牌 (x-share-token)，无法生成直链。请检查控制台日志。');
                return false; // 缺少 token，处理失败
            }
            console.log('[脚本捕获] 成功捕获 x-share-token。');

            // 修改请求体，设置新的过期时间
            body.expire_sec = EXPIRE_SEC;
            const modifiedBody = JSON.stringify(body);
            console.log(`[脚本修改] 将链接有效期修改为 ${EXPIRE_SEC} 秒。`);

            // 使用 GM_xmlhttpRequest 发起带认证的请求
            console.log('[脚本操作] 正在获取直接下载链接...');
            GM_xmlhttpRequest({
                method: "POST",
                url: `https://bj20013.api.aliyunfile.com${TARGET_URL_PART}`,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json, text/plain, */*",
                    "Origin": "https://pan.zstack.run",
                    "Referer": "https://pan.zstack.run/",
                    "x-share-token": shareToken // 关键：将捕获到的 token 添加到新请求中
                },
                data: modifiedBody,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        const data = JSON.parse(response.responseText);
                        const directLink = data.url;
                        if (directLink) {
                            console.log('[脚本成功] 获取到直接下载链接:', directLink);
                            prompt(`获取到的直接下载链接 (已自动全选, 按 Ctrl+C 复制):`, directLink);
                        } else {
                            console.error('[脚本错误] API 返回数据中未找到 url 字段。', data);
                        }
                    } else {
                        console.error('[脚本错误] 获取直链的请求失败:', response.statusText, response.responseText);
                        alert(`获取直链失败！\n服务器响应: ${response.responseText}`);
                    }
                },
                onerror: function(error) {
                    console.error('[脚本错误] GM_xmlhttpRequest 请求时发生网络错误:', error);
                }
            });

            return true; // 表示已成功拦截并处理
        } catch (error) {
            console.error('[脚本错误] 在处理请求时发生错误:', error);
            return false; // 表示处理失败
        }
    }

    // 1. 拦截 XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this._url = url;
        this._headers = {}; // 初始化该请求的头对象
        return originalOpen.apply(this, [method, url, ...args]);
    };

    XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
        this._headers[header.toLowerCase()] = value; // 捕获所有设置的请求头
        return originalSetRequestHeader.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
        if (typeof this._url === 'string' && this._url.includes(TARGET_URL_PART)) {
            // 尝试处理请求，如果成功，则阻止原始请求
            if (processAndDisplayLink(body, this._headers)) {
                return; // 成功拦截并处理，不再执行原始 send
            }
        }
        // 如果不是目标请求或处理失败，则执行原始请求
        return originalSend.apply(this, arguments);
    };

    // 2. 拦截 fetch
    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async function(url, options) {
        if (typeof url === 'string' && url.includes(TARGET_URL_PART) && options && options.body) {
            if (processAndDisplayLink(options.body, options.headers || {})) {
                // 成功拦截并处理，返回一个假的 Response 对象以阻止原始下载
                const emptyBody = new Blob(['{"message":"Intercepted by userscript."}'], { type: 'application/json' });
                return new Response(emptyBody, { status: 200, statusText: "OK (Intercepted)" });
            }
        }
        // 如果不是目标请求或处理失败，则执行原始请求
        return originalFetch.apply(this, arguments);
    };

})();