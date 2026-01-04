// ==UserScript==
// @name         sis001
// @namespace    https://sleazyfork.org/zh-CN/users/1461640-%E6%98%9F%E5%AE%BF%E8%80%81%E9%AD%94
// @version      0.2.7
// @description  sis001第一会所综合社区，帖子图片预览，板块收纳，搜索优化
// @author       星宿老魔
// @license      MIT
// @match        https://sis001.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sis001.com
// @downloadURL https://update.greasyfork.org/scripts/545988/sis001.user.js
// @updateURL https://update.greasyfork.org/scripts/545988/sis001.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // 即时注入折叠CSS，防止加载完成前出现闪烁
    (function injectEarlyCollapseCSS() {
        const style = document.createElement('style');
        style.setAttribute('data-sis-early-collapse', '1');
        style.textContent = `
            /* 公共消息默认收起 */
            #pmprompt table { display: none !important; }
            /* 本版规则默认收起：隐藏除 span/h3 外的直接子元素 */
            #rules > :not(span):not(h3) { display: none !important; }
        `;
        document.documentElement.appendChild(style);
    })();

    // 常量
    const STORAGE_KEYS = {
        collectNames: 'sis_board_collect_names',
        favoriteNames: 'sis_board_favorite_names',
        favoriteOpen: 'sis_board_favorite_open',
        searchFavForums: 'sis_search_fav_forums',
        searchFavAuto: 'sis_search_fav_auto',
        previewCache: 'sis_preview_cache_v1'
    };

    const PREVIEW_CACHE_TTL_MS = 15 * 60 * 1000; // 15分钟

    // --- 配置项 ---
    const MAX_PREVIEW_CONCURRENCY = 9; // 图片预览并发上限
    const MAX_IMAGES_PER_POST = 3;   // 每帖最多显示的预览图数量

    function getPreviewCache() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.previewCache) || '{}'); } catch (_) { return {}; }
    }
    function setPreviewCache(map) {
        try { localStorage.setItem(STORAGE_KEYS.previewCache, JSON.stringify(map)); } catch (_) {}
    }
    function getPreviewCacheEntry(threadURL) {
        const map = getPreviewCache();
        const it = map[threadURL];
        if (!it) return null;
        if (Date.now() - it.ts > PREVIEW_CACHE_TTL_MS) return null;
        return Array.isArray(it.urls) ? it.urls : null;
    }
    function savePreviewCacheEntry(threadURL, urls) {
        const map = getPreviewCache();
        map[threadURL] = { ts: Date.now(), urls: urls.slice(0, MAX_IMAGES_PER_POST) };
        // 简单限流：最多存 200 条
        const keys = Object.keys(map);
        if (keys.length > 200) {
            keys.sort((a,b)=> (map[a].ts||0) - (map[b].ts||0));
            for (let i=0;i<keys.length-200;i++) delete map[keys[i]];
        }
        setPreviewCache(map);
    }

    // 内容页哈希值自动转磁力链接
    function setupMagnetLinks() {
        if (!document.querySelector('.t_msgfont')) return;
        const postMessages = document.querySelectorAll('.t_msgfont');
        postMessages.forEach((post) => {
            if (post.dataset.magnetsProcessed) return;
            // 使用更简单的正则，直接匹配并替换
            const hashRegex = /([a-fA-F0-9]{40})/g;
            if (hashRegex.test(post.innerHTML)) {
                post.innerHTML = post.innerHTML.replace(hashRegex, (match) => {
                    return `magnet:?xt=urn:btih:${match}`;
                });
            }
            post.dataset.magnetsProcessed = 'true';
        });
    }

    // 并发执行工具
    async function runWithConcurrency(items, worker, limit = 8) {
        const queue = [...items];
        const running = new Set();
        const results = [];
        async function runNext() {
            if (queue.length === 0) return;
            const item = queue.shift();
            const p = (async () => worker(item))().then((res) => {
                results.push(res);
            }).finally(() => running.delete(p));
            running.add(p);
            if (running.size >= limit) await Promise.race(Array.from(running));
            return runNext();
        }
        await runNext();
        await Promise.all(Array.from(running));
        return results;
    }

    // 检测电脑版链接并自动跳转
    var links = document.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
        if (links[i].textContent && links[i].textContent.indexOf('电脑版') !== -1) {
            window.location.href = links[i].href;
            break;
        }
    }

    // 本版规则默认收起
    function setupRulesCollapse() {
        const rulesElement = document.getElementById('rules');
        if (!rulesElement) return;

        const contentElements = Array.from(rulesElement.children).filter(child =>
            child.tagName !== 'SPAN' && child.tagName !== 'H3'
        );

        contentElements.forEach(element => {
            element.style.display = 'none';
        });

        const toggleImg = document.getElementById('rules_img');
        if (toggleImg) {
            toggleImg.src = 'images/green001/collapsed_yes.gif';
        }
    }

    // 公共消息默认收起
    function setupPublicMessageCollapse() {
        const pmPrompt = document.getElementById('pmprompt');
        if (!pmPrompt) return;

        const pmTable = pmPrompt.querySelector('table');
        if (!pmTable) return;

        const title = pmPrompt.querySelector('h4');
        if (!title) return;

        pmTable.style.display = 'none';

        title.style.cursor = 'pointer';
        title.style.userSelect = 'none';
        title.style.padding = '5px';
        title.style.borderRadius = '3px';
        title.style.transition = 'background-color 0.2s';

        title.innerHTML += ' <span style="font-size: 12px; color: #666;">[点击展开]</span>';

        title.addEventListener('click', function() {
            if (pmTable.style.display === 'none') {
                pmTable.style.display = 'table';
                title.innerHTML = title.innerHTML.replace('[点击展开]', '[点击收起]');
                title.style.backgroundColor = '#f0f0f0';
            } else {
                pmTable.style.display = 'none';
                title.innerHTML = title.innerHTML.replace('[点击收起]', '[点击展开]');
                title.style.backgroundColor = '';
            }
        });

        title.addEventListener('mouseenter', function() {
            if (pmTable.style.display === 'none') {
                title.style.backgroundColor = '#f5f5f5';
            }
        });

        title.addEventListener('mouseleave', function() {
            if (pmTable.style.display === 'none') {
                title.style.backgroundColor = '';
            }
        });
    }

    // 特殊主题板块折叠
    function setupSpecialTopicsCollapse() {
        const theadElements = document.querySelectorAll('thead.separation');

        theadElements.forEach(thead => {
            const fontElements = thead.querySelectorAll('font');
            let isSpecialTopic = false;
            let topicType = '';

            fontElements.forEach(fontElement => {
                const text = fontElement.textContent;
                if (text.includes('重要主題')) {
                    isSpecialTopic = true;
                    topicType = '重要主題';
                } else if (text.includes('固定主題')) {
                    isSpecialTopic = true;
                    topicType = '固定主題';
                } else if (text.includes('推荐主题')) {
                    isSpecialTopic = true;
                    topicType = '推荐主题';
                }
            });

            if (isSpecialTopic) {
                const titleRow = thead.querySelector('tr');
                if (!titleRow) return;

                let nextElement = thead.nextElementSibling;
                const contentElements = [];

                while (nextElement && nextElement.tagName === 'TBODY') {
                    contentElements.push(nextElement);
                    nextElement = nextElement.nextElementSibling;
                }

                if (contentElements.length === 0) return;

                contentElements.forEach(element => {
                    element.style.display = 'none';
                });

                titleRow.style.cursor = 'pointer';
                titleRow.style.userSelect = 'none';
                titleRow.style.transition = 'background-color 0.2s';

                const titleCell = titleRow.querySelector('td[colspan="4"]');
                if (titleCell) {
                    const originalHTML = titleCell.innerHTML;
                    titleCell.innerHTML = originalHTML + ' <span style="font-size: 12px; color: #666; margin-left: 10px;">[点击展开]</span>';

                    titleRow.addEventListener('click', function() {
                        const isHidden = contentElements[0].style.display === 'none';

                        if (isHidden) {
                            contentElements.forEach(element => {
                                element.style.display = '';
                            });
                            titleCell.innerHTML = originalHTML + ' <span style="font-size: 12px; color: #666; margin-left: 10px;">[点击收起]</span>';
                            titleRow.style.backgroundColor = '#f0f0f0';
                        } else {
                            contentElements.forEach(element => {
                                element.style.display = 'none';
                            });
                            titleCell.innerHTML = originalHTML + ' <span style="font-size: 12px; color: #666; margin-left: 10px;">[点击展开]</span>';
                            titleRow.style.backgroundColor = '';
                        }
                    });

                    titleRow.addEventListener('mouseenter', function() {
                        if (contentElements[0].style.display === 'none') {
                            titleRow.style.backgroundColor = '#f5f5f5';
                        }
                    });

                    titleRow.addEventListener('mouseleave', function() {
                        if (contentElements[0].style.display === 'none') {
                            titleRow.style.backgroundColor = '';
                        }
                    });
                }
            }
        });
    }

    // 读取/保存 收纳板块名单
    function getCollectedBoardNames() {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.collectNames);
            if (!raw) return [];
            const arr = JSON.parse(raw);
            return Array.isArray(arr) ? arr : [];
        } catch (_) { return []; }
    }
    function setCollectedBoardNames(names) {
        try { localStorage.setItem(STORAGE_KEYS.collectNames, JSON.stringify(names || [])); } catch (_) {}
    }

    // 收藏区：存取函数
    function getFavoriteBoardNames() {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.favoriteNames);
            if (!raw) return [];
            const arr = JSON.parse(raw);
            return Array.isArray(arr) ? arr : [];
        } catch (_) { return []; }
    }
    function setFavoriteBoardNames(names) {
        try { localStorage.setItem(STORAGE_KEYS.favoriteNames, JSON.stringify(names || [])); } catch (_) {}
    }
    function getFavoriteOpen() {
        try { return localStorage.getItem(STORAGE_KEYS.favoriteOpen) === '1'; } catch (_) { return false; }
    }
    function setFavoriteOpen(isOpen) {
        try { localStorage.setItem(STORAGE_KEYS.favoriteOpen, isOpen ? '1' : '0'); } catch (_) {}
    }

    // 搜索页：常用版块置顶与默认勾选
    function getSearchFavForums() {
        try { const raw = localStorage.getItem(STORAGE_KEYS.searchFavForums); return raw ? JSON.parse(raw) : []; } catch (_) { return []; }
    }
    function setSearchFavForums(values) {
        try { localStorage.setItem(STORAGE_KEYS.searchFavForums, JSON.stringify(values || [])); } catch (_) {}
    }
    function getSearchFavAuto() {
        try { return localStorage.getItem(STORAGE_KEYS.searchFavAuto) === '1'; } catch (_) { return false; }
    }
    function setSearchFavAuto(v) {
        try { localStorage.setItem(STORAGE_KEYS.searchFavAuto, v ? '1' : '0'); } catch (_) {}
    }

    function openSearchFavSettings(selectEl) {
        const allOptions = Array.from(selectEl.querySelectorAll('option')).filter(o => o.value);
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:10001;display:flex;align-items:center;justify-content:center;';

        const panel = document.createElement('div');
        panel.style.cssText = 'width:1100px;max-width:96vw;max-height:90vh;overflow:auto;background:#fff;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.2);';

        const header = document.createElement('div');
        header.style.cssText = 'padding:12px 16px;border-bottom:1px solid #e9ecef;font-weight:600;display:flex;justify-content:space-between;align-items:center;';
        header.textContent = '置顶设置';

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.textContent = '×';
        applyUnifiedButtonStyle(closeBtn);
        closeBtn.onclick = () => overlay.remove();
        header.appendChild(closeBtn);

        const body = document.createElement('div');
        body.style.cssText = 'padding:12px 16px;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;';

        // 分组：按 optgroup 组织，未分组的放到“其他”
        const favSet = new Set(getSearchFavForums());
        const groups = [];
        const optgroups = Array.from(selectEl.querySelectorAll('optgroup'));
        optgroups.forEach(og => {
            const options = Array.from(og.querySelectorAll('option')).filter(o => o.value);
            if (options.length > 0) groups.push({ label: og.label || '分组', options });
        });
        const ungrouped = Array.from(selectEl.children).filter(n => n.tagName === 'OPTION' && n.value && n.value !== 'all');
        if (ungrouped.length > 0) groups.unshift({ label: '其他', options: ungrouped });

        groups.forEach(group => {
            const card = document.createElement('div');
            card.style.cssText = 'border:1px solid #e9ecef;border-radius:8px;overflow:hidden;background:#fff;';
            const title = document.createElement('div');
            title.textContent = group.label;
            title.style.cssText = 'padding:8px 10px;background:#f8f9fa;border-bottom:1px solid #e9ecef;font-weight:600;color:#2c3e50;font-size:12px;';
            const list = document.createElement('div');
            list.style.cssText = 'padding:8px 10px;display:flex;flex-direction:column;gap:6px;';
            group.options.forEach(opt => {
                const label = document.createElement('label');
                label.style.cssText = 'display:flex;align-items:center;gap:6px;padding:6px;border:1px solid #eee;border-radius:6px;';
                const cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = favSet.has(opt.value);
                cb.onchange = () => { if (cb.checked) favSet.add(opt.value); else favSet.delete(opt.value); };
                const span = document.createElement('span'); span.textContent = opt.textContent.trim();
                label.appendChild(cb); label.appendChild(span); list.appendChild(label);
            });
            card.appendChild(title); card.appendChild(list);
            body.appendChild(card);
        });

        const footer = document.createElement('div');
        footer.style.cssText = 'padding:12px 16px;border-top:1px solid #e9ecef;display:flex;justify-content:flex-end;gap:10px;';
        const cancel = document.createElement('button'); cancel.type = 'button'; cancel.textContent = '取消'; applyUnifiedButtonStyle(cancel);
        const save = document.createElement('button'); save.type = 'button'; save.textContent = '保存并刷新'; applyUnifiedButtonStyle(save);
        cancel.onclick = () => overlay.remove();
        save.onclick = () => { setSearchFavForums(Array.from(favSet)); location.reload(); };
        footer.appendChild(cancel); footer.appendChild(save);

        panel.appendChild(header); panel.appendChild(body); panel.appendChild(footer);
        overlay.appendChild(panel); document.body.appendChild(overlay);
    }

    function setupSearchFavorites() {
        if (!/\/search\.php(\?|$)/.test(location.pathname + location.search)) return;
        const select = document.getElementById('srchfid');
        if (!select || select.tagName !== 'SELECT' || !select.multiple) return;

        // 管理按钮 + 拨动开关
        const tools = document.createElement('div');
        tools.style.cssText = 'margin:6px 0;display:flex;gap:12px;align-items:center;';
        const btn = document.createElement('button'); btn.type = 'button'; btn.textContent = '置顶设置'; applyUnifiedButtonStyle(btn); btn.style.height = '30px';
        btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); openSearchFavSettings(select); });

        ensureToggleStyles();
        const switchWrap = document.createElement('label');
        switchWrap.className = 'sis-toggle';
        const switchInput = document.createElement('input');
        switchInput.type = 'checkbox';
        switchInput.className = 'sis-input';
        switchInput.checked = getSearchFavAuto();
        const switchText = document.createElement('span'); switchText.className = 'sis-text'; switchText.textContent = '多选记忆';
        const slider = document.createElement('span'); slider.className = 'sis-switch';
        // 顺序：input(隐藏) + 文本 + 开关，点击整体可切换
        switchWrap.appendChild(switchInput); switchWrap.appendChild(switchText); switchWrap.appendChild(slider);

        switchInput.addEventListener('change', () => {
            setSearchFavAuto(switchInput.checked);
            // 若开启记忆并且当前已有选中，立即保存为“上次选择”
            if (switchInput.checked) {
                const chosen = Array.from(select.selectedOptions).map(o => o.value).filter(Boolean);
                if (chosen.length > 0) setSearchFavForums(chosen);
            }
        });

        tools.appendChild(btn);
        tools.appendChild(switchWrap);
        select.parentNode.insertBefore(tools, select);

        // 置顶 optgroup
        const favVals = getSearchFavForums();
        if (favVals.length > 0) {
            const topGroup = document.createElement('optgroup');
            topGroup.label = '常用置顶';
            // 插到最前
            select.insertBefore(topGroup, select.firstChild);
            const options = Array.from(select.querySelectorAll('option'));
            favVals.forEach(val => {
                const opt = options.find(o => o.value === val);
                if (opt) topGroup.appendChild(opt);
            });
            if (getSearchFavAuto()) {
                // 清空原有默认选中，避免页面自带默认项残留
                Array.from(select.options).forEach(o => o.selected = false);
                Array.from(topGroup.querySelectorAll('option')).forEach(o => o.selected = true);
            }
        }

        // 若开启记忆：监听选择变化，自动保存为“上次选择”
        if (getSearchFavAuto()) {
            select.addEventListener('change', () => {
                const chosen = Array.from(select.selectedOptions).map(o => o.value).filter(Boolean);
                setSearchFavForums(chosen);
            });
        }
    }

    // 互斥规范化：收藏优先，移除收纳中的重名
    function normalizeExclusiveLists() {
        const fav = new Set(getFavoriteBoardNames());
        const col = new Set(getCollectedBoardNames());
        let changed = false;
        fav.forEach(name => { if (col.has(name)) { col.delete(name); changed = true; } });
        if (changed) setCollectedBoardNames(Array.from(col));
    }

    // 获取所有板块元素映射：name -> element（包含原始区域与两个容器中）
    function findBoardElementsMap() {
        const map = new Map();
        const lists = document.querySelectorAll('div.mainbox.forumlist');
        lists.forEach(el => {
            const a = el.querySelector('h3 > a');
            const name = a ? a.textContent.trim() : '';
            if (name && !map.has(name)) map.set(name, el);
        });
        return map;
    }

    // 搬移指定板块到目标容器内容区
    function moveBoardsToContainer(boardNames, targetContentEl) {
        const map = findBoardElementsMap();
        const moved = [];
        boardNames.forEach(name => {
            const el = map.get(name);
            if (el) {
                targetContentEl.appendChild(el);
                moved.push(name);
            }
        });
        return moved;
    }

    // 统一按钮样式：仿“设置”按钮，文字居中对齐
    function applyUnifiedButtonStyle(btn, { primary = false } = {}) {
        btn.style.cssText = [
            'display:inline-flex',
            'align-items:center',
            'justify-content:center',
            'height:28px',
            'padding:0 12px',
            'border-radius:6px',
            'font-size:12px',
            'line-height:1',
            'cursor:pointer',
            'user-select:none',
            'white-space:nowrap',
            'box-sizing:border-box',
            primary
                ? 'background:#fff;color:#2c3e50;border:1px solid #e3e6ea'
                : 'background:#fff;color:#2c3e50;border:1px solid #e3e6ea'
        ].join(';');
        btn.onmouseenter = () => { btn.style.background = '#f5f5f5'; };
        btn.onmouseleave = () => { btn.style.background = '#fff'; };
    }

    // 注入拨动开关样式
    function ensureToggleStyles() {
        if (document.querySelector('style[data-sis-toggle-style="1"]')) return;
        const style = document.createElement('style');
        style.setAttribute('data-sis-toggle-style', '1');
        style.textContent = `
            .sis-toggle { display:inline-flex; align-items:center; gap:6px; cursor:pointer; user-select:none; height:28px; padding:0 12px; border:1px solid #e3e6ea; border-radius:6px; background:#fff; box-shadow:0 2px 6px rgba(0,0,0,.08); vertical-align:middle; box-sizing:border-box; }
            .sis-toggle:hover { background:#f5f5f5; }
            .sis-toggle .sis-input { position:absolute; opacity:0; width:0; height:0; }
            /* 更小尺寸的拨动开关（30x16, knob 12） */
            .sis-toggle .sis-switch { position:relative; width:30px; height:16px; background:#e5e7eb; border-radius:999px; box-shadow: inset 0 0 0 1px #d1d5db; transition: background .2s ease; flex:0 0 30px; }
            .sis-toggle .sis-switch::before { content:""; position:absolute; top:2px; left:2px; width:12px; height:12px; background:#fff; border-radius:50%; box-shadow:0 1px 2px rgba(0,0,0,.2); transition: transform .2s ease; }
            .sis-toggle .sis-input:checked + .sis-text + .sis-switch { background:#00599F; }
            .sis-toggle .sis-input:checked + .sis-text + .sis-switch::before { transform: translateX(14px); }
            .sis-toggle .sis-text { color:#333; font-size:12px; }
        `;
        document.head.appendChild(style);
    }

    // 解析相对地址为绝对地址
    function resolveUrl(baseUrl, maybeRelativeUrl) {
        try {
            return new URL(maybeRelativeUrl, baseUrl).href;
        } catch (_) {
            return maybeRelativeUrl;
        }
    }

    // 弹窗：板块收纳设置
    function openBoardCollectSettings(allBoardNames, selectedNames) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:10001;display:flex;align-items:center;justify-content:center;`;

        const panel = document.createElement('div');
        panel.style.cssText = `width:520px;max-width:92vw;max-height:80vh;overflow:auto;background:#fff;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.2);`;

        const header = document.createElement('div');
        header.style.cssText = `padding:12px 16px;border-bottom:1px solid #e9ecef;font-weight:600;display:flex;justify-content:space-between;align-items:center;`;
        header.textContent = '板块收纳设置';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = 'margin-left:auto;font-size:18px;background:transparent;border:none;cursor:pointer;padding:4px 8px;';
        closeBtn.onclick = () => overlay.remove();
        header.appendChild(closeBtn);

        const body = document.createElement('div');
        body.style.cssText = 'padding:12px 16px;';

        const hint = document.createElement('div');
        hint.textContent = '勾选需要收纳到顶部的板块：';
        hint.style.cssText = 'color:#666;margin-bottom:8px;';
        body.appendChild(hint);

        const list = document.createElement('div');
        list.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:6px;';
        const selected = new Set(selectedNames);
        allBoardNames.forEach(name => {
            const label = document.createElement('label');
            label.style.cssText = 'display:flex;align-items:center;gap:6px;padding:6px;border:1px solid #eee;border-radius:6px;';
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = selected.has(name);
            cb.onchange = () => { if (cb.checked) selected.add(name); else selected.delete(name); };
            const span = document.createElement('span');
            span.textContent = name;
            label.appendChild(cb);
            label.appendChild(span);
            list.appendChild(label);
        });
        body.appendChild(list);

        const footer = document.createElement('div');
        footer.style.cssText = 'padding:12px 16px;border-top:1px solid #e9ecef;display:flex;justify-content:flex-end;gap:10px;';
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        applyUnifiedButtonStyle(cancelBtn);
        cancelBtn.onclick = () => overlay.remove();
        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存并刷新';
        applyUnifiedButtonStyle(saveBtn);
        saveBtn.onclick = () => {
            const collectChosen = Array.from(selected);
            // 收纳优先时，需把这些板块从收藏区移除，保持互斥
            const favSet = new Set(getFavoriteBoardNames());
            collectChosen.forEach(n => { if (favSet.has(n)) favSet.delete(n); });
            setFavoriteBoardNames(Array.from(favSet));
            setCollectedBoardNames(collectChosen);
            location.reload();
        };
        footer.appendChild(cancelBtn);
        footer.appendChild(saveBtn);

        panel.appendChild(header);
        panel.appendChild(body);
        panel.appendChild(footer);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
    }

    // 收藏区：设置面板
    function openBoardFavoriteSettings(allBoardNames, selectedNames) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:10001;display:flex;align-items:center;justify-content:center;`;

        const panel = document.createElement('div');
        panel.style.cssText = `width:520px;max-width:92vw;max-height:80vh;overflow:auto;background:#fff;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.2);`;

        const header = document.createElement('div');
        header.style.cssText = `padding:12px 16px;border-bottom:1px solid #e9ecef;font-weight:600;display:flex;justify-content:space-between;align-items:center;`;
        header.textContent = '板块收藏设置';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        applyUnifiedButtonStyle(closeBtn);
        closeBtn.onclick = () => overlay.remove();
        header.appendChild(closeBtn);

        const body = document.createElement('div');
        body.style.cssText = 'padding:12px 16px;';
        const hint = document.createElement('div');
        hint.textContent = '勾选需要加入“板块收藏区”的板块：';
        hint.style.cssText = 'color:#666;margin-bottom:8px;';
        body.appendChild(hint);

        const list = document.createElement('div');
        list.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:6px;';
        const selected = new Set(selectedNames);
        allBoardNames.forEach(name => {
            const label = document.createElement('label');
            label.style.cssText = 'display:flex;align-items:center;gap:6px;padding:6px;border:1px solid #eee;border-radius:6px;';
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = selected.has(name);
            cb.onchange = () => { if (cb.checked) selected.add(name); else selected.delete(name); };
            const span = document.createElement('span');
            span.textContent = name;
            label.appendChild(cb);
            label.appendChild(span);
            list.appendChild(label);
        });
        body.appendChild(list);

        const footer = document.createElement('div');
        footer.style.cssText = 'padding:12px 16px;border-top:1px solid #e9ecef;display:flex;justify-content:flex-end;gap:10px;';
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        applyUnifiedButtonStyle(cancelBtn);
        cancelBtn.onclick = () => overlay.remove();
        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存并刷新';
        applyUnifiedButtonStyle(saveBtn);
        saveBtn.onclick = () => {
            const favChosen = Array.from(selected);
            // 收藏优先：从收纳中移除重名
            const colSet = new Set(getCollectedBoardNames());
            favChosen.forEach(n => { if (colSet.has(n)) colSet.delete(n); });
            setCollectedBoardNames(Array.from(colSet));
            setFavoriteBoardNames(favChosen);
            location.reload();
        };
        footer.appendChild(cancelBtn);
        footer.appendChild(saveBtn);

        panel.appendChild(header);
        panel.appendChild(body);
        panel.appendChild(footer);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
    }

    // 在左上角注入使用 Shadow DOM 的悬浮“板块隐藏”按钮，避免被站点样式影响
    function injectBoardCollectSettingsButton() {
        // 清理旧的菜单按钮
        const old = document.getElementById('sis-board-toggle');
        if (old && old.closest('li')) old.closest('li').remove();

        if (document.getElementById('sis-board-float')) return;

        const host = document.createElement('div');
        host.id = 'sis-board-float';
        host.style.position = 'fixed';
        host.style.left = '8px';
        host.style.top = '48px';
        host.style.zIndex = '2147483647';
        host.style.pointerEvents = 'auto';
        document.documentElement.appendChild(host);

        const shadow = host.attachShadow ? host.attachShadow({ mode: 'open' }) : null;
        const root = shadow || host; // 旧浏览器兜底

        const style = document.createElement('style');
        style.textContent = `
            :host { all: initial; }
            .wrap { position: relative; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif; }
            .btn { background: rgba(255,255,255,0.96); color: #2c3e50; border: 1px solid #e3e6ea; border-radius: 8px; padding: 6px 10px; box-shadow: 0 2px 8px rgba(0,0,0,.12); cursor: pointer; font-weight: 600; font-size: 12px; user-select: none; }
            .menu { display: none; position: absolute; left: 0; top: calc(100% + 6px); background: #fff; border: 1px solid #e3e6ea; box-shadow: 0 4px 12px rgba(0,0,0,.12); border-radius: 6px; min-width: 160px; }
            .item { display: block; padding: 8px 12px; color: #333; white-space: nowrap; text-decoration: none; font-size: 12px; }
            .item:hover { background: #f5f5f5; }
        `;

        const wrap = document.createElement('div');
        wrap.className = 'wrap';

        const btn = document.createElement('div');
        btn.className = 'btn';
        btn.textContent = '板块隐藏';

        const menu = document.createElement('div');
        menu.className = 'menu';

        function createItem(text, handler) {
            const a = document.createElement('a');
            a.className = 'item';
            a.href = 'javascript:void(0)';
            a.textContent = text;
            a.addEventListener('click', () => { menu.style.display = 'none'; handler(); });
            return a;
        }

        menu.appendChild(createItem('展开/收起收纳区 (Alt+B)', () => {
            const content = document.getElementById('board-collection-content');
            const header = document.querySelector('#board-collection-container > div');
            if (!content || !header) return;
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? '' : 'none';
            const hint = header.querySelector('span:last-child');
            if (hint) hint.textContent = isHidden ? '[点击收起]' : '[点击展开]';
            header.style.background = isHidden ? '#f0f2f5' : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)';
        }));
        menu.appendChild(createItem('设置收纳板块… (Alt+M)', () => {
            const boards = Array.from(document.querySelectorAll('div.mainbox.forumlist > h3 > a'))
                .map(a => a.textContent.trim()).filter(Boolean);
            const uniqueBoards = Array.from(new Set(boards));
            openBoardCollectSettings(uniqueBoards, getCollectedBoardNames());
        }));

        btn.addEventListener('mouseenter', () => menu.style.display = 'block');
        wrap.addEventListener('mouseleave', () => menu.style.display = 'none');
        btn.addEventListener('click', () => menu.style.display = menu.style.display === 'block' ? 'none' : 'block');

        wrap.appendChild(btn);
        wrap.appendChild(menu);
        root.appendChild(style);
        root.appendChild(wrap);

        // 保活：周期性检测
        if (!window.__sisBoardFloatInterval) {
            window.__sisBoardFloatInterval = setInterval(() => {
                if (!document.getElementById('sis-board-float')) {
                    injectBoardCollectSettingsButton();
                }
            }, 5000);
        }

        // 兜底：1.2 秒后若被移除则重建
        setTimeout(() => {
            if (!document.getElementById('sis-board-float')) {
                injectBoardCollectSettingsButton();
            }
        }, 1200);
    }

    // 全局快捷键：Alt+B 展开/收起，Alt+M 打开设置
    function setupBoardHotkeys() {
        if (window.__sisBoardHotkeysReady) return;
        window.__sisBoardHotkeysReady = true;
        document.addEventListener('keydown', (e) => {
            if (!e.altKey) return;
            if (e.key.toLowerCase() === 'b') {
                const content = document.getElementById('board-collection-content');
                const header = document.querySelector('#board-collection-container > div');
                if (!content || !header) return;
                const isHidden = content.style.display === 'none';
                content.style.display = isHidden ? '' : 'none';
                const hint = header.querySelector('span:last-child');
                if (hint) hint.textContent = isHidden ? '[点击收起]' : '[点击展开]';
                header.style.background = isHidden ? '#f0f2f5' : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)';
            } else if (e.key.toLowerCase() === 'm') {
                const boards = Array.from(document.querySelectorAll('div.mainbox.forumlist > h3 > a'))
                    .map(a => a.textContent.trim()).filter(Boolean);
                const uniqueBoards = Array.from(new Set(boards));
                openBoardCollectSettings(uniqueBoards, getCollectedBoardNames());
            }
        });
    }

    // 顶部板块收纳区：将选中的论坛板块统一折叠到一起
    function setupBoardCollectionCollapse() {
        if (document.getElementById('board-collection-container')) return;

        const toCollect = new Set(getCollectedBoardNames());

        const allForumLists = Array.from(document.querySelectorAll('div.mainbox.forumlist'));
        if (allForumLists.length === 0) return;

        const matched = allForumLists.filter(list => {
            const h3a = list.querySelector('h3 > a');
            const name = h3a ? h3a.textContent.trim() : '';
            return name && toCollect.has(name);
        });
        const first = (matched[0] || allForumLists[0]);
        const parent = first.parentNode;

        const container = document.createElement('div');
        container.id = 'board-collection-container';
        container.style.cssText = `
            margin: 12px 0;
            border: 1px solid #e3e6ea;
            border-radius: 10px;
            box-shadow: 0 3px 12px rgba(0,0,0,0.08);
            overflow: hidden;
            background: #fff;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            padding: 10px 14px;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border-bottom: 1px solid #e9ecef;
            cursor: pointer;
            user-select: none;
            display: flex;
            align-items: center;
            justify-content: space-between;
        `;

        const title = document.createElement('span');
        title.textContent = `板块收纳区（共 ${matched.length} 个）`;
        title.style.cssText = `font-weight:600;color:#2c3e50;font-size:14px;`;

        const toggleHint = document.createElement('span');
        toggleHint.textContent = '[点击展开]';
        toggleHint.style.cssText = 'font-size:12px;color:#666;';

        // 设置按钮
        const settingsBtn = document.createElement('button');
        settingsBtn.textContent = '设置';
        settingsBtn.title = '选择需要收纳的板块';
        applyUnifiedButtonStyle(settingsBtn);
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const boards = Array.from(document.querySelectorAll('div.mainbox.forumlist > h3 > a'))
                .map(a => a.textContent.trim()).filter(Boolean);
            const uniqueBoards = Array.from(new Set(boards));
            openBoardCollectSettings(uniqueBoards, getCollectedBoardNames());
        });

        const rightWrap = document.createElement('div');
        rightWrap.style.cssText = 'display:flex;align-items:center;gap:10px;';
        rightWrap.appendChild(toggleHint);
        rightWrap.appendChild(settingsBtn);

        header.appendChild(title);
        header.appendChild(rightWrap);

        const content = document.createElement('div');
        content.id = 'board-collection-content';
        content.style.cssText = 'display:none;padding:10px;background:rgba(248,249,250,0.6);';

        header.addEventListener('click', () => {
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? '' : 'none';
            toggleHint.textContent = isHidden ? '[点击收起]' : '[点击展开]';
            if (isHidden) {
                header.style.background = '#e9ecef';
            } else {
                header.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)';
            }
        });

        container.appendChild(header);
        container.appendChild(content);

        // 目标锚点：热门标签区后面
        const hotTable = document.querySelector('table.portalbox[summary="HeadBox"]')
            || (document.getElementById('hottags') ? document.getElementById('hottags').closest('table') : null)
            || document.getElementById('hottags');

        if (hotTable && hotTable.parentNode) {
            const p = hotTable.parentNode;
            if (hotTable.nextSibling) {
                p.insertBefore(container, hotTable.nextSibling);
            } else {
                p.appendChild(container);
            }
        } else if (parent && first && parent.contains(first)) {
            // 回退：插在第一个匹配板块前
            parent.insertBefore(container, first);
        } else {
            // 最终回退：追加到 body
            (parent || document.body).appendChild(container);
        }

        if (matched.length === 0) {
            const empty = document.createElement('div');
            empty.textContent = '未选择任何板块，可点击右侧“设置”进行选择。';
            empty.style.cssText = 'color:#666;font-size:12px;';
            content.appendChild(empty);
        } else {
            moveBoardsToContainer(matched.map(el => (el.querySelector('h3 > a') || {textContent:''}).textContent.trim()), content);
        }
    }

    // 板块收藏区：与收纳区相同，但记住展开/收起状态
    function setupBoardFavoriteSection() {
        if (document.getElementById('board-favorite-container')) return;

        const toFav = new Set(getFavoriteBoardNames());
        const allForumLists = Array.from(document.querySelectorAll('div.mainbox.forumlist'));
        if (allForumLists.length === 0) return;

        const matched = allForumLists.filter(list => {
            const h3a = list.querySelector('h3 > a');
            const name = h3a ? h3a.textContent.trim() : '';
            return name && toFav.has(name);
        });

        const container = document.createElement('div');
        container.id = 'board-favorite-container';
        container.style.cssText = `
            margin: 12px 0;
            border: 1px solid #e3e6ea;
            border-radius: 10px;
            box-shadow: 0 3px 12px rgba(0,0,0,0.08);
            overflow: hidden;
            background: #fff;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            padding: 10px 14px;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border-bottom: 1px solid #e9ecef;
            cursor: pointer;
            user-select: none;
            display: flex;
            align-items: center;
            justify-content: space-between;
        `;

        const title = document.createElement('span');
        title.textContent = `板块收藏区（共 ${matched.length} 个）`;
        title.style.cssText = `font-weight:600;color:#2c3e50;font-size:14px;`;

        const toggleHint = document.createElement('span');
        toggleHint.textContent = getFavoriteOpen() ? '[点击收起]' : '[点击展开]';
        toggleHint.style.cssText = 'font-size:12px;color:#666;';

        const settingsBtn = document.createElement('button');
        settingsBtn.textContent = '设置';
        settingsBtn.title = '选择加入收藏区的板块';
        applyUnifiedButtonStyle(settingsBtn);
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const boards = Array.from(document.querySelectorAll('div.mainbox.forumlist > h3 > a'))
                .map(a => a.textContent.trim()).filter(Boolean);
            const uniqueBoards = Array.from(new Set(boards));
            openBoardFavoriteSettings(uniqueBoards, getFavoriteBoardNames());
        });

        const rightWrap = document.createElement('div');
        rightWrap.style.cssText = 'display:flex;align-items:center;gap:10px;';
        rightWrap.appendChild(toggleHint);
        rightWrap.appendChild(settingsBtn);

        header.appendChild(title);
        header.appendChild(rightWrap);

        const content = document.createElement('div');
        content.id = 'board-favorite-content';
        content.style.cssText = 'padding:10px;background:rgba(248,249,250,0.6);';
        content.style.display = getFavoriteOpen() ? '' : 'none';

        header.addEventListener('click', () => {
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? '' : 'none';
            toggleHint.textContent = isHidden ? '[点击收起]' : '[点击展开]';
            if (isHidden) {
                header.style.background = '#e9ecef';
            } else {
                header.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)';
            }
            setFavoriteOpen(isHidden);
        });

        container.appendChild(header);
        container.appendChild(content);

        // 插入位置：紧跟在“板块收纳区”容器之后
        const collectContainer = document.getElementById('board-collection-container');
        if (collectContainer && collectContainer.parentNode) {
            const p = collectContainer.parentNode;
            if (collectContainer.nextSibling) {
                p.insertBefore(container, collectContainer.nextSibling);
            } else {
                p.appendChild(container);
            }
        } else {
            // 回退：热门标签后
            const hotTable = document.querySelector('table.portalbox[summary="HeadBox"]')
                || (document.getElementById('hottags') ? document.getElementById('hottags').closest('table') : null)
                || document.getElementById('hottags');
            if (hotTable && hotTable.parentNode) {
                const p = hotTable.parentNode;
                if (hotTable.nextSibling) p.insertBefore(container, hotTable.nextSibling);
                else p.appendChild(container);
            } else {
                document.body.appendChild(container);
            }
        }

        if (matched.length === 0) {
            const empty = document.createElement('div');
            empty.textContent = '未选择任何收藏板块，可点击右侧“设置”进行选择。';
            empty.style.cssText = 'color:#666;font-size:12px;';
            content.appendChild(empty);
        } else {
            moveBoardsToContainer(matched.map(el => (el.querySelector('h3 > a') || {textContent:''}).textContent.trim()), content);
        }
    }

    // =========================================================================
    // MODIFIED/NEW FUNCTIONS START
    // =========================================================================

    // 选择最合适的图片真实地址
    function selectImageSource(imgEl) {
        const blacklistSubstrings = [
            'images/common/', 'images/attachicons/', 'images/smilies/',
            'static', 'hrline', 'back.gif', 'thanks.gif', 'icon'
        ];

        const isHttpUrl = (url) => typeof url === 'string' && /^https?:\/\//i.test(url);
        const isBlacklisted = (url) => blacklistSubstrings.some(s => url && url.includes(s));
        const isLikelyPlaceholderGif = (url, el) => {
            if (!/\.gif(\?|$)/i.test(url)) return false;
            const onclick = el.getAttribute('onclick') || '';
            if (onclick.includes('zoom(this)')) return false;
            return true;
        };

        const candidates = [];

        const preferAttrs = ['file', 'data-original', 'original', 'data-src', 'src'];
        for (const attr of preferAttrs) {
            const v = imgEl.getAttribute(attr);
            if (isHttpUrl(v) && !isBlacklisted(v)) {
                candidates.push(v);
            }
        }

        for (let i = 0; i < imgEl.attributes.length; i++) {
            const v = imgEl.attributes[i].value;
            if (isHttpUrl(v) && !isBlacklisted(v) && !candidates.includes(v)) {
                candidates.push(v);
            }
        }

        if (candidates.length === 0) {
            return imgEl.getAttribute('src') || '';
        }

        const nonGif = candidates.find(u => !isLikelyPlaceholderGif(u, imgEl));
        return nonGif || candidates[0];
    }

    // 新的辅助函数：仅获取图片URL，不修改页面
    async function fetchImageUrls(threadURL) {
        const cached = getPreviewCacheEntry(threadURL);
        if (cached) {
            return cached;
        }

        try {
            const response = await fetch(threadURL);
            const pageContent = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(pageContent, "text/html");

            const imgElements = Array.from(doc.querySelectorAll('img')).filter((img) => {
                const chosen = selectImageSource(img);
                if (!chosen) return false;
                const isHttp = /^https?:\/\//i.test(chosen);
                const isRelativeAttachment = /(^|\/)attachments\//i.test(chosen);
                if (!isHttp && !isRelativeAttachment) return false;
                const blacklist = ['images/common/','images/attachicons/','images/smilies/','static','hrline','back.gif','thanks.gif','icon'];
                if (blacklist.some(s => chosen.includes(s))) return false;
                return true;
            });

            const urls = imgElements.slice(0, MAX_IMAGES_PER_POST).map(imgEl => resolveUrl(threadURL, selectImageSource(imgEl)));
            savePreviewCacheEntry(threadURL, urls);
            return urls;
        } catch (e) {
            console.error(`[SIS-Preview] Failed to fetch images for ${threadURL}:`, e);
            return [];
        }
    }

    // 重构后的主函数
    async function displayThreadImages() {
        if (document.querySelector('.postmessage') || document.querySelector('#postlist') || document.querySelector('.plhin')) {
            return;
        }

        const isSearchPage = window.location.href.includes('/search.php');
        const isTagPage = window.location.href.includes('/tag.php');

        let allPostRows = [];

        if (isSearchPage || isTagPage) {
            const searchRows = document.querySelectorAll('tbody');
            allPostRows = Array.from(searchRows).filter(tbody => {
                const postLink = tbody.querySelector('a[href*="thread-"]');
                const hasIcon = tbody.querySelector('.icon');
                return postLink && hasIcon;
            });
        } else {
            const normalThreadRows = document.querySelectorAll('tbody[id^="normalthread_"]');
            allPostRows = [...normalThreadRows];
        }

        const processTasks = allPostRows.map((tbody) => async () => {
            if (tbody.id && tbody.id.startsWith('stickthread_')) {
                return;
            }

            if (tbody.querySelector('.new-post-layout')) {
                return;
            }

            const postLink = tbody.querySelector('a[href*="thread-"]');
            if (!postLink) {
                return;
            }

            const threadURL = postLink.href;

            const imageUrls = await fetchImageUrls(threadURL);

            let postTitle = postLink.textContent.trim();
            if (!postTitle) {
                const titleSpan = tbody.querySelector('span[id^="thread_"]');
                if (titleSpan) {
                    postTitle = titleSpan.textContent.trim();
                }
            }

            tbody.innerHTML = '';

            const newTr = document.createElement('tr');
            const newTd = document.createElement('td');
            newTd.setAttribute('colspan', '6');
            newTd.style.cssText = `padding: 4px !important; border: none !important; background: transparent !important;`;

            const container = document.createElement('div');
            container.classList.add('new-post-layout');
            container.style.cssText = `
                background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
                border: 1px solid #e3e6ea;
                border-radius: 12px;
                box-shadow: 0 3px 12px rgba(0,0,0,0.08);
                overflow: hidden;
                transition: all 0.3s ease;
            `;

            container.addEventListener('mouseenter', () => {
                container.style.transform = 'translateY(-2px)';
                container.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)';
            });

            container.addEventListener('mouseleave', () => {
                container.style.transform = 'translateY(0)';
                container.style.boxShadow = '0 3px 12px rgba(0,0,0,0.08)';
            });

            const titleSection = document.createElement('div');
            titleSection.style.cssText = `
                padding: 12px 16px;
                background: rgba(255,255,255,0.9);
            `;

            const titleLink = document.createElement('a');
            titleLink.href = threadURL;
            titleLink.textContent = postTitle || '无标题';
            titleLink.style.cssText = `
                font-weight: 500;
                color: #2c3e50;
                font-size: 15px;
                line-height: 1.3;
                text-decoration: none;
                transition: color 0.2s ease;
                display: block;
                word-break: break-word;
            `;

            titleLink.addEventListener('mouseenter', () => titleLink.style.color = '#667eea');
            titleLink.addEventListener('mouseleave', () => titleLink.style.color = '#2c3e50');

            titleSection.appendChild(titleLink);
            container.appendChild(titleSection);

            if (imageUrls && imageUrls.length > 0) {
                titleSection.style.borderBottom = '1px solid #e9ecef';

                const imageSection = document.createElement('div');
                imageSection.style.cssText = `
                    padding: 8px 16px;
                    background: rgba(248,249,250,0.6);
                    display: flex;
                    gap: 10px;
                    min-height: 184px;
                `;

                imageUrls.forEach((url, index) => {
                    const imgContainer = document.createElement("div");
                    imgContainer.style.cssText = `
                        flex: 1; cursor: pointer; transition: all 0.2s ease;
                        border-radius: 8px; overflow: hidden;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.12); height: 184px;
                    `;
                    const img = document.createElement("img");
                    img.src = url;
                    img.loading = 'lazy';
                    img.style.cssText = `
                        width: 100%; height: 100%; object-fit: cover;
                        display: block; transition: transform 0.2s ease;
                    `;
                    img.onerror = function() {
                        this.style.background = '#f0f0f0';
                        this.alt = '图片加载失败';
                    };
                    imgContainer.addEventListener('mouseenter', () => {
                        imgContainer.style.transform = 'translateY(-2px)';
                        imgContainer.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    });
                    imgContainer.addEventListener('mouseleave', () => {
                        imgContainer.style.transform = 'translateY(0)';
                        imgContainer.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
                    });
                    imgContainer.addEventListener('click', () => {
                        const viewerImages = imageUrls.map(u => { const fake = document.createElement('img'); fake.setAttribute('src', u); return fake; });
                        showImageViewer(viewerImages, index, threadURL);
                    });
                    imgContainer.appendChild(img);
                    imageSection.appendChild(imgContainer);
                });
                container.appendChild(imageSection);
            }

            newTd.appendChild(container);
            newTr.appendChild(newTd);
            tbody.appendChild(newTr);
        });

        await runWithConcurrency(processTasks, (task) => task(), MAX_PREVIEW_CONCURRENCY);
    }

    // =========================================================================
    // MODIFIED/NEW FUNCTIONS END
    // =========================================================================

    // 图片查看器
    function showImageViewer(images, startIndex, baseURL) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.9); z-index: 10000;
            display: flex; align-items: center; justify-content: center;
        `;

        const imageContainer = document.createElement('div');
        imageContainer.style.cssText = `
            position: relative; max-width: 90%; max-height: 90%; text-align: center;
        `;

        const img = document.createElement('img');
        img.style.cssText = `
            max-width: 100%; max-height: 100%;
            object-fit: contain; border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        `;

        let currentIndex = startIndex;

        function updateImage() {
            const chosen = selectImageSource(images[currentIndex]);
            img.src = resolveUrl(baseURL || location.href, chosen);
            if (imageInfo) {
                imageInfo.textContent = `${currentIndex + 1} / ${images.length}`;
            }
        }

        const imageInfo = document.createElement('div');
        imageInfo.style.cssText = `
            position: absolute; top: -40px; left: 50%;
            transform: translateX(-50%); color: white;
            font-size: 16px; font-weight: bold;
            background: rgba(0,0,0,0.7); padding: 8px 16px; border-radius: 20px;
        `;

        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '&#10094;';
        prevBtn.style.cssText = `
            position: absolute; left: -60px; top: 50%;
            transform: translateY(-50%); background: rgba(255,255,255,0.2);
            color: white; border: none; font-size: 24px;
            width: 44px; height: 44px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: background 0.3s;
        `;

        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = '&#10095;';
        nextBtn.style.cssText = `
            position: absolute; right: -60px; top: 50%;
            transform: translateY(-50%); background: rgba(255,255,255,0.2);
            border: none; color: white; font-size: 24px;
            width: 44px; height: 44px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: background 0.3s;
        `;

        [prevBtn, nextBtn].forEach(btn => {
            btn.addEventListener('mouseenter', () => btn.style.background = 'rgba(255,255,255,0.4)');
            btn.addEventListener('mouseleave', () => btn.style.background = 'rgba(255,255,255,0.2)');
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateImage();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateImage();
        });

        const handleKeydown = (e) => {
            if (e.key === 'ArrowLeft') prevBtn.click();
            else if (e.key === 'ArrowRight') nextBtn.click();
            else if (e.key === 'Escape') overlay.remove();
        };

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
                document.removeEventListener('keydown', handleKeydown);
            }
        });

        imageContainer.appendChild(imageInfo);
        imageContainer.appendChild(prevBtn);
        imageContainer.appendChild(nextBtn);
        imageContainer.appendChild(img);
        overlay.appendChild(imageContainer);

        document.body.appendChild(overlay);
        document.addEventListener('keydown', handleKeydown);

        updateImage();
    }

    // 尽早执行可折叠逻辑，避免等待资源加载
    try { setupRulesCollapse(); } catch (_) {}
    try { setupPublicMessageCollapse(); } catch (_) {}
    try { setupSpecialTopicsCollapse(); } catch (_) {}

    window.addEventListener('load', function() {
        normalizeExclusiveLists();
        displayThreadImages();
        // 再次调用，保证最终状态
        setupRulesCollapse();
        setupPublicMessageCollapse();
        setupSpecialTopicsCollapse();
        setupBoardCollectionCollapse();
        setupBoardFavoriteSection();
        setupSearchFavorites();
        setupBoardHotkeys();
    });

    // 尽早执行磁力链接转换
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupMagnetLinks);
    } else {
        setupMagnetLinks();
    }
})();