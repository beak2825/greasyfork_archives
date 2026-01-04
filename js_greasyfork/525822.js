// ==UserScript==
// @name         COS全站图片下载器
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  支持cosjiang.com全站的无损图片下载
// @author       YourName
// @match        https://www.cosjiang.com/*
// @grant        GM_download
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      www.cosjiang.com
// @downloadURL https://update.greasyfork.org/scripts/525822/COS%E5%85%A8%E7%AB%99%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/525822/COS%E5%85%A8%E7%AB%99%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置中心（用户可自定义部分）
    const CONFIG = {
        THUMB_TO_ORIGINAL: [     // 缩略图转原图路径规则
            ['/thumbs/', '/full/'],
            ['/small/', '/large/'],
            [/\d{3}x\d{3}/, '2000x2000'], // 替换尺寸参数
            [/(\.[a-z]+)\?.*/i, '$1']     // 清除URL参数
        ],
        TITLE_SELECTORS: [       // 标题抓取优先级
            'h1.album-title',
            'h1.post-title',
            'h1.title',
            'title'
        ]
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
        btn.addEventListener('mouseover', () => btn.style.transform = 'scale(1.05)');
        btn.addEventListener('mouseout', () => btn.style.transform = 'none');

        document.body.appendChild(btn);
        return btn;
    }

    // 核心处理器
    async function processDownload() {
        if (isProcessing) return;
        isProcessing = true;

        try {
            // 自动滚动加载
            await autoScroll();

            // 获取页面信息
            const pageInfo = {
                title: getPageTitle(),
                url: window.location.href,
                timestamp: new Date().toISOString().slice(0, 10)
            };

            // 提取并处理图片
            const images = Array.from(document.images)
                .map(img => ({
                    src: processImageURL(img.src),
                    alt: img.alt || pageInfo.title
                }))
                .filter(img => /\.(jpe?g|png|webp)(\?|$)/i.test(img.src));

            if (images.length === 0) {
                GM_notification({ title: '⚠️ 未找到图片', text: '请检查页面结构' });
                return;
            }

            // 批量下载
            GM_notification({
                title: '🎉 开始下载',
                text: `找到 ${images.length} 张图片`,
                timeout: 2000
            });

            images.forEach((img, index) => {
                setTimeout(() => {
                    const filename = generateFilename(img, index, pageInfo);
                    GM_download({
                        url: img.src,
                        name: filename,
                        headers: {
                            Referer: pageInfo.url,
                            'User-Agent': navigator.userAgent
                        }
                    });
                }, index * 500); // 防止请求过载
            });

        } catch (error) {
            GM_notification({ title: '❌ 下载失败', text: error.message });
        } finally {
            isProcessing = false;
        }
    }

    // 智能URL处理
    function processImageURL(url) {
        if (!url.includes('://')) url = new URL(url, window.location.href).href;

        // 应用替换规则
        CONFIG.THUMB_TO_ORIGINAL.forEach(rule => {
            if (Array.isArray(rule)) {
                url = url.replace(rule[0], rule[1]);
            }
        });

        return url;
    }

    // 高级标题获取
    function getPageTitle() {
        let title = '';
        for (const selector of CONFIG.TITLE_SELECTORS) {
            const el = document.querySelector(selector);
            if (el && el.textContent.trim()) {
                title = el.textContent;
                break;
            }
        }

        return title
            .replace(/[\x00-\x1F\x7F\\/:"*?<>|]/g, '_') // 过滤非法字符
            .replace(/_+/g, '_')
            .trim()
            .substring(0, 50) || 'COS_Image';
    }

    // 生成规范文件名
    function generateFilename(img, index, pageInfo) {
        const ext = (img.src.match(/\.([a-z0-9]+)(\?|$)/i) || ['','jpg'])[1];
        return `${pageInfo.title}_${(index + 1).toString().padStart(3, '0')}.${ext}`;
    }

    // 自动滚动加载（增强版）
    async function autoScroll() {
        return new Promise(resolve => {
            let lastHeight = 0;
            let retryCount = 0;

            const scrollInterval = setInterval(() => {
                window.scrollTo(0, document.body.scrollHeight);
                const newHeight = document.body.scrollHeight;

                if (newHeight > lastHeight) {
                    lastHeight = newHeight;
                    retryCount = 0;
                } else if (++retryCount > 5) {
                    clearInterval(scrollInterval);
                    resolve();
                }
            }, 1500);
        });
    }

    // 初始化
    const btn = createSmartButton();
    btn.addEventListener('click', processDownload);

    // 注册右键菜单命令
    GM_registerMenuCommand('⚙️ 配置下载规则', () => {
        const configWindow = window.open('', '_blank',
            'width=600,height=400,menubar=no,toolbar=no');
        configWindow.document.write(`
            <h2>下载配置</h2>
            <div style="padding:20px">
                <p>当前路径替换规则：</p >
                <pre>${JSON.stringify(CONFIG.THUMB_TO_ORIGINAL, null, 2)}</pre>
                <button onclick="window.close()">关闭</button>
            </div>
        `);
    });
})();