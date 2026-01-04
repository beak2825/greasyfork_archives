// ==UserScript==
// @name         X5 Cookie获取助手
// @namespace    https://www.tonyblog.cn/
// @version      1.0
// @description  自动监控当前网页的cookie变化，并将特定cookie的值存储到localStorage中，同时通过AJAX提交至指定接口
// @author       Tony Liu
// @match        *://*.taobao.com/*
// @grant        none
// @icon         https://www.tonyblog.cn/favicon.ico
// @license      None
// @downloadURL https://update.greasyfork.org/scripts/523028/X5%20Cookie%E8%8E%B7%E5%8F%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/523028/X5%20Cookie%E8%8E%B7%E5%8F%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监控的cookie名称
    const cookieName = 'x5sec';
    // localstorage的键值
    const localStorageName = 'TonyX5Sec';
    // 指定接口URL
    const apiUrl = 'https://example.com/api/submit-cookie';

    // 获取当前cookie的值
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // 将cookie值存储到localStorage
    function saveCookieToLocalStorage(value) {
        localStorage.setItem(localStorageName, value);
    }

    // 监控cookie变化
    function monitorCookieChanges() {
        let lastCookieValue = localStorage.getItem(localStorageName);
        if (lastCookieValue) {
            saveCookieToLocalStorage(lastCookieValue);
            copyToClipboard(lastCookieValue);
        }


        const intervalId = setInterval(() => {
            const currentCookieValue = getCookie(cookieName);
            if (currentCookieValue !== lastCookieValue) {
                copyToClipboard(currentCookieValue);
                clearInterval(intervalId)
            }
        }, 1000); // 每秒检查一次cookie变化
    }

    // 将cookie值复制到剪切板
    async function copyToClipboard(value) {
        var currentUrl = window.location.href;
        if (currentUrl.includes('mtop.taobao.wireless.home.load')) {
            return false;
        }
        try {
            await navigator.clipboard.writeText(value);
            layui.use(['layer'], function() {
                const layer = layui.layer;
                layer.msg('Cookie值已复制到剪切板！');
            });
        } catch (err) {
            layer.msg('复制到剪切板失败:'+ err, {icon: 6});
        }

    }

    // 初始化插件
    function init() {
        // 加载layui库
        const layuiScript = document.createElement('script');
        layuiScript.src = 'https://cdn.jsdelivr.net/npm/layui@2.6.8/dist/layui.js';
        document.head.appendChild(layuiScript);

        // 等待layui加载完成
        const checkLayuiLoaded = setInterval(() => {
            if (typeof layui !== 'undefined') {
                clearInterval(checkLayuiLoaded);
                layer.msg('初始化layui成功')
                monitorCookieChanges();
            }
        }, 100);
    }

    init();
})();