// ==UserScript==
// @name         YouTube Auto Expand Comments and Replies
// @name:zh-CN   YouTube 自动展开评论和回复
// @name:zh-TW   YouTube 自動展開評論和回覆
// @name:ja      YouTube コメントと返信を自動展開
// @name:ko      YouTube 댓글 및 답글 자동 확장
// @name:es      Expansión automática de comentarios y respuestas de YouTube
// @name:fr      Expansion automatique des commentaires et réponses YouTube
// @name:de      Automatische Erweiterung von YouTube-Kommentaren und Antworten
// @namespace    https://github.com/SuperNG6/YouTube-Comment-Script
// @author       SuperNG6
// @version      1.6
// @description  Automatically expand comments and replies on YouTube with performance optimization
// @license      MIT
// @description:zh-CN  优化性能的YouTube视频评论自动展开
// @description:zh-TW  優化性能的YouTube視頻評論自動展開
// @description:ja     パフォーマンスを最適化したYouTubeコメント自動展開
// @description:ko     성능이 최적화된 YouTube 댓글 자동 확장
// @description:es     Expansión automática de comentarios de YouTube con rendimiento optimizado
// @description:fr     Extension automatique des commentaires YouTube avec optimisation des performances
// @description:de     Automatische Erweiterung von YouTube-Kommentaren mit Leistungsoptimierung
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/510581/YouTube%20Auto%20Expand%20Comments%20and%20Replies.user.js
// @updateURL https://update.greasyfork.org/scripts/510581/YouTube%20Auto%20Expand%20Comments%20and%20Replies.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = Object.freeze({
        // Performance settings
        SCROLL_THROTTLE: 250,      // Throttle scroll events (ms)
        MUTATION_THROTTLE: 150,    // Throttle mutation observer (ms)
        INITIAL_DELAY: 1500,       // Initial delay before starting (ms)
        CLICK_INTERVAL: 500,       // Interval between clicks (ms)
        
        // Operation limits
        MAX_RETRIES: 5,            // Maximum retries for finding comments
        MAX_CLICKS_PER_BATCH: 3,   // Maximum clicks per operation
        SCROLL_THRESHOLD: 0.8,     // Scroll threshold for loading (0-1)
        
        // State tracking
        EXPANDED_CLASS: 'yt-auto-expanded',  // Class to mark expanded items
        STATE_CHECK_INTERVAL: 2000, // Interval to check expanded state (ms)
        
        // Debug mode
        DEBUG: false
    });

    // Selectors map for better maintainability
    const SELECTORS = Object.freeze({
        COMMENTS: 'ytd-comments#comments',
        COMMENTS_SECTION: 'ytd-item-section-renderer#sections',
        REPLIES: 'ytd-comment-replies-renderer',
        MORE_COMMENTS: 'ytd-continuation-item-renderer #button:not([disabled])',
        SHOW_REPLIES: '#more-replies > yt-button-shape > button:not([disabled])',
        HIDDEN_REPLIES: 'ytd-comment-replies-renderer ytd-button-renderer#more-replies button:not([disabled])',
        EXPANDED_REPLIES: 'div#expander[expanded]',
        COMMENT_THREAD: 'ytd-comment-thread-renderer'
    });

    class YouTubeCommentExpander {
        constructor() {
            this.observer = null;
            this.retryCount = 0;
            this.isProcessing = false;
            this.lastScrollTime = 0;
            this.lastMutationTime = 0;
            this.expandedComments = new Set();
            this.scrollHandler = this.throttle(this.handleScroll.bind(this), CONFIG.SCROLL_THROTTLE);
        }

        log(...args) {
            if (CONFIG.DEBUG) {
                console.log('[YouTube Comment Expander]', ...args);
            }
        }

        // Utility: Throttle function
        throttle(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }

        // Utility: Generate unique ID for comment thread
        getCommentId(element) {
            const dataContext = element.getAttribute('data-context') || '';
            const timestamp = element.querySelector('#header-author time')?.getAttribute('datetime') || '';
            return `${dataContext}-${timestamp}`;
        }

        // Check if comment is already expanded
        isCommentExpanded(element) {
            const commentId = this.getCommentId(element);
            return this.expandedComments.has(commentId);
        }

        // Mark comment as expanded
        markAsExpanded(element) {
            const commentId = this.getCommentId(element);
            element.classList.add(CONFIG.EXPANDED_CLASS);
            this.expandedComments.add(commentId);
        }

        // Check if element is truly visible and clickable
        isElementClickable(element) {
            if (!element || !element.offsetParent || element.disabled) {
                return false;
            }
            
            const rect = element.getBoundingClientRect();
            const isVisible = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );

            // Additional checks for button state
            const isButton = element.tagName.toLowerCase() === 'button';
            const isEnabled = !element.disabled && !element.hasAttribute('disabled');
            const hasCorrectAriaExpanded = !element.hasAttribute('aria-expanded') || 
                                         element.getAttribute('aria-expanded') === 'false';

            return isVisible && isEnabled && (!isButton || hasCorrectAriaExpanded);
        }

        // Safely click elements with expanded state tracking
        async clickElements(selector, maxClicks = CONFIG.MAX_CLICKS_PER_BATCH) {
            let clickCount = 0;
            const elements = Array.from(document.querySelectorAll(selector));
            
            for (const element of elements) {
                if (clickCount >= maxClicks) break;
                
                const commentThread = element.closest(SELECTORS.COMMENT_THREAD);
                if (commentThread && this.isCommentExpanded(commentThread)) {
                    continue;
                }

                if (this.isElementClickable(element)) {
                    try {
                        element.scrollIntoView({ behavior: "auto", block: "center" });
                        await new Promise(resolve => setTimeout(resolve, 100));
                        
                        const wasClicked = element.click();
                        if (wasClicked && commentThread) {
                            this.markAsExpanded(commentThread);
                            clickCount++;
                            this.log(`Clicked and marked as expanded: ${selector}`);
                        }
                        
                        await new Promise(resolve => setTimeout(resolve, CONFIG.CLICK_INTERVAL));
                    } catch (error) {
                        this.log(`Click error: ${error.message}`);
                    }
                }
            }
            
            return clickCount > 0;
        }

        // Monitor expanded state
        monitorExpandedState() {
            setInterval(() => {
                const expandedThreads = document.querySelectorAll(`${SELECTORS.COMMENT_THREAD}.${CONFIG.EXPANDED_CLASS}`);
                expandedThreads.forEach(thread => {
                    const hasExpandedContent = thread.querySelector(SELECTORS.EXPANDED_REPLIES);
                    if (!hasExpandedContent) {
                        const commentId = this.getCommentId(thread);
                        this.expandedComments.delete(commentId);
                        thread.classList.remove(CONFIG.EXPANDED_CLASS);
                    }
                });
            }, CONFIG.STATE_CHECK_INTERVAL);
        }

        // Process visible elements
        async processVisibleElements() {
            if (this.isProcessing) return;
            this.isProcessing = true;

            try {
                const clickedMore = await this.clickElements(SELECTORS.MORE_COMMENTS);
                const clickedReplies = await this.clickElements(SELECTORS.SHOW_REPLIES);
                const clickedHidden = await this.clickElements(SELECTORS.HIDDEN_REPLIES);

                return clickedMore || clickedReplies || clickedHidden;
            } finally {
                this.isProcessing = false;
            }
        }

        // Handle scroll events
        async handleScroll() {
            const now = Date.now();
            if (now - this.lastScrollTime < CONFIG.SCROLL_THROTTLE) return;
            this.lastScrollTime = now;

            const scrollPosition = window.scrollY + window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            if (scrollPosition / documentHeight > CONFIG.SCROLL_THRESHOLD) {
                await this.processVisibleElements();
            }
        }

        // Setup mutation observer
        setupObserver() {
            const commentsSection = document.querySelector(SELECTORS.COMMENTS_SECTION);
            if (!commentsSection) return false;

            this.observer = new MutationObserver(
                this.throttle(async (mutations) => {
                    const now = Date.now();
                    if (now - this.lastMutationTime < CONFIG.MUTATION_THROTTLE) return;
                    this.lastMutationTime = now;

                    const hasRelevantChanges = mutations.some(mutation => 
                        mutation.addedNodes.length > 0 || 
                        mutation.attributeName === 'hidden' ||
                        mutation.attributeName === 'disabled'
                    );

                    if (hasRelevantChanges) {
                        await this.processVisibleElements();
                    }
                }, CONFIG.MUTATION_THROTTLE)
            );

            this.observer.observe(commentsSection, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['hidden', 'disabled', 'aria-expanded']
            });

            return true;
        }

        // Initialize the expander
        async init() {
            if (this.retryCount >= CONFIG.MAX_RETRIES) {
                this.log('Max retries reached, aborting initialization');
                return;
            }

            // Check if we're on a video page
            if (!window.location.pathname.startsWith('/watch')) {
                return;
            }

            // Wait for comments section
            if (!document.querySelector(SELECTORS.COMMENTS)) {
                this.retryCount++;
                this.log(`Retrying initialization (${this.retryCount}/${CONFIG.MAX_RETRIES})`);
                setTimeout(() => this.init(), CONFIG.INITIAL_DELAY);
                return;
            }

            // Setup observers and handlers
            if (this.setupObserver()) {
                window.addEventListener('scroll', this.scrollHandler, { passive: true });
                this.monitorExpandedState();
                await this.processVisibleElements();
                this.log('Initialization complete');
            }
        }

        // Cleanup resources
        cleanup() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            window.removeEventListener('scroll', this.scrollHandler);
            this.expandedComments.clear();
        }
    }

    // Initialize the expander when the page is ready
    const expander = new YouTubeCommentExpander();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(() => expander.init(), CONFIG.INITIAL_DELAY));
    } else {
        setTimeout(() => expander.init(), CONFIG.INITIAL_DELAY);
    }

    // Handle page navigation (for YouTube's SPA)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            expander.cleanup();
            setTimeout(() => expander.init(), CONFIG.INITIAL_DELAY);
        }
    }).observe(document.querySelector('body'), { childList: true, subtree: true });
})();