// ==UserScript==
// @name         文本网页自由复制-Markdown (可拖动按钮)
// @namespace    http://tampermonkey.net/
// @version      3.2.0
// @description  修复了Turndown库加载的竞态条件问题，并优化了复制逻辑，确保稳定可靠地将选定内容复制为Markdown。
// @author       shenfangda
// @match        *://*/*
// @exclude      https://accounts.google.com/*
// @exclude      https://*.google.com/sorry/*
// @exclude      https://mail.google.com/*
// @exclude      /^https?://localhost[:/]/
// @exclude      /^file:///*/
// @grant        GM_setClipboard
// @require      https://unpkg.com/turndown/dist/turndown.js
// @license      MIT
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzRDQUY1MCIgd2lkdGg9IjQ4cHgiIGhlaWdodD0iNDhweCI+PHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTIxIDNINWMtMS4xIDAtMiAuOS0yIDJ2MTRjMCAxLjEuOSAyIDIgMmgxNGMxLjEgMCAyLS45IDItMlY1YwAtMS4xLS45LTItMi0yem0tOSAyaDZ2MkgxMlY1em0wIDRoNnYySDEydjloLTJ2LTJIMTBWN2gydjJ6bS03IDRoMlY3SDVWMTFoMlY5em0wIDRoMnYySDV2LTJ6bTEyLTYuNWMyLjQ5IDAgNC41IDIuMDEgNC41IDQuNXM LTIuMDEgNC41LTQuNSA0LjUtNC41LTIuMDEtNC41LTQuNSAyLjAxLTQuNSA0LjUtNC41eiIvPjwvc3ZnPg==
// @downloadURL https://update.greasyfork.org/scripts/529449/%E6%96%87%E6%9C%AC%E7%BD%91%E9%A1%B5%E8%87%AA%E7%94%B1%E5%A4%8D%E5%88%B6-Markdown%20%28%E5%8F%AF%E6%8B%96%E5%8A%A8%E6%8C%89%E9%92%AE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529449/%E6%96%87%E6%9C%AC%E7%BD%91%E9%A1%B5%E8%87%AA%E7%94%B1%E5%A4%8D%E5%88%B6-Markdown%20%28%E5%8F%AF%E6%8B%96%E5%8A%A8%E6%8C%89%E9%92%AE%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Configuration ---
    const BUTTON_TEXT_DEFAULT = '复制为 Markdown';
    const BUTTON_TEXT_SELECTING_FREE = '选择区域中... (ESC 取消)';
    const BUTTON_TEXT_SELECTING_DIV = '点击元素复制 (ESC 取消)';
    const BUTTON_TEXT_COPIED = '已复制!';
    const BUTTON_TEXT_FAILED = '复制失败!';
    const TEMP_MESSAGE_DURATION = 2000; // ms
    const DEBUG = true; // 设置为 true 以获取更详细的日志记录

    // --- Logging ---
    const log = (msg) => console.log(`[Markdown - 复制] ${msg}`);
    const debugLog = (msg) => DEBUG && console.log(`[Markdown - 复制调试] ${msg}`);

    // --- State ---
    let isSelecting = false;
    let isDivMode = false;
    let startX, startY;
    let selectionBox = null;
    let highlightedDiv = null;
    let copyBtn = null;
    let originalButtonText = BUTTON_TEXT_DEFAULT;
    let messageTimeout = null;
    let turndownService = null;

    // --- DOM Ready Check ---
    function onDOMReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    // --- Main Initialization ---
    function initScript() {
        log(`Attempting init on ${window.location.href}`);

        if (window.self !== window.top) {
            log('Script is running in an iframe, aborting.');
            return;
        }
        if (!document.body || !document.head) {
            log('Error: document.body or document.head not found. Retrying...');
            setTimeout(initScript, 500);
            return;
        }

        log('DOM ready, initializing script.');
        turndownService = new TurndownService({
            headingStyle: 'atx',
            hr: '---',
            bulletListMarker: '-',
            codeBlockStyle: 'fenced',
            emDelimiter: '*',
        });
        injectStyles();
        if (!createButton()) return;
        setupEventListeners();
        log('Initialization complete.');
    }

    // --- CSS Injection ---
    function injectStyles() {
        const STYLES = `
            .markdown-copy-btn {
                position: fixed;
                top: 15px;
                right: 15px;
                z-index: 2147483646;
                padding: 8px 14px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 13px;
                font-family: sans-serif;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
                line-height: 1.4;
                text-align: center;
                user-select: none;
            }
            .markdown-copy-btn:hover {
                background-color: #45a049;
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.25);
            }
            .markdown-copy-btn.mc-copied { background-color: #3a8f40; }
            .markdown-copy-btn.mc-failed { background-color: #c0392b; }
            .markdown-copy-btn.dragging {
                cursor: move;
                transform: scale(1.05);
                box-shadow: 0 6px 12px rgba(0,0,0,0.3);
            }
            .markdown-copy-selection-box {
                position: absolute;
                border: 2px dashed #4CAF50;
                background-color: rgba(76, 175, 80, 0.1);
                z-index: 2147483645;
                pointer-events: none;
                box-sizing: border-box;
            }
            .markdown-copy-div-highlight {
                outline: 2px solid #4CAF50!important;
                background-color: rgba(76, 175, 80, 0.1)!important;
                box-shadow: inset 0 0 0 2px rgba(76, 175, 80, 0.5)!important;
                transition: all 0.1s ease-in-out;
                cursor: pointer;
            }
        `;
        try {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'markdown-copy-styles';
            styleSheet.textContent = STYLES.trim().replace(/\s{2,}/g, ' ');
            document.head.appendChild(styleSheet);
            debugLog('Styles injected.');
        } catch (error) {
            log(`Error injecting styles: ${error.message}`);
        }
    }

    // --- Button Creation ---
    function createButton() {
        if (document.getElementById('markdown-copy-btn-main')) {
            log('Button already exists.');
            copyBtn = document.getElementById('markdown-copy-btn-main');
            return true;
        }
        try {
            copyBtn = document.createElement('button');
            copyBtn.id = 'markdown-copy-btn-main';
            copyBtn.className = 'markdown-copy-btn';
            copyBtn.textContent = BUTTON_TEXT_DEFAULT;
            originalButtonText = BUTTON_TEXT_DEFAULT;
            document.body.appendChild(copyBtn);

            const savedPos = localStorage.getItem('markdown-copy-btn-pos');
            if (savedPos) {
                try {
                    const pos = JSON.parse(savedPos);
                    if (pos && typeof pos.left !== 'undefined' && typeof pos.top !== 'undefined') {
                        copyBtn.style.left = pos.left;
                        copyBtn.style.top = pos.top;
                        copyBtn.style.right = 'auto';
                        debugLog(`Restored button position to ${pos.left}, ${pos.top}`);
                    }
                } catch (e) {
                    log('Error parsing saved button position.');
                    localStorage.removeItem('markdown-copy-btn-pos');
                }
            }

            debugLog('Button created and added.');
            return true;
        } catch (error) {
            log(`Error creating button: ${error.message}`);
            return false;
        }
    }

    // --- Dragging Logic for Button ---
    let isDragging = false;
    let dragStartX, dragStartY;
    let btnStartX, btnStartY;
    let wasDragged = false;

    function makeDraggable(btn) {
        btn.addEventListener('mousedown', (e) => {
            if (e.button !== 0 || isSelecting) {
                return;
            }
            e.stopPropagation();

            isDragging = true;
            wasDragged = false;

            dragStartX = e.clientX;
            dragStartY = e.clientY;

            const rect = btn.getBoundingClientRect();
            btnStartX = rect.left;
            btnStartY = rect.top;

            document.addEventListener('mousemove', handleDragMove, { capture: true });
            document.addEventListener('mouseup', handleDragEnd, { capture: true });
        });
    }

    function handleDragMove(e) {
        if (!isDragging) return;

        if (!wasDragged) {
            const dx = Math.abs(e.clientX - dragStartX);
            const dy = Math.abs(e.clientY - dragStartY);
            if (dx > 5 || dy > 5) {
                wasDragged = true;
                copyBtn.classList.add('dragging');
                document.body.style.cursor = 'move';
            }
        }

        if (wasDragged) {
            e.stopPropagation();
            e.preventDefault();

            const deltaX = e.clientX - dragStartX;
            const deltaY = e.clientY - dragStartY;

            let newLeft = btnStartX + deltaX;
            let newTop = btnStartY + deltaY;

            const btnRect = copyBtn.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            if (newLeft < 0) newLeft = 0;
            else if (newLeft + btnRect.width > viewportWidth) newLeft = viewportWidth - btnRect.width;

            if (newTop < 0) newTop = 0;
            else if (newTop + btnRect.height > viewportHeight) newTop = viewportHeight - btnRect.height;

            copyBtn.style.left = `${newLeft}px`;
            copyBtn.style.top = `${newTop}px`;
            copyBtn.style.right = 'auto';
        }
    }

    function handleDragEnd(e) {
        if (!isDragging) return;

        if (wasDragged) {
            e.stopPropagation();
            e.preventDefault();

            const pos = { left: copyBtn.style.left, top: copyBtn.style.top };
            try {
                localStorage.setItem('markdown-copy-btn-pos', JSON.stringify(pos));
                debugLog(`Saved button position: ${JSON.stringify(pos)}`);
            } catch (err) {
                log(`Error saving button position: ${err.message}`);
            }
        }

        isDragging = false;
        copyBtn.classList.remove('dragging');
        if (isSelecting) {
            document.body.style.cursor = isDivMode ? 'pointer' : 'crosshair';
        } else {
            document.body.style.cursor = 'default';
        }

        document.removeEventListener('mousemove', handleDragMove, { capture: true });
        document.removeEventListener('mouseup', handleDragEnd, { capture: true });
    }


    // --- Event Listeners Setup ---
    function setupEventListeners() {
        if (!copyBtn) {
            log("Error: Button not found for adding listeners.");
            return;
        }

        copyBtn.addEventListener('click', handleButtonClick);
        document.addEventListener('mousedown', handleMouseDown, true);
        document.addEventListener('mousemove', handleMouseMove, true);
        document.addEventListener('mouseup', handleMouseUp, true);
        document.addEventListener('mouseover', handleMouseOverDiv);
        document.addEventListener('click', handleClickDiv, true);
        document.addEventListener('keydown', handleKeyDown);

        makeDraggable(copyBtn); // Make the button draggable

        debugLog('Event listeners added.');
    }

    // --- Button Click Logic ---
    function handleButtonClick(e) {
        if (wasDragged) {
            return;
        }
        e.stopPropagation();

        if (!isSelecting) {
            isSelecting = true;
            isDivMode = true;
            setButtonState(BUTTON_TEXT_SELECTING_DIV);
            document.body.style.cursor = 'pointer';
            log('Entered Div Selection Mode.');
        } else if (isDivMode) {
            isDivMode = false;
            setButtonState(BUTTON_TEXT_SELECTING_FREE);
            document.body.style.cursor = 'crosshair';
            log('Switched to Free Selection Mode.');
            removeDivHighlight();
        } else {
            resetSelectionState();
            log('Selection cancelled by button click.');
        }
    }

    // --- Mouse Event Handlers for Selection ---
    function handleMouseDown(e) {
        if (isSelecting && !isDivMode && e.button === 0) {
            e.preventDefault();
            e.stopPropagation();
            startX = e.pageX;
            startY = e.pageY;
            selectionBox = document.createElement('div');
            selectionBox.className = 'markdown-copy-selection-box';
            selectionBox.style.left = `${startX}px`;
            selectionBox.style.top = `${startY}px`;
            document.body.appendChild(selectionBox);
        }
    }

    function handleMouseMove(e) {
        if (selectionBox) {
            const currentX = e.pageX;
            const currentY = e.pageY;
            const width = Math.abs(currentX - startX);
            const height = Math.abs(currentY - startY);
            const left = Math.min(currentX, startX);
            const top = Math.min(currentY, startY);
            selectionBox.style.width = `${width}px`;
            selectionBox.style.height = `${height}px`;
            selectionBox.style.left = `${left}px`;
            selectionBox.style.top = `${top}px`;
        } else if (isDivMode && isSelecting) {
            handleMouseOverDiv(e);
        }
    }

    function handleMouseUp(e) {
        if (selectionBox) {
            const rect = selectionBox.getBoundingClientRect();
            document.body.removeChild(selectionBox);
            selectionBox = null;
            if (rect.width > 5 && rect.height > 5) {
                copyContentInRect(rect);
            }
            resetSelectionState();
        }
    }

    function handleMouseOverDiv(e) {
        if (!isDivMode || !isSelecting) return;
        const target = e.target;
        if (target === copyBtn || target.closest('.markdown-copy-btn')) return;

        if (highlightedDiv && highlightedDiv !== target) {
            removeDivHighlight();
        }
        if (target && target.nodeType === 1 && !target.classList.contains('markdown-copy-div-highlight')) {
            highlightedDiv = target;
            highlightedDiv.classList.add('markdown-copy-div-highlight');
        }
    }

    function handleClickDiv(e) {
        if (isDivMode && isSelecting && highlightedDiv) {
            e.preventDefault();
            e.stopPropagation();
            const divToCopy = highlightedDiv;
            removeDivHighlight();
            copyElementAsMarkdown(divToCopy);
            resetSelectionState();
        }
    }

    // --- Keyboard Event Handler ---
    function handleKeyDown(e) {
        if (e.key === 'Escape' && isSelecting) {
            resetSelectionState();
            log('Selection cancelled by ESC key.');
        }
    }

    // --- State Management ---
    function setButtonState(text, temporary = false, success = null) {
        if (messageTimeout) {
            clearTimeout(messageTimeout);
            messageTimeout = null;
        }
        copyBtn.textContent = text;
        copyBtn.classList.remove('mc-copied', 'mc-failed');
        if (success === true) copyBtn.classList.add('mc-copied');
        if (success === false) copyBtn.classList.add('mc-failed');

        if (temporary) {
            messageTimeout = setTimeout(() => {
                copyBtn.textContent = originalButtonText;
                copyBtn.classList.remove('mc-copied', 'mc-failed');
            }, TEMP_MESSAGE_DURATION);
        } else {
            originalButtonText = text;
        }
    }

    function resetSelectionState() {
        isSelecting = false;
        isDivMode = false;
        document.body.style.cursor = 'default';
        setButtonState(BUTTON_TEXT_DEFAULT);
        if (selectionBox) {
            document.body.removeChild(selectionBox);
            selectionBox = null;
        }
        removeDivHighlight();
    }

    function removeDivHighlight() {
        if (highlightedDiv) {
            highlightedDiv.classList.remove('markdown-copy-div-highlight');
            highlightedDiv = null;
        }
    }

    // --- Core Copying Logic ---
    async function copyContentInRect(rect) {
        try {
            const container = document.createElement('div');
            const elementsInRect = [];

            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, null, false);
            while (walker.nextNode()) {
                const node = walker.currentNode;
                if (node.closest && node.closest('.markdown-copy-btn')) continue;
                if (isNodeVisible(node) && isNodeInRect(node, rect)) {
                    elementsInRect.push(node);
                }
            }

            if (elementsInRect.length === 0) {
                log('没有在选定区域找到可复制的内容。');
                return;
            }

            const topLevelElements = elementsInRect.filter(el => {
                let parent = el.parentElement;
                while (parent) {
                    if (elementsInRect.includes(parent)) {
                        return false;
                    }
                    parent = parent.parentElement;
                }
                return true;
            });

            topLevelElements.forEach(el => container.appendChild(el.cloneNode(true)));

            const htmlContent = container.innerHTML;
            debugLog(`复制的 HTML 内容: ${htmlContent}`);

            if (!htmlContent.trim()) {
                log('没有在选定区域找到可复制的内容。');
                return;
            }

            const markdown = turndownService.turndown(htmlContent);
            await GM_setClipboard(markdown, 'text');
            setButtonState(BUTTON_TEXT_COPIED, true, true);
            log('内容已复制为 Markdown。');
        } catch (error) {
            log(`复制失败： ${error.message}`);
            debugLog(`复制失败的错误: ${error.stack}`);
            setButtonState(BUTTON_TEXT_FAILED, true, false);
        }
    }

    async function copyElementAsMarkdown(element) {
        try {
            const markdown = turndownService.turndown(element);
            await GM_setClipboard(markdown, 'text');
            setButtonState(BUTTON_TEXT_COPIED, true, true);
            log('元素已复制为 Markdown。');
        } catch (error) {
            log(`复制失败： ${error.message}`);
            debugLog(`复制失败的元素： ${element.outerHTML}`);
            debugLog(`复制失败的错误: ${error.stack}`);
            setButtonState(BUTTON_TEXT_FAILED, true, false);
        }
    }

    // --- Utility Functions ---
    function isNodeInRect(node, rect) {
        const nodeRect = node.getBoundingClientRect();
        return (
            nodeRect.top < rect.bottom &&
            nodeRect.bottom > rect.top &&
            nodeRect.left < rect.right &&
            nodeRect.right > rect.left
        );
    }

    function isNodeVisible(node) {
        return !!(node.offsetWidth || node.offsetHeight || node.getClientRects().length);
    }

    // --- Script Entry Point ---
    function checkLibsReady(callback) {
        debugLog('正在检查 Turndown 库...');
        if (typeof TurndownService !== 'undefined' && typeof TurndownService === 'function') {
            debugLog('Turndown 库已就绪。');
            callback();
        } else {
            let attempts = 0;
            const interval = setInterval(() => {
                attempts++;
                if (typeof TurndownService !== 'undefined' && typeof TurndownService === 'function') {
                    clearInterval(interval);
                    debugLog(`Turndown 库在 ${attempts} 次尝试后加载。`);
                    callback();
                } else if (attempts > 20) { // Timeout after 2 seconds
                    clearInterval(interval);
                    log('错误：Turndown 库加载超时。请检查网络连接或脚本的 @require URL。');
                    if(copyBtn) { // Check if button exists before trying to update it
                        copyBtn.textContent = '库加载失败';
                        copyBtn.classList.add('mc-failed');
                        copyBtn.disabled = true;
                    } else { // If button doesn't exist yet, create it to show the error
                        createButton();
                        if(copyBtn){
                            copyBtn.textContent = '库加载失败';
                            copyBtn.classList.add('mc-failed');
                            copyBtn.disabled = true;
                        }
                    }
                }
            }, 100);
        }
    }

    onDOMReady(() => {
        checkLibsReady(initScript);
    });

})();