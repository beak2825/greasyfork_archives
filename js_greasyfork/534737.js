// ==UserScript==
// @name         PO小说下载器
// @namespace    http://tampermonkey.net/
// @version      2.1.1
// @description  下载PO18/POPO小说，支持TXT/HTML/EPUB格式，多线程下载，记录下载历史，增强阅读体验，查看已购书架，WebDAV上传，多站点自动识别
// @author       wenmoux
// @license MIT
// @match        https://www.po18.tw/*
// @match        https://www.popo.tw/*
// @icon         https://www.po18.tw/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @connect      www.po18.tw
// @connect      www.popo.tw
// @connect      *
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://unpkg.com/jszip@3.10.1/dist/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/534737/PO%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/534737/PO%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 站点配置 ====================
    const CURRENT_SITE = window.location.hostname.includes('popo.tw') ? 'popo' : 'po18';

    // 站点配置 - 方便添加其他站点
    const SITE_CONFIG = {
        po18: {
            name: 'PO18',
            baseUrl: 'https://www.po18.tw',
            icon: '💖',
            // URL模式
            bookUrlPattern: /\/books\/(\d+)/,
            // 书籍详情页选择器
            detailSelector: 'h1.book_name',
            authorSelector: 'a.book_author',
            coverSelector: '.book_cover>img',
            descSelector: '.B_I_content',
            tagsSelector: '.book_intro_tags>a',
            statusSelector: 'dd.statu',
            // 章节列表选择器
            chapterListSelector: '#w0>div',
            chapterNameSelector: '.l_chaptname',
            chapterBtnSelector: '.l_btn>a',
            purchaseIndicator: '訂購',  // 未购买标识
            // 章节内容获取
            chapterContentUrl: (bookId, chapterId) => `https://www.po18.tw/books/${bookId}/articlescontent/${chapterId}`,
            chapterRefererUrl: (bookId, chapterId) => `https://www.po18.tw/books/${bookId}/articles/${chapterId}`,
            // 内容提取方式: 'direct'(直接返回内容) 或 'extract'(需要提取)
            contentExtractMode: 'direct',
            contentSelector: null,  // direct模式不需要
            // 书架相关
            bookshelfUrl: (year) => `https://www.po18.tw/panel/stock_manage/buyed_lists?sort=order&date_year=${year}`,
            bookshelfSelector: 'tbody>.alt-row',
            bookshelfTitleSelector: 'a',
            bookshelfAuthorSelector: '.T_author',
            publisher: 'PO18脸红心跳'
        },
        popo: {
            name: 'POPO',
            baseUrl: 'https://www.popo.tw',
            icon: '📚',
            // URL模式
            bookUrlPattern: /\/books\/(\d+)/,
            // 书籍详情页选择器
            detailSelector: 'h3.title',
            authorSelector: '.b_author a',
            coverSelector: '.BC img',
            descSelector: '.book_intro span',
            tagsSelector: '.book_intro .tags a',
            statusSelector: 'dd.b_statu',
            // 章节列表选择器
            chapterListSelector: '#w0>div',
            chapterNameSelector: '.c2 a',
            chapterBtnSelector: '.c2 a, .c4 a',
            purchaseIndicator: '訂購',
            // 章节内容获取 - POPO返回完整页面
            chapterContentUrl: (bookId, chapterId) => `https://www.popo.tw/books/${bookId}/articles/${chapterId}`,
            chapterRefererUrl: (bookId, chapterId) => `https://www.popo.tw/books/${bookId}/articles/${chapterId}`,
            contentExtractMode: 'extract',
            contentSelector: '.read-txt',  // POPO需要提取这个元素
            // 书架相关 - POPO可能不同
            bookshelfUrl: (year) => `https://www.popo.tw/panel/stock_manage/buyed_lists?sort=order&date_year=${year}`,
            bookshelfSelector: 'tbody>.alt-row',
            bookshelfTitleSelector: 'a',
            bookshelfAuthorSelector: '.T_author',
            publisher: 'POPO原创'
        }
    };

    // 当前站点配置
    const SITE = SITE_CONFIG[CURRENT_SITE];

    // ==== 轻量ZIP生成器 ====
    class MiniZip {
        constructor() {
            this.files = [];
        }

        file(name, content, options = {}) {
            const data = typeof content === 'string' ? new TextEncoder().encode(content) : new Uint8Array(content);
            this.files.push({ name, data, options });
            return this;
        }

        async generateAsync(options) {
            const files = this.files;
            const parts = [];
            const centralDir = [];
            let offset = 0;

            for (const file of files) {
                const nameBytes = new TextEncoder().encode(file.name);
                const crc = this._crc32(file.data);
                const size = file.data.length;

                // Local file header (30 bytes + filename)
                const header = new ArrayBuffer(30);
                const hv = new DataView(header);
                hv.setUint32(0, 0x04034b50, true);  // 签名
                hv.setUint16(4, 20, true);          // 版本
                hv.setUint16(6, 0, true);           // 标志
                hv.setUint16(8, 0, true);           // 压缩方法: STORE
                hv.setUint16(10, 0, true);          // 修改时间
                hv.setUint16(12, 0x21, true);       // 修改日期
                hv.setUint32(14, crc, true);        // CRC32
                hv.setUint32(18, size, true);       // 压缩后大小
                hv.setUint32(22, size, true);       // 原始大小
                hv.setUint16(26, nameBytes.length, true); // 文件名长度
                hv.setUint16(28, 0, true);          // 额外字段长度

                parts.push(new Uint8Array(header), nameBytes, file.data);

                // Central directory entry (46 bytes + filename)
                const cd = new ArrayBuffer(46);
                const cv = new DataView(cd);
                cv.setUint32(0, 0x02014b50, true);  // 签名
                cv.setUint16(4, 20, true);          // 创建版本
                cv.setUint16(6, 20, true);          // 需要版本
                cv.setUint16(8, 0, true);           // 标志
                cv.setUint16(10, 0, true);          // 压缩方法: STORE
                cv.setUint16(12, 0, true);          // 修改时间
                cv.setUint16(14, 0x21, true);       // 修改日期
                cv.setUint32(16, crc, true);        // CRC32
                cv.setUint32(20, size, true);       // 压缩后大小
                cv.setUint32(24, size, true);       // 原始大小
                cv.setUint16(28, nameBytes.length, true); // 文件名长度
                cv.setUint16(30, 0, true);          // 额外字段长度
                cv.setUint16(32, 0, true);          // 文件注释长度
                cv.setUint16(34, 0, true);          // 磁盘编号
                cv.setUint16(36, 0, true);          // 内部属性
                cv.setUint32(38, 0, true);          // 外部属性
                cv.setUint32(42, offset, true);     // 本地文件头偏移
                centralDir.push(new Uint8Array(cd), nameBytes);

                offset += 30 + nameBytes.length + size;
            }

            // End of central directory
            const cdOffset = offset;
            let cdSize = 0;
            centralDir.forEach(arr => cdSize += arr.length);

            const eocd = new ArrayBuffer(22);
            const ev = new DataView(eocd);
            ev.setUint32(0, 0x06054b50, true);      // 签名
            ev.setUint16(4, 0, true);               // 磁盘编号
            ev.setUint16(6, 0, true);               // 开始磁盘
            ev.setUint16(8, files.length, true);    // 此盘记录数
            ev.setUint16(10, files.length, true);   // 总记录数
            ev.setUint32(12, cdSize, true);         // 中心目录大小
            ev.setUint32(16, cdOffset, true);       // 中心目录偏移
            ev.setUint16(20, 0, true);              // 注释长度

            // 合并所有部分
            const allParts = [...parts, ...centralDir, new Uint8Array(eocd)];
            const totalSize = allParts.reduce((sum, arr) => sum + arr.length, 0);
            const result = new Uint8Array(totalSize);
            let pos = 0;
            allParts.forEach(arr => { result.set(arr, pos); pos += arr.length; });

            return new Blob([result], { type: 'application/epub+zip' });
        }

        _crc32(data) {
            if (!MiniZip._crcTable) {
                const table = new Uint32Array(256);
                for (let i = 0; i < 256; i++) {
                    let c = i;
                    for (let j = 0; j < 8; j++) {
                        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
                    }
                    table[i] = c;
                }
                MiniZip._crcTable = table;
            }
            let crc = 0xFFFFFFFF;
            for (let i = 0; i < data.length; i++) {
                crc = MiniZip._crcTable[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
            }
            return (crc ^ 0xFFFFFFFF) >>> 0;
        }
    }

    // ==== 外部库引用 ====
    const _JSZip = MiniZip;
    const _saveAs = (typeof saveAs !== 'undefined') ? saveAs :
                    (typeof window.saveAs !== 'undefined') ? window.saveAs :
                    (typeof unsafeWindow !== 'undefined' && unsafeWindow.saveAs) ? unsafeWindow.saveAs : null;

    // ==== 工具函数 ====
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
    const create = (tag, attrs = {}, html = '') => {
        const el = document.createElement(tag);
        Object.entries(attrs).forEach(([k, v]) => k === 'className' ? el.className = v : el.setAttribute(k, v));
        if (html) el.innerHTML = html;
        return el;
    };

    // HTML解析器
    const HTMLParser = {
        parse(html) {
            const doc = new DOMParser().parseFromString(html, 'text/html');
            return {
                $: sel => doc.querySelector(sel),
                $$: sel => Array.from(doc.querySelectorAll(sel)),
                text: sel => doc.querySelector(sel)?.textContent.trim() || '',
                attr: (sel, attr) => doc.querySelector(sel)?.getAttribute(attr),
                getText: () => doc.body.textContent,
                getHTML: () => doc.body.innerHTML,
                remove(sel) { doc.querySelectorAll(sel).forEach(el => el.remove()); return this; },
                // 兼容旧API
                querySelector: sel => doc.querySelector(sel),
                querySelectorAll: sel => Array.from(doc.querySelectorAll(sel)),
                getTextContent: sel => doc.querySelector(sel)?.textContent.trim() || '',
                getAttributeValue: (sel, attr) => doc.querySelector(sel)?.getAttribute(attr)
            };
        }
    };

    // ==== 样式设置 - 修改为淡粉色主题 ====
    GM_addStyle(`
        /* 粉色主题风格 */
        :root {
            --primary-color: #FF8BA7; /* 主色调修改为淡粉色 */
            --primary-light: #FFB2C0; /* 浅色调 */
            --primary-dark: #D46A87; /* 深色调 */
            --text-on-primary: #ffffff;
            --surface-color: #ffffff;
            --background-color: #FFF0F3;
            --error-color: #D32F2F;
            --box-shadow: 0 2px 4px rgba(0,0,0,.1), 0 3px 6px rgba(0,0,0,.05);
            --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .po18-downloader {
            font-family: 'Roboto', sans-serif;
            color: #333;
        }

        .po18-float-button {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: var(--text-on-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 3px 5px rgba(0,0,0,0.3);
            z-index: 9999;
            user-select: none;
            transition: var(--transition);
        }

        .po18-float-button:hover {
            transform: scale(1.1);box-shadow: 0 5px 8px rgba(0,0,0,0.3);
        }

        .po18-panel {
            position: fixed;
            bottom: 100px;
            right: 30px;
            width: 360px;
            background-color: var(--surface-color);
            border-radius: 12px;
            box-shadow: var(--box-shadow);
            z-index: 9998;
            overflow: hidden;
            display: none;
            max-height: 600px;
            transition: var(--transition);
        }

        .po18-panel.active {
            display: block;
        }

        .po18-header {
            background-color: var(--primary-color);
            color: var(--text-on-primary);
            padding: 16px;
            font-weight: 500;
            font-size: 18px;
            display: flex;
            justify-content: space-between;align-items: center;
        }

        .po18-tabs {
            display: flex;
            background-color: var(--primary-light);
            color: var(--text-on-primary);
        }

        .po18-tab {
            flex: 1;
            text-align: center;
            padding: 12px 0;
            cursor: pointer;
            transition: var(--transition);
            border-bottom: 3px solid transparent;}

        .po18-tab.active {
            border-bottom: 3px solid white;
            background-color: var(--primary-color);
        }

        .po18-tab:hover:not(.active) {
            background-color: rgba(255,255,255,0.1);
        }

        .po18-tab-content {
            padding: 16px;
            max-height: 450px;
            overflow-y: auto;
        }

        .po18-tab-pane {
            display: none;
        }

        .po18-tab-pane.active {
            display: block;
        }

        .po18-card {
            background-color: white;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 16px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        /* 书籍详情样式 */
        .po18-book-info {
            display: flex;
            margin-bottom: 15px;
        }

        .po18-book-cover {
            width: 100px;
            height: 140px;
            object-fit: cover;
            border-radius: 6px;
            margin-right: 15px;
        }

        .po18-book-details {
            flex: 1;}

        .po18-book-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 6px;
            color: #333;
        }

        .po18-book-author {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
        }

        .po18-book-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-top: 5px;
        }

        .po18-book-tag {
            background-color: var(--primary-light);
            color: #333;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 12px;}

        .po18-form-group {
            margin-bottom: 12px;
        }

        .po18-form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight:500;
            color: #666;
        }

        .po18-select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: white;
        }

        .po18-button {
            padding: 10px 16px;
            border: none;
            border-radius: 8px;
            background-color: var(--primary-color);
            color: white;
            cursor: pointer;
            font-weight: 500;
            transition: var(--transition);
        }

        .po18-button:hover {
            background-color: var(--primary-dark);
        }.po18-button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }

        .po18-progress {
            height: 8px;
            background-color: #eee;
            border-radius: 4px;
            margin: 10px 0;overflow: hidden;
        }

        .po18-progress-bar {
            height: 100%;
            background-color: var(--primary-color);
            width: 0%;transition: width 0.3s ease;
        }

        .po18-log {
            font-family: monospace;
            background-color: #f8f8f8;
            padding: 10px;
            border-radius: 8px;
            max-height: 200px;
            overflow-y: auto;
            font-size: 12px;
            white-space: pre-wrap;}

        .po18-record-item {
            padding: 12px;
            border-left: 4px solid var(--primary-color);
            background-color: #f9f9f9;
            margin-bottom: 10px;
            border-radius: 08px 8px 0;
        }

        .po18-record-item h4 {
            margin: 0 0 8px 0;}

        .po18-record-info {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #666;
        }

        /*拖动样式 */
        .po18-draggable {
            cursor: move;
        }

        /* 书架相关样式 */
        .po18-bookshelf-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .po18-bookshelf-header h3 {
            margin: 0;
            color: var(--primary-dark);
        }

        .po18-bookshelf-status {
            font-size: 14px;
            color: #666;
            margin-bottom: 15px;
        }

        .po18-book-item {
            border-bottom: 1px solid #eee;
            padding: 15px 0;
        }

        .po18-book-item:last-child {
            border-bottom: none;
        }

        .po18-book-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 10px;
        }

        .po18-button-small {
            padding: 5px 10px;
            font-size: 12px;
        }

        .po18-empty-message {
            text-align: center;
            padding: 30px 0;
            color: #666;
        }

        .po18-book-year {
            font-size: 12px;
            color: #888;
            margin-top: 5px;
        }

        /* WebDAV设置样式 */
        .po18-input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: white;
            margin-bottom: 8px;
            box-sizing: border-box;
        }
        .po18-input:focus {
            outline: none;
            border-color: var(--primary-color);
        }
        .po18-checkbox-group {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
        }
        .po18-checkbox-group input {
            margin-right: 8px;
        }
        .po18-status {
            padding: 8px;
            border-radius: 6px;
            margin-top: 10px;
            font-size: 12px;
        }
        .po18-status.success { background: #E8F5E9; color: #2E7D32; }
        .po18-status.error { background: #FFEBEE; color: #C62828; }
        .po18-status.info { background: #E3F2FD; color: #1565C0; }
    `);

    // ==== 主要功能实现 ====
    const Po18Downloader = {
        content: [],
        option: {},
        logs: [],
        downloadRecords: GM_getValue('downloadRecords', []),
        currentTab: 'download',
        bid: null,
        downloadFormat: 'txt',
        threadCount: 3,
        isDownloading: false,
        totalChapters: 0,
        downloadedChapters: 0,
        startTime: 0,
        // WebDAV配置
        webdavConfig: GM_getValue('webdavConfig', {
            enabled: false,
            url: '',
            username: '',
            password: '',
            path: '/books/'
        }),
        lastDownloadedFile: null, // 保存最后下载的文件信息

        init() {
            this.createUI();
            this.bindEvents();
            this.loadSettings();
            this.detectNovelPage();

            // 检查登录状态
            this.checkLoginStatus();
        },

        createUI() {
            // 创建悬浮按钮
            const floatButton = document.createElement('div');
            floatButton.className = 'po18-float-button';
            floatButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="white"><path d="M12 21q-3.75 0-6.375-2.625T3 12Q3 8.25 5.625 5.625T12 3t6.375 2.625T21 12t-2.625 6.375T12 21Z"/></svg>';
            document.body.appendChild(floatButton);

            // 创建主面板
            const panel = document.createElement('div');
            panel.className = 'po18-panel';
            // 使用模板字符串确保HTML格式正确
            panel.innerHTML = `
                <div class="po18-header po18-draggable">
                    <span>${SITE.icon} ${SITE.name}小说下载器</span>
                    <span style="cursor:pointer" id="po18-close">✕</span>
                </div>
                <div class="po18-tabs">
                    <div class="po18-tab active" data-tab="download">下载</div>
                    <div class="po18-tab" data-tab="log">日志</div>
                    <div class="po18-tab" data-tab="records">记录</div>
                    <div id="po18-bookshelf-tab" class="po18-tab" data-tab="bookshelf" style="display:none">书架</div>
                    <div class="po18-tab" data-tab="settings">设置</div>
                    <div class="po18-tab" data-tab="about">关于</div>
                </div>
                <div class="po18-tab-content">
                    <div class="po18-tab-pane active" id="po18-tab-download">
                        <div id="po18-book-details-container" class="po18-card"></div>
                        <div class="po18-card">
                            <div class="po18-form-group">
                                <label for="po18-format">下载格式</label>
                                <select id="po18-format" class="po18-select">
                                    <option value="txt">TXT</option>
                                    <option value="html">HTML</option>
                                    <option value="epub">EPUB</option>
                                </select>
                            </div>
                            <div class="po18-form-group">
                                <label for="po18-thread">线程数</label>
                                <select id="po18-thread" class="po18-select">
                                    <option value="1">1线程</option>
                                    <option value="3" selected>3线程</option>
                                    <option value="5">5线程</option>
                                    <option value="10">10线程</option>
                                </select>
                            </div>
                            <button id="po18-start" class="po18-button">开始下载</button>
                        </div>
                        <div id="po18-download-status" style="display:none">
                            <div class="po18-card">
                                <h4>下载进度</h4>
                                <div class="po18-progress">
                                    <div class="po18-progress-bar" id="po18-progress"></div>
                                </div>
                                <div id="po18-progress-text">0/0 章节 (0%)</div>
                                <div id="po18-download-time">已用时间: 0秒</div>
                            </div>
                        </div>
                    </div>
                    <div class="po18-tab-pane" id="po18-tab-log">
                        <div class="po18-card">
                            <div class="po18-log" id="po18-logs"></div>
                        </div>
                    </div>
                    <div class="po18-tab-pane" id="po18-tab-records">
                        <div id="po18-records-container"></div>
                    </div>
                    <div class="po18-tab-pane" id="po18-tab-bookshelf">
                        <div class="po18-card">
                            <div class="po18-bookshelf-header">
                                <h3>我的书架</h3>
                                <button id="po18-refresh-bookshelf" class="po18-button" style="padding: 5px 10px; font-size: 12px;">刷新</button>
                            </div><div id="po18-bookshelf-status">加载中...</div>
                            <div id="po18-bookshelf-container"></div>
                        </div>
                    </div>
                    <div class="po18-tab-pane" id="po18-tab-settings">
                        <div class="po18-card">
                            <h4 style="margin-bottom:12px;color:var(--primary-dark)">WebDAV 设置</h4>
                            <div class="po18-checkbox-group">
                                <input type="checkbox" id="po18-webdav-enabled">
                                <label for="po18-webdav-enabled">启用WebDAV上传</label>
                            </div>
                            <div class="po18-form-group">
                                <label>服务器地址</label>
                                <input type="text" id="po18-webdav-url" class="po18-input" placeholder="https://dav.example.com">
                            </div>
                            <div class="po18-form-group">
                                <label>用户名</label>
                                <input type="text" id="po18-webdav-username" class="po18-input" placeholder="用户名">
                            </div>
                            <div class="po18-form-group">
                                <label>密码</label>
                                <input type="password" id="po18-webdav-password" class="po18-input" placeholder="密码">
                            </div>
                            <div class="po18-form-group">
                                <label>上传路径</label>
                                <input type="text" id="po18-webdav-path" class="po18-input" placeholder="/books/">
                            </div>
                            <button id="po18-webdav-save" class="po18-button" style="margin-right:10px">保存配置</button>
                            <button id="po18-webdav-test" class="po18-button" style="background:#666">测试连接</button>
                            <div id="po18-webdav-status"></div>
                        </div>
                    </div>
                    <div class="po18-tab-pane" id="po18-tab-about">
                        <div class="po18-card">
                            <h3>${SITE.name}小说下载器 v2.0.0</h3><p>这是一款用于下载PO18/POPO网站小说的工具，支持TXT/HTML/EPUB格式下载，WebDAV上传等功能。</p>
                              <p>作者github：wenmoux:</p>
                            <p>新增功能:</p>
                            <ol>
                                <li>全新的粉色主题界面</li>
                                <li>显示小说封面、作者和标签</li>
                                <li>增强HTML输出，支持电子书式的左右翻页</li>
                                <li>阅读界面支持字体大小、颜色主题调整</li>
                                <li>新增行间距、字间距调整功能</li>
                                <li>优化正文排版和阅读舒适度</li>
                                <li>新增书架功能，便于管理已购买小说</li>
                                <li>epub下载</li>
                                <li>webdav上传</li>
                            </ol>
                            <p>使用方法：</p>
                            <ol>
                                <li>在小说页面点击悬浮按钮</li>
                                <li>选择下载格式和线程数</li>
                                <li>点击"开始下载"按钮</li>
                            </ol>
                            <p>注意：需要先登录${SITE.name}网站才能下载已购买的章节。</p>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(panel);
        },

        bindEvents() {
            // 点击悬浮按钮显示/隐藏面板
            document.querySelector('.po18-float-button').addEventListener('click', () => {
                const panel = document.querySelector('.po18-panel');
                panel.classList.toggle('active');
            });

            // 点击关闭按钮
            document.getElementById('po18-close').addEventListener('click', () => {
                document.querySelector('.po18-panel').classList.remove('active');
            });

            // 标签页切换
            document.querySelectorAll('.po18-tab').forEach(tab => {
                tab.addEventListener('click', (e) => {
                    this.currentTab = e.target.dataset.tab;

                    // 移除所有标签的active类
                    document.querySelectorAll('.po18-tab').forEach(t => {
                        t.classList.remove('active');
                    });

                    // 移除所有面板的active类
                    document.querySelectorAll('.po18-tab-pane').forEach(p => {
                        p.classList.remove('active');
                    });
                    // 添加当前标签和面板的active类
                    e.target.classList.add('active');
                    const pane = document.getElementById(`po18-tab-${this.currentTab}`);
                    if (pane) {
                        pane.classList.add('active');
                    }

                    if (this.currentTab === 'records') {
                        this.renderDownloadRecords();
                    } else if (this.currentTab === 'bookshelf') {
                        this.renderBookshelf();
                    }
                });
            });

            // 下载按钮
            document.getElementById('po18-start').addEventListener('click', () => {
                this.startDownload();
            });

            // 下载格式选择
            document.getElementById('po18-format').addEventListener('change', (e) => {
                this.downloadFormat = e.target.value;
                GM_setValue('downloadFormat', this.downloadFormat);
            });

            // 线程数选择
            document.getElementById('po18-thread').addEventListener('change', (e) => {
                this.threadCount = parseInt(e.target.value);
                GM_setValue('threadCount', this.threadCount);
            });

            // 书架刷新按钮事件
            document.getElementById('po18-refresh-bookshelf')?.addEventListener('click', () => {
                this.log('正在刷新书架数据...');
                this.fetchBookshelf().then(books => {
                    this.getBookDetails(books).then(detailedBooks => {
                        this.renderBookshelf(detailedBooks);
                    });
                });
            });

            // 实现悬浮按钮的拖动功能
            this.makeDraggable(document.querySelector('.po18-float-button'));

            // 实现面板的拖动功能
            this.makeDraggable(document.querySelector('.po18-panel'), document.querySelector('.po18-draggable'));

            // WebDAV事件绑定
            this.bindWebDAVEvents();
        },

        bindWebDAVEvents() {
            // 加载WebDAV配置到表单
            const config = this.webdavConfig;
            const enabledEl = document.getElementById('po18-webdav-enabled');
            const urlEl = document.getElementById('po18-webdav-url');
            const usernameEl = document.getElementById('po18-webdav-username');
            const passwordEl = document.getElementById('po18-webdav-password');
            const pathEl = document.getElementById('po18-webdav-path');

            if (enabledEl) enabledEl.checked = config.enabled;
            if (urlEl) urlEl.value = config.url;
            if (usernameEl) usernameEl.value = config.username;
            if (passwordEl) passwordEl.value = config.password;
            if (pathEl) pathEl.value = config.path;

            // 保存配置
            document.getElementById('po18-webdav-save')?.addEventListener('click', () => {
                this.webdavConfig = {
                    enabled: enabledEl?.checked || false,
                    url: urlEl?.value.trim() || '',
                    username: usernameEl?.value.trim() || '',
                    password: passwordEl?.value || '',
                    path: pathEl?.value.trim() || '/books/'
                };
                GM_setValue('webdavConfig', this.webdavConfig);
                this.showWebDAVStatus('配置已保存', 'success');
                this.log('WebDAV配置已保存');
            });

            // 测试连接
            document.getElementById('po18-webdav-test')?.addEventListener('click', () => {
                this.testWebDAVConnection();
            });
        },

        showWebDAVStatus(message, type = 'info') {
            const statusEl = document.getElementById('po18-webdav-status');
            if (statusEl) {
                statusEl.className = 'po18-status ' + type;
                statusEl.textContent = message;
                setTimeout(() => { statusEl.textContent = ''; statusEl.className = ''; }, 3000);
            }
        },

        testWebDAVConnection() {
            const config = this.webdavConfig;
            if (!config.url) {
                this.showWebDAVStatus('请先填写服务器地址', 'error');
                return;
            }

            this.showWebDAVStatus('正在测试连接...', 'info');

            GM_xmlhttpRequest({
                method: 'PROPFIND',
                url: config.url.replace(/\/$/, '') + config.path,
                headers: {
                    'Authorization': 'Basic ' + btoa(config.username + ':' + config.password),
                    'Depth': '0'
                },
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        this.showWebDAVStatus('✅ 连接成功！', 'success');
                        this.log('WebDAV连接测试成功');
                    } else if (response.status === 404) {
                        this.showWebDAVStatus('⚠️ 路径不存在，将在上传时自动创建', 'info');
                    } else if (response.status === 401) {
                        this.showWebDAVStatus('❌ 认证失败，请检查用户名密码', 'error');
                    } else {
                        this.showWebDAVStatus('❌ 连接失败: ' + response.status, 'error');
                    }
                },
                onerror: (error) => {
                    this.showWebDAVStatus('❌ 网络错误，请检查地址', 'error');
                    this.log('WebDAV连接失败: ' + (error.message || '网络错误'));
                }
            });
        },

        // 上传文件到WebDAV
        async uploadToWebDAV(blob, fileName) {
            const config = this.webdavConfig;
            if (!config.enabled || !config.url) {
                return false;
            }

            this.log('正在上传到WebDAV: ' + fileName);

            return new Promise((resolve) => {
                const fullPath = config.url.replace(/\/$/, '') + config.path.replace(/\/$/, '') + '/' + fileName;

                GM_xmlhttpRequest({
                    method: 'PUT',
                    url: fullPath,
                    headers: {
                        'Authorization': 'Basic ' + btoa(config.username + ':' + config.password),
                        'Content-Type': 'application/octet-stream'
                    },
                    data: blob,
                    onload: (response) => {
                        if (response.status >= 200 && response.status < 300) {
                            this.log('WebDAV上传成功: ' + fileName);
                            resolve(true);
                        } else {
                            this.log('WebDAV上传失败: ' + response.status);
                            resolve(false);
                        }
                    },
                    onerror: (error) => {
                        this.log('WebDAV上传错误: ' + (error.message || '网络错误'));
                        resolve(false);
                    }
                });
            });
        },

        makeDraggable(element, handle = null) {
            const dragElement = handle || element;
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

            dragElement.addEventListener('mousedown', dragMouseDown);

            function dragMouseDown(e) {
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.addEventListener('mouseup', closeDragElement);
                document.addEventListener('mousemove', elementDrag);
            }

            function elementDrag(e) {
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;

                const newTop = element.offsetTop - pos2;
                const newLeft = element.offsetLeft - pos1;

                // 确保元素不会被拖出可视区域
                if (newTop > 0 && newTop < window.innerHeight - element.offsetHeight) {
                    element.style.top = newTop + "px";
                }
                if (newLeft > 0 && newLeft < window.innerWidth - element.offsetWidth) {
                    element.style.left = newLeft + "px";
                }
            }

            function closeDragElement() {
                document.removeEventListener('mouseup', closeDragElement);
                document.removeEventListener('mousemove', elementDrag);
            }
        },

        loadSettings() {
            this.downloadFormat = GM_getValue('downloadFormat', 'txt');
            this.threadCount = GM_getValue('threadCount', 3);

            const formatSelect = document.getElementById('po18-format');
            const threadSelect = document.getElementById('po18-thread');

            if (formatSelect) formatSelect.value = this.downloadFormat;
            if (threadSelect) threadSelect.value = this.threadCount.toString();
        },

        detectNovelPage() {
            const url = window.location.href;
            const bidMatch = url.match(SITE.bookUrlPattern);

            if (bidMatch) {
                this.bid = bidMatch[1];
                this.log(`检测到小说ID: ${this.bid} (站点: ${SITE.name})`);

                // 获取小说信息并显示
                this.fetchBookDetails(this.bid);
            } else {
                this.log(`未检测到${SITE.name}小说页面`);
            }
        },

        // 检查登录状态
        checkLoginStatus() {
            // 检查页面中是否包含"登入"文字，如果没有则认为已登录
            const pageContent = document.body.textContent || '';
            const isLoggedIn = !pageContent.includes('登入');

            // 显示或隐藏书架标签
            const bookshelfTab = document.getElementById('po18-bookshelf-tab');
            if (bookshelfTab) {
                bookshelfTab.style.display = isLoggedIn ? 'block' : 'none';
            }

            return isLoggedIn;
        },

        // 获取已购书架数据
        async fetchBookshelf() {
            if (!this.checkLoginStatus()) {
                this.log('未登录，无法获取书架信息');
                return [];
            }

            const allBooks = [];
            const currentYear = new Date().getFullYear();

            // 获取最近5年的书籍
            for (let year = currentYear; year >= currentYear - 5; year--) {
                try {
                    const yearBooks = await this.fetchBookshelfByYear(year);
                    if (yearBooks.length) {
                        allBooks.push(...yearBooks);
                    }
                } catch (error) {
                    this.log(`获取${year}年书籍失败: ${error.message || '未知错误'}`);
                }
            }

            // 缓存书籍信息
            GM_setValue('bookshelfData', {
                books: allBooks,
                timestamp: Date.now()
            });

            return allBooks;
        },

        async fetchBookshelfByYear(year) {
            return new Promise((resolve) => {
                // 使用站点配置的书架URL
                const url = SITE.bookshelfUrl(year);

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: {
                        'referer': SITE.baseUrl,
                    },
                    onload: (response) => {
                        try {
                            const html = response.responseText;
                            const $ = HTMLParser.parse(html);
                            const books = [];

                            // 使用站点配置的选择器
                            $.querySelectorAll(SITE.bookshelfSelector).forEach((book) => {
                                const nameEl = book.querySelector(SITE.bookshelfTitleSelector);
                                if (!nameEl) return;

                                const name = nameEl.textContent.trim();
                                const href = nameEl.getAttribute('href');
                                const authorEl = book.querySelector(SITE.bookshelfAuthorSelector);

                                // 从href中提取bid
                                const bidMatch = href ? href.match(/\/books\/(\d+)/) : null;
                                const bid = bidMatch ? bidMatch[1] : null;
                                if (name && bid) {
                                    books.push({
                                        title: name,
                                        bid: bid,
                                        author: authorEl ? authorEl.textContent.trim() : '未知作者',
                                        cover: null, // 稍后会通过详情获取
                                        detail: `${SITE.baseUrl}${href}`,
                                        year: year,
                                        platform: CURRENT_SITE
                                    });
                                }
                            });

                            this.log(`获取到${year}年已购书籍 ${books.length} 本`);
                            resolve(books);
                        } catch (err) {
                            this.log(`解析${year}年书籍列表失败: ${err.message || '未知错误'}`);
                            resolve([]);
                        }
                    },
                    onerror: (error) => {
                        this.log(`获取${year}年书籍列表请求失败: ${error.message || "未知错误"}`);
                        resolve([]);
                    }
                });
            });
        },

        // 获取书籍详情并更新缓存
        async getBookDetails(books) {
            const bookDetailsCache = GM_getValue('bookDetailsCache', {});
            const now = Date.now();
            const cacheExpiry = 7 * 24 * 60 * 60 * 1000; // 7天缓存过期

            // 过滤出需要获取详情的书籍
            const booksToFetch = books.filter(book => {
                const cachedBook = bookDetailsCache[book.bid];
                return !cachedBook || (now - cachedBook.timestamp > cacheExpiry);
            });

            if (booksToFetch.length === 0) {
                // 全部使用缓存
                return books.map(book => {
                    const cachedData = bookDetailsCache[book.bid]?.details;
                    if (cachedData) {
                        return { ...book, ...cachedData };
                    }
                    return book;
                });
            }

            // 分批获取详情，避免过多请求
            const batchSize = 3;
            let processedCount = 0;

            for (let i = 0; i < booksToFetch.length; i += batchSize) {
                const batch = booksToFetch.slice(i, i + batchSize);
                await Promise.all(batch.map(async (book) => {
                    try {
                        const details = await this.getDetail(book.bid);
                        if (details) {
                            // 更新缓存
                            bookDetailsCache[book.bid] = {
                                timestamp: now,
                                details: {
                                    title: details.title,
                                    author: details.author,
                                    cover: details.cover,
                                    tags: details.tags
                                }
                            };

                            // 更新书籍数据
                            book.title = details.title;
                            book.author = details.author;
                            book.cover = details.cover;
                            book.tags = details.tags;
                        }
                        processedCount++;
                        this.log(`获取书籍详情 (${processedCount}/${booksToFetch.length}): ${book.title}`);

                        // 更新界面
                        this.renderBookshelf(books);

                    } catch (error) {
                        this.log(`获取书籍 [${book.title}] 详情失败: ${error.message || '未知错误'}`);
                    }
                }));

                // 短暂延迟，避免请求过快
                if (i + batchSize < booksToFetch.length) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            // 保存缓存
            GM_setValue('bookDetailsCache', bookDetailsCache);

            return books;
        },

        // 渲染书架UI
        async renderBookshelf(books = null) {
            const container = document.getElementById('po18-bookshelf-container');
            const statusEl = document.getElementById('po18-bookshelf-status');

            if (!container) return;

            // 如果没有提供书籍列表，尝试从缓存加载
            if (!books) {
                const cachedData = GM_getValue('bookshelfData', null);

                if (cachedData && Date.now() - cachedData.timestamp < 24 * 60 * 60 * 1000) {
                    // 缓存不超过24小时
                    books = cachedData.books;
                    this.log('从缓存加载书架数据');
                } else {
                    // 缓存过期或不存在，重新获取
                    if (statusEl) statusEl.textContent = '正在获取书架数据...';
                    books = await this.fetchBookshelf();
                }

                // 获取书籍详情
                books = await this.getBookDetails(books);
            }

            // 更新状态信息
            if (statusEl) {
                statusEl.textContent = `共 ${books.length} 本已购书籍`;
            }

            // 渲染书架
            let html = '';

            if (books.length === 0) {
                html = `<div class="po18-empty-message">没有找到已购书籍，请确认已登录${SITE.name}网站</div>`;
            } else {
                books.forEach((book) => {
                    // 默认封面图
                    const coverUrl = book.cover || 'https://imgfzone.tooopen.com/20201106/tooopen_v11011311323157.jpg';

                    // 标签HTML
                    let tagsHTML = '';
                    if (book.tags) {
                        const tagsList = book.tags.split('·');
                        tagsList.forEach(tag => {
                            if (tag.trim()) {
                                tagsHTML += `<span class="po18-book-tag">${tag.trim()}</span>`;
                            }
                        });
                    }

                    html += `
                    <div class="po18-book-item">
                        <div class="po18-book-info">
                            <img class="po18-book-cover" src="${coverUrl}" alt="${book.title}封面">
                            <div class="po18-book-details">
                                <h3 class="po18-book-title">${book.title}</h3>
                                <div class="po18-book-author">作者: ${book.author}</div>
                                <div class="po18-book-tags">${tagsHTML}</div>
                                <div class="po18-book-year">购买年份: ${book.year}</div>
                            </div>
                        </div>
                        <div class="po18-book-actions">
                            <a href="${book.detail}" target="_blank" class="po18-button po18-button-small">查看</a>
                            <button class="po18-button po18-button-small po18-download-book" data-bid="${book.bid}" data-title="${book.title}">下载</button>
                        </div>
                    </div>
                    `;
                });
            }

            container.innerHTML = html;

            // 绑定下载按钮事件
            document.querySelectorAll('.po18-download-book').forEach(button => {
                button.addEventListener('click', (e) => {
                    const bid = e.target.dataset.bid;
                    const title = e.target.dataset.title;

                    if (bid) {
                        this.bid = bid;
                        this.log(`选择下载书籍: ${title} (${bid})`);

                        // 切换到下载标签页document.querySelector('.po18-tab[data-tab="download"]').click();

                        // 获取书籍详情
                        this.fetchBookDetails(bid);
                    }
                });
            });
        },

        // 获取并显示小说详情
        async fetchBookDetails(bid) {
            try {
                const detail = await this.getDetail(bid);
                if (detail) {
                    this.renderBookDetails(detail);
                }
            } catch (err) {
                this.log(`获取小说详情失败: ${err.message || '未知错误'}`);
            }
        },

        // 渲染小说详情
        renderBookDetails(detail) {
            const container = document.getElementById('po18-book-details-container');
            if (!container) return;

            // 标签HTML
            let tagsHTML = '';
            if (detail.tags) {
                const tagsList = detail.tags.split('·');
                tagsList.forEach(tag => {
                    if (tag.trim()) {
                        tagsHTML += `<span class="po18-book-tag">${tag.trim()}</span>`;
                    }
                });
            }

            // 构造小说详情HTML
            const html = `
                <div class="po18-book-info">
                    <img class="po18-book-cover" src="${detail.cover}" alt="${detail.title}封面">
                    <div class="po18-book-details">
                        <h3 class="po18-book-title">${detail.title}</h3>
                        <div class="po18-book-author">作者: ${detail.author}</div>
                        <div class="po18-book-tags">
                            ${tagsHTML}
                        </div>
                    </div>
                </div>
            `;

            container.innerHTML = html;
        },

        log(message) {
            const timestamp = new Date().toLocaleTimeString();
            const logMessage = `[${timestamp}] ${message}`;
            this.logs.unshift(logMessage);

            // 限制日志数量
            if (this.logs.length > 100) {
                this.logs.pop();
            }

            // 更新日志显示
            const logElement = document.getElementById('po18-logs');
            if (logElement) {
                logElement.innerText = this.logs.join('\n');
            }

            console.log(`[${SITE.name}下载器] ${message}`);
        },

        updateProgress(current, total) {
            this.downloadedChapters = current;
            this.totalChapters = total;

            const percent = total > 0 ? Math.floor((current / total) * 100) : 0;

            const progressBar = document.getElementById('po18-progress');
            const progressText = document.getElementById('po18-progress-text');
            const downloadTime = document.getElementById('po18-download-time');

            if (progressBar) progressBar.style.width = `${percent}%`;
            if (progressText) progressText.innerText = `${current}/${total} 章节 (${percent}%)`;

            const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
            if (downloadTime) downloadTime.innerText = `已用时间: ${elapsedTime}秒`;
        },

        async startDownload() {
            if (this.isDownloading) {
                this.log('下载任务正在进行中，请等待完成');
                return;
            }

            if (!this.bid) {
                this.log('未检测到小说ID，请在小说页面使用此功能');
                return;
            }

            this.isDownloading = true;
            this.content = [];
            this.option = {};
            this.downloadedChapters = 0;
            this.totalChapters = 0;
            this.startTime = Date.now();

            const downloadStatus = document.getElementById('po18-download-status');
            if (downloadStatus) downloadStatus.style.display = 'block';

            const startBtn = document.getElementById('po18-start');
            if (startBtn) {
                startBtn.disabled = true;
                startBtn.textContent = '下载中...';
            }

            this.log(`开始下载小说 (BID: ${this.bid}, 格式: ${this.downloadFormat}, 线程数: ${this.threadCount})`);

            try {
                await this.downloadNovel();
            } catch (err) {
                this.log(`下载失败: ${err.message || '未知错误'}`);
            } finally {
                this.isDownloading = false;
                if (startBtn) {
                    startBtn.disabled = false;
                    startBtn.textContent = '开始下载';
                }
            }
        },

        async downloadNovel() {
            // 获取小说详情
            this.log('正在获取小说详情...');
            const detail = await this.getDetail(this.bid);

            if (!detail) {
                this.log('获取小说详情失败');
                return;
            }

            this.option = Object.assign({}, detail);
            this.log(`小说信息: ${detail.title} - ${detail.author} (共${detail.pageNum}页)`);

            // 获取章节列表
            this.log('正在获取章节列表...');
            const chapters = await this.getChapterList(detail);

            if (!chapters || chapters.length === 0) {
                this.log('获取章节列表失败或没有可下载的章节');
                return;
            }

            this.totalChapters = chapters.length;
            this.log(`共找到 ${chapters.length} 个可下载章节`);

            // 下载所有章节内容
            this.log('开始下载章节内容...');
            const startTime = Date.now();

            // 使用滑动窗口并发模式，保持恒定并发数
            await this.downloadChaptersWithConcurrency(chapters, this.threadCount);

            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000;
            this.log(`章节内容下载完成，耗时 ${duration.toFixed(2)} 秒`);

            // 按顺序排序内容
            this.content.sort((a, b) => a.index - b.index);

            // 生成完整内容
            this.log('正在生成最终文件...');

            // 整理内容格式
            if (this.downloadFormat === 'epub') {
                // EPUB格式特殊处理
                await this.generateEpub(detail, chapters.length, duration);
                return;
            }

            const fileContent = this.formatContent();

            // 下载文件
            const fileName = `${detail.title}.${this.downloadFormat}`;
            const fileSize = this.getByteSize(fileContent);
            const fileSizeText = this.formatFileSize(fileSize);

            // 使用FileSaver.js保存文件
            try {
                const blob = new Blob([fileContent], {
                    type: this.downloadFormat === 'txt' ? 'text/plain;charset=utf-8' : 'text/html;charset=utf-8'
                });
                window.saveAs(blob, fileName);

                // WebDAV上传
                if (this.webdavConfig.enabled) {
                    const uploaded = await this.uploadToWebDAV(blob, fileName);
                    if (uploaded) {
                        this.log('WebDAV上传成功!');
                    }
                }

                // 记录下载信息
                const record = {
                    title: detail.title,
                    author: detail.author,
                    format: this.downloadFormat,
                    size: fileSizeText,
                    time: new Date().toLocaleString(),
                    duration: duration.toFixed(2),
                    chapterCount: chapters.length,
                    cover: detail.cover,
                    tags: detail.tags
                };

                this.downloadRecords.unshift(record);
                if (this.downloadRecords.length > 50) {
                    this.downloadRecords.pop();
                }
                GM_setValue('downloadRecords', this.downloadRecords);

                this.log(`下载完成! 文件名: ${fileName}, 大小: ${fileSizeText}, 耗时: ${duration.toFixed(2)}秒`);
            } catch (e) {
                this.log(`保存文件失败: ${e.message || '未知错误'}`);
            }
        },

        async getDetail(bid) {
            return new Promise((resolve) => {
                this.log(`正在获取${SITE.name}小说详情...`);

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${SITE.baseUrl}/books/${bid}`,
                    headers: {
                        'referer': SITE.baseUrl,
                    },
                    onload: (response) => {
                        try {
                            const html = response.responseText;
                            const $ = HTMLParser.parse(html);

                            // 使用站点配置的选择器解析
                            let zhText = $.getTextContent(SITE.statusSelector);
                            let zh = zhText.match(/\d+/);

                            // 获取标签
                            const tags = [];
                            $.querySelectorAll(SITE.tagsSelector).forEach(tag => {
                                const tagText = tag.textContent.trim().replace(/\s+/g, ' ');
                                if (tagText) tags.push(tagText);
                            });

                            // 处理描述 - 优化简介读取
                            const descEl = $.querySelector(SITE.descSelector);
                            let desc = '';
                            if (descEl) {
                                // 保留原始HTML结构，但清理多余空白
                                desc = descEl.innerHTML
                                    .replace(/&nbsp;/g, ' ')
                                    .replace(/<br\s*\/?>/gi, '</p><p>')
                                    .replace(/\s{2,}/g, ' ')
                                    .trim();
                                // 如果没有p标签，包裹一个
                                if (!desc.startsWith('<p>')) {
                                    desc = `<p>${desc}</p>`;
                                }
                            }

                            // 获取标题（移除括号内容和多余空格）
                            const bookTitle = $.getTextContent(SITE.detailSelector);
                            const title = bookTitle
                                .split(/（|【|\(/)[0]
                                .replace(/\s+/g, ' ')  // 合并多个空格为一个
                                .trim();

                            // 获取封面
                            const coverEl = $.querySelector(SITE.coverSelector);
                            const cover = coverEl ? (coverEl.getAttribute('src') || '') : '';

                            const detail = {
                                title: title,
                                author: $.getTextContent(SITE.authorSelector).replace(/\s+/g, ' ').trim(),
                                cover: cover,
                                description: desc,
                                content: [],
                                tags: tags.join("·"),
                                bid,
                                pub: SITE.publisher,
                                pageNum: Math.ceil(zh / 100) || 1,
                                platform: CURRENT_SITE
                            };
                            this.log(`获取到小说: ${detail.title} - ${detail.author}`);
                            resolve(detail);
                        } catch (err) {
                            this.log(`解析小说详情失败: ${err.message || '未知错误'}`);
                            resolve(null);
                        }
                    },
                    onerror: (error) => {
                        this.log(`获取小说详情请求失败: ${error.message || "未知错误"}`);
                        resolve(null);
                    }
                });
            });
        },

async getChapterList(detail) {
    const chapters = [];
    let globalIndex = 0;
    for (let page = 1; page <= detail.pageNum; page++) {
        this.log(`正在获取第${page}/${detail.pageNum} 页章节列表...`);
        const url = `${SITE.baseUrl}/books/${detail.bid}/articles?page=${page}`;
        const pageChapters = await this.getPageChapters(url);

        if (pageChapters && pageChapters.length > 0) {
            for (const chapter of pageChapters) {
                chapter.index = globalIndex++;
            }
            chapters.push(...pageChapters);
        }
    }

    return chapters;
},

        async getPageChapters(url) {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: {
                        'referer': SITE.baseUrl,
                    },
                    onload: (response) => {
                        try {
                            const html = response.responseText;
                            const $ = HTMLParser.parse(html);
                            const chapterItems = [];

                            // 使用站点配置的选择器
                            $.querySelectorAll(SITE.chapterListSelector).forEach((element) => {
                                const chaptNameEl = element.querySelector(SITE.chapterNameSelector);
                                if (!chaptNameEl) return;

                                // 清理章节名中的多余空格
                                const name = chaptNameEl.textContent.replace(/\s+/g, ' ').trim();
                                const isPurchased = !element.textContent.includes(SITE.purchaseIndicator);

                                if (isPurchased) {
                                    // 使用站点配置的按钮选择器
                                    const btnLink = element.querySelector(SITE.chapterBtnSelector);
                                    if (!btnLink) return;

                                    const href = btnLink.getAttribute("href");
                                    if (!href) return;

                                    // 解析章节ID
                                    const match = href.match(/\/books\/(\d+)\/articles\/(\d+)/);
                                    if (!match) return;

                                    chapterItems.push({
                                        title: name,
                                        bid: match[1],
                                        pid: match[2],
                                        index: chapterItems.length
                                    });
                                } else {
                                    this.log(`章节 "${name}" 需要购买，已跳过`);
                                }
                            });

                            resolve(chapterItems);
                        } catch (err) {
                            this.log(`解析章节列表失败: ${err.message || '未知错误'}`);
                            resolve([]);
                        }
                    },
                    onerror: (error) => {
                        this.log(`获取章节列表请求失败: ${error.message || "未知错误"}`);
                        resolve([]);
                    }
                });
            });
        },

        // 滑动窗口并发下载
        async downloadChaptersWithConcurrency(chapters, concurrency) {
            let index = 0;
            const total = chapters.length;
            const results = [];

            const worker = async () => {
                while (index < total) {
                    const currentIndex = index++;
                    const chapter = chapters[currentIndex];
                    await this.getChapterContent(chapter);
                }
            };

            // 启动多个并发worker
            const workers = [];
            for (let i = 0; i < Math.min(concurrency, total); i++) {
                workers.push(worker());
            }

            await Promise.all(workers);
        },

        async getChapterContent(chapter) {
            return new Promise((resolve) => {
                const { bid, pid, index, title } = chapter;

                // 使用站点配置的URL
                const contentUrl = SITE.chapterContentUrl(bid, pid);
                const refererUrl = SITE.chapterRefererUrl(bid, pid);

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: contentUrl,
                    headers: {
                        'referer': refererUrl,
                        'x-requested-with': 'XMLHttpRequest'
                    },
                    onload: (response) => {
                        try {
                            // 安全检查 responseText
                            if (!response || !response.responseText) {
                                this.log(`章节 "${title}" 返回空内容，已跳过`);
                                resolve();
                                return;
                            }

                            let content = response.responseText.replace(/ &nbsp;&nbsp;/g, "");
                            const $ = HTMLParser.parse(content);

                            // 获取标题
                            // 注意：POPO站点的h1是书名不是章节名，直接使用传入的title参数
                            // PO18站点的articlescontent接口返回的h1是章节名
                            let name = '';
                            if (CURRENT_SITE === 'po18') {
                                // PO18: 从content页面的h1获取章节名
                                const h1El = $.querySelector('h1');
                                if (h1El) {
                                    name = h1El.textContent.replace(/\s+/g, ' ').trim();
                                }
                            }
                            // POPO站点直接使用传入的title（从章节列表页获取）

                            // 移除引用块和h1标签
                            $.remove("blockquote");
                            $.remove("h1");

                            // 根据站点配置提取内容
                            let htmlContent = '', textContent = '';
                            if (SITE.contentExtractMode === 'extract' && SITE.contentSelector) {
                                // POPO等需要提取特定元素的站点
                                const contentEl = $.querySelector(SITE.contentSelector);
                                if (contentEl) {
                                    htmlContent = (contentEl.innerHTML || '').replace(/&nbsp;/g, "");
                                    textContent = (contentEl.textContent || '').trim();
                                } else {
                                    // 如果找不到指定元素，尝试其他选择器
                                    const altContent = $.querySelector('.read-content, .article-content, #article-content');
                                    if (altContent) {
                                        htmlContent = (altContent.innerHTML || '').replace(/&nbsp;/g, "");
                                        textContent = (altContent.textContent || '').trim();
                                    } else {
                                        // 最后使用body
                                        const bodyHtml = $.getHTML();
                                        const bodyText = $.getText();
                                        htmlContent = (bodyHtml || '').replace(/&nbsp;/g, "");
                                        textContent = (bodyText || '').trim();
                                    }
                                }
                            } else {
                                // PO18等直接返回内容的站点
                                const bodyHtml = $.getHTML();
                                const bodyText = $.getText();
                                htmlContent = (bodyHtml || '').replace(/&nbsp;/g, "");
                                textContent = (bodyText || '').trim();
                            }

                            // 检查内容是否为空
                            if (!htmlContent && !textContent) {
                                this.log(`章节 "${title}" 内容为空，已跳过`);
                                resolve();
                                return;
                            }

                            // 将章节内容存储到数组（清理标题空格）
                            const chapterTitle = (name || title).replace(/\s+/g, ' ').trim();
                            this.content[index] = {
                                title: chapterTitle,
                                data: htmlContent,
                                rawText: textContent,
                                index: index
                            };

                            this.log(`已下载章节: ${chapterTitle}`);
                            this.downloadedChapters++;
                            this.updateProgress(this.downloadedChapters, this.totalChapters);

                            resolve();
                        } catch (err) {
                            this.log(`下载章节 "${title}" 失败: ${err.message || '未知错误'}`);
                            resolve();
                        }
                    },
                    onerror: (error) => {
                        this.log(`下载章节 "${title}" 请求失败: ${error.message || "未知错误"}`);
                        resolve();
                    }
                });
            });
        },

        // 增强的内容格式化方法
        formatContent() {
            if (this.downloadFormat === 'txt') {
                // TXT格式增强，加入简介和标签
                let content = `${this.option.title}\n作者: ${this.option.author}\n\n`;

                // 加入标签
                if (this.option.tags) {
                    content += `标签: ${this.option.tags}\n\n`;
                }

                // 加入简介
                if (this.option.description) {
                    const description = this.option.description.replace(/<[^>]+>/g, ''); // 移除HTML标签
                    content += `【简介】\n${description}\n\n`;
                }

                // 加入正文内容
                content += `【正文】\n`;
                this.content.forEach(chapter => {
                    if (chapter) {
                        content += '\n\n' + chapter.title + '\n\n';
                        content += chapter.rawText.replace(/\s+/g, '\n\n');
                    }
                });
                return content;
            } else if (this.downloadFormat === 'epub') {
                // EPUB格式 - 返回null，由generateEpub处理
                return null;
            } else { // HTML格式 - 增强为阅读器风格
                // 创建一个精美的HTML电子书阅读界面
                let content = `<!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <title>${this.option.title} - ${this.option.author}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
        :root {
            --bg-color: #FFF0F3;
            --text-color: #333;
            --theme-color: #FF8BA7;
            --link-color: #D46A87;
            --font-size: 18px;
            --font-family: 'Noto Sans SC', sans-serif;
            --line-height: 1.8;
            --letter-spacing: normal;
        }
        * {
            box-sizing: border-box;margin: 0;
            padding: 0;
        }

        body {
            font-family: var(--font-family);
            font-size: var(--font-size);
            background-color: var(--bg-color);
            color: var(--text-color);
            line-height: var(--line-height);
            letter-spacing: var(--letter-spacing);
            overflow: hidden;
            height: 100vh;
        }/* 书本结构 */
        .book-container {
            display: flex;
            height: 100vh;
            width: 100%;
            position: relative;
            overflow: hidden;
        }.book-content {
            flex: 1;
            height: 100%;
            overflow: hidden;
            position: relative;
        }

        /* 页面结构 */
        .page {
            height: 100%;
            width: 100%;
            display: none;
            padding: 40px 60px; /* 更宽松的页面边距 */
            overflow-y: auto;
            position: absolute;
            left: 0;
            top: 0;
            transition: transform 0.5s ease;
            background-color: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            scroll-behavior: smooth; /* 优雅的滚动效果 */
        }
        .page.active {
            display: block;
            z-index: 2;
        }/* 封面页样式 */
        .cover-page {
            text-align: center;
            padding: 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .cover-image {
            max-width: 50%;
            max-height: 60vh;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            margin-bottom: 30px;
            border-radius: 5px;
        }

        .book-title {
            font-size: 2.5em;
            margin-bottom: 10px;
            color: var(--theme-color);
        }

        .book-author {
            font-size: 1.5em;
            margin-bottom: 20px;
            font-weight: normal;
            color: #666;
        }

        .book-tags {
            margin: 20px 0;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
        }

        .book-tag {
            background-color: var(--theme-color);
            color: white;
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 0.9em;
        }

        .book-description {
            max-width: 800px;
            margin: 0 auto;
            text-align: left;
        }

        .book-description p {
            margin-bottom: 10px;
        }

        /* 章节样式优化 */
        .chapter {
            padding-bottom: 30px;
            letter-spacing: var(--letter-spacing);
            line-height: var(--line-height);
        }

        .chapter-content {
            max-width: 800px;
            margin: 0 auto;
        }

        .chapter-title {
            font-weight: 500;
            padding-bottom: 25px;
            margin-bottom: 30px;
            border-bottom: 1px solid rgba(0,0,0,0.1);
            text-align: center;
            color: var(--theme-color);
        }

        .chapter p {
            margin-bottom: 1.2em;
            text-indent: 2em; /* 段落首行缩进 */
        }

        /* 改善段落间距的一致性 */
        .chapter p + p {
            margin-top: 0.5em;
        }

        /* 导航控制 */
        .nav-buttons {
            position: fixed;
            bottom: 20px;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;
            gap: 20px;
            z-index: 100;
            opacity: 0.7;
            transition: opacity 0.3s;
        }

        .nav-buttons:hover {
            opacity: 1;
        }

        .nav-btn {
            background-color: var(--theme-color);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 30px;
            cursor: pointer;
            box-shadow: 0 3px 5px rgba(0,0,0,0.2);
            font-size: 0.9em;
            transition: all 0.2s;
        }

        .nav-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 8px rgba(0,0,0,0.2);
        }

        .nav-btn:active {
            transform: translateY(1px);
            box-shadow: 0 2px 3px rgba(0,0,0,0.2);
        }

        /* 目录按钮和侧边栏 */
        .toc-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 101;
            padding: 10px;
            background-color: var(--theme-color);
            color: white;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        .sidebar {
            position: fixed;
            top: 0;
            right: -300px;
            width: 300px;
            height: 100vh;
            background-color: white;
            box-shadow: -5px 0 10px rgba(0,0,0,0.1);
            overflow-y: auto;
            z-index: 100;
            transition: right 0.3s ease-in-out;
            padding: 20px;
        }

        .sidebar.active {
            right: 0;
        }

        .close-sidebar {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 1.5em;
            cursor: pointer;
            color: #666;
        }

        .toc-title {
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
            text-align: center;
            color: var(--theme-color);
        }

        .toc-item {
            padding: 10px;
            cursor: pointer;
            transition: all 0.2s;
            border-radius: 5px;
        }

        .toc-item:hover {
            background-color: #f5f5f5;
            color: var(--theme-color);
        }

        .toc-item.active {
            background-color: var(--theme-color);
            color: white;
        }

        /* 设置面板 */
        .settings-container {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            max-width: 500px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 5px 25px rgba(0,0,0,0.2);
            padding: 20px;
            z-index: 200;
        }

        .settings-container.active {
            display: block;
        }

        .settings-title {
            margin-bottom: 20px;
            text-align: center;
            color: var(--theme-color);
            font-size: 1.5em;
        }

        .settings-section {
            margin-bottom: 20px;
        }

        .settings-section-title {
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #eee;
            font-size: 1.1em;
            color: #666;
        }

        .color-options, .font-size-options, .font-family-options, .spacing-options {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-bottom: 15px;
        }

        .color-option {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid transparent;
        }

        .color-option.active {
            border-color: var(--theme-color);
        }

        .font-option {
            padding: 5px 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            cursor: pointer;
        }

        .font-option.active {
            background-color: var(--theme-color);
            color: white;
            border-color: var(--theme-color);
        }

        .close-settings {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 1.5em;
            cursor: pointer;
            color: #666;
        }

        .overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            z-index: 199;
        }

        .overlay.active {
            display: block;
        }

        /* 悬浮控制栏 */
        .float-controls {
            position: fixed;
            bottom: 20px;
            left: 20px;
            display: flex;
            gap: 10px;
            z-index: 100;
        }

        .float-btn {
            background-color: var(--theme-color);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 3px 5px rgba(0,0,0,0.2);
            transition: all 0.2s;
        }

        .float-btn:hover {
            transform: scale(1.1);
        }

        /* 适应深色模式的文本调整 */
        @media (prefers-color-scheme: dark) {
            .color-option[data-color="#212121"][data-text="#FFFFFF"] {
                border-color: rgba(255,255,255,0.5);
            }
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
            .page {
                padding: 20px;
            }

            .cover-image {
                max-width: 70%;
            }

            .book-title {
                font-size: 2em;
            }

            .float-controls {
                flex-direction: column;
            }

            .nav-buttons {
                bottom: 10px;
            }

            .nav-btn {
                padding: 8px 15px;
                font-size: 0.8em;
            }
        }
        </style>
        </head>
        <body>
        <div class="book-container">
        <div class="book-content" id="bookContent">
            <!-- 封面页 -->
            <div class="page cover-page active" data-page="cover">
                <img class="cover-image" src="${this.option.cover}" alt="${this.option.title}封面">
                <h1 class="book-title">${this.option.title}</h1>
                <h2 class="book-author">作者：${this.option.author}</h2>
                <div class="book-tags">
                    ${this.option.tags ? this.option.tags.split('·').map(tag => `<span class="book-tag">${tag.trim()}</span>`).join('') : ''}
                </div>
                <div class="book-description">
                    ${this.option.description}
                </div>
            </div>`;

                // 添加章节页面
                this.content.forEach((chapter, index) => {
                    if (chapter) {
                        content += `
            <!-- 章节 ${index + 1} -->
            <div class="page" data-page="${index + 1}">
                <div class="chapter">
                    <h2 class="chapter-title">${chapter.title}</h2>
                    <div class="chapter-content">
                        ${chapter.data}
                    </div>
                </div>
            </div>`;
                    }
                });

                // 添加导航按钮和侧边栏
                content += `
        </div>
        </div>

        <!-- 导航按钮 -->
        <div class="nav-buttons">
        <button class="nav-btn" id="prevBtn">上一页</button>
        <button class="nav-btn" id="nextBtn">下一页</button>
        </div>

        <!-- 目录按钮 -->
        <div class="toc-toggle" id="tocToggle">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        </div>

        <!-- 侧边栏目录 -->
        <div class="sidebar" id="sidebar">
        <button class="close-sidebar" id="closeSidebar">×</button>
        <h3 class="toc-title">目录</h3>
        <div id="tocContainer">
            <div class="toc-item" data-page="cover">封面</div>`;

                // 添加章节目录
                this.content.forEach((chapter, index) => {
                    if (chapter) {
                        content += `
            <div class="toc-item" data-page="${index + 1}">${chapter.title} <span style="float:right; font-size:0.8em; color:#999;">${index + 1}/${this.content.length}</span></div>`;
                    }
                });

                content += `
        </div>
        </div>

        <!-- 悬浮控制栏 -->
        <div class="float-controls">
        <div class="float-btn" id="settingsBtn" title="设置">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
        </div>
        </div>

        <!-- 设置面板 -->
        <div class="overlay" id="overlay"></div>
        <div class="settings-container" id="settingsPanel">
        <button class="close-settings" id="closeSettings">×</button>
        <h3 class="settings-title">阅读设置</h3>

        <div class="settings-section">
            <h4 class="settings-section-title">背景颜色</h4>
            <div class="color-options">
                <div class="color-option active" style="background-color: #FFF0F3;" data-color="#FFF0F3"></div>
                <div class="color-option" style="background-color: #FFFFFF;" data-color="#FFFFFF"></div>
                <div class="color-option" style="background-color: #E8F5E9;" data-color="#E8F5E9"></div>
                <div class="color-option" style="background-color: #FFF8E1;" data-color="#FFF8E1"></div>
                <div class="color-option" style="background-color: #E3F2FD;" data-color="#E3F2FD"></div>
                <div class="color-option" style="background-color: #212121;" data-color="#212121" data-text="#FFFFFF"></div>
            </div>
        </div>

        <div class="settings-section">
            <h4 class="settings-section-title">字体大小</h4>
            <div class="font-size-options">
                <div class="font-option" data-size="14px">小</div>
                <div class="font-option active" data-size="18px">中</div>
                <div class="font-option" data-size="22px">大</div>
                <div class="font-option" data-size="26px">特大</div>
            </div>
        </div>

        <div class="settings-section">
            <h4 class="settings-section-title">行间距</h4>
            <div class="spacing-options">
                <div class="font-option" data-lineheight="1.5">紧凑</div>
                <div class="font-option active" data-lineheight="1.8">适中</div>
                <div class="font-option" data-lineheight="2.2">宽松</div>
                <div class="font-option" data-lineheight="2.6">超宽</div>
            </div>
        </div>

        <div class="settings-section">
            <h4 class="settings-section-title">字间距</h4>
            <div class="spacing-options">
                <div class="font-option active" data-letterspacing="normal">正常</div>
                <div class="font-option" data-letterspacing="0.05em">略宽</div>
                <div class="font-option" data-letterspacing="0.1em">宽松</div>
                <div class="font-option" data-letterspacing="0.15em">超宽</div>
            </div>
        </div>

        <div class="settings-section">
            <h4 class="settings-section-title">字体选择</h4>
            <div class="font-family-options">
                <div class="font-option active" data-font="'Noto Sans SC', sans-serif">黑体</div>
                <div class="font-option" data-font="'Noto Serif SC', serif">宋体</div>
                <div class="font-option" data-font="'LXGW WenKai', cursive">楷体</div>
                <div class="font-option" data-font="'Long Cang', cursive">行书</div></div>
        </div></div><script>
        document.addEventListener('DOMContentLoaded', function() {
            // 页面管理
            let currentPage = 'cover';
            const totalPages = ${this.content.length + 1}; // +1 for cover page

            // 获取元素
            const bookContent = document.getElementById('bookContent');
            const pages = document.querySelectorAll('.page');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const tocToggle = document.getElementById('tocToggle');
            const sidebar = document.getElementById('sidebar');
            const closeSidebar = document.getElementById('closeSidebar');
            const tocContainer = document.getElementById('tocContainer');
            const settingsBtn = document.getElementById('settingsBtn');
            const settingsPanel = document.getElementById('settingsPanel');
            const closeSettings = document.getElementById('closeSettings');
            const overlay = document.getElementById('overlay');

            // 初始化首页
            updatePageButtons();

            // 导航按钮事件
            prevBtn.addEventListener('click', () => {
                navigateToPage(getPreviousPage());
            });

            nextBtn.addEventListener('click', () => {
                navigateToPage(getNextPage());
            });

            // 键盘导航
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    navigateToPage(getPreviousPage());
                } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    navigateToPage(getNextPage());
                }
            });

            // 目录事件
            tocToggle.addEventListener('click', () => {
                sidebar.classList.add('active');
            });

            closeSidebar.addEventListener('click', () => {
                sidebar.classList.remove('active');
            });

            // 目录项点击事件
            document.querySelectorAll('.toc-item').forEach(item => {
                item.addEventListener('click', () => {
                    const page = item.dataset.page;
                    navigateToPage(page);
                    sidebar.classList.remove('active');
                });
            });

            // 设置按钮事件
            settingsBtn.addEventListener('click', () => {
                settingsPanel.classList.add('active');
                overlay.classList.add('active');
            });

            closeSettings.addEventListener('click', () => {
                settingsPanel.classList.remove('active');
                overlay.classList.remove('active');
            });

            overlay.addEventListener('click', () => {
                settingsPanel.classList.remove('active');
                overlay.classList.remove('active');
            });

            // 设置颜色选项
            document.querySelectorAll('.color-option').forEach(option => {
                option.addEventListener('click', () => {
                    const bgColor = option.dataset.color;
                    const textColor = option.dataset.text || '#333';

                    document.documentElement.style.setProperty('--bg-color', bgColor);
                    document.documentElement.style.setProperty('--text-color', textColor);

                    document.querySelectorAll('.color-option').forEach(opt => {
                        opt.classList.remove('active');
                    });
                    option.classList.add('active');
                });
            });

            // 设置字体大小选项
            document.querySelectorAll('.font-size-options .font-option').forEach(option => {
                option.addEventListener('click', () => {
                    const fontSize = option.dataset.size;
                    document.documentElement.style.setProperty('--font-size', fontSize);

                    document.querySelectorAll('.font-size-options .font-option').forEach(opt => {
                        opt.classList.remove('active');
                    });
                    option.classList.add('active');
                });
            });

            // 设置行间距选项
            document.querySelectorAll('.spacing-options .font-option[data-lineheight]').forEach(option => {
                option.addEventListener('click', () => {
                    const lineHeight = option.dataset.lineheight;
                    document.documentElement.style.setProperty('--line-height', lineHeight);

                    document.querySelectorAll('.spacing-options .font-option[data-lineheight]').forEach(opt => {
                        opt.classList.remove('active');
                    });
                    option.classList.add('active');
                });
            });

            // 设置字间距选项
            document.querySelectorAll('.spacing-options .font-option[data-letterspacing]').forEach(option => {
                option.addEventListener('click', () => {
                    const letterSpacing = option.dataset.letterspacing;
                    document.documentElement.style.setProperty('--letter-spacing', letterSpacing);

                    document.querySelectorAll('.spacing-options .font-option[data-letterspacing]').forEach(opt => {
                        opt.classList.remove('active');
                    });
                    option.classList.add('active');
                });
            });

            // 设置字体选项
            document.querySelectorAll('.font-family-options .font-option').forEach(option => {
                option.addEventListener('click', () => {
                    const fontFamily = option.dataset.font;
                    document.documentElement.style.setProperty('--font-family', fontFamily);

                    document.querySelectorAll('.font-family-options .font-option').forEach(opt => {
                        opt.classList.remove('active');
                    });
                    option.classList.add('active');
                });
            });

            // 导航函数
            function navigateToPage(page) {
                if (!page) return;

                // 移除所有页面的活动状态
                pages.forEach(p => p.classList.remove('active'));

                // 设置当前页面的活动状态
                const currentPageElement = document.querySelector('.page[data-page="' + page + '"]');
                if (currentPageElement) {
                    currentPageElement.classList.add('active');
                    currentPage = page;
                    updatePageButtons();

                    // 更新目录中的活动项
                    document.querySelectorAll('.toc-item').forEach(item => {
                        if (item.dataset.page === page) {
                            item.classList.add('active');
                        } else {
                            item.classList.remove('active');
                        }
                    });

                    // 滚动到页面顶部
                    currentPageElement.scrollTop = 0;
                }
            }

            // 获取上一页
            function getPreviousPage() {
                if (currentPage === 'cover') return null;
                return currentPage === 1 ? 'cover' : (parseInt(currentPage) - 1).toString();
            }

            // 获取下一页
            function getNextPage() {
                if (currentPage === 'cover') return '1';
                return parseInt(currentPage) < ${this.content.length} ? (parseInt(currentPage) + 1).toString() : null;
            }

            // 更新导航按钮状态
            function updatePageButtons() {
                prevBtn.disabled = !getPreviousPage();
                if (prevBtn.disabled) {
                    prevBtn.style.opacity = '0.5';
                } else {
                    prevBtn.style.opacity = '1';
                }

                nextBtn.disabled = !getNextPage();
                if (nextBtn.disabled) {
                    nextBtn.style.opacity = '0.5';
                } else {
                    nextBtn.style.opacity = '1';
                }
            }
        });
        </script>
        </body>
        </html>`;

                return content;
            }
        },

        // EPUB生成方法
        async generateEpub(detail, chapterCount, duration) {
            this.log('正在生成EPUB文件...');

            const saveAsFunc = _saveAs;

            try {
                const zip = new _JSZip();
                const bookId = 'po18-' + detail.bid + '-' + Date.now();
                this.log('正在构建EPUB结构...');

            // 1. mimetype文件（必须是第一个文件，不压缩）
            zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

            // 2. META-INF/container.xml
            zip.file('META-INF/container.xml', `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`);

            // 3. OEBPS/content.opf
            let manifest = '';
            let spine = '';

            // 添加封面页
            manifest += '    <item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/>\n';
            spine += '    <itemref idref="cover"/>\n';

            // 添加章节
            this.content.forEach((chapter, index) => {
                if (chapter) {
                    manifest += `    <item id="chapter${index}" href="chapter${index}.xhtml" media-type="application/xhtml+xml"/>\n`;
                    spine += `    <itemref idref="chapter${index}"/>\n`;
                }
            });

            // 添加目录和样式
            manifest += '    <item id="toc" href="toc.xhtml" media-type="application/xhtml+xml" properties="nav"/>\n';
            manifest += '    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>\n';
            manifest += '    <item id="css" href="Styles/main.css" media-type="text/css"/>\n';

            const contentOpf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="bookid">${bookId}</dc:identifier>
    <dc:title>${this.escapeXml(detail.title)}</dc:title>
    <dc:creator>${this.escapeXml(detail.author)}</dc:creator>
    <dc:language>zh-TW</dc:language>
    <dc:publisher>PO18脸红心跳</dc:publisher>
    <meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d+Z$/, 'Z')}</meta>
  </metadata>
  <manifest>
${manifest}  </manifest>
  <spine toc="ncx">
${spine}  </spine>
</package>`;
            zip.file('OEBPS/content.opf', contentOpf);

            // 4. 样式文件 - 完整的main.css
            const mainCss = `/* EPUB主样式表 */
@charset "utf-8";
@import url("fonts.css");

/* ==================== 基础样式 ==================== */
body {
  margin: 0;
  padding: 0;
  text-align: justify;
  font-family: "DK-SONGTI", "Songti SC", "st", "宋体", "SimSun", "STSong", serif;
  color: #333333;
}

p {
  margin-left: 0;
  margin-right: 0;
  line-height: 1.3em;
  text-align: justify;
  text-justify: inter-ideograph;
  text-indent: 2em;
  duokan-text-indent: 2em;
}

div {
  margin: 0;
  padding: 0;
  line-height: 130%;
  text-align: justify;
}

/* ==================== 封面图片 ==================== */
div.top-img-box {
  text-align: center;
  duokan-bleed: lefttopright;
}

img.top-img {
  width: 100%;
}

/* ==================== 分卷标题 ==================== */
h1.part-title {
  width: 1em;
  margin: 10% auto auto auto;
  font-family: "SourceHanSerifSC-Bold";
  font-size: 1.3em;
  text-align: center;
  color: #a80000;
  padding: 0.2em;
  border: 2px solid #a80000;
}

/* ==================== 章节标题 ==================== */
h2.chapter-title {
  margin: 0 12% 2em 12%;
  padding: 0 4px 0 4px;
  line-height: 1.3em;
  font-family: "SourceHanSerifSC-Bold";
  text-align: center;
  font-size: 1em;
  color: #a80000;
}

span.chapter-sequence-number {
  font-family: "FZLanTYKXian";
  font-size: x-small;
  color: #676767;
}

span.sub-heading {
  font-size: small;
}

/* ==================== 简介标题 ==================== */
h2.introduction-title,
h3.introduction-title {
  margin: 2em auto 2em auto;
  font-family: "SourceHanSerifSC-Bold";
  text-align: center;
  font-size: 1em;
  color: #a80000;
  padding: 0;
}

/* ==================== 特殊段落样式 ==================== */
p.kt {
  font-family: "STKaiti";
}

p.text-right {
  text-align: right;
  text-indent: 0em;
  duokan-text-indent: 0em;
}

p.end {
  margin: 2em auto auto auto;
  text-align: center;
  font-family: "FZLanTYKXian";
  font-size: small;
  color: #a80000;
  text-indent: 0em;
  duokan-text-indent: 0em;
}

/* ==================== 设计信息框 ==================== */
div.design-box {
  margin: 20% 2% auto 2%;
  padding: 0.8em;
  border: 2px solid rgba(246, 246, 246, 0.3);
  border-radius: 7px;
  background-color: rgba(246, 246, 246, 0.3);
}

h1.design-title {
  margin: 1em auto 1em auto;
  padding: 0 4px 0 4px;
  font-family: "FZLanTYKXian";
  font-size: 65%;
  color: #808080;
  text-align: center;
}

p.design-content {
  margin-top: 1em;
  font-family: "FZLanTYKXian";
  font-size: 60%;
  color: #808080;
  text-indent: 0em;
  duokan-text-indent: 0em;
}

span.duokanicon {
  font-family: "Asheng";
  color: #EC902E;
}

hr.design-line {
  border-style: dashed;
  border-width: 1px 00 0;
  border-color: rgba(200, 200, 193, 0.15);
}

/* ==================== 书籍简介样式 ==================== */
.book_intro,
.book-intro {
  max-width: 100%;
  margin: 0 auto;
  padding: 1em;
}

.book_intro h3,
.book-intro h3 {
  margin: 0 0 1.5em 0;
  padding-bottom: 0.5em;
  font-family: "SourceHanSerifSC-Bold";
  font-size: 1.2em;
  text-align: center;
  color: #a80000;
  border-bottom: 2px solid #a80000;
}

.B_I_content,
.intro-content {
  line-height: 1.8;
  color: #333333;
  font-size: 1em;
}

.B_I_content p,
.intro-content p {
  margin: 0.8em 0;
  line-height: 1.8;
  text-indent: 2em;
  duokan-text-indent: 2em;
}

/* ==================== 简介特殊段落 ==================== */
.tagline {
  font-style: italic;
  color: #7f8c8d;
  text-align: center;
  margin: 1.5em 0;
  text-indent: 0 !important;
  duokan-text-indent: 0 !important;
}

.meta-info {
  text-align: center;
  font-weight: bold;
  color: #34495e;
  margin: 1em 0;
  text-indent: 0 !important;
  duokan-text-indent: 0 !important;
}

/* ==================== 文字颜色样式 ==================== */
.text-red,
.color-red {
  color: #e74c3c;
}

.text-orange,
.color-orange {
  color: #e67e22;
}

.text-gray,
.color-gray {
  color: #999999;
}

.text-green,
.color-green {
  color: #27ae60;
}

.text-black,
.color-black {
  color: #000000;
}

.color-dark-red {
  color: #c0392b;
}

/* ==================== 文字大小样式 ==================== */
.text-medium,
.font-size-16 {
  font-size: 16px;
}

.text-large,
.font-size-22 {
  font-size: 22px;
}

.text-xlarge,
.font-size-20 {
  font-size: 20px;
}

.font-size-12 {
  font-size: 12px;
}

.font-size-18 {
  font-size: 18px;
}

/* ==================== 警告样式 ==================== */
.warning-primary {
  background: #ffe6e6;
  border-left: 4px solid #e74c3c;
  padding: 0.8em 1em;
  margin: 1em 0;
  font-weight: bold;
  color: #e74c3c;text-indent: 0 !important;
  duokan-text-indent: 0 !important;
}

.warning-highlight {
  background: #fff3cd;
  border: 2px solid #e67e22;
  padding: 1em;
  margin: 1.5em 0;
  font-size: 1.3em;
  font-weight: bold;
  color: #e67e22;
  text-align: center;
  text-indent: 0 !important;
  duokan-text-indent: 0 !important;border-radius: 5px;
}

/* ==================== 内容警告区块 ==================== */
.content-warning {
  background: #fff5f5;
  border: 2px solid #e74c3c;
  border-radius: 6px;
  padding: 1.2em;
  margin: 1.5em 0;
}

.warning-title {
  font-size: 1.2em;
  font-weight: bold;
  color: #e74c3c;
  margin: 0 0 0.8em 0;
  text-indent: 0 !important;
  duokan-text-indent: 0 !important;
}

.warning-action {
  font-weight: bold;
  color: #c0392b;
  text-indent: 0 !important;
  duokan-text-indent: 0 !important;
}

.content-warning p {
  margin: 0.8em 0;
  text-indent: 2em;
  duokan-text-indent: 2em;
}

.content-warning strong {
  color: #e74c3c;font-size: 1.1em;
}

/* ==================== 备注样式 ==================== */
.note {
  color: #7f8c8d;
  font-size: 0.95em;
  text-indent: 0 !important;
  duokan-text-indent: 0 !important;padding-left: 1em;
}

/* ==================== 间距控制 ==================== */
.spacing {
  height: 10px;
  margin: 0;
}

/* ==================== 标签样式 ==================== */
.book_intro_tags,
.book-tags {
  margin-top: 1.5em;
  padding-top: 1em;
  border-top: 1px solid #dddddd;
  display: flex;
  flex-wrap: wrap;

  gap: 0.5em;
}
/* ==================== 标签样式 ==================== */
.tag {
  display: inline-block;
  padding: 0.4em 2em;
  background: #FFB3D9;  /* 🎀 改为粉色 */
  color: #ffffff;
  border-radius: 15px;
  font-size: 0.85em;
  text-decoration: none;
  font-weight: 500;
  text-indent: 0;
  duokan-text-indent: 0;
}

/* Kindle/Mobi 适配 */
@media amzn-kf8, amzn-mobi {
  .tag {
    border: 1px solid #FFB3D9;  /* 边框也改为粉色 */
  }
}

/* 夜间模式 */
@media (prefers-color-scheme: dark) {
  .tag {
    background: #D85A8C;  /* 夜间模式粉色 */
    color: #e0e0e0;
  }
}
/* ==================== 更新信息框 ==================== */
.update-info {
  background: linear-gradient(to right, #fff5f5, #ffffff);
  border-left: 5px solid #c0392b;
  padding: 0.8em 1em;
  margin: 1em 0;
  border-radius: 0 5px 5px 0;
}

.update-info p {
  margin: 0.5em 0;
}

/* ==================== 强调样式 ==================== */
strong {
  font-weight: bold;
}

em {
  font-style: italic;
}

/* ==================== 通用工具类 ==================== */
.text-center {
  text-align: center;
  text-indent: 0 !important;
  duokan-text-indent: 0 !important;
}

.text-left {
  text-align: left;
}

.no-indent {
  text-indent: 0 !important;
  duokan-text-indent: 0 !important;
}

/* ==================== 响应式设计 ==================== */
@media screen and (max-width: 600px) {
  .book_intro,
  .book-intro {
    padding: 0.8em;
  }

  .text-large,
  .font-size-22 {
    font-size: 20px;
  }

  .text-xlarge,
  .font-size-20 {
    font-size: 18px;
  }

  .font-size-18 {
    font-size: 16px;
  }
}

/* ==================== Kindle/Mobi 适配 ==================== */
@media amzn-kf8, amzn-mobi {
  .book_intro,
  .book-intro {
    background: transparent;
  }

  .warning-primary,
  .warning-highlight,
  .content-warning {
    background: transparent;
  }

  .tag {
    border: 1px solid #667eea;
  }
}

/* ==================== 夜间模式支持 ==================== */
@media (prefers-color-scheme: dark) {
  body {
    background: #1a1a1a;
    color: #e0e0e0;
  }

  .book_intro,
  .book-intro {
    background: #2a2a2a;
  }

  .book_intro h3,
  .book-intro h3,
  h2.introduction-title {
    color: #f39c12;
    border-bottom-color: #f39c12;
  }

  .B_I_content,
  .intro-content {
    color: #d0d0d0;
  }

  .warning-primary {
    background: #3d1f1f;
    color: #ff7675;
    border-left-color: #ff7675;
  }

  .warning-highlight {
    background: #3d3520;
    border-color: #f39c12;
    color: #f39c12;
  }

  .content-warning {
    background: #3d1f1f;
    border-color: #ff7675;}

  .warning-title,
  .warning-action {
    color: #ff7675;
  }

  .tag {
    background: #4a5568;
    color: #e0e0e0;
  }
}`;
            zip.file('OEBPS/Styles/main.css', mainCss);

            // 5. 简介页/封面页
            const tagsHtml = detail.tags ? detail.tags.split('·').map(t => `<span class="tag">${this.escapeXml(t.trim())}</span>`).join('') : '';

            // 处理描述，转换为p标签
            let descParagraphs = '';
            if (detail.description) {
                const descText = detail.description.replace(/<\/?p>/gi, '').replace(/<br\s*\/?>/gi, '\n');
                descParagraphs = descText.split(/\n+/).filter(p => p.trim()).map(p => `  <p class="kt">${this.escapeXml(p.trim())}</p>`).join('\n');
            }

            const coverXhtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
    <title>内容简介</title>
    <link href="Styles/main.css" type="text/css" rel="stylesheet"/>
</head>
<body>

  <h2 class="introduction-title">内容简介</h2>
  <div class="book-tags">${tagsHtml}</div>
  <p class="kt">书名：${this.escapeXml(detail.title)}</p>
  <p class="kt">作者：${this.escapeXml(detail.author)}</p>
${descParagraphs}

  <div class="design-box">
    <p class="design-content">本书采用PO18小说下载器自动生成，仅供个人学习之用。</p>
    <hr class="design-line"/>
  </div>
</body>
</html>`;
            zip.file('OEBPS/cover.xhtml', coverXhtml);

            // 6. 章节文件
            this.content.forEach((chapter, index) => {
                if (chapter) {
                    // 解析章节标题，分离序号和名称
                    const titleMatch = chapter.title.match(/^(第[\u4e00-\u9fa5\d]+章)\s*(.*)$/);
                    let seqNum = '';
                    let chapterName = chapter.title;
                    if (titleMatch) {
                        seqNum = titleMatch[1];
                        chapterName = titleMatch[2] || '';
                    }

                    // 处理正文内容，转换为p标签
                    let contentHtml = '';
                    const rawContent = chapter.data || chapter.rawText || '';
                    const textContent = rawContent
                        .replace(/<br\s*\/?>/gi, '\n')
                        .replace(/<\/p>\s*<p>/gi, '\n')
                        .replace(/<\/?p>/gi, '')
                        .replace(/&nbsp;/g, ' ');

                    contentHtml = textContent.split(/\n+/).filter(p => p.trim()).map(p => `  <p>${p.trim()}</p>`).join('\n');

                    const chapterXhtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
    <title>${this.escapeXml(chapter.title)}</title>
    <link href="Styles/main.css" type="text/css" rel="stylesheet"/>
</head>
<body>
  <h2 class="chapter-title" title="${this.escapeXml(chapter.title)}">${seqNum ? `<span class="chapter-sequence-number">${this.escapeXml(seqNum)}</span><br/>` : ''}${this.escapeXml(chapterName || chapter.title)}</h2>
${contentHtml}
</body>
</html>`;
                    zip.file(`OEBPS/chapter${index}.xhtml`, chapterXhtml);
                }
            });

            // 7. 目录文件 toc.xhtml (EPUB3 nav)
            let tocItems = '      <li><a href="cover.xhtml">内容简介</a></li>\n';
            this.content.forEach((chapter, index) => {
                if (chapter) {
                    tocItems += `      <li><a href="chapter${index}.xhtml">${this.escapeXml(chapter.title)}</a></li>\n`;
                }
            });

            const tocXhtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
    <title>目录</title>
    <link href="Styles/main.css" type="text/css" rel="stylesheet"/>
</head>
<body>
  <nav epub:type="toc">
    <h2 class="toc-title">目录</h2>
    <ol>
${tocItems}    </ol>
  </nav>
</body>
</html>`;
            zip.file('OEBPS/toc.xhtml', tocXhtml);

            // 8. NCX文件 (EPUB2兼容)
            let ncxNavPoints = `    <navPoint id="cover" playOrder="1">
      <navLabel><text>内容简介</text></navLabel>
      <content src="cover.xhtml"/>
    </navPoint>\n`;
            let playOrder = 2;
            this.content.forEach((chapter, index) => {
                if (chapter) {
                    ncxNavPoints += `    <navPoint id="chapter${index}" playOrder="${playOrder++}">
      <navLabel><text>${this.escapeXml(chapter.title)}</text></navLabel>
      <content src="chapter${index}.xhtml"/>
    </navPoint>\n`;
                }
            });

            const ncx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="${bookId}"/>
  </head>
  <docTitle><text>${this.escapeXml(detail.title)}</text></docTitle>
  <navMap>
${ncxNavPoints}  </navMap>
</ncx>`;
            zip.file('OEBPS/toc.ncx', ncx);

            // 生成并下载
            this.log('正在压缩EPUB文件...');
            const self = this;

            try {
                const zipPromise = zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' });

                zipPromise.then(function(blob) {
                    self.log('EPUB压缩完成，大小: ' + self.formatFileSize(blob.size));
                    const fileName = detail.title.replace(/[\\/:*?"<>|]/g, '_') + '.epub';

                    // 使用saveAs或备用方法下载
                    if (saveAsFunc) {
                        saveAsFunc(blob, fileName);
                        self.log('正在触发下载...');
                    } else {
                        // 备用下载方法
                        self.log('使用备用下载方法...');
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = fileName;
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(function() {
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        }, 100);
                    }

                    // WebDAV上传
                    if (self.webdavConfig.enabled) {
                        self.uploadToWebDAV(blob, fileName).then(function(uploaded) {
                            if (uploaded) {
                                self.log('EPUB已上传到WebDAV!');
                            }
                        });
                    }

                    const fileSizeText = self.formatFileSize(blob.size);

                    // 记录下载信息
                    const record = {
                        title: detail.title,
                        author: detail.author,
                        format: 'epub',
                        size: fileSizeText,
                        time: new Date().toLocaleString(),
                        duration: duration.toFixed(2),
                        chapterCount: chapterCount,
                        cover: detail.cover,
                        tags: detail.tags
                    };

                    self.downloadRecords.unshift(record);
                    if (self.downloadRecords.length > 50) self.downloadRecords.pop();
                    GM_setValue('downloadRecords', self.downloadRecords);

                    self.log('EPUB下载完成! 文件名: ' + fileName + ', 大小: ' + fileSizeText);
                }).catch(function(e) {
                    self.log('生成EPUB失败: ' + (e.message || '未知错误'));
                    console.error('EPUB生成错误:', e);
                });
            } catch (syncErr) {
                this.log('压缩调用失败: ' + (syncErr.message || '未知错误'));
                console.error('压缩同步错误:', syncErr);
            }
            } catch (err) {
                this.log(`EPUB生成过程出错: ${err.message || '未知错误'}`);
            }
        },

        // XML转义
        escapeXml(str) {
            if (!str) return '';
            return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
        },

        getByteSize(string) {
            return new Blob([string]).size;
        },

        formatFileSize(bytes) {
            if (bytes < 1024) {
                return bytes + ' B';
            } else if (bytes < 1024 * 1024) {
                return (bytes / 1024).toFixed(2) + ' KB';
            } else {
                return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
            }
        },

        renderDownloadRecords() {
            const container = document.getElementById('po18-records-container');

            if (!container) {
                return;
            }

            if (this.downloadRecords.length === 0) {
                container.innerHTML = '<div class="po18-card">暂无下载记录</div>';
                return;
            }

            let html = '';

            this.downloadRecords.forEach((record) => {
                // 添加封面显示
                const coverHtml = record.cover ?
                    `<img src="${record.cover}" alt="${record.title}封面" style="width: 60px; height: 80px; object-fit: cover; border-radius: 4px; margin-right: 10px;">` : '';

                // 添加标签显示
                let tagsHtml = '';
                if (record.tags) {
                    const tagsList = record.tags.split('·');
                    tagsHtml = '<div style="margin-top: 5px;">';
                    tagsList.forEach(tag => {
                        if (tag.trim()) {
                            tagsHtml += `<span class="po18-book-tag">${tag.trim()}</span> `;
                        }
                    });
                    tagsHtml += '</div>';
                }

                html += `
                <div class="po18-record-item">
                    <div style="display: flex;">
                        ${coverHtml}
                        <div style="flex: 1;">
                            <h4>${record.title || "未知标题"}</h4>
                            <div class="po18-record-info">
                                <span>作者: ${record.author || "未知作者"}</span>
                                <span>格式: ${record.format ? record.format.toUpperCase() : "未知格式"}</span>
                            </div>
                            <div class="po18-record-info">
                                <span>大小: ${record.size || "未知大小"}</span>
                                <span>章节数: ${record.chapterCount || "未知"}</span>
                            </div>
                            <div class="po18-record-info">
                                <span>时间: ${record.time || "未知时间"}</span>
                                <span>耗时: ${record.duration || "0"}秒</span>
                            </div>
                            ${tagsHtml}
                        </div>
                    </div>
                </div>`;
            });

            container.innerHTML = html;
        }
    };

    // 初始化下载器
    Po18Downloader.init();
})();