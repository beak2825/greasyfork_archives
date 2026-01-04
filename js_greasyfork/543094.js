// ==UserScript==
// @name         豆瓣帖子图片和实况图下载
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  在豆瓣动态旁添加“下载”按钮，一键下载所有图片。智能识别实况图(Live Photo)，并同时下载其JPG和MP4视频文件。
// @author       Gemini
// @match        https://www.douban.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douban.com
// @grant        GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543094/%E8%B1%86%E7%93%A3%E5%B8%96%E5%AD%90%E5%9B%BE%E7%89%87%E5%92%8C%E5%AE%9E%E5%86%B5%E5%9B%BE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/543094/%E8%B1%86%E7%93%A3%E5%B8%96%E5%AD%90%E5%9B%BE%E7%89%87%E5%92%8C%E5%AE%9E%E5%86%B5%E5%9B%BE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function log(message, ...args) {
        console.log('[豆瓣下载脚本]', message, ...args);
    }

    log('脚本已启动 (v1.6 - 实况图支持)');

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 && (node.querySelector('.status-item') || node.classList.contains('status-item'))) {
                        addDownloadButtons();
                        break;
                    }
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(addDownloadButtons, 1500);

    function addDownloadButtons() {
        const statusItems = document.querySelectorAll('.status-item');
        statusItems.forEach(item => {
            const actionsBar = item.querySelector('.actions');
            if (actionsBar && !actionsBar.querySelector('.download-btn')) {
                const downloadBtn = document.createElement('a');
                downloadBtn.href = '#';
                downloadBtn.textContent = '下载';
                downloadBtn.className = 'download-btn';
                downloadBtn.style.marginLeft = '10px';
                downloadBtn.style.color = '#37a';

                downloadBtn.addEventListener('click', e => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (downloadBtn.textContent !== '下载') return;

                    downloadBtn.textContent = '处理中...';
                    try {
                        handleDownload(item, actionsBar);
                    } finally {
                        setTimeout(() => { downloadBtn.textContent = '下载'; }, 1000);
                    }
                });
                actionsBar.appendChild(downloadBtn);
            }
        });
    }

    function findAllImagesAsFallback(postContainer, urlSet) {
        log('使用备用方法查找图片。');
        const images = postContainer.querySelectorAll('.pics-wrapper img, .horizontal-photos img, .block-subject .pic img');
        images.forEach(img => {
            const url = img.getAttribute('data-original-src') || img.src;
            if (url) {
                urlSet.add(url.replace(/\/(l|m|s|sqs|albumicon|small)\//, '/raw/'));
            }
        });
    }

    function handleDownload(postContainer, actionsBar) {
        const urls = new Set();

        // **核心逻辑：优先解析页面内嵌的JSON数据，因为它包含了实况图信息**
        const scriptTag = Array.from(postContainer.querySelectorAll('.pics-wrapper script')).find(s => s.textContent.includes('var photos'));

        if (scriptTag) {
            log('找到图片数据脚本，开始解析...');
            const scriptContent = scriptTag.textContent;
            const jsonMatch = scriptContent.match(/var photos = (.*?);/s);
            if (jsonMatch && jsonMatch[1]) {
                try {
                    const photos = JSON.parse(jsonMatch[1]);
                    log(`解析成功，找到 ${photos.length} 个图片对象。`);
                    photos.forEach(photoData => {
                        const imgUrl = (photoData.image && (photoData.image.large.url || photoData.image.normal.url)) || '';
                        if (imgUrl) {
                            // 始终添加图片URL
                            urls.add(imgUrl);

                            // **如果 is_live 为 true，则推断并添加视频URL**
                            if (photoData.image.is_live) {
                                // 通常，视频文件的URL与图片URL相同，只是扩展名不同
                                const videoUrl = imgUrl.replace(/\.jpg/i, '.mp4');
                                if (videoUrl !== imgUrl) {
                                    log('发现实况图，添加视频URL:', videoUrl);
                                    urls.add(videoUrl);
                                }
                            }
                        }
                    });
                } catch (e) {
                    log('解析图片JSON失败，将使用备用方法。', e);
                    findAllImagesAsFallback(postContainer, urls);
                }
            } else {
                 findAllImagesAsFallback(postContainer, urls);
            }
        } else {
            // 如果没有找到内嵌脚本，则使用旧的备用方法
            findAllImagesAsFallback(postContainer, urls);
        }

        // 确保也找到独立的 video 标签（如果有的话）
        postContainer.querySelectorAll('video').forEach(video => {
            if (video.src) urls.add(video.src);
        });

        const urlList = Array.from(urls);
        log(`文件列表准备就绪，共 ${urlList.length} 个文件:`, urlList);

        if (urlList.length === 0) {
            alert('没有找到可下载的图片或视频。');
            return;
        }

        // 批量发起下载
        urlList.forEach((url, index) => {
            const postId = postContainer.dataset.sid || `douban_${Date.now()}`;
            let filename = url.substring(url.lastIndexOf('/') + 1).split('?')[0];
            filename = filename.replace(/[^a-zA-Z0-9._-]/g, '');
            
            if (!filename || filename.length < 4 || !filename.includes('.')) {
                const extension = url.includes('.mp4') ? 'mp4' : (url.includes('.gif') ? 'gif' : 'jpg');
                filename = `${postId}_${index + 1}.${extension}`;
            } else {
                filename = `${postId}_${filename}`;
            }

            try {
                GM_download({ url: url, name: filename });
            } catch (e) {
                log(`GM_download 调用失败 for ${filename}`, e);
            }
        });
        
        // 更新UI提示
        const oldNotification = actionsBar.querySelector('.download-notification');
        if(oldNotification) oldNotification.remove();
        const notification = document.createElement('span');
        notification.textContent = `已发起 ${urlList.length} 个下载!`;
        notification.className = 'download-notification';
        notification.style.marginLeft = '10px';
        notification.style.color = '#008000';
        actionsBar.appendChild(notification);
        setTimeout(() => { notification.remove(); }, 4000);
    }
})();