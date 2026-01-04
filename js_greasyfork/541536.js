// ==UserScript==
// @name         Cookie 管理器 (V12.2 最终完美修复版)
// @namespace    https://github.com/gemini-script-creator
// @version      12.2
// @description  最终版！强制将“一键删除”按钮字体设为红色，锁定全部功能。
// @author       Gemini & Pro User
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541536/Cookie%20%E7%AE%A1%E7%90%86%E5%99%A8%20%28V122%20%E6%9C%80%E7%BB%88%E5%AE%8C%E7%BE%8E%E4%BF%AE%E5%A4%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541536/Cookie%20%E7%AE%A1%E7%90%86%E5%99%A8%20%28V122%20%E6%9C%80%E7%BB%88%E5%AE%8C%E7%BE%8E%E4%BF%AE%E5%A4%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- ⭐ 用户自定义配置 ---
    const CONFIG = {
        iconSize: 38,
        iconImageUrl: '',
        initialPosition: { bottom: '80px', right: '15px' }
    };
    // --- ⭐ 配置结束 ---


    // --- 样式定义 ---
    function getStyles() {
        return `
            :host { all: initial; }
            #cookie-manager-btn-wrapper { position: fixed; width: ${CONFIG.iconSize}px; height: ${CONFIG.iconSize}px; z-index: 2147483647; cursor: grab; user-select: none; }
            #cookie-manager-btn-wrapper:active { cursor: grabbing; }
            #cookie-manager-btn-inner { width: 100%; height: 100%; border-radius: 50%; background-color: #007bff; color: white; font-size: ${Math.floor(CONFIG.iconSize * 0.5)}px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; justify-content: center; align-items: center; transition: transform 0.2s; }
            #cookie-manager-btn-wrapper:active #cookie-manager-btn-inner { transform: scale(0.9); }
            #cookie-manager-btn-inner img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
            #cookie-manager-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 450px; background-color: #f9f9f9; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 6px 12px rgba(0,0,0,0.3); z-index: 2147483647; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; font-size: 14px; max-height: 80vh; display: none; flex-direction: column; }
            #cookie-manager-header { padding: 12px 15px; background-color: #007bff; color: white; font-weight: bold; border-top-left-radius: 8px; border-top-right-radius: 8px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
            #cookie-manager-header .close-btn { cursor: pointer; font-size: 24px; font-weight: bold; }
            #cookie-manager-top-actions { padding: 12px 15px; border-bottom: 1px solid #eee; background-color: #f9f9f9; flex-shrink: 0; }
            #cookie-list-container { padding: 5px 15px; flex-grow: 1; overflow-y: auto; }
            .cookie-item { display: flex; flex-direction: column; border-bottom: 1px solid #eee; padding: 10px 0; }
            .cookie-item:last-child { border-bottom: none; }
            .cookie-key { font-weight: bold; color: #333; word-break: break-all; }
            .cookie-value { color: #555; margin: 4px 0; word-break: break-all; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; }
            .cookie-props { font-size: 11px; color: #888; margin-top: 4px; background-color: #eee; padding: 3px 6px; border-radius: 3px; }
            .prop-label { font-weight: bold; }
            .cookie-actions { display: flex; gap: 8px; margin-top: 8px; }
            .cookie-actions button { border: none; border-radius: 4px; padding: 5px 10px; font-size: 12px; font-weight: bold; color: white; cursor: pointer; transition: filter 0.2s, transform 0.1s; }
            .cookie-actions button:hover { filter: brightness(1.1); }
            .cookie-actions button:active { transform: scale(0.95); filter: brightness(0.9); }
            .cookie-actions .modify-btn { background-color: #007bff; }
            .cookie-actions .copy-btn { background-color: #6c757d; }
            .cookie-actions .delete-btn { background-color: #dc3545; }
            #cookie-manager-footer { padding: 10px 15px; border-top: 1px solid #eee; flex-shrink: 0; display: flex; justify-content: center; align-items: center; gap: 10px; }
            #cookie-manager-footer button { flex-shrink: 0; white-space: nowrap; padding: 5px 10px; cursor: pointer; border: 1px solid #ccc; background-color: #f0f0f0; color: #333; border-radius: 4px; font-size: 12px; }
            #edit-modal-overlay, #batch-add-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 2147483647; display: none; justify-content: center; align-items: center; }
            #edit-modal-content, #batch-add-modal-content { background: #fff; padding: 20px; border-radius: 8px; width: 90%; max-width: 500px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); display:flex; flex-direction:column; max-height: 90vh; }
            #edit-modal-content h3, #batch-add-modal-content h3 { margin-top: 0; margin-bottom: 20px; text-align: center; flex-shrink: 0; }
            .form-group { margin-bottom: 15px; }
            .form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
            .form-group input, .form-group textarea { width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc; box-sizing: border-box; font-family: inherit; }
            .form-group input[readonly], .form-group textarea[readonly] { background-color: #eee; cursor: not-allowed; }
            .form-group textarea { min-height: 80px; resize: vertical; }
            #modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; flex-shrink: 0; }
            #modal-actions button { padding: 8px 15px; border-radius: 4px; border: none; cursor: pointer; font-weight: bold; }
            #modal-save-btn, #batch-add-save-btn { background-color: #007bff; color: white; }
            #modal-cancel-btn, #batch-add-cancel-btn { background-color: #ccc; }
            .search-wrapper { display: flex; margin-top: 10px; }
            .search-wrapper input { flex: 1; padding: 8px; font-size: 14px; border: 1px solid #ccc; box-sizing: border-box; }
            .search-wrapper input:focus { outline: 1px solid #007bff; z-index: 1; }
            #search-by-key-input { border-top-left-radius: 4px; border-bottom-left-radius: 4px; }
            #search-by-value-input { border-left: none; border-top-right-radius: 4px; border-bottom-right-radius: 4px; }
            .actions-wrapper { display: flex; flex-direction: column; gap: 10px; }
            .actions-row { display: flex; gap: 10px; }
            .actions-row button { flex: 1; padding: 8px; font-size: 14px; border: none; cursor: pointer; border-radius: 4px; }
            #batch-add-btn { background-color: #28a745; color: white; }
            #single-add-btn { background-color: #17a2b8; color: white; }
            #copy-all-btn { background-color: #6c757d; color: white; }
            .batch-add-props { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; flex-shrink: 0; }
            #batch-input-area { overflow-y: auto; padding-right: 10px; border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding-top: 10px; margin-top: 15px;}
            .batch-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
            .batch-row input { flex: 1; }
            .batch-row .delete-row-btn { background: #dc3545; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; font-weight: bold; flex-shrink: 0; line-height: 24px; text-align:center; }
            #add-row-btn { margin-top: 10px; width: 100%; padding: 8px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; flex-shrink: 0; }
            .cookie-item-header { display: flex; align-items: center; gap: 8px; }
            .selection-checkbox { display: none; width: 16px; height: 16px; border: 1px solid #888; border-radius: 3px; cursor: pointer; flex-shrink: 0; }
            .selection-checkbox.checked { background-color: #007bff; color: white; text-align: center; line-height: 16px; font-weight: bold; }
            .selection-mode .selection-checkbox { display: inline-block; }
            #auto-match-area { border: 1px dashed #007bff; padding: 10px; border-radius: 4px; text-align: center; color: #555; cursor: pointer; margin-top: 15px; }
            /* 【⭐ 终极视觉修复】 */
            #delete-all-btn { color: #dc3545 !important; }
        `;
    }

    // --- ⭐ 双核引擎 (无变化) ---
    const hasCookieStore = !!window.cookieStore;
    const cookieManager = {
        async get() { if (hasCookieStore) { const cookies = await cookieStore.getAll(); return cookies.map(c => ({ key: c.name, value: c.value, domain: c.domain, path: c.path })); } else { if (!document.cookie) return []; return document.cookie.split(';').map(cookie => { const eqIndex = cookie.indexOf('='); if (eqIndex < 0) return null; return { key: cookie.substring(0, eqIndex).trim(), value: cookie.substring(eqIndex + 1).trim(), domain: 'N/A', path: 'N/A' }; }).filter(Boolean); } },
        async set(key, value, { domain, path, days = 365 } = {}) { try { if (hasCookieStore) { await cookieStore.set({ name: key, value, domain, path, expires: Date.now() + (days * 24 * 60 * 60 * 1000) }); } else { let expires = ""; if (days) { const date = new Date(); date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); expires = "; expires=" + date.toUTCString(); } const domainPart = domain ? `; domain=${domain}` : ''; const pathPart = path ? `; path=${path}` : ''; document.cookie = `${key}=${value || ""}${expires}${pathPart}${domainPart}`; } return true; } catch (e) { console.error("Cookie Manager Error:", e); if (e.message.includes('domain-match')) { alert(`设置失败！\n\n错误：您提供的Domain (${domain}) 与当前网站域不匹配。\n\n规则：脚本只能为当前网站 (${window.location.hostname}) 及其父域设置Cookie。`); } else { alert(`设置Cookie失败: ${e.message}`); } return false; } },
        async delete(cookie) { try { if (hasCookieStore) { await cookieStore.delete({ name: cookie.key, domain: cookie.domain, path: cookie.path }); } else { const domain = window.location.hostname; const path = window.location.pathname; document.cookie = `${cookie.key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`; document.cookie = `${cookie.key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domain}`; document.cookie = `${cookie.key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`; } return true; } catch (e) { console.error("Cookie Manager Error:", e); return false; } }
    };

    // --- 核心功能 (无变化) ---
    async function copyToClipboard(text) { try { await navigator.clipboard.writeText(text); alert('已复制到剪贴板！'); } catch (err) { alert('复制失败！'); } }

    // --- UI 创建和管理 ---
    let shadowRoot = null; let panel = null; let allCookies = []; let filteredCookies = [];
    let isInSelectionMode = false;
    let selectionPool = new Map();
    function getCookieId(cookie) { return `${cookie.key}||${cookie.domain}||${cookie.path}`; }

    function getPanel() { if (!shadowRoot) return null; if (!panel) { panel = shadowRoot.getElementById('cookie-manager-panel'); } return panel; }
    function showEditModal({ mode = 'add', cookie = {} } = {}) { const modalOverlay = shadowRoot.getElementById('edit-modal-overlay'); const modalTitle = shadowRoot.getElementById('modal-title'); const keyInput = shadowRoot.getElementById('cookie-key-input'); const valueInput = shadowRoot.getElementById('cookie-value-input'); const domainInput = shadowRoot.getElementById('cookie-domain-input'); const pathInput = shadowRoot.getElementById('cookie-path-input'); const expiresInput = shadowRoot.getElementById('cookie-expires-input'); const saveBtn = shadowRoot.getElementById('modal-save-btn'); const cancelBtn = shadowRoot.getElementById('modal-cancel-btn'); keyInput.readOnly = false; expiresInput.readOnly = false; saveBtn.style.backgroundColor = ''; if (mode === 'add') { modalTitle.textContent = '新增 Cookie'; saveBtn.textContent = '保存'; keyInput.value = ''; valueInput.value = ''; domainInput.value = hasCookieStore ? window.location.hostname : ''; pathInput.value = '/'; expiresInput.value = '365'; } else { modalTitle.textContent = '修改 Cookie'; saveBtn.textContent = '保存'; keyInput.value = decodeURIComponent(cookie.key); keyInput.readOnly = true; valueInput.value = decodeURIComponent(cookie.value); domainInput.value = cookie.domain || window.location.hostname; pathInput.value = cookie.path; expiresInput.value = '365'; } modalOverlay.style.display = 'flex'; const newSaveBtn = saveBtn.cloneNode(true); saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn); newSaveBtn.addEventListener('click', async () => { const newKey = keyInput.value.trim(); const newValue = valueInput.value; const newDomain = domainInput.value.trim(); const newPath = pathInput.value.trim() || '/'; const newExpires = parseInt(expiresInput.value.trim(), 10); if (!newKey) { alert('Cookie 名称 (key) 不能为空！'); return; } const options = { days: isNaN(newExpires) ? 365 : newExpires, path: newPath, domain: newDomain }; let proceed = true; if (mode === 'add' && hasCookieStore) { const existingCookie = await cookieStore.get({ name: newKey, domain: newDomain, path: newPath }); if (existingCookie) { proceed = confirm(`警告：一个具有相同名称、域和路径的Cookie已存在。\n您确定要覆盖它吗？`); } } if (!proceed) { return; } let success = false; if (mode === 'modify') { await cookieManager.delete(cookie); success = await cookieManager.set(newKey, newValue, options); } else { success = await cookieManager.set(newKey, newValue, options); } if (success) { alert(`${mode === 'add' ? '新增' : '修改'}成功！`); modalOverlay.style.display = 'none'; await renderPanelContent(); } }); cancelBtn.onclick = () => { modalOverlay.style.display = 'none'; }; }
    function addNewBatchRow(key = '', value = '') { const inputArea = shadowRoot.getElementById('batch-input-area'); const row = document.createElement('div'); row.className = 'batch-row'; row.innerHTML = ` <input type="text" class="batch-key" placeholder="Key" value="${key}"> <input type="text" class="batch-value" placeholder="Value" value="${value}"> <button class="delete-row-btn">&times;</button> `; row.querySelector('.delete-row-btn').onclick = () => row.remove(); inputArea.appendChild(row); }
    function parseAndPopulate(text) { const inputArea = shadowRoot.getElementById('batch-input-area'); inputArea.innerHTML = ''; const pairs = text.trim().split(';').map(p => p.trim()).filter(Boolean); pairs.forEach(pair => { const eqIndex = pair.indexOf('='); if (eqIndex > 0) { const key = pair.substring(0, eqIndex).trim(); const value = pair.substring(eqIndex + 1).trim(); if (key) { addNewBatchRow(key, value); } } }); if (inputArea.children.length === 0) { addNewBatchRow(); } }
    function showBatchAddModal() { const modalOverlay = shadowRoot.getElementById('batch-add-modal-overlay'); const saveBtn = shadowRoot.getElementById('batch-add-save-btn'); const cancelBtn = shadowRoot.getElementById('batch-add-cancel-btn'); const addRowBtn = shadowRoot.getElementById('add-row-btn'); const inputArea = shadowRoot.getElementById('batch-input-area'); const domainInput = shadowRoot.getElementById('batch-domain-input'); const pathInput = shadowRoot.getElementById('batch-path-input'); const autoMatchArea = shadowRoot.getElementById('auto-match-area'); domainInput.value = hasCookieStore ? window.location.hostname : ''; pathInput.value = '/'; inputArea.innerHTML = ''; addNewBatchRow(); modalOverlay.style.display = 'flex'; addRowBtn.onclick = () => addNewBatchRow(); autoMatchArea.addEventListener('input', () => { parseAndPopulate(autoMatchArea.value); }); autoMatchArea.addEventListener('paste', (e) => { e.preventDefault(); const pastedText = (e.clipboardData || window.clipboardData).getData('text'); autoMatchArea.value = pastedText; parseAndPopulate(pastedText); }); const newSaveBtn = saveBtn.cloneNode(true); saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn); newSaveBtn.addEventListener('click', async () => { const domain = domainInput.value.trim(); const path = pathInput.value.trim() || '/'; const rows = inputArea.querySelectorAll('.batch-row'); const cookiesToAdd = []; rows.forEach(row => { const key = row.querySelector('.batch-key').value.trim(); const value = row.querySelector('.batch-value').value.trim(); if (key) { cookiesToAdd.push({ key, value }); } }); if (cookiesToAdd.length === 0) { alert('请输入至少一个有效的Cookie！'); return; } const promises = cookiesToAdd.map(cookie => cookieManager.set(cookie.key, cookie.value, { domain, path })); const results = await Promise.all(promises); const successCount = results.filter(Boolean).length; alert(`批量操作完成！\n成功设置了 ${successCount} / ${cookiesToAdd.length} 个Cookie。`); if (successCount > 0) { modalOverlay.style.display = 'none'; await renderPanelContent(); } }); cancelBtn.onclick = () => { modalOverlay.style.display = 'none'; }; }
    async function renderPanelContent() { isInSelectionMode = false; selectionPool.clear(); const currentPanel = getPanel(); if (!currentPanel) return; currentPanel.className = ''; currentPanel.innerHTML = ` <div id="cookie-manager-header"><span>Cookie 管理器 ${!hasCookieStore ? '(兼容模式)' : ''}</span><span class="close-btn">&times;</span></div> <div id="cookie-manager-top-actions"> <div class="actions-wrapper"> <div class="actions-row"> <button id="batch-add-btn">批量添加Cookie</button> <button id="single-add-btn">单个添加Cookie</button> </div> <div class="actions-row"> <button id="copy-all-btn">一键复制所有Cookie</button> </div> </div> <div class="search-wrapper"> <input type="search" id="search-by-key-input" placeholder="按 key 搜索..."> <input type="search" id="search-by-value-input" placeholder="按 value 搜索..."> </div> </div> <div id="cookie-list-container"></div> <div id="cookie-manager-footer"></div> `; allCookies = await cookieManager.get(); filteredCookies = allCookies; updateListView(); addStaticPanelEventListeners(); }
    function updateListView() { const listContainer = shadowRoot.querySelector('#cookie-list-container'); const footer = shadowRoot.querySelector('#cookie-manager-footer'); listContainer.innerHTML = ''; footer.innerHTML = ''; if (filteredCookies.length === 0) { listContainer.innerHTML = '<p style="text-align:center;color:#888;padding:20px 0;">没有找到匹配的 Cookie。</p>'; } else { renderCookieList(); } renderFooter(); }
    
    function renderFooter() {
        const footer = shadowRoot.querySelector('#cookie-manager-footer'); if (!footer) return;
        let centerControlsHTML = '';
        if (isInSelectionMode) {
            const selectionCount = selectionPool.size;
            centerControlsHTML = `
                <button id="copy-selected-btn" title="复制选中的Cookie">复制已选(${selectionCount})</button>
                <button id="delete-selected-btn" title="删除选中的Cookie" style="background-color:#dc3545; color:white;">删除已选(${selectionCount})</button>
            `;
        } else {
            centerControlsHTML = `<button id="delete-all-btn" title="删除当前网站的所有Cookie">一键删除Cookie</button>`;
        }
        
        footer.innerHTML = `<button id="selection-mode-btn">批量选择</button>${centerControlsHTML}`;

        const selectionModeBtn = footer.querySelector('#selection-mode-btn');
        if (isInSelectionMode) { selectionModeBtn.textContent = '取消选择'; selectionModeBtn.style.backgroundColor = '#ffc107'; }

        selectionModeBtn.addEventListener('click', () => { isInSelectionMode = !isInSelectionMode; if (!isInSelectionMode) { selectionPool.clear(); } getPanel().classList.toggle('selection-mode'); updateListView(); });

        if (isInSelectionMode) {
            footer.querySelector('#copy-selected-btn').addEventListener('click', async () => { const selectedCookies = Array.from(selectionPool.values()); if (selectedCookies.length === 0) { alert('请至少选择一个Cookie！'); return; } const cookieString = selectedCookies.map(c => `${c.key}=${c.value}`).join('; '); await copyToClipboard(cookieString); await renderPanelContent(); });
            footer.querySelector('#delete-selected-btn').addEventListener('click', async () => { const selectedCookies = Array.from(selectionPool.values()); if (selectedCookies.length === 0) { alert('请至少选择一个Cookie！'); return; } if (confirm(`您确定要删除选中的 ${selectedCookies.length} 个Cookie吗？`)) { await Promise.all(selectedCookies.map(cookieManager.delete)); alert('删除成功！'); await renderPanelContent(); } });
        } else {
            footer.querySelector('#delete-all-btn').addEventListener('click', async () => { if (allCookies.length === 0) { alert('当前网站没有任何Cookie可删除。'); return; } if (confirm(`警告：您确定要删除当前网站的全部 ${allCookies.length} 个Cookie吗？\n此操作不可逆！`)) { await Promise.all(allCookies.map(cookieManager.delete)); alert('全部删除成功！'); await renderPanelContent(); } });
        }
    }
    
    function renderCookieList() {
        const container = shadowRoot.querySelector('#cookie-list-container'); container.innerHTML = '';
        filteredCookies.forEach(cookie => {
            const item = document.createElement('div'); item.className = 'cookie-item';
            const cookieId = getCookieId(cookie);
            const isChecked = selectionPool.has(cookieId);
            item.innerHTML = ` <div class="cookie-item-header"> <span class="selection-checkbox ${isChecked ? 'checked' : ''}" data-cookie-id='${cookieId}'>${isChecked ? '✓' : ''}</span> <span class="cookie-key">${decodeURIComponent(cookie.key)}</span> </div> <span class="cookie-value">${decodeURIComponent(cookie.value)}</span> ${hasCookieStore ? `<div class="cookie-props"> <span class="prop-label">Domain:</span> ${cookie.domain} | <span class="prop-label">Path:</span> ${cookie.path} </div>` : ''} <div class="cookie-actions"> <button class="modify-btn" data-cookie='${JSON.stringify(cookie)}'>修改</button> <button class="copy-btn" data-value="${encodeURIComponent(cookie.value)}">复制值</button> <button class="delete-btn" data-cookie='${JSON.stringify(cookie)}'>删除</button> </div>`;
            container.appendChild(item);
        });
        addDynamicCookieEventListeners();
    }
    
    function addStaticPanelEventListeners() { const currentPanel = getPanel(); currentPanel.querySelector('.close-btn').addEventListener('click', () => currentPanel.style.display = 'none'); currentPanel.querySelector('#single-add-btn').addEventListener('click', () => { showEditModal({ mode: 'add' }); }); currentPanel.querySelector('#batch-add-btn').addEventListener('click', () => { showBatchAddModal(); }); currentPanel.querySelector('#copy-all-btn').addEventListener('click', async () => { if (allCookies.length === 0) { alert('当前网站没有任何Cookie可复制。'); return; } const cookieString = allCookies.map(c => `${c.key}=${c.value}`).join('; '); await copyToClipboard(cookieString); alert(`已复制全部 ${allCookies.length} 个Cookie到剪贴板！`); }); const keySearchInput = shadowRoot.getElementById('search-by-key-input'); const valueSearchInput = shadowRoot.getElementById('search-by-value-input'); function performSearch() { const keyTerm = keySearchInput.value.trim().toLowerCase(); const valueTerm = valueSearchInput.value.trim().toLowerCase(); filteredCookies = allCookies.filter(cookie => { const keyMatch = decodeURIComponent(cookie.key).toLowerCase().includes(keyTerm); const valueMatch = decodeURIComponent(cookie.value).toLowerCase().includes(valueTerm); return keyMatch && valueMatch; }); updateListView(); } keySearchInput.addEventListener('input', performSearch); valueSearchInput.addEventListener('input', performSearch); }
    function addDynamicCookieEventListeners() { shadowRoot.querySelectorAll('.modify-btn').forEach(btn => btn.addEventListener('click', (e) => { const cookie = JSON.parse(e.target.dataset.cookie); showEditModal({ mode: 'modify', cookie }); })); shadowRoot.querySelectorAll('.copy-btn').forEach(btn => btn.addEventListener('click', (e) => copyToClipboard(decodeURIComponent(e.target.dataset.value)))); shadowRoot.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', async (e) => { const cookie = JSON.parse(e.target.dataset.cookie); if (confirm(`确定要删除 Cookie "${decodeURIComponent(cookie.key)}" 吗？`)) { await cookieManager.delete(cookie); alert('删除成功！'); await renderPanelContent(); } })); shadowRoot.querySelectorAll('.selection-checkbox').forEach(box => box.addEventListener('click', () => { const cookieId = box.dataset.cookieId; const isChecked = box.classList.toggle('checked'); box.textContent = isChecked ? '✓' : ''; if (isChecked) { const cookie = allCookies.find(c => getCookieId(c) === cookieId); if (cookie) selectionPool.set(cookieId, cookie); } else { selectionPool.delete(cookieId); } renderFooter(); })); }


    // --- ⭐ 守护神机制 ---
    function init() {
        if (document.readyState !== 'complete' && document.readyState !== 'interactive') {
            window.addEventListener('DOMContentLoaded', init, { once: true });
            return;
        }
        createUI();
        setInterval(() => {
            if (!document.getElementById('cookie-manager-host')) {
                createUI();
            }
        }, 2000);
    }
    
    function createUI() {
        if (document.getElementById('cookie-manager-host')) { return; }
        if (!document.body) { setTimeout(createUI, 100); return; }
        
        const hostElement = document.createElement('div'); hostElement.id = 'cookie-manager-host'; document.body.appendChild(hostElement);
        shadowRoot = hostElement.attachShadow({ mode: 'open' });
        const styleEl = document.createElement('style'); styleEl.textContent = getStyles(); shadowRoot.appendChild(styleEl);
        const panelEl = document.createElement('div'); panelEl.id = 'cookie-manager-panel'; shadowRoot.appendChild(panelEl);
        const editModalEl = document.createElement('div'); editModalEl.id = 'edit-modal-overlay'; editModalEl.innerHTML = ` <div id="edit-modal-content"> <h3 id="modal-title">编辑 Cookie</h3> <div class="form-group"> <label for="cookie-key-input">名称 (Key)</label> <input type="text" id="cookie-key-input"> </div> <div class="form-group"> <label for="cookie-value-input">值 (Value)</label> <textarea id="cookie-value-input" class="editable"></textarea> </div> <div class="form-group"> <label for="cookie-domain-input">域 (Domain)</label> <input type="text" id="cookie-domain-input" placeholder="留空则为当前域名"> </div> <div class="form-group"> <label for="cookie-path-input">路径 (Path)</label> <input type="text" id="cookie-path-input" placeholder="默认为 /"> </div> <div class="form-group"> <label for="cookie-expires-input">有效期 (天)</label> <input type="number" id="cookie-expires-input" value="365"> </div> <div id="modal-actions"> <button id="modal-cancel-btn">取消</button> <button id="modal-save-btn">保存</button> </div> </div> `; shadowRoot.appendChild(editModalEl);
        const batchAddModalEl = document.createElement('div'); batchAddModalEl.id = 'batch-add-modal-overlay'; batchAddModalEl.innerHTML = ` <div id="batch-add-modal-content"> <h3>批量添加 Cookie</h3> <div class="batch-add-props"> <div class="form-group"> <label for="batch-domain-input">应用于 Domain</label> <input type="text" id="batch-domain-input" placeholder="留空则为当前域名"> </div> <div class="form-group"> <label for="batch-path-input">应用于 Path</label> <input type="text" id="batch-path-input" placeholder="默认为 /"> </div> </div> <div class="form-group"> <label>粘贴自动匹配 Key 和 Value</label> <textarea id="auto-match-area" placeholder="在此粘贴，可自动识别并填充下方列表。\n支持格式：\nkey1=value1\nkey2:value2\nkey3=value3; key4=value4" style="height: 60px;"></textarea> </div> <div id="batch-input-area"></div> <button id="add-row-btn">+ 添加一行</button> <div id="modal-actions"> <button id="batch-add-cancel-btn">取消</button> <button id="batch-add-save-btn">全部添加</button> </div> </div>`; shadowRoot.appendChild(batchAddModalEl);
        const btnWrapper = document.createElement('div'); btnWrapper.id = 'cookie-manager-btn-wrapper'; const btnInner = document.createElement('div'); btnInner.id = 'cookie-manager-btn-inner';
        if (CONFIG.iconImageUrl) { const img = document.createElement('img'); img.src = CONFIG.iconImageUrl; img.onerror = function() { console.error("Cookie Manager: 自定义图标加载失败! URL:", CONFIG.iconImageUrl); if (img.parentNode) { img.parentNode.removeChild(img); } btnInner.textContent = 'C'; btnInner.style.backgroundColor = ''; }; btnInner.appendChild(img); btnInner.style.backgroundColor = 'transparent'; } else { btnInner.textContent = 'C'; }
        btnWrapper.appendChild(btnInner); shadowRoot.appendChild(btnWrapper);
        const savedPosition = GM_getValue('iconPosition', CONFIG.initialPosition); btnWrapper.style.top = savedPosition.top || 'auto'; btnWrapper.style.left = savedPosition.left || 'auto'; btnWrapper.style.bottom = savedPosition.bottom || 'auto'; btnWrapper.style.right = savedPosition.right || 'auto';
        let isDragging = false, wasDragged = false, dragStartX, dragStartY, initialLeft, initialTop;
        const onDragStart = (e) => { isDragging = true; wasDragged = false; const touch = e.type.startsWith('touch') ? e.targetTouches[0] : e; dragStartX = touch.clientX; dragStartY = touch.clientY; const rect = btnWrapper.getBoundingClientRect(); initialLeft = rect.left; initialTop = rect.top; btnWrapper.style.transition = 'none'; };
        const onDragMove = (e) => { if (!isDragging) return; e.preventDefault(); wasDragged = true; const touch = e.type.startsWith('touch') ? e.targetTouches[0] : e; let newX = initialLeft + (touch.clientX - dragStartX); let newY = initialTop + (touch.clientY - dragStartY); newX = Math.max(0, Math.min(newX, window.innerWidth - btnWrapper.offsetWidth)); newY = Math.max(0, Math.min(newY, window.innerHeight - btnWrapper.offsetHeight)); btnWrapper.style.left = `${newX}px`; btnWrapper.style.top = `${newY}px`; btnWrapper.style.right = 'auto'; btnWrapper.style.bottom = 'auto'; };
        const onDragEnd = () => { if (!isDragging) return; isDragging = false; const finalRect = btnWrapper.getBoundingClientRect(); const newPosition = { top: `${finalRect.top}px`, left: `${finalRect.left}px`, bottom: 'auto', right: 'auto' }; GM_setValue('iconPosition', newPosition); setTimeout(() => { wasDragged = false; }, 50); };
        btnWrapper.addEventListener('touchstart', onDragStart, { passive: false }); btnWrapper.addEventListener('touchmove', onDragMove, { passive: false }); btnWrapper.addEventListener('touchend', onDragEnd); btnWrapper.addEventListener('touchcancel', onDragEnd);
        btnWrapper.addEventListener('mousedown', onDragStart); document.addEventListener('mousemove', onDragMove); document.addEventListener('mouseup', onDragEnd);
        btnWrapper.addEventListener('click', async (e) => { if (wasDragged) { e.stopPropagation(); return; } const currentPanel = getPanel(); if (currentPanel && currentPanel.style.display === 'flex') { currentPanel.style.display = 'none'; } else { await renderPanelContent(); currentPanel.style.display = 'flex'; } });
    }
    
    init();
})();
