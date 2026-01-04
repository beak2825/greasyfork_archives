// ==UserScript==
// @name         Dribbble 下载器 | Dribbble Scraper | 批量下载
// @namespace    http://tampermonkey.net/
// @version      2.1.1
// @description  一键抓取并批量下载Dribbble上的图片与视频，支持多线程下载和carousel多图下载，支持跨页面自动重置状态
// @author       Eddie7x
// @license      MIT
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABMLAAATCwAAAAAAAAAAAADin/7/4p/+/8J43P+ILp3/iC6d/61dxP/inv7/45/+/+Oe/v/inv7/4Z/9/9+g/v/fof7/36D+/9+g/v/gn/7/45/+/+Of/v/in/7/pVO7/4gunf+HLZz/um3S/+Ke/v/jn/7/45/+/+Kf/v/goP7/36f9/9+h/v/OoOj/4J/+/+Of/v/jn/7/45/+/92Z+f+XQqz/iS6d/4gunP+3ac//4p7+/+Ke/v/jn/7/4Z/+/9+q/P/gyvb/lJye/+Gt+//jn/7/45/+/+Of/v/in/7/2JPz/5Q+qv+JLp3/iC2c/6ZTvP/clvf/4p7+/+Gp/P/ftPr/3+nu/8rU1//cqvX/45/+/+Of/v/jn/7/45/+/+Oe/v/alPX/m0aw/4kunf+ILZz/jzaj/7xv1f/gpfr/4df0/7S9wP/d5+v/rYDD/+Of/v/jn/7/45/+/+Of/v/jn/7/457+/+Cc/P+vX8b/iC6c/4gtnf+ILZz/ol+2/97d7v+hqav/ubTH/7aBzf/in/7/45/+/+Of/v/jn/7/45/+/+Oe/v/jnv7/4p7+/86G6P+cR7H/hy2c/51YsP+knLD/kZWa/3NIgP+KPp7/45/+/+Of/v/jn/7/45/+/+Of/v/jn/7/45/+/+Of/v/inv7/4p7+/8+P5/+gT7b/0tTf/087Vv9zK4T/iS2d/+Kf/v/inv7/4Z39/92Y+f/emfn/4p79/+Ke/v/inv7/4p7+/+Om/f/jqf3/p1q8/654v/+KR5z/o1+4/6lYv/+gTLf/kTqn/4gunv+ILZ3/hy2c/4kunf+SO6f/ok+5/7hq0P/Vju//0Ynr/4gtnP+ILp3/rmTE/9KU6//in/7/iTCf/4owoP+KMJ//iTCe/4ovn/+JL5//iS+f/4kvnv+JLp7/iC2c/400ov+JLp3/jjWi/92X9//Wl/D/3Zv4/6JPuP+zZcv/v3PY/8R63v/Ded3/vXHW/7FhyP+eSrT/ijCf/4kunv+JLp7/iS6e/5Q9qf/RiOv/4p7+/+Kf/v/in/7/4p/+/+Kf/v/jn/7/4p/+/+Oe/v/inv7/4p7+/8J32/+ILZz/iS6e/4kunv+JLp7/iS+e/7hr0f/inv3/45/+/+Of/v/jn/7/4p/+/+Of/v/inv7/4p7+/8h+4f+LMqH/iS+e/5E5pv+6bdL/jjWj/4gunv+ILZ3/qVjA/+Of/v/jn/7/45/+/+Oe/v/inv7/4p7+/7ls0v+KMZ//iS+e/442o//Riev/4p7+/9iS8/+bRrH/iS6e/4kunv/in/7/4p/+/+Kf/v/inv7/1I3v/6BNt/+JMJ7/ijCf/5E6p//Qiev/4p7+/+Ke/v/inv3/3pv7/6JQuf+JL57/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @match        https://dribbble.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/541290/Dribbble%20%E4%B8%8B%E8%BD%BD%E5%99%A8%20%7C%20Dribbble%20Scraper%20%7C%20%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/541290/Dribbble%20%E4%B8%8B%E8%BD%BD%E5%99%A8%20%7C%20Dribbble%20Scraper%20%7C%20%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
      .dribbble-scraper { position: fixed; bottom: 20px; right: 20px; z-index: 9999; background: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); padding: 15px; border: 1px solid #eee; }
      .scraper-btn { padding: 8px 16px; background: #4285f4; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; margin-right: 8px; transition: background 0.2s; }
      .scraper-btn:hover { background: #3367d6; }
      .scraper-btn:disabled { background: #cccccc; cursor: not-allowed; }
      .scraper-status { margin-top: 10px; font-size: 13px; color: #555; }
      .scraper-result { margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee; font-size: 13px; }
      .found-count { color: #3498db; font-weight: bold; }
      .image-count { color: #2ecc71; font-weight: bold; }
      .video-count { color: #9b59b6; font-weight: bold; }
      .error-count { color: #e74c3c; font-weight: bold; }
      .scraper-notice { font-size: 11px; color: #6c757d; font-style: italic; }

      /* 优化的并发控制样式 */
      .concurrency-control {
        margin-top: 6px;
        font-size: 13px;
        padding: 6px 8px;
        background-color: #f8f9fa;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 8px;
        border: 1px solid #e9ecef;
      }
      .concurrency-label {
        color: #495057;
        font-weight: 500;
        white-space: nowrap;
      }
      .concurrency-select {
        height: 40px;
        padding: 5px 30px 5px 10px;
        border: 1px solid #ced4da;
        border-radius: 4px;
        background-color: white;
        font-size: 13px;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23495057' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 8px center;
        cursor: pointer;
        transition: border-color 0.2s;
      }
      .concurrency-select:hover {
        border-color: #adb5bd;
      }
      .concurrency-select:focus {
        outline: none;
        border-color: #4285f4;
        box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.25);
      }
      .concurrency-hint {
        font-size: 11px;
        color: #6c757d;
        margin-top: 5px;
        font-style: italic;
      }
    `);

    const uiEl = document.createElement('div');
    uiEl.className = 'dribbble-scraper';
    uiEl.innerHTML = `
      <button id="scrapeBtn" class="scraper-btn">抓取媒体</button>
      <button id="downloadBtn" class="scraper-btn" disabled>批量下载</button>
      <div id="statusEl" class="scraper-status">准备就绪</div>
      <div id="resultEl" class="scraper-result"></div>
      <div class="concurrency-control">
        <span class="concurrency-label">下载线程数:</span>
        <select id="concurrencySelect" class="concurrency-select">
          <option value="5">默认</option>
          <option value="1">最稳定</option>
          <option value="10">快速</option>
          <option value="20">专用速率</option>
        </select>
      </div>
      <div class="concurrency-hint">根据网络状况调整，不稳定时建议降低</div>
      <div class="scraper-notice">请选择不包含其他文件夹的路径保存</div>
    `;
    document.body.appendChild(uiEl);

    const scrapeBtn = document.getElementById('scrapeBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const statusEl = document.getElementById('statusEl');
    const resultEl = document.getElementById('resultEl');
    const concurrencySelect = document.getElementById('concurrencySelect');

    // 检测页面是否存在carousel展示方式
    function hasCarousel() {
        const carouselSelectors = [
            '.carousel',
            '[data-carousel]',
            '.slick-slider',
            '.slideshow',
            '.shot-thumbnails',
            '.gallery-carousel',
            '.shots-carousel'
        ];

        return carouselSelectors.some(selector => {
            return document.querySelector(selector) !== null;
        });
    }

    // 清理文件名
    function sanitizeFilename(name, maxLen = 70) {
        const lastDotIndex = name.lastIndexOf('.');
        let baseName = name;
        let ext = '';

        if (lastDotIndex !== -1 && lastDotIndex < name.length - 1) {
            baseName = name.substring(0, lastDotIndex);
            ext = name.substring(lastDotIndex);
        }

        const sanitizedBase = baseName
            .replace(/[<>:"/\\|?*\n\r]+/g, '')
            .trim()
            .replace(/\s+/g, '_')
            .substring(0, maxLen);

        return sanitizedBase + ext;
    }

    // 标准化URL
    function normalizeUrl(url, isVideo = false) {
        if (!isVideo && url.includes('dribbble.com')) {
            url = url.replace(/_[0-9]+x[0-9]+(\.\w+)$/, '$1');
            url = url.replace('/mini_square/', '/');
            url = url.replace('/small/', '/');
            url = url.replace('/normal/', '/');
            url = url.replace('/teaser/', '/');
        }
        else if (isVideo) {
            url = url.split('?')[0];
        }
        return url;
    }

    // 判断元素是否为缩略图
    function isThumbnail(element) {
        const className = (element.className || '').toString().toLowerCase();
        if (className.includes('thumbnail') ||
            className.includes('thumb') ||
            className.includes('mini') ||
            className.includes('small') ||
            className.includes('teaser')) {
            return true;
        }

        let parent = element.parentElement;
        for (let i = 0; i < 3; i++) {
            if (!parent) break;
            const parentClass = (parent.className || '').toString().toLowerCase();
            if (parentClass.includes('thumbnail') ||
                parentClass.includes('thumb') ||
                parentClass.includes('preview')) {
                return true;
            }
            parent = parent.parentElement;
        }

        if (element.tagName === 'IMG') {
            const width = element.naturalWidth || element.width || 0;
            const height = element.naturalHeight || element.height || 0;
            if (width < 500 && height < 500) {
                return true;
            }
        }

        return false;
    }

    // 提取图片和视频URL，为carousel图片添加序号
    function extractMediaUrls() {
        statusEl.textContent = "正在解析页面...";

        const carouselExists = hasCarousel();
        if (carouselExists) {
            statusEl.textContent = "检测到carousel展示方式，仅抓取原图并自动编号";
        }

        // 每次抓取都重新初始化计数器
        let mediaId = 1;
        let carouselImageCounter = 1;

        // 优化媒体元素选择逻辑
        const mediaElements = [];

        // 1. 优先处理carousel容器
        if (carouselExists) {
            const selectors = ['.shot-thumbnails', '.carousel', '[data-carousel]'];
            selectors.forEach(selector => {
                const container = document.querySelector(selector);
                if (container) {
                    const images = container.querySelectorAll("img[src], img[srcset], [data-src], [data-srcset]");
                    const videos = container.querySelectorAll("video source, video[src], [data-video-url]");
                    mediaElements.push(...images, ...videos);
                }
            });
        }

        // 2. 补充提取页面其他可能的媒体容器
        const mainContainers = [
            '.shot-page-container',
            '.gridshots',
            '.shots',
            '.shot-details',
            '.main-content',
            'article'
        ];

        mainContainers.forEach(selector => {
            const container = document.querySelector(selector);
            if (container) {
                const images = container.querySelectorAll("img[src], img[srcset], [data-src], [data-srcset]");
                const videos = container.querySelectorAll("video source, video[src], [data-video-url]");
                mediaElements.push(...images, ...videos);
            }
        });

        // 3. 备份方案
        if (mediaElements.length === 0) {
            const images = document.querySelectorAll("img[src], img[srcset], [data-src], [data-srcset]");
            const videos = document.querySelectorAll("video source, video[src], [data-video-url]");
            mediaElements.push(...images, ...videos);
        }

        // 去重逻辑
        const uniqueUrls = new Set();
        const uniqueElements = [];

        mediaElements.forEach(element => {
            const url = element.src || element.dataset.src || element.srcset || element.dataset.srcset || '';
            if (!uniqueUrls.has(url)) {
                uniqueUrls.add(url);
                uniqueElements.push(element);
            }
        });

        const mediaUrls = {
            images: [],
            videos: []
        };

        uniqueElements.forEach(element => {
            if (carouselExists && !element.tagName.match(/VIDEO|SOURCE/) && isThumbnail(element)) {
                return;
            }

            let url;
            let isVideo = false;

            if (element.tagName === 'SOURCE' || element.tagName === 'VIDEO' || element.hasAttribute('data-video-url')) {
                isVideo = true;

                if (element.hasAttribute('data-video-url')) {
                    url = element.getAttribute('data-video-url');
                } else if (element.src) {
                    url = element.src;
                } else if (element.dataset.src) {
                    url = element.dataset.src;
                }
            }
            else {
                // 提取最高质量图片
                if (element.dataset.srcset) {
                    const srcsetEntries = element.dataset.srcset.split(',').map(entry => {
                        const [url, size] = entry.trim().split(' ');
                        return { url, size: parseInt(size) || 0 };
                    });
                    srcsetEntries.sort((a, b) => b.size - a.size);
                    url = srcsetEntries[0].url;
                } else if (element.dataset.src) {
                    url = element.dataset.src;
                } else if (element.srcset) {
                    const srcsetEntries = element.srcset.split(',').map(entry => {
                        const [url, size] = entry.trim().split(' ');
                        return { url, size: parseInt(size) || 0 };
                    });
                    srcsetEntries.sort((a, b) => b.size - a.size);
                    url = srcsetEntries[0].url;
                } else if (element.src) {
                    url = element.src;
                }
            }

            // 验证URL有效性
            if (url && url.startsWith('http')) {
                if (!url.includes('placeholder') &&
                    !url.includes('avatar') &&
                    !url.includes('sprite') &&
                    !url.includes('logo') &&
                    !url.includes('badge') &&
                    !url.includes('favicon')) {

                    const normalizedUrl = normalizeUrl(url, isVideo);

                    if (isVideo) {
                        if (!mediaUrls.videos.some(v => v.url === normalizedUrl)) {
                            mediaUrls.videos.push({
                                url: normalizedUrl,
                                mediaId: mediaId++
                            });
                        }
                    } else {
                        if (!mediaUrls.images.some(i => i.url === normalizedUrl)) {
                            mediaUrls.images.push({
                                url: normalizedUrl,
                                mediaId: mediaId++,
                                carouselIndex: carouselExists ? carouselImageCounter++ : null
                            });
                        }
                    }
                }
            }
        });

        const title = sanitizeFilename(document.title || 'Dribbble-Media');
        GM_setValue('lastScrapeData', {
            title,
            images: mediaUrls.images,
            videos: mediaUrls.videos,
            totalCount: mediaUrls.images.length + mediaUrls.videos.length
        });

        // 更新结果显示
        resultEl.innerHTML = `✅ 抓取到 <span class="image-count">${mediaUrls.images.length} 张图片</span> 和 <span class="video-count">${mediaUrls.videos.length} 个视频</span>`;
        if (carouselExists) {
            resultEl.innerHTML += "（已过滤缩略图）";
        }
        statusEl.textContent = "抓取完成";
        downloadBtn.disabled = (mediaUrls.images.length === 0 && mediaUrls.videos.length === 0);
    }

    // 获取文件扩展名
    function getFileExtension(url, contentType, isVideo = false) {
        if (contentType) {
            const mimeType = contentType.toLowerCase();
            if (isVideo) {
                if (mimeType.includes('video/mp4')) return 'mp4';
                if (mimeType.includes('video/webm')) return 'webm';
                if (mimeType.includes('video/quicktime')) return 'mov';
                if (mimeType.includes('video/ogg')) return 'ogg';
            } else {
                if (mimeType.includes('image/jpeg') || mimeType.includes('image/pjpeg')) return 'jpg';
                if (mimeType.includes('image/png')) return 'png';
                if (mimeType.includes('image/gif')) return 'gif';
                if (mimeType.includes('image/webp')) return 'webp';
                if (mimeType.includes('image/svg')) return 'svg';
            }
        }

        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname.toLowerCase();
            const lastDotIndex = pathname.lastIndexOf('.');

            if (lastDotIndex !== -1 && lastDotIndex < pathname.length - 1) {
                let ext = pathname.substring(lastDotIndex + 1).toLowerCase();
                if (ext.length <= 5) {
                    return ext;
                }
            }
        } catch (e) {
            console.log('解析URL获取扩展名失败:', e);
        }

        return isVideo ? 'mp4' : 'jpg';
    }

    // 批量下载媒体文件，支持并发控制
    async function downloadMediaFiles(data) {
        const { title, images, videos, totalCount } = data;
        const total = totalCount;

        if (total === 0) {
            statusEl.textContent = "没有可下载的媒体文件";
            return;
        }

        // 获取用户选择的并发数
        const concurrency = parseInt(concurrencySelect.value) || 2;

        let directoryHandle;
        let useFallback = false;

        try {
            directoryHandle = await window.showDirectoryPicker({
                mode: 'readwrite'
            });
        } catch (err) {
            console.log("文件夹选择错误:", err);

            if (err.name === 'AbortError') {
                statusEl.textContent = "未选择文件夹，下载已取消";
                return;
            } else {
                statusEl.textContent = "无法访问所选文件夹，将使用默认下载路径";
                useFallback = true;
                alert("无法访问所选文件夹，将使用浏览器默认下载路径。");
            }
        }

        let completed = 0;
        let errors = 0;
        let index = 0;

        // 创建下载队列
        const mediaList = [
            ...images.map(item => ({
                url: item.url,
                type: 'image',
                mediaId: item.mediaId,
                carouselIndex: item.carouselIndex
            })),
            ...videos.map(item => ({
                url: item.url,
                type: 'video',
                mediaId: item.mediaId,
                carouselIndex: null
            }))
        ];

        mediaList.sort((a, b) => a.mediaId - b.mediaId);

        statusEl.textContent = `开始下载 ${total} 个媒体文件（并发数: ${concurrency}）...`;

        // 创建信号量控制并发
        const semaphore = new Semaphore(concurrency);
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        // 并发下载处理函数
        async function processQueue() {
            while (index < total) {
                const i = index++;
                const media = mediaList[i];

                // 获取信号量许可
                await semaphore.acquire();

                try {
                    // 为不同批次的下载添加基础延迟，减少冲突
                    const batchDelay = Math.floor(i / concurrency) * 300;
                    await delay(batchDelay);

                    await downloadMedia(media, i);
                } catch (e) {
                    console.error(`下载失败 [${i+1}]:`, media.url, e);
                    errors++;
                    updateStatus();
                } finally {
                    // 释放信号量
                    semaphore.release();
                }
            }
        }

        // 单个媒体下载函数
        async function downloadMedia(media, i) {
            const { url, type, mediaId, carouselIndex } = media;
            const isVideo = type === 'video';

            const res = await fetch(url, {
                headers: {
                    'User-Agent': navigator.userAgent,
                    'Accept': isVideo ? 'video/*' : 'image/*',
                    'Referer': 'https://dribbble.com/'
                },
                mode: 'cors',
                cache: 'no-store'
            });

            if (!res.ok) {
                throw new Error(`HTTP错误: ${res.status}`);
            }

            const contentType = res.headers.get('content-type') || '';
            const ext = getFileExtension(url, contentType, isVideo);

            const typePrefix = isVideo ? 'video' : 'image';
            let sequenceNumber;

            if (carouselIndex !== null) {
                sequenceNumber = carouselIndex;
            } else {
                sequenceNumber = mediaId;
            }

            // 生成绝对唯一的文件名（结合媒体ID和并发批次）
            const batchId = Math.floor(i / concurrency);
            const baseFileName = `${title}_${typePrefix}_${String(sequenceNumber).padStart(3, '0')}_b${batchId}`;
            let fullFileName = `${baseFileName}.${ext}`;
            const sanitizedFileName = sanitizeFilename(fullFileName);

            // 检查文件是否已存在
            if (!useFallback && directoryHandle) {
                try {
                    await directoryHandle.getFileHandle(sanitizedFileName);
                    // 如果存在，添加随机字符串确保唯一性
                    const randomStr = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
                    fullFileName = `${baseFileName}_${randomStr}.${ext}`;
                    fullFileName = sanitizeFilename(fullFileName);
                } catch (e) {
                    // 文件不存在，使用原始文件名
                }
            }

            const blob = await res.blob();

            if (useFallback || !directoryHandle) {
                const objectUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = objectUrl;
                a.download = fullFileName;
                document.body.appendChild(a);

                requestAnimationFrame(() => {
                    a.click();
                    setTimeout(() => {
                        document.body.removeChild(a);
                        URL.revokeObjectURL(objectUrl);
                    }, 300);
                });
            } else {
                const fileHandle = await directoryHandle.getFileHandle(fullFileName, { create: true });
                const writable = await fileHandle.createWritable();
                await writable.write(blob);
                await writable.close();
            }

            completed++;
            updateStatus();
        }

        // 更新状态显示
        function updateStatus() {
            statusEl.textContent = `下载进度：${completed}/${total}`;
            resultEl.innerHTML = `成功: ${completed}, 失败: <span class="error-count">${errors}</span>, 总计: ${total}`;
        }

        try {
            // 创建并发工作线程
            const workers = Array(concurrency).fill().map(processQueue);
            await Promise.all(workers);

            if (completed === 0) {
                statusEl.textContent = "❌ 所有媒体文件下载失败";
            } else {
                statusEl.textContent = `✅ 下载完成：成功 ${completed} 个，失败 ${errors} 个`;
            }
        } catch (err) {
            console.error("下载过程出错:", err);
            statusEl.textContent = `❌ 下载出错: ${err.message}`;
        }
    }

    // 信号量类，控制并发数量
    class Semaphore {
        constructor(limit) {
            this.limit = limit;
            this.count = 0;
            this.queue = [];
        }

        async acquire() {
            if (this.count < this.limit) {
                this.count++;
                return;
            }
            return new Promise(resolve => this.queue.push(resolve));
        }

        release() {
            if (this.queue.length > 0) {
                const resolve = this.queue.shift();
                resolve();
            } else {
                this.count--;
            }
        }
    }

    scrapeBtn.addEventListener('click', () => extractMediaUrls());
    downloadBtn.addEventListener('click', async () => {
        const data = GM_getValue('lastScrapeData');
        if (!data || (!data.images.length && !data.videos.length)) {
            statusEl.textContent = "请先抓取媒体文件";
            return;
        }

        downloadBtn.disabled = true;
        scrapeBtn.disabled = true;
        await downloadMediaFiles(data);
        downloadBtn.disabled = false;
        scrapeBtn.disabled = false;
    });

    console.log("[Dribbble Scraper v2.1.1] 已加载");
})();
