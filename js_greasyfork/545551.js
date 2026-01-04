// ==UserScript==
// @name         智能图片批量下载器 (v1.0 - 暂不支持打包下载)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      AGPL-3.0-or-later
// @description  鼠标选择图片！下载按钮已内置于面板中，逻辑更清晰。自动扫描、分辨率筛选、ZIP打包功能有问题。
// @author       jhlxlml
// @match        *://*/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/545551/%E6%99%BA%E8%83%BD%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%99%A8%20%28v10%20-%20%E6%9A%82%E4%B8%8D%E6%94%AF%E6%8C%81%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545551/%E6%99%BA%E8%83%BD%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%99%A8%20%28v10%20-%20%E6%9A%82%E4%B8%8D%E6%94%AF%E6%8C%81%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 & 状态管理 ---
    const state = {
        images: new Map(),
        zip: new JSZip(),
        uiVisible: false,
        isBoxSelecting: false,
        settings: {
            minWidth: 600,
            minHeight: 600,
            autoScan: true,
        }
    };

    // --- UI 界面 ---
    const UI = {
        init: function() {
            this.loadSettings();
            this.createPanel();
            this.createButtons();
            this.addEventListeners();
            this.initBoxSelection(); // 初始化框选功能
            this.initAutoScan();
        },

        createPanel: function() {
            GM_addStyle(`
                #sib-panel { position: fixed; bottom: 80px; right: 20px; width: 360px; max-height: 70vh; background: #fff; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); z-index: 99999; display: none; flex-direction: column; font-family: sans-serif; }
                #sib-header { padding: 10px 15px; background: #f7f7f7; border-bottom: 1px solid #ddd; border-top-left-radius: 8px; border-top-right-radius: 8px; }
                #sib-header h3 { margin: 0; font-size: 16px; color: #333; }
                #sib-filter { padding: 10px 15px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center; font-size: 12px; border-bottom: 1px solid #ddd;}
                #sib-filter input[type="number"] { width: 50px; padding: 5px; border: 1px solid #ccc; border-radius: 4px; }
                #sib-filter label { display:flex; align-items:center; gap: 5px; cursor: pointer;}
                #sib-image-list { overflow-y: auto; padding: 10px; flex-grow: 1; display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; user-select: none; }
                .sib-image-item { position: relative; border: 2px solid transparent; border-radius: 4px; overflow: hidden; cursor: pointer; aspect-ratio: 1 / 1; background-color: #eee; transition: border-color 0.2s; }
                .sib-image-item.selected { border-color: #007bff; }
                .sib-image-item img { width: 100%; height: 100%; object-fit: cover; }
                .sib-image-info { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0, 0, 0, 0.6); color: white; font-size: 11px; padding: 4px; text-align: center; }
                .sib-image-item .sib-checkbox { position: absolute; top: 5px; right: 5px; width: 18px; height: 18px; accent-color: #007bff; }
                #sib-footer { padding: 10px 15px; border-top: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center; background: #f7f7f7;}
                #sib-footer-left { display: flex; align-items: center; gap: 15px; }
                #sib-footer-right { display: flex; align-items: center; gap: 10px; }
                #sib-select-all { font-size: 14px; cursor: pointer; display:flex; align-items:center; gap: 5px; }
                #sib-status { font-size: 12px; color: #555; }
                .sib-action-btn { background-color: #f0f0f0; color: #888; border: 1px solid #ccc; padding: 6px 12px; border-radius: 5px; font-size: 12px; cursor: not-allowed; transition: all 0.2s;}
                .sib-action-btn:not(:disabled) { background-color: #ffc107; color: #212529; border-color: #ffc107; cursor: pointer; }
                .sib-action-btn:not(:disabled):hover { background-color: #e0a800; }
                .sib-action-btn#sib-download-zip-btn:not(:disabled) { background-color: #17a2b8; color: white; border-color: #17a2b8;}
                .sib-action-btn#sib-download-zip-btn:not(:disabled):hover { background-color: #117a8b; }
                #sib-selection-box { position: absolute; background-color: rgba(0, 123, 255, 0.3); border: 1px solid rgba(0, 123, 255, 0.8); z-index: 100000; pointer-events: none; }
                .sib-main-btn { position: fixed; right: 20px; min-width: 160px; height: 40px; color: white; border: none; border-radius: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.25); cursor: pointer; font-size: 14px; z-index: 99998; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; padding: 0 20px;}
                #sib-toggle-panel-btn { bottom: 20px; background-color: #007bff; }
                #sib-toggle-panel-btn:hover { background-color: #0056b3; }
                #sib-scan-btn { bottom: 20px; right: 200px; background-color: #28a745; display: none;}
                #sib-scan-btn:hover { background-color: #1e7e34; }
            `);

            const panelHTML = `
                <div id="sib-panel">
                    <div id="sib-header"><h3>智能图片批量下载器</h3></div>
                    <div id="sib-filter">
                        <label>最小尺寸: <input type="number" id="sib-min-width"> x <input type="number" id="sib-min-height"></label>
                        <label title="开启后，每次打开新页面都会自动扫描图片"><input type="checkbox" id="sib-autoscan-checkbox"> 自动扫描</label>
                    </div>
                    <div id="sib-image-list"></div>
                    <div id="sib-footer">
                        <div id="sib-footer-left">
                           <label id="sib-select-all"><input type="checkbox" id="sib-select-all-checkbox"> 全选</label>
                           <span id="sib-status">等待扫描...</span>
                        </div>
                        <div id="sib-footer-right">
                            <button id="sib-download-selected-btn" class="sib-action-btn" disabled>下载选中</button>
                            <button id="sib-download-zip-btn" class="sib-action-btn" disabled>打包下载</button>
                        </div>
                    </div>
                </div>`;
            document.body.insertAdjacentHTML('beforeend', panelHTML);

            document.getElementById('sib-min-width').value = state.settings.minWidth;
            document.getElementById('sib-min-height').value = state.settings.minHeight;
            document.getElementById('sib-autoscan-checkbox').checked = state.settings.autoScan;
        },

        createButtons: function() {
            const toggleBtn = `<button id="sib-toggle-panel-btn" class="sib-main-btn">打开下载面板</button>`;
            const scanBtn = `<button id="sib-scan-btn" class="sib-main-btn">手动扫描</button>`;
            document.body.insertAdjacentHTML('beforeend', toggleBtn + scanBtn);
        },

        addEventListeners: function() {
            document.getElementById('sib-toggle-panel-btn').addEventListener('click', this.togglePanel);
            document.getElementById('sib-scan-btn').addEventListener('click', () => ImageScanner.scan());
            document.getElementById('sib-download-selected-btn').addEventListener('click', Downloader.downloadSelected);
            document.getElementById('sib-download-zip-btn').addEventListener('click', Downloader.downloadZip);
            document.getElementById('sib-select-all-checkbox').addEventListener('change', this.toggleSelectAll);
            document.getElementById('sib-autoscan-checkbox').addEventListener('change', this.handleAutoScanToggle);
            ['sib-min-width', 'sib-min-height'].forEach(id => {
                document.getElementById(id).addEventListener('change', this.handleFilterChange);
            });
        },

        initBoxSelection: function() {
            const imageList = document.getElementById('sib-image-list');
            let startX, startY, selectionBox;

            imageList.addEventListener('mousedown', e => {
                if (e.target !== imageList) return; // 只在容器空白处点击时触发
                e.preventDefault();
                state.isBoxSelecting = true;

                startX = e.clientX;
                startY = e.clientY;

                selectionBox = document.createElement('div');
                selectionBox.id = 'sib-selection-box';
                selectionBox.style.left = `${e.pageX}px`;
                selectionBox.style.top = `${e.pageY}px`;
                document.body.appendChild(selectionBox);

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });

            function onMouseMove(e) {
                if (!state.isBoxSelecting) return;
                e.preventDefault();

                const currentX = e.clientX;
                const currentY = e.clientY;
                const boxLeft = Math.min(startX, currentX);
                const boxTop = Math.min(startY, currentY);
                const boxWidth = Math.abs(startX - currentX);
                const boxHeight = Math.abs(startY - currentY);

                // 注意：style的top/left是相对于viewport的，但getBoundingClientRect也是。
                // 如果imageList有滚动，需要换算。为简化，这里假定滚动条在window上。
                selectionBox.style.left = `${boxLeft}px`;
                selectionBox.style.top = `${boxTop}px`;
                selectionBox.style.width = `${boxWidth}px`;
                selectionBox.style.height = `${boxHeight}px`;

                const selectionRect = selectionBox.getBoundingClientRect();
                document.querySelectorAll('.sib-image-item').forEach(item => {
                    const itemRect = item.getBoundingClientRect();
                    const isIntersecting = !(selectionRect.right < itemRect.left ||
                                           selectionRect.left > itemRect.right ||
                                           selectionRect.bottom < itemRect.top ||
                                           selectionRect.top > itemRect.bottom);

                    const checkbox = item.querySelector('.sib-checkbox');
                    if (checkbox.checked !== isIntersecting) {
                        checkbox.checked = isIntersecting;
                        item.classList.toggle('selected', isIntersecting);
                    }
                });
            }

            function onMouseUp() {
                if (state.isBoxSelecting) {
                    state.isBoxSelecting = false;
                    document.body.removeChild(selectionBox);
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    UI.updateSummaryStatus();
                }
            }
        },

        initAutoScan: function() { /* 与v1.2相同 */ if (state.settings.autoScan) window.addEventListener('load', () => setTimeout(() => ImageScanner.scan(true), 1000)); },
        handleAutoScanToggle: function(e) { state.settings.autoScan = e.target.checked; UI.saveSettings(); },
        togglePanel: function() {
            const panel = document.getElementById('sib-panel');
            const scanBtn = document.getElementById('sib-scan-btn');
            state.uiVisible = !state.uiVisible;
            panel.style.display = state.uiVisible ? 'flex' : 'none';
            scanBtn.style.display = state.uiVisible ? 'flex' : 'none';
            UI.updateToggleButtonText();
        },
        addImageToList: function(url, width, height) {
            const list = document.getElementById('sib-image-list');
            const item = document.createElement('div');
            item.className = 'sib-image-item';
            item.dataset.url = url;
            item.innerHTML = `
                <img src="${url}" loading="lazy" onerror="this.parentElement.remove()">
                <div class="sib-image-info">${width}x${height}</div>
                <input type="checkbox" class="sib-checkbox">`;
            item.querySelector('img').onload = () => item.style.backgroundColor = 'transparent';

            const checkbox = item.querySelector('.sib-checkbox');
            // Click on item toggles checkbox
            item.addEventListener('click', e => {
                if (e.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                    item.classList.toggle('selected', checkbox.checked);
                    this.updateSummaryStatus();
                }
            });
            // Change on checkbox toggles class
            checkbox.addEventListener('change', () => {
                item.classList.toggle('selected', checkbox.checked);
                this.updateSummaryStatus();
            });
            list.appendChild(item);
        },
        filterAndDisplayImages: function(isAutoScan = false) {
            const list = document.getElementById('sib-image-list');
            list.innerHTML = '';
            let displayedCount = 0;
            for (const [url, data] of state.images.entries()) {
                const { width, height } = data;
                if (width >= state.settings.minWidth && height >= state.settings.minHeight) {
                    this.addImageToList(url, width, height);
                    displayedCount++;
                }
            }
            this.updateSummaryStatus();
            if (isAutoScan && displayedCount > 0) this.updateToggleButtonText(displayedCount);
        },
        updateToggleButtonText: function(count) {
            const btn = document.getElementById('sib-toggle-panel-btn');
            if (state.uiVisible) {
                btn.textContent = '关闭下载面板';
                btn.style.backgroundColor = '#007bff';
            } else {
                const foundCount = count || document.querySelectorAll('.sib-image-item').length;
                if (foundCount > 0) {
                    btn.textContent = `发现 ${foundCount} 张图片`;
                    btn.style.backgroundColor = '#28a745';
                } else {
                    btn.textContent = '打开下载面板';
                    btn.style.backgroundColor = '#007bff';
                }
            }
        },
        updateSummaryStatus: function() {
            const displayed = document.querySelectorAll('.sib-image-item').length;
            const total = state.images.size;
            const selected = document.querySelectorAll('.sib-image-item.selected').length;

            const statusEl = document.getElementById('sib-status');
            statusEl.textContent = `选中: ${selected} / 显示: ${displayed}`;

            const dlSelectedBtn = document.getElementById('sib-download-selected-btn');
            const dlZipBtn = document.getElementById('sib-download-zip-btn');

            if (selected > 0) {
                dlSelectedBtn.disabled = false;
                dlZipBtn.disabled = false;
            } else {
                dlSelectedBtn.disabled = true;
                dlZipBtn.disabled = true;
            }

            document.getElementById('sib-select-all-checkbox').checked = selected > 0 && selected === displayed;
        },
        toggleSelectAll: function(e) { const c = e.target.checked; document.querySelectorAll('.sib-image-item .sib-checkbox').forEach(cb => { cb.checked = c; cb.closest('.sib-image-item').classList.toggle('selected', c); }); UI.updateSummaryStatus(); },
        handleFilterChange: function() { state.settings.minWidth = parseInt(document.getElementById('sib-min-width').value) || 0; state.settings.minHeight = parseInt(document.getElementById('sib-min-height').value) || 0; UI.saveSettings(); UI.filterAndDisplayImages(); },
        saveSettings: function() { GM_setValue('sib_settings', JSON.stringify(state.settings)); },
        loadSettings: function() { const s = GM_getValue('sib_settings'); if (s) { const parsed = JSON.parse(s); delete parsed.maxWidth; delete parsed.maxHeight; Object.assign(state.settings, parsed); } },
    };

    // --- 图片扫描 (与v1.2相同) ---
    const ImageScanner = {
        scan: function(isAutoScan = false) { UI.updateSummaryStatus(); document.getElementById('sib-status').textContent = '扫描中...'; state.images.clear(); document.getElementById('sib-image-list').innerHTML = ''; document.getElementById('sib-select-all-checkbox').checked = false; this.findImagesInTags(); this.findImagesInStyles(); setTimeout(() => { UI.filterAndDisplayImages(isAutoScan); }, 2500); },
        findImagesInTags: function() { document.querySelectorAll('img, a, source, div, li, picture').forEach(el => { if (el.tagName === 'A' && el.href && /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(el.href)) { this.processUrl(el.href); } if (el.tagName === 'IMG' || el.tagName === 'SOURCE') { const p = [el.src, el.dataset.src, el.dataset.original, el.dataset.lazySrc, el.dataset.lazyload, el.getAttribute('data-src-retina')]; if (el.srcset) { p.push(...el.srcset.split(',').map(s => s.trim().split(' ')[0]).filter(Boolean)); } p.forEach(src => this.processUrl(src)); } const g = ['data-src', 'data-original', 'data-bg', 'data-background-image', 'data-lazy-bg']; g.forEach(attr => { if (el.hasAttribute(attr)) this.processUrl(el.getAttribute(attr)); }); }); },
        findImagesInStyles: function() { document.querySelectorAll('*').forEach(el => { const b = window.getComputedStyle(el).backgroundImage; if (b && b !== 'none') { const m = b.match(/url\(['"]?(.*?)['"]?\)/); if (m && m[1]) this.processUrl(m[1]); } }); },
        processUrl: function(url) { if (!url || typeof url !== 'string' || url.startsWith('data:') || url.length < 10) return; try { const absUrl = new URL(url, window.location.href).href; if (state.images.has(absUrl)) return; state.images.set(absUrl, {width: 0, height: 0}); const img = new Image(); img.onload = () => { state.images.set(absUrl, { width: img.naturalWidth, height: img.naturalHeight }); }; img.onerror = () => { state.images.delete(absUrl); }; img.src = absUrl; } catch (e) {} }
    };

    // --- 下载逻辑 (与v1.2相同) ---
    const Downloader = {
        downloadSelected: function() { if (this.disabled) return; const s = document.querySelectorAll('.sib-image-item.selected'); document.getElementById('sib-status').textContent = `开始下载 ${s.length} 张...`; s.forEach((item, index) => { const url = item.dataset.url, filename = Downloader.getFilename(url, index); setTimeout(() => GM_download({ url: url, name: filename, onerror: err => console.error(`下载失败: ${filename}`, err) }), index * 200); }); setTimeout(() => UI.updateSummaryStatus(), s.length * 200 + 500); },
        downloadZip: async function() { if (this.disabled) return; const s = document.querySelectorAll('.sib-image-item.selected'); state.zip = new JSZip(); let p = 0; document.getElementById('sib-status').textContent = `打包中: 0/${s.length}`; for (let i = 0; i < s.length; i++) { const item = s[i], url = item.dataset.url, filename = this.getFilename(url, i); try { const r = await this.fetchImage(url); state.zip.file(filename, r, { binary: true }); } catch (e) { state.zip.file(`${filename}_下载失败.txt`, `无法下载:\n${url}\n错误: ${e.message}`); } p++; document.getElementById('sib-status').textContent = `打包中: ${p}/${s.length}`; } document.getElementById('sib-status').textContent = '生成ZIP...'; state.zip.generateAsync({ type: 'blob' }, m => { document.getElementById('sib-status').textContent = `压缩中: ${m.percent.toFixed(0)}%`; }).then(c => { const n = `图片打包_${document.title.replace(/[\\/:*?"<>|]/g, '_') || 'archive'}.zip`; GM_download(URL.createObjectURL(c), n); UI.updateSummaryStatus(); }); },
        fetchImage: function(url) { return new Promise((resolve, reject) => { GM_xmlhttpRequest({ method: 'GET', url: url, responseType: 'arraybuffer', onload: r => r.status >= 200 && r.status < 300 ? resolve(r.response) : reject(new Error(`HTTP ${r.status}`)), onerror: () => reject(new Error('网络错误')), ontimeout: () => reject(new Error('请求超时')) }); }); },
        getFilename: function(url, index) { try { let n = new URL(url).pathname.split('/').pop(); if (!n || n.indexOf('.') === -1) n = `image.jpg`; return `${index}_${n.replace(/[\\/:*?"<>|]/g, '_').slice(-100)}`; } catch (e) { return `${index}_image.jpg`; } }
    };

    // --- 启动脚本 ---
    UI.init();

})();

