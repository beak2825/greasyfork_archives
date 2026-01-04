// ==UserScript==
// @name               公众号阅读助手
// @name:zh-CN         公众号阅读助手
// @name:en            Wechat Article Menu
// @description        微信公众号文章菜单选项，展示一些有用的选项
// @description:zh-CN  微信公众号文章菜单选项，展示一些有用的选项
// @description:en     Wechat Article Menu, Show Some Useful Options
// @namespace          https://www.runningcheese.com
// @version            1.7
// @author             RunningCheese
// @match              https://mp.weixin.qq.com/s/*
// @match              https://mp.weixin.qq.com/s?*
// @run-at             document-start
// @icon               https://t1.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://mp.weixin.qq.com
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/461342/%E5%85%AC%E4%BC%97%E5%8F%B7%E9%98%85%E8%AF%BB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/461342/%E5%85%AC%E4%BC%97%E5%8F%B7%E9%98%85%E8%AF%BB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 小书签代码开始
    (function() {
    'use strict';

    // 创建浮动窗口
    const panel = document.createElement('div');
    panel.id = 'wx-reader-panel';
    panel.style.cssText = 'position:fixed;top:12%;left:20%;background:#fff;border:none;border-radius:8px;padding:4px;width:200px;box-shadow:0 4px 12px rgba(0,0,0,0.25);z-index:999999;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;display:none;';

    // 增强样式隔离性
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .wx-reader-icon {
            cursor: pointer;
            margin-left: 5px;
            vertical-align: middle;
            opacity: 0.7;
            transition: opacity 0.2s;
            display: inline-flex;
            align-items: center;
        }
        .wx-reader-icon:hover {
            opacity: 1;
        }
    `;
    document.head.appendChild(styleElement);

    // 创建工具图标
    function createToolIcon() {
        const icon = document.createElement('span');
        icon.className = 'wx-reader-icon';
        icon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="toolGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#1E88E5" />
                    <stop offset="100%" stop-color="#1565C0" />
                </linearGradient>
            </defs>
            <rect x="2" y="2" width="20" height="20" rx="4" ry="4" fill="url(#toolGradient)"/>
            <path d="M6 9h12v1.5H6V9zm0 3h12v1.5H6V12zm0 3h12v1.5H6V15z" fill="white"/>
        </svg>`;
        icon.title = "微信阅读助手";

        icon.addEventListener('click', function(e) {
            e.stopPropagation();
            panel.style.display = 'block';

            // 调整面板位置到图标附近
            const rect = icon.getBoundingClientRect();
            panel.style.top = (rect.bottom + window.scrollY + 10) + 'px';
            panel.style.left = (rect.left + window.scrollX - 100) + 'px';
        });

        return icon;
    }

    // 添加图标到页面
    function addToolIcon() {
        // 微信公众号文章页面的选择器
        const selectors = ['#js_ip_wording', '#publish_time', '#js_author_name', '.rich_media_meta_list'];

        let targetElement = null;

        // 查找合适的元素放置图标
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                targetElement = element;
                break;
            }
        }

        // 如果找到目标元素，添加图标
        if (targetElement && !targetElement.querySelector('.wx-reader-icon')) {
            const icon = createToolIcon();
            targetElement.appendChild(icon);
        }
    }

    // 创建标题栏
    const titleBar = document.createElement('div');
    titleBar.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:4px 10px;font-size:14px;color:#333;border-bottom:1px solid #eee;margin-bottom:2px;cursor:move;border-radius:8px 8px 0 0;';

    // 创建标题文本
    const titleText = document.createElement('span');
    titleText.textContent = '▼ 微信阅读助手';
    titleText.style.cssText = 'flex:1;';
    titleBar.appendChild(titleText);

    // 创建关闭按钮
    const closeBtn = document.createElement('span');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = 'cursor:pointer;color:#999;width:20px;height:20px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:all 0.2s ease;margin-left:10px;';

    closeBtn.addEventListener('mouseover', () => closeBtn.style.backgroundColor = '#dadada');
    closeBtn.addEventListener('mouseout', () => closeBtn.style.backgroundColor = '');
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.style.display = 'none';
    });

    titleBar.appendChild(closeBtn);

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
    document.addEventListener('keydown', function(evt) {
        if (evt.key === 'Escape') {
            const now = Date.now();
            if (now - lastEscTime <= 300) {
                panel.style.display = 'none';
            }
            lastEscTime = now;
        }
    });

    // 功能菜单项
    const menuItems = [
        {title: '1、原始链接', code: 'prompt(\'原始链接：\', \'https://mp.weixin.qq.com/s?__biz=\'+biz+\'&idx=1&mid=\'+mid+\'&sn=\'+sn)'},
        {title: '2、文章摘要', code: 'summary = document.querySelector(\'meta[name="description"]\').content; prompt(\'文章摘要：\',summary)'},
        {title: '3、文章封面', code: 'const cover = document.querySelector(\'meta[property="twitter:image"]\').content; window.open(cover, "_blank");'},
        {title: '4、历史消息链接', code: 'prompt(\'历史消息链接：\',\'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=\'+biz+\'#wechat_redirect\')'},
        {title: '5、查看所有图片', code: 'const images = Array.from(document.querySelectorAll("img")).filter(img => (img.src || img.dataset.src) && !(img.src && img.src.startsWith("data:image/svg+xml")) && !(img.dataset.src && img.dataset.src.startsWith("data:image/svg+xml"))); if(images.length === 0) { alert("未找到图片"); return; } const win = window.open("", "_blank"); win.document.write("<html><head><title>网页所有图片</title><style>body{margin:20px auto;font-family:sans-serif;max-width:700px;}img{max-width:100%;margin:10px 0;border:1px solid #eee;padding:5px;}</style></head><body><h2>网页所有图片("+images.length+"张)</h2>"); images.forEach((img, i) => { const src = img.src || img.dataset.src; win.document.write(`<p>${i+1}.</p><img src="${src}" />`); }); win.document.write("</body></html>"); win.document.close();'}
    ];

    // 创建菜单项
    menuItems.forEach((item) => {
        const menuItem = document.createElement('div');
        menuItem.style.cssText = 'cursor:pointer;padding:4px 10px;transition:all 0.2s ease;border-radius:6px;font-size:14px;color:#333;display:flex;align-items:center';
        menuItem.textContent = item.title;

        menuItem.onmouseover = () => menuItem.style.backgroundColor = '#dadada';
        menuItem.onmouseout = () => menuItem.style.backgroundColor = '';

        if (item.code) {
            menuItem.onclick = (e) => {
                e.preventDefault();
                try {
                    const func = new Function(`return (function(){${item.code}})();`);
                    func();
                } catch (err) {
                    console.error('执行代码时出错:', err);
                }
            };
        }

        panel.appendChild(menuItem);
    });

    // 添加到页面 - 将标题栏放在最上面
    panel.insertBefore(titleBar, panel.firstChild);
    document.body.appendChild(panel);

    // 添加点击页面其他区域关闭面板
    document.addEventListener('click', function(e) {
        if (!panel.contains(e.target) && !e.target.classList.contains('wx-reader-icon')) {
            panel.style.display = 'none';
        }
    });

    // 添加工具图标
    setTimeout(addToolIcon, 1000);

    // 监听DOM变化，确保在动态加载的页面上也能添加图标
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                setTimeout(addToolIcon, 500);
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
    // 小书签代码结束
})();