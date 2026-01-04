// ==UserScript==
// @name         BlockXhihu
// @name:zh-CN   黑白名单过滤某乎首页推荐
// @version      1.0.0
// @author       Sh1hanmax
// @description  Block some fucking annoying content on Zhihu
// @match        *://www.zhihu.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_addStyle
// @run-at       document-start
// @namespace    https://greasyfork.org/scripts/4122051
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/524487/BlockXhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/524487/BlockXhihu.meta.js
// ==/UserScript==

// ref: https://github.com/XIU2/UserScript 知乎增强

'use strict';

// 默认正则表达式
const DEFAULT_ALLOW_REGEX = 'gpt|vllm|模型|ORPO|PPO|eepseek|rl|编码|attention|llm|gemm|rag|megatron|deepspeed|dp|动态规划';
const DEFAULT_BLOCK_REGEX = '$^';

// 初始化配置
function initConfig() {
    try {
        // 如果没有设置过屏蔽正则，则使用默认配置
        if (GM_getValue('blockRegex') === undefined) {
            GM_setValue('blockRegex', DEFAULT_BLOCK_REGEX);
            console.log('[知乎标题筛选] 初始化屏蔽正则表达式:', DEFAULT_BLOCK_REGEX);
        }

        // 如果没有设置过允许正则，则使用默认配置
        if (GM_getValue('allowRegex') === undefined) {
            GM_setValue('allowRegex', DEFAULT_ALLOW_REGEX);
            console.log('[知乎标题筛选] 初始化允许正则表达式:', DEFAULT_ALLOW_REGEX);
        }
    } catch (e) {
        console.error('[知乎标题筛选] 初始化配置失败:', e);
    }
}

// 获取保存的正则表达式
function getRegex(type) {
    try {
        return GM_getValue(type === 'allow' ? 'allowRegex' : 'blockRegex',
                          type === 'allow' ? DEFAULT_ALLOW_REGEX : DEFAULT_BLOCK_REGEX);
    } catch (e) {
        console.error(`[知乎标题筛选] 获取${type === 'allow' ? '允许' : '屏蔽'}正则表达式失败:`, e);
        return type === 'allow' ? DEFAULT_ALLOW_REGEX : DEFAULT_BLOCK_REGEX;
    }
}

// 设置正则表达式菜单
function setupRegexMenu() {
    try {
        // 允许正则表达式菜单
        GM_registerMenuCommand('设置允许正则表达式', () => {
            const currentRegex = getRegex('allow');
            const newRegex = prompt('请输入允许正则表达式\n(例如: .*(Python|编程).* 将只保留包含"Python"或"编程"的标题):', currentRegex);

            if (newRegex === null) return; // 用户取消

            try {
                new RegExp(newRegex);
                GM_setValue('allowRegex', newRegex);
                GM_notification({
                    text: '允许正则表达式已更新，刷新页面生效',
                    timeout: 3000,
                    onclick: () => location.reload()
                });
            } catch (e) {
                GM_notification({
                    text: '无效的正则表达式！',
                    timeout: 3000
                });
            }
        });

        // 屏蔽正则表达式菜单
        GM_registerMenuCommand('设置屏蔽正则表达式', () => {
            const currentRegex = getRegex('block');
            const newRegex = prompt('请输入屏蔽正则表达式\n(例如: .*(视频|直播).* 将屏蔽包含"视频"或"直播"的标题):', currentRegex);

            if (newRegex === null) return; // 用户取消

            try {
                new RegExp(newRegex);
                GM_setValue('blockRegex', newRegex);
                GM_notification({
                    text: '屏蔽正则表达式已更新，刷新页面生效',
                    timeout: 3000,
                    onclick: () => location.reload()
                });
            } catch (e) {
                GM_notification({
                    text: '无效的正则表达式！',
                    timeout: 3000
                });
            }
        });
    } catch (e) {
        console.error('[知乎标题筛选] 注册菜单命令失败:', e);
    }
}

// 使用正则表达式过滤标题
function filterByRegex(titles) {
    try {
        const allowRegex = new RegExp(getRegex('allow'), 'i');
        const blockRegex = new RegExp(getRegex('block'), 'i');

        console.log('[知乎标题筛选] 使用允许正则:', allowRegex);
        console.log('[知乎标题筛选] 使用屏蔽正则:', blockRegex);

        return titles.map(title => {
            const lowerTitle = title.toLowerCase();
            const isAllowed = allowRegex.test(lowerTitle);
            const isBlocked = blockRegex.test(lowerTitle);

            // 优先判断屏蔽规则，然后是允许规则
            if (isBlocked) {
                console.log('[知乎标题筛选] 屏蔽标题:', title);
                return false; // 命中屏蔽规则，隐藏
            }
            if (!isAllowed) {
                console.log('[知乎标题筛选] 不允许标题:', title);
            }
            return isAllowed; // 根据允许规则决定是否显示
        });
    } catch (e) {
        console.error('[知乎标题筛选] 正则匹配失败:', e);
        return titles.map(() => true); // 出错时默认显示所有内容
    }
}

// Mock API 响应
function mockFilterAPI(titles) {
    console.log('[知乎标题筛选] 准备过滤的标题列表:', titles);
    return new Promise((resolve) => {
        setTimeout(() => {
            const results = filterByRegex(titles);
            console.log('[知乎标题筛选] 正则匹配结果:', results);
            resolve(results);
        }, 100);
    });
}

// 获取标题文本
function getTitleText(item) {
    // 尝试多种可能的标题选择器
    const selectors = [
        'h2.ContentItem-title meta[itemprop="name"]',
        'meta[itemprop="headline"]',
        'h2.ContentItem-title a',
        '.ContentItem-title a',
        '.RichText[itemprop="text"]'
    ];

    for (const selector of selectors) {
        const el = item.querySelector(selector);
        if (el) {
            // 根据元素类型获取文本
            if (el.tagName === 'META') {
                return el.content;
            } else if (el.tagName === 'A') {
                return el.textContent.trim();
            } else {
                return el.innerText.trim();
            }
        }
    }

    console.warn('[知乎标题筛选] 未找到标题元素:', item);
    return '';
}

// 批量过滤标题
async function filterTitles(items) {
    console.log('[知乎标题筛选] 开始处理新的内容组, 数量:', items.length);

    // 提取所有标题
    const titles = items.map(item => getTitleText(item));
    console.log('[知乎标题筛选] 提取到的标题:', titles);

    // 调用过滤API
    const results = await mockFilterAPI(titles);

    // 根据API返回结果隐藏内容
    items.forEach((item, index) => {
        if (!results[index]) {
            item.classList.add('zhihu-filter-hidden');
            console.log('[知乎标题筛选] 已屏蔽:', titles[index]);

            // 获取标题和链接，添加到侧边栏
            const titleInfo = getTitleAndUrl(item);
            if (titleInfo) {
                addToSidebar(titleInfo.title, titleInfo.url);
            }
        } else {
            item.classList.remove('zhihu-filter-hidden');
            console.log('[知乎标题筛选] 已保留:', titles[index]);
        }
    });
}

// 等待首屏内容加载完成
function waitForContent() {
    return new Promise(resolve => {
        const maxAttempts = 50; // 最多等待5秒
        let attempts = 0;

        const check = () => {
            const items = document.querySelectorAll('.Card.TopstoryItem.TopstoryItem-isRecommend');
            if (items.length > 0) {
                // 确保内容已经完全加载
                const titles = Array.from(items).map(item => getTitleText(item));
                if (titles.every(title => title)) {
                    resolve(items);
                    return;
                }
            }

            attempts++;
            if (attempts >= maxAttempts) {
                console.warn('[知乎标题筛选] 等待内容加载超时');
                resolve(document.querySelectorAll('.Card.TopstoryItem.TopstoryItem-isRecommend'));
                return;
            }

            setTimeout(check, 100);
        };
        check();
    });
}

// 监听新内容加载
function observeNewContent() {
    console.log('[知乎标题筛选] 开始监听新内容加载');
    const observer = new MutationObserver(mutations => {
        const newItems = [];

        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== 1) continue;

                if (node.classList && node.classList.contains('TopstoryItem-isRecommend')) {
                    newItems.push(node);
                } else {
                    // 检查子元素
                    const items = node.querySelectorAll('.Card.TopstoryItem.TopstoryItem-isRecommend');
                    if (items.length > 0) {
                        newItems.push(...items);
                    }
                }
            }
        }

        if (newItems.length > 0) {
            console.log('[知乎标题筛选] 检测到新的推荐内容:', newItems.length, '条');
            filterTitles(newItems);
        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
        characterData: true
    });
}

// 主函数
async function main() {
    console.log('[知乎标题筛选] 脚本开始执行');

    // 检查必要的API是否可用
    if (typeof GM_getValue === 'undefined' ||
        typeof GM_setValue === 'undefined' ||
        typeof GM_registerMenuCommand === 'undefined' ||
        typeof GM_notification === 'undefined') {
        console.error('[知乎标题筛选] 必要的GM API未找到，脚本可能无法正常工作');
        return;
    }

    // 初始化配置
    initConfig();

    setupRegexMenu();

    if (location.pathname === '/') {
        console.log('[知乎标题筛选] 当前在首页，等待内容加载');

        // 等待首屏内容加载
        const items = await waitForContent();
        console.log('[知乎标题筛选] 找到已加载的内容:', items.length, '条');
        filterTitles(Array.from(items));

        // 监听后续内容
        observeNewContent();
    } else {
        console.log('[知乎标题筛选] 当前不在首页，不执行过滤');
    }
}

// URL变化时重新执行
function handleUrlChange() {
    console.log('[知乎标题筛选] URL发生变化');
    if (location.pathname === '/') {
        console.log('[知乎标题筛选] 切换到首页，准备重新执行');
        setTimeout(main, 500);
    }
}

// 添加自定义样式
GM_addStyle(`
    .zhihu-filter-hidden {
        display: none !important;
    }

    .zhihu-filter-sidebar-toggle {
        position: fixed;
        left: 24px;
        top: 0;
        height: 50px;
        padding: 0 16px;
        color: #8491a5;
        font-size: 15px;
        line-height: 50px;
        cursor: pointer;
        transition: color 0.25s ease-in;
        user-select: none;
        display: inline-block;
        background: #fff;
        z-index: 101;
    }

    .zhihu-filter-sidebar-toggle:hover {
        color: #191b1f;
    }

    .zhihu-filter-sidebar-toggle::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: #056de8;
        opacity: 0;
        transition: opacity 0.25s ease-in;
    }

    .zhihu-filter-sidebar-toggle.active {
        color: #191b1f;
    }

    .zhihu-filter-sidebar-toggle.active::after {
        opacity: 1;
    }

    .zhihu-filter-sidebar {
        position: fixed;
        left: 24px;
        top: 52px;
        width: 300px;
        height: calc(100vh - 52px);
        background: #fff;
        background: var(--GBK99A);
        border-radius: 2px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, .1);
        padding: 12px;
        overflow-y: auto;
        z-index: 100;
        font-size: 14px;
        transition: opacity 0.3s ease, transform 0.3s ease;
        opacity: 1;
        transform: translateX(0);
    }

    .zhihu-filter-sidebar.collapsed {
        opacity: 0;
        transform: translateX(-100%);
        pointer-events: none;
    }

    .zhihu-filter-input-container {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 8px 0;
        padding: 12px;
        background: #f6f6f6;
        border-radius: 4px;
    }

    .zhihu-filter-input {
        flex: 1;
        height: 32px;
        padding: 6px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        line-height: 20px;
    }

    .zhihu-filter-btn {
        height: 32px;
        width: 32px;
        padding: 0;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .zhihu-filter-allow-btn {
        background: #4CAF50;
    }

    .zhihu-filter-allow-btn:hover {
        background: #388E3C;
    }

    .zhihu-filter-block-btn {
        background: #F44336;
    }

    .zhihu-filter-block-btn:hover {
        background: #D32F2F;
    }

    .zhihu-filter-sidebar-item {
        padding: 8px 12px;
        margin-bottom: 8px;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.2s;
        color: #444;
        line-height: 1.6;
    }

    .zhihu-filter-sidebar-item:hover {
        background-color: #f6f6f6;
        color: #175199;
    }

    .zhihu-filter-sidebar-content {
        margin-top: 4px;
    }
`);

// 创建侧边栏
function createSidebar() {
    const sidebar = document.createElement('div');
    sidebar.className = 'zhihu-filter-sidebar';

    // 创建切换按钮
    const toggle = document.createElement('div');
    toggle.className = 'zhihu-filter-sidebar-toggle active';
    toggle.textContent = '内容筛选';

    // 直接添加到body
    document.body.appendChild(toggle);

    // 创建输入框容器
    const inputContainer = document.createElement('div');
    inputContainer.className = 'zhihu-filter-input-container';

    const input = document.createElement('input');
    input.className = 'zhihu-filter-input';
    input.placeholder = '输入关键词';

    const allowButton = document.createElement('button');
    allowButton.className = 'zhihu-filter-btn zhihu-filter-allow-btn';
    allowButton.textContent = '⊕';

    const blockButton = document.createElement('button');
    blockButton.className = 'zhihu-filter-btn zhihu-filter-block-btn';
    blockButton.textContent = '⊖';

    inputContainer.appendChild(input);
    inputContainer.appendChild(allowButton);
    inputContainer.appendChild(blockButton);

    // 创建内容区域
    const content = document.createElement('div');
    content.className = 'zhihu-filter-sidebar-content';

    sidebar.appendChild(inputContainer);
    sidebar.appendChild(content);

    // 更新切换按钮事件
    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        sidebar.classList.toggle('collapsed');
        toggle.classList.toggle('active');
    });

    // 按钮动画函数
    const showSuccessAnimation = (button, originalText) => {
        button.textContent = '✓';
        setTimeout(() => {
            button.textContent = originalText;
        }, 1000);
    };

    // 添加Allow按钮事件
    allowButton.addEventListener('click', () => {
        const keyword = input.value.trim();
        if (keyword) {
            const currentAllowRegex = getRegex('allow');
            const newAllowRegex = currentAllowRegex ? `${currentAllowRegex}|${keyword}` : keyword;
            GM_setValue('allowRegex', newAllowRegex);
            input.value = '';
            showSuccessAnimation(allowButton, '⊕');
        }
    });

    // 添加Block按钮事件
    blockButton.addEventListener('click', () => {
        const keyword = input.value.trim();
        if (keyword) {
            const currentBlockRegex = getRegex('block');
            const newBlockRegex = currentBlockRegex ? `${currentBlockRegex}|${keyword}` : keyword;
            GM_setValue('blockRegex', newBlockRegex);
            input.value = '';
            showSuccessAnimation(blockButton, '⊖');
        }
    });

    // 添加输入框回车事件
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            allowButton.click(); // 默认回车触发允许按钮
        }
    });

    document.body.appendChild(sidebar);
    return sidebar;
}

// 添加被屏蔽的标题到侧边栏
function addToSidebar(title, url) {
    const sidebar = document.querySelector('.zhihu-filter-sidebar') || createSidebar();
    const content = sidebar.querySelector('.zhihu-filter-sidebar-content');

    // 检查是否已存在相同的标题
    if (content.querySelector(`[data-url="${url}"]`)) {
        return;
    }

    const item = document.createElement('div');
    item.className = 'zhihu-filter-sidebar-item';
    item.setAttribute('data-url', url);
    item.textContent = title;
    item.title = title; // 添加完整标题作为提示

    item.addEventListener('click', () => {
        window.open(url, '_blank');
    });

    content.appendChild(item);
}

// 获取标题和链接
function getTitleAndUrl(item) {
    const titleElement = item.querySelector('h2.ContentItem-title a, .ContentItem-title a');
    if (!titleElement) return null;

    return {
        title: titleElement.textContent.trim(),
        url: titleElement.href
    };
}

// 监听 URL 变化
if (window.onurlchange === undefined) {
    // 如果浏览器不支持 onurlchange，使用 pushState 和 replaceState 的重写来监听
    history.pushState = ( f => function pushState(){
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('urlchange'));
        return ret;
    })(history.pushState);

    history.replaceState = ( f => function replaceState(){
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('urlchange'));
        return ret;
    })(history.replaceState);

    window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('urlchange'));
    });
}

// 监听 URL 变化事件
window.addEventListener('urlchange', handleUrlChange);

// 等待 DOM 加载完成后执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}