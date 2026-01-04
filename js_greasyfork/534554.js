// ==UserScript==
// @name         AI Studio Arabic RTL Fix
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Fix RTL text direction in AI Studio Google for Arabic language only
// @author       Adapted from Javad's script
// @match        https://aistudio.google.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534554/AI%20Studio%20Arabic%20RTL%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/534554/AI%20Studio%20Arabic%20RTL%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Function to detect Arabic text only
    function containsArabic(text) {
        // Unicode range for Arabic characters only
        const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
        return arabicRegex.test(text);
    }
    
    // Function to apply RTL direction to elements
    function applyRTLDirection() {
        // Target message containers and text elements
        const textElements = document.querySelectorAll('.message-container, .message-content, p, li, pre, h1, h2, h3, h4, h5, h6');
        
        textElements.forEach(element => {
            const text = element.innerText || element.textContent;
            if (!text) return;
            
            if (containsArabic(text)) {
                element.dir = "rtl";
                element.style.textAlign = "right";
                
                // Handle parent elements for lists
                if (element.tagName === 'LI') {
                    const parentList = element.closest('ul, ol');
                    if (parentList) {
                        parentList.dir = "rtl";
                        parentList.style.paddingRight = "40px";
                        parentList.style.paddingLeft = "0";
                        parentList.style.marginRight = "0";
                        parentList.style.marginLeft = "0";
                    }
                    
                    // Improved bullet point and number alignment
                    element.style.listStylePosition = "outside";
                    element.style.marginRight = "20px";
                }
            } else {
                element.dir = "ltr";
                element.style.textAlign = "left";
                
                // Reset list styling for LTR if needed
                if (element.tagName === 'LI') {
                    const parentList = element.closest('ul, ol');
                    if (parentList && !containsArabic(parentList.innerText)) {
                        parentList.dir = "ltr";
                        parentList.style.paddingLeft = "40px";
                        parentList.style.paddingRight = "0";
                        parentList.style.marginLeft = "0";
                        parentList.style.marginRight = "0";
                    }
                }
            }
        });
        
        // Specifically target lists and apply RTL styling
        const lists = document.querySelectorAll('ul, ol');
        lists.forEach(list => {
            const text = list.innerText || list.textContent;
            if (containsArabic(text)) {
                list.dir = "rtl";
                list.style.paddingRight = "20px";
                list.style.paddingLeft = "0";
                list.style.marginRight = "0";
                list.style.marginLeft = "0";
                
                // Apply RTL to all child list items with improved alignment
                const items = list.querySelectorAll('li');
                items.forEach(item => {
                    item.dir = "rtl";
                    item.style.textAlign = "right";
                    item.style.listStylePosition = "outside";
                    
                    // Add custom styling for better alignment
                    if (list.tagName === 'OL') {
                        // For numbered lists
                        list.style.listStyleType = "arabic-indic";
                        item.style.marginRight = "20px";
                    } else {
                        // For bullet points
                        item.style.marginRight = "20px";
                    }
                });
            }
        });
        
        // Add specific styling for Arabic code blocks
        const codeBlocks = document.querySelectorAll('pre, code');
        codeBlocks.forEach(block => {
            const text = block.innerText || block.textContent;
            if (containsArabic(text)) {
                block.dir = "rtl";
                block.style.textAlign = "right";
                block.style.fontFamily = "Tahoma, Arial, sans-serif";
            }
        });
        
        // Add custom CSS for better RTL list alignment
        addCustomCSS();
    }
    
    // Function to add custom CSS for better RTL list alignment
    function addCustomCSS() {
        if (document.getElementById('rtl-fix-css')) return;
        
        const styleEl = document.createElement('style');
        styleEl.id = 'rtl-fix-css';
        styleEl.textContent = `
            [dir="rtl"] ul {
                list-style-type: disc;
                padding-right: 20px !important;
                padding-left: 0 !important;
            }
            
            [dir="rtl"] ol {
                list-style-type: arabic-indic;
                padding-right: 20px !important;
                padding-left: 0 !important;
            }
            
            [dir="rtl"] li {
                display: list-item;
                text-align: right !important;
                margin-right: 20px !important;
            }
        `;
        document.head.appendChild(styleEl);
    }
    
    // Run initially
    applyRTLDirection();
    
    // Set up periodic check
    setInterval(applyRTLDirection, 1000);
    
    // Set up MutationObserver to detect new content
    const observer = new MutationObserver(function(mutations) {
        applyRTLDirection();
    });
    
    // Start observing the document
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
})();