// ==UserScript==
// @name         Ultima Link Extractor (Mobile & Touch Support)
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  Movable, responsive extractor with touch support for Android, media filtering, auto-save, and editable blacklist.
// @author       YourName
// @match        https://simpcity.cr/threads/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/521481/Ultima%20Link%20Extractor%20%28Mobile%20%20Touch%20Support%29.user.js
// @updateURL https://update.greasyfork.org/scripts/521481/Ultima%20Link%20Extractor%20%28Mobile%20%20Touch%20Support%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Configuration & State ---
    const CONFIG_KEY = 'ule_config';
    const SESSION_KEY = 'ule_session_pos';

    // Default blocked domains (Moved from hardcoded variable to state)
    const defaultBlacklist = [
        'simpcity.cr', 'onlyfans.com', 'twitter.com', 'instagram.com',
        'energizeio.com', 'adglare.net', 'theporndude.com', 'x.com',
        'catflix.su', 'youtube.com', 't.me', 'google.com'
    ].join(', ');

    const defaultState = {
        theme: 'dark',
        x: 'right',
        y: '50%',
        width: '400px',
        height: '600px',
        whitelist: '',
        blacklist: defaultBlacklist, // Added blacklist to state
        filterImages: true,
        filterVideos: true,
        filterOthers: true,
        ignoreHistory: false,
        separator: '\n'
    };

    let state = {
        ...defaultState,
        ...JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}')
    };

    // Runtime variables
    let extractedLinks = [];
    let isScanning = false;
    let stopScanSignal = false;
    let isMinimized = true;

    // --- UI Styles ---
    const styles = `
        #ule-root {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
            z-index: 2147483647; /* Max Z-index */
        }

        /* Toggle Button (Circle) */
        #ule-toggle {
            position: fixed;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #40b5c8;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            cursor: pointer;
            z-index: 2147483647;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 24px;
            transition: transform 0.2s, background 0.2s;
            user-select: none;
            -webkit-user-select: none;
            touch-action: none; /* Prevents browser handling touch */
        }
        #ule-toggle:active { transform: scale(0.95); }

        /* Main Panel */
        #ule-panel {
            position: fixed;
            background: var(--bg-color);
            color: var(--text-color);
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid var(--border-color);
            min-width: 300px;
            min-height: 400px;
            max-width: 95vw;
            max-height: 90vh;
            resize: both;
            z-index: 2147483647;
        }

        /* Mobile Responsive Adjustments */
        @media only screen and (max-width: 768px) {
            #ule-panel {
                width: 90vw !important; /* Force width on mobile */
                height: 80vh !important; /* Force height on mobile */
                font-size: 16px; /* Larger text for touch */
                left: 5vw !important; /* Center fallback */
                top: 10vh !important;
            }
            .ule-btn {
                padding: 14px; /* Larger touch targets */
            }
            .ule-tab {
                padding: 14px; /* Larger tabs */
            }
            #ule-toggle {
                width: 60px;
                height: 60px;
                font-size: 30px;
            }
        }

        /* Themes */
        .ule-theme-dark {
            --bg-color: #1e1e1e;
            --text-color: #e0e0e0;
            --border-color: #333;
            --header-bg: #252525;
            --input-bg: #2d2d2d;
            --hover-bg: #333;
            --accent: #40b5c8;
        }
        .ule-theme-light {
            --bg-color: #ffffff;
            --text-color: #333333;
            --border-color: #ddd;
            --header-bg: #f5f5f5;
            --input-bg: #f0f0f0;
            --hover-bg: #e9e9e9;
            --accent: #008cba;
        }

        /* Header */
        .ule-header {
            padding: 12px 16px;
            background: var(--header-bg);
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--border-color);
            user-select: none;
            touch-action: none; /* Crucial for touch dragging */
        }
        .ule-controls { display: flex; gap: 15px; }
        .ule-btn-icon {
            cursor: pointer;
            padding: 4px;
            font-size: 1.2em;
            display: inline-block;
        }

        /* Content & Tabs */
        .ule-tabs { display: flex; border-bottom: 1px solid var(--border-color); }
        .ule-tab {
            flex: 1; text-align: center; padding: 10px; cursor: pointer;
            background: var(--bg-color); transition: 0.2s;
            user-select: none;
        }
        .ule-tab.active { border-bottom: 3px solid var(--accent); font-weight: bold; color: var(--accent); }

        .ule-content { flex: 1; overflow-y: auto; padding: 15px; display: none; -webkit-overflow-scrolling: touch; }
        .ule-content.active { display: block; }

        /* Form Elements */
        .ule-group { margin-bottom: 15px; }
        .ule-label { display: block; margin-bottom: 5px; font-size: 0.9em; opacity: 0.8; }
        .ule-input, .ule-select {
            width: 100%; padding: 10px; border-radius: 4px;
            border: 1px solid var(--border-color);
            background: var(--input-bg); color: var(--text-color);
            box-sizing: border-box;
            font-size: 1em; /* Prevent IOS zoom */
            font-family: inherit;
        }
        textarea.ule-input { resize: vertical; min-height: 80px; }
        .ule-row { display: flex; gap: 10px; align-items: center; }
        .ule-checkbox-label { display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 5px 0; }
        .ule-checkbox-label input { transform: scale(1.3); }

        /* Buttons */
        .ule-btn {
            width: 100%; padding: 10px; border: none; border-radius: 6px;
            background: var(--accent); color: white; cursor: pointer;
            font-weight: bold; margin-top: 10px; transition: 0.2s;
            font-size: 1em;
        }
        .ule-btn:active { opacity: 0.8; }
        .ule-btn.stop { background: #e74c3c; }
        .ule-btn.secondary { background: #666; margin-top: 5px; }

        /* Progress & Preview */
        .ule-progress-bar {
            height: 8px; background: var(--input-bg); margin-top: 10px; border-radius: 4px; overflow: hidden;
        }
        .ule-progress-fill { height: 100%; background: var(--accent); width: 0%; transition: width 0.3s; }

        .ule-link-item {
            display: flex; justify-content: space-between; padding: 8px 4px;
            border-bottom: 1px solid var(--border-color); font-size: 12px;
            align-items: center;
        }
        .ule-link-text { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80%; }
        .ule-remove {
            color: #e74c3c; cursor: pointer; font-weight: bold;
            padding: 5px 10px; /* Bigger hit area */
        }

        .ule-stats { font-size: 0.85em; opacity: 0.7; text-align: center; margin-bottom: 10px; }
    `;

    // --- Helper Functions ---
    const $ = (tag, props = {}, children = []) => {
        const el = document.createElement(tag);
        Object.entries(props).forEach(([k, v]) => {
            if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
            else if (k.startsWith('on')) el.addEventListener(k.substring(2).toLowerCase(), v);
            else el[k] = v;
        });
        children.forEach(c => el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
        return el;
    };

    function saveState() {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(state));
    }

    // --- Main UI Component ---
    function createUI() {
        const styleSheet = document.createElement('style');
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        const root = $('div', { id: 'ule-root' });
        document.body.appendChild(root);

        // Circular Toggle Button
        const toggleBtn = $('div', {
            id: 'ule-toggle',
            title: 'Open Link Extractor',
            style: { top: '50%', right: '0', transform: 'translate(50%, -50%)' }
        }, ['+']);

        // Main Panel
        const panel = $('div', {
            id: 'ule-panel',
            className: `ule-theme-${state.theme}`,
            style: {
                display: 'none',
                top: '10%', left: '10%',
                width: state.width, height: state.height
            }
        });

        // --- Header with Drag Support ---
        const header = $('div', { className: 'ule-header' }, [
            $('span', { innerText: 'Enhanced Link Extractor' }),
            $('div', { className: 'ule-controls' }, [
                $('span', { className: 'ule-btn-icon', innerText: '🌗', onclick: toggleTheme }),
                $('span', { className: 'ule-btn-icon', innerText: '─', onclick: minimizeUI })
            ])
        ]);

        // --- Tabs ---
        const tabsContainer = $('div', { className: 'ule-tabs' });
        const tabNames = ['Extract', 'Preview', 'Settings'];
        const tabEls = {};
        const contentEls = {};

        tabNames.forEach((name, index) => {
            const tab = $('div', {
                className: `ule-tab ${index === 0 ? 'active' : ''}`,
                innerText: name,
                onclick: () => switchTab(name)
            });
            tabsContainer.appendChild(tab);
            tabEls[name] = tab;

            const content = $('div', { className: `ule-content ${index === 0 ? 'active' : ''}`, id: `ule-tab-${name}` });
            panel.appendChild(content);
            contentEls[name] = content;
        });

        // --- Tab 1: Extract Controls ---
        const pageRangeDiv = $('div', { className: 'ule-row ule-group' }, [
            $('input', { type: 'number', className: 'ule-input', placeholder: 'Start', value: 1, id: 'ule-start-page', style: { width: '80px' } }),
            $('span', { innerText: 'to' }),
            $('input', { type: 'text', className: 'ule-input', placeholder: 'End (or "max")', value: 'max', id: 'ule-end-page', style: { width: '80px' } })
        ]);

        const controlsContent = [
            $('div', { className: 'ule-group' }, [
                $('label', { className: 'ule-label', innerText: 'Page Range' }),
                pageRangeDiv,
                $('div', { className: 'ule-row', style: { marginTop: '10px' } }, [
                    $('div', { className: 'ule-checkbox-label' }, [
                        $('input', { type: 'checkbox', id: 'ule-current-only' }),
                        $('label', { htmlFor: 'ule-current-only', innerText: 'Current Page Only' })
                    ])
                ])
            ]),
            $('div', { className: 'ule-group' }, [
                $('label', { className: 'ule-label', innerText: 'Filter Types' }),
                $('div', { className: 'ule-checkbox-label' }, [
                    $('input', { type: 'checkbox', checked: state.filterImages, onchange: (e) => updateState('filterImages', e.target.checked) }),
                    $('span', { innerText: 'Images (jpg, png...)' })
                ]),
                $('div', { className: 'ule-checkbox-label' }, [
                    $('input', { type: 'checkbox', checked: state.filterVideos, onchange: (e) => updateState('filterVideos', e.target.checked) }),
                    $('span', { innerText: 'Videos (mp4, mkv...)' })
                ]),
                $('div', { className: 'ule-checkbox-label' }, [
                    $('input', { type: 'checkbox', checked: state.filterOthers, onchange: (e) => updateState('filterOthers', e.target.checked) }),
                    $('span', { innerText: 'Others/Archives' })
                ])
            ]),
            $('div', { id: 'ule-status-area', className: 'ule-stats', innerText: 'Ready to extract.' }),
            $('div', { className: 'ule-progress-bar' }, [
                $('div', { id: 'ule-progress', className: 'ule-progress-fill' })
            ]),
            $('button', { id: 'ule-action-btn', className: 'ule-btn', innerText: 'START EXTRACTION', onclick: toggleExtraction })
        ];
        controlsContent.forEach(el => contentEls['Extract'].appendChild(el));

        // --- Tab 2: Preview & Search ---
        const previewList = $('div', { id: 'ule-preview-list', style: { marginTop: '10px' } });
        const previewContent = [
            $('input', {
                type: 'text', className: 'ule-input', placeholder: 'Search/Filter extracted links...',
                onkeyup: (e) => filterPreviewList(e.target.value)
            }),
            $('div', { className: 'ule-row', style: { marginTop: '10px' } }, [
                $('button', { className: 'ule-btn', innerText: 'Copy All', style: { marginTop:0 }, onclick: () => copyLinks() }),
                $('button', { className: 'ule-btn secondary', innerText: 'Download', style: { marginTop:0 }, onclick: () => downloadLinks() })
            ]),
            previewList
        ];
        previewContent.forEach(el => contentEls['Preview'].appendChild(el));

        // --- Tab 3: Settings ---
        const settingsContent = [
            $('div', { className: 'ule-group' }, [
                $('label', { className: 'ule-label', innerText: 'Domain Whitelist (comma separated)' }),
                $('input', {
                    type: 'text', className: 'ule-input', value: state.whitelist,
                    placeholder: 'e.g. mega.nz, gofile.io',
                    onchange: (e) => updateState('whitelist', e.target.value)
                })
            ]),
            // New Blacklist UI
            $('div', { className: 'ule-group' }, [
                $('label', { className: 'ule-label', innerText: 'Domain Blacklist (comma separated)' }),
                $('textarea', {
                    className: 'ule-input',
                    value: state.blacklist,
                    placeholder: 'e.g. google.com, twitter.com',
                    onchange: (e) => updateState('blacklist', e.target.value)
                })
            ]),
            $('div', { className: 'ule-group' }, [
                $('label', { className: 'ule-label', innerText: 'Output Separator' }),
                $('select', { className: 'ule-select', onchange: (e) => updateState('separator', e.target.value) }, [
                    $('option', { value: '\n', innerText: 'New Line', selected: state.separator === '\n' }),
                    $('option', { value: ' ', innerText: 'Space', selected: state.separator === ' ' })
                ])
            ]),
             $('div', { className: 'ule-group' }, [
                $('label', { className: 'ule-checkbox-label' }, [
                     $('input', { type: 'checkbox', checked: state.ignoreHistory, onchange: (e) => updateState('ignoreHistory', e.target.checked) }),
                     $('span', { innerText: 'Ignore History/Dupes' })
                ])
            ])
        ];
        settingsContent.forEach(el => contentEls['Settings'].appendChild(el));

        panel.appendChild(header);
        panel.appendChild(tabsContainer);
        root.appendChild(toggleBtn);
        root.appendChild(panel);

        // --- State Helpers ---
        function updateState(key, value) {
            state[key] = value;
            saveState();
        }

        function toggleTheme() {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            panel.className = `ule-theme-${state.theme}`;
            saveState();
        }

        function switchTab(name) {
            Object.values(tabEls).forEach(el => el.classList.remove('active'));
            Object.values(contentEls).forEach(el => el.classList.remove('active'));
            tabEls[name].classList.add('active');
            contentEls[name].classList.add('active');
        }

        function minimizeUI() {
            isMinimized = true;
            panel.style.display = 'none';
            toggleBtn.style.display = 'flex';
        }

        toggleBtn.addEventListener('click', () => {
            isMinimized = false;
            panel.style.display = 'flex';
            toggleBtn.style.display = 'none';
            // Restore position logic
            if(localStorage.getItem(SESSION_KEY)) {
                const pos = JSON.parse(localStorage.getItem(SESSION_KEY));
                panel.style.top = pos.top;
                panel.style.left = pos.left;
            } else {
                // If on mobile, center it differently
                if (window.innerWidth < 768) {
                   panel.style.top = '10vh';
                   panel.style.left = '5vw';
                }
            }
        });

        // --- Unified Dragging Logic (Mouse & Touch) ---
        let isDragging = false, startX, startY, initialLeft, initialTop;

        const startDrag = (e) => {
            // Ignore if clicking a button/control inside header
            if(e.target.closest('.ule-controls') || e.target.closest('.ule-btn-icon')) return;

            isDragging = true;
            const event = e.touches ? e.touches[0] : e;
            startX = event.clientX;
            startY = event.clientY;

            const rect = panel.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;

            // Add global listeners
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('touchmove', onDrag, { passive: false });
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchend', stopDrag);
        };

        const onDrag = (e) => {
            if (!isDragging) return;
            if (e.cancelable) e.preventDefault(); // Prevent scrolling on mobile while dragging

            const event = e.touches ? e.touches[0] : e;
            const dx = event.clientX - startX;
            const dy = event.clientY - startY;

            let newLeft = initialLeft + dx;
            let newTop = initialTop + dy;

            // Boundary Checks
            const maxLeft = window.innerWidth - panel.offsetWidth;
            const maxTop = window.innerHeight - panel.offsetHeight;

            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));

            panel.style.left = `${newLeft}px`;
            panel.style.top = `${newTop}px`;
        };

        const stopDrag = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('touchmove', onDrag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchend', stopDrag);

            // Save position
            localStorage.setItem(SESSION_KEY, JSON.stringify({
                top: panel.style.top,
                left: panel.style.left
            }));
        };

        header.addEventListener('mousedown', startDrag);
        header.addEventListener('touchstart', startDrag, { passive: false });
    }

    // --- Core Logic ---

    function getThreadName() {
        const match = window.location.href.match(/\/threads\/([^\/]+)\.\d+/);
        return match ? match[1] : 'extracted_links';
    }

    function isMedia(url, type) {
        if (!url) return false;
        const ext = url.split('.').pop().split('?')[0].toLowerCase();
        if (type === 'image') return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext);
        if (type === 'video') return ['mp4', 'mkv', 'webm', 'avi', 'mov', 'flv', 'wmv'].includes(ext);
        return false;
    }

    function shouldKeep(url) {
        try {
            const urlObj = new URL(url);
            const domain = urlObj.hostname;

            // 1. Check Blacklist (from State)
            if (state.blacklist && state.blacklist.trim().length > 0) {
                 const blacklist = state.blacklist.split(',').map(s => s.trim()).filter(Boolean);
                 if (blacklist.some(d => domain.includes(d))) return false;
            }

            // 2. Check Whitelist (from State)
            if (state.whitelist.trim()) {
                const allowed = state.whitelist.split(',').map(s => s.trim()).filter(Boolean);
                if (allowed.length > 0 && !allowed.some(d => domain.includes(d))) return false;
            }

            const isImg = isMedia(url, 'image');
            const isVid = isMedia(url, 'video');
            if (isImg) return state.filterImages;
            if (isVid) return state.filterVideos;
            return state.filterOthers;
        } catch (e) { return false; }
    }

    function extractFromDOM(doc) {
        const found = new Set();
        const decode64 = (str) => {
            try { return decodeURIComponent(atob(str).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')); } catch (e) { return null; }
        };
        doc.querySelectorAll('a[href], iframe[src]').forEach(el => {
            let href = el.href || el.src;
            if (href.includes('goto/link-confirmation?url=')) {
                const p = new URL(href).searchParams.get('url');
                href = decode64(p) || href;
            }
            if (href && href.startsWith('http') && shouldKeep(href)) found.add(href);
        });
        doc.querySelectorAll('iframe.saint-iframe').forEach(iframe => {
            if (iframe.src && shouldKeep(iframe.src)) found.add(iframe.src);
        });
        return Array.from(found);
    }

    async function toggleExtraction() {
        const btn = document.getElementById('ule-action-btn');
        if (isScanning) {
            stopScanSignal = true;
            btn.innerText = 'Stopping...';
            return;
        }
        isScanning = true;
        stopScanSignal = false;
        extractedLinks = [];
        renderPreview();
        btn.innerText = 'STOP EXTRACTION';
        btn.classList.add('stop');

        const currentOnly = document.getElementById('ule-current-only').checked;
        const startPageInput = parseInt(document.getElementById('ule-start-page').value) || 1;
        let endPageInput = document.getElementById('ule-end-page').value;

        let maxPage = 1;
        const nav = document.querySelector('.pageNavWrapper');
        if (nav) {
            nav.querySelectorAll('a').forEach(a => {
                const num = parseInt(a.textContent);
                if (!isNaN(num)) maxPage = Math.max(maxPage, num);
            });
        }

        let endPage = (endPageInput === 'max') ? maxPage : parseInt(endPageInput);
        if (currentOnly) {
             processPageResults(extractFromDOM(document));
        } else {
            const baseUrl = window.location.href.replace(/(\/page-\d+)?\/?$/, '') + '/page-';
            const progressBar = document.getElementById('ule-progress');
            const statusDiv = document.getElementById('ule-status-area');

            for (let i = startPageInput; i <= endPage; i++) {
                if (stopScanSignal) break;

                statusDiv.innerText = `Scanning page ${i} of ${endPage}...`;
                progressBar.style.width = `${((i - startPageInput + 1) / (endPage - startPageInput + 1)) * 100}%`;

                if (i === 1 && !window.location.href.includes('page-')) {
                     processPageResults(extractFromDOM(document));
                } else {
                    try {
                        const res = await fetch(baseUrl + i);
                        const txt = await res.text();
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(txt, 'text/html');
                        processPageResults(extractFromDOM(doc));
                    } catch (e) { console.error('Page load fail', e); }
                }
                await new Promise(r => setTimeout(r, 500));
            }
        }
        isScanning = false;
        btn.innerText = 'START EXTRACTION';
        btn.classList.remove('stop');
        document.getElementById('ule-status-area').innerText = `Done! Found ${extractedLinks.filter(l => l !== '').length} links.`;
        document.getElementById('ule-progress').style.width = '100%';
        document.querySelector('.ule-tab:nth-child(2)').click();
    }

    function processPageResults(newLinks) {
        // Filter out links already present (Global Dedupe)
        const unique = newLinks.filter(l => !extractedLinks.includes(l));

        // Only add if we found new unique links
        if (unique.length > 0) {
            // If we already have links (from previous pages), add a blank line separator
            if (extractedLinks.length > 0) {
                extractedLinks.push('');
            }
            extractedLinks.push(...unique);
            renderPreview();
        }
    }

    function renderPreview() {
        const list = document.getElementById('ule-preview-list');
        list.innerHTML = '';
        const displayLimit = 300;
        const linksToShow = extractedLinks.slice(0, displayLimit);
        linksToShow.forEach(link => {
            if (link === '') {
                 // Render separator for blank lines
                 const sep = $('div', {
                     className: 'ule-link-item',
                     style: { height: '10px', background: 'var(--border-color)', opacity: 0.3, border: 'none', minHeight: '10px' }
                 });
                 list.appendChild(sep);
            } else {
                const div = $('div', { className: 'ule-link-item' }, [
                    $('div', { className: 'ule-link-text', innerText: link, title: link }),
                    $('div', { className: 'ule-remove', innerText: 'X', onclick: function() {
                        // Find index to remove specifically this item (handling dupes in display logic if any)
                        // But here we rely on value filtering which might be risky if we had dupes,
                        // but global dedupe prevents that.
                        extractedLinks = extractedLinks.filter(l => l !== link);
                        this.parentElement.remove();
                        updateCounter();
                    }})
                ]);
                list.appendChild(div);
            }
        });
        if (extractedLinks.length > displayLimit) {
            list.appendChild($('div', { style: { padding: '10px', fontStyle: 'italic' }, innerText: `...and ${extractedLinks.length - displayLimit} more (visible in download)` }));
        }
        updateCounter();
    }

    function filterPreviewList(query) {
        const items = document.querySelectorAll('.ule-link-item');
        query = query.toLowerCase();
        items.forEach(item => {
            const textEl = item.querySelector('.ule-link-text');
            if (!textEl) return; // Skip separators
            const text = textEl.innerText.toLowerCase();
            item.style.display = text.includes(query) ? 'flex' : 'none';
        });
    }

    function updateCounter() {
        const status = document.getElementById('ule-status-area');
        // Count actual links, ignore separators
        const count = extractedLinks.filter(l => l !== '').length;
        if(!isScanning) status.innerText = `Total Links: ${count}`;
    }

    function copyLinks() {
        if (extractedLinks.length === 0) return alert('No links to copy');
        GM_setClipboard(extractedLinks.join(state.separator));
        const btn = document.querySelector('#ule-tab-Preview .ule-btn');
        const orig = btn.innerText;
        btn.innerText = 'Copied!';
        setTimeout(() => btn.innerText = orig, 2000);
    }

    function downloadLinks() {
        if (extractedLinks.length === 0) return alert('No links to download');
        const blob = new Blob([extractedLinks.join(state.separator)], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = getThreadName() + '.txt';
        a.click();
        URL.revokeObjectURL(url);
    }

    createUI();

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e') {
            e.preventDefault();
            if (isMinimized) document.getElementById('ule-toggle').click();
            else minimizeUI();
        }
    });

})();