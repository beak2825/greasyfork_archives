// ==UserScript==
// @name         ✨ 网站油猴脚本发现器：智能匹配、高效管理，您的专属脚本宝库！ ✨
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  Finds, filters, and sorts userscripts for the current site from GreasyFork. Now with a responsive design for desktop and mobile!
// @author       一只会飞的旺旺 (Optimized by AI)
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      greasyfork.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539863/%E2%9C%A8%20%E7%BD%91%E7%AB%99%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E5%8F%91%E7%8E%B0%E5%99%A8%EF%BC%9A%E6%99%BA%E8%83%BD%E5%8C%B9%E9%85%8D%E3%80%81%E9%AB%98%E6%95%88%E7%AE%A1%E7%90%86%EF%BC%8C%E6%82%A8%E7%9A%84%E4%B8%93%E5%B1%9E%E8%84%9A%E6%9C%AC%E5%AE%9D%E5%BA%93%EF%BC%81%20%E2%9C%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/539863/%E2%9C%A8%20%E7%BD%91%E7%AB%99%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E5%8F%91%E7%8E%B0%E5%99%A8%EF%BC%9A%E6%99%BA%E8%83%BD%E5%8C%B9%E9%85%8D%E3%80%81%E9%AB%98%E6%95%88%E7%AE%A1%E7%90%86%EF%BC%8C%E6%82%A8%E7%9A%84%E4%B8%93%E5%B1%9E%E8%84%9A%E6%9C%AC%E5%AE%9D%E5%BA%93%EF%BC%81%20%E2%9C%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LOG_PREFIX = '[Userscript Finder]';

    // Configuration constants
    const SORT_OPTIONS = {
        'total_installs': '总安装量',
        'rating': '评分',
        'daily_installs': '日安装量',
        'updated': '更新日期',
        'created': '创建日期',
        'name': '名称',
    };
    const DEFAULT_SORT = 'total_installs';
    const RESULT_LIMIT = 20;
    const ANIMATION_DURATION = 300; // ms for panel slide
    const DRAG_SENSITIVITY = 0.8; // 拖动敏感度 (0.1 - 1.0)，值越小拖动越慢

    // Get button position from storage or use defaults
    const DEFAULT_POSITION = { top: 20, right: 20, bottom: 'auto', left: 'auto' };
    let buttonPosition = GM_getValue('button_position', DEFAULT_POSITION);

    /**
     * Gets the root domain from a hostname
     */
    function getRootDomain(hostname) {
        const parts = hostname.split('.');
        const commonSLDs = /^(co|com|net|org|gov|edu)\.\w{2}$/;
        if (parts.length > 2) {
            const lastTwo = parts.slice(-2).join('.');
            if (commonSLDs.test(lastTwo)) {
                return parts.slice(-3).join('.');
            }
            return lastTwo;
        }
        return hostname;
    }

    const fullHostname = window.location.hostname;
    const rootDomain = getRootDomain(fullHostname);

    console.log(`${LOG_PREFIX} Initializing on ${fullHostname} (root: ${rootDomain})`);

    /**
     * Creates a reusable Promise-based GM_xmlhttpRequest helper
     */
    function GM_xhr_promise(options) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({ ...options, onload: resolve, onerror: reject, ontimeout: reject });
        });
    }

    /**
     * Search GreasyFork by HTML with sorting
     */
    async function searchGreasyForkByHTML(domain, sortBy = DEFAULT_SORT) {
        console.log(`${LOG_PREFIX} Searching for domain: ${domain}, sorting by: ${sortBy}`);
        const sortQuery = sortBy === 'daily_installs' ? '' : `?sort=${sortBy}`;
        const url = `https://greasyfork.org/zh-CN/scripts/by-site/${domain}${sortQuery}`;
        console.log(`${LOG_PREFIX} Requesting URL: ${url}`);

        try {
            const response = await GM_xhr_promise({ method: "GET", url: url });
            console.log(`${LOG_PREFIX} Received response. Status: ${response.status}`);
            if (response.status !== 200) {
                console.error(`${LOG_PREFIX} GreasyFork search failed: HTTP Status ${response.status}`);
                return [];
            }

            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, 'text/html');
            const scriptElements = doc.querySelectorAll('#browse-script-list > li');

            const scripts = [];
            scriptElements.forEach(item => {
                const relativeUrl = item.querySelector('a.script-link')?.getAttribute('href') ?? '#';
                scripts.push({
                    source: 'GreasyFork',
                    title: item.dataset.scriptName || 'Untitled',
                    url: `https://greasyfork.org${relativeUrl}`,
                    installs: parseInt(item.dataset.scriptTotalInstalls, 10) || 0,
                    updatedDate: item.dataset.scriptUpdatedDate,
                    description: item.querySelector('.script-description')?.textContent.trim() ?? '',
                    author: item.querySelector('.script-list-author a')?.textContent.trim() ?? 'Unknown'
                });
            });

            console.log(`${LOG_PREFIX} Parsed ${scripts.length} scripts from HTML.`);
            return scripts;
        } catch (error) {
            console.error(`${LOG_PREFIX} CRITICAL ERROR while searching:`, error);
            return [];
        }
    }

    /**
     * Creates sorting and filtering controls
     */
    function createControls(parent) {
        const controlsContainer = document.createElement('div');
        controlsContainer.id = 'userscript-finder-controls';
        controlsContainer.style.cssText = 'display: flex; align-items: center; gap: 10px; padding: 5px 20px 12px; border-bottom: 1px solid rgba(255,255,255,0.2);';

        const label = document.createElement('label');
        label.textContent = '排序方式:';
        label.style.fontSize = '12px';
        label.setAttribute('for', 'sort-select');

        const select = document.createElement('select');
        select.id = 'sort-select';
        select.style.cssText = `
            background: rgba(0, 0, 0, 0.3);
            color: #ecf0f1;
            border: 1px solid rgba(255, 255, 255, 0.4);
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 12px;
            cursor: pointer;
            -webkit-appearance: none;
            appearance: none;
            background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ECF0F1%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.4-5.4-13z%22%2F%3E%3C%2Fsvg%3E');
            background-repeat: no-repeat;
            background-position: right 8px top 50%;
            background-size: .65em auto;
            padding-right: 2em;
        `;

        for (const [value, text] of Object.entries(SORT_OPTIONS)) {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = text;
            select.appendChild(option);
        }

        const savedSort = GM_getValue('sort_preference', DEFAULT_SORT);
        select.value = savedSort;

        select.addEventListener('change', (event) => {
            const newSort = event.target.value;
            GM_setValue('sort_preference', newSort);
            updateAndRenderScripts();
        });

        const resetButton = document.createElement('button');
        resetButton.textContent = '重置按钮位置';
        resetButton.style.cssText = `
            background: rgba(255,255,255,0.1); color: #ecf0f1; border: 1px solid rgba(255,255,255,0.3);
            border-radius: 4px; padding: 4px 8px; font-size: 11px; cursor: pointer; margin-left: auto;
            transition: background-color 0.2s, transform 0.1s;
        `;
        resetButton.addEventListener('click', resetButtonPosition);
        resetButton.addEventListener('mouseenter', () => resetButton.style.backgroundColor = 'rgba(255,255,255,0.2)');
        resetButton.addEventListener('mouseleave', () => resetButton.style.backgroundColor = 'rgba(255,255,255,0.1)');
        resetButton.addEventListener('mousedown', () => resetButton.style.transform = 'scale(0.98)');
        resetButton.addEventListener('mouseup', () => resetButton.style.transform = 'scale(1)');

        controlsContainer.appendChild(label);
        controlsContainer.appendChild(select);
        controlsContainer.appendChild(resetButton);
        parent.appendChild(controlsContainer);
    }

    function resetButtonPosition() {
        const toggleButton = document.getElementById('userscript-finder-toggle');
        if (toggleButton) {
            Object.assign(toggleButton.style, {
                top: `${DEFAULT_POSITION.top}px`,
                right: `${DEFAULT_POSITION.right}px`,
                bottom: 'auto',
                left: 'auto',
                transform: 'none',
                transition: 'top 0.3s, right 0.3s, bottom 0.3s, left 0.3s, opacity 0.2s, transform 0.2s, box-shadow 0.2s'
            });
            buttonPosition = DEFAULT_POSITION;
            GM_setValue('button_position', buttonPosition);
            toggleButton.classList.add('position-saved');
            setTimeout(() => toggleButton.classList.remove('position-saved'), 500);
        }
    }

    function makeDraggable(element) {
        let isDragging = false, initialMouseX, initialMouseY, initialButtonX, initialButtonY;
        let currentOffsetX = 0, currentOffsetY = 0, animationFrameId = null;
        let wasDragged = false;

        function dragStart(e) {
            if (e.button === 2) return;
            wasDragged = false;

            if (e.type === 'touchstart') {
                initialMouseX = e.touches[0].clientX;
                initialMouseY = e.touches[0].clientY;
            } else {
                initialMouseX = e.clientX;
                initialMouseY = e.clientY;
            }

            const rect = element.getBoundingClientRect();
            initialButtonX = rect.left;
            initialButtonY = rect.top;

            element.style.left = `${initialButtonX}px`;
            element.style.top = `${initialButtonY}px`;
            element.style.right = 'auto';
            element.style.bottom = 'auto';
            element.style.transition = 'none';
            element.classList.add('is-dragging');
            isDragging = true;
            if (e.type === 'mousedown') e.preventDefault();
        }

        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();

            let clientX, clientY;
            if (e.type === 'touchmove') {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            currentOffsetX = (clientX - initialMouseX) * DRAG_SENSITIVITY;
            currentOffsetY = (clientY - initialMouseY) * DRAG_SENSITIVITY;

            if (Math.abs(currentOffsetX) > 2 || Math.abs(currentOffsetY) > 2) {
                wasDragged = true;
            }

            if (!animationFrameId) {
                animationFrameId = requestAnimationFrame(updateTransform);
            }
        }

        function updateTransform() {
            element.style.transform = `translate(${currentOffsetX}px, ${currentOffsetY}px)`;
            animationFrameId = null;
        }

        function dragEnd() {
            if (!isDragging) return;
            isDragging = false;
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;

            const rect = element.getBoundingClientRect();
            const finalLeft = rect.left;
            const finalTop = rect.top;

            element.style.transform = '';
            element.style.transition = '';
            element.classList.remove('is-dragging');

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const isCloserToRight = viewportWidth - (finalLeft + rect.width) < finalLeft;
            const isCloserToBottom = viewportHeight - (finalTop + rect.height) < finalTop;

            let newPosition = {};

            if (isCloserToRight) {
                newPosition.right = Math.max(10, viewportWidth - (finalLeft + rect.width));
                newPosition.left = 'auto';
            } else {
                newPosition.left = Math.max(10, finalLeft);
                newPosition.right = 'auto';
            }

            if (isCloserToBottom) {
                newPosition.bottom = Math.max(10, viewportHeight - (finalTop + rect.height));
                newPosition.top = 'auto';
            } else {
                newPosition.top = Math.max(10, finalTop);
                newPosition.bottom = 'auto';
            }

            Object.keys(newPosition).forEach(prop => {
                element.style[prop] = (newPosition[prop] !== 'auto') ? `${newPosition[prop]}px` : 'auto';
            });

            buttonPosition = newPosition;
            GM_setValue('button_position', buttonPosition);

            element.classList.add('position-saved');
            setTimeout(() => element.classList.remove('position-saved'), 500);

            currentOffsetX = 0;
            currentOffsetY = 0;
        }

        element.addEventListener('touchstart', dragStart, { passive: false });
        document.addEventListener('touchend', dragEnd);
        document.addEventListener('touchmove', drag, { passive: false });
        element.addEventListener('mousedown', dragStart);
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('mousemove', drag);

        return { wasDragged: () => wasDragged };
    }

    async function updateAndRenderScripts() {
        const container = document.getElementById('userscript-finder-container');
        const content = container.querySelector('#userscript-finder-content');
        const titleElement = container.querySelector('#userscript-finder-title');

        content.innerHTML = `<div id="userscript-finder-loading">正在加载...</div>`;
        titleElement.textContent = '脚本查找器';

        try {
            const sortBy = GM_getValue('sort_preference', DEFAULT_SORT);
            const allScripts = await searchGreasyForkByHTML(rootDomain, sortBy);

            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

            const recentScripts = allScripts.filter(script => {
                return script.updatedDate && new Date(script.updatedDate) >= oneYearAgo;
            });
            console.log(`${LOG_PREFIX} Filtered by date: ${recentScripts.length} scripts remaining (updated within 1 year).`);

            const finalScripts = recentScripts.slice(0, RESULT_LIMIT);
            titleElement.textContent = `脚本查找器 (${finalScripts.length} 个结果)`;

            if (finalScripts.length > 0) {
                let html = '';
                finalScripts.forEach(script => {
                    const descriptionHTML = script.description ? `<p class="script-description">${script.description}</p>` : '';
                    html += `
                        <div class="script-item">
                            <h4 class="script-title"><a href="${script.url}" target="_blank" rel="noopener noreferrer">${script.title}</a></h4>
                            <div class="script-meta">
                                <span class="script-source">更新于: ${script.updatedDate}</span>
                                <span class="script-installs">${script.installs.toLocaleString()} 安装</span>
                            </div>
                            ${descriptionHTML}
                        </div>`;
                });
                content.innerHTML = html;
            } else {
                content.innerHTML = `<div class="no-scripts"><p>未找到适用于 ${rootDomain} 的脚本（或没有近一年内更新的）。</p></div>`;
            }
        } catch (error) {
            console.error(`${LOG_PREFIX} Error during render:`, error);
            content.innerHTML = `<div class="no-scripts"><p>搜索脚本时出现错误。</p><p>请按 F12 打开控制台查看日志。</p></div>`;
        }
    }

    function createUI() {
        GM_addStyle(`
            /* == RESPONSIVE DESIGN VARIABLES == */
            :root {
                /* Default (Desktop): Slide from right */
                --panel-hidden-transform: translateX(calc(100% + 20px));
            }

            /* Main Panel Styles */
            #userscript-finder-container {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 400px;
                max-width: 95vw; /* Ensure it doesn't exceed viewport width */
                max-height: 80vh;
                background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                z-index: 999999;
                font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
                color: #ecf0f1;
                overflow: hidden;
                display: flex; /* Use flexbox for layout */
                flex-direction: column;
                transform: var(--panel-hidden-transform); /* Initially hidden using variable */
                transition: transform ${ANIMATION_DURATION}ms ease-in-out;
            }
            #userscript-finder-container.show {
                transform: translateX(0) translateY(0); /* Universal "show" state */
            }

            /* Header */
            #userscript-finder-header {
                padding: 16px 20px 0;
                background: rgba(0,0,0,0.15);
                flex-shrink: 0; /* Prevent header from shrinking */
            }
            #header-top-row {
                display: flex; justify-content: space-between; align-items: center;
                margin-bottom: 12px;
            }
            #userscript-finder-title { font-size: 17px; font-weight: 700; margin: 0; }
            #userscript-finder-close {
                background: none; border: none; color: #ecf0f1; font-size: 24px;
                cursor: pointer; padding: 0; width: 28px; height: 28px;
                display: flex; align-items: center; justify-content: center;
                border-radius: 50%; transition: background-color 0.2s, transform 0.2s;
            }
            #userscript-finder-close:hover { background-color: rgba(255,255,255,0.1); transform: rotate(90deg); }
            #userscript-finder-close:active { transform: scale(0.9) rotate(90deg); }

            /* Content Area */
            #userscript-finder-content {
                overflow-y: auto;
                flex-grow: 1; /* Allow content to fill available space */
                scrollbar-width: thin;
                scrollbar-color: rgba(255,255,255,0.3) transparent;
            }
            #userscript-finder-content::-webkit-scrollbar { width: 8px; }
            #userscript-finder-content::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.3); border-radius: 4px; }
            #userscript-finder-content::-webkit-scrollbar-track { background-color: transparent; }

            /* Script List Item */
            .script-item { padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); transition: background-color 0.2s; }
            .script-item:hover { background-color: rgba(255,255,255,0.08); }
            .script-item:last-child { border-bottom: none; }
            .script-title { font-size: 15px; font-weight: 600; margin: 0 0 6px 0; line-height: 1.3; }
            .script-title a { color: #add8e6; text-decoration: none; transition: color 0.2s; }
            .script-title a:hover { text-decoration: underline; color: #87ceeb; }
            .script-meta { display: flex; justify-content: space-between; align-items: center; font-size: 11px; opacity: 0.7; margin-bottom: 6px; }
            .script-installs { font-weight: 600; }
            .script-description { font-size: 12px; opacity: 0.6; line-height: 1.5; margin: 0; max-height: 40px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
            .no-scripts, #userscript-finder-loading { padding: 40px 20px; text-align: center; opacity: 0.8; }

            /* Toggle Button Styles */
            #userscript-finder-toggle {
                position: fixed; width: 54px; height: 54px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none; border-radius: 50%; color: white; font-size: 22px; cursor: move;
                box-shadow: 0 4px 15px rgba(0,0,0,0.4); z-index: 999998;
                transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
                display: flex; align-items: center; justify-content: center;
                user-select: none; text-shadow: 0 1px 2px rgba(0,0,0,0.2);
            }
            #userscript-finder-toggle:hover { opacity: 0.9; transform: scale(1.05); }
            #userscript-finder-toggle.hidden { display: none; }
            #userscript-finder-toggle.minimized { opacity: 0.6; transform: scale(0.7); }
            #userscript-finder-toggle.position-saved { box-shadow: 0 0 0 4px rgba(255,255,255,0.6); }
            #userscript-finder-toggle.is-dragging { cursor: grabbing; opacity: 0.7; }

            /* Context Menu Styles */
            .toggle-context-menu {
                position: absolute; background: rgba(44, 62, 80, 0.98);
                border: 1px solid rgba(255,255,255,0.2); border-radius: 6px;
                box-shadow: 0 6px 15px rgba(0,0,0,0.4); padding: 6px 0;
                z-index: 999999; font-size: 13px;
            }
            .menu-option { padding: 8px 15px; cursor: pointer; color: #ecf0f1; transition: background-color 0.2s; }
            .menu-option:hover { background: rgba(255,255,255,0.12); }
            .menu-separator { height: 1px; background: rgba(255,255,255,0.15); margin: 6px 0; }
            #sort-select option { background-color: #34495e; color: #ecf0f1; }

            /* == MOBILE / SMALL SCREEN STYLES == */
            @media (max-width: 768px) {
                :root {
                    /* On mobile, slide from bottom */
                    --panel-hidden-transform: translateY(100%);
                }
                #userscript-finder-container {
                    top: auto;
                    bottom: 0;
                    right: 0;
                    left: 0;
                    width: 100%;
                    max-width: 100%; /* Override desktop max-width */
                    max-height: 70vh; /* A bit shorter for bottom sheet */
                    border-radius: 16px 16px 0 0; /* Rounded top corners */
                }
                #userscript-finder-header { padding: 12px 16px 0; }
                #userscript-finder-title { font-size: 16px; }
                #userscript-finder-controls { padding: 5px 16px 12px; }
                .script-item { padding: 12px 16px; }
                .script-title { font-size: 14px; }
                .script-description { font-size: 11px; }
            }
        `);

        const container = document.createElement("div");
        container.id = "userscript-finder-container";
        container.innerHTML = `
            <div id="userscript-finder-header">
                 <div id="header-top-row">
                    <h3 id="userscript-finder-title">脚本查找器</h3>
                    <button id="userscript-finder-close" title="关闭">×</button>
                 </div>
                 <!-- Controls will be inserted here -->
            </div>
            <div id="userscript-finder-content"></div>
        `;
        document.body.appendChild(container);

        createControls(container.querySelector('#userscript-finder-header'));

        const toggleButton = document.createElement("button");
        toggleButton.id = "userscript-finder-toggle";
        toggleButton.innerHTML = "🔍";
        toggleButton.title = "查找可用脚本 (左键打开, 右键菜单, 双击最小化, 按住拖动)";
        Object.keys(buttonPosition).forEach(prop => {
            toggleButton.style[prop] = (buttonPosition[prop] !== 'auto') ? `${buttonPosition[prop]}px` : 'auto';
        });
        document.body.appendChild(toggleButton);

        const draggable = makeDraggable(toggleButton);

        toggleButton.addEventListener('dblclick', (e) => {
            e.preventDefault(); e.stopPropagation();
            toggleButton.classList.toggle('minimized');
        });

        toggleButton.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const existingMenu = document.querySelector('.toggle-context-menu');
            if (existingMenu) existingMenu.remove();

            const contextMenu = document.createElement('div');
            contextMenu.className = 'toggle-context-menu';
            contextMenu.innerHTML = `
                <div class="menu-option" id="menu-open">打开脚本查找器</div>
                <div class="menu-separator"></div>
                <div class="menu-option" id="menu-minimize">最小化/恢复图标</div>
                <div class="menu-option" id="menu-reset-position">重置位置</div>
                <div class="menu-option" id="menu-hide">暂时隐藏 (30秒)</div>
            `;

            document.body.appendChild(contextMenu);
            const rect = toggleButton.getBoundingClientRect();
            const menuRect = contextMenu.getBoundingClientRect();

            let menuTop = rect.top;
            let menuLeft = rect.right + 10;

            if (menuLeft + menuRect.width > window.innerWidth) {
                menuLeft = rect.left - menuRect.width - 10;
            }
            if (menuTop + menuRect.height > window.innerHeight) {
                menuTop = window.innerHeight - menuRect.height - 10;
            }
            contextMenu.style.top = `${Math.max(10, menuTop)}px`;
            contextMenu.style.left = `${Math.max(10, menuLeft)}px`;


            const closeMenu = (event) => {
                if (!contextMenu.contains(event.target) && event.target !== toggleButton) {
                    contextMenu.remove();
                    document.removeEventListener('click', closeMenu, true);
                    document.removeEventListener('contextmenu', closeMenu, true);
                }
            };
            setTimeout(() => { // Use setTimeout to avoid capturing the same click that opened it
                document.addEventListener('click', closeMenu, true);
                document.addEventListener('contextmenu', closeMenu, true);
            }, 0);


            document.getElementById('menu-open').addEventListener('click', () => {
                openFinderPanel();
                contextMenu.remove();
            });
            document.getElementById('menu-minimize').addEventListener('click', () => {
                toggleButton.classList.toggle('minimized');
                contextMenu.remove();
            });
            document.getElementById('menu-reset-position').addEventListener('click', () => {
                resetButtonPosition();
                contextMenu.remove();
            });
            document.getElementById('menu-hide').addEventListener('click', () => {
                toggleButton.classList.add('hidden');
                setTimeout(() => toggleButton.classList.remove('hidden'), 30000);
                contextMenu.remove();
            });
        });

        const openFinderPanel = () => {
            container.classList.add('show');
            toggleButton.classList.add('hidden');
            if (!container.dataset.loaded) {
                updateAndRenderScripts();
                container.dataset.loaded = "true";
            }
        };

        const closeFinderPanel = () => {
            container.classList.remove('show');
            setTimeout(() => toggleButton.classList.remove('hidden'), ANIMATION_DURATION);
        };

        toggleButton.addEventListener('click', (e) => {
            if (draggable.wasDragged()) return;
            openFinderPanel();
        });

        container.querySelector('#userscript-finder-close').addEventListener('click', closeFinderPanel);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && container.classList.contains('show')) {
                closeFinderPanel();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }
})();