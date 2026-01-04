// ==UserScript==
// @name         阅图标记 (Visited Image Marker)
// @namespace    RANRAN
// @version      1.0.30
// @description  为您点击过的图片链接添加一个可自定义样式的醒目标记，以方便您识别已阅内容。
// @match        http://*/*
// @match        https://*/*
// @exclude      *://tieba.baidu.com/*
// @exclude      *://hi.baidu.com/*
// @exclude      *://blog.sina.com.cn/*
// @exclude      *://*.blog.sina.com.cn/*
// @exclude      *://www.51.la/*
// @exclude      *://bbs.aicbbs.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/543777/%E9%98%85%E5%9B%BE%E6%A0%87%E8%AE%B0%20%28Visited%20Image%20Marker%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543777/%E9%98%85%E5%9B%BE%E6%A0%87%E8%AE%B0%20%28Visited%20Image%20Marker%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认配置
    const DEFAULTS = {
        style: 'tag',
        position: 'top-left',
        size: '24',
        offsetX: '5',
        offsetY: '5',
        unreadColor: '#FFFFFF',
        readColor: '#FF0000',
        shadow: true,
        minWidth: '40',
        minHeight: '40',
        siteListMode: 'blacklist',
        siteList: [],
        buttonPos: { x: '15px', y: '15px' },
        showFloatingButton: true,
        enableDimming: true,
        dimmingIntensity: '65',
    };

    // --- 1. 配置与存储管理 ---
    let config = {};
    let processImagesTimeout;
    let visitedLinks = new Set();
    const VISITED_LINKS_KEY = 'readimage_visited_links';
    const VISITED_LINKS_CAP = 2000;
    const SYNC_SAVE_KEY = 'readimage_sync_save';

    function canonicalizeUrl(href) {
        if (typeof href !== 'string' || href.length === 0) return null;
        try {
            const url = new URL(href);
            return url.origin + url.pathname + url.search;
        } catch (e) {
            return href.split('#')[0];
        }
    }

    function loadConfig() {
        const savedConfig = GM_getValue('config', {});
        config = { ...DEFAULTS, ...savedConfig };
    }

    function shouldScriptRun() {
        const currentHost = window.location.hostname;
        if (!config.siteList || config.siteList.length === 0) {
            return config.siteListMode === 'blacklist';
        }
        const isOnList = config.siteList.some(site => currentHost.endsWith(site));
        return config.siteListMode === 'blacklist' ? !isOnList : isOnList;
    }

    loadConfig();

    GM_registerMenuCommand('设置标记样式 (UI)', showSettingsPanel);
    GM_registerMenuCommand('重置设置并清空所有记录', resetConfigAndClearData);
    GM_registerMenuCommand('清除当前网站的已读记录', clearCurrentSiteData);

    if (config.showFloatingButton) {
        createSettingsButton();
    }

    if (!shouldScriptRun()) {
        return;
    }

    function saveConfig() {
        const panel = document.getElementById('readimage-settings-panel');
        if (panel) {
            config.style = panel.querySelector('#style').value;
            config.position = panel.querySelector('#position').value;
            config.size = panel.querySelector('#size').value;
            config.offsetX = panel.querySelector('#offsetX').value;
            config.offsetY = panel.querySelector('#offsetY').value;
            config.unreadColor = panel.querySelector('#unreadColor').value;
            config.readColor = panel.querySelector('#readColor').value;
            config.shadow = panel.querySelector('#shadow').checked;
            config.minWidth = panel.querySelector('#minWidth').value;
            config.minHeight = panel.querySelector('#minHeight').value;
            config.siteListMode = panel.querySelector('input[name="siteListMode"]:checked').value;
            const siteListText = panel.querySelector('#siteListArea').value;
            config.siteList = siteListText.split('\n').map(s => s.trim()).filter(Boolean);
            config.showFloatingButton = panel.querySelector('#showFloatingButton').checked;
            config.enableDimming = panel.querySelector('#enableDimming').checked;
            config.dimmingIntensity = panel.querySelector('#dimmingIntensity').value;
        }
        GM_setValue('config', config);
        alert('设置已保存！部分设置（如站点列表）需要刷新页面才能生效。');
    }

    function loadVisitedDb() {
        const storedLinks = GM_getValue(VISITED_LINKS_KEY, []);
        visitedLinks = new Set(storedLinks);
        try {
            const syncSavedUrl = localStorage.getItem(SYNC_SAVE_KEY);
            if (syncSavedUrl) {
                visitedLinks.add(syncSavedUrl);
                localStorage.removeItem(SYNC_SAVE_KEY);
                saveVisitedDb();
            }
        } catch (e) { console.error('[readimage] Error accessing localStorage:', e); }
    }

    function saveVisitedDb() { let linksToSave = Array.from(visitedLinks); if (linksToSave.length > VISITED_LINKS_CAP) { linksToSave = linksToSave.slice(linksToSave.length - VISITED_LINKS_CAP); } GM_setValue(VISITED_LINKS_KEY, linksToSave); }
    function addLinkToVisited(href) { const canonicalUrl = canonicalizeUrl(href); if (!canonicalUrl || visitedLinks.has(canonicalUrl)) { return; } try { localStorage.setItem(SYNC_SAVE_KEY, canonicalUrl); } catch (e) { console.error('[readimage] Error writing to localStorage:', e); } visitedLinks.add(canonicalUrl); saveVisitedDb(); }
    function removeLinkFromVisited(href) { const canonicalUrl = canonicalizeUrl(href); if (canonicalUrl && visitedLinks.has(canonicalUrl)) { visitedLinks.delete(canonicalUrl); saveVisitedDb(); } }

    function clearCurrentSiteData() {
        const currentOrigin = window.location.origin;
        if (confirm(`确定要清除网站 ${currentOrigin} 的所有已读记录吗？\n此操作不可恢复。`)) {
            const oldSize = visitedLinks.size;
            const newLinks = Array.from(visitedLinks).filter(link => !link.startsWith(currentOrigin));
            visitedLinks = new Set(newLinks);
            saveVisitedDb();
            const removedCount = oldSize - visitedLinks.size;
            alert(`清除了 ${removedCount} 条记录。\n页面即将刷新以应用更改。`);
            location.reload();
        }
    }

    function resetConfigAndClearData() {
        if (confirm('确定要重置所有设置并清空全部已读记录吗？此操作不可恢复。')) {
            config = { ...DEFAULTS };
            GM_setValue('config', config);
            visitedLinks.clear();
            GM_setValue(VISITED_LINKS_KEY, []);
            try { localStorage.removeItem(SYNC_SAVE_KEY); } catch (e) {}
            alert('已重置所有设置和已读记录！请刷新页面。');
            location.reload();
        }
    }

    function applyMarker(link) {
        let marker = link.querySelector('.readimage-marker');
        const isNewMarker = !marker;

        if (isNewMarker) {
            marker = document.createElement('span');
            marker.className = `readimage-marker style-${config.style}`;
            link.appendChild(marker);
        }

        const canonicalUrl = canonicalizeUrl(link.href);
        const isRead = canonicalUrl && visitedLinks.has(canonicalUrl);
        marker.classList.toggle('is-read', isRead);
        link.classList.toggle('is-read', isRead);

        if (config.style === 'tag' && isNewMarker) {
            let leaveTimeout = null;

            marker.addEventListener('mouseenter', () => {
                if (leaveTimeout) {
                    clearTimeout(leaveTimeout);
                    leaveTimeout = null;
                }
                if (link.getAttribute('href')) {
                    link.setAttribute('data-vim-href', link.getAttribute('href'));
                    link.removeAttribute('href');
                }
            });

            marker.addEventListener('mouseleave', () => {
                leaveTimeout = setTimeout(() => {
                    if (link.hasAttribute('data-vim-href')) {
                        link.setAttribute('href', link.getAttribute('data-vim-href'));
                        link.removeAttribute('data-vim-href');
                    }
                }, 100);
            });

            // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
            // 【核心修改】在“捕获”阶段监听'click'事件，并彻底阻止其传播
            // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
            marker.addEventListener('click', (event) => {
                // 彻底阻止事件，不让页面上任何其他脚本（如灯箱）响应
                event.preventDefault();
                event.stopImmediatePropagation();

                const href = link.getAttribute('data-vim-href') || link.href;
                const isCurrentlyRead = link.classList.contains('is-read');

                if (isCurrentlyRead) {
                    link.classList.remove('is-read');
                    marker.classList.remove('is-read');
                    removeLinkFromVisited(href);
                } else {
                    link.classList.add('is-read');
                    marker.classList.add('is-read');
                    addLinkToVisited(href);
                }
                return false;
            }, true); // 末尾的 'true' 开启了事件捕获，这是关键
        }
    }


    function debounceProcessImages() { clearTimeout(processImagesTimeout); processImagesTimeout = setTimeout(processImages, 250); }
    function processImages() { const links = document.querySelectorAll('a:has(img):not(.readimage-processed)'); links.forEach(link => { link.classList.add('readimage-processed'); const img = link.querySelector('img'); if (img) { const checkAndApply = (targetImg) => { if (targetImg.naturalWidth >= config.minWidth && targetImg.naturalHeight >= config.minHeight) { applyMarker(link); } }; img.addEventListener('load', () => checkAndApply(img), { once: true }); if (img.complete) { checkAndApply(img); } } }); }

    function updateStyles() {
        const root = document.documentElement;
        root.style.setProperty('--marker-size', `${config.size}px`);
        root.style.setProperty('--marker-offset-x', `${config.offsetX}px`);
        root.style.setProperty('--marker-offset-y', `${config.offsetY}px`);
        root.style.setProperty('--marker-unread-color', config.unreadColor);
        root.style.setProperty('--marker-read-color', config.readColor);
        const brightnessValue = (100 - config.dimmingIntensity) / 100;
        root.style.setProperty('--dimming-brightness', brightnessValue);
        let positionCSS = '';
        switch (config.position) { case 'top-right': positionCSS = `top: var(--marker-offset-y); right: var(--marker-offset-x);`; break; case 'bottom-left': positionCSS = `bottom: var(--marker-offset-y); left: var(--marker-offset-x);`; break; case 'bottom-right': positionCSS = `bottom: var(--marker-offset-y); right: var(--marker-offset-x);`; break; case 'center': positionCSS = `top: 50%; left: 50%; transform: translate(-50%, -50%);`; break; case 'top-left': default: positionCSS = `top: var(--marker-offset-y); left: var(--marker-offset-x);`; break; }
        const shadowStyle = config.shadow ? 'text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;' : 'text-shadow: none;';
        const dimmingCSS = config.enableDimming ? ` a.is-read img { filter: brightness(var(--dimming-brightness)); transition: filter 0.3s ease-in-out; } ` : '';
        const finalCSS = `
            a:has(> .readimage-marker) { position: relative !important; display: inherit !important; }
            .readimage-marker { position: absolute; ${positionCSS} z-index: 999; pointer-events: none; transition: all 0.2s ease-in-out; line-height: 1; display: grid; place-items: center; font-weight: bold; ${shadowStyle} }
            .readimage-marker.style-star::before { content: '★'; font-size: var(--marker-size); color: var(--marker-unread-color); }
            .readimage-marker.style-star.is-read::before { color: var(--marker-read-color); }
            .readimage-marker.style-circle::before { content: ''; display: block; width: var(--marker-size); height: var(--marker-size); background-color: var(--marker-unread-color); border-radius: 50%; }
            .readimage-marker.style-circle.is-read::before { background-color: var(--marker-read-color); }
            .readimage-marker.style-tag { background-color: rgba(0, 0, 0, 0.6); color: white; font-size: calc(var(--marker-size) / 2); padding: 0.2em 0.5em; border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.2); }
            .readimage-marker.style-tag::before { content: '未看'; }
            .readimage-marker.style-tag.is-read { background-color: var(--marker-read-color); color: var(--marker-unread-color); }
            .readimage-marker.style-tag.is-read::before { content: '已看'; }
            .readimage-marker.style-tag {
                cursor: pointer;
                pointer-events: auto;
                transition: transform 0.15s ease, background-color 0.2s ease-in-out;
            }
            .readimage-marker.style-tag:hover {
                transform: scale(1.15);
                z-index: 1000;
            }
            ${dimmingCSS}
        `;
        let styleElement = document.getElementById('readimage-style');
        if (!styleElement) { styleElement = document.createElement('style'); styleElement.id = 'readimage-style'; document.head.appendChild(styleElement); }
        styleElement.textContent = finalCSS;
        document.querySelectorAll('.readimage-marker').forEach(marker => { marker.className = 'readimage-marker'; marker.classList.add(`style-${config.style}`); const link = marker.parentElement; const canonicalUrl = canonicalizeUrl(link.href); const isRead = link.classList.contains('is-read') || (canonicalUrl && visitedLinks.has(canonicalUrl)); marker.classList.toggle('is-read', isRead); });
    }

    function showSettingsPanel() {
        if (document.getElementById('readimage-settings-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'readimage-settings-panel';
        panel.innerHTML = ` <div id="readimage-settings-header"><span>标记样式设置</span><button id="readimage-close-btn" title="关闭">✖</button></div> <div id="readimage-settings-body"> <label>样式:</label> <select id="style"> <option value="star" ${config.style === 'star' ? 'selected' : ''}>五角星 ★</option> <option value="circle" ${config.style === 'circle' ? 'selected' : ''}>圆形 ●</option> <option value="tag" ${config.style === 'tag' ? 'selected' : ''}>标签</option> </select> <label>位置:</label> <select id="position"> <option value="top-left" ${config.position === 'top-left' ? 'selected' : ''}>左上</option> <option value="top-right" ${config.position === 'top-right' ? 'selected' : ''}>右上</option> <option value="bottom-left" ${config.position === 'bottom-left' ? 'selected' : ''}>左下</option> <option value="bottom-right" ${config.position === 'bottom-right' ? 'selected' : ''}>右下</option> <option value="center" ${config.position === 'center' ? 'selected' : ''}>居中</option> </select> <label id="size-label">大小 (px):</label> <input type="range" id="size" min="10" max="50" value="${config.size}"><span class="value-display">${config.size}px</span> <label>水平偏移 (px):</label> <input type="range" id="offsetX" min="-20" max="20" value="${config.offsetX}"><span class="value-display">${config.offsetX}px</span> <label>垂直偏移 (px):</label> <input type="range" id="offsetY" min="-20" max="20" value="${config.offsetY}"><span class="value-display">${config.offsetY}px</span> <label>未读颜色/标签文字:</label> <input type="color" id="unreadColor" value="${config.unreadColor}"> <label>已读颜色:</label> <input type="color" id="readColor" value="${config.readColor}"> <label>为星星/标签加描边:</label> <input type="checkbox" id="shadow" ${config.shadow ? 'checked' : ''}> <hr> <label>已读效果:</label> <div><input type="checkbox" id="enableDimming" ${config.enableDimming ? 'checked' : ''}> <label for="enableDimming" style="margin: 0 0 0 4px;">启用压暗效果</label></div> <label for="dimmingIntensity">压暗强度:</label> <input type="range" id="dimmingIntensity" min="0" max="100" value="${config.dimmingIntensity}"><span class="value-display">${config.dimmingIntensity}%</span> <hr> <label>最小宽度 (px):</label> <input type="range" id="minWidth" min="10" max="200" value="${config.minWidth}"><span class="value-display">${config.minWidth}px</span> <label>最小高度 (px):</label> <input type="range" id="minHeight" min="10" max="200" value="${config.minHeight}"><span class="value-display">${config.minHeight}px</span> <hr> <label>站点管理:</label> <div class="radio-group"> <input type="radio" id="blacklist" name="siteListMode" value="blacklist" ${config.siteListMode === 'blacklist' ? 'checked' : ''}> <label for="blacklist">黑名单模式</label> <input type="radio" id="whitelist" name="siteListMode" value="whitelist" ${config.siteListMode === 'whitelist' ? 'checked' : ''}> <label for="whitelist">白名单模式</label> </div> <label for="siteListArea" style="align-self: start; padding-top: 5px;">网站列表:</label> <textarea id="siteListArea" rows="4" placeholder="每行一个域名，例如&#10;google.com&#10;example.org">${config.siteList.join('\n')}</textarea> <label></label> <p class="settings-help">黑名单：脚本在此列表网站上**禁用**。<br>白名单：脚本**仅**在此列表网站上生效。</p> <hr> <label>界面选项:</label> <div><input type="checkbox" id="showFloatingButton" ${config.showFloatingButton ? 'checked' : ''}> <label for="showFloatingButton" style="margin: 0 0 0 4px;">显示悬浮设置按钮</label></div> </div> <div id="readimage-settings-footer"><button id="readimage-save-btn">保存</button></div> `;
        document.body.appendChild(panel);
        GM_addStyle(` #readimage-settings-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 99999; background: #f0f0f0; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); font-family: sans-serif; width: 340px; color: #333; } #readimage-settings-body hr { grid-column: 1 / -1; border: none; border-top: 1px solid #ccc; margin: 5px 0; } #readimage-settings-header { padding: 10px; background: #e0e0e0; border-bottom: 1px solid #ccc; cursor: move; display: flex; justify-content: space-between; align-items: center; border-top-left-radius: 8px; border-top-right-radius: 8px; } #readimage-settings-header span { font-weight: bold; } #readimage-close-btn { background: none; border: none; font-size: 16px; cursor: pointer; } #readimage-settings-body { padding: 15px; display: grid; grid-template-columns: auto 1fr; gap: 10px 5px; align-items: center; max-height: 70vh; overflow-y: auto; } #readimage-settings-body label { font-size: 14px; grid-column: 1 / 2; } #readimage-settings-body > *:not(label):not(hr) { grid-column: 2 / 3; } #readimage-settings-body select, #readimage-settings-body textarea { width: 100%; padding: 4px; box-sizing: border-box; } #readimage-settings-body .value-display { font-family: monospace; } #readimage-settings-body div, #readimage-settings-body .radio-group { display: flex; align-items: center; } #readimage-settings-body input[type="range"] { flex: 1; } #readimage-settings-body input[type="color"] { width: 100%; height: 25px; } #readimage-settings-footer { padding: 10px; background: #e0e0e0; text-align: right; border-top: 1px solid #ccc; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; } #readimage-settings-footer button { margin-left: 10px; padding: 5px 15px; border: 1px solid #999; border-radius: 4px; cursor: pointer; } #readimage-save-btn { background: #4CAF50; color: white; border-color: #4CAF50; } input:disabled { opacity: 0.5; cursor: not-allowed; } .radio-group label { margin: 0 10px 0 2px; } .settings-help { font-size: 12px; color: #666; margin: 0; } `);
        const enableDimmingCheckbox = panel.querySelector('#enableDimming'); const dimmingSlider = panel.querySelector('#dimmingIntensity'); const dimmingValueDisplay = dimmingSlider.nextElementSibling; function updateSliderState() { dimmingSlider.disabled = !enableDimmingCheckbox.checked; dimmingValueDisplay.style.color = enableDimmingCheckbox.checked ? '' : '#aaa'; dimmingSlider.previousElementSibling.style.color = enableDimmingCheckbox.checked ? '' : '#aaa'; } panel.querySelectorAll('input[type="range"]').forEach(range => { const display = range.nextElementSibling; const container = document.createElement('div'); range.parentNode.insertBefore(container, range); container.appendChild(range); container.appendChild(display); }); const inputs = panel.querySelectorAll('input, select, textarea'); inputs.forEach(input => { input.addEventListener('input', () => { const key = input.id || input.name; const value = input.type === 'checkbox' ? input.checked : input.value; if (key) config[key] = value; if (input.type === 'range') { input.nextElementSibling.textContent = `${value}${input.id === 'dimmingIntensity' ? '%' : 'px'}`; } if (key === 'showFloatingButton') { const button = document.getElementById('readimage-settings-button'); if (config.showFloatingButton) { if (!button) createSettingsButton(); } else { if (button) button.remove(); } return; } if (input.id.includes('siteList')) return; updateStyles(); if (key === 'minWidth' || key === 'minHeight' || key === 'style') { document.querySelectorAll('.readimage-processed').forEach(el => { el.classList.remove('readimage-processed'); const marker = el.querySelector('.readimage-marker'); if (marker) marker.remove(); }); debounceProcessImages(); } updatePanelState(); updateSliderState(); }); }); panel.querySelector('#readimage-save-btn').addEventListener('click', () => { saveConfig(); closeSettingsPanel(); }); panel.querySelector('#readimage-close-btn').addEventListener('click', closeSettingsPanel); updatePanelState(); updateSliderState(); makeDraggable(panel.querySelector('#readimage-settings-header'), panel);
    }

    function updatePanelState() { const panel = document.getElementById('readimage-settings-panel'); if (!panel) return; const currentStyle = panel.querySelector('#style').value; const unreadColorInput = panel.querySelector('#unreadColor'); const shadowCheckbox = panel.querySelector('#shadow'); const sizeLabel = panel.querySelector('#size-label'); const unreadColorLabel = unreadColorInput.previousElementSibling; unreadColorInput.disabled = false; shadowCheckbox.disabled = (currentStyle === 'circle'); if (currentStyle === 'tag') { sizeLabel.textContent = '字号基准 (px):'; unreadColorLabel.textContent = '已读标签文字颜色:'; } else if (currentStyle === 'circle') { sizeLabel.textContent = '直径 (px):'; unreadColorLabel.textContent = '未读颜色:'; } else { sizeLabel.textContent = '大小 (px):'; unreadColorLabel.textContent = '未读颜色:'; } }
    function closeSettingsPanel() { const panel = document.getElementById('readimage-settings-panel'); if (panel) panel.remove(); }
    function makeDraggable(header, panel) { let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0; header.onmousedown = (e) => { if (e.target.id === 'readimage-close-btn') return; panel.style.transform = 'none'; e.preventDefault(); pos3 = e.clientX; pos4 = e.clientY; document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; }; document.onmousemove = (e) => { e.preventDefault(); pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY; pos3 = e.clientX; pos4 = e.clientY; panel.style.top = (panel.offsetTop - pos2) + "px"; panel.style.left = (panel.offsetLeft - pos1) + "px"; }; }; }
    function createSettingsButton() { if (document.getElementById('readimage-settings-button')) return; const button = document.createElement('div'); button.id = 'readimage-settings-button'; button.innerHTML = '⚙️'; document.body.appendChild(button); GM_addStyle(` #readimage-settings-button { position: fixed; z-index: 99998; width: 40px; height: 40px; background-color: rgba(0, 0, 0, 0.5); color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 24px; cursor: pointer; transition: background-color 0.2s, transform 0.2s; user-select: none; } #readimage-settings-button:hover { background-color: rgba(0, 0, 0, 0.7); transform: rotate(45deg); } `); button.style.right = config.buttonPos.x; button.style.bottom = config.buttonPos.y; let dragState = {}; button.addEventListener('mousedown', (e) => { if (e.button !== 0) return; dragState = { isDragging: false, startX: e.clientX, startY: e.clientY, btnStartX: parseFloat(button.style.right), btnStartY: parseFloat(button.style.bottom) }; document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp); }); function onMouseMove(e) { const dx = e.clientX - dragState.startX; const dy = e.clientY - dragState.startY; if (!dragState.isDragging && Math.sqrt(dx*dx + dy*dy) > 5) { dragState.isDragging = true; } if (dragState.isDragging) { let newX = dragState.btnStartX - dx; let newY = dragState.btnStartY - dy; newX = Math.max(0, Math.min(newX, window.innerWidth - button.offsetWidth)); newY = Math.max(0, Math.min(newY, window.innerHeight - button.offsetHeight)); button.style.right = `${newX}px`; button.style.bottom = `${newY}px`; } } function onMouseUp() { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); if (dragState.isDragging) { config.buttonPos = { x: button.style.right, y: button.style.bottom }; const currentConfig = GM_getValue('config', DEFAULTS); currentConfig.buttonPos = config.buttonPos; GM_setValue('config', currentConfig); } else { const panel = document.getElementById('readimage-settings-panel'); if (panel) { closeSettingsPanel(); } else { showSettingsPanel(); } } } }

    // --- 4. 脚本初始化 ---
    loadVisitedDb();
    updateStyles();
    debounceProcessImages();

    const observer = new MutationObserver(debounceProcessImages);
    observer.observe(document.body, { childList: true, subtree: true });

    document.body.addEventListener("mousedown", function(event) {
        if (event.target.closest('#readimage-settings-button') || event.target.closest('#readimage-settings-panel')) {
            return;
        }

        if (config.style === 'tag' && event.target.closest('.readimage-marker')) {
            return;
        }

        const link = event.target.closest('a');
        if (!link || !link.querySelector('.readimage-marker')) {
            return;
        }

        if (!link.classList.contains('is-read')) {
            link.classList.add('is-read');
            link.querySelector('.readimage-marker').classList.add('is-read');
            addLinkToVisited(link.href);
        }
    }, true);

})();