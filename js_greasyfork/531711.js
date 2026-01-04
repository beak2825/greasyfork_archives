// ==UserScript==
// @name         BT4G访问
// @author       wangzijian0@vip.qq.com
// @description  绕过国内网络限制访问BT4G
// @version      1.0.2.20250404
// @icon         https://github.githubassets.com/assets/mona-loading-default-c3c7aad1282f.gif
// @match        *://bt4gprx.com/*
// @match        *://*.bt4g.com/*
// @match        *://bt4g.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @namespace    https://greasyfork.org/users/1453515
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/531711/BT4G%E8%AE%BF%E9%97%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/531711/BT4G%E8%AE%BF%E9%97%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 兼容不同用户脚本管理器的API差异
    const GM_xhr = typeof GM !== 'undefined' && GM.xmlHttpRequest ? GM.xmlHttpRequest : GM_xmlhttpRequest;

    if (!GM_xhr) {
        console.error('BT4G访问: 当前用户脚本管理器不支持GM.xmlHttpRequest或GM_xmlhttpRequest');
        return;
    }

    // 检查当前域名是否属于 BT4G 相关站点
    const isBT4G = /^(.*\.)?bt4g(prx)?\.com$/.test(window.location.hostname);
    if (isBT4G) {
        // 防止iOS Stay中的无限刷新
        if (sessionStorage.getItem('bt4g_script_processed') === 'true') {
            return;
        }
        sessionStorage.setItem('bt4g_script_processed', 'true');

        const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(window.location.href);

        try {
            GM_xhr({
                method: 'GET',
                url: proxyUrl,
                timeout: 15000,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        // 使用更安全的方式替换页面内容
                        const newDoc = document.open('text/html', 'replace');
                        newDoc.write(response.responseText);
                        newDoc.close();
                        
                        // 清除标记以便下次访问可以重新加载
                        setTimeout(() => {
                            sessionStorage.removeItem('bt4g_script_processed');
                        }, 1000);
                    } else {
                        showError(`代理请求失败，状态码: ${response.status}`);
                        sessionStorage.removeItem('bt4g_script_processed');
                    }
                },
                onerror: function(error) {
                    console.error('BT4G访问代理失败:', error);
                    showError('代理访问失败，请检查网络或更换代理服务！');
                    sessionStorage.removeItem('bt4g_script_processed');
                },
                ontimeout: function() {
                    showError('代理请求超时，请重试或检查网络连接');
                    sessionStorage.removeItem('bt4g_script_processed');
                }
            });
        } catch (e) {
            console.error('BT4G访问: 请求发送失败', e);
            showError('脚本执行出错，请检查控制台日志');
            sessionStorage.removeItem('bt4g_script_processed');
        }
    }

    function showError(message) {
        // 创建更友好的错误提示界面
        const errorDiv = document.createElement('div');
        errorDiv.style.position = 'fixed';
        errorDiv.style.top = '0';
        errorDiv.style.left = '0';
        errorDiv.style.right = '0';
        errorDiv.style.backgroundColor = '#ffebee';
        errorDiv.style.color = '#c62828';
        errorDiv.style.padding = '15px';
        errorDiv.style.zIndex = '9999';
        errorDiv.style.textAlign = 'center';
        errorDiv.style.fontFamily = 'Arial, sans-serif';
        errorDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

        errorDiv.innerHTML = `
            <strong>BT4G访问错误:</strong> ${message}
            <button style="margin-left: 10px; background: #c62828; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                重试
            </button>
        `;

        const retryBtn = errorDiv.querySelector('button');
        retryBtn.onclick = function() {
            errorDiv.remove();
            sessionStorage.removeItem('bt4g_script_processed');
            window.location.reload();
        };

        document.body.appendChild(errorDiv);
    }
})();
