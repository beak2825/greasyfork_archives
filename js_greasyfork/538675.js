// ==UserScript==
// @name         T66Y网页美化脚本
// @namespace    http://tampermonkey.net/
// @version      1.4.0
// @description  美化t66y.com网页的图片和文字排版，支持视频显示，保留原文链接，只优化一楼主题内容
// @author       You
// @match        https://t66y.com/htm_data/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538675/T66Y%E7%BD%91%E9%A1%B5%E7%BE%8E%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/538675/T66Y%E7%BD%91%E9%A1%B5%E7%BE%8E%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 封装所有功能，避免全局变量污染
    const T66Y_Beautifier = {
        init: function() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', this.run.bind(this));
            } else {
                this.run.bind(this)();
            }
        },

        run: function() {
            if (window.top !== window.self) return; // 不在iframe中运行
            this.addCustomStyles();
            this.beautifyContent();
            this.observeDynamicContent();
            this.addScrollToTopButton();
        },

        // 核心功能：美化内容
        beautifyContent: function() {
            const mainContent = document.querySelector('#conttpc');
            if (mainContent && !mainContent.dataset.beautified) {
                mainContent.dataset.beautified = 'true';
                this.extractAndDisplayUserInfo(mainContent);
                this.processMainContent(mainContent);
                this.hideOriginalElements();
            }
        },

        // 1. 添加自定义样式 (基于您最初的样式)
        addCustomStyles: function() {
            if (document.getElementById('beautify-t66y-styles-v1.4')) return;
            const style = document.createElement('style');
            style.id = 'beautify-t66y-styles-v1.4';
            style.textContent = `
                /* 核心布局样式 */
                .tpc_content { max-width: 1200px; margin: 0 auto; padding: 20px; line-height: 1.6; font-size: 16px; background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .beautified-content { padding-top: 20px; }

                /* 媒体画廊 (图片/视频) */
                .media-gallery { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
                .media-gallery.single-item { grid-template-columns: 1fr; }
                .media-item { position: relative; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease; background: #f5f5f5; }
                .media-item:hover { transform: scale(1.02); }
                .media-item img, .media-item video { width: 100%; height: auto; display: block; border-radius: 8px; cursor: pointer; }
                .media-item video { background: #000; }

                /* 文本内容 */
                .text-content { margin: 20px 0; padding: 15px; background: #f8f9fa; border-left: 4px solid #007bff; border-radius: 4px; line-height: 1.8; color: #333; }
                .text-content p { margin: 0 0 10px 0; }
                .text-content p:last-child { margin-bottom: 0; }
                .text-content a { color: #007bff !important; text-decoration: none !important; font-weight: 500; }
                .text-content a:hover { text-decoration: underline !important; }

                /* 辅助样式 */
                .image-loading { display: flex; align-items: center; justify-content: center; min-height: 200px; color: #999; }
                .user-info-bar { margin-bottom: 20px; padding: 12px 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; color: white; display: flex; flex-wrap: wrap; align-items: center; gap: 15px; }
                .user-info-bar .username { font-weight: bold; font-size: 16px; margin-right: 10px; }
                .user-info-bar .info-item { background: rgba(255, 255, 255, 0.15); padding: 4px 8px; border-radius: 4px; font-size: 13px; }

                /* 隐藏不需要的原始元素 */
                .tpc_content > .image-big, .tpc_content > font > .image-big, .image-big-text { display: none !important; }
                th[width="230"] { display: none !important; }

                @media (max-width: 768px) { .media-gallery { grid-template-columns: 1fr; } }
            `;
            document.head.appendChild(style);
        },

        // 2. 解析和处理内容，保留图文顺序
        processMainContent: function(contentEl) {
            const newContainer = document.createElement('div');
            newContainer.className = 'beautified-content';

            const parts = this.parseContent(contentEl);
            let textBuffer = '';
            let mediaBuffer = [];

            const flushText = () => {
                if (textBuffer.trim()) {
                    const textBlock = document.createElement('div');
                    textBlock.className = 'text-content';
                    textBlock.innerHTML = textBuffer.split(/<br\s*\/?>/gi)
                        .map(p => p.trim() ? `<p>${p.trim()}</p>` : '')
                        .join('');
                    newContainer.appendChild(textBlock);
                    textBuffer = '';
                }
            };

            const flushMedia = () => {
                if (mediaBuffer.length > 0) {
                    this.addMediaGallery(newContainer, mediaBuffer);
                    mediaBuffer = [];
                }
            };

            parts.forEach(part => {
                if (part.type === 'media') {
                    flushText(); // 遇到媒体，先处理完之前的文本
                    mediaBuffer.push(part.element);
                } else if (part.type === 'text') {
                    flushMedia(); // 遇到文本，先处理完之前的媒体
                    textBuffer += part.content + '<br>';
                }
            });

            flushText();  // 处理末尾剩余的文本或媒体
            flushMedia();

            // 清空原始内容并替换
            while (contentEl.firstChild) {
                contentEl.removeChild(contentEl.firstChild);
            }
            contentEl.appendChild(newContainer);
        },

        parseContent: function(rootNode) {
            const parts = [];
            const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null, false);
            let node;
            while (node = walker.nextNode()) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const img = (node.tagName === 'IMG') ? node : node.querySelector('img');
                    if (img && img.closest('#conttpc') === rootNode) {
                        parts.push({ type: 'media', element: img });
                        // 跳过这个图片容器的子节点
                        const childWalker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null, false);
                        while(childWalker.nextNode());
                    }
                } else if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent.trim();
                    if (text && node.parentNode.closest('#conttpc') === rootNode && !node.parentNode.closest('.beautified-content')) {
                       parts.push({ type: 'text', content: text });
                    }
                }
            }
            return this.deduplicateParts(parts);
        },

        deduplicateParts: function(parts) {
            const uniqueParts = [];
            const seenMedia = new Set();
            let lastText = null;

            for (const part of parts) {
                if (part.type === 'media') {
                    const src = part.element.getAttribute('ess-data') || part.element.src;
                    if (!seenMedia.has(src)) {
                        uniqueParts.push(part);
                        seenMedia.add(src);
                        lastText = null;
                    }
                } else if (part.type === 'text') {
                    // 避免重复添加相同的文本内容
                    if (part.content !== lastText) {
                       uniqueParts.push(part);
                       lastText = part.content;
                    }
                }
            }
            return uniqueParts;
        },


        // 3. 添加媒体画廊 (使用修复后的图片加载方式)
        addMediaGallery: function(container, mediaElements) {
            if (mediaElements.length === 0) return;

            const gallery = document.createElement('div');
            gallery.className = 'media-gallery';
            if (mediaElements.length === 1) gallery.classList.add('single-item');

            mediaElements.forEach(element => {
                const mediaContainer = document.createElement('div');
                mediaContainer.className = 'media-item';

                const placeholder = document.createElement('div');
                placeholder.className = 'image-loading';
                placeholder.textContent = '加载中...';
                mediaContainer.appendChild(placeholder);

                const newImg = document.createElement('img');
                // **关键修复**: 使用 ess-data 或 src 创建新的、干净的图片元素
                newImg.src = element.getAttribute('ess-data') || element.src;
                newImg.style.display = 'none';

                newImg.onload = () => {
                    placeholder.style.display = 'none';
                    newImg.style.display = 'block';
                };
                newImg.onerror = () => { placeholder.textContent = '图片加载失败'; };

                mediaContainer.appendChild(newImg);
                gallery.appendChild(mediaContainer);
            });
            container.appendChild(gallery);
        },

        // 4. 隐藏不需要的原始元素
        hideOriginalElements: function() {
            document.querySelectorAll('th[width="230"], .image-big, .image-big-text').forEach(el => {
                el.style.display = 'none';
            });
        },

        // 5. 提取用户信息
        extractAndDisplayUserInfo: function(contentEl) {
             const userInfoCol = document.querySelector('th[width="230"][rowspan="2"]');
             if (!userInfoCol || contentEl.querySelector('.user-info-bar')) return;

             const html = userInfoCol.innerHTML;
             const userInfo = {
                 username: html.match(/<b>([^<]+)<\/b>/)?.[1].trim() || 'N/A',
                 level: html.match(/級別：[^>]*>([^<]+)</)?.[1].trim() || 'N/A',
                 posts: html.match(/發帖：[^>]*>(\d+)</)?.[1] || 'N/A',
             };
             const userInfoBar = document.createElement('div');
             userInfoBar.className = 'user-info-bar';
             userInfoBar.innerHTML = `<span class="username">${userInfo.username}</span>` +
                                   `<span class="info-item">级别: ${userInfo.level}</span>` +
                                   `<span class="info-item">发帖: ${userInfo.posts}</span>`;
             contentEl.prepend(userInfoBar);
        },

        // 6. 观察动态内容
        observeDynamicContent: function() {
            const observer = new MutationObserver((mutations, obs) => {
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length > 0) {
                        const mainContent = document.querySelector('#conttpc');
                        if (mainContent && !mainContent.dataset.beautified) {
                            this.beautifyContent();
                            obs.disconnect(); // 找到并处理后停止观察
                            break;
                        }
                    }
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        },

        // 7. 辅助功能：回到顶部和弹窗
        addScrollToTopButton: function() {
            if (document.querySelector('.back-to-top-button')) return;
            const button = document.createElement('div');
            button.className = 'back-to-top-button';
            button.innerHTML = '↑';
            button.style.cssText = `
                position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; background: #007bff; color: white;
                border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;
                font-size: 20px; font-weight: bold; z-index: 9999; opacity: 0; visibility: hidden; transition: all 0.3s ease;
            `;
            button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
            window.addEventListener('scroll', () => {
                button.style.opacity = window.scrollY > 300 ? '1' : '0';
                button.style.visibility = window.scrollY > 300 ? 'visible' : 'hidden';
            });
            document.body.appendChild(button);
        },
    };

    T66Y_Beautifier.init();

})();