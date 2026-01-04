// ==UserScript==
// @name         Filter AI on Pinterest
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Filter AI content from API responses on Pinterest with persistent cache and add red transparency to AI-generated page images
// @author       FilterScripts
// @match        *://*.pinterest.com/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537280/Filter%20AI%20on%20Pinterest.user.js
// @updateURL https://update.greasyfork.org/scripts/537280/Filter%20AI%20on%20Pinterest.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const REQUEST_URL_PATTERNS = ["RelatedModulesResource/get", "BoardContentRecommendationResource/get"];

    // Cache keys for localStorage
    const LOOKUP_CACHE_KEY = 'pinterest_ai_filter_lookup_cache';
    const AI_CACHE_KEY = 'pinterest_ai_filter_ai_cache';

    // Persistent cache utilities
    const PersistentCache = {
        // Load cache from localStorage
        loadCache: function(key) {
            try {
                const data = localStorage.getItem(key);
                return data ? new Set(JSON.parse(data)) : new Set();
            } catch (error) {
                console.error(`Pinterest AI Filter: Error loading cache ${key}:`, error);
                return new Set();
            }
        },

        // Save cache to localStorage
        saveCache: function(key, cache) {
            try {
                localStorage.setItem(key, JSON.stringify([...cache]));
            } catch (error) {
                console.error(`Pinterest AI Filter: Error saving cache ${key}:`, error);
            }
        },

        // Add item to cache and persist
        addToCache: function(key, cache, item) {
            cache.add(item);
            this.saveCache(key, cache);
        },

        // Check if item exists in cache
        hasInCache: function(cache, item) {
            return cache.has(item);
        },

        // Clear cache (optional utility)
        clearCache: function(key) {
            try {
                localStorage.removeItem(key);
                console.log(`Pinterest AI Filter: Cleared cache ${key}`);
            } catch (error) {
                console.error(`Pinterest AI Filter: Error clearing cache ${key}:`, error);
            }
        }
    };

    // Initialize caches from localStorage
    const lookupCache = PersistentCache.loadCache(LOOKUP_CACHE_KEY);
    const aiCache = PersistentCache.loadCache(AI_CACHE_KEY);

    console.log(`Pinterest AI Filter: Loaded caches - Lookup: ${lookupCache.size} items, AI: ${aiCache.size} items`);

    console.log('Pinterest AI Filter: Setting up network interception');

    // Override XMLHttpRequest (Pinterest uses it instead of fetch)
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this._interceptUrl = url;
        return originalXHROpen.apply(this, [method, url, ...args]);
    };

    XMLHttpRequest.prototype.send = function(...args) {
        if (this._interceptUrl && REQUEST_URL_PATTERNS.some(pattern => this._interceptUrl.includes(pattern))) {
            const originalOnReadyStateChange = this.onreadystatechange;
            this.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    try {
                        const jsonData = JSON.parse(this.responseText);

                        // Modify the response data
                        if (jsonData.resource_response?.data && Array.isArray(jsonData.resource_response.data)) {
                            const originalLength = jsonData.resource_response.data.length;

                            // Filter out items with non-null gen_ai_topics
                            jsonData.resource_response.data = jsonData.resource_response.data.filter(item => {
                                const hasGenAiTopics = item.gen_ai_topics && item.gen_ai_topics !== null;
                                const tags = ["#ai ", "midjourney", "stablediffusion", "stable diffusion"];
                                const hasAiDescription = tags.some((tag) => item.grid_description?.toLowerCase().includes(tag) || item.description?.toLowerCase().includes(tag));
                                const hasCached = PersistentCache.hasInCache(aiCache, item.id);
                                return !hasGenAiTopics && !hasAiDescription && !hasCached;
                            });

                            const filteredLength = jsonData.resource_response.data.length;
                            const removedCount = originalLength - filteredLength;

                            if (removedCount > 0) {
                                console.log(`Pinterest AI Filter: Filtered out ${removedCount} AI-generated items from XHR response`);
                            }

                            jsonData.resource_response.data = jsonData.resource_response.data.filter(item => {
                                return !item.ad_destination_url;
                            });

                            Promise.all(jsonData.resource_response.data.map(async (data) => {
                             try {
                                 if(PersistentCache.hasInCache(lookupCache, data.id)) {
                                  return;
                                 }
                                 PersistentCache.addToCache(LOOKUP_CACHE_KEY, lookupCache, data.id);
                                 const response = await fetch(`/pin/${data.id}/`);
                                 const html = await response.text();
                                 if(html.includes("closeup-image-overlay-layer-ai-generated-label")) {
                                    console.log(`Detected: https://pinterest.com/pin/${data.id}/`);
                                    PersistentCache.addToCache(AI_CACHE_KEY, aiCache, data.id);
                                    const el = document.querySelector(`a[href="/pin/${data.id}/"]`);
                                    if (el) el.remove();
                                  }
                             } catch(_){console.error(_)}
                            })).catch(error => console.error(error))

                            // Override the response text
                            Object.defineProperty(this, 'responseText', {
                                writable: true,
                                value: JSON.stringify(jsonData)
                            });
                            Object.defineProperty(this, 'response', {
                                writable: true,
                                value: JSON.stringify(jsonData)
                            });
                        }
                    } catch (error) {
                        console.error('Pinterest AI Filter: Error processing XHR response:', error);
                    }
                }

                if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.apply(this, arguments);
                }
            };
        }

        return originalXHRSend.apply(this, args);
    };

    console.log('Pinterest AI Filter script loaded');

    // Set red filter over main images if detected as ai
    function setupDOMObserver() {
        const observer = new MutationObserver(() => {
            document.querySelectorAll(`div[data-test-id="closeup-image-overlay-layer-ai-generated-label"]`).forEach(el => {
                el.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
            });
        });

        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            console.log('Pinterest AI Filter: DOM observer set up');
        } else {
            setTimeout(setupDOMObserver, 100);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupDOMObserver);
    } else {
        setupDOMObserver();
    }

    // Optional: Add console commands for cache management
    // You can run these in the browser console:
    // PinterestAIFilter.clearLookupCache()
    // PinterestAIFilter.clearAICache()
    // PinterestAIFilter.getCacheStats()
    window.PinterestAIFilter = {
        clearLookupCache: () => PersistentCache.clearCache(LOOKUP_CACHE_KEY),
        clearAICache: () => PersistentCache.clearCache(AI_CACHE_KEY),
        clearAllCaches: () => {
            PersistentCache.clearCache(LOOKUP_CACHE_KEY);
            PersistentCache.clearCache(AI_CACHE_KEY);
        },
        getCacheStats: () => {
            return {
                lookupCacheSize: lookupCache.size,
                aiCacheSize: aiCache.size
            };
        }
    };
})();