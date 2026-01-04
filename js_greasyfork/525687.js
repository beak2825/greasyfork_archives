// ==UserScript==
// @name         图片打包下载（测试）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  支持终止下载的图片打包工具
// @author       110532
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/525687/%E5%9B%BE%E7%89%87%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%EF%BC%88%E6%B5%8B%E8%AF%95%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/525687/%E5%9B%BE%E7%89%87%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%EF%BC%88%E6%B5%8B%E8%AF%95%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========================
    // 工具函数
    // ========================
    const Utils = {
        safeQuerySelector: (selector) => {
            try {
                return document.querySelector(selector)?.textContent.trim() || '未命名';
            } catch {
                return '未命名';
            }
        }
    };

    // ========================
    // 核心下载控制器
    // ========================
    class DownloadController {
        constructor() {
            this.abortController = new AbortController();
            this.isDownloading = false;
        }

        async batchDownload(urls, progressCallback, batchSize = 5) {
            this.isDownloading = true;
            const zip = new JSZip();

            try {
                let allImageUrls = [];
                for (const url of urls) {
                    const imageUrls = await this.getPageImageUrls(url);
                    allImageUrls.push(...imageUrls);
                }

                const total = allImageUrls.length;
                let completed = 0;

                for (let i = 0; i < allImageUrls.length; i += batchSize) {
                    if (!this.isDownloading) break;

                    const batch = allImageUrls.slice(i, i + batchSize);
                    const results = await Promise.all(
                        batch.map((url, idx) =>
                            this.addImageToZip(zip, url, i + idx + 1)
                        )
                    );

                    completed += results.filter(success => success).length;
                    progressCallback(completed, total);
                }

                return this.isDownloading ? zip : null;
            } finally {
                this.isDownloading = false;
            }
        }

        async getPageImageUrls(url) {
            try {
                const response = await fetch(url, {
                    signal: this.abortController.signal
                });
                const html = await response.text();
                const doc = new DOMParser().parseFromString(html, 'text/html');
                return Array.from(doc.querySelectorAll('.content_left img')).map(img => img.src);
            } catch (error) {
                if (error.name !== 'AbortError') console.error('页面解析失败:', error);
                return [];
            }
        }

        async addImageToZip(zip, url, index) {
            try {
                const response = await fetch(url, {
                    signal: this.abortController.signal
                });
                const blob = await response.blob();
                zip.file(`第${index}张.jpg`, blob);
                return true;
            } catch (error) {
                if (error.name !== 'AbortError') console.error('图片下载失败:', error);
                return false;
            }
        }

        abort() {
            if (this.isDownloading) {
                this.abortController.abort();
                this.isDownloading = false;
                this.abortController = new AbortController();
            }
        }
    }

    // ========================
    // 增强版用户界面
    // ========================
    const UI = {
        createDownloadButton: () => {
            const btn = document.createElement('button');
            btn.innerHTML = '📦 打包下载';
            Object.assign(btn.style, {
                position: 'fixed',
                top: '60px',
                right: '10px',
                zIndex: 1001,
                padding: '12px 24px',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                boxShadow: '0 4px 20px rgba(76,175,80,0.3)',
                transform: 'translateY(0)'
            });

            // 按钮悬停效果
            btn.addEventListener('mouseover', () => {
                btn.style.transform = 'translateY(-1px)';
                btn.style.boxShadow = '0 6px 24px rgba(76,175,80,0.4)';
            });
            btn.addEventListener('mouseout', () => {
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = '0 4px 20px rgba(76,175,80,0.3)';
            });

            return btn;
        },

        createProgressBar: () => {
            const container = document.createElement('div');
            Object.assign(container.style, {
                position: 'fixed',
                top: '100px',
                right: '10px',
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(12px) saturate(180%)',
                WebkitBackdropFilter: 'blur(12px) saturate(180%)',
                padding: '15px 20px',
                borderRadius: '12px',
                width: '280px',
                zIndex: 1000,
                boxShadow: '0 8px 32px rgba(31,38,135,0.15)',
                border: '1px solid rgba(255,255,255,0.18)'
            });

            const progressTrack = document.createElement('div');
            Object.assign(progressTrack.style, {
                height: '24px',
                backgroundColor: 'rgba(0,0,0,0.1)',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative'
            });

            const progressBar = document.createElement('div');
            Object.assign(progressBar.style, {
                height: '100%',
                width: '0%',
                background: 'linear-gradient(90deg, #4CAF50 0%, #45a049 100%)',
                borderRadius: '10px',
                transition: 'width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                position: 'relative',
                boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.2)'
            });

            // 流动光效
            const lightEffect = document.createElement('div');
            Object.assign(lightEffect.style, {
                position: 'absolute',
                top: '0',
                left: '-100%',
                width: '50%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                animation: 'lightFlow 2s infinite'
            });
            progressBar.appendChild(lightEffect);

            const text = document.createElement('div');
            Object.assign(text.style, {
                textAlign: 'center',
                marginTop: '12px',
                color: '#4a4a4a',
                fontSize: '14px',
                fontWeight: '500',
                textShadow: '0 1px 2px rgba(255,255,255,0.3)'
            });

            // 插入CSS动画
            const style = document.createElement('style');
            style.textContent = `
                @keyframes lightFlow {
                    0% { left: -100%; }
                    100% { left: 200%; }
                }
            `;
            document.head.appendChild(style);

            progressTrack.appendChild(progressBar);
            container.appendChild(progressTrack);
            container.appendChild(text);

            return { container, progressBar, text };
        },

        updateButtonState: (btn, state) => {
            const baseStyle = {
                transform: 'translateY(0)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease'
            };

            switch(state) {
                case 'downloading':
                    Object.assign(btn.style, {
                        ...baseStyle,
                        background: 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)',
                        boxShadow: '0 4px 20px rgba(255,68,68,0.3)'
                    });
                    btn.innerHTML = '⏹️ 取消下载';
                    break;
                case 'default':
                    Object.assign(btn.style, {
                        ...baseStyle,
                        background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                        boxShadow: '0 4px 20px rgba(76,175,80,0.3)'
                    });
                    btn.innerHTML = '📦 打包下载';
                    break;
                case 'disabled':
                    btn.style.filter = 'grayscale(0.8) opacity(0.7)';
                    btn.style.pointerEvents = 'none';
                    break;
                case 'enabled':
                    btn.style.filter = 'none';
                    btn.style.pointerEvents = 'auto';
                    break;
            }
        }
    };

    // ========================
    // 主程序
    // ========================
    function main() {
        const downloadController = new DownloadController();
        const downloadBtn = UI.createDownloadButton();
        document.body.appendChild(downloadBtn);

        downloadBtn.addEventListener('click', async () => {
            if (downloadController.isDownloading) {
                downloadController.abort();
                return;
            }

            const progress = UI.createProgressBar();
            document.body.appendChild(progress.container);
            UI.updateButtonState(downloadBtn, 'downloading');

            try {
                const pageLinks = Array.from(document.querySelectorAll('.content_left a'))
                    .map(link => link.href)
                    .slice(0, -1);

                const zip = await downloadController.batchDownload(
                    pageLinks,
                    (current, total) => {
                        const percent = Math.round((current / total) * 100);
                        progress.progressBar.style.width = `${percent}%`;
                        progress.text.textContent = `下载进度：${current}/${total} (${percent}%)`;
                    }
                );

                if (zip) {
                    const albumName = Utils.safeQuerySelector('.item_title h1');
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(await zip.generateAsync({ type: 'blob' }));
                    link.download = `${albumName}.zip`;
                    link.click();
                    URL.revokeObjectURL(link.href);
                }
            } catch (error) {
                console.error('下载失败:', error);
                if (error.name !== 'AbortError') alert('下载失败：' + error.message);
            } finally {
                progress.container.remove();
                UI.updateButtonState(downloadBtn, 'default');
            }
        });
    }

    main();
})();