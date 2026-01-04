// ==UserScript==
// @name         Reddit Auto-Translation Disabler
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Disable Reddit Auto-Translation and Partially Restore Translated Titles in Google Search Results
// @author       NagaYZ
// @match        *://www.google.com/search*
// @match        *://www.google.fr/search*
// @match        *://www.google.*/search*
// @match        *://www.reddit.com/*
// @match        *://reddit.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544341/Reddit%20Auto-Translation%20Disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/544341/Reddit%20Auto-Translation%20Disabler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isGoogleSearch = window.location.hostname.includes('google');
    const isReddit = window.location.hostname.includes('reddit.com');

    // ===== GOOGLE SEARCH: REDDIT TITLE RESTORER =====
    if (isGoogleSearch) {
        // Wait for document-end equivalent
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initGoogleScript);
        } else {
            initGoogleScript();
        }

        function initGoogleScript() {
            // Function to normalize text for comparison (remove extra spaces, lowercase)
            function normalizeText(text) {
                return text.toLowerCase().replace(/\s+/g, ' ').trim();
            }

            // Function to extract title from Reddit URL
            function extractTitleFromUrl(url) {
                try {
                    const cleanUrl = url.split('?')[0];
                    const match = cleanUrl.match(/\/r\/[^\/]+\/comments\/[^\/]+\/([^\/]+)/);

                    if (match && match[1]) {
                        let title = match[1];

                        // Decode URL encoding to handle special characters and accents
                        title = decodeURIComponent(title);

                        // Replace underscores and hyphens with spaces
                        title = title.replace(/[_-]/g, ' ');

                        const smallWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'into', 'is', 'it', 'of', 'on', 'or', 'the', 'to', 'with',
                                           'de', 'la', 'el', 'en', 'un', 'una', 'y', 'o', 'con', 'por', 'para'];

                        title = title.split(' ')
                            .map((word, index) => {
                                // Always capitalize first word
                                if (index === 0) {
                                    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                                }

                                // Keep small words lowercase unless they start a sentence
                                if (smallWords.includes(word.toLowerCase())) {
                                    return word.toLowerCase();
                                }

                                // Capitalize other words (handles accented characters properly)
                                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                            })
                            .join(' ');

                        return title;
                    }
                } catch (e) {
                    // Silently fail
                }
                return null;
            }

            // Function to clean Reddit URLs
            function cleanRedditUrl(url) {
                if (!url || !url.includes('reddit.com')) {
                    return url;
                }

                let cleanUrl = url;
                cleanUrl = cleanUrl.replace(/[?&]tl=[^&]*/g, '');
                cleanUrl = cleanUrl.replace(/[?&]translate=[^&]*/g, '');
                cleanUrl = cleanUrl.replace(/[?&]translation=[^&]*/g, '');
                cleanUrl = cleanUrl.replace(/[?&]$/, '');
                cleanUrl = cleanUrl.replace(/&&+/g, '&');
                cleanUrl = cleanUrl.replace(/\?&/, '?');

                return cleanUrl;
            }

            // Function to restore Reddit titles
            function restoreRedditTitles() {
                // Only select Reddit links that have translation parameter (?tl=)
                const redditLinks = document.querySelectorAll('a[href*="reddit.com/r/"][href*="/comments/"][href*="?tl="]');

                redditLinks.forEach(link => {
                    const originalHref = link.href;
                    const cleanedHref = cleanRedditUrl(originalHref);

                    if (originalHref !== cleanedHref) {
                        link.href = cleanedHref;
                    }

                    const titleElement = link.querySelector('h3');

                    if (titleElement && !titleElement.dataset.restored) {
                        const displayedTitle = titleElement.textContent;
                        const urlTitle = extractTitleFromUrl(link.href);

                        if (urlTitle) {
                            // Normalize both titles for comparison
                            const normalizedDisplayed = normalizeText(displayedTitle);
                            const normalizedUrl = normalizeText(urlTitle);

                            // Only replace if they're different (indicating translation occurred)
                            if (normalizedDisplayed !== normalizedUrl) {
                                titleElement.dataset.translatedTitle = displayedTitle;
                                titleElement.dataset.restored = 'true';
                                titleElement.textContent = urlTitle;
                                titleElement.style.fontStyle = 'normal';
                            } else {
                                // Mark as checked but not replaced
                                titleElement.dataset.restored = 'checked';
                            }
                        }
                    }

                    if (link.dataset.url) {
                        link.dataset.url = cleanRedditUrl(link.dataset.url);
                    }
                });

                // Clean citation URLs
                const citeElements = document.querySelectorAll('cite');
                citeElements.forEach(cite => {
                    if (cite.textContent.includes('reddit.com') && cite.textContent.includes('tl=')) {
                        cite.textContent = cleanRedditUrl(cite.textContent);
                    }
                });
            }

            // Add CSS
            const style = document.createElement('style');
            style.textContent = `
                a[href*="reddit.com"] h3[data-restored="true"] {
                    font-style: normal !important;
                }
            `;
            document.head.appendChild(style);

            // Run immediately
            restoreRedditTitles();

            // Intercept link clicks
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a[href*="reddit.com"]');
                if (link && link.href) {
                    const cleanedHref = cleanRedditUrl(link.href);
                    if (link.href !== cleanedHref) {
                        link.href = cleanedHref;
                    }
                }
            }, true);

            // MutationObserver for dynamic content
            const observer = new MutationObserver((mutations) => {
                let shouldProcess = false;

                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            if (node.matches && node.matches('a[href*="reddit.com"]')) {
                                shouldProcess = true;
                            } else if (node.querySelectorAll) {
                                const redditLinks = node.querySelectorAll('a[href*="reddit.com"]');
                                if (redditLinks.length > 0) {
                                    shouldProcess = true;
                                }
                            }
                        }
                    });
                });

                if (shouldProcess) {
                    setTimeout(restoreRedditTitles, 100);
                }
            });

            const startObserver = () => {
                if (document.body) {
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                } else {
                    setTimeout(startObserver, 100);
                }
            };

            startObserver();

            // Periodic check
            setInterval(restoreRedditTitles, 2000);

            // Handle navigation
            window.addEventListener('popstate', () => {
                setTimeout(restoreRedditTitles, 200);
            });

            // Handle Google's dynamic navigation
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;

            history.pushState = function() {
                const result = originalPushState.apply(this, arguments);
                setTimeout(restoreRedditTitles, 200);
                return result;
            };

            history.replaceState = function() {
                const result = originalReplaceState.apply(this, arguments);
                setTimeout(restoreRedditTitles, 200);
                return result;
            };
        }
    }

    // ===== REDDIT: AUTO-TRANSLATION DISABLER =====
    if (isReddit) {
        // Remove translation parameter from URL
        const currentUrl = window.location.href;
        const hasLanguageParam = currentUrl.includes('/?tl=');

        if (hasLanguageParam) {
            const cleanUrl = currentUrl.replace(/\/\?tl=[^&?]*(&|$)/, '/');
            if (cleanUrl !== currentUrl) {
                window.location.replace(cleanUrl);
            }
        }

        let settingCookie = false;

        // Function to set the translation cookie
        function setTranslationCookie() {
            if (settingCookie) return;

            settingCookie = true;
            const cookieValue = JSON.stringify({
                shouldDisplayCoachmark: false,
                shouldDisplayFeedbackCoachmark: false,
                coachmarkDisplayCount: 999,
                showCommentTranslationModal: false,
                showPostTranslationModal: false,
                isTranslationActive: false,
                translationEnabled: false,
                autoTranslate: false
            });

            document.cookie = `reddit_translation_status=${encodeURIComponent(cookieValue)}; path=/; domain=.reddit.com; max-age=31536000; SameSite=Lax`;
            settingCookie = false;
        }

        setTranslationCookie();

        // Intercept cookie modifications
        const originalCookieSetter = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie').set;
        const originalCookieGetter = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie').get;

        Object.defineProperty(document, 'cookie', {
            set: function(value) {
                if (!settingCookie && value.includes('reddit_translation_status')) {
                    if (value.includes('isTranslationActive":true') ||
                        value.includes('translationEnabled":true') ||
                        value.includes('autoTranslate":true')) {
                        setTranslationCookie();
                        return;
                    }
                }
                return originalCookieSetter.call(document, value);
            },
            get: function() {
                return originalCookieGetter.call(document);
            }
        });

        // Intercept fetch requests
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const url = args[0];

            if (typeof url === 'string' && url.includes('/svc/shreddit/graphql')) {
                try {
                    const body = args[1]?.body;
                    if (body && (body.includes('translate') || body.includes('translation'))) {
                        return Promise.resolve(new Response('{}', {
                            status: 200,
                            headers: { 'Content-Type': 'application/json' }
                        }));
                    }
                } catch (e) {
                    // Continue with normal fetch
                }
            }

            return originalFetch.apply(this, args);
        };

        // Intercept XMLHttpRequest
        const originalXHRSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(data) {
            if (this._url && this._url.includes('/svc/shreddit/graphql')) {
                try {
                    if (data && (data.includes('translate') || data.includes('translation'))) {
                        this.abort();
                        return;
                    }
                } catch (e) {
                    // Continue normally
                }
            }
            return originalXHRSend.apply(this, arguments);
        };

        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            this._url = url;
            return originalXHROpen.apply(this, arguments);
        };

        // Override localStorage translation settings
        function overrideTranslationSettings() {
            try {
                const settings = {
                    translationEnabled: false,
                    autoTranslate: false,
                    translationLanguage: null,
                    isTranslationActive: false
                };

                for (let key in localStorage) {
                    if (key.toLowerCase().includes('translat')) {
                        localStorage.setItem(key, JSON.stringify(settings));
                    }
                }
            } catch (e) {
                // Ignore errors
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', overrideTranslationSettings);
        } else {
            overrideTranslationSettings();
        }

        // Periodic check and disable translation
        setInterval(() => {
            setTranslationCookie();
            overrideTranslationSettings();

            try {
                const translationToggles = document.querySelectorAll('[aria-label*="translat"], [data-testid*="translat"], button[class*="translat"]');
                translationToggles.forEach(toggle => {
                    if (toggle.getAttribute('aria-checked') === 'true' || toggle.classList.contains('active')) {
                        toggle.click();
                    }
                });
            } catch (e) {
                // Ignore errors
            }
        }, 5000);

        // Mutation observer
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        try {
                            if (node.matches && (node.matches('[aria-label*="translat"], [data-testid*="translat"], button[class*="translat"]'))) {
                                if (node.getAttribute('aria-checked') === 'true' || node.classList.contains('active')) {
                                    setTimeout(() => node.click(), 100);
                                }
                            }
                        } catch (e) {
                            // Ignore errors
                        }
                    }
                });
            });
        });

        const startObserver = () => {
            if (document.body) {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            } else {
                setTimeout(startObserver, 100);
            }
        };

        startObserver();

        // Check for URL changes
        let lastUrl = window.location.href;
        setInterval(() => {
            if (window.location.href !== lastUrl) {
                lastUrl = window.location.href;
                const currentUrl = window.location.href;
                if (currentUrl.includes('/?tl=')) {
                    const cleanUrl = currentUrl.replace(/\/\?tl=[^&?]*(&|$)/, '/');
                    if (cleanUrl !== currentUrl) {
                        window.location.replace(cleanUrl);
                    }
                }
            }
        }, 1000);
    }
})();