// ==UserScript==
// @name         adbrt.network JSON数据高亮（多主题）
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  高亮并格式化显示页面内 JSON 数据，支持多主题切换
// @author       slowFever
// @match        https://partner.adbrt.network/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=adbrt.network
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539106/adbrtnetwork%20JSON%E6%95%B0%E6%8D%AE%E9%AB%98%E4%BA%AE%EF%BC%88%E5%A4%9A%E4%B8%BB%E9%A2%98%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/539106/adbrtnetwork%20JSON%E6%95%B0%E6%8D%AE%E9%AB%98%E4%BA%AE%EF%BC%88%E5%A4%9A%E4%B8%BB%E9%A2%98%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // JSON 高亮配色主题
    const themes = [
        {
            name: 'vsCode dark',
            css: `
            .json-block {
                background: #1e1e1e;
                color: #d4d4d4;
            }
            .json-key { color: #ff6670; }
            .json-string { color: #a4ce78; }
            .json-number { color: #e59011; }
            .json-boolean { color: #569cd6; }
            .json-null { color: #c586c0; }
        `
        },
        {
            name: '暗黑',
            css: `
            .json-block {
                background: #2e2e2e;
                color: #ddd;
            }
            .json-key { color: #61afef; }
            .json-string { color: #98c379; }
            .json-number { color: #d19a66; }
            .json-boolean { color: #56b6c2; }
            .json-null { color: #c678dd; }
        `
        },
        {
            name: '亮白',
            css: `
            .json-block {
                background: #f8f8f8;
                color: #333;
            }
            .json-key { color: #007acc; }
            .json-string { color: #008000; }
            .json-number { color: #b05a00; }
            .json-boolean { color: #006080; }
            .json-null { color: #800080; }
        `
        },
        {
            name: '夜蓝',
            css: `
            .json-block {
                background: #001f3f;
                color: #d1ecff;
            }
            .json-key { color: #7FDBFF; }
            .json-string { color: #2ECC40; }
            .json-number { color: #FFDC00; }
            .json-boolean { color: #FF851B; }
            .json-null { color: #B10DC9; }
        `
        },
        {
            name: '暗红紫',
            css: `
        .json-block {
            background: #1a0000;
            color: #ffcccc;
        }
        .json-key { color: #ff3333; }
        .json-string { color: #ff6666; }
        .json-number { color: #ff4040; }
        .json-boolean { color: #cc0000; }
        .json-null { color: #990000; }
        `
        },
        {
            name: '深紫幻',
            css: `
            .json-block {
                background: #1e0033;
                color: #f3e6ff;
            }
            .json-key { color: #c084fc; }
            .json-string { color: #d8b4fe; }
            .json-number { color: #e879f9; }
            .json-boolean { color: #a855f7; }
            .json-null { color: #d946ef; }
        `
        },
        {
            name: '霓虹紫红',
            css: `
        .json-block {
            background: #1a001a;
            color: #ffccff;
        }
        .json-key { color: #ff66ff; }
        .json-string { color: #ff99ff; }
        .json-number { color: #ff33ff; }
        .json-boolean { color: #ff00ff; }
        .json-null { color: #cc00cc; }
        `
        }
    ];

    // 样式类名前缀，防止污染其他样式
    const CLASS_PREFIX = 'tm-json';
    // 获取当前主题索引（默认值为0）
    const THEME_INDEX = GM_getValue('jsonThemeIndex', 0);
    // 样式注入容器
    const styleEl = document.createElement('style');
    document.head.appendChild(styleEl);

    /**
     * 应用选中的主题样式到页面中
     * @param {number} index - 主题索引
     */
    function applyTheme(index) {
        const baseCSS = `
            .${CLASS_PREFIX}-block {
                font-family: 'Courier New', Courier, monospace;
                white-space: pre-wrap;
                word-wrap: break-word;
                padding: 8px;
                border-radius: 4px;
                margin: 4px 0;
                width: 100%;
                max-height: 200px;
                box-sizing: border-box;
                overflow-y: auto;
                overflow-x: hidden;
            }
        `;
        // 替换 json- 前缀，避免与页面已有类冲突
        styleEl.textContent = baseCSS + themes[index].css.replaceAll('.json-', `.${CLASS_PREFIX}-`);
    }

    // 初始应用主题
    applyTheme(THEME_INDEX);

    /**
     * 对 JSON 文本进行语法高亮，返回带 span 的 HTML 字符串
     * @param {string} json - 格式化的 JSON 字符串
     * @returns {string} - HTML 字符串
     */
    function highlightJSON(json) {
        return json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(\.\d+)?([eE][+\-]?\d+)?)/g, m => {
                let cls = `${CLASS_PREFIX}-number`;
                if (/^"/.test(m)) cls = /:$/.test(m) ? `${CLASS_PREFIX}-key` : `${CLASS_PREFIX}-string`;
                else if (/true|false/.test(m)) cls = `${CLASS_PREFIX}-boolean`;
                else if (/null/.test(m)) cls = `${CLASS_PREFIX}-null`;
                return `<span class="${cls}">${m}</span>`;
            });
    }

    /**
     * 尝试将字符串解析为 JSON，并格式化为字符串
     * @param {string} text
     * @returns {string|null} - 格式化后的 JSON 字符串或 null
     */
    function tryJSON(text) {
        try {
            return JSON.stringify(JSON.parse(text), null, 2);
        } catch {
            return null;
        }
    }

    /**
     * 从文本中提取所有有效 JSON 字符串片段
     * @param {string} text
     * @returns {string[]} - 所有解析成功的 JSON 字符串
     */
    function extractJSON(text) {
        const segments = [];
        let rest = text.trim();
        while (rest.length) {
            const start = Math.min(...['{', '['].map(c => {
                const i = rest.indexOf(c);
                return i >= 0 ? i : Infinity;
            }));
            if (start === Infinity) break;

            const slice = rest.slice(start);
            let end = -1, stack = [];
            for (let i = 0; i < slice.length; i++) {
                const ch = slice[i];
                if (ch === '{' || ch === '[') stack.push(ch);
                else if (ch === '}' || ch === ']') {
                    const last = stack.at(-1);
                    if ((ch === '}' && last === '{') || (ch === ']' && last === '[')) {
                        stack.pop();
                        if (!stack.length) {
                            end = i;
                            break;
                        }
                    } else break;
                }
            }
            if (end === -1) break;

            const candidate = slice.slice(0, end + 1);
            const parsed = tryJSON(candidate);
            if (parsed) {
                segments.push(parsed);
                rest = rest.slice(start + end + 1).trim();
            } else {
                rest = rest.slice(start + 1).trim();
            }
        }
        return segments;
    }

    /**
     * 格式化并高亮显示某个 DOM 元素中的 JSON 内容
     * @param {HTMLElement} el - 需要处理的元素
     */
    function formatElement(el) {
        if (el.dataset.jsonDone === '1') return;
        if (el.querySelector(`.${CLASS_PREFIX}-block`)) {
            el.dataset.jsonDone = '1';
            return;
        }

        // 优先从 span.word-wrap 提取文本
        const span = el.querySelector('span.word-wrap');
        let raw = span
            ? [...span.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('')
            : el.textContent;

        raw = raw.trim();
        if (!raw) return;

        const jsons = extractJSON(raw);
        if (jsons.length === 0) return;

        const html = highlightJSON(jsons.join('\n\n'));
        el.innerHTML = `<div class="${CLASS_PREFIX}-block">${html}</div>`;
        el.dataset.jsonDone = '1';
    }

    /**
     * 遍历页面所有目标元素进行 JSON 格式化
     */
    function updateAll() {
        document.querySelectorAll('div.table2__column').forEach(formatElement);
    }

    // 创建并启动 JSON 格式化的 DOM 观察器
    const jsonObserver = new MutationObserver(() => {
        requestAnimationFrame(updateAll);
    });

    jsonObserver.observe(document.body, { childList: true, subtree: true });
    updateAll();

    /**
     * 插入主题切换按钮到页面顶栏
     */
    function insertButton() {
        const container = document.querySelector('div.d-flex.my-auto.ml-auto');
        if (!container || container.querySelector('.json-theme-btn')) return;

        const btn = document.createElement('button');
        btn.className = 'json-theme-btn';
        btn.textContent = `主题：${themes[THEME_INDEX].name}`;
        btn.style.cssText = `
            margin-right: 8px;
            padding: 4px 10px;
            border-radius: 5px;
            font-size: 12px;
            background: #444;
            color: #fff;
            border: none;
            cursor: pointer;
            transition: background 0.2s;
        `;

        btn.onmouseenter = () => btn.style.background = '#222';
        btn.onmouseleave = () => btn.style.background = '#444';

        btn.onclick = () => {
            const index = (GM_getValue('jsonThemeIndex', 0) + 1) % themes.length;
            GM_setValue('jsonThemeIndex', index);
            applyTheme(index);
            btn.textContent = `主题：${themes[index].name}`;
        };

        container.insertBefore(btn, container.firstChild);
    }

    // 初始化插入按钮
    insertButton();

    // 监听 DOM 变化以确保按钮在页面更新时仍存在
    const buttonObserver = new MutationObserver(insertButton);
    buttonObserver.observe(document.body, { childList: true, subtree: true });

})();
