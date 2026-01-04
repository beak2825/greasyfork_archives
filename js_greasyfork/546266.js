// ==UserScript==
// @name         V2EX内容过滤器
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  屏蔽V2EX标题包含关键词的内容，并记录被屏蔽的内容
// @author       vitahuang
// @match        https://www.v2ex.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546266/V2EX%E5%86%85%E5%AE%B9%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/546266/V2EX%E5%86%85%E5%AE%B9%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储当前页面被屏蔽的项目
    let blockedItems = [];
    // 屏蔽计数提示元素
    let counterElement = null;

    // 默认屏蔽词列表
    const DEFAULT_BLOCK_KEYWORDS = [
        // 示例："凡人修仙传"
    ];

    // 获取存储的屏蔽词列表
    function getBlockKeywords() {
        return GM_getValue('blockKeywords', DEFAULT_BLOCK_KEYWORDS);
    }

    // 保存屏蔽词列表
    function saveBlockKeywords(keywords) {
        GM_setValue('blockKeywords', keywords);
    }

    // 创建并更新屏蔽计数提示
    function createOrUpdateCounter() {
        // 如果还没有创建计数器元素
        if (!counterElement) {
            counterElement = document.createElement('div');
            counterElement.id = 'blocked-counter';
            counterElement.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(44, 62, 80, 0.9);
                color: white;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 13px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                z-index: 99999;
                transition: all 0.3s ease;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
                opacity: 0.8;
            `;

            // 添加图标
            const icon = document.createElement('span');
            icon.innerHTML = '🔒';
            counterElement.appendChild(icon);

            // 添加文本容器
            const textSpan = document.createElement('span');
            textSpan.id = 'counter-text';
            counterElement.appendChild(textSpan);

            // 点击计数器可以查看被屏蔽内容
            counterElement.addEventListener('click', showBlockedItems);

            // 鼠标悬停时增加透明度
            counterElement.addEventListener('mouseover', () => {
                counterElement.style.opacity = '1';
                counterElement.style.transform = 'scale(1.05)';
            });

            // 鼠标离开时恢复透明度
            counterElement.addEventListener('mouseout', () => {
                counterElement.style.opacity = '0.8';
                counterElement.style.transform = 'scale(1)';
            });

            document.body.appendChild(counterElement);
        }

        // 更新计数器文本
        const textSpan = document.getElementById('counter-text');
        if (blockedItems.length === 1) {
            textSpan.textContent = `已屏蔽 1 条内容`;
        } else {
            textSpan.textContent = `已屏蔽 ${blockedItems.length} 条内容`;
        }

        // 根据是否有屏蔽内容显示或隐藏计数器
        if (blockedItems.length === 0) {
            counterElement.style.display = 'none';
        } else {
            counterElement.style.display = 'flex';
        }
    }

    // 检查标题是否包含屏蔽词
    function shouldBlock(titleElement) {
        if (!titleElement) return false;

        const titleText = titleElement.textContent.trim().toLowerCase();
        const keywords = getBlockKeywords().map(k => k.trim().toLowerCase());

        return keywords.some(keyword =>
            keyword && titleText.includes(keyword)
        );
    }

    // 屏蔽元素样式
    const BLOCK_STYLES = `
        display: none !important;
    `;

    // 屏蔽符合条件的内容并记录
    function blockContent() {
        // 针对特定网站的选择器
        const containerSelector = '.cell.item';
        const titleSelector = '.item_title a.topic-link';

        document.querySelectorAll(containerSelector).forEach(container => {
            const titleElement = container.querySelector(titleSelector);

            if (titleElement && shouldBlock(titleElement)) {
                // 提取标题和链接
                const title = titleElement.textContent.trim();
                const href = titleElement.href;
                const keyword = getMatchedKeyword(titleElement);

                // 检查是否已记录，避免重复
                const isAlreadyRecorded = blockedItems.some(
                    item => item.href === href
                );

                if (!isAlreadyRecorded) {
                    blockedItems.push({
                        title,
                        href,
                        keyword,
                        time: new Date().toLocaleTimeString()
                    });
                    // 更新计数器
                    createOrUpdateCounter();
                }

                // 屏蔽内容
                container.style.cssText += BLOCK_STYLES;
                container.setAttribute('data-blocked-by', 'content-filter-with-tags');
            }
        });
    }

    // 获取匹配的关键词
    function getMatchedKeyword(titleElement) {
        const titleText = titleElement.textContent.trim().toLowerCase();
        const keywords = getBlockKeywords();

        return keywords.find(keyword =>
            titleText.includes(keyword.toLowerCase())
        ) || '未知关键词';
    }

    // 创建标签式关键词管理界面
    function createKeywordManagerUI() {
        // 移除已存在的界面（如果有）
        const existingUI = document.getElementById('keyword-manager-ui');
        if (existingUI) {
            existingUI.remove();
        }

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'keyword-manager-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999999;
            backdrop-filter: blur(3px);
        `;

        // 创建主容器
        const container = document.createElement('div');
        container.id = 'keyword-manager-ui';
        container.style.cssText = `
            background: #fff;
            width: 90%;
            max-width: 700px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        `;

        // 创建标题栏
        const header = document.createElement('div');
        header.style.cssText = `
            background: #2c3e50;
            color: white;
            padding: 18px 24px;
            font-size: 18px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        header.textContent = '关键词管理';

        // 关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            background: transparent;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.2s;
        `;
        closeBtn.onmouseover = () => closeBtn.style.background = 'rgba(255,255,255,0.2)';
        closeBtn.onmouseout = () => closeBtn.style.background = 'transparent';
        closeBtn.onclick = () => overlay.remove();
        header.appendChild(closeBtn);

        // 内容区域
        const content = document.createElement('div');
        content.style.cssText = `
            padding: 24px;
        `;

        // 添加关键词区域
        const addKeywordContainer = document.createElement('div');
        addKeywordContainer.style.cssText = `
            display: flex;
            gap: 10px;
            margin-bottom: 24px;
            align-items: center;
        `;

        // 输入框
        const keywordInput = document.createElement('input');
        keywordInput.type = 'text';
        keywordInput.placeholder = '输入新的关键词...';
        keywordInput.style.cssText = `
            flex-grow: 1;
            padding: 10px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            box-sizing: border-box;
        `;

        // 新增按钮
        const addBtn = document.createElement('button');
        addBtn.textContent = '新增';
        addBtn.style.cssText = `
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            background: #3498db;
            color: white;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
        `;
        addBtn.onmouseover = () => addBtn.style.background = '#2980b9';
        addBtn.onmouseout = () => addBtn.style.background = '#3498db';

        addKeywordContainer.appendChild(keywordInput);
        addKeywordContainer.appendChild(addBtn);
        content.appendChild(addKeywordContainer);

        // 已添加关键词区域标题
        const tagsTitle = document.createElement('h3');
        tagsTitle.textContent = '已添加的关键词';
        tagsTitle.style.cssText = `
            margin: 0 0 16px 0;
            font-size: 16px;
            color: #333;
        `;
        content.appendChild(tagsTitle);

        // 标签容器
        const tagsContainer = document.createElement('div');
        tagsContainer.id = 'keywords-tags-container';
        tagsContainer.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 20px;
            min-height: 40px;
        `;
        content.appendChild(tagsContainer);

        // 无关键词时的提示
        const emptyHint = document.createElement('div');
        emptyHint.id = 'empty-keywords-hint';
        emptyHint.textContent = '暂无关键词，添加一个开始使用吧';
        emptyHint.style.cssText = `
            color: #999;
            font-size: 14px;
            padding: 10px 0;
        `;
        content.appendChild(emptyHint);

        // 底部按钮区域
        const footer = document.createElement('div');
        footer.style.cssText = `
            padding: 16px 24px;
            background: #f9f9f9;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        `;

        // 清空按钮
        const clearAllBtn = document.createElement('button');
        clearAllBtn.textContent = '清空所有';
        clearAllBtn.style.cssText = `
            padding: 8px 16px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: #f5f5f5;
            cursor: pointer;
            transition: all 0.2s;
        `;
        clearAllBtn.onmouseover = () => clearAllBtn.style.background = '#e8e8e8';
        clearAllBtn.onmouseout = () => clearAllBtn.style.background = '#f5f5f5';

        // 保存按钮
        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存设置';
        saveBtn.style.cssText = `
            padding: 8px 20px;
            border: none;
            border-radius: 4px;
            background: #3498db;
            color: white;
            cursor: pointer;
            transition: all 0.2s;
        `;
        saveBtn.onmouseover = () => saveBtn.style.background = '#2980b9';
        saveBtn.onmouseout = () => saveBtn.style.background = '#3498db';

        footer.appendChild(clearAllBtn);
        footer.appendChild(saveBtn);

        // 组装界面
        container.appendChild(header);
        container.appendChild(content);
        container.appendChild(footer);
        overlay.appendChild(container);
        document.body.appendChild(overlay);

        // 加载现有关键词并显示为标签
        let currentKeywords = [...getBlockKeywords()];
        updateKeywordTags();

        // 更新标签显示
        function updateKeywordTags() {
            // 清空现有标签
            tagsContainer.innerHTML = '';

            // 显示或隐藏空提示
            emptyHint.style.display = currentKeywords.length === 0 ? 'block' : 'none';

            // 添加所有关键词标签
            currentKeywords.forEach((keyword, index) => {
                const tag = document.createElement('div');
                tag.style.cssText = `
                    background: #f1f5f9;
                    color: #333;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                `;

                // 关键词文本
                const tagText = document.createElement('span');
                tagText.textContent = keyword;
                tag.appendChild(tagText);

                // 删除按钮
                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = '×';
                deleteBtn.style.cssText = `
                    background: transparent;
                    border: none;
                    color: #999;
                    cursor: pointer;
                    width: 16px;
                    height: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    font-size: 12px;
                    transition: all 0.2s;
                `;
                deleteBtn.onmouseover = () => {
                    deleteBtn.style.color = '#e74c3c';
                    tag.style.background = '#fef2f2';
                };
                deleteBtn.onmouseout = () => {
                    deleteBtn.style.color = '#999';
                    tag.style.background = '#f1f5f9';
                };

                // 删除确认
                deleteBtn.onclick = () => {
                    if (confirm(`确定要删除关键词"${keyword}"吗？`)) {
                        currentKeywords.splice(index, 1);
                        updateKeywordTags();
                    }
                };

                tag.appendChild(deleteBtn);
                tagsContainer.appendChild(tag);
            });
        }

        // 添加关键词
        function addKeyword() {
            const keyword = keywordInput.value.trim();
            if (!keyword) {
                alert('请输入关键词');
                return;
            }

            if (currentKeywords.includes(keyword)) {
                alert('该关键词已存在');
                keywordInput.value = '';
                return;
            }

            currentKeywords.push(keyword);
            keywordInput.value = '';
            updateKeywordTags();

            // 自动聚焦输入框
            keywordInput.focus();
        }

        // 绑定添加按钮事件
        addBtn.addEventListener('click', addKeyword);

        // 绑定回车键添加关键词
        keywordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                addKeyword();
            }
        });

        // 清空所有关键词
        clearAllBtn.addEventListener('click', () => {
            if (currentKeywords.length === 0) {
                alert('当前没有关键词可清空');
                return;
            }

            if (confirm(`确定要清空所有(${currentKeywords.length}个)关键词吗？`)) {
                currentKeywords = [];
                updateKeywordTags();
            }
        });

        // 保存关键词设置
        saveBtn.addEventListener('click', () => {
            // 过滤空关键词
            const filteredKeywords = currentKeywords.filter(k => k.trim().length > 0);
            saveBlockKeywords(filteredKeywords);

            // 显示保存成功提示
            const successMsg = document.createElement('div');
            successMsg.style.cssText = `
                position: absolute;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #2ecc71;
                color: white;
                padding: 10px 20px;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 1000000;
            `;
            successMsg.textContent = `已保存 ${filteredKeywords.length} 个关键词`;
            document.body.appendChild(successMsg);

            // 关闭提示和配置界面
            setTimeout(() => {
                successMsg.remove();
                overlay.remove();
                location.reload(); // 刷新页面应用更改
            }, 1500);
        });

        // 自动聚焦输入框
        keywordInput.focus();
    }

    // 显示被屏蔽的内容列表
    function showBlockedItems() {
        // 移除已存在的界面（如果有）
        const existingUI = document.getElementById('blocked-items-ui');
        if (existingUI) {
            existingUI.remove();
        }

        // 如果没有被屏蔽的内容
        if (blockedItems.length === 0) {
            alert('当前页面没有被屏蔽的内容');
            return;
        }

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'blocked-items-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999999;
            backdrop-filter: blur(3px);
        `;

        // 创建主容器
        const container = document.createElement('div');
        container.id = 'blocked-items-ui';
        container.style.cssText = `
            background: #fff;
            width: 90%;
            max-width: 700px;
            max-height: 80vh;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        `;

        // 创建标题栏
        const header = document.createElement('div');
        header.style.cssText = `
            background: #2c3e50;
            color: white;
            padding: 18px 24px;
            font-size: 18px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        header.textContent = `被屏蔽的内容 (共 ${blockedItems.length} 项)`;

        // 关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            background: transparent;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.2s;
        `;
        closeBtn.onmouseover = () => closeBtn.style.background = 'rgba(255,255,255,0.2)';
        closeBtn.onmouseout = () => closeBtn.style.background = 'transparent';
        closeBtn.onclick = () => overlay.remove();
        header.appendChild(closeBtn);

        // 内容区域（带滚动）
        const content = document.createElement('div');
        content.style.cssText = `
            padding: 16px;
            overflow-y: auto;
            flex-grow: 1;
        `;

        // 添加被屏蔽的项目
        blockedItems.forEach((item, index) => {
            const itemContainer = document.createElement('div');
            itemContainer.style.cssText = `
                padding: 16px;
                border-bottom: 1px solid #eee;
                ${index === blockedItems.length - 1 ? 'border-bottom: none;' : ''}
                transition: background 0.2s;
            `;
            itemContainer.onmouseover = () => itemContainer.style.background = '#f9f9f9';
            itemContainer.onmouseout = () => itemContainer.style.background = 'transparent';

            // 标题和链接
            const titleLink = document.createElement('a');
            titleLink.href = item.href;
            titleLink.target = '_blank'; // 在新标签页打开
            titleLink.textContent = item.title;
            titleLink.style.cssText = `
                color: #3498db;
                text-decoration: none;
                font-size: 16px;
                display: block;
                margin-bottom: 8px;
                word-break: break-word;
            `;
            titleLink.onmouseover = () => titleLink.style.textDecoration = 'underline';
            titleLink.onmouseout = () => titleLink.style.textDecoration = 'none';

            // 附加信息（关键词）
            const info = document.createElement('div');
            info.style.cssText = `
                font-size: 13px;
                color: #777;
                display: flex;
                justify-content: space-between;
            `;

            const keywordSpan = document.createElement('span');
            keywordSpan.innerHTML = `屏蔽原因: <span style="color: #e74c3c;">${item.keyword}</span>`;

            const timeSpan = document.createElement('span');
            timeSpan.textContent = item.time;

            info.appendChild(keywordSpan);
            info.appendChild(timeSpan);

            itemContainer.appendChild(titleLink);
            itemContainer.appendChild(info);
            content.appendChild(itemContainer);
        });

        // 底部按钮区域
        const footer = document.createElement('div');
        footer.style.cssText = `
            padding: 12px 24px;
            background: #f9f9f9;
            border-top: 1px solid #eee;
            text-align: right;
        `;

        const closeBtnFooter = document.createElement('button');
        closeBtnFooter.textContent = '关闭';
        closeBtnFooter.style.cssText = `
            padding: 8px 20px;
            border: none;
            border-radius: 4px;
            background: #3498db;
            color: white;
            cursor: pointer;
            transition: all 0.2s;
        `;
        closeBtnFooter.onmouseover = () => closeBtnFooter.style.background = '#2980b9';
        closeBtnFooter.onmouseout = () => closeBtnFooter.style.background = '#3498db';
        closeBtnFooter.onclick = () => overlay.remove();

        footer.appendChild(closeBtnFooter);

        // 组装界面
        container.appendChild(header);
        container.appendChild(content);
        container.appendChild(footer);
        overlay.appendChild(container);
        document.body.appendChild(overlay);
    }

    // 初始化计数器
    function initCounter() {
        createOrUpdateCounter();
    }

    // 注册油猴菜单命令
    GM_registerMenuCommand('关键词管理', createKeywordManagerUI);
    GM_registerMenuCommand('被屏蔽内容', showBlockedItems);

    // 页面加载完成后执行初始化
    window.addEventListener('load', () => {
        initCounter();
        blockContent();
    });

    // 监听页面动态内容变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                blockContent();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();