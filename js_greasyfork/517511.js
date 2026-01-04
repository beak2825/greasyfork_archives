// ==UserScript==
// @name         网页漫画下载为pdf格式
// @namespace    http://tampermonkey.net/
// @version      3.2.0
// @description  将网页漫画下载为pdf方便阅读，目前仅适用于如漫画(http://www.rumanhua1.com/)、漫蛙库(https://manwaku.cc/)等漫画网站
// @author       MornLight
// @match        http://m.rumanhua1.com/*
// @match        http://m.rumanhua2.com/*
// @match        http://www.rumanhua1.com/*
// @match        http://www.rumanhua2.com/*
// @match        https://www.rumanhua.org/*
// @match        https://m.rumanhua.org/*
// @match        https://mangapark.net/*
// @match        https://www.mwdd.cc/*
// @match        https://www.mwhh.cc/*
// @match        https://www.mhtmh.org/*
// @match        https://www.mwai.cc/*
// @match        https://www.mwku.cc/*
// @match        https://www.mwrr.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// @require      https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @run-at       document-end
// @license      MIT
// @supportURL   https://github.com/duanmorningsir/ComicDownloader
// @downloadURL https://update.greasyfork.org/scripts/517511/%E7%BD%91%E9%A1%B5%E6%BC%AB%E7%94%BB%E4%B8%8B%E8%BD%BD%E4%B8%BApdf%E6%A0%BC%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/517511/%E7%BD%91%E9%A1%B5%E6%BC%AB%E7%94%BB%E4%B8%8B%E8%BD%BD%E4%B8%BApdf%E6%A0%BC%E5%BC%8F.meta.js
// ==/UserScript==


(function () {
    'use strict';
    // 禁用图片加载的功能
    function disableImageLoading() {
        console.log('🚫 批量下载模式：禁用图片实际加载');

        // 方法1: 使用CSS隐藏图片(不影响获取src属性)
        if (!document.getElementById('batch-download-no-images')) {
            const style = document.createElement('style');
            style.id = 'batch-download-no-images';
            style.textContent = `
            img { 
                content: url("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7") !important;
            }
        `;
            document.head.appendChild(style);
        }
    }

    function enableImageLoading() {
        console.log('✓ 恢复图片加载');
        const style = document.getElementById('batch-download-no-images');
        if (style) {
            style.remove();
        }
    }

    // 1. 样式配置
    const STYLES = {
        container: {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '9999',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            backgroundColor: '#f8fafc',
            padding: '20px',
            borderRadius: '18px',
            boxShadow: '0 4px 24px 0 rgba(60,60,100,0.13)',
            maxHeight: '80vh',
            overflowY: 'auto',
            minWidth: '260px',
            border: '1px solid #e0e6ef',
            boxSizing: 'border-box',
            '@media (max-width: 768px)': {
                bottom: '8px',
                right: '8px',
                left: '8px',
                minWidth: 'auto',
                width: 'calc(100% - 16px)',
                padding: '8px',
                gap: '6px',
                borderRadius: '10px',
            },
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
        },
        button: {
            padding: '8px 0',
            color: '#fff',
            border: 'none', // 确保没有黑框
            borderRadius: '12px',
            cursor: 'pointer',
            backgroundColor: '#4CAF50',
            boxShadow: '0 1px 4px 0 rgba(76,175,80,0.08)',
            fontWeight: 'bold',
            fontSize: '15px',
            letterSpacing: '0.5px',
            transition: 'background 0.2s, box-shadow 0.15s, transform 0.08s',
            margin: '4px 0',
            outline: 'none',
            width: '100%',
            minHeight: '36px',
            background: 'linear-gradient(45deg, #4CAF50, #45a049)',
            transition: 'all 0.3s ease',
            ':hover': {
                background: 'linear-gradient(45deg, #45a049, #4CAF50)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 15px rgba(76,175,80,0.3)'
            },
            '@media (max-width: 768px)': {
                padding: '6px 0', // 统一padding
                fontSize: '13px',
                borderRadius: '8px',
                margin: '3px 0', // 统一margin
                minHeight: '28px', // 统一高度
                fontWeight: 'bold'
            }
        },
        cancelButton: {
            backgroundColor: '#f44336',
            fontWeight: 'bold',
            fontSize: '15px',
            borderRadius: '12px',
            boxShadow: '0 1px 4px 0 rgba(244,67,54,0.08)',
            margin: '4px 0',
            width: '100%',
            minHeight: '36px',
            border: 'none', // 添加这行，移除黑框
            padding: '8px 0', // 添加这行，统一padding
            color: '#fff',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            ':hover': {
                background: 'linear-gradient(45deg, #e53935, #f44336)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 15px rgba(244,67,54,0.3)'
            },
            '@media (max-width: 768px)': {
                fontSize: '13px',
                borderRadius: '8px',
                margin: '3px 0',
                minHeight: '28px',
                padding: '6px 0', // 移动端padding
            },
            background: 'linear-gradient(45deg, #f44336, #e53935)'
        },
        buttonGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'center',
            marginBottom: '10px',
            width: '100%',
        },
        progressContainer: {
            display: 'none',
            background: 'rgba(245,247,250,0.85)',
            borderRadius: '10px',
            padding: '8px 0',
            margin: '4px 0',
            boxShadow: '0 1px 4px 0 rgba(60,60,100,0.06)',
            '@media (max-width: 768px)': {
                width: '100%',
                padding: '6px 0',
                borderRadius: '7px',
            },
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255,255,255,0.1)'
        },
        infoText: {
            color: '#4a5568',
            fontSize: '15px',
            textAlign: 'center',
            marginBottom: '10px',
            fontWeight: '500',
            letterSpacing: '0.5px',
            '@media (max-width: 768px)': {
                fontSize: '12px',
                marginBottom: '5px',
            }
        },
        chapterListContainer: {
            marginTop: '10px',
            display: 'none',
            maxHeight: '50vh',
            overflowY: 'auto',
            paddingRight: '18px',
            boxSizing: 'border-box',
            '@media (max-width: 768px)': {
                maxHeight: '60vh',
                paddingRight: '0',
            }
        },
        modeSelector: {
            width: '100%',
            padding: '10px 0',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            '@media (max-width: 768px)': {
                padding: '8px 0',
                marginBottom: '8px',
            }
        },
        modeSelectorSelect: {
            flex: '1',
            padding: '8px 12px',
            fontSize: '13px',
            fontWeight: 'bold',
            border: '2px solid #4CAF50',
            borderRadius: '8px',
            backgroundColor: '#fff',
            color: '#4CAF50',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '@media (max-width: 768px)': {
                padding: '6px 8px',
                fontSize: '12px',
            }
        }
    };

    // 添加响应式样式应用函数
    function applyResponsiveStyles(element, styles) {
        Object.assign(element.style, styles);

        // 检查是否是移动设备
        if (window.innerWidth <= 768) {
            const mobileStyles = styles['@media (max-width: 768px)'];
            if (mobileStyles) {
                Object.assign(element.style, mobileStyles);
            }
        }
    }

    // 2. 站点适配器相关代码
    class SiteAdapter {
        isChapterPage() {
            throw new Error('必须实现 isChapterPage 方法');
        }

        isDirectoryPage() {
            throw new Error('必须实现 isDirectoryPage 方法');
        }

        getChapterLinks() {
            throw new Error('必须实现 getChapterLinks 方法');
        }

        getChapterName() {
            throw new Error('必须实现 getChapterName 方法');
        }

        getImageElements() {
            throw new Error('必须实现 getImageElements 方法');
        }

        getImageUrl(imgElement) {
            throw new Error('必须实现 getImageUrl 方法');
        }

        // ✅ 新增：检查当前页面是否有分页
        hasMultiplePages() {
            return false; // 默认无分页
        }

        // ✅ 新增：获取所有分页URL（包括当前页）
        getPageUrls() {
            return [window.location.href]; // 默认只有当前页
        }

        // ✅ 新增：从指定URL获取图片URL列表（用于后台加载分页）
        async fetchImageUrlsFromPage(pageUrl) {
            console.log(`后台加载分页: ${pageUrl}`);

            return new Promise((resolve, reject) => {
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                document.body.appendChild(iframe);

                let timeoutId = setTimeout(() => {
                    cleanup();
                    reject(new Error('分页加载超时'));
                }, 30000);

                const cleanup = () => {
                    clearTimeout(timeoutId);
                    if (iframe.parentNode) {
                        document.body.removeChild(iframe);
                    }
                };

                iframe.onload = async () => {
                    try {
                        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                        // 等待图片元素加载
                        await new Promise(wait => setTimeout(wait, 2000));

                        // 使用子类的 getImageElements 逻辑
                        const imageElements = iframeDoc.querySelectorAll(this.getImageSelector());
                        console.log(`分页找到 ${imageElements.length} 张图片`);

                        const imageUrls = [];
                        for (let img of imageElements) {
                            // 复用 getImageUrl 逻辑
                            const url = this.getImageUrlFromElement(img);
                            if (url) {
                                imageUrls.push(url);
                            }
                        }

                        cleanup();
                        resolve(imageUrls);
                    } catch (error) {
                        cleanup();
                        reject(error);
                    }
                };

                iframe.onerror = () => {
                    cleanup();
                    reject(new Error('分页加载失败'));
                };

                iframe.src = pageUrl;
            });
        }

        // ✅ 新增：获取图片选择器（子类可覆盖）
        getImageSelector() {
            return 'img'; // 默认选择器
        }

        // ✅ 新增：从元素获取图片URL（复用 getImageUrl 逻辑）
        getImageUrlFromElement(imgElement) {
            return this.getImageUrl(imgElement);
        }
    }

    class RumanhuaAdapter extends SiteAdapter {
        isChapterPage() {
            const url = window.location.href;
            const chapterPagePattern = /http:\/\/m\.rumanhua(1|2)\.com\/[^\/]+\/[^\/]+\.html/;
            return chapterPagePattern.test(url);
        }

        isDirectoryPage() {
            const url = window.location.href;
            const directoryPagePattern = /http:\/\/m\.rumanhua(1|2)\.com\/[^\/]+\/?$/;
            return directoryPagePattern.test(url);
        }

        async getChapterLinks() {
            const waitForChapterList = () => {
                return new Promise((resolve, reject) => {
                    let attempts = 0;
                    const maxAttempts = 10;

                    const checkForList = () => {
                        const selectors = [
                            '.cartoon-box .chaplist-box ul',
                            '.chaplist-box ul',
                            '.chapterlistload ul',
                            '.chapter-list ul',
                            '.chapterlist ul'
                        ];

                        for (const selector of selectors) {
                            const element = document.querySelector(selector);
                            if (element) {
                                resolve(element);
                                return;
                            }
                        }

                        attempts++;
                        if (attempts >= maxAttempts) {
                            reject(new Error('未找到章节列表'));
                            return;
                        }

                        setTimeout(checkForList, 500);
                    };

                    checkForList();
                });
            };

            try {
                const chapterListElement = await waitForChapterList();
                const chapterElements = chapterListElement.querySelectorAll('a');
                const baseUrl = window.location.origin;
                const links = Array.from(chapterElements).map(element => {
                    const href = element.getAttribute('href');
                    const url = href.startsWith('http') ? href : baseUrl + href;
                    const name = element.textContent.trim();
                    return { url, name };
                });
                return links;
            } catch (error) {
                throw error;
            }
        }

        getChapterName() {
            const chapterNameElement = document.querySelector('.chaphead-name h1');
            return chapterNameElement ? chapterNameElement.textContent.trim() : '未知章节';
        }

        getImageElements() {
            return document.querySelectorAll('.chapter-img-box img');
        }

        getImageUrl(imgElement) {
            if (!imgElement) return null;

            const src = imgElement.src || imgElement.dataset.src;
            if (!src) return null;

            let imageUrl = src.includes('/static/images/load.gif') ? imgElement.dataset.src : src;

            if (imageUrl.startsWith('blob:')) {
                return imageUrl;
            }

            if (imageUrl.startsWith('http:')) {
                imageUrl = imageUrl.replace('http:', 'https:');
            }

            return imageUrl;
        }
    }

    class RumanhuaPCAdapter extends SiteAdapter {
        isChapterPage() {
            const url = window.location.href;
            const chapterPagePattern = /http:\/\/www\.rumanhua(1|2)\.com\/[^\/]+\/[^\/]+\.html/;
            return chapterPagePattern.test(url);
        }

        isDirectoryPage() {
            const url = window.location.href;
            const directoryPagePattern = /http:\/\/www\.rumanhua(1|2)\.com\/[^\/]+\/?$/;
            return directoryPagePattern.test(url) && !this.isChapterPage();
        }

        async getChapterLinks() {
            const waitForChapterList = () => {
                return new Promise((resolve, reject) => {
                    let attempts = 0;
                    const maxAttempts = 10;

                    const checkForList = () => {
                        const selectors = [
                            '.chapterlistload ul',
                            '.cartoon-box .chaplist-box ul',
                            '.chaplist-box ul',
                            '.chapter-list ul',
                            '.chapterlist ul',
                            '.chapterlistload ul li a'
                        ];
                        for (const selector of selectors) {
                            const element = document.querySelector(selector);
                            if (element) {
                                resolve(element);
                                return;
                            }
                        }
                        attempts++;
                        if (attempts >= maxAttempts) {
                            reject(new Error('未找到章节列表'));
                            return;
                        }
                        setTimeout(checkForList, 500);
                    };
                    checkForList();
                });
            };

            try {
                const chapterListElement = await waitForChapterList();
                const chapterElements = chapterListElement.querySelectorAll('a');
                const baseUrl = window.location.origin;
                const links = Array.from(chapterElements).map(element => {
                    const href = element.getAttribute('href');
                    const url = href.startsWith('http') ? href : baseUrl + href;
                    const name = element.textContent.trim();
                    return { url, name };
                });
                return links;
            } catch (error) {
                console.error('获取章节列表失败:', error);
                return [];
            }
        }

        getChapterName() {
            const chapterName = document.querySelector('.headwrap .chaptername_title')?.textContent || '未知章节';
            return chapterName;
        }

        getImageElements() {
            return document.querySelectorAll('div.chapter-img-box img');
        }

        getImageUrl(imgElement) {
            if (!imgElement) return null;

            const src = imgElement.src || imgElement.dataset.src;
            if (!src) return null;

            let imageUrl = src.includes('/static/images/load.gif') ? imgElement.dataset.src : src;

            if (imageUrl.startsWith('blob:')) {
                return imageUrl;
            }

            if (imageUrl.startsWith('http:')) {
                imageUrl = imageUrl.replace('http:', 'https:');
            }

            return imageUrl;
        }
    }

    class RumanhuaOrgAdapter extends SiteAdapter {
        isChapterPage() {
            const url = window.location.href;
            // 修改正则表达式以匹配实际的链接格式: https://www.rumanhua.org/show/xxx.html
            const chapterPagePattern = /https:\/\/www\.rumanhua\.org\/show\/[^\/]+\.html/;
            return chapterPagePattern.test(url);
        }

        isDirectoryPage() {
            const url = window.location.href;
            return url.includes('https://www.rumanhua.org') && !this.isChapterPage();
        }

        async getChapterLinks() {
            const waitForChapterList = () => {
                return new Promise((resolve, reject) => {
                    let attempts = 0;
                    const maxAttempts = 10;

                    const checkForList = () => {
                        // 修改选择器以匹配新的HTML结构
                        const selectors = [
                            'div.list a.ib',
                            '.chapterlistload ul',
                            '.cartoon-box .chaplist-box ul',
                            '.chaplist-box ul',
                            '.chapter-list ul',
                            '.chapterlist ul',
                            '.chapterlistload ul li a'
                        ];
                        for (const selector of selectors) {
                            const elements = document.querySelectorAll(selector);
                            if (elements.length > 0) {
                                resolve(elements);
                                return;
                            }
                        }
                        attempts++;
                        if (attempts >= maxAttempts) {
                            reject(new Error('未找到章节列表'));
                            return;
                        }
                        setTimeout(checkForList, 500);
                    };
                    checkForList();
                });
            };

            try {
                const chapterElements = await waitForChapterList();
                const baseUrl = window.location.origin;
                const links = Array.from(chapterElements).map(element => {
                    const href = element.getAttribute('href');
                    const url = href.startsWith('http') ? href : baseUrl + href;
                    const name = element.textContent.trim();
                    return { url, name };
                });
                return links;
            } catch (error) {
                console.error('获取章节列表失败:', error);
                return [];
            }
        }

        getChapterName() {
            // 从<title>标签中提取章节名称
            const title = document.querySelector('title')?.textContent || '未知章节';
            // 提取标题中的章节部分，例如从"龙战在野漫画-第9话 相伴左右在线阅读-如漫画"中提取"第9话 相伴左右"
            const match = title.match(/-\s*(.+?)\s*在线阅读/);
            return match ? match[1] : title;
        }

        getImageElements() {
            // 修改为根据新的图片结构获取图片元素
            return document.querySelectorAll('ul.comic-contain li img');
        }

        getImageUrl(imgElement) {
            if (!imgElement) return null;

            // 优先使用data-src属性，如果没有则使用src属性
            const src = imgElement.dataset.src || imgElement.src;
            if (!src) return null;

            // 处理图片URL
            let imageUrl = src;

            if (imageUrl.startsWith('blob:')) {
                return imageUrl;
            }

            if (imageUrl.startsWith('http:')) {
                imageUrl = imageUrl.replace('http:', 'https:');
            }

            return imageUrl;
        }
    }

    // 在 RumanhuaOrgAdapter 之后添加新的适配器类

    class RumanhuaMobileNewAdapter extends SiteAdapter {
        isChapterPage() {
            const url = window.location.href;
            // 匹配 https://m.rumanhua.org/show/xxxxx.html 格式
            const chapterPagePattern = /https:\/\/m\.rumanhua\.org\/show\/[^\/]+\.html/;
            return chapterPagePattern.test(url);
        }

        isDirectoryPage() {
            const url = window.location.href;
            // 匹配 https://m.rumanhua.org/news/xxxxxx 格式
            const directoryPagePattern = /https:\/\/m\.rumanhua\.org\/news\/\d+/;
            return directoryPagePattern.test(url);
        }

        async getChapterLinks() {
            const waitForChapterList = () => {
                return new Promise((resolve, reject) => {
                    let attempts = 0;
                    const maxAttempts = 10;

                    const checkForList = () => {
                        // 根据你提供的HTML结构，章节列表在 ul.chapterList 中
                        const selectors = [
                            'ul.chapterList li a',
                            '.chapterList a',
                            'ul.am-thumbnails li a',
                            '.chapter-list a'
                        ];

                        for (const selector of selectors) {
                            const elements = document.querySelectorAll(selector);
                            if (elements.length > 0) {
                                resolve(elements);
                                return;
                            }
                        }

                        attempts++;
                        if (attempts >= maxAttempts) {
                            reject(new Error('未找到章节列表'));
                            return;
                        }

                        setTimeout(checkForList, 500);
                    };

                    checkForList();
                });
            };

            try {
                const chapterElements = await waitForChapterList();
                const baseUrl = window.location.origin;
                const links = Array.from(chapterElements).map(element => {
                    const href = element.getAttribute('href');
                    // 处理相对路径
                    const url = href.startsWith('http') ? href : baseUrl + href;
                    const name = element.textContent.trim();
                    return { url, name };
                });
                return links;
            } catch (error) {
                console.error('获取章节列表失败:', error);
                return [];
            }
        }

        getChapterName() {
            // 从 <span id="title"> 标签中提取章节名称
            const titleSpan = document.querySelector('span#title');
            if (titleSpan) {
                const name = titleSpan.textContent.trim();
                console.log('获取章节名称:', name);
                return name;
            }
        }

        getImageElements() {
            // 根据网站结构获取漫画图片
            // 尝试多个可能的选择器
            const selectors = [
                'div.reader-img img',
                'div.comic-contain img',
                'div[class*="comic"] img',
                'div.chapter-img-box img',
                'img[data-src]',
                'img.lazy'
            ];

            for (const selector of selectors) {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    console.log(`使用选择器: ${selector}, 找到 ${elements.length} 张图片`);
                    return elements;
                }
            }

            // 如果上面都找不到，返回所有非装饰性的img标签
            console.warn('使用备用选择器获取图片');
            return document.querySelectorAll('img[src]:not([src*="logo"]):not([src*="icon"])');
        }

        getImageUrl(imgElement) {
            if (!imgElement) return null;

            // 优先使用 data-src（懒加载），其次是 src
            let imageUrl = imgElement.dataset.src || imgElement.src;

            if (!imageUrl) return null;

            // 处理特殊情况
            if (imageUrl.includes('placeholder') || imageUrl.includes('loading')) {
                return null;
            }

            // 如果是blob URL，直接返回
            if (imageUrl.startsWith('blob:')) {
                return imageUrl;
            }

            // 转换为HTTPS
            if (imageUrl.startsWith('http:')) {
                imageUrl = imageUrl.replace('http:', 'https:');
            }

            // 处理相对URL
            if (imageUrl.startsWith('//')) {
                imageUrl = 'https:' + imageUrl;
            } else if (imageUrl.startsWith('/') && !imageUrl.startsWith('//')) {
                imageUrl = window.location.origin + imageUrl;
            }

            return imageUrl;
        }
    }

    // 添加Mangapark适配器
    class MangaparkAdapter extends SiteAdapter {
        isChapterPage() {
            // 匹配 https://mangapark.net/title/357480-en-the-31st-piece-turns-the-tables/9864935-chapter-85-season-3-start 类型URL
            const chapterPagePattern = /https:\/\/mangapark\.net\/title\/+[^\/]+\/+[^\/]/;
            return chapterPagePattern.test(window.location.href);
        }

        isDirectoryPage() {
            // 目录页匹配 /title/ 开头但不包含 /chapter- 的URL
            const url = window.location.href;
            return url.includes('https://mangapark.net/title/') && !this.isChapterPage();
        }

        async getChapterLinks() {
            const waitForChapterList = () => {
                return new Promise((resolve, reject) => {
                    let attempts = 0;
                    const maxAttempts = 10;

                    const checkForList = () => {
                        // Mangapark的章节列表选择器
                        const selectors = [
                            'div[data-name="chapter-list"] div.scrollable-panel div.group div.px-2 > div.space-x-1 a',
                        ];

                        for (const selector of selectors) {
                            const elements = document.querySelectorAll(selector);
                            if (elements.length > 0) {
                                resolve(elements);
                                return;
                            }
                        }

                        attempts++;
                        if (attempts >= maxAttempts) {
                            reject(new Error('未找到章节列表'));
                            return;
                        }

                        setTimeout(checkForList, 500);
                    };

                    checkForList();
                });
            };

            try {
                const chapterElements = await waitForChapterList();
                const links = Array.from(chapterElements).map(element => {
                    const href = element.getAttribute('href');
                    // 确保URL是完整的
                    const url = href.startsWith('http') ? href : 'https://mangapark.net' + href;
                    const name = element.textContent.trim();
                    return { url, name };
                });
                // 按照章节顺序排序
                return links.reverse(); // Mangapark列表通常是倒序的
            } catch (error) {
                console.error('获取章节列表失败:', error);
                return [];
            }
        }

        getChapterName() {
            // 尝试多种选择器获取章节名
            const selectors = [
                'div.text-base-content h6.text-lg span'
            ];

            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) {
                    return element.textContent.trim();
                }
            }

            // 如果找不到，从URL中提取
            const urlParts = window.location.pathname.split('/');
            const chapterPart = urlParts[urlParts.length - 1];
            return chapterPart.replace(/-\d+-/, ' ').replace(/-/g, ' ');
        }

        getImageElements() {
            // 查找所有带有background-image属性的div元素
            return document.querySelectorAll('div[data-name="image-show"] img, div[data-name="image-item"] img');
        }

        getImageUrl(imgElement) {
            if (!imgElement) return null;

            // 优先使用data-src或data-url属性，然后是src
            const src = imgElement.dataset.src || imgElement.dataset.url || imgElement.src;
            if (src) {
                let imageUrl = src;

                // 处理相对URL
                if (imageUrl.startsWith('//')) {
                    imageUrl = 'https:' + imageUrl;
                } else if (imageUrl.startsWith('/')) {
                    imageUrl = 'https://mangapark.net' + imageUrl;
                }

                if (imageUrl.startsWith('blob:')) {
                    return imageUrl;
                }

                return imageUrl;
            }
        }
    }
    // 在 MangaparkAdapter 之后添加新的适配器类
    class ManwakuAdapter extends SiteAdapter {
        isChapterPage() {
            const url = window.location.href;
            // 匹配 https://www.mwdd.cc/comic/xxxxx/xxxxx 格式
            const chapterPagePattern = /https?:\/\/(www\.)?(mwdd|mwhh|mhtmh|mwai|mwku|mwrr)\.(cc|org)\/comic\/\d+\/\d+\/?$/;
            return chapterPagePattern.test(url);
        }

        isDirectoryPage() {
            const url = window.location.href;
            // 匹配 https://www.mwdd.cc/comic/xxxxx/ 格式（只有漫画ID，没有章节ID）
            const directoryPagePattern = /https?:\/\/(www\.)?(mwdd|mwhh|mhtmh|mwai|mwku|mwrr)\.(cc|org)\/comic\/\d+\/?$/;
            return directoryPagePattern.test(url) && !this.isChapterPage();
        }

        async getChapterLinks() {
            const waitForChapterList = () => {
                return new Promise((resolve, reject) => {
                    let attempts = 0;
                    const maxAttempts = 10;

                    const checkForList = () => {
                        // 根据提供的HTML结构，章节列表在 div.chapter-grid 中
                        // 每个章节是一个 a.chapter-item 元素
                        const selectors = [
                            'div.chapter-grid a.chapter-item',
                            'div#chapter-grid-container a.chapter-item',
                            '.chapter-grid a.chapter-item',
                            'a.chapter-item'
                        ];

                        for (const selector of selectors) {
                            const elements = document.querySelectorAll(selector);
                            if (elements.length > 0) {
                                console.log(`找到 ${elements.length} 个章节链接，使用选择器: ${selector}`);
                                resolve(elements);
                                return;
                            }
                        }

                        attempts++;
                        if (attempts >= maxAttempts) {
                            reject(new Error('未找到章节列表'));
                            return;
                        }

                        setTimeout(checkForList, 500);
                    };

                    checkForList();
                });
            };

            try {
                const chapterElements = await waitForChapterList();
                const baseUrl = window.location.origin;
                const links = Array.from(chapterElements).map(element => {
                    const href = element.getAttribute('href');
                    const url = href.startsWith('http') ? href : baseUrl + href;

                    // 从 data-title 属性获取章节名称，备选方案是从 .chapter-name 获取
                    let name = element.getAttribute('data-title');
                    if (!name) {
                        const nameEl = element.querySelector('.chapter-name');
                        name = nameEl ? nameEl.textContent.trim() : '未知章节';
                    }

                    return { url, name };
                });

                console.log(`获取到 ${links.length} 个章节`);
                return links;
            } catch (error) {
                console.error('获取章节列表失败:', error);
                return [];
            }
        }

        // ✅ 实现：检查是否有分页
        hasMultiplePages() {
            const titleSpan = document.querySelector('span.basetitle#current-title');
            if (titleSpan) {
                const name = titleSpan.textContent.trim();
                return /\(第\d+\/\d+页\)/.test(name);
            }
            return false;
        }

        // ✅ 实现：获取所有分页URL
        getPageUrls() {
            const titleSpan = document.querySelector('span.basetitle#current-title');
            if (!titleSpan) {
                return [window.location.href];
            }

            const name = titleSpan.textContent.trim();
            const match = name.match(/\(第(\d+)\/(\d+)页\)/);

            if (!match) {
                return [window.location.href];
            }

            const totalPages = parseInt(match[2]);
            const baseUrl = window.location.href.split('_')[0];

            const pageUrls = [];
            for (let i = 1; i <= totalPages; i++) {
                if (i === 1) {
                    pageUrls.push(baseUrl);
                } else {
                    pageUrls.push(`${baseUrl}_${i}`);
                }
            }

            console.log(`检测到 ${totalPages} 个分页:`, pageUrls);
            return pageUrls;
        }

        // ✅ 实现：图片选择器
        getImageSelector() {
            return 'article.epContent figure.cImg img, figure.cImg img';
        }

        getChapterName() {
            const titleSpan = document.querySelector('span.basetitle#current-title');
            if (titleSpan) {
                const name = titleSpan.textContent.trim();
                // 移除分页标记
                return name.replace(/\s*\(第\d+\/\d+页\)/, '');
            }

            const title = document.querySelector('title')?.textContent || '未知章节';
            return title;
        }

        getImageElements() {
            // 根据 HTML 结构，图片在 <figure class="cImg"> 中的 <img> 标签
            const selectors = [
                'article.epContent figure.cImg img',
                'div#showimgcontent figure.cImg img',
                'figure.cImg img'
            ];

            for (const selector of selectors) {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    console.log(`使用选择器: ${selector}, 找到 ${elements.length} 张图片`);
                    return elements;
                }
            }

            console.warn('使用备用选择器获取图片');
            return document.querySelectorAll('img');
        }

        getImageUrl(imgElement) {
            if (!imgElement) return null;

            // 优先使用 src 属性（这个网站直接提供了完整的图片URL）
            let imageUrl = imgElement.src;

            // ✅ 校验：如果 src 是占位图（loading.gif），则使用 dataset.src
            if (imageUrl && imageUrl.includes('loading.gif')) {
                console.log('检测到占位图，使用 dataset.src:', imgElement.dataset.src);
                imageUrl = imgElement.dataset.src;
            }

            if (!imageUrl) {
                // 备选：尝试 data-src
                imageUrl = imgElement.dataset.src;
            }

            if (!imageUrl) return null;

            // 处理特殊情况
            if (imageUrl.includes('placeholder') || imageUrl.includes('loading')) {
                return null;
            }

            // 如果是blob URL，直接返回
            if (imageUrl.startsWith('blob:')) {
                return imageUrl;
            }

            // 转换为HTTPS
            if (imageUrl.startsWith('http:')) {
                imageUrl = imageUrl.replace('http:', 'https:');
            }

            // 处理相对URL
            if (imageUrl.startsWith('//')) {
                imageUrl = 'https:' + imageUrl;
            } else if (imageUrl.startsWith('/') && !imageUrl.startsWith('//')) {
                imageUrl = window.location.origin + imageUrl;
            }

            console.log('获取的图片URL:', imageUrl);
            return imageUrl;
        }
    }

    // 3. 获取适配器的工厂函数
    function getSiteAdapter() {
        const url = window.location.href;
        switch (true) {
            case url.includes('http://www.rumanhua1.com/') || url.includes('http://www.rumanhua2.com/'):
                return new RumanhuaPCAdapter();
            case url.includes('http://m.rumanhua1.com/') || url.includes('http://m.rumanhua2.com/'):
                return new RumanhuaAdapter();
            case url.includes('https://www.rumanhua.org/'):
                return new RumanhuaOrgAdapter();
            case url.includes('https://m.rumanhua.org/'):
                return new RumanhuaMobileNewAdapter();
            case url.includes('https://mangapark.net/'):
                return new MangaparkAdapter();
            case url.includes('mwdd.cc') || url.includes('mwhh.cc') || url.includes('mhtmh.org') || url.includes('mwai.cc') || url.includes('mwku.cc') || url.includes('mwrr.cc'):
                return new ManwakuAdapter();
            default:
                throw new Error('不支持的页面格式');
        }
    }

    // 4. UI类
    // 4.1 普通下载器UI
    class DownloaderUI {
        constructor(totalPages, onDownload, onCancel) {
            this.totalPages = totalPages;
            this.onDownload = onDownload;
            this.onCancel = onCancel;
            this.currentPage = 0;
            this.pdfMode = 'normal'; // normal, scroll, longpage
            this.createUI();
        }

        createUI() {
            // 先创建容器
            this.container = this.createContainer();
            document.body.appendChild(this.container);

            // 添加页数信息
            this.infoText = this.createElement('div', STYLES.infoText, `本章节共 ${this.totalPages} 页`);
            this.container.appendChild(this.infoText);

            // 创建模式选择器
            this.modeSelector = this.createModeSelector();
            this.container.appendChild(this.modeSelector);

            this.downloadButton = this.createButton('下载本章节', () => this.onDownload(1, this.totalPages));

            this.cancelButton = this.createButton('取消下载', () => {
                this.onCancel();
                this.infoText.textContent = '下载已取消';
                setTimeout(() => {
                    this.infoText.textContent = `本章节共 ${this.totalPages} 页`;
                }, 2000);
            }, true);

            // 默认隐藏取消按钮
            this.cancelButton.style.display = 'none';

            // 创建进度容器
            this.progressContainer = this.createElement('div', {
                display: 'none',
                marginTop: '10px',
                padding: '6px',
                backgroundColor: 'rgba(245,247,250,0.9)',
                borderRadius: '8px',
                '@media (max-width: 768px)': {
                    padding: '4px'
                }
            });

            this.progressBar = document.createElement('progress');
            this.progressBar.max = this.totalPages;
            this.progressBar.value = 0;
            this.progressBar.style.width = '100%';
            this.progressBar.style.height = '4px';
            this.progressBar.style.borderRadius = '2px';
            this.progressBar.style.border = 'none';
            this.progressBar.style.backgroundColor = '#e0e0e0';

            this.progressText = this.createElement('div', {
                marginTop: '6px',
                fontSize: '12px',
                color: '#333',
                '@media (max-width: 768px)': {
                    fontSize: '11px',
                    marginTop: '4px'
                }
            });

            this.progressContainer.appendChild(this.progressBar);
            this.progressContainer.appendChild(this.progressText);

            // 按顺序添加所有元素到容器
            this.container.appendChild(this.downloadButton);
            this.container.appendChild(this.cancelButton);
            this.container.appendChild(this.progressContainer);

            // 添加窗口大小变化监听
            window.addEventListener('resize', () => {
                this.updateResponsiveStyles();
            });
        }

        setLoading(isLoading, showCancel = false) {
            this.downloadButton.disabled = isLoading;
            this.downloadButton.style.backgroundColor = isLoading ? '#999' : '#4CAF50';
            this.downloadButton.style.cursor = isLoading ? 'not-allowed' : 'pointer';
            this.downloadButton.textContent = isLoading ? '下载中...' : '下载本章节';

            if (isLoading) {
                // 下载时隐藏所有不必要的元素
                this.downloadButton.style.display = 'none';
                this.cancelButton.style.display = showCancel ? 'block' : 'none';
                this.progressContainer.style.display = 'none';
                this.infoText.style.display = 'block';

                // ✅ 关键：隐藏模式选择器 - 使用 !important 确保生效
                this.modeSelector.style.setProperty('display', 'none', 'important');
            } else {
                // 恢复所有元素的显示
                this.downloadButton.style.display = 'block';
                this.cancelButton.style.display = 'none';
                this.progressContainer.style.display = 'none';
                this.infoText.style.display = 'block';

                // ✅ 恢复模式选择器 - 使用 flex 确保正确显示
                this.modeSelector.style.setProperty('display', 'flex', 'important');
            }
        }


        updateProgress(currentPage) {
            this.currentPage = currentPage;
            this.progressBar.value = currentPage;
            const percent = ((currentPage / this.totalPages) * 100).toFixed(1);

            // ✅ 修改：只显示文字提示，不显示进度条
            this.infoText.textContent = `📥 下载中... ${currentPage}/${this.totalPages}`;
            this.infoText.style.display = 'block';
            this.infoText.style.color = '#2196F3';
        }

        createModeSelector() {
            const container = this.createElement('div', STYLES.modeSelector);

            const select = document.createElement('select');
            Object.assign(select.style, STYLES.modeSelectorSelect);

            const modes = [
                { id: 'longpage', label: '长图模式' },
                { id: 'normal', label: '翻页模式' },
                { id: 'scroll', label: '滚动模式' }
            ];

            modes.forEach(mode => {
                const option = document.createElement('option');
                option.value = mode.id;
                option.textContent = mode.label;
                if (mode.id === 'longpage') {
                    option.selected = true;
                    this.pdfMode = 'longpage';
                }
                select.appendChild(option);
            });

            select.addEventListener('change', (e) => {
                this.pdfMode = e.target.value;
                console.log(`切换到模式: ${this.pdfMode}`);
            });

            container.appendChild(select);
            return container;
        }

        createButton(text, onClick, isCancel = false) {
            const button = document.createElement('button');
            Object.assign(button.style, STYLES.button); // 应用基础按钮样式
            if (isCancel) {
                Object.assign(button.style, STYLES.cancelButton); // 如果是取消按钮，额外应用取消按钮样式
            }
            button.textContent = text;
            button.addEventListener('click', onClick);
            this.container.appendChild(button);
            return button;
        }

        createContainer() {
            const container = document.createElement('div');
            Object.assign(container.style, STYLES.container);
            return container;
        }

        updateResponsiveStyles() {
            // 响应式样式更新（可选）
        }

        // 修改 createElement 方法
        createElement(type, styles, textContent = '') {
            const element = document.createElement(type);
            if (type === 'input' && styles.type) {
                element.type = styles.type;
                delete styles.type;
            }
            if (typeof styles === 'string') {
                element.className = styles;
            } else {
                applyResponsiveStyles(element, styles);
            }
            if (textContent) element.textContent = textContent;
            return element;
        }
    }

    // 4.2 章节选择器UI
    class ChapterSelectorUI {
        constructor({ adapter, onDownloadSelected, ontoggleScrollMode, onCancel, onProgress, onLoading, onComplete, onError }) {
            this.adapter = adapter;
            this.onDownloadSelected = onDownloadSelected;
            this.ontoggleScrollMode = ontoggleScrollMode;
            this.onCancel = onCancel;
            this.onProgress = onProgress;
            this.onLoading = onLoading;
            this.onComplete = onComplete;
            this.onError = onError;
            this.selectedChapters = new Set();
            this.isSelectionMode = false;
            this.pdfMode = 'normal'; // normal, scroll, longpage
            this.selectionStart = null;
            this.selectionEnd = null;
            this.isDownloading = false; // 添加下载状态标志
            this.createUI();
            // ✅ 初始化时不显示列表，等待用户点击"选择章节"按钮
        }

        createUI() {
            // 创建主容器
            this.container = this.createElement('div', {
                ...STYLES.container,
                '@media (min-width: 769px)': {
                    width: '300px',
                    right: '20px',
                    left: 'auto'
                }
            });
            document.body.appendChild(this.container);

            // ============ 屏幕1: 初始屏幕（只显示"选择章节"按钮）============
            this.screen1 = this.createElement('div', { display: 'flex', flexDirection: 'column' });

            this.chooseChapterButton = this.createElement('button', {
                width: '100%',
                padding: '12px 8px',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#fff',
                backgroundColor: '#2196F3',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(33,150,243,0.2)',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginBottom: '10px',
            });
            this.chooseChapterButtonText = document.createElement('span');
            this.chooseChapterButtonText.textContent = '📂 选择章节';
            this.chooseChapterButton.appendChild(this.chooseChapterButtonText);
            this.chooseChapterButton.addEventListener('click', () => this.switchScreen('selection'));
            this.screen1.appendChild(this.chooseChapterButton);
            this.container.appendChild(this.screen1);

            // ============ 屏幕2: 选择模式屏幕（topBar + selectButton + 列表）============
            this.screen2 = this.createElement('div', { display: 'none', flexDirection: 'column' });

            // topBar（返回按钮 + 模式选择）
            this.topBar = this.createElement('div', {
                display: 'flex',
                flexDirection: 'row',
                gap: '10px',
                width: '100%',
                marginBottom: '10px',
                alignItems: 'center',
                justifyContent: 'space-between',
            });

            this.backButton = this.createElement('button', {
                padding: '6px 8px',
                fontSize: '20px',
                color: '#555',
                backgroundColor: '#f5f5f5',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '6px',
                cursor: 'pointer',
                minWidth: '36px',
                minHeight: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: '0',
            });
            this.backButton.textContent = '←';

            this.backButtonHoverEnter = () => {
                if (!this.isDownloading) {
                    this.backButton.style.backgroundColor = '#e0e0e0';
                    this.backButton.style.color = '#000';
                }
            };
            this.backButtonHoverLeave = () => {
                this.backButton.style.backgroundColor = '#f5f5f5';
                this.backButton.style.color = '#555';
            };
            this.backButton.addEventListener('mouseenter', this.backButtonHoverEnter);
            this.backButton.addEventListener('mouseleave', this.backButtonHoverLeave);
            this.backButton.addEventListener('click', () => {
                if (this.isDownloading) {
                    this.cancelDownload();
                } else {
                    this.switchScreen('initial');
                    this.onCancel && this.onCancel();
                }
            });
            this.topBar.appendChild(this.backButton);

            this.modeSelector = this.createChapterModeSelector();
            this.topBar.appendChild(this.modeSelector);
            this.screen2.appendChild(this.topBar);

            // selectButton（下载选中章节）
            this.selectButton = this.createElement('button', {
                width: '100%',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#fff',
                backgroundColor: '#4CAF50',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(76,175,80,0.2)',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginBottom: '10px',
            });
            this.selectButtonText = document.createElement('span');
            this.selectButtonText.textContent = '📥 下载选中章节';
            this.selectButton.appendChild(this.selectButtonText);
            this.selectButton.addEventListener('click', () => {
                if (this.selectedChapters.size > 0) {
                    this.onDownloadSelected && this.onDownloadSelected(Array.from(this.selectedChapters));
                }
            });
            this.screen2.appendChild(this.selectButton);

            // 章节列表
            this.chapterListContainer = this.createElement('div', {
                maxHeight: '50vh',
                overflowY: 'auto',
                paddingRight: '4px',
                boxSizing: 'border-box',
            });
            this.chapterListContainer.classList.add('comic-downloader-chapter-list');
            this.screen2.appendChild(this.chapterListContainer);
            this.container.appendChild(this.screen2);

            // ============ 屏幕3: 下载模式屏幕（按钮 + 进度信息）============
            this.screen3 = this.createElement('div', { display: 'none', flexDirection: 'column' });

            // 按钮容器（绿色下载按钮 + 灰色取消按钮）
            this.buttonContainer = this.createElement('div', {
                display: 'flex',
                flexDirection: 'row',
                gap: '10px',
                width: '100%',
                marginBottom: '10px',
            });

            this.downloadButton = this.createElement('button', {
                flex: '1',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#fff',
                backgroundColor: '#4CAF50',
                border: 'none',
                borderRadius: '8px',
                cursor: 'not-allowed',
                boxShadow: '0 2px 4px rgba(76,175,80,0.2)',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                minHeight: '44px',
            });
            this.downloadButtonText = document.createElement('span');
            this.downloadButtonText.textContent = '下载中...';
            this.downloadButton.appendChild(this.downloadButtonText);
            this.buttonContainer.appendChild(this.downloadButton);

            this.cancelButton = this.createElement('button', {
                width: 'auto',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#fff',
                backgroundColor: '#9e9e9e',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(158,158,158,0.2)',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '44px',
                whiteSpace: 'nowrap',
            });
            this.cancelButtonText = document.createElement('span');
            this.cancelButtonText.textContent = '取消下载';
            this.cancelButton.appendChild(this.cancelButtonText);
            this.cancelButton.addEventListener('click', () => this.cancelDownload());
            this.buttonContainer.appendChild(this.cancelButton);
            this.screen3.appendChild(this.buttonContainer);

            // 进度信息容器
            this.progressInfoContainer = this.createElement('div', {
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginTop: '12px',
            });
            this.screen3.appendChild(this.progressInfoContainer);
            this.container.appendChild(this.screen3);
        }

        // ============ 屏幕切换方法 ============
        switchScreen(screenName) {
            console.log(`切换到屏幕: ${screenName}`);

            // 隐藏所有屏幕
            this.screen1.style.display = 'none';
            this.screen2.style.display = 'none';
            this.screen3.style.display = 'none';

            // 显示指定屏幕
            if (screenName === 'initial') {
                this.isSelectionMode = false;
                this.screen1.style.display = 'flex';
            } else if (screenName === 'selection') {
                this.isSelectionMode = true;
                if (this.chapterListContainer.children.length === 0) {
                    this.initChapterList();
                }
                this.screen2.style.display = 'flex';
            } else if (screenName === 'downloading') {
                this.isDownloading = true;
                this.screen3.style.display = 'flex';
            }
        }


        cancelDownload() {
            console.log('用户取消批量下载');
            GM_setValue('cancelBatchDownload', true);
            this.isDownloading = false;

            // 切换回选择模式屏幕
            this.switchScreen('selection');

            // 恢复下载按钮的样式
            this.selectButton.disabled = false;
            this.selectButton.style.backgroundColor = '#4CAF50';
            this.selectButton.style.cursor = 'pointer';

            // 显示取消提示
            const originalText = this.selectButtonText.textContent;
            this.selectButtonText.textContent = '⏸️ 下载已取消';
            this.selectButton.style.backgroundColor = '#ff9800';

            setTimeout(() => {
                this.selectButtonText.textContent = originalText;
                this.selectButton.style.backgroundColor = '#4CAF50';
            }, 2000);
        }

        async initChapterList() {
            // ✅ 保存当前滚动位置（如果需要刷新列表）
            const previousScrollTop = this.chapterListContainer.scrollTop || 0;

            this.chapterListContainer.innerHTML = '';
            this.selectedChapters = new Set();
            this.selectionStart = null;
            this.selectionEnd = null;

            try {
                const chapterLinks = await this.adapter.getChapterLinks();
                if (!chapterLinks || chapterLinks.length === 0) {
                    return;
                }

                // 操作区
                const controlsContainer = this.createElement('div', {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                    gap: '8px',
                    position: 'sticky',
                    top: '0',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    padding: '5px 0',
                    zIndex: '1',
                    // ✅ 添加阴影，让sticky效果更明显
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                });

                const chapterCountLabel = this.createElement('span', {
                    fontSize: '12px',
                    color: '#666',
                    alignSelf: 'center'
                }, `共 ${chapterLinks.length} 章`);

                const buttonsContainer = this.createElement('div', {
                    display: 'flex',
                    gap: '5px'
                });

                // 全选按钮
                const selectAllBtn = this.createElement('button', {
                    padding: '3px 10px',
                    fontSize: '12px',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }, '全选章节');

                selectAllBtn.addEventListener('click', () => {
                    const scrollTop = this.chapterListContainer.scrollTop;

                    this.selectedChapters = new Set(chapterLinks.map((_, i) => i));
                    this.selectionStart = 0;
                    this.selectionEnd = chapterLinks.length - 1;
                    this.updateChapterSelectionUI();
                    this.selectButtonText.textContent = `下载 (${this.selectedChapters.size})`; // ✅ 更新文字

                    this.chapterListContainer.scrollTop = scrollTop;
                });

                // 清除选择按钮
                const deselectAllBtn = this.createElement('button', {
                    padding: '3px 10px',
                    fontSize: '12px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }, '清除选择');

                deselectAllBtn.addEventListener('click', () => {
                    const scrollTop = this.chapterListContainer.scrollTop;

                    this.selectedChapters.clear();
                    this.selectionStart = null;
                    this.selectionEnd = null;
                    this.updateChapterSelectionUI();
                    this.selectButtonText.textContent = '选择下载'; // ✅ 更新文字

                    this.chapterListContainer.scrollTop = scrollTop;
                });

                // 刷新按钮
                const refreshBtn = this.createElement('button', {
                    padding: '3px 10px',
                    fontSize: '12px',
                    backgroundColor: '#2196f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }, '刷新列表');

                refreshBtn.addEventListener('click', () => this.refreshChapterList());

                buttonsContainer.appendChild(selectAllBtn);
                buttonsContainer.appendChild(deselectAllBtn);
                buttonsContainer.appendChild(refreshBtn);
                controlsContainer.appendChild(chapterCountLabel);
                controlsContainer.appendChild(buttonsContainer);
                this.chapterListContainer.appendChild(controlsContainer);

                // 章节列表
                chapterLinks.forEach((chapter, index) => {
                    const chapterItem = this.createElement('div', {
                        padding: '10px 12px',
                        marginBottom: '8px',
                        borderRadius: '8px',
                        background: '#f5f7fa',
                        cursor: 'pointer',
                        transition: 'background 0.2s, color 0.2s',
                        fontSize: '15px',
                        fontWeight: '500',
                        userSelect: 'none',
                        border: '1px solid #e0e6ef',
                        // ✅ 添加触摸反馈
                        '@media (max-width: 768px)': {
                            padding: '12px',
                            fontSize: '14px',
                            touchAction: 'manipulation', // 优化触摸体验
                        }
                    });
                    chapterItem.textContent = chapter.name;

                    // ✅ 添加触摸反馈效果
                    chapterItem.addEventListener('touchstart', () => {
                        chapterItem.style.transform = 'scale(0.98)';
                    });
                    chapterItem.addEventListener('touchend', () => {
                        chapterItem.style.transform = 'scale(1)';
                    });

                    chapterItem.addEventListener('click', (e) => {
                        // ✅ 阻止默认行为
                        e.preventDefault();
                        e.stopPropagation();
                        this.handleChapterClick(index, chapterLinks.length);
                    });

                    chapterItem.classList.add('chapter-item');
                    this.chapterListContainer.appendChild(chapterItem);
                });

                this.updateChapterSelectionUI();

                // ✅ 恢复滚动位置（用于刷新列表时）
                if (previousScrollTop > 0) {
                    this.chapterListContainer.scrollTop = previousScrollTop;
                }
            } catch (error) {
                console.error('初始化章节列表失败:', error);
            }
        }

        handleChapterClick(index, total) {
            console.log(`处理章节点击: index=${index}, total=${total}`);

            // ✅ 保存当前滚动位置
            const scrollTop = this.chapterListContainer.scrollTop;

            // ✅ 修改：如果不在选择模式，只改变标志，不重新初始化列表
            if (!this.isSelectionMode) {
                this.isSelectionMode = true;
                this.cancelSelectionButton.style.display = 'block';
                this.selectButton.textContent = '下载选中章节';
                this.modeSelector.style.display = 'flex';
                console.log('进入选择模式（不重新初始化列表）');
            }

            if (this.selectionStart === null) {
                // 第一次点击，设置起始点
                this.selectionStart = index;
                this.selectedChapters = new Set([index]);
            } else if (this.selectionEnd === null) {
                // 第二次点击，设置结束点并选择区间
                this.selectionEnd = index;
                const [start, end] = [this.selectionStart, this.selectionEnd].sort((a, b) => a - b);
                this.selectedChapters = new Set();
                for (let i = start; i <= end; i++) {
                    this.selectedChapters.add(i);
                }
            } else {
                // 第三次点击，开始新的选择
                this.selectionStart = index;
                this.selectionEnd = null;
                this.selectedChapters = new Set([index]);
            }

            this.updateChapterSelectionUI();

            // ✅ 恢复滚动位置
            this.chapterListContainer.scrollTop = scrollTop;

            if (this.selectedChapters.size > 0) {
                this.selectButtonText.textContent = `下载 (${this.selectedChapters.size})`; // ✅ 更新文字
            } else {
                this.selectButtonText.textContent = '选择下载';
            }
        }

        updateChapterSelectionUI() {
            console.log('更新章节选择UI');
            const items = this.chapterListContainer.querySelectorAll('.chapter-item');

            // ✅ 只修改样式，不重新创建元素
            items.forEach((item, idx) => {
                if (this.selectedChapters.has(idx)) {
                    item.style.background = '#2196f3';
                    item.style.color = '#fff';
                    item.style.fontWeight = 'bold'; // 添加加粗，更明显
                } else {
                    item.style.background = '#f5f7fa';
                    item.style.color = '#222';
                    item.style.fontWeight = '500';
                }
            });
        }

        refreshChapterList() {
            this.initChapterList();
        }

        createChapterModeSelector() {
            const container = this.createElement('div', {
                flex: '1',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                '@media (max-width: 768px)': {
                    flex: '1 1 100%',
                }
            });

            const select = document.createElement('select');
            Object.assign(select.style, {
                flex: '1',
                padding: '6px 10px',
                fontSize: '13px',
                fontWeight: '500',
                border: '1px solid #ddd',
                borderRadius: '6px',
                backgroundColor: '#fff',
                color: '#333',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none',
            });

            // hover效果
            select.addEventListener('mouseenter', () => {
                select.style.borderColor = '#4CAF50';
                select.style.boxShadow = '0 0 0 2px rgba(76, 175, 80, 0.1)';
            });
            select.addEventListener('mouseleave', () => {
                select.style.borderColor = '#ddd';
                select.style.boxShadow = 'none';
            });

            const modes = [
                { id: 'longpage', label: '📜 长图模式' },
                { id: 'normal', label: '📄 翻页模式' },
                { id: 'scroll', label: '📱 滚动模式' }
            ];

            modes.forEach(mode => {
                const option = document.createElement('option');
                option.value = mode.id;
                option.textContent = mode.label;
                if (mode.id === 'longpage') {
                    option.selected = true;
                    this.pdfMode = 'longpage';
                }
                select.appendChild(option);
            });

            select.addEventListener('change', (e) => {
                this.pdfMode = e.target.value;
                console.log(`切换到模式: ${this.pdfMode}`);
            });

            container.appendChild(select);
            return container;
        }

        createElement(type, styles, textContent = '') {
            const element = document.createElement(type);
            if (type === 'input' && styles.type) {
                element.type = styles.type;
                delete styles.type;
            }
            if (typeof styles === 'string') {
                element.className = styles;
            } else {
                applyResponsiveStyles(element, styles);
            }
            if (textContent) element.textContent = textContent;
            return element;
        }

        // 添加 setLoading 方法
        setLoading(isLoading, totalChapters = 0) {
            console.log(`设置加载状态: isLoading=${isLoading}, totalChapters=${totalChapters}`);
            this.isDownloading = isLoading;

            if (isLoading) {
                // 切换到下载屏幕
                this.switchScreen('downloading');

                // 清空进度信息
                this.progressInfoContainer.innerHTML = '';

                // 创建进度信息元素
                this.chapterProgressText = this.createElement('div', {
                    fontSize: '14px',
                    color: '#2196F3',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                }, '📖 章节进度: 0/0');

                this.currentChapterText = this.createElement('div', {
                    fontSize: '13px',
                    color: '#555',
                    marginBottom: '8px',
                    wordBreak: 'break-word',
                }, '📕 当前章节: --');

                this.imageProgressText = this.createElement('div', {
                    fontSize: '14px',
                    color: '#FF9800',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                }, '📥 准备下载...');

                this.pdfProgressText = this.createElement('div', {
                    fontSize: '14px',
                    color: '#673AB7',
                    fontWeight: 'bold',
                }, '📄 等待下载完成...');

                this.progressInfoContainer.appendChild(this.chapterProgressText);
                this.progressInfoContainer.appendChild(this.currentChapterText);
                this.progressInfoContainer.appendChild(this.imageProgressText);
                this.progressInfoContainer.appendChild(this.pdfProgressText);

                this.startProgressSync();

            } else {
                // 恢复为选择模式
                this.switchScreen('selection');

                // 清空进度信息
                if (this.progressInfoContainer) {
                    this.progressInfoContainer.innerHTML = '';
                }

                this.stopProgressSync();
            }
        }
        // 添加实时进度同步方法
        startProgressSync() {
            if (this.progressSyncInterval) {
                clearInterval(this.progressSyncInterval);
            }

            let lastLogTime = 0;

            this.progressSyncInterval = setInterval(() => {
                try {
                    const currentChapter = GM_getValue('currentChapterName', '');
                    const currentImage = GM_getValue('currentImage', 0);
                    const totalImages = GM_getValue('totalImages', 0);
                    const downloadStatus = GM_getValue('downloadStatus', '');
                    const pdfGenerationComplete = GM_getValue('pdfGenerationComplete', false);
                    const currentPDFPage = GM_getValue('currentPDFPage', 0);
                    const totalPDFPages = GM_getValue('totalPDFPages', 0);

                    // ✅ 从按钮文本中提取章节进度（如果已设置）
                    const buttonText = this.selectButton.textContent;
                    let currentChapterNum = 0;
                    let totalChapters = 0;

                    // 尝试从按钮文本中解析进度
                    const match = buttonText.match(/第\s*(\d+)\s*\/\s*(\d+)\s*章/);
                    if (match) {
                        currentChapterNum = parseInt(match[1]);
                        totalChapters = parseInt(match[2]);
                    }

                    // ✅ 更新绿色按钮：只显示章节总进度
                    if (currentChapterNum > 0 && totalChapters > 0) {
                        this.selectButton.textContent = `正在下载第 ${currentChapterNum}/${totalChapters} 章`;
                    }

                    // ✅ 更新进度容器：显示详细信息
                    if (this.chapterProgressText && currentChapterNum > 0 && totalChapters > 0) {
                        this.chapterProgressText.textContent = `📖 章节进度: ${currentChapterNum}/${totalChapters}`;
                    }

                    if (this.currentChapterText) {
                        if (currentChapter) {
                            const displayName = currentChapter.length > 20
                                ? currentChapter.substring(0, 20) + '...'
                                : currentChapter;
                            this.currentChapterText.textContent = `📕 当前章节: ${displayName}`;
                        } else {
                            this.currentChapterText.textContent = `📕 当前章节: --`;
                        }
                    }

                    if (this.imageProgressText) {
                        if (totalImages > 0) {
                            this.imageProgressText.textContent = `📥 下载中: ${currentImage}/${totalImages}`;
                            this.imageProgressText.style.color = '#FF9800';
                        } else {
                            this.imageProgressText.textContent = `📥 准备下载...`;
                            this.imageProgressText.style.color = '#999';
                        }
                    }

                    if (this.pdfProgressText) {
                        if (currentImage >= totalImages && totalImages > 0) {
                            if (pdfGenerationComplete) {
                                this.pdfProgressText.textContent = `📄 PDF已生成完成！`;
                                this.pdfProgressText.style.color = '#4CAF50';
                            } else if (currentPDFPage > 0 && totalPDFPages > 0) {
                                this.pdfProgressText.textContent = `📄 正在生成PDF... ${currentPDFPage}/${totalPDFPages}`;
                                this.pdfProgressText.style.color = '#FF9800';
                            } else {
                                this.pdfProgressText.textContent = `📄 准备生成PDF...`;
                                this.pdfProgressText.style.color = '#FF9800';
                            }
                        } else if (totalImages > 0) {
                            this.pdfProgressText.textContent = `📄 等待下载完成...`;
                            this.pdfProgressText.style.color = '#999';
                        } else {
                            this.pdfProgressText.textContent = `📄 准备生成PDF...`;
                            this.pdfProgressText.style.color = '#999';
                        }
                    }

                    // 节流日志输出
                    const now = Date.now();
                    if (now - lastLogTime > 5000) {
                        if (currentChapterNum > 0) {
                            console.log(`📊 进度同步: 章节${currentChapterNum}/${totalChapters}, 图片${currentImage}/${totalImages}, PDF${currentPDFPage}/${totalPDFPages}`);
                        }
                        lastLogTime = now;
                    }
                } catch (error) {
                    console.error('进度同步出错:', error);
                }
            }, 300);
        }

        // 停止实时进度同步
        stopProgressSync() {
            if (this.progressSyncInterval) {
                clearInterval(this.progressSyncInterval);
                this.progressSyncInterval = null;
            }
        }

        // 修改 updateProgress 方法，使其更清晰地显示下载进度
        updateProgress(current, total, currentChapter = '', currentImage = 0, totalImages = 0) {
            // ✅ 只更新按钮的章节进度
            if (this.selectButton) {
                this.selectButton.textContent = `正在下载第 ${current}/${total} 章`;

            }
        }
    }

    class ComicDownloader {
        constructor() {
            try {
                console.log('开始创建ComicDownloader实例...');
                this.adapter = getSiteAdapter();
                this.pdfMode = GM_getValue('pdfMode', 'normal'); // 读取保存的模式
                this.isDownloading = false;
                this.abortController = null;
                this.ui = null;
                this.initPromise = null;

                if (this.adapter.isChapterPage()) {
                    console.log('当前是章节页面');
                    this.initPromise = this.waitForImagesAndInit();
                } else if (this.adapter.isDirectoryPage()) {
                    console.log('当前是目录页面');
                    this.ui = new ChapterSelectorUI({
                        adapter: this.adapter,
                        onDownloadSelected: this.handleDownloadSelected.bind(this),
                        onToggleScrollMode: (isScroll) => { /* 已弃用 */ },
                        onCancel: () => { },
                        onProgress: (current, total) => this.ui.updateProgress(current, total),
                        onLoading: (isLoading, total) => this.ui.setLoading(isLoading, total),
                        onComplete: () => { },
                        onError: (err) => this.ui.showError && this.ui.showError(err)
                    });
                    // 目录页面初始化时，只显示"选择章节"按钮
                    // 列表和返回按钮由用户点击按钮后才显示
                }
            } catch (error) {
                console.error('初始化失败:', error);
            }
        }

        // 添加等待UI初始化的方法
        async ensureUIReady() {
            if (this.initPromise) {
                await this.initPromise;
            }
            if (!this.ui) {
                throw new Error('UI初始化失败');
            }
        }

        // 在 ComicDownloader 类中，修改 waitForImagesAndInit 方法：

        async waitForImagesAndInit() {
            const maxAttempts = 12;  // ✅ 增加到12次，共6秒
            let attempts = 0;
            let imageElements = null;

            console.log('开始等待图片元素加载...');

            // 检查是否是批量下载模式
            const isBatchMode = GM_getValue('autoDownload', false);

            while (attempts < maxAttempts) {
                imageElements = this.adapter.getImageElements();
                const currentCount = imageElements.length;

                console.log(`[等待图片] 第 ${attempts + 1}/${maxAttempts} 次检查,找到 ${currentCount} 张图片`);

                // ✅ 批量模式下也要等待至少3次检查（1.5秒），确保不是占位图
                if (isBatchMode && currentCount > 0 && attempts >= 3) {
                    // ✅ 验证图片URL是否有效
                    const firstImg = imageElements[0];
                    const imgUrl = this.adapter.getImageUrl(firstImg);

                    if (imgUrl && !imgUrl.includes('loading') && !imgUrl.includes('placeholder')) {
                        console.log(`✓ 批量模式:找到 ${currentCount} 张有效图片,开始下载`);
                        break;
                    } else {
                        console.log(`⚠️ 检测到占位图，继续等待... URL: ${imgUrl}`);
                    }
                }

                // 单页模式:等待图片数量稳定且至少3次检查
                if (!isBatchMode && currentCount > 0 && attempts >= 3) {
                    console.log(`✓ 单页模式:图片加载稳定,共 ${currentCount} 张`);
                    break;
                }

                attempts++;
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            this.totalPages = imageElements.length;
            this.chapterName = this.adapter.getChapterName();

            console.log('图片元素数量:', this.totalPages);
            console.log('章节名称:', this.chapterName);

            if (this.totalPages > 0) {
                console.log(`✓ 找到 ${this.totalPages} 页图片`);
                this.ui = new DownloaderUI(this.totalPages, this.handleDownload.bind(this), this.handleCancel.bind(this));
                if (this.isScrollMode) { // ✅ 改名
                    this.ui.isScrollMode = true; // ✅ 改名
                    this.ui.scrollModeButton.textContent = '切换普通模式'; // ✅ 改为 scrollModeButton
                    this.ui.scrollModeButton.style.backgroundColor = '#4CAF50';
                }
            } else {
                console.log('⚠️ 未找到图片元素');
                this.ui = new DownloaderUI(0, this.handleDownload.bind(this), this.handleCancel.bind(this));
            }
        }
        async handleDownload() {
            // ✅ 确保UI已初始化
            await this.ensureUIReady();

            if (this.isDownloading) {
                // ✅ 移除 alert，改为UI提示
                this.ui.infoText.textContent = '⚠️ 当前正在下载,请稍后再试';
                this.ui.infoText.style.display = 'block';
                this.ui.infoText.style.color = '#ff9800';

                setTimeout(() => {
                    this.ui.infoText.textContent = `本章节共 ${this.totalPages} 页`;
                    this.ui.infoText.style.color = '#4a5568';
                }, 2000);
                return;
            }

            try {
                this.isDownloading = true;
                this.abortController = new AbortController();
                this.ui.setLoading(true, true);
                // 从UI获取当前选中的模式
                this.pdfMode = this.ui.pdfMode || 'normal';

                console.log('开始下载漫画...');
                await this.downloadComic();

                // ✅ PDF 已在 generatePDF 中真正保存完成后设置标志
                // 这里不需要再设置

                // 下载成功提示
                this.ui.infoText.textContent = '✓ 下载完成!';
                this.ui.infoText.style.display = 'block';
                this.ui.infoText.style.color = '#4CAF50';

                console.log('✓ 整个下载流程结束');

                setTimeout(() => {
                    this.ui.infoText.textContent = `本章节共 ${this.totalPages} 页`;
                    this.ui.infoText.style.color = '#4a5568';
                }, 3000);

            } catch (error) {
                if (error.name === 'AbortError' || error.message === 'AbortError') {
                    console.log('下载已被用户取消');
                    this.ui.infoText.textContent = '下载已取消';
                    this.ui.infoText.style.display = 'block';
                    this.ui.infoText.style.color = '#ff9800';

                    setTimeout(() => {
                        this.ui.infoText.textContent = `本章节共 ${this.totalPages} 页`;
                        this.ui.infoText.style.color = '#4a5568';
                    }, 2000);
                } else {
                    this.handleError(error, '下载失败');
                    this.ui.infoText.textContent = '❌ 下载失败,请重试';
                    this.ui.infoText.style.display = 'block';
                    this.ui.infoText.style.color = '#f44336';

                    setTimeout(() => {
                        this.ui.infoText.textContent = `本章节共 ${this.totalPages} 页`;
                        this.ui.infoText.style.color = '#4a5568';
                    }, 3000);
                }
            } finally {
                this.isDownloading = false;
                this.abortController = null;
                this.ui.setLoading(false, false);
            }
        }

        handleCancel() {
            if (!this.ui) {
                console.warn('UI还未初始化，无法取消下载');
                return;
            }

            if (this.abortController) {
                console.log('用户点击取消下载');
                this.abortController.abort();
                this.isDownloading = false;
                this.ui.setLoading(false, false);

                // 显示取消消息
                this.ui.infoText.textContent = '下载已取消';
                this.ui.infoText.style.display = 'block';
                this.ui.infoText.style.color = '#ff9800';

                setTimeout(() => {
                    this.ui.infoText.textContent = `本章节共 ${this.totalPages} 页`;
                    this.ui.infoText.style.color = '#4a5568';
                }, 2000);
            }
        }

        // 修改 downloadComic 方法
        // 1. 在 downloadComic 中添加状态设置
        async downloadComic() {
            console.log('开始下载漫画...');
            this.ui.infoText.textContent = '📥 下载中...';
            this.ui.infoText.style.display = 'block';
            this.ui.infoText.style.color = '#2196F3';

            let allImages = [];

            // ✅ 检查是否有分页
            if (this.adapter.hasMultiplePages()) {
                const pageUrls = this.adapter.getPageUrls();
                console.log(`检测到分页章节，共 ${pageUrls.length} 页`);

                // ✅ 收集所有分页的图片URL
                const allImageUrls = [];

                for (let i = 0; i < pageUrls.length; i++) {
                    const pageUrl = pageUrls[i];
                    const pageNum = i + 1;

                    console.log(`处理第 ${pageNum}/${pageUrls.length} 分页: ${pageUrl}`);

                    try {
                        let imageUrls;

                        if (pageUrl === window.location.href) {
                            // ✅ 当前页，直接从DOM获取图片URL
                            console.log(`第 ${pageNum} 页是当前页，直接获取图片URL`);
                            const imageElements = this.adapter.getImageElements();
                            imageUrls = Array.from(imageElements)
                                .map(img => this.adapter.getImageUrl(img))
                                .filter(url => url);
                        } else {
                            // ✅ 其他分页，后台加载获取图片URL
                            console.log(`第 ${pageNum} 页需要后台加载`);
                            imageUrls = await this.adapter.fetchImageUrlsFromPage(pageUrl);
                        }

                        console.log(`✓ 第 ${pageNum} 分页获取到 ${imageUrls.length} 张图片URL`);
                        allImageUrls.push(...imageUrls);

                    } catch (error) {
                        console.error(`第 ${pageNum} 分页处理失败:`, error);
                    }
                }

                console.log(`✓ 所有分页URL收集完成，共 ${allImageUrls.length} 张图片`);

                // ✅ 统一下载所有图片
                GM_setValue('totalImages', allImageUrls.length);
                allImages = await this.downloadImagesFromUrls(allImageUrls);

            } else {
                // 单页章节，正常下载
                allImages = await this.downloadImages(1, this.totalPages);
            }

            console.log('所有图片下载完成，开始生成PDF...');

            GM_setValue('downloadStatus', 'complete');
            console.log('✓ 已设置 downloadStatus 为 complete');

            this.ui.infoText.textContent = '📄 正在生成PDF...';
            this.ui.infoText.style.color = '#FF9800';

            await this.generatePDF(allImages);
        }
        async downloadImagesFromUrls(imageUrls) {
            console.log(`开始下载 ${imageUrls.length} 张图片`);
            const downloadResults = new Array(imageUrls.length);
            const downloadPromises = [];

            for (let i = 0; i < imageUrls.length; i++) {
                // 检查是否被取消
                if (this.abortController && this.abortController.signal.aborted) {
                    console.log('检测到取消信号，停止添加新的下载任务');
                    break;
                }

                const imgUrl = imageUrls[i];
                const pageNumber = i + 1;

                console.log(`添加第 ${pageNumber} 张图片下载任务: ${imgUrl}`);

                downloadPromises.push(
                    this.downloadImage(imgUrl)
                        .then(imgData => {
                            if (this.abortController && this.abortController.signal.aborted) {
                                console.log(`第 ${pageNumber} 张已下载但被标记为取消`);
                                return;
                            }

                            downloadResults[i] = imgData;
                            this.ui.infoText.textContent = `📥 下载中... ${pageNumber}/${imageUrls.length}`;
                            this.ui.infoText.style.color = '#2196F3';

                            GM_setValue('currentImage', pageNumber);
                            console.log(`第 ${pageNumber} 张下载完成`);
                        })
                        .catch(error => {
                            if (error.message === 'AbortError') {
                                console.log(`第 ${pageNumber} 张下载被取消`);
                            } else {
                                console.error(`第 ${pageNumber} 张下载失败:`, error);
                            }

                            downloadResults[i] = null;
                            GM_setValue('currentImage', pageNumber);
                        })
                );
            }

            console.log(`总共需要下载 ${downloadPromises.length} 张图片`);

            try {
                const results = await Promise.allSettled(downloadPromises);

                const cancelledCount = results.filter(r =>
                    r.status === 'rejected' && r.reason?.message === 'AbortError'
                ).length;

                if (cancelledCount > 0) {
                    console.log(`${cancelledCount} 个下载任务被取消`);
                    throw new Error('AbortError');
                }

                console.log('所有图片下载任务已完成');
                return downloadResults.filter(img => img !== null);
            } catch (error) {
                if (error.message === 'AbortError') {
                    console.log('下载被用户取消');
                    throw error;
                }
                throw error;
            }
        }

        async downloadImages(start, end) {
            console.log(`开始下载图片 ${start} 到 ${end}`);
            const imageElements = this.adapter.getImageElements();
            const downloadResults = new Array(end - start + 1);
            const downloadPromises = [];

            // 存储总图片数,供目录页面读取
            GM_setValue('totalImages', end - start + 1);

            for (let i = 0; i < imageElements.length; i++) {
                const pageNumber = i + 1;
                if (pageNumber >= start && pageNumber <= end) {
                    // ✅ 在添加promise前检查是否被取消
                    if (this.abortController && this.abortController.signal.aborted) {
                        console.log('检测到取消信号，停止添加新的下载任务');
                        break;
                    }

                    this.addDownloadPromise(imageElements[i], pageNumber, start, downloadResults, downloadPromises);
                }
            }

            console.log(`总共需要下载 ${downloadPromises.length} 张图片`);

            try {
                // ✅ 使用 Promise.allSettled 替代 Promise.all，这样不会因为一个失败而全部中止
                const results = await Promise.allSettled(downloadPromises);

                // 检查是否有被取消的请求
                const cancelledCount = results.filter(r =>
                    r.status === 'rejected' && r.reason?.message === 'AbortError'
                ).length;

                if (cancelledCount > 0) {
                    console.log(`${cancelledCount} 个下载任务被取消`);
                    throw new Error('AbortError');
                }

                console.log('所有图片下载任务已完成');
                return downloadResults;
            } catch (error) {
                if (error.message === 'AbortError') {
                    console.log('下载被用户取消');
                    throw error;
                }
                throw error;
            }
        }

        addDownloadPromise(element, pageNumber, start, downloadResults, downloadPromises) {
            const imgUrl = this.adapter.getImageUrl(element);
            if (imgUrl) {
                console.log(`添加第 ${pageNumber} 页图片下载任务: ${imgUrl}`);
                const arrayIndex = pageNumber - start;
                downloadPromises.push(
                    this.downloadImage(imgUrl)
                        .then(imgData => {
                            if (this.abortController && this.abortController.signal.aborted) {
                                console.log(`第 ${pageNumber} 页已下载但被标记为取消`);
                                return;
                            }

                            downloadResults[arrayIndex] = imgData;
                            // ✅ 修改：更新为统一的提示格式
                            this.ui.infoText.textContent = `📥 下载中... ${pageNumber}/${this.totalPages}`;
                            this.ui.infoText.style.color = '#2196F3';

                            GM_setValue('currentImage', pageNumber);
                            console.log(`第 ${pageNumber} 页下载完成`);
                        })
                        .catch(error => {
                            if (error.message === 'AbortError') {
                                console.log(`第 ${pageNumber} 页下载被取消`);
                            } else {
                                console.error(`第 ${pageNumber} 页下载失败:`, error);
                            }

                            downloadResults[arrayIndex] = null;
                            GM_setValue('currentImage', pageNumber);
                        })
                );
            } else {
                console.warn(`第 ${pageNumber} 页图片URL无效`);
            }
        }
        downloadImage(imgUrl) {
            return new Promise((resolve, reject) => {
                // 检查是否被取消
                if (this.abortController && this.abortController.signal.aborted) {
                    reject(new Error('AbortError'));
                    return;
                }

                console.log(`开始下载图片: ${imgUrl}`);

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: imgUrl,
                    responseType: 'blob',
                    headers: {
                        'Referer': window.location.href,
                        'User-Agent': navigator.userAgent
                    },
                    onload: (response) => {
                        if (this.abortController && this.abortController.signal.aborted) {
                            reject(new Error('AbortError'));
                            return;
                        }

                        if (response.status === 200) {
                            this.handleImageResponse(response, resolve, reject);
                        } else {
                            console.error(`图片下载失败，状态码: ${response.status}`);
                            reject(new Error(`HTTP ${response.status}`));
                        }
                    },
                    onerror: (error) => {
                        console.error('图片下载出错:', error);
                        reject(error);
                    },
                    ontimeout: () => {
                        console.error('图片下载超时');
                        reject(new Error('下载超时'));
                    },
                    timeout: 30000 // 30秒超时
                });
            });
        }

        handleImageResponse(response, resolve, reject) {
            try {
                const blob = response.response;
                const reader = new FileReader();
                reader.onload = event => resolve(event.target.result);
                reader.onerror = error => reject(error);
                reader.readAsDataURL(blob);
            } catch (error) {
                reject(error);
            }
        }

        async generatePDF(images) {
            console.log('开始生成PDF...');

            this.ui.infoText.textContent = '📄 正在生成PDF...';
            this.ui.infoText.style.display = 'block';
            this.ui.infoText.style.color = '#FF9800';

            const pdf = new jspdf.jsPDF();
            const sizes = await this.getImageSizes(images);
            console.log('获取图片尺寸完成');

            // 根据选中的模式调用不同的PDF生成方法
            const mode = this.ui.pdfMode || 'longpage';
            console.log(`使用模式: ${mode}`);

            if (mode === 'scroll') {
                console.log('使用滚动阅读模式生成PDF');
                await this.generateScrollModePDF(pdf, images, sizes);
            } else if (mode === 'longpage') {
                console.log('使用长图模式生成PDF');
                await this.generateLongPagePDF(pdf, images, sizes);
            } else {
                console.log('使用翻页模式生成PDF');
                for (let i = 0; i < images.length; i++) {
                    await this.addImageToPdf(pdf, images[i], i, sizes[i]);

                    const pdfProgress = i + 1;
                    const totalPDFPages = images.length;
                    GM_setValue('currentPDFPage', pdfProgress);
                    GM_setValue('totalPDFPages', totalPDFPages);

                    this.ui.infoText.textContent = `📄 正在生成PDF... ${pdfProgress}/${totalPDFPages}`;
                    console.log(`已添加第 ${i + 1} 页到PDF`);
                }
            }

            console.log('PDF生成完成，准备保存文件');

            this.ui.infoText.textContent = '💾 正在保存...';
            this.ui.infoText.style.color = '#673AB7';

            await this.savePDFWithWait(`${this.chapterName}.pdf`, pdf);

            console.log(`文件保存完成: ${this.chapterName}.pdf`);
            GM_setValue('pdfGenerationComplete', true);
            console.log('✓ PDF已真正保存，标志已设置');
        }
        // ✅ 新增：确保 PDF 下载完全完成的方法
        async savePDFWithWait(filename, pdf) {
            return new Promise((resolve) => {
                try {
                    const pdfBlob = pdf.output('blob');
                    const fileSize = pdfBlob.size;
                    const blobUrl = URL.createObjectURL(pdfBlob);

                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = filename;
                    link.style.display = 'none';
                    document.body.appendChild(link);

                    console.log(`准备下载PDF: ${filename}, 大小: ${(fileSize / 1024).toFixed(2)}KB`);

                    // 触发下载
                    link.click();
                    console.log('✓ 已触发浏览器下载');

                    // 计算等待时间（根据文件大小）
                    let waitTime = 500;
                    if (fileSize > 10 * 1024 * 1024) {
                        waitTime = 3000;
                    } else if (fileSize > 5 * 1024 * 1024) {
                        waitTime = 2000;
                    } else if (fileSize > 1 * 1024 * 1024) {
                        waitTime = 1500;
                    }

                    console.log(`PDF大小: ${(fileSize / 1024).toFixed(2)}KB，等待${waitTime}ms确保下载完成...`);

                    // ✅ 关键：等待足够长的时间，确保浏览器完全接收文件
                    setTimeout(() => {
                        // 清理资源
                        try {
                            document.body.removeChild(link);
                            URL.revokeObjectURL(blobUrl);
                            console.log('✓ 资源清理完成');
                        } catch (e) {
                            console.error('资源清理出错:', e);
                        }

                        console.log('✓ PDF保存流程完全结束，返回');
                        resolve();
                    }, waitTime);

                } catch (error) {
                    console.error('PDF保存失败:', error);
                    setTimeout(resolve, 1000);
                }
            });
        }

        async generateScrollModePDF(pdf, images, sizes) {
            console.log('开始生成滚动阅读模式PDF...');
            const A4_WIDTH = 210;  // A4纸宽度（毫米）
            const A4_HEIGHT = 297; // A4纸高度（毫米）

            // 过滤无效图片
            const validIndices = [];
            for (let i = 0; i < images.length; i++) {
                if (images[i] && images[i] !== 'null' && images[i] !== 'undefined') {
                    validIndices.push(i);
                } else {
                    console.warn(`第 ${i + 1} 张图片数据无效，已跳过`);
                }
            }

            if (validIndices.length === 0) {
                throw new Error('没有有效的图片可以生成PDF');
            }

            console.log(`有效图片数量: ${validIndices.length}/${images.length}`);

            // 删除默认的第一页
            pdf.deletePage(1);

            let currentPageImages = [];  // 当前页的图片
            let currentPageHeight = 0;   // 当前页的累计高度
            let totalPDFPages = 0;       // PDF总页数
            let processedImages = 0;     // 已处理的图片数

            for (let i = 0; i < validIndices.length; i++) {
                const idx = validIndices[i];

                // 计算图片按A4宽度缩放后的高度
                const scaleFactor = A4_WIDTH / sizes[idx].width;
                const scaledHeight = sizes[idx].height * scaleFactor;

                // 如果加上当前图片会超过A4高度，且当前页已有图片，则生成当前页
                if (currentPageHeight + scaledHeight > A4_HEIGHT && currentPageImages.length > 0) {
                    // 生成当前页
                    totalPDFPages++;
                    await this.addScrollPageToPDF(pdf, currentPageImages, A4_WIDTH, currentPageHeight);

                    // 更新进度
                    processedImages += currentPageImages.length;
                    GM_setValue('currentPDFPage', processedImages);
                    GM_setValue('totalPDFPages', validIndices.length);
                    this.ui.infoText.textContent = `📄 正在生成PDF... ${processedImages}/${validIndices.length}`;

                    console.log(`✓ 已生成第 ${totalPDFPages} 页PDF (包含 ${currentPageImages.length} 张图片)`);

                    // 重置当前页
                    currentPageImages = [];
                    currentPageHeight = 0;
                }

                // 添加图片到当前页
                currentPageImages.push({
                    data: images[idx],
                    width: A4_WIDTH,
                    height: scaledHeight,
                    index: idx
                });
                currentPageHeight += scaledHeight;
            }

            // 处理最后一页（如果还有剩余图片）
            if (currentPageImages.length > 0) {
                totalPDFPages++;
                await this.addScrollPageToPDF(pdf, currentPageImages, A4_WIDTH, currentPageHeight);

                processedImages += currentPageImages.length;
                GM_setValue('currentPDFPage', processedImages);
                GM_setValue('totalPDFPages', validIndices.length);

                console.log(`✓ 已生成第 ${totalPDFPages} 页PDF (包含 ${currentPageImages.length} 张图片)`);
            }

            console.log(`✓ 滚动阅读模式PDF生成完成，共 ${totalPDFPages} 页`);
        }

        async addScrollPageToPDF(pdf, pageImages, pageWidth, pageHeight) {
            // 添加新页面，高度为所有图片的累计高度
            pdf.addPage([pageWidth, pageHeight], 'portrait');

            let currentY = 0;

            // 依次添加图片到这一页
            for (let i = 0; i < pageImages.length; i++) {
                const imgData = pageImages[i];

                await new Promise((resolve, reject) => {
                    const img = new Image();
                    let isResolved = false;

                    const cleanup = () => {
                        img.onload = null;
                        img.onerror = null;
                        img.src = '';
                    };

                    img.onload = () => {
                        if (isResolved) return;
                        isResolved = true;

                        try {
                            pdf.addImage(
                                imgData.data,
                                'JPEG',
                                0,
                                currentY,
                                imgData.width,
                                imgData.height,
                                `image${imgData.index}`,
                                'FAST'
                            );

                            currentY += imgData.height;
                            cleanup();
                            setTimeout(resolve, 10);
                        } catch (error) {
                            console.error(`添加第 ${imgData.index + 1} 张图片失败:`, error);
                            cleanup();
                            reject(error);
                        }
                    };

                    img.onerror = () => {
                        if (isResolved) return;
                        isResolved = true;
                        console.warn(`第 ${imgData.index + 1} 张图片加载失败`);
                        cleanup();
                        resolve();
                    };

                    setTimeout(() => {
                        if (!isResolved) {
                            isResolved = true;
                            console.warn(`第 ${imgData.index + 1} 张图片加载超时`);
                            cleanup();
                            resolve();
                        }
                    }, 5000);

                    img.src = imgData.data;
                });
            }
        }
        async getImageSizes(images) {
            return Promise.all(images.map(imgData => {
                return new Promise(resolve => {
                    const img = new Image();
                    img.src = imgData;
                    img.onload = () => resolve({ width: img.width, height: img.height });
                });
            }));
        }

        async addImageToPdf(pdf, imgData, index, size) {
            return new Promise(resolve => {
                const img = new Image();
                img.src = imgData;
                img.onload = () => {
                    if (index > 0) pdf.addPage();

                    const A4_width = 210;
                    const A4_height = 297;
                    const scaleFactor = A4_width / size.width;
                    let finalWidth = A4_width;
                    let finalHeight = size.height * scaleFactor;

                    if (finalHeight > A4_height) {
                        finalHeight = A4_height;
                        finalWidth = size.width * (A4_height / size.height);
                    }

                    pdf.internal.pageSize.width = finalWidth;
                    pdf.internal.pageSize.height = finalHeight;
                    pdf.addImage(imgData, 'JPEG', 0, 0, finalWidth, finalHeight);
                    console.log(`已添加第 ${index + 1} 页到PDF，尺寸: ${finalWidth}x${finalHeight}`);
                    resolve();
                };
            });
        }

        // 新增：长图模式PDF生成
        async generateLongPagePDF(pdf, images, sizes) {
            console.log('开始生成长图PDF（分页模式）...');
            const A4_width = 210;
            const MAX_PAGE_HEIGHT = 5000; // 单页最大高度（13.5米），jsPDF限制为14400，留足够安全边距

            // 先过滤掉无效的图片
            const validIndices = [];
            for (let i = 0; i < images.length; i++) {
                if (images[i] && images[i] !== 'null' && images[i] !== 'undefined') {
                    validIndices.push(i);
                } else {
                    console.warn(`第 ${i + 1} 张图片数据无效，已跳过`);
                }
            }

            if (validIndices.length === 0) {
                throw new Error('没有有效的图片可以生成PDF');
            }

            console.log(`有效图片数量: ${validIndices.length}/${images.length}`);

            // 按高度分组图片到不同页面
            const pages = [];
            let currentPage = {
                images: [],
                indices: [],
                totalHeight: 0
            };

            for (const idx of validIndices) {
                const scaleFactor = A4_width / sizes[idx].width;
                const scaledHeight = sizes[idx].height * scaleFactor;

                // 保守的分页策略：如果加上这张图片会导致或超过最大高度，且当前页面不为空，则分页
                if (currentPage.totalHeight + scaledHeight >= MAX_PAGE_HEIGHT && currentPage.images.length > 0) {
                    // 保存当前页面
                    pages.push(currentPage);
                    console.log(`页面 ${pages.length}: 包含 ${currentPage.images.length} 张图片，总高度 ${currentPage.totalHeight.toFixed(2)}mm`);

                    // 创建新页面
                    currentPage = {
                        images: [],
                        indices: [],
                        totalHeight: 0
                    };
                }

                // 将图片添加到当前页面
                currentPage.images.push(images[idx]);
                currentPage.indices.push(idx);
                currentPage.totalHeight += scaledHeight;

                // 再次检查：确保即使是单张图片，也不会超过限制
                if (currentPage.totalHeight >= MAX_PAGE_HEIGHT && validIndices.indexOf(idx) < validIndices.length - 1) {
                    // 如果只有这一张图片且已超出，保存这页（允许单张超大图片）
                    if (currentPage.images.length > 1) {
                        const lastImg = currentPage.images.pop();
                        const lastIdx = currentPage.indices.pop();
                        currentPage.totalHeight -= scaledHeight;

                        pages.push(currentPage);
                        console.log(`页面 ${pages.length}: 包含 ${currentPage.images.length} 张图片，总高度 ${currentPage.totalHeight.toFixed(2)}mm`);

                        currentPage = {
                            images: [lastImg],
                            indices: [lastIdx],
                            totalHeight: scaledHeight
                        };
                    }
                }
            }

            // 添加最后一页
            if (currentPage.images.length > 0) {
                pages.push(currentPage);
                console.log(`页面 ${pages.length}: 包含 ${currentPage.images.length} 张图片，总高度 ${currentPage.totalHeight.toFixed(2)}mm`);
            }

            console.log(`总共分为 ${pages.length} 页`);

            // 删除默认创建的第一页
            pdf.deletePage(1);

            // 为每一页生成PDF
            let totalProcessed = 0;
            for (let pageNum = 0; pageNum < pages.length; pageNum++) {
                const page = pages[pageNum];
                console.log(`开始处理第 ${pageNum + 1}/${pages.length} 页PDF...`);

                // 创建新页面 - 确保不超过jsPDF限制
                const safePageHeight = Math.min(page.totalHeight, 14000);
                if (page.totalHeight > 14000) {
                    console.warn(`警告：第 ${pageNum + 1} 页高度 ${page.totalHeight.toFixed(2)}mm 超过限制，已截断为 14000mm`);
                }
                pdf.addPage([A4_width, safePageHeight], 'portrait');

                // 在当前页面垂直拼接图片
                let currentY = 0;
                for (let i = 0; i < page.images.length; i++) {
                    const imgIdx = page.indices[i];
                    const imgData = page.images[i];

                    await new Promise((resolve, reject) => {
                        const img = new Image();
                        let isResolved = false;

                        const cleanup = () => {
                            img.onload = null;
                            img.onerror = null;
                        };

                        img.onload = () => {
                            if (isResolved) return;
                            isResolved = true;

                            try {
                                const scaleFactor = A4_width / sizes[imgIdx].width;
                                const scaledHeight = sizes[imgIdx].height * scaleFactor;

                                pdf.addImage(imgData, 'JPEG', 0, currentY, A4_width, scaledHeight, `longimg${imgIdx}`, 'FAST');
                                currentY += scaledHeight;
                                console.log(`长图模式：已添加第 ${imgIdx + 1} 张图片到第 ${pageNum + 1} 页，当前Y坐标: ${currentY.toFixed(2)}mm`);

                                cleanup();
                                setTimeout(resolve, 10);
                            } catch (error) {
                                console.error(`添加第 ${imgIdx + 1} 张图片失败:`, error);
                                cleanup();
                                reject(error);
                            }
                        };

                        img.onerror = () => {
                            if (isResolved) return;
                            isResolved = true;
                            console.error(`第 ${imgIdx + 1} 张图片加载失败，跳过该图片`);
                            cleanup();
                            resolve(); // 继续处理下一张
                        };

                        setTimeout(() => {
                            if (!isResolved) {
                                isResolved = true;
                                console.error(`第 ${imgIdx + 1} 张图片加载超时，跳过该图片`);
                                cleanup();
                                resolve(); // 继续处理下一张
                            }
                        }, 10000); // 增加超时时间到10秒

                        img.src = imgData;
                    });

                    totalProcessed++;
                    const pdfProgress = totalProcessed;
                    const totalImages = validIndices.length;

                    // ✅ 使用GM_setValue存储PDF进度，供startProgressSync读取
                    GM_setValue('currentPDFPage', pdfProgress);
                    GM_setValue('totalPDFPages', totalImages);

                    if (this.ui && this.ui.infoText) {
                        this.ui.infoText.textContent = `📄 正在生成PDF... ${pdfProgress}/${totalImages}`;
                    }
                }

                console.log(`第 ${pageNum + 1}/${pages.length} 页PDF处理完成，最终高度: ${currentY.toFixed(2)}mm`);

                // 每页处理完后暂停一下
                if (pageNum < pages.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }

            console.log('所有页面处理完成');
        }

        handleError(error, message = '下载失败') {
            console.error(message, error);
        }

        // 添加处理选中章节下载的方法
        async handleDownloadSelected() {
            console.log('开始处理选中章节下载...');
            const selectedChapters = this.ui.selectedChapters;
            if (selectedChapters.size === 0) {
                console.log('未选择任何章节');
                this.ui.selectButton.textContent = '⚠️ 请选择至少一个章节';
                this.ui.selectButton.style.backgroundColor = '#ff9800';
                setTimeout(() => {
                    this.ui.selectButton.textContent = '选择章节下载';
                    this.ui.selectButton.style.backgroundColor = '#4CAF50';
                }, 2000);
                return;
            }

            try {
                const chapterLinks = await this.adapter.getChapterLinks();
                const selectedChapterUrls = Array.from(selectedChapters).map(index => chapterLinks[index].url);
                const chapterCount = selectedChapterUrls.length;

                console.log(`准备批量下载 ${chapterCount} 个章节`);

                // 清除取消标志
                GM_setValue('cancelBatchDownload', false);

                this.ui.setLoading(true, chapterCount);
                // 保存当前选中的PDF模式
                const pdfMode = this.ui.pdfMode || 'normal';

                const batchSessionId = Date.now().toString();
                GM_setValue('pdfMode', pdfMode);
                console.log(`设置PDF模式: ${pdfMode}`);

                // ✅ 设置批量下载标志 - 用于禁用图片加载
                GM_setValue('isBatchDownload', true);

                console.log(`创建批量下载会话: ${batchSessionId}`);


                // 存储下载失败的章节
                const failedChapters = [];
                const cancelledChapters = [];
                let currentTab = null; // ✅ 当前打开的标签页

                for (let i = 0; i < selectedChapterUrls.length; i++) {
                    // 检查是否被取消
                    if (GM_getValue('cancelBatchDownload', false)) {
                        console.log('检测到取消标志，停止批量下载');
                        cancelledChapters.push(...selectedChapterUrls.slice(i).map((url, idx) => {
                            return chapterLinks[Array.from(selectedChapters)[i + idx]].name;
                        }));

                        // 关闭当前标签页
                        if (currentTab) {
                            console.log('关闭当前标签页...');
                            try {
                                currentTab.close();
                                console.log('标签页已关闭');
                            } catch (e) {
                                console.log('标签页关闭失败:', e);
                            }
                            currentTab = null;
                        }
                        break;
                    }

                    const url = selectedChapterUrls[i];
                    const chapterName = chapterLinks[Array.from(selectedChapters)[i]].name;

                    console.log(`准备下载第 ${i + 1}/${chapterCount} 个章节: ${chapterName}`);

                    // 更新进度 - 显示正在下载哪个章节
                    this.ui.updateProgress(i, chapterCount, chapterName, 0, 0);

                    try {
                        // ✅ 生成唯一的会话ID，避免冲突
                        const sessionId = `${batchSessionId}_${i}`;

                        GM_setValue('autoDownload', true);
                        GM_setValue('sessionId', sessionId);
                        GM_setValue('downloadStatus', 'pending');
                        GM_setValue('currentChapterName', chapterName);
                        GM_setValue('currentImage', 0);
                        GM_setValue('totalImages', 0);
                        // ✅ 新增：重置 PDF 进度值
                        GM_setValue('currentPDFPage', 0);
                        GM_setValue('totalPDFPages', 0);
                        GM_setValue('pdfGenerationComplete', false);

                        console.log(`设置下载状态为: pending，会话ID: ${sessionId}`);
                        // ✅ 先关闭上一个标签页，再打开新的
                        if (currentTab) {
                            try {
                                currentTab.close();
                                console.log('已关闭上个标签页');
                            } catch (e) {
                                console.log('上个标签页关闭失败:', e);
                            }
                            // 等待标签页完全关闭
                            await new Promise(resolve => setTimeout(resolve, 500));
                        }

                        currentTab = GM_openInTab(url, {
                            active: false,
                            insert: true,
                            setParent: true
                        });

                        console.log(`已打开标签页: ${url}`);

                        // 等待下载完成，同时监听图片下载进度
                        await new Promise((resolve, reject) => {
                            const maxWaitTime = 120000; // 图片下载阶段最多等待2分钟
                            const maxPdfWaitTimeWithoutProgress = 60000; // ✅ 改为：PDF生成无进度时最多等待1分钟
                            const startTime = Date.now();
                            let resolved = false;
                            let hasStartedDownloading = false;
                            let downloadCompleteTime = null;
                            let pdfGenerationStartTime = null;
                            let pdfGenerationCompleteTime = null;
                            let lastPDFPage = 0; // ✅ 新增：记录上次的PDF页数
                            let lastPDFProgressTime = Date.now(); // ✅ 新增：记录上次PDF进度更新时间

                            const checkStatus = () => {
                                if (resolved) return;

                                const currentTimeMs = Date.now();
                                const elapsedTime = currentTimeMs - startTime;

                                // 检查是否被取消
                                if (GM_getValue('cancelBatchDownload', false)) {
                                    resolved = true;
                                    GM_setValue('downloadStatus', '');
                                    GM_setValue('currentImage', 0);
                                    GM_setValue('totalImages', 0);
                                    GM_setValue('currentPDFPage', 0);
                                    GM_setValue('totalPDFPages', 0);
                                    console.log('下载被用户取消');
                                    reject(new Error('用户取消下载'));
                                    return;
                                }

                                const status = GM_getValue('downloadStatus', '');
                                const currentImage = GM_getValue('currentImage', 0);
                                const totalImages = GM_getValue('totalImages', 0);
                                const currentPDFPage = GM_getValue('currentPDFPage', 0);
                                const totalPDFPages = GM_getValue('totalPDFPages', 0);
                                const pdfGenerationComplete = GM_getValue('pdfGenerationComplete', false);

                                if (totalImages > 0) {
                                    hasStartedDownloading = true;
                                }

                                const lastImageCount = GM_getValue('lastImageCount', 0);
                                if (totalImages > 0 && currentImage !== lastImageCount) {
                                    this.ui.updateProgress(i + 1, chapterCount, chapterName, currentImage, totalImages);
                                    GM_setValue('lastImageCount', currentImage);
                                }

                                const isDownloadComplete =
                                    (status === 'complete' && hasStartedDownloading) ||
                                    (hasStartedDownloading && currentImage >= totalImages && totalImages > 0);

                                if (isDownloadComplete && !downloadCompleteTime) {
                                    downloadCompleteTime = currentTimeMs;
                                    console.log(`✓ 第 ${i + 1} 个章节图片下载完成,等待PDF生成...`);
                                }

                                if (downloadCompleteTime && !pdfGenerationStartTime && currentPDFPage > 0) {
                                    pdfGenerationStartTime = currentTimeMs;
                                    lastPDFPage = currentPDFPage;
                                    lastPDFProgressTime = currentTimeMs;
                                    console.log(`✓ 检测到 PDF 生成开始`);
                                }

                                // ✅ 新增：检测PDF生成进度
                                if (pdfGenerationStartTime && currentPDFPage > lastPDFPage) {
                                    lastPDFPage = currentPDFPage;
                                    lastPDFProgressTime = currentTimeMs;
                                    console.log(`📄 PDF生成进度更新: ${currentPDFPage}/${totalPDFPages}`);
                                }

                                if (pdfGenerationStartTime && !pdfGenerationCompleteTime && pdfGenerationComplete) {
                                    pdfGenerationCompleteTime = currentTimeMs;
                                    console.log(`✓ 检测到 PDF 生成完成`);
                                }

                                if (pdfGenerationCompleteTime) {
                                    const waitAfterComplete = currentTimeMs - pdfGenerationCompleteTime;

                                    if (waitAfterComplete >= 5000) {
                                        resolved = true;
                                        GM_setValue('downloadStatus', '');
                                        GM_setValue('currentImage', 0);
                                        GM_setValue('totalImages', 0);
                                        GM_setValue('currentPDFPage', 0);
                                        GM_setValue('totalPDFPages', 0);
                                        GM_setValue('pdfGenerationComplete', false);
                                        GM_setValue('lastImageCount', 0);
                                        console.log(`✓ 第 ${i + 1} 个章节完成: ${chapterName}`);
                                        resolve();
                                        return;
                                    }
                                } else if (pdfGenerationStartTime) {
                                    const timeSinceLastProgress = currentTimeMs - lastPDFProgressTime;

                                    // ✅ 改进：如果PDF正在生成且有进度，就继续等待
                                    if (currentPDFPage > 0 && currentPDFPage < totalPDFPages) {
                                        // PDF正在生成中，检查是否长时间无进度
                                        if (timeSinceLastProgress > maxPdfWaitTimeWithoutProgress) {
                                            console.warn(`⚠️ PDF生成超过${maxPdfWaitTimeWithoutProgress / 1000}秒无进度，当前${currentPDFPage}/${totalPDFPages}`);
                                            resolved = true;
                                            GM_setValue('downloadStatus', '');
                                            GM_setValue('currentImage', 0);
                                            GM_setValue('totalImages', 0);
                                            GM_setValue('currentPDFPage', 0);
                                            GM_setValue('totalPDFPages', 0);
                                            GM_setValue('pdfGenerationComplete', false);
                                            GM_setValue('lastImageCount', 0);
                                            console.log(`⚠️ 第 ${i + 1} 个章节PDF生成超时: ${chapterName}`);
                                            failedChapters.push(chapterName);
                                            reject(new Error('PDF生成超时'));
                                            return;
                                        }
                                    } else if (currentPDFPage >= totalPDFPages && totalPDFPages > 0) {
                                        // ✅ PDF已经生成完所有页，等待保存完成标志
                                        if (timeSinceLastProgress > 30000) { // 等待30秒保存
                                            resolved = true;
                                            GM_setValue('downloadStatus', '');
                                            GM_setValue('currentImage', 0);
                                            GM_setValue('totalImages', 0);
                                            GM_setValue('currentPDFPage', 0);
                                            GM_setValue('totalPDFPages', 0);
                                            GM_setValue('pdfGenerationComplete', false);
                                            GM_setValue('lastImageCount', 0);
                                            console.log(`✓ 第 ${i + 1} 个章节完成(PDF已生成): ${chapterName}`);
                                            resolve();
                                            return;
                                        }
                                    }
                                } else if (downloadCompleteTime) {
                                    const waitForPdfStart = currentTimeMs - downloadCompleteTime;

                                    // ✅ 增加到60秒，并输出更详细的日志
                                    if (waitForPdfStart > 60000) {
                                        console.warn(`⚠️ 图片下载完成已${Math.floor(waitForPdfStart / 1000)}秒，但PDF仍未开始生成`);
                                        console.warn(`   当前状态: downloadStatus=${GM_getValue('downloadStatus')}`);
                                        console.warn(`   currentPDFPage=${GM_getValue('currentPDFPage')}, totalPDFPages=${GM_getValue('totalPDFPages')}`);

                                        resolved = true;
                                        GM_setValue('downloadStatus', '');
                                        GM_setValue('currentImage', 0);
                                        GM_setValue('totalImages', 0);
                                        GM_setValue('currentPDFPage', 0);
                                        GM_setValue('totalPDFPages', 0);
                                        GM_setValue('lastImageCount', 0);
                                        console.warn(`✗ 第 ${i + 1} 个章节超时: ${chapterName}`);
                                        failedChapters.push(chapterName);
                                        reject(new Error('PDF生成未开始'));
                                        return;
                                    }

                                    // ✅ 添加：每10秒输出一次等待日志
                                    if (Math.floor(waitForPdfStart / 10000) > Math.floor((waitForPdfStart - 500) / 10000)) {
                                        console.log(`⏳ 等待PDF生成开始... 已等待${Math.floor(waitForPdfStart / 1000)}秒`);
                                    }
                                }
                                else if (elapsedTime > maxWaitTime) {
                                    resolved = true;
                                    GM_setValue('downloadStatus', '');
                                    GM_setValue('currentImage', 0);
                                    GM_setValue('totalImages', 0);
                                    GM_setValue('currentPDFPage', 0);
                                    GM_setValue('totalPDFPages', 0);
                                    GM_setValue('lastImageCount', 0);
                                    console.warn(`✗ 第 ${i + 1} 个章节下载超时: ${chapterName}`);
                                    failedChapters.push(chapterName);
                                    reject(new Error('下载超时'));
                                    return;
                                }
                            };

                            const checkInterval = setInterval(() => {
                                checkStatus();
                                if (resolved) {
                                    clearInterval(checkInterval);
                                }
                            }, 500);

                            // ✅ 修改：移除固定的总超时时间，依赖各阶段的超时检测
                            // 仅保留一个非常长的保底超时（10分钟）
                            const emergencyTimeout = setTimeout(() => {
                                if (!resolved) {
                                    resolved = true;
                                    clearInterval(checkInterval);
                                    console.warn(`✗ 第 ${i + 1} 个章节紧急超时（10分钟）`);
                                    reject(new Error('紧急超时'));
                                }
                            }, 600000); // 10分钟

                            // 清理函数
                            const cleanup = () => {
                                clearInterval(checkInterval);
                                clearTimeout(emergencyTimeout);
                            };

                            // 在resolve/reject时清理定时器
                            const originalResolve = resolve;
                            const originalReject = reject;
                            resolve = (...args) => {
                                cleanup();
                                originalResolve(...args);
                            };
                            reject = (...args) => {
                                cleanup();
                                originalReject(...args);
                            };
                        });


                        // 更新为完成状态
                        this.ui.updateProgress(i + 1, chapterCount);

                        // 章节间延迟 - 在下载完成后
                        if (i < chapterCount - 1) {
                            console.log(`等待2秒后下载下一个章节...`); // ✅ 改为2秒(原来3秒)
                            await new Promise(resolve => setTimeout(resolve, 2000));
                        }

                        // 失败后延迟 - 在 catch 块中
                    } catch (error) {
                        if (error.message === '用户取消下载') {
                            console.log('用户取消下载,跳出循环');
                            cancelledChapters.push(chapterName);
                            break;
                        }
                        console.error(`✗ 第 ${i + 1} 个章节下载失败: ${chapterName}`, error);
                        failedChapters.push(chapterName);

                        await new Promise(resolve => setTimeout(resolve, 500)); // ✅ 改为0.5秒(原来1秒)
                    }
                }

                // 关闭最后打开的标签页
                if (currentTab) {
                    console.log('关闭最后一个标签页...');
                    try {
                        currentTab.close();
                        console.log('最后一个标签页已关闭');
                    } catch (e) {
                        console.log('最后一个标签页关闭失败:', e);
                    }
                }

                // 清除批量下载标志
                GM_setValue('isBatchDownload', false);
                GM_setValue('autoDownload', false);
                GM_setValue('sessionId', '');
                GM_setValue('currentChapterName', '');
                GM_setValue('cancelBatchDownload', false);
                GM_setValue('downloadStatus', '');
                GM_setValue('currentPDFPage', 0);
                GM_setValue('totalPDFPages', 0);


                this.ui.setLoading(false);
                console.log('批量下载流程结束');

                // 显示完成统计
                const successCount = chapterCount - failedChapters.length - cancelledChapters.length;

                if (cancelledChapters.length > 0) {
                    // ✅ 移除 alert，使用按钮显示
                    this.ui.selectButton.textContent = `⏸️ 已取消 (完成${successCount}/${chapterCount})`;
                    this.ui.selectButton.style.backgroundColor = '#ff9800';

                    console.log(`批量下载已取消\n✓ 已完成: ${successCount}个\n✗ 失败: ${failedChapters.length}个\n⊗ 已取消: ${cancelledChapters.length}个`);

                    // ✅ 如果有失败的章节，在控制台输出详情
                    if (failedChapters.length > 0) {
                        console.warn('失败章节:', failedChapters.join(', '));
                    }
                } else if (failedChapters.length === 0) {
                    this.ui.selectButton.textContent = `🎉 全部完成! (${chapterCount}个章节)`;
                    this.ui.selectButton.style.backgroundColor = '#4CAF50';
                    console.log(`✓ 批量下载全部完成! 共${chapterCount}个章节`);
                } else {
                    // ✅ 移除 alert，使用按钮显示
                    this.ui.selectButton.textContent = `⚠️ 部分完成 (${successCount}/${chapterCount})`;
                    this.ui.selectButton.style.backgroundColor = '#ff9800';

                    console.warn(`下载完成! 成功: ${successCount}个, 失败: ${failedChapters.length}个`);
                    console.warn('失败章节:', failedChapters.join(', '));
                }

                this.ui.selectButton.disabled = true;

                setTimeout(() => {
                    this.ui.selectButton.textContent = '选择章节下载';
                    this.ui.selectButton.style.backgroundColor = '#4CAF50';
                    this.ui.selectButton.disabled = false;
                }, 5000);

            } catch (error) {
                console.error('批量下载失败:', error);
                GM_setValue('autoDownload', false);
                GM_setValue('sessionId', '');
                GM_setValue('cancelBatchDownload', false);
                GM_setValue('downloadStatus', '');
                GM_setValue('isBatchDownload', false); // ✅ 添加这行


                this.ui.setLoading(false);
                this.ui.selectButton.textContent = '❌ 下载失败,请重试';
                this.ui.selectButton.style.backgroundColor = '#f44336';
                setTimeout(() => {
                    this.ui.selectButton.textContent = '选择章节下载';
                    this.ui.selectButton.style.backgroundColor = '#4CAF50';
                }, 3000);
            }
        }
    }
    // 在 initialize 函数之前添加样式
    function addScrollbarStyles() {
        if (document.getElementById('comic-downloader-scrollbar-styles')) {
            return; // 已添加，避免重复
        }

        const styleSheet = document.createElement('style');
        styleSheet.id = 'comic-downloader-scrollbar-styles';
        styleSheet.textContent = `
        /* 自定义滚动条样式 */
        .comic-downloader-chapter-list::-webkit-scrollbar {
            width: 8px;
        }
        
        .comic-downloader-chapter-list::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.05);
            border-radius: 4px;
        }
        
        .comic-downloader-chapter-list::-webkit-scrollbar-thumb {
            background: rgba(0,0,0,0.2);
            border-radius: 4px;
            transition: background 0.2s;
        }
        
        .comic-downloader-chapter-list::-webkit-scrollbar-thumb:hover {
            background: rgba(0,0,0,0.4);
        }
        
        /* Firefox */
        .comic-downloader-chapter-list {
            scrollbar-width: thin;
            scrollbar-color: rgba(0,0,0,0.2) rgba(0,0,0,0.05);
        }
    `;
        document.head.appendChild(styleSheet);
    }
    // 6. 初始化
    function initialize() {
        console.log('开始初始化下载器...');
        addScrollbarStyles();

        // ✅ 检查是否是批量下载模式
        const isBatchDownload = GM_getValue('isBatchDownload', false);
        const autoDownload = GM_getValue('autoDownload', false);

        if (isBatchDownload && autoDownload) {
            console.log('🚫 批量下载模式：禁用图片加载');
            disableImageLoading();
        }

        try {
            window.comicDownloader = new ComicDownloader();

            const sessionId = GM_getValue('sessionId', '');
            const currentTime = Date.now();

            console.log('自动下载标志:', autoDownload);
            console.log('会话ID:', sessionId);

            if (autoDownload &&
                sessionId &&
                window.comicDownloader.adapter.isChapterPage() &&
                (currentTime - parseInt(sessionId.split('_')[0])) < 300000) {

                console.log('检测到批量下载流程，准备自动下载');

                window.comicDownloader.isScrollMode = GM_getValue('isScrollMode', false);

                window.comicDownloader.ensureUIReady().then(() => {
                    // ✅ 增加延迟时间，给页面更多时间初始化
                    setTimeout(async () => {
                        try {
                            console.log('等待页面初始化完成，开始自动下载...');
                            await window.comicDownloader.handleDownload();
                            console.log('自动下载完成');
                            GM_setValue('downloadStatus', 'complete');

                            // 下载完成后恢复图片加载(为下一个章节做准备)
                            if (isBatchDownload) {
                                enableImageLoading();
                            }
                        } catch (error) {
                            console.error('自动下载失败:', error);
                            GM_setValue('downloadStatus', 'complete');

                            if (isBatchDownload) {
                                enableImageLoading();
                            }
                        }
                    }, 2000); // ✅ 改为2秒，给页面足够的初始化时间
                }).catch(error => {
                    console.error('UI初始化失败:', error);
                    GM_setValue('downloadStatus', 'failed');
                    GM_setValue('autoDownload', false);

                    if (isBatchDownload) {
                        enableImageLoading();
                    }
                });

            } else {
                if (autoDownload) {
                    console.log('清除自动下载标志');
                    GM_setValue('autoDownload', false);
                    GM_setValue('sessionId', '');
                    GM_setValue('isBatchDownload', false);
                }
            }

            if (window.comicDownloader.ui) {
                console.log('UI已初始化');
                if (window.comicDownloader.adapter.isDirectoryPage()) {
                    console.log('当前是目录页面');
                    window.comicDownloader.ui.chapterListContainer.style.display = 'block';
                }
            } else {
                console.log('等待章节页面UI初始化...');
            }
        } catch (error) {
            console.error('初始化失败:', error);
        }
    }

    // 确保在页面完全加载后再初始化
    if (document.readyState === 'complete') {
        console.log('页面已加载完成，立即初始化');
        initialize();
    } else {
        console.log('等待页面加载完成...');
        window.addEventListener('load', () => {
            console.log('页面加载完成，开始初始化');
            initialize();
        });
    }
})();