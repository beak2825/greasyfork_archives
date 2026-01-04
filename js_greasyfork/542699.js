// ==UserScript==
// @name         Imgilism - Image Uploader (Improved)
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Right-click image upload to Mobilism - preserves native context menu
// @author       Sage & AI Improvements
// @match        http://*/*
// @match        https://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_setClipboard
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/542699/Imgilism%20-%20Image%20Uploader%20%28Improved%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542699/Imgilism%20-%20Image%20Uploader%20%28Improved%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    let imgilismMenu = null;
    let currentImageUrl = null;
    let menuTimeout = null;
    
    // Create styles for our menu addon
    const style = document.createElement('style');
    style.textContent = `
        .imgilism-addon-menu {
            position: fixed;
            background: #2c3e50;
            color: white;
            border: 2px solid #3498db;
            border-radius: 6px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 999999;
            min-width: 180px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            font-size: 13px;
            opacity: 0;
            transform: scale(0.95);
            transition: all 0.15s ease-out;
        }
        
        .imgilism-addon-menu.show {
            opacity: 1;
            transform: scale(1);
        }
        
        .imgilism-menu-header {
            padding: 8px 12px;
            background: #3498db;
            font-weight: bold;
            border-radius: 4px 4px 0 0;
            font-size: 12px;
            text-align: center;
        }
        
        .imgilism-menu-item {
            padding: 10px 15px;
            cursor: pointer;
            border-bottom: 1px solid #34495e;
            transition: all 0.2s;
            display: flex;
            align-items: center;
        }
        
        .imgilism-menu-item:hover {
            background: #3498db;
            padding-left: 20px;
        }
        
        .imgilism-menu-item:last-child {
            border-bottom: none;
            border-radius: 0 0 4px 4px;
        }
        
        .imgilism-menu-item .size-info {
            font-size: 11px;
            opacity: 0.7;
            margin-left: auto;
        }
        
        .imgilism-progress {
            padding: 12px 15px;
            background: #27ae60;
            color: white;
            font-style: italic;
            text-align: center;
            border-radius: 4px;
        }
        
        .imgilism-error {
            padding: 12px 15px;
            background: #e74c3c;
            color: white;
            text-align: center;
            border-radius: 4px;
        }
        
        .imgilism-close-btn {
            position: absolute;
            top: 2px;
            right: 5px;
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 16px;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;
    document.head.appendChild(style);
    
    // Create our addon menu
    function createAddonMenu() {
        imgilismMenu = document.createElement('div');
        imgilismMenu.className = 'imgilism-addon-menu';
        imgilismMenu.innerHTML = `
            <button class="imgilism-close-btn" title="Close">×</button>
            <div class="imgilism-menu-header">📸 Imgilism Upload</div>
            <div class="imgilism-menu-item" data-action="single">
                Single <span class="size-info">320x240</span>
            </div>
            <div class="imgilism-menu-item" data-action="multiple">  
                Multiple <span class="size-info">240x160</span>
            </div>
            <div class="imgilism-menu-item" data-action="large">
                Large <span class="size-info">500xAuto</span>
            </div>
        `;
        document.body.appendChild(imgilismMenu);
        
        // Add click handlers
        imgilismMenu.addEventListener('click', function(e) {
            if (e.target.classList.contains('imgilism-close-btn')) {
                hideAddonMenu();
                return;
            }
            
            const action = e.target.closest('.imgilism-menu-item')?.dataset.action;
            if (action && currentImageUrl) {
                uploadImage(currentImageUrl, action);
            }
        });
    }
    
    // Show addon menu near the mouse cursor
    function showAddonMenu(x, y, imageUrl) {
        currentImageUrl = imageUrl;
        
        if (!imgilismMenu) {
            createAddonMenu();
        }
        
        // Position menu, ensuring it stays on screen
        const menuWidth = 180;
        const menuHeight = 140;
        let left = x + 10; // Offset from cursor
        let top = y - 10;
        
        // Keep menu on screen
        if (left + menuWidth > window.innerWidth) {
            left = x - menuWidth - 10;
        }
        if (top + menuHeight > window.innerHeight) {
            top = y - menuHeight + 10;
        }
        
        imgilismMenu.style.left = left + 'px';
        imgilismMenu.style.top = top + 'px';
        imgilismMenu.style.display = 'block';
        
        // Smooth show animation
        setTimeout(() => imgilismMenu.classList.add('show'), 10);
        
        // Auto-hide after 10 seconds if not used
        clearTimeout(menuTimeout);
        menuTimeout = setTimeout(hideAddonMenu, 10000);
    }
    
    // Hide addon menu
    function hideAddonMenu() {
        if (imgilismMenu) {
            imgilismMenu.classList.remove('show');
            setTimeout(() => {
                if (imgilismMenu) imgilismMenu.style.display = 'none';
            }, 150);
        }
        currentImageUrl = null;
        clearTimeout(menuTimeout);
    }
    
    // Listen for right-clicks on images
    document.addEventListener('contextmenu', function(e) {
        const img = e.target.closest('img');
        if (img && img.src) {
            // Small delay to let native menu appear first
            setTimeout(() => {
                showAddonMenu(e.clientX, e.clientY, img.src);
            }, 100);
        } else {
            hideAddonMenu();
        }
    });
    
    // Hide menu when clicking elsewhere or scrolling
    document.addEventListener('click', hideAddonMenu);
    document.addEventListener('scroll', hideAddonMenu);
    
    // Upload image function (keeping original logic)
    function uploadImage(imageUrl, sizeOption) {
        console.log('Starting image upload for:', imageUrl, 'with size option:', sizeOption);
        
        // Show progress
        if (imgilismMenu) {
            imgilismMenu.innerHTML = '<div class="imgilism-progress">🔄 Uploading image...</div>';
        }
        
        // Configure size options
        let height, width, responseId;
        switch(sizeOption) {
            case 'single':
                height = '320';
                width = '';
                responseId = 'codehtml';
                break;
            case 'multiple':
                height = '240';
                width = '160';
                responseId = 'codelbb';
                break;
            case 'large':
                height = '500';
                width = '';
                responseId = 'codehtml';
                break;
        }
        
        // Fetch the image
        GM_xmlhttpRequest({
            method: 'GET',
            url: imageUrl,
            responseType: 'blob',
            timeout: 30000,
            onload: function(response) {
                if (response.status === 200) {
                    const blob = response.response;
                    const fileName = imageUrl.split(/[?#]/)[0].split('/').pop() || 'image.jpg';
                    const file = new File([blob], fileName, { type: blob.type });
                    
                    // Create FormData
                    const formData = new FormData();
                    formData.append('links', '');
                    formData.append('imgUrl', '');
                    formData.append('fileName[]', fileName);
                    formData.append('Search files', 'Browse');
                    formData.append('file[]', file);
                    formData.append('alt[]', fileName.replace(/[-_]/g, ' ').replace(/\.[^.]*$/, ''));
                    formData.append('private[0]', '1');
                    formData.append('new_height[]', height);
                    formData.append('new_width[]', width);
                    formData.append('submit', 'Upload');
                    
                    // Upload to Mobilism
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: 'https://images.mobilism.org/upload.php',
                        data: formData,
                        timeout: 60000,
                        onload: function(uploadResponse) {
                            if (uploadResponse.status === 200) {
                                try {
                                    const parser = new DOMParser();
                                    const responseDoc = parser.parseFromString(uploadResponse.responseText, 'text/html');
                                    const urlElement = responseDoc.getElementById(responseId);
                                    
                                    if (urlElement && urlElement.value) {
                                        const uploadedUrl = urlElement.value.trim();
                                        GM_setClipboard(uploadedUrl);
                                        
                                        // Show success
                                        if (imgilismMenu) {
                                            imgilismMenu.innerHTML = `<div class="imgilism-progress">✅ Copied to clipboard!<br><small>${uploadedUrl}</small></div>`;
                                            setTimeout(hideAddonMenu, 3000);
                                        }
                                        
                                        GM_notification({
                                            text: 'Image uploaded! URL copied to clipboard.',
                                            title: 'Imgilism Success'
                                        });
                                    } else {
                                        throw new Error('Upload URL not found in response');
                                    }
                                } catch (e) {
                                    console.error('Upload processing error:', e);
                                    showError('Failed to process upload response');
                                }
                            } else {
                                showError('Upload failed: ' + uploadResponse.statusText);
                            }
                        },
                        onerror: function() {
                            showError('Upload request failed');
                        },
                        ontimeout: function() {
                            showError('Upload timed out');
                        }
                    });
                } else {
                    showError('Failed to fetch image: ' + response.statusText);
                }
            },
            onerror: function() {
                showError('Failed to fetch image');
            },
            ontimeout: function() {
                showError('Image fetch timed out');
            }
        });
    }
    
    function showError(message) {
        console.error('Imgilism error:', message);
        if (imgilismMenu) {
            imgilismMenu.innerHTML = `<div class="imgilism-error">❌ ${message}</div>`;
            setTimeout(hideAddonMenu, 4000);
        }
        GM_notification({
            text: message,
            title: 'Imgilism Error'
        });
    }
    
})();
