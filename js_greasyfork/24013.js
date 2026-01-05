// ==UserScript==
// @name         ClearFilter
// @namespace    http://priesdelly.com/
// @version      1.3
// @description  Remove CSS filter/backdrop-filter from pages (stylesheets and inline styles) and keep them cleared when the page changes, v1.3 by vibe code
// @author       priesdelly
// @match        http://*/*
// @match        https://*/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24013/ClearFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/24013/ClearFilter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const PROPS = [
        'filter',
        '-webkit-filter',
        'backdrop-filter',
        '-webkit-backdrop-filter'
    ];

    /** Remove tracked properties from a CSSStyleDeclaration */
    function removePropsFromStyle(style) {
        if (!style || typeof style.removeProperty !== 'function') return;
        for (const p of PROPS) {
            try {
                if (style.getPropertyValue(p)) {
                    style.removeProperty(p);
                }
            } catch (e) {
                // Ignore: some styles may throw when read/modified in unusual contexts
            }
        }
    }

    /** Clear inline styles across the document or from a subtree root */
    function clearInlineFilters(root = document) {
        try {
            const selectors = PROPS.map(p => `[style*="${p}"]`).join(',');
            const nodes = root.querySelectorAll ? root.querySelectorAll(selectors) : [];
            nodes.forEach(node => removePropsFromStyle(node.style));
            if (document.body) removePropsFromStyle(document.body.style);
        } catch (e) {
            // ignore failures for unusual nodes
        }
    }

    /** Recursively iterate cssRules in a stylesheet or grouping rule */
    function iterateRules(ruleContainer) {
        if (!ruleContainer) return;
        // ruleContainer can be a CSSStyleSheet or a CSSGroupingRule
        const rules = ruleContainer.cssRules;
        if (!rules) return;
        for (const r of Array.from(rules)) {
            // STYLE_RULE has a style property
            if (r.type === CSSRule.STYLE_RULE && r.style) {
                removePropsFromStyle(r.style);
            } else if (r.cssRules) {
                // media, supports, document, etc. — recurse
                iterateRules(r);
            }
        }
    }

    /** Clear rules across all accessible stylesheets */
    function clearStylesheets() {
        for (const sheet of Array.from(document.styleSheets || [])) {
            try {
                iterateRules(sheet);
            } catch (err) {
                // Accessing cssRules on cross-origin sheets throws a SecurityError — skip silently
            }
        }
    }

    /** Main runner: clear both stylesheets and inline styles */
    function runClear() {
        clearStylesheets();
        clearInlineFilters(document);
    }

    // Run once after load/idle
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        // delay slightly to let frameworks finish initial DOM modifications
        setTimeout(runClear, 50);
    } else {
        window.addEventListener('DOMContentLoaded', () => setTimeout(runClear, 50), { once: true });
    }

    // Observe changes and keep removing filters added later
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            if (m.type === 'childList') {
                // New elements may carry inline styles or new style/link nodes
                m.addedNodes.forEach(node => {
                    if (node && node.nodeType === Node.ELEMENT_NODE) {
                        clearInlineFilters(node);
                        const tag = node.tagName && node.tagName.toLowerCase();
                        if (tag === 'style' || (tag === 'link' && node.rel === 'stylesheet')) {
                            // Re-scan stylesheets when new styles are injected
                            clearStylesheets();
                        }
                    }
                });
            } else if (m.type === 'attributes' && m.attributeName === 'style') {
                // An element's inline style changed
                const target = m.target;
                if (target && target.nodeType === Node.ELEMENT_NODE) removePropsFromStyle(target.style);
            }
        }
    });

    observer.observe(document.documentElement || document, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style']
    });

    // Expose a safe control for debugging / manual invocation in console
    try {
        Object.defineProperty(window, '__clearFilterRun', {
            value: runClear,
            writable: false,
            configurable: true
        });
    } catch (e) {
        // ignore if defineProperty fails in constrained contexts
    }

})();