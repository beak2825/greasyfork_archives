// ==UserScript==
// @name                Qidian Chapter Downloader
// @name:zh-CN          起点(qidian.com)章节下载器
// @namespace           http://tampermonkey.net/
// @version             0.8
// @description         Download chapter content from Qidian (qidian.com)
// @description:zh-CN   从起点下载章节文本
// @author              oovz
// @match               https://www.qidian.com/chapter/*
// @grant               none
// @source              https://gist.github.com/oovz/3257e1acd16ef2fa2913b430d95dc283
// @source              https://greasyfork.org/en/scripts/531290-qidian-chapter-downloader
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/531290/Qidian%20Chapter%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/531290/Qidian%20Chapter%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configure your XPath here
    const TITLE_XPATH = '//div[contains(@class, "chapter-wrapper")]//div[contains(@class, "print")]//h1'; // Fill this with your XPath
    const CONTENT_XPATH = '//div[contains(@class, "chapter-wrapper")]//div[contains(@class, "print")]//main/p'; // Base path to p elements
    const CONTENT_SPAN_XPATH = '//div[contains(@class, "chapter-wrapper")]//div[contains(@class, "print")]//main/p/span[@class="content-text"]'; // For p with span structure
    const CHAPTER_WRAPPER_XPATH = '//div[contains(@class, "chapter-wrapper")]';
    const NEXT_CHAPTER_BUTTON_XPATH = '//div[@class="nav-btn-group"]/a[last()]';
    const AUTHOR_SAY_XPATH = '//section[@id="r-authorSay"]//p[@class="trans"]'; // XPath for author say

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

    // Extract text function
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
                // Get only direct text content and exclude child elements for title
                if (xpath === TITLE_XPATH) {
                    let directTextContent = '';
                    for (let j = 0; j < node.childNodes.length; j++) {
                        const childNode = node.childNodes[j];
                        if (childNode.nodeType === Node.TEXT_NODE) {
                            directTextContent += childNode.textContent;
                        }
                    }
                    directTextContent = directTextContent.trim();
                    if (directTextContent) {
                        results.push(directTextContent);
                    }
                } else {
                    // For content and author say, get full text content including children, preserving whitespace
                    const textContent = node.textContent; // Keep original whitespace
                    // Only push if the content is not just whitespace
                    if (textContent && textContent.trim()) {
                        results.push(textContent);
                    }
                }
            }
        }
        return results;
    }

    // Initial extraction
    function updateTitleOutput() {
        const elements = getElementsByXpath(TITLE_XPATH);
        return elements.join('\n');
    }

    function updateContentOutput(includeAuthorSayFlag) {
        // Try to get content from spans first
        let elements = getElementsByXpath(CONTENT_SPAN_XPATH);
        
        // If no spans found, try direct p tags but filter out those with spans to avoid duplications
        if (elements.length === 0) {
            // First, get all p elements
            const pElements = document.evaluate(
                CONTENT_XPATH,
                document,
                null,
                XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                null
            );
            
            for (let i = 0; i < pElements.snapshotLength; i++) {
                const pNode = pElements.snapshotItem(i);
                // Check if this p element has span children
                const hasSpans = pNode.querySelectorAll('span').length > 0;
                
                if (!hasSpans) {
                    // Only get text from p elements that don't have spans
                    const textContent = pNode.textContent; // Keep original whitespace
                    // Only push if the content is not just whitespace
                    if (textContent && textContent.trim()) {
                        elements.push(textContent);
                    }
                }
            }
        }
        
        // Join elements, do not trim here to preserve first line indentation
        let content = elements.join('\n');

        // Append author say if requested
        if (includeAuthorSayFlag) {
            const authorSayElements = getElementsByXpath(AUTHOR_SAY_XPATH);
            if (authorSayElements.length > 0) {
                // Join author say elements, do not trim here
                const authorSayContent = authorSayElements.join('\n');
                // Add separation if both content and author say exist and are not just whitespace
                if (content.trim() && authorSayContent.trim()) {
                    content += '\n\n---\n\n' + authorSayContent; // Add separator
                } else if (authorSayContent.trim()) { // Only author say exists (and is not just whitespace)
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
        // Find the next chapter link using the provided XPath
        const nextChapterQuery = document.evaluate(
            NEXT_CHAPTER_BUTTON_XPATH,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        );
        
        const nextChapterLink = nextChapterQuery.singleNodeValue;
        
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

    // Find the chapter wrapper element to observe
    const chapterWrapperQuery = document.evaluate(
        CHAPTER_WRAPPER_XPATH,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    );
    
    const chapterWrapper = chapterWrapperQuery.singleNodeValue;
    
    // Update when the chapter wrapper changes
    if (chapterWrapper) {
        const observer = new MutationObserver(() => {
            updateOutput();
        });
        
        observer.observe(chapterWrapper, {
            childList: true,
            subtree: true,
            characterData: true
        });
    } else {
        console.error('Chapter wrapper element not found.');
    }
})();