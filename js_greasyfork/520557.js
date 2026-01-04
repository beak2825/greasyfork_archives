// ==UserScript==
// @name         ProQuest Document & Video Downloader
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  下载 ProQuest 的 PDF 文档和视频
// @author       pocai
// @match        https://www.proquest.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/520557/ProQuest%20Document%20%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/520557/ProQuest%20Document%20%20Video%20Downloader.meta.js
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
        .download-video-all-btn {
            position: fixed;
            top: 70px;
            right: 20px;
            background-color: #2196F3;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            z-index: 9999;
        }
        .single-download-btn, .single-video-btn {
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

    // 获取视频的 m3u8 地址
    async function getM3U8Url(videoPageUrl) {
        try {
            const response = await fetch(videoPageUrl);
            const html = await response.text();

            // 从页面提取参数
            const specMatch = html.match(/const spec = ({.*?});/);
            if (!specMatch) throw new Error('未找到视频参数');

            const spec = JSON.parse(specMatch[1]);
            const params = {
                identifier: spec.videoTitleId,
                TOTP: `account_id=${spec.accountId}&app_id=${spec.appId}&object_id=${spec.objectId}&token=${spec.token}&usage_group_id=${spec.usageGroupId}`
            };

            // 发送 GraphQL 请求获取 m3u8 地址
            const graphqlResponse = await fetch('https://video.alexanderstreet.com/api/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `query ($identifier: String, $TOTP: String) {
                        readMediaObject(identifier: $identifier, TOTP: $TOTP) {
                            content {
                                ... on Video {
                                    media {
                                        file
                                    }
                                }
                            }
                        }
                    }`,
                    variables: params
                })
            });

            const data = await graphqlResponse.json();
            const mediaList = data.data.readMediaObject.content.media;
            if (!mediaList || !mediaList.length) throw new Error('未找到媒体文件');

            return mediaList[0].file;
        } catch (error) {
            console.error('获取M3U8地址失败:', error);
            throw error;
        }
    }

    // 保存 m3u8 文件
    async function saveM3U8File(url, fileName) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Accept': '*/*',
                    'Origin': 'https://www.proquest.com',
                    'Referer': 'https://www.proquest.com/'
                }
            });
            const content = await response.text();

            const blob = new Blob([content], { type: 'application/x-mpegURL' });
            const downloadUrl = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl);

            return true;
        } catch (error) {
            console.error('保存M3U8文件失败:', error);
            throw error;
        }
    }

    // 添加视频下载按钮
    function addVideoDownloadButtons() {
        const resultItems = document.querySelectorAll('li.resultItem');
        resultItems.forEach(item => {
            const videoContainer = item.querySelector('.videoThumbnailContainer');
            if (!videoContainer || item.querySelector('.single-video-btn')) return;

            const titleElement = item.querySelector('.truncatedResultsTitle');
            let fileName = 'video.m3u8';
            if (titleElement) {
                fileName = titleElement.textContent.trim()
                    .replace(/[/\\?%*:|"<>]/g, '-')
                    .replace(/\s+/g, '_')
                    + '.m3u8';
            }

            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.alignItems = 'center';

            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'single-video-btn';
            downloadBtn.textContent = '下载视频';

            const status = document.createElement('span');
            status.className = 'download-status';

            buttonContainer.appendChild(downloadBtn);
            buttonContainer.appendChild(status);
            item.appendChild(buttonContainer);

            downloadBtn.onclick = async () => {
                try {
                    status.textContent = '获取视频地址...';
                    const videoLink = item.querySelector('a[href*="docview"]').href;
                    const m3u8Url = await getM3U8Url(videoLink);

                    status.textContent = '保存M3U8文件...';
                    await saveM3U8File(m3u8Url, fileName);

                    // 自动打开下载器
                    window.open(`https://tools.thatwind.com/tool/m3u8downloader#${new URLSearchParams({
                        m3u8: m3u8Url,
                        referer: location.href
                    })}`, '_blank');

                    status.textContent = '下载完成';
                    status.style.color = '#4CAF50';
                } catch (error) {
                    status.textContent = '下载失败: ' + error.message;
                    status.style.color = '#f44336';
                }
            };
        });
    }

    // 添加批量视频下载按钮
    function addBatchVideoDownloadButton() {
        if (document.querySelector('.download-video-all-btn')) return;

        const batchButton = document.createElement('button');
        batchButton.className = 'download-video-all-btn';
        batchButton.textContent = '批量下载视频';
        document.body.appendChild(batchButton);

        batchButton.onclick = async () => {
            const resultItems = document.querySelectorAll('li.resultItem');
            let delay = 0;

            for (const item of resultItems) {
                const videoContainer = item.querySelector('.videoThumbnailContainer');
                if (!videoContainer) continue;

                const status = item.querySelector('.download-status') || document.createElement('span');
                status.className = 'download-status';
                item.appendChild(status);

                const titleElement = item.querySelector('.truncatedResultsTitle');
                let fileName = `video_${Date.now()}.m3u8`;
                if (titleElement) {
                    fileName = titleElement.textContent.trim()
                        .replace(/[/\\?%*:|"<>]/g, '-')
                        .replace(/\s+/g, '_')
                        + '.m3u8';
                }

                setTimeout(async () => {
                    try {
                        status.textContent = '获取视频地址...';
                        const videoLink = item.querySelector('a[href*="docview"]').href;
                        const m3u8Url = await getM3U8Url(videoLink);

                        status.textContent = '保存M3U8文件...';
                        await saveM3U8File(m3u8Url, fileName);

                        status.textContent = '下载完成';
                        status.style.color = '#4CAF50';
                    } catch (error) {
                        status.textContent = '下载失败: ' + error.message;
                        status.style.color = '#f44336';
                    }
                }, delay);

                delay += 3000; // 每个下载间隔3秒
            }
        };
    }

    // 保留原有的 PDF 下载功能代码...
     // 下载单个文档
    async function downloadDocument(downloadUrl, statusElement, fileName) {
        try {
            if (statusElement) {
                statusElement.textContent = '准备下载...';
            }

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: downloadUrl,
                    responseType: 'blob',
                    onload: function(response) {
                        if (response.status === 200) {
                            const blob = new Blob([response.response], { type: 'application/pdf' });
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = fileName;
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
        const resultItems = document.querySelectorAll('li.resultItem');
        resultItems.forEach(item => {
            // 检查是否已经添加了下载按钮

            if (item.querySelector('.single-download-btn')) {
                return;
            }

            const pdfLink = item.querySelector('a[href*="fulltextPDF"]');

            if (!pdfLink) return;
            const titleElement = item.querySelector('.truncatedResultsTitle');
            let fileName = 'document.pdf';
            if (titleElement) {
                // 获取标题文本，去除首尾空白，并替换不允许作为文件名的字符
                fileName = titleElement.textContent.trim()
                    .replace(/[/\\?%*:|"<>]/g, '-') // 替换不允许的字符为连字符
                    .replace(/\s+/g, '_') // 将空白字符替换为下划线
                    + '.pdf'; // 添加 .pdf 后缀
            }


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
            item.appendChild(buttonContainer);

            downloadBtn.onclick = async () => {
                try {
                    const pdfPageUrl = pdfLink.href;
                    console.log("pdfPageUrl", pdfPageUrl)
                    const response = await fetch(pdfPageUrl);
                    const html = await response.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const downloadLink = doc.querySelector('a.pdf-download[download="ProQuestDocument.pdf"]');
                    if (downloadLink) {
                        await downloadDocument(downloadLink.href, status, fileName);
                    } else {
                        throw new Error('找不到PDF下载链接');
                    }
                } catch (error) {
                    console.error('单个文档下载失败:', error);
                    status.textContent = '下载失败: ' + error.message;
                    status.style.color = '#f44336';
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
        batchButton.textContent = '批量下载文档';
        document.body.appendChild(batchButton);

        batchButton.onclick = async () => {
            const resultItems = document.querySelectorAll('li.resultItem');
            let delay = 0;

            for (const item of resultItems) {
                const pdfLink = item.querySelector('a[href*="fulltextPDF"]');
                console.log(pdfLink)
                if (!pdfLink) continue;

                const status = item.querySelector('.download-status') || document.createElement('span');
                status.className = 'download-status';
                item.appendChild(status);

                const titleElement = item.querySelector('.truncatedResultsTitle');
                let fileName = 'document.pdf';
                if (titleElement) {
                    // 获取标题文本，去除首尾空白，并替换不允许作为文件名的字符
                    fileName = titleElement.textContent.trim()
                        .replace(/[/\\?%*:|"<>]/g, '-') // 替换不允许的字符为连字符
                        .replace(/\s+/g, '_') // 将空白字符替换为下划线
                        + '.pdf'; // 添加 .pdf 后缀
                }

                setTimeout(async () => {
                    try {
                        const pdfPageUrl = pdfLink.href;
                        const response = await fetch(pdfPageUrl);
                        const html = await response.text();
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        const downloadLink = doc.querySelector('a.pdf-download[download="ProQuestDocument.pdf"]');
                        if (downloadLink) {
                            await downloadDocument(downloadLink.href, status, fileName);
                        } else {
                            throw new Error('找不到PDF下载链接');
                        }
                    } catch (error) {
                        console.error('批量下载过程中出错:', error);
                        status.textContent = '下载失败: ' + error.message;
                        status.style.color = '#f44336';
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
                addVideoDownloadButtons();
                addBatchDownloadButton();
                addBatchVideoDownloadButton();
            }
        }
    });

    // 初始化
    function initialize() {
        addDownloadButtons();
        addVideoDownloadButtons();
        addBatchDownloadButton();
        addBatchVideoDownloadButton();
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