// ==UserScript==
// @name         FB - Group Post Data Collector
// @description  Collect Facebook group posts data with selection interface and export to localhost API
// @namespace    https://github.com/alx/fb-group-post-export
// @supportURL   https://github.com/alx/fb-group-post-export/issues
// @version      1.1
// @author       alx (https://github.com/alx/)
// @match        https://www.facebook.com/groups/*
// @match        https://web.facebook.com/groups/*
// @noframes
// @grant        GM.info
// @grant        GM.registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      MIT; https://opensource.org/licenses/MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAB2AAAAdgB+lymcgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAanSURBVHic5ZtpjBVFEMd/u8vthsCi3OcGxQWBKJdEDEbuDypqNoGgxGgkWY8YDaIYFQ9MRCOJJ0Y80JhgVESiRpCVIAYIIAQPCEoQZCOIyuIB667IPj/8qzPzhveANzPvvX3LP5nMVHdPT1V3VVd1zQwUNroDK4A/gB3A1Pyyk1sUA18DCeBPoBH4FxiRT6ZyiXFI+C+AFsAdRj+TSSfF8fOVM0y281LgP+BwHnnJC75FM15u9BtGV+aNoxyiG7L5H3xlNUgTyjLpqFBNYDJQBKw0ejDQE9gC1GbSUaEOwCQ7r0pDN2sUA78CDUCpla1G9j86X0zlEqOQsJ8b3RaoQ6pfkmlnhWgCQXW/Ag1CNXAi086awwCcVfbfATgOHEReAGAXMone+WIql7geCbvE6F5G7wjbYaGZQFDdpwToZo99aKHrbPQypAGT0t3QnFCBhN1idAlyff8A7cJ2WkgmEFT/S4GOwDoUB4RCIQ3ARDt/ZudL7LwyRdtmhzbAMZT5aWll5wGzgfb5YiqXmIDsf3ncHReKCQTtfwDwGtA1P+zkHi7708/o142ekvaOZoQeKPvzva8sVPYnFQrBBCahuN+pf+jsTyoUygDAWbr7KwF+J4vZnxZxdJICFYQLTxvQzi5h9HCgE7AGOGp9jgGOAJujs5kd3IAECHvc7+vrYSubY/QUo9+Ni9lsrAG97LwN+NiuDwPvAVuN/s7oA0avBjbatdvpQYHa/1w0S1Xo7W0CT7hZRj9o9IdGX4yX7FhodTnJ/jRlLzAerVGrkNC9UAS4A9gf10Oa8gDkJPvTlAdgIooAXf4/K/YflxssBc5HA9rdynoDQ+z6HGAYnu12N7qD0RUo5AXoAlxtbb9Cb4FaAFeidFid3XschccNMckQGpXIR0dxfemO+faMy9LUH0RvikIjqga0QdvS1sBHQH3E/hzGo3RX0P1twlsAy9BXIq8AQ2N6bsa4CM1EnHaZKvuzyZ4zMNB2P1onWhISURdBp0Fx2uHlKORdg+y8E7L5GmBnoG09ihFCyxHVBH6280jgRsKbwGbgJ7sOrvbj0aaohuTPXzoCfYHfyPNC+CrRF7tdvv7SZX/SHfdEYb7o9E3OqI9K9JHidBTnf5JhH+vsXAE8DexGUV8Rmvmu6PO3BNK07sCzaK9RHY39+DAUMZip8AB3kzyrK5Dwg43e4Gu7By18baIwmw2UIWa/yfC+3iiOqAfeRsGO20AttutHrG2RtTsUnd3s4ChnlqfrjFT5MWA9EvIJqxuFIkC/Royzui5Gb6WJwm1XS9PUlyFbriNZwEa8V18gt1aF8ggJ5G3KUYYogbbRTRLViMGKFHW98AboLxTBzQJewhuEJWiWHc7Fyxk8ihbaBPBCVriPAe5z1QmB8g7Aj1a3DAnm0Bt98Oy04QhwJ/L9RXgmMsPKE8B9WZMgIh5HDN4cKH8e792e+5StL/IY6fz7duApu95m9y3AG4xYEHdWuMbOPX1lA4Bb0QJ5O1rlxyIfXorc2jIkJGjnNw251aHoDdBtdp/LN7rnNDm4rO1io8fiqb6L2AaiPzwSSGNap+hnttXvRKGww5dWXp7inryhGH28vAjvD46jaKFz6vwmnrY5tZ+Xoq9StBdwqv9+oH4vWixTDVpeMA5vZQ8etSjEnYYXco+wut0km18nZN/HAn34w9xi9EvML9kRJXPMRbORANYCM4E+QKs07VuhAUkAN/nKL0T7eqc5y/G8yQe+dt2sbAtNAC52/5tT/6FRhgSsxEtqbMWb/XKU80ugMNjFADM42d+PxPMkecUwpIp1nJyPKwKuRTPnojj/sZHkNz/uReeLJO9MX7bymb6y66zsuZjkCI2VxkhVoHwQml0nbB3a269GMzmVZCHddz970dfeDm1RMOQixlo73Ppwb6zSZIh+xsQekhexCXgMrgeu4tQr9RiU0U1YWz/m4Q1gre9osPLpUYWIgipj4klf2RDEbCPwAMn5ueHI17+FNKEaeQCnJQtJxnD05Wc9cEGg7lO7Z0wMcoSGy8q4ha8EL4U1x9duLMoLpHKPjSheCIazg9A+P4EW2SC2W13f6GKEh0tQuK2rW63X4tn3Ajz3uAFtYEYD/dGq77d3kMbcgvdyZVGaZx9C4XDoFHgcuAsxudQYcWrpdn/zjT4MXHOavvqj312dBp1AW95UecqWVn8gRV0kZJoUbY9Uuw+KAdohM9hHcia3FsX7qdAK+fvgTNaTXsBipPqbifgqLA70AN5B+fhTpavjPhqBh+IW5n827DI9G+eQwwAAAABJRU5ErkJggg==
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/547532/FB%20-%20Group%20Post%20Data%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/547532/FB%20-%20Group%20Post%20Data%20Collector.meta.js
// ==/UserScript==

/*
    FB - Group Post Data Collector
    
    This userscript collects Facebook group posts data and allows users to select
    which posts to send to a localhost API endpoint.
    
    Features:
    - Detects posts on Facebook group pages
    - Expands "See more" links to get full content
    - Shows selection dialog with checkboxes for each post
    - Sends selected posts to http://localhost:8080/fetch_post
    
    v1.0 :: January 2025
        Initial release
        Post detection and extraction
        User selection interface
        API integration with localhost endpoint
*/

(async function() {
    'use strict';
    
    // Global variables
    const SCRIPT_VERSION = 'v' + GM.info.script.version;
    let isCollecting = false;
    let collectedPosts = [];
    let selectionDialog = null;
    
    // CSS for UI elements
    const CSS_STYLES = `
        /* Collection Button */
        .fbgpc-button {
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 10000;
            background: #1877f2;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 16px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .fbgpc-button:hover {
            background: #166fe5;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        
        .fbgpc-button:disabled {
            background: #8a8d91;
            cursor: not-allowed;
            transform: none;
        }
        
        /* Dialog Overlay */
        .fbgpc-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.6);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        /* Dialog Container */
        .fbgpc-dialog {
            background: white;
            border-radius: 12px;
            width: 90%;
            max-width: 700px;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        
        /* Dialog Header */
        .fbgpc-header {
            padding: 20px;
            border-bottom: 1px solid #e4e6ea;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .fbgpc-title {
            font-size: 18px;
            font-weight: 600;
            color: #1c1e21;
        }
        
        .fbgpc-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #65676b;
            padding: 4px;
        }
        
        /* Dialog Content */
        .fbgpc-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        }
        
        .fbgpc-controls {
            margin-bottom: 16px;
            display: flex;
            gap: 12px;
        }
        
        .fbgpc-control-btn {
            background: #f0f2f5;
            border: none;
            border-radius: 6px;
            padding: 6px 12px;
            font-size: 12px;
            cursor: pointer;
            color: #65676b;
        }
        
        .fbgpc-control-btn:hover {
            background: #e4e6ea;
        }
        
        /* Post List */
        .fbgpc-posts {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .fbgpc-post-item {
            border: 1px solid #e4e6ea;
            border-radius: 8px;
            padding: 16px;
            display: flex;
            gap: 12px;
        }
        
        .fbgpc-post-checkbox {
            margin-top: 4px;
        }
        
        .fbgpc-post-content {
            flex: 1;
        }
        
        .fbgpc-post-url {
            font-size: 12px;
            color: #65676b;
            margin-bottom: 8px;
            word-break: break-all;
        }
        
        .fbgpc-post-text {
            font-size: 14px;
            color: #1c1e21;
            line-height: 1.4;
        }
        
        .fbgpc-post-text.truncated {
            max-height: 60px;
            overflow: hidden;
        }
        
        /* Image Preview Styles */
        .fbgpc-post-images {
            margin-top: 12px;
        }
        
        .fbgpc-images-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            font-size: 12px;
            color: #65676b;
            font-weight: 600;
        }
        
        .fbgpc-images-toggle {
            background: none;
            border: none;
            cursor: pointer;
            padding: 2px;
            color: #1877f2;
            font-size: 12px;
        }
        
        .fbgpc-images-toggle:hover {
            text-decoration: underline;
        }
        
        .fbgpc-images-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
            gap: 6px;
            max-height: 200px;
            overflow-y: auto;
        }
        
        .fbgpc-image-item {
            position: relative;
            border-radius: 4px;
            overflow: hidden;
            background: #f0f2f5;
            aspect-ratio: 1;
        }
        
        .fbgpc-image-preview {
            width: 100%;
            height: 100%;
            object-fit: cover;
            cursor: pointer;
        }
        
        .fbgpc-image-checkbox {
            position: absolute;
            top: 4px;
            right: 4px;
            width: 16px;
            height: 16px;
            cursor: pointer;
        }
        
        .fbgpc-image-info {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,0.7);
            color: white;
            font-size: 10px;
            padding: 2px 4px;
            opacity: 0;
            transition: opacity 0.2s ease;
        }
        
        .fbgpc-image-item:hover .fbgpc-image-info {
            opacity: 1;
        }
        
        .fbgpc-include-images {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-top: 8px;
            font-size: 12px;
        }
        
        .fbgpc-include-images input[type="checkbox"] {
            margin: 0;
        }
        
        /* Page Post Checkbox Overlay */
        .fbgpc-page-post-overlay {
            position: absolute;
            top: 8px;
            right: 8px;
            z-index: 9999;
            background: rgba(255, 255, 255, 0.95);
            border: 2px solid #1877f2;
            border-radius: 6px;
            padding: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            font-weight: 600;
            color: #1877f2;
            cursor: pointer;
            transition: all 0.2s ease;
            user-select: none;
        }
        
        .fbgpc-page-post-overlay:hover {
            background: rgba(24, 119, 242, 0.1);
            transform: scale(1.02);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        
        .fbgpc-page-post-overlay.unchecked {
            background: rgba(245, 245, 245, 0.95);
            border-color: #8a8d91;
            color: #8a8d91;
        }
        
        .fbgpc-page-post-overlay.unchecked:hover {
            background: rgba(200, 200, 200, 0.1);
        }
        
        .fbgpc-page-post-checkbox {
            margin: 0;
            width: 16px;
            height: 16px;
            cursor: pointer;
        }
        
        .fbgpc-page-post-counter {
            font-size: 11px;
            font-weight: 500;
        }
        
        /* Mark posts with relative positioning for overlay */
        .fbgpc-post-container {
            position: relative !important;
        }
        
        /* Bulk Controls */
        .fbgpc-bulk-controls {
            position: fixed;
            top: 140px;
            right: 20px;
            z-index: 10000;
            background: white;
            border: 1px solid #e4e6ea;
            border-radius: 8px;
            padding: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            display: flex;
            flex-direction: column;
            gap: 4px;
            font-size: 12px;
        }
        
        .fbgpc-bulk-btn {
            background: #f0f2f5;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 12px;
            cursor: pointer;
            color: #65676b;
            transition: background 0.2s ease;
        }
        
        .fbgpc-bulk-btn:hover {
            background: #e4e6ea;
        }
        
        /* Dialog Footer */
        .fbgpc-footer {
            padding: 20px;
            border-top: 1px solid #e4e6ea;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .fbgpc-status {
            font-size: 14px;
            color: #65676b;
        }
        
        .fbgpc-actions {
            display: flex;
            gap: 12px;
        }
        
        .fbgpc-btn {
            border: none;
            border-radius: 6px;
            padding: 8px 16px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .fbgpc-btn-primary {
            background: #1877f2;
            color: white;
        }
        
        .fbgpc-btn-primary:hover {
            background: #166fe5;
        }
        
        .fbgpc-btn-primary:disabled {
            background: #8a8d91;
            cursor: not-allowed;
        }
        
        .fbgpc-btn-secondary {
            background: #f0f2f5;
            color: #1c1e21;
        }
        
        .fbgpc-btn-secondary:hover {
            background: #e4e6ea;
        }
        
        /* Loading Spinner */
        .fbgpc-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid #ffffff50;
            border-top: 2px solid #ffffff;
            border-radius: 50%;
            animation: fbgpc-spin 1s linear infinite;
        }
        
        @keyframes fbgpc-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Toast Notification */
        .fbgpc-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #42b883;
            color: white;
            padding: 12px 16px;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: 10002;
            font-size: 14px;
            font-weight: 500;
            animation: fbgpc-toast-in 0.3s ease;
        }
        
        .fbgpc-toast.error {
            background: #e74c3c;
        }
        
        @keyframes fbgpc-toast-in {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
        }
    `;
    
    // Inject CSS
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = CSS_STYLES;
        document.head.appendChild(style);
    }
    
    // Create collection button
    function createCollectionButton() {
        const button = document.createElement('button');
        button.className = 'fbgpc-button';
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3 2a1 1 0 011-1h8a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V2zm1 0v12h8V2H4z"/>
                <path d="M6 4h4v1H6V4zm0 2h4v1H6V6zm0 2h4v1H6V8z"/>
            </svg>
            Collect Posts
        `;
        button.title = 'Collect Facebook group posts data';
        button.addEventListener('click', handleCollectionClick);
        document.body.appendChild(button);
        return button;
    }
    
    
    // Show toast notification
    function showToast(message, isError = false) {
        const toast = document.createElement('div');
        toast.className = `fbgpc-toast ${isError ? 'error' : ''}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 4000);
    }
    
    // Collect all visible posts on the page (filtered by checkboxes)
    async function collectPosts() {
        collectedPosts = [];
        
        // Clean up removed posts first
        cleanupRemovedPosts();
        
        // Get only selected posts from our checkbox map
        const selectedPosts = Array.from(pagePostCheckboxes.entries())
            .filter(([postElement, data]) => data.checkbox.checked)
            .map(([postElement, data]) => postElement);
        
        console.log(`📊 Starting collection: Found ${selectedPosts.length} selected posts out of ${pagePostCheckboxes.size} total posts`);
        
        let successCount = 0;
        let failureCount = 0;
        
        for (let i = 0; i < selectedPosts.length; i++) {
            const post = selectedPosts[i];
            console.log(`🔄 Processing post ${i + 1}/${selectedPosts.length}...`);
            
            try {
                const postData = await extractPostData(post, i + 1, selectedPosts.length);
                if (postData) {
                    collectedPosts.push(postData);
                    successCount++;
                    console.log(`✅ Post ${i + 1}: Successfully extracted data (ID: ${postData.post_id})`);
                } else {
                    failureCount++;
                    console.warn(`⚠️ Post ${i + 1}: extractPostData returned null/empty`);
                }
            } catch (error) {
                failureCount++;
                console.error(`❌ Post ${i + 1}: Error extracting post data:`, error);
                console.error('Post element:', post);
            }
        }
        
        console.log(`📈 Collection complete: ${successCount} successful, ${failureCount} failed, ${collectedPosts.length} total posts in array`);
        
        // Additional validation
        if (selectedPosts.length > 0 && collectedPosts.length === 0) {
            console.error('🚨 CRITICAL: No posts were successfully collected despite having selected posts!');
        }
    }
    
    // Extract data from a single post
    async function extractPostData(postElement, index, total) {
        console.log(`🔍 extractPostData: Starting extraction for post ${index}/${total}`);
        
        // Update button with progress
        const button = document.querySelector('.fbgpc-button');
        button.innerHTML = `
            <div class="fbgpc-spinner"></div>
            Processing ${index}/${total}...
        `;
        
        try {
            // Generate post URL and extract ID
            const postUrl = findPostLink(postElement);
            if (!postUrl) {
                console.warn(`🔗 Post ${index}: No post URL generated`);
                console.log('Post element:', postElement);
                return null;
            }
            console.log(`🔗 Post ${index}: Generated post URL:`, postUrl);

            const postId = extractPostId(postUrl);

            if (!postId) {
                console.warn(`🆔 Post ${index}: Could not extract post ID from URL:`, postUrl);
                return null;
            }
            
            console.log(`🆔 Post ${index}: Extracted ID: ${postId}`);
            console.log(`🌐 Post ${index}: Cleaned URL: ${postUrl}`);
            
            // Use pre-expanded content if available, otherwise extract current content
            // (expandSeeMore is now called during checkbox selection)
            let postContent;
            const expandedData = expandedContentMap.get(postElement);
            
            if (expandedData && expandedData.expandedContent) {
                postContent = expandedData.expandedContent;
                console.log(`📋 Post ${index}: Using pre-expanded content (${postContent.length} chars)`);
            } else {
                // Fallback to current content extraction if no expanded content is stored
                console.log(`📄 Post ${index}: No pre-expanded content, using fallback extraction`);
                postContent = extractPostContent(postElement);
                
                if (postContent) {
                    console.log(`📄 Post ${index}: Fallback extraction successful (${postContent.length} chars)`);
                } else {
                    console.warn(`📄 Post ${index}: Fallback extraction also failed`);
                }
            }
            
            if (!postContent || postContent.trim().length === 0) {
                console.warn(`📝 Post ${index}: No content found (content: ${postContent ? 'empty string' : 'null'})`);
                return null;
            }
            
            // Extract images from post
            const postImages = extractPostImages(postElement);
            console.log(`📸 Post ${index}: Found ${postImages.length} images`);
            
            const result = {
                post_id: postId,
                post_url: postUrl,
                post_content: postContent.trim(),
                images: postImages,
                includeImages: postImages.length > 0 // Default to true if images exist
            };
            
            console.log(`✅ Post ${index}: Successfully created post data object`);
            return result;
            
        } catch (error) {
            console.error(`❌ Post ${index}: Unexpected error in extractPostData:`, error);
            console.error(`❌ Post ${index}: Error stack:`, error.stack);
            return null;
        }
    }
    
    // Generate post link from document URL (group_id) and image URL (post_id)
    function findPostLink(postElement) {
        console.log(`🔍 findPostLink: Generating post link from document URL and image URLs`);
        
        // Step 1: Extract group_id from current document URL
        const groupId = extractGroupIdFromDocument();
        if (!groupId) {
            console.warn(`⚠️ findPostLink: Could not extract group_id from document URL: ${window.location.href}`);
            return null;
        }
        console.log(`🆔 findPostLink: Extracted group_id: ${groupId}`);
        
        // Step 2: Find post_id from image URLs in the post element
        const postId = extractPostIdFromImages(postElement);
        if (!postId) {
            console.warn(`⚠️ findPostLink: Could not extract post_id from image URLs in post element`);
            return null;
        }
        console.log(`🆔 findPostLink: Extracted post_id: ${postId}`);
        
        // Step 3: Generate the Facebook group post URL
        const postUrl = `https://www.facebook.com/groups/${groupId}/posts/${postId}`;
        console.log(`✅ findPostLink: Generated post URL: ${postUrl}`);
        
        return postUrl;
    }
    
    // Extract group_id from the current document URL
    function extractGroupIdFromDocument() {
        const url = window.location.href;
        console.log(`🔍 extractGroupIdFromDocument: Parsing URL: ${url}`);
        
        // Match pattern: /groups/{groupId}
        const groupIdMatch = url.match(/\/groups\/(\d+)/);
        if (groupIdMatch && groupIdMatch[1]) {
            return groupIdMatch[1];
        }
        
        console.warn(`⚠️ extractGroupIdFromDocument: No group ID found in URL`);
        return null;
    }
    
    // Extract post_id from image URLs containing set=pcb.{postId} pattern
    function extractPostIdFromImages(postElement) {
        console.log(`🔍 extractPostIdFromImages: Searching for image URLs with post_id`);
        
        // Look for img elements with src or data-src containing set=pcb pattern
        const imgElements = postElement.querySelectorAll('img');
        console.log(`   Found ${imgElements.length} img elements to check`);
        
        for (let i = 0; i < imgElements.length; i++) {
            const img = imgElements[i];
            const src = img.src || img.getAttribute('data-src') || img.getAttribute('src');
            
            if (src) {
                console.log(`   Img ${i + 1}: src="${src}"`);
                const postId = extractPostIdFromUrl(src);
                if (postId) {
                    console.log(`   ✅ Found post_id in img src: ${postId}`);
                    return postId;
                }
            }
        }
        
        // Look for anchor elements with href containing set=pcb pattern
        const aElements = postElement.querySelectorAll('a[href*="set=pcb"]');
        console.log(`   Found ${aElements.length} anchor elements with set=pcb to check`);
        
        for (let i = 0; i < aElements.length; i++) {
            const anchor = aElements[i];
            const href = anchor.getAttribute('href');
            
            if (href) {
                console.log(`   Anchor ${i + 1}: href="${href}"`);
                const postId = extractPostIdFromUrl(href);
                if (postId) {
                    console.log(`   ✅ Found post_id in anchor href: ${postId}`);
                    return postId;
                }
            }
        }
        
        console.warn(`⚠️ extractPostIdFromImages: No post_id found in any image or anchor URLs`);
        return null;
    }
    
    // Extract post_id from URL containing set=pcb.{postId} parameter
    function extractPostIdFromUrl(url) {
        if (!url) return null;
        
        // Look for set=pcb.{postId} pattern
        const pcbMatch = url.match(/[?&]set=pcb\.(\d+)/);
        if (pcbMatch && pcbMatch[1]) {
            return pcbMatch[1];
        }
        
        return null;
    }
    
    // Extract post ID from URL
    function extractPostId(href) {
        if (!href) return null;
        
        // Try different patterns for post ID extraction
        const patterns = [
            /\/user\/(\d+)/,
            /\/posts\/(\d+)/,
            /story_fbid=(\d+)/,
            /permalink\/(\d+)/,
            /\/(\d+)\/$/
        ];
        
        for (const pattern of patterns) {
            const match = href.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        return null;
    }
    
    // Clean and construct proper post URL
    function cleanPostUrl(href) {
        if (!href) return null;
        
        let url = href;
        
        // Convert relative URLs to absolute
        if (url.startsWith('/')) {
            url = 'https://www.facebook.com' + url;
        }
        
        // Remove query parameters and hash
        url = url.split('?')[0].split('#')[0];
        
        return url;
    }
    
    // Expand "See more" links to get full content - targets only specific Facebook pattern
    async function expandSeeMore(postElement) {
        try {
            // Add small delay to allow dynamic content to load
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Target only the specific Facebook "See more" button pattern:
            // <div role="button" tabindex="0">See more</div>
            const specificSelector = 'div[role="button"][tabindex="0"]';

            // Fresh DOM query to catch dynamically loaded content
            const candidateElements = Array.from(postElement.querySelectorAll(specificSelector));
            
            console.log(`🔍 Found ${candidateElements.length} div[role="button"][tabindex="0"] elements to check`);
            
            for (let i = 0; i < candidateElements.length; i++) {
                const element = candidateElements[i];
                const text = element.textContent?.trim().toLowerCase();
                
                // Log each candidate element
                console.log(`   Element ${i + 1}: text="${text}"`);
                
                // Exact match for "See more" only (case-insensitive)
                if (text === 'see more') {
                    // Enhanced visibility check
                    const isVisible = element.offsetParent !== null && 
                                    element.offsetWidth > 0 && 
                                    element.offsetHeight > 0 &&
                                    window.getComputedStyle(element).visibility !== 'hidden' &&
                                    window.getComputedStyle(element).display !== 'none';
                    
                    if (isVisible) {
                        console.log(`✅ Found exact Facebook "See more" button match`);
                        
                        try {
                            // Simplified click approach for this specific pattern
                            const clickSuccessful = await clickFacebookButton(element);
                            
                            if (clickSuccessful) {
                                console.log('✅ Successfully clicked Facebook "See more" button');
                                // Wait longer for content to expand (increased from 800ms to 1500ms)
                                await new Promise(resolve => setTimeout(resolve, 1500));
                                return true; // Return true if expanded
                            }
                        } catch (clickError) {
                            console.error('❌ Error clicking Facebook "See more" button:', clickError);
                        }
                    } else {
                        console.log(`⚠️  Facebook "See more" button found but not visible`);
                    }
                } else if (text && text.length > 0) {
                    // Log non-matching text for debugging
                    console.log(`   ⏭️  Skipping element with text "${text}" (not exact "see more" match)`);
                }
            }
            
            console.log('ℹ️  No Facebook "See more" button found or clicked successfully');
            return false; // Return false if no "See more" found
        } catch (error) {
            console.error('❌ Error in expandSeeMore:', error);
            return false;
        }
    }
    
    // Simplified click function optimized for Facebook "See more" buttons
    async function clickFacebookButton(element) {
        try {
            // Approach 1: Standard click (most reliable for Facebook)
            element.click();
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Approach 2: Mouse events for Facebook's event system
            // const clickEvent = new MouseEvent('click', {
            //     bubbles: true,
            //     cancelable: true,
            //     view: window,
            //     detail: 1
            // });
            // element.dispatchEvent(clickEvent);
            
            // Brief delay to allow Facebook's handlers to process
            await new Promise(resolve => setTimeout(resolve, 50));
            
            return true;
        } catch (error) {
            console.error('❌ Error in clickFacebookButton:', error);
            return false;
        }
    }
    
    
    // Extract images from post
    function extractPostImages(postElement) {
        try {
            const images = [];
            
            // Find all img elements within the post
            const imgElements = postElement.querySelectorAll('img');
            
            for (const img of imgElements) {
                const src = img.src || img.getAttribute('data-src');
                if (src && !src.startsWith('data:') && !src.includes('emoji')) {
                    // Skip small images (likely icons or avatars)
                    const width = img.naturalWidth || img.width || 0;
                    const height = img.naturalHeight || img.height || 0;
                    
                    if (width >= 100 && height >= 100) {
                        images.push({
                            url: src,
                            alt: img.alt || '',
                            width: width,
                            height: height,
                            selected: true // Default to selected
                        });
                    }
                }
            }
            
            // Also check for background images in divs
            const divsWithBgImages = postElement.querySelectorAll('div[style*="background-image"]');
            for (const div of divsWithBgImages) {
                const style = div.getAttribute('style');
                const matches = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/);
                if (matches && matches[1]) {
                    const url = matches[1];
                    if (!url.startsWith('data:') && !url.includes('emoji')) {
                        images.push({
                            url: url,
                            alt: '',
                            width: 0,
                            height: 0,
                            selected: true
                        });
                    }
                }
            }
            
            console.log(`📸 Found ${images.length} images in post`);
            return images;
            
        } catch (error) {
            console.error('Error extracting post images:', error);
            return [];
        }
    }

    // Clean innerText content by removing UI elements and artifacts
    function cleanInnerTextContent(innerText) {
        if (!innerText || typeof innerText !== 'string') {
            return null;
        }
        
        console.log('🧹 Original innerText length:', innerText.length);
        console.log('🔍 First 200 chars:', innerText.substring(0, 200));
        
        // Step 1: Split into lines for processing
        let lines = innerText.split('\n');
        console.log(`📄 Total lines: ${lines.length}`);
        
        // Step 2: Advanced content start detection
        let contentStartIndex = -1;
        
        // Method 1: Look for content patterns (ALL CAPS, meaningful phrases)
        const contentPatterns = [
            /^[A-Z][A-Z\s\-_]{10,}$/,  // ALL CAPS titles like "FEMALE ROOMATE - "
            /^(Looking for|Searching for|Available|For rent|For sale)/i,
            /^(Hello|Hi|Bonjour|Hey)\s/i,
            /^(Apartment|House|Room|Car|Job)/i,
            /^\d+€|\$\d+|€\d+/,  // Price indicators
            /^[A-Za-z]{3,}.*[a-zA-Z]{3,}/  // Lines with multiple real words
        ];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Skip empty lines
            if (!line) continue;
            
            // Skip obvious UI noise (single chars, scattered chars)
            if (line.length <= 3) continue;
            if (line.match(/^[a-zA-Z]$/)) continue; // Single letters
            if (line.match(/^[0-9]$/)) continue; // Single numbers
            if (line.match(/^·$/)) continue; // Middle dots
            if (line === 'Follow') continue; // Common UI element
            
            // Skip scattered characters pattern (multiple single chars separated by spaces)
            if (line.match(/^([a-zA-Z]\s){3,}[a-zA-Z]?$/)) {
                console.log(`⏭️  Skipping scattered chars: "${line}"`);
                continue;
            }
            
            // Skip author name/UI combinations
            if (line.includes('·') && line.includes('Follow')) {
                console.log(`⏭️  Skipping author/UI line: "${line}"`);
                continue;
            }
            
            // Check for content patterns
            let isContent = false;
            for (const pattern of contentPatterns) {
                if (pattern.test(line)) {
                    console.log(`✅ Found content pattern match: "${line}"`);
                    isContent = true;
                    break;
                }
            }
            
            if (isContent) {
                contentStartIndex = i;
                break;
            }
            
            // Fallback: lines with reasonable length and multiple words
            if (line.length > 15 && 
                line.split(/\s+/).length >= 3 &&
                !line.includes('·')) {
                console.log(`📝 Found reasonable content fallback: "${line}"`);
                contentStartIndex = i;
                break;
            }
        }
        
        // Method 2: If no pattern match, look for longest meaningful lines
        if (contentStartIndex === -1) {
            console.log('🔄 No pattern match, trying longest line approach...');
            
            let bestLine = { index: -1, score: 0 };
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                
                if (!line || line.length < 10) continue;
                if (line.includes('Follow') && line.includes('·')) continue;
                if (line.match(/^([a-zA-Z]\s){3,}/)) continue; // Skip scattered chars
                
                // Score based on length and word count
                const wordCount = line.split(/\s+/).length;
                const score = line.length + (wordCount * 5);
                
                if (score > bestLine.score && wordCount >= 3) {
                    bestLine = { index: i, score: score };
                    console.log(`🎯 New best line (score ${score}): "${line}"`);
                }
            }
            
            if (bestLine.index !== -1) {
                contentStartIndex = bestLine.index;
            }
        }
        
        if (contentStartIndex === -1) {
            console.log('⚠️  Could not find content start');
            return null;
        }
        
        console.log(`📍 Content starts at line ${contentStartIndex}: "${lines[contentStartIndex].trim()}"`);
        
        // Step 3: Find content end - look for engagement/comment section markers
        let contentEndIndex = lines.length;
        const endMarkers = [
            /^·\s*(See original|Rate this translation)/i,
            /^\+\d+$/,  // +8, +10, etc.
            /^All reactions:?$/i,
            /^\d+\s*\d*\s*(Like|Comment|Share)/i,  // "10 4 Like Comment Share"
            /^(Like|Comment|Share)$/i,
            /^View more comments/i,
            /^Write a public comment/i,
            /^❌$/,
            /^[A-Za-z\s]+ · Follow$/,  // "Name · Follow" pattern
            /^\d+[hdmyw]$/, // "25m", "1h", "2d", etc.
            /^See translation$/i,
            /^Reply$/i,
            /^View \d+ repl(y|ies)$/i
        ];
        
        for (let i = contentStartIndex + 1; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Check if this line matches any end marker
            for (const marker of endMarkers) {
                if (marker.test(line)) {
                    console.log(`🛑 Found end marker at line ${i}: "${line}"`);
                    contentEndIndex = i;
                    break;
                }
            }
            
            if (contentEndIndex < lines.length) break;
            
            // Also end if we hit a line that looks like user comments (Name + short message)
            if (line.length < 100 && 
                i < lines.length - 2 && 
                lines[i + 1].trim().match(/^\d+[hdmyw]$/)) { // Followed by timestamp
                contentEndIndex = i;
                console.log(`🛑 Found comment pattern at line ${i}: "${line}"`);
                break;
            }
        }
        
        console.log(`📍 Content ends at line ${contentEndIndex}`);
        
        // Step 4: Extract and clean the main content
        if (contentStartIndex === -1 || contentStartIndex >= contentEndIndex) {
            console.log('⚠️  Could not find valid content boundaries');
            return null;
        }
        
        let mainContent = lines.slice(contentStartIndex, contentEndIndex).join('\n');
        
        // Step 5: Final cleaning
        mainContent = mainContent
            .replace(/\n{3,}/g, '\n\n')  // Reduce excessive newlines
            .replace(/·\s*(See original|Rate this translation)/gi, '')  // Remove translation artifacts
            .replace(/^\s+|\s+$/g, '')   // Trim whitespace
            .replace(/\s+/g, ' ')        // Normalize spaces (after newline processing)
            .trim();
        
        console.log('✅ Cleaned content length:', mainContent.length);
        console.log('📝 Final content preview:', mainContent.substring(0, 150) + '...');
        
        return mainContent.length > 30 ? mainContent : null;
    }

    // Validate cleaned content quality
    function validateContentQuality(content) {
        if (!content || typeof content !== 'string') {
            return { valid: false, reason: 'Empty or invalid content' };
        }
        
        // Check minimum length
        if (content.length < 30) {
            return { valid: false, reason: 'Content too short' };
        }
        
        // Check for common UI artifacts that shouldn't be in cleaned content
        const uiArtifacts = [
            'Like Comment Share',
            'All reactions:',
            'Write a public comment',
            '❌',
            /^\+\d+$/,
            /^\d+\s*\d*\s*Like/
        ];
        
        for (const artifact of uiArtifacts) {
            if (typeof artifact === 'string' && content.includes(artifact)) {
                return { valid: false, reason: `Contains UI artifact: "${artifact}"` };
            } else if (artifact instanceof RegExp && artifact.test(content)) {
                return { valid: false, reason: `Contains UI pattern: ${artifact}` };
            }
        }
        
        // Check content has reasonable word-to-character ratio (should contain spaces)
        const wordCount = content.split(/\s+/).length;
        const charCount = content.length;
        if (wordCount < charCount / 20) { // Less than 1 word per 20 characters suggests poor quality
            return { valid: false, reason: 'Poor word-to-character ratio' };
        }
        
        return { valid: true, wordCount, charCount };
    }

    // Extract text content from post
    function extractPostContent(postElement) {
        console.log(`📝 extractPostContent: Starting content extraction`);
        
        try {
            // First check if we have expanded content stored for this post element
            const expandedData = expandedContentMap.get(postElement);
            if (expandedData && expandedData.expandedContent) {
                console.log(`📋 Using stored expanded content (${expandedData.expandedContent.length} chars)`);
                return expandedData.expandedContent;
            }
            
            // Primary method: Use innerText with comprehensive cleaning
            if (postElement.innerText) {
                console.log(`🎯 Trying innerText extraction (${postElement.innerText.length} chars raw)`);
                const cleanedContent = cleanInnerTextContent(postElement.innerText);
                if (cleanedContent) {
                    const validation = validateContentQuality(cleanedContent);
                    if (validation.valid) {
                        console.log(`✅ Valid innerText content: ${validation.wordCount} words, ${validation.charCount} chars`);
                        return cleanedContent;
                    } else {
                        console.log(`⚠️ innerText content quality check failed: ${validation.reason}`);
                    }
                } else {
                    console.log(`⚠️ innerText cleaning returned null/empty`);
                }
            } else {
                console.log(`⚠️ No innerText available on post element`);
            }
            
            console.log('🔄 Falling back to selector-based extraction...');
            
            // Fallback: Try to find the main content area using selectors
            const contentSelectors = [
                '[data-testid="post_message"]',
                '[data-ad-preview="message"]',
                'div[data-testid="post_message_root"]',
                'div[dir="auto"]',
                '.userContent',
                '.text_exposed_root',
                '[role="article"] > div > div > div > div'
            ];
            
            for (let i = 0; i < contentSelectors.length; i++) {
                const selector = contentSelectors[i];
                console.log(`   Trying selector ${i + 1}/${contentSelectors.length}: ${selector}`);
                
                const contentElements = postElement.querySelectorAll(selector);
                console.log(`   Found ${contentElements.length} elements`);
                
                for (let j = 0; j < contentElements.length; j++) {
                    const contentElement = contentElements[j];
                    if (contentElement && contentElement.textContent) {
                        let content = contentElement.textContent;
                        console.log(`      Element ${j + 1}: ${content.length} chars raw`);
                        
                        // Skip if this looks like a navigation or UI element
                        if (content.toLowerCase().includes('like') && 
                            content.toLowerCase().includes('comment') && 
                            content.toLowerCase().includes('share')) {
                            console.log(`      Skipping UI element`);
                            continue;
                        }
                        
                        // Clean up the content
                        content = content
                            .replace(/\s+/g, ' ')  // Normalize whitespace
                            .replace(/^\s+|\s+$/g, '')  // Trim
                            .replace(/See more\.?$/i, '')  // Remove trailing "See more"
                            .replace(/Show more\.?$/i, '')  // Remove trailing "Show more"
                            .replace(/Continue reading\.?$/i, '') // Remove "Continue reading"
                            .replace(/\.\.\./g, ''); // Remove ellipsis
                        
                        if (content.length > 30 && content.length < 10000) {  // Reasonable content length
                            console.log(`   ✅ Found valid content via selector (${content.length} chars)`);
                            return content;
                        } else {
                            console.log(`      Content length ${content.length} not in valid range (30-10000)`);
                        }
                    }
                }
            }
            
            console.log('🔄 Trying final fallback - raw text extraction...');
            
            // Enhanced fallback: get text but exclude common UI elements
            const allText = postElement.textContent || '';
            console.log(`Raw textContent: ${allText.length} chars`);
            
            if (allText.length === 0) {
                console.warn(`⚠️ Post element has no textContent`);
                return null;
            }
            
            const cleanText = allText
                .replace(/\s+/g, ' ')
                .replace(/Like.*Comment.*Share/gi, '') // Remove common UI text
                .replace(/\d+\s*(likes?|comments?|shares?)/gi, '') // Remove counts
                .trim()
                .substring(0, 2000);  // Reasonable limit
            
            console.log(`Final cleaned text: ${cleanText.length} chars`);
            
            if (cleanText.length > 30) {
                console.log(`✅ Using fallback content extraction (${cleanText.length} chars)`);
                return cleanText;
            } else {
                console.warn(`⚠️ Final fallback also failed - content too short: "${cleanText}"`);
                return null;
            }
            
        } catch (error) {
            console.error('❌ Error in extractPostContent:', error);
            console.error('Post element:', postElement);
            return null;
        }
    }
    
    // Main collection handler
    async function handleCollectionClick() {
        if (isCollecting) return;
        
        // Check if any posts are selected
        const selectedCount = Array.from(pagePostCheckboxes.values())
            .filter(data => data.checkbox.checked).length;
            
        console.log(`🎯 Collection clicked: ${selectedCount} posts selected`);
            
        if (selectedCount === 0) {
            showToast('No posts selected. Check some post checkboxes first!', true);
            return;
        }
        
        const button = document.querySelector('.fbgpc-button');
        button.disabled = true;
        button.innerHTML = `
            <div class="fbgpc-spinner"></div>
            Collecting...
        `;
        
        isCollecting = true;
        
        try {
            await collectPosts();
            
            console.log(`📊 Collection results: ${collectedPosts.length} posts collected from ${selectedCount} selected`);
            
            if (collectedPosts.length > 0) {
                console.log(`🎉 Showing selection dialog with ${collectedPosts.length} posts`);
                showSelectionDialog();
            } else {
                console.error(`🚨 PROBLEM: ${selectedCount} posts were selected but 0 were collected!`);
                showToast(`No posts could be processed from the ${selectedCount} selected posts. Check console for details.`, true);
            }
        } catch (error) {
            console.error('❌ Error in handleCollectionClick:', error);
            showToast('Error collecting posts: ' + error.message, true);
        } finally {
            isCollecting = false;
            button.disabled = false;
            updateCollectButtonCount(); // Restore count display
        }
    }
    
    // Global variables for page post management
    let pagePostCounter = 0;
    let pagePostCheckboxes = new Map(); // Map of post element -> checkbox data
    let expandedContentMap = new Map(); // Map of post element -> expanded content data
    let mutationObserver = null;
    
    // Find and add checkboxes to all posts on the page
    function scanAndMarkPosts() {
        const postSelectors = [
            'div[style*="border-radius: max(0px, min(var(--card-corner-radius), calc((100vw - 4px - 100%) * 9999))) / var(--card-corner-radius);"]'
        ];
        
        let newPostsFound = 0;
        
        for (const selector of postSelectors) {
            const elements = document.querySelectorAll(selector);
            
            for (const element of elements) {
                // Go 3 levels up to get post container
                let postContainer = element;
                for (let i = 0; i < 3; i++) {
                    postContainer = postContainer.parentElement;
                    if (!postContainer) break;
                }
                
                if (postContainer && !pagePostCheckboxes.has(postContainer)) {
                    addCheckboxToPost(postContainer);
                    newPostsFound++;
                }
            }
        }
        
        if (newPostsFound > 0) {
            console.log(`📋 Added checkboxes to ${newPostsFound} new posts`);
            updateCollectButtonCount();
        }
    }
    
    // Add a checkbox overlay to a specific post
    function addCheckboxToPost(postElement) {
        // Add relative positioning class
        postElement.classList.add('fbgpc-post-container');
        
        // Create overlay container
        const overlay = document.createElement('div');
        overlay.className = 'fbgpc-page-post-overlay';
        
        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'fbgpc-page-post-checkbox';
        checkbox.checked = false; // Default to unchecked
        
        // Create counter/label
        const counter = document.createElement('span');
        counter.className = 'fbgpc-page-post-counter';
        counter.textContent = `#${++pagePostCounter}`;
        
        // Add event listener
        checkbox.addEventListener('change', async () => {
            if (checkbox.checked) {
                overlay.classList.remove('unchecked');
                // Trigger content expansion when post is selected
                await handlePostSelection(postElement, overlay, counter);
            } else {
                overlay.classList.add('unchecked');
                // Remove expanded content from storage when unchecked
                expandedContentMap.delete(postElement);
            }
            updateCollectButtonCount();
        });
        
        // Make overlay clickable
        overlay.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
        });
        
        // Prevent checkbox click from bubbling
        checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Assemble overlay
        overlay.appendChild(checkbox);
        overlay.appendChild(counter);
        
        // Add to post
        postElement.appendChild(overlay);
        
        // Store reference
        pagePostCheckboxes.set(postElement, {
            checkbox: checkbox,
            counter: counter,
            overlay: overlay,
            postId: pagePostCounter
        });
    }
    
    // Handle post selection - expand content immediately
    async function handlePostSelection(postElement, overlay, counter) {
        try {
            // Store original content before expansion
            const originalContent = extractPostContent(postElement);
            
            // Show loading indicator
            counter.textContent = '⏳';
            overlay.style.opacity = '0.7';
            
            // Attempt to expand "See more"
            const expandResult = await expandSeeMore(postElement);
            
            // Extract content after expansion attempt
            const finalContent = extractPostContent(postElement);
            
            // Store the expanded content data
            expandedContentMap.set(postElement, {
                originalContent: originalContent,
                expandedContent: finalContent,
                wasExpanded: expandResult,
                expandedAt: Date.now()
            });
            
            // Update visual feedback based on expansion result
            if (expandResult && finalContent && finalContent.length > (originalContent?.length || 0)) {
                counter.textContent = '✅'; // Successfully expanded
                console.log(`✅ Post expanded: ${originalContent?.length || 0} -> ${finalContent.length} characters`);
                console.log(`📝 Final content preview: "${finalContent.substring(0, 150)}..."`);
            } else if (!expandResult && finalContent) {
                counter.textContent = '📄'; // No "See more" found, using current content
                console.log(`📄 No expansion needed for this post (${finalContent.length} chars)`);
                console.log(`📝 Content preview: "${finalContent}"`);
            } else {
                counter.textContent = '❌'; // Failed to get content
                console.log('❌ Failed to extract content from post');
            }
            
            // Reset visual state
            overlay.style.opacity = '1';
            
        } catch (error) {
            console.error('❌ Error handling post selection:', error);
            counter.textContent = '❌';
            overlay.style.opacity = '1';
        }
    }
    
    // Update collect button with selected count
    function updateCollectButtonCount() {
        const button = document.querySelector('.fbgpc-button');
        if (!button) return;
        
        const selectedCount = Array.from(pagePostCheckboxes.values())
            .filter(data => data.checkbox.checked).length;
        const totalCount = pagePostCheckboxes.size;
        
        // Update button text
        const icon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3 2a1 1 0 011-1h8a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V2zm1 0v12h8V2H4z"/>
            <path d="M6 4h4v1H6V4zm0 2h4v1H6V6zm0 2h4v1H6V8z"/>
        </svg>`;
        
        button.innerHTML = `${icon} Collect Posts (${selectedCount}/${totalCount})`;
    }
    
    // Create bulk control panel
    function createBulkControls() {
        const controls = document.createElement('div');
        controls.className = 'fbgpc-bulk-controls';
        
        const selectAllBtn = document.createElement('button');
        selectAllBtn.className = 'fbgpc-bulk-btn';
        selectAllBtn.textContent = 'Select All';
        selectAllBtn.addEventListener('click', selectAllPagePosts);
        
        const selectNoneBtn = document.createElement('button');
        selectNoneBtn.className = 'fbgpc-bulk-btn';
        selectNoneBtn.textContent = 'Select None';
        selectNoneBtn.addEventListener('click', selectNoPagePosts);
        
        const rescanBtn = document.createElement('button');
        rescanBtn.className = 'fbgpc-bulk-btn';
        rescanBtn.textContent = 'Rescan Posts';
        rescanBtn.addEventListener('click', scanAndMarkPosts);
        
        controls.appendChild(selectAllBtn);
        controls.appendChild(selectNoneBtn);
        controls.appendChild(rescanBtn);
        
        document.body.appendChild(controls);
        return controls;
    }
    
    // Select all page posts
    function selectAllPagePosts() {
        pagePostCheckboxes.forEach(data => {
            if (!data.checkbox.checked) {
                data.checkbox.checked = true;
                data.overlay.classList.remove('unchecked');
            }
        });
        updateCollectButtonCount();
    }
    
    // Select no page posts
    function selectNoPagePosts() {
        pagePostCheckboxes.forEach(data => {
            if (data.checkbox.checked) {
                data.checkbox.checked = false;
                data.overlay.classList.add('unchecked');
            }
        });
        updateCollectButtonCount();
    }
    
    // Set up MutationObserver to monitor for new posts
    function setupPostMonitoring() {
        if (mutationObserver) {
            mutationObserver.disconnect();
        }
        
        mutationObserver = new MutationObserver((mutations) => {
            let shouldScan = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // Check if new nodes were added
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check if the added node or its descendants contain post elements
                            if (node.querySelector && (
                                node.querySelector('div[style*="border-radius: max(0px, min(var(--card-corner-radius), calc((100vw - 4px - 100%) * 9999))) / var(--card-corner-radius);"]') ||
                                node.matches && node.matches('div[style*="border-radius: max(0px, min(var(--card-corner-radius), calc((100vw - 4px - 100%) * 9999))) / var(--card-corner-radius);"]')
                            )) {
                                shouldScan = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldScan) {
                // Debounce scanning to avoid excessive calls
                clearTimeout(window.fbgpcScanTimeout);
                window.fbgpcScanTimeout = setTimeout(() => {
                    scanAndMarkPosts();
                }, 500);
            }
        });
        
        // Start observing
        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('🔍 Started monitoring for new posts');
    }
    
    // Clean up removed posts from our tracking
    function cleanupRemovedPosts() {
        const toRemove = [];
        
        pagePostCheckboxes.forEach((data, postElement) => {
            if (!document.contains(postElement)) {
                toRemove.push(postElement);
            }
        });
        
        toRemove.forEach(postElement => {
            pagePostCheckboxes.delete(postElement);
            expandedContentMap.delete(postElement); // Also clean up expanded content
        });
        
        if (toRemove.length > 0) {
            console.log(`🧹 Cleaned up ${toRemove.length} removed posts`);
            updateCollectButtonCount();
        }
    }

    
    // Debug status function
    function showDebugStatus() {
        console.log('🔍 === DEBUG STATUS ===');
        console.log(`📊 Total posts tracked: ${pagePostCheckboxes.size}`);
        console.log(`✅ Selected posts: ${Array.from(pagePostCheckboxes.values()).filter(data => data.checkbox.checked).length}`);
        console.log(`📦 Collected posts in memory: ${collectedPosts.length}`);
        console.log(`💾 Expanded content entries: ${expandedContentMap.size}`);
        
        // Show details of selected posts
        const selectedPosts = Array.from(pagePostCheckboxes.entries())
            .filter(([postElement, data]) => data.checkbox.checked);
            
        console.log('\n📋 Selected Posts Details:');
        selectedPosts.forEach(([postElement, data], index) => {
            const expandedData = expandedContentMap.get(postElement);
            console.log(`   ${index + 1}. Post #${data.postId}`);
            console.log(`      - Checkbox: ${data.checkbox.checked ? 'checked' : 'unchecked'}`);
            console.log(`      - In DOM: ${document.contains(postElement) ? 'yes' : 'no'}`);
            console.log(`      - Has expanded content: ${expandedData ? 'yes (' + expandedData.expandedContent?.length + ' chars)' : 'no'}`);
        });
        
        // Show collected posts
        console.log('\n📦 Collected Posts Array:');
        collectedPosts.forEach((post, index) => {
            console.log(`   ${index + 1}. ID: ${post.post_id}, URL: ${post.post_url}, Content: ${post.post_content?.length || 0} chars`);
        });
        
        // Show a status toast
        showToast(`Debug: ${pagePostCheckboxes.size} tracked, ${Array.from(pagePostCheckboxes.values()).filter(data => data.checkbox.checked).length} selected, ${collectedPosts.length} collected`);
        console.log('🔍 === END DEBUG STATUS ===\n');
    }
    
    // Test content cleaning function
    function testContentCleaning() {
        console.log('🧪 === TESTING CONTENT CLEANING ===');
        
        // Test with the provided example
        const testInput = `Esmeralda Casilla Ramos
 
·
Follow
r
n
p
o
S
s
t
d
o
e
c
4
7
1
4
4
5
t
m
7
4
1
u
f
l
2
1
g
m
2
6
6
7
l
c
7
7
0
2
u
7
t
h
t
9
2
f
f
g
g
0
5
h
l
1
2
u
4
l
6
 
·
 FEMALE ROOMATE - 
JEAN JAURES UNIVERSITY (UT2) - 2 MINUTES WALK FROM EVERYTHING M️
TM️ COL.
hello 
Looking for a new roommate to fill a 4 bedroom female roommate.
The apartment is currently occupied by three female students:
 
 Inès, 21 years old, a dynamic student and very kind.
 
 Emma, 29 years old, PhD student in archaeology, accompanied by Simone 
, her little French Bulldog (she's really too cute).
 
 Blanche, 18 years old who joins the roommate in early September
They look forward to meeting you when you visit!
 APARTMENT DESCRIPTION:
A T5 crossing East-West 
 fully furnished and equipped 80 m2 with an optimal layout and a large private garden. 
 THE ROOM:
- Bright and fully renovated.
- 2-seater bed with comfortable mattress, desk, wardrobe, and individual lock.
 THE MOST:
- Individual lease.
- Housekeeping service
- Fiber connection, wifi, large television connected.
- New appliances (washing machine, dishwasher, XXL fridge, etc.) ).
- Eligible aux APL.
 LOCATION:
- Subway at 100m, line (A).
- UT2, University of Toulouse Jean Jaurès 10 min by metro.
- UT1, Capitol University 20 min by subway
- Bus (line 13) at the foot of the apartment.
- Various shops and services less than 150 m.
 PRICE :
470 € + 30 € package charges included (electricity, water, heating, internet, cleaning, etc.) ). No expected charge adjustment.
 APL simulation available on the CAF website.
 VISIT:
Currently available for physical visits.
 YOUR APPLICATION IN 5 STEPS:
1) World fact sheet to return to me to complete.
2) Planning your meeting with tenants.
3) Tenants' decision to continue the proceedings.
4) Receipt of your candidacy application.
5) Decision of the owner.
For more information, photos or videos, hit me up!
Thank you.
 
 · See original
 
 · Rate this translation
All reactions:
5
5
8
3
Like
Comment
Share
View more comments
Anne-Sophie Heckel`;

        console.log('🧪 Testing with Facebook post example...');
        const result = cleanInnerTextContent(testInput);
        
        console.log('🧪 === TEST RESULTS ===');
        if (result) {
            console.log('✅ SUCCESS: Function returned content');
            console.log(`📏 Length: ${result.length} characters`);
            console.log('📝 Content:');
            console.log(result);
            
            // Check if it contains expected content
            if (result.includes('FEMALE ROOMATE') || result.includes('Looking for a new roommate')) {
                console.log('✅ VALIDATION: Contains expected content!');
                showToast('✅ Content cleaning test PASSED!');
            } else {
                console.log('❌ VALIDATION: Does not contain expected content');
                showToast('❌ Content cleaning test FAILED - missing expected content', true);
            }
        } else {
            console.log('❌ FAILURE: Function returned null/empty');
            showToast('❌ Content cleaning test FAILED - no content returned', true);
        }
        
        console.log('🧪 === END CONTENT CLEANING TEST ===\n');
    }
    
    // Show the post selection dialog
    function showSelectionDialog() {
        console.log(`💬 showSelectionDialog: Starting with ${collectedPosts.length} collected posts`);
        
        // Validation check
        if (!collectedPosts || collectedPosts.length === 0) {
            console.error('🚨 showSelectionDialog: No collected posts available!');
            showToast('Error: No posts were collected to display', true);
            return;
        }
        
        // Log collected post details for debugging
        collectedPosts.forEach((post, index) => {
            console.log(`   Post ${index + 1}: ID=${post.post_id}, URL=${post.post_url}, Content=${post.post_content ? post.post_content.length + ' chars' : 'null'}`);
        });
        
        // Remove existing dialog if present
        if (selectionDialog) {
            console.log(`🧹 Cleaning up existing dialog`);
            selectionDialog.remove();
        }
        
        console.log(`🎨 Creating dialog elements...`);
        
        // Create overlay
        selectionDialog = document.createElement('div');
        selectionDialog.className = 'fbgpc-overlay';
        
        // Create dialog
        const dialog = document.createElement('div');
        dialog.className = 'fbgpc-dialog';
        
        // Header
        const header = document.createElement('div');
        header.className = 'fbgpc-header';
        
        const title = document.createElement('div');
        title.className = 'fbgpc-title';
        title.textContent = `Select Posts to Send (${collectedPosts.length} found)`;
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'fbgpc-close';
        closeBtn.innerHTML = '&times;';
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        // Content
        const content = document.createElement('div');
        content.className = 'fbgpc-content';
        
        // Controls
        const controls = document.createElement('div');
        controls.className = 'fbgpc-controls';
        
        const selectAllBtn = document.createElement('button');
        selectAllBtn.className = 'fbgpc-control-btn';
        selectAllBtn.textContent = 'Select All';
        
        const selectNoneBtn = document.createElement('button');
        selectNoneBtn.className = 'fbgpc-control-btn';
        selectNoneBtn.textContent = 'Select None';
        
        const selectionCount = document.createElement('span');
        selectionCount.className = 'fbgpc-status';
        selectionCount.id = 'fbgpc-selection-count';
        selectionCount.textContent = `${collectedPosts.length} selected`; // All selected by default
        
        controls.appendChild(selectAllBtn);
        controls.appendChild(selectNoneBtn);
        controls.appendChild(selectionCount);
        
        // Posts list
        const postsList = document.createElement('div');
        postsList.className = 'fbgpc-posts';
        postsList.id = 'fbgpc-posts-list';
        
        console.log(`📄 Creating post items for ${collectedPosts.length} posts...`);
        
        // Populate posts
        let itemsCreated = 0;
        collectedPosts.forEach((post, index) => {
            try {
                const postItem = createPostItem(post, index);
                if (postItem) {
                    postsList.appendChild(postItem);
                    itemsCreated++;
                    console.log(`   ✅ Created item ${itemsCreated} for post ${index + 1}`);
                } else {
                    console.warn(`   ⚠️ createPostItem returned null for post ${index + 1}`);
                }
            } catch (error) {
                console.error(`   ❌ Error creating item for post ${index + 1}:`, error);
            }
        });
        
        console.log(`📄 Created ${itemsCreated} post items out of ${collectedPosts.length} posts`);
        
        // Validation: ensure posts list has child elements
        if (postsList.children.length === 0) {
            console.error('🚨 CRITICAL: Posts list is empty after attempting to populate!');
            console.error('CollectedPosts array:', collectedPosts);
            
            // Add error message to the list
            const errorDiv = document.createElement('div');
            errorDiv.style.padding = '20px';
            errorDiv.style.textAlign = 'center';
            errorDiv.style.color = '#e74c3c';
            errorDiv.textContent = `Error: Failed to create post list items. Check console for details.`;
            postsList.appendChild(errorDiv);
        }
        
        content.appendChild(controls);
        content.appendChild(postsList);
        
        // Footer
        const footer = document.createElement('div');
        footer.className = 'fbgpc-footer';
        
        const apiStatus = document.createElement('div');
        apiStatus.className = 'fbgpc-status';
        apiStatus.id = 'fbgpc-api-status';
        
        const actions = document.createElement('div');
        actions.className = 'fbgpc-actions';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'fbgpc-btn fbgpc-btn-secondary';
        cancelBtn.textContent = 'Cancel';
        
        const sendBtn = document.createElement('button');
        sendBtn.className = 'fbgpc-btn fbgpc-btn-primary';
        sendBtn.id = 'fbgpc-send-btn';
        sendBtn.textContent = 'Send Posts';
        sendBtn.disabled = false; // Enable since all are checked by default
        
        actions.appendChild(cancelBtn);
        actions.appendChild(sendBtn);
        
        footer.appendChild(apiStatus);
        footer.appendChild(actions);
        
        // Assemble dialog
        dialog.appendChild(header);
        dialog.appendChild(content);
        dialog.appendChild(footer);
        selectionDialog.appendChild(dialog);
        
        // Add to page
        document.body.appendChild(selectionDialog);
        console.log(`🎆 Dialog added to page`);
        
        // Add event listeners after elements are in the DOM
        closeBtn.addEventListener('click', closeSelectionDialog);
        selectAllBtn.addEventListener('click', selectAllPosts);
        selectNoneBtn.addEventListener('click', selectNonePosts);
        cancelBtn.addEventListener('click', closeSelectionDialog);
        sendBtn.addEventListener('click', sendSelectedPosts);
        
        // Add overlay click to close (click outside dialog)
        selectionDialog.addEventListener('click', (e) => {
            if (e.target === selectionDialog) {
                closeSelectionDialog();
            }
        });
        
        // Prevent dialog clicks from closing the modal
        dialog.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Add keyboard support
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                closeSelectionDialog();
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);
        
        // Store the keydown handler for cleanup
        selectionDialog._keydownHandler = handleKeydown;
        
        // Update selection count (should show all selected since checkboxes default to checked)
        updateSelectionCount();
        
        console.log(`✅ Dialog creation complete - ${postsList.children.length} items in list`);
        
        // Make functions globally accessible (for debugging)
        window.closeSelectionDialog = closeSelectionDialog;
        window.selectAllPosts = selectAllPosts;
        window.selectNonePosts = selectNonePosts;
        window.sendSelectedPosts = sendSelectedPosts;
        window.togglePost = togglePost;
    }
    
    // Create a post item for the selection list
    function createPostItem(post, index) {
        console.log(`🔨 createPostItem: Creating item ${index + 1}`);
        
        // Validate post data
        if (!post) {
            console.error(`❌ createPostItem: Post ${index + 1} is null/undefined`);
            return null;
        }
        
        if (!post.post_content) {
            console.error(`❌ createPostItem: Post ${index + 1} has no content:`, post);
            return null;
        }
        
        if (!post.post_url) {
            console.error(`❌ createPostItem: Post ${index + 1} has no URL:`, post);
            return null;
        }
        
        console.log(`   ✅ Post ${index + 1} validation passed (${post.post_content.length} chars)`);
        
        try {
            const item = document.createElement('div');
            item.className = 'fbgpc-post-item';
            
            // Truncate content for preview
            const previewContent = post.post_content.length > 200 
                ? post.post_content.substring(0, 200) + '...' 
                : post.post_content;
            
            // Create checkbox element
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'fbgpc-post-checkbox';
            checkbox.id = `post-${index}`;
            checkbox.checked = true; // Default to checked
            
            // Create content container
            const contentDiv = document.createElement('div');
            contentDiv.className = 'fbgpc-post-content';
            
            // Basic post info
            const postInfo = document.createElement('div');
            postInfo.innerHTML = `
                <div class="fbgpc-post-url">${post.post_url}</div>
                <div class="fbgpc-post-text ${post.post_content.length > 200 ? 'truncated' : ''}">${previewContent}</div>
            `;
            contentDiv.appendChild(postInfo);
            
            // Add images section if post has images
            if (post.images && post.images.length > 0) {
                console.log(`   📸 Adding images section (${post.images.length} images)`);
                const imagesSection = createImagesSection(post.images, index);
                if (imagesSection) {
                    contentDiv.appendChild(imagesSection);
                }
            }
            
            // Add event listener to checkbox
            checkbox.addEventListener('change', () => togglePost(index));
            
            // Assemble the item
            item.appendChild(checkbox);
            item.appendChild(contentDiv);
            
            console.log(`   ✅ Post item ${index + 1} created successfully`);
            return item;
            
        } catch (error) {
            console.error(`❌ createPostItem: Error creating item for post ${index + 1}:`, error);
            console.error('Post data:', post);
            return null;
        }
    }
    
    // Create images section for a post
    function createImagesSection(images, postIndex) {
        const imagesDiv = document.createElement('div');
        imagesDiv.className = 'fbgpc-post-images';
        
        // Images header with toggle
        const header = document.createElement('div');
        header.className = 'fbgpc-images-header';
        
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'fbgpc-images-toggle';
        toggleBtn.textContent = `📸 Images (${images.length}) - Click to expand`;
        toggleBtn.setAttribute('data-expanded', 'false');
        
        header.appendChild(toggleBtn);
        
        // Images grid (initially hidden)
        const grid = document.createElement('div');
        grid.className = 'fbgpc-images-grid';
        grid.style.display = 'none';
        
        images.forEach((image, imageIndex) => {
            const imageItem = document.createElement('div');
            imageItem.className = 'fbgpc-image-item';
            
            const img = document.createElement('img');
            img.className = 'fbgpc-image-preview';
            img.src = image.url;
            img.alt = image.alt;
            img.loading = 'lazy';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'fbgpc-image-checkbox';
            checkbox.checked = image.selected;
            checkbox.addEventListener('change', () => toggleImageSelection(postIndex, imageIndex));
            
            const info = document.createElement('div');
            info.className = 'fbgpc-image-info';
            info.textContent = image.width && image.height 
                ? `${image.width}×${image.height}` 
                : 'Loading...';
            
            imageItem.appendChild(img);
            imageItem.appendChild(checkbox);
            imageItem.appendChild(info);
            grid.appendChild(imageItem);
        });
        
        // Include images toggle
        const includeDiv = document.createElement('div');
        includeDiv.className = 'fbgpc-include-images';
        includeDiv.style.display = 'none';
        
        const includeCheckbox = document.createElement('input');
        includeCheckbox.type = 'checkbox';
        includeCheckbox.checked = collectedPosts[postIndex]?.includeImages || false;
        includeCheckbox.addEventListener('change', () => toggleIncludeImages(postIndex));
        
        const includeLabel = document.createElement('span');
        includeLabel.textContent = 'Include images when sending this post';
        
        includeDiv.appendChild(includeCheckbox);
        includeDiv.appendChild(includeLabel);
        
        // Toggle functionality
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const expanded = toggleBtn.getAttribute('data-expanded') === 'true';
            
            if (expanded) {
                grid.style.display = 'none';
                includeDiv.style.display = 'none';
                toggleBtn.textContent = `📸 Images (${images.length}) - Click to expand`;
                toggleBtn.setAttribute('data-expanded', 'false');
            } else {
                grid.style.display = 'grid';
                includeDiv.style.display = 'flex';
                toggleBtn.textContent = `📸 Images (${images.length}) - Click to collapse`;
                toggleBtn.setAttribute('data-expanded', 'true');
            }
        });
        
        imagesDiv.appendChild(header);
        imagesDiv.appendChild(grid);
        imagesDiv.appendChild(includeDiv);
        
        return imagesDiv;
    }
    
    // Toggle post selection
    function togglePost(index) {
        updateSelectionCount();
    }
    
    // Toggle individual image selection
    function toggleImageSelection(postIndex, imageIndex) {
        if (collectedPosts[postIndex] && collectedPosts[postIndex].images[imageIndex]) {
            collectedPosts[postIndex].images[imageIndex].selected = 
                !collectedPosts[postIndex].images[imageIndex].selected;
            updateSelectionCount();
        }
    }
    
    // Toggle include images for a post
    function toggleIncludeImages(postIndex) {
        if (collectedPosts[postIndex]) {
            collectedPosts[postIndex].includeImages = !collectedPosts[postIndex].includeImages;
            updateSelectionCount();
        }
    }
    
    // Select all posts
    function selectAllPosts() {
        const checkboxes = document.querySelectorAll('.fbgpc-post-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
        updateSelectionCount();
    }
    
    // Select no posts
    function selectNonePosts() {
        const checkboxes = document.querySelectorAll('.fbgpc-post-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        updateSelectionCount();
    }
    
    // Update selection count and button state
    function updateSelectionCount() {
        const checkboxes = document.querySelectorAll('.fbgpc-post-checkbox');
        const selectedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
        
        // Count selected images across all posts
        let totalImages = 0;
        let selectedImages = 0;
        
        collectedPosts.forEach((post, index) => {
            const postCheckbox = document.getElementById(`post-${index}`);
            if (postCheckbox && postCheckbox.checked && post.images && post.includeImages) {
                totalImages += post.images.length;
                selectedImages += post.images.filter(img => img.selected).length;
            }
        });
        
        const countElement = document.getElementById('fbgpc-selection-count');
        const sendButton = document.getElementById('fbgpc-send-btn');
        
        if (countElement) {
            let statusText = `${selectedCount} posts selected`;
            if (selectedImages > 0) {
                statusText += `, ${selectedImages} images`;
            }
            countElement.textContent = statusText;
        }
        
        if (sendButton) {
            sendButton.disabled = selectedCount === 0;
        }
    }
    
    // Close the selection dialog
    function closeSelectionDialog() {
        if (selectionDialog) {
            // Clean up keyboard event listener
            if (selectionDialog._keydownHandler) {
                document.removeEventListener('keydown', selectionDialog._keydownHandler);
            }
            
            // Remove dialog from DOM
            if (selectionDialog.parentNode) {
                selectionDialog.remove();
            }
        }
        selectionDialog = null;
        
        // Clean up global functions
        if (typeof window.closeSelectionDialog !== 'undefined') {
            delete window.closeSelectionDialog;
        }
        if (typeof window.selectAllPosts !== 'undefined') {
            delete window.selectAllPosts;
        }
        if (typeof window.selectNonePosts !== 'undefined') {
            delete window.selectNonePosts;
        }
        if (typeof window.sendSelectedPosts !== 'undefined') {
            delete window.sendSelectedPosts;
        }
        if (typeof window.togglePost !== 'undefined') {
            delete window.togglePost;
        }
    }
    
    // Download image as blob from URL
    async function downloadImage(imageUrl) {
        try {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: imageUrl,
                    responseType: 'blob',
                    onload: function(response) {
                        if (response.status === 200) {
                            resolve(response.response);
                        } else {
                            reject(new Error(`Failed to download image: ${response.status}`));
                        }
                    },
                    onerror: function(error) {
                        reject(new Error(`Error downloading image: ${error}`));
                    }
                });
            });
        } catch (error) {
            console.error('Error downloading image:', error);
            throw error;
        }
    }
    
    // Upload image to server
    async function uploadImageToServer(submissionId, imageBlob, imageName) {
        try {
            const formData = new FormData();
            formData.append('listing_id', submissionId);
            formData.append('file', imageBlob, imageName);
            
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'http://localhost:8080/upload',
                    data: formData,
                    onload: function(response) {
                        if (response.status === 200) {
                            try {
                                const result = JSON.parse(response.responseText);
                                resolve(result);
                            } catch (e) {
                                reject(new Error('Invalid response format'));
                            }
                        } else {
                            reject(new Error(`Upload failed: ${response.status} - ${response.responseText}`));
                        }
                    },
                    onerror: function(error) {
                        reject(new Error(`Upload error: ${error}`));
                    }
                });
            });
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }
    
    // Process images for selected posts
    async function processPostImages(submissionId, selectedPosts, statusElement) {
        let totalImages = 0;
        let uploadedImages = 0;
        let failedImages = 0;
        
        // Count total images to upload
        selectedPosts.forEach(post => {
            if (post.includeImages && post.images) {
                totalImages += post.images.filter(img => img.selected).length;
            }
        });
        
        if (totalImages === 0) {
            console.log('No images to upload');
            return { totalImages, uploadedImages, failedImages };
        }
        
        statusElement.textContent = `Uploading images: 0/${totalImages}...`;
        
        for (const post of selectedPosts) {
            if (!post.includeImages || !post.images) continue;
            
            for (const [imageIndex, image] of post.images.entries()) {
                if (!image.selected) continue;
                
                try {
                    statusElement.textContent = `Uploading images: ${uploadedImages}/${totalImages}...`;
                    
                    // Download image
                    const imageBlob = await downloadImage(image.url);
                    
                    // Generate filename
                    const timestamp = Date.now();
                    const filename = `post_${post.post_id}_img_${imageIndex}_${timestamp}.jpg`;
                    
                    // Upload to server
                    const uploadResult = await uploadImageToServer(submissionId, imageBlob, filename);
                    
                    if (uploadResult.success) {
                        uploadedImages++;
                        console.log(`✅ Uploaded image ${uploadedImages}/${totalImages}:`, filename);
                    } else {
                        failedImages++;
                        console.error(`❌ Failed to upload image:`, uploadResult.error);
                    }
                    
                } catch (error) {
                    failedImages++;
                    console.error(`❌ Error processing image from ${image.url}:`, error);
                }
            }
        }
        
        return { totalImages, uploadedImages, failedImages };
    }

    // Send selected posts to API
    async function sendSelectedPosts() {
        const checkboxes = document.querySelectorAll('.fbgpc-post-checkbox');
        const selectedPosts = [];
        
        checkboxes.forEach((checkbox, index) => {
            if (checkbox.checked && collectedPosts[index]) {
                // Validate post data before adding
                const post = collectedPosts[index];
                if (post.post_id && post.post_url && post.post_content) {
                    // Additional content quality validation
                    const contentValidation = validateContentQuality(post.post_content);
                    if (contentValidation.valid) {
                        selectedPosts.push(post);
                        console.log(`✅ Post ${post.post_id}: Valid content (${contentValidation.wordCount} words)`);
                    } else {
                        console.warn(`⚠️  Skipping post ${post.post_id}: ${contentValidation.reason}`);
                        console.warn('Content preview:', post.post_content);
                    }
                } else {
                    console.warn('Skipping invalid post data:', post);
                }
            }
        });
        
        if (selectedPosts.length === 0) {
            showToast('No valid posts selected', true);
            return;
        }
        
        const sendButton = document.getElementById('fbgpc-send-btn');
        const statusElement = document.getElementById('fbgpc-api-status');
        
        // Show loading state
        sendButton.disabled = true;
        sendButton.innerHTML = `
            <div class="fbgpc-spinner"></div>
            Sending...
        `;
        
        statusElement.textContent = `Sending ${selectedPosts.length} posts...`;
        
        try {
            // Step 1: Send posts to server
            const postsResponse = await new Promise((resolve, reject) => {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

                GM_xmlhttpRequest({
                    method: "POST",
                    url: 'http://localhost:8080/fetch_post',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: JSON.stringify({
                        posts: selectedPosts.map(post => ({
                            post_id: post.post_id,
                            post_url: post.post_url,
                            post_content: post.post_content
                        })),
                        timestamp: new Date().toISOString(),
                        source: 'facebook-group-post-collector',
                        version: SCRIPT_VERSION
                    }),
                    onload: function(response) {
                        clearTimeout(timeoutId);
                        if (response.status === 200) {
                            try {
                                const responseData = JSON.parse(response.responseText);
                                resolve(responseData);
                            } catch (e) {
                                reject(new Error('Invalid response format'));
                            }
                        } else {
                            reject(new Error(`Server responded with status ${response.status}: ${response.responseText}`));
                        }
                    },
                    onerror: function(error) {
                        clearTimeout(timeoutId);
                        reject(new Error(`Cannot connect to localhost:8080 - Make sure your server is running`));
                    }
                });
            });

            console.log('✅ Posts sent successfully:', postsResponse);
            
            // Step 2: Upload images if any
            const imageResults = await processPostImages(
                postsResponse.submission_id, 
                selectedPosts, 
                statusElement
            );
            
            // Step 3: Show final results
            let successMessage = `Successfully sent ${selectedPosts.length} posts`;
            if (imageResults.totalImages > 0) {
                successMessage += ` and ${imageResults.uploadedImages}/${imageResults.totalImages} images`;
                if (imageResults.failedImages > 0) {
                    successMessage += ` (${imageResults.failedImages} images failed)`;
                }
            }
            
            showToast(successMessage);
            console.log('✅ Complete results:', { posts: postsResponse, images: imageResults });
            closeSelectionDialog();
            
        } catch (error) {
            console.error('Error sending posts:', error);
            
            let errorMessage = error.message;
            if (error.name === 'AbortError') {
                errorMessage = 'Request timed out after 30 seconds';
            } else if (error.message.includes('connect')) {
                errorMessage = 'Cannot connect to localhost:8080 - Make sure your server is running';
            }
            
            showToast(`Error sending posts: ${errorMessage}`, true);
            statusElement.textContent = `Error: ${errorMessage}`;
            
            // Restore button state
            sendButton.disabled = false;
            sendButton.textContent = 'Send Posts';
        }
    }
    
    // Initialize the script
    function initialize() {
        // Check if we're on a Facebook group page
        if (!window.location.pathname.includes('/groups/')) {
            return;
        }
        
        // Wait for page to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(initialize, 1000);
            });
            return;
        }
        
        // Inject styles and create buttons
        injectStyles();
        createCollectionButton();
        createBulkControls();
        
        // Set up post monitoring and initial scan
        setupPostMonitoring();
        setTimeout(() => {
            scanAndMarkPosts();
        }, 1000); // Delay to let page load
        
        // Periodic cleanup of removed posts
        setInterval(cleanupRemovedPosts, 10000); // Every 10 seconds
        
        // Register menu commands
        GM.registerMenuCommand('Collect Group Posts', handleCollectionClick);
        GM.registerMenuCommand('Rescan Posts', scanAndMarkPosts);
        GM.registerMenuCommand('Debug: Show Collection Status', showDebugStatus);
        GM.registerMenuCommand('Debug: Test Content Cleaning', testContentCleaning);
    }
    
    // Start the script
    initialize();
    
})();
