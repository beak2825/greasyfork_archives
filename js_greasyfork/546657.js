// ==UserScript==
// @name         Send To Telegram
// @namespace    http://tampermonkey.net/
// @run-at       document-start
// @version      1.0.4
// @description  将当前网页地址通过Telegram机器人发送给自己，支持快捷键(alt + t)、SweetAlert2美化提示和系统通知。
// @author       RrOrange
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @downloadURL https://update.greasyfork.org/scripts/546657/Send%20To%20Telegram.user.js
// @updateURL https://update.greasyfork.org/scripts/546657/Send%20To%20Telegram.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 配置区域 ---
    const BOT_TOKEN = ''; // 替换为你的Telegram机器人Token
    const CHAT_ID = '';     // 替换为你的Chat ID (数字ID，例如: '123456789')

    // --- 功能实现 ---

    // 注册油猴菜单命令
    GM_registerMenuCommand('发送当前网页到Telegram', sendUrlToTelegram);

    // 添加键盘快捷键监听
    document.addEventListener('keydown', function (e) {
        // 使用 e.code 进行判断，兼容性更强

        // 快捷键1: Ctrl + Shift + S
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyS') {
            e.preventDefault();
            sendUrlToTelegram();
        }
        // 快捷键2: Ctrl + Option/Alt + T
        if (e.ctrlKey && e.altKey && e.code === 'KeyT') {
            e.preventDefault();
            sendUrlToTelegram();
        }
    });

    /**
     * 发送URL到Telegram的核心函数
     */
    function sendUrlToTelegram() {
        if (!BOT_TOKEN || !CHAT_ID || BOT_TOKEN.includes('YOUR_BOT_TOKEN') || CHAT_ID.includes('YOUR_CHAT_ID')) {
            Swal.fire({ icon: 'warning', title: '配置不完整', text: '请先在脚本中修改 BOT_TOKEN 和 CHAT_ID！' });
            return;
        }
        const currentUrl = window.location.href;
        const pageTitle = document.title || '无标题页面'; // 如果页面没有标题，提供一个默认值
        const message = `【网页分享】\n标题：${pageTitle}\n链接：${currentUrl}`;
        const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        Swal.fire({ title: '正在发送...', text: '请稍候', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });

        GM_xmlhttpRequest({
            method: 'POST',
            url: apiUrl,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({ chat_id: parseInt(CHAT_ID), text: message, disable_web_page_preview: false }),
            onload: function (response) {
                try {
                    const result = JSON.parse(response.responseText);
                    if (result.ok) {
                        // 1. Swal 弹窗提示
                        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: '已成功发送到Telegram！', showConfirmButton: false, timer: 2000, timerProgressBar: true });
                        // 2. 系统通知
                        GM_notification({
                            title: '发送成功',
                            text: `网页 "${pageTitle}" 已发送。`,
                            timeout: 4000 // 4秒后自动消失
                        });
                    } else {
                        Swal.fire({ icon: 'error', title: '发送失败', text: `Telegram API 错误: ${result.description}` });
                        GM_notification({
                            title: '发送失败',
                            text: `错误: ${result.description}`
                        });
                        console.error('Telegram API 错误:', result);
                    }
                } catch (e) {
                    Swal.fire({ icon: 'error', title: '处理响应失败', text: '无法解析来自Telegram的响应，详情请查看控制台。' });
                    GM_notification({ title: '处理响应失败', text: '详情请查看浏览器控制台。' });
                    console.error('解析响应时出错:', e);
                }
            },
            onerror: function (error) {
                Swal.fire({ icon: 'error', title: '网络错误', text: '无法连接到Telegram API，请检查网络或代理设置。' });
                GM_notification({ title: '网络错误', text: '无法连接到Telegram API。' });
                console.error('GM_xmlhttpRequest 请求错误:', error);
            }
        });
    }
})();
