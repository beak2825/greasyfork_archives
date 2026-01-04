// ==UserScript==
// @name         Perplexity 代码框限制高度
// @name:en      Perplexity Code Height Limiter
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  限制Perplexity网站代码框高度为400px并添加按钮
// @description:en  Limit code block height to 400px and add copy button on Perplexity
// @author       Dost
// @match        https://www.perplexity.ai/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520198/Perplexity%20%E4%BB%A3%E7%A0%81%E6%A1%86%E9%99%90%E5%88%B6%E9%AB%98%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/520198/Perplexity%20%E4%BB%A3%E7%A0%81%E6%A1%86%E9%99%90%E5%88%B6%E9%AB%98%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        pre {
            max-height: 400px !important;
            overflow-y: auto !important;
            position: relative !important;
        }

        .copy-button {
            position: sticky !important;
            bottom: 10px !important;
            right: 10px !important;
            float: right !important;
            background-color: #4a5568 !important;
            color: white !important;
            border: none !important;
            border-radius: 4px !important;
            padding: 5px 10px !important;
            cursor: pointer !important;
            opacity: 0 !important;
            transition: opacity 0.3s ease !important;
            z-index: 1000 !important;
        }

        pre:hover .copy-button {
            opacity: 1 !important;
        }

        .copy-button:hover {
            background-color: #2d3748 !important;
        }
    `);

    function addCopyButtonToCodeBlocks() {
        const codeBlocks = document.querySelectorAll('pre');

        codeBlocks.forEach(pre => {
            if (!pre.querySelector('.copy-button')) {
                const copyButton = document.createElement('button');
                copyButton.textContent = '复制';
                copyButton.className = 'copy-button';

                copyButton.addEventListener('click', async () => {
                    // 获取code元素中的文本内容
                    const codeElement = pre.querySelector('code');
                    const code = codeElement ? codeElement.textContent : pre.textContent;
                    const cleanCode = code.replace('复制', '').trim();
                    
                    try {
                        await navigator.clipboard.writeText(cleanCode);
                        copyButton.textContent = '已复制!';
                        setTimeout(() => {
                            copyButton.textContent = '复制';
                        }, 2000);
                    } catch (err) {
                        copyButton.textContent = '复制失败';
                        setTimeout(() => {
                            copyButton.textContent = '复制';
                        }, 2000);
                    }
                });

                pre.appendChild(copyButton);
            }
        });
    }

    const observer = new MutationObserver(() => {
        addCopyButtonToCodeBlocks();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    addCopyButtonToCodeBlocks();
})();