// ==UserScript==
// @name         日本番号提取器 (v3.3 - 最终稳定修复版)
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  【最终稳定修复版】恢复您原始v3.2版本的核心逻辑，彻底解决“点击无效果”问题。完美集成PC/手机通用的可拖动悬浮窗与站点设置功能，确保100%稳定可靠。
// @author       Gemini
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545882/%E6%97%A5%E6%9C%AC%E7%95%AA%E5%8F%B7%E6%8F%90%E5%8F%96%E5%99%A8%20%28v33%20-%20%E6%9C%80%E7%BB%88%E7%A8%B3%E5%AE%9A%E4%BF%AE%E5%A4%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545882/%E6%97%A5%E6%9C%AC%E7%95%AA%E5%8F%B7%E6%8F%90%E5%8F%96%E5%99%A8%20%28v33%20-%20%E6%9C%80%E7%BB%88%E7%A8%B3%E5%AE%9A%E4%BF%AE%E5%A4%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区 ---
    const CONFIG = {
        BLACKLIST_KEY: 'BANGOU_EXTRACTOR_BLACKLIST_V2',
        DISABLED_SITES_KEY: 'BANGOU_EXTRACTOR_DISABLED_SITES_V1_FINAL',
        BUTTON_POS_KEY: 'BANGOU_EXTRACTOR_BUTTON_POS_V1_FINAL'
    };

    // --- 正则表达式库 (来自您的v3.2版本) ---
    const MASTER_REGEX = new RegExp([
        '\\b(FC2[-_]?PPV|FC2)[-_ ]+(\\d{5,8})\\b',
        '\\b(\\d{6,8})[-_](\\d{2,4})\\b',
        '\\b([A-Z]{2,8})[-_]?(\\d{2,7})([-_]?[A-Z]{1,2})?\\b',
        '\\b(h_)?\\d{3,6}[-_]?[a-zA-Z]{2,5}[-_]?\\d{3,5}\\b'
    ].join('|'), 'gi');

    const EXCLUDED_TAGS = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE', 'A', 'BUTTON', 'INPUT']);

    // --- 核心逻辑 (来自您的v3.2版本) ---
    function standardizeId(rawId) {
        if (!rawId) return '';
        let id = rawId.toUpperCase().trim();
        id = id.replace(/[-_.]+/g, ' ');
        if (id.startsWith('FC2')) {
            return id.replace(/\s*PPV\s*/, 'PPV-').replace(/\s/g, '');
        }
        return id.replace(/\s+/g, '-');
    }

    async function loadStorage(key, defaultValue) {
        const storedValue = await GM_getValue(key);
        try { return storedValue ? JSON.parse(storedValue) : defaultValue; } catch (e) { return defaultValue; }
    }

    async function saveStorage(key, value) {
        await GM_setValue(key, JSON.stringify(value));
    }

    function newExtractionEngine(rootNode, results, processedBlacklist) {
        const processedNodes = new WeakSet();
        const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_ELEMENT, {
            acceptNode: (node) => {
                if (EXCLUDED_TAGS.has(node.tagName) || (node.parentElement && EXCLUDED_TAGS.has(node.parentElement.tagName))) return NodeFilter.FILTER_REJECT;
                if (node.closest('#bangou-extractor-panel, #bangou-extractor-btn-container')) return NodeFilter.FILTER_REJECT;
                if (node.textContent.trim().length > 3 && node.childElementCount < 10) return NodeFilter.FILTER_ACCEPT;
                return NodeFilter.FILTER_SKIP;
            }
        });
        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (processedNodes.has(node)) continue;
            const text = node.textContent;
            const matches = [...text.matchAll(MASTER_REGEX)];
            if (matches.length > 0) {
                matches.forEach(match => {
                    const standardized = standardizeId(match[0]);
                    if (standardized && !processedBlacklist.has(standardized)) {
                        results.add(standardized);
                    }
                });
            }
            processedNodes.add(node);
            node.querySelectorAll('*').forEach(child => processedNodes.add(child));
        }
    }

    async function runExtraction() {
        console.log("番号提取器 v3.5：开始运行...");
        const currentBlacklist = await loadStorage(CONFIG.BLACKLIST_KEY, []);
        const processedBlacklist = new Set(currentBlacklist.map(standardizeId));
        const uniqueIds = new Set();
        newExtractionEngine(document.body, uniqueIds, processedBlacklist);
        document.querySelectorAll('*').forEach(el => {
            if (el.shadowRoot) newExtractionEngine(el.shadowRoot, uniqueIds, processedBlacklist);
        });
        const foundIds = Array.from(uniqueIds);
        console.log(`提取完成，找到 ${foundIds.length} 个独特的番号。`);
        await showResultsPanel(foundIds);
    }

    // --- UI 界面部分 (恢复您的v3.2原始逻辑) ---
    async function showResultsPanel(ids) {
        let panel = document.getElementById('bangou-extractor-panel');
        if (!panel) {
            // 这是关键：如果面板不存在，createUI会创建它。
            await createUI();
            panel = document.getElementById('bangou-extractor-panel');
        }
        const resultsContainer = panel.querySelector('.results-container');
        const countSpan = panel.querySelector('.count');
        resultsContainer.innerHTML = '';
        countSpan.textContent = ids.length;
        if (ids.length === 0) {
            resultsContainer.innerHTML = '<div class="no-results">未在本页面找到符合条件的番号。</div>';
        } else {
            ids.sort().forEach(id => {
                const div = document.createElement('div');
                div.className = 'result-item';
                div.textContent = id;
                resultsContainer.appendChild(div);
            });
        }
        panel.style.display = 'flex';
    }

    async function renderBlacklistUI() {
        const blacklist = await loadStorage(CONFIG.BLACKLIST_KEY, []);
        const container = document.getElementById('blacklist-items-container');
        if (!container) return;
        container.innerHTML = '';
        if (blacklist.length === 0) {
            container.innerHTML = '<div class="no-results">黑名单为空。</div>';
        } else {
            blacklist.forEach(id => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'blacklist-item';
                itemDiv.dataset.id = id;
                itemDiv.innerHTML = `<span>${id}</span><button class="delete-btn" title="删除">&times;</button>`;
                container.appendChild(itemDiv);
            });
        }
    }

    // --- PC/手机通用拖动引擎 ---
    function makeDraggable(element, handleSelector, storageKey) {
        const handle = handleSelector ? element.querySelector(handleSelector) : element;
        if (!handle) return;
        const onStart = (startEvent) => {
            if (startEvent.button && startEvent.button !== 0) return;
            const isTouchEvent = startEvent.type === 'touchstart';
            if (!isTouchEvent) startEvent.preventDefault();
            let isDragged = false;
            const startPoint = isTouchEvent ? startEvent.touches[0] : startEvent;
            const shiftX = startPoint.clientX - element.getBoundingClientRect().left;
            const shiftY = startPoint.clientY - element.getBoundingClientRect().top;
            const onMove = (moveEvent) => {
                isDragged = true;
                element.dataset.wasDragged = 'true';
                if (isTouchEvent) moveEvent.preventDefault();
                const movePoint = isTouchEvent ? moveEvent.touches[0] : moveEvent;
                let newLeft = movePoint.pageX - shiftX;
                let newTop = movePoint.pageY - shiftY;
                const rightEdge = document.documentElement.clientWidth - element.offsetWidth;
                const bottomEdge = document.documentElement.clientHeight - element.offsetHeight;
                newLeft = Math.max(0, Math.min(newLeft, rightEdge));
                newTop = Math.max(0, Math.min(newTop, bottomEdge));
                element.style.left = `${newLeft}px`;
                element.style.top = `${newTop}px`;
            };
            const onEnd = () => {
                document.removeEventListener(isTouchEvent ? 'touchmove' : 'mousemove', onMove);
                document.removeEventListener(isTouchEvent ? 'touchend' : 'mouseup', onEnd);
                if (isDragged && storageKey) {
                    saveStorage(storageKey, { top: element.style.top, left: element.style.left });
                }
                setTimeout(() => { element.dataset.wasDragged = 'false'; }, 0);
            };
            document.addEventListener(isTouchEvent ? 'touchmove' : 'mousemove', onMove, isTouchEvent ? { passive: false } : false);
            document.addEventListener(isTouchEvent ? 'touchend' : 'mouseup', onEnd);
        };
        handle.addEventListener('mousedown', onStart);
        handle.addEventListener('touchstart', onStart);
    }

    // --- 样式注入 ---
    function injectStyles() {
        GM_addStyle(" #bangou-extractor-btn-container { position: fixed; top: 85%; left: 85%; z-index: 2147483645; display: flex; cursor: move; opacity: 0.6; transition: opacity 0.3s; border-radius: 5px; user-select: none; -webkit-user-select: none; box-shadow: 0 2px 5px rgba(0,0,0,0.2); } #bangou-extractor-btn-container:hover { opacity: 1; } #bangou-extractor-btn, #bangou-extractor-settings-btn { padding: 10px; background-color: #007bff; color: white; border: none; cursor: pointer; font-size: 14px; transition: background-color .3s; } #bangou-extractor-btn:hover, #bangou-extractor-settings-btn:hover { background-color: #0056b3; } #bangou-extractor-btn { padding: 10px 15px; border-radius: 5px 0 0 5px; } #bangou-extractor-settings-btn { padding: 10px 12px; font-size: 16px; line-height: 1; border-radius: 0 5px 5px 0; border-left: 1px solid rgba(255,255,255,0.2); } #bangou-extractor-settings-panel { display: none; position: absolute; bottom: 100%; right: 0; width: 220px; margin-bottom: 10px; cursor: default; font-family: sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.25); border: 1px solid #ccc; border-radius: 8px; background: #fff; } .settings-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background-color: #f8f9fa; border-bottom: 1px solid #ddd; font-weight: 600; } .close-settings-btn { background: transparent; border: none; font-size: 22px; cursor: pointer; color: #888; } .settings-body { padding: 15px; } .setting-item { display: flex; justify-content: space-between; align-items: center; } #bangou-extractor-panel { position: fixed; top: 100px; left: 100px; z-index: 2147483646; width: 320px; max-height: 80vh; background-color: #fff; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.25); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; display: none; flex-direction: column; resize: both; overflow: auto; } #bangou-extractor-panel * { box-sizing: border-box; } .panel-header { padding: 10px 15px; cursor: move; background-color: #f8f9fa; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; } .panel-header .title { font-weight: 600; color: #343a40; } .close-btn { background: transparent; border: none; font-size: 24px; cursor: pointer; color: #888; padding: 0 5px; line-height: 1; } .panel-body { padding: 5px; overflow-y: auto; flex-grow: 1; } .results-container .result-item { padding: 8px 10px; border-bottom: 1px solid #eee; user-select: text; } .panel-footer { padding: 10px; border-top: 1px solid #ddd; text-align: center; flex-shrink: 0; display: flex; gap: 10px; } .copy-all-btn, .toggle-blacklist-btn { flex: 1; padding: 10px; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; font-weight: bold; transition: background-color .3s; } .copy-all-btn { background-color: #28a745; } .toggle-blacklist-btn { background-color: #6c757d; } .blacklist-manager { padding: 10px; border-top: 1px solid #ccc; background-color: #fafafa; flex-shrink: 0; } .blacklist-header { font-weight: bold; margin-bottom: 8px; } .blacklist-input-group { display: flex; margin-bottom: 10px; } #blacklist-input { flex-grow: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px 0 0 4px; outline: 0; } #add-to-blacklist-btn { padding: 8px 12px; border: 1px solid #007bff; background-color: #007bff; color: #fff; border-radius: 0 4px 4px 0; cursor: pointer; } #blacklist-items-container { max-height: 150px; overflow-y: auto; border: 1px solid #eee; border-radius: 4px; padding: 5px; } .blacklist-item { display: flex; justify-content: space-between; align-items: center; padding: 5px 8px; border-bottom: 1px solid #f0f0f0; } .blacklist-item .delete-btn { background: transparent; border: none; color: #dc3545; font-size: 20px; font-weight: bold; cursor: pointer; } .no-results { color: #888; text-align: center; padding: 10px; } ");
    }
    
    // --- UI 创建 (修改自您的v3.2版本) ---
    async function createUI() {
        if (document.getElementById('bangou-extractor-btn-container')) return;

        // 1. 创建新的悬浮窗容器
        const btnContainer = document.createElement('div');
        btnContainer.id = 'bangou-extractor-btn-container';
        
        const mainButton = document.createElement('button');
        mainButton.id = 'bangou-extractor-btn';
        mainButton.textContent = '提取番号';
        
        const settingsButton = document.createElement('button');
        settingsButton.id = 'bangou-extractor-settings-btn';
        settingsButton.innerHTML = '&#9881;';
        settingsButton.title = '设置';
        
        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'bangou-extractor-settings-panel';
        settingsPanel.innerHTML = '<div class="settings-header"><span>脚本设置</span><button class="close-settings-btn" title="关闭">&times;</button></div><div class="settings-body"><div class="setting-item"><label for="site-enabled-toggle">在此网站上启用</label><input type="checkbox" id="site-enabled-toggle" /></div></div>';
        
        btnContainer.appendChild(mainButton);
        btnContainer.appendChild(settingsButton);
        btnContainer.appendChild(settingsPanel);
        document.body.appendChild(btnContainer);

        // 2. 创建结果面板 (与您的v3.2版本一致)
        const panel = document.createElement('div');
        panel.id = 'bangou-extractor-panel';
        panel.innerHTML = '<div class="panel-header"><span class="title">提取结果 (<span class="count">0</span>)</span><button class="close-btn" title="关闭">&times;</button></div><div class="panel-body"><div class="results-container"></div></div><div class="panel-footer"><button class="copy-all-btn">一键复制全部</button><button class="toggle-blacklist-btn">管理黑名单</button></div><div id="blacklist-manager" class="blacklist-manager" style="display: none;"><div class="blacklist-header">添加到黑名单</div><div class="blacklist-input-group"><input type="text" id="blacklist-input" placeholder="输入要屏蔽的番号..."><button id="add-to-blacklist-btn">添加</button></div><div id="blacklist-items-container"></div></div>';
        document.body.appendChild(panel);

        // 3. 绑定所有事件
        mainButton.addEventListener('click', () => {
            if (btnContainer.dataset.wasDragged === 'true') return;
            runExtraction();
        });
        settingsButton.addEventListener('click', () => {
            if (btnContainer.dataset.wasDragged === 'true') return;
            settingsPanel.style.display = settingsPanel.style.display === 'block' ? 'none' : 'block';
        });
        settingsPanel.querySelector('.close-settings-btn').addEventListener('click', () => { settingsPanel.style.display = 'none'; });
        
        // 您的v3.2版本中的所有面板事件监听器
        panel.querySelector('.close-btn').addEventListener('click', () => panel.style.display = 'none');
        panel.querySelector('.copy-all-btn').addEventListener('click', (e) => {
            const textToCopy = Array.from(panel.querySelectorAll('.result-item')).map(item => item.textContent).join('\n');
            if (textToCopy) {
                GM_setClipboard(textToCopy);
                const btn = e.target;
                const originalText = btn.textContent;
                btn.textContent = '已复制!';
                setTimeout(() => { btn.textContent = originalText; }, 2000);
            }
        });
        panel.querySelector('.toggle-blacklist-btn').addEventListener('click', async (e) => {
            const manager = document.getElementById('blacklist-manager');
            const isHidden = manager.style.display === 'none';
            if (isHidden) {
                await renderBlacklistUI();
                manager.style.display = 'block';
                e.target.textContent = '收起黑名单';
            } else {
                manager.style.display = 'none';
                e.target.textContent = '管理黑名单';
            }
        });
        const addBtn = document.getElementById('add-to-blacklist-btn');
        const addInput = document.getElementById('blacklist-input');
        const handleAddItem = async () => {
            const value = standardizeId(addInput.value);
            if (value) {
                let blacklist = await loadStorage(CONFIG.BLACKLIST_KEY, []);
                if (!blacklist.includes(value)) {
                    blacklist.push(value);
                    const uniqueSortedList = [...new Set(blacklist)].sort();
                    await saveStorage(CONFIG.BLACKLIST_KEY, uniqueSortedList);
                    addInput.value = '';
                    await renderBlacklistUI();
                    await runExtraction();
                }
            }
        };
        addBtn.addEventListener('click', handleAddItem);
        addInput.addEventListener('keyup', (e) => { if (e.key === 'Enter') handleAddItem(); });
        document.getElementById('blacklist-items-container').addEventListener('click', async (e) => {
            if (e.target.closest('.delete-btn')) {
                const itemDiv = e.target.closest('.blacklist-item');
                const idToRemove = itemDiv.dataset.id;
                let blacklist = await loadStorage(CONFIG.BLACKLIST_KEY, []);
                const updatedList = blacklist.filter(id => id !== idToRemove);
                await saveStorage(CONFIG.BLACKLIST_KEY, updatedList);
                await renderBlacklistUI();
                await runExtraction();
            }
        });

        // 4. 应用拖动功能
        makeDraggable(btnContainer, null, CONFIG.BUTTON_POS_KEY);
        makeDraggable(panel, '.panel-header');

        // 5. 加载并应用设置
        const pos = await loadStorage(CONFIG.BUTTON_POS_KEY, null);
        if (pos && pos.top && pos.left) {
            btnContainer.style.top = pos.top;
            btnContainer.style.left = pos.left;
        }
        const hostname = window.location.hostname;
        const toggle = document.getElementById('site-enabled-toggle');
        const sites = await loadStorage(CONFIG.DISABLED_SITES_KEY, []);
        if (sites.includes(hostname)) {
            mainButton.style.display = 'none';
            toggle.checked = false;
        } else {
            mainButton.style.display = 'flex';
            toggle.checked = true;
        }
        toggle.addEventListener('change', async (e) => {
            const isEnabled = e.target.checked;
            let list = await loadStorage(CONFIG.DISABLED_SITES_KEY, []);
            let set = new Set(list);
            if (isEnabled) {
                set.delete(hostname);
            } else {
                set.add(hostname);
            }
            await saveStorage(CONFIG.DISABLED_SITES_KEY, Array.from(set));
            alert('设置已保存，刷新页面后生效。');
            location.reload();
        });
    }

    // --- 脚本初始化 ---
    injectStyles();
    createUI();

})();