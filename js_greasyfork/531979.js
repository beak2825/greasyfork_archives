// ==UserScript==
// @name         抖音视频下载极简版
// @namespace    http://tampermonkey.net/
// @version      0.8.1
// @description  依旧是ai编的
// @match        *://www.douyin.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.9/dayjs.min.js
// @connect      douyinvod.com
// @connect      *.douyinvod.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/531979/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E6%9E%81%E7%AE%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/531979/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E6%9E%81%E7%AE%80%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let detectedVideoUrls = {}; // 存储 { __vid: url }
    let observer = null;
    let isDownloading = false;

    const downloadButton = document.createElement('button');
    downloadButton.id = 'douyin-precise-nickname-downloader-btn';
    downloadButton.textContent = '等待视频加载...';
    downloadButton.disabled = true;

    GM_addStyle(`
        #douyin-precise-nickname-downloader-btn {
            position: fixed;
            bottom: 55px;
            right: 15px;
            z-index: 20009;
            padding: 12px 25px;
            background-color: #FF6600;
            color: white;
            border: none;
            border-radius: 30px;
            cursor: pointer;
            font-size: 15px;
            font-weight: bold;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            transition: background-color 0.2s ease, transform 0.1s ease, color 0.2s ease;
        }
        #douyin-precise-nickname-downloader-btn:disabled {
            background-color: #cccccc;
            color: #666666;
            cursor: not-allowed;
            opacity: 0.7;
        }
        #douyin-precise-nickname-downloader-btn:hover:not(:disabled) {
            background-color: #FF8800;
        }
        #douyin-precise-nickname-downloader-btn:active:not(:disabled) {
            transform: scale(0.95);
        }
    `);

    function addButtonToPage() {
        if (document.body) {
            if (!document.getElementById(downloadButton.id)) {
                document.body.appendChild(downloadButton);
                startPerformanceObserver();
            }
        } else {
            setTimeout(addButtonToPage, 150);
        }
    }
    addButtonToPage();

    function getQueryParam(url, paramName) {
         try {
             const urlObj = new URL(url);
             return urlObj.searchParams.get(paramName);
         } catch (e) {
             const safeParamName = paramName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
             const match = url.match(new RegExp(`[?&]${safeParamName}=([^&]*)`));
             try {
                 return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : null;
             } catch (decodeError) {
                  return match ? match[1] : null;
             }
         }
    }

    function getVideoIdFromPath(pathname) {
        const match = pathname.match(/\/(?:video|note)\/(\d+)/);
        return match ? match[1] : null;
    }

    function sanitizeFilename(name, defaultName = 'unknown') {
        if (!name) return defaultName;
        let cleaned = name.replace(/^@/, '').trim();
        cleaned = cleaned.replace(/[\\/:*?"<>|.\n\r\t]/g, '_');
        cleaned = cleaned.substring(0, 50);
        return cleaned || defaultName;
    }



    // --- 修改：获取特定视频 ID 的作者昵称（包含详情页适配） ---
    function getAuthorNickname(videoId) {
        if (!videoId) return '未知作者';
        try {
            // 1. 尝试在推荐流/弹窗容器中精确查找 (Feed/Modal)
            const videoInfoContainer = document.querySelector(`[data-e2e="video-info"][data-e2e-aweme-id="${videoId}"]`);
            if (videoInfoContainer) {
                const nicknameElement = videoInfoContainer.querySelector('[data-e2e="feed-video-nickname"]');
                if (nicknameElement && nicknameElement.textContent) {
                    return sanitizeFilename(nicknameElement.textContent, '未知作者');
                }
            }

            // 2. 尝试全局查找 feed-video-nickname (Modal Fallback)
            const fallbackElement = document.querySelector('[data-e2e="feed-video-nickname"]');
            if(fallbackElement && fallbackElement.textContent) {
                return sanitizeFilename(fallbackElement.textContent, '未知作者');
            }

            // 3. 尝试详情页查找 (Detail Page Fallback)
            // 逻辑：查找 data-e2e="user-info" 下面的 data-click-from="title" (如图1所示结构)
            const detailUserElement = document.querySelector('[data-e2e="user-info"] [data-click-from="title"]');
            if (detailUserElement && detailUserElement.textContent) {
                return sanitizeFilename(detailUserElement.textContent, '未知作者');
            }

            // 3.1 详情页备用查找：如果上面的找不到，直接找 user-info 下的链接文本
            const detailUserFallback = document.querySelector('[data-e2e="user-info"] a');
            if (detailUserFallback && detailUserFallback.textContent) {
                 return sanitizeFilename(detailUserFallback.textContent, '未知作者');
            }

            return '未知作者';
        } catch (e) {
            return '未知作者';
        }
    }

    // --- 修改：获取视频发布时间（包含详情页适配） ---
    function getVideoPublishDate(videoId) {
        // 默认使用当天日期作为兜底
        let finalDate = dayjs().format('YYYY-MM-DD');

        try {
            // --- 策略 A: 详情页 (Detail Page) 优先匹配 ---
            // 格式通常为："发布时间： 2025-09-19 18:23"
            const detailTimeEl = document.querySelector('[data-e2e="detail-video-publish-time"]');
            if (detailTimeEl && detailTimeEl.textContent) {
                // 使用正则提取 YYYY-MM-DD
                const match = detailTimeEl.textContent.match(/(\d{4}-\d{2}-\d{2})/);
                if (match) {
                    return match[1];
                }
            }

            // --- 策略 B: 推荐流/弹窗 (Feed/Modal) ---
            let timeElement = null;
            // B1. 精确容器查找
            const videoInfoContainer = document.querySelector(`[data-e2e="video-info"][data-e2e-aweme-id="${videoId}"]`);
            if (videoInfoContainer) {
                timeElement = videoInfoContainer.querySelector('.video-create-time .time, .video-create-time');
            }
            // B2. 全局查找
            if (!timeElement) {
                timeElement = document.querySelector('.video-create-time .time, .video-create-time');
            }

            if (timeElement && timeElement.textContent) {
                // 格式通常为："7月22日" 或 "2023年7月22日"
                let text = timeElement.textContent.trim().replace(/^[^\d]+/, '');
                const currentYear = new Date().getFullYear();

                if (text.includes('年')) {
                    // "2023年7月22日" -> "2023-7-22"
                    finalDate = text.replace('年', '-').replace('月', '-').replace('日', '');
                } else if (text.includes('月') && text.includes('日')) {
                    // "7月22日" -> "2025-7-22"
                    let datePart = text.replace('月', '-').replace('日', '');
                    finalDate = `${currentYear}-${datePart}`;
                }
            }
        } catch (e) {
            console.warn("[抖音下载] 获取发布时间失败，使用当前日期");
        }
        return finalDate;
    }


   
    downloadButton.addEventListener('click', () => {
        let targetUrl = null;
        const pageId = getVideoIdFromPath(window.location.pathname) || getQueryParam(window.location.href, 'modal_id');
      
        if (pageId) {
            targetUrl = detectedVideoUrls[pageId]; // 如果 pageId == __vid，就能找到
        }

        if (!targetUrl) {
             const reason = pageId ? `页面ID (${pageId})` : '当前页面标识';
            alert(`未能根据 ${reason} 找到匹配的视频链接。\n请确保视频URL包含ID信息且已加载。`);
            return;
        }

        if (isDownloading) {
            return;
        }
   
        const authorNickname = getAuthorNickname(pageId);

        isDownloading = true;
        downloadButton.disabled = true;
        downloadButton.textContent = '请求中...';

        GM_xmlhttpRequest({
            method: "GET",
            url: targetUrl,
            responseType: 'blob',
            headers: { // 恢复 V7.4 的所有头
                "Referer": window.location.href,
                "User-Agent": navigator.userAgent,
                "Cookie": document.cookie,
                 "Accept": "video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5",
                 "Accept-Language": navigator.language || "en-US,en;q=0.9",
                 "Sec-Fetch-Site": "same-site",
                 "Sec-Fetch-Mode": "no-cors",
                 "Sec-Fetch-Dest": "video",
            },
            onload: function(response) {
                 if (response.status === 200 || response.status === 206) {
                     downloadButton.textContent = '处理数据...';
                     try {
                         const blob = response.response;
                         const blobUrl = URL.createObjectURL(blob);
                         const a = document.createElement('a');
                         a.href = blobUrl;
                         //const timestamp = dayjs().format('YYYYMMDD_HHmmss');

                         const publishDate = getVideoPublishDate(pageId); // 获取发布日期 (例如 2025-7-22)
                         const filenameVid = pageId || 'unknown';
                         // !! 构建包含发布日期的新文件名 !!
                         const timestamp = dayjs().format('YYYYMMDDHHmm');
                         a.download = `douyin_${filenameVid}_${authorNickname}_${publishDate}_${timestamp}.mp4`;
                         a.style.display = 'none';
                         document.body.appendChild(a);
                         a.click();
                         document.body.removeChild(a);
                         setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
                         downloadButton.textContent = '下载视频';
                     } catch (e) {
                         alert('处理下载数据时发生错误！');
                         downloadButton.textContent = '处理失败';
                     }
                 } else {
                     alert(`下载失败：服务器返回错误 ${response.status} ${response.statusText} (URL可能已过期)`);
                     downloadButton.textContent = `错误 ${response.status}`;
                 }
                  setTimeout(() => {
                      isDownloading = false;
                      // 按钮状态只取决于字典是否为空
                      downloadButton.disabled = Object.keys(detectedVideoUrls).length === 0;
                      if(!downloadButton.disabled && !downloadButton.textContent.includes('下载视频')) {
                           downloadButton.textContent = '下载失败,重试?';
                      } else if (!downloadButton.disabled) {
                           downloadButton.textContent = '下载视频';
                      } else {
                           downloadButton.textContent = '等待视频加载...';
                      }
                  }, 1500);
            },
            onerror: function(error) {
                alert(`下载失败：网络错误 ${error.error || ''}`);
                downloadButton.textContent = '网络错误';
                 setTimeout(() => {
                     isDownloading = false;
                     downloadButton.disabled = Object.keys(detectedVideoUrls).length === 0;
                     downloadButton.textContent = '下载失败,重试?';
                 }, 1500);
            },
            ontimeout: function() {
                alert('下载失败：请求超时');
                downloadButton.textContent = '请求超时';
                setTimeout(() => {
                     isDownloading = false;
                     downloadButton.disabled = Object.keys(detectedVideoUrls).length === 0;
                     downloadButton.textContent = '下载失败,重试?';
                 }, 1500);
            }
        });
    });
   
    function performanceCallback(list, observer) {
        const entries = list.getEntries();
        let newUrlsAddedToDict = false;

        for (const entry of entries) {
            if (entry.entryType === 'resource') {
                const url = entry.name;
                if (typeof url === 'string' && url.includes('douyinvod.com') && (url.includes('/video/') || url.endsWith('.mp4'))) {
                    const vid = getQueryParam(url, '__vid');
                    if (vid) {
                        detectedVideoUrls[vid] = url;
                        newUrlsAddedToDict = true;
                    }
                  
                }
            }
        }

        if (newUrlsAddedToDict && downloadButton.disabled) {
            downloadButton.disabled = false;
            downloadButton.textContent = '下载视频';
        }
    }

    // --- 启动 PerformanceObserver ---
    function startPerformanceObserver() {
        if (typeof PerformanceObserver === 'undefined') {
             alert("你的浏览器不支持 PerformanceObserver，脚本无法运行。");
             return;
        }
        if (observer) {
            observer.disconnect();
        }
        observer = new PerformanceObserver(performanceCallback);
        try {
             observer.observe({ type: 'resource', buffered: true });
        } catch (e) {
             try {
                 observer.observe({ entryTypes: ['resource'] });
             } catch (e2) {
                 alert("启动性能监视器失败，脚本可能无法工作。");
             }
        }
    }

})();