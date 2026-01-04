// ==UserScript==
// @name         U3C3 & 1cili Magnet Buttons
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Add buttons to copy magnet links and preview on magnet.pics, works on 1cili.com and other sites
// @author       You
// @match        *://*.u3c3.com/*
// @match        *://hjd2048.com/*
// @match        *://*.u3c3.in/*
// @match        *://*.cctv10.cc/*
// @match        *://*.cctv12.cc/*
// @match        *://*.1cili.com/!*
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531956/U3C3%20%201cili%20Magnet%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/531956/U3C3%20%201cili%20Magnet%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Add CSS for the buttons and preview div
    const style = document.createElement('style');
    style.textContent = `
        .magnet-btn {
            cursor: pointer;
            color: #337ab7;
            margin-left: 5px;
            display: inline-block;
        }
        .magnet-btn:hover {
            color: #23527c;
        }
        .copy-success {
            color: #5cb85c;
        }
        .preview-btn {
            color: #f0ad4e;
        }
        .preview-btn:hover {
            color: #ec971f;
        }
        #preview-overlay {
            position: fixed;
            top: 0;
            right: -450px; /* Initial position offscreen */
            width: 450px;
            height: 100%;
            background-color: #fff;
            z-index: 9999;
            box-shadow: -2px 0 10px rgba(0,0,0,0.3);
            transition: right 0.3s ease;
            display: flex;
            flex-direction: column;
        }
        #preview-overlay.active {
            right: 0;
        }
        #preview-header {
            height: 40px;
            background-color: #f8f8f8;
            border-bottom: 1px solid #ddd;
            display: flex;
            align-items: center;
            padding: 0 10px;
            justify-content: space-between;
        }
        #preview-title {
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 300px;
        }
        #preview-container {
            flex: 1;
            position: relative;
            overflow: hidden;
        }
        #preview-iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
        #preview-close {
            cursor: pointer;
            font-size: 20px;
            color: #666;
            border: none;
            background: transparent;
            width: 28px;
            height: 28px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
        }
        #preview-close:hover {
            background-color: #eee;
            color: #333;
        }
        #preview-loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #333;
            font-size: 18px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        #preview-spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin-bottom: 10px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        #preview-toggle {
            position: fixed;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            width: 20px;
            height: 60px;
            background-color: #f0ad4e;
            border-radius: 5px 0 0 5px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            writing-mode: vertical-rl;
            text-orientation: mixed;
            z-index: 9998;
            box-shadow: -2px 0 5px rgba(0,0,0,0.2);
        }
        .loading-text {
            margin-top: 5px;
        }

        /* Custom styles for 1cili.com */
        .preview-button-1cili {
            background-color: #5bc0de;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 3px;
            cursor: pointer;
            margin-left: 5px;
        }
        .preview-button-1cili:hover {
            background-color: #46b8da;
        }
        .input-group-btn .preview-button-1cili {
            height: 34px;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    `;
    document.head.appendChild(style);

    // Create preview toggle button
    const previewToggle = document.createElement('div');
    previewToggle.id = 'preview-toggle';
    previewToggle.textContent = 'PREVIEW';
    previewToggle.style.display = 'none'; // Initially hidden
    document.body.appendChild(previewToggle);

    // Create preview overlay div (initially positioned off-screen)
    const previewOverlay = document.createElement('div');
    previewOverlay.id = 'preview-overlay';

    // Create header with title and close button
    const previewHeader = document.createElement('div');
    previewHeader.id = 'preview-header';

    const previewTitle = document.createElement('div');
    previewTitle.id = 'preview-title';
    previewTitle.textContent = 'Magnet Preview';

    const previewClose = document.createElement('button');
    previewClose.id = 'preview-close';
    previewClose.innerHTML = '×';

    previewHeader.appendChild(previewTitle);
    previewHeader.appendChild(previewClose);

    const previewContainer = document.createElement('div');
    previewContainer.id = 'preview-container';

    const previewLoading = document.createElement('div');
    previewLoading.id = 'preview-loading';

    const previewSpinner = document.createElement('div');
    previewSpinner.id = 'preview-spinner';

    const loadingText = document.createElement('div');
    loadingText.className = 'loading-text';
    loadingText.textContent = 'Loading...';

    previewLoading.appendChild(previewSpinner);
    previewLoading.appendChild(loadingText);

    const previewIframe = document.createElement('iframe');
    previewIframe.id = 'preview-iframe';
    previewIframe.style.display = 'none'; // Initially hidden until loaded

    previewContainer.appendChild(previewLoading);
    previewContainer.appendChild(previewIframe);

    previewOverlay.appendChild(previewHeader);
    previewOverlay.appendChild(previewContainer);
    document.body.appendChild(previewOverlay);

    // Track if preview panel is currently open
    let isPreviewOpen = false;

    // Function to close the preview
    function closePreview() {
        previewOverlay.classList.remove('active');
        isPreviewOpen = false;

        // After transition completes, reset iframe
        setTimeout(() => {
            if (!isPreviewOpen) {
                previewIframe.src = '';
                previewTitle.textContent = 'Magnet Preview';
            }
        }, 300);
    }

    // Function to toggle preview panel
    function togglePreview() {
        if (isPreviewOpen) {
            closePreview();
        } else {
            previewOverlay.classList.add('active');
            isPreviewOpen = true;
            previewToggle.style.display = 'none';
        }
    }

    // Add click event to toggle button
    previewToggle.addEventListener('click', togglePreview);

    // Add click event to close button
    previewClose.addEventListener('click', () => {
        closePreview();
        previewToggle.style.display = 'flex';
    });

    // Add keyboard event to close preview with ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isPreviewOpen) {
            closePreview();
            previewToggle.style.display = 'flex';
        }
    });

    // Function to show preview
    function showPreview(url, title) {
        // If not already open, open the panel
        if (!isPreviewOpen) {
            previewOverlay.classList.add('active');
            isPreviewOpen = true;
            previewToggle.style.display = 'none';
        }

        // Update title
        previewTitle.textContent = title || 'Magnet Preview';

        // Show loading and hide iframe
        previewIframe.style.display = 'none';
        previewLoading.style.display = 'flex';

        // Set new URL
        previewIframe.src = url;

        // When iframe loads, hide loading indicator and show iframe
        previewIframe.onload = function() {
            previewLoading.style.display = 'none';
            previewIframe.style.display = 'block';
        };
    }

    // Function to extract hash from magnet URL
    function extractHashFromMagnet(magnetUrl) {
        const btihMatch = magnetUrl.match(/urn:btih:([a-zA-Z0-9]+)/i);
        if (btihMatch && btihMatch[1]) {
            return btihMatch[1].toLowerCase();
        }
        return '';
    }

    // Special handling for 1cili.com
    function handle1CiliSite() {
        const magnetBoxes = document.querySelectorAll('.magnet-box');

        if (magnetBoxes.length > 0) {
            // For each magnet box
            magnetBoxes.forEach(box => {
                const inputField = box.querySelector('#input-magnet');
                if (!inputField) return;

                const magnetUrl = inputField.value;
                const hash = extractHashFromMagnet(magnetUrl);

                if (!hash) return;

                // Get title from page
                const pageTitle = document.querySelector('.magnet-title')?.textContent || 'Magnet Preview';

                // Find the input-group-btn div where the existing buttons are
                const btnGroup = box.querySelector('.input-group-btn');

                if (btnGroup) {
                    // Create a new preview button
                    const previewBtn = document.createElement('a');
                    previewBtn.className = 'btn preview-button-1cili';
                    previewBtn.innerHTML = '<svg class="svg-icon"><use xlink:href="/assets/icons.svg#icon-search"></use></svg>';
                    previewBtn.title = '预览 Preview';
                    previewBtn.href = 'javascript:void(0);';

                    // Add click event for preview
                    previewBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();

                        // Show preview toggle button
                        previewToggle.style.display = 'flex';

                        // Open preview in side panel
                        const previewUrl = `https://beta.magnet.pics/m/${hash}`;
                        showPreview(previewUrl, pageTitle);
                    });

                    // Add the button to the button group
                    btnGroup.appendChild(previewBtn);
                }
            });
        }
    }

    // Handle regular sites (u3c3, hjd2048, etc.)
    function handleRegularSites() {
        // Find all magnet links
        const magnetLinks = document.querySelectorAll('a[href^="magnet:"]');

        // Add buttons alongside each magnet link
        magnetLinks.forEach(magnetLink => {
            // Get the magnet URL
            const magnetUrl = magnetLink.getAttribute('href');

            // Extract the hash part (btih) from the magnet link
            const hashPart = extractHashFromMagnet(magnetUrl);
            if (!hashPart) return;

            // Get associated title if available (usually from parent element or nearby elements)
            let title = '';
            // Try to find the title from the closest heading or title-containing element
            const parentRow = magnetLink.closest('tr') || magnetLink.closest('.row') || magnetLink.closest('li');
            if (parentRow) {
                const possibleTitleElement = parentRow.querySelector('h3, h4, .title, strong') ||
                                           parentRow.querySelector('a[title]');
                if (possibleTitleElement) {
                    title = possibleTitleElement.textContent.trim() ||
                           possibleTitleElement.getAttribute('title');
                }
            }

            // Fallback if no title found
            if (!title) {
                // Try to extract title from magnet link
                const titleMatch = magnetUrl.match(/&dn=([^&]+)/);
                if (titleMatch && titleMatch[1]) {
                    title = decodeURIComponent(titleMatch[1].replace(/\+/g, ' '));
                } else {
                    title = `Magnet: ${hashPart.substring(0, 8)}...`;
                }
            }

            // Create copy button
            const copyBtn = document.createElement('a');
            copyBtn.href = 'javascript:void(0);';  // Prevent navigation
            copyBtn.innerHTML = '<i class="fa fa-fw fa-copy"></i>';
            copyBtn.className = 'magnet-btn';
            copyBtn.title = 'Copy Magnet Link';
            copyBtn.setAttribute('data-magnet', magnetUrl);

            // Add click event to copy the magnet link
            copyBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const magnetUrl = this.getAttribute('data-magnet');

                // Copy to clipboard
                GM_setClipboard(magnetUrl);

                // Visual feedback
                this.classList.add('copy-success');
                this.title = 'Copied!';

                // Reset after 1.5 seconds
                setTimeout(() => {
                    this.classList.remove('copy-success');
                    this.title = 'Copy Magnet Link';
                }, 1500);
            });

            // Create preview button
            const previewBtn = document.createElement('a');
            previewBtn.href = 'javascript:void(0);';  // Prevent navigation
            previewBtn.innerHTML = '<i class="fa fa-fw fa-eye"></i>';
            previewBtn.className = 'magnet-btn preview-btn';
            previewBtn.title = 'Preview on magnet.pics';
            previewBtn.setAttribute('data-hash', hashPart);
            previewBtn.setAttribute('data-title', title);

            // Add click event to open preview in side panel
            previewBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const hash = this.getAttribute('data-hash');
                const title = this.getAttribute('data-title');
                if (hash) {
                    // Show the preview toggle button in case it was hidden
                    previewToggle.style.display = 'flex';

                    // Open preview in side panel
                    const previewUrl = `https://beta.magnet.pics/m/${hash}`;
                    showPreview(previewUrl, title);
                }
            });

            // Add the buttons right after the magnet link
            magnetLink.insertAdjacentElement('afterend', previewBtn);
            magnetLink.insertAdjacentElement('afterend', copyBtn);
        });
    }

    // Check which site we're on and apply the appropriate handler
    const hostname = window.location.hostname;
    if (hostname.includes('1cili.com')) {
        handle1CiliSite();
    } else {
        handleRegularSites();
    }
})();