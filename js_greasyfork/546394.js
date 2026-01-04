// ==UserScript==
// @name        Trigger full page load for Jira Cloud and Confluence Cloud
// @namespace   https://greasyfork.org/users/1047370
// @description Trigger the page to load parts that are normally (since August 2025) lazily loaded, when that part of the page this shown.  Works on Jira Cloud and Confluence Cloud as of August 2025.
// @include     https://*.atlassian.net/*
// @include     https://*.jira.com/*
// @match       https://*.atlassian.net/*
// @match       https://*.jira.com/*
// @version     0.6
// @author      Marnix Klooster <marnix.klooster@gmail.com>
// @copyright   public domain
// @license     public domain
// @homepage    https://greasyfork.org/scripts/546394
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/546394/Trigger%20full%20page%20load%20for%20Jira%20Cloud%20and%20Confluence%20Cloud.user.js
// @updateURL https://update.greasyfork.org/scripts/546394/Trigger%20full%20page%20load%20for%20Jira%20Cloud%20and%20Confluence%20Cloud.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Debug flag - set to true for development logging
    const DEBUG = false;
    
    const log = (message) => {
        console.log(message);
    };
    
    const debugLog = (message) => {
        if (DEBUG) {
            console.log(`DEBUG: ${message}`);
        }
    };
    
    const processedElements = new WeakSet();
    let isProcessing = false;
    
    const waitForPageLoad = () => {
        return new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
    };
    
    const createGlassPane = () => {
        // Capture current scroll position
        const scrollTop = window.scrollY;
        const scrollLeft = window.scrollX;
        
        // Create the overlay container
        const pane = document.createElement('div');
        pane.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: white;
            z-index: 999999;
            overflow: hidden;
        `;
        
        // Create viewport snapshot
        const snapshot = document.createElement('div');
        snapshot.style.cssText = `
            position: absolute;
            top: -${scrollTop}px;
            left: -${scrollLeft}px;
            width: ${document.documentElement.scrollWidth}px;
            height: ${document.documentElement.scrollHeight}px;
            pointer-events: none;
            transform-origin: 0 0;
        `;
        
        // Clone the current page content
        try {
            const bodyClone = document.body.cloneNode(true);
            
            // Remove any existing glass panes from the clone to avoid recursion
            const existingPanes = bodyClone.querySelectorAll('[style*="z-index: 999999"]');
            existingPanes.forEach(pane => pane.remove());
            
            // Remove scripts from clone to prevent execution
            const scripts = bodyClone.querySelectorAll('script');
            scripts.forEach(script => script.remove());
            
            snapshot.appendChild(bodyClone);
        } catch (e) {
            // Fallback to white background if cloning fails
            snapshot.style.background = 'white';
        }
        
        pane.appendChild(snapshot);
        
        // Create progress overlay on top of screenshot
        const progressOverlay = document.createElement('div');
        progressOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const progressContainer = document.createElement('div');
        progressContainer.style.cssText = `
            background: white;
            border-radius: 8px;
            padding: 24px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
            min-width: 300px;
            text-align: center;
        `;
        
        const progressText = document.createElement('div');
        progressText.textContent = 'Loading content...';
        progressText.style.cssText = `
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            font-size: 14px;
            color: #172B4D;
            margin-bottom: 16px;
            font-weight: 500;
        `;
        
        const progressTrack = document.createElement('div');
        progressTrack.style.cssText = `
            width: 100%;
            height: 4px;
            background: #DFE1E6;
            border-radius: 2px;
            overflow: hidden;
        `;
        
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            width: 0%;
            height: 100%;
            background: #0052CC;
            border-radius: 2px;
            transition: width 0.3s ease;
        `;
        
        progressTrack.appendChild(progressBar);
        progressContainer.appendChild(progressText);
        progressContainer.appendChild(progressTrack);
        progressOverlay.appendChild(progressContainer);
        pane.appendChild(progressOverlay);
        
        document.body.appendChild(pane);
        
        const showProgress = () => {
            progressOverlay.style.opacity = '1';
        };
        
        return { pane, progressBar, showProgress };
    };
    
    const findEmptyDivs = () => {
        return Array.from(document.querySelectorAll('div'))
            .filter(div => 
                div.textContent.trim() === '' && 
                div.attributes.length === 0 &&
                !processedElements.has(div)
            );
    };
    
    const waitForStability = (element, timeout = 50) => {
        return new Promise(resolve => {
            let timer;
            const observer = new MutationObserver(() => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    observer.disconnect();
                    resolve();
                }, timeout);
            });
            
            observer.observe(element, {
                childList: true,
                subtree: true,
                attributes: true,
                characterData: true
            });
            
            // Start initial timer in case no mutations occur
            timer = setTimeout(() => {
                observer.disconnect();
                resolve();
            }, timeout);
        });
    };
    
    const scrollToElement = async (element) => {
        if (DEBUG) {
            const path = [];
            let current = element;
            while (current && current !== document) {
                const dataAttrs = Array.from(current.attributes)
                    .filter(attr => attr.name.startsWith('data'))
                    .map(attr => `${attr.name}="${attr.value}"`)
                    .join(' ');
                const tag = `<${current.tagName.toLowerCase()}${dataAttrs ? ' ' + dataAttrs : ''}>`;
                path.push(tag);
                current = current.parentElement;
            }
            debugLog(`Scrolling to: ${path.join(' ')}`);
        }
        
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
        
        await waitForStability(element);
        processedElements.add(element);
    };
    
    const processLazyElements = async () => {
        if (isProcessing) return;
        isProcessing = true;
        
        const emptyDivs = findEmptyDivs();
        
        if (emptyDivs.length === 0) {
            isProcessing = false;
            return;
        }
        
        log(`Processing ${emptyDivs.length} lazy-loaded elements`);
        
        // Find the main scrolling container (likely the one that's actually scrolling)
        const scrollingElements = Array.from(document.querySelectorAll('*')).filter(el => 
            el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth
        );
        const mainScrollingElement = scrollingElements.find(el => 
            el.scrollTop > 0 || el.scrollLeft > 0
        ) || document.documentElement;
        
        // Store original scroll position from the correct element
        const originalScrollTop = mainScrollingElement === document.documentElement ? window.scrollY : mainScrollingElement.scrollTop;
        const originalScrollLeft = mainScrollingElement === document.documentElement ? window.scrollX : mainScrollingElement.scrollLeft;
        
        debugLog(`Main scrolling element: ${mainScrollingElement.tagName.toLowerCase()}, original position: (${originalScrollTop}, ${originalScrollLeft})`);
        
        const { pane: glassPane, progressBar, showProgress } = createGlassPane();
        
        // Wait 200ms before showing progress to prevent flashing for quick operations
        const showTimer = setTimeout(showProgress, 200);
        
        try {
            for (let i = 0; i < emptyDivs.length; i++) {
                const progress = ((i + 1) / emptyDivs.length) * 100;
                progressBar.style.width = `${progress}%`;
                
                await scrollToElement(emptyDivs[i]);
            }
            
            // Restore original scroll position on the correct element
            debugLog(`Restoring scroll (to ${originalScrollTop}, ${originalScrollLeft})`);
            (mainScrollingElement === document.documentElement ? window : mainScrollingElement).scrollTo({
                top: originalScrollTop,
                left: originalScrollLeft,
                behavior: 'smooth'
            });
        } finally {
            clearTimeout(showTimer);
            glassPane.remove();
            // Add delay before allowing re-processing to prevent immediate re-trigger from our own scrolling
            setTimeout(() => {
                isProcessing = false;
            }, 500);
        }
    };
    
    const observeScrollEvents = () => {
        if (!DEBUG) return;
        
        const scrollPositions = new WeakMap();
        
        document.addEventListener('scroll', (event) => {
            const target = event.target === document ? window : event.target;
            const targetName = event.target === document ? 'window' : event.target.tagName.toLowerCase();
            
            const currentScrollTop = target.scrollTop || window.scrollY;
            const currentScrollLeft = target.scrollLeft || window.scrollX;
            
            const lastPosition = scrollPositions.get(target) || { top: currentScrollTop, left: currentScrollLeft };
            const deltaY = currentScrollTop - lastPosition.top;
            const deltaX = currentScrollLeft - lastPosition.left;
            
            if (deltaY !== 0 || deltaX !== 0) {
                debugLog(`Scroll on ${targetName}: Y=${deltaY > 0 ? '+' : ''}${deltaY}, X=${deltaX > 0 ? '+' : ''}${deltaX} (to ${currentScrollTop}, ${currentScrollLeft})`);
            }
            
            scrollPositions.set(target, { top: currentScrollTop, left: currentScrollLeft });
        }, true);
    };
    
    const observePageChanges = () => {
        const observer = new MutationObserver(() => {
            // Debounce to avoid excessive processing
            clearTimeout(observer.timer);
            observer.timer = setTimeout(processLazyElements, 100);
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };
    
    const init = async () => {
        await waitForPageLoad();
        log('Page fully loaded, starting lazy element processing');
        
        await processLazyElements();
        observePageChanges();
        if (DEBUG) {
            observeScrollEvents();
        }
    };
    
    init();
    
})();
