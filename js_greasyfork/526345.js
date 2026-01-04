// ==UserScript==
// @name         Thisvid Copy Link Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds copy link buttons to video thumbnails on thisvid.com
// @license      MIT
// @author       You
// @match        https://*.thisvid.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/526345/Thisvid%20Copy%20Link%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/526345/Thisvid%20Copy%20Link%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS
    GM_addStyle(`
        .thumbs-items .info,
        .thumbs-items .percent {
            display: none !important;
        }

        .thumb {
            position: relative !important;
        }

        .copy-link-btn {
            position: absolute !important;
            top: 5px !important;
            right: 5px !important;
            background: rgba(0,0,0,0.7) !important;
            color: white !important;
            border: none !important;
            border-radius: 3px !important;
            padding: 2px 6px !important;
            font-size: 12px !important;
            cursor: pointer !important;
            z-index: 1000 !important;
            display: none !important;
        }

        .thumb:hover .copy-link-btn {
            display: block !important;
        }

        .copy-link-btn:hover {
            background: rgba(0,0,0,0.9) !important;
        }

        .copy-link-btn.copied {
            background: #4CAF50 !important;
        }
    `);

    // Function to add copy buttons
    function addCopyButtons() {
        const thumbs = document.querySelectorAll('.thumbs-items a');
        
        thumbs.forEach(thumb => {
            // Only add button if it doesn't already exist
            if (!thumb.querySelector('.copy-link-btn')) {
                const copyBtn = document.createElement('button');
                copyBtn.className = 'copy-link-btn';
                copyBtn.textContent = '📋';
                copyBtn.title = 'Copy link';
                
                copyBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    try {
                        await navigator.clipboard.writeText(thumb.href);
                        copyBtn.textContent = '✓';
                        copyBtn.classList.add('copied');
                        
                        setTimeout(() => {
                            copyBtn.textContent = '📋';
                            copyBtn.classList.remove('copied');
                        }, 1000);
                    } catch (err) {
                        console.error('Failed to copy:', err);
                    }
                });

                // Add button to the thumbnail container
                const thumbContainer = thumb.querySelector('.thumb');
                if (thumbContainer) {
                    thumbContainer.appendChild(copyBtn);
                }
            }
        });
    }

    // Initial setup
    addCopyButtons();

    // Watch for dynamic content changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                addCopyButtons();
            }
        });
    });

    // Start observing the document for added nodes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();