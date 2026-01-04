// ==UserScript==
// @name         百度网盘智能字幕下载（改）
// @namespace    http://github.com/lihaoze123/Baiduyun-subtitle-downloader
// @version      0.8
// @description  下载当前使用的字幕，自动将百度网盘生成的智能字幕下载为 srt 文件，增加下载按钮
// @match        *://pan.baidu.com/*
// @grant        GM_download
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/518417/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%99%BA%E8%83%BD%E5%AD%97%E5%B9%95%E4%B8%8B%E8%BD%BD%EF%BC%88%E6%94%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/518417/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%99%BA%E8%83%BD%E5%AD%97%E5%B9%95%E4%B8%8B%E8%BD%BD%EF%BC%88%E6%94%B9%EF%BC%89.meta.js
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
            let button = document.querySelector('li.vp-video__control-bar--video-subtitles-select-item.is-checked');
            if (button.classList.contains('is-normal')) {
                clearResources(); // 清理资源
                button = document.querySelector('ul.vp-video__control-bar--video-subtitles-select-group.is-large li:nth-child(2)');
            }
            button.click();
            await sleep(500);

            try {
                // const url = await retryOperation(findSubtitleUrl);
                // const regex = /fn=(.*)\.mp4/;
                // let fileName = decodeURIComponent(url.match(regex)[1]) + '.srt';

                const url = window.location.href;

                const params = new URLSearchParams(url.split('?')[1]);
                const path = params.get('path'); // /公务员/.../赠送：课后作业 4.mp4
                const fileName = path.match(/([^/]+)(?=\.[^.]+$)/)[0] + '.srt';

                console.log(fileName);

                // 使用 Fetch 获取字幕文件内容
                const response = await fetch(url);
                if (!response.ok) throw new Error('获取字幕文件失败');

                const subtitleText = await response.text();

                // 创建一个 Blob 对象用于下载
                const blob = new Blob([subtitleText], { type: 'text/plain' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = fileName;

                // 自动点击下载链接
                link.click();
            } catch (error) {
                console.error('下载失败:', error);
            }
        }

        function addDownloadButton() {

            //const controlBar = document.querySelector("#vjs_video_594 > section > div.vp-video__control-bar--setup > div:nth-child(1) > div > div.vp-inner-vontainer > div > div.vp-video__control-bar--video-subtitles > div > ul");
            const controlBar = document.querySelector('.vp-video-player .vp-video__control-bar .vp-video__control-bar--video-subtitles .vp-video__control-bar--video-subtitles-select .vp-video__control-bar--video-subtitles-select-group')
            console.log(controlBar)
            if (controlBar) {
                let downloadButton = controlBar.querySelector('button.download-subtitle');

                if (!downloadButton) {
                    console.log('创建字幕下载按钮！');
                    // 如果按钮不存在，则创建一个新的按钮
                    downloadButton = document.createElement('button');
                    downloadButton.className = 'download-subtitle'; // 添加类名方便识别
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
                    controlBar.appendChild(downloadButton);
                    console.log('创建成功！');
                } else {
                    // 如果按钮已经存在，更新其文本和事件监听器
                    downloadButton.textContent = '下载字幕';
                }

                // 更新按钮的点击事件
                downloadButton.removeEventListener('click', downloadSubtitle); // 移除旧的事件处理器
                downloadButton.addEventListener('click', downloadSubtitle); // 添加新的事件处理器

                return true;
            }
            return false;
        }

        //(function checkAddDownloadButton() {
        //    const checkFunction = setInterval(() => {
        //        if (addDownloadButton()) {
        //            console.log("检测到下载按钮，停止轮询");
        //            clearInterval(checkFunction); // 停止轮询
        //        }
        //    }, 500); // 每 500ms 检查一次
        //})();
        (function observeDOM() {
            const observer = new MutationObserver((mutations, obs) => {
                if (addDownloadButton()) {
                    console.log("检测到下载按钮，停止监听");
                    obs.disconnect(); // 停止观察 DOM
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        })();


})();
