// ==UserScript==
// @name         Reddit Comment and Post Extractor
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Extract Reddit comments and posts as JSON with configurable options
// @author       anassk
// @match        https://www.reddit.com/*
// @match        https://old.reddit.com/*
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524797/Reddit%20Comment%20and%20Post%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/524797/Reddit%20Comment%20and%20Post%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isUIVisible = false;
    let container = null;

    // Enhanced Styles with smaller UI
    const STYLES = `
        .reddit-extractor {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 16px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            z-index: 9999;
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
            font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto;
            width: 280px;
            animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(40px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .reddit-extractor-close {
            position: absolute;
            top: 12px;
            right: 12px;
            cursor: pointer;
            font-size: 20px;
            color: #666;
            line-height: 1;
            padding: 4px 8px;
            border-radius: 50%;
            transition: all 0.2s ease;
        }

        .reddit-extractor-close:hover {
            background: rgba(0,0,0,0.05);
            color: #333;
        }

        .reddit-extractor-section {
            margin-bottom: 16px;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 6px;
            border: 1px solid #e9ecef;
            transition: box-shadow 0.2s ease;
        }

        .reddit-extractor-section:hover {
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .reddit-extractor-header {
            margin-bottom: 12px;
            padding-bottom: 6px;
            border-bottom: 2px solid #1a1a1b;
        }

        .reddit-extractor-header h3 {
            margin: 0;
            font-size: 16px;
            color: #1a1a1b;
            font-weight: 600;
            letter-spacing: -0.3px;
        }

        .reddit-extractor-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: #0079d3;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            margin-right: 6px;
            transition: all 0.2s ease;
            min-width: 70px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .reddit-extractor-btn:hover {
            background: #005d9f;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .reddit-extractor-label {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            cursor: pointer;
            font-size: 13px;
            padding: 4px;
            border-radius: 4px;
            transition: background 0.2s ease;
        }

        .reddit-extractor-label:hover {
            background: rgba(0,0,0,0.03);
        }

        .reddit-extractor-checkbox {
            margin-right: 8px;
            cursor: pointer;
            width: 14px;
            height: 14px;
        }

        .reddit-extractor-input {
            width: 70px;
            padding: 6px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-top: 4px;
            transition: all 0.2s ease;
            font-size: 13px;
        }

        .reddit-extractor-status {
            margin-top: 12px;
            padding: 8px;
            border-radius: 4px;
            font-size: 13px;
            text-align: center;
            display: none;
            font-weight: 500;
            animation: fadeIn 0.3s ease;
        }

        .status-success {
            background: #e8f5e9;
            color: #2e7d32;
            border: 1px solid #c8e6c9;
        }

        .status-error {
            background: #ffebee;
            color: #c62828;
            border: 1px solid #ffcdd2;
        }
    `;

    // Extract post data
    function extractPostData() {
        try {
            const titleElement = document.querySelector('h1[slot="title"]');
            const creditBarElement = document.querySelector('div[slot="credit-bar"]');
            const postContentElement = document.querySelector('div[slot="text-body"]');

            return {
                title: titleElement ? titleElement.textContent.trim() : '',
                creditBar: creditBarElement ? {
                    subreddit: creditBarElement.querySelector('.subreddit-name a')?.textContent.trim() || '',
                    author: creditBarElement.querySelector('.author-name')?.textContent.trim() || '',
                    timestamp: creditBarElement.querySelector('faceplate-timeago time')?.getAttribute('datetime') || ''
                } : null,
                content: postContentElement ? postContentElement.textContent.trim() : ''
            };
        } catch (error) {
            console.error('Error extracting post data:', error);
            return null;
        }
    }

    // Extract comment data
    function extractCommentData(comment) {
        try {
            const username = comment.getAttribute('author') ||
                           comment.querySelector('a[href^="/user/"]')?.textContent?.trim() ||
                           comment.querySelector('.author')?.textContent?.trim() ||
                           'unknown';

            const votesStr = comment.querySelector('shreddit-comment-action-row')?.getAttribute('score') ||
                           comment.querySelector('.score')?.textContent ||
                           '0';
            const votes = parseInt(votesStr) || 0;

            const permalink = comment.getAttribute('permalink') ||
                            comment.querySelector('a.permalink')?.getAttribute('href') ||
                            '';

            const dateElem = comment.querySelector('time') ||
                           comment.querySelector('.live-timestamp');
            const date = dateElem ? new Date(dateElem.getAttribute('datetime') || dateElem.getAttribute('title')).toLocaleString() : '';

            const textContent = comment.querySelector('[id$="-comment-rtjson-content"]')?.textContent?.trim() ||
                              comment.querySelector('.usertext-body')?.textContent?.trim() ||
                              '';

            const depth = parseInt(comment.getAttribute('depth')) || 0;

            return {
                username,
                votes,
                date,
                permalink: permalink ? new URL(permalink, window.location.origin).pathname : '',
                profileUrl: `/user/${username}`,
                content: textContent,
                depth
            };
        } catch (error) {
            console.error('Error extracting comment data:', error);
            return null;
        }
    }

    // Create UI
    function createExtractorUI() {
        if (container) {
            container.style.display = 'block';
            return container;
        }

        container = document.createElement('div');
        container.className = 'reddit-extractor';

        const styleSheet = document.createElement('style');
        styleSheet.textContent = STYLES;
        document.head.appendChild(styleSheet);

        container.innerHTML = `
            <span class="reddit-extractor-close" title="Close">×</span>
            <div class="reddit-extractor-section">
                <div class="reddit-extractor-header">
                    <h3>Extraction Settings</h3>
                </div>
                <div style="margin-bottom: 12px;">
                    <label>
                        Minimum votes:
                        <input type="number" id="minVotes" value="1" class="reddit-extractor-input">
                    </label>
                </div>
                <div>
                    <label>
                        Maximum depth:
                        <input type="number" id="maxDepth" value="4" min="0" class="reddit-extractor-input">
                    </label>
                </div>
            </div>

            <div class="reddit-extractor-section">
                <div class="reddit-extractor-header">
                    <h3>Data to Include</h3>
                </div>
                <label class="reddit-extractor-label">
                    <input type="checkbox" id="includePost" class="reddit-extractor-checkbox" checked>
                    Include post
                </label>
                <label class="reddit-extractor-label">
                    <input type="checkbox" id="includeDepth" class="reddit-extractor-checkbox" checked>
                    Nesting depth
                </label>
                <label class="reddit-extractor-label">
                    <input type="checkbox" id="includeVotes" class="reddit-extractor-checkbox" checked>
                    Vote count
                </label>
                <label class="reddit-extractor-label">
                    <input type="checkbox" id="includeUsername" class="reddit-extractor-checkbox" checked>
                    Username
                </label>
                <label class="reddit-extractor-label">
                    <input type="checkbox" id="includeDate" class="reddit-extractor-checkbox" checked>
                    Date
                </label>
                <label class="reddit-extractor-label">
                    <input type="checkbox" id="includeProfile" class="reddit-extractor-checkbox" checked>
                    Profile URL
                </label>
                <label class="reddit-extractor-label">
                    <input type="checkbox" id="includePermalink" class="reddit-extractor-checkbox" checked>
                    Comment URL
                </label>
            </div>

            <div style="display: flex; justify-content: center; gap: 8px;">
                <button id="extractBtn" class="reddit-extractor-btn">Extract</button>
                <button id="copyBtn" class="reddit-extractor-btn">Copy</button>
                <button id="downloadBtn" class="reddit-extractor-btn">Download</button>
            </div>

            <div id="status" class="reddit-extractor-status"></div>
        `;

        document.body.appendChild(container);
        container.querySelector('.reddit-extractor-close').addEventListener('click', () => {
            container.style.display = 'none';
            isUIVisible = false;
        });

        return container;
    }

    // Show status message
    function showStatus(message, isError = false) {
        const status = document.getElementById('status');
        status.textContent = message;
        status.className = `reddit-extractor-status ${isError ? 'status-error' : 'status-success'}`;
        status.style.display = 'block';
        setTimeout(() => status.style.display = 'none', 3000);
    }

    // Main extraction function
    function extractComments() {
        try {
            const options = {
                minVotes: parseInt(document.getElementById('minVotes').value) || 0,
                maxDepth: parseInt(document.getElementById('maxDepth').value) || 4,
                includePost: document.getElementById('includePost').checked,
                includeDepth: document.getElementById('includeDepth').checked,
                includeVotes: document.getElementById('includeVotes').checked,
                includeUsername: document.getElementById('includeUsername').checked,
                includeDate: document.getElementById('includeDate').checked,
                includeProfile: document.getElementById('includeProfile').checked,
                includePermalink: document.getElementById('includePermalink').checked
            };

            const comments = Array.from(document.querySelectorAll('shreddit-comment, .comment'));
            console.log('Found comments:', comments.length);

            const extractedComments = [];
            const postData = options.includePost ? extractPostData() : null;

            comments.forEach(comment => {
                const data = extractCommentData(comment);
                if (data && data.depth <= options.maxDepth && data.votes >= options.minVotes) {
                    const commentObj = {
                        content: data.content
                    };

                    if (options.includeDepth) commentObj.depth = data.depth;
                    if (options.includeVotes) commentObj.votes = data.votes;
                    if (options.includeUsername) commentObj.username = data.username;
                    if (options.includeDate) commentObj.date = data.date;
                    if (options.includeProfile) commentObj.profileUrl = data.profileUrl;
                    if (options.includePermalink) commentObj.permalink = data.permalink;

                    extractedComments.push(commentObj);
                }
            });

            const basicPostData = {
                title: document.querySelector('h1[slot="title"]')?.textContent?.trim() || '',
                subreddit: document.querySelector('.subreddit-name a')?.textContent?.trim() || ''
            };

            const outputData = {
                metadata: {
                    extractionDate: new Date().toISOString(),
                    totalComments: extractedComments.length,
                    postTitle: basicPostData.title,
                    subreddit: basicPostData.subreddit,
                    criteria: {
                        minVotes: options.minVotes,
                        maxDepth: options.maxDepth
                    }
                },
                comments: extractedComments
            };

            if (options.includePost) {
                const fullPostData = extractPostData();
                if (fullPostData) {
                    outputData.post = {
                        content: fullPostData.content,
                        author: fullPostData.creditBar?.author || ''
                    };
                }
            }

            return JSON.stringify(outputData, null, 2);

        } catch (error) {

            console.error('Error during extraction:', error);
            showStatus('Error during extraction: ' + error.message, true);
            return null;
        }
    }

    // Initialize UI and add event listeners
    function initUI() {
        const container = createExtractorUI();
        let extractedData = '';

        document.getElementById('extractBtn').addEventListener('click', () => {
            console.log('Extract button clicked');
            extractedData = extractComments();
            if (extractedData) {
                const commentCount = JSON.parse(extractedData).comments.length;
                showStatus(`Extracted ${commentCount} comments`);
            }
        });

        document.getElementById('copyBtn').addEventListener('click', () => {
            if (!extractedData) {
                showStatus('Please extract comments first', true);
                return;
            }
            navigator.clipboard.writeText(extractedData)
                .then(() => showStatus('Copied to clipboard!'))
                .catch(err => {
                    console.error('Copy failed:', err);
                    showStatus('Failed to copy to clipboard', true);
                });
        });

        document.getElementById('downloadBtn').addEventListener('click', () => {
if (!extractedData) {
                showStatus('Please extract comments first', true);
                return;
            }
            const blob = new Blob([extractedData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'reddit-comments.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showStatus('Download started!');
        });
    }

    // Toggle UI visibility
    function toggleUI() {
        if (!container || !isUIVisible) {
            initUI();
            isUIVisible = true;
        } else {
            container.style.display = isUIVisible ? 'none' : 'block';
            isUIVisible = !isUIVisible;
        }
    }

    // Register the menu command
    GM_registerMenuCommand('Extract Reddit Comments', toggleUI);
})();
