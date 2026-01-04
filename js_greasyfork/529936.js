// ==UserScript==
// @name         Grok Code Collapse - Chat-Friendly Legacy (Mature Edition)
// @namespace    http://tampermonkey.net/
// @version      0.9.3
// @description  Enhances Grok code blocks with collapse and download, analyzes code with English/Chinese legacy for mature perspectives, displays in-page. Local processing.
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
// @downloadURL https://update.greasyfork.org/scripts/529936/Grok%20Code%20Collapse%20-%20Chat-Friendly%20Legacy%20%28Mature%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529936/Grok%20Code%20Collapse%20-%20Chat-Friendly%20Legacy%20%28Mature%20Edition%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const translations = {
        'en': { 
            expand: 'Expand', collapse: 'Collapse', download: 'Download', analyze: 'Analyze',
            experience: 'Experience', values: 'Values', reasoning: 'Logic', 
            mature: 'Mature Choice', unknown: 'Future Unknowns',
            standard: 'Standard syntax, no outdated patterns.',
            output: 'Has output for demo or debug.',
            returns: 'Returns a reusable value.',
            noOutput: 'No output or return, needs context.',
            function: 'Defines a function, clear structure.',
            control: 'Uses control flow (if/for/while).',
            simple: 'Short and simple, limited logic.',
            matureNote: 'Crossroads of life — what’s your pick?',
            unknownHypothesis: 'Assumes current tech holds.'
        },
        'zh-TW': { 
            expand: '展開', collapse: '收起', download: '下載', analyze: '分析',
            experience: '經驗', values: '價值', reasoning: '邏輯', 
            mature: '成熟抉擇', unknown: '未來未知',
            standard: '標準語法，無過時模式。',
            output: '有輸出，用於展示或除錯。',
            returns: '返回可重用值。',
            noOutput: '無輸出或返回，需上下文。',
            function: '定義函數，結構清晰。',
            control: '使用控制流（if/for/while）。',
            simple: '短而簡單，邏輯有限。',
            matureNote: '這是人生的十字路口，你怎麼選？',
            unknownHypothesis: '假設當前技術不變。'
        },
        'zh-CN': { 
            expand: '展开', collapse: '收起', download: '下载', analyze: '分析',
            experience: '经验', values: '价值', reasoning: '逻辑', 
            mature: '成熟抉择', unknown: '未来未知',
            standard: '标准语法，无过时模式。',
            output: '有输出，用于展示或调试。',
            returns: '返回可重用值。',
            noOutput: '无输出或返回，需上下文。',
            function: '定义函数，结构清晰。',
            control: '使用控制流（if/for/while）。',
            simple: '短而简单，逻辑有限。',
            matureNote: '这是人生的十字路口，你怎么选？',
            unknownHypothesis: '假设当前技术不变。'
        }
    };

    let currentLang = GM_getValue('selectedLang', 'en');
    let lang = translations[currentLang];

    for (let langCode in translations) {
        GM_registerMenuCommand(`Switch to ${langCode.toUpperCase()}`, () => {
            currentLang = langCode;
            GM_setValue('selectedLang', langCode);
            lang = translations[langCode];
            wrapCodeBlocks();
        });
    }

    GM_addStyle(`
        .grok-code-wrapper {
            position: relative;
            margin: 0;
            padding-bottom: 40px;
        }
        .grok-code-wrapper pre, .grok-code-wrapper code {
            max-height: 100px;
            overflow-y: hidden;
            font-size: 10px;
            line-height: 1.1;
            background-color: inherit;
            color: inherit;
            padding: 3px;
            border: 1px solid #ddd;
            display: block;
            transition: max-height 0.3s ease;
        }
        .grok-code-wrapper.expanded pre, .grok-code-wrapper.expanded code {
            max-height: none;
            overflow-y: auto;
        }
        .grok-toggle-btn, .grok-download-btn, .grok-analyze-btn {
            position: static;
            display: inline-block;
            font-size: 10px;
            padding: 1px 4px;
            cursor: pointer;
            margin: 2px 5px 0 0;
        }
        .grok-toggle-btn {
            background: #ddd;
            border: none;
            border-radius: 2px;
        }
        .grok-download-btn {
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 2px;
        }
        .grok-download-btn:hover {
            background: #45a049;
        }
        .grok-analyze-btn {
            background: #FF9800;
            color: white;
            border: none;
            border-radius: 2px;
        }
        .grok-analyze-btn:hover {
            background: #e68900;
        }
        .grok-analysis-output {
            font-size: 12px;
            padding: 5px;
            background: #f9f9f9;
            border: 1px solid #ddd;
            margin-top: 5px;
            white-space: pre-wrap;
            color: #333;
        }
    `);

    // Analysis for mature perspectives
    function analyzeCode(content) {
        const lines = content.split('\n').map(line => line.trim());
        const analysis = [];
        let legacyNotes = [];
        let matureTrigger = false;
        const lowerContent = content.toLowerCase();

        // Experience
        analysis.push(`--- ${lang.experience} ---`);
        if (lowerContent.includes('var ') && !lowerContent.includes('let ') && !lowerContent.includes('const ')) {
            analysis.push('• ' + (currentLang === 'en' ? 'Uses "var", older JS.' : '用 "var"，舊 JS。'));
            legacyNotes.push('• ' + (currentLang === 'en' ? 'Use let/const now.' : '現用 let/const。'));
        } else if (lowerContent.includes('async ') || lowerContent.includes('await ')) {
            analysis.push('• ' + (currentLang === 'en' ? 'Uses async/await, modern.' : '用 async/await，現代。'));
            legacyNotes.push('• ' + (currentLang === 'en' ? 'Watch future shifts.' : '關注未來變化。'));
        } else {
            analysis.push('• ' + lang.standard);
            legacyNotes.push('• ' + (currentLang === 'en' ? 'Adaptable syntax.' : '可適應語法。'));
        }

        // Values
        analysis.push(`\n--- ${lang.values} ---`);
        if (lowerContent.includes('print(') || lowerContent.includes('console.log(')) {
            analysis.push('• ' + lang.output);
            legacyNotes.push('• ' + (currentLang === 'en' ? 'May shift later.' : '後期或變。'));
        }
        if (lowerContent.includes('return ')) {
            analysis.push('• ' + lang.returns);
            legacyNotes.push('• ' + (currentLang === 'en' ? 'Stays useful.' : '長久有用。'));
        }
        if (!lowerContent.includes('print(') && !lowerContent.includes('console.log(') && !lowerContent.includes('return ')) {
            analysis.push('• ' + lang.noOutput);
            legacyNotes.push('• ' + (currentLang === 'en' ? 'Needs docs.' : '需文件。'));
        }

        // Logic
        analysis.push(`\n--- ${lang.reasoning} ---`);
        if (lines[0].startsWith('def ') || lines[0].startsWith('function ')) {
            analysis.push('• ' + lang.function);
            legacyNotes.push('• ' + (currentLang === 'en' ? 'Update params.' : '更新參數。'));
        }
        if (lines.some(line => line.includes('if ') || line.includes('for ') || line.includes('while '))) {
            analysis.push('• ' + lang.control);
            legacyNotes.push('• ' + (currentLang === 'en' ? 'Optimize later.' : '後期優化。'));
        }
        if (lines.length < 3 && !lines.some(line => line.includes('if ') || line.includes('for ') || line.includes('while '))) {
            analysis.push('• ' + lang.simple);
            legacyNotes.push('• ' + (currentLang === 'en' ? 'Easy but shallow.' : '易傳但淺。'));
        }

        // Mature Trigger: Complex decisions or resource/future focus
        if (lines.some(line => line.includes('if ') && (line.includes('>') || line.includes('<') || line.includes('='))) && 
            (lowerContent.includes('water') || lowerContent.includes('energy') || lowerContent.includes('time') || 
             lowerContent.includes('future') || lowerContent.includes('plan') || lowerContent.includes('資源') || 
             lowerContent.includes('時間'))) {
            matureTrigger = true;
            analysis.push(`\n--- ${lang.mature} ---`);
            analysis.push('• ' + lang.matureNote);
            legacyNotes.push('• ' + (currentLang === 'en' ? 'Choices shape the future.' : '抉擇影響未來。'));
        }

        // Future Unknowns
        analysis.push(`\n--- ${lang.unknown} ---`);
        analysis.push('• ' + lang.unknownHypothesis);
        legacyNotes.push('• ' + (currentLang === 'en' ? 'May need adaptation.' : '或需適應。'));

        return { analysis: analysis.join('\n'), legacyNotes: legacyNotes.join('\n'), matureTrigger };
    }

    function wrapCodeBlocks() {
        try {
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

                    const analyzeBtn = document.createElement('button');
                    analyzeBtn.className = 'grok-analyze-btn';
                    analyzeBtn.textContent = lang.analyze;
                    wrapper.appendChild(analyzeBtn);

                    const outputDiv = document.createElement('div');
                    outputDiv.className = 'grok-analysis-output';
                    wrapper.appendChild(outputDiv);

                    toggleBtn.addEventListener('click', () => {
                        wrapper.className = wrapper.className === 'grok-code-wrapper' ? 'grok-code-wrapper expanded' : 'grok-code-wrapper';
                        toggleBtn.textContent = wrapper.className.includes('expanded') ? lang.collapse : lang.expand;
                    });

                    downloadBtn.addEventListener('click', () => {
                        const content = block.textContent.trim();
                        const filename = `grok_code_${index + 1}`;
                        const blob = new Blob([content], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${filename}.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                    });

                    analyzeBtn.addEventListener('click', () => {
                        const content = block.textContent.trim();
                        const { analysis, legacyNotes } = analyzeCode(content);
                        let message = `${analysis}\n\nLegacy Notes:\n${legacyNotes}\n\nCode Preview:\n${content.substring(0, 100)}...`;
                        outputDiv.textContent = message;
                    });
                }
            });
        } catch (e) {
            console.error('[Grok Code Collapse 0.9.3 Mature Edition] Error in wrapCodeBlocks:', e);
        }
    }

    wrapCodeBlocks();
    setInterval(wrapCodeBlocks, 5000);
})();