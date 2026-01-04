// ==UserScript==
// @name         全平台文章转Markdown工具
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  支持微信/知乎/简书等平台，提取文字图片并生成Markdown文件
// @author       mmmgc
// @match        https://mp.weixin.qq.com/s/*
// @match        https://zhuanlan.zhihu.com/p/*
// @match        https://www.jianshu.com/p/*
// @match        https://www.douban.com/note/*
// @match        https://weibo.com/*
// @match        https://www.toutiao.com/article/*
// @match        https://baijiahao.baidu.com/s*
// @match        https://dy.163.com/article/*
// @match        https://new.qq.com/rain/a/*
// @match        https://www.xiaohongshu.com/discovery/item/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537295/%E5%85%A8%E5%B9%B3%E5%8F%B0%E6%96%87%E7%AB%A0%E8%BD%ACMarkdown%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/537295/%E5%85%A8%E5%B9%B3%E5%8F%B0%E6%96%87%E7%AB%A0%E8%BD%ACMarkdown%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 平台配置中心
    const platformConfig = {
        weixin: {
            name: '微信公众号',
            titleSelector: '#activity-name',
            contentSelector: '#js_content',
            imageSelector: 'img[data-src]',
            imageProcessor: img => img.getAttribute('data-src')?.split('?')[0] || img.src
        },
        zhihu: {
            name: '知乎',
            titleSelector: 'h1.Post-Title, h1.ProfileHeader-title',
            contentSelector: 'div.Post-RichText, div.Post-RichTextContainer, div.ZH-RichText',
            imageSelector: 'img[data-original-src], img[src^="https://"], img[src^="//"]',
            imageProcessor: img => {
                let src = img.getAttribute('data-original-src') || img.src;
                src = src.replace('//', 'https://').split('?')[0];
                return src.startsWith('http') ? src : `https:${src}`;
            }
        },
        jianshu: {
            name: '简书',
            titleSelector: 'h1.title',
            contentSelector: 'div.article',
            imageSelector: 'img[src]',
            imageProcessor: img => img.src.split('?')[0]
        },
        douban: {
            name: '豆瓣',
            titleSelector: 'h1',
            contentSelector: 'div.note',
            imageSelector: 'img',
            imageProcessor: img => img.src
        },
        weibo: {
            name: '微博',
            titleSelector: 'h1[node-type="feed_list_title"]',
            contentSelector: 'div[node-type="feed_list_content"]',
            imageSelector: 'img[action-data]',
            imageProcessor: img => img.getAttribute('action-data')?.match(/src="(.*?)"/)?.[1] || img.src
        },
        toutiao: {
            name: '今日头条',
            titleSelector: 'h1.article-title',
            contentSelector: 'div.article-box',
            imageSelector: 'img',
            imageProcessor: img => img.src
        },
        baijiahao: {
            name: '百家号',
            titleSelector: 'h2.article-title',
            contentSelector: 'div.article-content',
            imageSelector: 'img',
            imageProcessor: img => img.src
        },
        dayu: {
            name: '大鱼号',
            titleSelector: 'h1.article-title',
            contentSelector: 'div.article-content',
            imageSelector: 'img',
            imageProcessor: img => img.src
        },
        qq: {
            name: '企鹅号',
            titleSelector: 'h1.article-title',
            contentSelector: 'div.article-content',
            imageSelector: 'img',
            imageProcessor: img => img.src
        },
        xiaohongshu: {
            name: '小红书',
            titleSelector: 'h1',
            contentSelector: 'div.note-content',
            imageSelector: 'img',
            imageProcessor: img => img.src
        }
    };

    // 平台检测引擎
    function detectCurrentPlatform() {
        const url = window.location.href;
        return Object.keys(platformConfig).find(platform =>
            new RegExp(platformConfig[platform].matchRule || platform).test(url)
        );
    }

    // 增强型内容提取（处理懒加载和动态内容）
    function ensureContentLoaded(platform) {
        const { contentSelector } = platformConfig[platform];
        const contentElement = document.querySelector(contentSelector);

        // 处理知乎的"点击展开"按钮
        if (platform === 'zhihu') {
            const expandButtons = document.querySelectorAll('button:has(span:contains("展开"))');
            expandButtons.forEach(btn => {
                if (btn.getBoundingClientRect().width > 0) {
                    btn.click();
                }
            });
        }

        // 处理其他平台的动态内容（可扩展）

        return contentElement;
    }

    // 生成安全文件名
    function generateSafeFilename(title) {
        return title
            .replace(/[\\/:*?"<>|]/g, '_') // 替换非法文件名字符
            .substring(0, 80) + '.md';     // 限制长度并添加扩展名
    }

    // 保存Markdown文件
    function saveMarkdownFile(content, filename) {
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    // 核心转换引擎
    function convertToMarkdown() {
        const platform = detectCurrentPlatform();
        if (!platform) return alert('不支持当前平台');

        const { name, titleSelector, contentSelector, imageSelector, imageProcessor } = platformConfig[platform];
        const titleElement = document.querySelector(titleSelector);
        const contentElement = ensureContentLoaded(platform);

        if (!titleElement || !contentElement) {
            return alert(`无法解析${name}文章，请检查页面结构`);
        }

        let markdown = `# ${titleElement.textContent.trim()}\n\n`;
        markdown += `> 来源：${name} | ${window.location.href}\n\n`;

        // 深度遍历内容元素
        function traverse(element) {
            if (element.nodeType === 1) { // 仅处理元素节点
                switch (element.tagName.toLowerCase()) {
                    case 'h1': case 'h2': case 'h3':
                        markdown += `${'#'.repeat(Number(element.tagName[1] || 1))} ${element.textContent.trim()}\n\n`;
                        break;
                    case 'p':
                        if (element.textContent.trim()) {
                            markdown += element.textContent.trim() + '\n\n';
                        }
                        break;
                    case 'img':
                        if (element.matches(imageSelector)) {
                            const alt = element.alt || '图片';
                            const src = imageProcessor(element);
                            markdown += `![${alt}](${src})\n\n`;
                        }
                        break;
                    case 'ul': case 'ol':
                        element.querySelectorAll('li').forEach((li, i) => {
                            markdown += `${element.tagName === 'ol' ? `${i+1}. ` : '- '}${li.textContent.trim()}\n`;
                        });
                        markdown += '\n';
                        break;
                    case 'blockquote':
                        markdown += `> ${element.textContent.trim().replace(/\n/g, '\n> ')}\n\n`;
                        break;
                    case 'hr':
                        markdown += '---\n\n';
                        break;
                    case 'pre':
                        markdown += '```\n' + (element.querySelector('code')?.textContent || element.textContent).trim() + '\n```\n\n';
                        break;
                    // 知乎特化处理
                    case 'div':
                        if (platform === 'zhihu' && element.classList.contains('RichText')) {
                            element.children.forEach(child => traverse(child));
                        }
                        break;
                    // 处理知乎公式
                    case 'span':
                        if (platform === 'zhihu' && element.classList.contains('MathJax_Preview')) {
                            markdown += `$${element.textContent.trim()}$\n\n`;
                        }
                        break;
                }
                // 递归子元素
                element.children.forEach(child => traverse(child));
            }
        }

        traverse(contentElement);

        // 复制到剪贴板
        const cleanMarkdown = markdown.replace(/\n{3,}/g, '\n\n'); // 压缩空行

        // 生成安全文件名并保存文件
        const filename = generateSafeFilename(titleElement.textContent.trim());
        saveMarkdownFile(cleanMarkdown, filename);

        alert(`已成功导出Markdown文件：${filename}`);
    }

    // 界面初始化
    function injectConversionButton() {
        const btn = document.createElement('button');
        btn.style.cssText = `
            position: fixed; right: 20px; top: 20px; z-index: 9999;
            padding: 12px 24px; background: #2196F3; color: white;
            border: none; border-radius: 4px; cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        `;
        btn.textContent = '💾 转换为Markdown';
        btn.addEventListener('click', convertToMarkdown);
        document.body.appendChild(btn);
    }

    // 入口函数
    window.addEventListener('load', () => {
        const platform = detectCurrentPlatform();
        if (platform) injectConversionButton();
    });
})();