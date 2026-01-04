// ==UserScript==
// @name         图片下载优化版
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  高效下载网页图片，支持过滤和重试机制
// @author       Negronis
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543263/%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/543263/%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置参数
    const CONFIG = {
        downloadDelay: 800, // 下载间隔(毫秒)
        maxRetries: 2, // 最大重试次数
        minFileSize: 1024, // 最小文件大小(字节)
        buttonPosition: 'tr', // 按钮位置: tl(左上), tr(右上), bl(左下), br(右下)
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp']
    };

    // 样式表
    GM_addStyle(`
        #imageDownloaderBtn {
            position: fixed;
            z-index: 99999;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: #2d8cf0;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            font-size: 24px;
            font-weight: bold;
            opacity: 0.85;
            transition: all 0.3s;
            user-select: none;
        }
        #imageDownloaderBtn:hover {
            opacity: 1;
            transform: scale(1.1);
        }
        #imageDownloaderBtn.downloading {
            background: #ff9900;
            animation: pulse 1.5s infinite;
        }
        #imageDownloaderProgress {
            position: fixed;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
            z-index: 99998;
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    `);

    // 图片收集函数
    function collectImages() {
        const images = document.querySelectorAll('img');
        const urlMap = new Map();
        const result = [];

        images.forEach(img => {
            try {
                let src = img.src || img.dataset.src || '';
                if (!src) return;

                // 处理相对路径
                if (!src.startsWith('http') && !src.startsWith('data:')) {
                    src = new URL(src, window.location.href).href;
                }

                // 过滤无效图片
                if (src.startsWith('data:')) {
                    console.debug('跳过base64图片:', src.slice(0, 50));
                    return;
                }
                //过滤4khd
                if (img.getAttribute('class') != null && location.href.indexOf('4khd') != -1) {
                    console.debug('跳过4kHD图片:', src.slice(0, 50));
                    return
                }
                // 去重处理
                if (!urlMap.has(src)) {
                    urlMap.set(src, true);

                    // 从URL提取可能的文件名
                    const fileName = extractFilenameFromUrl(src);
                    result.push({
                        url: src,
                        name: fileName
                    });
                }
            } catch (e) {
                console.error('处理图片出错:', e);
            }
        });

        return {
            title: document.title.replace(/[^\w\u4e00-\u9fa5]/g, ' ').substring(0, 50),
            list: result
        };
    }

    // 从URL提取文件名
    function extractFilenameFromUrl(url) {
        try {
            return document.getElementsByTagName("title")[0].innerHTML
        } catch (e) {
            return 'image.jpg';
        }
    }

    // 获取文件扩展名
    function getFileExtension(contentType, url) {
        const mimeMap = {
            'image/jpeg': '.jpg',
            'image/png': '.png',
            'image/webp': '.webp',
            'image/gif': '.gif',
            'image/bmp': '.bmp',
            'image/svg+xml': '.svg'
        };

        // 优先使用Content-Type
        if (contentType && mimeMap[contentType.split(';')[0]]) {
            return mimeMap[contentType.split(';')[0]];
        }

        // 从URL提取扩展名
        const urlExt = url.substring(url.lastIndexOf('.')).toLowerCase();
        if (urlExt.match(/\.(jpe?g|png|webp|gif|bmp|svg)/)) {
            return urlExt.substring(0, 20); // 限制扩展名长度
        }

        return '.jpg'; // 默认扩展名
    }

    // 清理文件名
    function sanitizeFilename(name) {
        return name.replace(/[\/\\:*?"<>|]/g, '')
            .replace(/\s+/g, ' ')
            .substring(0, 100); // 限制文件名长度
    }

    // 图片下载主函数
    async function downloadImages(imagesData) {
        const total = imagesData.list.length;
        if (total === 0) {
            GM_notification({
                text: '未找到可下载的图片',
                title: '图片下载'
            });
            return;
        }

        btn.classList.add('downloading');
        createProgressBar(total);

        let successCount = 0;
        let skipCount = 0;

        for (const [index, item] of imagesData.list.entries()) {
            updateProgressBar(index + 1, total);

            let retry = 0;
            let downloaded = false;

            while (retry <= CONFIG.maxRetries && !downloaded) {
                try {
                    const response = await fetch(item.url, {
                        referrerPolicy: 'no-referrer'
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }

                    // 检查文件类型
                    const contentType = response.headers.get('Content-Type') || '';
                    if (!CONFIG.allowedTypes.some(t => contentType.includes(t))) {
                        console.warn(`跳过不支持的图片类型: ${contentType}`);
                        skipCount++;
                        break;
                    }

                    // 检查文件大小
                    const contentLength = parseInt(response.headers.get('Content-Length') || '0');
                    if (contentLength < CONFIG.minFileSize) {
                        console.warn(`跳过小文件: ${contentLength}字节`);
                        skipCount++;
                        break;
                    }

                    const blob = await response.blob();
                    const ext = getFileExtension(contentType, item.url);

                    // 生成安全的文件名
                    let filename = sanitizeFilename(item.name + index);
                    if (!filename.endsWith(ext)) {
                        filename += ext;
                    }

                    // 创建下载链接
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = filename;
                    link.style.display = 'none';
                    document.body.appendChild(link);
                    link.click();

                    // 清理资源
                    setTimeout(() => {
                        document.body.removeChild(link);
                        URL.revokeObjectURL(link.href);
                    }, 100);

                    successCount++;
                    downloaded = true;

                    // 下载成功日志
                    console.log(`[${index + 1}/${total}] 下载成功: ${filename}`);

                } catch (error) {
                    if (retry === CONFIG.maxRetries) {
                        console.error(`[${index + 1}] 下载失败: ${item.url}`, error);
                    }
                    retry++;
                }

                // 重试延迟
                if (!downloaded && retry <= CONFIG.maxRetries) {
                    await delay(CONFIG.downloadDelay * (retry + 1));
                }
            }

            // 下载间隔
            if (index < total - 1) {
                await delay(CONFIG.downloadDelay);
            }
        }

        // 完成处理
        removeProgressBar();
        btn.classList.remove('downloading');

        // 结果通知
        const msg = `成功下载 ${successCount} 张图片，跳过 ${skipCount} 张`;
        GM_notification({
            title: '图片下载完成',
            text: msg,
            timeout: 5000
        });
        console.log(msg);
    }

    // 工具函数
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    // 进度条功能
    function createProgressBar(total) {
        removeProgressBar();
        const progress = document.createElement('div');
        progress.id = 'imageDownloaderProgress';
        progress.textContent = `准备下载 0/${total}...`;
        document.body.appendChild(progress);
    }

    function updateProgressBar(current, total) {
        const progress = document.getElementById('imageDownloaderProgress');
        if (progress) {
            progress.textContent = `下载中 ${current}/${total}...`;
        }
    }

    function removeProgressBar() {
        const progress = document.getElementById('imageDownloaderProgress');
        if (progress) progress.remove();
    }

    // 创建下载按钮
    function createButton() {
        if (document.getElementById('imageDownloaderBtn')) return;

        const btn = document.createElement('div');
        btn.id = 'imageDownloaderBtn';
        btn.textContent = '↓';
        btn.title = '下载页面图片';

        // 设置按钮位置
        const positions = {
            tl: {
                top: '20px',
                left: '20px'
            },
            tr: {
                top: '20px',
                right: '20px'
            },
            bl: {
                bottom: '20px',
                left: '20px'
            },
            br: {
                bottom: '20px',
                right: '20px'
            }
        };

        Object.assign(btn.style, positions[CONFIG.buttonPosition]);

        btn.addEventListener('click', async () => {
            const imagesData = collectImages();
            if (imagesData.list.length === 0) {
                GM_notification({
                    text: '未找到可下载的图片',
                    title: '图片下载'
                });
                return;
            }

            if (confirm(`找到 ${imagesData.list.length} 张图片，是否开始下载？`)) {
                await downloadImages(imagesData);
            }
        });

        document.body.appendChild(btn);
        return btn;
    }

    // 初始化
    let btn = null;
    window.addEventListener('load', () => {
        btn = createButton();

        // 保存配置到GM存储
        const savedConfig = GM_getValue('imageDownloaderConfig');
        if (savedConfig) Object.assign(CONFIG, savedConfig);
    });
})();