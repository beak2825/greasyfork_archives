// ==UserScript==
// @name         Wallhaven一键下载
// @version      1.8
// @description  在Wallhaven缩略图上添加下载按钮和复选框，支持单张下载、逐个下载和打包下载。
// @match        *://wallhaven.cc/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        GM_addStyle
// @license      MIT
// @author       EPC_SG
// @namespace 这是干啥的，不是很懂
// @downloadURL https://update.greasyfork.org/scripts/514257/Wallhaven%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/514257/Wallhaven%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注入CSS样式
    GM_addStyle(`
        .thumb { position: relative; }
        .thumb .download-btn {
            position: absolute;
            top: 5px;
            left: 6px;
            z-index: 1000;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            padding: 5px 10px;
        }
        .thumb .download-checkbox {
            position: absolute;
            top: 11px;
            left: 42px;
            z-index: 1000;
            width: 15px;
            height: 15px;
            visibility: visible;
        }
        .control-btn {
            background: #4CAF50;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            margin: 0 5px 5px 0;
            font-size: 12px;
        }
        #repo-window {
            position: fixed;
            top: 110px;
            right: 10px;
            width: 250px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 2000;
        }
        #repo-header {
            cursor: pointer;
            margin: 0 0 10px;
            font-size: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #repo-header .arrow { transition: transform 0.2s; }
        #repo-header .arrow.expanded { transform: rotate(0deg); }
        #repo-header .arrow:not(.expanded) { transform: rotate(90deg); }
        #repo-content {
            display: none;
            max-height: 350px;
            overflow-y: auto;
        }
        #repo-content.expanded { display: block; }
        .repo-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 0;
        }
        .repo-item a {
            color: #1e90ff;
            text-decoration: none;
        }
        .repo-item a:hover { text-decoration: underline; }
        .repo-buttons {
            display: flex;
            gap: 5px;
        }
        .repo-item button {
            border: none;
            color: white;
            padding: 2px 5px;
            cursor: pointer;
            border-radius: 3px;
            font-size: 10px;
            height: 18px;
        }
        .repo-item .delete-btn { background: #ff4444; }
        .repo-item .download-btn { background: #4CAF50; }
        #clear-btn { background: #ff4444; }
        #abort-btn {
            background: #ff4444;
            color: white;
            padding: 2px 5px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            margin-left: 5px;
            font-size: 12px;
        }
    `);

    // 工具函数
    const getImageUrl = (id, isPng) => {
        const format = isPng ? 'png' : 'jpg';
        return `https://w.wallhaven.cc/full/${id.slice(0, 2)}/wallhaven-${id}.${format}`;
    };

    const fetchWithRetry = async (url, retries = 3) => {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('Network error');
                return await response.blob();
            } catch (err) {
                if (i === retries - 1) throw err;
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
    };

    const fetchWithLimit = async (urls, limit = 5, onProgress = () => {}, abortSignal = null) => {
        const results = [];
        const total = urls.length;
        let completed = 0;

        for (let i = 0; i < urls.length; i += limit) {
            if (abortSignal && abortSignal.aborted) throw new Error('Download aborted');
            const chunk = urls.slice(i, i + limit);
            const promises = chunk.map(url => fetchWithRetry(url));
            const blobs = await Promise.all(promises);
            results.push(...blobs);
            completed += blobs.length;
            onProgress(Math.round((completed / total) * 100), completed, total);
        }
        return results;
    };

    const debounce = (fn, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        };
    };

    // Worker相关
    const createWorker = (fn) => {
        const blob = new Blob([`(${fn.toString()})()`], { type: 'application/javascript' });
        return new Worker(URL.createObjectURL(blob));
    };

    const workerScript = () => {
        self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js');
        self.onmessage = async (e) => {
            const { files } = e.data;
            const zip = new JSZip();
            files.forEach(file => zip.file(file.name, file.blob));
            const blob = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: 1 }
            }, ({ percent }) => {
                self.postMessage({ type: 'progress', percent: Math.round(percent) });
            });
            self.postMessage({ type: 'complete', blob });
        };
    };

    // 仓库管理（改进部分）
    const repo = {
        items: (() => {
            const rawData = JSON.parse(localStorage.getItem('wallhaven_repo') || '[]');
            // 兼容旧数据：如果旧数据是纯 ID 数组，转换为新格式（假设所有图片为 JPG）
            if (Array.isArray(rawData) && rawData.length > 0 && typeof rawData[0] === 'string') {
                return rawData.map(id => ({ id, isPng: false }));
            }
            return rawData;
        })(),
        save: () => localStorage.setItem('wallhaven_repo', JSON.stringify(repo.items)),
        add: (id, isPng) => {
            if (!repo.items.some(item => item.id === id)) {
                repo.items.push({ id, isPng });
                repo.save();
            }
        },
        remove: (id) => {
            repo.items = repo.items.filter(item => item.id !== id);
            repo.save();
        },
        clear: () => {
            repo.items = [];
            repo.save();
        },
        has: (id) => repo.items.some(item => item.id === id),
        getUrls: () => repo.items.map(item => getImageUrl(item.id, item.isPng))
    };

    // DOM 缓存和状态管理
    let checkboxes = [];
    let ratioDisplay, progressDisplay, repoWindow, repoContent, repoArrow;
    let abortController = null; // 用于中止下载
    let currentWorker = null; // 用于中止打包

    const updateCheckboxes = () => {
        checkboxes = Array.from(document.querySelectorAll('.thumb .download-checkbox'));
    };

    const updateRatio = () => {
        const selected = repo.items.length;
        ratioDisplay.textContent = `仓库中 ${selected} 张`;
    };
    const updateRatioDebounced = debounce(updateRatio, 100);

    const showProgress = (text, showAbort = false) => {
        progressDisplay.textContent = text;
        if (showAbort) {
            const abortBtn = document.createElement('button');
            abortBtn.id = 'abort-btn';
            abortBtn.textContent = '中止';
            abortBtn.addEventListener('click', () => {
                if (abortController) abortController.abort();
                if (currentWorker) currentWorker.terminate();
                showProgress('操作已中止');
            });
            progressDisplay.appendChild(abortBtn);
        } else {
            const existingAbortBtn = progressDisplay.querySelector('#abort-btn');
            if (existingAbortBtn) existingAbortBtn.remove();
        }
    };

    // 渲染悬浮窗（改进部分）
    const renderRepoWindow = () => {
        repoContent.innerHTML = '';
        repo.items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'repo-item';
            div.innerHTML = `
                <a href="https://wallhaven.cc/w/${item.id}" target="_blank">${item.id}</a>
                <div class="repo-buttons">
                    <button class="delete-btn">删除</button>
                    <button class="download-btn">下载</button>
                </div>
            `;
            div.querySelector('.delete-btn').addEventListener('click', () => {
                repo.remove(item.id);
                renderRepoWindow();
                updateRatio();
                syncCheckboxes();
            });
            div.querySelector('.download-btn').addEventListener('click', () => {
                const url = getImageUrl(item.id, item.isPng);
                fetchWithRetry(url)
                    .then(blob => saveAs(blob, url.split('/').pop()))
                    .catch(err => showProgress(`下载 ${item.id} 失败，请重试。`));
            });
            repoContent.appendChild(div);
        });
    };

    // 切换展开/收缩状态
    const toggleRepoWindow = () => {
        repoContent.classList.toggle('expanded');
        repoArrow.classList.toggle('expanded');
    };

    // 同步复选框状态
    const syncCheckboxes = () => {
        checkboxes.forEach(cb => {
            const id = cb.closest('.thumb').dataset.wallpaperId;
            cb.checked = repo.has(id);
        });
    };

    // 全选/取消功能
    const toggleAll = (e) => {
        e.preventDefault();
        const allChecked = checkboxes.every(cb => cb.checked);
        checkboxes.forEach(cb => {
            const thumb = cb.closest('.thumb');
            const id = thumb.dataset.wallpaperId;
            const isPng = !!thumb.querySelector('.thumb-info .png');
            if (!allChecked) {
                cb.checked = true;
                repo.add(id, isPng);
            } else {
                cb.checked = false;
                repo.remove(id);
            }
        });
        renderRepoWindow();
        updateRatio();
    };

    // 添加按钮和复选框
    const addButtons = (container) => {
        container.querySelectorAll('.thumb:not([data-processed])').forEach(thumb => {
            const id = thumb.dataset.wallpaperId;
            if (!id) return;

            thumb.dataset.processed = 'true';
            const isPng = !!thumb.querySelector('.thumb-info .png');
            const url = getImageUrl(id, isPng);

            const dlBtn = document.createElement('button');
            dlBtn.className = 'download-btn';
            dlBtn.innerHTML = '<i class="fas fa-download"></i>';
            thumb.appendChild(dlBtn);

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'download-checkbox';
            checkbox.value = url;
            checkbox.checked = repo.has(id);
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) repo.add(id, isPng);
                else repo.remove(id);
                renderRepoWindow();
                updateRatioDebounced();
            });
            thumb.appendChild(checkbox);
        });
        updateCheckboxes();
        syncCheckboxes();
        updateRatio();
    };

    // 批量逐个下载
    const batchDownload = async () => {
        if (!repo.items.length) return showProgress('仓库为空！');
        const urls = repo.getUrls();
        abortController = new AbortController();
        try {
            const blobs = await fetchWithLimit(urls, 5, (percent, completed, total) => {
                showProgress(`正在下载：${percent}% (${completed}/${total})`, true);
            }, abortController.signal);
            blobs.forEach((blob, i) => saveAs(blob, urls[i].split('/').pop()));
            showProgress('逐个下载完成！');
        } catch (err) {
            if (err.message === 'Download aborted') {
                showProgress('下载已中止');
            } else {
                showProgress('下载失败，请重试。');
            }
        } finally {
            abortController = null;
        }
    };

    // 打包下载
    const packDownload = async () => {
        if (!repo.items.length) return showProgress('仓库为空！');
        const urls = repo.getUrls();
        abortController = new AbortController();
        try {
            const blobs = await fetchWithLimit(urls, 5, (percent, completed, total) => {
                showProgress(`正在下载：${percent}% (${completed}/${total})`, true);
            }, abortController.signal);

            currentWorker = createWorker(workerScript);
            currentWorker.onmessage = (e) => {
                if (e.data.type === 'progress') {
                    showProgress(`正在打包：${e.data.percent}%`, true);
                } else if (e.data.type === 'complete') {
                    saveAs(e.data.blob, 'images.zip');
                    showProgress('打包完成！');
                    currentWorker = null;
                }
            };

            const files = blobs.map((blob, i) => ({
                name: urls[i].split('/').pop(),
                blob
            }));
            currentWorker.postMessage({ files });
        } catch (err) {
            if (err.message === 'Download aborted') {
                if (currentWorker) currentWorker.terminate();
                showProgress('打包已中止');
            } else {
                showProgress('打包失败，请重试。');
            }
        } finally {
            abortController = null;
        }
    };

    // 清空仓库
    const clearRepo = () => {
        repo.clear();
        renderRepoWindow();
        updateRatio();
        syncCheckboxes();
    };

    // 初始化控制面板
    const initControls = () => {
        const toolbar = document.querySelector('.expanded') || document.body;
        [ratioDisplay, progressDisplay, repoWindow] = [
            Object.assign(document.createElement('span'), { style: 'color: white;' }),
            Object.assign(document.createElement('span'), { style: 'color: white;' }),
            document.createElement('div')
        ];
        repoWindow.id = 'repo-window';

        const header = document.createElement('h3');
        header.id = 'repo-header';
        header.innerHTML = '图片仓库 <span class="arrow">▼</span>';
        header.addEventListener('click', toggleRepoWindow);
        repoArrow = header.querySelector('.arrow');
        repoWindow.appendChild(header);

        repoContent = document.createElement('div');
        repoContent.id = 'repo-content';
        repoWindow.appendChild(repoContent);

        const selectAllBtn = document.createElement('button');
        selectAllBtn.textContent = '全选/取消';
        selectAllBtn.className = 'control-btn';
        selectAllBtn.addEventListener('click', toggleAll);
        toolbar.appendChild(selectAllBtn);

        const batchBtn = document.createElement('button');
        batchBtn.textContent = '逐个下载';
        batchBtn.className = 'control-btn';
        batchBtn.addEventListener('click', batchDownload);
        repoWindow.insertBefore(batchBtn, repoContent);

        const packBtn = document.createElement('button');
        packBtn.textContent = '打包下载';
        packBtn.className = 'control-btn';
        packBtn.addEventListener('click', packDownload);
        repoWindow.insertBefore(packBtn, repoContent);

        const clearBtn = document.createElement('button');
        clearBtn.textContent = '清空';
        clearBtn.id = 'clear-btn';
        clearBtn.className = 'control-btn';
        clearBtn.addEventListener('click', clearRepo);
        repoWindow.insertBefore(clearBtn, repoContent);

        [ratioDisplay, progressDisplay].forEach((el, i) => {
            el.style.marginLeft = `${5 + i * 5}px`;
            toolbar.appendChild(el);
        });
        document.body.appendChild(repoWindow);

        // 默认展开
        toggleRepoWindow();
        renderRepoWindow();
    };

    // 主逻辑
    initControls();
    const listingPage = document.querySelector('.thumb-listing-page');
    if (listingPage) addButtons(listingPage);

    const thumbListing = document.querySelector('.thumb-listing');
    if (thumbListing) {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(m => {
                m.addedNodes.forEach(node => {
                    if (node.classList?.contains('thumb-listing-page')) addButtons(node);
                });
            });
        });
        observer.observe(thumbListing, { childList: true, subtree: true });

        thumbListing.addEventListener('click', (e) => {
            const btn = e.target.closest('.download-btn');
            if (btn) {
                const url = btn.nextElementSibling.value;
                fetchWithRetry(url)
                    .then(blob => saveAs(blob, url.split('/').pop()))
                    .catch(err => showProgress('下载失败，请重试。'));
            }
        });
    }
})();