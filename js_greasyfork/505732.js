// ==UserScript==
// @name         自动获取ChatGPT Token并提供复制功能
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Auto Fetch AccessToken on ChatGPT and allow copying all API response data
// @author       ChatGPT指导员
// @match        https://chatgpt.com/*
// @grant        none
// @license      V：ChatGPT4V
// @icon         https://image.webchat-ai.com/OpenAI%20Developer%20Forum.ico
// @downloadURL https://update.greasyfork.org/scripts/505732/%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96ChatGPT%20Token%E5%B9%B6%E6%8F%90%E4%BE%9B%E5%A4%8D%E5%88%B6%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/505732/%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96ChatGPT%20Token%E5%B9%B6%E6%8F%90%E4%BE%9B%E5%A4%8D%E5%88%B6%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查当前网址是否是 chatgpt.com
    if (window.location.hostname === 'chatgpt.com') {
        fetch('https://chatgpt.com/api/auth/session')
            .then(res => res.json())
            .then((data) => {
                const { accessToken } = data;

                // 如果 accessToken 为 undefined，则不执行后续操作
                if (typeof accessToken === 'undefined' || accessToken === null) {
                    console.warn('AccessToken 未定义或未找到，未执行复制操作。');
                    return;
                }

                // 创建弹窗容器
                const modal = document.createElement('div');
                modal.style.position = 'fixed';
                modal.style.top = '50%';
                modal.style.left = '50%';
                modal.style.transform = 'translate(-50%, -50%)';
                modal.style.backgroundColor = '#FFFFFF'; // 柔和的浅蓝背景
                modal.style.padding = '15px'; // 减少内边距
                modal.style.borderRadius = '10px'; // 更紧凑的圆角
                modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                modal.style.textAlign = 'center';
                modal.style.zIndex = 1001; // 保证弹窗在最前
                modal.style.fontFamily = 'Arial, sans-serif';
                modal.style.color = '#333';
                modal.style.display = 'inline-block'; // 使宽度自适应内容
                modal.style.maxWidth = '90%'; // 限制最大宽度为屏幕的90%
                modal.style.boxSizing = 'border-box'; // 盒模型调整
                modal.style.border = '1px solid #ccc';  // 添加浅灰色边框

                // 创建提示文本
                const promptText = document.createElement('p');
                promptText.textContent = 'Token 已获取，点击按钮复制';
                promptText.style.marginBottom = '12px'; // 减少底部外边距
                promptText.style.fontSize = '16px'; // 调整字体大小
                modal.appendChild(promptText);

                // 创建一个包含按钮的容器，使用 flexbox 布局
                const buttonContainer = document.createElement('div');
                buttonContainer.style.display = 'flex';
                buttonContainer.style.justifyContent = 'center'; // 水平居中对齐
                buttonContainer.style.gap = '10px'; // 设置按钮之间的间距
                modal.appendChild(buttonContainer);

                // 创建复制Token按钮
                const copyTokenBtn = document.createElement('button');
                copyTokenBtn.textContent = '单Token';
                copyTokenBtn.style.backgroundColor = 'rgb(254, 94, 8)'; // 橙色背景
                copyTokenBtn.style.color = 'white';
                copyTokenBtn.style.border = 'none';
                copyTokenBtn.style.borderRadius = '5px';
                copyTokenBtn.style.padding = '10px 20px'; // 减少按钮内边距
                copyTokenBtn.style.cursor = 'pointer';
                copyTokenBtn.style.fontSize = '16px';
                copyTokenBtn.onclick = () => {
                    navigator.clipboard.writeText(accessToken).then(() => {
                        document.body.removeChild(modal);  // 复制成功后关闭弹窗

                        // 创建自动消失的提示框
                        const toast = document.createElement('div');
                        toast.textContent = 'Token 已复制到剪贴板';
                        toast.style.position = 'fixed';
                        toast.style.top = '50%';
                        toast.style.left = '50%';
                        toast.style.transform = 'translate(-50%, -50%) translateY(-50%)';
                        toast.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                        toast.style.color = 'white';
                        toast.style.padding = '10px 20px';
                        toast.style.borderRadius = '5px';
                        toast.style.zIndex = 1000;
                        toast.style.fontSize = '16px';
                        toast.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';

                        document.body.appendChild(toast);

                        // 3秒后自动移除提示框
                        setTimeout(() => {
                            document.body.removeChild(toast);
                        }, 1500);
                    }).catch(err => {
                        console.error('复制失败', err);
                    });
                };
                copyTokenBtn.onmouseover = () => {
                    copyTokenBtn.style.backgroundColor = 'rgb(230, 80, 5)'; // 鼠标悬停时更深的橙色
                };
                copyTokenBtn.onmouseout = () => {
                    copyTokenBtn.style.backgroundColor = 'rgb(254, 94, 8)';
                };
                buttonContainer.appendChild(copyTokenBtn); // 把按钮加入到按钮容器中

                // 创建复制源数据按钮
                const copyAllBtn = document.createElement('button');
                copyAllBtn.textContent = '全部数据';
                copyAllBtn.style.backgroundColor = '#f44336'; // 红色背景
                copyAllBtn.style.color = 'white';
                copyAllBtn.style.border = 'none';
                copyAllBtn.style.borderRadius = '5px';
                copyAllBtn.style.padding = '10px 20px'; // 减少按钮内边距
                copyAllBtn.style.cursor = 'pointer';
                copyAllBtn.style.fontSize = '16px';
                copyAllBtn.onclick = () => {
                    const apiResponse = JSON.stringify(data); // 不添加换行符
                    navigator.clipboard.writeText(apiResponse).then(() => {
                        document.body.removeChild(modal);  // 复制成功后关闭弹窗

                        // 创建自动消失的提示框
                        const toast = document.createElement('div');
                        toast.textContent = '全部源数据已复制到剪贴板';
                        toast.style.position = 'fixed';
                        toast.style.top = '50%';
                        toast.style.left = '50%';
                        toast.style.transform = 'translate(-50%, -50%) translateY(-50%)';
                        toast.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                        toast.style.color = 'white';
                        toast.style.padding = '10px 20px';
                        toast.style.borderRadius = '5px';
                        toast.style.zIndex = 1000;
                        toast.style.fontSize = '16px';
                        toast.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';

                        document.body.appendChild(toast);

                        // 3秒后自动移除提示框
                        setTimeout(() => {
                            document.body.removeChild(toast);
                        }, 1500);
                    }).catch(err => {
                        console.error('复制失败', err);
                    });
                };
                copyAllBtn.onmouseover = () => {
                    copyAllBtn.style.backgroundColor = '#e53935'; // 鼠标悬停时更深的红色
                };
                copyAllBtn.onmouseout = () => {
                    copyAllBtn.style.backgroundColor = '#f44336';
                };
                buttonContainer.appendChild(copyAllBtn); // 把按钮加入到按钮容器中

                // 添加提示文字
                const tipText = document.createElement('p');
                tipText.textContent = '点击页面任意空白处关闭弹窗';
                tipText.style.fontSize = '12px';
                tipText.style.color = 'rgba(0, 0, 0, 0.6)'; // 半透明灰色
                tipText.style.marginTop = '8px'; // 减少上方空白
                tipText.style.marginBottom = '0'; // 减少底部空白
                modal.appendChild(tipText);

                // 添加弹窗到页面
                document.body.appendChild(modal);

                // 创建点击页面空白处关闭弹窗的功能
                const handleOutsideClick = (event) => {
                    if (!modal.contains(event.target)) {
                        document.body.removeChild(modal);
                        document.removeEventListener('click', handleOutsideClick);
                    }
                };

                // 监听点击事件，检测点击是否在弹窗外部
                setTimeout(() => {
                    document.addEventListener('click', handleOutsideClick);
                }, 0);  // 延迟0毫秒确保事件绑定后不会立即触发
            })
            .catch(console.error);
    }
})();
