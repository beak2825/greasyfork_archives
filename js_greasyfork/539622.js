// ==UserScript==
// @license GPLv3
// @name        好游快爆
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  好游快爆APK直链提取，支持多域名
// @author       yxxinxi
// @match        https://m.3839.com/a/*.htm
// @match        https://www.3839.com/a/*.htm
// @match        https://sj.71acg.com/hykb/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @require      https://unpkg.com/ajax-hook@2.1.3/dist/ajaxhook.min.js
// @connect      api.3839app.com
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/539622/%E5%A5%BD%E6%B8%B8%E5%BF%AB%E7%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/539622/%E5%A5%BD%E6%B8%B8%E5%BF%AB%E7%88%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加设置菜单
    GM_registerMenuCommand("⚙️ 设置自动解析", function() {
        const current = GM_getValue("auto_parse", false);
        GM_setValue("auto_parse", !current);
        alert(current ? "❌ 已关闭自动解析" : "✅ 已开启自动解析");
    });

    // 处理UA切换和请求拦截
    if (window.location.href.startsWith('https://sj.71acg.com/hykb/')) {
        // 设置Android UA
        const androidUA = 'Mozilla/5.0 (Linux; Android 10; KB2000) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36 Androidkb';
        Object.defineProperty(navigator, 'userAgent', {
            value: androidUA,
            writable: false,
            configurable: false
        });

        // 拦截所有请求添加Androidkb标识
        ah.proxy({
            onRequest: (config, handler) => {
                config.headers = config.headers || {};
                if (!config.headers['User-Agent']) {
                    config.headers['User-Agent'] = androidUA;
                }
                handler.next(config);
            },
            onResponse: (response, handler) => {
                handler.next(response);
            }
        });

        // 拦截fetch请求
        const originalFetch = unsafeWindow.fetch;
        unsafeWindow.fetch = function(input, init = {}) {
            init.headers = init.headers || {};
            if (!init.headers['User-Agent']) {
                init.headers['User-Agent'] = androidUA;
            }
            return originalFetch.call(this, input, init);
        };

        console.log('已切换UA并设置请求拦截');
        return;
    }

    // ========== APK提取主逻辑 ==========
    const gameId = window.location.pathname.match(/\/(\d+)\.htm$/)?.[1];
    if (!gameId) {
        alert('⚠️ 网址格式不正确\n请确保访问的是类似 https://m.3839.com/a/123456.htm 的页面');
        return;
    }

    // 创建提示样式
    const showMessage = (text, color = '#2196F3', time = 3000) => {
        const msg = document.createElement('div');
        msg.style = `
            position:fixed;
            top:20px;
            right:20px;
            background:${color};
            color:white;
            padding:10px;
            border-radius:5px;
            z-index:9999;
            font-size:14px;
            transition: opacity 0.5s ease;
            opacity: 1;
        `;
        msg.innerHTML = text;
        document.body.appendChild(msg);
        
        if (time > 0) {
            setTimeout(() => {
                msg.style.opacity = '0';
                setTimeout(() => msg.remove(), 500);
            }, time);
        }
        return msg;
    };

    // 用户确认函数
    const confirmParse = () => {
        if (GM_getValue("auto_parse", false)) {
            startParse();
            return;
        }

        const confirmBox = document.createElement('div');
        confirmBox.style = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.15);
            z-index: 99999;
            width: 220px;
            font-family: Arial, sans-serif;
            transition: opacity 0.5s ease;
            opacity: 1;
        `;
        
        let countdown = 5;
        let countdownTimer;
        const updateCountdown = () => {
            countdownBtn.innerHTML = `取消(${countdown})`;
            if (countdown <= 0) {
                confirmBox.style.opacity = '0';
                setTimeout(() => confirmBox.remove(), 500);
                showMessage('⏲️ 已自动取消解析', '#FF9800');
            } else {
                countdown--;
                countdownTimer = setTimeout(updateCountdown, 1000);
            }
        };

        confirmBox.innerHTML = `
            <h3 style="margin:0 0 10px 0;font-size:14px;color:#333;">解析APK下载地址？</h3>
            <div style="display:flex;justify-content:space-between;gap:8px;">
                <button id="confirmYes" style="flex:1;padding:6px 0;background:#4CAF50;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;">解析</button>
                <button id="countdownBtn" style="flex:1;padding:6px 0;background:#f44336;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;">取消(5)</button>
            </div>
            <label style="display:flex;align-items:center;margin-top:10px;color:#666;font-size:12px;">
                <input type="checkbox" id="autoConfirm" style="margin-right:5px;"> 不再询问
            </label>
        `;
        document.body.appendChild(confirmBox);

        const countdownBtn = confirmBox.querySelector('#countdownBtn');
        countdownTimer = setTimeout(updateCountdown, 1000);

        const closeConfirm = () => {
            clearTimeout(countdownTimer);
            confirmBox.style.opacity = '0';
            setTimeout(() => confirmBox.remove(), 500);
        };

        confirmBox.querySelector('#confirmYes').addEventListener('click', () => {
            closeConfirm();
            if (confirmBox.querySelector('#autoConfirm').checked) {
                GM_setValue("auto_parse", true);
            }
            startParse();
        });

        countdownBtn.addEventListener('click', () => {
            closeConfirm();
            showMessage('用户取消了解析操作', '#f44336');
        });
    };

    // 实际解析函数
    const startParse = () => {
        const apiUrl = `https://api.3839app.com/cdn/android/gameintro-home-1546-id-${gameId}-packag--level-2.htm`;
        const loadingMsg = showMessage(' 正在查询APK下载地址...', '#4CAF50', 0);

        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            onload: function(response) {
                loadingMsg.remove();
                try {
                    const apkUrlMatch = response.responseText.match(/"apkurl"\s*:\s*"([^"]+)"/);
                    if (!apkUrlMatch) throw new Error('未找到有效的apkurl字段');

                    let apkUrl = apkUrlMatch[1].replace(/\\/g, '');
                    if (!apkUrl.startsWith('http')) {
                        apkUrl = apkUrl.startsWith('//') ? 'https:' + apkUrl : 'https://' + apkUrl;
                    }

                    showMessage(` 获取成功！3秒后自动下载...<br>
                        <a href="${apkUrl}" target="_blank" style="color:white;font-weight:bold;">立即下载</a>`, '#2196F3');
                    
                    setTimeout(() => window.location.href = apkUrl, 3000);
                } catch (e) {
                    showMessage(` 错误: ${e.message}`, '#f44336', 5000);
                }
            },
            onerror: function(error) {
                loadingMsg.remove();
                showMessage(`网络错误: ${error.statusText || '请求失败'}`, '#f44336', 5000);
            }
        });
    };

    // 延迟1秒执行确认
    setTimeout(confirmParse, 1000);
})();