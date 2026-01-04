// ==UserScript==
// @name         抖音复制文案
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  在日期旁边添加复制按钮，用于复制指定区域内所有span的文本内容。对抖音网站类名变化适应性更强，并尝试处理多个目标区域 (videoSideBar, video-info-wrap)。
// @author       cores
// @match        https://www.douyin.com/*
// @license MIT
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/536710/%E6%8A%96%E9%9F%B3%E5%A4%8D%E5%88%B6%E6%96%87%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/536710/%E6%8A%96%E9%9F%B3%E5%A4%8D%E5%88%B6%E6%96%87%E6%A1%88.meta.js
// ==/UserScript==

(function() {
    'use_strict';

    // --- 配置项 ---
    const TARGET_CONTAINER_IDS = ['videoSideBar', 'video-info-wrap']; // 目标总容器的ID列表
    const BR_MARKER = '%%BR_MARKER%%'; // 用于临时替换<br>的标记

    const COPY_ICON_SVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle;">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
    `; // 复制图标的SVG代码

    // --- 辅助函数 ---

    function createCopyIconElement() {
        const iconContainer = document.createElement('span');
        iconContainer.innerHTML = COPY_ICON_SVG;
        iconContainer.style.cursor = 'pointer';
        iconContainer.style.marginLeft = '8px';
        iconContainer.style.display = 'inline-flex';
        iconContainer.style.alignItems = 'center';
        iconContainer.setAttribute('title', '复制内容到剪贴板');
        iconContainer.classList.add('gm-copy-icon-container');
        return iconContainer;
    }

    function showNotification(message) {
        const existingNotification = document.querySelector('.gm-copy-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        const notification = document.createElement('div');
        notification.textContent = message;
        GM_addStyle(`
            .gm-copy-notification {
                position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
                background-color: #323232; color: white; padding: 10px 20px;
                border-radius: 5px; z-index: 2147483647; font-size: 14px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2); opacity: 0;
                transition: opacity 0.3s ease-in-out;
            }
            .gm-copy-notification.show { opacity: 1; }
        `);
        notification.className = 'gm-copy-notification';
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 2500);
    }

    function extractTextWithLineBreaks(element) {
        if (!element) return '';
        const clonedElement = element.cloneNode(true);
        const spansInClone = clonedElement.querySelectorAll('span');
        spansInClone.forEach(span => {
            const brTags = span.querySelectorAll('br');
            brTags.forEach(br => {
                if (br.parentNode) {
                    br.parentNode.replaceChild(document.createTextNode(BR_MARKER), br);
                }
            });
        });
        let rawContentFromSpans = '';
        const walker = document.createTreeWalker(clonedElement, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            let parent = node.parentNode;
            let isInsideSpan = false;
            while (parent && parent !== clonedElement.parentNode && parent !== clonedElement) {
                if (parent.nodeName === 'SPAN') {
                    isInsideSpan = true;
                    break;
                }
                parent = parent.parentNode;
            }
            if (isInsideSpan) {
                rawContentFromSpans += node.nodeValue;
            }
        }
        let textWithNewlines = rawContentFromSpans.replace(new RegExp(BR_MARKER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '\n');
        const lines = textWithNewlines.split('\n');
        const processedLines = lines.map(line => line.trim().replace(/\s+/g, ' '));
        let finalText = processedLines.join('\n');
        finalText = finalText.replace(/\n{3,}/g, '\n\n');
        return finalText.trim();
    }

    /**
     * Checks if a given element is likely a date span.
     * @param {HTMLElement} element - The element to check.
     * @returns {boolean} True if it's likely a date span, false otherwise.
     */
    function isLikelyDate(element) {
        if (!element || element.tagName !== 'SPAN') return false;

        const textContent = element.textContent ? element.textContent.trim() : '';
        if (textContent.length >= 60 || textContent.length < 2) return false; // e.g. "刚刚" is 2 chars
        if (textContent.startsWith('@')) return false;

        // Heuristic: Prefer spans that directly hold the date text or have minimal simple children.
        if (element.children.length > 1) {
            let simpleChildren = true;
            for (const child of element.children) {
                if (child.tagName !== 'SPAN' || child.children.length > 0) { // Allow only simple span children
                    simpleChildren = false;
                    break;
                }
            }
            if (!simpleChildren) return false;
        }

        const hasDot = textContent.includes('·');
        const looksLikeTimeAgo = /(\d+\s*(分钟|小时|天|周|月|年)前|刚刚)/.test(textContent);
        const looksLikeSpecificDate = /\d{2,4}-\d{1,2}-\d{1,2}|\d+月\d+日/.test(textContent);
        const isGenerallyDateLike = textContent.includes('发布') || textContent.includes('投稿');

        if (hasDot && (looksLikeTimeAgo || looksLikeSpecificDate || textContent.includes("小时") || textContent.includes("发布"))) return true;
        if (looksLikeTimeAgo) return true;
        if (looksLikeSpecificDate && !textContent.includes('@') && textContent.length < 20) return true;
        if (isGenerallyDateLike && textContent.length < 20) return true;

        return false;
    }

    // --- 主要逻辑 ---
    function initializeScript() {
        for (const targetId of TARGET_CONTAINER_IDS) {
            const targetElements = document.querySelectorAll('#' + targetId);
            if (targetElements.length === 0) {
                // console.log(`Tampermonkey: No elements found for ID: ${targetId}`);
                continue;
            }

            for (const currentTargetContainer of targetElements) {
                let dateSpanElement = null;
                // Search for spans only within the currentTargetContainer
                const allSpansInThisContainer = Array.from(currentTargetContainer.querySelectorAll('span'));

                for (const potentialDateSpan of allSpansInThisContainer) {
                    if (potentialDateSpan.querySelector('.gm-copy-icon-container')) {
                        continue; // Already has an icon, skip
                    }

                    if (isLikelyDate(potentialDateSpan)) {
                        let commonAncestor = potentialDateSpan.parentElement;
                        let searchLevels = 0;

                        // Search upwards for a common ancestor that also contains a username
                        // Stop if commonAncestor becomes the parent of currentTargetContainer or body
                        while (commonAncestor && commonAncestor !== currentTargetContainer.parentElement && commonAncestor !== document.body && searchLevels < 5) {
                            let userNameNode = null;
                            // Look for username candidates within this common ancestor
                            const candidates = Array.from(commonAncestor.querySelectorAll('span, a, div'));
                            for (const el of candidates) {
                                const elTextContent = el.textContent ? el.textContent.trim() : '';
                                if (elTextContent.startsWith('@') && elTextContent.length > 1) { // Username must have text after @
                                    // Heuristic: username elements are usually not huge containers and text is not excessively long
                                    if (el.children.length < 3 && elTextContent.length < 100) {
                                         // Ensure this username is actually within the *currentTargetContainer* context
                                        if (currentTargetContainer.contains(el)) {
                                            userNameNode = el;
                                            break; // Found a plausible username node
                                        }
                                    }
                                }
                            }

                            if (userNameNode) {
                                // Ensure userNameNode is distinct from potentialDateSpan and they don't contain each other
                                if (userNameNode !== potentialDateSpan && !userNameNode.contains(potentialDateSpan) && !potentialDateSpan.contains(userNameNode)) {
                                    // Check if both potentialDateSpan and userNameNode are relatively "close" descendants
                                    // of the current commonAncestor.
                                    let pDate = potentialDateSpan, pUser = userNameNode;
                                    let depthDate = 0, depthUser = 0;

                                    while (pDate && pDate !== commonAncestor && depthDate < 4) { // Max depth 3 from commonAncestor
                                        pDate = pDate.parentElement;
                                        depthDate++;
                                    }
                                    while (pUser && pUser !== commonAncestor && depthUser < 4) { // Max depth 3 from commonAncestor
                                        pUser = pUser.parentElement;
                                        depthUser++;
                                    }

                                    // If both are valid descendants and relatively shallow under commonAncestor
                                    if (pDate === commonAncestor && pUser === commonAncestor) {
                                        dateSpanElement = potentialDateSpan;
                                        break; // Break from while (commonAncestor loop)
                                    }
                                }
                            }
                            if (dateSpanElement) break; // Found date for this common ancestor search
                            commonAncestor = commonAncestor.parentElement;
                            searchLevels++;
                        } // End while commonAncestor

                        if (dateSpanElement) {
                            break; // Break from for (potentialDateSpan loop) as we found our target for this container
                        }
                    } // End if isLikelyDate
                } // End for potentialDateSpan in this container

                if (!dateSpanElement) {
                    // console.log(`Tampermonkey: Suitable date span with username context not found in a container with ID ${targetId}:`, currentTargetContainer);
                    continue; // Move to the next targetElement if multiple share the same ID
                }

                // Double check: ensure no icon was somehow added by another mutation pass
                if (dateSpanElement.querySelector('.gm-copy-icon-container')) {
                    // console.log('Tampermonkey: Icon already exists on target, aborting add for this instance.');
                    continue; // Move to the next targetElement
                }

                const copyIconElement = createCopyIconElement();
                // Capture the specific currentTargetContainer for this event listener
                const containerForEvent = currentTargetContainer;
                copyIconElement.addEventListener('click', (event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    const textToCopy = extractTextWithLineBreaks(containerForEvent); // Use the correct container instance
                    if (textToCopy) {
                        GM_setClipboard(textToCopy, 'text');
                        showNotification('内容已复制到剪贴板!');
                    } else {
                        showNotification('未找到可复制的文字内容。');
                    }
                });

                dateSpanElement.style.display = 'inline-flex';
                dateSpanElement.style.alignItems = 'center';
                dateSpanElement.appendChild(copyIconElement);
                // console.log('Tampermonkey: Copy icon added to:', dateSpanElement.textContent, 'in container:', containerForEvent);
            } // End for each currentTargetContainer
        } // End for each targetId
    }

    // --- 脚本执行 ---
    const observer = new MutationObserver((mutationsList, observerInstance) => {
        // On any DOM change, re-initialize the script to find all target containers.
        // initializeScript itself will iterate through all found containers and IDs.
        initializeScript();
    });

    function observeTarget() {
        // console.log('Tampermonkey: Initializing and observing document body.');
        initializeScript(); // Initial attempt
        // Observe the entire document body for any changes.
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeTarget);
    } else {
        observeTarget();
    }

})();
