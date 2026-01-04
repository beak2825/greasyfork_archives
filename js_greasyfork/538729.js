// ==UserScript==
// @name         飞书妙记增强脚本
// @namespace    https://github.com/liaozhu913/Lark-Minutes-Enhancer
// @version      2.0
// @description  [v2.0] 新增长按、编辑功能！感谢@船长技术支持。文字记录页面单击"复制为MD"按钮复制纯文本，长按1秒复制含说话人和时间戳的完整信息。
// @author       liaozhu913, @船长
// @match        https://*.feishu.cn/minutes/*
// @grant        GM_addStyle
// @run-at       document-end
// @icon         https://raw.githubusercontent.com/liaozhu913/Lark-Minutes-Enhancer/main/icon.png
// @homepageURL  https://github.com/liaozhu913/Lark-Minutes-Enhancer
// @supportURL   https://github.com/liaozhu913/Lark-Minutes-Enhancer/issues
// @downloadURL https://update.greasyfork.org/scripts/538729/%E9%A3%9E%E4%B9%A6%E5%A6%99%E8%AE%B0%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/538729/%E9%A3%9E%E4%B9%A6%E5%A6%99%E8%AE%B0%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const SCRIPT_PREFIX = '[飞书妙记增强 v2.1]：';

    // ... UI样式, expandAllChapters, summaryToMarkdown 函数与 v1.8 相同 ...
    GM_addStyle(`
        #floating-copy-button:disabled { background-color: #868e96; cursor: not-allowed; }
        div.ai-quota-exceed-mask, div.linear-gradient-content { display: none !important; }
        #floating-copy-button {
            position: absolute; top: 15px; right: 20px; z-index: 9999;
            padding: 6px 12px; font-size: 14px; font-weight: bold; color: #fff;
            background-color: #007AFF; border: none; border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2); cursor: pointer;
            transition: all 0.2s ease-in-out;
        }
        #floating-copy-button:hover:not(:disabled) { background-color: #0056b3; transform: scale(1.05); }
        #floating-copy-button.success { background-color: #28a745; }
        #floating-copy-button.error { background-color: #dc3545; }
    `);
    function expandAllChapters() { /* ... */ }
    function summaryToMarkdown(element) { /* ... */ }

    // --- [核心解析器 2 - 重大升级!] 文字记录滚动读取器 ---
    async function transcriptToText(scrollContainer, button, includeMetadata = false) {
        const collectedData = new Map(); // 使用Map来根据时间戳去重
        const originalScrollTop = scrollContainer.scrollTop;
        let lastScrollTop = -1;

        button.textContent = '读取中...';
        button.disabled = true;

        console.log(SCRIPT_PREFIX + '开始分段读取文字记录...');
        scrollContainer.scrollTop = 0; // 从头开始
        await new Promise(resolve => setTimeout(resolve, 100)); // 等待滚动生效

        while (scrollContainer.scrollTop !== lastScrollTop) {
            lastScrollTop = scrollContainer.scrollTop;

            const paragraphs = scrollContainer.querySelectorAll('.paragraph-editor-wrapper');
            paragraphs.forEach(p => {
                const timeEl = p.querySelector('.p-time');
                if (timeEl) {
                    const time = timeEl.getAttribute('time-content').trim();
                    if (!collectedData.has(time)) { // 如果是新的时间戳
                        const contentEl = p.querySelector('.mm-paragraph-content');
                        const content = contentEl ? contentEl.innerText.trim() : '';
                        if (content) {
                            if (includeMetadata) {
                                // 获取说话人信息
                                const speakerEl = p.querySelector('.p-user-name-editable');
                                const speaker = speakerEl ? speakerEl.getAttribute('user-name-content') || speakerEl.innerText.trim() : '';
                                // 格式化时间戳
                                const formattedTime = time;
                                // 保存包含说话人和时间戳的完整信息，格式与网页一致
                                const fullContent = `[${speaker} ${formattedTime}]\n${content}`;
                                collectedData.set(time, fullContent);
                            } else {
                                // 只保存纯文本内容，不包含说话人和时间戳
                                collectedData.set(time, content);
                            }
                        }
                    }
                }
            });

            // 向下滚动一屏
            scrollContainer.scrollTop += scrollContainer.clientHeight;
            await new Promise(resolve => setTimeout(resolve, 100)); // 等待滚动和DOM更新
        }

        button.disabled = false;
        scrollContainer.scrollTop = originalScrollTop; // 恢复滚动条
        console.log(SCRIPT_PREFIX + `读取完毕，共收集到 ${collectedData.size} 条不重复的记录。`);

        // 将Map中的值拼接起来
        return Array.from(collectedData.values()).join('\n\n');
    }

    // --- [功能 - 最终版!] 上下文感知的悬浮复制按钮 ---
    function addFloatingCopyButton() {
        const rightPanel = document.querySelector('div.detail-right-content');
        if (rightPanel && !document.getElementById('floating-copy-button')) {
            const copyButton = document.createElement('button');
            copyButton.id = 'floating-copy-button';
            copyButton.textContent = '复制为MD';

            copyButton.addEventListener('click', async () => {
                let contentToCopy = '';
                let contentType = '智能纪要';

                const summaryTab = document.querySelector('.summary-tab.right-tab-visible');
                const transcriptTab = document.querySelector('.transcript-tab.right-tab-visible');

                if (summaryTab) {
                    const contentWrapper = summaryTab.querySelector('.minutes-editable.ai-summary-content-editable');
                    if (contentWrapper) { contentToCopy = summaryToMarkdown(contentWrapper); }
                } else if (transcriptTab) {
                    contentType = '文字记录';
                    const scrollContainer = transcriptTab.querySelector('.rc-virtual-list-holder');
                    if (scrollContainer) {
                        contentToCopy = await transcriptToText(scrollContainer, copyButton); // 调用新的异步读取器
                    }
                }

                if (contentToCopy) {
                    navigator.clipboard.writeText(contentToCopy).then(/* ... */);
                }
            });

            rightPanel.style.position = 'relative';
            rightPanel.appendChild(copyButton);
        }
    }

    // 省略重复代码的完整实现
    function expandAllChapters() {
        const expandButton = document.querySelector('div.ai-summary-content-editable-expand-button-wrapper > button:not([data-expanded="true"])');
        if (expandButton && expandButton.textContent.includes('展开')) {
            expandButton.click();
            expandButton.setAttribute('data-expanded', 'true');
        }
    }
    function summaryToMarkdown(element) {
        let markdownText = '';
        function processNode(node, listLevel = 0) {
            if (node.nodeType === Node.TEXT_NODE) { markdownText += node.textContent; }
            else if (node.nodeType === Node.ELEMENT_NODE) {
                let prefix = '', suffix = '';
                let children = Array.from(node.childNodes);
                switch (node.tagName) {
                    case 'DIV': if (!node.classList.contains('list-div')) { suffix = '\n'; } break;
                    case 'UL': case 'OL': children.forEach(child => processNode(child, listLevel + 1)); return;
                    case 'LI': prefix = '  '.repeat(listLevel - 1) + '- '; suffix = '\n'; break;
                    case 'SPAN':
                        if (getComputedStyle(node).fontWeight === '700' || getComputedStyle(node).fontWeight === 'bold') { prefix = '**'; suffix = '**'; }
                        if (node.hasAttribute('data-enter')) { return; }
                        break;
                }
                markdownText += prefix;
                children.forEach(child => processNode(child, listLevel));
                markdownText += suffix;
            }
        }
        processNode(element);
        return markdownText.replace(/\n\s*\n/g, '\n').trim();
    }
    const fullAddFloatingCopyButton = addFloatingCopyButton;
    addFloatingCopyButton = function() {
        const rightPanel = document.querySelector('div.detail-right-content');
        if (rightPanel) {
            // 检查是否在智能纪要页面
            const summaryTab = document.querySelector('.summary-tab.right-tab-visible');
            const transcriptTab = document.querySelector('.transcript-tab.right-tab-visible');
            const existingEditButton = document.getElementById('floating-edit-button');
            
            // 在智能纪要页面显示编辑按钮，在文字记录页面隐藏
            if (summaryTab) {
                if (!existingEditButton) {
                    const editButton = document.createElement('button');
                    editButton.id = 'floating-edit-button';
                    editButton.textContent = '编辑';
                    editButton.style.cssText = `
                        position: absolute; top: 15px; right: 115px; z-index: 9999;
                        padding: 6px 12px; font-size: 14px; font-weight: bold; color: #007AFF;
                        background-color: transparent; border: 1px solid #007AFF; border-radius: 6px;
                        cursor: pointer; transition: all 0.2s ease-in-out;
                    `;
                    
                    // 添加悬停效果
                    editButton.addEventListener('mouseenter', () => {
                        editButton.style.backgroundColor = '#007AFF';
                        editButton.style.color = '#fff';
                    });
                    editButton.addEventListener('mouseleave', () => {
                        editButton.style.backgroundColor = 'transparent';
                        editButton.style.color = '#007AFF';
                    });
                    
                    // 点击事件：触发原有的编辑按钮或处理编辑状态
                    editButton.addEventListener('click', () => {
                        // 检查当前是否在编辑状态
                        const editButtonGroup = document.querySelector('.edit-button-group');
                        const originalEditButton = document.querySelector('.summary-edit-btn');
                        
                        if (editButtonGroup) {
                            // 如果已在编辑状态，根据按钮文本执行相应操作
                            if (editButton.textContent === '取消') {
                                const cancelButton = editButtonGroup.querySelector('.ud__button--outlined');
                                if (cancelButton) cancelButton.click();
                            } else if (editButton.textContent === '完成') {
                                const saveButton = editButtonGroup.querySelector('.ud__button--filled');
                                if (saveButton) saveButton.click();
                            }
                        } else if (originalEditButton) {
                            // 如果不在编辑状态，点击编辑按钮
                            originalEditButton.click();
                        }
                    });
                    
                    // 更新编辑按钮状态的函数
                    function updateEditButtonState() {
                        // 使用延迟检查，等待DOM更新
                        setTimeout(() => {
                            const editButtonGroup = document.querySelector('.edit-button-group');
                            
                            if (editButtonGroup) {
                                // 编辑状态：显示取消和完成按钮
                                editButton.style.cssText = `
                                    position: absolute; top: 15px; right: 190px; z-index: 9999;
                                    padding: 6px 8px; font-size: 12px; font-weight: bold; color: #666;
                                    background-color: transparent; border: 1px solid #ddd; border-radius: 4px;
                                    cursor: pointer; transition: all 0.2s ease-in-out;
                                `;
                                editButton.textContent = '取消';
                                
                                // 创建完成按钮（如果不存在）
                                let saveButton = document.getElementById('floating-save-button');
                                if (!saveButton) {
                                    saveButton = document.createElement('button');
                                    saveButton.id = 'floating-save-button';
                                    saveButton.textContent = '完成';
                                    saveButton.style.cssText = `
                                        position: absolute; top: 15px; right: 125px; z-index: 9999;
                                        padding: 6px 8px; font-size: 12px; font-weight: bold; color: #fff;
                                        background-color: #007AFF; border: none; border-radius: 4px;
                                        cursor: pointer; transition: all 0.2s ease-in-out;
                                    `;
                                    
                                    // 完成按钮点击事件
                                    saveButton.addEventListener('click', () => {
                                        const saveBtn = document.querySelector('.edit-button-group .ud__button--filled');
                                        if (saveBtn) saveBtn.click();
                                    });
                                    
                                    rightPanel.appendChild(saveButton);
                                }
                                saveButton.style.display = 'block';
                            } else {
                                // 非编辑状态：显示编辑按钮
                                editButton.style.cssText = `
                                    position: absolute; top: 15px; right: 115px; z-index: 9999;
                                    padding: 6px 12px; font-size: 14px; font-weight: bold; color: #007AFF;
                                    background-color: transparent; border: 1px solid #007AFF; border-radius: 6px;
                                    cursor: pointer; transition: all 0.2s ease-in-out;
                                `;
                                editButton.textContent = '编辑';
                                
                                // 隐藏完成按钮
                                const saveButton = document.getElementById('floating-save-button');
                                if (saveButton) {
                                    saveButton.style.display = 'none';
                                }
                            }
                        }, 100);
                    }
                    
                    // 初始状态更新
                    updateEditButtonState();
                    
                    // 监听编辑状态变化 - 观察整个summary-tab区域
                    const editStateObserver = new MutationObserver(() => {
                        updateEditButtonState();
                    });
                    
                    // 观察更大的区域以捕获编辑状态变化
                    const summaryContainer = document.querySelector('.summary-tab');
                    if (summaryContainer) {
                        editStateObserver.observe(summaryContainer, { 
                            childList: true, 
                            subtree: true,
                            attributes: true
                        });
                    }
                    
                    rightPanel.appendChild(editButton);
                } else {
                    existingEditButton.style.display = 'block';
                }
            } else if (transcriptTab && existingEditButton) {
                // 在文字记录页面隐藏编辑按钮
                existingEditButton.style.display = 'none';
            }
            
            // 添加复制按钮
            if (!document.getElementById('floating-copy-button')) {
                const copyButton = document.createElement('button');
                copyButton.id = 'floating-copy-button';
                copyButton.textContent = '复制为MD';
                let pressTimer = null;
                let isLongPress = false;

                // 鼠标按下事件
                copyButton.addEventListener('mousedown', () => {
                    isLongPress = false;
                    pressTimer = setTimeout(() => {
                        isLongPress = true;
                        // 长按1秒后的视觉反馈
                        const transcriptTab = document.querySelector('.transcript-tab.right-tab-visible');
                        if (transcriptTab) {
                            copyButton.style.backgroundColor = '#ff6b35';
                            copyButton.textContent = '含时间戳';
                        }
                    }, 1000);
                });

                // 鼠标松开事件
                copyButton.addEventListener('mouseup', () => {
                    if (pressTimer) {
                        clearTimeout(pressTimer);
                        pressTimer = null;
                    }
                });

                // 鼠标离开事件（防止拖拽时计时器继续运行）
                copyButton.addEventListener('mouseleave', () => {
                    if (pressTimer) {
                        clearTimeout(pressTimer);
                        pressTimer = null;
                    }
                    // 恢复按钮样式
                    copyButton.style.backgroundColor = '';
                    copyButton.textContent = '复制为MD';
                });

                // 点击事件
                copyButton.addEventListener('click', async () => {
                    // 如果是长按，延迟一点执行以确保长按标记已设置
                    if (isLongPress) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }

                    let contentToCopy = '';
                    let contentType = '智能纪要';
                    const summaryTab = document.querySelector('.summary-tab.right-tab-visible');
                    const transcriptTab = document.querySelector('.transcript-tab.right-tab-visible');
                    
                    if (summaryTab) {
                        const contentWrapper = summaryTab.querySelector('.minutes-editable.ai-summary-content-editable');
                        if (contentWrapper) { contentToCopy = summaryToMarkdown(contentWrapper); }
                    } else if (transcriptTab) {
                        contentType = '文字记录';
                        const scrollContainer = transcriptTab.querySelector('.rc-virtual-list-holder');
                        if (scrollContainer) { 
                            // 根据是否长按决定是否包含元数据
                            contentToCopy = await transcriptToText(scrollContainer, copyButton, isLongPress); 
                        }
                    }
                    
                    if (contentToCopy) {
                        const copyTypeText = isLongPress ? '（含时间戳）' : '（纯文本）';
                        navigator.clipboard.writeText(contentToCopy).then(() => {
                            console.log(SCRIPT_PREFIX + `${contentType}${copyTypeText}已成功复制。`);
                            copyButton.textContent = '复制成功!';
                            copyButton.className = 'success';
                            copyButton.style.backgroundColor = '';
                            setTimeout(() => { 
                                copyButton.textContent = '复制为MD'; 
                                copyButton.className = ''; 
                            }, 2000);
                        }).catch(err => {
                            console.error(SCRIPT_PREFIX + '复制失败:', err);
                            copyButton.textContent = '复制失败';
                            copyButton.className = 'error';
                            copyButton.style.backgroundColor = '';
                            setTimeout(() => { 
                                copyButton.textContent = '复制为MD'; 
                                copyButton.className = ''; 
                            }, 2000);
                        });
                    } else {
                        console.error(SCRIPT_PREFIX + '未找到可复制的内容。');
                    }
                    
                    // 重置长按状态
                    isLongPress = false;
                });
                
                rightPanel.style.position = 'relative';
                rightPanel.appendChild(copyButton);
            }
        }
    };

    const observer = new MutationObserver(() => {
        expandAllChapters();
        addFloatingCopyButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    console.log(SCRIPT_PREFIX + '脚本已启动，终极虚拟滚动兼容模式已启用！');
})();
