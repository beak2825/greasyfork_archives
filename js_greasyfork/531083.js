// ==UserScript==
// @name         影刀社区文章代码块一键复制
// @description  Adds a one-click copy button to code blocks on the page
// @match        https://www.yingdao.com/community/detaildiscuss?id=*
// @run-at       document-idle
// @version      1.0.1
// @namespace https://greasyfork.org/users/1451126
// @downloadURL https://update.greasyfork.org/scripts/531083/%E5%BD%B1%E5%88%80%E7%A4%BE%E5%8C%BA%E6%96%87%E7%AB%A0%E4%BB%A3%E7%A0%81%E5%9D%97%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/531083/%E5%BD%B1%E5%88%80%E7%A4%BE%E5%8C%BA%E6%96%87%E7%AB%A0%E4%BB%A3%E7%A0%81%E5%9D%97%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 选择所有 <pre> 标签的代码块
    const codeBlocks = document.querySelectorAll('pre');
    console.log('Found code blocks:', codeBlocks.length); // 调试：检查是否找到代码块

    if (codeBlocks.length === 0) {
        console.log('No <pre> elements found. Check if the code blocks use a different tag or class.');
    }

    codeBlocks.forEach((block, index) => {
        // 检查是否已处理，避免重复添加
        if (block.parentElement && block.parentElement.classList.contains('code-block-wrapper')) {
            return;
        }

        // 创建包裹元素
        const wrapper = document.createElement('div');
        wrapper.classList.add('code-block-wrapper');

        // 将原始代码块插入到 wrapper 中
        block.parentNode.insertBefore(wrapper, block); // 在 block 前插入 wrapper
        wrapper.appendChild(block); // 将 block 移入 wrapper

        // 创建复制按钮
        const button = document.createElement('button');
        button.classList.add('copy-button');
        button.textContent = '一键复制';
        button.addEventListener('click', async () => {
            try {
                if (navigator.clipboard) {
                    await navigator.clipboard.writeText(block.textContent);
                    button.textContent = 'Copied!';
                    setTimeout(() => button.textContent = 'Copy', 2000); // 2秒后恢复
                } else {
                    const tempInput = document.createElement('input');
                    tempInput.value = block.textContent;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                    button.textContent = 'Copied!';
                    setTimeout(() => button.textContent = 'Copy', 2000);
                }
            } catch (err) {
                console.error('Copy failed:', err);
                button.textContent = 'Error';
            }
        });

        // 将按钮添加到 wrapper
        wrapper.appendChild(button);

        console.log(`Added copy button to code block ${index + 1}`);
    });

    // 添加样式
    const style = document.createElement('style');
    style.innerHTML = `
        .code-block-wrapper {
            position: relative;
            display: inline-block; /* 确保 wrapper 适应代码块大小 */
            width: 100%; /* 确保宽度与代码块一致 */
        }
        .copy-button {
            position: absolute;
            top: 5px;
            right: 5px;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            padding: 3px 8px;
            font-size: 12px;
            cursor: pointer;
            z-index: 10; /* 确保按钮在代码块上方 */
        }
        .copy-button:hover {
            background-color: #ddd;
        }
    `;
    document.head.appendChild(style);
})();