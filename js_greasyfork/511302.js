// ==UserScript==
// @name         U9A9.com-首页预览图
// @namespace    none
// @description  从U9A9.com的首页加载预览图片
// @version      2.3.2
// @license      MIT
// @homepage     https://sleazyfork.org/zh-CN/scripts/511302-u9a9-com-%E9%A6%96%E9%A1%B5%E9%A2%84%E8%A7%88%E5%9B%BE?locale_override=1
// @supportURL   https://sleazyfork.org/zh-CN/scripts/511302-u9a9-com-%E9%A6%96%E9%A1%B5%E9%A2%84%E8%A7%88%E5%9B%BE?locale_override=1
// @match        https://u9a9.com/*
// @match        https://u9a9.org/*
// @match        https://u9a9.de/*
// @match        https://u9a9.one/*
// @match        https://u9a9.su/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=u9a9.com
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/511302/U9A9com-%E9%A6%96%E9%A1%B5%E9%A2%84%E8%A7%88%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/511302/U9A9com-%E9%A6%96%E9%A1%B5%E9%A2%84%E8%A7%88%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置管理 ====================
    class ConfigManager {
        static defaults = {
            visitedColor: '#ff6b6b' // 已读链接颜色
        };

        static get(key) {
            const config = GM_getValue('u9a9_config', this.defaults);
            return config[key] !== undefined ? config[key] : this.defaults[key];
        }

        static set(key, value) {
            const config = GM_getValue('u9a9_config', this.defaults);
            config[key] = value;
            GM_setValue('u9a9_config', config);
        }

        static getAll() {
            return GM_getValue('u9a9_config', this.defaults);
        }
    }

    // ==================== 菜单管理 ====================
    class MenuManager {
        static registerMenus() {
            // 已读颜色设置
            GM_registerMenuCommand('🎨 设置已读颜色', () => {
                const current = ConfigManager.get('visitedColor');
                const color = prompt('请输入已读帖子颜色（CSS颜色值）:', current);
                if (color && color !== current) {
                    ConfigManager.set('visitedColor', color);
                    alert('已读颜色已更新，刷新页面生效');
                    location.reload();
                }
            });
        }
    }

    // 配置项
    const CONFIG = {
        get visitedColor() { return ConfigManager.get('visitedColor'); } // 已读链接颜色
    };

    // 存储管理
    class VisitedStorage {
        static getVisitedPosts() {
            return GM_getValue('u9a9_visited_posts', {});
        }

        static markPostAsVisited(postId) {
            const visited = this.getVisitedPosts();
            visited[postId] = Date.now();
            GM_setValue('u9a9_visited_posts', visited);
        }

        static isPostVisited(postId) {
            const visited = this.getVisitedPosts();
            return !!visited[postId];
        }
    }

    const processedLinks = new Set();
    const imageCache = new Map();
    let requestQueue = Promise.resolve();
    const requestDelay = 100;
    const initialLoadCount = 20;
    const batchSize = 20;

    function addImage(url, linkElement) {
        if (processedLinks.has(url)) return;
        processedLinks.add(url);

        if (imageCache.has(url)) {
            addImageIcon(imageCache.get(url), linkElement);
        } else {
            requestQueue = requestQueue.then(() => processImageLink(url, linkElement))
                .then(() => new Promise(resolve => setTimeout(resolve, requestDelay)));
        }
    }

    async function processImageLink(url, linkElement) {
        try {
            const html = await fetchPage(url);
            const imageUrl = extractFirstImageUrl(html);
            if (imageUrl) {
                imageCache.set(url, imageUrl);
                addImageIcon(imageUrl, linkElement);
            } else {
                const existingIcon = linkElement.previousElementSibling;
                if (existingIcon && existingIcon.classList.contains('lmt-icon')) {
                    existingIcon.remove();
                }
            }
        } catch (error) {
            console.error('Error processing image link:', error);
        }
    }

    function fetchPage(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: response => resolve(response.responseText),
                onerror: error => reject(error)
            });
        });
    }

    // 可配置的图片域名列表，如需添加新域名，只需在此处添加
    const imageDomains = ['u99', '6img'];
    
    function extractFirstImageUrl(html) {
        // 生成域名的正则表达式部分
        const domainPattern = `(?:${imageDomains.join('|')})`;
        
        // 动态生成正则表达式
        const patterns = [
            new RegExp(`https?:\\/\\/.*\\.${domainPattern}\\.pics\\/[^"']+\\.(?:jpg|jpeg|png|gif)`, 'i'),
            new RegExp(`\\/\\/.*\\.${domainPattern}\\.pics\\/[^"']+\\.(?:jpg|jpeg|png|gif)`, 'i')
        ];

        for (let pattern of patterns) {
            const match = html.match(pattern);
            if (match) {
                let url = match[0].split('"')[0].split("'")[0];
                return url.startsWith('//') ? 'https:' + url : url;
            }
        }

        return null;
    }

    function addImageIcon(imageUrl, linkElement) {
        let span = linkElement.previousElementSibling;
        if (!span || !span.classList.contains('lmt-icon')) {
            span = document.createElement("span");
            span.classList.add('lmt-icon');
            span.innerHTML = '🖼️';
            span.style.cursor = 'pointer';
            linkElement.parentNode.insertBefore(span, linkElement);
        }

        imageUrl = imageUrl.split('"')[0].split("'")[0];
        span.dataset.lmt = imageUrl;

        [span, linkElement].forEach(el => {
            el.addEventListener('mousemove', (e) => showImage(imageUrl, e));
            el.addEventListener('mouseleave', hideImage);
        });
    }

    function showImage(imageUrl, event) {
        let container = document.getElementById('LMT_Frame');
        if (!container) {
            container = document.createElement('div');
            container.id = 'LMT_Frame';
            container.style.position = 'fixed';
            container.style.zIndex = '10000';
            container.style.display = 'none';
            document.body.appendChild(container);
        }

        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.border = '2px solid #333';
        img.style.borderRadius = '5px';
        img.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';

        container.innerHTML = '';
        container.appendChild(img);
        container.style.display = 'block';

        // 计算位置
        const maxWidth = 540;
        const maxHeight = 540;
        container.style.maxWidth = `${maxWidth}px`;
        container.style.maxHeight = `${maxHeight}px`;

        let left = event.clientX + 10;
        let top = event.clientY + 10;

        // 确保图片不会超出屏幕右侧
        if (left + maxWidth > window.innerWidth) {
            left = window.innerWidth - maxWidth - 10;
        }

        // 确保图片不会超出屏幕底部
        if (top + maxHeight > window.innerHeight) {
            top = window.innerHeight - maxHeight - 10;
        }

        container.style.left = `${left}px`;
        container.style.top = `${top}px`;
    }

    function hideImage() {
        const container = document.getElementById('LMT_Frame');
        if (container) {
            container.style.display = 'none';
        }
    }

    function loadBatch(links, startIndex) {
        const endIndex = Math.min(startIndex + batchSize, links.length);
        // 使用当前页面的协议和域名，支持所有镜像域名
        const currentOrigin = window.location.origin;
        
        for (let i = startIndex; i < endIndex; i++) {
            const link = links[i];
            const fullUrl = currentOrigin + link.getAttribute('href');
            addImage(fullUrl, link);
        }
        return endIndex;
    }

    function initLazyLoading(links) {
        let currentIndex = 0;

        // 初始加载
        currentIndex = loadBatch(links, currentIndex);

        // 监听滚动事件
        window.addEventListener('scroll', () => {
            if (currentIndex >= links.length) return;

            const lastLink = links[currentIndex - 1];
            if (lastLink && isElementInViewport(lastLink)) {
                currentIndex = loadBatch(links, currentIndex);
            }
        });
    }

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // 从链接中提取帖子ID
    function extractPostId(linkElement) {
        if (!linkElement) return null;
        
        const href = linkElement.getAttribute('href');
        if (!href) return null;
        
        // 匹配 /view/2/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx 格式的链接
        const viewMatch = href.match(/\/view\/\d+\/(\w+)/);
        if (viewMatch) return viewMatch[1];
        
        // 匹配磁力链接或种子链接中的哈希值
        const magnetMatch = href.match(/btih:([a-fA-F0-9]{40})/i);
        if (magnetMatch) return magnetMatch[1];
        
        // 匹配种子文件URL中的哈希值
        const torrentMatch = href.match(/\/([a-fA-F0-9]{40})\.torrent$/i);
        if (torrentMatch) return torrentMatch[1];
        
        return null;
    }

    // 从URL中提取帖子ID
    function extractPostIdFromURL() {
        const pathname = window.location.pathname;
        const match = pathname.match(/\/view\/\d+\/(\w+)/);
        if (match) return match[1];
        return null;
    }

    // 标记已访问的帖子
    function markVisitedPost(linkElement) {
        if (!linkElement) return;
        
        const postId = extractPostId(linkElement);
        if (postId) {
            if (VisitedStorage.isPostVisited(postId)) {
                // 添加类名到链接元素和所有子元素
                linkElement.classList.add('u9a9-visited-link');
                linkElement.querySelectorAll('*').forEach(el => {
                    el.classList.add('u9a9-visited-link');
                });
                
                // 包裹文本节点
                Array.from(linkElement.childNodes)
                    .filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim())
                    .forEach(node => {
                        const span = document.createElement('span');
                        span.classList.add('u9a9-visited-link');
                        span.textContent = node.textContent;
                        node.parentNode.replaceChild(span, node);
                    });
            } else {
                // 清除样式和类名
                linkElement.style.color = '';
                linkElement.style.cssText = linkElement.style.cssText.replace(/color:[^;]+;/g, '');
                linkElement.classList.remove('u9a9-visited-link');
                linkElement.querySelectorAll('*').forEach(el => {
                    el.classList.remove('u9a9-visited-link');
                });
            }
        }
    }

    // 处理链接元素
    function processLink(linkElement) {
        if (!linkElement) return;
        
        // 标记已访问的链接
        markVisitedPost(linkElement);
        
        // 添加点击事件监听器，记录访问的链接并立即更新颜色
        linkElement.addEventListener('click', (e) => {
            const postId = extractPostId(linkElement);
            
            if (postId) {
                VisitedStorage.markPostAsVisited(postId);
                // 立即更新链接颜色，不等待刷新
                
                // 网站可能会立即修改链接样式，我们需要确保我们的修改在它之后执行
                // 使用多个策略确保样式生效：
                
                // 1. 立即调用一次
                markVisitedPost(linkElement);
                
                // 2. 使用requestAnimationFrame确保在DOM更新后执行
                requestAnimationFrame(() => {
                    markVisitedPost(linkElement);
                    
                    // 3. 添加一个短暂延迟，确保网站自身的JS执行完毕
                    setTimeout(() => {
                        markVisitedPost(linkElement);
                        
                        // 4. 直接强制设置颜色样式，确保覆盖网站自身的变色效果
                        const setColor = (element) => {
                            if (element) {
                                element.style.color = CONFIG.visitedColor + ' !important';
                                element.style.cssText += `color: ${CONFIG.visitedColor} !important;`;
                                element.setAttribute('style', `color: ${CONFIG.visitedColor} !important;`);
                                element.classList.add('u9a9-visited-link');
                            }
                        };
                        
                        // 设置链接本身的颜色
                        setColor(linkElement);
                        
                        // 同时设置所有子元素的颜色
                        const allChildElements = linkElement.querySelectorAll('*');
                        allChildElements.forEach(setColor);
                        
                        // 5. 再次使用requestAnimationFrame确保样式最终生效
                        requestAnimationFrame(() => {
                            markVisitedPost(linkElement);
                        });
                    }, 100); // 100ms延迟确保网站JS执行完毕
                });
            }
        });
    }

    // 处理下载按钮点击
    function processDownloadButtons(buttons) {
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const postId = extractPostId(button);
                if (postId) {
                    VisitedStorage.markPostAsVisited(postId);
                    
                    // 找到同一行的帖子链接并更新颜色
                    const row = button.closest('tr');
                    if (row) {
                        const postLink = row.querySelector('a[href^="/view/"]');
                        if (postLink) {
                            markVisitedPost(postLink);
                        }
                    }
                }
            });
        });
    }
    
    function init() {
        const links = Array.from(document.querySelectorAll('a[href^="/view/"]'));
        
        // 处理所有当前页面上的链接
        links.forEach(link => processLink(link));
        
        // 处理所有当前页面上的下载按钮
        const downloadButtons = Array.from(document.querySelectorAll(
            'a:has(i.glyphicon.glyphicon-download-alt.fa-fw), a:has(i.glyphicon.glyphicon-magnet.fa-fw)'
        ));
        processDownloadButtons(downloadButtons);
        
        initLazyLoading(links);
        
        // 如果是详情页，标记当前帖子为已访问
        const currentPostId = extractPostIdFromURL();
        if (currentPostId) {
            VisitedStorage.markPostAsVisited(currentPostId);
        }
        
        // 添加MutationObserver监听页面动态变化
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType !== Node.ELEMENT_NODE) return;
                        
                        // 处理新添加的帖子链接
                        if (node.matches('a[href^="/view/"]')) {
                            processLink(node);
                        }
                        node.querySelectorAll('a[href^="/view/"]').forEach(link => processLink(link));
                        
                        // 处理新添加的下载按钮
                        const newDownloadButtons = Array.from(node.querySelectorAll(
                            'a:has(i.glyphicon.glyphicon-download-alt.fa-fw), a:has(i.glyphicon.glyphicon-magnet.fa-fw)'
                        ));
                        processDownloadButtons(newDownloadButtons);
                    });
                }
            });
        });
        
        // 开始观察页面变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 添加CSS样式规则
    function addCSSRules() {
        const style = document.createElement('style');
        style.textContent = `
            /* 已读链接样式 */
            .u9a9-visited-link,
            .u9a9-visited-link *, 
            a[href^="/view/"]:has(.u9a9-visited-link),
            a[href^="/view/"]:has(.u9a9-visited-link) * {
                color: ${CONFIG.visitedColor} !important;
            }
        `;
        document.head.appendChild(style);
    }

    window.addEventListener('load', () => {
        // 检查当前页面是否为view子页面，如果是则不执行
        if (window.location.pathname.match(/^\/view\//)) {
            return;
        }
        // 注册菜单
        MenuManager.registerMenus();
        // 添加样式
        addCSSRules();
        // 初始化功能
        init();
    });
})();