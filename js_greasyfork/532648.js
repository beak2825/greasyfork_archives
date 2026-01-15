// ==UserScript==
// @name         网站信息复制助手
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  修复点击穿透bug、增加隐藏按钮选项。功能：修复间隙、深色模式、位置记忆、触控拖拽、自动解码、自定义快捷键、Markdown/HTML切换。
// @author       Gibber1977
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532648/%E7%BD%91%E7%AB%99%E4%BF%A1%E6%81%AF%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/532648/%E7%BD%91%E7%AB%99%E4%BF%A1%E6%81%AF%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 核心配置与状态管理 ---
    const CONFIG = {
        menuWidth: 200,
        gapSize: 10,
        defaultType: 'clean',
        cleanParams: [
            'spm_id_from', 'vd_source', 'share_source', 'share_medium', 'share_plat', 'share_tag', 'unique_k',
            'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id',
            'fbclid', 'gclid', 'si', 'feature', 'pp', 'biz_id', 'scene', 'isappinstalled', 'igshid',
            'sc_medium', 'sc_source', 'sc_campaign', 'ref', 'source'
        ]
    };

    const STATE = {
        isDragging: false,
        hasMoved: false,
        startX: 0,
        startY: 0,
        initialLeft: 0,
        initialTop: 0,
        isFabVisible: GM_getValue('show_fab', true) // 读取显示状态
    };

    // --- 2. 菜单命令逻辑 (动态注册) ---
    let menuCmdId = null;
    function updateMenuCommand() {
        if (menuCmdId !== null) {
            GM_unregisterMenuCommand(menuCmdId);
        }
        const title = STATE.isFabVisible ? '🚫 隐藏悬浮球' : '👁️ 显示悬浮球';
        menuCmdId = GM_registerMenuCommand(title, () => {
            STATE.isFabVisible = !STATE.isFabVisible;
            GM_setValue('show_fab', STATE.isFabVisible);
            updateFabVisibility();
            updateMenuCommand();
            // 如果隐藏时菜单还开着，关掉它
            if (!STATE.isFabVisible) {
                closeMenu();
            }
        });
    }

    // 设置快捷键命令
    GM_registerMenuCommand('⚙️ 设置复制快捷键', () => {
        const current = GM_getValue('user_shortcut', '') || '未设置';
        const input = prompt(
            `请输入快捷键组合 (使用 + 号连接，不区分大小写)\n例如: alt+c 或 ctrl+shift+z\n\n当前: ${current}\n留空确认则禁用。`,
            GM_getValue('user_shortcut', '')
        );
        if (input !== null) {
            GM_setValue('user_shortcut', input.trim().toLowerCase());
            alert(input ? `✅ 快捷键已更新: ${input}` : '🚫 快捷键已禁用');
        }
    });

    // 初始化菜单
    updateMenuCommand();

    // --- 3. DOM 构建 (Shadow DOM) ---
    const host = document.createElement('div');
    host.id = 'copy-helper-host';
    // pointer-events: none 确保 host 本身不阻挡点击，内部元素开启 auto
    host.style.cssText = 'position: fixed; z-index: 2147483647; top: 0; left: 0; width: 0; height: 0; pointer-events: none;';
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: 'open' });

    // --- 4. 样式系统 ---
    const style = document.createElement('style');
    style.textContent = `
        :host {
            --primary: #00A1D6;
            --text: #333;
            --text-sub: #888;
            --bg: rgba(255, 255, 255, 0.95);
            --border: #eaeaea;
            --shadow: 0 4px 20px rgba(0,0,0,0.15);
            --hover-bg: #f4f9ff;
            --fab-bg: #fff;
            --fab-color: #555;
            --toast-bg: rgba(30, 30, 30, 0.9);
        }

        @media (prefers-color-scheme: dark) {
            :host {
                --primary: #5ec7f7;
                --text: #e0e0e0;
                --text-sub: #aaa;
                --bg: rgba(35, 35, 35, 0.95);
                --border: #444;
                --shadow: 0 4px 24px rgba(0,0,0,0.6);
                --hover-bg: #444;
                --fab-bg: #2d2d2d;
                --fab-color: #ddd;
                --toast-bg: rgba(255, 255, 255, 0.9);
            }
        }

        * { box-sizing: border-box; user-select: none; -webkit-user-select: none; }

        /* 全屏透明遮罩 (解决点击穿透) */
        #overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            z-index: 99; /* 比 FAB 和 Menu 低，但覆盖网页 */
            display: none;
            pointer-events: auto; /* 捕获点击 */
        }
        #overlay.active { display: block; }

        /* 悬浮球 FAB */
        #fab {
            position: fixed; width: 44px; height: 44px;
            background: var(--fab-bg); border: 1px solid var(--border);
            border-radius: 50%; box-shadow: var(--shadow);
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            transition: transform 0.1s, box-shadow 0.2s, opacity 0.3s;
            backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
            touch-action: none;
            z-index: 100;
            pointer-events: auto; /* 恢复点击 */
        }
        #fab:hover { transform: scale(1.1); box-shadow: 0 8px 25px rgba(0,0,0,0.2); }
        #fab:active { transform: scale(0.95); }
        #fab svg { width: 22px; height: 22px; fill: var(--fab-color); transition: fill 0.3s; }

        #fab.idle { opacity: 0.6; transform: scale(0.9); }
        #fab.idle:hover { opacity: 1; transform: scale(1.1); }
        #fab.hidden { display: none !important; }

        /* 菜单 Menu */
        #menu {
            position: fixed; width: ${CONFIG.menuWidth}px;
            background: var(--bg); border: 1px solid var(--border);
            border-radius: 12px; padding: 8px 0;
            box-shadow: var(--shadow); display: none; flex-direction: column;
            font-family: system-ui, sans-serif; font-size: 13px; color: var(--text);
            overflow: visible; opacity: 0; transform: scale(0.95);
            transition: opacity 0.15s, transform 0.15s;
            z-index: 101; /* 最高层级 */
            pointer-events: auto;
        }
        #menu.visible { display: flex; opacity: 1; transform: scale(1); }

        .menu-item {
            position: relative; padding: 10px 16px; cursor: pointer;
            display: flex; justify-content: space-between; align-items: center;
        }
        .menu-item:hover { background: var(--hover-bg); color: var(--primary); }

        .divider { height: 1px; background: var(--border); margin: 5px 0; opacity: 0.6; }
        .hint { font-size: 11px; color: var(--text-sub); margin-left: 6px; font-weight: normal; }
        .menu-item:hover .hint { color: var(--primary); opacity: 0.8; }

        .submenu {
            position: absolute; top: -8px; width: ${CONFIG.menuWidth}px;
            background: var(--bg); border: 1px solid var(--border);
            border-radius: 12px; box-shadow: var(--shadow);
            padding: 8px 0; display: none; z-index: 102;
        }
        .submenu::before {
            content: ''; position: absolute; top: 0; bottom: 0;
            width: ${CONFIG.gapSize + 15}px; z-index: -1;
        }
        .opens-right .submenu { left: 100%; margin-left: ${CONFIG.gapSize}px; }
        .opens-right .submenu::before { right: 100%; }
        .opens-left .submenu { right: 100%; margin-right: ${CONFIG.gapSize}px; }
        .opens-left .submenu::before { left: 100%; }

        .menu-item:hover .submenu { display: block; animation: slideIn 0.15s ease-out; }

        #toast {
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            background: var(--toast-bg); color: #fff;
            padding: 12px 28px; border-radius: 30px;
            font-size: 14px; font-weight: 500;
            opacity: 0; pointer-events: none;
            transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            display: flex; align-items: center; gap: 8px;
            z-index: 2147483647;
            backdrop-filter: blur(10px);
        }
        @media (prefers-color-scheme: dark) { #toast { color: #000; } }

        #toast.show { opacity: 1; transform: translate(-50%, -50%) scale(1); }

        @keyframes slideIn { from { opacity: 0; transform: translateX(5px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 var(--primary); } 70% { box-shadow: 0 0 0 10px rgba(0,0,0,0); } 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); } }
        .pulse { animation: pulse 0.5s; }
    `;
    shadow.appendChild(style);

    // --- 5. 元素初始化 ---

    // 遮罩层 (新增)
    const overlay = document.createElement('div');
    overlay.id = 'overlay';

    const fab = document.createElement('div');
    fab.id = 'fab';
    fab.innerHTML = `<svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`;

    const savedX = GM_getValue('fab_pos_x', window.innerWidth - 70);
    const savedY = GM_getValue('fab_pos_y', window.innerHeight * 0.6);
    const safeX = Math.min(Math.max(0, savedX), window.innerWidth - 44);
    const safeY = Math.min(Math.max(0, savedY), window.innerHeight - 44);

    fab.style.left = safeX + 'px';
    fab.style.top = safeY + 'px';

    // 初始可见性
    function updateFabVisibility() {
        if (STATE.isFabVisible) {
            fab.classList.remove('hidden');
        } else {
            fab.classList.add('hidden');
        }
    }
    updateFabVisibility();

    const menu = document.createElement('div');
    menu.id = 'menu';

    const toast = document.createElement('div');
    toast.id = 'toast';

    shadow.appendChild(overlay); // 先添加遮罩
    shadow.appendChild(fab);
    shadow.appendChild(menu);
    shadow.appendChild(toast);

    // --- 6. 核心功能函数 ---

    function getCleanUrl() {
        try {
            const url = new URL(window.location.href);
            CONFIG.cleanParams.forEach(p => url.searchParams.delete(p));
            return decodeURI(url.href);
        } catch { return window.location.href; }
    }

    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            try {
                GM_setClipboard(text);
                return true;
            } catch (e) {
                console.error('Copy failed', e);
                return false;
            }
        }
    }

    async function handleCopy(text, label) {
        const success = await copyToClipboard(text);
        if (success) {
            fab.classList.remove('pulse');
            void fab.offsetWidth;
            fab.classList.add('pulse');
            showToast(`✅ 已复制 ${label}`);
            closeMenu();
        } else {
            showToast(`❌ 复制失败，请手动复制`);
        }
    }

    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toast.timer);
        toast.timer = setTimeout(() => toast.classList.remove('show'), 2000);
    }

    function closeMenu() {
        menu.classList.remove('visible');
        overlay.classList.remove('active'); // 隐藏遮罩
    }

    // --- 7. 菜单渲染与数据 ---
    function getMenuData() {
        const title = document.title.trim();
        const cleanLink = getCleanUrl();
        const origLink = decodeURI(window.location.href);
        const isCleanDefault = CONFIG.defaultType === 'clean';

        return [
            { label: '📝 仅标题', action: () => handleCopy(title, '标题') },
            { type: 'divider' },
            {
                label: `🔗 链接 <span class="hint">${isCleanDefault ? '净化' : '原始'}</span>`,
                action: () => handleCopy(isCleanDefault ? cleanLink : origLink, '链接'),
                children: [
                    { label: '✨ 净化链接', action: () => handleCopy(cleanLink, '净化链接') },
                    { label: '🌍 原始链接', action: () => handleCopy(origLink, '原始链接') }
                ]
            },
            {
                label: `📌 标题+链接`,
                action: () => handleCopy(`${title}\n${isCleanDefault ? cleanLink : origLink}`, '标题+链接'),
                children: [
                    { label: '✨ 标题 + 净化', action: () => handleCopy(`${title}\n${cleanLink}`, '标题+净化链接') },
                    { label: '🌍 标题 + 原始', action: () => handleCopy(`${title}\n${origLink}`, '标题+原始链接') }
                ]
            },
            {
                label: `📦 Markdown`,
                action: () => handleCopy(`[${title}](${isCleanDefault ? cleanLink : origLink})`, 'Markdown'),
                children: [
                    { label: '✨ Markdown (净化)', action: () => handleCopy(`[${title}](${cleanLink})`, 'Markdown净化') },
                    { label: '🌍 Markdown (原始)', action: () => handleCopy(`[${title}](${origLink})`, 'Markdown原始') }
                ]
            },
            {
                label: `💻 HTML`,
                action: () => handleCopy(`<a href="${isCleanDefault ? cleanLink : origLink}">${title}</a>`, 'HTML'),
                children: [
                    { label: '✨ HTML (净化)', action: () => handleCopy(`<a href="${cleanLink}">${title}</a>`, 'HTML净化') },
                    { label: '🌍 HTML (原始)', action: () => handleCopy(`<a href="${origLink}">${title}</a>`, 'HTML原始') }
                ]
            }
        ];
    }

    function renderMenu() {
        menu.innerHTML = '';
        getMenuData().forEach(item => {
            if (item.type === 'divider') {
                menu.appendChild(document.createElement('div')).className = 'divider';
                return;
            }
            const div = document.createElement('div');
            div.className = 'menu-item';
            div.innerHTML = `<span>${item.label}</span>${item.children ? '<svg viewBox="0 0 24 24" style="width:14px;opacity:0.5;fill:currentColor"><path d="M10 17l5-5-5-5v10z"/></svg>' : ''}`;

            div.addEventListener('click', (e) => {
                if(item.action) { item.action(); e.stopPropagation(); }
            });

            if (item.children) {
                const subDiv = document.createElement('div');
                subDiv.className = 'submenu';
                item.children.forEach(sub => {
                    const subItem = document.createElement('div');
                    subItem.className = 'menu-item';
                    subItem.textContent = sub.label.replace(/✨|🌍|📝|🔗|📌|📦|💻/g, '').trim();
                    subItem.addEventListener('click', (ev) => {
                        ev.stopPropagation();
                        sub.action();
                    });
                    subDiv.appendChild(subItem);
                });
                div.appendChild(subDiv);
            }
            menu.appendChild(div);
        });
    }

    // --- 8. 交互系统 ---

    const getClientPos = (e) => {
        const touch = e.touches ? e.touches[0] : e;
        return { x: touch.clientX, y: touch.clientY };
    };

    const handleStart = (e) => {
        if (e.type === 'mousedown' && e.button !== 0) return;

        STATE.isDragging = true;
        STATE.hasMoved = false;
        const pos = getClientPos(e);
        STATE.startX = pos.x;
        STATE.startY = pos.y;

        const rect = fab.getBoundingClientRect();
        STATE.initialLeft = rect.left;
        STATE.initialTop = rect.top;

        fab.style.transition = 'none';
        fab.classList.remove('idle');

        if(e.type === 'touchstart') e.preventDefault();
    };

    const handleMove = (e) => {
        if (!STATE.isDragging) return;

        const pos = getClientPos(e);
        const dx = pos.x - STATE.startX;
        const dy = pos.y - STATE.startY;

        if (dx*dx + dy*dy > 25) STATE.hasMoved = true;

        const maxLeft = window.innerWidth - fab.offsetWidth;
        const maxTop = window.innerHeight - fab.offsetHeight;

        const newLeft = Math.min(Math.max(0, STATE.initialLeft + dx), maxLeft);
        const newTop = Math.min(Math.max(0, STATE.initialTop + dy), maxTop);

        fab.style.left = newLeft + 'px';
        fab.style.top = newTop + 'px';

        if (menu.classList.contains('visible')) closeMenu();
    };

    const handleEnd = () => {
        if (!STATE.isDragging) return;
        STATE.isDragging = false;

        fab.style.transition = 'all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)';

        const rect = fab.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;

        let finalLeft;
        if (centerX < window.innerWidth / 2) {
            finalLeft = 10;
        } else {
            finalLeft = window.innerWidth - fab.offsetWidth - 10;
        }

        fab.style.left = finalLeft + 'px';
        GM_setValue('fab_pos_x', finalLeft);
        GM_setValue('fab_pos_y', rect.top);
        resetIdleTimer();
    };

    fab.addEventListener('mousedown', handleStart);
    fab.addEventListener('touchstart', handleStart, { passive: false });
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);

    let idleTimer;
    const resetIdleTimer = () => {
        fab.classList.remove('idle');
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            if(!menu.classList.contains('visible')) fab.classList.add('idle');
        }, 3000);
    };
    fab.addEventListener('mouseenter', resetIdleTimer);
    resetIdleTimer();

    // 点击展开菜单
    fab.addEventListener('click', (e) => {
        if (STATE.hasMoved) return;
        e.stopPropagation();
        resetIdleTimer();

        if (menu.classList.contains('visible')) {
            closeMenu();
            return;
        }

        renderMenu();
        const fabRect = fab.getBoundingClientRect();
        const isRightSide = fabRect.left > window.innerWidth / 2;
        const isBottomSide = fabRect.top > window.innerHeight / 2;

        menu.style.display = 'flex';
        // 显示遮罩层
        overlay.classList.add('active');

        const menuHeight = menu.scrollHeight || 300;
        if (isBottomSide && (fabRect.bottom + menuHeight > window.innerHeight)) {
            menu.style.top = 'auto';
            menu.style.bottom = (window.innerHeight - fabRect.bottom) + 'px';
        } else {
            menu.style.top = fabRect.top + 'px';
            menu.style.bottom = 'auto';
        }

        menu.classList.remove('opens-left', 'opens-right');
        if (isRightSide) {
            menu.style.left = (fabRect.left - CONFIG.menuWidth - CONFIG.gapSize) + 'px';
            menu.classList.add('opens-left');
        } else {
            menu.style.left = (fabRect.right + CONFIG.gapSize) + 'px';
            menu.classList.add('opens-right');
        }

        requestAnimationFrame(() => menu.classList.add('visible'));
    });

    // --- 9. 全局监听与遮罩逻辑 ---

    // 点击遮罩层关闭 (修复穿透问题)
    overlay.addEventListener('click', (e) => {
        e.stopPropagation(); // 关键：阻止事件冒泡到网页 document
        e.preventDefault();
        closeMenu();
    });

    // 窗口大小改变修正
    window.addEventListener('resize', () => {
        const rect = fab.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            fab.style.left = (window.innerWidth - 50) + 'px';
        }
        if (rect.bottom > window.innerHeight) {
            fab.style.top = (window.innerHeight - 50) + 'px';
        }
    });

    // 快捷键
    document.addEventListener('keydown', (e) => {
        const shortcut = GM_getValue('user_shortcut', '');
        if (!shortcut) return;

        const keys = shortcut.toLowerCase().split('+').map(k => k.trim());
        const pressed = {
            alt: e.altKey, ctrl: e.ctrlKey, meta: e.metaKey, shift: e.shiftKey,
            key: e.key.toLowerCase()
        };

        const mods = ['alt', 'ctrl', 'meta', 'shift'];
        const modMatch = mods.every(m => keys.includes(m) === matchMod(m));
        const mainKey = keys.find(k => !mods.includes(k));
        const keyMatch = mainKey ? (pressed.key === mainKey) : true;

        if (modMatch && keyMatch) {
            e.preventDefault();
            const cleanLink = getCleanUrl();
            handleCopy(cleanLink, '链接 (快捷键)');
        }
        function matchMod(k) { return pressed[k]; }
    });

})();