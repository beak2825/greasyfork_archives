// ==UserScript==
// @name                Changpei Chapter Downloader
// @name:zh-CN          长佩章节下载器
// @namespace           http://tampermonkey.net/
// @version             0.2
// @description         Download chapter content from Changpei(gongzicp.com)
// @description:zh-CN   从长佩(gongzicp.com)下载章节文本
// @author              oovz
// @match               *://*gongzicp.com/read-*.html
// @grant               none
// @source              https://gist.github.com/oovz/8c1c38607ed01cb594ebbd4913ff2c60
// @source              https://greasyfork.org/en/scripts/536172-changpei-chapter-downloader
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/536172/Changpei%20Chapter%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/536172/Changpei%20Chapter%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';    
    // Configure your selectors here
    const APP_WRAPPER_SELECTOR = '#app'; // for MutationObserver
    const TITLE_SELECTOR = 'div.title > div.name'; // for title
    const CONTENT_SELECTOR = 'div.h-reader > div.content'; // for content
    const NEXT_CHAPTER_BASE_SELECTOR = 'div#readPage div.item > a'; // for next chaper link
    const NEXT_ICON_IDENTIFIER = 'ic_next'; // for next chapter icon
    const AUTHOR_SAY_SELECTOR = 'div.h-reader div.postscript > div.value'; // for author say

    // Internationalization
    const isZhCN = navigator.language.toLowerCase() === 'zh-cn' || 
                   document.documentElement.lang.toLowerCase() === 'zh-cn';
    
    const i18n = {
        copyText: isZhCN ? '复制文本' : 'Copy Content',
        copiedText: isZhCN ? '已复制!' : 'Copied!',
        nextChapter: isZhCN ? '下一章' : 'Next Chapter',
        noNextChapter: isZhCN ? '没有下一章' : 'No Next Chapter',
        includeAuthorSay: isZhCN ? '包含作家说' : 'Include Author Say',
        excludeAuthorSay: isZhCN ? '排除作家说' : 'Exclude Author Say'
    };

    // State variable for author say inclusion
    let includeAuthorSay = true;

    // Create GUI elements
    const gui = document.createElement('div');
    gui.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        padding: 15px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        z-index: 9999;
        resize: both;
        overflow: visible;
        min-width: 350px;
        min-height: 250px;
        max-width: 100vw;
        max-height: 80vh;
        resize-origin: top-left;
        display: flex;
        flex-direction: column;
    `;

    // Add CSS for custom resize handle at top-left
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .resize-handle {
            position: absolute;
            width: 14px;
            height: 14px;
            top: 0;
            left: 0;
            cursor: nwse-resize;
            z-index: 10000;
            background-color: #888;
            border-top-left-radius: 5px;
            border-right: 1px solid #ccc;
            border-bottom: 1px solid #ccc;
        }

        .spinner-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(240, 240, 240, 0.8);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 10001;
        }
    `;
    document.head.appendChild(style);

    // Create resize handle
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    
    const output = document.createElement('textarea');
    output.style.cssText = `
        width: 100%;
        flex: 1;
        margin-bottom: 8px;
        resize: none;
        overflow: auto;
        box-sizing: border-box;
        min-height: 180px;
    `;
    output.readOnly = true;

    // Create button container for horizontal layout
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-bottom: 2px;
    `;

    // Create toggle author say button
    const toggleAuthorSayButton = document.createElement('button');
    toggleAuthorSayButton.textContent = includeAuthorSay ? i18n.excludeAuthorSay : i18n.includeAuthorSay;
    toggleAuthorSayButton.style.cssText = `
        padding: 4px 12px;
        cursor: pointer;
        background-color: #fbbc05; /* Yellow */
        color: white;
        border: none;
        border-radius: 15px;
        font-weight: bold;
        font-size: 0.9em;
    `;

    const copyButton = document.createElement('button');
    copyButton.textContent = i18n.copyText;
    copyButton.style.cssText = `
        padding: 4px 12px;
        cursor: pointer;
        background-color: #4285f4;
        color: white;
        border: none;
        border-radius: 15px;
        font-weight: bold;
        font-size: 0.9em;
    `;

    // Create next chapter button
    const nextChapterButton = document.createElement('button');
    nextChapterButton.textContent = i18n.nextChapter;
    nextChapterButton.style.cssText = `
        padding: 4px 12px;
        cursor: pointer;
        background-color: #34a853;
        color: white;
        border: none;
        border-radius: 15px;
        font-weight: bold;
        font-size: 0.9em;
    `;

    // Add buttons to container
    buttonContainer.appendChild(toggleAuthorSayButton);
    buttonContainer.appendChild(copyButton);
    buttonContainer.appendChild(nextChapterButton);

    // Create spinner overlay for better positioning
    const spinnerOverlay = document.createElement('div');
    spinnerOverlay.className = 'spinner-overlay';
    
    // Create spinner
    const spinner = document.createElement('div');
    spinner.style.cssText = `
        width: 30px;
        height: 30px;
        border: 4px solid rgba(0,0,0,0.1);
        border-radius: 50%;
        border-top-color: #333;
        animation: spin 1s ease-in-out infinite;
    `;
    
    spinnerOverlay.appendChild(spinner);

    // Add elements to GUI
    gui.appendChild(resizeHandle);
    gui.appendChild(output);
    gui.appendChild(buttonContainer);
    gui.appendChild(spinnerOverlay);
    document.body.appendChild(gui);

    // Custom resize functionality
    let isResizing = false;
    let originalWidth, originalHeight, originalX, originalY;

    resizeHandle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isResizing = true;
        originalWidth = parseFloat(getComputedStyle(gui).width);
        originalHeight = parseFloat(getComputedStyle(gui).height);
        originalX = e.clientX;
        originalY = e.clientY;
        
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    });

    function resize(e) {
        if (!isResizing) return;
        
        const width = originalWidth - (e.clientX - originalX);
        const height = originalHeight - (e.clientY - originalY);
        
        if (width > 300 && width < window.innerWidth * 0.8) {
            gui.style.width = width + 'px';
            // Keep right position fixed and adjust left position
            gui.style.right = getComputedStyle(gui).right;
        }
        
        if (height > 250 && height < window.innerHeight * 0.8) {
            gui.style.height = height + 'px';
            // Keep bottom position fixed and adjust top position
            gui.style.bottom = getComputedStyle(gui).bottom;
        }
    }

    function stopResize() {
        isResizing = false;
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    }
    
    // Helper function to find the next chapter link
    function findNextChapterLink() {
        // Find all navigation links
        const navLinks = document.querySelectorAll(NEXT_CHAPTER_BASE_SELECTOR);
        
        console.log(`Found ${navLinks.length} navigation link candidates`);
        
        // Look for the link with the next chapter icon
        for (const link of navLinks) {
            const iconImg = link.querySelector('img.iconfont');
            
            if (iconImg) {
                console.log(`Found icon with src: ${iconImg.src}`);
                
                if (iconImg.src && iconImg.src.includes(NEXT_ICON_IDENTIFIER)) {
                    console.log(`Found next chapter link: ${link.href}`);
                    return link;
                }
            }
        }
        
        console.log('No next chapter link found');
        return null; // No next chapter link found
    }

    // Legacy XPath extraction function (kept for fallback compatibility)
    function getElementsByXpath(xpath) {
        const results = [];
        const query = document.evaluate(
            xpath, 
            document, 
            null, 
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, 
            null
        );
        
        for (let i = 0; i < query.snapshotLength; i++) {
            const node = query.snapshotItem(i);
            if (node) {
                // Get full text content including children, preserving whitespace
                const textContent = node.textContent; // Keep original whitespace
                // Only push if the content is not just whitespace
                if (textContent && textContent.trim()) {
                    results.push(textContent);
                }
            }
        }
        return results;
    }    
    // Initial extraction
    function updateTitleOutput() {
        // Use querySelector with the new selector for title
        const titleElement = document.querySelector(TITLE_SELECTOR);
        if (titleElement) {
            // Extract direct text content, similar to XPath approach
            let directTextContent = '';
            for (let i = 0; i < titleElement.childNodes.length; i++) {
                const childNode = titleElement.childNodes[i];
                if (childNode.nodeType === Node.TEXT_NODE) {
                    directTextContent += childNode.textContent;
                }
            }
            return directTextContent.trim();
        }
        return '';
    }

    function updateContentOutput(includeAuthorSayFlag) {
        // Use querySelector to get the content container
        const contentContainer = document.querySelector(CONTENT_SELECTOR);
        let elements = [];
        
        if (contentContainer) {
            // Get all p elements within the content container
            const paragraphs = contentContainer.querySelectorAll('p');
            
            // Process each paragraph, excluding those with the "watermark" class
            paragraphs.forEach(p => {
                // Skip paragraphs with the "watermark" class
                if (!p.classList.contains('watermark')) {
                    const textContent = p.textContent;
                    // Only add paragraphs that have non-whitespace content
                    if (textContent && textContent.trim()) {
                        elements.push(textContent);
                    }
                }
            });
        }

        if (elements.length === 0) {
            console.error('no elements found for content, maybe using canvas');
        }
        
        // Join elements, do not trim here to preserve first line indentation
        let content = elements.join('\n');

        // Append author say if requested
        if (includeAuthorSayFlag) {
            // Use querySelector for author say with the new selector
            const authorSayElement = document.querySelector(AUTHOR_SAY_SELECTOR);
            let authorSayContent = '';
            
            if (authorSayElement) {
                authorSayContent = authorSayElement.textContent.trim();
            }
            
            // Add author say content if it exists
            if (authorSayContent) {
                // Add separation if both content and author say exist
                if (content.trim()) {
                    content += '\n\n---\n\n' + authorSayContent; // Add separator
                } else {
                    content = authorSayContent;
                }
            }
        }

        return content; // Return potentially leading-whitespace content
    }

    // Async update function
    async function updateOutput() {
        // Show spinner overlay
        spinnerOverlay.style.display = 'flex';
        
        // Use setTimeout to make it async and not block the UI
        setTimeout(() => {
            try {
                const title = updateTitleOutput();
                const content = updateContentOutput(includeAuthorSay); // Pass the state
                output.value = title ? title + '\n\n' + content : content;
            } catch (error) {
                console.error('Error updating output:', error);
            } finally {
                // Hide spinner when done
                spinnerOverlay.style.display = 'none';
            }
        }, 0);
    }

    // Run initial extraction
    updateOutput();

    // Add event listener for toggle author say button
    toggleAuthorSayButton.addEventListener('click', () => {
        includeAuthorSay = !includeAuthorSay; // Toggle state
        toggleAuthorSayButton.textContent = includeAuthorSay ? i18n.excludeAuthorSay : i18n.includeAuthorSay;
        updateOutput(); // Update the content
    });

    // Add event listener for copy button
    copyButton.addEventListener('click', () => {
        output.select();
        document.execCommand('copy');
        copyButton.textContent = i18n.copiedText;
        setTimeout(() => {
            copyButton.textContent = i18n.copyText;
        }, 1000);
    });

    // Add event listener for next chapter button
    nextChapterButton.addEventListener('click', () => {
        // Find the next chapter link using our helper function
        const nextChapterLink = findNextChapterLink();
        
        if (nextChapterLink) {
            // Navigate to the next chapter
            window.location.href = nextChapterLink.href;
        } else {
            // Show a message if there's no next chapter
            nextChapterButton.textContent = i18n.noNextChapter;
            nextChapterButton.style.backgroundColor = '#ea4335';
            
            setTimeout(() => {
                nextChapterButton.textContent = i18n.nextChapter;
                nextChapterButton.style.backgroundColor = '#34a853';
            }, 2000);
        }
    });

    // Find the content container element to observe (using the content selector)
    const contentElement = document.querySelector(APP_WRAPPER_SELECTOR);
    
    // Setup MutationObserver to watch for changes
    if (contentElement) {
        const observer = new MutationObserver(() => {
            updateOutput();
        });
        
        observer.observe(contentElement, {
            childList: true,
            subtree: true,
            characterData: true
        });
        
        // Also observe the document body for any structural changes that might affect the content
        observer.observe(document.body, {
            childList: true,
            subtree: false // Only direct children of body
        });
    } else {
        console.error('Content element not found. Cannot setup observer.');
    }
})();