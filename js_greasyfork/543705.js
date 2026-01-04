// ==UserScript==
// @name         RoyalRoad AI Rewriter Enhanced
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Advanced RoyalRoad chapter rewriter with Gemini AI - improved reliability and features
// @author       Enhanced
// @match        https://www.royalroad.com/fiction/*/chapter/*
// @match        https://royalroad.com/fiction/*/chapter/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/543705/RoyalRoad%20AI%20Rewriter%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/543705/RoyalRoad%20AI%20Rewriter%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
        MAX_CHUNK_SIZE: 35000, // Conservative limit
        MAX_RETRIES: 3,
        RETRY_DELAY: 2000,
        RATE_LIMIT_DELAY: 1500,
        MIN_CHAPTER_LENGTH: 200,
        MAX_TOKENS: 81920
    };

    // Enhanced rewriting prompt
    const REWRITE_PROMPT = `You are an expert fiction editor specializing in web novels. Rewrite the following chapter text to dramatically improve reader retention and engagement.

Core Requirements:
    -Preserve all plot events and character actions exactly.
    -Retain all dialogue content; improving delivery and dialogue tags is allowed.
    -Maintain the original point of view and narrative voice.
    -Keep chapter length consistent; avoid significant expansion or compression.
    -Aim to increase reader retention throughout.

Style Enhancement Guidelines:
    -Apply descriptive pacing to control narrative rhythm.
    -Use simple, direct language that flows naturally.
    -Employ dialogue-driven exposition (“show, don’t tell”).
    -Make character dialogue informal, engaging, and full of personality.
    -Incorporate rich sensory details and environmental descriptions.
    -Include brief explanatory asides in parentheses when helpful.
    -Enhance emotional beats and character reactions.
    -Vary sentence structure to improve flow and readability.
    -Introduce subtle tension and hooks to sustain engagement.

Technical Requirements:
    -Preserve paragraph structure and breaks.
    -Maintain proper formatting.
    -Return ONLY the rewritten text; no meta-commentary or explanations.
    -Ensure the rewrite feels natural and seamless.

Chapter text to rewrite:

`;

    // Utility functions
    const Utils = {
        // Debounce function calls
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Sleep function
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        // Sanitize text content
        sanitizeText(text) {
            return text
                .replace(/\s+/g, ' ')
                .replace(/[^\w\s.,!?;:"'-()]/g, '')
                .trim();
        },

        // Calculate text similarity (simple Jaccard index)
        textSimilarity(text1, text2) {
            const words1 = new Set(text1.toLowerCase().split(/\s+/));
            const words2 = new Set(text2.toLowerCase().split(/\s+/));
            const intersection = new Set([...words1].filter(x => words2.has(x)));
            const union = new Set([...words1, ...words2]);
            return intersection.size / union.size;
        }
    };

    // API Management
    class APIManager {
        constructor() {
            this.requestCount = 0;
            this.lastRequestTime = 0;
        }

        getApiKey() {
            let apiKey = GM_getValue('gemini_api_key', '');
            if (!apiKey) {
                apiKey = prompt(
                    'Please enter your Gemini API key:\n\n' +
                    '1. Go to https://ai.google.dev/\n' +
                    '2. Create an account and get your API key\n' +
                    '3. Paste it below:'
                );
                if (apiKey && apiKey.trim()) {
                    GM_setValue('gemini_api_key', apiKey.trim());
                    return apiKey.trim();
                }
                return null;
            }
            return apiKey;
        }

        async makeRequest(text, retryCount = 0) {
            const apiKey = this.getApiKey();
            if (!apiKey) {
                throw new Error('No API key provided');
            }

            // Rate limiting
            const now = Date.now();
            const timeSinceLastRequest = now - this.lastRequestTime;
            if (timeSinceLastRequest < CONFIG.RATE_LIMIT_DELAY) {
                await Utils.sleep(CONFIG.RATE_LIMIT_DELAY - timeSinceLastRequest);
            }

            const requestData = {
                contents: [{
                    parts: [{
                        text: REWRITE_PROMPT + text
                    }]
                }],
                generationConfig: {
                    temperature: 0.8,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: CONFIG.MAX_TOKENS,
                    stopSequences: []
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_NONE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_NONE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_NONE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_NONE"
                    }
                ]
            };

            return new Promise((resolve, reject) => {
                this.lastRequestTime = Date.now();
                this.requestCount++;

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${CONFIG.GEMINI_API_URL}?key=${apiKey}`,
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'RoyalRoad-Rewriter/2.0'
                    },
                    data: JSON.stringify(requestData),
                    timeout: 30000,
                    onload: (response) => {
                        try {
                            const data = JSON.parse(response.responseText);

                            if (response.status === 429 && retryCount < CONFIG.MAX_RETRIES) {
                                // Rate limited, retry with exponential backoff
                                setTimeout(() => {
                                    this.makeRequest(text, retryCount + 1)
                                        .then(resolve)
                                        .catch(reject);
                                }, CONFIG.RETRY_DELAY * Math.pow(2, retryCount));
                                return;
                            }

                            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                                const rewrittenText = data.candidates[0].content.parts[0].text;
                                resolve(rewrittenText.trim());
                            } else if (data.error) {
                                reject(new Error(`API Error: ${data.error.message}`));
                            } else {
                                reject(new Error('Unexpected API response format'));
                            }
                        } catch (e) {
                            if (retryCount < CONFIG.MAX_RETRIES) {
                                setTimeout(() => {
                                    this.makeRequest(text, retryCount + 1)
                                        .then(resolve)
                                        .catch(reject);
                                }, CONFIG.RETRY_DELAY);
                            } else {
                                reject(new Error(`Failed to parse API response: ${e.message}`));
                            }
                        }
                    },
                    onerror: (error) => {
                        if (retryCount < CONFIG.MAX_RETRIES) {
                            setTimeout(() => {
                                this.makeRequest(text, retryCount + 1)
                                    .then(resolve)
                                    .catch(reject);
                            }, CONFIG.RETRY_DELAY);
                        } else {
                            reject(new Error(`Request failed: ${error.statusText || 'Network error'}`));
                        }
                    },
                    ontimeout: () => {
                        if (retryCount < CONFIG.MAX_RETRIES) {
                            setTimeout(() => {
                                this.makeRequest(text, retryCount + 1)
                                    .then(resolve)
                                    .catch(reject);
                            }, CONFIG.RETRY_DELAY);
                        } else {
                            reject(new Error('Request timed out'));
                        }
                    }
                });
            });
        }
    }

    // Content Management
    class ContentManager {
        constructor() {
            this.originalContent = null;
            this.chapterElement = null;
        }

        findChapterContent() {
            // Enhanced selectors for RoyalRoad
            const selectors = [
                '.chapter-content',
                'div.chapter-content',
                '.chapter-inner',
                '.portlet-body .chapter-content',
                '.fiction-page .chapter-content',
                '[data-chapter-content]',
                '.col-md-7 .portlet-body', // Common RoyalRoad layout
                '.chapter-container .portlet-body'
            ];

            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element && this.isValidChapterElement(element)) {
                    return element;
                }
            }

            // Enhanced fallback search
            return this.findLargestTextContainer();
        }

        isValidChapterElement(element) {
            const text = element.innerText || element.textContent || '';
            const hasEnoughText = text.length > CONFIG.MIN_CHAPTER_LENGTH;
            const hasChapterStructure = element.querySelector('p') || text.includes('\n');
            const notNavigation = !element.closest('nav') && !element.closest('.navigation');

            return hasEnoughText && hasChapterStructure && notNavigation;
        }

        findLargestTextContainer() {
            const candidates = Array.from(document.querySelectorAll('div, section, article'))
                .filter(el => {
                    const style = window.getComputedStyle(el);
                    return style.display !== 'none' && style.visibility !== 'hidden';
                })
                .map(el => ({
                    element: el,
                    textLength: (el.innerText || '').length,
                    text: el.innerText || ''
                }))
                .filter(item => item.textLength > CONFIG.MIN_CHAPTER_LENGTH)
                .sort((a, b) => b.textLength - a.textLength);

            return candidates.length > 0 ? candidates[0].element : null;
        }

        extractCleanText(element) {
            // Create a clone to avoid modifying original
            const clone = element.cloneNode(true);

            // Remove unwanted elements
            const unwantedSelectors = [
                'script', 'style', 'noscript', '.advertisement', '.ads',
                '.author-note', '.navigation', 'nav', '.comments'
            ];

            unwantedSelectors.forEach(selector => {
                clone.querySelectorAll(selector).forEach(el => el.remove());
            });

            // Get text with basic structure preservation
            const text = this.getStructuredText(clone);
            return Utils.sanitizeText(text);
        }

        getStructuredText(element) {
            let result = '';
            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
                {
                    acceptNode: (node) => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
                        }
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const tagName = node.tagName.toLowerCase();
                            if (['p', 'div', 'br', 'hr'].includes(tagName)) {
                                return NodeFilter.FILTER_ACCEPT;
                            }
                        }
                        return NodeFilter.FILTER_SKIP;
                    }
                }
            );

            let node;
            while (node = walker.nextNode()) {
                if (node.nodeType === Node.TEXT_NODE) {
                    result += node.textContent.trim() + ' ';
                } else if (node.tagName.toLowerCase() === 'p') {
                    result += '\n\n';
                }
            }

            return result.replace(/\s+/g, ' ').replace(/\n\s*\n/g, '\n\n');
        }

        intelligentChunking(text) {
            const chunks = [];
            const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
            let currentChunk = '';

            for (const paragraph of paragraphs) {
                const tentativeChunk = currentChunk + (currentChunk ? '\n\n' : '') + paragraph;

                if (tentativeChunk.length > CONFIG.MAX_CHUNK_SIZE && currentChunk) {
                    // Try to find a good break point
                    const sentences = currentChunk.split(/(?<=[.!?])\s+/);
                    if (sentences.length > 1) {
                        // Keep most sentences, start next chunk with remainder
                        const breakPoint = Math.floor(sentences.length * 0.8);
                        chunks.push(sentences.slice(0, breakPoint).join(' '));
                        currentChunk = sentences.slice(breakPoint).join(' ') + '\n\n' + paragraph;
                    } else {
                        chunks.push(currentChunk);
                        currentChunk = paragraph;
                    }
                } else {
                    currentChunk = tentativeChunk;
                }
            }

            if (currentChunk.trim()) {
                chunks.push(currentChunk);
            }

            return chunks.filter(chunk => chunk.trim().length > 50);
        }

        replaceContent(element, newText) {
            // Store original if not already stored
            if (!this.originalContent) {
                this.originalContent = element.innerHTML;
            }

            // Convert text to HTML with proper paragraph structure
            const htmlContent = this.textToHtml(newText);
            element.innerHTML = htmlContent;
        }

        textToHtml(text) {
            return text
                .split(/\n\s*\n/)
                .filter(p => p.trim())
                .map(paragraph => `<p>${paragraph.trim().replace(/\n/g, '<br>')}</p>`)
                .join('\n');
        }

        restoreOriginal(element) {
            if (this.originalContent) {
                element.innerHTML = this.originalContent;
                return true;
            }
            return false;
        }
    }

    // UI Management
    class UIManager {
        constructor() {
            this.panel = null;
            this.elements = {};
            this.isProcessing = false;
        }

        createUI() {
            this.panel = document.createElement('div');
            this.panel.id = 'ai-rewriter-panel';
            this.panel.innerHTML = `
                <div class="panel-header">
                    <h3>🎯 AI Chapter Rewriter</h3>
                    <button class="minimize-btn" title="Minimize">−</button>
                </div>
                <div class="panel-content">
                    <div class="button-group">
                        <button class="btn btn-primary" id="rewrite-btn">
                            <span class="btn-icon">✨</span> Rewrite Chapter
                        </button>
                        <button class="btn btn-secondary" id="reset-btn">
                            <span class="btn-icon">↩️</span> Reset Original
                        </button>
                    </div>
                    <div class="advanced-controls">
                        <button class="btn btn-small" id="settings-btn">⚙️ Settings</button>
                        <button class="btn btn-small" id="preview-btn">👁️ Preview</button>
                    </div>
                    <div class="progress-container" style="display: none;">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                        <div class="progress-text">Initializing...</div>
                    </div>
                    <div class="status-display" id="status-display">Ready to enhance your chapter</div>
                </div>
            `;

            this.addStyles();
            this.setupEventListeners();
            document.body.appendChild(this.panel);

            // Cache elements
            this.elements = {
                rewriteBtn: this.panel.querySelector('#rewrite-btn'),
                resetBtn: this.panel.querySelector('#reset-btn'),
                settingsBtn: this.panel.querySelector('#settings-btn'),
                previewBtn: this.panel.querySelector('#preview-btn'),
                statusDisplay: this.panel.querySelector('#status-display'),
                progressContainer: this.panel.querySelector('.progress-container'),
                progressFill: this.panel.querySelector('.progress-fill'),
                progressText: this.panel.querySelector('.progress-text'),
                minimizeBtn: this.panel.querySelector('.minimize-btn')
            };
        }

        addStyles() {
            const style = document.createElement('style');
            style.textContent = `
                #ai-rewriter-panel {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 280px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    z-index: 10000;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    color: white;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                }

                #ai-rewriter-panel.minimized .panel-content {
                    display: none;
                }

                .panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .panel-header h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                }

                .minimize-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 16px;
                    line-height: 1;
                }

                .panel-content {
                    padding: 16px;
                }

                .button-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-bottom: 12px;
                }

                .btn {
                    border: none;
                    padding: 10px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                }

                .btn-primary {
                    background: rgba(255, 255, 255, 0.9);
                    color: #667eea;
                }

                .btn-secondary {
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }

                .btn-small {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    padding: 6px 12px;
                    font-size: 12px;
                }

                .btn:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }

                .btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .advanced-controls {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 12px;
                }

                .progress-container {
                    margin-bottom: 12px;
                }

                .progress-bar {
                    width: 100%;
                    height: 6px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 3px;
                    overflow: hidden;
                    margin-bottom: 6px;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #4CAF50, #8BC34A);
                    border-radius: 3px;
                    transition: width 0.3s ease;
                    width: 0%;
                }

                .progress-text {
                    font-size: 12px;
                    opacity: 0.9;
                    text-align: center;
                }

                .status-display {
                    font-size: 12px;
                    opacity: 0.9;
                    text-align: center;
                    padding: 8px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                }

                .status-display.error {
                    background: rgba(244, 67, 54, 0.3);
                }

                .status-display.success {
                    background: rgba(76, 175, 80, 0.3);
                }

                .status-display.processing {
                    background: rgba(33, 150, 243, 0.3);
                }
            `;
            document.head.appendChild(style);
        }

        setupEventListeners() {
            // Minimize functionality
            this.panel.addEventListener('click', (e) => {
                if (e.target.classList.contains('minimize-btn')) {
                    this.panel.classList.toggle('minimized');
                    e.target.textContent = this.panel.classList.contains('minimized') ? '+' : '−';
                }
            });

            // Make panel draggable
            this.makeDraggable();
        }

        makeDraggable() {
            let isDragging = false;
            let startX, startY, startLeft, startTop;

            const header = this.panel.querySelector('.panel-header h3');
            header.style.cursor = 'move';

            header.addEventListener('mousedown', (e) => {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                const rect = this.panel.getBoundingClientRect();
                startLeft = rect.left;
                startTop = rect.top;
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;

                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                this.panel.style.left = Math.max(0, Math.min(window.innerWidth - this.panel.offsetWidth, startLeft + deltaX)) + 'px';
                this.panel.style.top = Math.max(0, Math.min(window.innerHeight - this.panel.offsetHeight, startTop + deltaY)) + 'px';
                this.panel.style.right = 'auto';
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });
        }

        updateStatus(message, type = 'info') {
            const statusElement = this.elements.statusDisplay;
            statusElement.textContent = message;
            statusElement.className = `status-display ${type}`;
        }

        updateProgress(percent, message) {
            this.elements.progressContainer.style.display = 'block';
            this.elements.progressFill.style.width = `${percent}%`;
            this.elements.progressText.textContent = message;
        }

        hideProgress() {
            this.elements.progressContainer.style.display = 'none';
        }

        setProcessing(isProcessing) {
            this.isProcessing = isProcessing;
            this.elements.rewriteBtn.disabled = isProcessing;
            this.elements.resetBtn.disabled = isProcessing;

            if (isProcessing) {
                this.elements.rewriteBtn.innerHTML = '<span class="btn-icon">⏳</span> Processing...';
            } else {
                this.elements.rewriteBtn.innerHTML = '<span class="btn-icon">✨</span> Rewrite Chapter';
            }
        }

        showNotification(message, type = 'info') {
            if (typeof GM_notification !== 'undefined') {
                GM_notification({
                    text: message,
                    title: 'AI Rewriter',
                    timeout: 3000
                });
            }
        }
    }

    // Main Application
    class RoyalRoadRewriter {
        constructor() {
            this.apiManager = new APIManager();
            this.contentManager = new ContentManager();
            this.uiManager = new UIManager();
            this.isInitialized = false;
        }

        async init() {
            if (!this.isChapterPage()) {
                return;
            }

            // Wait for page to be fully loaded
            if (document.readyState !== 'complete') {
                await new Promise(resolve => {
                    window.addEventListener('load', resolve);
                });
            }

            // Additional wait for dynamic content
            await Utils.sleep(1000);

            this.uiManager.createUI();
            this.setupEventListeners();
            this.isInitialized = true;

            // Verify chapter content is available
            const chapterElement = this.contentManager.findChapterContent();
            if (!chapterElement) {
                this.uiManager.updateStatus('⚠️ Chapter content not detected', 'error');
            } else {
                this.uiManager.updateStatus('✅ Ready to enhance chapter', 'success');
            }
        }

        isChapterPage() {
            return window.location.pathname.includes('/chapter/') ||
                   window.location.pathname.includes('/fiction/') &&
                   document.title.toLowerCase().includes('chapter');
        }

        setupEventListeners() {
            this.uiManager.elements.rewriteBtn.addEventListener('click',
                Utils.debounce(() => this.rewriteChapter(), 500));

            this.uiManager.elements.resetBtn.addEventListener('click',
                () => this.resetChapter());

            this.uiManager.elements.settingsBtn.addEventListener('click',
                () => this.showSettings());

            this.uiManager.elements.previewBtn.addEventListener('click',
                () => this.showPreview());
        }

        async rewriteChapter() {
            if (this.uiManager.isProcessing) return;

            try {
                this.uiManager.setProcessing(true);
                this.uiManager.updateStatus('🔍 Analyzing chapter...', 'processing');
                this.uiManager.updateProgress(10, 'Finding chapter content...');

                const chapterElement = this.contentManager.findChapterContent();
                if (!chapterElement) {
                    throw new Error('Could not locate chapter content. Try refreshing the page.');
                }

                this.uiManager.updateProgress(20, 'Extracting text...');
                const originalText = this.contentManager.extractCleanText(chapterElement);

                if (originalText.length < CONFIG.MIN_CHAPTER_LENGTH) {
                    throw new Error(`Chapter too short (${originalText.length} chars). Minimum ${CONFIG.MIN_CHAPTER_LENGTH} required.`);
                }

                this.uiManager.updateProgress(30, 'Preparing content for AI...');
                const chunks = this.contentManager.intelligentChunking(originalText);

                if (chunks.length === 0) {
                    throw new Error('Failed to process chapter content');
                }

                this.uiManager.updateStatus(`🤖 Processing ${chunks.length} sections...`, 'processing');

                const rewrittenChunks = [];
                for (let i = 0; i < chunks.length; i++) {
                    const progress = 30 + ((i / chunks.length) * 50);
                    this.uiManager.updateProgress(progress, `Rewriting section ${i + 1}/${chunks.length}...`);

                    try {
                        const rewritten = await this.apiManager.makeRequest(chunks[i]);
                        rewrittenChunks.push(rewritten);

                        // Rate limiting between requests
                        if (i < chunks.length - 1) {
                            await Utils.sleep(CONFIG.RATE_LIMIT_DELAY);
                        }
                    } catch (error) {
                        console.error(`Failed to rewrite chunk ${i + 1}:`, error);
                        throw new Error(`Failed to process section ${i + 1}: ${error.message}`);
                    }
                }

                this.uiManager.updateProgress(85, 'Applying changes...');
                const finalText = rewrittenChunks.join('\n\n');
                this.contentManager.replaceContent(chapterElement, finalText);

                this.uiManager.updateProgress(100, 'Complete!');
                await Utils.sleep(500);
                this.uiManager.hideProgress();

                const similarity = Utils.textSimilarity(originalText, finalText);
                this.uiManager.updateStatus(`✨ Chapter enhanced! (${Math.round(similarity * 100)}% content preserved)`, 'success');
                this.uiManager.showNotification('Chapter successfully rewritten!', 'success');

            } catch (error) {
                console.error('Rewrite failed:', error);
                this.uiManager.hideProgress();
                this.uiManager.updateStatus(`❌ ${error.message}`, 'error');
                this.uiManager.showNotification(`Error: ${error.message}`, 'error');
            } finally {
                this.uiManager.setProcessing(false);
            }
        }

        resetChapter() {
            try {
                const chapterElement = this.contentManager.findChapterContent();
                if (!chapterElement) {
                    throw new Error('Could not find chapter content');
                }

                const restored = this.contentManager.restoreOriginal(chapterElement);
                if (restored) {
                    this.uiManager.updateStatus('↩️ Original content restored', 'success');
                    this.uiManager.showNotification('Chapter reset to original', 'success');
                } else {
                    this.uiManager.updateStatus('⚠️ No original content to restore', 'error');
                }
            } catch (error) {
                console.error('Reset failed:', error);
                this.uiManager.updateStatus(`❌ Reset failed: ${error.message}`, 'error');
            }
        }

        showSettings() {
            const currentKey = GM_getValue('gemini_api_key', '');
            const settingsHtml = `
                <div style="background: white; color: black; padding: 20px; border-radius: 8px; max-width: 400px;">
                    <h3>AI Rewriter Settings</h3>
                    <div style="margin-bottom: 15px;">
                        <label for="api-key-input" style="display: block; margin-bottom: 5px; font-weight: bold;">
                            Gemini API Key:
                        </label>
                        <input type="password" id="api-key-input" value="${currentKey}"
                               style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                        <small style="color: #666; display: block; margin-top: 5px;">
                            Get your API key from <a href="https://ai.google.dev/" target="_blank">ai.google.dev</a>
                        </small>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">
                            Model Settings:
                        </label>
                        <select id="model-select" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                            <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash (Recommended)</option>
                            <option value="gemini-1.5-pro">Gemini 1.5 Pro (Higher quality)</option>
                            <option value="gemini-1.5-flash">Gemini 1.5 Flash (Faster)</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label for="chunk-size" style="display: block; margin-bottom: 5px; font-weight: bold;">
                            Chunk Size (characters):
                        </label>
                        <input type="number" id="chunk-size" value="${CONFIG.MAX_CHUNK_SIZE}"
                               min="1000" max="8000" step="500"
                               style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                        <small style="color: #666; display: block; margin-top: 5px;">
                            Smaller chunks = more API calls but better quality
                        </small>
                    </div>
                    <div style="text-align: right; margin-top: 20px;">
                        <button id="save-settings" style="background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; margin-right: 8px; cursor: pointer;">
                            Save
                        </button>
                        <button id="cancel-settings" style="background: #6c757d; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                            Cancel
                        </button>
                    </div>
                </div>
            `;

            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.7); z-index: 20000;
                display: flex; justify-content: center; align-items: center;
            `;
            overlay.innerHTML = settingsHtml;
            document.body.appendChild(overlay);

            // Event listeners for settings modal
            const saveBtn = overlay.querySelector('#save-settings');
            const cancelBtn = overlay.querySelector('#cancel-settings');
            const apiKeyInput = overlay.querySelector('#api-key-input');
            const modelSelect = overlay.querySelector('#model-select');
            const chunkSizeInput = overlay.querySelector('#chunk-size');

            // Set current values
            const currentModel = GM_getValue('gemini_model', 'gemini-2.0-flash-exp');
            modelSelect.value = currentModel;

            saveBtn.addEventListener('click', () => {
                const newApiKey = apiKeyInput.value.trim();
                const newModel = modelSelect.value;
                const newChunkSize = parseInt(chunkSizeInput.value);

                if (newApiKey) {
                    GM_setValue('gemini_api_key', newApiKey);
                }
                GM_setValue('gemini_model', newModel);
                GM_setValue('chunk_size', newChunkSize);

                // Update CONFIG
                CONFIG.MAX_CHUNK_SIZE = newChunkSize;
                CONFIG.GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${newModel}:generateContent`;

                this.uiManager.updateStatus('⚙️ Settings saved successfully', 'success');
                document.body.removeChild(overlay);
            });

            cancelBtn.addEventListener('click', () => {
                document.body.removeChild(overlay);
            });

            // Close on overlay click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    document.body.removeChild(overlay);
                }
            });
        }

        showPreview() {
            const chapterElement = this.contentManager.findChapterContent();
            if (!chapterElement) {
                this.uiManager.updateStatus('❌ No chapter content found', 'error');
                return;
            }

            const originalText = this.contentManager.extractCleanText(chapterElement);
            const chunks = this.contentManager.intelligentChunking(originalText);

            const previewHtml = `
                <div style="background: white; color: black; padding: 20px; border-radius: 8px; max-width: 600px; max-height: 80vh; overflow-y: auto;">
                    <h3>Chapter Analysis Preview</h3>
                    <div style="margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 4px;">
                        <strong>📊 Statistics:</strong><br>
                        • Total characters: ${originalText.length.toLocaleString()}<br>
                        • Word count: ~${Math.round(originalText.split(/\s+/).length).toLocaleString()}<br>
                        • Processing chunks: ${chunks.length}<br>
                        • Estimated API calls: ${chunks.length}<br>
                        • Estimated processing time: ${Math.round(chunks.length * 2)} seconds
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>📝 First chunk preview (${chunks[0]?.length || 0} chars):</strong>
                        <div style="margin-top: 8px; padding: 10px; background: #f8f9fa; border-left: 3px solid #007bff; font-family: monospace; font-size: 12px; white-space: pre-wrap; max-height: 200px; overflow-y: auto;">
${chunks[0]?.substring(0, 500) || 'No content'}${chunks[0]?.length > 500 ? '...' : ''}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <button id="close-preview" style="background: #6c757d; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                            Close
                        </button>
                    </div>
                </div>
            `;

            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.7); z-index: 20000;
                display: flex; justify-content: center; align-items: center;
            `;
            overlay.innerHTML = previewHtml;
            document.body.appendChild(overlay);

            const closeBtn = overlay.querySelector('#close-preview');
            closeBtn.addEventListener('click', () => {
                document.body.removeChild(overlay);
            });

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    document.body.removeChild(overlay);
                }
            });
        }

        // Cleanup and error recovery
        cleanup() {
            if (this.uiManager.panel) {
                this.uiManager.panel.remove();
            }
        }

        // Health check for continuous operation
        healthCheck() {
            const chapterElement = this.contentManager.findChapterContent();
            if (!chapterElement && this.isInitialized) {
                this.uiManager.updateStatus('⚠️ Chapter content lost - try refreshing', 'error');
                return false;
            }
            return true;
        }
    }

    // Global instance and initialization
    let rewriterInstance = null;

    function initializeRewriter() {
        // Prevent multiple instances
        if (rewriterInstance) {
            rewriterInstance.cleanup();
        }

        rewriterInstance = new RoyalRoadRewriter();
        rewriterInstance.init().catch(error => {
            console.error('Failed to initialize RoyalRoad Rewriter:', error);
        });
    }

    // Smart initialization based on page state
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeRewriter);
    } else {
        // Page already loaded, initialize after a short delay
        setTimeout(initializeRewriter, 500);
    }

    // Handle navigation changes (for SPA-like behavior)
    let lastUrl = window.location.href;
    const urlCheckInterval = setInterval(() => {
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            if (rewriterInstance) {
                rewriterInstance.cleanup();
                rewriterInstance = null;
            }
            // Reinitialize if still on a chapter page
            setTimeout(() => {
                if (window.location.pathname.includes('/chapter/')) {
                    initializeRewriter();
                }
            }, 1000);
        }
    }, 1000);

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        clearInterval(urlCheckInterval);
        if (rewriterInstance) {
            rewriterInstance.cleanup();
        }
    });

    // Health monitoring (check every 30 seconds)
    setInterval(() => {
        if (rewriterInstance && !rewriterInstance.healthCheck()) {
            console.warn('RoyalRoad Rewriter health check failed');
        }
    }, 30000);

    // Global error handler for uncaught errors
    window.addEventListener('error', (event) => {
        if (event.error && event.error.stack && event.error.stack.includes('RoyalRoad')) {
            console.error('RoyalRoad Rewriter error:', event.error);
            if (rewriterInstance && rewriterInstance.uiManager) {
                rewriterInstance.uiManager.updateStatus('❌ Unexpected error occurred', 'error');
            }
        }
    });

    // Export for debugging (remove in production)
    if (typeof window !== 'undefined') {
        window.RoyalRoadRewriter = RoyalRoadRewriter;
        window.rewriterInstance = () => rewriterInstance;
    }

})();