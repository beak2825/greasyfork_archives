// ==UserScript==
// @name         Ultimate Persistent Highlighter
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Highlighter with debounced adjacent span merging
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535953/Ultimate%20Persistent%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/535953/Ultimate%20Persistent%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const STORAGE_KEY = location.href + '-highlights';
    const DEFAULT_COLOR = '#ffff00';
    const DEBOUNCE_TIME = 100; // Single debounce time for all cases
    const INIT_DELAY = 1000;
    const HIGHLIGHT_CLASS = 'persistent-highlight';
    const BATCH_SIZE = 50;

    // State
    let selectedColor = DEFAULT_COLOR;
    let highlightsCache = [];
    let observer = null;

    // DOM Utilities
    const createElement = (tag, props) => Object.assign(document.createElement(tag), props);
    const createTextNode = text => document.createTextNode(text);
    const querySelectorAll = selector => document.querySelectorAll(selector);

   // Get text nodes in selection
    function getSelectedTextNodes(range) {
        const selectedNodes = [];
        const startNode = range.startContainer;
        const endNode = range.endContainer;

        // Special case when selection is within a single text node
        if (startNode === endNode && startNode.nodeType === Node.TEXT_NODE) {
            console.log('within a single text node: ', startNode)
            return [startNode];
        }

        // Walk through all text nodes in the range
        const treeWalker = document.createTreeWalker(
            range.commonAncestorContainer,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: node => {
                    if (node === startNode || node === endNode || range.intersectsNode(node)) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_SKIP;
                }
            }
        );

        while (treeWalker.nextNode()) {
            selectedNodes.push(treeWalker.currentNode);
        }

        return selectedNodes;
    }

    // Generate XPath for node
    function getXPath(node) {
        if (!node) return '';
        if (node.nodeType === Node.TEXT_NODE) {
            return getXPath(node.parentNode) + "/text()";
        }
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return '';
        }
        if (node.id) return `id("${node.id}")`;
        if (node === document.body) return '/html/body';

        let ix = 0;
        const siblings = node.parentNode?.childNodes || [];
        for (let i = 0; i < siblings.length; i++) {
            const sibling = siblings[i];
            if (sibling === node) {
                return `${getXPath(node.parentNode)}/${node.tagName.toLowerCase()}[${ix + 1}]`;
            }
            if (sibling.nodeType === 1 && sibling.tagName === node.tagName) ix++;
        }
        return '';
    }

    // Find element by XPath
    function getElementByXPath(xpath) {
        try {
            return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        } catch (e) {
            return null;
        }
    }

    /*-------------------------------*/
    // Shared debounce function
    function debounce(func, timeout = DEBOUNCE_TIME) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), timeout);
        };
    }


    // Pause observer during DOM operations
    function withObserverPaused(callback) {
        if (observer) observer.disconnect();
        try {
            callback();
        } finally {
            if (observer) observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    // Apply cached highlights
    function applyCachedHighlights() {
        for (let i = 0; i < highlightsCache.length; i += BATCH_SIZE) {
            const batch = highlightsCache.slice(i, i + BATCH_SIZE);
            batch.forEach(({ xpath, start, end, color }) => {
                const node = getElementByXPath(xpath);
                if (node) applyHighlight(node, start, end, color);
            });
        }
    }

    const debouncedApplyHighlights = debounce(() => {
        withObserverPaused(() => {
            applyCachedHighlights()
        })
    });



    // Highlight selected text
    function highlightSelection() {
        const selection = window.getSelection();
        if (!selection.rangeCount || selection.isCollapsed) return;

        const range = selection.getRangeAt(0);
        const selectedNodes = getSelectedTextNodes(range);
        if (!selectedNodes.length) return;

        withObserverPaused(() => {
            selectedNodes.forEach((node, index) => {
                console.log('selectedNode', node);
                if (node.parentNode.classList.contains(HIGHLIGHT_CLASS)) return;

                const xpath = getXPath(node);
                const isFirstNode = index === 0;
                const isLastNode = index === selectedNodes.length - 1;

                const start = isFirstNode ? range.startOffset : 0;
                const end = isLastNode ? range.endOffset : node.nodeValue.length;
                console.log(`start=${start} end=${end}`);
                if (start >= end) return;

                const existing = highlightsCache.find(h =>
                    h.xpath === xpath && h.start === start && h.end === end
                );
                console.log('exist?', existing);
                if (existing) return;

                highlightsCache.push({ xpath, start, end, color: selectedColor });
                applyHighlight(node, start, end, selectedColor);
            });
        });

        debouncedMergeHighlights();
        selection.removeAllRanges();
    }

    // Apply highlight to text node
    function applyHighlight(textNode, start, end, color) {
        console.log('applyHighlight', textNode, start, end);
        const textContent = textNode.nodeValue;
        const parent = textNode.parentNode;

        const beforeNode = start > 0 ? createTextNode(textContent.substring(0, start)) : null;
        const highlightNode = createElement('span', {
            style: `background-color:${color}`,
            className: HIGHLIGHT_CLASS,
            textContent: textContent.substring(start, end),
            onclick: removeHighlight
        });
        const afterNode = end < textContent.length ? createTextNode(textContent.substring(end)) : null;

        const fragment = document.createDocumentFragment();
        if (beforeNode) fragment.appendChild(beforeNode);
        fragment.appendChild(highlightNode);
        if (afterNode) fragment.appendChild(afterNode);

        parent.replaceChild(fragment, textNode);

    }

    /*------------------ Remove Highlights ------------------*/
    // Remove single highlight
    function removeHighlight(event) {
        withObserverPaused(() => {
            const span = event.target;
            const textNode = createTextNode(span.textContent);
            span.replaceWith(textNode);

            const xpath = getXPath(span);
            highlightsCache = highlightsCache.filter(h => h.xpath !== xpath);
            mergeAllAdjacentTextNodes();
        });
    }

    // De-highlight selection
    function dehighlightSelection() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const selectedNodes = getSelectedTextNodes(range);

        withObserverPaused(() => {
            selectedNodes.forEach(node => {
                if (node.parentNode.classList.contains(HIGHLIGHT_CLASS)) {
                    const span = node.parentNode;
                    span.replaceWith(createTextNode(span.textContent));
                    highlightsCache = highlightsCache.filter(h => h.xpath !== getXPath(span));
                }
            });
            mergeAllAdjacentTextNodes();
        });

        selection.removeAllRanges();
    }

    // Clear all highlights
    function clearAllHighlights() {
        withObserverPaused(() => {
            querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach(span => {
                span.replaceWith(createTextNode(span.textContent));
            });
            highlightsCache = [];
            mergeAllAdjacentTextNodes();
        });
    }

    /*------------------ Clean DOM ------------------*/
    function mergeAdjacentHighlights() {
        const processedSpans = new Set();

        const shouldMerge = (a, b) =>
            b?.nodeType === Node.ELEMENT_NODE &&
            b.classList.contains(HIGHLIGHT_CLASS) &&
            b.style.backgroundColor === a.style.backgroundColor &&
            !processedSpans.has(b);

        const mergeHighlights = (baseSpan, targetSpan) => {
            const baseXPath = getXPath(baseSpan);
            const targetXPath = getXPath(targetSpan);

            const baseHighlight = highlightsCache.find(h => h.xpath === baseXPath);
            const targetHighlight = highlightsCache.find(h => h.xpath === targetXPath);

            if (baseHighlight && targetHighlight) {
                baseHighlight.end = targetHighlight.end;
                highlightsCache = highlightsCache.filter(h => h !== targetHighlight);
                processedSpans.add(targetSpan);
            }

            baseSpan.textContent += targetSpan.textContent;
            targetSpan.remove();
        };

        querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach(span => {
            if (processedSpans.has(span)) return;

            let currentSpan = span;
            let prev = currentSpan.previousSibling;

            // Merge backwards
            while (shouldMerge(currentSpan, prev)) {
                mergeHighlights(prev, currentSpan);
                currentSpan = prev;
                prev = currentSpan.previousSibling;
            }

            // Merge forwards only if not already merged backwards
            if (currentSpan === span) {
                let next = currentSpan.nextSibling;
                while (shouldMerge(currentSpan, next)) {
                    mergeHighlights(currentSpan, next);
                    next = currentSpan.nextSibling;
                }
            }
        });
    }

    // Merge adjacent text nodes (Edge fix)
    function mergeAllAdjacentTextNodes(root = document.body) {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            { acceptNode: () => NodeFilter.FILTER_ACCEPT }
        );

        let currentNode;
        while ((currentNode = walker.nextNode())) {
            while (currentNode.nextSibling?.nodeType === Node.TEXT_NODE) {
                const nextNode = currentNode.nextSibling;
                const x1 = getXPath(currentNode);
                const x2 = getXPath(nextNode);
                const t1 = currentNode.textContent;
                const t2 = nextNode.textContent;
                console.log('Merge text node', t1 , ' with ', t2 , 'x1=', x1, 'x2=', x2);
                currentNode.textContent += nextNode.textContent;
                nextNode.remove();
                // Don't advance walker; keep merging until no adjacent text nodes remain
            }
        }
    }


    const debouncedMergeHighlights = debounce(() => {
        withObserverPaused(() => {
            mergeAdjacentHighlights();
            mergeAllAdjacentTextNodes();
        });
    });


    /*------------------ Initialize things ------------------*/
    // Create UI controls
    function createUI() {
        const style = {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '10000',
            fontFamily: 'sans-serif'
        };

        const container = createElement('div', {
            id: 'highlight-toolbox',
            style: Object.entries(style).map(([k, v]) => `${k}:${v}`).join(';')
        });

        const closeBtn = createElement('span', {
            innerHTML: '&times;',
            title: 'Close toolbox',
            style: 'float:right;cursor:pointer;margin-bottom:5px;font-size:16px;color:#888',
            onclick: () => container.remove()
        });

        const colorInput = createElement('input', {
            type: 'color',
            value: selectedColor,
            style: 'margin-bottom:6px',
            oninput: e => selectedColor = e.target.value
        });

        const makeButton = (text, onClick) => createElement('button', {
            innerText: text,
            style: 'margin:4px 2px;padding:6px 10px;border:none;border-radius:4px;cursor:pointer;' +
                   'font-size:14px;background-color:#1976d2;color:#fff;transition:background-color 0.2s',
            onmouseover: e => e.target.style.backgroundColor = '#1565c0',
            onmouseout: e => e.target.style.backgroundColor = '#1976d2',
            onclick: onClick
        });

        container.append(
            closeBtn,
            document.createElement('br'),
            colorInput,
            document.createElement('br'),
            makeButton('Highlight', highlightSelection),
            makeButton('De-highlight', dehighlightSelection),
            makeButton('Clear All', clearAllHighlights)
        );

        document.body.appendChild(container);
    }

    // Initialize MutationObserver
    function initializeObserver() {
        observer = new MutationObserver(mutations => {
            if (!highlightsCache.length) return;
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    debouncedApplyHighlights();
                    break;
                }
            }
        });
    }

    // Load highlights from storage
    function loadHighlights() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            highlightsCache = stored ? JSON.parse(stored) : [];
            if (highlightsCache.length) {
                debouncedApplyHighlights();
            }
        } catch (e) {
            console.error('Error loading highlights:', e);
            highlightsCache = [];
        }
    }

    // Save highlights to storage
    function saveHighlights() {
        try {
            if (highlightsCache.length) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(highlightsCache));
            } else {
                localStorage.removeItem(STORAGE_KEY);
            }
        } catch (e) {
            console.error('Error saving highlights:', e);
        }
    }

    // Initialize everything
    const init = () => {
        initializeObserver();
        loadHighlights();
        createUI();
        observer.observe(document.body, { childList: true, subtree: true });
    };

    // Start after page load with delay
    if (document.readyState === 'complete') {
        setTimeout(init, INIT_DELAY);
    } else {
        window.addEventListener('load', () => setTimeout(init, INIT_DELAY));
    }

    // Save before page unload
    window.addEventListener('beforeunload', saveHighlights);
})();