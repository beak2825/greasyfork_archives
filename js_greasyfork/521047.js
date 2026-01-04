// ==UserScript==
// @name         PikPak批量分享链接生成
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  批量生成PikPak网盘当前文件夹的分享链接
// @author       dongzi
// @match        https://mypikpak.com/drive/*
// @match        https://mypikpak.net/drive/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521047/PikPak%E6%89%B9%E9%87%8F%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E7%94%9F%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/521047/PikPak%E6%89%B9%E9%87%8F%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E7%94%9F%E6%88%90.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2024 dongzi0712

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    // 在脚本顶部添加一个 Set 来跟踪已处理的文件
    const processedFiles = new Set();

    // 添加批量分享按钮
    function addBatchShareButton() {
        const headerBarRight = document.querySelector('.header-bar-right');
        
        if (!headerBarRight || document.getElementById('batch-share-btn')) {
            return;
        }

        // 创建按钮
        const shareBtn = document.createElement('a');
        shareBtn.id = 'batch-share-btn';
        shareBtn.className = 'pp-link-button hover-able';
        shareBtn.href = 'javascript:void(0);';
        shareBtn.textContent = '批量分享';
        shareBtn.style.cssText = `
            margin-right: 8px;
            color: var(--color-text-0);
        `;

        // 添加到帮助中心按钮之前
        const helpCenter = headerBarRight.querySelector('a[href="/help-center"]');
        if (helpCenter) {
            headerBarRight.insertBefore(shareBtn, helpCenter);
        } else {
            headerBarRight.insertBefore(shareBtn, headerBarRight.firstChild);
        }

        shareBtn.addEventListener('click', () => generateShareLinks());
    }

    // 等待元素出现的函数
    function waitForElement(callback, maxTries = 100) {
        const selector = '.file-explorer-operation-box .file-operations';
        
        let tries = 0;
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            tries++;
            
            if (element) {
                clearInterval(interval);
                console.log('找到目标元素:', element); // 调试信息
                callback(element);
            } else if (tries >= maxTries) {
                clearInterval(interval);
                console.log('未找到工具栏元素:', selector); // 调试信息
            }
        }, 500);
    }

    // 初始化函数
    function init() {
        console.log('初始化脚本'); // 调试信息
        
        // 直接尝试添加按钮
        addBatchShareButton();
        
        // 如果直接添加失败，等待元素出现
        if (!document.getElementById('batch-share-btn')) {
            waitForElement(() => {
                addBatchShareButton();
                
                // 监听面变化
                const observer = new MutationObserver(() => {
                    const button = document.getElementById('batch-share-btn');
                    if (!button) {
                        console.log('检测到 DOM 变化，尝试重新添加按钮'); // 调试信息
                        addBatchShareButton();
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            });
        }
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 路由变化检测
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            console.log('URL 已改变，新初始化...'); // 调试信息
            setTimeout(init, 500); // 减少延迟时间
        }
    }).observe(document, { subtree: true, childList: true });

    // 更新文件选中状态的函数
    async function updateFileSelection(file, selected) {
        // 1. 找到文件的复选框
        const checkbox = 
            file.element.querySelector('.el-checkbox__input') ||
            file.element.querySelector('.el-checkbox') ||
            file.element.querySelector('input[type="checkbox"]') ||
            file.element.querySelector('[role="checkbox"]') ||
            file.element.querySelector('.checkbox') ||
            Array.from(file.element.querySelectorAll('*')).find(el => 
                el.getAttribute('role') === 'checkbox' || 
                el.className.includes('checkbox')
            );
        
        if (!checkbox) {
            console.log('未找到文件的复选框:', file.name);
            // 尝试点击文件项本身
            const clickableArea = 
                file.element.querySelector('.file-name') ||
                file.element.querySelector('.filename') ||
                file.element;
                
            clickableArea.click();
            await new Promise(resolve => setTimeout(resolve, 500));
            return;
        }

        // 2. 如果当前状态与目标状态不同，则触发点击事件
        const isCurrentlySelected = file.element.classList.contains('selected');
        if (isCurrentlySelected !== selected) {
            checkbox.click();
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    // 等待文件列表加载完成
    async function waitForAllFiles() {
        let lastHeight = 0;
        let sameHeightCount = 0;
        const maxAttempts = 50; // 最大尝试次数
        let attempts = 0;

        while (true) {
            // 获取文件列表容器
            const container = document.querySelector('.file-list-container, .infinite-list-container');
            if (!container) break;

            // 获取当前高度
            const currentHeight = container.scrollHeight;
            
            // 如果高度连续3次相同，认为加载完成
            if (currentHeight === lastHeight) {
                sameHeightCount++;
                if (sameHeightCount >= 3) break;
            } else {
                sameHeightCount = 0;
            }

            // 更新上次高度
            lastHeight = currentHeight;

            // 滚动到底部
            container.scrollTop = currentHeight;
            
            // 等待新内容加载
            await new Promise(resolve => setTimeout(resolve, 500));

            // 防止无限循环
            attempts++;
            if (attempts >= maxAttempts) break;
        }
    }

    // 修改生成分享链接函数
    async function generateShareLinks() {
        // 清空已处理文件集合
        processedFiles.clear();
        
        // 创建结果显示
        const resultDiv = document.createElement('div');
        resultDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 9999;
            max-height: 80vh;
            overflow-y: auto;
            min-width: 300px;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '关闭';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 4px 8px;
            border: none;
            background: #f0f0f0;
            cursor: pointer;
            border-radius: 4px;
        `;
        closeBtn.onclick = () => document.body.removeChild(resultDiv);

        const content = document.createElement('div');
        content.innerHTML = '<h3>分享链接：</h3>';
        
        resultDiv.appendChild(closeBtn);
        resultDiv.appendChild(content);
        document.body.appendChild(resultDiv);

        // 处理可见文件的函数
        async function processVisibleFiles() {
            // 获取文件列表容器
            const container = document.querySelector('.list-container');
            if (!container) {
                console.log('未找到文件列表容器');
                return;
            }

            // 获取当前可见的文件项
            const visibleFiles = Array.from(document.querySelectorAll('li.list.row'))
                .filter(item => {
                    // 检查文件是否在视图中
                    const rect = item.getBoundingClientRect();
                    const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
                    
                    // 检查是否是有效文件（有文件名且不是文件夹）
                    const name = item.getAttribute('aria-label');
                    const isFolder = item.querySelector('.folder-icon, .icon-folder');
                    const isValidFile = name && name !== '未知文件' && !isFolder;
                    
                    // 检查文件是否已处理过
                    const isUnprocessed = !processedFiles.has(name);
                    
                    return isVisible && isValidFile && isUnprocessed;
                })
                .map(item => ({
                    element: item,
                    name: item.getAttribute('aria-label'),
                    id: item.id
                }));

            console.log('当前可见未处理文件数量:', visibleFiles.length);

            // 处理每个可见文件
            for (const file of visibleFiles) {
                try {
                    console.log('正在处理文件:', file.name);
                    processedFiles.add(file.name);
                    
                    await updateFileSelection(file, true);
                    const shareButton = await waitForShareButton(file.element);
                    
                    if (!shareButton) {
                        throw new Error('未找到分享按钮');
                    }

                    shareButton.click();
                    await new Promise(resolve => setTimeout(resolve, 500));

                    const shareDialogs = document.querySelectorAll('.el-dialog.create-shared__dialog');
                    let dialogFound = false;

                    for (const shareDialog of shareDialogs) {
                        if (shareDialog.style.display !== 'none') {
                            try {
                                const shareLink = await handleShareDialog(shareDialog);
                                const linkDiv = document.createElement('div');
                                linkDiv.style.margin = '10px 0';
                                linkDiv.innerHTML = `
                                    <strong>${file.name}</strong><br>
                                    <input type="text" value="${shareLink}" style="width: 100%; margin-top: 5px;" readonly>
                                `;
                                content.appendChild(linkDiv);
                                dialogFound = true;
                            } catch (error) {
                                console.error('处理分享弹窗时出错:', error);
                                throw error;
                            } finally {
                                // 关闭分享弹窗
                                const closeBtn = shareDialog.querySelector('.dialog-close, .el-dialog__close');
                                if (closeBtn) {
                                    closeBtn.click();
                                    await new Promise(resolve => setTimeout(resolve, 500));
                                }
                            }
                            break;
                        }
                    }

                    if (!dialogFound) {
                        throw new Error('分享弹窗未出现');
                    }
                } catch (error) {
                    console.error('处理文件时出错:', file.name, error);
                    const errorDiv = document.createElement('div');
                    errorDiv.style.margin = '10px 0';
                    errorDiv.style.color = 'red';
                    errorDiv.innerHTML = `
                        <strong>${file.name}</strong><br>
                        生成分享链接失败: ${error.message}
                    `;
                    content.appendChild(errorDiv);
                } finally {
                    // 无论成功还是失败，都取消选中状态
                    try {
                        await updateFileSelection(file, false);
                    } catch (e) {
                        console.error('取消文件选中状态失败:', e);
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            // 滚动到下一屏
            const elements = Array.from(document.querySelectorAll('li.list.row'));
            const currentIndex = elements.findIndex(el => {
                const rect = el.getBoundingClientRect();
                // 确保目标元素未被处理过
                const name = el.getAttribute('aria-label');
                return rect.top > window.innerHeight && !processedFiles.has(name);
            });

            if (currentIndex > 0) {
                const targetElement = elements[currentIndex];
                console.log('滚动到下一个未处理元素:', targetElement.getAttribute('aria-label'));
                
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // 等待滚动和容加载完成
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // 继续处理下一屏的文件
                await processVisibleFiles();
            } else {
                console.log('所有文件处理完成');
                console.log('已处理文件列表:', Array.from(processedFiles));
            }
        }

        // 开始处理文件
        await processVisibleFiles();

        // 添加复制全部按钮
        const copyAllBtn = document.createElement('button');
        copyAllBtn.innerHTML = '复制全部链接';
        copyAllBtn.style.cssText = `
            margin-top: 10px;
            padding: 6px 12px;
            background: var(--color-primary, #1890ff);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        copyAllBtn.onclick = () => {
            // 获取所有成功生成链接的文件项
            const fileItems = Array.from(content.querySelectorAll('div')).filter(div => div.querySelector('input'));
            
            // 构建复制文本，每个文件两行
            const copyText = fileItems.map(div => {
                const fileName = div.querySelector('strong').textContent;
                const fileLink = div.querySelector('input').value;
                return `${fileName}\n${fileLink}`;
            }).join('\n\n'); // 文件之间用空行分隔
            
            navigator.clipboard.writeText(copyText).then(() => {
                alert('已复制全部链接到剪贴板！');
            }).catch(err => {
                console.error('复��失败:', err);
                // 创建临时文本区域作为后备方案
                const textarea = document.createElement('textarea');
                textarea.value = copyText;
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    alert('已复制全部链接到剪贴板！');
                } catch (e) {
                    alert('复制失败，请手动复制链接。');
                }
                document.body.removeChild(textarea);
            });
        };
        content.appendChild(copyAllBtn);
    }

    // 扩展 waitForElement 函数以支持函数选择器
    async function waitForElement(selector, maxTries = 20) {
        for (let i = 0; i < maxTries; i++) {
            const element = typeof selector === 'function' ? selector() : document.querySelector(selector);
            if (element) return element;
            await new Promise(resolve => setTimeout(resolve, 250));
        }
        return null;
    }

    // 辅助函数：通过文本内容查找元素
    function findElementByText(selector) {
        const [tagSelector, text] = selector.split(':contains(');
        const searchText = text.slice(0, -1); // 移除最后的 )
        return Array.from(document.querySelectorAll(tagSelector))
            .find(el => el.textContent.includes(searchText));
    }

    // 修改 handleShareDialog 函数
    async function handleShareDialog(shareDialog) {
        try {
            // 1. 查找并等待"创建分享"按钮变为可用状态
            const createShareBtn = await waitForElement(() => {
                const button = Array.from(shareDialog.querySelectorAll('button.el-button--primary')).find(btn => 
                    btn.textContent.includes('创建分享')
                );
                return button && !button.hasAttribute('disabled') ? button : null;
            }, 40);

            if (!createShareBtn) {
                throw new Error('未找到可用的创建分享按钮');
            }

            console.log('找到可用的创建分享按钮:', createShareBtn);
            createShareBtn.click();

            // 立即查找确认弹窗
            const confirmDialog = document.querySelector('.el-message-box');
            if (confirmDialog) {
                const confirmBtn = Array.from(confirmDialog.querySelectorAll('button')).find(btn => 
                    btn.textContent.includes('确定') || 
                    btn.classList.contains('el-button--primary')
                );
                if (confirmBtn) {
                    console.log('点击确认按钮');
                    confirmBtn.click();
                }
            }

            // 2. 等待链接生成
            const linkElement = await waitForElement(() => {
                const element = shareDialog.querySelector('.shared-url');
                return element && element.href && element.href.includes('mypikpak.com/s/') ? element : null;
            }, 40);
            
            if (!linkElement) {
                throw new Error('未找到有效的分享链接');
            }

            const shareLink = linkElement.href;

            // 3. 只关闭分享成功提示，不关闭分享链接弹框
            const successMessages = Array.from(document.querySelectorAll('.el-message')).filter(msg => {
                return msg.classList.contains('el-message--success') || 
                       msg.textContent.includes('成功') ||
                       msg.querySelector('.success-icon');
            });

            for (const msg of successMessages) {
                if (msg.style.display !== 'none') {
                    console.log('关闭成功提示:', msg.outerHTML);
                    msg.style.display = 'none';
                    if (msg.parentElement) {
                        msg.parentElement.removeChild(msg);
                    }
                }
            }

            return shareLink;
        } catch (error) {
            console.error('处理分享弹窗时出错:', error);
            throw error;
        }
    }

    // 等待分享按钮出现的函数
    async function waitForShareButton(element, maxTries = 20) {
        // 1. 触发鼠标进入事件
        element.dispatchEvent(new MouseEvent('mouseenter', {
            bubbles: true,
            cancelable: true,
            view: window
        }));

        // 2. 等待操作区域和按钮出现
        for (let i = 0; i < maxTries; i++) {
            await new Promise(resolve => setTimeout(resolve, 500));

            // 查找操作区域
            const operationArea = element.querySelector('.operation');
            if (!operationArea) {
                console.log('未找到操作区域，继续等待...');
                continue;
            }

            // 确保操作区域可见
            operationArea.style.display = 'flex';
            operationArea.style.visibility = 'visible';
            operationArea.style.opacity = '1';

            // 查找并点击更多操作按钮
            const moreButton = operationArea.querySelector('a.pp-link-button');
            if (moreButton) {
                console.log('找到更多操作按钮，点击它');
                moreButton.click();
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // 查找分享按钮（在弹出菜单中）
            const shareButton = 
                document.querySelector('li[data-group="encourage"] a[aria-label="分享"]') ||
                document.querySelector('a[aria-label="分享"]') ||
                Array.from(document.querySelectorAll('a')).find(a => 
                    a.getAttribute('aria-label') === '分享' || 
                    a.textContent.includes('分享')
                );
            
            if (shareButton) {
                console.log('找到分享按钮:', shareButton.outerHTML);
                
                // 确保按钮可见
                shareButton.style.removeProperty('display');
                shareButton.style.display = 'flex';
                shareButton.style.visibility = 'visible';
                shareButton.style.opacity = '1';
                
                // 确保父元素可见
                const parentLi = shareButton.closest('li[data-group="encourage"]');
                if (parentLi) {
                    parentLi.style.removeProperty('display');
                    parentLi.style.display = 'flex';
                    parentLi.style.visibility = 'visible';
                    parentLi.style.opacity = '1';
                }

                // ���待按钮完全可交互
                await new Promise(resolve => setTimeout(resolve, 500));
                return shareButton;
            }

            console.log(`第 ${i + 1} 次尝试未找到分享按钮，继续等待...`);
        }

        // 如果所有尝试都失败了，打印文件项的完整 HTML
        console.log('文件项的完整 HTML:', element.outerHTML);
        return null;
    }
})(); 