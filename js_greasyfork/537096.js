// ==UserScript==
// @name         检测B站直播弹幕拦截(AI修复版)
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  修复之前版本无法发送弹幕和@的问题；优化了弹窗
// @author       熊孩子
// @match        https://live.bilibili.com/*
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537096/%E6%A3%80%E6%B5%8BB%E7%AB%99%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E6%8B%A6%E6%88%AA%28AI%E4%BF%AE%E5%A4%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537096/%E6%A3%80%E6%B5%8BB%E7%AB%99%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E6%8B%A6%E6%88%AA%28AI%E4%BF%AE%E5%A4%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[弹幕检测] 脚本已加载');

    // 拦截fetch请求
    const originFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async function(input, init) {
        // 备份原始请求
        const originalRequest = () => originFetch.call(this, input, init);

        try {
            // 检查是否为弹幕发送请求
            const isMessageSend = typeof input === 'string' && (
                input.includes('/msg/send') ||
                input.includes('/api/sendmsg')
            );

            if (!isMessageSend) {
                return originalRequest();
            }

            console.log('[弹幕检测] 捕获到发送请求:', input);

            // 提取消息内容
            let msgContent = '';
            if (init && init.body) {
                try {
                    // 尝试不同格式解析
                    if (typeof init.body === 'string') {
                        const bodyParams = new URLSearchParams(init.body);
                        msgContent = bodyParams.get('msg') || bodyParams.get('text') || '未能获取消息内容';
                    } else if (init.body instanceof FormData) {
                        // 使用迭代器同步解析FormData
                        const bodyParams = new URLSearchParams();
                        for (const [key, value] of init.body.entries()) {
                            bodyParams.append(key, value);
                        }
                        msgContent = bodyParams.get('msg') || bodyParams.get('text') || '未能获取消息内容';
                    }
                } catch (e) {
                    console.warn('[弹幕检测] 解析请求体失败:', e);
                }
            }

            // 发送原始请求并检查结果
            const response = await originalRequest();
            const clonedResponse = response.clone();

            // 异步处理响应
            clonedResponse.json().then(result => {
                console.log('[弹幕检测] 响应数据:', result);

                // 统一处理code字段（兼容字符串/数字类型）
                const code = typeof result.code === 'string' ? parseInt(result.code) : result.code;

                // 更全面的响应检查
                if (code !== 0) {
                    // 一般错误情况
                    showPrompt("发送失败", `错误码: ${code}, 消息: ${result.message || result.msg || '未知错误'}`, msgContent);
                } else if (result.msg === "f" || result.data?.msg_type === -1) {
                    showPrompt("全站屏蔽", result.message || result.msg || '弹幕被全站屏蔽', msgContent);
                } else if (result.msg === "k" || result.data?.msg_type === -2) {
                    showPrompt("主播屏蔽", result.message || result.msg || '弹幕被主播屏蔽', msgContent);
                }
            }).catch(error => {
                console.error('[弹幕检测] 解析响应失败:', error);
            });

            return response;
        } catch (error) {
            console.error('[弹幕检测] 请求处理异常:', error);
            return originalRequest();
        }
    };

    // 拦截XMLHttpRequest
    const originXHROpen = XMLHttpRequest.prototype.open;
    const originXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function() {
        this._dmUrl = arguments[1];
        return originXHROpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
        // 检查是否是弹幕发送请求
        const isMessageSend = typeof this._dmUrl === 'string' && (
            this._dmUrl.includes('/msg/send') ||
            this._dmUrl.includes('/api/sendmsg')
        );

        if (isMessageSend) {
            console.log('[弹幕检测] 捕获到XHR发送请求:', this._dmUrl);

            // 尝试提取消息内容
            let msgContent = '';
            if (body) {
                try {
                    if (typeof body === 'string') {
                        const bodyParams = new URLSearchParams(body);
                        msgContent = bodyParams.get('msg') || bodyParams.get('text') || '未能获取消息内容';
                    } else if (body instanceof FormData) {
                        const bodyParams = new URLSearchParams();
                        for (const [key, value] of body.entries()) {
                            bodyParams.append(key, value);
                        }
                        msgContent = bodyParams.get('msg') || bodyParams.get('text') || '未能获取消息内容';
                    }
                } catch (e) {
                    console.warn('[弹幕检测] 解析XHR请求体失败:', e);
                }
            }

            // 保存消息内容
            this._dmContent = msgContent;

            // 监听响应
            const originalOnload = this.onload;
            this.onload = function() {
                try {
                    // 尝试解析响应
                    const result = JSON.parse(this.responseText);
                    console.log('[弹幕检测] XHR响应数据:', result);

                    // 统一处理code字段（兼容字符串/数字类型）
                    const code = typeof result.code === 'string' ? parseInt(result.code) : result.code;

                    // 检查响应状态
                    if (code !== 0) {
                        showPrompt("发送失败", `错误码: ${code}, 消息: ${result.message || result.msg || '未知错误'}`, this._dmContent);
                    } else if (result.msg === "f" || result.data?.msg_type === -1) {
                        showPrompt("全站屏蔽", result.message || result.msg || '弹幕被全站屏蔽', this._dmContent);
                    } else if (result.msg === "k" || result.data?.msg_type === -2) {
                        showPrompt("主播屏蔽", result.message || result.msg || '弹幕被主播屏蔽', this._dmContent);
                    }
                } catch (e) {
                    console.error('[弹幕检测] 解析XHR响应失败:', e);
                }

                // 调用原始的onload处理程序
                if (originalOnload) {
                    originalOnload.call(this);
                }
            };
        }

        return originXHRSend.apply(this, arguments);
    };

    // 改进的提示框显示函数
    function showPrompt(type, reason, msg) {
        console.log(`[弹幕检测] ${type}: ${reason}, 内容: ${msg}`);

        const showModal = () => {
            const modal = document.createElement('div');
            modal.style = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            background: white;
            border: 2px solid red;
            z-index: 999999;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            font-family: Arial, sans-serif;
            border-radius: 8px;
            max-width: 90%;
            width: 400px;
        `;

            // 创建一个唯一ID，避免ID冲突
            const textareaId = 'prompt-textarea-' + Date.now();
            const notificationId = 'copy-notification-' + Date.now();

            modal.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <h3 style="margin:0;color:#f25d8e;">弹幕被拦截 (${type})</h3>
                <span style="cursor:pointer;font-size:20px;" id="close-btn">×</span>
            </div>
            <div style="margin-bottom:10px;font-size:14px;color:#666;">${reason}</div>
            <p style="margin:5px 0;font-weight:bold;">弹幕内容:</p>
            <textarea
                id="${textareaId}"
                style="width:100%;min-width:300px;height:80px;margin:5px 0;padding:8px;border:1px solid #ddd;border-radius:4px;"
                readonly
            >${msg}</textarea>
            <div style="display:flex;justify-content:space-between;margin-top:10px;">
                <button
                    id="copy-btn"
                    style="background:#4CAF50;color:white;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;"
                >复制</button>
                <button
                    id="confirm-btn"
                    style="background:#f25d8e;color:white;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;"
                >确认</button>
            </div>
            <div id="${notificationId}" style="display:none;margin-top:10px;padding:8px;background:#e8f5e9;color:#2e7d32;text-align:center;border-radius:4px;">
                ✅ 已复制到剪贴板
            </div>
        `;

            // 添加到页面
            document.body.appendChild(modal);

            // 获取DOM元素引用
            const closeBtn = modal.querySelector('#close-btn');
            const copyBtn = modal.querySelector('#copy-btn');
            const confirmBtn = modal.querySelector('#confirm-btn');
            const textarea = modal.querySelector(`#${textareaId}`);
            const notification = modal.querySelector(`#${notificationId}`);

            // 绑定关闭事件
            closeBtn.addEventListener('click', () => modal.remove());
            confirmBtn.addEventListener('click', () => modal.remove());

            // 设置自动关闭定时器 (3秒后自动关闭)
            const autoCloseTimer = setTimeout(() => {
                if (document.body.contains(modal)) {
                    modal.remove();
                }
            }, 3000);

            // 绑定复制事件 - 直接使用事件监听器而不是内联onclick
            copyBtn.addEventListener('click', async function() {
                // 保存原始的 readonly 状态
                const isReadOnly = textarea.readOnly;

                try {
                    // 移除 readonly 属性以确保某些浏览器可以正常复制
                    textarea.readOnly = false;

                    // 选中文本
                    textarea.select();
                    textarea.setSelectionRange(0, 99999); // 兼容移动端

                    // 尝试使用新API复制
                    if (navigator.clipboard && window.isSecureContext) {
                        await navigator.clipboard.writeText(textarea.value);
                        showCopyNotification(notification);
                    }
                    // 回退到execCommand
                    else {
                        const successful = document.execCommand('copy');
                        if (successful) {
                            showCopyNotification(notification);
                        } else {
                            showCopyNotification(notification, false);
                        }
                    }
                } catch (err) {
                    console.error('复制失败:', err);
                    showCopyNotification(notification, false);
                } finally {
                    // 恢复原始的 readonly 状态
                    textarea.readOnly = isReadOnly;
                    // 取消焦点，避免干扰直播
                    textarea.blur();
                }
            });

            // 显示复制结果的非阻塞通知
            function showCopyNotification(element, success = true) {
                // 清除之前的自动关闭定时器
                clearTimeout(autoCloseTimer);

                // 设置通知内容
                element.textContent = success ? '✅ 已复制到剪贴板' : '❌ 复制失败，请手动复制';
                element.style.background = success ? '#e8f5e9' : '#ffebee';
                element.style.color = success ? '#2e7d32' : '#c62828';
                element.style.display = 'block';

                // 2秒后自动隐藏通知
                setTimeout(() => {
                    element.style.display = 'none';
                }, 2000);

                // 设置弹窗自动关闭 (复制后2秒)
                setTimeout(() => {
                    if (document.body.contains(modal)) {
                        modal.remove();
                    }
                }, 2000);
            }
        };

        // 确保DOM已加载
        if (document.body) {
            showModal();
        } else {
            document.addEventListener('DOMContentLoaded', showModal);
        }
    }

    // 页面加载完成后的通知
    document.addEventListener('DOMContentLoaded', () => {
        console.log('[弹幕检测] 页面加载完成，检测功能已启用');
    });
})();