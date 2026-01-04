// ==UserScript==
// @name         马同学图解数学(markdown)
// @namespace    https://www.djxx.online
// @version      2.4
// @description  将马同学图解数学提取出markdown, 作为本地保存, 请先进行购买
// @author       小小小韩
// @license      LGPLv3
// @match        https://www.matongxue.com/lessons/*/parts/*
// @grant        GM_setClipboard
// @supportURL   https://greasyfork.org/zh-CN/scripts/499887
// @icon         https://matongxue.oss-cn-hangzhou.aliyuncs.com/static/favicon.ico

// @downloadURL https://update.greasyfork.org/scripts/499887/%E9%A9%AC%E5%90%8C%E5%AD%A6%E5%9B%BE%E8%A7%A3%E6%95%B0%E5%AD%A6%28markdown%29.user.js
// @updateURL https://update.greasyfork.org/scripts/499887/%E9%A9%AC%E5%90%8C%E5%AD%A6%E5%9B%BE%E8%A7%A3%E6%95%B0%E5%AD%A6%28markdown%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addButton() {
        const button = document.createElement('button');
        button.textContent = '转换并复制Markdown';
        button.style.position = 'fixed';
        button.style.top = '53px';
        button.style.left = '20px';
        button.style.padding = '10px 20px';
        button.style.zIndex = '1000';
        button.style.cursor = 'pointer';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        document.body.appendChild(button);

        setupButtonBehavior(button);
    }

    function setupButtonBehavior(element) {
        let pressTimer;
        let isDragging = false;
        let startX, startY;

        element.addEventListener('mousedown', function(event) {
            startX = event.clientX;
            startY = event.clientY;

            pressTimer = setTimeout(function() {
                isDragging = true;
                element.style.cursor = 'move';
            }, 200); // 200ms后判定为长按

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(event) {
            if (isDragging) {
                const deltaX = event.clientX - startX;
                const deltaY = event.clientY - startY;
                const newLeft = element.offsetLeft + deltaX;
                const newTop = element.offsetTop + deltaY;
                element.style.left = newLeft + 'px';
                element.style.top = newTop + 'px';
                startX = event.clientX;
                startY = event.clientY;
            } else if (Math.abs(event.clientX - startX) > 5 || Math.abs(event.clientY - startY) > 5) {
                // 如果移动超过5px，取消短按计时器
                clearTimeout(pressTimer);
            }
        }

        function onMouseUp(event) {
            clearTimeout(pressTimer);
            if (!isDragging) {
                processContent(); // 短按执行功能
            }
            isDragging = false;
            element.style.cursor = 'pointer';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        // 防止拖动时选中文本
        element.addEventListener('dragstart', function(event) {
            event.preventDefault();
        });
    }

    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
    @keyframes slideInUp {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    .notification {
        animation: slideInUp 0.3s ease-out;
        transition: all 0.3s ease;
    }
    .fade-out {
        animation: fadeOut 0.3s ease-out forwards;
    }
    #notification-container {
        display: flex;
        flex-direction: column-reverse;
        align-items: flex-end;
    }
`;
    document.head.appendChild(style);

    let notificationQueue = [];
    let isProcessingQueue = false;

    // 信息框
    function showNotification(message) {
        notificationQueue.push(message);
        if (!isProcessingQueue) {
            processNotificationQueue();
        }
    }

    function processNotificationQueue() {
        if (notificationQueue.length === 0) {
            isProcessingQueue = false;
            return;
        }

        isProcessingQueue = true;
        const message = notificationQueue.shift();

        const container = document.querySelector('#notification-container') || (() => {
            const newContainer = document.createElement('div');
            newContainer.id = 'notification-container';
            newContainer.style.position = 'fixed';
            newContainer.style.right = '20px';
            newContainer.style.bottom = '20px';
            newContainer.style.zIndex = '1001';
            document.body.appendChild(newContainer);
            return newContainer;
        })();

        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = 'notification';
        notification.style.backgroundColor = 'rgba(76, 175, 80, 0.6)';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.5)';
        notification.style.marginTop = '10px';
        notification.style.transition = 'all 0.3s ease';

        container.appendChild(notification);

        // 添加消失动画
        setTimeout(() => {
            notification.classList.add('fade-out');
            notification.addEventListener('animationend', () => {
                notification.remove();
            });
        }, 2000); // 信息框存在2秒

        // 0.2秒后处理下一个通知
        setTimeout(processNotificationQueue, 200);
    }

    // 清洗不规则的url
    function extractURLFromStyle(styleStr) {
        const urlMatch = styleStr.match(/url\(["']?(.+?)["']?\)/);
        return urlMatch ? urlMatch[1].split('?')[0] : null;
    }


    // 提取信息转为markdown的函数
    function processContent() {

        // iframe视频处理函数
        function processIframeVideo(videoUrl) {
            //<iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="${videoUrl}" frameborder="0" allowfullscreen></iframe>
            //<div style="position: relative; width: 100%; padding-bottom: 56.25%;">
            //<iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="${videoUrl}" frameborder="0" allowfullscreen></iframe>
            //</div>
            //<iframe src="${videoUrl}" width="560" height="315" frameborder="0" allowfullscreen></iframe>
            return `
<iframe style="width: 100%; aspect-ratio: 16 / 9; border: none; background-color: white;" src="${videoUrl}" allowfullscreen></iframe>
`;
        }

        // video标签视频处理函数
        function processVideoTag(videoUrl) {
            return `
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; background-color: white;">
    <video style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" controls>
        <source src="${videoUrl}" type="video/mp4">
        Your browser does not support the video tag.
    </video>
</div>
`;
        }
        try {
            const tabIndexElements = document.querySelectorAll('[tabindex="0"]');
            let markdown = '';
            Array.from(tabIndexElements).forEach(el => {
                const cardBody = el.querySelector('.ant-card-body');
                if (!cardBody) {
                    return;
                }
                showNotification("开始处理 .ant-card-body 内容。");

                // 二级标题
                const titleElement = document.querySelector('.ant-dropdown-trigger');
                const titleText = titleElement ? titleElement.textContent.trim() : showNotification("标题未找到");

                markdown += `## ${titleText}\n`;

                const elements = cardBody.querySelectorAll('video, img:not(.ma-tex-img), section, .xgplayer-poster, p:not(.name), ul.description, ma-quote, blockquote, .ma-card');

                Array.from(elements).forEach(element => {
                    // 视频
                    if (element.closest('.xgplayer-playbackrate')) return;
                    if (element.tagName.toLowerCase() === 'video' &&
                        !element.classList.contains('ma-quote') && element.tagName.toLowerCase() !== 'blockquote' &&
                        !element.closest('.ma-card')) {
                        const videoUrl = element.getAttribute('src') || extractURLFromStyle(element.style.backgroundImage);
                        showNotification('存在视频')
                        markdown += "\n"+processIframeVideo(videoUrl)+"\n";
                    } else if (element.classList.contains('xgplayer-poster')) {
                        const backgroundImage = element.style.backgroundImage;
                        const videoUrl = extractURLFromStyle(backgroundImage);
                        if (videoUrl) {
                            showNotification('存在视频')
                            markdown += "\n"+processVideoTag(videoUrl)+"\n";
                        }
                    }

                    // 图片
                    else if ((element.tagName.toLowerCase() === 'img' || element.classList.contains('ma-image-img')) &&
                             !element.classList.contains('ma-quote') &&
                             !element.closest('.ma-quote') &&
                             !element.closest('blockquote') &&
                             !element.closest('.ma-card')) {
                        const imageUrl = element.src.split('?')[0];
                        showNotification('存在图片')
                        markdown += `\n![图片1](${imageUrl})\n\n`;
                    }

                    // 文本
                    else if (element.tagName.toLowerCase() === 'p' && !element.classList.contains('name') &&
                             !element.classList.contains('ma-quote') && element.tagName.toLowerCase() !== 'blockquote' &&
                             !element.closest('.ma-card')&& !(element.tagName.toLowerCase() === 'ul' && element.classList.contains('description'))&&!element.closest('.description')) {
                        let content = element.innerHTML;
                        content = processLatexInContent(content);

                        if (element.classList.contains('caption')) {
                            markdown += `↑ **${content}**\n\n\n`;
                        } else {
                            markdown += `${content}\n\n`;
                        }
                    }

                    // 三级标题
                    else if (element.tagName.toLowerCase() === 'section') {
                        const strongElement = element.querySelector('strong');
                        if (strongElement) {
                            let titleContent = processLatexInContent(strongElement.outerHTML);
                            titleContent = titleContent.replace(/<[^>]+>/g, '').trim();
                            // 将行间公式转换为行内公式
                            titleContent = titleContent.replace(/\$\$(.*?)\$\$/g, '$$1$');
                            markdown += `\n### ${titleContent}\n`;
                        }
                    }

                    else if (element.classList.contains('ma-quote') || element.tagName.toLowerCase() === 'blockquote' ||
                             (element.tagName.toLowerCase() === 'ul' && element.classList.contains('description') && !element.closest('.ma-card')) ||
                             element.classList.contains('ma-card')) {
                        let content = [];

                        // 处理ma-card
                        if (element.classList.contains('ma-card')) {
                            showNotification('处理ma-card');
                            let cardContent = processLatexInContent(element.outerHTML);
                            cardContent = cardContent.replace(/<b[^>]*>(.*?)<\/b>/g, '**$1** '); // 保留粗体

                            // 处理卡片内的段落和列表
                            cardContent = cardContent.replace(/<p class="par">([\s\S]*?)<\/p>/g, (match, p1) => {
                                return '\n' + p1.trim() + '\n';
                            });
                            cardContent = cardContent.replace(/<ul class="description">([\s\S]*?)<\/ul>/g, (match, p1) => {
                                return '\n' + p1.replace(/<li[^>]*>[\s\S]*?<div>([\s\S]*?)<\/div><\/li>/g, (m, content) => {
                                    return '- ' + content.trim() + '\n';
                                });
                            });

                            // 处理ma-image-img
                            cardContent = cardContent.replace(/<img[^>]*class="ma-image-img"[^>]*src="([^"]+)"[^>]*>/g, (match, src) => {
                                return `\n![图片2](${src.split('?')[0]})\n`;
                            });

                            // 处理caption
                            cardContent = cardContent.replace(/<p[^>]*class="caption"[^>]*>([\s\S]*?)<\/p>/g, (match, captionContent) => {
                                return `\n**${captionContent.trim()}**\n\n\n`;
                            });

                            // 处理视频
                            cardContent = cardContent.replace(/<video[^>]*src="([^"]+)"[^>]*>[\s\S]*?<\/video>/g, (match, src) => {
                                showNotification('存在引用视频');
                                return "\n"+processIframeVideo(src);
                            });
                            cardContent = cardContent.replace(/<div[^>]*class="xgplayer-poster"[^>]*style="[^"]*background-image:\s*url\(([^)]+)\)[^"]*"[^>]*>[\s\S]*?<\/div>/g, (match, src) => {
                                const videoUrl = extractURLFromStyle(`url(${src})`);
                                return "\n"+processVideoTag(videoUrl);
                            });


                            //cardContent = cardContent.replace(/<(?!\/?div|\/?iframe|\/?video|\/?source|\/?img)[^>]+>/g, '');
                            //content = cardContent.split('\n').map(line => line.trim()).filter(Boolean).map(line => '> ' + line);
                            cardContent = cardContent
                            // 移除特定的空div结构
                                .replace(/<\/div><div class="ma-python"><div class="ant-card ma-python-output ant-card-small"[^>]*><div class="ant-card-body"[^>]*><div class="ant-card ma-python-output-content small-card-actions ant-card-small"><div class="ant-card-body"[^>]*><\/div><\/div><\/div><\/div><\/div>/g, '')
                            // 移除figure相关的空div
                                .replace(/<div class="figure"><div class="ma-image-row">/g, '')
                            // 移除所有其他HTML标签，除了iframe、video、source和img
                                .replace(/<(?!\/?(iframe|video|source|img)(?:\s[^>]*)?>)[^>]+>/g, '');

                            content = cardContent.split('\n').map(line => line.trim()).filter(Boolean).map(line => '> ' + line);
                            //cardContent = cardContent.replace(/<(?!\/?video|\/?source|\/?img)[^>]+>/g, '');
                            //content = cardContent.split('\n').map(line => line.trim()).filter(Boolean).map(line => '> ' + line);
                        }


                        // 纯引用或引用+无序列表
                        else if (element.classList.contains('ma-quote') || element.tagName.toLowerCase() === 'blockquote') {
                            showNotification('处理引用或卡片信息');
                            let quoteContent = processLatexInContent(element.outerHTML);
                            quoteContent = quoteContent.replace(/<b[^>]*>(.*?)<\/b>/g, '**$1** ');
                            quoteContent = quoteContent.replace(/<\/?(p|div)[^>]*>/g, '\n');

                            // 处理内部的无序列表
                            let hasInnerList = /<ul[^>]*>/.test(quoteContent);
                            quoteContent = quoteContent.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/g, (match, p1) => {
                                return '\n' + p1.replace(/<li[^>]*>[\s\S]*?<div>([\s\S]*?)<\/div><\/li>/g, (m, content) => {
                                    return '- ' + content.trim() + '\n';
                                });
                            });

                            quoteContent = quoteContent.replace(/<[^>]+>/g, '');
                            content = quoteContent.split('\n').map(line => line.trim()).filter(Boolean);

                            if (hasInnerList) {
                                // 引用+无序列表
                                showNotification('处理引用+无序列表');
                                content = content.map(line => {
                                    if (line.startsWith('-')) {
                                        return '> ' + line;
                                    } else {
                                        return '> ' + line + '\n>';
                                    }
                                });
                            } else {
                                // 纯引用
                                showNotification('处理纯引用');
                                content = content.map(line => '> ' + line);
                            }
                        }
                        // 纯无序列表
                        else if (element.tagName.toLowerCase() === 'ul' && element.classList.contains('description') &&
                                 !element.classList.contains('ma-quote') && element.tagName.toLowerCase() !== 'blockquote' &&
                                 !element.closest('.ma-card')) {
                            showNotification('处理纯无序列表');
                            let listContent = processLatexInContent(element.outerHTML);
                            listContent = listContent.replace(/<li[^>]*>[\s\S]*?<div>([\s\S]*?)<\/div><\/li>/g, (m, content) => {
                                return '- ' + content.trim() + '\n';
                            });
                            listContent = listContent.replace(/<[^>]+>/g, ''); // 移除其他所有HTML标签
                            content = listContent.split('\n').map(line => line.trim()).filter(Boolean);
                        }

                        if (content.length > 0) {
                            markdown += content.join('\n') + '\n\n';
                        }
                    }
                });
            });
            // 最后统一替换 &amp; 为 &
            markdown = markdown.replace(/&amp;/g, '&');
            markdown = markdown.replace(/&lt;/g, '＜');
            markdown = markdown.replace(/&gt;/g, '＞');
            markdown = markdown.replace(/&nbsp;/g, '');

            GM_setClipboard(markdown);
            showNotification('Markdown内容已复制到剪贴板。');
        } catch (error) {
            console.error('错误:', error);
            showNotification('处理内容时出错。请查看控制台了解详情。');
        }
    }



    function processLatexInContent(content) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');

        // 处理 img.ma-tex-img（行内公式）
        const texImgs = doc.querySelectorAll('img.ma-tex-img');
        texImgs.forEach(img => {
            let latex = img.getAttribute('alt');
            latex = decodeHTMLEntities(latex);
            const latexMd = `$${latex}$`;
            img.outerHTML = latexMd;
        });

        // 处理 span.ma-tex-span（行间公式）
        const texSpans = doc.querySelectorAll('span.ma-tex-span');
        texSpans.forEach(span => {
            let latex = span.innerHTML.trim();
            // 移除开头的 $ 和结尾的 $
            latex = latex.replace(/^\$\s*/, '').replace(/\s*\$$/, '');
            // 解码 HTML 实体
            latex = decodeHTMLEntities(latex);
            // 移除所有换行符和多余的空格
            latex = latex.replace(/\s+/g, ' ').trim();
            const latexMd = `$$${latex}$$`;
            span.outerHTML = latexMd;
        });

        return doc.body.innerHTML;
    }

    // 辅助函数：解码 HTML 实体
    function decodeHTMLEntities(text) {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }
    // 加载逻辑
    window.addEventListener('load', addButton);
})();
