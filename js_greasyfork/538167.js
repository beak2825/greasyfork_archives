// ==UserScript==
// @name         L 站小工具
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description 快捷分享：点击【快捷分享】按钮，一键复制当前帖子的“标题、分区、标签和页面链接”，方便快速分享到其他地方。复制评论：点击【复制评论】按钮，复制当前帖子下所有已加载的评论内容。如果评论很多，可以先按住 PageDown 键，等评论都刷出来再复制。
// @match        https://linux.do/t/topic/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538167/L%20%E7%AB%99%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/538167/L%20%E7%AB%99%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Constants
    const STORAGE_KEYS = {
        POSITION: 'copyHelperUnitPosition_linuxdo_v2',
        VISIBILITY: 'copyHelperVisibility_linuxdo_v1'
    };
    const COPY_FEEDBACK_DURATION = 1500;
    const ERROR_FEEDBACK_DURATION = 2000;

    // Add styles
    GM_addStyle(`
        .copy-helper-unit {
            position: fixed;
            z-index: 10000;
            background-color: rgba(240, 240, 240, 0.9);
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            padding: 8px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            user-select: none;
            cursor: grab;
            bottom: 10px; /* Default position */
            right: 10px;  /* Default position */
            transition: opacity 0.3s ease;
        }
        .copy-helper-unit.dragging {
            cursor: grabbing;
            opacity: 0.8;
        }
        .copy-helper-unit.collapsed {
            width: 30px;
            height: 30px;
            padding: 0;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(0, 123, 255, 0.8);
            color:white;
        }
        .copy-helper-unit.collapsed .copy-helper-button {
            display: none;
        }
        .copy-helper-unit.collapsed .toggle-collapse {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color:white;
            background-color: transparent;
        }
        .toggle-collapse {
            align-self: flex-end;
            background-color: transparent;
            color: #555;
            border: none;
            font-size: 16px;
            cursor: pointer;
            padding: 0;
            margin: -5px -5px 0 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .toggle-collapse:hover {
            color: #000;
        }
        .copy-helper-button {
            padding: 8px 12px;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 13px;
            transition: background-color 0.3s ease, transform 0.1s ease;
            text-align: center;
            background-color: #007bff;
        }
        .copy-helper-button:hover {
            background-color: #0056b3;
        }
        .copy-helper-button:active {
            transform: scale(0.98);
        }
        .copy-helper-button.copied {
            background-color: #28a745 !important;
        }
        .copy-helper-button.error {
            background-color: #dc3545 !important;
        }
    `);

    /**
     * Makes an element draggable
     * @param {HTMLElement} element - The element to make draggable
     * @param {string} storageKey - Key for storing position in GM storage
     * @returns {Object} - Draggable control object
     */
    function makeDraggable(element, storageKey) {
        let isDragging = false;
        let offsetX, offsetY;
        let wasDraggedInThisSession = false;
        
        // Load saved position
        try {
            const savedPositionJSON = GM_getValue(storageKey);
            if (savedPositionJSON) {
                const savedPosition = JSON.parse(savedPositionJSON);
                if (savedPosition && typeof savedPosition.left === 'string' && typeof savedPosition.top === 'string') {
                    element.style.left = savedPosition.left;
                    element.style.top = savedPosition.top;
                    element.style.right = 'auto';
                    element.style.bottom = 'auto';
                }
            }
        } catch (e) {
            console.error(`Error loading saved position: ${e.message}`);
        }

        // Start drag
        function handleStart(e) {
            // Get clientX/Y from either mouse or touch event
            const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
            const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
            
            // Prevent dragging if click target is one of the action buttons
            if (e.target === metadataButton || e.target === contentButton) return;
            
            isDragging = true;
            wasDraggedInThisSession = false;
            element.classList.add('dragging');
            
            const rect = element.getBoundingClientRect();
            offsetX = clientX - rect.left;
            offsetY = clientY - rect.top;
            
            if (e.preventDefault) e.preventDefault();
        }
        
        // During drag
        function handleMove(e) {
            if (!isDragging) return;
            
            // Get clientX/Y from either mouse or touch event
            const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
            const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
            
            wasDraggedInThisSession = true;

            let newX = clientX - offsetX;
            let newY = clientY - offsetY;

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const unitWidth = element.offsetWidth;
            const unitHeight = element.offsetHeight;

            // Keep in viewport bounds
            newX = Math.max(0, Math.min(newX, viewportWidth - unitWidth));
            newY = Math.max(0, Math.min(newY, viewportHeight - unitHeight));

            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;
            element.style.right = 'auto';
            element.style.bottom = 'auto';
            
            if (e.preventDefault) e.preventDefault();
        }
        
        // End drag
        function handleEnd(e) {
            if (!isDragging) return;
            
            isDragging = false;
            element.classList.remove('dragging');

            if (wasDraggedInThisSession) {
                const currentPosition = {
                    left: element.style.left,
                    top: element.style.top
                };
                GM_setValue(storageKey, JSON.stringify(currentPosition));
            }
        }
        
        // Mouse events
        element.addEventListener('mousedown', handleStart);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        
        // Touch events for mobile support
        element.addEventListener('touchstart', handleStart, { passive: false });
        document.addEventListener('touchmove', handleMove, { passive: false });
        document.addEventListener('touchend', handleEnd);
        
        return {
            wasDragged: () => wasDraggedInThisSession,
            cleanup: () => {
                element.removeEventListener('mousedown', handleStart);
                document.removeEventListener('mousemove', handleMove);
                element.removeEventListener('mouseup', handleEnd);
                element.removeEventListener('touchstart', handleStart);
                document.removeEventListener('touchmove', handleMove);
                element.removeEventListener('touchend', handleEnd);
            }
        };
    }

    /**
     * Shows feedback on a button after an action
     * @param {HTMLElement} button - The button to show feedback on
     * @param {string} message - Feedback message
     * @param {string} type - Feedback type ('success' or 'error')
     * @param {number} duration - Duration in ms
     */
    function showButtonFeedback(button, message, type = 'success', duration = COPY_FEEDBACK_DURATION) {
        const originalText = button.textContent;
        button.textContent = message;
        
        if (type === 'success') {
            button.classList.add('copied');
        } else {
            button.classList.add('error');
        }
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied', 'error');
        }, duration);
    }

    // Create UI elements
    const draggableUnit = document.createElement('div');
    draggableUnit.classList.add('copy-helper-unit');
    
    // Toggle collapse button
    const toggleButton = document.createElement('button');
    toggleButton.classList.add('toggle-collapse');
    toggleButton.innerHTML = '−';
    toggleButton.title = '收起/展开';
    draggableUnit.appendChild(toggleButton);
    
    // Metadata copy button
    const metadataButton = document.createElement('button');
    metadataButton.textContent = '快捷分享';
    metadataButton.classList.add('copy-helper-button');
    metadataButton.title = '复制标题、分类、标签和链接';
    draggableUnit.appendChild(metadataButton);

    // Content copy button
    const contentButton = document.createElement('button');
    contentButton.textContent = '复制评论';
    contentButton.classList.add('copy-helper-button');
    contentButton.title = '复制所有评论内容';
    draggableUnit.appendChild(contentButton);

    // Add to DOM and make draggable
    document.body.appendChild(draggableUnit);
    const draggableControl = makeDraggable(draggableUnit, STORAGE_KEYS.POSITION);
    
    // Load saved visibility state
    try {
        const isCollapsed = GM_getValue(STORAGE_KEYS.VISIBILITY) === 'collapsed';
        if (isCollapsed) {
            draggableUnit.classList.add('collapsed');
            toggleButton.innerHTML = '+';
        }
    } catch (e) {
        console.error(`Error loading visibility state: ${e.message}`);
    }
    
    // Toggle collapse/expand
    toggleButton.addEventListener('click', (e) => {
        if (draggableControl.wasDragged()) { // Don't toggle if a drag just ended
            return;
        }
        e.stopPropagation();
        
        const isCurrentlyCollapsed = draggableUnit.classList.contains('collapsed');
        draggableUnit.classList.toggle('collapsed');
        toggleButton.innerHTML = isCurrentlyCollapsed ? '−' : '+';
        
        GM_setValue(STORAGE_KEYS.VISIBILITY, isCurrentlyCollapsed ? 'expanded' : 'collapsed');
    });

    // Copy metadata (title, category, tags, URL)
    metadataButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (draggableControl.wasDragged()) return;
        
        try {
            // Cache DOM queries for performance
            const url = window.location.href;
            const topicTitleElement = document.querySelector('.title-wrapper .fancy-title');
            const titleText = topicTitleElement ? topicTitleElement.textContent.trim().replace(/\s+/g, ' ') : '无标题信息';
            
            const tags = Array.from(document.querySelectorAll('a.discourse-tag'))
                .map(tag => tag.textContent.trim())
                .join(', ');
            const tagsText = tags || '无标签';
            
            const categoryElement = document.querySelector(".badge-category__name, .topic-category .badge-category");
            const categoryText = categoryElement ? categoryElement.textContent.trim() : '无分区信息';
            
            const textToCopy = `${titleText}\n【${categoryText}】【${tagsText}】\n${url}`;
            GM_setClipboard(textToCopy);
            
            showButtonFeedback(metadataButton, '已复制!');
        } catch (e) {
            console.error(`Error copying metadata: ${e.message}`);
            showButtonFeedback(metadataButton, '复制失败', 'error');
        }
    });

    // Copy content
    contentButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (draggableControl.wasDragged()) return;
        
        try {
            const cookedElements = document.querySelectorAll('.cooked');
            
            if (cookedElements.length === 0) {
                showButtonFeedback(contentButton, '无内容可复制', 'error', ERROR_FEEDBACK_DURATION);
                return;
            }
            
            const allContent = Array.from(cookedElements)
                .map(item => item.textContent.trim().replace(/\s+/g, ' '));
            const textToCopy = allContent.join('\n\n');
            
            GM_setClipboard(textToCopy);
            showButtonFeedback(contentButton, '已复制!');
        } catch (e) {
            console.error(`Error copying content: ${e.message}`);
            showButtonFeedback(contentButton, '复制失败', 'error');
        }
    });
    
    // Cleanup on page unload
    window.addEventListener('unload', () => {
        draggableControl.cleanup();
    });
})();