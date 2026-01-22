// ==UserScript==
// @name         Page Text Downloader
// @namespace    https://greasyfork.org/en/users/1462137-piknockyou
// @version      8.0
// @author       Piknockyou (vibe-coded)
// @license      AGPL-3.0
// @description  Floating button to download page text, selected text, or clipboard. Click: download, Hold: copy, Shift+Click: clipboard.
// @match        *://*/*
// @match        file:///*
// @icon         https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f4c4.svg
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/536124/Page%20Text%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/536124/Page%20Text%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //================================================================================
    // CONFIGURATION
    //================================================================================

    const CONFIG = {
        file: {
            defaultExtension: 'md',
            includeHeader: true,
            lastExtensionKey: 'ptd_last_extension'
        },

        button: {
            size: 24,

            iconStyle: {
                shadow: {
                    enabled: true,
                    blur: 2,
                    color: 'rgba(255, 255, 255, 0.8)'
                },
                background: {
                    enabled: true,
                    color: 'rgba(128, 128, 128, 0.25)',
                    borderRadius: '50%'
                }
            },

            position: {
                vertical: 'bottom',
                horizontal: 'right',
                offsetX: 1,
                offsetY: 1
            },

            opacity: {
                default: 0.15,
                hover: 1,
                active: 0.7
            },

            scale: {
                default: 1,
                hover: 1.1,
                active: 0.95
            },

            zIndex: 2147483647
        },

        timing: {
            copyHoldThreshold: 300,
            doubleClickThreshold: 350,
            hideTemporarilyDuration: 5000
        }
    };

    //================================================================================
    // GLOBAL STATE
    //================================================================================

    let shadowRoot = null;
    let notificationElement = null;
    let containerElement = null;
    let extensionModalElement = null;

    const STATE = {
        hidden: false
    };

    //================================================================================
    // HELPER: Get domain from URL
    //================================================================================

    function getDomain(url) {
        try {
            const hostname = new URL(url).hostname;
            return hostname.replace(/^www\./, '');
        } catch {
            return 'unknown';
        }
    }

    //================================================================================
    // HELPER: Sanitize filename (now appends domain)
    //================================================================================

    function sanitizeFilename(name, includeDomain = true) {
        let sanitized = name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
        sanitized = sanitized.replace(/_+/g, '_');
        sanitized = sanitized.replace(/^_+|_+$/g, '').trim();
        sanitized = sanitized.substring(0, 180);

        if (includeDomain) {
            const domain = getDomain(window.location.href);
            sanitized = sanitized + '_' + domain.replace(/\./g, '-');
        }

        return sanitized || 'downloaded_page_text';
    }

    //================================================================================
    // HELPER: Generate file header with metadata
    //================================================================================

    function generateFileHeader() {
        const url = window.location.href;
        const title = document.title || 'Untitled Page';
        const date = new Date().toISOString();
        const domain = getDomain(url);

        return [
            '<!--',
            `  Source: ${url}`,
            `  Title: ${title}`,
            `  Domain: ${domain}`,
            `  Downloaded: ${date}`,
            '-->',
            '',
            ''
        ].join('\n');
    }

    //================================================================================
    // HELPER: Last extension (GM storage)
    //================================================================================

    function getLastExtension() {
        try {
            return GM_getValue(CONFIG.file.lastExtensionKey, CONFIG.file.defaultExtension);
        } catch {
            return CONFIG.file.defaultExtension;
        }
    }

    function saveLastExtension(ext) {
        if (!ext) return;
        ext = ext.toLowerCase().replace(/^\./, '');
        GM_setValue(CONFIG.file.lastExtensionKey, ext);
    }

    //================================================================================
    // NOTIFICATIONS (inside Shadow DOM)
    //================================================================================

    function showNotification(message, type = 'info') {
        if (!shadowRoot || !notificationElement) return;

        notificationElement.classList.remove('show');
        notificationElement.textContent = message;
        notificationElement.setAttribute('data-type', type);

        void notificationElement.offsetWidth;
        notificationElement.classList.add('show');

        setTimeout(() => {
            notificationElement.classList.remove('show');
        }, 2500);
    }

    //================================================================================
    // EXTENSION PROMPT MODAL
    //================================================================================

    function showExtensionPrompt(callback) {
        if (!shadowRoot) return;

        // Build modal fresh each time using DOM APIs (Trusted Types safe)
        const modal = document.createElement('div');
        modal.className = 'ptd-ext-modal';

        const dialog = document.createElement('div');
        dialog.className = 'ptd-ext-dialog';

        const title = document.createElement('div');
        title.className = 'ptd-ext-title';
        title.textContent = '📄 File Extension';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'ptd-ext-input';
        input.placeholder = 'md, txt, py, ps1...';
        input.spellcheck = false;
        input.autocomplete = 'off';
        input.value = getLastExtension();

        const hint = document.createElement('div');
        hint.className = 'ptd-ext-hint';
        hint.textContent = 'Enter ↵ to download · Esc to cancel';

        const actions = document.createElement('div');
        actions.className = 'ptd-ext-actions';

        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'ptd-ext-cancel';
        cancelBtn.textContent = 'Cancel';

        const okBtn = document.createElement('button');
        okBtn.type = 'button';
        okBtn.className = 'ptd-ext-ok';
        okBtn.textContent = 'Download';

        actions.appendChild(cancelBtn);
        actions.appendChild(okBtn);
        dialog.appendChild(title);
        dialog.appendChild(input);
        dialog.appendChild(hint);
        dialog.appendChild(actions);
        modal.appendChild(dialog);

        // Remove old modal if exists
        if (extensionModalElement && extensionModalElement.parentNode) {
            extensionModalElement.parentNode.removeChild(extensionModalElement);
        }
        extensionModalElement = modal;
        shadowRoot.appendChild(modal);

        let isResolved = false;

        const cleanup = () => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
            document.removeEventListener('keydown', globalKeyHandler, true);
        };

        const handleSubmit = () => {
            if (isResolved) return;
            isResolved = true;
            const ext = input.value.trim().replace(/^\./, '') || CONFIG.file.defaultExtension;
            saveLastExtension(ext);
            cleanup();
            callback(ext);
        };

        const handleCancel = () => {
            if (isResolved) return;
            isResolved = true;
            cleanup();
        };

        // Event handlers using addEventListener for reliability
        okBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit();
        }, true);

        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCancel();
        }, true);

        input.addEventListener('keydown', (e) => {
            e.stopPropagation();
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                handleCancel();
            }
        }, true);

        // Prevent clicks on dialog from closing modal
        dialog.addEventListener('click', (e) => {
            e.stopPropagation();
        }, true);

        // Prevent mousedown from affecting focus
        dialog.addEventListener('mousedown', (e) => {
            if (e.target !== input) {
                e.preventDefault();
            }
        }, true);

        // Click on backdrop closes
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                e.preventDefault();
                handleCancel();
            }
        }, true);

        // Global escape key handler
        const globalKeyHandler = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                handleCancel();
            }
        };
        document.addEventListener('keydown', globalKeyHandler, true);

        // Show modal and focus
        modal.classList.add('visible');

        // Double RAF to ensure rendering is complete
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                input.focus();
                input.select();
            });
        });
    }

    //================================================================================
    // MAIN FUNCTIONS
    //================================================================================

    function getPageText() {
        const textContent = document.body.innerText;
        if (!textContent || textContent.trim() === "") {
            return null;
        }
        return textContent;
    }

    function getSelectedText() {
        const selection = window.getSelection();
        if (selection && selection.toString().trim()) {
            return selection.toString();
        }
        return null;
    }

    async function getClipboardText() {
        try {
            return await navigator.clipboard.readText();
        } catch {
            showNotification('Clipboard access denied', 'error');
            return null;
        }
    }

    function copyToClipboard() {
        const textContent = getPageText();

        if (!textContent) {
            showNotification('No visible text content found', 'error');
            return;
        }

        if (typeof GM_setClipboard === 'function') {
            GM_setClipboard(textContent, 'text');
            showNotification('✓ Copied to clipboard', 'success');
        } else {
            navigator.clipboard.writeText(textContent)
                .then(() => showNotification('✓ Copied to clipboard', 'success'))
                .catch(() => showNotification('Failed to copy', 'error'));
        }
    }

    function downloadContent(content, ext, filenameBase = null, includeHeader = true) {
        if (!content) {
            showNotification('No content to download', 'error');
            return;
        }

        const pageTitle = filenameBase || document.title || 'Untitled Page';
        const filename = sanitizeFilename(pageTitle) + '.' + ext;

        let finalContent = content;
        if (includeHeader && CONFIG.file.includeHeader) {
            finalContent = generateFileHeader() + content;
        }

        try {
            GM_download({
                url: 'data:text/plain;charset=utf-8,' + encodeURIComponent(finalContent),
                name: filename,
                saveAs: true,
                onerror: function (errorDetails) {
                    console.error("Download Error:", errorDetails);
                    fallbackDownload(finalContent, filename);
                }
            });
            showNotification('⬇ Downloading ' + filename, 'info');
        } catch (e) {
            fallbackDownload(finalContent, filename);
        }
    }

    function downloadPageText() {
        const textContent = getPageText();
        if (!textContent) {
            showNotification('No visible text content found', 'error');
            return;
        }
        downloadContent(textContent, CONFIG.file.defaultExtension);
    }

    async function downloadClipboard() {
        const clipboardText = await getClipboardText();
        if (!clipboardText || !clipboardText.trim()) {
            showNotification('Clipboard is empty', 'error');
            return;
        }
        showExtensionPrompt((ext) => {
            // No header for clipboard content
            downloadContent(clipboardText, ext, 'clipboard_' + (document.title || 'page'), false);
        });
    }

    function fallbackDownload(content, filename) {
        try {
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showNotification('⬇ Downloading...', 'info');
        } catch (fallbackError) {
            console.error("Fallback failed:", fallbackError);
            showNotification('Download failed', 'error');
        }
    }

    //================================================================================
    // VISIBILITY LOGIC
    //================================================================================

    function updateVisibility() {
        if (!containerElement) return;
        containerElement.classList.toggle('hidden', STATE.hidden);
    }

    //================================================================================
    // STYLES FOR SHADOW DOM
    //================================================================================

    function getStyles() {
        const cfg = CONFIG.button;
        const pos = cfg.position;
        const iconSize = cfg.size - 4;

        return `
            :host { all: initial; }
            * { box-sizing: border-box; }

            .ptd-container {
                position: fixed;
                ${pos.vertical}: ${pos.offsetY}px;
                ${pos.horizontal}: ${pos.offsetX}px;
                z-index: ${cfg.zIndex};
                pointer-events: auto;
                user-select: none;
            }

            .ptd-container.hidden { display: none !important; }

            .ptd-btn {
                position: relative;
                width: ${cfg.size}px;
                height: ${cfg.size}px;
                background: transparent;
                border: none;
                cursor: pointer;
                opacity: ${cfg.opacity.default};
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                transform: scale(${cfg.scale.default});
                transition: opacity 0.3s, transform 0.2s;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }

            .ptd-btn[data-hover="true"] {
                opacity: ${cfg.opacity.hover};
                transform: scale(${cfg.scale.hover});
            }

            .ptd-btn[data-active="true"] {
                opacity: ${cfg.opacity.active};
                transform: scale(${cfg.scale.active});
            }

            .ptd-icon-container {
                display: flex;
                align-items: center;
                justify-content: center;
                width: ${cfg.size}px;
                height: ${cfg.size}px;
                border-radius: ${cfg.iconStyle.background.enabled ? cfg.iconStyle.background.borderRadius : '0'};
                background-color: ${cfg.iconStyle.background.enabled ? cfg.iconStyle.background.color : 'transparent'};
                pointer-events: none;
            }

            .ptd-icon {
                width: ${iconSize}px;
                height: ${iconSize}px;
                display: block;
                pointer-events: none;
                ${cfg.iconStyle.shadow.enabled ? `
                    filter: drop-shadow(0 0 ${cfg.iconStyle.shadow.blur}px ${cfg.iconStyle.shadow.color})
                            drop-shadow(0 0 ${cfg.iconStyle.shadow.blur * 0.5}px ${cfg.iconStyle.shadow.color});
                ` : ''}
            }

            .ptd-progress-ring {
                position: absolute;
                top: -3px;
                left: -3px;
                width: ${cfg.size + 6}px;
                height: ${cfg.size + 6}px;
                transform: rotate(-90deg);
                pointer-events: none;
                opacity: 0;
            }

            .ptd-progress-ring.visible { opacity: 1; }

            .ptd-notification {
                position: fixed;
                ${pos.vertical}: ${pos.offsetY + cfg.size + 10}px;
                ${pos.horizontal}: ${pos.offsetX}px;
                padding: 8px 16px;
                color: white;
                border-radius: 6px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                font-size: 13px;
                font-weight: 500;
                z-index: ${cfg.zIndex - 1};
                box-shadow: 0 3px 12px rgba(0,0,0,0.25);
                opacity: 0;
                transform: translateY(10px);
                transition: opacity 0.3s, transform 0.3s;
                pointer-events: none;
            }

            .ptd-notification.show {
                opacity: 1;
                transform: translateY(0);
            }

            .ptd-notification[data-type="success"] { background: #4CAF50; border: 1px solid #388E3C; }
            .ptd-notification[data-type="error"] { background: #f44336; border: 1px solid #c62828; }
            .ptd-notification[data-type="info"] { background: #2196F3; border: 1px solid #1565C0; }
            .ptd-notification[data-type="warning"] { background: #FF9800; border: 1px solid #EF6C00; }

            /* Extension prompt modal - Dark Mode */
            .ptd-ext-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.7);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: ${cfg.zIndex + 10};
                pointer-events: auto;
                user-select: none;
            }

            .ptd-ext-modal.visible { display: flex; }

            .ptd-ext-dialog {
                background: #1e1e1e;
                border: 1px solid #444;
                border-radius: 12px;
                padding: 20px 24px;
                min-width: 280px;
                max-width: 320px;
                box-shadow: 0 16px 48px rgba(0,0,0,0.6);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                pointer-events: auto;
            }

            .ptd-ext-title {
                font-size: 15px;
                font-weight: 600;
                color: #e0e0e0;
                margin: 0 0 16px 0;
                user-select: none;
            }

            .ptd-ext-input {
                display: block;
                width: 100%;
                padding: 12px 14px;
                background: #2a2a2a;
                border: 2px solid #505050;
                border-radius: 8px;
                font-size: 15px;
                font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
                color: #fff;
                outline: none;
                transition: border-color 0.2s, box-shadow 0.2s;
                box-sizing: border-box;
                -webkit-appearance: none;
                appearance: none;
                user-select: text;
                pointer-events: auto;
            }

            .ptd-ext-input:focus {
                border-color: #4a9eff;
                box-shadow: 0 0 0 3px rgba(74, 158, 255, 0.25);
            }

            .ptd-ext-input::placeholder { color: #666; }
            .ptd-ext-input::selection { background: #4a9eff; color: #fff; }

            .ptd-ext-hint {
                font-size: 11px;
                color: #888;
                margin: 12px 0 0 0;
                text-align: center;
                user-select: none;
            }

            .ptd-ext-actions {
                display: flex;
                gap: 10px;
                margin-top: 18px;
            }

            .ptd-ext-ok, .ptd-ext-cancel {
                flex: 1;
                padding: 11px 16px;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: background 0.15s, transform 0.1s;
                pointer-events: auto;
                user-select: none;
                -webkit-appearance: none;
                appearance: none;
            }

            .ptd-ext-ok {
                background: #4a9eff;
                color: #fff;
            }
            .ptd-ext-ok:hover { background: #5aafff; }
            .ptd-ext-ok:active { background: #3a8eef; transform: scale(0.98); }

            .ptd-ext-cancel {
                background: #3a3a3a;
                color: #ccc;
            }
            .ptd-ext-cancel:hover { background: #4a4a4a; }
            .ptd-ext-cancel:active { background: #333; transform: scale(0.98); }

            /* Tooltip container */
            .ptd-tooltip {
                position: absolute;

                /* Horizontal: appear on opposite side of screen edge */
                ${pos.horizontal === 'right' ? 'right' : 'left'}: ${cfg.size + 8}px;

                /* Vertical: anchor to opposite of screen edge */
                ${pos.vertical === 'bottom' ? 'bottom' : 'top'}: 0;

                background: rgba(20, 20, 20, 0.95);
                color: #fff;
                padding: 12px 14px;
                border-radius: 8px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                font-size: 12px;
                pointer-events: none;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.15s ease, visibility 0.15s ease;
                box-shadow: 0 4px 16px rgba(0,0,0,0.4);
                z-index: ${cfg.zIndex + 1};
                border: 1px solid #333;
                white-space: nowrap;
            }

            .ptd-btn[data-hover="true"] .ptd-tooltip {
                opacity: 1;
                visibility: visible;
            }

            .ptd-tooltip-title {
                font-weight: 600;
                font-size: 13px;
                margin-bottom: 8px;
                padding-bottom: 8px;
                border-bottom: 1px solid #444;
            }

            .ptd-tooltip-grid {
                display: grid;
                grid-template-columns: auto auto;
                gap: 6px 16px;
                align-items: center;
            }

            .ptd-tooltip-action {
                color: #aaa;
                font-size: 11px;
            }

            .ptd-tooltip-desc {
                color: #fff;
                font-size: 12px;
            }
        `;
    }

    //================================================================================
    // FLOATING BUTTON (Shadow DOM)
    //================================================================================

    function addFloatingDownloadButton() {
        if (!document.body) return;

        const shadowHost = document.createElement('div');
        shadowHost.id = 'page-text-downloader-host';
        Object.assign(shadowHost.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '0',
            height: '0',
            overflow: 'visible',
            zIndex: CONFIG.button.zIndex.toString(),
            pointerEvents: 'none',
            userSelect: 'none'
        });

        shadowRoot = shadowHost.attachShadow({ mode: 'closed' });

        const style = document.createElement('style');
        style.textContent = getStyles();
        shadowRoot.appendChild(style);

        const container = document.createElement('div');
        container.className = 'ptd-container';
        containerElement = container;

        const btn = document.createElement('div');
        btn.className = 'ptd-btn';

        // Build tooltip with grid layout
        const tooltip = document.createElement('div');
        tooltip.className = 'ptd-tooltip';

        const tooltipTitle = document.createElement('div');
        tooltipTitle.className = 'ptd-tooltip-title';
        tooltipTitle.textContent = '📄 Page Text Downloader';

        const tooltipGrid = document.createElement('div');
        tooltipGrid.className = 'ptd-tooltip-grid';

        const tooltipItems = [
            ['🖱️ Click', 'Download page (.md)'],
            ['✂️ Select + Click', 'Download selection'],
            ['⇧ Shift + Click', 'Download clipboard'],
            ['⏱️ Hold', 'Copy to clipboard'],
            ['👆 Double-click', 'Hide 5s']
        ];

        tooltipItems.forEach(([action, desc]) => {
            const actionEl = document.createElement('span');
            actionEl.className = 'ptd-tooltip-action';
            actionEl.textContent = action;

            const descEl = document.createElement('span');
            descEl.className = 'ptd-tooltip-desc';
            descEl.textContent = desc;

            tooltipGrid.appendChild(actionEl);
            tooltipGrid.appendChild(descEl);
        });

        tooltip.appendChild(tooltipTitle);
        tooltip.appendChild(tooltipGrid);
        btn.appendChild(tooltip);

        const iconContainer = document.createElement('div');
        iconContainer.className = 'ptd-icon-container';

        const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        iconSvg.setAttribute('class', 'ptd-icon');
        iconSvg.setAttribute('viewBox', '0 0 24 24');
        iconSvg.setAttribute('fill', 'none');
        iconSvg.setAttribute('stroke', '#555');
        iconSvg.setAttribute('stroke-width', '2');
        iconSvg.setAttribute('stroke-linecap', 'round');
        iconSvg.setAttribute('stroke-linejoin', 'round');

        const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path1.setAttribute('d', 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z');

        const polyline1 = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polyline1.setAttribute('points', '14 2 14 8 20 8');

        const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line1.setAttribute('x1', '16');
        line1.setAttribute('y1', '13');
        line1.setAttribute('x2', '8');
        line1.setAttribute('y2', '13');

        const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line2.setAttribute('x1', '16');
        line2.setAttribute('y1', '17');
        line2.setAttribute('x2', '8');
        line2.setAttribute('y2', '17');

        const polyline2 = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polyline2.setAttribute('points', '10 9 9 9 8 9');

        iconSvg.appendChild(path1);
        iconSvg.appendChild(polyline1);
        iconSvg.appendChild(line1);
        iconSvg.appendChild(line2);
        iconSvg.appendChild(polyline2);

        iconContainer.appendChild(iconSvg);
        btn.appendChild(iconContainer);

        const progressRing = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        progressRing.setAttribute('class', 'ptd-progress-ring');
        progressRing.setAttribute('viewBox', '0 0 36 36');

        const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        progressCircle.setAttribute('cx', '18');
        progressCircle.setAttribute('cy', '18');
        progressCircle.setAttribute('r', '16');
        progressCircle.setAttribute('fill', 'none');
        progressCircle.setAttribute('stroke', '#4CAF50');
        progressCircle.setAttribute('stroke-width', '2');
        progressCircle.setAttribute('stroke-dasharray', '100.53');
        progressCircle.setAttribute('stroke-dashoffset', '100.53');

        progressRing.appendChild(progressCircle);
        btn.appendChild(progressRing);

        container.appendChild(btn);
        shadowRoot.appendChild(container);

        notificationElement = document.createElement('div');
        notificationElement.className = 'ptd-notification';
        notificationElement.setAttribute('data-type', 'info');
        shadowRoot.appendChild(notificationElement);

        // Extension modal will be created on demand
        extensionModalElement = null;

        document.body.appendChild(shadowHost);

        //================================================================================
        // STATE & HELPERS
        //================================================================================

        let pressTimer = null;
        let isLongPress = false;
        let lastClickTime = 0;
        let hideTimeout = null;
        let isHovering = false;
        let cachedRect = null;

        const setHover = (val) => {
            if (isHovering === val) return;
            isHovering = val;
            btn.setAttribute('data-hover', val ? 'true' : 'false');
        };

        const setActive = (val) => {
            btn.setAttribute('data-active', val ? 'true' : 'false');
        };

        const resetProgressRing = () => {
            progressRing.classList.remove('visible');
            progressCircle.setAttribute('stroke-dashoffset', '100.53');
        };

        // Robust coordinate check to fix "stuck" highlight on sites like Instagram
        const onDocumentMouseMove = (e) => {
            if (!cachedRect) return;
            const x = e.clientX, y = e.clientY, t = 2;
            if (x < cachedRect.left - t || x > cachedRect.right + t ||
                y < cachedRect.top - t || y > cachedRect.bottom + t) {
                setHover(false);
                stopHoverTracking();
            }
        };

        const startHoverTracking = () => {
            cachedRect = btn.getBoundingClientRect();
            document.addEventListener('mousemove', onDocumentMouseMove, { capture: true, passive: true });
        };

        const stopHoverTracking = () => {
            cachedRect = null;
            document.removeEventListener('mousemove', onDocumentMouseMove, { capture: true });
        };

        //================================================================================
        // MOUSE EVENTS
        //================================================================================

        // Hover events (Pure Event-Based: Zero timers, robust cross-site)
        btn.addEventListener('mouseenter', () => {
            setHover(true);
            startHoverTracking();
        });

        btn.addEventListener('mouseleave', () => {
            setHover(false);
            stopHoverTracking();
            if (pressTimer) {
                clearTimeout(pressTimer);
                pressTimer = null;
                setActive(false);
                resetProgressRing();
            }
        });

        // Pointerleave fallback for modern touch/hybrid support
        btn.addEventListener('pointerleave', () => {
            setHover(false);
            stopHoverTracking();
        });

        btn.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            e.preventDefault();

            isLongPress = false;
            setActive(true);
            progressRing.classList.add('visible');

            // Purple ring for copy action
            progressCircle.setAttribute('stroke', '#9C27B0');

            const circumference = 100.53;
            const duration = CONFIG.timing.copyHoldThreshold;
            const startTime = Date.now();

            const animateProgress = () => {
                if (!pressTimer) return;
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                progressCircle.setAttribute('stroke-dashoffset', (circumference * (1 - progress)).toString());
                if (progress < 1) requestAnimationFrame(animateProgress);
            };

            requestAnimationFrame(animateProgress);

            pressTimer = setTimeout(() => {
                isLongPress = true;
                pressTimer = null;
                if (navigator.vibrate) navigator.vibrate(50);
                resetProgressRing();
                setActive(false);
                copyToClipboard();
            }, CONFIG.timing.copyHoldThreshold);
        });

        btn.addEventListener('mouseup', (e) => {
            if (e.button !== 0) return;

            const wasShiftHeld = e.shiftKey;
            const selectedText = getSelectedText();

            clearTimeout(pressTimer);
            pressTimer = null;
            resetProgressRing();
            setActive(false);

            if (isLongPress) {
                isLongPress = false;
                return;
            }

            const now = Date.now();
            const timeSinceLastClick = now - lastClickTime;
            lastClickTime = now;

            // Double-click: hide temporarily
            if (timeSinceLastClick < CONFIG.timing.doubleClickThreshold) {
                window.getSelection?.().removeAllRanges();
                STATE.hidden = true;
                stopHoverTracking();
                setHover(false);
                updateVisibility();

                if (hideTimeout) clearTimeout(hideTimeout);
                hideTimeout = setTimeout(() => {
                    STATE.hidden = false;
                    updateVisibility();
                }, CONFIG.timing.hideTemporarilyDuration);
                return;
            }

            // Shift+Click: download clipboard with prompt
            if (wasShiftHeld) {
                downloadClipboard();
                return;
            }

            // Click with selection: download selection with prompt
            if (selectedText) {
                showExtensionPrompt((ext) => {
                    downloadContent(selectedText, ext, 'selection_' + (document.title || 'page'), false);
                });
                return;
            }

            // Plain click: download page as md
            downloadPageText();
        });

        //================================================================================
        // TOUCH EVENTS
        //================================================================================

        btn.addEventListener('touchstart', (e) => {
            if (e.touches.length !== 1) return;
            e.preventDefault();

            isLongPress = false;
            setActive(true);
            progressRing.classList.add('visible');

            // Purple ring for copy action
            progressCircle.setAttribute('stroke', '#9C27B0');

            const circumference = 100.53;
            const duration = CONFIG.timing.copyHoldThreshold;
            const startTime = Date.now();

            const animateProgress = () => {
                if (!pressTimer) return;
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                progressCircle.setAttribute('stroke-dashoffset', (circumference * (1 - progress)).toString());
                if (progress < 1) requestAnimationFrame(animateProgress);
            };

            requestAnimationFrame(animateProgress);

            pressTimer = setTimeout(() => {
                isLongPress = true;
                pressTimer = null;
                if (navigator.vibrate) navigator.vibrate(50);
                resetProgressRing();
                setActive(false);
                copyToClipboard();
            }, CONFIG.timing.copyHoldThreshold);
        }, { passive: false });

        btn.addEventListener('touchend', (e) => {
            e.preventDefault();

            const selectedText = getSelectedText();

            clearTimeout(pressTimer);
            pressTimer = null;
            resetProgressRing();
            setActive(false);

            if (isLongPress) {
                isLongPress = false;
                return;
            }

            const now = Date.now();
            const timeSinceLastClick = now - lastClickTime;
            lastClickTime = now;

            // Double-tap: hide temporarily
            if (timeSinceLastClick < CONFIG.timing.doubleClickThreshold) {
                STATE.hidden = true;
                updateVisibility();

                if (hideTimeout) clearTimeout(hideTimeout);
                hideTimeout = setTimeout(() => {
                    STATE.hidden = false;
                    updateVisibility();
                }, CONFIG.timing.hideTemporarilyDuration);
                return;
            }

            // Tap with selection: download selection with prompt
            if (selectedText) {
                showExtensionPrompt((ext) => {
                    downloadContent(selectedText, ext, 'selection_' + (document.title || 'page'), false);
                });
                return;
            }

            // Plain tap: download page as md
            downloadPageText();
        }, { passive: false });

        btn.addEventListener('touchcancel', () => {
            clearTimeout(pressTimer);
            pressTimer = null;
            isLongPress = false;
            resetProgressRing();
            setActive(false);
        });

        btn.addEventListener('contextmenu', (e) => e.preventDefault());

        //================================================================================
        // CLEANUP
        //================================================================================

        window.addEventListener('beforeunload', () => {
            stopHoverTracking();
        });

        updateVisibility();

        console.log('[Page Text Downloader] Button initialized');
    }

    //================================================================================
    // INIT
    //================================================================================

    if (document.body) {
        addFloatingDownloadButton();
    } else {
        document.addEventListener('DOMContentLoaded', addFloatingDownloadButton);
    }

})();