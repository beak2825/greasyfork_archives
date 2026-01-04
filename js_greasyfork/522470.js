// ==UserScript==
// @name         谷歌高级搜索工具
// @namespace    http://tampermonkey.net/
// @version      4.6.7
// @description  [完整功能] 包含所有搜索指令+界面修复
// @author       万航宇
// @match        https://www.google.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/522470/%E8%B0%B7%E6%AD%8C%E9%AB%98%E7%BA%A7%E6%90%9C%E7%B4%A2%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/522470/%E8%B0%B7%E6%AD%8C%E9%AB%98%E7%BA%A7%E6%90%9C%E7%B4%A2%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        STORAGE_KEYS: {
            POSITION: 'toolbarPositionFinal',
            PRESETS: 'searchPresetsFinal'
        },
        DEFAULT_PRESETS: {
            site: ["zhihu.com", "bilibili.com", "github.com"],
            filetype: ["pdf", "docx", "ppt"],
            imagesize: ["1920x1080", "1280x720", "800x600"],
        },
        STYLE: {
            toolbarWidth: '360px',
            primaryColor: '#1e90ff',
            dangerColor: '#ff4444',
            borderRadius: '8px'
        }
    };

    GM_addStyle(`
        .gs-toolbar {
            position: fixed;
            background: rgba(0, 0, 0, 0.95);
            color: #fff;
            padding: 15px;
            width: ${CONFIG.STYLE.toolbarWidth};
            min-height: 420px;
            border-radius: ${CONFIG.STYLE.borderRadius};
            z-index: 2147483647;
            cursor: grab;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transform: translateZ(0);
            box-sizing: border-box;
            overflow: visible !important;
        }

        .gs-field-group {
            margin-bottom: 12px;
            position: relative;
            display: block !important;
        }

        .gs-field-group input {
            width: 100% !important;
            padding: 8px 12px !important;
            border: 1px solid #666 !important;
            background: #333 !important;
            color: #fff !important;
            border-radius: 4px;
            box-sizing: border-box;
            opacity: 1 !important;
            visibility: visible !important;
        }

        .gs-dropdown {
            position: absolute;
            width: 100%;
            background: #444;
            border: 1px solid #666;
            border-radius: 4px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 2147483647;
            margin-top: 5px;
            display: none;
        }

        .gs-option {
            padding: 8px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .gs-option:hover {
            background: #555;
        }

        .gs-delete-btn {
            color: ${CONFIG.STYLE.dangerColor} !important;
            cursor: pointer;
            padding: 0 5px;
        }
    `);

    const Storage = {
        get(key) {
            return GM_getValue(key) || JSON.parse(localStorage.getItem(key)) || null;
        },
        set(key, value) {
            GM_setValue(key, value);
            localStorage.setItem(key, JSON.stringify(value));
        }
    };

    class PresetManager {
        constructor() {
            this.presets = Storage.get(CONFIG.STORAGE_KEYS.PRESETS) || {...CONFIG.DEFAULT_PRESETS};
        }

        add(field, value) {
            if (!this.presets[field].includes(value)) {
                this.presets[field].push(value);
                this.save();
                return true;
            }
            return false;
        }

        delete(field, value) {
            this.presets[field] = this.presets[field].filter(v => v !== value);
            this.save();
        }

        save() {
            Storage.set(CONFIG.STORAGE_KEYS.PRESETS, this.presets);
        }
    }

    class FinalSearchToolbar {
        constructor() {
            this.toolbar = null;
            this.presetManager = new PresetManager();
            this.init();
        }

        init() {
            this.createToolbar();
            this.restorePosition();
            this.initDrag();
            this.bindEvents();
            this.initPresetDropdowns();
        }

        createToolbar() {
            this.toolbar = document.createElement('div');
            this.toolbar.className = 'gs-toolbar';
            this.toolbar.innerHTML = `
                <h3 style="margin:0 0 15px 0;font-size:16px;">谷歌高级搜索工具</h3>
                ${this.buildSearchForm()}
            `;
            document.body.appendChild(this.toolbar);
        }

        buildSearchForm() {
            return `
                <div class="gs-field-group">
                    <input type="text" id="keywords" placeholder="输入关键词">
                </div>
                ${this.createPresetField('site', '限定网站 (site:example.com)')}
                ${this.createPresetField('filetype', '文件类型 (filetype:pdf)')}
                ${this.createPresetField('imagesize', '图片尺寸 (imagesize:1920x1080)')}
                <div class="gs-field-group">
                    <input type="text" id="intitle" placeholder="限定标题关键词 (intitle:关键词)">
                </div>
                <div class="gs-field-group">
                    <input type="text" id="allintitle" placeholder="多标题关键词 (allintitle:关键词1 关键词2)">
                </div>
                <div class="gs-field-group">
                    <input type="text" id="intext" placeholder="限定内容关键词 (intext:关键词)">
                </div>
                <div class="gs-field-group">
                    <input type="text" id="inurl" placeholder="限定网址关键词 (inurl:关键词)">
                </div>
                <button id="search-btn" style="
                    width:100%;
                    padding:10px;
                    background:${CONFIG.STYLE.primaryColor};
                    border:none;
                    border-radius:4px;
                    color:#fff;
                    margin-top:10px;
                    cursor:pointer;
                ">立即搜索</button>
            `;
        }

        createPresetField(field, placeholder) {
            return `
                <div class="gs-field-group">
                    <input type="text" id="${field}" placeholder="${placeholder}">
                    <div class="gs-dropdown" id="${field}-dropdown">
                        ${this.presetManager.presets[field].map(v => `
                            <div class="gs-option">
                                <span>${v}</span>
                                <span class="gs-delete-btn">×</span>
                            </div>
                        `).join('')}
                        <div class="gs-option" style="color:${CONFIG.STYLE.primaryColor}">
                            + 保存到预设
                        </div>
                    </div>
                </div>
            `;
        }

        initPresetDropdowns() {
            ['site', 'filetype', 'imagesize'].forEach(field => {
                const input = document.getElementById(field);
                const dropdown = document.getElementById(`${field}-dropdown`);

                input.addEventListener('focus', () => dropdown.style.display = 'block');
                input.addEventListener('blur', () => setTimeout(() => dropdown.style.display = 'none', 200));

                dropdown.addEventListener('click', (e) => {
                    const target = e.target;
                    const value = input.value.trim();

                    if (target.classList.contains('gs-delete-btn')) {
                        const presetValue = target.parentNode.querySelector('span').textContent;
                        this.presetManager.delete(field, presetValue);
                        target.parentNode.remove();
                    }
                    else if (target.textContent.includes('保存到预设')) {
                        if (this.validateInput(field, value)) {
                            if (this.presetManager.add(field, value)) {
                                const newOption = this.createPresetOption(value);
                                dropdown.insertBefore(newOption, dropdown.lastElementChild);
                                input.value = '';
                            }
                        } else {
                            alert('输入格式不正确！');
                        }
                    }
                    else if (target.tagName === 'SPAN') {
                        input.value = target.textContent;
                    }
                });
            });
        }

        createPresetOption(value) {
            const div = document.createElement('div');
            div.className = 'gs-option';
            div.innerHTML = `
                <span>${value}</span>
                <span class="gs-delete-btn">×</span>
            `;
            return div;
        }

        validateInput(field, value) {
            const patterns = {
                site: /^([\w-]+\.)+\w+$/,
                filetype: /^\w+$/,
                imagesize: /^\d+x\d+$/
            };
            return patterns[field].test(value);
        }

        initDrag() {
            let isDragging = false;
            let startX, startY, initialX, initialY;

            this.toolbar.addEventListener('mousedown', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;

                isDragging = true;
                const rect = this.toolbar.getBoundingClientRect();
                startX = e.clientX;
                startY = e.clientY;
                initialX = rect.left;
                initialY = rect.top;
                this.toolbar.style.cursor = 'grabbing';
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;

                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                this.toolbar.style.left = `${initialX + dx}px`;
                this.toolbar.style.top = `${initialY + dy}px`;
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    this.toolbar.style.cursor = 'grab';
                    Storage.set(CONFIG.STORAGE_KEYS.POSITION, {
                        x: parseInt(this.toolbar.style.left),
                        y: parseInt(this.toolbar.style.top)
                    });
                }
            });
        }

        bindEvents() {
            document.getElementById('search-btn').addEventListener('click', () => this.search());

            this.toolbar.querySelectorAll('input').forEach(input => {
                input.addEventListener('keydown', e => {
                    if (e.key === 'Enter') this.search();
                });
            });
        }

        search() {
            const params = {
                keywords: document.getElementById('keywords').value.trim(),
                site: document.getElementById('site').value.trim(),
                filetype: document.getElementById('filetype').value.trim(),
                imagesize: document.getElementById('imagesize').value.trim(),
                intitle: document.getElementById('intitle').value.trim(),
                allintitle: document.getElementById('allintitle').value.trim(),
                intext: document.getElementById('intext').value.trim(),
                inurl: document.getElementById('inurl').value.trim()
            };

            if (!Object.values(params).some(v => v)) {
                alert('请输入至少一个搜索条件！');
                return;
            }

            const query = [];
            if (params.keywords) query.push(`"${params.keywords}"`);
            if (params.site) query.push(`site:${params.site}`);
            if (params.filetype) query.push(`filetype:${params.filetype}`);
            if (params.imagesize) query.push(`imagesize:${params.imagesize}`);
            if (params.intitle) query.push(`intitle:"${params.intitle}"`);
            if (params.allintitle) query.push(`allintitle:${params.allintitle.replace(/ /g, '+')}`);
            if (params.intext) query.push(`intext:"${params.intext}"`);
            if (params.inurl) query.push(`inurl:${params.inurl}`);

            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query.join(' '))}`;
        }

        restorePosition() {
            const pos = Storage.get(CONFIG.STORAGE_KEYS.POSITION) || { x: 20, y: 20 };
            this.toolbar.style.left = `${pos.x}px`;
            this.toolbar.style.top = `${pos.y}px`;
        }
    }

    new FinalSearchToolbar();
})();