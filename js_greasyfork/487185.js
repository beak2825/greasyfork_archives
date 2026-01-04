// ==UserScript==
// @name         [downloadly.ir/downloadlynet.ir/p30download] - Extract Batch Links for IDM
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  Extracts download links for batch download with IDM
// @author       $um@n
// @match        *://*.downloadlynet.ir/*
// @match        *://*.downloadly.ir/*
// @match        *://*.p30download.ir/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @icon         https://downloadlynet.ir/wp-content/uploads/2021/10/favicon.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487185/%5Bdownloadlyirdownloadlynetirp30download%5D%20-%20Extract%20Batch%20Links%20for%20IDM.user.js
// @updateURL https://update.greasyfork.org/scripts/487185/%5Bdownloadlyirdownloadlynetirp30download%5D%20-%20Extract%20Batch%20Links%20for%20IDM.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const CONFIG = {
        extensions: ['rar', 'exe', 'zip', 'rpm', 'deb', 'iso', 'pdf', 'epub', 'docx', '7z', 'tar', 'gz', 'pkg', 'dmg', 'mkv', 'mp4', 'avi', 'bin', 'part'],
        targetSelectors: ['.single-post', '.post_content', '#dlbox', '.entry-content', '#content', '.w-post-elm'],
        headerTags: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'STRONG', 'B'],
        DEFAULT_TEXTAREA_HEIGHT: '70px',
    };

    // --- Styles ---
    const STYLES = `
        /* --- 0. Modal Overlay --- */
        #idm-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 9999;
            display: none;
            justify-content: center;
            align-items: center;
        }
        #idm-modal-overlay.visible { display: flex; }

        /* --- 1. Main Container & Floating Toggle Button --- */
        #idm-batch-container {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            position: fixed;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            z-index: 10001;
            display: flex;
            flex-direction: row-reverse;
            align-items: flex-start;
        }
        #idm-batch-toggle {
            background: #007bff;
            color: white;
            border: 2px solid #0056b3;
            width: 55px;
            height: 55px;
            border-radius: 50% 0 0 50%;
            cursor: pointer;
            box-shadow: -4px 4px 15px rgba(0,0,0,0.3);
            font-size: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s, transform 0.3s;
            line-height: 1;
        }
        #idm-batch-toggle:hover {
            background: #0056b3;
            transform: scale(1.05);
        }

        /* --- 2. The Panel (Huge Modal Box) --- */
        #idm-batch-panel {
            background: #ffffff;
            width: 80vw;
            max-width: 1200px;
            height: 90vh;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            border: 1px solid #c0c0c0;
            z-index: 10002;
            opacity: 0;
            transform: scale(0.9);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        #idm-modal-overlay.visible #idm-batch-panel {
             opacity: 1;
             transform: scale(1);
        }

        /* Header */
        .idm-header {
            background: #2c3e50;
            color: white;
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 700;
            font-size: 1.2em;
            border-radius: 8px 8px 0 0;
            position: sticky;
            top: 0;
        }
        .idm-header-actions {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .idm-header-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5em;
            cursor: pointer;
            line-height: 1;
            padding: 0 5px;
        }
        .idm-header-count {
            background: #e74c3c;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: 600;
        }

        /* --- 3. Scrollable List Area --- */
        .idm-list-area {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
            background: #f8f9fa;
        }
        .idm-list-area::-webkit-scrollbar { width: 8px; }
        .idm-list-area::-webkit-scrollbar-thumb { background: #bdc3c7; border-radius: 4px; }
        .idm-list-area::-webkit-scrollbar-track { background: #f1f1f1; }

        /* --- 4. Individual Group Card --- */
        .idm-group-card {
            background: white;
            border: 1px solid #dddddd;
            border-left: 5px solid #3498db;
            border-radius: 6px;
            padding: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.08);
            transition: box-shadow 0.2s;
        }
        .idm-group-card:hover { box-shadow: 0 4px 10px rgba(0,0,0,0.15); }

        .group-title-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            padding-bottom: 5px;
            border-bottom: 1px dashed #ecf0f1;
        }
        .group-title {
            font-size: 14px;
            font-weight: 700;
            color: #2c3e50;
        }
        .group-count {
            color: #3498db;
            font-weight: 600;
            font-size: 11px;
            margin-left: 10px;
        }

        .group-links-container {
            position: relative;
        }
        .group-links-preview {
            width: 100%;
            height: ${CONFIG.DEFAULT_TEXTAREA_HEIGHT};
            min-height: 50px;
            font-family: Consolas, monospace;
            font-size: 10px;
            border: 1px solid #e9ecef;
            background: #ffffff;
            color: #555;
            resize: vertical; /* Native vertical resizing */
            white-space: pre;
            overflow-y: scroll;
            margin-bottom: 8px;
            padding: 5px;
            border-radius: 4px;
            transition: height 0.3s ease;
        }

        .group-btn {
            width: 100%;
            background: #1abc9c;
            color: white;
            border: none;
            padding: 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            transition: background 0.2s;
        }
        .group-btn:hover { background: #16a085; }

        /* --- 5. Footer --- */
        .idm-footer {
            padding: 12px 15px;
            background: #f4f6f7;
            border-top: 1px solid #e0e0e0;
            display: flex;
            gap: 10px;
            border-radius: 0 0 8px 8px;
            position: sticky;
            bottom: 0;
        }
        .footer-btn {
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
            font-size: 13px;
        }
        .btn-rescan { background: #95a5a6; color: white; }
        .btn-copy-all { background: #34495e; color: white; }
    `;

    class GroupedExtractor {
        constructor() {
            this.groups = [];
            this.initUI();
            this.scan(); // Initial scan on load

            // NOTE: The MutationObserver has been REMOVED here to fix the stability bug.
            // Scanning is now controlled manually by the "Rescan Page" button.
        }

        initUI() {
            const style = document.createElement("style");
            style.textContent = STYLES;
            document.head.appendChild(style);

            this.overlay = document.createElement('div');
            this.overlay.id = 'idm-modal-overlay';

            this.panel = document.createElement('div');
            this.panel.id = 'idm-batch-panel';
            this.panel.innerHTML = `
                <div class="idm-header">
                    <span>Multi-Group Link Extractor</span>
                    <div class="idm-header-actions">
                        <span id="idm-total-files" class="idm-header-count">0 Files</span>
                        <button class="idm-header-close" id="idm-close-modal" title="Close">✕</button>
                    </div>
                </div>
                <div class="idm-list-area" id="idm-list-area">
                    <div style="text-align:center; color:#999; margin-top:50px;">Scanning page content...</div>
                </div>
                <div class="idm-footer">
                    <button class="footer-btn btn-rescan" id="idm-rescan">Rescan Page</button>
                    <button class="footer-btn btn-copy-all" id="idm-copy-all">Copy ALL Links</button>
                </div>
            `;

            this.overlay.appendChild(this.panel);
            document.body.appendChild(this.overlay);

            this.container = document.createElement('div');
            this.container.id = 'idm-batch-container';
            this.toggleBtn = document.createElement('button');
            this.toggleBtn.id = 'idm-batch-toggle';
            this.toggleBtn.innerHTML = '☁️';
            this.toggleBtn.title = "Show Download Manager";
            this.container.appendChild(this.toggleBtn);
            document.body.appendChild(this.container);

            // Event Listeners
            this.toggleBtn.onclick = () => this.toggleModal(true);
            document.getElementById('idm-close-modal').onclick = () => this.toggleModal(false);
            this.overlay.onclick = (e) => {
                if (e.target.id === 'idm-modal-overlay') {
                    this.toggleModal(false);
                }
            };
            // Bind Rescan explicitly
            document.getElementById('idm-rescan').onclick = (e) => this.scan(e.target);
            document.getElementById('idm-copy-all').onclick = (e) => this.copyAll(e.target);
        }

        toggleModal(show) {
            this.overlay.classList.toggle('visible', show);
            this.toggleBtn.style.display = show ? 'none' : 'flex';
        }

        isValidLink(url) {
            try {
                const path = new URL(url).pathname.toLowerCase();
                return CONFIG.extensions.some(ext => path.endsWith('.' + ext));
            } catch (e) { return false; }
        }

        // Add optional button argument for visual feedback during manual rescan
        scan(btnElement = null) {
            if (btnElement) {
                const originalText = btnElement.innerText;
                btnElement.innerText = "Scanning...";
                setTimeout(() => {
                    btnElement.innerText = originalText;
                }, 500);
            }

            let root = null;
            for (let sel of CONFIG.targetSelectors) {
                const el = document.querySelector(sel);
                if (el) { root = el; break; }
            }

            if (!root) return;

            const elements = root.querySelectorAll('*');
            this.groups = [];

            let currentGroup = { title: "General Files / Uncategorized", links: [] };
            const encounteredLinks = new Set();

            elements.forEach(el => {
                if (CONFIG.headerTags.includes(el.tagName)) {
                    const text = el.innerText.trim();
                    if (text.length > 2 && text.length < 150) {
                        if (currentGroup.links.length > 0) {
                            this.groups.push(currentGroup);
                        }
                        currentGroup = { title: text, links: [] };
                    }
                }
                else if (el.tagName === 'A' && this.isValidLink(el.href)) {
                    if(!encounteredLinks.has(el.href)){
                        currentGroup.links.push(el.href);
                        encounteredLinks.add(el.href);
                    }
                }
            });

            if (currentGroup.links.length > 0) {
                this.groups.push(currentGroup);
            }

            this.groups = this.groups.filter(g => g.links.length > 0);

            this.render();
        }

        render() {
            const listArea = document.getElementById('idm-list-area');
            listArea.innerHTML = '';

            let totalFiles = 0;

            if (this.groups.length === 0) {
                listArea.innerHTML = '<div style="text-align:center; padding:50px; color:#7f8c8d; font-size:1.1em;">No download links found on this page.</div>';
                document.getElementById('idm-total-files').textContent = `0 Files`;
                return;
            }

            this.groups.forEach((group, index) => {
                totalFiles += group.links.length;
                const linksText = group.links.join('\n');

                const card = document.createElement('div');
                card.className = 'idm-group-card';
                card.innerHTML = `
                    <div class="group-title-row">
                        <span class="group-title">${group.title}</span>
                        <span class="group-count">${group.links.length} files</span>
                    </div>
                    <div class="group-links-container">
                        <textarea class="group-links-preview" id="textarea-${index}" readonly>${linksText}</textarea>
                    </div>
                    <button class="group-btn" id="btn-group-${index}">Copy This Group (IDM Ready)</button>
                `;

                listArea.appendChild(card);

                document.getElementById(`btn-group-${index}`).onclick = (e) => {
                    this.copyText(linksText, e.target);
                };
            });

            document.getElementById('idm-total-files').textContent = `${totalFiles} Files Total`;
        }

        copyText(text, btnElement) {
            if (!text) return;

            if (typeof GM_setClipboard !== 'undefined') {
                GM_setClipboard(text);
            } else {
                navigator.clipboard.writeText(text);
            }

            const originalText = btnElement.innerText;
            const originalBackground = btnElement.style.backgroundColor;
            btnElement.innerText = "COPIED! ✅";
            btnElement.style.background = "#27ae60";

            setTimeout(() => {
                btnElement.innerText = originalText;
                btnElement.style.background = originalBackground;
            }, 1200);
        }

        copyAll(btnElement) {
            const allLinks = this.groups.flatMap(g => g.links).join('\n');
            this.copyText(allLinks, btnElement);
        }
    }

    window.addEventListener('load', () => new GroupedExtractor());

})();