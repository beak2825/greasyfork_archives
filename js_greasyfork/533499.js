// ==UserScript==
// @name         X博主图片批量打包下载器
// @namespace    http://tampermonkey.net/
// @version      2.31
// @description  收集页面图片并打包为ZIP下载
// @author       基础版
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @connect      raw.githubusercontent.com
// @connect      twitter.com
// @connect      x.com
// @connect      pbs.twimg.com
// @connect      video.twimg.com
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/533499/X%E5%8D%9A%E4%B8%BB%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/533499/X%E5%8D%9A%E4%B8%BB%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2024 基础版

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function () {
    'use strict';

    // -------------------------- 配置与变量定义 --------------------------
    const BATCH_SIZE = 1000;               // 最大下载数量
    const IMAGE_SCROLL_INTERVAL = 1500;    // 滚动间隔时间(ms)
    const IMAGE_MAX_SCROLL_COUNT = 100;    // 最大滚动次数
    const SCROLL_DELAY = 1000;             // 滚动后的等待时间(ms)
    const NO_NEW_IMAGE_THRESHOLD = 3;      // 连续3次下滑无新内容则结束

    const DEFAULT_QUERY_IDS = ['2ICDjqPd81tulZcYrtpTuQ', 'zAz9764BcLZOJ0JU2wrd1A'];

    let config = {
        batchSize: BATCH_SIZE,
        imageScrollInterval: IMAGE_SCROLL_INTERVAL,
        imageMaxScrollCount: IMAGE_MAX_SCROLL_COUNT,
        scrollDelay: SCROLL_DELAY,
        noNewImageThreshold: NO_NEW_IMAGE_THRESHOLD,
        graphqlQueryIds: [],
        useDefaultQueryIds: true,
        downloadConcurrency: 4,
        zipChunkSizeMB: 1024,
        saveHistory: true,
        skipDownloaded: true
    };



    let cancelDownload = false;
    let stopScroll = false;
    let hideTimeoutId = null;
    let lang;
    let zipDownloadCount = 0;

    // 核心数据结构
    const imageLinksSet = new Set();       // 收集到的图片链接（最终下载）

    // -------------------------- UI组件初始化 --------------------------
    const progressBox = document.createElement('div');
    Object.assign(progressBox.style, {
        position: 'fixed',
        top: '20px',
        left: '20px',
        padding: '10px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: '#fff',
        fontSize: '14px',
        zIndex: 9999,
        borderRadius: '8px',
        display: 'none',
        maxWidth: '400px'
    });
    document.body.appendChild(progressBox);

    const loadingPrompt = document.createElement('div');
    Object.assign(loadingPrompt.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: '#fff',
        fontSize: '16px',
        zIndex: 10000,
        borderRadius: '8px',
        display: 'none'
    });
    loadingPrompt.textContent = '正在加载，请不要关闭页面...';
    document.body.appendChild(loadingPrompt);

    const progressBarContainer = document.createElement('div');
    Object.assign(progressBarContainer.style, {
        position: 'fixed',
        top: '55%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '300px',
        height: '20px',
        backgroundColor: '#ccc',
        zIndex: 10000,
        borderRadius: '10px',
        display: 'none'
    });
    const progressBar = document.createElement('div');
    Object.assign(progressBar.style, {
        width: '0%',
        height: '100%',
        backgroundColor: '#1DA1F2',
        borderRadius: '10px'
    });
    progressBarContainer.appendChild(progressBar);
    document.body.appendChild(progressBarContainer);

    const modalOverlay = document.createElement('div');
    Object.assign(modalOverlay.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 10001,
        display: 'none'
    });
    const centerDialog = document.createElement('div');
    Object.assign(centerDialog.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px',
        backgroundColor: '#fff',
        color: '#000',
        zIndex: 10002,
        borderRadius: '10px',
        display: 'none',
        minWidth: '320px',
        boxShadow: '0 10px 24px rgba(0,0,0,0.25)'
    });
    const centerDialogMsg = document.createElement('div');
    centerDialogMsg.style.marginBottom = '12px';
    const centerDialogBtn = document.createElement('button');
    centerDialogBtn.innerText = '确定';
    Object.assign(centerDialogBtn.style, {
        padding: '8px 16px',
        backgroundColor: '#1DA1F2',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
    });
    centerDialog.appendChild(centerDialogMsg);
    centerDialog.appendChild(centerDialogBtn);
    document.body.appendChild(modalOverlay);
    document.body.appendChild(centerDialog);

    const notifier = document.createElement('div');
    Object.assign(notifier.style, {
        display: 'none',
        position: 'fixed',
        left: '16px',
        bottom: '16px',
        color: '#000',
        background: '#fff',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '4px'
    });
    notifier.title = 'X图片下载器';
    notifier.className = 'tmd-notifier';
    notifier.innerHTML = '<label>0</label>|<label>0</label>';
    document.body.appendChild(notifier);

    // -------------------------- 工具函数 --------------------------
    function updateProgress(txt) {
        progressBox.innerText = txt;
        progressBox.style.display = 'block';
    }

    function showDialog(message, onConfirm) {
        centerDialogMsg.innerText = message;
        modalOverlay.style.display = 'block';
        centerDialog.style.display = 'block';
        const handler = () => {
            centerDialogBtn.removeEventListener('click', handler);
            centerDialog.style.display = 'none';
            modalOverlay.style.display = 'none';
            if (typeof onConfirm === 'function') onConfirm();
        };
        centerDialogBtn.addEventListener('click', handler);
    }

    async function confirmDialog(message) {
        return new Promise(resolve => showDialog(message, resolve));
    }

    // 获取博主ID
    function getUsername() {
        const m = window.location.pathname.match(/^\/([^\/\?]+)/);
        return m ? m[1] : 'unknown_user';
    }

    // 获取博主显示名称（从页面标题提取）
    function getBloggerName() {
        // 从页面标题提取博主名称
        if (document.title) {
            // 标题格式通常是 "博主名称 (@用户名) / X"
            const titleParts = document.title.split('(@');
            if (titleParts.length > 0) {
                return titleParts[0].trim().replace(/\s+/g, '_');
            }
        }
        // 如果提取失败，使用用户名
        return getUsername();
    }

    async function initBaseConfig() {
        lang = getLanguage();
        document.head.insertAdjacentHTML('beforeend', `<style>${getCSS()}</style>`);
        try {
            const s = localStorage.getItem('xg_config');
            if (s) {
                const u = JSON.parse(s);
                ['batchSize','imageScrollInterval','imageMaxScrollCount','scrollDelay','noNewImageThreshold','downloadConcurrency','zipChunkSizeMB'].forEach(k => {
                    if (typeof u[k] === 'number' && u[k] > 0) config[k] = u[k];
                });
                if (Array.isArray(u.graphqlQueryIds)) {
                    const arr = u.graphqlQueryIds.filter(v => typeof v === 'string' && v.trim().length > 0);
                    config.graphqlQueryIds = arr;
                }
                if (typeof u.useDefaultQueryIds === 'boolean') config.useDefaultQueryIds = u.useDefaultQueryIds;
                if (typeof u.saveHistory === 'boolean') config.saveHistory = u.saveHistory;
                if (typeof u.skipDownloaded === 'boolean') config.skipDownloaded = u.skipDownloaded;
            }
        } catch (e) {}
        config.zipChunkSizeMB = 1024;
        try { localStorage.setItem('xg_config', JSON.stringify(config)); } catch (e) {}
    }

    function getLanguage() {
        const langMap = {
            en: {
                download: 'Download',
                completed: 'Download Completed',
                packaging: 'Packaging ZIP...',
                mediaNotFound: 'MEDIA_NOT_FOUND'
            },
            zh: {
                download: '下载',
                completed: '下载完成',
                packaging: '正在打包ZIP...',
                mediaNotFound: '未找到未下载的媒体'
            },
            'zh-Hant': {
                download: '下載',
                completed: '下載完成',
                packaging: '正在打包ZIP...',
                mediaNotFound: '未找到未下載的媒體'
            }
        };
        const pageLang = document.querySelector('html').lang || navigator.language;
        return langMap[pageLang] || langMap[pageLang.split('-')[0]] || langMap.en;
    }

    function getCSS() {
        return `
            .tmd-notifier.running {display: flex; align-items: center;}
            .tmd-notifier label {display: inline-flex; align-items: center; margin: 0 8px;}
            .tmd-notifier label:before {content: " "; width: 32px; height: 16px; background-position: center; background-repeat: no-repeat;}
            .tmd-notifier label:nth-child(1):before {background-image:url("data:image/svg+xml;charset=utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22><path d=%22M3,14 v5 q0,2 2,2 h14 q2,0 2,-2 v-5 M7,10 l4,4 q1,1 2,0 l4,-4 M12,3 v11%22 fill=%22none%22 stroke=%22%23666%22 stroke-width=%222%22 stroke-linecap=%22round%22 /></svg>");}
            .tmd-notifier label:nth-child(2):before {background-image:url("data:image/svg+xml;charset=utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22><path d=%22M12,2 a1,1 0 0 1 0,20 a1,1 0 0 1 0,-20 M12,5 v7 h6%22 fill=%22none%22 stroke=%22%23999%22 stroke-width=%222%22 stroke-linejoin=%22round%22 stroke-linecap=%22round%22 /></svg>");}
            .tmd-notifier label:nth-child(3):before {background-image:url("data:image/svg+xml;charset=utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22><path d=%22M12,0 a2,2 0 0 0 0,24 a2,2 0 0 0 0,-24%22 fill=%22%23f66%22 stroke=%22none%22 /><path d=%22M14.5,5 a1,1 0 0 0 -5,0 l0.5,9 a1,1 0 0 0 4,0 z M12,17 a2,2 0 0 0 0,5 a2,2 0 0 0 0,-5%22 fill=%22%23fff%22 stroke=%22none%22 /></svg>");}
        `;
    }

    function waitInterruptible(ms) {
        return new Promise(resolve => {
            if (stopScroll) return resolve();
            let done = false;
            const timer = setTimeout(() => {
                if (done) return;
                done = true;
                clearInterval(checker);
                resolve();
            }, ms);
            const checker = setInterval(() => {
                if (stopScroll && !done) {
                    done = true;
                    clearTimeout(timer);
                    clearInterval(checker);
                    resolve();
                }
            }, 100);
        });
    }

    function formatDate(dateStr, format = 'YYYYMMDD-hhmmss', useLocal = false) {
        const d = new Date(dateStr);
        if (useLocal) d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const values = {
            YYYY: d.getUTCFullYear().toString(),
            YY: d.getUTCFullYear().toString().slice(-2),
            MM: (d.getUTCMonth() + 1).toString().padStart(2, '0'),
            MMM: months[d.getUTCMonth()],
            DD: d.getUTCDate().toString().padStart(2, '0'),
            hh: d.getUTCHours().toString().padStart(2, '0'),
            mm: d.getUTCMinutes().toString().padStart(2, '0'),
            ss: d.getUTCSeconds().toString().padStart(2, '0')
        };
        return format.replace(/(YYYY|YY|MM|MMM|DD|hh|mm|ss)/g, match => values[match]);
    }

    function gmFetchBlob(url) {
        return new Promise((resolve, reject) => {
            try {
                GM_xmlhttpRequest({
                    url,
                    method: 'GET',
                    responseType: 'blob',
                    onload: r => {
                        const s = r.status || 0;
                        if (s >= 200 && s < 300) resolve(r.response);
                        else reject(new Error(`HTTP错误：${s}`));
                    },
                    onerror: () => reject(new Error('GM请求失败'))
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    async function fetchBlobWithFallback(url) {
        try {
            const r = await fetch(url);
            if (r.ok) return await r.blob();
        } catch (_) {}
        return await gmFetchBlob(url);
    }
    const AUTO_CHUNK_COUNT = 200;
    const AUTO_CHUNK_BYTES = 700 * 1024 * 1024;

    function totalSize(list) {
        let s = 0; for (const e of list) s += e.blob?.size || 0; return s;
    }

    async function generateZipWithFallback(entries, baseName, onSuccess) {
        let part = 1;
        async function attempt(list) {
            if (!Array.isArray(list) || list.length === 0) return;
            try {
                if (list.length > AUTO_CHUNK_COUNT || totalSize(list) > AUTO_CHUNK_BYTES) {
                    const mid = Math.floor(list.length / 2);
                    const left = list.slice(0, mid);
                    const right = list.slice(mid);
                    await attempt(left);
                    await attempt(right);
                    return;
                }
                const filled = list.filter(e => e && e.blob && e.blob.size > 0);
                if (filled.length === 0) {
                    updateProgress('⏭️ 跳过空ZIP（无有效文件）');
                    return;
                }
                updateProgress(`正在生成ZIP文件（${filled.length}个文件）...`);
                const zip = new JSZip();
                filled.forEach(e => zip.file(e.name, e.blob, { compression: 'STORE' }));
                const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'STORE' });
                const zipName = `${baseName}_part${part}_${filled.length}files.zip`;
                const a = document.createElement('a');
                a.href = URL.createObjectURL(zipBlob);
                a.download = zipName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(a.href);
                zipDownloadCount++;
                part++;
                if (typeof onSuccess === 'function') onSuccess(filled);
            } catch (err) {
                if (list.length <= 1) return;
                const mid = Math.floor(list.length / 2);
                const left = list.slice(0, mid);
                const right = list.slice(mid);
                await attempt(left);
                await attempt(right);
            }
        }
        await attempt(entries);
    }



    // -------------------------- ZIP下载管理器 --------------------------
    const Downloader = (() => {
        let tasks = [], thread = 0, failed = 0, hasFailed = false;

        return {
            async add(tasksList) {
                if (cancelDownload) return;
                this.downloadZip(tasksList);
            },

            async downloadZip(tasksList) {
                if (cancelDownload) return;

                let completedCount = 0;
                const total = tasksList.length;
                updateProgress(`${lang.packaging}（0/${total}） | 正在后台下载，请不要关闭页面`);

                tasks.push(...tasksList);
                this.updateNotifier();

                const successEntries = [];

                try {
                    let idx = 0;
                    const workers = Array.from({ length: Math.max(1, config.downloadConcurrency) }, () => (async () => {
                        while (!cancelDownload && idx < tasksList.length) {
                            const task = tasksList[idx++];
                            thread++;
                            this.updateNotifier();
                        try {
                            const blob = await fetchBlobWithFallback(task.url);
                            successEntries.push({ name: task.name, blob, statusId: task.statusId });
                            completedCount++;
                            updateProgress(`${lang.packaging}（${completedCount}/${total}） | 正在后台下载，请不要关闭页面`);
                        } catch (error) {
                            failed++;
                            updateProgress(`❌ 文件${task.name}下载失败：${error.message}`);
                            console.error(`文件${task.name}处理失败：`, error);
                            const tid = parseTweetIdFromStatus(task.statusId);
                            if (tid) markTweetFailed(tid);
                        } finally {
                            thread--;
                            tasks = tasks.filter(t => t.url !== task.url);
                            this.updateNotifier();
                        }
                        }
                    })());
                    await Promise.all(workers);

                    if (cancelDownload) return;

                if (successEntries.length === 0) {
                    updateProgress('未有可打包的文件');
                    return;
                }

                const baseName = (successEntries[0]?.name?.split('_img_')[0]) || `${getBloggerName()}_${getUsername()}`;
                const onZipSuccess = (list) => {
                    list.forEach(e => { const tid = parseTweetIdFromStatus(e.statusId); if (tid) markTweetDownloaded(tid); });
                };
                // 打包前进行确认：前100个ZIP免确认；跨越每满100的阈值时才确认
                const totalBytesAll = totalSize(successEntries);
                const toMB = b => (b / 1024 / 1024).toFixed(1);
                let predictedParts = 1;
                if (config.zipChunkSizeMB && config.zipChunkSizeMB > 0) {
                    const limit = config.zipChunkSizeMB * 1024 * 1024;
                    let bytes = 0, parts = 1;
                    for (let e of successEntries) {
                        const sz = e.blob?.size || 0;
                        if (bytes + sz > limit && bytes > 0) { parts++; bytes = 0; }
                        bytes += sz;
                    }
                    predictedParts = parts;
                } else {
                    const byCount = Math.ceil(successEntries.length / AUTO_CHUNK_COUNT);
                    const byBytes = Math.ceil(totalBytesAll / AUTO_CHUNK_BYTES);
                    predictedParts = Math.max(byCount, byBytes);
                }
                const beforeBucket = Math.floor(zipDownloadCount / 100);
                const afterBucket = Math.floor((zipDownloadCount + Math.max(predictedParts,1) - 1) / 100);
                if (afterBucket > beforeBucket) {
                    await confirmDialog(`将下载ZIP：共${successEntries.length}个文件，预计${predictedParts}个ZIP，总大小约${toMB(totalBytesAll)}MB。点击“确定”开始本地下载。`);
                }
                if (config.zipChunkSizeMB && config.zipChunkSizeMB > 0) {
                    let part = 1;
                    let acc = [];
                    let bytes = 0;
                    const limit = config.zipChunkSizeMB * 1024 * 1024;
                    for (let e of successEntries) {
                        const sz = e.blob?.size || 0;
                        if (bytes + sz > limit && acc.length > 0) {
                            await generateZipWithFallback(acc, baseName, onZipSuccess);
                            acc = [];
                            bytes = 0;
                            part++;
                        }
                        acc.push(e);
                        bytes += sz;
                    }
                    if (acc.length > 0) await generateZipWithFallback(acc, baseName, onZipSuccess);
                    updateProgress(`✅ ZIP打包完成（共${successEntries.length}个成功文件）`);
                    showDialog(`✅ ZIP打包完成（共${successEntries.length}个成功文件）`, () => {});
                } else {
                    await generateZipWithFallback(successEntries, baseName, onZipSuccess);
                    updateProgress(`✅ ZIP打包完成（共${successEntries.length}个成功文件）`);
                    showDialog(`✅ ZIP打包完成（共${successEntries.length}个成功文件）`, () => {});
                }
                } catch (error) {
                    showDialog(`❌ ZIP打包失败：${error.message}`, () => {});
                    console.error('ZIP打包错误：', error);
                }
            },

            updateNotifier() {
                if (failed > 0 && !hasFailed) {
                    hasFailed = true;
                    notifier.innerHTML += '|';
                    const clearBtn = document.createElement('label');
                    clearBtn.innerText = '清空失败';
                    clearBtn.style.color = '#f33';
                    clearBtn.onclick = () => {
                        failed = 0;
                        hasFailed = false;
                        notifier.innerHTML = '<label>0</label>|<label>0</label>';
                        this.updateNotifier();
                    };
                    notifier.appendChild(clearBtn);
                }

                if (notifier.children.length >= 1) notifier.children[0].innerText = thread;
                if (notifier.children.length >= 2) notifier.children[1].innerText = tasks.length - thread - failed;
                if (failed > 0 && notifier.children.length >= 3) notifier.children[2].innerText = failed;

                if (thread > 0 || tasks.length > 0 || failed > 0) {
                    notifier.classList.add('running');
                } else {
                    notifier.classList.remove('running');
                }
            },

            cancel() {
                cancelDownload = true;
                tasks = [];
                thread = 0;
                failed = 0;
                hasFailed = false;
                this.updateNotifier();
                updateProgress('⏹️ 下载已取消');
            }
        };
    })();

    // -------------------------- 下载模式 --------------------------
    async function autoScrollAndDownloadImages() {
        cancelDownload = false;
        stopScroll = false;
        imageLinksSet.clear();
        const username = getUsername();
        const bloggerName = getBloggerName(); // 获取博主显示名称

        updateProgress('正在加载，请不要关闭页面...');
        progressBox.style.display = 'block';
        loadingPrompt.style.display = 'block';
        progressBarContainer.style.display = 'block';
        progressBar.style.width = '0%';

        getAllImages();
        updateProgress(`📦 已找到${imageLinksSet.size}张图片`);

        let scrollCount = 0, lastHeight = 0, progress = 0, noNewImagesCount = 0;
        while (scrollCount < config.imageMaxScrollCount && !cancelDownload && !stopScroll && noNewImagesCount < config.noNewImageThreshold) {
            window.scrollTo(0, document.body.scrollHeight);
            await waitInterruptible(config.imageScrollInterval);

            const prevCount = imageLinksSet.size;
            getAllImages();
            const currentCount = imageLinksSet.size;

            if (currentCount === prevCount) {
                noNewImagesCount++;
            } else {
                noNewImagesCount = 0;
            }

            const currentHeight = document.body.scrollHeight;
            updateProgress(`📦 已找到${currentCount}张图片（滚动${scrollCount+1}次） | 正在加载，请不要关闭页面...`);

            progress = Math.min(Math.floor(((scrollCount + 1) / config.imageMaxScrollCount) * 100), 100);
            progressBar.style.width = `${progress}%`;

            if (currentHeight === lastHeight) break;
            lastHeight = currentHeight;
            scrollCount++;
        }

        loadingPrompt.style.display = 'none';
        progressBarContainer.style.display = 'none';
        updateProgress(`✅ 收集完成（共${imageLinksSet.size}张）`);

        if (cancelDownload) {
            updateProgress('⏹️ 下载已取消');
            finishAndSave();
            return;
        }

        const imageList = Array.from(imageLinksSet);
        if (imageList.length === 0) {
            updateProgress('⚠️ 未找到可下载的图片');
            finishAndSave();
            return;
        }

        const finalTasks = imageList.slice(0, config.batchSize);

        // 文件名格式: 博主名称_用户名_img_日期_序号.jpg
        const tasks = finalTasks.map((url, index) => ({
            url: url,
            name: `${bloggerName}_${username}_img_${formatDate(new Date())}_${index+1}.jpg`,
            statusId: `img_batch_${Date.now()}_${index}`
        }));

        updateProgress(`🚀 开始处理${tasks.length}张图片（ZIP打包） | 正在后台下载，请不要关闭页面`);
        await Downloader.add(tasks);

        finishAndSave();
    }

    // 收集所有可见图片链接
    function getAllImages() {
        document.querySelectorAll('img[src*="twimg.com/media"]').forEach(img => {
            let url = img.src.replace(/&name=\w+/, '');
            if (!url.includes('?')) {
                url += '?';
            }
            url += '&name=orig';
            imageLinksSet.add(url);
        });
    }

    function getPostIdsFromPage() {
        const ids = new Set();
        const anchors = document.querySelectorAll('a[href*="/status/"], a[href^="/i/status/"]');
        anchors.forEach(a => {
            const href = a.href || a.getAttribute('href') || '';
            const m = href.match(/status\/(\d+)/);
            if (m) ids.add(m[1]);
        });
        const timeEls = document.querySelectorAll('article time');
        timeEls.forEach(t => {
            const p = t.parentElement;
            const href = p ? (p.href || p.getAttribute('href') || '') : '';
            const m = href && href.match(/status\/(\d+)/);
            if (m) ids.add(m[1]);
        });
        return Array.from(ids);
    }

    function getVisibleMediaCount() {
        let count = 0;
        document.querySelectorAll('img[src*="pbs.twimg.com/media"], img[src*="twimg.com/media"]').forEach(() => { count++; });
        document.querySelectorAll('[style*="background-image"]').forEach(el => {
            const style = el.getAttribute('style') || '';
            if (/url\((['"]?)(https?:\/\/pbs\.twimg\.com\/media\/[^)"'\\]+)\1\)/.test(style)) count++;
        });
        document.querySelectorAll('a[href*="/photo/"]').forEach(() => { count++; });
        document.querySelectorAll('button[data-testid="playButton"]').forEach(() => { count++; });
        return count;
    }

    function getCookieMap() {
        const cookies = {};
        document.cookie.split(';').forEach(n => {
            const i = n.indexOf('=');
            if (i > 0) cookies[n.slice(0, i).trim()] = n.slice(i + 1).trim();
        });
        return cookies;
    }

    function loadHistory() {
        try {
            const s = localStorage.getItem('xg_history');
            if (s) {
                const h = JSON.parse(s);
                return {
                    downloaded: h.downloaded || {},
                    failed: h.failed || {}
                };
            }
        } catch (e) {}
        return { downloaded: {}, failed: {} };
    }

    function saveHistory(hist) {
        try { localStorage.setItem('xg_history', JSON.stringify(hist)); } catch (e) {}
    }

    function clearHistory() {
        try { localStorage.removeItem('xg_history'); } catch (e) {}
    }

    function markTweetDownloaded(tweetId) {
        if (!config.saveHistory) return;
        const h = loadHistory();
        h.downloaded[tweetId] = true;
        delete h.failed[tweetId];
        saveHistory(h);
    }

    function markTweetFailed(tweetId) {
        if (!config.saveHistory) return;
        const h = loadHistory();
        h.failed[tweetId] = true;
        saveHistory(h);
    }

    function parseTweetIdFromStatus(statusId) {
        const m = (statusId || '').match(/^api_media_(\d+)_/);
        return m ? m[1] : '';
    }

    function getImageUrlWithOrig(u) {
        let url = (u || '').replace(/&amp;/g, '&').replace(/&name=\w+/g, '');
        if (!url.includes('?')) url += '?';
        if (!/([?&])name=orig/.test(url)) url += (url.endsWith('?') ? '' : '&') + 'name=orig';
        return url;
    }

    async function fetchTweetJsonApi(statusId) {
        const host = location.hostname;
        let list = [...new Set([...(config.useDefaultQueryIds ? DEFAULT_QUERY_IDS : []), ...(Array.isArray(config.graphqlQueryIds) ? config.graphqlQueryIds : [])])];
        if (list.length === 0) list = DEFAULT_QUERY_IDS.slice();
        const order = list.slice().sort(() => Math.random() - 0.5);
        const variables = {
            tweetId: statusId,
            with_rux_injections: false,
            includePromotedContent: true,
            withCommunity: true,
            withQuickPromoteEligibilityTweetFields: true,
            withBirdwatchNotes: true,
            withVoice: true,
            withV2Timeline: true
        };
        const features = {
            articles_preview_enabled: true,
            c9s_tweet_anatomy_moderator_badge_enabled: true,
            communities_web_enable_tweet_community_results_fetch: false,
            creator_subscriptions_quote_tweet_preview_enabled: false,
            creator_subscriptions_tweet_preview_api_enabled: false,
            freedom_of_speech_not_reach_fetch_enabled: true,
            graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
            longform_notetweets_consumption_enabled: false,
            longform_notetweets_inline_media_enabled: true,
            longform_notetweets_rich_text_read_enabled: false,
            premium_content_api_read_enabled: false,
            profile_label_improvements_pcf_label_in_post_enabled: true,
            responsive_web_edit_tweet_api_enabled: false,
            responsive_web_enhance_cards_enabled: false,
            responsive_web_graphql_exclude_directive_enabled: false,
            responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
            responsive_web_graphql_timeline_navigation_enabled: false,
            responsive_web_grok_analysis_button_from_backend: false,
            responsive_web_grok_analyze_button_fetch_trends_enabled: false,
            responsive_web_grok_analyze_post_followups_enabled: false,
            responsive_web_grok_image_annotation_enabled: false,
            responsive_web_grok_share_attachment_enabled: false,
            responsive_web_grok_show_grok_translated_post: false,
            responsive_web_jetfuel_frame: false,
            responsive_web_media_download_video_enabled: false,
            responsive_web_twitter_article_tweet_consumption_enabled: true,
            rweb_tipjar_consumption_enabled: true,
            rweb_video_screen_enabled: false,
            standardized_nudges_misinfo: true,
            tweet_awards_web_tipping_enabled: false,
            tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
            tweetypie_unmention_optimization_enabled: false,
            verified_phone_label_enabled: false,
            view_counts_everywhere_api_enabled: true
        };
        const makeUrl = (id) => `https://${host}/i/api/graphql/${id}/TweetResultByRestId?variables=${encodeURIComponent(JSON.stringify(variables))}&features=${encodeURIComponent(JSON.stringify(features))}`;
        const c = getCookieMap();
        const headers = {
            authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
            'x-twitter-active-user': 'yes',
            'x-twitter-client-language': c.lang || 'en',
            'x-csrf-token': c.ct0 || ''
        };
        if ((c.ct0 || '').length === 32 && c.gt) headers['x-guest-token'] = c.gt;
        const tryFetch = async (u) => {
            const r = await fetch(u, { headers });
            if (!r.ok) return null;
            const detail = await r.json();
            const result = detail?.data?.tweetResult?.result;
            return result?.tweet || result || null;
        };
        for (let i = 0; i < order.length; i++) {
            const u = makeUrl(order[i]);
            const res = await tryFetch(u);
            if (res) return res;
        }
        return null;
    }

    function collectMediaFromTweetJson(json) {
        const list = [];
        if (!json) return list;
        const legacyMain = json?.legacy;
        const legacyQuoted = json?.quoted_status_result?.result?.legacy;
        const mainMedias = legacyMain?.extended_entities?.media || legacyMain?.media || [];
        const quotedMedias = legacyQuoted?.extended_entities?.media || legacyQuoted?.media || [];
        [...mainMedias, ...quotedMedias].forEach(media => {
            if (!media) return;
            if (media.type === 'photo') {
                const u = media.media_url_https || media.media_url;
                if (u) list.push({ url: getImageUrlWithOrig(u), ext: 'jpg' });
            } else if (media.type === 'video' || media.type === 'animated_gif') {
                const vars = Array.isArray(media.video_info?.variants) ? media.video_info.variants : [];
                const mp4s = vars.filter(v => (v.content_type || '').includes('mp4'));
                const best = mp4s.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0] || mp4s[0];
                if (best?.url) list.push({ url: best.url, ext: 'mp4' });
            }
        });
        return list;
    }

    async function apiBatchDownloadMedia() {
        cancelDownload = false;
        stopScroll = false;
        const username = getUsername();
        const bloggerName = getBloggerName();
        updateProgress('正在抓取媒体（API）...');
        progressBox.style.display = 'block';
        loadingPrompt.style.display = 'block';
        progressBarContainer.style.display = 'block';
        progressBar.style.width = '0%';
        const postIdSet = new Set();
        let scrollCount = 0, progress = 0, noNewCount = 0;
        const isMediaPage = location.pathname.endsWith('/media') || location.pathname.includes('/media');
        const maxScroll = config.imageMaxScrollCount;

        getPostIdsFromPage().forEach(id => postIdSet.add(id));
        updateProgress(`已找到${postIdSet.size}条推文（滚动0次）`);

        while (scrollCount < maxScroll && !cancelDownload && !stopScroll && noNewCount < config.noNewImageThreshold) {
            window.scrollBy({ top: Math.max(400, window.innerHeight * 0.9), behavior: 'smooth' });
            const wait = config.imageScrollInterval + (noNewCount > 0 ? 800 : 0);
            await waitInterruptible(wait);
            const prevIds = postIdSet.size;
            const prevMedia = getVisibleMediaCount();
            getPostIdsFromPage().forEach(id => postIdSet.add(id));
            const currIds = postIdSet.size;
            const currMedia = getVisibleMediaCount();
            progress = Math.min(Math.floor(((scrollCount + 1) / maxScroll) * 100), 100);
            progressBar.style.width = `${progress}%`;
            updateProgress(`已找到${currIds}条推文（滚动${scrollCount + 1}次）`);
            if (currIds === prevIds && currMedia === prevMedia) noNewCount++; else noNewCount = 0;
            scrollCount++;
        }

        const totalFound = postIdSet.size;
        let downloadedCountTotal = 0;
        if (config.saveHistory) {
            const hAll = loadHistory();
            downloadedCountTotal = Array.from(postIdSet).filter(id => hAll.downloaded[id]).length;
        }
        let idsAll = Array.from(postIdSet);
        if (config.saveHistory && config.skipDownloaded) {
            const h = loadHistory();
            idsAll = idsAll.filter(id => !h.downloaded[id]);
        }
        const ids = idsAll.slice(0, config.batchSize);
        if (ids.length === 0) {
            loadingPrompt.style.display = 'none';
            progressBarContainer.style.display = 'none';
            const downloadedCount = totalFound - idsAll.length;
            showDialog(`已找到${totalFound}条推文，其中${downloadedCount}条推文已下载。未找到未下载的推文。`, () => finishAndSave());
            return;
        }
        const tasks = [];
        for (let i = 0; i < ids.length; i++) {
            if (cancelDownload) break;
            const json = await fetchTweetJsonApi(ids[i]);
            const medias = collectMediaFromTweetJson(json);
            for (let j = 0; j < medias.length; j++) {
                const item = medias[j];
                const ext = item.ext || 'jpg';
                tasks.push({
                    url: item.url,
                    name: `${bloggerName}_${username}_img_${formatDate(new Date())}_${tasks.length + 1}.${ext}`,
                    statusId: `api_media_${ids[i]}_${j}`
                });
            }
            progressBar.style.width = `${Math.min(Math.floor(((i + 1) / ids.length) * 100), 100)}%`;
        }

        loadingPrompt.style.display = 'none';
        progressBarContainer.style.display = 'none';

        if (cancelDownload) {
            updateProgress('⏹️ 下载已取消');
            finishAndSave();
            return;
        }
        if (tasks.length === 0) {
            if (config.saveHistory && downloadedCountTotal === totalFound && totalFound > 0) {
                showDialog(`已找到${totalFound}条推文，其中${downloadedCountTotal}条推文已下载。未找到未下载的媒体。`, () => finishAndSave());
            } else {
                showDialog(lang.mediaNotFound, () => finishAndSave());
            }
            return;
        }
        updateProgress(`开始处理${tasks.length}个媒体（ZIP打包） | 正在后台下载，请不要关闭页面`);
        await Downloader.add(tasks);
        finishAndSave();
    }

    // 完成处理并清理
    function finishAndSave() {
        startBtn.disabled = false;
        cancelBtn.style.display = 'none';
        stopBtn.style.display = 'none';
        controlBar.style.display = 'none';

        hideTimeoutId = setTimeout(() => {
            progressBox.style.display = 'none';
            loadingPrompt.style.display = 'none';
            progressBarContainer.style.display = 'none';
        }, 5000);
    }

    // -------------------------- 按钮初始化 --------------------------
    const startBtn = document.createElement('button');
    startBtn.innerText = '下载图片（ZIP）';
    Object.assign(startBtn.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 10000,
        padding: '12px 20px',
        backgroundColor: '#1DA1F2',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        marginBottom: '10px'
    });
    startBtn.onclick = () => {
        clearTimeout(hideTimeoutId);
        startBtn.disabled = true;
        cancelBtn.style.display = 'block';
        stopBtn.style.display = 'block';
        controlBar.style.display = 'flex';
        autoScrollAndDownloadImages();
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.innerText = '❌ 取消';
    Object.assign(cancelBtn.style, {
        position: 'static',
        padding: '12px 20px',
        backgroundColor: '#ff4d4f',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        display: 'none',
        fontSize: '14px'
    });
    cancelBtn.onclick = () => {
        cancelDownload = true;
        Downloader.cancel();
        cancelBtn.innerText = '⏳ 停止中...';
        stopBtn.style.display = 'none';

        setTimeout(() => {
            startBtn.disabled = false;
            cancelBtn.innerText = '❌ 取消';
            cancelBtn.style.display = 'none';
            controlBar.style.display = 'none';
        }, 1000);
    };
    document.body.appendChild(startBtn);

    const stopBtn = document.createElement('button');
    stopBtn.innerText = '⏹️ 停止滚动';
    Object.assign(stopBtn.style, {
        position: 'static',
        padding: '12px 20px',
        backgroundColor: '#f5a623',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        display: 'none',
        fontSize: '14px'
    });
    stopBtn.onclick = () => {
        stopScroll = true;
        stopBtn.innerText = '⏳ 停止中...';
    };
    const controlBar = document.createElement('div');
    Object.assign(controlBar.style, {
        position: 'fixed',
        top: '70px',
        right: '20px',
        display: 'none',
        zIndex: 10000,
        gap: '8px'
    });
    controlBar.appendChild(cancelBtn);
    controlBar.appendChild(stopBtn);
    document.body.appendChild(controlBar);

    const apiBtn = document.createElement('button');
    apiBtn.innerText = 'API图片/视频（ZIP）';
    Object.assign(apiBtn.style, {
        position: 'fixed',
        top: '120px',
        right: '20px',
        zIndex: 10000,
        padding: '12px 20px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px'
    });
    apiBtn.onclick = async () => {
        clearTimeout(hideTimeoutId);
        await confirmDialog('⚠️ 提示：API 调用过多可能导致被官方封锁，出现无法访问任何推文的情况，请谨慎使用。点击“确定”继续');
        startBtn.disabled = true;
        cancelBtn.style.display = 'block';
        stopBtn.style.display = 'block';
        controlBar.style.display = 'flex';
        apiBatchDownloadMedia();
    };
    document.body.appendChild(apiBtn);

    const settingsBtn = document.createElement('button');
    settingsBtn.innerText = '⚙️ 设置';
    Object.assign(settingsBtn.style, {
        position: 'fixed',
        top: '170px',
        right: '20px',
        zIndex: 10000,
        padding: '10px 16px',
        backgroundColor: '#6c63ff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px'
    });

    const settingsDialog = document.createElement('div');
    Object.assign(settingsDialog.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '16px',
        backgroundColor: 'rgba(0,0,0,0.85)',
        color: '#fff',
        zIndex: 10001,
        borderRadius: '8px',
        display: 'none',
        minWidth: '320px'
    });

    function openSettings() {
        settingsDialog.innerHTML = `
            <div style="font-size:16px;margin-bottom:10px;">设置</div>
            <div style="display:grid;grid-template-columns: 1fr 1fr;gap:8px;align-items:center;">
                <div>最大下载数量</div><input id="xg_batch" type="number" min="1" value="${config.batchSize}" style="width:120px;color:#000"/>
                <div>滚动间隔(ms)</div><input id="xg_interval" type="number" min="200" value="${config.imageScrollInterval}" style="width:120px;color:#000"/>
                <div>最大滚动次数</div><input id="xg_maxscroll" type="number" min="1" value="${config.imageMaxScrollCount}" style="width:120px;color:#000"/>
                <div>滚动后等待(ms)</div><input id="xg_delay" type="number" min="0" value="${config.scrollDelay}" style="width:120px;color:#000"/>
                <div>无新内容阈值</div><input id="xg_nonew" type="number" min="1" value="${config.noNewImageThreshold}" style="width:120px;color:#000"/>
                <div>GraphQL QueryID</div><textarea id="xg_qids" rows="4" style="width:200px;color:#000" placeholder="每行一个">${(config.graphqlQueryIds||[]).join('\n')}</textarea>
                <div>包含默认QueryID</div><input id="xg_use_default" type="checkbox" ${config.useDefaultQueryIds ? 'checked' : ''} />
                <div style="grid-column: span 2; font-size:12px;opacity:0.85;">默认: ${DEFAULT_QUERY_IDS.join(', ')}</div>
                <div>下载并发数</div><input id="xg_conc" type="number" min="1" value="${config.downloadConcurrency}" style="width:120px;color:#000"/>
                <div>ZIP分包大小(MB)</div><input id="xg_zipmb" type="number" min="0" value="${config.zipChunkSizeMB}" style="width:120px;color:#000"/>
                <div>保存下载记录</div><input id="xg_save_hist" type="checkbox" ${config.saveHistory ? 'checked' : ''} />
                <div>跳过已下载推文</div><input id="xg_skip_dl" type="checkbox" ${config.skipDownloaded ? 'checked' : ''} />
            </div>
            <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px;">
                <button id="xg_save" style="padding:8px 12px;background:#1DA1F2;color:#fff;border:none;border-radius:6px;cursor:pointer;">保存</button>
                <button id="xg_reset" style="padding:8px 12px;background:#999;color:#fff;border:none;border-radius:6px;cursor:pointer;">恢复默认</button>
                <button id="xg_clear_hist" style="padding:8px 12px;background:#f33;color:#fff;border:none;border-radius:6px;cursor:pointer;">清除下载记录</button>
                <button id="xg_close" style="padding:8px 12px;background:#777;color:#fff;border:none;border-radius:6px;cursor:pointer;">关闭</button>
            </div>
        `;
        settingsDialog.style.display = 'block';
        settingsDialog.querySelector('#xg_close').onclick = () => { settingsDialog.style.display = 'none'; };
        const resetEl = settingsDialog.querySelector('#xg_reset');
        if (resetEl) {
            resetEl.onclick = () => {
                config.graphqlQueryIds = [];
                config.useDefaultQueryIds = true;
                try { localStorage.setItem('xg_config', JSON.stringify(config)); } catch (e) {}
                const ta = settingsDialog.querySelector('#xg_qids');
                const cb = settingsDialog.querySelector('#xg_use_default');
                if (ta) ta.value = '';
                if (cb) cb.checked = true;
            };
        }
        const clearHistEl = settingsDialog.querySelector('#xg_clear_hist');
        if (clearHistEl) {
            clearHistEl.onclick = () => {
                clearHistory();
                updateProgress('下载记录已清除');
                setTimeout(() => { progressBox.style.display = 'none'; }, 1500);
            };
        }
        settingsDialog.querySelector('#xg_save').onclick = () => {
            const b = parseInt(settingsDialog.querySelector('#xg_batch').value, 10);
            const i = parseInt(settingsDialog.querySelector('#xg_interval').value, 10);
            const m = parseInt(settingsDialog.querySelector('#xg_maxscroll').value, 10);
            const d = parseInt(settingsDialog.querySelector('#xg_delay').value, 10);
            const n = parseInt(settingsDialog.querySelector('#xg_nonew').value, 10);
            const raw = settingsDialog.querySelector('#xg_qids').value || '';
            const arr = raw.split(/[\n,]+/).map(x => x.trim()).filter(x => x.length > 0);
            const conc = parseInt(settingsDialog.querySelector('#xg_conc').value, 10);
            const zmb = parseInt(settingsDialog.querySelector('#xg_zipmb').value, 10);
            if (b > 0) config.batchSize = b;
            if (i > 0) config.imageScrollInterval = i;
            if (m > 0) config.imageMaxScrollCount = m;
            if (d >= 0) config.scrollDelay = d;
            if (n > 0) config.noNewImageThreshold = n;
            if (arr.length) config.graphqlQueryIds = arr; else config.graphqlQueryIds = [];
            const useDefEl = settingsDialog.querySelector('#xg_use_default');
            if (useDefEl) config.useDefaultQueryIds = !!useDefEl.checked;
            if (conc > 0) config.downloadConcurrency = conc;
            if (zmb >= 0) config.zipChunkSizeMB = zmb;
            const saveHistEl = settingsDialog.querySelector('#xg_save_hist');
            const skipDlEl = settingsDialog.querySelector('#xg_skip_dl');
            if (saveHistEl) config.saveHistory = !!saveHistEl.checked;
            if (skipDlEl) config.skipDownloaded = !!skipDlEl.checked;
            try { localStorage.setItem('xg_config', JSON.stringify(config)); } catch (e) {}
            settingsDialog.style.display = 'none';
            updateProgress('设置已保存');
            setTimeout(() => { progressBox.style.display = 'none'; }, 1500);
        };
    }

    settingsBtn.onclick = () => { openSettings(); };
    document.body.appendChild(settingsBtn);
    document.body.appendChild(settingsDialog);

    // -------------------------- 初始化 --------------------------
    (async () => {
        await initBaseConfig();
        updateProgress('准备就绪：点击下载图片开始');
        hideTimeoutId = setTimeout(() => {
            progressBox.style.display = 'none';
        }, 3000);
    })();
})();
