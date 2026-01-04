// ==UserScript==
// @name         Hide Saved Assets on FAB
// @namespace    https://github.com/creosB
// @version      2.1
// @description  hide saved assets on FAB (Unreal Engine)
// @author       CreosB
// @match        https://www.fab.com/channels/unreal-engine*
// @license     This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543207/Hide%20Saved%20Assets%20on%20FAB.user.js
// @updateURL https://update.greasyfork.org/scripts/543207/Hide%20Saved%20Assets%20on%20FAB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // State management
    const state = {
        isHidingEnabled: true,
        processedElements: new WeakSet(),
        hiddenElements: new Set(),
        isProcessing: false,
        lastProcessTime: 0,
        observer: null
    };

    // Performance optimizations
    const THROTTLE_DELAY = 250; // ms
    const BATCH_SIZE = 50;
    const IDLE_TIMEOUT = 100; // ms

    // Throttle function to prevent excessive calls
    function throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }

    // Debounce function for batch processing
    function debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Enhanced asset processing with more aggressive detection
    function processAssets() {
        if (state.isProcessing) return;
        
        state.isProcessing = true;
        const startTime = performance.now();

        try {
            // Get all potential saved asset containers with multiple selectors
            const selectors = [
                'div.fabkit-Stack-root.nTa5u2sc',
                'div.fabkit-Stack-root[class*="nTa5u2sc"]',
                'div[class*="fabkit-Stack-root"][class*="nTa5u2sc"]'
            ];
            
            let allCards = new Set();
            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => allCards.add(el));
            });
            
            const newCards = Array.from(allCards).filter(card => !state.processedElements.has(card));
            
            console.log(`Processing ${newCards.length} new cards out of ${allCards.size} total cards`);
            
            if (newCards.length === 0) {
                state.isProcessing = false;
                return;
            }

            // Process in batches to avoid blocking the UI
            const processBatch = (batch) => {
                batch.forEach(card => {
                    state.processedElements.add(card);
                    
                    // Multiple ways to detect saved status
                    let isSaved = false;
                    
                    // Method 1: Look for success intent typography
                    const savedIndicator = card.querySelector('div.fabkit-Typography-root[class*="intent-success"]');
                    if (savedIndicator && savedIndicator.textContent.includes('Saved in My Library')) {
                        isSaved = true;
                    }
                    
                    // Method 2: Look for check-circle icon
                    if (!isSaved) {
                        const checkIcon = card.querySelector('i.edsicon-check-circle-filled');
                        if (checkIcon) {
                            const parentDiv = checkIcon.closest('div');
                            if (parentDiv && parentDiv.textContent.includes('Saved in My Library')) {
                                isSaved = true;
                            }
                        }
                    }
                    
                    // Method 3: General text search
                    if (!isSaved) {
                        const textElements = card.querySelectorAll('div, span, p');
                        for (let textEl of textElements) {
                            if (textEl.textContent && textEl.textContent.includes('Saved in My Library')) {
                                isSaved = true;
                                break;
                            }
                        }
                    }
                    
                    if (isSaved) {
                        // Store reference and current display state
                        const cardId = card.dataset.cardId || `card-${Date.now()}-${Math.random()}`;
                        card.dataset.cardId = cardId;
                        card.dataset.originalDisplay = card.style.display || '';
                        
                        state.hiddenElements.add(cardId);
                        
                        // Apply visibility based on current state
                        if (state.isHidingEnabled) {
                            card.style.display = 'none';
                            card.dataset.hiddenByScript = 'true';
                        }
                        
                        console.log('Found and processed saved asset:', cardId);
                    }
                });
            };

            // Process batches with requestIdleCallback for better performance
            let batchIndex = 0;
            const processBatches = () => {
                if (batchIndex >= newCards.length) {
                    state.isProcessing = false;
                    console.log(`Finished processing all batches. Total hidden: ${state.hiddenElements.size}`);
                    return;
                }

                const batch = newCards.slice(batchIndex, batchIndex + BATCH_SIZE);
                processBatch(batch);
                batchIndex += BATCH_SIZE;

                // Use requestIdleCallback if available, otherwise setTimeout
                if (window.requestIdleCallback) {
                    requestIdleCallback(processBatches, { timeout: IDLE_TIMEOUT });
                } else {
                    setTimeout(processBatches, 0);
                }
            };

            processBatches();

        } catch (error) {
            console.error('Error processing assets:', error);
            state.isProcessing = false;
        }
    }

    // Throttled version of processAssets
    const throttledProcessAssets = throttle(processAssets, THROTTLE_DELAY);

    // Toggle visibility of saved assets
    function toggleSavedAssets() {
        state.isHidingEnabled = !state.isHidingEnabled;
        
        // Update all tracked hidden elements
        state.hiddenElements.forEach(cardId => {
            const card = document.querySelector(`[data-card-id="${cardId}"]`);
            if (card) {
                if (state.isHidingEnabled) {
                    card.style.display = 'none';
                    card.dataset.hiddenByScript = 'true';
                } else {
                    card.style.display = card.dataset.originalDisplay || '';
                    card.dataset.hiddenByScript = 'false';
                }
            }
        });

        return state.isHidingEnabled;
    }

    // Enhanced mutation observer with multiple detection strategies
    function setupObserver() {
        if (state.observer) {
            state.observer.disconnect();
        }

        state.observer = new MutationObserver(throttle((mutations) => {
            let shouldProcess = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if any added nodes contain our target elements
                    const hasRelevantNodes = Array.from(mutation.addedNodes).some(node => {
                        if (node.nodeType !== 1) return false;
                        
                        return (
                            node.matches('div.fabkit-Stack-root.nTa5u2sc') ||
                            node.querySelector('div.fabkit-Stack-root.nTa5u2sc') ||
                            node.matches('div.fabkit-Stack-root') ||
                            node.querySelector('div.fabkit-Stack-root') ||
                            node.matches('[class*="fabkit"]') ||
                            node.querySelector('[class*="fabkit"]')
                        );
                    });
                    
                    if (hasRelevantNodes) {
                        shouldProcess = true;
                    }
                }
                
                // Also check for attribute changes that might indicate new content
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'style' || 
                     mutation.attributeName === 'class' ||
                     mutation.attributeName === 'data-testid')) {
                    shouldProcess = true;
                }
            });

            if (shouldProcess) {
                // Process immediately for new content
                setTimeout(throttledProcessAssets, 50);
            }
        }, 50));

        state.observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class', 'data-testid']
        });
    }

    // Enhanced scroll optimization with forced reprocessing
    let scrollTimeout;
    let lastScrollProcessTime = 0;
    
    function handleScroll() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const now = Date.now();
            const scrollPosition = window.innerHeight + window.scrollY;
            const documentHeight = document.documentElement.scrollHeight;
            
            // Always process when scrolling, but with different priorities
            if (scrollPosition >= documentHeight - 1500) {
                // Near bottom - high priority processing
                throttledProcessAssets();
                lastScrollProcessTime = now;
            } else if (now - lastScrollProcessTime > 2000) {
                // Periodic processing while scrolling
                throttledProcessAssets();
                lastScrollProcessTime = now;
            }
        }, 100);
    }

    // Additional intersection observer for better new content detection
    function setupIntersectionObserver() {
        if (!window.IntersectionObserver) return;
        
        const intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !state.processedElements.has(entry.target)) {
                    // New element came into view, process it
                    setTimeout(throttledProcessAssets, 100);
                }
            });
        }, {
            root: null,
            rootMargin: '100px',
            threshold: 0.1
        });

        // Observe all existing cards
        const observeExistingCards = () => {
            const cards = document.querySelectorAll('div.fabkit-Stack-root.nTa5u2sc');
            cards.forEach(card => {
                if (!state.processedElements.has(card)) {
                    intersectionObserver.observe(card);
                }
            });
        };

        // Initial observation
        observeExistingCards();
        
        // Re-observe periodically to catch new elements
        setInterval(observeExistingCards, 3000);
    }

    // Create toggle button with better styling and state indication
    function createToggleButton() {
        const button = document.createElement('button');
        button.id = 'fab-hide-toggle';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: #007bff;
            color: white;
            border: none;
            padding: 12px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.2s ease;
            user-select: none;
            min-width: 140px;
        `;

        function updateButtonState() {
            const hiddenCount = state.hiddenElements.size;
            if (state.isHidingEnabled) {
                button.textContent = `Show Saved (${hiddenCount})`;
                button.style.background = '#dc3545';
            } else {
                button.textContent = `Hide Saved (${hiddenCount})`;
                button.style.background = '#28a745';
            }
        }

        button.addEventListener('click', () => {
            toggleSavedAssets();
            updateButtonState();
        });

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        });

        updateButtonState();
        document.body.appendChild(button);

        // Update button count periodically
        setInterval(updateButtonState, 2000);
    }

    // Initialize the script
    function initialize() {
        console.log('Fab.com Hide Saved Assets script initialized');
        
        // Initial processing
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    throttledProcessAssets();
                    setupObserver();
                    setupIntersectionObserver();
                }, 500);
            });
        } else {
            setTimeout(() => {
                throttledProcessAssets();
                setupObserver();
                setupIntersectionObserver();
            }, 500);
        }

        // Add scroll listener for optimization
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Create toggle button
        setTimeout(createToggleButton, 1000);

        // More aggressive periodic reprocessing
        setInterval(() => {
            if (!state.isProcessing) {
                throttledProcessAssets();
            }
        }, 3000);
        
        // Force full reprocessing periodically to catch missed elements
        setInterval(() => {
            console.log('Force reprocessing all elements...');
            state.processedElements = new WeakSet(); // Reset processed elements
            throttledProcessAssets();
        }, 5000);
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (state.observer) {
            state.observer.disconnect();
        }
        window.removeEventListener('scroll', handleScroll);
    });

    // Start the script
    initialize();

})();