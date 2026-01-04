// ==UserScript==
// @name               一键查询社交网站
// @name:zh-CN         一键查询社交网站
// @name:en            Onekey Social Network Search
// @description        查询用户在不同社交平台的主页链接
// @description:zh-CN  查询用户在不同社交平台的主页链接
// @description:en     Query the homepage links of users on different social media platforms
// @namespace          https://www.runningcheese.com/userscripts
// @author             RunningCheese
// @version            1.3
// @match              https://space.bilibili.com/*
// @match              https://*.weibo.com/u/*
// @match              https://www.weibo.com/*
// @match              https://www.zhihu.com/people/*
// @match              https://www.douyin.com/user/*
// @match              https://www.douban.com/people/*
// @match              https://www.xiaohongshu.com/user/profile/*
// @match              https://mp.weixin.qq.com/s*
// @match              https://www.toutiao.com/c/user/*
// @match              https://tieba.baidu.com/f?kw=*
// @match              https://www.tiktok.com/@*
// @match              https://x.com/*
// @match              https://www.youtube.com/@*
// @match              https://www.reddit.com/user/*
// @match              https://www.pinterest.com/*/*
// @match              https://github.com/*
// @match              https://www.threads.com/*
// @match              https://www.facebook.com/*/
// @grant              none
// @icon              https://t1.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=32&url=https://weibo.com
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/531387/%E4%B8%80%E9%94%AE%E6%9F%A5%E8%AF%A2%E7%A4%BE%E4%BA%A4%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/531387/%E4%B8%80%E9%94%AE%E6%9F%A5%E8%AF%A2%E7%A4%BE%E4%BA%A4%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 平台用户名选择器映射
    const platformSelectors = {
        'space.bilibili.com': 'div[class*="nickname"]',
        'weibo.com/u/': 'div.ProfileHeader_name_1KbBs',
        'www.weibo.com/': 'div.ProfileHeader_name_1KbBs',
        'zhihu.com/people/': '.ProfileHeader-name',
        'douyin.com/user': '.arnSiSbK',
        'xiaohongshu.com/user': 'div[class*="user-name"], .user-name',
        'tieba.baidu.com/f?kw': '.card_title_fname',
        'douban.com/people/': '.info h1',
        'mp.weixin.qq.com/s': ['#js_name', '#js_ip_wording', '#publish_time'],
        'toutiao.com/c/user/': '.name',
        'tiktok.com/@': 'h1[data-e2e="user-title"]',
        'x.com/': 'div[data-testid="UserName"]',
        'twitter.com/': 'div[data-testid="UserName"]',
        'facebook.com/': '.html-h1',
        'reddit.com/user/': 'h1[class*="Header__username"]',
        'threads.com/@':  '.xcrlgei h1',
        'github.com/': '.p-name.vcard-fullname',
        'youtube.com': [
            '.yt-core-attributed-string--white-space-pre-wrap',
            '#channel-name #text',
            '#channel-header-container h1',
            '#channel-title',
            'ytd-channel-name yt-formatted-string'
        ]
    };


    // 创建浮动窗口
    const panel = document.createElement('div');
    panel.id = 'social-query-panel';
    panel.style.cssText = 'position:fixed;top:12%;left:45%;background:#fff;border:none;border-radius:8px;padding:4px;width:300px;box-shadow:0 4px 12px rgba(0,0,0,0.25);z-index:999999;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;display:none;';

    // 增强样式隔离性
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        #social-query-panel input[type="checkbox"] {
            appearance: auto !important;
        }
        .social-query-icon {
            cursor: pointer;
            margin-left: 5px;
            vertical-align: middle;
            opacity: 0.7;
            transition: opacity 0.2s;
            display: inline-flex;
            align-items: center;
        }
        .social-query-icon:hover {
            opacity: 1;
        }
    `;
    document.head.appendChild(styleElement);

    // 创建放大镜图标
    function createMagnifierIcon() {
        const icon = document.createElement('span');
        icon.className = 'social-query-icon';
        icon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="searchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#4285f4" />
                    <stop offset="100%" stop-color="#0066cc" />
                </linearGradient>
            </defs>
            <circle cx="11" cy="11" r="7" fill="white" stroke="url(#searchGradient)" stroke-width="4" />
            <line x1="20" y1="20" x2="16.5" y2="16.5" stroke="url(#searchGradient)" stroke-width="4" stroke-linecap="round" />
        </svg>`;
        icon.title = "查询社交平台";

        icon.addEventListener('click', function(e) {
            e.stopPropagation();
            panel.style.display = 'block';
            contentContainer.style.display = 'block';

            // 调整面板位置到图标附近
            const rect = icon.getBoundingClientRect();
            panel.style.top = (rect.bottom + window.scrollY + 10) + 'px';
            panel.style.left = (rect.left + window.scrollX - 150) + 'px';

            setTimeout(() => inputField.focus(), 100);
        });

        return icon;
    }

    // 根据不同平台添加图标
    function addMagnifierIcon() {
        const currentURL = window.location.href;
        let usernameElement = null;
        let usernameText = '';

        // 遍历选择器映射查找匹配的元素
        for (const [urlPart, selector] of Object.entries(platformSelectors)) {
            if (currentURL.includes(urlPart)) {
                if (Array.isArray(selector)) {
                    // 处理多个可能的选择器
                    for (const sel of selector) {
                        const element = document.querySelector(sel);
                        if (element && element.textContent.trim()) {
                            // 如果是微信公众号页面
                            if (urlPart === 'mp.weixin.qq.com/s') {
                                if (sel === '#js_name') {
                                    // 保存用户名文本
                                    usernameText = element.textContent.trim();
                                } else if (sel === '#js_ip_wording') {
                                    // 优先使用 #js_ip_wording 元素放置图标
                                    usernameElement = element;
                                } else if (sel === '#publish_time' && !usernameElement) {
                                    // 只有在没有找到 #js_ip_wording 时才使用 #publish_time
                                    usernameElement = element;
                                }
                            } else {
                                usernameElement = element;
                                break;
                            }
                        }
                    }
                    // 如果找到了用户名文本但没有找到放置图标的元素，继续查找
                    if (usernameText && !usernameElement) {
                        usernameElement = document.querySelector('#js_ip_wording') || document.querySelector('#publish_time');
                    }
                } else {
                    usernameElement = document.querySelector(selector);
                }
                break;
            }
        }

        // 如果找到用户名元素，将图标添加到其后面
        if (usernameElement && !usernameElement.querySelector('.social-query-icon')) {
            const icon = createMagnifierIcon();
            usernameElement.appendChild(icon);

            // 自动提取用户名
            if (usernameText) {
                // 如果有预先保存的用户名文本（来自 #js_name），使用它
                inputField.value = usernameText;
            } else {
                // 否则使用元素的文本内容
                inputField.value = usernameElement.textContent.trim();
            }
        }
    }

    // 创建标题栏
    const titleBar = document.createElement('div');
    titleBar.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:4px 10px;font-size:14px;color:#333;border-bottom:1px solid #eee;margin-bottom:2px;cursor:move;border-radius:8px 8px 0 0;';

    // 创建标题文本
    const titleText = document.createElement('span');
    titleText.textContent = '▼ 一键查询社交平台';
    titleText.style.cssText = 'flex:1;';
    titleBar.appendChild(titleText);

    // 创建关闭按钮
    const closeBtn = document.createElement('span');
    closeBtn.innerHTML='&#10005;';
    closeBtn.style.cssText = 'cursor:pointer;color:#999;width:20px;height:20px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:all 0.2s ease;margin-left:10px;';

    closeBtn.addEventListener('mouseover', () => closeBtn.style.backgroundColor = '#dadada');
    closeBtn.addEventListener('mouseout', () => closeBtn.style.backgroundColor = '');
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.style.display = 'none';
    });

    titleBar.appendChild(closeBtn);

    // 创建内容容器
    const contentContainer = document.createElement('div');
    contentContainer.style.cssText = 'display:block;'; // 默认展开

    // 拖动相关变量和事件
    let startX = 0, startY = 0, startLeft = 0, startTop = 0, isDragging = false;

    titleBar.addEventListener('mousedown', function(e) {
        if (e.target === closeBtn) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = parseInt(window.getComputedStyle(panel).left);
        startTop = parseInt(window.getComputedStyle(panel).top);
        e.preventDefault();
    });

    function mouseMoveHandler(e) {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        panel.style.left = (startLeft + deltaX) + 'px';
        panel.style.top = (startTop + deltaY) + 'px';
    }

    function mouseUpHandler() {
        isDragging = false;
    }

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);

    // 双击Esc关闭窗口
    let lastEscTime = 0;
    function escHandler(evt) {
        if (evt.key === 'Escape') {
            const now = Date.now();
            if (now - lastEscTime <= 300) {
                panel.style.display = 'none';
            }
            lastEscTime = now;
        }
    }
    document.addEventListener('keydown', escHandler);

    // 创建输入框
    const inputContainer = document.createElement('div');
    inputContainer.style.cssText = 'padding:8px 10px;display:flex;align-items:center;';

    const inputField = document.createElement('input');
    inputField.style.cssText = 'flex:1;padding:4px 8px;border:1px solid #ccc;border-radius:4px;font-size:14px;width:100%;';
    inputField.placeholder = '输入要查询的用户名';

    inputContainer.appendChild(inputField);

    // 社交平台列表
    const chinesePlatforms = [
        {title: '微博', url: 'https://s.weibo.com/weibo/'},
        {title: '抖音', url: 'https://www.douyin.com/search/'},
        {title: '哔哩哔哩', url: 'https://search.bilibili.com/all?keyword='},
        {title: '小红书', url: 'https://www.xiaohongshu.com/search_result?keyword='},
        {title: '知乎', url: 'https://www.zhihu.com/search?q='},
        {title: '豆瓣', url: 'https://www.douban.com/search?cat=1005&q='},
        {title: '公众号', url: 'https://weixin.sogou.com/weixin?type=2&query='},
        {title: '头条', url: 'https://so.toutiao.com/search?dvpf=pc&source=input&keyword='},
        {title: '贴吧', url: 'https://tieba.baidu.com/f?kw='}
    ];

    const foreignPlatforms = [
        {title: 'Twitter', url: 'https://x.com/search?q='},
        {title: 'TikTok', url: 'https://www.tiktok.com/search/user?q='},
        {title: 'YouTube', url: 'https://www.youtube.com/results?search_query='},
        {title: 'Instagram', url: 'https://www.instagram.com/explore/search/keyword/?q='},
        {title: 'Facebook', url: 'https://www.facebook.com/search/top/?q='},
        {title: 'Pinterest', url: 'https://www.pinterest.com/search/pins/?q='},
        {title: 'GitHub', url: 'https://github.com/search?type=users&q='},
        {title: 'Reddit', url: 'https://www.reddit.com/search/?q='},
        {title: 'Threads', url: 'https://www.threads.com/search?q='}
    ];

    // 创建平台区域标题和容器
    function createPlatformSection(title) {
        const sectionTitle = document.createElement('div');
        sectionTitle.style.cssText = 'padding:4px 10px;font-size:14px;color:#333;font-weight:bold;margin:5px 0 5px 0;';
        sectionTitle.textContent = title;

        const container = document.createElement('div');
        container.style.cssText = 'display:flex;flex-wrap:wrap;padding:10px;';

        return { title: sectionTitle, container };
    }

    const chineseSection = createPlatformSection('国内社交平台');
    const foreignSection = createPlatformSection('国外社交平台');

    // 添加复选框
    function createCheckboxItem(platform, container, isDefault = false) {
        const item = document.createElement('div');
        item.style.cssText = 'width:33.33%;padding:5px 5px 5px 1px;box-sizing:border-box;';

        const label = document.createElement('label');
        label.style.cssText = 'display:flex;align-items:center;font-size:13px;cursor:pointer;color:#333;white-space:nowrap;';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.url = platform.url;
        checkbox.style.marginRight = '5px';
        checkbox.checked = isDefault;

        // 阻止事件冒泡
        checkbox.addEventListener('mousedown', e => e.stopPropagation());
        label.addEventListener('mousedown', e => e.stopPropagation());

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(platform.title));
        item.appendChild(label);
        container.appendChild(item);
    }

    // 添加平台复选框
    chinesePlatforms.forEach(platform => {
        const isDefault = ['哔哩哔哩', '微博', '抖音'].includes(platform.title);
        createCheckboxItem(platform, chineseSection.container, isDefault);
    });

    foreignPlatforms.forEach(platform => {
        createCheckboxItem(platform, foreignSection.container);
    });

    // 添加按钮区域
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display:flex;justify-content:space-between;padding:10px;border-top:1px solid #eee;margin-top:10px;font-size:14px;';

    // 创建按钮函数
    function createButton(text, style, clickHandler) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = style;
        button.addEventListener('mousedown', e => e.stopPropagation());
        button.addEventListener('click', clickHandler);
        return button;
    }

    // 全选按钮
    const selectAllBtn = createButton(
        '全选',
        'padding:5px 10px;background:#f0f0f0;border:1px solid #ddd;border-radius:4px;cursor:pointer;',
        e => {
            e.stopPropagation();
            panel.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
        }
    );

    // 取消全选按钮
    const deselectAllBtn = createButton(
        '取消全选',
        'padding:5px 10px;background:#f0f0f0;border:1px solid #ddd;border-radius:4px;cursor:pointer;',
        e => {
            e.stopPropagation();
            panel.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        }
    );

    // 查询按钮
    const queryBtn = createButton(
        '查询',
        'padding:5px 15px;background:#4285f4;color:white;border:none;border-radius:4px;cursor:pointer;',
        e => {
            e.stopPropagation();
            const username = inputField.value.trim();
            if (!username) {
                alert('请输入用户名');
                return;
            }

            const selectedCheckboxes = panel.querySelectorAll('input[type="checkbox"]:checked');
            if (selectedCheckboxes.length === 0) {
                alert('请至少选择一个平台');
                return;
            }

            // 打开选中的平台
            selectedCheckboxes.forEach(checkbox => {
                window.open(checkbox.dataset.url + username);
            });
        }
    );

    buttonContainer.appendChild(selectAllBtn);
    buttonContainer.appendChild(deselectAllBtn);
    buttonContainer.appendChild(queryBtn);

    // 将所有内容添加到内容容器
    contentContainer.appendChild(inputContainer);
    contentContainer.appendChild(chineseSection.title);
    contentContainer.appendChild(chineseSection.container);
    contentContainer.appendChild(foreignSection.title);
    contentContainer.appendChild(foreignSection.container);
    contentContainer.appendChild(buttonContainer);

    // 组装面板
    panel.appendChild(titleBar);
    panel.appendChild(contentContainer);

    // 添加到页面
    document.body.appendChild(panel);

    // 添加点击页面其他区域关闭面板
    document.addEventListener('click', function(e) {
        if (!panel.contains(e.target) && !e.target.classList.contains('social-query-icon')) {
            panel.style.display = 'none';
        }
    });

    // 添加放大镜图标
    setTimeout(addMagnifierIcon, 1000);

    // 监听DOM变化，确保在动态加载的页面上也能添加图标
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                setTimeout(addMagnifierIcon, 500);
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();