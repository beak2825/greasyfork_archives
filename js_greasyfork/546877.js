// ==UserScript==
// @name            Linkedin Sponsor Block
// @namespace       https://github.com/Hogwai/LinkedinSponsorBlock/
// @version         1.1.12
// @description:en  Remove sponsored posts, suggestions, and partner content on linkedin.com
// @description:fr  Supprime les publications sponsorisées, les suggestions et le contenu en partenariat sur linkedin.com
// @author          Hogwai
// @include         *://*.linkedin.*
// @include         *://*.linkedin.*/feed/*
// @grant           none
// @license         MIT
// @description Remove sponsored posts, suggestions, and partner content on linkedin.com
// @downloadURL https://update.greasyfork.org/scripts/546877/Linkedin%20Sponsor%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/546877/Linkedin%20Sponsor%20Block.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== ENVIRONNEMENT ====================
    const ENV = {
        isFirefoxExtension: typeof browser !== 'undefined' && !!browser.runtime?.id,
        isChromeExtension: typeof chrome !== 'undefined' && !!chrome.runtime?.id,
        isUserscript: typeof GM_info !== 'undefined'
    };

    // ==================== ABSTRACTION API ====================
    const runtime = {
        sendMessage(message) {
            if (ENV.isFirefoxExtension) {
                return browser.runtime.sendMessage(message).catch(() => {});
            }
            if (ENV.isChromeExtension) {
                return chrome.runtime.sendMessage(message).catch(() => {});
            }
            return Promise.resolve();
        },

        onMessage(callback) {
            if (ENV.isFirefoxExtension) {
                browser.runtime.onMessage.addListener(callback);
            }
            if (ENV.isChromeExtension) {
                chrome.runtime.sendMessage(message).catch(() => {});
            }

        }
    };

    // ==================== CONFIGURATION ====================
    const CONFIG = {
        ATTRIBUTES: {
            SCANNED: 'data-sponsor-scanned'
        },
        DELAYS: {
            OBSERVER_RETRY: 200,
            NOTIFICATION: 300
        },
        MAX_TEXT_LENGTH: 60,
        SELECTORS: {
            POST_CONTAINERS: [
                '.ember-view.occludable-update',
                '[class*="ember-view"][class*="occludable-update"]',
                'div[class*="feed-shared-update-v2"][id*="ember"]',
                'article[data-id="main-feed-card"]',
                'div[data-view-tracking-scope]'
            ],
            PROMOTED_MARKERS: [
                'span[aria-hidden="true"]:not([class]):not([id])',
                'span.text-color-text-low-emphasis',
                'span.update-components-header__text-view',
                'p[data-test-id="main-feed-card__header"]',
                'p[componentkey]'
            ],
            FEED_WRAPPER: {
                mobile: 'ol.feed-container',
                desktop: '[class*="scaffold-finite-scroll"][class*="scaffold-finite-scroll--infinite"]',
                newFeed: '[data-testid="mainFeed"]'
            }
        },
        SPONSORED_PATTERNS: [
            'sponsored',
            'SponsoredUpdateServed',
            'SPONSORED_UPDATE_SERVED',
            '"transporterKeys":["sponsored"]'
        ],
        SUGGESTIONS_PATTERNS: [
            '"transporterKeys":["default"]'
        ],
        PROMOTED_KEYWORDS: new Set([
            'Post sponsorisé','Suggestions','En partenariat avec','Promu(e) par ','Sponsorisé • En partenariat avec','Promues','Promu(e) par', // FRENCH
            'Promoted','Suggested',  // ENGLISH
            'Anzeige','Vorgeschlagen',  // GERMAN
            'Promocionado','Sugerencias', // SPANISH
            'الترويج', // ARABIC
            'Post sponsorizzato','Promosso da', // ITALIAN
            'প্রমোটেড', // BANGLA
            'Propagováno', // CZECH
            'Promoveret', // DANISH
            'Προωθημένη', // GREEK
            'تبلیغ‌شده', // PERSIAN
            'Mainostettu', // FINNISH
            'प्रमोट किया गया',  // HINDI
            'Kiemelt', // HUNGARIAN
            'Dipromosikan', // INDONESIAN
            'ממומן', // HEBREW
            'プロモーション', // JAPONESE
            '광고','추천됨','주최:',  // KOREAN
            'प्रमोट केले',  // MARATHI
            'Dipromosikan', // MALAYSIAN
            'Gepromoot', // DUTCH
            'Promotert',  // NORWEGIAN
            'ਪ੍ਰੋਮੋਟ ਕੀਤਾ ਗਿਆ',  // PUNJABI
            'Treść promowana', // POLISH
            'Promovido','Sugestões',  // PORTUGUESE
            'Promovat', // ROMANIAN
            'Продвигается', // RUSSIAN
            'Marknadsfört', // SWEDISH
            'ప్రమోట్ చేయబడింది', // TELUGU
            'ได้รับการโปรโมท',  // THAI
            'Nai-promote', // TAGALOG
            'Öne çıkarılan içerik', // TURKISH
            'Просувається', // UKRAINIAN
            'Được quảng bá', // VIETNAMESE
            '广告',  // CHINESE (SIMPLIFIED)
            '促銷內容' // CHINESE (TRADITIONAL)
        ].map(t => t.toLowerCase()))
    };

    // ==================== STATE & UTILS ====================
    const state = {
        observer: null,
        waiter: null,
        sessionRemoved: 0,
        isObserverConnected: false,
        isCurrentlyFeedPage: false
    };

    const logger = {
        buffer: [],
        scheduled: false,
        log(message) {
            this.buffer.push(message);
            if (!this.scheduled) {
                this.scheduled = true;
                requestIdleCallback(() => {
                    console.groupCollapsed(`[LinkedinSponsorBlock] ${this.buffer.length} hidden`);
                    this.buffer.forEach(msg => console.debug(msg));
                    console.groupEnd();
                    this.buffer = [];
                    this.scheduled = false;
                }, { timeout: 1000 });
            }
        }
    };

    const notifier = {
        pending: false,
        scheduled: false,
        queue() {
            this.pending = true;
            if (!this.scheduled) {
                this.scheduled = true;
                setTimeout(() => {
                    requestIdleCallback(() => {
                        if (this.pending) {
                            runtime.sendMessage({
                                type: "BLOCKED",
                                count: state.sessionRemoved
                            });
                            this.pending = false;
                        }
                        this.scheduled = false;
                    }, { timeout: 500 });
                }, CONFIG.DELAYS.NOTIFICATION);
            }
        }
    };

    // ==================== CORE LOGIC ====================
    const detector = {
        isPromotedText(text) {
            if (!text || text.length > CONFIG.MAX_TEXT_LENGTH) return false;
            const normalized = text.trim().toLowerCase();
            if (CONFIG.PROMOTED_KEYWORDS.has(normalized)) return true;
            return Array.from(CONFIG.PROMOTED_KEYWORDS).some(k => normalized.includes(k));
        },

        isSponsoredContainer(element) {
            const scope = element.getAttribute('data-view-tracking-scope');
            if (!scope) return false;
            return CONFIG.SPONSORED_PATTERNS.some(p => scope.includes(p));
        },

        isSuggestionsContainer(element) {
            const scope = element.getAttribute('data-view-tracking-scope');
            if (!scope) return false;
            return CONFIG.SUGGESTIONS_PATTERNS.some(p => scope.includes(p));
        },

        findPromotedMarker(post) {
            const markers = post.querySelectorAll(CONFIG.SELECTORS.PROMOTED_MARKERS.join(','));
            for (const marker of markers) {
                if (this.isPromotedText(marker.textContent)) return marker;
            }
            return null;
        },

        findPostContainer(element) {
            let current = element;
            while (current && current !== document.body) {
                if (current.hasAttribute('data-view-tracking-scope')) return current;
                if (current.matches?.('div[data-id^="urn:li:activity:"]')) {
                    return current.parentElement || current;
                }
                current = current.parentElement;
            }
            return null;
        }
    };

    const dom = {
        hidePost(post, promotedElement) {
            if (post.hasAttribute(CONFIG.ATTRIBUTES.SCANNED)) return false;
            const container = detector.findPostContainer(promotedElement) || post;
            container.style.display = 'none';
            container.setAttribute(CONFIG.ATTRIBUTES.SCANNED, 'true');
            post.setAttribute(CONFIG.ATTRIBUTES.SCANNED, 'true');
            state.sessionRemoved++;
            logger.log(`Hidden: "${promotedElement?.textContent?.trim()}"`);
            return true;
        },

        getUnscannedPosts(root) {
            const selector = CONFIG.SELECTORS.POST_CONTAINERS
                .map(s => `${s}:not([${CONFIG.ATTRIBUTES.SCANNED}])`)
                .join(',');
            const posts = [];
            if (root.matches?.(selector)) posts.push(root);
            posts.push(...root.querySelectorAll(selector));
            return posts;
        }
    };

    function processPost(post) {
        const promotedMarker = detector.findPromotedMarker(post);
        const isSponsoredByAttr = detector.isSponsoredContainer(post);
        const isSuggestionsByAttr = detector.isSuggestionsContainer(post);
        const hasSuggestionsText = promotedMarker && 
            promotedMarker.textContent.trim().toLowerCase() === 'suggestions';
        
        const isSponsored = promotedMarker || isSponsoredByAttr;
        const isSuggestions = isSuggestionsByAttr && hasSuggestionsText;
        
        if (!isSponsored && !isSuggestions) {
            post.setAttribute(CONFIG.ATTRIBUTES.SCANNED, 'false');
            return 0;
        }
        return dom.hidePost(post, promotedMarker || post) ? 1 : 0;
    }

    function scanFeed(root = document) {
        const posts = dom.getUnscannedPosts(root);
        let count = 0;
        for (const post of posts) count += processPost(post);
        if (count > 0) notifier.queue();
        return count;
    }

    // ==================== OBSERVER ====================
    function startObserver() {
        if (state.isObserverConnected) return;
        const { FEED_WRAPPER } = CONFIG.SELECTORS;
        const feed = document.querySelector(FEED_WRAPPER.newFeed) ||
                     document.querySelector(FEED_WRAPPER.mobile) || 
                     document.querySelector(FEED_WRAPPER.desktop);
        
        if (!feed) {
            setTimeout(startObserver, CONFIG.DELAYS.OBSERVER_RETRY);
            return;
        }
        
        state.observer = new MutationObserver(mutations => {
            let count = 0;
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) count += scanFeed(node);
                }
            }
            if (count > 0) notifier.queue();
        });
        
        state.observer.observe(feed, { childList: true, subtree: true });
        state.isObserverConnected = true;
        console.log('Feed detected');
        scanFeed(feed);
    }

    function stopObserver() {
        if (state.observer) {
            state.observer.disconnect();
            state.observer = null;
            state.isObserverConnected = false;
        }
    }

    // ==================== PAGE MANAGEMENT ====================
    function isFeedPage() {
        const path = location.pathname;
        return path.startsWith('/feed') || path.startsWith('/preload');
    }

    function handleUrlChange() {
        const wasFeedPage = state.isCurrentlyFeedPage;
        state.isCurrentlyFeedPage = isFeedPage();
        if (state.isCurrentlyFeedPage === wasFeedPage) return;
        stopObserver();
        if (state.isCurrentlyFeedPage) {
            state.sessionRemoved = 0;
            startObserver();
        }
    }

    // ==================== INIT ====================
    document.addEventListener('visibilitychange', () => {
        if (!state.isCurrentlyFeedPage) return;
        document.hidden ? stopObserver() : startObserver();
    });

    runtime.onMessage((message, _sender, sendResponse) => {
        if (message.type === 'URL_CHANGED') {
            handleUrlChange();
        } else if (message.type === 'MANUAL_SCAN') {
            sendResponse({ blocked: scanFeed() });
            stopObserver();
            startObserver();
            return true;
        }
    });

    if (ENV.isUserscript) {
        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                handleUrlChange();
            }
        }, 500);
    }

    state.isCurrentlyFeedPage = isFeedPage();
    
    if (document.body) {
        if (state.isCurrentlyFeedPage) startObserver();
    } else {
        state.waiter = new MutationObserver(() => {
            if (document.body) {
                state.waiter.disconnect();
                state.waiter = null;
                if (state.isCurrentlyFeedPage) startObserver();
            }
        });
        state.waiter.observe(document.documentElement, { childList: true });
    }
})();