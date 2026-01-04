// ==UserScript==
// @name               网易云音乐助手
// @description        网易云音乐助手，展示一些有用的选项
// @namespace          https://www.runningcheese.com/userscripts
// @version            1.1
// @author             RunningCheese
// @match              https://music.163.com/*
// @run-at             document-start
// @icon               https://t1.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://music.163.com
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/531392/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/531392/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 小书签代码开始
    (function() {
    'use strict';

    // 创建浮动窗口
    const panel = document.createElement('div');
    panel.id = 'netease-music-panel';
    panel.style.cssText = 'position:fixed;top:12%;left:20%;background:#fff;border:none;border-radius:8px;padding:4px;width:200px;box-shadow:0 4px 12px rgba(0,0,0,0.25);z-index:999999;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;display:none;';

    // 增强样式隔离性
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .netease-music-icon {
            cursor: pointer;
            margin-left: 5px;
            vertical-align: middle;
            opacity: 0.7;
            transition: opacity 0.2s;
            display: inline-flex;
            align-items: center;
        }
        .netease-music-icon:hover {
            opacity: 1;
        }
    `;
    document.head.appendChild(styleElement);

    // 创建工具图标
    function createToolIcon() {
        const icon = document.createElement('span');
        icon.className = 'netease-music-icon';
        icon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="toolGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#C20C0C" />
                    <stop offset="100%" stop-color="#A40000" />
                </linearGradient>
            </defs>
            <rect x="2" y="2" width="20" height="20" rx="4" ry="4" fill="url(#toolGradient)"/>
            <path d="M6 9h12v1.5H6V9zm0 3h12v1.5H6V12zm0 3h12v1.5H6V15z" fill="white"/>
        </svg>`;
        icon.title = "网易云音乐下载助手";

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
        // 网易云音乐页面的选择器
        const selector = '.tit';

        let targetElement = null;

        // 查找合适的元素放置图标
        const element = document.querySelector(selector);
        if (element) {
            targetElement = element;
        }

        // 如果找到目标元素，添加图标
        if (targetElement && !targetElement.querySelector('.netease-music-icon')) {
            const icon = createToolIcon();
            targetElement.appendChild(icon);
        }
    }

    // 创建标题栏
    const titleBar = document.createElement('div');
    titleBar.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:4px 10px;font-size:14px;color:#333;border-bottom:1px solid #eee;margin-bottom:2px;cursor:move;background:#f5f5f5;border-radius:8px 8px 0 0;';

    // 创建标题文本
    const titleText = document.createElement('span');
    titleText.textContent = '▼ 网易云音乐助手';
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
        {title: '1、歌曲信息', code: 'const songTitle = document.querySelector(".tit").innerText; const artist = document.querySelector(".des span") ? document.querySelector(".des span").innerText : "未知歌手"; prompt("歌曲信息：", `${songTitle} - ${artist}`);'},
        {title: '2、查看封面', code: 'const coverImg = document.querySelector(".j-img") || document.querySelector(".u-cover img"); if(coverImg) { const coverUrl = coverImg.src.replace(/\\?param=\\d+y\\d+$/, ""); window.open(coverUrl, "_blank"); } else { alert("未找到封面图片"); }'},
        {title: '3、查看歌词', code: 'const songId = location.href.match(/id=(\\d+)/)[1]; fetch(`https://music.163.com/api/song/lyric?id=${songId}&lv=1&kv=1&tv=-1`).then(res => res.json()).then(data => { if(data.lrc && data.lrc.lyric) { const win = window.open("", "_blank"); win.document.write(`<html><head><title>歌词</title><style>body{margin:20px auto;font-family:sans-serif;max-width:700px;line-height:1.6;}</style></head><body><h2>${document.querySelector(".tit").innerText} 的歌词</h2><pre>${data.lrc.lyric}</pre></body></html>`); win.document.close(); } else { alert("未找到歌词"); } }).catch(err => alert("获取歌词失败"));'},
        {title: '4、下载歌曲', code: 'const songId = location.href.match(/id=(\\d+)/)[1]; window.open(`https://music.163.com/song/media/outer/url?id=${songId}.mp3`, "_blank");'},
        {title: '5、MyFreeMP3', code: 'const songTitle = document.querySelector(".tit").innerText; const artist = document.querySelector(".des span") ? document.querySelector(".des span").innerText : ""; const searchQuery = encodeURIComponent(`${songTitle} ${artist}`); const url = `https://2024.myfreemp3juices.cc/?query=${searchQuery}`; window.open(url, "_blank");'}
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
        if (!panel.contains(e.target) && !e.target.classList.contains('netease-music-icon')) {
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