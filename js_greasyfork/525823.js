// ==UserScript==
// @name         8EZY单张图片下载器
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  支持8ezy.com全站的单张无损图片下载
// @author       YourName
// @match        https://8ezy.com/*
// @grant        GM_download
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      8ezy.com
// @downloadURL https://update.greasyfork.org/scripts/525823/8EZY%E5%8D%95%E5%BC%A0%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/525823/8EZY%E5%8D%95%E5%BC%A0%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置中心（用户可自定义部分）
    const CONFIG = {
        THUMB_TO_ORIGINAL: [ // 缩略图转原图路径规则
            ['/thumbs/', '/full/'],
            ['/small/', '/large/'],
            [/\d{3}x\d{3}/, '2000x2000'], // 替换尺寸参数
            [/(\.[a-z]+)\?.*/i, '$1'], // 清除URL参数
        ],
        SCROLL_INTERVAL: 500, // 滚动加载间隔时间（毫秒）
        SCROLL_STEP: 500, // 每次滚动的像素数
    };

    let isProcessing = false;

    // 创建智能下载按钮
    function createSmartButton() {
        const btn = document.createElement('button');
        btn.textContent = '🏞 下载原图';
        btn.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 99999;
            padding: 12px 24px;
            background: linear-gradient(135deg, #2196F3, #4CAF50);
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            font-family: 'Microsoft YaHei', sans-serif;
            transition: transform 0.2s;
        `;
        btn.addEventListener('mouseover', () => (btn.style.transform = 'scale(1.05)'));
        btn.addEventListener('mouseout', () => (btn.style.transform = 'none'));

        document.body.appendChild(btn);
        return btn;
    }

    // 转换缩略图链接为原图链接
    function convertToOriginalUrl(url) {
        for (const [pattern, replacement] of CONFIG.THUMB_TO_ORIGINAL) {
            url = url.replace(pattern, replacement);
        }
        return url;
    }

    // 提取页面中的所有图片链接
    function extractImageUrls() {
        const urls = new Set();

        // 检测所有可能的图片容器
        const candidates = [
            'a[href*=".jpg"]',
            'a[href*=".jpeg"]',
            'a[href*=".png"]',
            'a[href*=".webp"]',
            'img[data-src]',
            'img[data-original]',
            'div[data-src]',
            'source[srcset]',
            'figure[itemprop="image"]',
        ];

        document.querySelectorAll(candidates.join(',')).forEach((el) => {
            let url = '';

            switch (el.tagName) {
                case 'A':
                    url = el.href;
                    break;
                case 'IMG':
                    url = el.dataset.src || el.dataset.original || el.src;
                    break;
                case 'DIV':
                case 'FIGURE':
                    url = el.dataset.src || el.dataset.full;
                    break;
                case 'SOURCE':
                    url = el.srcset.split(' ')[0];
                    break;
            }

            if (url) {
                url = convertToOriginalUrl(url);
                if (/\.(jpe?g|png|webp)(\?.*)?$/i.test(url)) {
                    urls.add(url);
                }
            }
        });

        return Array.from(urls);
    }

    // 自动滚动加载图片
    function autoScrollLoad(callback) {
        let scrollHeight = document.documentElement.scrollHeight;
        let currentScroll = 0;

        const scrollInterval = setInterval(() => {
            window.scrollBy(0, CONFIG.SCROLL_STEP);
            currentScroll += CONFIG.SCROLL_STEP;

            if (currentScroll >= scrollHeight) {
                clearInterval(scrollInterval);
                callback();
            }
        }, CONFIG.SCROLL_INTERVAL);
    }

    // 下载单张图片
    function downloadImage(url, index) {
        const filename = url.split('/').pop().split('#')[0].split('?')[0];
        GM_download({
            url: url,
            name: filename,
            onload: () => {
                console.log(`下载成功: ${filename}`);
            },
            onerror: (error) => {
                console.error(`下载失败: ${filename}`, error);
            },
        });
    }

    // 批量下载图片
    function downloadImages() {
        if (isProcessing) return;
        isProcessing = true;

        const btn = document.getElementById('downloadBtn');
        btn.textContent = '⏳ 加载中...';

        // 自动滚动加载所有图片
        autoScrollLoad(() => {
            const urls = extractImageUrls();
            if (urls.length === 0) {
                alert('未找到图片链接，请确保页面已完全加载！');
                btn.textContent = '🏞 下载原图';
                isProcessing = false;
                return;
            }

            btn.textContent = `📥 下载中 (0/${urls.length})`;

            // 逐一下载图片
            urls.forEach((url, index) => {
                setTimeout(() => {
                    downloadImage(url, index);
                    btn.textContent = `📥 下载中 (${index + 1}/${urls.length})`;

                    // 全部下载完成后恢复按钮状态
                    if (index === urls.length - 1) {
                        btn.textContent = '✅ 下载完成！';
                        setTimeout(() => {
                            btn.textContent = '🏞 下载原图';
                            isProcessing = false;
                        }, 2000);
                    }
                }, index * 500); // 每张图片间隔 500ms 下载
            });
        });
    }

    // 初始化
    function init() {
        const btn = createSmartButton();
        btn.id = 'downloadBtn';
        btn.addEventListener('click', downloadImages);
    }

    // 启动脚本
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();