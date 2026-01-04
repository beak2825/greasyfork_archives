// ==UserScript==
// @name         zhs自动解除粘贴|复制限制 (增强版)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自动解除网页中所有输入框的粘贴限制，带控制面板和开关
// @author       You & AI
// @match        *://*.zhihuishu.com/*
// @icon         https://qah5.zhihuishu.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/538325/zhs%E8%87%AA%E5%8A%A8%E8%A7%A3%E9%99%A4%E7%B2%98%E8%B4%B4%7C%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%20%28%E5%A2%9E%E5%BC%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538325/zhs%E8%87%AA%E5%8A%A8%E8%A7%A3%E9%99%A4%E7%B2%98%E8%B4%B4%7C%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%20%28%E5%A2%9E%E5%BC%BA%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================================================
    // Configuration & State Management
    // ================================================
    let config = {
        scriptEnabled: GM_getValue('scriptEnabled', true),
        copyUnlockEnabled: GM_getValue('copyUnlockEnabled', true),
        pasteUnlockEnabled: GM_getValue('pasteUnlockEnabled', true),
        panelVisible: GM_getValue('panelVisible', true),
    };

    function saveConfig() {
        GM_setValue('scriptEnabled', config.scriptEnabled);
        GM_setValue('copyUnlockEnabled', config.copyUnlockEnabled);
        GM_setValue('pasteUnlockEnabled', config.pasteUnlockEnabled);
        GM_setValue('panelVisible', config.panelVisible);
    }

    // ================================================
    // Global Variables & Handlers
    // ================================================
    let observer = null;
    let panelElement = null;

    // Named event handlers for easy removal
    const selectStartHandler = function(e) {
        e.stopImmediatePropagation();
    };

    const pasteHandler = function(e) {
        const tag = e.target.tagName;
        const contentEditable = e.target.contentEditable;

        if (tag === 'INPUT' || tag === 'TEXTAREA' || contentEditable === 'true') {
            e.stopImmediatePropagation();
            return;
        }
        if (isProtectedElement(e.target)) {
            return;
        }
        e.stopImmediatePropagation();
    };

    // ================================================
    // Core Functionality: Copy Unlock
    // ================================================
    function enableCopyUnlock() {
        if (!config.scriptEnabled || !config.copyUnlockEnabled) return;

        document.addEventListener('selectstart', selectStartHandler, true);
        const elementsToCheck = document.querySelectorAll('body, body *');
        elementsToCheck.forEach(el => {
            if (el.onselectstart) {
                el.onselectstart = null;
            }
        });
        console.log('[解除限制] 复制功能已启用');
    }

    function disableCopyUnlock() {
        document.removeEventListener('selectstart', selectStartHandler, true);
        // Note: Restoring original onselectstart is complex and often not necessary.
        // This script aims to override, so disabling means removing our override.
        console.log('[解除限制] 复制功能已禁用');
    }

    // ================================================
    // Core Functionality: Paste Unlock
    // ================================================
    function enablePasteUnlock() {
        if (!config.scriptEnabled || !config.pasteUnlockEnabled) return;

        document.addEventListener('paste', pasteHandler, true);
        const editableElements = document.querySelectorAll('input, textarea, [contenteditable="true"]');
        editableElements.forEach(el => {
            el.onpaste = null;
            el.dataset.pasteUnlocked = 'true';
        });
        console.log('[解除限制] 粘贴功能已启用');
        setupEfficientObserver(); // Observer depends on paste unlock
    }

    function disablePasteUnlock() {
        document.removeEventListener('paste', pasteHandler, true);
        if (observer) {
            observer.disconnect();
            observer = null;
            console.log('[解除限制] MutationObserver已停止 (因粘贴禁用)');
        }
        console.log('[解除限制] 粘贴功能已禁用');
    }

    // ================================================
    // DOM Change Handling (MutationObserver)
    // ================================================
    function setupEfficientObserver() {
        if (!config.scriptEnabled || !config.pasteUnlockEnabled) {
            if (observer) observer.disconnect();
            return;
        }
        if (observer) observer.disconnect(); // Ensure only one observer runs

        observer = new MutationObserver(mutations => {
            // Debounce or delay processing
            setTimeout(checkForNewInputs, 300);
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
        console.log('[解除限制] MutationObserver已启动');
    }

    function checkForNewInputs() {
        if (!config.scriptEnabled || !config.pasteUnlockEnabled) return;

        const newEditableElements = document.querySelectorAll('input:not([data-paste-unlocked]), textarea:not([data-paste-unlocked]), [contenteditable="true"]:not([data-paste-unlocked])');
        newEditableElements.forEach(input => {
            input.onpaste = null;
            input.dataset.pasteUnlocked = 'true';
        });
    }

    // ================================================
    // Protected Elements
    // ================================================
    function isProtectedElement(element) {
        if (!element || !element.tagName) return false;
        const protectedTags = ['BUTTON', 'A', 'NAV', 'MENU', 'VIDEO', 'AUDIO'];
        if (protectedTags.includes(element.tagName.toUpperCase())) return true;

        const protectedClasses = ['player', 'video-control', 'menu', 'navigation', 'btn', 'button'];
        if (element.classList && Array.from(element.classList).some(cls => protectedClasses.includes(cls))) {
            return true;
        }
        const protectedIds = ['player', 'controls', 'navigation-bar', 'sidebar'];
        if (element.id && protectedIds.includes(element.id)) return true;
        return false;
    }

    // ================================================
    // Control Panel
    // ================================================
    function createControlPanel() {
        if (document.getElementById('unlocker-panel-v2')) return;

        panelElement = document.createElement('div');
        panelElement.id = 'unlocker-panel-v2';
        panelElement.style.cssText = `
            position: fixed; top: 70px; right: 20px; z-index: 2147483647;
            background: rgba(30, 30, 45, 0.95); color: #e8e8ff;
            border-radius: 12px; padding: 18px 22px;
            font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            box-shadow: 0 6px 20px rgba(0,0,0,0.5);
            backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(100, 100, 150, 0.4);
            font-size: 14px; transition: transform 0.3s ease-out, opacity 0.3s ease-out;
            opacity: ${config.panelVisible ? '1' : '0'};
            transform: ${config.panelVisible ? 'translateX(0)' : 'translateX(100%) translateY(-20px) scale(0.9)'};
            pointer-events: ${config.panelVisible ? 'auto' : 'none'};
        `;

        const panelHTML = `
            <style>
                #unlocker-panel-v2 h3 { margin:0 0 15px; font-size:17px; color:#7afFAF; border-bottom:1px solid rgba(255,255,255,0.15); padding-bottom:10px; display: flex; align-items: center; }
                #unlocker-panel-v2 h3 .icon { display:inline-block; width:12px; height:12px; border-radius:50%; background:#7afFAF; margin-right:10px; box-shadow: 0 0 8px #7afFAF; }
                #unlocker-panel-v2 .control-group { margin-bottom: 15px; }
                #unlocker-panel-v2 label { display: flex; align-items: center; margin-bottom: 8px; color:#c0c0ff; font-weight: 500; }
                #unlocker-panel-v2 .switch { position: relative; display: inline-block; width: 44px; height: 24px; margin-left: auto; }
                #unlocker-panel-v2 .switch input { opacity: 0; width: 0; height: 0; }
                #unlocker-panel-v2 .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #505070; transition: .3s; border-radius: 24px; }
                #unlocker-panel-v2 .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
                #unlocker-panel-v2 input:checked + .slider { background-color: #6cffa8; }
                #unlocker-panel-v2 input:checked + .slider:before { transform: translateX(20px); }
                #unlocker-panel-v2 .sub-controls { padding-left: 10px; border-left: 2px solid #404060; margin-top: 10px; }
                #unlocker-panel-v2 .sub-controls.disabled { opacity: 0.5; pointer-events: none; }
                #unlocker-panel-v2 .panel-actions { text-align: center; margin-top: 15px; }
                #unlocker-panel-v2 #toggle-panel-visibility { padding:6px 14px; background:rgba(100,100,150,0.3); color:#c0c0ff; border:1px solid rgba(100,100,150,0.6); border-radius:6px; cursor:pointer; transition:all 0.2s; font-size:13px; }
                #unlocker-panel-v2 #toggle-panel-visibility:hover { background:rgba(120,120,170,0.4); }
            </style>
            <h3><span class="icon"></span>解除限制面板</h3>
            <div class="control-group">
                <label>启用脚本总开关
                    <span class="switch">
                        <input type="checkbox" id="toggle-script-enabled">
                        <span class="slider"></span>
                    </span>
                </label>
            </div>
            <div id="sub-controls-container" class="sub-controls">
                <div class="control-group">
                    <label>解除复制限制
                        <span class="switch">
                            <input type="checkbox" id="toggle-copy-unlock">
                            <span class="slider"></span>
                        </span>
                    </label>
                </div>
                <div class="control-group">
                    <label>解除粘贴限制
                        <span class="switch">
                            <input type="checkbox" id="toggle-paste-unlock">
                            <span class="slider"></span>
                        </span>
                    </label>
                </div>
            </div>
            <div class="panel-actions">
                 <button id="toggle-panel-visibility">隐藏面板 (Alt+Q)</button>
            </div>
        `;
        panelElement.innerHTML = panelHTML;
        document.body.appendChild(panelElement);

        // Cache elements
        const scriptEnabledToggle = document.getElementById('toggle-script-enabled');
        const copyUnlockToggle = document.getElementById('toggle-copy-unlock');
        const pasteUnlockToggle = document.getElementById('toggle-paste-unlock');
        const subControlsContainer = document.getElementById('sub-controls-container');

        // Set initial states
        scriptEnabledToggle.checked = config.scriptEnabled;
        copyUnlockToggle.checked = config.copyUnlockEnabled;
        pasteUnlockToggle.checked = config.pasteUnlockEnabled;

        function updateSubControlsState() {
            if (config.scriptEnabled) {
                subControlsContainer.classList.remove('disabled');
            } else {
                subControlsContainer.classList.add('disabled');
            }
        }
        updateSubControlsState();

        // Add event listeners
        scriptEnabledToggle.addEventListener('change', function() {
            config.scriptEnabled = this.checked;
            updateSubControlsState();
            if (config.scriptEnabled) {
                activateFeatures();
            } else {
                deactivateFeatures();
            }
            saveConfig();
        });

        copyUnlockToggle.addEventListener('change', function() {
            config.copyUnlockEnabled = this.checked;
            if (config.scriptEnabled) { // Only apply if script is globally enabled
                if (this.checked) enableCopyUnlock();
                else disableCopyUnlock();
            }
            saveConfig();
        });

        pasteUnlockToggle.addEventListener('change', function() {
            config.pasteUnlockEnabled = this.checked;
            if (config.scriptEnabled) { // Only apply if script is globally enabled
                if (this.checked) enablePasteUnlock();
                else disablePasteUnlock();
            }
            saveConfig();
        });

        document.getElementById('toggle-panel-visibility').addEventListener('click', togglePanelVisibility);
    }

    function togglePanelVisibility() {
        config.panelVisible = !config.panelVisible;
        if (panelElement) {
             panelElement.style.opacity = config.panelVisible ? '1' : '0';
             panelElement.style.transform = config.panelVisible ? 'translateX(0)' : 'translateX(100%) translateY(-20px) scale(0.9)';
             panelElement.style.pointerEvents = config.panelVisible ? 'auto' : 'none';
             const button = document.getElementById('toggle-panel-visibility');
             if(button) button.textContent = config.panelVisible ? '隐藏面板 (Alt+Q)' : '显示面板 (Alt+Q)';
        }
        saveConfig();
    }

    function handlePanelShortcut(e) {
        if (e.altKey && e.key.toLowerCase() === 'q') {
            e.preventDefault();
            e.stopPropagation();
            togglePanelVisibility();
        }
    }


    // ================================================
    // Activation & Deactivation
    // ================================================
    function activateFeatures() {
        console.log('[解除限制] 脚本功能已激活');
        if (config.copyUnlockEnabled) enableCopyUnlock();
        if (config.pasteUnlockEnabled) enablePasteUnlock(); // This will also setup observer if needed
    }

    function deactivateFeatures() {
        console.log('[解除限制] 脚本功能已停用');
        disableCopyUnlock();
        disablePasteUnlock(); // This will also disconnect observer
        if (observer) {
            observer.disconnect();
            observer = null;
            console.log('[解除限制] MutationObserver已停止');
        }
    }

    // ================================================
    // Initialization
    // ================================================
    function initialize() {
        // Create panel after a slight delay to ensure body is ready
        setTimeout(() => {
            createControlPanel();
            // Initial application of features based on saved config
            if (config.scriptEnabled) {
                activateFeatures();
            } else {
                 // Ensure sub-controls are visually disabled if master is off
                const subControlsContainer = document.getElementById('sub-controls-container');
                if (subControlsContainer) subControlsContainer.classList.add('disabled');
            }
        }, 1000); // Delay for panel creation & initial feature activation

        // Add shortcut listener
        document.addEventListener('keydown', handlePanelShortcut, true);

        // Memory monitoring (optional, kept from original)
        monitorMemoryUsage();
    }

    // ================================================
    // Memory Monitoring (from original, kept as is)
    // ================================================
    function monitorMemoryUsage() {
        if (typeof performance?.memory?.usedJSHeapSize === 'undefined') return;
        const logInterval = setInterval(() => {
            if (!config.scriptEnabled) return; // Only monitor if script is doing something
            const memoryUsed = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024 * 100) / 100;
            // console.debug(`[解除限制] 内存使用: ${memoryUsed} MB`);
            if (memoryUsed > 1024) { // 1GB
                console.warn('[解除限制] 内存使用过高，安全清理中...');
                deactivateFeatures(); // Full deactivation
                if (panelElement) panelElement.remove(); // Remove panel
                clearInterval(logInterval); // Stop this monitor
            }
        }, 30000); // Check every 30s
        window.addEventListener('beforeunload', () => clearInterval(logInterval));
    }

    // ================================================
    // Adaptive Execution (modified for readiness)
    // ================================================
    function adaptiveInit() {
        const initFn = () => {
            // Ensure init runs only once
            if (window.copyPasteUnlockerInitialized) return;
            window.copyPasteUnlockerInitialized = true;
            initialize();
        };

        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setTimeout(initFn, 500); // Slight delay even if ready
        } else {
            window.addEventListener('DOMContentLoaded', () => setTimeout(initFn, 500));
        }
    }

    // Start the script
    adaptiveInit();

    // Provide manual control if needed (e.g., from browser console)
    window.copyPasteUnlocker = {
        enable: () => {
            config.scriptEnabled = true;
            activateFeatures();
            if(panelElement) document.getElementById('toggle-script-enabled').checked = true;
            saveConfig();
            console.log('[解除限制] 手动启用完成。');
        },
        disable: () => {
            config.scriptEnabled = false;
            deactivateFeatures();
            if(panelElement) document.getElementById('toggle-script-enabled').checked = false;
            saveConfig();
            console.log('[解除限制] 手动禁用完成。');
        },
        togglePanel: togglePanelVisibility,
        getConfig: () => config
    };

})();