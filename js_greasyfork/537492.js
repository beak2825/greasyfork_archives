// ==UserScript==
// @name         亚马逊关键词工具
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  关键词叠词/加号生成工具
// @author       You
// @match        https://www.amazon.com/*
// @match        https://www.amazon.co.uk/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/537492/%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/537492/%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === 样式 ===
    GM_addStyle(`
        .kw-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 16px;
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
            padding: 20px 24px;
            z-index: 9999;
            display: none;
            width: 420px;
            font-family: 'Segoe UI', sans-serif;
        }

        .kw-popup h3 {
            text-align: center;
            margin-bottom: 16px;
            font-size: 18px;
        }

        .kw-popup textarea {
            width: 100%;
            resize: none;
            padding: 10px;
            font-size: 14px;
            border-radius: 10px;
            border: 1px solid #ccc;
            margin-bottom: 12px;
            overflow-y: hidden;
            min-height: 48px;
        }

        .kw-popup .button-group {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            gap: 8px;
            margin-bottom: 10px;
        }

        .kw-popup button {
            flex: 1;
            min-width: 30%;
            padding: 8px 12px;
            font-size: 14px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .kw-button-primary { background-color: #28a745; color: white; }
        .kw-button-primary:hover { background-color: #218838; }

        .kw-button-secondary { background-color: #007bff; color: white; }
        .kw-button-secondary:hover { background-color: #0069d9; }

        .kw-button-clear { background-color: #fd7e14; color: white; }
        .kw-button-clear:hover { background-color: #e8590c; }

        .kw-button-close { background-color: #dc3545; color: white; }
        .kw-button-close:hover { background-color: #c82333; }

        .kw-tool-button {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background-color: #343a40;
            color: white;
            font-size: 14px;
            font-weight: bold;
            padding: 10px 16px;
            border-radius: 30px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
    `);

    // === 元素 ===
    const popup = document.createElement('div');
    popup.className = 'kw-popup';
    popup.innerHTML = `
        <h3>关键词处理工具</h3>
        <textarea id="kwInput" placeholder="请输入关键词（空格或换行分隔）"></textarea>
        <div class="button-group">
            <button class="kw-button-primary" id="btnStack">生成叠词</button>
            <button class="kw-button-primary" id="btnPlus">生成加号</button>
        </div>
        <div class="button-group">
            <button class="kw-button-secondary" id="btnCopy">复制</button>
            <button class="kw-button-clear" id="btnClear">清空</button>
            <button class="kw-button-close" id="btnClose">关闭</button>
        </div>
        <textarea id="kwOutput" placeholder="输出结果" readonly></textarea>
    `;
    document.body.appendChild(popup);

    const toolBtn = document.createElement('button');
    toolBtn.className = 'kw-tool-button';
    toolBtn.textContent = '关键词工具';
    document.body.appendChild(toolBtn);

    toolBtn.addEventListener('click', () => popup.style.display = 'block');
    document.getElementById('btnClose').addEventListener('click', () => popup.style.display = 'none');

    function autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    document.querySelectorAll('textarea').forEach(t => {
        t.addEventListener('input', () => autoResizeTextarea(t));
        autoResizeTextarea(t);
    });

    // === 叠词逻辑 ===
function generateStacked(input) {
    const words = input.trim().split(/\s+/);
    if (words.length < 2 || words.length > 5) return '请输入 2 到 5 个关键词！';

    const c = [];
    const w = words;

    if (w.length === 2) {
        c.push(`${w[0]} ${w[1]} ${w[0]} ${w[1]}`);
        c.push(`${w[0]} ${w[0]} ${w[1]} ${w[1]}`);
        c.push(`${w[0]} ${w[0]} ${w[1]}`);
        c.push(`${w[0]} ${w[1]} ${w[1]}`);
    } else if (w.length === 3) {
        c.push(`${w[0]} ${w[1]} ${w[2]} ${w[0]} ${w[1]} ${w[2]}`);
        c.push(`${w[0]} ${w[0]} ${w[1]} ${w[1]} ${w[2]} ${w[2]}`);
        c.push(`${w[0]} ${w[0]} ${w[1]} ${w[2]}`);
        c.push(`${w[0]} ${w[1]} ${w[1]} ${w[2]}`);
        c.push(`${w[0]} ${w[1]} ${w[2]} ${w[2]}`);
    } else if (w.length === 4) {
        c.push(`${w[0]} ${w[1]} ${w[2]} ${w[3]} ${w[0]} ${w[1]} ${w[2]} ${w[3]}`);
        c.push(`${w[0]} ${w[0]} ${w[1]} ${w[1]} ${w[2]} ${w[2]} ${w[3]} ${w[3]}`);
        c.push(`${w[0]} ${w[0]} ${w[1]} ${w[2]} ${w[3]}`);
        c.push(`${w[0]} ${w[1]} ${w[1]} ${w[2]} ${w[3]}`);
        c.push(`${w[0]} ${w[1]} ${w[2]} ${w[2]} ${w[3]}`);
        c.push(`${w[0]} ${w[1]} ${w[2]} ${w[3]} ${w[3]}`);
    } else if (w.length === 5) {
        c.push(`${w[0]} ${w[1]} ${w[2]} ${w[3]} ${w[4]} ${w[0]} ${w[1]} ${w[2]} ${w[3]} ${w[4]}`);
        c.push(`${w[0]} ${w[0]} ${w[1]} ${w[1]} ${w[2]} ${w[2]} ${w[3]} ${w[3]} ${w[4]} ${w[4]}`);
        c.push(`${w[0]} ${w[0]} ${w[1]} ${w[2]} ${w[3]} ${w[4]}`);
        c.push(`${w[0]} ${w[1]} ${w[1]} ${w[2]} ${w[3]} ${w[4]}`);
        c.push(`${w[0]} ${w[1]} ${w[2]} ${w[2]} ${w[3]} ${w[4]}`);
        c.push(`${w[0]} ${w[1]} ${w[2]} ${w[3]} ${w[3]} ${w[4]}`);
        c.push(`${w[0]} ${w[1]} ${w[2]} ${w[3]} ${w[4]} ${w[4]}`);
    }

    return c.join('\n');
}


    // === 加号逻辑 ===
    const excludedWords = [
        "and", "or", "not", "but", "nor", "so", "yet", "for", "in", "on", "at", "by", "to",
        "of", "with", "about", "as", "from", "into", "over", "under", "after", "before",
        "around", "through", "between", "sets", "set", "pack", "pcs", "dozen", "pair", "unit",
        "kg", "g", "lb", "oz", "cm", "mm", "m", "km", "in", "ft", "ml", "l", "box", "bottle",
        "jar", "can", "tray"
    ];
    const excludedSymbols = /^[!@#$%^&*(),.?":{}|<>+=/\\~`;'\[\]-]+$/;

    function generatePlusKeywords(text) {
        return text.split('\n').map(line => {
            return line.trim().split(/\s+/).map(word => {
                if (
                    /^\d+$/.test(word) ||
                    excludedWords.includes(word.toLowerCase()) ||
                    excludedSymbols.test(word)
                ) {
                    return word;
                } else {
                    return `+${word}`;
                }
            }).join(' ');
        }).filter(line => line.trim() !== '').join('\n');
    }

    // === 按钮事件 ===
    document.getElementById('btnStack').addEventListener('click', () => {
        const input = document.getElementById('kwInput').value;
        const result = generateStacked(input);
        const out = document.getElementById('kwOutput');
        out.value = result;
        autoResizeTextarea(out);
    });

    document.getElementById('btnPlus').addEventListener('click', () => {
        const input = document.getElementById('kwInput').value;
        const result = generatePlusKeywords(input);
        const out = document.getElementById('kwOutput');
        out.value = result;
        autoResizeTextarea(out);
    });

    document.getElementById('btnCopy').addEventListener('click', () => {
        const text = document.getElementById('kwOutput').value;
        if (text.trim()) {
            GM_setClipboard(text);
            alert('已复制结果！');
        }
    });

    document.getElementById('btnClear').addEventListener('click', () => {
        document.getElementById('kwInput').value = '';
        document.getElementById('kwOutput').value = '';
        autoResizeTextarea(document.getElementById('kwInput'));
        autoResizeTextarea(document.getElementById('kwOutput'));
    });
})();
