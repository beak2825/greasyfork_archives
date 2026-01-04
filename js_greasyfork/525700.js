// ==UserScript==
// @name         小雅增强工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  支持进度显示的智能下载工具
// @author       leng
// @match        https://whut.ai-augmented.com/app/jx-web/mycourse/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_setClipboard
// @connect      *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/525700/%E5%B0%8F%E9%9B%85%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/525700/%E5%B0%8F%E9%9B%85%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 样式常量
    const UI_STYLE = {
        button: {
            base: `position:fixed;left:10px;z-index:9999;padding:8px 16px;
                   color:white;border:none;border-radius:4px;cursor:pointer;
                   box-shadow:0 2px 5px rgba(0,0,0,0.2);transition:all 0.3s;
                   font-family:system-ui,sans-serif;`,
            copy: '#4CAF50',
            download: '#2196F3'
        },
        progress: `width:300px;background:rgba(0,0,0,0.9);border-radius:8px;
                  padding:15px;color:white;z-index:10000;backdrop-filter:blur(5px);
                  position:fixed;`, // 动态计算位置
        progressBar: `height:20px;background:#333;border-radius:10px;overflow:hidden;`,
        progressFill: `width:0%;height:100%;background:#4CAF50;
                      transition:width 0.3s ease;border-radius:10px;`
    };

    // 创建控制按钮
    function createButton(text, top, color, id) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.id = id; // 添加唯一标识
        btn.style.cssText = `${UI_STYLE.button.base}top:${top};background:${color};`;

        // 动态效果
        btn.addEventListener('mouseover', () => {
            btn.style.background = shadeColor(color, -20);
            btn.style.transform = 'translateY(-2px)';
        });
        btn.addEventListener('mouseout', () => {
            btn.style.background = color;
            btn.style.transform = 'none';
        });

        return btn;
    }

    // 颜色处理函数
    function shadeColor(hex, percent) {
        const f = parseInt(hex.slice(1), 16);
        const t = percent < 0 ? 0 : 255;
        const p = percent < 0 ? percent * -1 : percent;
        const r = f >> 16;
        const g = f >> 8 & 0x00FF;
        const b = f & 0x0000FF;
        return `#${(0x1000000 +
            (Math.round((t - r) * p) + r) * 0x10000 +
            (Math.round((t - g) * p) + g) * 0x100 +
            (Math.round((t - b) * p) + b)).toString(16).slice(1)}`;
    }

    // 进度管理器
    const ProgressManager = {
        create() {
            const container = document.createElement('div');

            // 动态定位到下载按钮下方
            const downloadBtn = document.getElementById('download-btn');
            if (downloadBtn) {
                const rect = downloadBtn.getBoundingClientRect();
                container.style.cssText = `${UI_STYLE.progress}
                    top: ${rect.bottom + 10}px;
                    left: ${rect.left}px;
                `;
            }

            const title = document.createElement('div');
            title.textContent = '🚀 下载进度';
            title.style.marginBottom = '10px';

            const barContainer = document.createElement('div');
            barContainer.style.cssText = UI_STYLE.progressBar;

            const barFill = document.createElement('div');
            barFill.style.cssText = UI_STYLE.progressFill;

            const text = document.createElement('div');
            text.style.cssText = 'margin-top:8px;font-size:12px;text-align:center;';

            barContainer.appendChild(barFill);
            container.append(title, barContainer, text);

            return {
                container,
                update(loaded, total) {
                    const percent = total > 0 ? (loaded / total * 100).toFixed(1) : '--';
                    barFill.style.width = `${percent}%`;
                    text.textContent = total > 0
                        ? `${this.formatSize(loaded)} / ${this.formatSize(total)} (${percent}%)`
                        : `正在接收数据: ${this.formatSize(loaded)}`;
                },
                remove() {
                    setTimeout(() => container.remove(), 3000); // 保留3秒显示
                },
                formatSize(bytes) {
                    if (bytes === 0) return '0 B';
                    const units = ['B', 'KB', 'MB', 'GB'];
                    const exp = Math.floor(Math.log(bytes) / Math.log(1024));
                    return `${(bytes / 1024 ** exp).toFixed(1)} ${units[exp]}`;
                }
            };
        }
    };

    // 智能文件名获取
    function getFileName(url) {
        try {
            // 优先从h5元素获取
            const h5 = document.querySelector('h5');
            if (h5?.textContent) {
                let name = h5.textContent
                    .replace(/[\x00-\x1F\x7F<>:"/\\|?*]/g, '')
                    .replace(/\s+/g, ' ')
                    .trim()
                    .slice(0, 255);

                // 补充扩展名
                if (!/\.\w+$/.test(name)) {
                    const ext = url.split('.').pop().split(/[?#]/)[0];
                    name += `.${ext || 'mp4'}`;
                }
                return name;
            }
        } catch (e) {
            console.warn('文件名解析失败:', e);
        }

        // 从URL获取备用名称
        try {
            const path = new URL(url).pathname.split('/').pop();
            return path || `video_${Date.now()}.mp4`;
        } catch {
            return `video_${Date.now()}.mp4`;
        }
    }

    // 下载处理器
    const Downloader = {
        async start(videoUrl) {
            const progress = ProgressManager.create();
            document.body.appendChild(progress.container);

            try {
                await this.xhrDownload(videoUrl, progress);
            } catch (err) {
                progress.remove();
                this.showError('下载失败', err);
            }
        },

        // 精确下载（XHR）
        async xhrDownload(url, progress) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    responseType: 'blob',
                    onprogress: (e) => {
                        progress.update(e.loaded, e.total);
                    },
                    onload: (res) => {
                        if (res.status >= 400) return reject(new Error(res.statusText));

                        const blob = res.response;
                        const objectURL = URL.createObjectURL(blob);

                        // 使用原生下载方式
                        const a = document.createElement('a');
                        a.href = objectURL;
                        a.download = getFileName(url);
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(() => {
                            document.body.removeChild(a);
                            URL.revokeObjectURL(objectURL);
                        }, 100);

                        progress.remove();
                        this.showSuccess('下载完成');
                        resolve();
                    },
                    onerror: reject
                });
            });
        },

        // GM下载
        async gmDownload(url, progress) {
            let lastSize = 0;
            const checkProgress = setInterval(() => {
                GM_info.getDownloadStatus((status) => {
                    if (status?.finalized) return;
                    const received = status?.received || 0;
                    progress.update(received, status?.total || 0);
                });
            }, 1000);

            return new Promise((resolve, reject) => {
                GM_download({
                    url: url,
                    name: getFileName(url),
                    onload: () => {
                        clearInterval(checkProgress);
                        progress.remove();
                        this.showSuccess('下载完成');
                        resolve();
                    },
                    onerror: (err) => {
                        clearInterval(checkProgress);
                        reject(err);
                    }
                });
            });
        },

        // 降级下载
        fallbackDownload(url, progress) {
            const a = document.createElement('a');
            a.href = url;
            a.download = getFileName(url);
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            progress.update(0, 0);
            setTimeout(() => progress.remove(), 3000);
        },

        showSuccess(msg) {
            const toast = document.createElement('div');
            toast.textContent = `✅ ${msg}`;
            this.showToast(toast, '#4CAF50');
        },

        showError(msg, err) {
            const toast = document.createElement('div');
            toast.textContent = `❌ ${msg}: ${err?.message || err}`;
            this.showToast(toast, '#f44336');
            console.error(err);
        },

        showToast(element, color) {
            element.style.cssText = `position:fixed;top:100px;left:50%;
                transform:translateX(-50%);padding:12px 24px;color:white;
                background:${color};border-radius:4px;box-shadow:0 2px 10px rgba(0,0,0,0.2);
                animation:fadein 0.3s, fadeout 0.3s 2s;z-index:10000;`;
            document.body.appendChild(element);
            setTimeout(() => element.remove(), 2300);
        }
    };

    // 主初始化
    function init() {
        // 创建按钮
        const copyBtn = createButton('复制链接', '20px', UI_STYLE.button.copy, 'copy-btn');
        const downloadBtn = createButton('下载视频', '70px', UI_STYLE.button.download, 'download-btn');

        // 获取可用的媒体URL
        function getMediaUrl() {
            // 视频、文档、图片链接
            return document.querySelector('video[src]')?.src ||
                document.querySelector('#file_preview')?.src ||
                document.querySelector('.xy_cropper img')?.src;
        }

        // 按钮事件
        copyBtn.addEventListener('click', () => {
            const url = getMediaUrl();
            if (url) {
                try {
                    GM_setClipboard(url, 'text');
                    Downloader.showSuccess('链接已复制');
                } catch (err) {
                    Downloader.showError('复制失败', err);
                }
            } else {
                Downloader.showError('未找到视频链接', null);
            }
        });

        downloadBtn.addEventListener('click', () => {
            const video = document.querySelector('video[src]');
            if (video) Downloader.start(video.src);
            else Downloader.showError('未找到视频', null);
        });

        // 动态显示控制
        const observer = new MutationObserver(() => {
            const hasVideo = !!document.querySelector('video[src]');
            downloadBtn.style.display = hasVideo ? 'block' : 'none';
        });
        observer.observe(document.body, { subtree: true, childList: true });

        // 注入样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadein { from { opacity:0; } to { opacity:1; } }
            @keyframes fadeout { from { opacity:1; } to { opacity:0; } }
        `;
        document.head.appendChild(style);

        // 初始状态
        document.body.append(copyBtn, downloadBtn);
        downloadBtn.style.display = 'none';
    }

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();