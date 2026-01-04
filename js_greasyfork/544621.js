// ==UserScript==
// @name         Twitch聊天室净化
// @version      1.0001
// @description  聊天室信息增删改，替换词留空为删除。特性：大小写不敏感、简繁体和中英文符号替换，优先匹配长词，自动去重，导入导出数据，多页面同步，支持列表拖动记忆位置。
// @author       yzcjd
// @author1       ChatGPT4辅助
// @match        https://www.twitch.tv/*
// @namespace    https://greasyfork.org/users/1171320
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addValueChangeListener
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544621/Twitch%E8%81%8A%E5%A4%A9%E5%AE%A4%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/544621/Twitch%E8%81%8A%E5%A4%A9%E5%AE%A4%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const PER_PAGE = 24;
    let replacements = {};
    let currentPage = 1;
    let container = null;
    let allEntries = [];
    let dragOffset = { x: 0, y: 0 };
    let isDragging = false;

    let justImportedOrSaved = false;

    const simpToTradMap = { '台湾': '台湾', '后': '后', '马': '马' };
    const tradToSimpMap = Object.fromEntries(Object.entries(simpToTradMap).map(([k, v]) => [v, k]));

    function normalizeSymbols(str) {
        return str.replace(/[，。！？【】（）％＃＠＆１２３４５６７８９０]/g, c => ({
            '，': ',', '。': '.', '！': '!', '？': '?', '【': '[', '】': ']', '（': '(', '）': ')',
            '％': '%', '＃': '#', '＠': '@', '＆': '&',
            '１': '1', '２': '2', '３': '3', '４': '4', '５': '5',
            '６': '6', '７': '7', '８': '8', '９': '9', '０': '0'
        })[c] || c);
    }

    function convertSimpToTrad(str) {
        for (const [simp, trad] of Object.entries(simpToTradMap)) {
            str = str.split(simp).join(trad);
        }
        return str;
    }

    function convertTradToSimp(str) {
        for (const [trad, simp] of Object.entries(tradToSimpMap)) {
            str = str.split(trad).join(simp);
        }
        return str;
    }

    function generateRegexKeys(from) {
        const keys = new Set();
        const normalized = normalizeSymbols(from);
        const simp = convertTradToSimp(normalized);
        const trad = convertSimpToTrad(normalized);
        keys.add(normalized);
        keys.add(simp);
        keys.add(trad);
        return [...keys].filter(Boolean);
    }

    function parseReplacements(obj) {
        const map = {};
        Object.entries(obj).forEach(([k, v]) => {
            if (k.trim()) map[k.trim()] = v.trim();
        });
        return map;
    }

    function getSortedReplacements() {
        return Object.entries(replacements).sort((a, b) => a[0].localeCompare(b[0]));
    }

    function applyReplacementToText(text) {
        getSortedReplacements().forEach(([from, to]) => {
            generateRegexKeys(from).forEach(key => {
                const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                text = text.replace(regex, to);
            });
        });
        return text;
    }

    function scanMessages() {
        document.querySelectorAll('span.text-fragment[data-a-target="chat-message-text"]').forEach(el => {
            el.textContent = applyReplacementToText(el.textContent);
        });
    }

    setInterval(scanMessages, 3000);
    window.addEventListener('load', () => setTimeout(scanMessages, 3000));

    if (typeof GM_addValueChangeListener === 'function') {
        GM_addValueChangeListener('replacements_obj', (_, __, newVal) => {
            replacements = parseReplacements(newVal);
            allEntries = Object.entries(replacements);
            scanMessages();
        });
        GM_addValueChangeListener('editor_pos', (_, __, newVal) => {
            if (container && newVal) {
                container.style.left = `${newVal.x}px`;
                container.style.top = `${newVal.y}px`;
            }
        });
    }

    function createButton(text, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = 'margin:2px;padding:2px 6px;font-size:12px;cursor:pointer;';
        btn.onclick = onClick;
        return btn;
    }

    function makeRow(from = '', to = '', highlight = false) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" value="${from}" style="width:120px;border:1px solid ${highlight ? '#aaa' : '#ccc'};"/></td>
            <td><input type="text" value="${to}" style="width:120px;border:1px solid ${highlight ? '#aaa' : '#ccc'};"/></td>`;
        return row;
    }

    function showToast(msg) {
        const toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#333;color:#fff;padding:5px 10px;border-radius:4px;font-size:12px;z-index:100000;opacity:1;transition:opacity 0.5s ease';
        document.body.appendChild(toast);
        setTimeout(() => toast.style.opacity = '0', 3000);
        setTimeout(() => toast.remove(), 3500);
    }

    function renderPage(table, data, page) {
        table.querySelectorAll('tr').forEach((tr, i) => i > 0 && tr.remove());
        const start = (page - 1) * PER_PAGE;
        const end = start + PER_PAGE;
        data.slice(start, end).forEach(([from, to]) => table.appendChild(makeRow(from, to)));
        const blankRow = makeRow('', '', true);
        table.appendChild(blankRow);
    }

    function getTableEntries(table) {
        const rows = table.querySelectorAll('tr');
        const entries = [];
        rows.forEach((tr, i) => {
            if (i === 0) return;
            const inputs = tr.querySelectorAll('input');
            const key = inputs[0].value.trim();
            const val = inputs[1].value.trim();
            if (key) entries.push([key, val]);
        });
        return entries;
    }

    async function saveAndClose(table) {
        const currentPageEntries = getTableEntries(table);
        const startIdx = (currentPage - 1) * PER_PAGE;
        const newAllEntries = [...allEntries];
        newAllEntries.splice(startIdx, PER_PAGE, ...currentPageEntries);

        const filteredEntries = newAllEntries.filter(([k]) => k.trim() !== '');
        filteredEntries.sort((a, b) => a[0].localeCompare(b[0]));

        replacements = Object.fromEntries(filteredEntries);
        allEntries = filteredEntries;
        await GM_setValue('replacements_obj', replacements);

        currentPage = 1;
        await GM_setValue('lastPage', currentPage);

        closeContainer(true);
        scanMessages();
        showToast('已保存，每0.3秒执行一次替换');
    }

    function closeContainer(isSaved = false) {
        if (container) {
            container.remove();
            container = null;
            justImportedOrSaved = isSaved;
        }
        // 移除拖拽事件监听，防止内存泄漏和误触发
        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragEnd);
    }

    function focusLastRowInput(table) {
        const rows = table.querySelectorAll('tr');
        if (rows.length > 1) {
            const lastRowInputs = rows[rows.length - 1].querySelectorAll('input');
            if (lastRowInputs.length > 0) {
                lastRowInputs[0].focus();
            }
        }
    }

    // 拖拽相关函数声明，方便绑定和解绑
    function onDragStart(e) {
        if (e.target.tagName === 'INPUT') return; // 输入框内不拖动
        isDragging = true;
        dragOffset.x = e.clientX - container.offsetLeft;
        dragOffset.y = e.clientY - container.offsetTop;
        e.preventDefault();
    }
    function onDragMove(e) {
        if (!isDragging) return;
        let x = e.clientX - dragOffset.x;
        let y = e.clientY - dragOffset.y;
        x = Math.max(0, Math.min(window.innerWidth - container.offsetWidth, x));
        y = Math.max(0, Math.min(window.innerHeight - container.offsetHeight, y));
        container.style.left = x + 'px';
        container.style.top = y + 'px';
    }
    function onDragEnd() {
        if (isDragging) {
            isDragging = false;
            GM_setValue('editor_pos', { x: container.offsetLeft, y: container.offsetTop });
        }
    }

    function openEditor() {
        if (container) return;
        justImportedOrSaved = false;
        replacements = parseReplacements(GM_getValue('replacements_obj', {}));
        allEntries = Object.entries(replacements);
        currentPage = GM_getValue('lastPage', 1) || 1;

        container = document.createElement('div');
        container.style.cssText = 'position:fixed;z-index:99999;background:#fff;border:1px solid #ccc;padding:10px;top:100px;left:100px;max-height:80%;overflow-y:auto;font-size:13px;box-shadow:0 0 10px rgba(0,0,0,0.2);min-width:300px;';
        container.style.userSelect = 'none';

        // 绑定拖拽事件
        container.addEventListener('mousedown', onDragStart);
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);

        // 读取存储位置并应用
        const pos = GM_getValue('editor_pos', null);
        if (pos) {
            container.style.left = `${pos.x}px`;
            container.style.top = `${pos.y}px`;
        } else {
            container.style.left = '100px';
            container.style.top = '100px';
        }

        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        table.style.width = '100%';
        table.innerHTML = '<tr><th>原词</th><th>替换词</th></tr>';

        renderPage(table, allEntries, currentPage);

        const saveBtn = createButton('💾 保存', () => saveAndClose(table));
        const closeBtn = createButton('❌ 关闭', () => {
            closeContainer(false);
        });
        const addBtn = createButton('+ 添加', () => {
            table.appendChild(makeRow('', '', true));
            focusLastRowInput(table);
        });
        const prevBtn = createButton('⬅', () => {
            if (currentPage > 1) {
                currentPage--;
                GM_setValue('lastPage', currentPage);
                renderPage(table, allEntries, currentPage);
                focusLastRowInput(table);
            }
        });
        const nextBtn = createButton('➡', () => {
            if (currentPage < Math.ceil(allEntries.length / PER_PAGE)) {
                currentPage++;
                GM_setValue('lastPage', currentPage);
                renderPage(table, allEntries, currentPage);
                focusLastRowInput(table);
            }
        });

        const importBtn = createButton('📥 导入', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.ini,.txt';
            input.onchange = () => {
                const file = input.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                    const result = {};
                    reader.result.split(/\r?\n/).forEach(line => {
                        const [key, val = ''] = line.split('=>');
                        if (key && key.trim()) result[key.trim()] = val.trim();
                    });
                    replacements = parseReplacements(result);
                    allEntries = Object.entries(replacements);

                    currentPage = 1;
                    GM_setValue('lastPage', currentPage);

                    renderPage(table, allEntries, currentPage);

                    GM_setValue('replacements_obj', replacements).then(() => {
                        justImportedOrSaved = true;
                        showToast('导入成功，已自动保存');
                        scanMessages();
                        focusLastRowInput(table);
                    });
                };
                reader.readAsText(file);
            };
            input.click();
        });

        const exportBtn = createButton('📤 导出', () => {
            const now = new Date();
            const pad = n => n.toString().padStart(2, '0');
            const filename = `Twitch聊天室净化脚本${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}.ini`;
            const blob = new Blob([Object.entries(replacements).map(([k, v]) => `${k} => ${v}`).join('\n')], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            a.click();
            showToast('导出成功');
        });

        container.appendChild(table);
        [addBtn, saveBtn, importBtn, exportBtn, prevBtn, nextBtn, closeBtn].forEach(btn => container.appendChild(btn));

        document.body.appendChild(container);

        focusLastRowInput(table);
    }

    GM_registerMenuCommand('📝 列表', openEditor);

})();
