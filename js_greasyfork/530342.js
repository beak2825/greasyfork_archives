// ==UserScript==
// @name         Honeycome Auto Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  全自动翻页下载器（支持跨页持续下载）
// @author       Grok
// @match        *://honeycome-uploader.illgames.jp/list/chara*
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      honeycome-uploader.illgames.jp
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/530342/Honeycome%20Auto%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/530342/Honeycome%20Auto%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 样式配置
    GM_addStyle(`
        #autoDownloadBtn {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.3s;
        }
        #autoDownloadBtn:hover { background: #45a049; }
        #autoDownloadBtn.disabled {
            background: #666 !important;
            cursor: not-allowed;
        }
    `);

    // 主程序
    window.addEventListener('load', function() {
        const STATE = {
            isDownloading: GM_getValue('autoDownload', false),
            currentPage: GM_getValue('currentPage', 1),
            totalDownloaded: GM_getValue('totalDownloaded', 0)
        };

        // 创建控制按钮
        const btn = createControlButton();
        let observer = null;

        // 自动启动检测
        if (STATE.isDownloading) {
            startDownloadProcess();
        }

        function createControlButton() {
            const button = document.createElement('button');
            button.id = 'autoDownloadBtn';
            updateButtonState(button);

            button.addEventListener('click', () => {
                if (!STATE.isDownloading) {
                    STATE.isDownloading = true;
                    STATE.currentPage = 1;
                    STATE.totalDownloaded = 0;
                    GM_setValue('autoDownload', true);
                    startDownloadProcess();
                } else {
                    stopDownloadProcess();
                }
                updateButtonState(button);
            });

            document.body.appendChild(button);
            return button;
        }

        async function startDownloadProcess() {
            btn.classList.add('disabled');
            initMutationObserver();

            try {
                const links = await waitForLinks();
                STATE.totalDownloaded += links.length;
                await processDownloads(links);

                const nextPage = getNextPageLink();
                if (nextPage) {
                    GM_setValue('currentPage', STATE.currentPage + 1);
                    window.location.href = nextPage;
                } else {
                    finalizeDownload();
                }
            } catch (error) {
                console.error('下载流程出错:', error);
                stopDownloadProcess();
            }
        }

        function stopDownloadProcess() {
            STATE.isDownloading = false;
            GM_setValue('autoDownload', false);
            if (observer) observer.disconnect();
            updateButtonState(btn);
            btn.classList.remove('disabled');
        }

        function finalizeDownload() {
            stopDownloadProcess();
            GM_setValue('totalDownloaded', 0);
            alert(`全部下载完成！共下载 ${STATE.totalDownloaded} 个文件`);
        }

        // 工具函数
        function initMutationObserver() {
            observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.addedNodes.length) {
                        console.log('检测到DOM变化，重新扫描下载链接...');
                    }
                });
            });
            observer.observe(document.body, { subtree: true, childList: true });
        }

        function waitForLinks() {
            return new Promise(resolve => {
                const checkLinks = () => {
                    const links = [...document.querySelectorAll('a[title="クリックしてダウンロード"]')];
                    if (links.length > 0) {
                        console.log(`找到 ${links.length} 个下载链接`);
                        resolve(links);
                    } else {
                        setTimeout(checkLinks, 1000);
                    }
                };
                checkLinks();
            });
        }

        async function processDownloads(links) {
            for (const [index, link] of links.entries()) {
                const url = link.href;
                const filename = `${STATE.currentPage}_${index}_${url.split('/').pop().split('&')[0]}`;

                btn.textContent = `下载中 ${index+1}/${links.length} (共${STATE.totalDownloaded}个)`;
                await downloadWithRetry(url, filename);
                await new Promise(resolve => setTimeout(resolve, 2500)); // 节流控制
            }
        }

        async function downloadWithRetry(url, filename, retries = 3) {
            try {
                await new Promise((resolve, reject) => {
                    GM_download({
                        url: url,
                        name: filename,
                        onload: resolve,
                        onerror: err => reject(err)
                    });
                });
                console.log(`✓ 成功下载: ${filename}`);
            } catch (error) {
                if (retries > 0) {
                    console.warn(`⚠ 重试下载 (${4-retries}/3): ${filename}`);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    return downloadWithRetry(url, filename, retries - 1);
                }
                throw new Error(`× 下载失败: ${filename} (${error})`);
            }
        }

        function getNextPageLink() {
            const nextBtn = document.querySelector('.pager__link--next:not(.disable)');
            return nextBtn ? nextBtn.href : null;
        }

        function updateButtonState(button) {
            button.textContent = STATE.isDownloading
                ? `停止下载 (已下载 ${STATE.totalDownloaded} 个)`
                : '开始自动下载';
            button.style.backgroundColor = STATE.isDownloading ? '#666' : '#4CAF50';
        }
    });
})();