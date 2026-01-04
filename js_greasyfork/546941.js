// ==UserScript==
// @name         FitGirl Auto Fuckingfast Downloader Helper
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在FitGirl页面上匹配所有fuckingfast.co的链接，并自动在新标签页中点击下载按钮。
// @author       zhangdapaofuckyou
// @match        https://fitgirl-repacks.site/*
// @match        https://fuckingfast.co/*
// @grant        GM_openInTab
// @grant        window.close
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546941/FitGirl%20Auto%20Fuckingfast%20Downloader%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/546941/FitGirl%20Auto%20Fuckingfast%20Downloader%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 主页面逻辑 (fitgirl-repacks.site) ---
    if (window.location.hostname.includes('fitgirl-repacks.site')) {
        console.log('[FitGirl助手] 脚本已在主页面启动。');

        const checkInterval = setInterval(() => {
            // 持续检查直到找到链接和可以插入内容的目标位置
            const links = document.querySelectorAll('a[href*="fuckingfast.co/"]');
            const entryContent = document.querySelector('.entry-content');

            // 确保页面上至少有一个符合条件的链接，并且找到了可以插入按钮的区域
            if (links.length > 0 && entryContent) {
                console.log(`[FitGirl助手] 成功找到 ${links.length} 个链接和内容区域，准备创建界面。`);
                // 找到后就停止检查，防止重复创建
                clearInterval(checkInterval);

                // 避免重复添加，先检查是否已存在
                if (document.getElementById('auto-downloader-container')) {
                    return;
                }

                // 创建主容器
                const linkContainer = document.createElement('div');
                linkContainer.id = 'auto-downloader-container'; // 添加ID以便检查
                linkContainer.style.marginTop = '20px';
                linkContainer.style.marginBottom = '20px';
                linkContainer.style.border = '2px solid #4CAF50';
                linkContainer.style.borderRadius = '5px';
                linkContainer.style.padding = '15px';
                linkContainer.style.backgroundColor = '#f0fff0';

                // 创建标题
                const title = document.createElement('h3');
                title.innerText = '自动下载助手';
                title.style.marginTop = '0';
                linkContainer.appendChild(title);

                // --- 新增: 创建一个按钮容器，用于并排放置按钮 ---
                const buttonContainer = document.createElement('div');
                buttonContainer.style.display = 'flex';
                buttonContainer.style.gap = '10px';
                buttonContainer.style.marginBottom = '15px'; // 添加一些间距

                // 创建全选/取消全选按钮
                const selectAllButton = document.createElement('button');
                selectAllButton.innerText = '全选';
                selectAllButton.style.padding = '8px 16px';
                selectAllButton.style.cursor = 'pointer';
                selectAllButton.style.border = '1px solid #008CBA';
                selectAllButton.style.borderRadius = '5px';
                selectAllButton.style.backgroundColor = '#008CBA';
                selectAllButton.style.color = 'white';

                selectAllButton.onmouseover = () => selectAllButton.style.backgroundColor = '#007B9E';
                selectAllButton.onmouseout = () => selectAllButton.style.backgroundColor = '#008CBA';

                let allSelected = false; // 跟踪全选状态
                selectAllButton.onclick = () => {
                    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                    allSelected = !allSelected;
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = allSelected;
                    });
                    selectAllButton.innerText = allSelected ? '取消全选' : '全选';
                };
                buttonContainer.appendChild(selectAllButton);
                // --- 按钮容器新增结束 ---

                // 创建下载按钮，用于下载所有选中的项
                const downloadAllButton = document.createElement('button');
                downloadAllButton.innerText = '下载已选内容';
                downloadAllButton.style.padding = '10px 20px';
                downloadAllButton.style.cursor = 'pointer';
                downloadAllButton.style.border = '1px solid #4CAF50';
                downloadAllButton.style.borderRadius = '5px';
                downloadAllButton.style.backgroundColor = '#4CAF50';
                downloadAllButton.style.color = 'white';

                downloadAllButton.onmouseover = () => downloadAllButton.style.backgroundColor = '#45a049';
                downloadAllButton.onmouseout = () => downloadAllButton.style.backgroundColor = '#4CAF50';

                // 使用 async/await 来确保链接按顺序打开
                downloadAllButton.onclick = async () => {
                    const checkedItems = document.querySelectorAll('input[type="checkbox"]:checked');
                    if (checkedItems.length === 0) {
                        // 使用 div 替代 alert
                        showMessage('请先选择要下载的文件!');
                        return;
                    }

                    // 禁用按钮以防重复点击
                    downloadAllButton.disabled = true;
                    downloadAllButton.innerText = '正在按顺序打开...';

                    for (const item of checkedItems) {
                        const url = item.value;
                        console.log(`[FitGirl助手] 正在打开已选链接: ${url}`);
                        // GM_openInTab 的第二个参数，active: true 表示在新标签页中打开并激活
                        // 我们可以通过一个 Promise 来等待一个短时间，模拟等待新标签页处理
                        await new Promise(resolve => {
                            GM_openInTab(url, { active: true });
                            // 等待 1 秒，确保浏览器有时间打开和处理新标签页
                            setTimeout(resolve, 1000);
                        });
                    }

                    console.log('[FitGirl助手] 所有链接已按顺序打开完成。');
                    downloadAllButton.disabled = false;
                    downloadAllButton.innerText = '下载已选内容';
                };

                // 将下载按钮添加到按钮容器
                buttonContainer.appendChild(downloadAllButton);

                // 将整个按钮容器添加到主容器
                linkContainer.appendChild(buttonContainer);

                // 创建链接列表容器
                const listContainer = document.createElement('div');
                listContainer.style.display = 'flex';
                listContainer.style.flexDirection = 'column';
                listContainer.style.gap = '10px';

                links.forEach((link, index) => {
                    const originalUrl = link.href;
                    // 从链接中提取文件名作为按钮文本
                    const fileName = originalUrl.split('#')[1] || `Part ${index + 1}`;
                    const fileLabel = fileName.replace(/_/g, ' ');

                    // 为每个链接创建带复选框的列表项
                    const listItem = document.createElement('div');
                    listItem.style.display = 'flex';
                    listItem.style.alignItems = 'center';
                    listItem.style.gap = '8px';

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = `download-item-${index}`;
                    checkbox.value = originalUrl;
                    checkbox.style.cursor = 'pointer';

                    const label = document.createElement('label');
                    label.htmlFor = `download-item-${index}`;
                    label.innerText = fileLabel;
                    label.style.cursor = 'pointer';

                    listItem.appendChild(checkbox);
                    listItem.appendChild(label);
                    listContainer.appendChild(listItem);
                });

                linkContainer.appendChild(listContainer);

                entryContent.prepend(linkContainer);
                console.log('[FitGirl助手] 下载助手界面已成功创建。');

                // 消息框函数，替代 alert
                function showMessage(msg) {
                    const messageBox = document.createElement('div');
                    messageBox.style.cssText = `
                        position: fixed;
                        top: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        background-color: #ffc107;
                        color: #333;
                        padding: 15px 30px;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        z-index: 9999;
                        font-family: sans-serif;
                        opacity: 0;
                        transition: opacity 0.5s ease-in-out;
                    `;
                    messageBox.innerText = msg;
                    document.body.appendChild(messageBox);

                    setTimeout(() => {
                        messageBox.style.opacity = '1';
                    }, 10);

                    setTimeout(() => {
                        messageBox.style.opacity = '0';
                        messageBox.addEventListener('transitionend', () => {
                            messageBox.remove();
                        });
                    }, 3000);
                }

            } else {
                console.log('[FitGirl助手] 正在等待页面内容加载...');
            }
        }, 1000); // 每秒检查一次
    }

    // --- 下载页面逻辑 (fuckingfast.co) ---
    // 这部分逻辑保持不变
    if (window.location.hostname.includes('fuckingfast.co')) {
        console.log('[下载页面] 脚本已启动，准备点击下载按钮。');
        const interval = setInterval(() => {
            const downloadButton = document.querySelector('button.link-button.text-5xl.gay-button');
            if (downloadButton) {
                console.log('[下载页面] 下载按钮已找到，正在点击...');
                clearInterval(interval);
                downloadButton.click();

                setTimeout(() => {
                    // 尝试关闭页面
                    window.close();
                }, 3000); // 3秒后关闭
            } else {
                console.log('[下载页面] 正在等待下载按钮出现...');
            }
        }, 1000);
    }
})();
