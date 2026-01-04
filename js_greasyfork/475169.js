// ==UserScript==
// @name         chatgpt-export
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a copy button next to LaTeX formulas
// @author       You
// @match        https://chat.openai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475169/chatgpt-export.user.js
// @updateURL https://update.greasyfork.org/scripts/475169/chatgpt-export.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let debounceTimer;

    const addCopyButtons = () => {
        const mathDivs = document.querySelectorAll('.math, .math-inline, .math-display');
        const copiedButtonHtml = `<button
        class="flex ml-auto gap-2 rounded-md p-1 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400"><svg
            stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round"
            stroke-linejoin="round" class="icon-sm" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg></button>`
        const copyButtonHtml = `<button
        class="flex ml-auto gap-2 rounded-md p-1 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400"><svg
            stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round"
            stroke-linejoin="round" class="icon-sm" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        </svg></button>`

        mathDivs.forEach(div => {
            if (div.getAttribute('data-copy-button-added') === 'true') return;
            div.setAttribute('data-copy-button-added', 'true');
    
            const annotation = div.querySelector('annotation[encoding="application/x-tex"]');
            if (annotation) {
                let latexText = annotation.textContent;
                const copyButton = document.createElement('span');
                copyButton.className = 'copy-button text-gray-400 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400';
                copyButton.innerHTML = copyButtonHtml;
                copyButton.style.verticalAlign = 'middle'; // 确保与行内文本对齐
                copyButton.style.display = 'inline-flex';  // 使用 flex 布局保持行内
    
                if (div.classList.contains('math-display')) {
                    latexText = `$$ ${latexText} $$`
                    copyButton.style.position = 'absolute';
                    copyButton.style.top = '0';
                    copyButton.style.right = '0';
                    copyButton.style.zIndex = '1';
                    div.style.position = 'relative';
                    div.appendChild(copyButton);
                } else if (div.classList.contains('math-inline')) {
                    latexText = `$ ${latexText} $`
                    copyButton.style.marginLeft = '5px';
                    div.parentNode.insertBefore(copyButton, div.nextSibling);
                }
    
                copyButton.addEventListener('click', () => {
                    navigator.clipboard.writeText(latexText).then(() => {
                        copyButton.innerHTML = copiedButtonHtml;
                        setTimeout(() => {
                            copyButton.innerHTML = copyButtonHtml;
                        }, 2000);
                    }).catch(err => {
                        console.error('复制失败:', err);
                    });
                });
            }
        });
    };
    
    const debounceAddCopyButtons = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(addCopyButtons, 300);
    };

    addCopyButtons();  // Run once initially

    const observer = new MutationObserver(() => {
        console.log("DOM has changed, rechecking...");
        debounceAddCopyButtons();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();