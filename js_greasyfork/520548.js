// ==UserScript==
// @license             MIT
// @name         NewsBank Document Downloader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Download documents from NewsBank Advanced Search Results
// @author       powcai
// @match        https://infoweb-newsbank-com.du.idm.oclc.org/*
// @match        *://*.newsbank.com/*
// @match        *://*.idm.oclc.org/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/520548/NewsBank%20Document%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/520548/NewsBank%20Document%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        .download-all-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            z-index: 9999;
        }
        .single-download-btn {
            background-color: #2196F3;
            color: white;
            padding: 5px 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
        }
        .download-status {
            color: #666;
            margin-left: 10px;
            font-size: 12px;
        }
    `);

    // 下载单个文档
    // 获取所有cookie

    // 修改后的下载函数
    async function downloadDocument(docref, statusElement) {
        try {
            if (statusElement) {
                statusElement.textContent = '准备下载...';
            }
            const cookieString = document.cookie; // 获取当前页面的cookie
            const formData = new FormData();
            formData.append('ssl', 'true');
            formData.append('url', docref);
            formData.append('rem', 'readex_drupal');
            formData.append('image', 'x-large');
            formData.append('max_width', '2600');
            console.log(docref)

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://infoweb-newsbank-com.du.idm.oclc.org/apps/readex/nb-pdf/sitelinks',
                    data: formData,
                    responseType: 'blob',
                    headers: {
                        'Accept': '*/*',
                        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                        'Origin': 'https://infoweb-newsbank-com.du.idm.oclc.org',
                        'Cookie': cookieString,
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 Edg/132.0.0.0'
                    },
                    withCredentials: true,
                    onload: function(response) {
                        if (response.status === 200) {
                            const contentType = response.responseHeaders.match(/content-type:\s*(.*?)(?:\r\n|\n|$)/i)?.[1] || '';
                            if (contentType.includes('application/pdf')) {
                                const blob = new Blob([response.response], { type: 'application/pdf' });
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `newsbank-doc-${Date.now()}.pdf`;
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                                a.remove();
                                if (statusElement) {
                                    statusElement.textContent = '下载完成';
                                    statusElement.style.color = '#4CAF50';
                                }
                                resolve();
                            } else {
                                if (statusElement) {
                                    statusElement.textContent = '下载失败: 非PDF文件';
                                    statusElement.style.color = '#f44336';
                                }
                                reject(new Error('下载失败: 非PDF文件'));
                            }
                        } else {
                            if (statusElement) {
                                statusElement.textContent = '下载失败: ' + response.status;
                                statusElement.style.color = '#f44336';
                            }
                            reject(new Error('下载失败: ' + response.status));
                        }
                    },
                    onerror: function(error) {
                        console.error('下载请求失败:', error);
                        if (statusElement) {
                            statusElement.textContent = '下载失败: 网络错误';
                            statusElement.style.color = '#f44336';
                        }
                        reject(error);
                    }
                });
            });
        } catch (error) {
            console.error('下载过程出错:', error);
            if (statusElement) {
                statusElement.textContent = '下载失败: ' + error.message;
                statusElement.style.color = '#f44336';
            }
            throw error;
        }
    }

    // 添加下载按钮到每个搜索结果
    function addDownloadButtons() {
        const searchHits = document.querySelectorAll('div[id^="search-hit--"]');

        searchHits.forEach(hit => {
            // 检查是否已经添加了下载按钮
            if (hit.querySelector('.single-download-btn')) {
                return;
            }

            const docref = hit.getAttribute('data-docref');
            if (!docref) return;

            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.alignItems = 'center';

            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'single-download-btn';
            downloadBtn.textContent = '下载文档';

            const status = document.createElement('span');
            status.className = 'download-status';

            buttonContainer.appendChild(downloadBtn);
            buttonContainer.appendChild(status);
            hit.appendChild(buttonContainer);

            downloadBtn.onclick = async () => {
                try {
                    await downloadDocument(docref, status);
                } catch (error) {
                    console.error('单个文档下载失败:', error);
                }
            };
        });
    }

    // 添加批量下载按钮
    function addBatchDownloadButton() {
        if (document.querySelector('.download-all-btn')) {
            return;
        }

        const batchButton = document.createElement('button');
        batchButton.className = 'download-all-btn';
        batchButton.textContent = '批量下载全部';
        document.body.appendChild(batchButton);

        batchButton.onclick = async () => {
            const searchHits = document.querySelectorAll('div[id^="search-hit--"]');
            let delay = 0;

            for (const hit of searchHits) {
                const docref = hit.getAttribute('data-docref');
                if (!docref) continue;

                const status = hit.querySelector('.download-status');

                // 使用延时避免同时发送太多请求
                setTimeout(async () => {
                    try {
                        await downloadDocument(docref, status);
                    } catch (error) {
                        console.error('批量下载过程中出错:', error);
                    }
                }, delay);

                delay += 2000; // 每个下载间隔2秒
            }
        };
    }

    // 监听页面变化
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                addDownloadButtons();
                addBatchDownloadButton();
            }
        }
    });

    // 初始化
    function initialize() {
        addDownloadButtons();
        addBatchDownloadButton();

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();