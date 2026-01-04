// ==UserScript==
// @name         YouTube 影片下載/字幕複製下載
// @namespace    https://tiejeng.com/
// @author       鐵定有好貨
// @version      1.2
// @description 在 YouTube 影片頁面插入字幕下載按鈕、複製字幕按鈕和影片下載按鈕
// @match        https://*.youtube.com/*
// @match        https://*.youtube.com/watch*
// @match        https://*.youtube.com/shorts*
// @match        https://*.youtube.com/embed*
// @grant        GM_setClipboard
// @license CC-BY-NC-ND-4.0
// @downloadURL https://update.greasyfork.org/scripts/508464/YouTube%20%E5%BD%B1%E7%89%87%E4%B8%8B%E8%BC%89%E5%AD%97%E5%B9%95%E8%A4%87%E8%A3%BD%E4%B8%8B%E8%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/508464/YouTube%20%E5%BD%B1%E7%89%87%E4%B8%8B%E8%BC%89%E5%AD%97%E5%B9%95%E8%A4%87%E8%A3%BD%E4%B8%8B%E8%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 創建新的按鈕元素
    function createButton(text, onClick) {
        const button = document.createElement('div');
        button.textContent = text;
        button.style.cssText = `
            padding: 10px 20px;
            background-color: #444444;
            color: white;
            cursor: pointer;
            text-align: center;
            margin-bottom: 10px;
            border-radius: 2px;
            font-size: 16px;
            font-weight: bold;
        `;
        button.onclick = onClick;
        return button;
    }

    // 將按鈕插入到指定位置
    function insertButtons() {
        const targetDiv = document.querySelector('#secondary.style-scope.ytd-watch-flexy');
        if (targetDiv) {
            const downloadButton = createButton('下載字幕', handleDownloadButtonClick);
            const copyButton = createButton('複製字幕', handleCopyButtonClick);
            const videoDownloadButton = createButton('下載影片', handleVideoDownloadButtonClick);
            targetDiv.insertBefore(videoDownloadButton, targetDiv.firstChild);
            targetDiv.insertBefore(copyButton, targetDiv.firstChild);
            targetDiv.insertBefore(downloadButton, targetDiv.firstChild);
        } else {
            console.error('目標元素未找到');
        }
    }

    // 處理下載字幕按鈕點擊事件
    function handleDownloadButtonClick() {
        console.log('下載字幕按鈕被點擊了！');
        getSubtitles((subtitles) => {
            if (subtitles) {
                const videoTitle = getVideoTitle();
                const subtitleLanguage = getSubtitleLanguage();
                downloadSubtitles(subtitles, videoTitle, subtitleLanguage);
            }
        });
    }

    // 處理複製字幕按鈕點擊事件
    function handleCopyButtonClick() {
        console.log('複製字幕按鈕被點擊了！');
        getSubtitles((subtitles) => {
            if (subtitles) {
                GM_setClipboard(subtitles);
                alert('字幕已成功複製到剪貼簿。');
            }
        });
    }

    // 處理下載影片按鈕點擊事件
    function handleVideoDownloadButtonClick() {
        console.log('下載影片按鈕被點擊了！');
        const videoId = extractYoutubeId(window.location.href);
        if (videoId) {
            const downloadUrl = `https://tubemp3.to/${videoId}`;
            window.open(downloadUrl, '_blank');
        } else {
            alert('無法獲取影片ID，請確保您在YouTube影片頁面上。');
        }
    }

    // 從URL中提取YouTube影片ID
    function extractYoutubeId(url) {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : null;
    }

    // 獲取字幕
    function getSubtitles(callback) {
        const transcriptButton = document.querySelector('ytd-video-description-transcript-section-renderer button');
        if (transcriptButton) {
            transcriptButton.click();
            setTimeout(() => {
                const segmentsContainer = document.querySelector('#segments-container');
                if (segmentsContainer) {
                    const subtitles = segmentsContainer.innerText;
                    callback(subtitles);
                } else {
                    alert('無法獲取字幕，請確保影片有字幕並已打開字幕面板。');
                    callback(null);
                }
            }, 1000);
        } else {
            alert('無法找到字幕按鈕，請確保影片有字幕。');
            callback(null);
        }
    }

    // 獲取影片標題
    function getVideoTitle() {
        const titleElement = document.querySelector('yt-formatted-string.style-scope.ytd-watch-metadata');
        return titleElement ? titleElement.textContent.trim() : 'unknown_title';
    }

    // 獲取字幕語言
    function getSubtitleLanguage() {
        const languageElement = document.querySelector('#label-text.style-scope.yt-dropdown-menu');
        return languageElement ? languageElement.textContent.trim() : 'unknown_language';
    }

    // 處理檔案名稱
    function sanitizeFilename(name) {
        let safeName = name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
        safeName = safeName.replace(/_+/g, '_');
        safeName = safeName.replace(/^_+|_+$/g, '');
        return safeName.slice(0, 100);
    }

    // 下載字幕
    function downloadSubtitles(subtitles, videoTitle, subtitleLanguage) {
        const safeTitle = sanitizeFilename(videoTitle);
        const safeLanguage = sanitizeFilename(subtitleLanguage);
        const fileName = `youtube_subtitles_${safeTitle}_${safeLanguage}.txt`;

        const blob = new Blob([subtitles], {type: 'text/plain'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    }

    // 使用 MutationObserver 來檢測目標元素的出現
    function observeForElement(selector, callback) {
        const observer = new MutationObserver((mutations, obs) => {
            const targetElement = document.querySelector(selector);
            if (targetElement) {
                callback(targetElement);
                obs.disconnect();
                return;
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 當目標元素出現時插入按鈕
    observeForElement('#secondary.style-scope.ytd-watch-flexy', insertButtons);
})();