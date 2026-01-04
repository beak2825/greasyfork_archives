// ==UserScript==
// @name         LeetCode Copy Cleaner (去除复制的代码作者信息)
// @namespace    https://github.com/lesir831/UserScript
// @version      1.3
// @description  点击 LeetCode 代码块的复制按钮时，只复制纯代码，去除末尾附加的作者和题目链接等信息。
// @author       lesir
// @match        https://leetcode.com/problems/*
// @match        https://leetcode.cn/problems/*
// @match        https://leetcode.com/explore/interview/*
// @match        https://leetcode.cn/explore/interview/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/534463/LeetCode%20Copy%20Cleaner%20%28%E5%8E%BB%E9%99%A4%E5%A4%8D%E5%88%B6%E7%9A%84%E4%BB%A3%E7%A0%81%E4%BD%9C%E8%80%85%E4%BF%A1%E6%81%AF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534463/LeetCode%20Copy%20Cleaner%20%28%E5%8E%BB%E9%99%A4%E5%A4%8D%E5%88%B6%E7%9A%84%E4%BB%A3%E7%A0%81%E4%BD%9C%E8%80%85%E4%BF%A1%E6%81%AF%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('LeetCode Copy Code Cleaner script loaded.');

    // 添加一个防抖函数，避免事件多次触发导致的问题
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // 保存原始的 Clipboard API 方法
    const originalWriteText = navigator.clipboard.writeText;

    // 覆盖剪贴板 API 以拦截所有复制操作
    navigator.clipboard.writeText = function (text) {
        // 检查文本是否包含 LeetCode 的特征文本
        if (text && (text.includes('\nAuthor: ') || text.includes('\n作者：') ||
            text.includes('https://leetcode.com') || text.includes('https://leetcode.cn'))) {
            console.log('Detected LeetCode copyright text, cleaning...');

            // 查找并删除版权信息
            // 匹配多种可能的版权格式
            const cleanedText = text.split(/\n(Author: |作者：)/)[0].trim();
            console.log('Cleaned code copied to clipboard');
            return originalWriteText.call(this, cleanedText);
        }

        // 如果不是 LeetCode 代码，正常执行
        return originalWriteText.call(this, text);
    };

    // 主要的按钮点击拦截功能
    const handleButtonClick = function (event) {
        let copyButtonClickTarget = null; // 将被认为是“复制按钮”的元素

        // 1. 优先检查新的按钮结构 (最具体)
        const newButtonElement = event.target.closest('div.CODEBLOCK_COPY_BUTTON');
        if (newButtonElement) {
            copyButtonClickTarget = newButtonElement;
            console.log('New button structure div.CODEBLOCK_COPY_BUTTON identified.');
        } else {
            // 2. 如果找不到新结构，回退到旧的按钮/图标识别逻辑
            const olderIconOrButton = event.target.closest('svg.fa-clone, svg[class*="copy"], button[class*="copy"]');
            if (olderIconOrButton) {
                // 尝试为旧结构找到可点击的父元素
                copyButtonClickTarget = olderIconOrButton.closest('div[class*="cursor-pointer"], button[class*="copy"]');
                if (copyButtonClickTarget) {
                    console.log('Older button structure identified via icon/button content and specific parent.');
                } else {
                    // 如果没有特定的可点击父元素，直接使用图标本身或其直接父级（如果它是按钮）
                    copyButtonClickTarget = olderIconOrButton.closest('button') || olderIconOrButton;
                    console.log('Older icon/button found, using it or its button parent as target.');
                }
            }
        }

        if (copyButtonClickTarget) {
            console.log('Potential LeetCode copy button interaction detected. Target:', copyButtonClickTarget);

            // 找到代码容器。这是识别按钮后最关键的部分。
            // 按钮和代码文本区域之间的关系可能会有所不同。
            let codeContainer = null;

            if (copyButtonClickTarget.classList.contains('CODEBLOCK_COPY_BUTTON')) {
                // 对于新按钮，我们需要找到其关联的代码块。
                // 策略：向上查找几层父元素，寻找常见的代码编辑器容器或 pre 标签。
                let parent = copyButtonClickTarget.parentElement;
                for (let i = 0; i < 4 && parent; i++) { // 最多检查4层父元素
                    // 查找 Monaco 编辑器, CodeMirror, 或通用的 pre 标签。
                    // LeetCode 通常用包含 'code-block' 或类似类名的 div 包装代码块。
                    // 同时检查父元素自身是否为代码区域的直接容器
                    const potentialContainer = parent.querySelector('pre, div.monaco-editor, div.react-codemirror2, div[class*="language-"], div.view-lines, div.CodeMirror-code, textarea.cm-content');
                    if (potentialContainer) {
                        codeContainer = parent; // 假设父元素是这些代码元素的容器
                        console.log('Found code container for new button by searching upwards from button parent:', codeContainer);
                        break;
                    }
                    // 检查父元素本身是否是已知的包装器 (优先级稍低)
                    if (parent.matches('[class*="code-block"], [class*="code-editor"], [class*="sample-code"], [class*="monaco-editor"], [class*="react-codemirror2"]')) {
                        codeContainer = parent;
                        console.log('Found code container for new button by matching parent class:', codeContainer);
                        break;
                    }
                    parent = parent.parentElement;
                }
                if (!codeContainer) {
                    console.warn('Could not reliably find code container for new button structure. Falling back to button\'s parent or grandparent.');
                    codeContainer = copyButtonClickTarget.parentElement?.parentElement || copyButtonClickTarget.parentElement; // 回退到按钮的父元素或祖父元素
                }
            } else {
                // 旧按钮的原始逻辑
                codeContainer = copyButtonClickTarget.closest('.group.relative, [class*="code-block"], [class*="monaco-editor-background"], .monaco-editor, .react-codemirror2');
                console.log('Attempting to find code container for older button structure:', codeContainer);
            }

            if (!codeContainer) {
                console.error('Failed to find code container for the button:', copyButtonClickTarget, 'DOM structure might have changed significantly.');
                return; // 如果找不到容器，则停止处理，让默认行为（可能被剪贴板API覆盖逻辑清理）发生
            }

            // 查找实际的代码元素
            // code:not(span>code) 避免选中行内代码片段 (如果 pre code 未找到)
            let codeElement = codeContainer.querySelector('pre code, code:not(span > code), div.view-lines, div.CodeMirror-code, textarea.cm-content');

            if (codeElement) {
                event.preventDefault();
                event.stopPropagation();
                console.log('Code element found:', codeElement);

                let pureCode = '';
                // 处理 Monaco 编辑器 (它使用 div.view-lines 和单独的行 div)
                if (codeElement.classList.contains('view-lines') || codeContainer.querySelector('div.view-lines')) {
                    const linesHost = codeContainer.querySelector('div.view-lines') || codeElement;
                    const lines = linesHost.querySelectorAll('div[class*="view-line"]'); // 更通用的类匹配
                    lines.forEach(line => {
                        pureCode += (line.textContent || line.innerText) + '\n';
                    });
                    pureCode = pureCode.replace(/\n$/, ""); // 移除末尾的换行符
                } else if (codeElement.matches('div.CodeMirror-code')) { // 处理 CodeMirror
                    const lines = codeElement.querySelectorAll('.CodeMirror-line');
                    lines.forEach(line => {
                        pureCode += (line.textContent || line.innerText) + '\n';
                    });
                    pureCode = pureCode.replace(/\n$/, "");
                } else {
                    pureCode = codeElement.textContent || codeElement.innerText;
                }

                pureCode = pureCode.trim(); // 通用清理

                if (!pureCode && codeElement.tagName === 'TEXTAREA') { // 特别处理 textarea (例如 CodeMirror 6 的 cm-content)
                    pureCode = codeElement.value;
                }

                if (!pureCode) {
                    console.warn("Extracted pure code is empty. Code element:", codeElement, "Container:", codeContainer, "Button:", copyButtonClickTarget);
                    // 如果提取的代码为空，可能意味着代码元素选择器仍需调整，
                    // 或者页面结构确实没有文本。为避免复制空内容，可以考虑不执行复制。
                    // 但目前还是尝试复制（如果为空，则剪贴板API的清理逻辑是最后的防线）
                }

                navigator.clipboard.writeText(pureCode).then(() => {
                    console.log('Pure code copied to clipboard successfully! Content snippet:', pureCode.substring(0, 100) + "...");
                    // 视觉反馈逻辑 (来自原脚本)
                    const feedbackSpan = document.createElement('span');
                    feedbackSpan.textContent = '已复制';
                    feedbackSpan.style.position = 'fixed'; // 使用 fixed 以便在滚动时也能正确定位
                    feedbackSpan.style.backgroundColor = '#4CAF50';
                    feedbackSpan.style.color = 'white';
                    feedbackSpan.style.padding = '3px 6px';
                    feedbackSpan.style.borderRadius = '3px';
                    feedbackSpan.style.fontSize = '12px';
                    feedbackSpan.style.zIndex = '9999';
                    feedbackSpan.style.pointerEvents = 'none'; // 避免反馈元素自身拦截鼠标事件
                    feedbackSpan.style.opacity = '0.9';
                    feedbackSpan.style.transition = 'opacity 0.5s ease-out';


                    const buttonRect = copyButtonClickTarget.getBoundingClientRect();
                    // 定位在按钮上方
                    // getBoundingClientRect 的 top/left 是相对于视口的
                    // feedbackSpan.offsetHeight 可能在元素添加到DOM之前不准确，但这里通常可以接受
                    let topPosition = buttonRect.top - (feedbackSpan.offsetHeight || 20) - 5; // 减去估算的高度和一些间距
                    let leftPosition = buttonRect.left + (buttonRect.width / 2) - (feedbackSpan.offsetWidth / 2 || 20); // 按钮中心

                    // 确保反馈在视口内
                    topPosition = Math.max(5, topPosition); // 至少离顶部5px
                    leftPosition = Math.max(5, Math.min(leftPosition, window.innerWidth - (feedbackSpan.offsetWidth || 40) - 5));


                    feedbackSpan.style.top = `${topPosition}px`;
                    feedbackSpan.style.left = `${leftPosition}px`;

                    document.body.appendChild(feedbackSpan);
                    setTimeout(() => {
                        feedbackSpan.style.opacity = '0';
                        setTimeout(() => feedbackSpan.remove(), 500);
                    }, 1500);
                }).catch(err => {
                    console.error('Failed to copy pure code: ', err);
                    alert('复制代码失败，请尝试手动选中复制。\n错误信息: ' + err.message);
                });

                return false; // 确保事件不继续传播
            } else {
                console.error('Could not find the code element within the container:', codeContainer, 'for button:', copyButtonClickTarget);
            }
        }
        // 如果不是已识别的复制按钮，或者逻辑未能找到元素，则让事件继续传播。
        // navigator.clipboard.writeText 的覆盖逻辑将是最后的防线。
        return true;
    };

    // 使用事件委托监听所有点击事件，采用捕获阶段
    document.addEventListener('click', handleButtonClick, true);

    // 使用 MutationObserver 监听 DOM 变化，处理动态加载的内容
    const observer = new MutationObserver(debounce(function (mutations) {
        // 检查是否有新的代码块被添加
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                // DOM 变化，可能需要重新检查按钮
                console.log('DOM changed, looking for new copy buttons');
            }
        }
    }, 200));

    // 开始监听整个文档的变化
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();