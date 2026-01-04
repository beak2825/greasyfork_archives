// ==UserScript==
// @name         小红书图片下载器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  小红书图片下载器，相同哈希值的图片只保留一张
// @author       pleia
// @match        https://www.xiaohongshu.com/*
// @grant        GM_download
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MIT; https://opensource.org/licenses/MIT
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/536092/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/536092/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加必要的库 - JSZip 和 SparkMD5
    const script1 = document.createElement('script');
    script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';

    const script2 = document.createElement('script');
    script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/spark-md5/3.0.2/spark-md5.min.js';

    let scriptsLoaded = 0;
    const onScriptLoaded = () => {
        scriptsLoaded++;
        if (scriptsLoaded === 2) {
            init();
        }
    };

    script1.onload = onScriptLoaded;
    script2.onload = onScriptLoaded;

    document.head.appendChild(script1);
    document.head.appendChild(script2);

    // 添加下载按钮样式
    GM_addStyle(`
        .xhs-download-btn {
            position: fixed;
            bottom: 50px;
            right: 50px;
            background: linear-gradient(135deg, #ff2442 0%, #ff768a 100%);
            color: white;
            border: none;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            font-size: 18px;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(255, 36, 66, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: all 0.3s ease;
            transform-origin: center;
            animation: pulse 2s infinite;
        }

        .xhs-download-btn:hover {
            transform: scale(1.15);
            box-shadow: 0 6px 25px rgba(255, 36, 66, 0.5);
            animation: none;
        }

        .xhs-download-btn:active {
            transform: scale(0.95);
            box-shadow: 0 2px 10px rgba(255, 36, 66, 0.3);
        }

        @keyframes pulse {
            0% {
                box-shadow: 0 0 0 0 rgba(255, 36, 66, 0.4);
            }
            70% {
                box-shadow: 0 0 0 10px rgba(255, 36, 66, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(255, 36, 66, 0);
            }
        }

        .download-progress {
            position: fixed;
            bottom: 120px;
            right: 50px;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px 15px;
            border-radius: 25px;
            font-size: 14px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 9998;
        }

        .download-progress.show {
            opacity: 1;
        }

        /* 下载图标样式 */
        .download-icon {
            width: 24px;
            height: 24px;
            position: relative;
        }

        .download-icon::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 16px;
            height: 16px;
            border: 2px solid white;
            border-radius: 2px;
        }

        .download-icon::after {
            content: '';
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 8px solid white;
        }

        .download-icon span {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 12px;
            height: 2px;
            background-color: white;
        }
    `);

    // 初始化函数
    function init() {
        // 创建下载按钮
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'xhs-download-btn';
        downloadBtn.innerHTML = '<div class="download-icon"></div>';
        document.body.appendChild(downloadBtn);

        // 创建进度提示元素
        const progressIndicator = document.createElement('div');
        progressIndicator.className = 'download-progress';
        document.body.appendChild(progressIndicator);

        // 点击按钮时执行下载操作
        downloadBtn.addEventListener('click', async function() {
            // 获取并处理页面标题作为文件名基础
            const pageTitle = getSafeFileName(document.title);

            // 尝试查找所有img-container元素
            const imgContainers = document.querySelectorAll('.img-container');

            // 如果找到img-container
            if (imgContainers.length > 0) {
                // 获取所有可见图片
                const visibleImages = getVisibleImages(imgContainers);

                // 如果没有可见图片
                if (visibleImages.length === 0) {
                    alert('未找到可见图片!');
                    return;
                }

                // 计算图片哈希值并去重
                progressIndicator.textContent = '正在计算图片哈希值...';
                progressIndicator.classList.add('show');

                const uniqueImages = await getUniqueImagesByHash(visibleImages, progressIndicator);

                // 如果只有一张图片，直接下载
                if (uniqueImages.length === 1) {
                    progressIndicator.textContent = '准备下载单张图片...';

                    try {
                        await downloadSingleImage(uniqueImages[0].element, progressIndicator, pageTitle);
                        progressIndicator.textContent = '图片下载完成!';
                        setTimeout(() => {
                            progressIndicator.classList.remove('show');
                        }, 3000);
                    } catch (error) {
                        console.error('下载图片失败:', error);
                        progressIndicator.textContent = `下载失败: ${error.message}`;
                        setTimeout(() => {
                            progressIndicator.classList.remove('show');
                        }, 3000);
                        alert(`下载图片失败: ${error.message}`);
                    }

                    return;
                }

                // 多张图片，打包下载
                progressIndicator.textContent = `找到 ${uniqueImages.length} 张不重复图片，准备打包下载...`;

                try {
                    await downloadAndZipUniqueImages(uniqueImages, progressIndicator, pageTitle);
                    progressIndicator.textContent = '所有不重复图片打包下载完成!';
                    setTimeout(() => {
                        progressIndicator.classList.remove('show');
                    }, 3000);
                } catch (error) {
                    console.error('打包下载失败:', error);
                    progressIndicator.textContent = `打包下载失败: ${error.message}`;
                    setTimeout(() => {
                        progressIndicator.classList.remove('show');
                    }, 3000);
                    alert(`打包下载失败: ${error.message}`);
                }

                return;
            }

            // 如果没有找到img-container
            alert('未找到图片容器元素!');
        });
    }

    // 获取所有可见图片
    function getVisibleImages(imgContainers) {
        const visibleImages = [];

        imgContainers.forEach(container => {
            const images = container.querySelectorAll('img');

            images.forEach(img => {
                // 过滤掉不可见的图片
                if (isElementVisible(img)) {
                    visibleImages.push(img);
                }
            });
        });

        return visibleImages;
    }

    // 检查元素是否可见
    function isElementVisible(el) {
        if (!el) return false;

        const style = window.getComputedStyle(el);
        if (style.display === 'none') return false;
        if (style.visibility !== 'visible') return false;
        if (style.opacity < 0.1) return false;

        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;

        // 检查元素是否在视窗内
        const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
        return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
    }

    // 计算图片哈希值并去重
    async function getUniqueImagesByHash(images, progressIndicator) {
        const hashSet = new Set();
        const uniqueImages = [];
        const totalImages = images.length;

        for (let i = 0; i < totalImages; i++) {
            const img = images[i];
            progressIndicator.textContent = `正在计算图片哈希值 ${i + 1}/${totalImages}`;

            try {
                const hash = await getImageHash(img);
                if (!hashSet.has(hash)) {
                    hashSet.add(hash);
                    uniqueImages.push({
                        element: img,
                        hash: hash
                    });
                }
            } catch (error) {
                console.error(`计算图片哈希失败: ${error}`);
                // 计算失败的情况下，默认保留图片
                uniqueImages.push({
                    element: img,
                    hash: null
                });
            }
        }

        return uniqueImages;
    }

    // 计算图片的MD5哈希值
    async function getImageHash(imgElement) {
        const src = imgElement.src || imgElement.dataset.src;
        if (!src) {
            throw new Error('无法获取图片源');
        }

        // 处理图片URL，确保是完整URL
        let imageUrl = src;
        if (!imageUrl.startsWith('http')) {
            if (imageUrl.startsWith('//')) {
                imageUrl = 'https:' + imageUrl;
            } else {
                const baseUrl = window.location.origin;
                imageUrl = new URL(imageUrl, baseUrl).href;
            }
        }

        // 下载图片并计算哈希
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            const spark = new SparkMD5.ArrayBuffer();

            fileReader.onload = function(e) {
                spark.append(e.target.result);
                resolve(spark.end());
            };

            fileReader.onerror = function() {
                reject(new Error('读取图片失败'));
            };

            fileReader.readAsArrayBuffer(blob);
        });
    }

    // 下载单张图片
    async function downloadSingleImage(imgElement, progressIndicator, pageTitle) {
        const src = imgElement.src || imgElement.dataset.src;
        if (!src) {
            throw new Error('无法获取图片源');
        }

        // 处理图片URL，确保是完整URL
        let imageUrl = src;
        if (!imageUrl.startsWith('http')) {
            if (imageUrl.startsWith('//')) {
                imageUrl = 'https:' + imageUrl;
            } else {
                const baseUrl = window.location.origin;
                imageUrl = new URL(imageUrl, baseUrl).href;
            }
        }

        try {
            // 尝试获取图片扩展名
            let fileExtension = 'jpg';
            const urlParts = imageUrl.split('.');
            if (urlParts.length > 1) {
                const lastPart = urlParts[urlParts.length - 1].toLowerCase();
                if (lastPart.length <= 5) { // 简单验证是否是扩展名
                    fileExtension = lastPart;
                }
            }

            // 生成图片文件名，使用页面标题
            const fileName = `${pageTitle}.${fileExtension}`;

            // 更新进度提示
            progressIndicator.textContent = '正在下载图片...';

            // 使用GM_download API下载图片
            await new Promise((resolve, reject) => {
                GM_download({
                    url: imageUrl,
                    name: fileName,
                    onerror: reject,
                    onload: resolve
                });
            });

            console.log(`成功下载图片 ${fileName}`);
        } catch (error) {
            console.error(`下载图片失败: ${error}`);
            throw error;
        }
    }

    // 下载并打包不重复的图片
    async function downloadAndZipUniqueImages(uniqueImages, progressIndicator, pageTitle) {
        const zip = new JSZip();
        const totalImages = uniqueImages.length;
        let processedImages = 0;

        // 遍历下载所有不重复图片
        for (let i = 0; i < totalImages; i++) {
            const imgInfo = uniqueImages[i];
            const img = imgInfo.element;
            const src = img.src || img.dataset.src;

            if (!src) continue;

            // 处理图片URL，确保是完整URL
            let imageUrl = src;
            if (!imageUrl.startsWith('http')) {
                if (imageUrl.startsWith('//')) {
                    imageUrl = 'https:' + imageUrl;
                } else {
                    const baseUrl = window.location.origin;
                    imageUrl = new URL(imageUrl, baseUrl).href;
                }
            }

            try {
                // 更新进度提示
                progressIndicator.textContent = `正在下载 ${processedImages + 1}/${totalImages}`;

                // 下载图片并添加到zip
                const response = await fetch(imageUrl);
                const blob = await response.blob();

                // 尝试获取图片扩展名
                let fileExtension = 'jpg';
                const urlParts = imageUrl.split('.');
                if (urlParts.length > 1) {
                    const lastPart = urlParts[urlParts.length - 1].toLowerCase();
                    if (lastPart.length <= 5) { // 简单验证是否是扩展名
                        fileExtension = lastPart;
                    }
                }

                // 生成图片文件名，使用页面标题、序号和哈希值
                const fileName = imgInfo.hash
                    ? `${pageTitle}_${processedImages + 1}_${imgInfo.hash.substring(0, 8)}.${fileExtension}`
                    : `${pageTitle}_${processedImages + 1}.${fileExtension}`;

                zip.file(fileName, blob);

                processedImages++;
                console.log(`成功添加图片到zip: ${fileName}`);
            } catch (error) {
                console.error(`下载图片失败: ${error}`);
                // 继续处理其他图片，不中断整个过程
            }
        }

        // 生成并下载zip文件
        if (processedImages > 0) {
            progressIndicator.textContent = '正在生成ZIP文件...';

            // 生成ZIP文件，使用页面标题
            const zipFileName = `${pageTitle}.zip`;
            const content = await zip.generateAsync({ type: 'blob' });

            // 创建下载链接
            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = zipFileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            throw new Error('没有成功下载任何图片');
        }
    }

    // 处理文件名，移除不合法字符
    function getSafeFileName(name) {
        // 移除或替换不合法的文件名字符
        return name
            .replace(/[<>:"/\\|?*]/g, '_')  // 替换不合法字符为下划线
            .replace(/\s+/g, '_')           // 替换空格为下划线
            .substring(0, 80)               // 限制最大长度
            .trim();                        // 移除首尾空格
    }
})();
