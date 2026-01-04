// ==UserScript==
// @name         Appstorrent游戏信息抓取器
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  抓取Appstorrent游戏页面信息并下载图片
// @author       You
// @match        https://appstorrent.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543996/Appstorrent%E6%B8%B8%E6%88%8F%E4%BF%A1%E6%81%AF%E6%8A%93%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/543996/Appstorrent%E6%B8%B8%E6%88%8F%E4%BF%A1%E6%81%AF%E6%8A%93%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加抓取按钮
    function addScrapeButton() {
        const button = document.createElement('button');
        button.innerHTML = '🎮 抓取游戏信息';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            padding: 10px 15px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        `;

        button.onclick = scrapeGameInfo;
        document.body.appendChild(button);
    }

    // 将webp转换为jpg
    function convertWebpToJpg(blob) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;

                // 设置白色背景（jpg不支持透明）
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // 绘制图片
                ctx.drawImage(img, 0, 0);

                // 转换为jpg blob
                canvas.toBlob((jpgBlob) => {
                    resolve(jpgBlob);
                }, 'image/jpeg', 0.9); // 90%质量
            };

            img.onerror = function() {
                console.log('图片转换失败，使用原格式');
                resolve(blob);
            };

            img.src = URL.createObjectURL(blob);
        });
    }

    // 下载单张图片
    async function downloadImage(url, filename) {
        try {
            const response = await fetch(url);
            let blob = await response.blob();

            // 如果是webp格式，转换为jpg
            if (url.toLowerCase().includes('.webp')) {
                console.log(`转换webp为jpg: ${filename}`);
                blob = await convertWebpToJpg(blob);
                // 修改文件名扩展名
                filename = filename.replace(/\.webp$/i, '.jpg');
            }

            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl);

            console.log(`✓ 下载完成: ${filename}`);
            return true;
        } catch (error) {
            console.log(`✗ 下载失败: ${filename} - ${error}`);
            return false;
        }
    }

    // 批量下载图片
    async function downloadAllImages(imageUrls, gameName) {
        const safeName = gameName.replace(/[<>:"/\\|?*]/g, '_');
        let successCount = 0;

        for (let i = 0; i < imageUrls.length; i++) {
            const url = imageUrls[i];
            let extension = url.split('.').pop().toLowerCase();

            // 如果是webp，转换为jpg
            if (extension === 'webp') {
                extension = 'jpg';
            }

            const filename = `${safeName}_screenshot_${i + 1}.${extension}`;

            const success = await downloadImage(url, filename);
            if (success) successCount++;

            // 添加延迟避免请求过快
            await new Promise(resolve => setTimeout(resolve, 800));
        }

        return successCount;
    }

    // 抓取游戏信息
    async function scrapeGameInfo() {
        console.log('开始抓取游戏信息...');

        const gameInfo = {
            name: '',
            description: '',
            dlc_content: '',
            publish_date: '',
            image_urls: [],
            source_url: window.location.href
        };

        // 提取游戏名称
        const titleElem = document.querySelector('h1');
        if (titleElem) {
            gameInfo.name = titleElem.textContent.trim();
            console.log(`✓ 找到标题: ${gameInfo.name}`);
        }

        // 提取发布时间
        const allText = document.body.textContent;
        const dateMatch = allText.match(/Опубликовано[^:]*:\s*([^\n]+)/);
        if (dateMatch) {
            let rawDate = dateMatch[1].trim();
            // 转换俄语日期格式
            const monthMap = {
                'января': '01', 'февраля': '02', 'марта': '03', 'апреля': '04',
                'мая': '05', 'июня': '06', 'июля': '07', 'августа': '08',
                'сентября': '09', 'октября': '10', 'ноября': '11', 'декабря': '12'
            };

            // 匹配格式：日 月 年
            const ruDateMatch = rawDate.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
            if (ruDateMatch) {
                const day = ruDateMatch[1].padStart(2, '0');
                const month = monthMap[ruDateMatch[2]] || '01';
                const year = ruDateMatch[3];
                gameInfo.publish_date = `${year}年${month}月${day}日`;
            } else {
                gameInfo.publish_date = rawDate;
            }
            console.log(`✓ 找到发布时间: ${gameInfo.publish_date}`);
        }

        // 提取完整内容
        const contentArea = document.querySelector('.body-content');
        if (contentArea) {
            const textContent = contentArea.textContent || '';
            gameInfo.description = textContent.trim();
            console.log(`✓ 找到描述: ${gameInfo.description.length} 字符`);
        }

        // 提取图片 - 专门从截图区域抓取
        const screenshotsArea = document.querySelector('.screenshots');
        if (screenshotsArea) {
            console.log('找到截图区域，开始提取图片...');

            // 从swiper-slide中提取图片链接
            const slides = screenshotsArea.querySelectorAll('.swiper-slide a.highslide');
            console.log(`截图区域找到 ${slides.length} 个图片链接`);

            slides.forEach((link, index) => {
                const href = link.href;
                if (href && href.match(/\.(jpg|jpeg|png|webp)$/i)) {
                    gameInfo.image_urls.push(href);
                    console.log(`  ✓ 添加截图 ${index + 1}: ${href}`);
                }
            });

            // 如果没有找到href链接，尝试从img标签获取src
            if (gameInfo.image_urls.length === 0) {
                const images = screenshotsArea.querySelectorAll('.swiper-slide img');
                console.log(`尝试从img标签获取，找到 ${images.length} 个图片`);

                images.forEach((img, index) => {
                    let src = img.src;
                    // 如果是相对路径，转换为绝对路径
                    if (src.startsWith('/')) {
                        src = window.location.origin + src;
                    }
                    if (src && src.match(/\.(jpg|jpeg|png|webp)$/i)) {
                        gameInfo.image_urls.push(src);
                        console.log(`  ✓ 添加图片 ${index + 1}: ${src}`);
                    }
                });
            }
        } else {
            console.log('未找到截图区域，使用备用方案...');

            // 备用方案：从整个页面抓取
            const images = document.querySelectorAll('img');
            images.forEach((img) => {
                const src = img.src;
                if (src && src.includes('/uploads/posts/') &&
                    !src.includes('/thumbs/') &&
                    src.match(/\.(jpg|jpeg|png|webp)$/i)) {
                    if (!gameInfo.image_urls.includes(src)) {
                        gameInfo.image_urls.push(src);
                    }
                }
            });
        }

        console.log(`最终提取到 ${gameInfo.image_urls.length} 张图片`);

        // 显示结果
        displayResults(gameInfo);
    }

    // 显示结果
    function displayResults(gameInfo) {
        console.log('=== displayResults 开始 ===');

        // 构建结果文本
        const name = gameInfo.name || '未知游戏';
        const date = gameInfo.publish_date || '未知日期';
        const desc = gameInfo.description || '暂无描述';
        const imageCount = gameInfo.image_urls.length;

        let resultText = `游戏名称: ${name}\n\n`;
        resultText += `发布时间: ${date}\n\n`;
        resultText += `游戏介绍:\n${desc}\n\n`;
        resultText += `图片链接 (${imageCount}张):\n`;
        resultText += gameInfo.image_urls.join('\n') + '\n\n';
        resultText += `来源: ${gameInfo.source_url}`;

        // 创建弹窗
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 10px;
            width: 80%;
            height: 80%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;

        const title = document.createElement('h3');
        title.textContent = '游戏信息抓取结果';
        title.style.cssText = `
            margin: 0 0 15px 0;
            color: black;
            text-align: center;
        `;

        const textarea = document.createElement('textarea');
        textarea.style.cssText = `
            flex: 1;
            width: 100%;
            font-family: monospace;
            font-size: 12px;
            border: 1px solid #ccc;
            padding: 10px;
            background: white;
            color: black;
            resize: none;
            overflow-y: auto;
            box-sizing: border-box;
        `;

        textarea.value = resultText;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            margin-top: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
        `;

        const downloadTextBtn = document.createElement('button');
        downloadTextBtn.textContent = '下载文本文件';
        downloadTextBtn.style.cssText = `
            flex: 1;
            padding: 10px 20px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;

        const downloadImagesBtn = document.createElement('button');
        downloadImagesBtn.textContent = `下载图片 (${imageCount}张)`;
        downloadImagesBtn.style.cssText = `
            flex: 1;
            padding: 10px 20px;
            background: #FF9800;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.cssText = `
            flex: 1;
            padding: 10px 20px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;

        // 事件处理
        downloadTextBtn.onclick = () => {
            const blob = new Blob([resultText], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${name.replace(/[<>:"/\\|?*]/g, '_')}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };

        downloadImagesBtn.onclick = async () => {
            if (gameInfo.image_urls.length === 0) {
                alert('没有找到图片可下载');
                return;
            }

            downloadImagesBtn.textContent = '下载中...';
            downloadImagesBtn.disabled = true;

            const successCount = await downloadAllImages(gameInfo.image_urls, name);

            downloadImagesBtn.textContent = `下载完成 (${successCount}/${imageCount})`;
            downloadImagesBtn.style.background = '#4CAF50';

            setTimeout(() => {
                downloadImagesBtn.textContent = `下载图片 (${imageCount}张)`;
                downloadImagesBtn.style.background = '#FF9800';
                downloadImagesBtn.disabled = false;
            }, 3000);
        };

        closeBtn.onclick = () => {
            document.body.removeChild(modal);
        };

        // 组装弹窗
        buttonContainer.appendChild(downloadTextBtn);
        buttonContainer.appendChild(downloadImagesBtn);
        buttonContainer.appendChild(closeBtn);

        content.appendChild(title);
        content.appendChild(textarea);
        content.appendChild(buttonContainer);
        modal.appendChild(content);
        document.body.appendChild(modal);

        console.log('弹窗已添加到页面');
    }

    // 页面加载完成后添加按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addScrapeButton);
    } else {
        addScrapeButton();
    }
})();