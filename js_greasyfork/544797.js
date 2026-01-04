// ==UserScript==
// @name         QQ阅读Markdown下载器
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动解析QQ阅读页面内容并下载为Markdown文件
// @author       Ningest
// @match        https://book.qq.com/book-read/*
// @grant        GM_download
// @grant        GM_setClipboard
// @require      https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544797/QQ%E9%98%85%E8%AF%BBMarkdown%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/544797/QQ%E9%98%85%E8%AF%BBMarkdown%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局变量
    let downloadButton = null;
    let isProcessing = false;

    // 主函数
    function init() {
        console.log('QQ阅读Markdown下载器: 开始初始化');
        
        if (!isQQReadPage()) {
            console.log('QQ阅读Markdown下载器: 不是QQ阅读页面或未找到article元素');
            return;
        }

        if (!checkCompatibility()) {
            console.warn('QQ阅读Markdown下载器: 浏览器兼容性检查失败');
            return;
        }

        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createUI);
        } else {
            createUI();
        }
    }

    // 检测是否为QQ阅读章节页面
    function isQQReadPage() {
        const isQQRead = window.location.href.includes('book.qq.com/book-read/');
        const hasArticle = document.getElementById('article') !== null;
        console.log('QQ阅读Markdown下载器: 页面检测结果:', { isQQRead, hasArticle });
        return isQQRead && hasArticle;
    }

    // 兼容性检查
    function checkCompatibility() {
        const requiredFeatures = [
            'Blob'
        ];
        
        // 检查URL API
        const hasURLAPI = typeof window.URL !== 'undefined' && 
                         typeof window.URL.createObjectURL === 'function' && 
                         typeof window.URL.revokeObjectURL === 'function';
        
        const missingFeatures = requiredFeatures.filter(feature => !window[feature]);
        
        if (missingFeatures.length > 0) {
            console.warn('QQ阅读Markdown下载器: 浏览器不支持以下功能:', missingFeatures);
            return false;
        }
        
        if (!hasURLAPI) {
            console.warn('QQ阅读Markdown下载器: 浏览器不支持URL API，将使用备用下载方案');
            // 不返回false，而是继续使用备用方案
        }
        
        return true;
    }

    // 创建用户界面
    function createUI() {
        console.log('QQ阅读Markdown下载器: 开始创建UI');
        
        if (downloadButton) {
            console.log('QQ阅读Markdown下载器: 按钮已存在，跳过创建');
            return; // 避免重复创建
        }

        downloadButton = createDownloadButton();
        document.body.appendChild(downloadButton);
        console.log('QQ阅读Markdown下载器: 按钮已添加到页面');

        // 添加CSS动画
        addCSS();
    }

    // 创建下载按钮
    function createDownloadButton() {
        const button = document.createElement('button');
        button.textContent = '下载Markdown';
        button.id = 'qq-read-markdown-downloader-btn';
        button.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 999999 !important;
            background: #007bff !important;
            color: white !important;
            border: none !important;
            padding: 10px 20px !important;
            border-radius: 5px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
            transition: all 0.3s ease !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        `;
        
        button.addEventListener('click', handleDownload);
        button.addEventListener('mouseenter', function() {
            this.style.background = '#0056b3 !important';
            this.style.transform = 'translateY(-2px)';
        });
        button.addEventListener('mouseleave', function() {
            this.style.background = '#007bff !important';
            this.style.transform = 'translateY(0)';
        });
        
        return button;
    }

    // 添加CSS样式
    function addCSS() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
            
            #qq-read-markdown-downloader-btn:hover {
                background: #0056b3 !important;
                transform: translateY(-2px) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 处理下载
    async function handleDownload() {
        if (isProcessing) {
            showNotification('正在处理中，请稍候...', 'info');
            return;
        }

        isProcessing = true;
        updateButtonState(true);

        try {
            const content = parseContent();
            if (!content) {
                throw new Error('无法解析页面内容');
            }

            const markdownContent = convertToMarkdown(content);
            const filename = generateFilename(content.metadata, content.title);
            
            downloadMarkdown(markdownContent, filename);
            showNotification('Markdown文件下载成功！', 'success');
            
        } catch (error) {
            handleError(error, 'handleDownload');
        } finally {
            isProcessing = false;
            updateButtonState(false);
        }
    }

    // 更新按钮状态
    function updateButtonState(processing) {
        if (downloadButton) {
            downloadButton.textContent = processing ? '处理中...' : '下载Markdown';
            downloadButton.disabled = processing;
            downloadButton.style.opacity = processing ? '0.7' : '1';
        }
    }

    // 解析页面内容
    function parseContent() {
        const article = document.getElementById('article');
        if (!article) {
            throw new Error('未找到文章内容容器');
        }
        
        return {
            title: extractTitle(),
            content: extractContent(article),
            metadata: extractMetadata()
        };
    }

    // 提取章节标题
    function extractTitle() {
        // 优先从h2.bt2提取（新版本）
        let titleElement = document.querySelector('#article h2.bt2');
        if (titleElement) {
            // 移除图片元素，只保留文本
            const clone = titleElement.cloneNode(true);
            const images = clone.querySelectorAll('img');
            images.forEach(img => img.remove());
            return clone.textContent.trim();
        }
        
        // 备用方案：从h3.bt3提取（旧版本）
        titleElement = document.querySelector('#article h3.bt3');
        if (titleElement) {
            return titleElement.textContent.trim();
        }
        
        // 最后备用方案：从页面标题提取
        const pageTitle = document.title;
        const match = pageTitle.match(/^(.+?)_(.+?)在线阅读/);
        return match ? match[2] : pageTitle;
    }

    // 提取正文内容
    function extractContent(articleElement) {
        // 克隆元素避免修改原DOM
        const clone = articleElement.cloneNode(true);
        
        // 移除不需要的元素
        const elementsToRemove = clone.querySelectorAll('script, style, .ad, .recommend, .footer, .rec-book');
        elementsToRemove.forEach(el => el.remove());
        
        return clone.innerHTML;
    }

    // 提取元数据
    function extractMetadata() {
        const metadata = {};
        
        // 提取书名
        const bookTitle = document.querySelector('.book-title');
        if (bookTitle) {
            metadata.bookTitle = bookTitle.textContent.trim();
        }
        
        // 提取作者（支持新版本的a标签和旧版本的span标签）
        let author = document.querySelector('.info li:nth-child(2) a');
        if (!author) {
            author = document.querySelector('.info li:nth-child(2) span');
        }
        if (author) {
            metadata.author = author.textContent.trim();
        }
        
        // 提取字数
        const wordCount = document.querySelector('.info li:nth-child(3) span');
        if (wordCount) {
            metadata.wordCount = wordCount.textContent.trim();
        }
        
        // 提取更新时间
        const updateTime = document.querySelector('.updateTime');
        if (updateTime) {
            metadata.updateTime = updateTime.textContent.trim();
        }
        
        return metadata;
    }

    // 转换为Markdown
    function convertToMarkdown(content) {
        const turndownService = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced',
            bulletListMarker: '-'
        });

        // 设置自定义规则
        setupTurndownRules(turndownService);

        // 转换HTML内容
        let markdown = turndownService.turndown(content.content);

        // 添加标题和元数据
        const fullMarkdown = generateFullMarkdown(content.title, content.metadata, markdown);

        return fullMarkdown;
    }

    // 设置Turndown规则
    function setupTurndownRules(turndownService) {
        // 代码块规则
        turndownService.addRule('codeBlocks', {
            filter: ['pre'],
            replacement: function(content, node) {
                const code = node.querySelector('code');
                if (!code) return content;
                
                const language = detectLanguage(code.textContent);
                return `\n\`\`\`${language}\n${code.textContent}\n\`\`\`\n`;
            }
        });

        // 代码清单标题规则
        turndownService.addRule('codeListTitle', {
            filter: function(node) {
                return node.nodeType === 1 && 
                       node.className === 'biaoti' && 
                       node.textContent.includes('代码清单');
            },
            replacement: function(content) {
                return `\n**${content}**\n`;
            }
        });

        // 正文段落规则
        turndownService.addRule('paragraphs', {
            filter: ['p'],
            replacement: function(content, node) {
                if (node.className === 'zw') {
                    return `\n${content}\n`;
                }
                return content;
            }
        });

        // 标题规则（支持h2.bt2和h3.bt3）
        turndownService.addRule('headings', {
            filter: ['h2', 'h3'],
            replacement: function(content, node) {
                if (node.className === 'bt2' || node.className === 'bt3') {
                    return `\n# ${content}\n`;
                }
                return `\n### ${content}\n`;
            }
        });
    }

    // 检测代码语言
    function detectLanguage(codeContent) {
        const firstLine = codeContent.split('\n')[0].toLowerCase();
        
        if (firstLine.includes('package') || firstLine.includes('import') || firstLine.includes('public class')) {
            return 'java';
        }
        if (firstLine.includes('create table') || firstLine.includes('select') || firstLine.includes('insert')) {
            return 'sql';
        }
        if (firstLine.includes('<?xml') || firstLine.includes('<!DOCTYPE')) {
            return 'xml';
        }
        if (firstLine.includes('function') || firstLine.includes('var ') || firstLine.includes('const ')) {
            return 'javascript';
        }
        if (firstLine.includes('import ') && firstLine.includes('from ')) {
            return 'javascript';
        }
        if (firstLine.includes('class ') && firstLine.includes('{')) {
            return 'java';
        }
        
        return '';
    }

    // 生成完整的Markdown内容
    function generateFullMarkdown(title, metadata, content) {
        let markdown = `# ${title}\n\n`;

        // 添加书籍信息
        if (metadata.bookTitle || metadata.author || metadata.wordCount || metadata.updateTime) {
            markdown += '**书籍信息：**\n';
            if (metadata.bookTitle) {
                markdown += `- 书名：${metadata.bookTitle}\n`;
            }
            if (metadata.author) {
                markdown += `- 作者：${metadata.author}\n`;
            }
            if (metadata.wordCount) {
                markdown += `- 字数：${metadata.wordCount}\n`;
            }
            if (metadata.updateTime) {
                markdown += `- 更新时间：${metadata.updateTime}\n`;
            }
            markdown += '\n---\n\n';
        }

        // 添加正文内容
        markdown += '## 正文内容\n\n';
        markdown += content;

        return markdown;
    }

    // 生成文件名
    function generateFilename(metadata, title) {
        const bookTitle = metadata.bookTitle || '未知书籍';
        const chapterTitle = title || '未知章节';
        const timestamp = new Date().toISOString().slice(0, 10);
        
        // 清理文件名中的非法字符
        const cleanBookTitle = bookTitle.replace(/[<>:"/\\|?*]/g, '');
        const cleanChapterTitle = chapterTitle.replace(/[<>:"/\\|?*]/g, '');
        
        return `${cleanBookTitle}_${cleanChapterTitle}_${timestamp}.md`;
    }

    // 下载Markdown文件
    function downloadMarkdown(markdownContent, filename) {
        // 检查是否支持URL API
        const hasURLAPI = typeof window.URL !== 'undefined' && 
                         typeof window.URL.createObjectURL === 'function' && 
                         typeof window.URL.revokeObjectURL === 'function';
        
        if (hasURLAPI) {
            // 使用URL API下载
            const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            
            document.body.appendChild(a);
            a.click();
            
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            // 备用方案：使用data URL
            try {
                const dataUrl = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(markdownContent);
                const a = document.createElement('a');
                a.href = dataUrl;
                a.download = filename;
                a.style.display = 'none';
                
                document.body.appendChild(a);
                a.click();
                
                document.body.removeChild(a);
            } catch (error) {
                // 最后的备用方案：复制到剪贴板并提示用户
                console.warn('QQ阅读Markdown下载器: 无法下载文件，将复制内容到剪贴板');
                if (typeof GM_setClipboard !== 'undefined') {
                    GM_setClipboard(markdownContent);
                    showNotification('内容已复制到剪贴板，请手动保存为.md文件', 'info');
                } else {
                    // 如果连GM_setClipboard都不可用，则显示内容让用户手动复制
                    showNotification('无法下载文件，请查看控制台输出', 'error');
                    console.log('Markdown内容:', markdownContent);
                }
            }
        }
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        // 移除已存在的通知
        const existingNotification = document.querySelector('.qq-read-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'qq-read-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 10001;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
            color: white;
            padding: 12px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 3000);
    }

    // 错误处理
    function handleError(error, context) {
        console.error(`QQ阅读Markdown下载器错误 [${context}]:`, error);
        showNotification(`下载失败: ${error.message}`, 'error');
    }

    // 安全执行函数
    function safeExecute(func, context) {
        try {
            return func();
        } catch (error) {
            handleError(error, context);
            return null;
        }
    }

    // 启动插件
    init();

})(); 