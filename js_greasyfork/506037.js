// ==UserScript==
// @name        HackMD Copy Code Snippet
// @version     1.0.0
// @description A userscript that adds a copy to clipboard button on hover of code snippets in HackMD
// @license     MIT
// @author      Planetoid Hsu (Made with Claude)
// @namespace   https://github.com/planetoid
// @match       https://hackmd.io/*
// @run-at      document-idle
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/506037/HackMD%20Copy%20Code%20Snippet.user.js
// @updateURL https://update.greasyfork.org/scripts/506037/HackMD%20Copy%20Code%20Snippet.meta.js
// ==/UserScript==

(() => {
    "use strict";

    let copyId = 0;
    const codeSelector = "pre";

    const copyButton = document.createElement("button");
    copyButton.className = "copy-btn";
    copyButton.setAttribute("aria-label", "Copy to clipboard");
    copyButton.innerHTML = "Copy";

    GM_addStyle(`
        .code-wrap {
            position: relative;
        }
        .code-wrap:hover .copy-btn {
            display: block;
        }
        .copy-btn {
            display: none;
            position: absolute;
            top: 5px;
            right: 5px;
            padding: 3px 6px;
            background-color: #f1f1f1;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-size: 12px;
            cursor: pointer;
            z-index: 1000;
        }
        .copy-btn:hover {
            background-color: #e1e1e1;
        }
    `);

    function addButton(codeBlock) {
        if (!codeBlock.classList.contains("code-wrap")) {
            copyId++;
            const code = codeBlock.querySelector("code") || codeBlock;
            if (code) {
                code.id = `hmd-csc-${copyId}`;
                const newButton = copyButton.cloneNode(true);
                newButton.addEventListener("click", () => {
                    navigator.clipboard.writeText(code.textContent).then(() => {
                        newButton.textContent = "Copied!";
                        setTimeout(() => {
                            newButton.textContent = "Copy";
                        }, 2000);
                    });
                });
                codeBlock.classList.add("code-wrap");
                codeBlock.insertBefore(newButton, codeBlock.firstChild);
            }
        }
    }

    function init() {
        document.querySelectorAll(codeSelector).forEach(addButton);
    }

    window.addEventListener('load', init);

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches(codeSelector)) {
                            addButton(node);
                        } else {
                            node.querySelectorAll(codeSelector).forEach(addButton);
                        }
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();