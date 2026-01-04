// ==UserScript==
// @name         Deepseek Code Artifact
// @namespace    https://github.com/Yuichi-Aragi/Userscript/blob/main/CodeArtifactPro.user.js
// @version      3.2
// @description  Turning Deepseek Codeblock into a dedicated Artifact like cluade.
// @author       YA
// @match        https://chat.deepseek.com/a/chat/s/*
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @resource     prismCSS https://cdnjs.cloudflare.com/ajax/libs/prismjs/1.29.0/themes/prism-tomorrow.min.css
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524535/Deepseek%20Code%20Artifact.user.js
// @updateURL https://update.greasyfork.org/scripts/524535/Deepseek%20Code%20Artifact.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const SCRIPT_ID = 'code-artifact-pro-enterprise';
    const config = {
        panelHeightRatio: 0.8,
        debounceTimeout: 150,
        maxCodeSize: 100000, // 100KB
        mobileBreakpoint: 768,
        zIndex: 2147483647
    };
    
    let artifactPanel, observer, mutationDebounce;
    const processedNodes = new WeakSet();
    const mutationQueue = [];
    const state = {
        isPanelOpen: false,
        lastFocusedElement: null,
        prismLoaded: false
    };

    // ==================== PRISM LOADER ====================
    function loadPrism() {
        return new Promise((resolve, reject) => {
            if (typeof Prism !== 'undefined') {
                state.prismLoaded = true;
                return resolve();
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://cdnjs.cloudflare.com/ajax/libs/prismjs/1.29.0/prism.min.js',
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            eval(response.responseText);
                            state.prismLoaded = true;
                            resolve();
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        reject(new Error(`Prism load failed: ${response.status}`));
                    }
                },
                onerror: reject
            });
        });
    }

    // ==================== STYLE MANAGEMENT ====================
    function ensureStyles() {
        const existing = document.querySelector(`style[data-css="${SCRIPT_ID}"]`);
        if (existing) return;

        const style = document.createElement('style');
        style.dataset.css = SCRIPT_ID;
        style.textContent = GM_getResourceText('prismCSS') + getDynamicStyles();
        document.head.appendChild(style);
    }

    function getDynamicStyles() {
        return `
         
        .md-code-block-banner-wrap,
        .md-code-block-banner,
        .md-code-block-infostring,
        .md-code-block-action,
        .ds-markdown-code-copy-button {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            pointer-events: none !important;
        }

       
        .md-code-block-banner-wrap {
            position: absolute !important;
            top: -9999px !important;
            left: -9999px !important;
        }

            :root {
                --artifact-bg: #1e1e1e;
                --artifact-header: #252526;
                --artifact-accent: #007acc;
                --artifact-text: #d4d4d4;
            }

            .artifact-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0,0,0,0.95);
                z-index: ${config.zIndex};
                display: flex;
                justify-content: center;
                align-items: center;
                touch-action: none;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }

            .artifact-overlay.visible {
                opacity: 1;
                pointer-events: auto;
            }

            .artifact-panel {
                width: min(95%, 1200px);
                height: ${config.panelHeightRatio * 100}vh;
                background: var(--artifact-bg);
                border-radius: 12px;
                box-shadow: 0 12px 24px rgba(0,0,0,0.3);
                overflow: hidden;
                display: flex;
                flex-direction: column;
                transform: scale(0.98);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .artifact-panel.active {
                transform: scale(1);
            }

            .artifact-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 14px 20px;
                background: var(--artifact-header);
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }

            .artifact-title {
                color: #fff;
                font: 500 16px/1.4 system-ui, sans-serif;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .artifact-buttons {
                display: flex;
                gap: 8px;
            }

            .artifact-btn {
                background: rgba(255,255,255,0.08);
                border: none;
                color: #fff;
                padding: 8px 16px;
                border-radius: 6px;
                font: 13px/1 system-ui, sans-serif;
                display: flex;
                align-items: center;
                gap: 6px;
                cursor: pointer;
                transition: all 0.2s ease;
                min-width: 80px;
                justify-content: center;
            }

            .artifact-btn:hover {
                background: rgba(255,255,255,0.15);
            }

            .artifact-btn:focus {
                outline: 2px solid var(--artifact-accent);
                outline-offset: 2px;
            }

            .artifact-content {
                flex: 1;
                overflow: auto;
                position: relative;
                -webkit-overflow-scrolling: touch;
            }

            .artifact-code {
                font-family: 'Fira Code', 'Consolas', monospace;
                font-size: 14px;
                tab-size: 4;
                margin: 0;
                padding: 20px !important;
                background: transparent !important;
            }

            .artifact-placeholder {
                position: relative;
                background: rgba(0,122,204,0.1);
                color: var(--artifact-accent);
                padding: 12px 20px;
                border-radius: 8px;
                border: 1px solid rgba(0,122,204,0.3);
                font: 500 14px/1.4 system-ui, sans-serif;
                cursor: pointer;
                transition: all 0.2s ease;
                margin: 8px 0;
                user-select: none;
            }

            .artifact-placeholder:hover {
                background: rgba(0,122,204,0.2);
            }

            @media (max-width: ${config.mobileBreakpoint}px) {
                .artifact-panel {
                    width: 100%;
                    height: 95vh !important;
                    border-radius: 0;
                }
                
                .artifact-btn {
                    padding: 12px 18px;
                    min-width: auto;
                }
                
                .artifact-placeholder {
                    padding: 10px 16px;
                    font-size: 13px;
                }
            }

            pre[class*="language-"] {
                background: transparent !important;
                margin: 0 !important;
            }
        `;
    }

    // ==================== CORE COMPONENTS ====================
    function createArtifactPanel() {
        const overlay = document.createElement('div');
        overlay.className = `artifact-overlay ${SCRIPT_ID}-overlay`;
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'artifact-title');
        
        overlay.innerHTML = `
            <div class="artifact-panel">
                <div class="artifact-header">
                    <div class="artifact-title" id="artifact-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14 3v4a1 1 0 0 0 1 1h4l-5-5m-2 14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5v5a2 2 0 0 0 2 2h5v6a2 2 0 0 1-2 2h-4m-8-4h2m0 0h2m-2 0v-2m0 2v2"/>
                        </svg>
                        Code Artifact Pro
                    </div>
                    <div class="artifact-buttons">
                        <button class="artifact-btn artifact-copy" aria-label="Copy code">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2"/>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                            </svg>
                            Copy
                        </button>
                        <button class="artifact-btn artifact-close" aria-label="Close viewer">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                            Close
                        </button>
                    </div>
                </div>
                <div class="artifact-content">
                    <pre class="artifact-code"><code class="language-plaintext"></code></pre>
                </div>
            </div>
        `;
        
        return overlay;
    }

    // ==================== DOM PROCESSING ====================
    function processMutations() {
        mutationQueue.forEach(({ addedNodes }) => {
            addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.matches('pre')) processPreElement(node);
                    node.querySelectorAll('pre').forEach(processPreElement);
                }
            });
        });
        mutationQueue.length = 0;
    }

    function initObserver() {
        if (observer) observer.disconnect();
        
        observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    mutationQueue.push(mutation);
                    clearTimeout(mutationDebounce);
                    mutationDebounce = setTimeout(processMutations, config.debounceTimeout);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function processPreElement(pre) {
        if (processedNodes.has(pre) || pre.closest(`.${SCRIPT_ID}-overlay`)) return;
        processedNodes.add(pre);

        const placeholder = document.createElement('div');
        placeholder.className = 'artifact-placeholder';
        placeholder.textContent = 'View Code Artifact';
        pre.style.display = 'none';
        pre.parentNode.insertBefore(placeholder, pre);
    }

    // ==================== PANEL CONTROLS ====================
    async function showCode(pre) {
        if (!state.prismLoaded) {
            showNotification('Syntax highlighter not ready yet. Please try again.', true);
            return;
        }

        if (pre.textContent.length > config.maxCodeSize) {
            showNotification('Code exceeds maximum display size (100KB)', true);
            return;
        }

        state.lastFocusedElement = document.activeElement;
        const codeBlock = artifactPanel.querySelector('code');
        const language = detectLanguage(pre);
        
        codeBlock.className = `language-${language}`;
        codeBlock.textContent = pre.textContent.trim();
        
        try {
            Prism.highlightElement(codeBlock);
        } catch (error) {
            codeBlock.className = 'language-plaintext';
            console.warn('Prism highlighting failed:', error);
        }
        
        showPanel();
    }

    function showPanel() {
        artifactPanel.classList.add('visible');
        artifactPanel.querySelector('.artifact-panel').classList.add('active');
        document.documentElement.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyPress);
        adjustPanelHeight();
        state.isPanelOpen = true;
    }

    function hidePanel() {
        artifactPanel.classList.remove('visible');
        artifactPanel.querySelector('.artifact-panel').classList.remove('active');
        document.documentElement.style.overflow = '';
        document.removeEventListener('keydown', handleKeyPress);
        artifactPanel.querySelector('code').textContent = '';
        
        if (state.lastFocusedElement) {
            state.lastFocusedElement.focus({ preventScroll: true });
        }
        state.isPanelOpen = false;
    }

    function handleKeyPress(event) {
        if (event.key === 'Escape') hidePanel();
        if (event.key === 'Tab') maintainFocus(event);
    }

    function maintainFocus(event) {
        const focusable = [...artifactPanel.querySelectorAll('button')];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            last.focus();
            event.preventDefault();
        } else if (!event.shiftKey && document.activeElement === last) {
            first.focus();
            event.preventDefault();
        }
    }

    // ==================== UTILITIES ====================
    function detectLanguage(pre) {
        let languageElement = pre.closest('.md-code-block-banner-wrap')?.querySelector('.md-code-block-infostring');
        let parent = pre.parentElement;
        
        while (parent && !languageElement) {
            languageElement = parent.querySelector('.md-code-block-infostring');
            parent = parent.parentElement;
        }

        const lang = languageElement?.textContent.trim().toLowerCase() || 
                    Array.from(pre.classList).find(c => c.startsWith('language-'))?.split('-')[1] || 
                    'plaintext';
        
        return Prism.languages[lang] ? lang : 'plaintext';
    }

    async function handleCopy() {
        const code = artifactPanel.querySelector('code').textContent;
        try {
            await navigator.clipboard.writeText(code);
            showNotification('Code copied to clipboard!');
        } catch (err) {
            legacyCopy(code);
        }
    }

    function legacyCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            const success = document.execCommand('copy');
            if (!success) throw new Error('Copy failed');
            showNotification('Code copied to clipboard!');
        } catch (err) {
            showNotification('Failed to copy! Please copy manually.', true);
        } finally {
            document.body.removeChild(textarea);
        }
    }

    function showNotification(message, isError = false) {
        if (typeof GM_notification === 'function') {
            GM_notification({
                title: isError ? 'Error' : 'Success',
                text: message,
                timeout: 2000
            });
        } else {
            const notification = document.createElement('div');
            notification.className = `artifact-notification ${isError ? 'error' : 'success'}`;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 2000);
        }
    }

    function adjustPanelHeight() {
        const panel = artifactPanel.querySelector('.artifact-panel');
        panel.style.height = `${window.innerHeight * config.panelHeightRatio}px`;
    }

    // ==================== LIFECYCLE MANAGEMENT ====================
    async function init() {
        try {
            await loadPrism();
            ensureStyles();
            artifactPanel = createArtifactPanel();
            document.body.appendChild(artifactPanel);
            
            document.body.addEventListener('click', event => {
                const target = event.target;
                
                if (target.closest('.artifact-placeholder')) {
                    showCode(target.closest('.artifact-placeholder').nextElementSibling);
                }
                else if (target.closest('.artifact-close')) {
                    hidePanel();
                }
                else if (target.closest('.artifact-copy')) {
                    handleCopy();
                }
            });

            initObserver();
            document.querySelectorAll('pre').forEach(processPreElement);
            window.addEventListener('resize', adjustPanelHeight);
        } catch (error) {
            console.error('Initialization error:', error);
            showNotification('Failed to initialize code viewer!', true);
        }
    }

    function cleanup() {
        if (observer) observer.disconnect();
        artifactPanel?.remove();
        document.querySelector(`style[data-css="${SCRIPT_ID}"]`)?.remove();
        window.removeEventListener('resize', adjustPanelHeight);
        document.removeEventListener('keydown', handleKeyPress);
    }

    // ==================== INITIALIZATION ====================
    if (!window[SCRIPT_ID]) {
        window[SCRIPT_ID] = true;
        
        const run = async () => {
            if (document.readyState === 'complete') {
                await init();
            } else {
                window.addEventListener('load', async () => {
                    await init();
                });
            }
        };

        run().catch(error => {
            console.error('Error initializing script:', error);
            showNotification('Failed to load code viewer!', true);
        });
        
        window.addEventListener('unload', cleanup);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') cleanup();
        });
    }
})();