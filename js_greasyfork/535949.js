// ==UserScript==
// @name            [银河奶牛]聊天输入框功能增强
// @name:en         [MWI]Chat Input Box Enhancement
// @namespace       https://cnb.cool/shenhuanjie/skyner-cn/tamper-monkey-script/mwi-chat-input-plus
// @description     这是一个用于增强游戏聊天输入框功能的用户脚本。它提供了一些实用的功能，如用户名自动补全、加强命令提示等。
// @description:en  This is a user script for enhancing the game chat input box functionality. It provides some useful features such as username auto-completion and enhanced command prompts.
// @version         0.0.1
// @author          shenhuanjie
// @license         MIT
// @homepage        https://greasyfork.org/scripts/535885
// @supportURL      https://greasyfork.org/scripts/535885
// @match           https://www.milkywayidle.com/*
// @icon            https://www.milkywayidle.com/favicon.svg
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/535949/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E8%81%8A%E5%A4%A9%E8%BE%93%E5%85%A5%E6%A1%86%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/535949/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E8%81%8A%E5%A4%A9%E8%BE%93%E5%85%A5%E6%A1%86%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 日志工具
    const logger = {
        debug: (...args) => console.debug('[Chat Input Plus]', ...args),
        info: (...args) => console.info('[Chat Input Plus]', ...args),
        warn: (...args) => console.warn('[Chat Input Plus]', ...args),
        error: (...args) => console.error('[Chat Input Plus]', ...args)
    };

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 配置参数
    const config = {
        // 输入框选择器 - 使用更精确的选择器
        inputSelector: 'input[class*="Chat_chatInput"][type="text"]',
        // 用户列表（实际使用时可替换为API获取）
        users: ['张三', '李四', '王五', '赵六', '管理员'],
        // 命令列表
        commands: [
            { name: '/w', description: '私聊' },
            { name: '/proform', description: '格式化代码' },
            { name: '/help', description: '显示帮助' },
            { name: '/clear', description: '清空聊天' }
        ],
        // 样式类名
        classes: {
            suggestionBox: 'chat-input-plus-suggestions',
            suggestionItem: 'chat-input-plus-suggestion-item',
            highlighted: 'chat-input-plus-highlighted'
        },
        // 防抖延迟（毫秒）
        debounceDelay: 150
    };

    // 添加样式 (优化版)
    GM_addStyle(`
        .${config.classes.suggestionBox} {
            position: absolute;
            z-index: 999999;
            background: #20212f;
            border: 1px solid #3a3b4d;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            max-height: 240px;
            overflow-y: auto;
            display: none;
            color: #e0e0e0;
            font-family: inherit;
            font-size: 14px;
        }

        .${config.classes.suggestionItem} {
            padding: 10px 16px;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            border-bottom: 1px solid #3a3b4d;
        }

        .${config.classes.suggestionItem}:last-child {
            border-bottom: none;
        }

        .${config.classes.suggestionItem}:hover,
        .${config.classes.suggestionItem}.${config.classes.highlighted} {
            background-color: #3a3b4d;
            color: #ffffff;
        }

        .${config.classes.suggestionBox} .highlight {
            color: #6c8ae8;
            font-weight: bold;
        }

        /* 滚动条样式 */
        .${config.classes.suggestionBox}::-webkit-scrollbar {
            width: 8px;
        }

        .${config.classes.suggestionBox}::-webkit-scrollbar-thumb {
            background: #3a3b4d;
            border-radius: 4px;
        }

        .${config.classes.suggestionBox}::-webkit-scrollbar-track {
            background: #20212f;
        }
    `);

    // 存储当前状态
    let state = {
        activeInput: null,
        suggestionBox: null,
        suggestionItems: [],
        triggerChar: '',
        query: '',
        queryStartIndex: 0
    };

    // 创建建议框
    function createSuggestionBox() {
        try {
            // 检查是否已存在
            if (state.suggestionBox) {
                return state.suggestionBox;
            }
            
            const box = document.createElement('div');
            box.className = config.classes.suggestionBox;
            document.body.appendChild(box);
            
            logger.debug('建议框已创建');
            return box;
        } catch (error) {
            logger.error('创建建议框失败:', error);
            return null;
        }
    }

    // 显示建议列表
    function showSuggestions(items, inputRect, queryStartIndex, triggerChar, query) {
        try {
            if (!items || !items.length) {
                logger.debug('建议列表为空');
                hideSuggestions();
                return;
            }

            if (!state.suggestionBox) {
                state.suggestionBox = createSuggestionBox();
            }

            // 清空现有项
            state.suggestionBox.innerHTML = '';
            state.suggestionItems = [];

            // 存储状态
            state.triggerChar = triggerChar;
            state.query = query;
            state.queryStartIndex = queryStartIndex;

            // 创建建议列表容器
            const listContainer = document.createElement('div');
            listContainer.setAttribute('role', 'listbox');
            listContainer.setAttribute('aria-label', triggerChar === '@' ? '用户列表' : '命令列表');

            // 添加建议项
            items.forEach((item, index) => {
                const itemEl = document.createElement('div');
                itemEl.className = config.classes.suggestionItem;
                itemEl.setAttribute('role', 'option');
                itemEl.setAttribute('aria-selected', 'false');
                itemEl.setAttribute('tabindex', '-1');

                if (typeof item === 'string') {
                    // 用户
                    itemEl.textContent = item;
                    itemEl.dataset.value = item;
                    itemEl.setAttribute('aria-label', `用户: ${item}`);
                } else {
                    // 命令
                    itemEl.innerHTML = `<strong>${item.name}</strong> - ${item.description}`;
                    itemEl.dataset.value = item.name;
                    itemEl.setAttribute('aria-label', `命令: ${item.name}, ${item.description}`);
                }

                // 高亮匹配部分
                if (query) {
                    try {
                        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
                        itemEl.innerHTML = itemEl.innerHTML.replace(regex, '<span class="highlight">$1</span>');
                    } catch (error) {
                        logger.warn('高亮匹配文本失败:', error);
                    }
                }

                // 点击选择
                itemEl.addEventListener('click', () => {
                    insertSuggestion(itemEl.dataset.value);
                });

                // 鼠标悬停
                itemEl.addEventListener('mouseenter', () => {
                    clearHighlight();
                    itemEl.classList.add(config.classes.highlighted);
                    itemEl.setAttribute('aria-selected', 'true');
                });

                listContainer.appendChild(itemEl);
                state.suggestionItems.push(itemEl);
            });

            // 确保建议框在DOM最外层
            document.body.appendChild(state.suggestionBox);
            state.suggestionBox.appendChild(listContainer);

            // 定位和显示建议框
            positionSuggestionBox(inputRect);
            state.suggestionBox.style.display = 'block';
            state.suggestionBox.style.zIndex = '999999'; // 确保在最前
            
            console.log('建议框显示状态:', {
                display: window.getComputedStyle(state.suggestionBox).display,
                visibility: window.getComputedStyle(state.suggestionBox).visibility,
                opacity: window.getComputedStyle(state.suggestionBox).opacity
            });

            // 高亮第一个
            if (state.suggestionItems.length > 0) {
                highlightItem(0);
            }

            logger.debug(`显示${items.length}个建议项`);
            console.log('建议框DOM:', state.suggestionBox);
        } catch (error) {
            logger.error('显示建议列表失败:', error);
            hideSuggestions();
        }
    }

    // 定位建议框，确保在视口内
    function positionSuggestionBox(inputRect) {
        if (!state.suggestionBox) return;

        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const padding = 4; // 与视口边缘的最小间距

        // 临时显示建议框以获取其尺寸
        const originalDisplay = state.suggestionBox.style.display;
        state.suggestionBox.style.display = 'block';
        state.suggestionBox.style.visibility = 'hidden';

        const boxHeight = state.suggestionBox.offsetHeight;
        const boxWidth = Math.min(inputRect.width, viewportWidth - 2 * padding);

        // 计算建议框的位置
        let top = inputRect.bottom + window.scrollY + padding;
        let left = inputRect.left + window.scrollX;

        // 检查是否会超出底部
        if (top + boxHeight > viewportHeight + window.scrollY - padding) {
            // 如果超出底部，显示在输入框上方
            top = inputRect.top + window.scrollY - boxHeight - padding;
        }

        // 检查是否会超出右侧
        if (left + boxWidth > viewportWidth + window.scrollX - padding) {
            left = viewportWidth + window.scrollX - boxWidth - padding;
        }

        // 确保不会超出左侧
        if (left < window.scrollX + padding) {
            left = window.scrollX + padding;
        }

        // 恢复显示状态并设置位置
        state.suggestionBox.style.visibility = '';
        state.suggestionBox.style.display = originalDisplay;
        state.suggestionBox.style.top = `${Math.max(window.scrollY + padding, top)}px`;
        state.suggestionBox.style.left = `${left}px`;
        state.suggestionBox.style.width = `${boxWidth}px`;
    }

    // 隐藏建议列表
    function hideSuggestions() {
        if (state.suggestionBox) {
            state.suggestionBox.style.display = 'none';
        }
        state.triggerChar = '';
        state.query = '';
    }

    // 插入建议内容
    function insertSuggestion(value) {
        if (!state.activeInput) return;

        const input = state.activeInput;
        const start = state.queryStartIndex;
        const end = input.selectionStart;
        const textBefore = input.value.substring(0, start);
        const textAfter = input.value.substring(end);

        // 构建新内容
        let newValue = textBefore + value;
        // 如果是命令，添加空格
        if (state.triggerChar === '/') {
            newValue += ' ';
        }
        newValue += textAfter;

        // 设置新内容
        input.value = newValue;

        // 设置光标位置
        const cursorPos = textBefore.length + value.length + (state.triggerChar === '/' ? 1 : 0);
        input.focus();
        input.setSelectionRange(cursorPos, cursorPos);

        // 隐藏建议框
        hideSuggestions();
    }

    // 高亮建议项
    function highlightItem(index) {
        try {
            clearHighlight();
            
            if (index >= 0 && index < state.suggestionItems.length) {
                const item = state.suggestionItems[index];
                item.classList.add(config.classes.highlighted);
                item.setAttribute('aria-selected', 'true');
                item.scrollIntoView({ block: 'nearest' });
                
                // 更新状态
                state.highlightedIndex = index;
                
                logger.debug(`高亮建议项: 索引=${index}, 内容=${item.textContent}`);
            }
        } catch (error) {
            logger.error('高亮建议项失败:', error);
        }
    }

    // 清除所有高亮
    function clearHighlight() {
        try {
            state.suggestionItems.forEach(item => {
                item.classList.remove(config.classes.highlighted);
                item.setAttribute('aria-selected', 'false');
            });
            state.highlightedIndex = -1;
        } catch (error) {
            logger.error('清除高亮失败:', error);
        }
    }

    // 获取当前查询
    function getCurrentQuery(inputValue, cursorPos) {
        // 查找最近的@或/
        for (let i = cursorPos - 1; i >= 0; i--) {
            const char = inputValue[i];
            if (char === '@' || char === '/') {
                const query = inputValue.substring(i + 1, cursorPos);
                return { triggerChar: char, query, startIndex: i };
            } else if (/\s/.test(char)) {
                // 遇到空格停止
                break;
            }
        }
        return null;
    }

    // 转义正则表达式特殊字符
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // 监听输入事件（使用防抖）
    const handleInputEvent = debounce(function(e) {
        try {
            const input = e.target;
            console.log('检测到输入事件，输入内容:', input.value); // 调试日志
            
            if (!input.matches(config.inputSelector)) {
                console.log('输入框不匹配选择器'); // 调试日志
                return;
            }

            state.activeInput = input;
            const cursorPos = input.selectionStart;
            console.log('光标位置:', cursorPos); // 调试日志
            
            const queryInfo = getCurrentQuery(input.value, cursorPos);
            console.log('查询信息:', JSON.stringify(queryInfo)); // 调试日志

            if (queryInfo) {
                const { triggerChar, query, startIndex } = queryInfo;
                const inputRect = input.getBoundingClientRect();
                console.log('触发字符:', triggerChar, '查询:', query); // 调试日志

                // 根据触发字符显示不同的建议
                let filteredItems = [];
                if (triggerChar === '@') {
                    filteredItems = config.users.filter(user =>
                        user.toLowerCase().includes(query.toLowerCase())
                    );
                    console.log('过滤后的用户:', filteredItems); // 调试日志
                } else if (triggerChar === '/') {
                    filteredItems = config.commands.filter(cmd =>
                        cmd.name.toLowerCase().includes(query.toLowerCase())
                    );
                    console.log('过滤后的命令:', filteredItems); // 调试日志
                }

                if (filteredItems.length > 0) {
                    console.log('准备显示建议列表'); // 调试日志
                    showSuggestions(filteredItems, inputRect, startIndex, triggerChar, query);
                    // 通知屏幕阅读器
                    announceToScreenReader(`找到${filteredItems.length}个${triggerChar === '@' ? '用户' : '命令'}建议`);
                    
                    // 保存查询起始位置用于插入建议
                    state.queryStartIndex = startIndex;
                } else {
                    console.log('没有匹配的建议'); // 调试日志
                    hideSuggestions();
                    announceToScreenReader('没有找到匹配的建议');
                }
            } else {
                console.log('未检测到有效查询'); // 调试日志
                hideSuggestions();
            }
        } catch (error) {
            console.error('处理输入事件出错:', error); // 调试日志
            logger.error('处理输入事件失败:', error);
            hideSuggestions();
        }
    }, config.debounceDelay);

    // 监听键盘事件
    function handleKeydownEvent(e) {
        try {
            if (!state.suggestionBox || state.suggestionBox.style.display !== 'block') {
                return;
            }

            const key = e.key;
            let handled = false;

            // 获取当前高亮索引
            const currentIndex = state.suggestionItems.findIndex(item =>
                item.classList.contains(config.classes.highlighted)
            );
            
            switch (key) {
                case 'ArrowDown':
                    // 向下箭头
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % state.suggestionItems.length;
                    highlightItem(nextIndex);
                    handled = true;
                    break;
                    
                case 'ArrowUp':
                    // 向上箭头
                    e.preventDefault();
                    const prevIndex = (currentIndex - 1 + state.suggestionItems.length) % state.suggestionItems.length;
                    highlightItem(prevIndex);
                    handled = true;
                    break;
                    
                case 'Tab':
                case 'Enter':
                    // Tab或Enter选择当前高亮项
                    e.preventDefault();
                    const selectedItem = state.suggestionItems.find(item =>
                        item.classList.contains(config.classes.highlighted)
                    );
                    if (selectedItem) {
                        insertSuggestion(selectedItem.dataset.value);
                        announceToScreenReader(`已选择: ${selectedItem.getAttribute('aria-label') || selectedItem.textContent}`);
                    }
                    handled = true;
                    break;
                    
                case 'Escape':
                    // Esc关闭建议框
                    e.preventDefault();
                    hideSuggestions();
                    announceToScreenReader('已关闭建议列表');
                    handled = true;
                    break;
                    
                case 'Home':
                    // Home键跳到第一项
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        highlightItem(0);
                        handled = true;
                    }
                    break;
                    
                case 'End':
                    // End键跳到最后一项
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        highlightItem(state.suggestionItems.length - 1);
                        handled = true;
                    }
                    break;
            }

            if (handled) {
                e.stopPropagation();
                logger.debug(`键盘导航: 键=${key}, 当前索引=${currentIndex}`);
            }
        } catch (error) {
            logger.error('处理键盘事件失败:', error);
            hideSuggestions();
        }
    }

    // 向屏幕阅读器发送通知
    function announceToScreenReader(message) {
        try {
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.style.position = 'absolute';
            announcement.style.width = '1px';
            announcement.style.height = '1px';
            announcement.style.padding = '0';
            announcement.style.margin = '-1px';
            announcement.style.overflow = 'hidden';
            announcement.style.clip = 'rect(0, 0, 0, 0)';
            announcement.style.whiteSpace = 'nowrap';
            announcement.style.border = '0';
            announcement.textContent = message;
            
            document.body.appendChild(announcement);
            setTimeout(() => {
                announcement.remove();
            }, 1000);
            
            logger.debug(`屏幕阅读器通知: ${message}`);
        } catch (error) {
            logger.error('发送屏幕阅读器通知失败:', error);
        }
    }

    // 监听点击事件
    function handleClickEvent(e) {
        // 如果点击在建议框外部，隐藏建议框
        if (state.suggestionBox &&
            state.suggestionBox.style.display === 'block' &&
            !state.suggestionBox.contains(e.target) &&
            e.target !== state.activeInput) {
            hideSuggestions();
        }
    }

    // 监听输入框焦点变化
    function handleFocusEvent(e) {
        if (e.target.matches(config.inputSelector)) {
            state.activeInput = e.target;
        } else if (e.target === document) {
            state.activeInput = null;
            hideSuggestions();
        }
    }

    // 初始化
    function init() {
        // 监听输入事件
        document.addEventListener('input', handleInputEvent);

        // 监听键盘事件
        document.addEventListener('keydown', handleKeydownEvent);

        // 监听点击事件
        document.addEventListener('click', handleClickEvent);

    // 监听焦点事件（新增焦点丢失处理）
        document.addEventListener('focusin', handleFocusEvent);
        document.addEventListener('focusout', (e) => {
            if (state.suggestionBox && state.suggestionBox.style.display === 'block') {
                const relatedTarget = e.relatedTarget;
                if (!state.suggestionBox.contains(relatedTarget) && relatedTarget !== state.activeInput) {
                    hideSuggestions();
                }
            }
        });

        console.log('聊天输入增强脚本已启动');
    }

    // 当DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();