// ==UserScript==
// @name         晋江章节修改高亮
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  高亮修改过的章节，区别首发时间和更新时间
// @author       oovz
// @match        *://www.jjwxc.net/onebook.php?novelid=*
// @exclude      *://www.jjwxc.net/onebook.php?novelid=*&chapterid=*
// @source       https://greasyfork.org/en/scripts/536627-%E6%99%8B%E6%B1%9F%E7%AB%A0%E8%8A%82%E4%BF%AE%E6%94%B9%E9%AB%98%E4%BA%AE
// @source       https://gist.github.com/oovz/e1f36ff2bf18c0ab64180e785f837a12
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/536627/%E6%99%8B%E6%B1%9F%E7%AB%A0%E8%8A%82%E4%BF%AE%E6%94%B9%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/536627/%E6%99%8B%E6%B1%9F%E7%AB%A0%E8%8A%82%E4%BF%AE%E6%94%B9%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const HIGHLIGHT_COLOR = '#FFFACD'; // Light yellow
    const TOGGLE_BUTTON_ID = 'toggle-chapter-highlight';
    const STORAGE_KEY = 'jjwxc-chapter-highlight-enabled';
    
    GM_addStyle(`
        .chapter-modified {
            background-color: ${HIGHLIGHT_COLOR} !important;
        }
        #${TOGGLE_BUTTON_ID} {
            margin-left: 10px;
            cursor: pointer;
        }
        #${TOGGLE_BUTTON_ID}:hover {
            text-decoration: underline;
        }
        .highlight-tooltip {
            position: relative;
            display: inline-block;
        }
        .highlight-tooltip .tooltip-text {
            visibility: hidden;
            width: 200px;
            background-color: #FFF8DC;
            color: #000;
            text-align: center;
            border-radius: 3px;
            border: 1px solid #DEB887;
            padding: 3px 5px;
            position: absolute;
            z-index: 1000;
            bottom: 125%;
            left: 50%;
            margin-left: -100px;
            opacity: 0;
            transition: opacity 0.3s;
            font-size: 12px;
        }
        .highlight-tooltip:hover .tooltip-text {
            visibility: visible;
            opacity: 1;
        }
    `);
    
    // State
    // highlighting is enabled by default
    const storedValue = localStorage.getItem(STORAGE_KEY);
    let isHighlightEnabled = storedValue === null || storedValue === 'true'; // Default to enabled if not set
    
    /**
     * Find all chapter rows in the document
     * @returns {NodeList} List of chapter rows
     */
    function findChapterRows() {
        // latest updated chapter will have itemprop="chapter newestChapter"
        return document.querySelectorAll('tr[itemprop*="chapter"]');
    }
    
    /**
     * Extract the publish time from a chapter row
     * @param {Element} chapterRow - The TR element representing a chapter
     * @returns {string|null} The extracted publish time or null if not found
     */
    function getPublishTimeFromChapter(chapterRow) {
        try {
            const titleCell = chapterRow.querySelector("td[title]");
            if (!titleCell || !titleCell.title) {
                return null;
            }
            
            // Title will contain both store and publish times
            // '章节存稿时间：2022-09-09 16:23:42\n章节首发时间：2022-09-09 16:25:00'
            const titleText = titleCell.title;
            
            // Extract the publish time after "章节首发时间："
            const publishTimeMatch = titleText.match(/章节首发时间：([^\n]+)/);
            if (publishTimeMatch && publishTimeMatch[1]) {
                return publishTimeMatch[1].trim();
            }
        } catch (e) {
            console.warn('Error extracting publish time:', e);
        }
        return null; // No publish time found
    }
    
    /**
     * Extract the update time from a chapter row
     * @param {Element} chapterRow - The TR element representing a chapter
     * @returns {string|null} The extracted update time or null if not found
     */
    function getUpdateTimeFromChapter(chapterRow) {
        try {
            return chapterRow.querySelector("td[title] > span:not([id='latestUpdates'])").textContent.trim();
        } catch (e) {
            console.warn('Error extracting update time:', e);
        }
        return null; // No update time found
    }
    
    /**
     * Apply highlighting to chapters with different publish vs update times
     */
    function highlightModifiedChapters() {
        const chapterRows = findChapterRows();
        let modifiedCount = 0;
        
        chapterRows.forEach(row => {
            try {
                const publishTime = getPublishTimeFromChapter(row);
                const updateTime = getUpdateTimeFromChapter(row);
                
                if (publishTime && updateTime && publishTime !== updateTime) {
                    // Different times - highlight the row
                    row.classList.add('chapter-modified');
                    // Store original classes if needed for toggling
                    if (!row.dataset.originalBg) {
                        row.dataset.originalBg = 'saved';
                    }
                    modifiedCount++;
                }
            } catch (e) {
                console.warn('Error processing chapter row:', e);
            }
        });
        
        console.log(`Found ${modifiedCount} modified chapters out of ${chapterRows.length} total`);
    }
    
    /**
     * Remove all highlighting from chapter rows
     */
    function removeHighlights() {
        const chapterRows = findChapterRows();
        chapterRows.forEach(row => {
            row.classList.remove('chapter-modified');
        });
    }
    
    /**
     * Create and insert the toggle button
     */
    function createToggleButton() {
        // Find the second tr element in the document
        const secondRow = document.querySelector('tbody > tr:nth-of-type(2) > td');
        
        if (!secondRow) {
            console.error('Cannot insert toggle button');
        } else {
            // Create toggle button wrapper with tooltip
            const wrapper = document.createElement('span');
            wrapper.className = 'highlight-tooltip';
            wrapper.style.marginLeft = '10px';
            
            const button = createButton();
            wrapper.appendChild(button);
            
            const tooltip = document.createElement('span');
            tooltip.className = 'tooltip-text';
            tooltip.textContent = '高亮显示更新时间与首发时间不同的章节';
            wrapper.appendChild(tooltip);
            
            // Insert the button at the end of the second row
            secondRow.appendChild(wrapper);
        }
    }
    
    /**
     * Create the toggle button element
     * @returns {HTMLElement} The created button
     */
    function createButton() {
        // Create a link that looks like a button
        const button = document.createElement('a');
        button.id = TOGGLE_BUTTON_ID;
        button.href = 'javascript:void(0);'; // Make it clickable but not navigate
        button.textContent = isHighlightEnabled ? '[插件：关闭章节高亮]' : '[插件：开启章节高亮]';
        button.style.color = '#FF0000'; // Red text color
        button.style.textDecoration = 'none'; // No underline
        
        // Add click handler
        button.addEventListener('click', handleToggleClick);
        
        return button;
    }
    
    /**
     * Handle toggle button click - toggle highlighting on/off
     */
    function handleToggleClick() {
        isHighlightEnabled = !isHighlightEnabled;
        
        const button = document.getElementById(TOGGLE_BUTTON_ID);
        if (button) {
            button.textContent = isHighlightEnabled ? '[插件：关闭章节高亮]' : '[插件：开启章节高亮]';
        }
        
        if (isHighlightEnabled) {
            highlightModifiedChapters();
        } else {
            removeHighlights();
        }
        
        try {
            localStorage.setItem(STORAGE_KEY, isHighlightEnabled ? 'true' : 'false');
        } catch (e) {
            console.warn('Could not save highlight preference to localStorage', e);
        }
    }
    
    /**
     * Initialize the script
     */
    function initialize() {
        console.log('Initializing chapter highlight script...');
        createToggleButton();
        if (isHighlightEnabled) {
            highlightModifiedChapters();
        }
    }
    
    // Wait for the DOM to be ready before initializing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();