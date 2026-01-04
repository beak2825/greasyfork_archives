// ==UserScript==
// @name         太美了
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  美化文档格式，添加标题序号，调整样式等
// @author       weihao2293
// @match        *://*.km.sankuai.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519436/%E5%A4%AA%E7%BE%8E%E4%BA%86.user.js
// @updateURL https://update.greasyfork.org/scripts/519436/%E5%A4%AA%E7%BE%8E%E4%BA%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加 iconfont 样式
    function addIconFont() {
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: "iconfont";
                src: url('//at.alicdn.com/t/font_1444750_kz0d4j05q4.eot');
                src: url('//at.alicdn.com/t/font_1444750_kz0d4j05q4.eot?#iefix') format('embedded-opentype'),
                     url('//at.alicdn.com/t/font_1444750_kz0d4j05q4.woff2') format('woff2'),
                     url('//at.alicdn.com/t/font_1444750_kz0d4j05q4.woff') format('woff'),
                     url('//at.alicdn.com/t/font_1444750_kz0d4j05q4.ttf') format('truetype'),
                     url('//at.alicdn.com/t/font_1444750_kz0d4j05q4.svg#iconfont') format('svg');
            }
            .iconfont {
                font-family: "iconfont" !important;
                font-size: 16px;
                font-style: normal;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
            .ct-icon-ai:before {
                content: "\\e65b";  /* 这是一个示例，需要替换为正确的图标编码 */
            }
            /* 添加折叠图标样式 */
            .heading-collapse-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 16px;
                height: 16px;
                margin-right: 5px;
                cursor: pointer;
                transition: transform 0.3s;
                user-select: none;
                position: relative;
                top: -1px;
                vertical-align: middle;
            }
            .heading-collapse-btn::before {
                content: '▼';
                font-size: 12px;
                color: #666;
                line-height: 1;
            }
            .heading-collapse-btn.collapsed::before {
                content: '▶';
            }
            .content-collapsed {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 创建并添加按钮
    function createBeautifyButton() {
        const button = document.createElement('button');
        button.textContent = '太美了';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            padding: 8px 20px;
            font-size: 13px;
            font-weight: 500;
            color: white;
            background: linear-gradient(90deg,
                #6631FF 0%,
                #A431FF 50%,
                #EE89FF 100%
            );
            border: none;
            border-radius: 100px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 0 5px rgba(156, 111, 228, 0.2);
        `;

        // 添加动画关键帧到文档
        const style = document.createElement('style');
        style.textContent = `
            @keyframes glowing {
                from {
                    box-shadow: 0 0 5px rgba(156, 111, 228, 0.2),
                               0 0 0.5px #fff,
                               0 0 2px #fff,
                               0 0 8px rgba(164, 49, 255, 0.5),
                               0 0 12px rgba(102, 49, 255, 0.3);
                }
                to {
                    box-shadow: 0 0 8px rgba(156, 111, 228, 0.2),
                               0 0 1px #fff,
                               0 0 3px #fff,
                               0 0 15px rgba(164, 49, 255, 0.4),
                               0 0 25px rgba(102, 49, 255, 0.2);
                }
            }
        `;
        document.head.appendChild(style);

        // 添加悬停效果
        button.onmouseenter = () => {
            button.style.transform = 'translateY(-2px) scale(1.05)';
            button.style.filter = 'brightness(1.2)';
            button.style.animation = 'glowing 1.5s ease-in-out infinite alternate';
        };
        button.onmouseleave = () => {
            button.style.transform = 'translateY(0) scale(1)';
            button.style.filter = 'brightness(1)';
            button.style.animation = 'none';
            button.style.boxShadow = '0 0 5px rgba(156, 111, 228, 0.2)';
        };

        document.body.appendChild(button);
        return button;
    }

    // 设置标准宽度
    function setStandardWidth() {
        window.widthType = 1;
    }

    // 处理标题
    function processHeadings() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let currentNumbers = [0, 0, 0, 0, 0, 0]; // 用于跟踪每个级别的编号

        // 找到最高级别和最低级别的标题
        let highestLevel = 6;
        let lowestLevel = 1;
        headings.forEach(heading => {
            const level = parseInt(heading.tagName[1]);
            highestLevel = Math.min(highestLevel, level);
            lowestLevel = Math.max(lowestLevel, level);
        });

        // 添加新序号和分隔线
        headings.forEach((heading, index) => {
            // 移除已有的序号
            heading.innerHTML = heading.innerHTML.replace(/^[\d\.]+\s+/, '');

            // 为除第一个标题外的所有标题添加分隔线，但只在没有分隔线时添加
            if (index > 0 && !heading.previousElementSibling?.matches('hr.ct-node-view-dom')) {
                const hr = document.createElement('hr');
                hr.className = 'ct-node-view-dom';
                hr.setAttribute('contenteditable', 'false');
                hr.style.display = 'block';
                heading.parentNode.insertBefore(hr, heading);
            }

            // 处理标题内的所有 span 元素
            const spans = heading.querySelectorAll('span');
            spans.forEach(span => {
                // 移除背景色
                if (span.classList.contains('text-background-color')) {
                    span.style.setProperty('background-color', 'transparent', 'important');
                    span.classList.remove('text-background-color');
                }
                // 设置文字颜色为黑色
                span.style.setProperty('color', '#000000', 'important');
            });

            // 获取标题文本内容（保留原有的 HTML 结构）
            const originalContent = heading.innerHTML;

            // 计算相对级别（从1开始）
            const absoluteLevel = parseInt(heading.tagName[1]);
            const relativeLevel = absoluteLevel - highestLevel + 1;
            const totalLevels = lowestLevel - highestLevel + 1; // 总共有几级标题

            // 生成序号
            let number = '';
            if (relativeLevel === 1) {
                // 最高级标题使用两位数字
                currentNumbers[0]++;
                // 重置所有子级编号
                for (let i = 1; i < totalLevels; i++) {
                    currentNumbers[i] = 0;
                }
                number = String(currentNumbers[0]).padStart(2, '0');
            } else {
                // 子级标题
                currentNumbers[relativeLevel - 1]++;
                // 重置所有更低级别的编号
                for (let i = relativeLevel; i < totalLevels; i++) {
                    currentNumbers[i] = 0;
                }
                // 生成序号：去掉前导零，然后添加子级序号
                number = currentNumbers[0] + currentNumbers.slice(1, relativeLevel)
                    .map(num => '.' + num)
                    .join('');
            }

            // 添加序号
            heading.innerHTML = number + ' ' + originalContent;

            // 添加折叠按钮
            const collapseBtn = document.createElement('span');
            collapseBtn.className = 'heading-collapse-btn';
            heading.insertBefore(collapseBtn, heading.firstChild);

            // 添加点击事件
            collapseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const currentLevel = parseInt(heading.tagName[1]);
                let element = heading.nextElementSibling;
                const isCollapsed = collapseBtn.classList.toggle('collapsed');

                while (element) {
                    // 如果遇到更高级别的标题，停止折叠
                    if (element.tagName && /^H[1-6]$/.test(element.tagName)) {
                        const elementLevel = parseInt(element.tagName[1]);
                        if (elementLevel <= currentLevel) {
                            break;
                        }
                    }

                    // 折叠或展开内容
                    element.classList.toggle('content-collapsed', isCollapsed);
                    element = element.nextElementSibling;
                }
            });
        });
    }

    // 处理段落 - 只处理图片和状态标签相关的逻辑，不添加空行
    function processParagraphs() {
        const paragraphs = document.querySelectorAll('p');
        paragraphs.forEach(p => {
            // 跳过包含图片的段落和图片前面的段落
            if (p.querySelector('.pk-image') ||
                (p.nextElementSibling && p.nextElementSibling.querySelector('.pk-image'))) {
                return;
            }

            // 跳过包含 pk-status 的段落
            if (p.querySelector('.pk-status') ||
                (p.nextElementSibling && p.nextElementSibling.querySelector('.pk-status'))) {
                return;
            }
        });
    }

    // 主函数
    function beautifyDocument() {
        setStandardWidth();
        processHeadings();
        processParagraphs();

        // 移除所有已有的折叠状态
        document.querySelectorAll('.content-collapsed').forEach(el => {
            el.classList.remove('content-collapsed');
        });
    }

    // 初始化
    addIconFont();
    const beautifyButton = createBeautifyButton();
    beautifyButton.addEventListener('click', beautifyDocument);
})();
