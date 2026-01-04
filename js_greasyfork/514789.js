// ==UserScript==
// @name         Text reflow on zoom for mobile (text wrap)
// @name:ru      Text reflow on zoom for mobile (text wrap)
// @description  Fits all text to the screen width after a pinch gesture on phone 
// @description:ru  Подгонка текста под ширину экрана после жеста увеличения на телефоне
// @version      1.0.7
// @author       emvaized
// @license      MIT
// @homepageURL  https://github.com/emvaized/text-reflow-on-zoom-mobile
// @namespace    text_reflow_on_pinch_zoom
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/514789/Text%20reflow%20on%20zoom%20for%20mobile%20%28text%20wrap%29.user.js
// @updateURL https://update.greasyfork.org/scripts/514789/Text%20reflow%20on%20zoom%20for%20mobile%20%28text%20wrap%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const xpathSelector = `
    //p | 
    //a[normalize-space(text())] | 
    //h1 | 
    //h2 | 
    //h3 | 
    //h4 | 
    //h5 | 
    //h6 | 
    //li | 
    //pre | 
    //div[b or em or i] | 
    //div[normalize-space(text())] | 
    //div[span[normalize-space(text())]]
`;

    let isCssInjected = false, isPinching = false;
    let zoomTarget, targetDyOffsetRatio;

    // Track all text elements queried by the selector
    const allTextElements = new Set();

    function reflowText() {
        if (!isCssInjected) {
            const styleContent = `.text-reflow-userscript { word-wrap: break-word !important; overflow-wrap:break-word !important; max-width:var(--text-reflow-max-width) !important; }
            .text-reflow-scroll-padding {scroll-margin-left: 1vw !important;}`;
            const styleElement = document.createElement('style');
            styleElement.textContent = styleContent;
            document.head.appendChild(styleElement);
            isCssInjected = true;
        }

        const maxAllowedWidth = Math.round(window.visualViewport.width * 0.96);
        document.documentElement.style.setProperty('--text-reflow-max-width', `${maxAllowedWidth}px`);

        // Select elements likely to contain text
        const xpathResult = document.evaluate(xpathSelector, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        allTextElements.clear();

        for (let i = 0, n = xpathResult.snapshotLength, el; i < n; i++) {
            el = xpathResult.snapshotItem(i);

            if (!el.offsetParent) continue;
            if (!el.textContent.trim()) continue;

            // Proccess only top-level text elements
            let isTopLevel = true;
            let parent = el.parentElement;

            while (parent) {
                if (elementIsTextElement(parent)) {
                    isTopLevel = false;
                    break;
                }
                parent = parent.parentElement;
            }
            if (isTopLevel) {
                // Apply CSS styles to element and skip it next time
                el.classList.add('text-reflow-userscript');
                allTextElements.add(el);
            } 
        }

        /// Scroll initial target element into view
        if (zoomTarget && targetDyOffsetRatio) {
                // Scroll to element vertically, according to new page layout
                const targetOffset = targetDyOffsetRatio * window.innerHeight;
                const rect = zoomTarget.getBoundingClientRect();
                const targetTop = rect.top + window.pageYOffset;
                const scrollToPosition = targetTop - targetOffset;
                
                window.scrollTo({
                    top: scrollToPosition,
                    behavior: 'instant'
                });

                // Scroll element into view horizontally
                // if (elementIsTextElement(zoomTarget)) {
                if (zoomTarget.nodeName !== 'IMG' && zoomTarget.nodeName !== 'VIDEO' && zoomTarget.nodeName !== 'IFRAME'){
                    zoomTarget.classList.add('text-reflow-scroll-padding')
                    zoomTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                    zoomTarget.classList.remove('text-reflow-scroll-padding')
                }

                // Reset the target and offset after scrolling
                zoomTarget = null;
                targetDyOffsetRatio = null;
        }
    }

    function elementIsTextElement(element) {
        return allTextElements.has(element);
    }

    // Detect start of multi-touch (pinch) gesture
    function handleTouchStart(event) {
        if (event.touches && event.touches.length >= 2) {
            isPinching = true;

            // Store possible target of zoom gesture
            if (event.target) zoomTarget = event.target;

            // Calculate the midpoint between the two touch points
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            const midpointX = (touch1.clientX + touch2.clientX) / 2;
            const midpointY = (touch1.clientY + touch2.clientY) / 2;
            
            // Use document.elementFromPoint to get the element at the midpoint
            let possibleZoomTarget;
            const elementsFromPoint = document.elementsFromPoint(midpointX, midpointY);
            for (let i = 0, n = elementsFromPoint.length, element; i < n; i++) {
                element = elementsFromPoint[i];
                if (elementIsTextElement(element)) {
                    possibleZoomTarget = element;
                    break;
                }
            }
            if (!possibleZoomTarget) possibleZoomTarget = elementsFromPoint[0];
            if (possibleZoomTarget) zoomTarget = possibleZoomTarget;
            
            // Store screen coordinates of target to scroll it into view after reflow
            const targetRect= zoomTarget.getBoundingClientRect(); 
            targetDyOffsetRatio = targetRect.top / window.innerHeight;
        }
    }

    // Detect end of multi-touch (pinch) gesture
    function handleTouchEnd(event) {
        if (isPinching && (event.touches && event.touches.length === 0)) {
            isPinching = false;
            reflowText();
        }
    }

    // Add event listeners
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    /// Uncomment to test on PC
    // window.visualViewport.addEventListener('resize', reflowText);
})();