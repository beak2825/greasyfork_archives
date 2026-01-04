// ==UserScript==
// @name         Luogu Article Copier
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      1.0
// @description  将Luogu文章内容（包括KaTeX源代码和格式）复制到剪贴板
// @author       Ephemeron
// @match        https://www.luogu.com.cn/article/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/518574/Luogu%20Article%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/518574/Luogu%20Article%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a button
    const button = document.createElement('button');
    button.innerText = '复制文章内容';
    button.style.position = 'fixed'; // Use fixed position to ensure visibility
    button.style.top = '60px';
    button.style.right = '20px';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '10000'; // High z-index to ensure it appears above other elements
    button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    button.style.fontSize = '16px';
    button.style.transition = 'background-color 0.3s, transform 0.3s';
    button.style.fontWeight = 'bold';

    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#45a049';
        button.style.transform = 'translateY(-2px)';
    });

    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = '#4CAF50';
        button.style.transform = 'translateY(0)';
    });

    // Append the button to the body
    document.body.appendChild(button);

    // Function to get article content
    const getArticleContent = () => {
        const articleElement = document.querySelector('.article-content');
        if (!articleElement) return '';

        // Clone the article element to manipulate it without affecting the original
        const clonedArticle = articleElement.cloneNode(true);

        // Convert KaTeX elements to their LaTeX source
        clonedArticle.querySelectorAll('.katex').forEach(katexElement => {
            const annotation = katexElement.querySelector('.katex-mathml annotation');
            if (annotation) {
                const latex = annotation.textContent;
                // Determine if the formula should be block or inline
                const isDisplayStyle = katexElement.classList.contains('katex-display') ||
                                       (katexElement.previousSibling && katexElement.previousSibling.nodeType === Node.TEXT_NODE && katexElement.previousSibling.textContent.endsWith('\n')) &&
                                       (katexElement.nextSibling && katexElement.nextSibling.nodeType === Node.TEXT_NODE && katexElement.nextSibling.textContent.startsWith('\n'));
                katexElement.innerHTML = isDisplayStyle ? `$$${latex}$$` : `$${latex}$`;
            }
        });

        // Remove unwanted elements like "作者" and "创建时间"
        clonedArticle.querySelectorAll('.update-info, .actions, .toc-wrapper').forEach(el => el.remove());

        // Convert the HTML to Markdown-like syntax
        const convertToMarkdown = (element) => {
            let markdownContent = '';

            element.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    markdownContent += node.textContent;
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const tagName = node.tagName.toLowerCase();
                    switch (tagName) {
                        case 'h1':
                            markdownContent += `# ${convertToMarkdown(node)}\n\n`;
                            break;
                        case 'h2':
                            markdownContent += `## ${convertToMarkdown(node)}\n\n`;
                            break;
                        case 'h3':
                            markdownContent += `### ${convertToMarkdown(node)}\n\n`;
                            break;
                        case 'h4':
                            markdownContent += `#### ${convertToMarkdown(node)}\n\n`;
                            break;
                        case 'h5':
                            markdownContent += `##### ${convertToMarkdown(node)}\n\n`;
                            break;
                        case 'h6':
                            markdownContent += `###### ${convertToMarkdown(node)}\n\n`;
                            break;
                        case 'p':
                            markdownContent += `${convertToMarkdown(node)}\n\n`;
                            break;
                        case 'strong':
                            markdownContent += `**${convertToMarkdown(node)}**`;
                            break;
                        case 'em':
                            markdownContent += `*${convertToMarkdown(node)}*`;
                            break;
                        case 'a':
                            const href = node.getAttribute('href');
                            markdownContent += `[${convertToMarkdown(node)}](${href})`;
                            break;
                        case 'code':
                            markdownContent += `\`${node.textContent}\``;
                            break;
                        case 'pre':
                            markdownContent += `\`\`\`\n${node.textContent}\n\`\`\`\n`;
                            break;
                        case 'table':
                            markdownContent += convertTableToMarkdown(node);
                            break;
                        case 'ul':
                            markdownContent += convertListToMarkdown(node, '*');
                            break;
                        case 'ol':
                            markdownContent += convertListToMarkdown(node, '1.');
                            break;
                        case 'li':
                            markdownContent += `- ${convertToMarkdown(node)}\n`;
                            break;
                        case 'span':
                            markdownContent += convertToMarkdown(node);
                            break;
                        default:
                            markdownContent += convertToMarkdown(node);
                    }
                }
            });

            return markdownContent;
        };

        const convertTableToMarkdown = (tableElement) => {
            let markdownTable = '';
            const rows = tableElement.querySelectorAll('tr');
            rows.forEach((row, rowIndex) => {
                const cells = Array.from(row.children);
                const cellContent = cells.map(cell => cell.textContent.trim()).join(' | ');
                markdownTable += `| ${cellContent} |\n`;
                if (rowIndex === 0) {
                    markdownTable += `| ${cells.map(() => '---').join(' | ')} |\n`;
                }
            });
            return markdownTable + '\n';
        };

        const convertListToMarkdown = (listElement, marker) => {
            let markdownList = '';
            listElement.querySelectorAll('li').forEach(li => {
                markdownList += `${marker} ${convertToMarkdown(li)}\n`;
            });
            return markdownList + '\n';
        };

        return convertToMarkdown(clonedArticle);
    };

    // Add click event to the button
    button.addEventListener('click', () => {
        const content = getArticleContent();
        if (content) {
            GM_setClipboard(content, 'text');
            alert('文章内容已复制到剪贴板！');
        } else {
            alert('未找到文章内容。');
        }
    });
})();
