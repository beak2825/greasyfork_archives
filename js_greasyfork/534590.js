// ==UserScript==
// @name         B站评论过滤器
// @namespace    https://github.com/cmyyx/bili-comment-filter
// @version      0.1.1
// @description  根据关键词和正则表达式过滤B站评论区的评论
// @author       Trae AI, 璨梦踏月
// @match        *://*.bilibili.com/video/*
// @match        *://www.bilibili.com/read/*
// @match        *://t.bilibili.com/*
// @match        *://www.bilibili.com/opus/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/534590/B%E7%AB%99%E8%AF%84%E8%AE%BA%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/534590/B%E7%AB%99%E8%AF%84%E8%AE%BA%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储过滤规则
    const FILTER_KEY = 'bili_comment_filter_rules';
    let filterRules = GM_getValue(FILTER_KEY, { keywords: [], regexps: [], hideComments: false, completelyHide: false });

    // 保存过滤规则到本地存储
    function saveFilterRules() {
        GM_setValue(FILTER_KEY, filterRules);
    }

    // 创建过滤器设置面板
    function createFilterPanel() {
        // 如果已存在面板则显示
        const existingPanel = document.getElementById('bili-comment-filter-panel');
        if (existingPanel) {
            existingPanel.style.display = 'block';
            return;
        }

        // 创建面板容器
        const panel = document.createElement('div');
        panel.id = 'bili-comment-filter-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            max-height: 500px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            padding: 20px;
            display: flex;
            flex-direction: column;
            font-family: 'Microsoft YaHei', sans-serif;
        `;

        // 创建标题
        const title = document.createElement('h2');
        title.textContent = 'B站评论过滤器设置';
        title.style.cssText = `
            margin: 0 0 15px 0;
            color: #fb7299;
            font-size: 18px;
            text-align: center;
        `;
        panel.appendChild(title);

        // 创建关闭按钮
        const closeBtn = document.createElement('div');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 15px;
            cursor: pointer;
            font-size: 20px;
            color: #999;
        `;
        closeBtn.onclick = function() {
            panel.style.display = 'none';
        };
        panel.appendChild(closeBtn);

        // 创建选项卡
        const tabContainer = document.createElement('div');
        tabContainer.style.cssText = `
            display: flex;
            margin-bottom: 15px;
            border-bottom: 1px solid #eee;
        `;

        const keywordTab = document.createElement('div');
        keywordTab.textContent = '关键词';
        keywordTab.className = 'filter-tab active';
        keywordTab.dataset.tab = 'keyword';

        const regexpTab = document.createElement('div');
        regexpTab.textContent = '正则表达式';
        regexpTab.className = 'filter-tab';
        regexpTab.dataset.tab = 'regexp';

        const tabStyle = `
            padding: 8px 15px;
            cursor: pointer;
            margin-right: 5px;
            border-radius: 5px 5px 0 0;
        `;

        keywordTab.style.cssText = tabStyle + 'background-color: #fb7299; color: white;';
        regexpTab.style.cssText = tabStyle + 'background-color: #f4f4f4; color: #666;';

        tabContainer.appendChild(keywordTab);
        tabContainer.appendChild(regexpTab);
        panel.appendChild(tabContainer);

        // 创建内容区域
        const contentContainer = document.createElement('div');
        contentContainer.style.cssText = `
            flex: 1;
            overflow-y: auto;
            margin-bottom: 15px;
        `;
        panel.appendChild(contentContainer);

        // 创建关键词内容
        const keywordContent = document.createElement('div');
        keywordContent.className = 'tab-content';
        keywordContent.dataset.content = 'keyword';
        keywordContent.style.display = 'block';

        // 创建正则表达式内容
        const regexpContent = document.createElement('div');
        regexpContent.className = 'tab-content';
        regexpContent.dataset.content = 'regexp';
        regexpContent.style.display = 'none';

        contentContainer.appendChild(keywordContent);
        contentContainer.appendChild(regexpContent);

        // 添加选项卡切换功能
        [keywordTab, regexpTab].forEach(tab => {
            tab.addEventListener('click', function() {
                // 更新选项卡样式
                document.querySelectorAll('.filter-tab').forEach(t => {
                    t.classList.remove('active');
                    t.style.backgroundColor = '#f4f4f4';
                    t.style.color = '#666';
                });
                this.classList.add('active');
                this.style.backgroundColor = '#fb7299';
                this.style.color = 'white';

                // 显示对应内容
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.style.display = 'none';
                });
                const contentId = this.dataset.tab;
                document.querySelector(`.tab-content[data-content="${contentId}"]`).style.display = 'block';
            });
        });

        // 渲染过滤规则列表
        function renderFilterRules() {
            // 清空内容
            keywordContent.innerHTML = '';
            regexpContent.innerHTML = '';

            // 渲染关键词列表
            filterRules.keywords.forEach((keyword, index) => {
                const item = createFilterItem(keyword, index, 'keyword');
                keywordContent.appendChild(item);
            });

            // 渲染正则表达式列表
            filterRules.regexps.forEach((regexp, index) => {
                const item = createFilterItem(regexp, index, 'regexp');
                regexpContent.appendChild(item);
            });

            // 添加空状态提示
            if (filterRules.keywords.length === 0) {
                const emptyTip = document.createElement('div');
                emptyTip.textContent = '暂无关键词过滤规则';
                emptyTip.style.cssText = 'text-align: center; color: #999; padding: 20px;';
                keywordContent.appendChild(emptyTip);
            }

            if (filterRules.regexps.length === 0) {
                const emptyTip = document.createElement('div');
                emptyTip.textContent = '暂无正则表达式过滤规则';
                emptyTip.style.cssText = 'text-align: center; color: #999; padding: 20px;';
                regexpContent.appendChild(emptyTip);
            }
        }

        // 创建过滤规则项
        function createFilterItem(text, index, type) {
            const item = document.createElement('div');
            item.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 10px;
                border-bottom: 1px solid #eee;
                background-color: #f9f9f9;
                margin-bottom: 5px;
                border-radius: 4px;
            `;

            const textSpan = document.createElement('span');
            textSpan.textContent = text;
            textSpan.style.cssText = `
                flex: 1;
                word-break: break-all;
            `;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '删除';
            deleteBtn.style.cssText = `
                background-color: #fb7299;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 3px 8px;
                cursor: pointer;
                margin-left: 10px;
                font-size: 12px;
            `;

            deleteBtn.onclick = () => {
                if (type === 'keyword') {
                    filterRules.keywords.splice(index, 1);
                } else {
                    filterRules.regexps.splice(index, 1);
                }
                saveFilterRules();
                renderFilterRules();
                applyFilters(); // 重新应用过滤
            };

            item.appendChild(textSpan);
            item.appendChild(deleteBtn);

            return item;
        }

        // 创建添加规则区域
        const addContainer = document.createElement('div');
        addContainer.style.cssText = `
            display: flex;
            margin-top: 10px;
        `;

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '输入要添加的过滤规则';
        input.style.cssText = `
            flex: 1;
            padding: 8px 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-right: 10px;
        `;

        const addBtn = document.createElement('button');
        addBtn.textContent = '添加';
        addBtn.style.cssText = `
            background-color: #fb7299;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 15px;
            cursor: pointer;
        `;

        addBtn.onclick = () => {
            const value = input.value.trim();
            if (!value) return;

            // 判断当前选中的是哪个选项卡
            const activeTab = document.querySelector('.filter-tab.active') || keywordTab;
            const type = activeTab.dataset.tab;

            if (type === 'keyword') {
                // 检查是否已存在
                if (!filterRules.keywords.includes(value)) {
                    filterRules.keywords.push(value);
                    saveFilterRules();
                    renderFilterRules();
                    applyFilters(); // 重新应用过滤
                }
            } else if (type === 'regexp') {
                try {
                    // 验证正则表达式是否有效
                    new RegExp(value);
                    if (!filterRules.regexps.includes(value)) {
                        filterRules.regexps.push(value);
                        saveFilterRules();
                        renderFilterRules();
                        applyFilters(); // 重新应用过滤
                    }
                } catch (e) {
                    alert('无效的正则表达式!');
                }
            }

            input.value = '';
        };

        // 回车键添加
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addBtn.click();
            }
        });

        addContainer.appendChild(input);
        addContainer.appendChild(addBtn);
        panel.appendChild(addContainer);

        // 创建过滤模式设置区域
        const settingsContainer = document.createElement('div');
        settingsContainer.style.cssText = `
            margin-top: 15px;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 4px;
            border: 1px solid #eee;
        `;
        
        const settingsTitle = document.createElement('div');
        settingsTitle.textContent = '过滤设置';
        settingsTitle.style.cssText = `
            font-weight: bold;
            margin-bottom: 10px;
            color: #fb7299;
        `;
        settingsContainer.appendChild(settingsTitle);
        
        // 创建隐藏评论选项
        const hideOptionContainer = document.createElement('div');
        hideOptionContainer.style.cssText = `
            display: flex;
            align-items: center;
            margin-bottom: 5px;
        `;
        
        const hideCheckbox = document.createElement('input');
        hideCheckbox.type = 'checkbox';
        hideCheckbox.id = 'hide-comments-checkbox';
        hideCheckbox.checked = filterRules.hideComments;
        hideCheckbox.style.cssText = `
            margin-right: 8px;
        `;
        
        const hideLabel = document.createElement('label');
        hideLabel.htmlFor = 'hide-comments-checkbox';
        hideLabel.textContent = '直接隐藏评论（而非模糊显示）';
        hideLabel.style.cssText = `
            cursor: pointer;
            user-select: none;
        `;
        
        hideCheckbox.addEventListener('change', () => {
            filterRules.hideComments = hideCheckbox.checked;
            // 如果取消隐藏，则同时取消完全隐藏
            if (!filterRules.hideComments) {
                filterRules.completelyHide = false;
                completelyHideCheckbox.checked = false;
            }
            completelyHideCheckbox.disabled = !filterRules.hideComments;
            completelyHideLabel.style.color = filterRules.hideComments ? '#555' : '#bbb'; // 灰色表示禁用
            saveFilterRules();
            applyFilters(); // 重新应用过滤
        });

        hideOptionContainer.appendChild(hideCheckbox);
        hideOptionContainer.appendChild(hideLabel);
        settingsContainer.appendChild(hideOptionContainer);

        // 创建完全隐藏评论选项 (嵌套在隐藏选项下)
        const completelyHideOptionContainer = document.createElement('div');
        completelyHideOptionContainer.style.cssText = `
            display: flex; /* 始终显示 */
            align-items: center;
            margin-bottom: 5px;
            margin-left: 20px; /* 缩进以表示从属关系 */
        `;

        const completelyHideCheckbox = document.createElement('input');
        completelyHideCheckbox.type = 'checkbox';
        completelyHideCheckbox.id = 'completely-hide-comments-checkbox';
        completelyHideCheckbox.checked = filterRules.completelyHide;
        completelyHideCheckbox.style.cssText = `
            margin-right: 8px;
        `;

        const completelyHideLabel = document.createElement('label');
        completelyHideLabel.htmlFor = 'completely-hide-comments-checkbox';
        completelyHideLabel.textContent = '完全隐藏（不显示占位符）';
        completelyHideLabel.style.cssText = `
            cursor: pointer;
            user-select: none;
            font-size: 13px; /* 稍小字体 */
            color: #555;
        `;

        completelyHideCheckbox.addEventListener('change', () => {
            if (completelyHideCheckbox.disabled) return; // 禁用时不允许更改
            filterRules.completelyHide = completelyHideCheckbox.checked;
            saveFilterRules();
            applyFilters(); // 重新应用过滤
        });

        // 点击禁用状态的完全隐藏选项时提示
        completelyHideOptionContainer.addEventListener('click', (e) => {
            if (completelyHideCheckbox.disabled && e.target !== completelyHideCheckbox) { // 避免重复触发checkbox的change事件
                alert('请先勾选“直接隐藏评论”选项');
            }
        });

        // 初始化完全隐藏选项的状态
        completelyHideCheckbox.disabled = !filterRules.hideComments;
        completelyHideLabel.style.color = filterRules.hideComments ? '#555' : '#bbb';

        completelyHideOptionContainer.appendChild(completelyHideCheckbox);
        completelyHideOptionContainer.appendChild(completelyHideLabel);
        // 将完全隐藏选项添加到设置容器中，位于隐藏选项之后
        settingsContainer.appendChild(completelyHideOptionContainer);

        // 将设置容器添加到主面板
        panel.appendChild(settingsContainer);
        
        // 移除重复添加的代码
        // panel.appendChild(settingsContainer); // 这行是多余的，已在上面添加
        // hideOptionContainer.appendChild(hideLabel); // 这行也是多余的，已在hideOptionContainer内部添加
        // settingsContainer.appendChild(hideOptionContainer); // 这行也是多余的，已在上面添加
        
        // 初始化渲染
        renderFilterRules();

        // 将面板添加到页面
        document.body.appendChild(panel);

        // 添加样式以标记活动选项卡
        const style = document.createElement('style');
        style.textContent = `
            .filter-tab.active {
                background-color: #fb7299 !important;
                color: white !important;
            }
        `;
        document.head.appendChild(style);

        // 初始化选项卡状态
        keywordTab.classList.add('active');
    }

    // 注册菜单命令
    GM_registerMenuCommand('B站评论过滤器设置', createFilterPanel);

    // 检查文本是否应该被过滤
    function shouldFilter(text) {
        console.log('正在检查文本:', text);
        console.log('当前过滤规则:', filterRules);
        
        // 检查关键词
        for (const keyword of filterRules.keywords) {
            if (text.includes(keyword)) {
                console.log('匹配到关键词:', keyword);
                return true;
            }
        }

        // 检查正则表达式
        for (const regexpStr of filterRules.regexps) {
            try {
                const regexp = new RegExp(regexpStr);
                console.log('正在尝试正则表达式:', regexpStr);
                if (regexp.test(text)) {
                    console.log('正则表达式匹配成功:', regexpStr);
                    return true;
                }
            } catch (e) {
                console.error('无效的正则表达式:', regexpStr, e);
            }
        }

        console.log('文本未匹配任何规则');
        return false;
    }

    // 应用过滤器到评论
    function applyFilters() {
        // 查找评论元素 - 支持多层Shadow DOM
        let commentItems = [];
        let threadElements = [];
        // 获取评论元素
        const commentApp = document.querySelector('#commentapp > bili-comments');
        if (commentApp && commentApp.shadowRoot) {
            // 获取主评论
            const threads = commentApp.shadowRoot.querySelectorAll('#feed > bili-comment-thread-renderer');
            threads.forEach(thread => {
                if (thread.shadowRoot) {
                    threadElements.push(thread); // 记录主评论节点
                    // 主评论内容
                    const comment = thread.shadowRoot.querySelector('#comment');
                    if (comment && comment.shadowRoot) {
                        const richText = comment.shadowRoot.querySelector('#content > bili-rich-text');
                        if (richText && richText.shadowRoot) {
                            const span = richText.shadowRoot.querySelector('#contents > span');
                            if (span) {
                                commentItems.push({span, thread, container: comment});
                            }
                        }
                    }
                    
                    // 回复评论
                    const replies = thread.shadowRoot.querySelector('#replies > bili-comment-replies-renderer');
                    if (replies && replies.shadowRoot) {
                        // 已展开的回复
                        const replyItems = replies.shadowRoot.querySelectorAll('#expander-contents > bili-comment-reply-renderer');
                        replyItems.forEach(reply => {
                            if (reply.shadowRoot) {
                                const replyContent = reply.shadowRoot.querySelector('#main > bili-rich-text');
                                if (replyContent && replyContent.shadowRoot) {
                                    const replySpan = replyContent.shadowRoot.querySelector('#contents > span');
                                    if (replySpan) {
                                        commentItems.push({span: replySpan, thread: reply, container: reply});
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }
        
        // 处理评论过滤 - 根据设置决定是隐藏评论还是模糊显示
        commentItems.forEach(({span, thread, container}) => {
            const commentText = span.textContent || '';
            if (shouldFilter(commentText)) {
                // 为每个评论元素创建唯一ID
                if (!thread.dataset.filterId) {
                    thread.dataset.filterId = 'filter-' + Math.random().toString(36).substr(2, 9);
                }
                
                // 保存原始样式
                if (!thread.dataset.originalStyle) {
                    thread.dataset.originalStyle = 'true';
                    thread.dataset.originalDisplay = thread.style.display || '';
                    thread.dataset.originalOpacity = thread.style.opacity || '1';
                    thread.dataset.originalFilter = thread.style.filter || 'none';
                }
                
                // 如果用户已经点击查看过，则不再应用过滤效果
                if (thread.dataset.userViewed === 'true') {
                    thread.style.display = thread.dataset.originalDisplay;
                    thread.style.opacity = thread.dataset.originalOpacity || '1';
                    thread.style.filter = thread.dataset.originalFilter || 'none';
                    return;
                }
                
                // 根据设置决定是隐藏、完全隐藏还是模糊显示
                if (filterRules.hideComments) {
                    thread.style.display = 'none'; // 隐藏评论本身
                    // 检查是否需要完全隐藏（无占位符）
                    if (!filterRules.completelyHide) {
                        // 检查占位符是否已存在 (更精确地检查父节点下)
                        const placeholderExists = thread.parentNode && thread.parentNode.querySelector(`.bili-filter-placeholder[data-filter-id="${thread.dataset.filterId}"]`);
                        if (!placeholderExists) {
                            const placeholder = document.createElement('div');
                            placeholder.className = 'bili-filter-placeholder';
                            placeholder.dataset.filterId = thread.dataset.filterId;
                            placeholder.style.cssText = `
                                padding: 10px;
                                margin: 5px 0;
                                background-color: rgba(251, 114, 153, 0.05);
                                border: 1px dashed rgba(251, 114, 153, 0.3);
                                border-radius: 4px;
                                color: #fb7299;
                                text-align: center;
                                cursor: pointer;
                            `;
                            placeholder.textContent = '已过滤评论，点击查看';

                            // 添加点击事件，显示原评论
                            placeholder.addEventListener('click', function() {
                                if (thread.dataset.filterId) {
                                    thread.style.display = thread.dataset.originalDisplay;
                                    thread.style.opacity = thread.dataset.originalOpacity || '1';
                                    thread.style.filter = thread.dataset.originalFilter || 'none';
                                    thread.dataset.userViewed = 'true';
                                    this.remove(); // 移除占位符
                                }
                            });

                            // 插入到评论前面
                            if (thread.parentNode) {
                                thread.parentNode.insertBefore(placeholder, thread);
                            }
                        }
                    } else {
                        // 如果是完全隐藏，确保移除可能存在的占位符
                        const existingPlaceholder = thread.parentNode && thread.parentNode.querySelector(`.bili-filter-placeholder[data-filter-id="${thread.dataset.filterId}"]`);
                        if (existingPlaceholder) {
                            existingPlaceholder.remove();
                        }
                    }
                } else {
                    // 应用模糊效果 或 恢复正常显示 (如果之前是隐藏)
                    thread.style.display = thread.dataset.originalDisplay;
                    thread.style.opacity = thread.dataset.originalOpacity || '1'; // 恢复原始透明度
                    thread.style.filter = 'blur(3px)'; // 应用模糊
                    thread.style.cursor = 'pointer'; // 鼠标悬停时显示手型光标

                    // 移除可能存在的占位符 (从隐藏切换到模糊时)
                    const existingPlaceholder = thread.parentNode && thread.parentNode.querySelector(`.bili-filter-placeholder[data-filter-id="${thread.dataset.filterId}"]`);
                    if (existingPlaceholder) {
                        existingPlaceholder.remove();
                    }

                    // 添加提示文本（仅对模糊显示的评论）
                    // 检查容器内是否已有提示
                    let hint = container.querySelector(`.bili-filter-hint[data-filter-id="${thread.dataset.filterId}"]`);
                    if (!hint) {
                        hint = document.createElement('div');
                        hint.className = 'bili-filter-hint';
                        hint.dataset.filterId = thread.dataset.filterId;
                        hint.style.cssText = `
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            background: rgba(251, 114, 153, 0.1);
                            color: #fb7299;
                            padding: 5px 10px;
                            border-radius: 4px;
                            font-size: 14px;
                            pointer-events: none; /* 确保提示不拦截点击 */
                            z-index: 1000;
                            text-align: center;
                            display: none; /* 默认隐藏 */
                        `;
                        hint.textContent = '已过滤，悬停查看';

                        // 确保父元素(container)有相对定位
                        if (window.getComputedStyle(container).position === 'static') {
                            container.style.position = 'relative';
                        }
                        // 确保提示在容器内
                        container.style.overflow = 'hidden'; // 可选
                        container.appendChild(hint);
                    }

                    // 添加鼠标悬停和移出事件 (确保事件监听器只添加一次到 thread)
                    if (!thread.dataset.filterHoverHandler) {
                        thread.dataset.filterHoverHandler = 'true';

                        thread.addEventListener('mouseenter', function() {
                            // 用户未点击查看过才响应悬停
                            if (this.dataset.userViewed !== 'true' && this.style.filter.includes('blur')) {
                                this.style.opacity = this.dataset.originalOpacity || '1';
                                this.style.filter = this.dataset.originalFilter || 'none';
                                const currentHint = container.querySelector(`.bili-filter-hint[data-filter-id="${this.dataset.filterId}"]`);
                                if (currentHint) currentHint.style.display = 'none'; // 悬停时隐藏提示
                            }
                        });

                        thread.addEventListener('mouseleave', function() {
                            // 用户未点击查看过才考虑恢复模糊
                            if (this.dataset.userViewed !== 'true' && !this.style.filter.includes('blur')) {
                                // 重新检查是否仍需过滤
                                const commentText = span.textContent || ''; // 从闭包中获取span
                                if (shouldFilter(commentText)) { // 检查当前规则
                                    this.style.opacity = '0.6';
                                    this.style.filter = 'blur(3px)';
                                    // 提示逻辑可以根据需要调整
                                    // const currentHint = container.querySelector(`.bili-filter-hint[data-filter-id="${this.dataset.filterId}"]`);
                                    // if (currentHint) currentHint.style.display = 'block';
                                }
                            }
                        });
                    }
                }
            } else {
                // 如果不需要过滤，恢复原始样式
                if (thread.dataset.originalStyle) {
                    thread.style.display = thread.dataset.originalDisplay;
                    thread.style.opacity = thread.dataset.originalOpacity || '1';
                    thread.style.filter = thread.dataset.originalFilter || 'none';
                    thread.style.cursor = ''; // 恢复默认光标
                }

                // 移除提示文本和占位符 (确保移除)
                if (thread.dataset.filterId) {
                    // 移除模糊提示 (从container移除)
                    const hint = container.querySelector(`.bili-filter-hint[data-filter-id="${thread.dataset.filterId}"]`);
                    if (hint) hint.remove();
                    // 移除隐藏占位符 (从thread的父节点移除)
                    const placeholder = thread.parentNode && thread.parentNode.querySelector(`.bili-filter-placeholder[data-filter-id="${thread.dataset.filterId}"]`);
                    if (placeholder) placeholder.remove();
                }
                // 如果评论不再需要过滤，重置相关状态
                delete thread.dataset.userViewed;
                // 检查并移除thread上的监听器标记和样式
                if (thread.dataset.filterHoverHandler) {
                    delete thread.dataset.filterHoverHandler;
                    thread.style.cursor = ''; // 恢复默认光标
                }
            }
        });
        
        // 返回处理的评论数量，用于调试
        return commentItems.length;
    }

    // 创建观察器以监视DOM变化
    function createObserver() {
        // 主DOM观察器 - 监视常规DOM变化
        const mainObserver = new MutationObserver((mutations) => {
            let shouldApply = false;
            
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // 检查是否添加了评论元素
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否是B站评论组件
                            if (node.tagName && node.tagName.toLowerCase().includes('bili-')) {
                                shouldApply = true;
                                // 如果是B站组件，尝试观察其Shadow DOM
                                observeShadowDOM(node);
                                break;
                            }
                            
                            // 检查常规评论类名
                            if (node.classList && (
                                node.classList.contains('reply-item') ||
                                node.classList.contains('comment-item') ||
                                node.classList.contains('list-item') ||
                                node.classList.contains('reply-wrap') ||
                                node.classList.contains('comment-wrap')
                            )) {
                                shouldApply = true;
                                break;
                            }
                            
                            // 检查子元素
                            const commentItems = node.querySelectorAll('.reply-item, .comment-item, .list-item, .reply-wrap, .comment-wrap');
                            if (commentItems.length > 0) {
                                shouldApply = true;
                                break;
                            }
                            
                            // 检查B站组件
                            const biliComponents = node.querySelectorAll('bili-comment-list, bili-comments, bili-comment-thread-renderer, bili-comment-renderer, bili-comment-reply-renderer');
                            if (biliComponents.length > 0) {
                                shouldApply = true;
                                // 为每个B站组件添加Shadow DOM观察器
                                biliComponents.forEach(comp => observeShadowDOM(comp));
                                break;
                            }
                        }
                    }
                }
                
                if (shouldApply) break;
            }
            
            if (shouldApply) {
                setTimeout(applyFilters, 100); // 短暂延迟以确保DOM完全更新
            }
        });

        // 监视整个文档的变化
        mainObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // 观察Shadow DOM的函数
        function observeShadowDOM(element) {
            // 如果元素已经有shadowRoot，直接观察
            if (element.shadowRoot) {
                observeShadowRoot(element.shadowRoot, element);
            }
            
            // 监听shadowRoot的创建
            const originalAttachShadow = element.attachShadow;
            if (originalAttachShadow && !element._attachShadowMonitored) {
                element._attachShadowMonitored = true;
                element.attachShadow = function() {
                    const shadowRoot = originalAttachShadow.apply(this, arguments);
                    observeShadowRoot(shadowRoot, this);
                    return shadowRoot;
                };
            }
        }
        
        // 观察特定shadowRoot的函数
        function observeShadowRoot(shadowRoot, element) {
            // 创建Shadow DOM观察器
            const shadowObserver = new MutationObserver((mutations) => {
                let hasChanges = false;
                
                for (const mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        hasChanges = true;
                        
                        // 检查新添加的节点是否有Shadow DOM
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                // 递归观察新添加节点的Shadow DOM
                                if (node.tagName && node.tagName.toLowerCase().includes('bili-')) {
                                    observeShadowDOM(node);
                                }
                            }
                        }
                    }
                }
                
                if (hasChanges) {
                    setTimeout(applyFilters, 100); // 短暂延迟以确保DOM完全更新
                }
            });
            
            // 观察Shadow DOM的变化
            shadowObserver.observe(shadowRoot, {
                childList: true,
                subtree: true
            });
            
            // 立即检查现有的bili组件
            const biliComponents = shadowRoot.querySelectorAll('bili-comment-list, bili-comments, bili-comment-thread-renderer, bili-comment-renderer, bili-comment-reply-renderer');
            biliComponents.forEach(comp => observeShadowDOM(comp));
        }
        
        // 初始扫描页面上已存在的bili组件
        const initialBiliComponents = document.querySelectorAll('bili-comment-list, bili-comments, bili-comment-thread-renderer, bili-comment-renderer, bili-comment-reply-renderer');
        initialBiliComponents.forEach(comp => observeShadowDOM(comp));

        return mainObserver;
    }

    // 初始化函数
    function init() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', onDOMReady);
        } else {
            onDOMReady();
        }
    }

    // DOM加载完成后执行
    function onDOMReady() {
        // 创建观察器
        const observer = createObserver();
        
        // 初始应用过滤器 - 使用多次检查策略确保评论加载后被过滤
        const initialCheckTimes = [500, 1500, 3000, 6000];
        initialCheckTimes.forEach(delay => {
            setTimeout(applyFilters, delay);
        });
        
        // 添加定期检查（页面加载后2分钟内每10秒检查一次）
        let checkCount = 0;
        const intervalId = setInterval(() => {
            applyFilters();
            checkCount++;
            if (checkCount >= 12) clearInterval(intervalId); // 2分钟后停止
        }, 10000);
        
        // 使用IntersectionObserver替代滚动事件，提高性能
        const intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    applyFilters();
                }
            });
        }, {
            rootMargin: '200px', // 提前200px开始观察
            threshold: 0.1 // 当10%的元素可见时触发
        });
        
        // 监听页面底部区域
        function observeBottomArea() {
            const commentApp = document.querySelector('#commentapp');
            if (commentApp) {
                intersectionObserver.observe(commentApp);
            }
            
            // 定期检查并观察新出现的评论区域
            setTimeout(() => {
                const commentElements = document.querySelectorAll('.comment-container, .reply-list, #comment-list');
                commentElements.forEach(el => intersectionObserver.observe(el));
            }, 2000);
        }
        observeBottomArea();
        
        // 监听页面动态加载的内容，包括各种交互按钮
        document.addEventListener('click', (e) => {
            // 监听各种可能触发评论加载的按钮
            let target = e.target;
            for (let i = 0; i < 5 && target; i++) {
                if (target.tagName === 'BUTTON' || target.tagName === 'A' || 
                    (target.getAttribute && target.getAttribute('role') === 'button')) {
                    const text = target.textContent || target.innerText || '';
                    if (/更多|查看|展开|收起|下一页|上一页|回复|评论|点击|加载/.test(text)) {
                        // 使用多次延迟检查，确保动态加载的内容被过滤
                        setTimeout(applyFilters, 300);
                        setTimeout(applyFilters, 800);
                        setTimeout(applyFilters, 1500);
                        break;
                    }
                }
                target = target.parentElement;
            }
            
            // 监听回复展开和其他可能的交互元素
            const interactiveSelectors = [
                '.reply-expander', '.expand-btn', '.reply-btn', '.comment-btn', 
                '.load-more', '.show-more', '.view-more', '.btn-more'
            ];
            
            for (const selector of interactiveSelectors) {
                if ((e.target.matches && e.target.matches(selector)) || 
                    (e.target.closest && e.target.closest(selector))) {
                    // 使用多次延迟检查
                    setTimeout(applyFilters, 300);
                    setTimeout(applyFilters, 800);
                    setTimeout(applyFilters, 1500);
                    break;
                }
            }
        });
        
        // 特别监听B站"查看更多"按钮
        function monitorViewMoreButtons() {
            // 使用定时器定期检查是否存在"查看更多"按钮和分页按钮
            setInterval(() => {
                try {
                    // 尝试获取评论区的查看更多按钮
                    const commentApp = document.querySelector('#commentapp > bili-comments');
                    if (commentApp && commentApp.shadowRoot) {
                        const threads = commentApp.shadowRoot.querySelectorAll('#feed > bili-comment-thread-renderer');
                        threads.forEach(thread => {
                            if (thread.shadowRoot) {
                                const replies = thread.shadowRoot.querySelector('#replies > bili-comment-replies-renderer');
                                if (replies && replies.shadowRoot) {
                                    // 监听查看更多按钮
                                    const viewMoreBtn = replies.shadowRoot.querySelector('#view-more > bili-text-button');
                                    if (viewMoreBtn && !viewMoreBtn.dataset.filterMonitored) {
                                        // 标记已监听，避免重复添加
                                        viewMoreBtn.dataset.filterMonitored = 'true';
                                        viewMoreBtn.addEventListener('click', () => {
                                            // 立即触发一次过滤
                                            setTimeout(applyFilters, 100);
                                            // 再延迟触发几次，确保新加载的内容被过滤
                                            setTimeout(applyFilters, 500);
                                            setTimeout(applyFilters, 1000);
                                        });
                                    }
                                    
                                    // 监听分页区域的按钮
                                    const paginationBody = replies.shadowRoot.querySelector('#pagination-body');
                                    if (paginationBody && !paginationBody.dataset.filterMonitored) {
                                        paginationBody.dataset.filterMonitored = 'true';
                                        paginationBody.addEventListener('click', (e) => {
                                            // 使用多次延迟过滤确保分页后的内容被过滤
                                            setTimeout(applyFilters, 100);
                                            setTimeout(applyFilters, 500);
                                            setTimeout(applyFilters, 1000);
                                        });
                                    }
                                    
                                    // 监听底部的查看更多按钮
                                    const paginationFoot = replies.shadowRoot.querySelector('#pagination-foot > bili-text-button');
                                    if (paginationFoot && paginationFoot.shadowRoot) {
                                        const footButton = paginationFoot.shadowRoot.querySelector('button');
                                        if (footButton && !footButton.dataset.filterMonitored) {
                                            footButton.dataset.filterMonitored = 'true';
                                            footButton.addEventListener('click', () => {
                                                // 使用多次延迟过滤确保加载的内容被过滤
                                                setTimeout(applyFilters, 100);
                                                setTimeout(applyFilters, 500);
                                                setTimeout(applyFilters, 1000);
                                            });
                                        }
                                    }
                                }
                            }
                        });
                    }
                } catch (e) {
                    console.error('监听评论区按钮时出错:', e);
                }
            }, 2000); // 每2秒检查一次
            
        }
        monitorViewMoreButtons();
        
        // 监听键盘事件，可能是用户发表评论
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                // 可能是发送评论的快捷键
                setTimeout(() => {
                    applyFilters();
                }, 1000);
            }
        });
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .bili-comment-mask {
                user-select: none;
                overflow: hidden;
                z-index: 9999 !important;
                pointer-events: auto !important;
                display: flex !important;
            }
        `;
        document.head.appendChild(style);
        
        // 定期清理不再存在的评论对应的遮罩
        setInterval(() => {
            const masks = document.querySelectorAll('.bili-comment-mask');
            masks.forEach(mask => {
                const filterId = mask.dataset.filterId;
                if (filterId) {
                    // 检查对应的评论元素是否还存在
                    const commentElement = document.querySelector(`[data-filter-id="${filterId}"]`);
                    if (!commentElement) {
                        // 如果评论元素不存在，移除遮罩
                        mask.remove();
                    }
                }
            });
        }, 30000); // 每30秒清理一次
    }
    // 启动脚本
    init();
})();