// ==UserScript==
// @name         Quip Downloader
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  快速下載quip表格
// @author       Moz
// @match        https://quip-amazon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546245/Quip%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/546245/Quip%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isDownloading = false;
    let currentProgress = { current: 0, total: 0, sheetName: '' };

    // 創建緊湊下載器
    function createCompactDownloader() {
        // --- 解決問題 1 & 2 的核心改動 ---
        // 檢查下載按鈕是否已存在，如果存在則不重複創建
        if (document.getElementById('quip-compact-downloader')) {
            return;
        }

        // 找到目標容器
        const buttonsContainer = document.querySelector('.buttons[role="group"]');
        if (!buttonsContainer) {
            return; // 如果容器不存在，則直接返回，等待下一次 MutationObserver 觸發
        }

        // --- 改動：精確查找「共享」按鈕 ---
        let shareButton = null;
        const allButtons = buttonsContainer.querySelectorAll('button, .button'); // 獲取容器內所有可能的按鈕元素
        for (const btn of allButtons) {
            if (btn.textContent.includes('共享')) {
                shareButton = btn;
                break; // 找到後就停止搜索
            }
        }

        // 如果找不到「共享」按鈕，則無法繼續
        if (!shareButton) {
            return;
        }
        // --- 改動結束 ---

        // 創建下載器容器
        const downloaderContainer = document.createElement('div');
        downloaderContainer.id = 'quip-compact-downloader';
        downloaderContainer.style.cssText = `
            position: relative !important;
            display: inline-flex !important;
            flex-direction: column !important;
            align-items: center !important;
            margin-left: 8px !important;
            margin-right: 8px !important;
        `;

        // 創建下載按鈕
        const downloadButton = document.createElement('button');
        downloadButton.id = 'compactDownloadBtn';
        downloadButton.className = 'button button-flex clickable';
        downloadButton.setAttribute('data-mousedown', 'no-caret-move');
        downloadButton.setAttribute('aria-label', '下載所有工作表');
        downloadButton.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
            border: none !important;
            height: 32px !important;
            padding: 0 12px !important;
            border-radius: 6px !important;
            font-size: 12px !important;
            font-weight: 500 !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3) !important;
            white-space: nowrap !important;
            min-width: 60px !important;
        `;
        downloadButton.textContent = '🚀下載';

        // 添加懸停效果
        downloadButton.addEventListener('mouseenter', () => {
            if (!isDownloading) {
                downloadButton.style.transform = 'translateY(-1px)';
                downloadButton.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
            } else {
                downloadButton.style.cursor = 'not-allowed';
            }
            showTooltip();
        });

        downloadButton.addEventListener('mouseleave', () => {
            if (!isDownloading) {
                downloadButton.style.transform = 'translateY(0)';
                downloadButton.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
            }
            hideTooltip();
        });

        // 創建進度條容器
        const progressContainer = document.createElement('div');
        progressContainer.id = 'compactProgressContainer';
        progressContainer.style.cssText = `
            position: absolute !important;
            bottom: -6px !important;
            left: 0 !important;
            right: 0 !important;
            height: 3px !important;
            background: rgba(255,255,255,0.2) !important;
            border-radius: 2px !important;
            overflow: hidden !important;
            display: none !important;
            cursor: pointer !important;
        `;

        // 創建進度條
        const progressBar = document.createElement('div');
        progressBar.id = 'compactProgressBar';
        progressBar.style.cssText = `
            height: 100% !important;
            width: 0% !important;
            background: linear-gradient(90deg, #00f260, #0575e6) !important;
            transition: width 0.3s ease !important;
            border-radius: 2px !important;
        `;

        // 創建tooltip
        const tooltip = document.createElement('div');
        tooltip.id = 'progressTooltip';
        tooltip.style.cssText = `
            position: absolute !important;
            bottom: 8px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            background: rgba(0,0,0,0.8) !important;
            color: white !important;
            padding: 6px 10px !important;
            border-radius: 4px !important;
            font-size: 11px !important;
            white-space: nowrap !important;
            pointer-events: none !important;
            opacity: 0 !important;
            transition: opacity 0.3s ease !important;
            z-index: 1000000 !important;
            backdrop-filter: blur(10px) !important;
        `;

        // 組裝元素
        progressContainer.appendChild(progressBar);
        downloaderContainer.appendChild(downloadButton);
        downloaderContainer.appendChild(progressContainer);
        downloaderContainer.appendChild(tooltip);

        // --- 改動：插入到精確找到的共享按鈕右側 ---
        shareButton.parentNode.insertBefore(downloaderContainer, shareButton.nextSibling);

        // 綁定事件
        downloadButton.addEventListener('click', startCompactDownload);

        // 進度條tooltip事件
        progressContainer.addEventListener('mouseenter', showTooltip);
        progressContainer.addEventListener('mouseleave', hideTooltip);
    }

    // 顯示tooltip
    function showTooltip() {
        const tooltip = document.getElementById('progressTooltip');
        if (tooltip) {
            if (isDownloading) {
                tooltip.textContent = `下載中... ${currentProgress.current}/${currentProgress.total} - ${currentProgress.sheetName}`;
            } else {
                tooltip.textContent = '點擊下載所有工作表';
            }
            tooltip.style.opacity = '1';
        }
    }

    // 隱藏tooltip
    function hideTooltip() {
        const tooltip = document.getElementById('progressTooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
        }
    }

    // 生成智能文件名 - 只使用 sheet name
    function generateSmartFileName(documentTitle, sheetName) {
        const cleanSheetName = sheetName
            .replace(/[<>:"/\\|?*]/g, '-')
            .replace(/\s+/g, '_')
            .substring(0, 50);

        return `${cleanSheetName}.csv`;
    }

    // 創建智能下載
    function createSmartDownload(fileName, downloadUrl) {
        return new Promise((resolve) => {
            try {
                fetch(downloadUrl)
                    .then(response => {
                        if (!response.ok) throw new Error(`HTTP ${response.status}`);
                        return response.blob();
                    })
                    .then(blob => {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = url;
                        a.download = fileName;

                        document.body.appendChild(a);
                        a.click();

                        setTimeout(() => {
                            document.body.removeChild(a);
                            window.URL.revokeObjectURL(url);
                        }, 1000);

                        resolve(true);
                    })
                    .catch(() => {
                        const iframe = document.createElement('iframe');
                        iframe.style.display = 'none';
                        iframe.src = downloadUrl;
                        document.body.appendChild(iframe);

                        setTimeout(() => {
                            if (document.body.contains(iframe)) {
                                document.body.removeChild(iframe);
                            }
                        }, 5000);

                        resolve(false);
                    });

            } catch (error) {
                resolve(false);
            }
        });
    }

    // 更新進度
    function updateProgress(current, total, currentSheetName) {
        const progressContainer = document.getElementById('compactProgressContainer');
        const progressBar = document.getElementById('compactProgressBar');
        const percentage = Math.round((current / total) * 100);
        currentProgress = { current, total, sheetName: currentSheetName };
        if (progressContainer && progressBar) {
            progressContainer.style.display = 'block';
            progressBar.style.width = percentage + '%';
        }
    }

    // 完成下載
    function completeDownload(successCount, totalCount) {
        const progressContainer = document.getElementById('compactProgressContainer');
        const downloadBtn = document.getElementById('compactDownloadBtn');
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
        if (downloadBtn) {
            downloadBtn.disabled = false;
            downloadBtn.textContent = '🚀下載';
            downloadBtn.style.opacity = '1';
            downloadBtn.style.cursor = 'pointer';
            downloadBtn.style.transform = 'translateY(0)';
            downloadBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            downloadBtn.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
            downloadBtn.textContent = '✅完成';
            downloadBtn.style.background = 'linear-gradient(135deg, #00f260, #0575e6)';
            setTimeout(() => {
                downloadBtn.textContent = '🚀下載';
                downloadBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            }, 2000);
        }
        isDownloading = false;
    }

    // 開始緊湊下載
    async function startCompactDownload() {
        if (isDownloading) return;
        const downloadBtn = document.getElementById('compactDownloadBtn');
        isDownloading = true;
        downloadBtn.disabled = true;
        downloadBtn.textContent = '下載中';
        downloadBtn.style.opacity = '0.6';
        downloadBtn.style.cursor = 'not-allowed';
        downloadBtn.style.transform = 'translateY(0)';
        downloadBtn.style.background = 'linear-gradient(135deg, #999, #666)';
        downloadBtn.style.boxShadow = 'none';
        try {
            const documentTitle = document.title.replace(' - Quip', '').trim();
            const baseApiUrl = 'https://quip-amazon.com/-/csv/HIX9BAqP16Z';
            const baseTableId = 'temp:C:HIXa331c657862841f0a84ca12c0';
            const sheets = [];
            const sheetTabs = document.querySelectorAll('.editor-spreadsheet-footer-tab');
            sheetTabs.forEach((tab, index) => {
                const nameElement = tab.querySelector('.editor-spreadsheet-footer-tab-text');
                if (nameElement) {
                    const sheetName = nameElement.textContent.trim();
                    const fileName = generateSmartFileName(documentTitle, sheetName);
                    sheets.push({
                        index: index,
                        originalName: sheetName,
                        fileName: fileName,
                        element: tab
                    });
                }
            });
            if (sheets.length === 0) {
                completeDownload(0, 0);
                return;
            }
            let successCount = 0;
            for (let i = 0; i < sheets.length; i++) {
                const sheet = sheets[i];
                updateProgress(i, sheets.length, sheet.originalName);
                try {
                    sheet.element.click();
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    const downloadUrl = `${baseApiUrl}?download&table_id=${encodeURIComponent(baseTableId)}`;
                    const success = await createSmartDownload(sheet.fileName, downloadUrl);
                    if (success) {
                        successCount++;
                    }
                    updateProgress(i + 1, sheets.length, sheet.originalName);
                } catch (error) {
                    // silent error
                }
                if (i < sheets.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }
            }
            completeDownload(successCount, sheets.length);
        } catch (error) {
            completeDownload(0, 0);
        }
    }

    // --- 改動：使用 MutationObserver 來初始化 ---
    function init() {
        // 配置觀察器
        const observerOptions = {
            childList: true, // 觀察目標節點的子節點變化
            subtree: true    // 觀察所有後代節點
        };

        // 創建觀察器實例，並指定回調函數
        const observer = new MutationObserver((mutationsList, obs) => {
            // 在每次DOM變化時，嘗試創建下載器
            // 這樣即使頁面內容是動態加載的，也能捕捉到目標元素出現的時機
            createCompactDownloader();
        });

        // 開始觀察 body 元素的變化
        observer.observe(document.body, observerOptions);

        // 同時，在頁面載入完成後也嘗試運行一次，以防觀察器錯過初始狀態
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createCompactDownloader);
        } else {
            createCompactDownloader();
        }
    }

    // 啟動
    init();

})();