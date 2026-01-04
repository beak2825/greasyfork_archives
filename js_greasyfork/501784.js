// ==UserScript==
// @name         百度网盘智能字幕下载
// @namespace    http://github.com/lihaoze123/Baiduyun-subtitle-downloader
// @version      0.4
// @description  自动将百度网盘生成的智能字幕下载为 srt 文件，增加下载按钮
// @match        *://pan.baidu.com/*
// @grant        GM_download
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/501784/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%99%BA%E8%83%BD%E5%AD%97%E5%B9%95%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/501784/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%99%BA%E8%83%BD%E5%AD%97%E5%B9%95%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clearResources() {
        performance.clearResourceTimings();
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function retryOperation(operation, maxRetries = 3, delay = 1000) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await operation();
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                console.log(`尝试失败,${maxRetries - i - 1}次重试后重新尝试`);
                await sleep(delay);
            }
        }
    }

    async function findSubtitleUrl() {
        const resources = performance.getEntriesByType("resource");
        let matchedUrls = resources.filter(resource => resource.name.includes('netdisk-subtitle'));

        if (matchedUrls.length > 0) {
            let url = matchedUrls[matchedUrls.length - 1].name;
            console.log('找到匹配的URL:', url);
            return url;
        } else {
            throw new Error('未找到匹配的URL');
        }
    }

    async function downloadSubtitle() {
        const button = document.querySelector("#vjs_video_594 > section > div.vp-video__control-bar--setup > div:nth-child(1) > div > div.vp-inner-vontainer > div > div.vp-video__control-bar--video-subtitles > div > ul > li:nth-child(2) > p");
        if (button) {
            clearResources(); // 清理资源
            button.click();

            await sleep(500);

            try {
                const url = await retryOperation(findSubtitleUrl);
                const regex = /fn=(.*)\.mp4/;
                let fileName = decodeURI(url.match(regex)[1]).replace('+', ' ') + '.srt';
                console.log(fileName);

                GM_download(url, fileName);
            } catch (error) {
                console.error('下载失败:', error);
            }
        } else {
            console.log('未找到字幕按钮');
        }
    }

    function addDownloadButton() {
        const controlBar = document.querySelector("#vjs_video_594 > section > div.vp-video__control-bar--setup > div:nth-child(1) > div > div.vp-inner-vontainer > div > div.vp-video__control-bar--video-subtitles > div > ul");
        if (controlBar) {
            const downloadButton = document.createElement('button');
            downloadButton.textContent = '下载字幕';
            downloadButton.style.cssText = `
                background-color: #4CAF50;
                border: none;
                color: white;
                padding: 5px 10px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 14px;
                margin: 4px 2px;
                cursor: pointer;
                border-radius: 4px;
            `;
            downloadButton.addEventListener('click', downloadSubtitle);
            controlBar.appendChild(downloadButton);
            return true;
        }
        return false;
    }

    const observer = new MutationObserver((mutations, obs) => {
        if (addDownloadButton()) {
            obs.disconnect();
            return;
        }
    });

    const config = {
        childList: true,
        subtree: true
    };
    observer.observe(document.body, config);

    setInterval(() => {
        if (!document.querySelector("#vjs_video_594 > section > div.vp-video__control-bar--setup > div:nth-child(1) > div > div.vp-inner-vontainer > div > div.vp-video__control-bar--video-subtitles > div > ul > button")) {
            addDownloadButton();
        }
    }, 1000);

})();
