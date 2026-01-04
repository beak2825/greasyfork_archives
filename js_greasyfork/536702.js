// ==UserScript==
// @name         Bangumi 组件代码对比器
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  在Bangumi组件页中对比两个版本的代码
// @author       Bios (improved by Grok)
// @match        *://bgm.tv/dev/app/*
// @match        *://bangumi.tv/dev/app/*
// @match        *://chii.in/dev/app/*
// @icon         https://lain.bgm.tv/pic/icon/l/000/00/41/4180.jpg
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536702/Bangumi%20%E7%BB%84%E4%BB%B6%E4%BB%A3%E7%A0%81%E5%AF%B9%E6%AF%94%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/536702/Bangumi%20%E7%BB%84%E4%BB%B6%E4%BB%A3%E7%A0%81%E5%AF%B9%E6%AF%94%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 尝试从文档中提取指定ID的字段内容。
    // 优先从具有特定ID的元素中获取值，如果不存在，则尝试从常见代码编辑器或pre标签中获取文本内容。
    function extractField(doc, id) {
        const el = doc.querySelector(`#${id}`);
        if (el) {
            return el.value || el.innerText || el.getAttribute('data-value') || el.textContent || '';
        }
        // 兼容处理：如果找不到特定ID的元素，尝试查找常见的代码编辑区域或pre标签
        const alt = doc.querySelector('.CodeMirror, .cm-editor, pre');
        return alt ? alt.textContent : '';
    }

    // 比较两个字符串的字符差异。
    // 返回一个数组，每个元素表示一个差异块：[类型, 内容]，
    // 类型为 0 表示相同，-1 表示删除，1 表示新增。
    function diffChars(a, b) {
        const MAX_DISTANCE = 100;

        if (!a && !b) return [[0, '']];
        if (!a) return [[1, b]];
        if (!b) return [[-1, a]];
        if (a === b) return [[0, a]];

        let start = 0;
        // 查找共同的前缀
        while (start < a.length && start < b.length && a[start] === b[start]) {
            start++;
        }

        let end = 0;
        // 查找共同的后缀
        while (
            end < a.length - start &&
            end < b.length - start &&
            a[a.length - 1 - end] === b[b.length - 1 - end]
        ) {
            end++;
        }

        const diffs = [];
        // 添加共同的前缀
        if (start > 0) {
            diffs.push([0, a.substring(0, start)]);
        }

        // 获取中间部分的字符串
        const aMid = a.substring(start, a.length - end);
        const bMid = b.substring(start, b.length - end);

        // 处理中间部分的差异
        if (aMid.length > 0 || bMid.length > 0) {
            // 如果中间部分长度在MAX_DISTANCE内，则进行行内字符差异比较
            if (aMid.length <= MAX_DISTANCE && bMid.length <= MAX_DISTANCE) {
                const midDiffs = findInlineDiffs(aMid, bMid);
                diffs.push(...midDiffs);
            } else {
                // 否则，将中间部分直接标记为删除或新增
                if (aMid) diffs.push([-1, aMid]);
                if (bMid) diffs.push([1, bMid]);
            }
        }

        // 添加共同的后缀
        if (end > 0) {
            diffs.push([0, a.substring(a.length - end)]);
        }

        return diffs;
    }

    // 查找两个字符串的行内字符差异。
    // 用于在diffChars中处理较短的中间部分。
    function findInlineDiffs(oldStr, newStr) {
        if (oldStr === newStr) return [[0, oldStr]];
        const result = [];
        let commonStart = 0;
        // 查找共同的前缀
        while (
            commonStart < oldStr.length &&
            commonStart < newStr.length &&
            oldStr[commonStart] === newStr[commonStart]
        ) {
            commonStart++;
        }

        if (commonStart > 0) {
            result.push([0, oldStr.substring(0, commonStart)]);
        }

        let commonEnd = 0;
        // 查找共同的后缀
        while (
            commonEnd < oldStr.length - commonStart &&
            commonEnd < newStr.length - commonStart &&
            oldStr[oldStr.length - 1 - commonEnd] === newStr[newStr.length - 1 - commonEnd]
        ) {
            commonEnd++;
        }

        // 获取中间部分
        const oldMiddle = oldStr.substring(commonStart, oldStr.length - commonEnd);
        const newMiddle = newStr.substring(commonStart, newStr.length - commonEnd);

        // 添加中间部分的删除和新增标记
        if (oldMiddle.length > 0) {
            result.push([-1, oldMiddle]);
        }
        if (newMiddle.length > 0) {
            result.push([1, newMiddle]);
        }

        // 添加共同的后缀
        if (commonEnd > 0) {
            result.push([0, oldStr.substring(oldStr.length - commonEnd)]);
        }

        return result;
    }

    // 比较两段文本的行差异。
    // 使用最长公共子序列（LCS）算法来确定相同、修改、删除和新增的行。
    function diffLines(oldText, newText) {
        const oldLines = oldText.split('\n');
        const newLines = newText.split('\n');
        const lcs = computeLCS(oldLines, newLines);
        const result = [];
        let oldIdx = 0, newIdx = 0, lcsIdx = 0;

        while (oldIdx < oldLines.length || newIdx < newLines.length) {
            // 如果当前行是LCS的一部分（即在两个版本中都相同）
            if (
                lcsIdx < lcs.length &&
                oldIdx < oldLines.length &&
                newIdx < newLines.length &&
                oldLines[oldIdx] === lcs[lcsIdx] &&
                newLines[newIdx] === lcs[lcsIdx]
            ) {
                result.push({
                    type: 'same',
                    oldLine: oldLines[oldIdx],
                    newLine: newLines[newIdx],
                    oldIndex: oldIdx,
                    newIndex: newIdx,
                    charDiffs: [[0, oldLines[oldIdx]]]
                });
                oldIdx++;
                newIdx++;
                lcsIdx++;
            }
            // 如果当前行在两个版本中都不同（被修改）
            else if (
                oldIdx < oldLines.length &&
                newIdx < newLines.length &&
                (lcsIdx >= lcs.length ||
                 (oldLines[oldIdx] !== lcs[lcsIdx] && newLines[newIdx] !== lcs[lcsIdx]))
            ) {
                const charDiffs = diffChars(oldLines[oldIdx], newLines[newIdx]);
                result.push({
                    type: 'modify',
                    oldLine: oldLines[oldIdx],
                    newLine: newLines[newIdx],
                    oldIndex: oldIdx,
                    newIndex: newIdx,
                    charDiffs: charDiffs
                });
                oldIdx++;
                newIdx++;
            }
            // 如果当前行只存在于旧版本中（被删除）
            else if (
                oldIdx < oldLines.length &&
                (lcsIdx >= lcs.length || oldLines[oldIdx] !== lcs[lcsIdx] || newIdx >= newLines.length)
            ) {
                result.push({
                    type: 'delete',
                    oldLine: oldLines[oldIdx],
                    newLine: '',
                    oldIndex: oldIdx,
                    newIndex: -1,
                    charDiffs: [[-1, oldLines[oldIdx]]]
                });
                oldIdx++;
            }
            // 如果当前行只存在于新版本中（被新增）
            else if (
                newIdx < newLines.length &&
                (lcsIdx >= lcs.length || newLines[newIdx] !== lcs[lcsIdx] || oldIdx >= oldLines.length)
            ) {
                result.push({
                    type: 'add',
                    oldLine: '',
                    newLine: newLines[newIdx],
                    oldIndex: -1,
                    newIndex: newIdx,
                    charDiffs: [[1, newLines[newIdx]]]
                });
                newIdx++;
            }
        }

        return result;
    }

    // 计算两个数组（行）的最长公共子序列（LCS）。
    // 用于行差异比较。
    function computeLCS(a, b) {
        // 初始化一个二维数组，用于存储LCS的长度
        const lengths = Array(a.length + 1)
        .fill()
        .map(() => Array(b.length + 1).fill(0));

        // 填充lengths数组
        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < b.length; j++) {
                if (a[i] === b[j]) {
                    lengths[i + 1][j + 1] = lengths[i][j] + 1;
                } else {
                    lengths[i + 1][j + 1] = Math.max(lengths[i + 1][j], lengths[i][j + 1]);
                }
            }
        }

        // 从lengths数组中回溯，构建LCS
        const result = [];
        let i = a.length, j = b.length;
        while (i > 0 && j > 0) {
            if (a[i - 1] === b[j - 1]) {
                result.unshift(a[i - 1]);
                i--;
                j--;
            } else if (lengths[i][j - 1] > lengths[i - 1][j]) {
                j--;
            } else {
                i--;
            }
        }

        return result;
    }

    // 对HTML特殊字符进行转义，防止XSS。
    function escapeHTML(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // 判断字符是否为空白字符。
    function isWhitespace(char) {
        return /\s/.test(char);
    }

    // 处理行，分离缩进和内容。
    function processLineWithIndent(line) {
        if (!line) return { indent: '', content: '' };
        let indentLength = 0;
        while (indentLength < line.length && isWhitespace(line[indentLength])) {
            indentLength++;
        }

        const indent = line.substring(0, indentLength);
        const content = line.substring(indentLength);
        return { indent, content };
    }

    // 将字符串分割成代码和空白字符段。
    // 用于行内差异高亮，确保只高亮非空白字符。
    function splitCodeAndWhitespace(str) {
        const result = [];
        let currentSegment = '';
        let currentIsSpace = false;
        let started = false;

        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            const isSpace = isWhitespace(char);

            if (!started) {
                currentSegment = char;
                currentIsSpace = isSpace;
                started = true;
                continue;
            }

            if (isSpace === currentIsSpace) {
                currentSegment += char;
            } else {
                result.push({ text: currentSegment, isSpace: currentIsSpace });
                currentSegment = char;
                currentIsSpace = isSpace;
            }
        }

        if (currentSegment) {
            result.push({ text: currentSegment, isSpace: currentIsSpace });
        }

        return result;
    }

    // 渲染行内差异的HTML。
    // 将差异类型（相同、删除、新增）应用于内容。
    function renderInlineDiff(diff) {
        let html = '';
        for (const [type, content] of diff.charDiffs) {
            if (type === 0) {
                html += escapeHTML(content);
            } else if (type === -1 || type === 1) {
                const segments = splitCodeAndWhitespace(content);
                const styleClass = type === -1 ? 'diff-del' : 'diff-add';
                for (const segment of segments) {
                    if (segment.isSpace) {
                        html += escapeHTML(segment.text);
                    } else {
                        html += `<span class="${styleClass}">${escapeHTML(segment.text)}</span>`;
                    }
                }
            }
        }
        return html || '&nbsp;'; // 使用不间断空格作为占位符，避免空行高度问题
    }

    // 准备带有缩进的行，并根据类型应用样式。
    function prepareLineWithIndent(line, type) {
        if (!line) return '&nbsp;';
        const processed = processLineWithIndent(line);
        const styleClass = type === 'delete' ? 'diff-del' : type === 'add' ? 'diff-add' : '';
        let html = escapeHTML(processed.indent);

        if (styleClass && processed.content) {
            const segments = splitCodeAndWhitespace(processed.content);
            for (const segment of segments) {
                if (segment.isSpace) {
                    html += escapeHTML(segment.text);
                } else {
                    html += `<span class="${styleClass}">${escapeHTML(segment.text)}</span>`;
                }
            }
        } else {
            html += escapeHTML(processed.content);
        }

        return html;
    }

    // 渲染差异到指定的容器中。
    // 生成旧版本和新版本的HTML代码，并将其插入到DOM中。
    function renderDiff(container, oldText, newText, title) {
        const lineDiffs = diffLines(oldText, newText);
        const oldHtml = [], newHtml = [];
        let oldLineCount = 1;
        let newLineCount = 1;

        for (const diff of lineDiffs) {
            let oldLineHtml = '';
            let newLineHtml = '';
            let oldLineNumber = '';
            let newLineNumber = '';

            if (diff.type === 'same') {
                oldLineHtml = escapeHTML(diff.oldLine);
                newLineHtml = escapeHTML(diff.newLine);
                oldLineNumber = oldLineCount++;
                newLineNumber = newLineCount++;
            } else if (diff.type === 'modify') {
                // 对于修改行，只显示删除和新增的部分
                oldLineHtml = renderInlineDiff({
                    charDiffs: diff.charDiffs.map(([type, content]) => (type === 1 ? [0, ''] : [type, content]))
                });
                newLineHtml = renderInlineDiff({
                    charDiffs: diff.charDiffs.map(([type, content]) => (type === -1 ? [0, ''] : [type, content]))
                });
                oldLineNumber = oldLineCount++;
                newLineNumber = newLineCount++;
            } else if (diff.type === 'delete') {
                oldLineHtml = prepareLineWithIndent(diff.oldLine, 'delete');
                newLineHtml = '&nbsp;'; // 使用不间断空格作为占位符
                oldLineNumber = oldLineCount++;
                newLineNumber = '';
            } else if (diff.type === 'add') {
                oldLineHtml = '&nbsp;'; // 使用不间断空格作为占位符
                newLineHtml = prepareLineWithIndent(diff.newLine, 'add');
                oldLineNumber = '';
                newLineNumber = newLineCount++;
            }

            oldHtml.push(`<div class="line"><span class="line-number">${oldLineNumber}</span>${oldLineHtml}</div>`);
            newHtml.push(`<div class="line"><span class="line-number">${newLineNumber}</span>${newLineHtml}</div>`);
        }

        container.innerHTML = `
            <h2>${title} 差异</h2>
            <div class="diff-grid">
                <div><h4>旧版本</h4><div class="code">${oldHtml.join('')}</div></div>
                <div><h4>新版本</h4><div class="code">${newHtml.join('')}</div></div>
            </div>
        `;
    }

    // 比较两个版本的代码。
    // 异步获取两个URL的HTML内容，解析出脚本和样式，然后渲染差异。
    async function compareVersions(urlA, urlB) {
        // 解析URL，确保oldUrl和newUrl是按版本号升序排列的
        const a = parseInt(urlA.match(/\/(\d+)(\?.*)?$/)?.[1] ?? '0', 10);
        const b = parseInt(urlB.match(/\/(\d+)(\?.*)?$/)?.[1] ?? '0', 10);
        const [oldUrl, newUrl] = a < b ? [urlA, urlB] : [urlB, urlA];

        // 获取旧版本和新版本的HTML内容
        const oldHtml = await (await fetch(oldUrl)).text();
        const newHtml = await (await fetch(newUrl)).text();

        // 解析HTML字符串为DOM对象
        const oldDoc = new DOMParser().parseFromString(oldHtml, 'text/html');
        const newDoc = new DOMParser().parseFromString(newHtml, 'text/html');

        // 提取脚本和样式内容
        const oldScript = extractField(oldDoc, 'formScript');
        const newScript = extractField(newDoc, 'formScript');
        const oldStyle = extractField(oldDoc, 'formStyle');
        const newStyle = extractField(newDoc, 'formStyle');

        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'diff-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Bangumi 代码对比</h2>
                    <button class="modal-close">关闭</button>
                </div>
                <div class="container">
                    <div id="script"></div>
                    <div id="style"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // 渲染脚本和样式差异
        renderDiff(modal.querySelector('#script'), oldScript, newScript, '脚本');
        renderDiff(modal.querySelector('#style'), oldStyle, newStyle, '样式');

        // 添加关闭按钮功能
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
    }

    // 初始化函数，在页面加载后添加复选框和对比按钮。
    function init() {
        // 获取所有版本链接
        const versionLinks = [...document.querySelectorAll('a.l[href*="/gadget/"]')];
        if (versionLinks.length === 0) return;

        // 为每个版本链接添加复选框
        versionLinks.forEach(link => {
            const box = document.createElement('input');
            box.type = 'checkbox';
            box.className = 'version-box';
            box.dataset.url = link.href;
            link.before(box);
        });

        // 创建对比按钮
        const btn = document.createElement('button');
        btn.textContent = '版本对比';
        btn.className = 'compare-btn';
        btn.disabled = true;
        btn.style.marginLeft = '10px';
        document.querySelector('h2.subtitle')?.appendChild(btn);

        // 监听复选框变化，控制按钮的禁用状态
        document.querySelectorAll('.version-box').forEach(box => {
            box.addEventListener('change', () => {
                const checked = document.querySelectorAll('.version-box:checked');
                btn.disabled = checked.length !== 2;
            });
        });

        // 监听对比按钮点击事件
        btn.addEventListener('click', () => {
            const [a, b] = [...document.querySelectorAll('.version-box:checked')].map(b => b.dataset.url);
            compareVersions(a, b);
        });
    }

    // 页面加载完成后执行初始化
    window.addEventListener('load', () => {
        if (/https:\/\/(bgm\.tv|bangumi\.tv|chii\.in)\/dev\/app\/\d+$/.test(window.location.href)) {
            init();
        }
    });

    // 添加GM_addStyle样式
    GM_addStyle(`
        .version-box {
            margin-right: 4px;
        }
        .compare-btn {
            background-color: #F09199;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }
        .compare-btn:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }
        .compare-btn:not(:disabled):hover {
            background-color: #e07b83;
        }
        .diff-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        .modal-content {
            background: #ffffff;
            width: 90vw;
            height: 90vh;
            overflow: auto;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #ddd;
            position: relative;
            display: flex;
            flex-direction: column;
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            background: #ffffff;
            padding: 10px;
            z-index: 1001;
            border-bottom: 1px solid #ddd;
        }
        .modal-header h2 {
            margin: 0;
        }
        .modal-close {
            background: #F09199;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }
        .modal-close:hover {
            background: #e07b83;
        }
        .container {
            flex: 1;
            overflow: auto;
        }
        .diff-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            width: 100%;
            height: 100%;
            overflow-x: auto;
            overflow-y: auto;
        }
        .diff-grid > div {
            overflow: auto;
        }
        .diff-grid .code {
            font-family: 'Source Code Pro', 'Fira Code', 'Courier New', monospace;
            background: #f7f7f7;
            padding: 10px;
            border: 1px solid #ddd;
            min-height: 300px;
            overflow-x: auto;
            font-size: 14px !important;
            tab-size: 4;
        }
        .diff-grid h4 {
            font-size: 16px !important;
        }
        .diff-add {
            background: #eaffea;
            color: #228822;
        }
        .diff-del {
            background: #ffecec;
            color: #cc0000;
        }
        .line {
            position: relative;
            white-space: pre;
            padding-left: 3em;
        }
        .line-number {
            position: absolute;
            left: 0;
            width: 2.5em;
            text-align: right;
            color: #999;
            user-select: none;
        }
        .line + .line {
            border-top: 1px solid #f0f0f0;
        }
        h2, h4 {
            margin: 0.5em 0;
        }
        @media (max-width: 768px) {
            .diff-grid {
                grid-template-columns: 1fr;
            }
        }
    `);
})();