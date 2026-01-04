// ==UserScript==
// @name         Slidebar - GitHub PR Sidebar Enhancer
// @namespace    https://github.com/AstroMash/userscripts
// @version      1.0.0
// @description  Make GitHub's PR sidebar actually usable - resizable, with tooltips and optional horizontal scrolling. Settings are persistent and configurable via a button on the toolbar.
// @author       AstroMash
// @icon         https://raw.githubusercontent.com/astromash/userscripts/main/scripts/github-slidebar/icon.png
// @match        https://github.com/*/pull/*
// @match        https://github.com/*/pulls/*
// @match        https://github.com/*/compare/*
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546128/Slidebar%20-%20GitHub%20PR%20Sidebar%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/546128/Slidebar%20-%20GitHub%20PR%20Sidebar%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const APP_NAME = 'Slidebar';
    const STORAGE_KEY = 'slidebarConfig';
    const MAX_INIT_ATTEMPTS = 10;

    const DEFAULT_CONFIG = {
        enableResizing: true,
        enableTooltips: true,
        enableHorizontalScroll: false,
        sidebarWidth: 296, // GitHub's default
        minWidth: 200,
        maxWidth: 600,
    };

    let config = { ...DEFAULT_CONFIG, ...GM_getValue(STORAGE_KEY, {}) };
    let initAttempts = 0;
    let configButtonAttempts = 0;
    let configButtonAdded = false;
    let currentObserver = null;
    let resizeCleanup = null;
    let isInitialized = false;

    if (typeof GM_addStyle === 'function') {
        GM_addStyle(`
            /* Resize handle */
            /*****************/

            .slidebar-resize-handle {
                position: absolute;
                width: 4px;
                height: 100%;
                cursor: col-resize;
                z-index: 100;
                background: transparent;
                transition: background 0.2s ease;
            }
            .slidebar-resize-handle:hover,
            .slidebar-resize-handle.dragging {
                background: rgba(59, 130, 246, 0.5);
            }

            /* Config button */
            /*****************/

            .slidebar-config-btn {
                background: none;
                border: none;
                padding: 4px;
                cursor: pointer;
                color: var(--fgColor-muted);
                transition: color 0.2s ease;
            }
            .slidebar-config-btn:hover {
                color: var(--fgColor-accent);
            }

            /* Modal */
            /*********/

            .slidebar-modal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.2s ease;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .slidebar-modal {
                border-color: var(--borderColor-default, var(--color-border-default));
                box-shadow: var(--shadow-floating-legacy, var(--color-shadow-large));
                border-radius: 8px;
                padding: 0;
                min-width: 320px;
                max-width: 420px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
                animation: slideUp 0.3s ease;
            }
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            .slidebar-modal-header {
                padding: 16px 20px;
                border-bottom: 1px solid var(--color-border-default);
                font-size: 16px;
                font-weight: 600;
            }

            .slidebar-modal-body {
                padding: 20px;
            }

            .slidebar-modal-footer {
                padding: 16px 20px;
                border-top: 1px solid var(--color-border-default);
                display: flex;
                justify-content: flex-end;
                gap: 8px;
            }

            .slidebar-checkbox-label {
                display: flex;
                align-items: flex-start;
                margin-bottom: 12px;
                cursor: pointer;
                user-select: none;
            }

            .slidebar-checkbox-label input {
                margin-right: 8px;
                margin-top: 2px;
                cursor: pointer;
            }

            .slidebar-checkbox-text {
                flex: 1;
            }

            .slidebar-checkbox-title {
                font-weight: 500;
                margin-bottom: 2px;
                color: var(--color-fg-default);
            }

            .slidebar-checkbox-desc {
                font-size: 12px;
                color: var(--color-fg-muted);
            }

            .slidebar-width-control {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-top: 16px;
                padding-top: 16px;
                border-top: 1px solid var(--color-border-muted);
            }

            .slidebar-width-input {
                width: 80px;
                padding: 4px 8px;
                border: 1px solid var(--color-border-default);
                border-radius: 6px;
                background: var(--color-canvas-subtle);
                color: var(--color-fg-default);
            }

            .slidebar-btn {
                padding: 5px 16px;
                border-radius: 6px;
                border: 1px solid var(--color-btn-border);
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .slidebar-btn-primary {
                background: var(--color-btn-primary-bg);
                color: var(--color-btn-primary-text);
                border-color: var(--color-btn-primary-border);
            }

            .slidebar-btn-primary:hover {
                background: var(--color-btn-primary-hover-bg);
            }

            .slidebar-btn-secondary {
                background: var(--color-btn-bg);
                color: var(--color-btn-text);
            }

            .slidebar-btn-secondary:hover {
                background: var(--color-btn-hover-bg);
            }

            /* Horizontal scrolling */
            /************************/

            .slidebar-scrollable {
                overflow-x: auto !important;
                white-space: nowrap !important;
                text-overflow: initial !important;
            }

            .slidebar-scrollable::-webkit-scrollbar {
                height: 4px;
            }

            .slidebar-scrollable::-webkit-scrollbar-track {
                background: transparent;
            }

            .slidebar-scrollable::-webkit-scrollbar-thumb {
                background: var(--color-border-muted);
                border-radius: 2px;
            }
        `);
    }

    function log(message, level = 'log') {
        if (level === 'error') {
            console.error(`[${APP_NAME}]`, message);
        } else {
            console.log(`[${APP_NAME}]`, message);
        }
    }

    function cleanup() {
        if (currentObserver) {
            currentObserver.disconnect();
            currentObserver = null;
        }
        if (resizeCleanup) {
            resizeCleanup();
            resizeCleanup = null;
        }

        document
            .querySelectorAll('.slidebar-resize-handle, .slidebar-config-btn')
            .forEach((el) => el.remove());

        isInitialized = false;
        configButtonAdded = false;
        initAttempts = 0;
        configButtonAttempts = 0;
    }

    function init() {
        if (isInitialized) return;

        if (initAttempts >= MAX_INIT_ATTEMPTS) {
            log('Max initialization attempts reached. Giving up.', 'error');
            return;
        }

        initAttempts++;

        const diffLayout = document.getElementById('diff-layout-component');
        if (!diffLayout) {
            log(`Attempt ${initAttempts}: diff-layout not found, retrying...`);
            setTimeout(init, 1000);
            return;
        }

        const sidebarContainer = diffLayout.querySelector(
            '[data-target="diff-layout.sidebarContainer"]'
        );
        const mainContainer = diffLayout.querySelector(
            '[data-target="diff-layout.mainContainer"]'
        );

        if (!sidebarContainer || !mainContainer) {
            log(`Attempt ${initAttempts}: containers not found, retrying...`);
            setTimeout(init, 1000);
            return;
        }

        isInitialized = true;
        initAttempts = 0;

        applySidebarWidth(sidebarContainer, config.sidebarWidth);
        addConfigButton(sidebarContainer);

        // Set up features
        if (config.enableResizing) {
            resizeCleanup = addResizeHandle(diffLayout, sidebarContainer);
        }
        if (config.enableTooltips) {
            addTooltips(sidebarContainer);
        } else {
            removeTooltips(sidebarContainer);
        }
        if (config.enableHorizontalScroll) {
            enableHorizontalScroll(sidebarContainer);
        } else {
            disableHorizontalScroll(sidebarContainer);
        }

        // Observe for dynamic content
        observeForChanges(sidebarContainer);

        // log has 2 parameters: message and level
        let msg = `Initialized successfully with config:`;
        msg += `\n- Resizing: ${config.enableResizing}`;
        msg += `\n- Tooltips: ${config.enableTooltips}`;
        msg += `\n- Horizontal Scroll: ${config.enableHorizontalScroll}`;
        msg += `\n- Sidebar Width: ${config.sidebarWidth}px`;
        msg += `\n- Min Width: ${config.minWidth}px`;
        msg += `\n- Max Width: ${config.maxWidth}px`;
        log(msg);
    }

    function applySidebarWidth(container, width) {
        const clampedWidth = Math.max(
            config.minWidth,
            Math.min(config.maxWidth, width)
        );
        container.style.width = `${clampedWidth}px`;
        container.style.minWidth = `${clampedWidth}px`;
        container.style.flexBasis = `${clampedWidth}px`;
    }

    function addConfigButton(sidebarContainer) {
        if (configButtonAdded) {
            log('Config button already added, skipping.');
            return;
        }
        const fileTreeToggle =
            document.getElementsByTagName('file-tree-toggle')[0];
        if (!fileTreeToggle) {
            if (configButtonAttempts < 5) {
                configButtonAttempts++;
                log(
                    `Attempt ${configButtonAttempts}: file tree toggle not found, retrying...`
                );
                setTimeout(() => addConfigButton(sidebarContainer), 1000);
            } else {
                log(
                    'File tree toggle not found after multiple attempts, giving up.',
                    'error'
                );
            }
            return;
        }
        const parent = fileTreeToggle.parentElement;
        if (!parent) {
            log(
                'Parent element for file tree toggle not found, cannot add config button.',
                'error'
            );
            return;
        }
        if (parent.querySelector('.slidebar-config-btn')) {
            log('Config button already exists in the parent, skipping.');
            return;
        }

        const button = document.createElement('button');
        button.className = 'slidebar-config-btn';
        button.setAttribute('aria-label', 'Slidebar settings');
        button.setAttribute('title', 'Slidebar settings');
        button.type = 'button';
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16">
                <path fill="currentColor" d="M224,0H32C14.43,0,0,14.43,0,32v192c0,17.57,14.43,32,32,32h192c17.57,0,32-14.43,32-32V32c0-17.57-14.43-32-32-32ZM223.93,216.59H31.93v-32.92h192.13l-.13,32.92ZM224.07,177.67h-28.38v-26.79l28.38.02v26.77ZM223.93,144.38H31.93v-32.92h192.13l-.13,32.92ZM31.93,105.84v-26.79l28.38.02v26.77h-28.38ZM223.93,72.33H31.93v-32.92h192.13l-.13,32.92Z"/>
            </svg>
        `;

        button.addEventListener('click', showConfigModal);
        parent.insertBefore(button, fileTreeToggle.nextSibling);
        configButtonAdded = true;
        log('Config button added successfully');
    }

    function addResizeHandle(diffLayout, sidebarContainer) {
        // Remove any existing handle
        diffLayout.querySelector('.slidebar-resize-handle')?.remove();

        const handle = document.createElement('div');
        handle.className = 'slidebar-resize-handle';

        function updatePosition() {
            const rect = sidebarContainer.getBoundingClientRect();
            const parentRect = diffLayout.getBoundingClientRect();
            handle.style.left = `${rect.right - parentRect.left - 2}px`;
        }

        updatePosition();
        diffLayout.style.position = 'relative';
        diffLayout.appendChild(handle);

        let startX, startWidth;

        function onMouseDown(e) {
            if (e.button !== 0) return; // Only left click

            startX = e.clientX;
            startWidth = parseInt(getComputedStyle(sidebarContainer).width, 10);
            handle.classList.add('dragging');

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            e.preventDefault();
        }

        function onMouseMove(e) {
            if (e.buttons !== 1) {
                onMouseUp();
                return;
            }

            const newWidth = Math.max(
                config.minWidth,
                Math.min(config.maxWidth, startWidth + (e.clientX - startX))
            );
            applySidebarWidth(sidebarContainer, newWidth);
            updatePosition();
        }

        function onMouseUp() {
            handle.classList.remove('dragging');
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            const finalWidth = parseInt(
                getComputedStyle(sidebarContainer).width,
                10
            );
            if (finalWidth !== config.sidebarWidth) {
                config.sidebarWidth = finalWidth;
                GM_setValue(STORAGE_KEY, config);
                log(`Saved new width: ${finalWidth}px`);
            }
        }

        handle.addEventListener('mousedown', onMouseDown);

        return () => {
            handle.removeEventListener('mousedown', onMouseDown);
            handle.remove();
        };
    }

    function addTooltips(container) {
        const truncated = container.querySelectorAll(
            '.ActionList-item-label--truncate'
        );
        let added = 0;

        truncated.forEach((el) => {
            if (el.scrollWidth > el.clientWidth && !el.hasAttribute('title')) {
                el.setAttribute('title', el.textContent.trim());
                added++;
            }
        });

        if (added > 0) {
            log(`Added tooltips to ${added} truncated items`);
        }
    }

    function removeTooltips(container) {
        const items = container.querySelectorAll('.ActionList-item-label');
        items.forEach((el) => {
            el.removeAttribute('title');
        });
        log(`Removed tooltips from ${items.length} items`);
    }

    function enableHorizontalScroll(container) {
        const truncated = container.querySelectorAll(
            '.ActionList-item-label--truncate'
        );

        truncated.forEach((el) => {
            el.classList.add('slidebar-scrollable');
        });
    }

    function disableHorizontalScroll(container) {
        const items = container.querySelectorAll('.slidebar-scrollable');
        // Some items may have been scrolled and would be stuck partially visible
        // unless we set scrollLeft to 0
        items.forEach((el) => {
            el.scrollLeft = 0;
            el.classList.remove('slidebar-scrollable');
        });
    }

    function observeForChanges(container) {
        if (currentObserver) {
            currentObserver.disconnect();
        }

        currentObserver = new MutationObserver((mutations) => {
            const hasRelevantChanges = mutations.some(
                (m) => m.type === 'childList' && m.addedNodes.length > 0
            );

            if (hasRelevantChanges) {
                if (config.enableTooltips) {
                    addTooltips(container);
                } else {
                    removeTooltips(container);
                }
                if (config.enableHorizontalScroll) {
                    enableHorizontalScroll(container);
                } else {
                    disableHorizontalScroll(container);
                }
            }
        });

        currentObserver.observe(container, {
            childList: true,
            subtree: true,
        });
    }

    function showConfigModal() {
        const overlay = document.createElement('div');
        overlay.className = 'slidebar-modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'slidebar-modal select-menu-modal';

        modal.innerHTML = `
            <div class="slidebar-modal-header">
                Slidebar Settings
            </div>
            <div class="slidebar-modal-body">
                <label class="slidebar-checkbox-label">
                    <input type="checkbox" id="slidebar-opt-resize" ${
                        config.enableResizing ? 'checked' : ''
                    }>
                    <div class="slidebar-checkbox-text">
                        <div class="slidebar-checkbox-title">Enable Sidebar Resizing</div>
                        <div class="slidebar-checkbox-desc">Drag the edge to resize the file tree</div>
                    </div>
                </label>

                <label class="slidebar-checkbox-label">
                    <input type="checkbox" id="slidebar-opt-tooltips" ${
                        config.enableTooltips ? 'checked' : ''
                    }>
                    <div class="slidebar-checkbox-text">
                        <div class="slidebar-checkbox-title">Show Tooltips</div>
                        <div class="slidebar-checkbox-desc">Display full names on hover for truncated files</div>
                    </div>
                </label>

                <label class="slidebar-checkbox-label">
                    <input type="checkbox" id="slidebar-opt-scroll" ${
                        config.enableHorizontalScroll ? 'checked' : ''
                    }>
                    <div class="slidebar-checkbox-text">
                        <div class="slidebar-checkbox-title">Horizontal Scrolling</div>
                        <div class="slidebar-checkbox-desc">Allow scrolling long file names instead of truncating</div>
                    </div>
                </label>

                <div class="slidebar-width-control">
                    <label for="slidebar-width">Sidebar Width:</label>
                    <input type="number" id="slidebar-width" class="slidebar-width-input"
                           value="${config.sidebarWidth}" min="${
            config.minWidth
        }" max="${config.maxWidth}">
                    <span>px</span>
                </div>
            </div>
            <div class="slidebar-modal-footer">
                <button class="slidebar-btn slidebar-btn-secondary" id="slidebar-cancel">Cancel</button>
                <button class="slidebar-btn slidebar-btn-primary" id="slidebar-save">Save Changes</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Focus management
        const firstInput = modal.querySelector('input');
        firstInput?.focus();

        function close() {
            overlay.remove();
        }

        function save() {
            config.enableResizing = document.getElementById(
                'slidebar-opt-resize'
            ).checked;
            config.enableTooltips = document.getElementById(
                'slidebar-opt-tooltips'
            ).checked;
            config.enableHorizontalScroll = document.getElementById(
                'slidebar-opt-scroll'
            ).checked;
            config.sidebarWidth =
                parseInt(document.getElementById('slidebar-width').value, 10) ||
                config.sidebarWidth;

            GM_setValue(STORAGE_KEY, config);
            close();

            // Reinitialize with new settings
            cleanup();
            init();
        }

        // Event handlers
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });

        document
            .getElementById('slidebar-cancel')
            .addEventListener('click', close);
        document
            .getElementById('slidebar-save')
            .addEventListener('click', save);

        // Keyboard handling
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                close();
            } else if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                save();
            }
        });
    }

    // Handle SPA navigation
    function handleNavigation() {
        cleanup();

        // Check if we're still on a PR page
        if (location.pathname.match(/\/(pull|pulls|compare)\//)) {
            setTimeout(init, 500);
        }
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Listen for GitHub's SPA navigation
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            handleNavigation();
        }
    }).observe(document, { subtree: true, childList: true });
})();
