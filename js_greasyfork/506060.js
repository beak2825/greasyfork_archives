// AsheshDevelopment
// filename: ADK_ChatGPT_QoL_Buttons_Plus.user.js

// ==UserScript==
// @name         🔰 ADK - ChatGPT QoL Buttons Plus 🔰
// @namespace    http://tampermonkey.net/
// @version      3.0.3
// @description  Enhance your ChatGPT experience with custom buttons and a sleek popup interface
// @author       Ashesh Development
// @license      https://gitlab.com/AsheshPlays/tampermonkey-userscripts/-/raw/main/LICENSE
// @match        *://chatgpt.com/*
// @match        *://chat.openai.com/*
// @icon         https://media.chatgptautocontinue.com/images/icons/openai/black/icon48.png?07bf6b7
// @icon64       https://media.chatgptautocontinue.com/images/icons/openai/black/icon64.png?07bf6b7
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/506060/%F0%9F%94%B0%20ADK%20-%20ChatGPT%20QoL%20Buttons%20Plus%20%F0%9F%94%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/506060/%F0%9F%94%B0%20ADK%20-%20ChatGPT%20QoL%20Buttons%20Plus%20%F0%9F%94%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const style = document.createElement('style');
    style.innerHTML = `
        .navigation-buttons {
            margin: 10px 0 0 14px;
            text-align: center;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
        }
        .navigation-buttons button {
            margin: 5px;
            padding: 5px 15px;
            font-size: 14px;
            cursor: pointer;
            background: #66d9ef;
            color: #272822;
            border: none;
            border-radius: 5px;
            transition: background 0.3s;
        }
        .navigation-buttons button:hover {
            background: #a6e22e;
        }
        .author-note {
            margin-top: 10px;
            font-size: 12px;
            color: black;
            background: #D3A52D;
            padding: 5px;
            border-radius: 3px;
            text-align: center;
        }
        .conversation-number {
            position: absolute;
            left: 18px;
            top: 60px;
            font-size: 16px;
            font-weight: bold;
            color: #f92672;
            z-index: 1;
            background: rgba(39, 40, 34, 0.8);
            padding: 9px 12px;
            border-radius: 7px;
            border: 1px solid #f92672;
            cursor: pointer;
        }
        .xl\\:max-w-\\[48rem\\] {
            max-width: 100%;
        }
        [class^="react-scroll-to-bottom--"]::-webkit-scrollbar {
            width: 20px;
        }
        [class^="react-scroll-to-bottom--"]::-webkit-scrollbar-thumb {
            min-height: 5%;
            background: #fd971f;
        }
        .md\\:items-end {
            align-items: flex-end;
            position: absolute;
            left: 0;
            bottom: -45px;
        }
        button.btn.relative.btn-neutral.whitespace-nowrap.-z-0.border-0.md\\:border {
            border-radius: 10px;
            background: #ee0008;
            border: 1px solid #ee0008;
            color: #fff;
        }
        button.btn.relative.btn-neutral.whitespace-nowrap.-z-0.border-0.md\\:border:hover {
            background: #9c1519;
            border: 1px solid #9c1519;
            transition: 0.25s;
        }
        button.btn.relative.btn-neutral.whitespace-nowrap.-z-0.border-0.md\\:border .flex.w-full.gap-2.items-center.justify-center:after {
            content: "last response";
        }
        .dark.bg-gray-950.rounded-md.border-\\[0\\.5px\\].border-token-border-medium {
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        .overflow-y-auto.p-4 {
            order: 1;
            flex-grow: 1;
        }
        .flex.items-center.relative.text-token-text-secondary.bg-token-main-surface-secondary.px-4.py-2.text-xs.font-sans.justify-between.rounded-t-md {
            order: 2;
            direction: rtl;
            background: darkslateblue;
            color: lightgrey;
        }
    `;
    document.head.appendChild(style);

    function addNavigationButtons() {
        const targetDiv = document.querySelector('.relative.px-2.py-2.text-center.text-xs.text-token-text-secondary');
        if (targetDiv) {
            let authorNote = document.querySelector('.author-note');
            if (!authorNote) {
                authorNote = document.createElement('div');
                authorNote.className = 'author-note';
                authorNote.textContent = 'Script by Ashesh Development';
                targetDiv.appendChild(authorNote);
            }
            let navContainer = document.querySelector('.navigation-buttons');
            if (!navContainer) {
                navContainer = document.createElement('div');
                navContainer.className = 'navigation-buttons';
                navContainer.innerHTML = `
                    <button id="prevBtn">Prev.</button>
                    <button id="nextBtn">Next</button>
                    <button id="fullCodeBtn">Full Code</button>
                    <button id="fullCodePlusBtn">Full Code+</button>
                `;
                targetDiv.appendChild(navContainer);
                document.getElementById("nextBtn").addEventListener("click", function () {
                    navigateResponse(1);
                });
                document.getElementById("prevBtn").addEventListener("click", function () {
                    navigateResponse(-1);
                });
                document.getElementById("fullCodeBtn").addEventListener("click", function () {
                    sendMessage("Write the full script without the placeholders and no commented lines. Just write everything without extra line and no explanations. I want the script ready to copy and paste into my IDE and I need it production ready.");
                });
                document.getElementById("fullCodePlusBtn").addEventListener("click", function () {
                    sendMessage("Please write the full script without any placeholders, removing all comments except those necessary for documentation. The script should include all necessary imports, class definitions, methods, logic, and detailed debug logs colorized using the RETRASH color scheme. It must be very detailed, easy to understand, fully functional, complete, and ready to paste directly into my JetBrains Rider IDE. The script must be production-ready, following all specified guidelines, including proper documentation within the code. Ensure that nothing is omitted, and the script is fully complete from start to finish. Always indicate 'AsheshDevelopment' in the first line of the script as a comment and the filename also as a comment on the second line of the script. The debug logs should use the following RETRASH color palette.");
                });
            }
        }
    }

    function sendMessage(message, autosend = true) {
        const textarea = document.querySelector('#prompt-textarea');
        if (textarea) {
            textarea.innerHTML = `<p>${message}</p>`;
            const inputEvent = new Event('input', { bubbles: true });
            textarea.dispatchEvent(inputEvent);
            if (autosend) {
                setTimeout(() => {
                    const keydownEvent = new KeyboardEvent('keydown', {
                        bubbles: true,
                        cancelable: true,
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13
                    });
                    textarea.dispatchEvent(keydownEvent);
                }, 250);
            }
        }
    }

    function navigateResponse(direction) {
        const responses = document.querySelectorAll('[data-testid^="conversation-turn-"]');
        let closestIndex = findClosestResponseIndex(responses);
        closestIndex += direction;
        if (closestIndex >= 0 && closestIndex < responses.length) {
            responses[closestIndex].scrollIntoView({ behavior: "smooth" });
        }
    }

    function findClosestResponseIndex(responses) {
        let closestIndex = 0;
        let minDistance = Infinity;
        const viewportTop = window.scrollY;
        const viewportBottom = viewportTop + window.innerHeight;
        responses.forEach((response, index) => {
            const rect = response.getBoundingClientRect();
            const responseTop = rect.top + window.scrollY;
            const responseBottom = rect.bottom + window.scrollY;
            const distance = Math.min(
                Math.abs(viewportTop - responseTop),
                Math.abs(viewportBottom - responseBottom)
            );
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });
        return closestIndex;
    }

    setTimeout(() => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                addNavigationButtons();
            });
        } else {
            addNavigationButtons();
        }
    }, 2000);

    setInterval(addNavigationButtons, 2000);

    registerMenu();

    const liveLineNumbers = GM_getValue('liveLineNumbers', true);

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

    function registerMenu() {
        GM_registerMenuCommand(
            `Live line numbers: ${GM_getValue('liveLineNumbers', true) ? 'ON' : 'OFF'}`,
            toggleLiveLineNumbers
        );
    }

    function toggleLiveLineNumbers() {
        const isLive = GM_getValue('liveLineNumbers', true);
        GM_setValue('liveLineNumbers', !isLive);
        location.reload();
    }
})();
