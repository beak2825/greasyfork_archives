// ==UserScript==
// @name         知乎收藏夹批量导出为MarkDown文档
// @namespace    https://github.com/zfeny
// @version      1.0.1
// @description  用于批量将知乎收藏夹全部页面导出为独立的MarkDown文档，支持段落、图片、视频、外链、引用和加粗文本转换。
// @author       ZFeny
// @license      MIT
// @match        https://www.zhihu.com/collection/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/521783/%E7%9F%A5%E4%B9%8E%E6%94%B6%E8%97%8F%E5%A4%B9%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BA%E4%B8%BAMarkDown%E6%96%87%E6%A1%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/521783/%E7%9F%A5%E4%B9%8E%E6%94%B6%E8%97%8F%E5%A4%B9%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BA%E4%B8%BAMarkDown%E6%96%87%E6%A1%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const myCollectionExport = {
        init: async function() {
            const exportButton = document.createElement('button');
            exportButton.textContent = '导出为Markdown';
            exportButton.style.position = 'fixed';
            exportButton.style.top = '10px';
            exportButton.style.right = '10px';
            exportButton.style.zIndex = '1000';
            exportButton.style.padding = '10px';
            exportButton.style.backgroundColor = '#2cbe60';
            exportButton.style.color = 'white';
            exportButton.style.borderRadius = '5px';
            document.body.appendChild(exportButton);

            exportButton.onclick = async () => {
                const pathname = location.pathname;
                const matched = pathname.match(/(?<=\/collection\/)\d+/);
                const collectionId = matched ? matched[0] : "";

                if (!collectionId) return;

                // 获取收藏夹名称
                const collectionTitleElement = document.querySelector('.CollectionDetailPageHeader-title');
                let collectionTitle = collectionTitleElement ? collectionTitleElement.innerText.trim() : '知乎收藏夹';
                collectionTitle = collectionTitle.replace(/生成PDF\s*仅对当前页内容进行导出/g, '').trim();
                console.log(`Collection title after replacement: ${collectionTitle}`);

                // 获取收藏夹总页数
                const totalPagesElement = document.querySelectorAll('.Pagination button:not(.PaginationButton--ellipsis)');
                console.log(`Total pages elements:`, totalPagesElement);
                const totalPages = totalPagesElement.length > 0 ? Number(totalPagesElement[totalPagesElement.length - 2].innerText) : 1;
                console.log(`Total pages: ${totalPages}`);

                let collectionsMarkdown = [];
                let totalItems = 0;

                for (let page = 1; page <= totalPages; page++) {
                    console.log(`Fetching page ${page}`);
                    const offset = 20 * (page - 1);
                    const fetchHeaders = { /* 可根据需要自定义请求头 */ };
                    const response = await fetch(`/api/v4/collections/${collectionId}/items?offset=${offset}&limit=20`, {
                        method: "GET",
                        headers: new Headers(fetchHeaders)
                    });
                    const res = await response.json();
                    console.log(`Page ${page} response received with ${res.data.length} items`);

                    const pageMarkdown = (res.data || []).map(item => {
                        const { type, url, question, content, title } = item.content;
                        let markdownContent = "";

                        switch (type) {
                            case "zvideo":
                                markdownContent = `# 视频：${title}\n[视频链接](${url})\n`;
                                break;
                            case "answer":
                            case "article":
                            default:
                                markdownContent = `# ${title || (question ? question.title : '')}\n[内容链接](${url})\n\n${this.convertHtmlToMarkdown(content)}\n`;
                                break;
                        }
                        return markdownContent;
                    });

                    totalItems += pageMarkdown.length;
                    collectionsMarkdown = collectionsMarkdown.concat(pageMarkdown);
                }

                // 生成Markdown内容
                const markdownContent = collectionsMarkdown.join("\n");
                console.log(`Total items: ${totalItems}`);
                console.log(`Generated Markdown content length: ${markdownContent.length}`);

                // 创建下载链接
                const blob = new Blob([markdownContent], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const fileName = `Zhihu/${collectionTitle}_${totalItems}.md`;
                console.log(`Generated file name: ${fileName}`);
                a.download = fileName;
                a.click(); // 触发下载
                URL.revokeObjectURL(url); // 释放Blob URL
            };
        },
        /**
         * 将HTML内容转换为Markdown内容
         * @param {string} html HTML字符串
         * @returns {string} 转换后的Markdown字符串
         */
        convertHtmlToMarkdown: function(html) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            function parseNode(node, level = 1) {
                const textContent = node.textContent.trim();
                if (node.nodeType === Node.TEXT_NODE) {
                    return textContent;
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const tag = node.tagName.toLowerCase();
                    if (tag === 'p') {
                        return Array.from(node.childNodes).map(child => parseNode(child, level)).join('');
                    } else if (tag === 'img') {
                        const src = node.getAttribute('data-original') || node.src;
                        return `![图片描述](${src})`;
                    } else if (tag === 'b' || tag === 'strong') {
                        return `**${textContent}**`;
                    } else if (tag === 'blockquote') {
                        return `> ${Array.from(node.childNodes).map(child => parseNode(child, level)).join('').replace(/\n/g, '\n> ')}`;
                    } else if (tag === 'a') {
                        return `[${textContent}](${node.href})`;
                    } else if (tag === 'ul' || tag === 'ol') {
                        const items = Array.from(node.children).map(child => `- ${parseNode(child, level)}`);
                        return items.join('\n');
                    } else if (tag === 'li') {
                        return textContent;
                    } else if (tag.startsWith('h') && tag.length === 2 && !isNaN(tag[1])) {
                        const newLevel = Math.min(level + 1, 6);
                        return `${'#'.repeat(newLevel)} ${textContent}`;
                    } else if (tag === 'figure') {
                        const imgNode = node.querySelector('img');
                        if (imgNode) {
                            const src = imgNode.getAttribute('data-original') || imgNode.src;
                            return `![图片描述](${src})`;
                        }
                    } else if (tag === 'br') {
                        return '\n';
                    }
                }
                return '';
            }

            const elements = Array.from(tempDiv.childNodes).map(node => parseNode(node));

            return elements.filter(e => e).join('\n\n');
        }
    };

    // 初始化导出功能
    myCollectionExport.init();
})();
