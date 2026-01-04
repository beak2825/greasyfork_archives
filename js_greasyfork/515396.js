// ==UserScript==
// @name         自动下载模型站预览与简介
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically download images and description of some model site. 需要在油猴脚本中设置-通用开启高级模式，然后在下载 BETA中下载模式选择浏览器api，然后增加json进白名单（或者不想下json也可以不设置）。支持模之屋、bowlroll、booth。
// @author       SMatsuri
// @match        *.aplaybox.com/details/model/*
// @match        *bowlroll.net/file/*
// @match        *booth.pm/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515396/%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E6%A8%A1%E5%9E%8B%E7%AB%99%E9%A2%84%E8%A7%88%E4%B8%8E%E7%AE%80%E4%BB%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/515396/%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E6%A8%A1%E5%9E%8B%E7%AB%99%E9%A2%84%E8%A7%88%E4%B8%8E%E7%AE%80%E4%BB%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建下载按钮
    const button = document.createElement('button');
    button.innerText = '下载图片和简介';
    button.id = 'downloadBtn';

    // 添加样式，使按钮位于页面右下角
    const style = document.createElement('style');
    style.innerHTML = `
        #downloadBtn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            z-index: 10000;
        }
        #downloadBtn:hover {
            background-color: #45a049;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(button);

    // 当前网站类型
    const currentSite = window.location.hostname.includes('aplaybox.com') ? 'aplaybox' :
                        window.location.hostname.includes('bowlroll.net') ? 'bowlroll' : 
                        window.location.hostname.includes('booth.pm') ? 'booth' : 'unknown';

    // 保存工作详情
    let Details = null;

    // 提取 URL 中的数字 ID，例如 https://bowlroll.net/file/326016 提取为 326016
    function extractIdFromUrl(url) {
        const match = url.match(/\/file\/(\d+)/); // 匹配 URL 中的文件 ID
        return match ? match[1] : 'No_ID'; // 如果匹配成功，则返回文件 ID，否则返回 "No_ID"
    }

    let currentId = null;

    // 获取当前页面的数字 ID
    if (currentSite === 'bowlroll' || currentSite === 'booth'){
        currentId = extractIdFromUrl(window.location.href);
    }

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this.addEventListener('load', function() {
            if (currentSite === 'aplaybox') {
                if (url.includes('getWorkDetails')) { // 检查是否是 getWorkDetails 请求
                    try {
                        const response = JSON.parse(this.responseText); // 解析 JSON 响应
                        if (response.status === "success" && response.code === 200 && response.data && response.data.result && response.data.result.data) {
                            Details = response.data.result.data; // 存储工作详情
                            console.log('Aplaybox Work details captured:', Details);
                        }
                    } catch (e) {
                        console.error('解析 Aplaybox 响应失败:', e);
                    }
                }
            }
        });
        originalOpen.apply(this, arguments);
    };

    // 按钮点击事件处理
    button.addEventListener('click', function() {
        if (currentSite === 'aplaybox') {
            if (Details) {
                handleAplaybox(Details);
            } else {
                alert('工作详情尚未加载，或请求尚未捕获。请稍后再试。');
            }
        } else if (currentSite === 'bowlroll') {
            handleBowlroll();
        } else if (currentSite === 'booth') {
            handleBooth();
        } else {
            alert('当前网站不受支持。');
        }
    });

    // 处理 Aplaybox 的下载
    function handleAplaybox(data) {
        const workName = sanitizeFileName(data.work_name || "Unnamed_Work");
        const introduction = 'Aplaybox\n\n' + decodeUnicode(data.introduction).replace(/\n/g, '\r\n');
        const coverUrl = data.cover;
        const previewImages = data.preview_images;

        // Step 1: 下载 JSON 文件
        const jsonData = JSON.stringify(data, null, 2);
        downloadFile(workName + '/metadata.json', jsonData, 'application/json');

        // Step 2: 下载简介
        downloadFile(workName + '/readme.txt', introduction, 'text/plain');

        // 创建一个 Set 用于存储已下载的图片 URL
        const downloadedImages = new Set();

        // Step 3: 下载封面图片
        downloadImageAplaybox(coverUrl, workName + '/preview0.jpg');
        downloadedImages.add(coverUrl); // 添加到已下载集合中

        // Step 4: 下载预览图片
        previewImages.forEach((imgUrl, index) => {
            // 检查图片 URL 是否已经下载过，避免重复下载
            if (imgUrl && !downloadedImages.has(imgUrl)) {
                downloadedImages.add(imgUrl); // 添加到已下载集合中
                downloadImageAplaybox(imgUrl, `${workName}/preview${index + 1}.jpg`);
            }

        });
    }

    // 处理 BowlRoll 的下载
    function handleBowlroll() {
        // 提取 meta 标签中的信息
        const title = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || 'No Title';
        const description = document.querySelector('meta[name="description"]')?.getAttribute('content') ||
                            document.querySelector('meta[property="og:description"]')?.getAttribute('content') || 'No Description';
        const imageUrl = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';

        const workName = sanitizeFileName(title);

        // 下载并合并文件
        downloadBowlrolldata(workName, description);

        downloadImage(imageUrl, workName + '/preview0.jpg');
    }

    // 使用 GM_xmlhttpRequest 代替 GM_download 来获取 JSON/二进制内容并处理
    function downloadBowlrolldata(workName, introduction) {
        // 获取 message 内容
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://bowlroll.net/api/file/' + currentId + '/message',
            responseType: 'json', // 我们假设 API 返回的是 JSON 格式
            onload: function(response) {
                if (response.status === 200) {
                    const messageData = response.response; // 获取 message 数据
                    const messageText = decodeUnicode(messageData.message); // 解码 message 字段

                    // 继续获取 tags 内容
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: 'https://bowlroll.net/api/file/' + currentId + '/tags',
                        responseType: 'json', // 我们假设 API 返回的是 JSON 格式
                        onload: function(response) {
                            if (response.status === 200) {
                                const tagsData = response.response.tags; // 获取 tags 数组
                                const tagsText = extractTags(tagsData); // 提取并解码 tags 的 name 字段

                                // 合并 messageText、tagsText 和 introduction
                                const combinedText = `Bowlroll\n\n${introduction}\n\n---\n\nMessage:\n${messageText}\n\nTags:\n${tagsText}`;

                                // 下载合并后的文件
                                downloadFile(workName + '/readme.txt', combinedText, 'text/plain');
                            } else {
                                console.error('下载 tags 时出错，状态码：', response.status);
                            }
                        },
                        onerror: function(err) {
                            console.error('下载 tags 时发生错误：', err);
                        }
                    });
                } else {
                    console.error('下载 message 时出错，状态码：', response.status);
                }
            },
            onerror: function(err) {
                console.error('下载 message 时发生错误：', err);
            }
        });
    }

    function handleBooth() {
        // 提取标题作为工作名称
        const title = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || 'No Title';
        const workName = sanitizeFileName(title); // 清理标题作为文件夹名
    
        // 提取完整的简介内容，包括所有 <p> 和 <section> 内的文本
        const descriptionElement = document.querySelector('.js-market-item-detail-description');
        let introduction = 'Booth\n\n';

        if (descriptionElement) {
            // 遍历包含介绍内容的 <p>、<section> 及其他相关元素，提取其文本
            const descriptionParts = descriptionElement.querySelectorAll('p, section');
            descriptionParts.forEach(part => {
                introduction += part.innerText.trim() + '\n\n'; // 每个部分用换行符分隔
            });
        } else {
            introduction = 'No Description Available';
        }

        const descriptionElement2 = document.querySelector('.my-40');

        if (descriptionElement) {
            // 遍历包含介绍内容的 <p>、<section> 及其他相关元素，提取其文本
            const descriptionParts = descriptionElement2.querySelectorAll('p, section');
            descriptionParts.forEach(part => {
                introduction += part.innerText.trim() + '\n\n'; // 每个部分用换行符分隔
            });
        } 
    
        // 下载简介
        downloadFile(workName + '/readme.txt', introduction, 'text/plain');

        GM_download({
            url: window.location.href + '.json',
            name: workName + '/metadata.json',
            onerror: function(err) {
                console.error('下载文件时出错：', err);
            },
            ontimeout: function() {
                console.error('下载文件超时');
            },
            onprogress: function(progress) {
                console.log('下载进度：', progress);
            }
        });
    
        // 创建一个 Set 用于存储已下载的图片 URL
        const downloadedImages = new Set();

        // 提取图片链接并下载
        const images = document.querySelectorAll('.market-item-detail-item-image'); // 获取所有图片元素
        images.forEach((imgElement, index) => {
            const imageUrl = imgElement.getAttribute('data-origin'); // 获取原始图片链接

            // 检查图片 URL 是否已经下载过，避免重复下载
            if (imageUrl && !downloadedImages.has(imageUrl)) {
                downloadedImages.add(imageUrl); // 添加到已下载集合中
                downloadImage(imageUrl, `${workName}/preview${index + 1}.jpg`); // 下载图片
            }
        });
    }

    // 提取并解码 tags 中的 name 字段
    function extractTags(tags) {
        return tags.map(tag => decodeUnicode(tag.name)).join(', ');
    }

    // 解码 Unicode 字符
    function decodeUnicode(str) {
        return unescape(str.replace(/\\u/g, '%u'));
    }

    // 函数：清理文件名中的非法字符
    function sanitizeFileName(fileName) {
        // 移除不允许出现在文件名中的字符，替换为下划线
        return fileName.replace(/[\/\\?%*:|"<>。. ]/g, '_');
    }

    // 使用 GM_download 下载文件
    function downloadFile(filename, content, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);

        // 使用 GM_download 进行下载
        GM_download({
            url: url,
            name: filename,
            onerror: function(err) {
                console.error('下载文件时出错：', err);
                console.error(`文件名: ${filename}`);
                console.error(`URL: ${url}`);
            },
            ontimeout: function() {
                console.error('下载文件超时');
            },
            onprogress: function(progress) {
                console.log('下载进度：', progress);
            }
        });
    }

    // 下载图片的函数
    function downloadImage(url, filename) {
        GM_download({
            url: url,
            name: filename,
            onerror: function(err) {
                console.error('下载图片时出错：', err);
            },
            ontimeout: function() {
                console.error('下载图片超时');
            },
            onprogress: function(progress) {
                console.log('下载进度：', progress);
            }
        });
    }

    function downloadImageAplaybox(url, filename) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'blob', // 下载图片作为二进制数据
            headers: {
                // 添加 Cookie，如果需要的话
                'Cookie': document.cookie, // 自动携带当前页面的所有 Cookies
                'User-Agent': navigator.userAgent, // 模拟普通浏览器请求
                'Referer': window.location.href, // 设置 Referer
            },
            onload: function(response) {
                if (response.status === 200) {
                    // 创建 Blob 对象并下载
                    const blob = response.response;
                    const blobUrl = URL.createObjectURL(blob);
                    GM_download({
                        url: blobUrl,
                        name: filename,
                        saveAs: false,
                        onload: function() {
                            console.log('图片下载成功：', filename);
                        },
                        onerror: function(err) {
                            console.error('下载图片时出错：', err);
                        }
                    });
                } else {
                    console.error('服务器返回错误状态码：', response.status);
                }
            },
            onerror: function(err) {
                console.error('下载图片时发生错误：', err);
            }
        });
    }

})();
