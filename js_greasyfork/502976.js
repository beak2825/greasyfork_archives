// ==UserScript==
// @name         Chat GPT Code Blocks Line Numbers
// @author       NWP
// @description  Adds line numbers to Chat GPT code blocks either live (as the code is generated) or lazy (once the code has finished generating). Use lazy mode for performance mode. The default mode is the live mode. Use the toggle in the Tampermonkey menu to switch between the modes.
// @namespace    https://greasyfork.org/users/877912
// @version      0.1
// @license      MIT
// @match        https://chatgpt.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/502976/Chat%20GPT%20Code%20Blocks%20Line%20Numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/502976/Chat%20GPT%20Code%20Blocks%20Line%20Numbers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function refreshPage() {
        location.reload();
    }

    function toggleLiveLineNumbers() {
        const isLive = GM_getValue('liveLineNumbers', true);  // Default to true
        GM_setValue('liveLineNumbers', !isLive);
        refreshPage();
    }

    function registerMenu() {
        GM_registerMenuCommand(
            `Live line numbers: ${GM_getValue('liveLineNumbers', true) ? 'ON' : 'OFF'}`,  // Default to true
            toggleLiveLineNumbers
        );
    }

    registerMenu();

    const liveLineNumbers = GM_getValue('liveLineNumbers', true);  // Default to true

    function createLineNumbersElement() {
        const lineNumbersElement = document.createElement('div');
        lineNumbersElement.classList.add('line-numbers-inline');
        lineNumbersElement.style.display = 'flex';
        lineNumbersElement.style.flexDirection = 'column';
        lineNumbersElement.style.paddingTop = '0.07rem';
        lineNumbersElement.style.textAlign = 'right';
        lineNumbersElement.style.userSelect = 'none';
        lineNumbersElement.style.pointerEvents = 'none';
        lineNumbersElement.style.color = '#aaa';
        lineNumbersElement.style.background = '#1e1e1e';
        lineNumbersElement.style.lineHeight = '1.5';
        lineNumbersElement.style.zIndex = '2';
        lineNumbersElement.style.position = 'sticky';
        lineNumbersElement.style.left = '0';
        lineNumbersElement.style.minWidth = 'auto';
        lineNumbersElement.style.transform = 'none';
        return lineNumbersElement;
    }

    function updateLineNumbers(codeBlock, lineNumbersElement) {
        const lines = codeBlock.textContent.split('\n');
        lineNumbersElement.innerHTML = '';
        const maxLineNumber = lines.length;
        const digits = maxLineNumber.toString().length;
        const minWidth = `${digits}ch`;
        lineNumbersElement.style.minWidth = minWidth;
        codeBlock.style.paddingLeft = "1ch";
        lines.forEach((_, index) => {
            const lineNumber = document.createElement('div');
            lineNumber.style.lineHeight = '1.5';
            lineNumber.style.margin = '0';
            lineNumber.style.padding = '0';
            lineNumber.textContent = (index + 1).toString();
            lineNumbersElement.appendChild(lineNumber);
        });
    }

    function addLineNumbersInline(container, useLiveUpdates) {
        const codeBlock = container.querySelector('code');
        if (!codeBlock || container.querySelector('.line-numbers-inline')) return;
        container.style.position = 'relative';
        container.style.display = 'flex';
        container.style.alignItems = 'flex-start';
        container.style.padding = '0';
        container.style.margin = '0';
        container.style.overflowX = 'auto';
        container.style.overflowY = 'hidden';

        const lineNumbersElement = createLineNumbersElement();
        container.insertBefore(lineNumbersElement, codeBlock);

        if (useLiveUpdates) {
            updateLineNumbers(codeBlock, lineNumbersElement);

            let updateScheduled = false;
            const observer = new MutationObserver(() => {
                if (!updateScheduled) {
                    updateScheduled = true;
                    requestAnimationFrame(() => {
                        updateLineNumbers(codeBlock, lineNumbersElement);
                        updateScheduled = false;
                    });
                }
            });

            observer.observe(codeBlock, {
                childList: true,
                subtree: true,
                characterData: true,
            });
        } else {
            let updateTimeout;
            function debouncedUpdate() {
                clearTimeout(updateTimeout);
                updateTimeout = setTimeout(() => {
                    updateLineNumbers(codeBlock, lineNumbersElement);
                }, 500);
            }

            const observer = new MutationObserver(mutations => {
                let shouldUpdate = false;
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList' || mutation.type === 'characterData') {
                        shouldUpdate = true;
                    }
                });
                if (shouldUpdate) {
                    debouncedUpdate();
                }
            });

            observer.observe(codeBlock, {
                childList: true,
                subtree: true,
                characterData: true,
            });

            debouncedUpdate();
        }
    }

    function observeCodeBlocks(useLiveUpdates) {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            const codeContainers = node.querySelectorAll('div.overflow-y-auto');
                            codeContainers.forEach(container => addLineNumbersInline(container, useLiveUpdates));
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        document.querySelectorAll('div.overflow-y-auto').forEach(container => {
            addLineNumbersInline(container, useLiveUpdates);
        });
    }

    observeCodeBlocks(liveLineNumbers);

})();