// ==UserScript==
// @name         Grok Code Style with Collapse
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Shrink, collapse, compact, and download pre/code blocks on Grok pages with manual language switch and adaptive background
// @author       You
// @match        https://x.com/i/grok*
// @match        https://grok.com/*
// @match        https://grok.x.ai/*
// @match        https://x.ai/*
// @exclude      https://greasyfork.org/*
// @exclude      https://*.org/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529923/Grok%20Code%20Style%20with%20Collapse.user.js
// @updateURL https://update.greasyfork.org/scripts/529923/Grok%20Code%20Style%20with%20Collapse.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Language options
    const translations = {
        'en': { expand: 'Expand', collapse: 'Collapse', download: 'Download' },
        'zh-TW': { expand: '展開', collapse: '收起', download: '下載' },
        'zh-CN': { expand: '展开', collapse: '收起', download: '下载' },
        'ja': { expand: '展開', collapse: '折り畳む', download: 'ダウンロード' },
        'ko': { expand: '펼치기', collapse: '접기', download: '다운로드' },
        'fr': { expand: 'Développer', collapse: 'Réduire', download: 'Télécharger' },
        'es': { expand: 'Expandir', collapse: 'Colapsar', download: 'Descargar' }
    };

    // Load saved language or default to 'en'
    let currentLang = GM_getValue('selectedLang', 'en');
    let lang = translations[currentLang];

    // Register language switch menu in Tampermonkey
    for (let langCode in translations) {
        GM_registerMenuCommand(`Switch to ${langCode.toUpperCase()}`, () => {
            currentLang = langCode;
            GM_setValue('selectedLang', langCode);
            lang = translations[langCode];
            wrapCodeBlocks();
        });
    }

    // Add styles with adaptive background
    GM_addStyle(`
        .grok-code-wrapper {
            position: relative;
            margin: 0;
        }
        .grok-code-wrapper pre, .grok-code-wrapper code {
            max-height: 100px;
            overflow-y: hidden;
            font-size: 10px;
            line-height: 1.1;
            background-color: inherit; /* Adaptive: inherit from parent or page */
            color: inherit; /* Adaptive: inherit text color */
            padding: 3px;
            border: 1px solid #ddd;
            display: block;
            transition: max-height 0.3s ease;
        }
        .grok-code-wrapper.expanded pre, .grok-code-wrapper.expanded code {
            max-height: 300px;
            overflow-y: auto;
        }
        .grok-toggle-btn {
            position: absolute;
            top: 2px;
            right: 2px;
            font-size: 10px;
            padding: 1px 4px;
            cursor: pointer;
            background: #ddd;
            border: none;
            border-radius: 2px;
        }
        .grok-download-btn {
            position: absolute;
            top: 2px;
            right: 40px;
            font-size: 9px;
            padding: 1px 4px;
            cursor: pointer;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 2px;
        }
        .grok-download-btn:hover {
            background: #45a049;
        }
    `);

    // Process code blocks
    function wrapCodeBlocks() {
        const codeBlocks = document.querySelectorAll('pre:not([class*="highlight"]):not([id*="highlight"]), code:not([class*="highlight"]):not([id*="highlight"])');
        codeBlocks.forEach((block, index) => {
            const parent = block.parentElement;
            if (!parent.classList.contains('grok-code-wrapper')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'grok-code-wrapper';
                parent.insertBefore(wrapper, block);
                wrapper.appendChild(block);

                const toggleBtn = document.createElement('button');
                toggleBtn.className = 'grok-toggle-btn';
                toggleBtn.textContent = lang.expand;
                wrapper.appendChild(toggleBtn);

                const downloadBtn = document.createElement('button');
                downloadBtn.className = 'grok-download-btn';
                downloadBtn.textContent = lang.download;
                wrapper.appendChild(downloadBtn);

                toggleBtn.addEventListener('click', () => {
                    wrapper.classList.toggle('expanded');
                    toggleBtn.textContent = wrapper.classList.contains('expanded') ? lang.collapse : lang.expand;
                });

                downloadBtn.addEventListener('click', () => {
                    const blob = new Blob([block.textContent], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `code_block_${index + 1}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                });
            } else {
                const toggleBtn = parent.querySelector('.grok-toggle-btn');
                if (toggleBtn) {
                    toggleBtn.textContent = parent.classList.contains('expanded') ? lang.collapse : lang.expand;
                }
                const downloadBtn = parent.querySelector('.grok-download-btn');
                if (downloadBtn) {
                    downloadBtn.textContent = lang.download;
                }
            }
        });
    }

    // Periodic check
    wrapCodeBlocks();
    setInterval(wrapCodeBlocks, 2000);
})();