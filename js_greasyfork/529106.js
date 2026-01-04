// ==UserScript==
// @name         电商详情页照片视频打包工具（淘宝、天猫、1688）
// @namespace    taobao&tmall&1688 pictures downloader
// @version      0.2
// @description  下载一些电商网站网页的照片和视频
// @author       AooMing -- 2025/3/7
// @icon         data:image/jpeg;base64,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
// @match        *://item.taobao.com/*
// @match        *://detail.tmall.com/*
// @match        *://detail.1688.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_download
// @require      https://unpkg.com/pizzip@3.1.5/dist/pizzip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/529106/%E7%94%B5%E5%95%86%E8%AF%A6%E6%83%85%E9%A1%B5%E7%85%A7%E7%89%87%E8%A7%86%E9%A2%91%E6%89%93%E5%8C%85%E5%B7%A5%E5%85%B7%EF%BC%88%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E3%80%811688%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/529106/%E7%94%B5%E5%95%86%E8%AF%A6%E6%83%85%E9%A1%B5%E7%85%A7%E7%89%87%E8%A7%86%E9%A2%91%E6%89%93%E5%8C%85%E5%B7%A5%E5%85%B7%EF%BC%88%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E3%80%811688%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 根据域名设置不同的标签名
    let targetIds = [];
    let innerWrapClass = ''; //主图所在的class，为webp格式的
    let videoxContainerClass = ''; //视频所在的class
    let thumbnailsClass = ''; //主图ui标签
    let thumbnailClass = ''; //主图li标签

    const domain = window.location.hostname;
    if (domain.includes('item.taobao.com')) {
        targetIds = ['content'];
        innerWrapClass = 'innerWrap--tD6LdQYX';
        videoxContainerClass = 'videox-container';
        thumbnailsClass = 'thumbnails--v976to2t';
        thumbnailClass = 'thumbnail--TxeB1sWz';
    }
    else if (domain.includes('detail.tmall.com')) {
        targetIds = ['content'];
        innerWrapClass = 'innerWrap--tD6LdQYX';
        videoxContainerClass = 'videox-container';
        thumbnailsClass = 'thumbnails--v976to2t';
        thumbnailClass = 'thumbnail--TxeB1sWz';
    }
    else if (domain.includes('detail.1688.com')) {
        targetIds = ['detailContentContainer'];
        innerWrapClass = 'img-list-wrapper';
        videoxContainerClass = 'lib-video';
        thumbnailsClass = '';
        thumbnailClass = '';
    }
    // 可以继续添加其他域名的配置
    // else if (domain.includes('anotherdomain.com')) {
    //     targetIds = ['another-id'];
    //     innerWrapClass = 'another-inner-wrap-class';
    //     videoxContainerClass = 'another-videox-container-class';
    //     thumbnailsClass = 'another-thumbnails-class';
    //     thumbnailClass = 'another-thumbnail-class';
    // }

    // 添加样式
    GM_addStyle(`
       .start-button {
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #ff7e43;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
            font-family: PingFang SC;
        }
       .start-button:hover {
            background-color: #ff621a;
        }
       .message-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #ff621a;
            color: white;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            z-index: 9999;
            font-size: 18px;
            font-family: PingFang SC;
        }
       .selection-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            max-width: 80%;
            max-height: 80%;
            overflow: auto;
            display: flex;
            flex-direction: column;
        }
       .selection-popup h2 {
            margin-top: 0;
            margin-bottom: 20px;
            text-align: center;
            color:black;
            font-size: 140%;
            font-family: PingFangSC-Semibold;
        }
       .grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-gap: 10px;
            flex-grow: 1;
            overflow-y: auto;
        }
       .media-item {
            position: relative;
        }
       .media-item img {
            width: 100%;
            height: max-content;
            cursor: pointer;
            transition: opacity 0.3s;
        }
       .media-item img.selected {
            opacity: 0.3;
            border: 3px solid #ff621a;
        }
       .media-item .checkmark {
            display: none;
            position: absolute;
            top: 5px;
            left: 5px;
            font-size: 24px;
            color: #ff621a;
            z-index: 1;
        }
       .media-item img.selected + .checkmark {
            display: block;
        }
       .media-item p {
            margin: 5px 0;
            font-size: 12px;
            word-break: break-all;
        }
       .media-item p a {
            color: #ff7e43;
            text-decoration: none;
        }
       .media-item p a:hover {
            text-decoration: underline;
        }
       .button-container {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #ccc;
        }
       .action-button {
            background-color: #ff7e43;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
        }
       .action-button:hover {
            background-color: #ff621a;
        }
       .cancel-button {
            background-color: #6c757d;
        }
       .cancel-button:hover {
            background-color: #5a6268;
        }
    `);

    // 添加开始按钮
    const startButton = document.createElement('button');
    startButton.textContent = '点击收集';
    startButton.classList.add('start-button');
    document.body.appendChild(startButton);

    // 点击开始按钮触发事件
    startButton.addEventListener('click', async () => {
        // 显示正在收集信息
        showMessagePopup('正在收集');

        // 自动滚动获取ajax数据
        const mediaUrls = await scrollAndCollectMedia(targetIds);

        // 关闭正在收集弹窗
        closeMessagePopup();

        // 显示收集完毕信息
        showMessagePopup('收集完毕，请选择你需要的照片或视频');
        setTimeout(() => {
            closeMessagePopup();
            // 显示选择弹窗
            showSelectionPopup(mediaUrls);
        }, 1000);
    });

    // 自动滚动并收集媒体链接
    async function scrollAndCollectMedia(targetIds) {
        // 记录当前滚动位置
        const originalScrollTop = window.scrollY;

        // 模拟鼠标悬停触发视频加载
        await triggerVideoLoad();

        // 较慢滚动到页面底部
        await slowScrollToBottom();

        // 滚动回顶部
        window.scrollTo({
            top: 0, // 滚动到页面顶部
            behavior: 'smooth'
        });
        await new Promise(resolve => setTimeout(resolve, 20)); // 等待滚动完成

        // 等待 AJAX 内容加载完成
        await waitForAjaxContent();

        const mediaUrls = [];
        for (const id of targetIds) {
            const container = document.getElementById(id);
            const classMediaUrls = [];
            if (container) {
                // 查找图片和视频
                const images = container.querySelectorAll('img');
                const videos = container.querySelectorAll('video');

                for (const img of images) {
                    const src = img.src;
                    if (src && !mediaUrls.includes(src) &&!shouldFilter(img)) {
                        mediaUrls.push(src);
                    }
                }

                videos.forEach(video => {
                    const src = video.src;
                    if (src && !mediaUrls.includes(src)) {
                        mediaUrls.push(src);
                    }
                });
            }
            if (mediaUrls.length > 0) {
                console.log(`从 id 为 ${id} 的元素中获取到的图片 URL：`, mediaUrls);
            }
        }

        // 查找 class 为 innerWrapClass 下的图片
        if (innerWrapClass) {
            const innerWrapImages = document.querySelectorAll(`.${innerWrapClass} img`);
            const innerWrapMediaUrls = [];
            if (innerWrapImages.length === 0) {
                console.log(`未找到 class 为 ${innerWrapClass} 的图片元素，跳过`);
            } else {
                innerWrapImages.forEach(img => {
                    let src = img.src;
                    // 暂时禁用过滤函数
                    // const filtered = shouldFilter(img);
                    // console.log(`是否被过滤: ${filtered}`);
                    if (src.endsWith('_.webp')) {
                        src = src.replace('_.webp', '');
                    }
                    if (src && !mediaUrls.includes(src)) {
                        mediaUrls.push(src);
                        innerWrapMediaUrls.push(src);
                    }
                });
                if (innerWrapMediaUrls.length > 0) {
                    console.log(`从 class 为 ${innerWrapClass} 的元素中获取到的图片 URL：`, innerWrapMediaUrls);
                }
            }
        }

        // 查找 videoxContainerClass 里的视频
        if (videoxContainerClass) {
            const videoxVideos = document.querySelectorAll(`.${videoxContainerClass} video`);
            const VideosMediaUrls = [];
            if (videoxVideos.length === 0) {
                console.log(`未找到 class 为 ${videoxContainerClass} 的视频元素，跳过`);
            } else {
                videoxVideos.forEach(video => {
                    const src = video.src;
                    if (src && !mediaUrls.includes(src)) {
                        mediaUrls.push(src);
                        VideosMediaUrls.push(src);
                    }
                });
                if (VideosMediaUrls.length > 0) {
                    console.log(`从 class 为 ${videoxContainerClass} 的元素中获取到的图片 URL：`, VideosMediaUrls);
                }
            }
        }

        // 滚动回原来的位置
        window.scrollTo({
            top: originalScrollTop,
            behavior: 'smooth'
        });

        console.log('收集到的媒体链接:', mediaUrls);
        return mediaUrls;
    }

    // 较慢滚动到页面底部
    async function slowScrollToBottom() {
        const initialScrollStep = 300; // 初始滚动步长
        const scrollInterval = 10; // 滚动间隔时间（毫秒）
        let scrollStep = initialScrollStep;

        let maxScrollTop = document.body.scrollHeight - window.innerHeight;
        let currentScrollTop = window.scrollY;

        while (currentScrollTop < maxScrollTop) {
            window.scrollBy(0, scrollStep);
            await new Promise(resolve => setTimeout(resolve, scrollInterval));
            currentScrollTop = window.scrollY;
            maxScrollTop = document.body.scrollHeight - window.innerHeight;

            // 如果接近底部，减小滚动步长
            if (maxScrollTop - currentScrollTop < scrollStep) {
                scrollStep = maxScrollTop - currentScrollTop;
            }
        }

        // 等待一段时间，检查页面高度是否变化
        await new Promise(resolve => setTimeout(resolve, 20));
        maxScrollTop = document.body.scrollHeight - window.innerHeight;
        currentScrollTop = window.scrollY;

        // 如果页面高度变化，继续滚动
        while (currentScrollTop < maxScrollTop) {
            window.scrollBy(0, scrollStep);
            await new Promise(resolve => setTimeout(resolve, scrollInterval));
            currentScrollTop = window.scrollY;
            maxScrollTop = document.body.scrollHeight - window.innerHeight;

            // 如果接近底部，减小滚动步长
            if (maxScrollTop - currentScrollTop < scrollStep) {
                scrollStep = maxScrollTop - currentScrollTop;
            }
        }
    }

    // 模拟鼠标悬停触发视频加载
    async function triggerVideoLoad() {
        if (thumbnailsClass && thumbnailClass) {
            const ulElement = document.querySelector(`.${thumbnailsClass}`);
            if (!ulElement) {
                console.error(`未找到 .${thumbnailsClass} 元素`);
                return;
            }
            const firstLi = ulElement.querySelector(`.${thumbnailClass}`);
            if (!firstLi) {
                console.error(`未找到 .${thumbnailClass} 元素`);
                return;
            }

            // 使用 MouseEvent 模拟鼠标悬停
            const mouseOverEvent = new MouseEvent('mouseover', {
                bubbles: true,
                cancelable: true
            });
            firstLi.dispatchEvent(mouseOverEvent);

            // 使用 MutationObserver 检测视频元素加载
            await new Promise(resolve => {
                const observer = new MutationObserver((mutationsList) => {
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'childList') {
                            const videos = document.querySelectorAll('video');
                            if (videos.length > 0) {
                                observer.disconnect();
                                resolve();
                            }
                        }
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });

                // 设置超时时间，避免无限等待
                setTimeout(() => {
                    observer.disconnect();
                    resolve();
                }, 500);
            });
        }
    }

    // 等待 AJAX 内容加载完成
    function waitForAjaxContent() {
        return new Promise((resolve) => {
            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        // 有子节点变化，说明可能有新内容加载
                        observer.disconnect();
                        // 再等待一段时间，确保内容完全加载
                        setTimeout(() => {
                            resolve();
                        }, 1000);
                        break;
                    }
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            // 设置一个较长的超时时间，避免无限等待
            setTimeout(() => {
                observer.disconnect();
                resolve();
            }, 4000);
        });
    }

    // 显示消息弹窗
    function showMessagePopup(message) {
        const popup = document.createElement('div');
        popup.classList.add('message-popup');
        popup.textContent = message;
        document.body.appendChild(popup);
    }

    // 关闭消息弹窗
    function closeMessagePopup() {
        const popup = document.querySelector('.message-popup');
        if (popup) {
            document.body.removeChild(popup);
        }
    }

    // 显示选择弹窗
    function showSelectionPopup(mediaUrls) {
        const popup = document.createElement('div');
        popup.classList.add('selection-popup');

        const title = document.createElement('h2');
        title.textContent = '请点击选择需要的照片或视频进行打包';
        popup.appendChild(title);

        const grid = document.createElement('div');
        grid.classList.add('grid');

        const selectedUrls = [];

        mediaUrls.forEach(url => {
            const item = document.createElement('div');
            item.classList.add('media-item');
            const img = document.createElement('img');
            img.src = url;
            img.addEventListener('click', () => {
                if (selectedUrls.includes(url)) {
                    selectedUrls.splice(selectedUrls.indexOf(url), 1);
                    img.classList.remove('selected');
                } else {
                    selectedUrls.push(url);
                    img.classList.add('selected');
                }
            });

            const checkmark = document.createElement('span');
            checkmark.classList.add('checkmark');
            checkmark.textContent = '√';

            const urlText = document.createElement('p');
            const urlLink = document.createElement('a');
            urlLink.href = url;
            urlLink.target = '_blank';
            urlLink.textContent = url;
            urlText.appendChild(urlLink);

            item.appendChild(img);
            item.appendChild(checkmark);
            item.appendChild(urlText);
            grid.appendChild(item);
        });

        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.classList.add('action-button', 'cancel-button');
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(popup);
        });

        const downloadButton = document.createElement('button');
        downloadButton.textContent = '一键打包';
        downloadButton.classList.add('action-button');

        const developerNameElement = document.createElement('span');
        developerNameElement.textContent = 'By:AooMing';
        developerNameElement.style.margin = '10px 10px';
        developerNameElement.style.opacity = '.2';

        downloadButton.addEventListener('click', async () => {
            if (selectedUrls.length > 0) {
                try {
                    // 显示正在打包的消息弹窗
                    showMessagePopup('正在打包，请稍候...');
                    console.log('开始打包，选择的文件数量:', selectedUrls.length);
                    await downloadSelectedFiles(selectedUrls);
                    console.log('打包完成，开始下载zip文件');
                    // 关闭正在打包的消息弹窗
                    closeMessagePopup();
                    document.body.removeChild(popup);
                } catch (error) {
                    // 关闭正在打包的消息弹窗
                    closeMessagePopup();
                    console.error('打包过程中出现错误:', error);
                    alert('打包过程中出现错误，请查看控制台日志。');
                }
            }
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(developerNameElement);
        buttonContainer.appendChild(downloadButton);

        popup.appendChild(grid);
        popup.appendChild(buttonContainer);
        document.body.appendChild(popup);
    }

    // 下载选择的文件并打包成zip
    async function downloadSelectedFiles(selectedUrls) {
        const title = document.title.replace(/[\/:*?"<>|]/g, '_'); // 去除文件名中的非法字符
        const batchSize = 10; // 每批处理的文件数量
        const validFormats = ['jpg', 'jpeg', 'png', 'mp4', 'avi' , 'webp']; // 支持的文件格式

        const zip = new PizZip();

        console.log('开始下载选中的文件并添加到zip包中');
        for (let i = 0; i < selectedUrls.length; i += batchSize) {
            const batchUrls = selectedUrls.slice(i, i + batchSize);
            const batchPromises = batchUrls.map(async (url, index) => {
                const ext = url.split('.').pop().split('?')[0].toLowerCase();
                const type = ext.match(/(jpg|jpeg|png|gif)/i) ? 'image' : 'video';
                const timestamp = new Date().getTime();
                const filename = `${type}_${timestamp}.${ext}`;

                if (!validFormats.includes(ext)) {
                    console.error(`不支持的文件格式，跳过:`, url);
                    return;
                }

                console.log(`开始下载文件 (${i + index + 1}/${selectedUrls.length}):`, url);
                await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        responseType: 'blob',
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                            'Accept': 'image/*, video/*'
                        },
                        onload: async function (response) {
                            console.log(`文件下载成功 (${i + index + 1}/${selectedUrls.length}):`, url);
                            try {
                                const arrayBuffer = await response.response.arrayBuffer();
                                zip.file(filename, arrayBuffer);
                                resolve();
                            } catch (err) {
                                console.error(`处理文件时出错 (${i + index + 1}/${selectedUrls.length}):`, url, err);
                                resolve();
                            }
                        },
                        onerror: function (error) {
                            console.error(`文件下载失败 (${i + index + 1}/${selectedUrls.length}):`, url, error);
                            resolve();
                        },
                        ontimeout: function () {
                            console.error(`文件下载超时 (${i + index + 1}/${selectedUrls.length}):`, url);
                            resolve();
                        }
                    });
                });
            });

            await Promise.all(batchPromises);
        }

        console.log('所有文件下载完成，开始生成zip文件');
        try {
            const startTime = Date.now();
            const zipBlob = zip.generate({ type: 'blob' });
            const endTime = Date.now();
            console.log(`zip文件生成成功，耗时: ${(endTime - startTime) / 1000} 秒，开始保存`);
            saveAs(zipBlob, `${title}.zip`);
            console.log('zip文件保存成功');
        } catch (error) {
            console.error('生成zip文件时出现错误:', error);
            throw error;
        }
    }

    // 检查图片是否需要过滤
    function shouldFilter(img) {
    // 检查图片格式是否为gif
    if (img.type === 'image/gif') {
        return true;
    }
    // 检查图片高度是否低于100像素
    if (img.height < 100) {
        return true;
    }
    // 如果图片格式不是gif且高度不低于100像素，则不过滤
    return false;
    }
})();