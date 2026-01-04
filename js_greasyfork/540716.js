// ==UserScript==
// @name         NodeImage图片上传助手
// @namespace    https://api.nodeimage.com/
// @version      2.2.3
// @description  NodeSeek编辑器图片上传助手，管理面板，基于官方脚本更改。
// @author       shuai&yuyan
// @match        *://www.nodeseek.com/*
// @match        *://nodeimage.com/*
// @match        *://*.nodeimage.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @connect      nodeimage.com
// @connect      api.nodeimage.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540716/NodeImage%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/540716/NodeImage%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(() => {
    'use strict';

    /**
     * 全局配置与状态
     */
    const APP = {
        apiKey: GM_getValue('nodeimage_apiKey', ''),
        config: {
            siteUrl: 'https://www.nodeimage.com',
            retryMax: 2,
            retryDelay: 1000,
            statusTimeout: 2000,
            imagesPerPage: 10,
            maxFileSize: 30 * 1024 * 1024 // 10MB
        },
        apiEndpoints: {
            upload: 'https://api.nodeimage.com/api/upload',
            apiKey: 'https://api.nodeimage.com/api/user/api-key',
            delete: 'https://api.nodeimage.com/api/v1/delete/{image_id}',
            list: 'https://api.nodeimage.com/api/v1/list'
        }
    };

    /**
     * 本地存储辅助模块
     */
    const Storage = {
        keys: {
            loginStatus: 'nodeimage_loginStatus',
            logout: 'nodeimage_logout',
            loginCheck: 'nodeimage_loginCheck'
        },
        get(key) {
            return localStorage.getItem(key);
        },
        set(key, value) {
            localStorage.setItem(key, value);
        },
        remove(key) {
            localStorage.removeItem(key);
        }
    };

    /**
     * 状态常量及消息定义
     */
    const STATUS = {
        SUCCESS: { class: 'success', color: '#42d392' },
        ERROR: { class: 'error', color: '#f56c6c' },
        WARNING: { class: 'warning', color: '#e6a23c' },
        INFO: { class: 'info', color: '#0078ff' }
    };

    const MESSAGE = {
        READY: 'NodeImage已就绪',
        UPLOADING: '正在上传...',
        UPLOAD_SUCCESS: '上传成功！',
        LOGIN_EXPIRED: '登录已失效',
        LOGOUT: '已退出登录',
        RETRY: (c, m) => `重试上传 (${c}/${m})`,
        COMPRESSING: '正在压缩图片...',
        ACTION_SUCCESS: a => `${a}成功！`,
        ACTION_FAIL: a => `${a}失败！`
    };

    /**
     * 工具函数模块
     */
    const Utils = {
        isNodeImageSite() {
            return /^(.*\.)?nodeimage\.com$/.test(window.location.hostname);
        },
        waitForElement(selector) {
            return new Promise(res => {
                const el = document.querySelector(selector);
                if (el) return res(el);
                const observer = new MutationObserver((_, obs) => {
                    const found = document.querySelector(selector);
                    if (found) {
                        obs.disconnect();
                        res(found);
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
            });
        },
        isEditingInEditor() {
            const active = document.activeElement;
            return active && (active.classList.contains('CodeMirror') || active.closest('.CodeMirror') || active.tagName === 'TEXTAREA');
        },
        createFileInput(callback) {
            const input = Object.assign(document.createElement('input'), { type: 'file', multiple: true, accept: 'image/*' });
            input.onchange = e => callback([...e.target.files]);
            input.click();
        },
        delay(ms) {
            return new Promise(res => setTimeout(res, ms));
        },
        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },
        compressImagePreserveFormat(file, mime) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = e => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0);
                        canvas.toBlob(blob => {
                            if (blob) {
                                const compressedFile = new File([blob], file.name, { type: mime });
                                resolve(compressedFile);
                            } else {
                                reject(new Error('图片压缩失败'));
                            }
                        }, mime, 0.85);
                    };
                    img.onerror = () => reject(new Error('图片加载失败'));
                    img.src = e.target.result;
                };
                reader.onerror = () => reject(new Error('文件读取失败'));
                reader.readAsDataURL(file);
            });
        },
        showPanelMessage(text, duration = 2500) {
            let msgEl = document.getElementById('panel-message');
            if (!msgEl) {
                msgEl = document.createElement('div');
                msgEl.id = 'panel-message';
                const panel = document.getElementById('nodeimage-panel');
                if (panel) panel.appendChild(msgEl);
                else document.body.appendChild(msgEl);
            }
            msgEl.textContent = text;
            msgEl.classList.add('show');
            clearTimeout(msgEl._timeout);
            msgEl._timeout = setTimeout(() => {
                msgEl.classList.remove('show');
            }, duration);
        }
    };

    /**
     * 文件类型检测模块
     */
    const FileTypeDetector = {
        magicNumbers: {
            jpg: [0xFF, 0xD8, 0xFF],
            png: [0x89, 0x50, 0x4E, 0x47],
            gif: [0x47, 0x49, 0x46, 0x38],
            bmp: [0x42, 0x4D],
            webp: [0x52, 0x49, 0x46, 0x46]
        },
        async detectFileType(file) {
            const header = await file.slice(0, 12).arrayBuffer();
            const bytes = new Uint8Array(header);
            for (const [type, magic] of Object.entries(this.magicNumbers)) {
                let match = true;
                for (let i = 0; i < magic.length; i++) {
                    if (bytes[i] !== magic[i]) {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    if (type === 'webp') {
                        const riff = String.fromCharCode(...bytes.slice(0, 4));
                        const webp = String.fromCharCode(...bytes.slice(8, 12));
                        if (riff === 'RIFF' && webp === 'WEBP') return 'webp';
                        else continue;
                    }
                    return type;
                }
            }
            return null;
        }
    };

    /**
     * API 请求模块
     */
    const API = {
        request({ url, method = 'GET', data = null, headers = {}, withAuth = false }) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method,
                    url,
                    headers: {
                        Accept: 'application/json',
                        ...(withAuth && APP.apiKey ? { 'X-API-Key': APP.apiKey } : {}),
                        ...headers
                    },
                    data,
                    withCredentials: true,
                    responseType: 'json',
                    onload: response => {
                        if (response.status === 200 && response.response) resolve(response.response);
                        else reject(response);
                    },
                    onerror: reject
                });
            });
        },
        async checkLoginAndGetKey() {
            try {
                const response = await this.request({ url: APP.apiEndpoints.apiKey });
                if (response.api_key) {
                    APP.apiKey = response.api_key;
                    UI.updateState();
                    return true;
                }
                if (response.error) {
                    APP.apiKey = '';
                    UI.updateState();
                }
                return false;
            } catch {
                APP.apiKey = '';
                UI.updateState();
                return false;
            }
        },
        async getAllImages() {
            try {
                const response = await this.request({ url: APP.apiEndpoints.list, method: 'GET', withAuth: true });
                if (response.success && Array.isArray(response.images)) return response.images;
                if (response.error) UI.setStatus(STATUS.ERROR.class, response.error, APP.config.statusTimeout);
                return [];
            } catch (error) {
                UI.setStatus(STATUS.ERROR.class, error.message || '获取图片列表失败', APP.config.statusTimeout);
                return [];
            }
        },
        async deleteImage(imageId) {
            try {
                const url = APP.apiEndpoints.delete.replace('{image_id}', encodeURIComponent(imageId));
                const response = await this.request({ url, method: 'DELETE', withAuth: true });
                if (response.success) return true;
                if (response.error) throw new Error(response.error);
                return false;
            } catch (error) {
                throw error;
            }
        },
        /**
         * 上传单个图片文件，包含自动重试逻辑。
         * @param {File} file - 要上传的文件对象。
         * @param {number} [retries=0] - 当前重试次数。
         * @returns {Promise<{url: string, markdown: string, image_id: string, filename: string, size: number, links: object}>}
         */
        async uploadImage(file, retries = 0) {
            try {
                const detectedType = await FileTypeDetector.detectFileType(file);
                if (!detectedType) throw new Error('无法识别的图片格式');
                const typeMap = {
                    jpg: 'image/jpeg',
                    png: 'image/png',
                    gif: 'image/gif',
                    bmp: 'image/bmp',
                    webp: 'image/webp'
                };
                const ext = detectedType;
                const mime = typeMap[detectedType];
                const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
                const currentExt = file.name.split('.').pop().toLowerCase();
                if (currentExt !== ext || file.type !== mime) {
                    file = new File([file], `${nameWithoutExt}.${ext}`, { type: mime });
                }
                let uploadFile = file;
                if (file.size > APP.config.maxFileSize) {
                    UI.setStatus(STATUS.INFO.class, MESSAGE.COMPRESSING);
                    uploadFile = await Utils.compressImagePreserveFormat(file, mime);
                } else {
                    UI.setStatus(STATUS.INFO.class, MESSAGE.UPLOADING);
                }
                const formData = new FormData();
                formData.append('image', uploadFile);
                const result = await this.request({ url: APP.apiEndpoints.upload, method: 'POST', data: formData, withAuth: true });
                if (result.success)
                    return {
                        url: result.links.direct,
                        markdown: result.links.markdown,
                        image_id: result.image_id,
                        filename: result.filename,
                        size: result.size,
                        links: result.links
                    };
                else {
                    const errorMsg = result.error || '未知错误';
                    if (errorMsg.toLowerCase().match(/unauthorized|invalid api key|未授权|无效的api密钥/)) {
                        APP.apiKey = '';
                        UI.updateState();
                        throw new Error(MESSAGE.LOGIN_EXPIRED);
                    }
                    throw new Error(errorMsg);
                }
            } catch (error) {
                if (error.status === 401 || error.status === 403) {
                    APP.apiKey = '';
                    UI.updateState();
                    throw new Error(MESSAGE.LOGIN_EXPIRED);
                }
                if (retries < APP.config.retryMax) {
                    UI.setStatus(STATUS.WARNING.class, MESSAGE.RETRY(retries + 1, APP.config.retryMax));
                    await Utils.delay(APP.config.retryDelay);
                    return this.uploadImage(file, retries + 1);
                }
                throw error instanceof Error ? error : new Error(String(error));
            }
        }
    };

    /**
     * UI操作模块
     */
    const UI = {
        statusElements: new Set(),
        loginButtons: new Set(),
        currentPage: 1,
        totalPages: 1,
        images: [],
        selectedImages: new Set(),
        /**
         * 更新状态显示
         * @param {string} cls
         * @param {string} msg
         * @param {number} [duration]
         */
        setStatus(cls, msg, duration) {
            this.statusElements.forEach(el => {
                el.className = cls;
                el.textContent = msg;
            });
            if (duration) {
                setTimeout(() => this.updateState(), duration);
            }
            Utils.showPanelMessage(msg, duration);
        },
        /**
         * 根据登录状态更新UI
         */
        updateState() {
            const isLoggedIn = Boolean(APP.apiKey);
            this.loginButtons.forEach(btn => {
                btn.style.display = isLoggedIn ? 'none' : 'inline-block';
            });
            const manageBtn = document.getElementById('nodeimage-manage-btn');
            if (manageBtn) manageBtn.style.display = isLoggedIn ? 'inline-block' : 'none';
            this.statusElements.forEach(el => {
                if (isLoggedIn) {
                    el.className = STATUS.SUCCESS.class;
                    el.textContent = MESSAGE.READY;
                } else el.textContent = '';
            });
        },
        /**
         * 打开登录页面
         */
        openLogin() {
            Storage.set(Storage.keys.loginStatus, 'login_pending');
            window.open(APP.config.siteUrl, '_blank');
        },
        /**
         * 设置工具栏，绑定按钮事件
         * @param {Element} toolbar
         */
        setupToolbar(toolbar) {
            if (!toolbar || toolbar.querySelector('#nodeimage-toolbar-container')) return;
            const container = document.createElement('div');
            container.id = 'nodeimage-toolbar-container';
            container.className = 'nodeimage-toolbar-container';
            toolbar.appendChild(container);
            const imgBtn = toolbar.querySelector('.toolbar-item.i-icon.i-icon-pic[title="图片"]');
            if (imgBtn) {
                const newBtn = imgBtn.cloneNode(true);
                imgBtn.parentNode.replaceChild(newBtn, imgBtn);
                newBtn.addEventListener('click', async () => {
                    if (!APP.apiKey || !(await Auth.checkLoginIfNeeded())) {
                        UI.openLogin();
                        return;
                    }
                    Utils.createFileInput(ImageHandler.handleFiles);
                });
            }
            const statusEl = document.createElement('div');
            statusEl.id = 'nodeimage-status';
            statusEl.className = STATUS.INFO.class;
            container.appendChild(statusEl);
            this.statusElements.add(statusEl);
            const loginBtn = document.createElement('div');
            loginBtn.className = 'nodeimage-login-btn';
            loginBtn.textContent = '点击登录NodeImage';
            loginBtn.addEventListener('click', UI.openLogin);
            loginBtn.style.display = 'none';
            container.appendChild(loginBtn);
            this.loginButtons.add(loginBtn);
            const manageBtn = document.createElement('div');
            manageBtn.id = 'nodeimage-manage-btn';
            manageBtn.className = 'mdui-btn';
            manageBtn.textContent = '打开管理面板';
            manageBtn.addEventListener('click', UI.openPanel.bind(UI));
            manageBtn.style.display = 'none';
            container.appendChild(manageBtn);
            this.updateState();
        },
        /**
         * 打开管理面板
         */
        openPanel: async function () {
            if (!document.getElementById('nodeimage-panel')) UI.createPanel();
            document.getElementById('nodeimage-panel').classList.add('show');
            document.querySelector('.panel-overlay').classList.add('show');
            await UI.loadImages();
        },
        /**
         * 关闭管理面板
         */
        closePanel() {
            const panel = document.getElementById('nodeimage-panel');
            if (panel) panel.classList.remove('show');
            const overlay = document.querySelector('.panel-overlay');
            if (overlay) overlay.classList.remove('show');
            this.selectedImages.clear();
            const selectAllBtn = document.getElementById('select-all-btn');
            if (selectAllBtn) selectAllBtn.textContent = '全选';
        },
        /**
         * 创建管理面板DOM及事件绑定
         */
        createPanel() {
            const overlay = document.createElement('div');
            overlay.className = 'panel-overlay';
            overlay.addEventListener('click', UI.closePanel);
            document.body.appendChild(overlay);
            const panel = document.createElement('div');
            panel.id = 'nodeimage-panel';
            panel.innerHTML = `
          <div class="panel-header">
            <div class="panel-title">NodeImage 图片管理</div>
            <div class="panel-close" title="关闭">&times;</div>
          </div>
          <div id="panel-message"></div>
          <div class="panel-toolbar">
            <button class="mdui-btn mdui-btn-primary" id="upload-btn">上传图片</button>
            <button class="mdui-btn mdui-btn-primary" id="select-all-btn">全选</button>
            <button class="mdui-btn mdui-btn-danger" id="delete-selected-btn" disabled>批量删除</button>
            <div class="copy-dropdown" style="position: relative;">
              <button class="mdui-btn mdui-btn-success" id="copy-selected-btn" disabled>批量复制链接</button>
              <button class="mdui-btn mdui-btn-primary" id="refresh-list-btn">刷新图片列表</button>
              <div class="dropdown-content" id="copy-format-dropdown" style="position: absolute; top: 100%; left: 0; background: white; border: 1px solid #ddd; border-radius: 4px; display: none; z-index: 10000;">
                <div class="dropdown-item" data-format="direct" style="padding: 8px 12px; cursor: pointer;">直接链接</div>
                <div class="dropdown-item" data-format="markdown" style="padding: 8px 12px; cursor: pointer;">Markdown</div>
                <div class="dropdown-item" data-format="html" style="padding: 8px 12px; cursor: pointer;">HTML</div>
                <div class="dropdown-item" data-format="bbcode" style="padding: 8px 12px; cursor: pointer;">BBCode</div>
              </div>
            </div>
          </div>
          <div class="images-grid" id="images-grid"></div>
          <div class="pagination" id="pagination"></div>
        `;
            document.body.appendChild(panel);
            panel.querySelector('.panel-close').addEventListener('click', UI.closePanel);

            document.getElementById('upload-btn').addEventListener('click', () => {
                Utils.createFileInput(async files => {
                    if (!files.length) return;

                    const concurrency = 2; // 并发数
                    let index = 0;
                    let activeCount = 0;

                    return new Promise((resolve) => {
                        const next = () => {
                            if (index >= files.length && activeCount === 0) {
                                resolve();
                                return;
                            }
                            while (activeCount < concurrency && index < files.length) {
                                const file = files[index++];
                                activeCount++;
                                UI.setStatus(STATUS.INFO.class, MESSAGE.UPLOADING);
                                API.uploadImage(file).then(() => {
                                    UI.setStatus(STATUS.SUCCESS.class, MESSAGE.UPLOAD_SUCCESS, APP.config.statusTimeout);
                                    UI.loadImages(); // 上传成功后刷新图片列表
                                }).catch(() => {
                                    UI.setStatus(STATUS.ERROR.class, MESSAGE.ACTION_FAIL('上传'), APP.config.statusTimeout);
                                }).finally(() => {
                                    activeCount--;
                                    next();
                                });
                            }
                        };
                        next();
                    });
                });
            });


            const selectAllBtn = document.getElementById('select-all-btn');
            selectAllBtn.addEventListener('click', () => {
                const start = (UI.currentPage - 1) * APP.config.imagesPerPage;
                const end = start + APP.config.imagesPerPage;
                const pageImages = UI.images.slice(start, end);

                const allSelected = pageImages.every(img => UI.selectedImages.has(img.image_id));
                if (allSelected) {
                    // 取消选择当前页所有图片
                    pageImages.forEach(img => UI.selectedImages.delete(img.image_id));
                    selectAllBtn.textContent = '全选';
                } else {
                    // 选择当前页所有图片
                    pageImages.forEach(img => UI.selectedImages.add(img.image_id));
                    selectAllBtn.textContent = '取消全选';
                }

                // 更新checkbox状态
                document.querySelectorAll('.image-select-checkbox').forEach(cb => {
                    const id = cb.getAttribute('data-id');
                    cb.checked = UI.selectedImages.has(id);
                });

                UI.updateBatchButtons();
            });


            document.getElementById('delete-selected-btn').addEventListener('click', async () => {
                const total = UI.selectedImages.size;
                if (total === 0) return;
                if (!confirm(`确定删除选中的 ${total} 张图片吗？`)) return;

                const concurrency = 2; // 并发数限制
                const ids = Array.from(UI.selectedImages);
                let successCount = 0;
                let failCount = 0;
                let currentIndex = 0;
                let activeCount = 0;

                return new Promise((resolve) => {
                    const next = () => {
                        if (currentIndex >= total && activeCount === 0) {
                            // 所有任务完成
                            Utils.showPanelMessage(`删除完成，成功${successCount}张，失败${failCount}张`, 4000);
                            UI.loadImages();
                            resolve();
                            return;
                        }
                        while (activeCount < concurrency && currentIndex < total) {
                            const id = ids[currentIndex++];
                            activeCount++;
                            UI.setStatus(STATUS.INFO.class, `正在删除第 ${currentIndex} 张图片...`);
                            API.deleteImage(id).then(() => {
                                successCount++;
                                Utils.showPanelMessage(`第 ${currentIndex} 张图片删除成功`);
                            }).catch(() => {
                                failCount++;
                                Utils.showPanelMessage(`第 ${currentIndex} 张图片删除失败`);
                            }).finally(() => {
                                activeCount--;
                                next();
                            });
                        }
                    };
                    next();
                });
            });

            document.getElementById('copy-selected-btn').addEventListener('click', e => {
                e.stopPropagation();
                const dropdown = document.getElementById('copy-format-dropdown');
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            });

            document.getElementById('copy-format-dropdown').addEventListener('click', e => {
                if (!e.target.classList.contains('dropdown-item')) return;
                const format = e.target.getAttribute('data-format');
                UI.copySelectedUrls(format);
                document.getElementById('copy-format-dropdown').style.display = 'none';
            });

            document.addEventListener('click', e => {
                if (!e.target.closest('.copy-dropdown')) {
                    document.getElementById('copy-format-dropdown').style.display = 'none';
                }
            });

            document.getElementById('refresh-list-btn').addEventListener('click', async () => {
                await UI.loadImages();
                Utils.showPanelMessage('图片列表已刷新');
            });
        },
        /**
         * 加载图片列表并渲染
         */
        async loadImages() {
            const grid = document.getElementById('images-grid');
            const pagination = document.getElementById('pagination');
            grid.innerHTML = '<div style="padding:40px; text-align:center;">加载中...</div>';

            this.images = await API.getAllImages();

            this.totalPages = Math.ceil(this.images.length / APP.config.imagesPerPage) || 1;
            this.currentPage = 1;
            this.selectedImages.clear();

            const selectAllBtn = document.getElementById('select-all-btn');
            if (selectAllBtn) selectAllBtn.textContent = '全选';

            this.renderImages();
            this.renderPagination();
            this.updateBatchButtons();
        },
        /**
         * 根据高清图链接生成缩略图链接
         * @param {string} directUrl 高清图URL
         * @returns {string} 缩略图URL
         */
        getThumbnailUrl(directUrl) {
            // 替换路径中的 /i/ 为 /thumb/
            let thumbUrl = directUrl.replace('/i/', '/thumb/');
            // 替换文件名后缀，去掉原扩展名，拼接缩略图后缀
            thumbUrl = thumbUrl.replace(/\/([^\/]+)\.\w+$/, '/$1_thumb_medium.webp');
            return thumbUrl;
        },

        /**
         * 渲染当前页图片
         */
        renderImages() {
            const grid = document.getElementById('images-grid');
            grid.innerHTML = '';
            if (this.images.length === 0) {
                grid.innerHTML = '<div style="padding:40px; text-align:center; color:#999;">暂无图片</div>';
                return;
            }
            const start = (UI.currentPage - 1) * APP.config.imagesPerPage;
            const end = start + APP.config.imagesPerPage;
            const pageImages = UI.images.slice(start, end);

            const selectAllBtn = document.getElementById('select-all-btn');
            if (selectAllBtn) {
                const allSelected = pageImages.every(img => UI.selectedImages.has(img.image_id));
                selectAllBtn.textContent = allSelected ? '取消全选' : '全选';
            }

            pageImages.forEach(img => {
                const thumbUrl = UI.getThumbnailUrl(img.links.direct);


                const card = document.createElement('div');
                card.className = 'image-card';
                card.innerHTML = `
                        <img
                            class="image-preview"
                            src="${thumbUrl}"
                            alt="${img.filename}"
                            title="点击插入编辑器"
                            loading="eager"
                            decoding="async"
                            style="cursor:pointer; max-width: 215px; height: 140px; background-color: #f0f0f0;"
                            onerror="if(!this.src.includes('${img.links.direct}')) {this.src='${img.links.direct}'; this.onerror=null;}"
                        >
                        <div class="image-info">
                            <div class="image-filename" title="${img.filename}">${img.filename}</div>
                            <div class="image-size">${Utils.formatFileSize(img.size)}</div>
                        </div>
                    <div class="image-actions">
                    <input type="checkbox" class="image-select-checkbox" data-id="${img.image_id}" title="选择图片" style="cursor:pointer; margin-right:8px;">
                    <button class="insert-btn" title="插入编辑器">插入</button>
                    <div class="copy-dropdown-single-container" style="position:relative; display:inline-block;">
                        <button class="copy-btn" title="复制链接">复制▼</button>
                        <div class="copy-dropdown-single">
                        <div data-format="direct">直接链接</div>
                        <div data-format="markdown">Markdown</div>
                        <div data-format="html">HTML</div>
                        <div data-format="bbcode">BBCode</div>
                        </div>
                    </div>
                    <button class="delete-btn" title="删除图片" style="color:#d32f2f;">删除</button>
                    </div>
                `;
                // 绑定图片点击事件，插入Markdown到编辑器
                card.querySelector('.image-preview').addEventListener('click', () => {
                    UI.insertImageMarkdown(img.links.markdown);
                });
                // 绑定插入按钮事件
                card.querySelector('.insert-btn').addEventListener('click', () => {
                    UI.insertImageMarkdown(img.links.markdown);
                });

                // 绑定复选框事件
                const checkbox = card.querySelector('.image-select-checkbox');
                checkbox.checked = UI.selectedImages.has(img.image_id);
                checkbox.addEventListener('change', e => {
                    if (e.target.checked) UI.selectedImages.add(img.image_id);
                    else UI.selectedImages.delete(img.image_id);
                    UI.updateBatchButtons();

                    const selectAllBtn = document.getElementById('select-all-btn');
                    const allSelected = UI.selectedImages.size === UI.images.length && UI.images.length > 0;
                    if (selectAllBtn) selectAllBtn.textContent = allSelected ? '取消全选' : '全选';
                });

                // 绑定复制按钮及下拉菜单事件
                const copyBtn = card.querySelector('.copy-btn');
                const copyDropdown = card.querySelector('.copy-dropdown-single');
                copyBtn.addEventListener('click', e => {
                    e.stopPropagation();
                    document.querySelectorAll('.copy-dropdown-single').forEach(dd => {
                        if (dd !== copyDropdown) dd.classList.remove('show');
                    });
                    copyDropdown.classList.toggle('show');
                });
                copyDropdown.addEventListener('click', e => {
                    if (!e.target.dataset.format) return;
                    UI.copySingleUrl(img, e.target.dataset.format);
                    copyDropdown.classList.remove('show');
                });
                document.addEventListener('click', () => {
                    copyDropdown.classList.remove('show');
                });

                // 绑定删除按钮事件
                card.querySelector('.delete-btn').addEventListener('click', async () => {
                    if (!confirm('确认删除这张图片？')) return;
                    try {
                        await API.deleteImage(img.image_id);
                        Utils.showPanelMessage(MESSAGE.ACTION_SUCCESS('删除'));
                        await UI.loadImages();
                    } catch {
                        Utils.showPanelMessage(MESSAGE.ACTION_FAIL('删除'));
                    }
                });

                grid.appendChild(card);
            });
        },




        /**
         * 渲染分页控件
         */
        renderPagination() {
            const pagination = document.getElementById('pagination');
            pagination.innerHTML = '';
            if (this.totalPages <= 1) return;

            const prevBtn = document.createElement('button');
            prevBtn.className = 'page-btn';
            prevBtn.textContent = '上一页';
            prevBtn.disabled = this.currentPage === 1;
            prevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.selectedImages.clear();
                    const selectAllBtn = document.getElementById('select-all-btn');
                    if (selectAllBtn) selectAllBtn.textContent = '全选';
                    this.renderImages();
                    this.renderPagination();
                    this.updateBatchButtons();
                }
            });
            pagination.appendChild(prevBtn);

            const pageInfo = document.createElement('span');
            pageInfo.textContent = `第 ${this.currentPage} 页，共 ${this.totalPages} 页，总计 ${this.images.length} 张图片。`;
            pageInfo.style.margin = '0 12px';
            pagination.appendChild(pageInfo);

            const nextBtn = document.createElement('button');
            nextBtn.className = 'page-btn';
            nextBtn.textContent = '下一页';
            nextBtn.disabled = this.currentPage === this.totalPages;
            nextBtn.addEventListener('click', () => {
                if (this.currentPage < this.totalPages) {
                    this.currentPage++;
                    this.selectedImages.clear();
                    const selectAllBtn = document.getElementById('select-all-btn');
                    if (selectAllBtn) selectAllBtn.textContent = '全选';
                    this.renderImages();
                    this.renderPagination();
                    this.updateBatchButtons();
                }
            });
            pagination.appendChild(nextBtn);
        },
        /**
         * 插入图片Markdown到编辑器
         * @param {string} markdown
         */
        insertImageMarkdown(markdown) {
            const cm = DOM.getEditor();
            if (cm) {
                const cursor = cm.getCursor();
                cm.replaceRange(`\n${markdown}\n`, cursor);
                Utils.showPanelMessage('图片已插入编辑器');
                this.closePanel();
            }
        },
        /**
         * 复制单张图片链接
         * @param {object} img
         * @param {string} format
         */
        copySingleUrl(img, format) {
            const text = img.links[format] || img.links.direct;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => {
                    Utils.showPanelMessage('链接已复制');
                }).catch(() => {
                    this.fallbackCopy(text);
                });
            } else {
                this.fallbackCopy(text);
            }
        },
        fallbackCopy(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                Utils.showPanelMessage('链接已复制（兼容模式）');
            } catch {
                Utils.showPanelMessage('复制失败');
            }
            document.body.removeChild(textarea);
        },
        /**
         * 更新批量操作按钮状态
         */
        updateBatchButtons() {
            const deleteBtn = document.getElementById('delete-selected-btn');
            const copyBtn = document.getElementById('copy-selected-btn');
            deleteBtn.disabled = this.selectedImages.size === 0;
            copyBtn.disabled = this.selectedImages.size === 0;
        },
        /**
         * 复制批量选择的图片链接
         * @param {string} format
         */
        copySelectedUrls(format) {
            if (this.selectedImages.size === 0) {
                Utils.showPanelMessage('未选择图片');
                return;
            }
            const selectedImgs = this.images.filter(img => this.selectedImages.has(img.image_id));
            const texts = selectedImgs.map(img => img.links[format] || img.links.direct);
            const text = texts.join('\n');
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => {
                    Utils.showPanelMessage(`已复制 ${texts.length} 个链接`);
                }).catch(() => {
                    this.fallbackCopy(text);
                });
            } else {
                this.fallbackCopy(text);
            }
        }
    };

    /**
     * 编辑器DOM管理
     */
    const DOM = {
        editor: null,
        statusElements: UI.statusElements,
        loginButtons: UI.loginButtons,
        getEditor() {
            return this.editor?.CodeMirror;
        }
    };

    /**
     * 图片处理模块（粘贴、拖拽、上传等）
     */
    const ImageHandler = {
        /**
         * 处理粘贴事件，上传图片
         * @param {ClipboardEvent} e
         */
        handlePaste(e) {
            if (!Utils.isEditingInEditor()) return;
            const dt = e.clipboardData || e.originalEvent?.clipboardData;
            if (!dt) return;
            let files = [];
            if (dt.files && dt.files.length) files = Array.from(dt.files).filter(f => f.type.startsWith('image/'));
            else if (dt.items && dt.items.length)
                files = Array.from(dt.items).filter(i => i.kind === 'file' && i.type.startsWith('image/')).map(i => i.getAsFile()).filter(Boolean);
            if (files.length) {
                e.preventDefault();
                e.stopPropagation();
                if (!APP.apiKey) {
                    UI.openLogin();
                    return;
                }
                ImageHandler.handleFiles(files);
            }
        },
        /**
         * 处理文件数组上传
         * @param {File[]} files
         */
        handleFiles(files) {
            if (!APP.apiKey) {
                UI.openLogin();
                return;
            }
            files.filter(file => file?.type.startsWith('image/')).forEach(ImageHandler.uploadAndInsert);
        },
        /**
         * 上传并插入Markdown
         * @param {File} file
         */
        async uploadAndInsert(file) {
            UI.setStatus(STATUS.INFO.class, MESSAGE.UPLOADING);
            try {
                const result = await API.uploadImage(file);
                ImageHandler.insertMarkdown(result.markdown);
                UI.setStatus(STATUS.SUCCESS.class, MESSAGE.UPLOAD_SUCCESS, APP.config.statusTimeout);
            } catch (error) {
                if (error.message === MESSAGE.LOGIN_EXPIRED) await Auth.checkLoginIfNeeded(true);
                const errorMessage = `上传失败: ${error.message}`;
                console.error('[NodeImage]', error);
                UI.setStatus(STATUS.ERROR.class, errorMessage, APP.config.statusTimeout);
            }
        },
        /**
         * 插入Markdown文本到编辑器
         * @param {string} markdown
         */
        insertMarkdown(markdown) {
            const cm = DOM.getEditor();
            if (cm) {
                const cursor = cm.getCursor();
                cm.replaceRange(`\n${markdown}\n`, cursor);
            }
        }
    };

    /**
     * 认证与登录状态管理模块
     */
    const Auth = {
        /**
         * 检查登录状态，必要时强制检查
         * @param {boolean} [forceCheck=false]
         * @returns {Promise<boolean>}
         */
        async checkLoginIfNeeded(forceCheck = false) {
            if (APP.apiKey && !forceCheck) return true;
            const isLoggedIn = await API.checkLoginAndGetKey();
            if (!isLoggedIn && APP.apiKey) UI.setStatus(STATUS.WARNING.class, MESSAGE.LOGIN_EXPIRED);
            UI.updateState();
            return isLoggedIn;
        },
        checkLogoutFlag() {
            if (Storage.get(Storage.keys.logout) === 'true') {
                APP.apiKey = '';
                UI.updateState();
                Storage.remove(Storage.keys.logout);
                UI.setStatus(STATUS.WARNING.class, MESSAGE.LOGOUT);
            }
        },
        async checkRecentLogin() {
            const lastLoginCheck = Storage.get(Storage.keys.loginCheck);
            if (lastLoginCheck && Date.now() - parseInt(lastLoginCheck) < 30000) {
                await API.checkLoginAndGetKey();
                Storage.remove(Storage.keys.loginCheck);
            }
        },
        setupStorageListener() {
            window.addEventListener('storage', event => {
                if (event.key === Storage.keys.loginStatus && event.newValue === 'login_success') {
                    API.checkLoginAndGetKey();
                    localStorage.removeItem(Storage.keys.loginStatus);
                } else if (event.key === Storage.keys.logout && event.newValue === 'true') {
                    APP.apiKey = '';
                    UI.updateState();
                    localStorage.removeItem(Storage.keys.logout);
                }
            });
        },
        monitorLogout() {
            document.addEventListener('click', e => {
                const logoutButton = e.target.closest('#logoutBtn, .logout-btn');
                if (logoutButton || e.target.textContent?.match(/登出|注销|退出|logout|sign out/i)) {
                    Storage.set(Storage.keys.logout, 'true');
                }
            });
        },
        startLoginStatusCheck() {
            const checkLoginInterval = setInterval(async () => {
                try {
                    const isLoggedIn = await API.checkLoginAndGetKey();
                    if (isLoggedIn) {
                        clearInterval(checkLoginInterval);
                        Storage.remove(Storage.keys.loginStatus);
                        Storage.set(Storage.keys.loginStatus, 'login_success');
                        Storage.set(Storage.keys.loginCheck, Date.now().toString());
                        setTimeout(() => window.close(), 1000);
                    }
                } catch { }
            }, 3000);
            setTimeout(() => clearInterval(checkLoginInterval), 300000);
        },
        handleNodeImageSite() {
            if (['/login', '/register', '/'].includes(window.location.pathname)) {
                const loginForm = document.querySelector('form');
                if (loginForm) loginForm.addEventListener('submit', () => Storage.set(Storage.keys.loginStatus, 'login_pending'));
                this.startLoginStatusCheck();
            } else if (Storage.get(Storage.keys.loginStatus) === 'login_pending') this.checkLoginIfNeeded(true);
            this.monitorLogout();
        }
    };

    /**
     * 脚本初始化
     */
    async function init() {
        if (Utils.isNodeImageSite()) {
            Auth.handleNodeImageSite();
            return;
        }
        document.addEventListener('paste', ImageHandler.handlePaste);
        window.addEventListener('focus', () => Auth.checkLoginIfNeeded());
        Utils.waitForElement('.CodeMirror').then(editor => {
            DOM.editor = editor;
            editor.addEventListener('dragover', e => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
            });
            editor.addEventListener('drop', e => {
                e.preventDefault();
                ImageHandler.handleFiles(Array.from(e.dataTransfer.files));
            });
        });
        Utils.waitForElement('.mde-toolbar').then(UI.setupToolbar.bind(UI));
        const observer = new MutationObserver(() => {
            const toolbar = document.querySelector('.mde-toolbar');
            if (toolbar && !toolbar.querySelector('#nodeimage-toolbar-container')) UI.setupToolbar(toolbar);
        });
        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
        document.addEventListener('click', e => {
            if (e.target.closest('.tab-option')) {
                setTimeout(() => {
                    const toolbar = document.querySelector('.mde-toolbar');
                    if (toolbar && !toolbar.querySelector('#nodeimage-toolbar-container')) UI.setupToolbar(toolbar);
                }, 100);
            }
        });
        Auth.checkLogoutFlag();
        Auth.setupStorageListener();
        await Auth.checkRecentLogin();
        await Auth.checkLoginIfNeeded();
    }

    // 添加样式
    GM_addStyle(`
      #nodeimage-status {
        margin-left: 10px;
        display: inline-block;
        font-size: 14px;
        height: 28px;
        line-height: 28px;
        transition: all 0.3s ease;
      }
      #nodeimage-status.success { color: ${STATUS.SUCCESS.color}; }
      #nodeimage-status.error { color: ${STATUS.ERROR.color}; }
      #nodeimage-status.warning { color: ${STATUS.WARNING.color}; }
      #nodeimage-status.info { color: ${STATUS.INFO.color}; }
      .nodeimage-login-btn {
        cursor: pointer;
        margin-left: 10px;
        color: ${STATUS.WARNING.color};
        font-size: 14px;
        background: rgba(230, 162, 60, 0.1);
        padding: 3px 8px;
        border-radius: 4px;
        border: 1px solid rgba(230, 162, 60, 0.2);
      }
      .nodeimage-toolbar-container {
        display: flex;
        align-items: center;
        margin-left: 10px;
      }
      #nodeimage-manage-btn {
        cursor: pointer;
        margin-left: 10px;
        color: ${STATUS.INFO.color};
        font-size: 14px;
        background: rgba(0, 120, 255, 0.1);
        padding: 3px 8px;
        border-radius: 4px;
        border: 1px solid rgba(0, 120, 255, 0.2);
      }
      #nodeimage-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 1200px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 11px 15px -7px rgba(0,0,0,.2), 0 24px 38px 3px rgba(0,0,0,.14), 0 9px 46px 8px rgba(0,0,0,.12);
        z-index: 9999;
        display: none;
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        flex-direction: column;
      }
      #nodeimage-panel.show {
        display: flex;
      }
      .panel-header {
        background: #1976d2;
        color: white;
        padding: 16px 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
      }
      .panel-title {
        font-size: 20px;
        font-weight: 500;
      }
      .panel-close {
        cursor: pointer;
        font-size: 24px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s;
      }
      .panel-close:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
      .panel-toolbar {
        padding: 16px 24px;
        background: #f5f5f5;
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }
      .mdui-btn {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .mdui-btn-primary {
        background: #1976d2;
        color: white;
        box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
      }
      .mdui-btn-primary:hover {
        background: #1565c0;
        box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
      }
      .mdui-btn-danger {
        background: #d32f2f;
        color: white;
      }
      .mdui-btn-danger:hover {
        background: #c62828;
        box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
      }
      .mdui-btn-success {
        background: #388e3c;
        color: white;
      }
      .mdui-btn-success:hover {
        background: #2e7d32;
        box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
      }
      .mdui-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      #panel-message {
        position: absolute;
        top: 8px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.75);
        color: white;
        padding: 6px 20px;
        border-radius: 20px;
        font-size: 14px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s;
        z-index: 10001;
      }
      #panel-message.show {
        opacity: 1;
        pointer-events: auto;
      }
      .images-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
        padding: 12px 24px;
        overflow-y: auto;
        position: relative;
      }
      .image-card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
        position: relative;
        display: flex;
        flex-direction: column;
        cursor: default;
      }
      .image-preview {
        width: 100%;
        height: 150px;
        object-fit: cover;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        cursor: pointer;
      }
      .image-info {
        padding: 8px 12px;
        font-size: 12px;
        color: #666;
        flex-grow: 1;
        user-select: none;
      }
      .image-filename {
        font-weight: 500;
        color: #333;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .image-size {
        color: #999;
      }
      .image-actions {
        display: flex;
        justify-content: space-around;
        padding: 8px;
        border-top: 1px solid #eee;
      }
      .image-actions button {
        border: none;
        background: none;
        cursor: pointer;
        color: #1976d2;
        font-size: 14px;
        padding: 4px 8px;
        border-radius: 4px;
        transition: background-color 0.2s;
        position: relative;
      }
      .image-actions button:hover {
        background-color: #e3f2fd;
      }
      .copy-dropdown-single {
        position: absolute;
        top: 26px;
        left: 0;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        display: none;
        z-index: 10002;
        min-width: 120px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      }
      .copy-dropdown-single.show {
        display: block;
      }
      .copy-dropdown-single div {
        padding: 6px 12px;
        cursor: pointer;
        font-size: 13px;
        user-select: none;
      }
      .copy-dropdown-single div:hover {
        background-color: #f5f5f5;
      }
      .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        padding: 12px 0;
        border-top: 1px solid #e0e0e0;
        user-select: none;
      }
      .page-btn {
        padding: 6px 12px;
        border: 1px solid #ddd;
        background: white;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 14px;
      }
      .page-btn:hover:not(:disabled) {
        background: #f5f5f5;
        border-color: #999;
      }
      .page-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .page-btn.active {
        background: #1976d2;
        color: white;
        border-color: #1976d2;
      }
      .panel-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 9998;
        display: none;
      }
      .panel-overlay.show {
        display: block;
      }
    `);

    window.addEventListener('load', init);
})();
