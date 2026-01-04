// ==UserScript==
// @name         小红书帖子内容下载增强版
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在油猴菜单中添加下载选项，支持下载帖子文本(TXT)和完整内容(HTML含图片)
// @author       schweigen
// @match        *://*.xiaohongshu.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533415/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%B8%96%E5%AD%90%E5%86%85%E5%AE%B9%E4%B8%8B%E8%BD%BD%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/533415/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%B8%96%E5%AD%90%E5%86%85%E5%AE%B9%E4%B8%8B%E8%BD%BD%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注册菜单命令
    GM_registerMenuCommand("📄 下载帖子TXT", downloadTXT);
    GM_registerMenuCommand("🌐 下载帖子HTML(含图片)", downloadHTML);

    // 从帖子中提取文本内容
    function extractPostContent() {
        const descContainer = document.getElementById("detail-desc");
        if (!descContainer) {
            alert("未找到帖子内容，请确认页面已加载完毕！");
            return null;
        }
        return descContainer.innerText || descContainer.textContent;
    }

    // 提取帖子中的所有图片URL（只提取帖子主体图片，排除评论区）
    function extractImageUrls() {
        const images = [];
        const processedUrls = new Set();
        
        console.log('开始提取图片...');
        
        // 方法1：直接查找轮播图片 (swiper组件)
        const swiperWrapper = document.querySelector('.swiper-wrapper');
        if (swiperWrapper) {
            console.log('找到轮播容器');
            // 只取非duplicate的slide，按DOM顺序
            const swiperSlides = swiperWrapper.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)');
            console.log('非duplicate的slide数量:', swiperSlides.length);
            
            swiperSlides.forEach((slide, index) => {
                const img = slide.querySelector('img[data-xhs-img]');
                if (img && img.src && !processedUrls.has(img.src)) {
                    console.log(`提取图片 ${index + 1}:`, img.src);
                    images.push(img.src);
                    processedUrls.add(img.src);
                }
            });
        }
        
        // 方法2：如果轮播没找到图片，尝试查找帖子区域的图片
        if (images.length === 0) {
            console.log('轮播中未找到图片，尝试其他方式...');
            // 查找所有小红书图片，但排除明显的评论区图片
            const allImages = document.querySelectorAll('img[src*="sns-webpic-qc.xhscdn.com"]');
            console.log('找到所有小红书图片数量:', allImages.length);
            
            allImages.forEach((img, index) => {
                // 排除评论区图片的判断
                const isInComment = img.closest('[class*="comment"]') || 
                                   img.closest('[class*="interaction"]') ||
                                   img.closest('[class*="user-info"]') ||
                                   img.closest('[data-v-5e5b6d96]'); // 评论区可能的class
                
                if (!isInComment && img.src && !processedUrls.has(img.src)) {
                    console.log(`备用方法提取图片 ${index + 1}:`, img.src);
                    images.push(img.src);
                    processedUrls.add(img.src);
                }
            });
        }

        console.log('最终提取到的图片数量:', images.length);
        console.log('图片URLs:', images);
        return images;
    }

    // 将图片URL转换为Base64
    async function imageToBase64(url) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('转换图片失败:', url, error);
            return null;
        }
    }

    // 下载TXT格式
    function downloadTXT() {
        const content = extractPostContent();
        if (!content) return;

        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const filename = (document.title || "xiaohongshu_post") + ".txt";
        
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    // 下载HTML格式（含图片）
    async function downloadHTML() {
        const content = extractPostContent();
        if (!content) return;

        const imageUrls = extractImageUrls();
        console.log('找到图片:', imageUrls.length, '张');

        // 显示加载提示
        const loadingDiv = document.createElement('div');
        loadingDiv.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 8px;
            z-index: 10000; font-size: 16px; text-align: center;
        `;
        loadingDiv.textContent = '正在处理图片，请稍候...';
        document.body.appendChild(loadingDiv);

        try {
            // 转换所有图片为Base64
            const imagePromises = imageUrls.map(async (url, index) => {
                loadingDiv.textContent = `正在处理图片 ${index + 1}/${imageUrls.length}...`;
                const base64 = await imageToBase64(url);
                return { url, base64 };
            });

            const imageResults = await Promise.all(imagePromises);

            // 构建HTML内容
            let htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${document.title || '小红书帖子'}</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            max-width: 800px; margin: 20px auto; padding: 20px; line-height: 1.6;
            background: #f5f5f5;
        }
        .container {
            background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.1);
        }
        .title { font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #333; }
        .content { margin-bottom: 30px; white-space: pre-wrap; color: #555; }
        .images { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; }
        .image-item { text-align: center; }
        .image-item img { 
            max-width: 100%; height: auto; border-radius: 8px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
        }
        .footer { margin-top: 30px; text-align: center; color: #999; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="title">${document.title || '小红书帖子'}</div>
        <div class="content">${content}</div>
        <div class="images">
`;

            // 添加图片
            imageResults.forEach((result, index) => {
                if (result.base64) {
                    htmlContent += `
            <div class="image-item">
                <img src="${result.base64}" alt="图片 ${index + 1}" />
            </div>`;
                }
            });

            htmlContent += `
        </div>
        <div class="footer">
            <p>下载时间: ${new Date().toLocaleString()}</p>
            <p>来源: ${window.location.href}</p>
        </div>
    </div>
</body>
</html>`;

            // 下载HTML文件
            const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const filename = (document.title || "xiaohongshu_post") + ".html";
            
            const downloadLink = document.createElement("a");
            downloadLink.href = url;
            downloadLink.download = filename;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            setTimeout(() => URL.revokeObjectURL(url), 1000);

        } catch (error) {
            console.error('下载HTML失败:', error);
            alert('下载失败: ' + error.message);
        } finally {
            document.body.removeChild(loadingDiv);
        }
    }
})();
