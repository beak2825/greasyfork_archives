// ==UserScript==
// @name         ScriptHub - 🧲 高效查找当前网站可用油猴脚本 🔍
// @name:zh      ScriptHub - 🧲 高效查找当前网站可用油猴脚本 🔍
// @name:en      ScriptHub - Available Scripts Finder
// @name:ja      ScriptHub - 🧲 現在のサイトで利用可能なユーザースクリプトを検索 🔍
// @name:ru      ScriptHub - 🧲 Поиск доступных скриптов для текущего сайта 🔍
// @name:ko      ScriptHub - 🧲 현재 웹사이트에서 사용 가능한 유저스크립트 찾기 🔍
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  在页面右下角显示当前网站可用的油猴脚本, Shows available userscripts for the current website from Greasy Fork
// @description:zh 在页面右下角显示当前网站可用的油猴脚本数量，点击查看详情
// @description:en Shows available userscripts for the current website from Greasy Fork
// @description:ja 現在のウェブサイトで利用可能なユーザースクリプトの数を右下に表示し、クリックで詳細を確認できます
// @description:ru Показывает количество доступных пользовательских скриптов для текущего сайта в правом нижнем углу
// @description:ko 현재 웹사이트에서 사용 가능한 유저스크립트 수를 우측 하단에 표시하고 클릭하여 자세히 보기
// @author       Musk
// @keywords     userscript, tampermonkey, greasyfork, script finder, utilities, productivity
// @keywords:zh  用户脚本, 油猴脚本, 脚本查找器, 实用工具, 效率工具, 油猴
// @keywords:en  userscript, tampermonkey, greasyfork, script finder, utilities, productivity
// @keywords:ja  ユーザースクリプト, タンパーモンキー, スクリプト検索, ユーティリティ, 生産性向上
// @keywords:ru  пользовательский скрипт, тампермонки, поиск скриптов, утилиты, продуктивность
// @keywords:ko  유저스크립트, 템퍼멍키, 스크립트 파인더, 유틸리티, 생산성
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @resource     SITE_DATA https://greasyfork.org/scripts/by-site.json
// @connect      greasyfork.org
// @connect      www.greasyfork.org
// @connect      *
// @run-at       document-end
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520376/ScriptHub%20-%20%F0%9F%A7%B2%20%E9%AB%98%E6%95%88%E6%9F%A5%E6%89%BE%E5%BD%93%E5%89%8D%E7%BD%91%E7%AB%99%E5%8F%AF%E7%94%A8%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%20%F0%9F%94%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/520376/ScriptHub%20-%20%F0%9F%A7%B2%20%E9%AB%98%E6%95%88%E6%9F%A5%E6%89%BE%E5%BD%93%E5%89%8D%E7%BD%91%E7%AB%99%E5%8F%AF%E7%94%A8%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%20%F0%9F%94%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .script-hub-button {
            position: fixed;
            right: 20px;
            bottom: 20px;
            padding: 6px 12px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            cursor: move;
            user-select: none;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            transition: all 0.2s ease;
        }

        .script-hub-button:hover {
            background: rgba(255, 255, 255, 0.7);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .script-hub-button .close {
            margin-left: 4px;
            cursor: pointer;
            opacity: 0.6;
            font-size: 12px;
            padding: 2px;
        }

        .script-hub-button .close:hover {
            opacity: 1;
        }

        .script-hub-sidebar {
            position: fixed;
            top: 0;
            right: -400px;
            width: 400px;
            height: 100vh;
            background: #f8f9fa;
            box-shadow: -2px 0 5px rgba(0,0,0,0.1);
            transition: right 0.3s ease;
            z-index: 10000;
            overflow-y: auto;
        }

        .script-hub-sidebar.active {
            right: 0;
        }

        .script-list {
            padding: 12px;
        }

        .script-item {
            margin: 0 0 12px;
            padding: 12px;
            border-radius: 8px;
            background: #fff;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: all 0.2s ease;
        }

        .script-item:hover {
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            transform: translateY(-1px);
        }

        .script-item h3 {
            margin: 0 0 6px 0;
            font-size: 16px;
        }

        .script-item h3 a {
            color: #1a73e8;
            text-decoration: none;
        }

        .script-item h3 a:hover {
            text-decoration: underline;
        }

        .script-description {
            color: #666;
            font-size: 0.9em;
            line-height: 1.4;
            margin: 6px 0;
        }

        .script-meta {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 6px 0 0;
            color: #666;
            font-size: 0.9em;
            border-top: 1px solid #eee;
            margin-top: 6px;
            gap: 16px;
            white-space: nowrap;
            overflow: hidden;
        }

        .script-meta span {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            gap: 4px;
            background: #f5f7fa;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.9em;
        }

        .script-meta .author {
            flex-shrink: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            min-width: 0;
        }

        .script-meta .author a {
            color: inherit;
            text-decoration: none;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
        }

        .script-meta .author a:hover {
            text-decoration: underline;
            color: #1a73e8;
        }

        .sidebar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 15px;
            border-bottom: 1px solid #eee;
            background: #f8f9fa;
        }

        .sidebar-header-tools {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 14px;
            color: #666;
        }

        .sidebar-header-tools a {
            color: #666;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            border-radius: 4px;
            transition: all 0.2s ease;
            white-space: nowrap;
        }

        .sidebar-header-tools a:hover {
            background: #f5f7fa;
            color: #1a73e8;
        }

        .close-button {
            cursor: pointer;
            padding: 4px 8px;
            color: #666;
            font-size: 16px;
            border-radius: 4px;
            transition: all 0.2s ease;
        }

        .close-button:hover {
            background: #f5f7fa;
            color: #1a73e8;
        }

        .loading, .error, .no-scripts {
            padding: 20px;
            text-align: center;
            color: #666;
        }

        .error {
            color: #f44336;
        }
    `);

    function extractTLD(domain) {
        domain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
        const parts = domain.split('.');
        if (parts.length >= 2) {
            return parts.slice(-2).join('.').toLowerCase();
        }
        return domain.toLowerCase();
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        
        if (date.getFullYear() === now.getFullYear()) {
            return `${month}月${day}日`;
        } else {
            return `${date.getFullYear().toString().slice(-2)}年${month}月${day}日`;
        }
    }

    function createUI() {
        const button = document.createElement('div');
        button.className = 'script-hub-button';
        
        const text = document.createElement('span');
        text.textContent = '0';
        
        const close = document.createElement('span');
        close.className = 'close';
        close.textContent = '×';
        close.onclick = (e) => {
            e.stopPropagation();
            const currentDomain = window.location.hostname;
            if (typeof GM_getValue !== 'undefined' && typeof GM_setValue !== 'undefined') {
                const excludedDomains = GM_getValue('excludedDomains', []);
                if (!excludedDomains.includes(currentDomain)) {
                    excludedDomains.push(currentDomain);
                    GM_setValue('excludedDomains', excludedDomains);
                }
            }
            button.remove();
        };
        
        button.appendChild(text);
        button.appendChild(close);
        
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let startLeft = 0;
        let startTop = 0;

        function handleMouseDown(e) {
            if (e.target === close) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = button.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            
            button.style.transition = 'none';
            button.style.cursor = 'grabbing';
        }

        function handleMouseMove(e) {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            const newLeft = startLeft + deltaX;
            const newTop = startTop + deltaY;
            
            const buttonWidth = button.offsetWidth;
            const buttonHeight = button.offsetHeight;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            const finalLeft = Math.min(Math.max(0, newLeft), viewportWidth - buttonWidth);
            const finalTop = Math.min(Math.max(0, newTop), viewportHeight - buttonHeight);
            
            button.style.left = finalLeft + 'px';
            button.style.top = finalTop + 'px';
            button.style.right = 'auto';
            button.style.bottom = 'auto';
        }

        function handleMouseUp() {
            if (!isDragging) return;
            
            isDragging = false;
            button.style.transition = '';
            button.style.cursor = 'move';
        }

        button.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        
        document.body.appendChild(button);

        const sidebar = document.createElement('div');
        sidebar.className = 'script-hub-sidebar';
        document.body.appendChild(sidebar);

        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !button.contains(e.target) && sidebar.classList.contains('show')) {
                sidebar.classList.remove('show');
                button.classList.remove('active');
            }
        });

        sidebar.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        button.addEventListener('click', (e) => {
            if (e.target === close) return;
            sidebar.classList.toggle('show');
            button.classList.toggle('active');
            e.stopPropagation();
        });

        sidebar.innerHTML = `
            <div class="sidebar-header">
                <div>
                    <div class="sidebar-header-tools">
                        <a href="https://chromewebstore.google.com/detail/jdopbpkjbknppilnpjmceinnpkaigaem" target="_blank">
                           ScriptHub插件
                        </a>
                        <a href="https://likofree.pages.dev/projects/" target="_blank">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/>
                            </svg>
                            更多工具
                        </a>
                        <a href="https://x.com/liko2049" target="_blank">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                            作者
                        </a>
                    </div>
                </div>
                <div class="close-button">✕</div>
            </div>
            <div class="script-list"></div>
        `;
        document.body.appendChild(sidebar);

        button.addEventListener('click', async () => {
            sidebar.classList.add('active');
            const scriptList = sidebar.querySelector('.script-list');
            
            if (!scriptList.children.length) {
                const rawDomain = document.location.hostname;
                const domain = extractTLD(rawDomain);
                await loadScriptDetails(domain, scriptList);
            }
        });

        sidebar.querySelector('.close-button').addEventListener('click', () => {
            sidebar.classList.remove('active');
        });

        return { button, sidebar };
    }

    async function loadScriptDetails(domain, container, retryCount = 0) {
        container.innerHTML = '<div class="loading">Loading scripts...</div>';

        try {
            const encodedDomain = encodeURIComponent(domain);
            const apiUrl = `https://greasyfork.org/scripts/by-site/${domain}?filter_locale=0&page=1`;
            const response = await fetch(apiUrl);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const scripts = doc.querySelector("#browse-script-list")?.querySelectorAll('[data-script-id]');
            let scriptsInfo = [];
            
            if (!scripts) {
                scriptsInfo = errorMessage;
            } else {
                scripts.forEach(script => {
                    scriptsInfo.push({
                        id: script.getAttribute('data-script-id'),
                        name: script.getAttribute('data-script-name'),
                        author: script.querySelector("dd.script-list-author")?.textContent || '',
                        description: script.querySelector(".script-description")?.textContent || '',
                        version: script.getAttribute('data-script-version'),
                        url: 'https://greasyfork.org/scripts/' + script.getAttribute('data-script-id'),
                        createDate: script.getAttribute('data-script-created-date'),
                        updateDate: script.getAttribute('data-script-updated-date'),
                        installs: script.getAttribute('data-script-total-installs'),
                        dailyInstalls: script.getAttribute('data-script-daily-installs'),
                        ratingScore: script.getAttribute('data-script-rating-score')
                    });
                });
            }

            container.innerHTML = '';
            
            if (!scriptsInfo.length) {
                container.innerHTML = '<div class="no-scripts">No scripts found</div>';
                return;
            }

            scriptsInfo.forEach(script => {
                const scriptElement = document.createElement('div');
                scriptElement.className = 'script-item';
                
                scriptElement.innerHTML = `
                    <h3><a href="${script.url}" target="_blank">${script.name}</a></h3>
                    <div class="script-description">${script.description}</div>
                    <div class="script-meta">
                        <span title="总安装量">📥 ${script.installs || 0}</span>
                        <span title="日安装量">📈 ${script.dailyInstalls || 0}</span>
                        <span title="更新时间">🕐 ${formatDate(script.updateDate)}</span>
                        <span class="author" title="${script.author || 'Unknown'}">
                            <a href="${script.url}" target="_blank">
                                👨‍💻 ${script.author || 'Unknown'}
                            </a>
                        </span>
                    </div>
                `;
                container.appendChild(scriptElement);
            });
        } catch (error) {
            if (retryCount < 3) {
                setTimeout(() => {
                    loadScriptDetails(domain, container, retryCount + 1);
                }, 1000 * (retryCount + 1));
            } else {
                container.innerHTML = `
                    <div class="error">
                        Failed to load scripts. Please try again later.<br>
                        <small>Error: ${error.message}</small>
                    </div>
                `;
            }
        }
    }

    async function init() {
        const { button, sidebar } = createUI();

        const rawDomain = document.location.hostname;
        const domain = extractTLD(rawDomain);
        
        try {
            const siteData = JSON.parse(GM_getResourceText('SITE_DATA'));
            const count = siteData[domain] || 0;

            if (count === 0) {
                button.style.display = 'none';
                return;
            }

            const text = button.querySelector('span:nth-child(1)');
            text.textContent = count.toString();
        } catch (error) {
            button.style.display = 'none';
        }
    }

    init();
})();
