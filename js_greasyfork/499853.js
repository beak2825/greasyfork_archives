// ==UserScript==
// @name         Copy Job Description
// @namespace    http://tampermonkey.net/
// @version      2024-06-13
// @description  Copy LinkedIn Job Description
// @author       You
// @match        https://www.linkedin.com/jobs/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499853/Copy%20Job%20Description.user.js
// @updateURL https://update.greasyfork.org/scripts/499853/Copy%20Job%20Description.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;
    const jobLink = `[Job Link](${currentUrl})`;
    const company = document.querySelector('.job-details-jobs-unified-top-card__company-name').innerText;
    const jobTitle = document.querySelector('.job-details-jobs-unified-top-card__job-title').innerText;
    const jobHeader = `## ${jobTitle} - ${company}`;

    // 查找第一个 class 为 "text-heading-large" 且为 <h2> 的元素
    const headingElement = document.querySelector('h2.text-heading-large');

    const removeEmptyLines = (input) => {
        return input.split('\n').filter(line => line.trim() !== '').join('\n');
    };

    const parseElementToMarkdown = (element) => {
        let markdownText = '';

        element.childNodes.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                // 普通文本节点，直接加入文本
                markdownText += child.textContent.trim();
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                switch (child.tagName.toLowerCase()) {
                    case 'strong':
                        // <strong> 用 ** 包围
                        markdownText += `**${child.textContent.trim()}**\n`;
                        break;
                    case 'li':
                        // <li> 用 - 前缀
                        markdownText += `- ${child.textContent.trim()}\n`;
                        break;
                    default:
                        // 其他元素，递归处理
                        markdownText += parseElementToMarkdown(child) + '\n';
                        break;
                }
            }
        });

        return markdownText;
    };

    if (headingElement) {
        // 创建一个新的容器，用于包含 <h2> 和按钮
        const container = document.createElement('div');
        container.style.display = 'flex'; // 使用 flex 布局
        container.style.alignItems = 'center'; // 垂直居中对齐
        container.style.justifyContent = 'space-between'; // 将内容在容器中两端对齐

        // 将原来的 <h2> 元素移入新容器
        headingElement.parentNode.insertBefore(container, headingElement);
        container.appendChild(headingElement);

        // 创建按钮元素
        const button = document.createElement('button');
        button.innerText = 'copy job description';
        button.className = 'artdeco-button'; // 设置按钮的 class
        button.style.marginLeft = '10px'; // 添加一些间距

        // 给按钮添加点击事件
        button.addEventListener('click', () => {
            // 查找 class 为 "jobs-description__content" 的元素
            const descriptionContainer = document.querySelector('.jobs-description__content');

            if (descriptionContainer) {
                // 查找该容器中所有 class 为 "mt4" 的子元素
                const mt4Element = descriptionContainer.querySelector('.mt4');

                if (mt4Element) {
                    // 转换 mt4Element 的文本为 Markdown 格式
                    let textToCopy = parseElementToMarkdown(mt4Element);

                    // 去除空行
                    textToCopy = removeEmptyLines(textToCopy);

                    // 加入 job header 和 job link
                    textToCopy = jobHeader + '\n' + jobLink + '\n' + textToCopy;

                    // 复制文本内容到剪贴板
                    GM_setClipboard(textToCopy.trim(), { mimetype: 'text/plain' });
                    alert('Job description copied to clipboard!');
                } else {
                    alert('No mt4 element found in job description.');
                }
            } else {
                alert('No job description found.');
            }
        });

        // 将按钮添加到新容器中，并排放置在 <h2> 右边
        container.appendChild(button);
    }
})();
