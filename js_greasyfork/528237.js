// ==UserScript==
// @name         HKUST-GPT-CodeEnhancer-Pro
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  增强HKUST GPT的代码显示（自动语法高亮+一键复制）
// @author       PrimoPan
// @match        https://gpt.hkust-gz.edu.cn/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js
// @resource     prismCSS https://unpkg.com/prism-theme-night-owl@latest/build/style.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/528237/HKUST-GPT-CodeEnhancer-Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/528237/HKUST-GPT-CodeEnhancer-Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        codeSelector: 'pre > code[class^="language-"]',
        copyBtnClass: 'gpt-copy-btn-pro',
        styles: {
            base: `
                position: absolute;
                right: 10px;
                top: 10px;
                background-color: rgba(51, 51, 51, 0.8);
                color:#fff !important;
                border-radius:4px;
                padding:.5em .8em;
                font-size:.85rem;
                cursor:pointer;
                border:none;
                transition:.15s all ease-out;
                z-index:1000`,
            hover: 'background-color:#444!important',
            copied: 'background-color:#27ae60!important'
        },
        observerConfig: {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        }
    };

    //============= Core Functions ===============//

    function initCore() {
        injectPrismTheme();
        document.querySelectorAll(CONFIG.codeSelector).forEach(codeBlock => {
            if (!codeBlock.closest('.processed')) processCodeBlock(codeBlock);
        });
        Prism.highlightAll();
        setupObserver();
        console.log('[CodePro] Initialized');
    }

    function processCodeBlock(codeEl) {
        const wrapper = wrapWithDiv(codeEl.parentElement);
        if (!wrapper.querySelector('.' + CONFIG.copyBtnClass)) {
            attachCopyButton(wrapper);
            codeEl.classList.add('processed');
        }
    }

    function wrapWithDiv(preElement) {
        const wrapper = document.createElement('div');
        Object.assign(wrapper.style, {
            position: 'relative',
            marginTop: '25px',
            backgroundColor: '#2d2d2d',
            borderRadius: '6px'
        });

        preElement.parentNode.insertBefore(wrapper, preElement);
        wrapper.appendChild(preElement);
        return wrapper;
    }

    function attachCopyButton(wrapper) {
        const btn = createCopyButton();
        btn.onclick = handleCopy.bind(null, btn); // Bind the button to the handleCopy function
        wrapper.appendChild(btn);
    }

    function createCopyButton() {
        const btn = document.createElement('button');
        btn.className = CONFIG.copyBtnClass + ' fresh';
        Object.assign(btn.style, styleStringToObject(CONFIG.styles.base));

        //交互效果：
        btn.onmouseenter = () => { Object.assign(btn.style, styleStringToObject(CONFIG.styles.hover)); };
        btn.onmouseleave = () => { Object.assign(btn.style, styleStringToObject(CONFIG.styles.base)); };

        btn.updateText = (text) => {
            btn.textContent = text || '📋 Copy';
            return btn;
        };

        btn.updateText(); // Initialize button text
        return btn;
    }

    async function handleCopy(btn) {
        const codeText = btn.parentNode.querySelector('code').innerText.trim();
        try {
            await navigator.clipboard.writeText(codeText);
            btn.updateText("✅ Copied!");
            setTimeout(() => btn.updateText(), 1500);
        } catch (err) {
            alert('[⚠️ Error] Please copy manually: ' + codeText);
            btn.updateText("❌ Failed");
            setTimeout(() => btn.updateText(), 2000);
        }
    }

    function styleStringToObject(cssStr) {
        return cssStr.split(/;(?!base64)/)
            .filter(s => s.trim())
            .map(pair => pair.split(':').map(p => p.trim()))
            .reduce((obj, [key, val]) => (obj[key] = val, obj), {});
    }

    function injectPrismTheme() {
        try {
            const themeCss = `${GM_getResourceText("prismCSS")} \n/* Custom Overrides */\n pre { background: #2d2d2d !important; }`;
            GM_addStyle(`${themeCss}\n\n${generateCustomStyles()}`);
        } catch (e) {
            console.error('[CSS Error]' + e);
        }
    }

    function generateCustomStyles() {
        return `
            .gpt-copy-btn-pro:hover { opacity: .95 !important; }
            .gpt-copy-btn-pro.fresh::after {
                content: "";
                position: absolute;
                right: -5%;
                top: -30%;
                width: .8em;
                height: .8em;
                border-radius: 50%;
                animation: pulseAnim 1.5s infinite;
            }
            @keyframes pulseAnim {
                50% { box-shadow: 0 0 0.5em #aaa; }
            }
        `;
    }

    let domObserver;

    function setupObserver() {
        domObserver?.disconnect();
        domObserver = new MutationObserver(mutationsHandler);
        domObserver.observe(document.body, CONFIG.observerConfig);
    }

    function mutationsHandler(muts) {
        if (!muts.some(mutationFilter)) return;
        requestIdleCallback(() => initCore(), { timeout: 300 });
    }

    function mutationFilter(mutation) {
        return Array.from(mutation.addedNodes).some(node => {
            // Case 1: The added node itself is a code block element
            if (node.nodeType === Node.ELEMENT_NODE && node.matches(CONFIG.codeSelector)) {
                return true;
            }

            // Case 2: The added container contains code blocks in its descendants
            if (typeof node.querySelector === 'function' && !!node.querySelector(CONFIG.codeSelector)) {
                return true;
            }

            // Edge case: Handle text nodes wrapped in spans/divs etc.
            if (/^(#text|SPAN|DIV)$/.test(node.nodeName) && checkAncestorCodeBlock(node.parentElement)) {
                return true;
            }

            return false;
        });
    }

    // Helper function to check parent chain for existing code blocks
    function checkAncestorCodeBlock(element, depth = 3) {
        while (depth-- > 0 && element) {
            if (element.matches?.(CONFIG.codeSelector)) {
                console.log('Found ancestor:', element);
                return true;
            }
            element = element.parentElement;
        }
        return false;
    }

    // Initialize the script
    initCore();
})();