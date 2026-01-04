// ==UserScript==
// @name         Airflow Task Instance Status Enhancer
// @namespace    namilink.airflow.colorblind-status
// @version      0.6
// @description  Enhance task instance status visualization in Airflow for colorblind users with class transition tracking
// @author       Mate Valko - Namilink.com
// @match        *://*/*dags*
// @match        *://*/*airflow*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518865/Airflow%20Task%20Instance%20Status%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/518865/Airflow%20Task%20Instance%20Status%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        DEBUG: false,
        THROTTLE_INTERVAL: 1000,
        TASK_INSTANCE_SELECTOR: '[data-testid="task-instance"]'
    };

const STATE_MAPPINGS = {
    'rgb(128, 128, 128)': { symbol: '⌛', label: 'Queued' },      // gray
    'rgb(0, 255, 0)': { symbol: '⚙️', label: 'Running' },        // lime
    'rgb(0, 128, 0)': { symbol: '✅', label: 'Success' },         // green
    'rgb(238, 130, 238)': { symbol: '🔄', label: 'Restarting' }, // violet
    'rgb(255, 0, 0)': { symbol: '❌', label: 'Failed' },         // red
    'rgb(255, 215, 0)': { symbol: '🔁', label: 'Up for retry' }, // gold
    'rgb(64, 224, 208)': { symbol: '⏳', label: 'Reschedule' },  // turquoise
    'rgb(255, 165, 0)': { symbol: '⚠️', label: 'Upstream failed' }, // orange
    'rgb(255, 105, 180)': { symbol: '⤵️', label: 'Skipped' },    // hotpink
    'rgb(211, 211, 211)': { symbol: '🗑️', label: 'Removed' },    // lightgrey
    'rgb(210, 180, 140)': { symbol: '⏰', label: 'Scheduled' },   // tan
    'rgb(147, 112, 219)': { symbol: '⏸️', label: 'Deferred' }    // mediumpurple
};


    const ClassTransitionStore = {
        classToState: new Map(),

        updateMapping(className, color) {
            if (!this.classToState.has(className)) {
                const state = STATE_MAPPINGS[color];
                if (state) {
                    this.classToState.set(className, state);
                    debugLog('New class mapping:', className, state, color);
                }
            }
            return this.classToState.get(className);
        },

        getStateForClass(className) {
            return this.classToState.get(className);
        },

        debug() {
            console.log('Class to State Mappings:',
                Object.fromEntries(this.classToState));
        }
    };

    let lastExecutionTime = 0;

    function debugLog(...args) {
        if (CONFIG.DEBUG) console.log('[AirflowEnhancer]', ...args);
    }

    function createStatusIndicator(state) {
        const container = document.createElement('div');
        container.innerHTML = `<div class="status-symbol">${state.symbol}</div>`;
        container.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            font-size: 14px;
            font-weight: bold;
        `;
        return container;
    }

    function findElementsInShadowDOM(root, selector) {
        const elements = new Set();

        function traverse(node) {
            if (!node) return;
            if (node.matches && node.matches(selector)) {
                elements.add(node);
            }
            if (node.shadowRoot) {
                Array.from(node.shadowRoot.querySelectorAll('*')).forEach(traverse);
            }
            if (node.children) {
                Array.from(node.children).forEach(traverse);
            }
        }

        traverse(root);
        return Array.from(elements);
    }

    function modifyElement(element) {
        if (!element?.isConnected) return;

        const reactClass = Array.from(element.classList)
            .find(cls => cls.startsWith('c-'));

        if (!reactClass) {
            debugLog('No React class found for element');
            return;
        }

        let state = ClassTransitionStore.getStateForClass(reactClass);

        if (!state) {
            const backgroundColor = window.getComputedStyle(element).backgroundColor;
            state = ClassTransitionStore.updateMapping(reactClass, backgroundColor);

            if (!state) {
                if (backgroundColor !== '' && backgroundColor !== 'inherit' && backgroundColor !== 'transparent') {
                    debugLog('Unable to map new class:', reactClass, 'with color:', backgroundColor);
                }
                return;
            }
        }

        debugLog('Applying state:', { class: reactClass, state });
        element.style.setProperty('background', 'none', 'important');
        element.innerHTML = '';
        element.appendChild(createStatusIndicator(state));
    }

    async function modifyElements() {
        const rootElements = document.querySelectorAll('#root, #react-container, [id*="react"]');
        const taskInstances = new Set();

        [...rootElements, document.body].forEach(root => {
            findElementsInShadowDOM(root, CONFIG.TASK_INSTANCE_SELECTOR)
                .forEach(element => taskInstances.add(element));
        });

        if (taskInstances.size === 0) {
            debugLog('No task instances found, retrying...');
            await new Promise(resolve => setTimeout(resolve, 300));
            return modifyElements();
        }

        debugLog(`Found ${taskInstances.size} task instances`);
        taskInstances.forEach(modifyElement);
    }

    function throttledModifyElements() {
        const now = Date.now();
        if (now - lastExecutionTime >= CONFIG.THROTTLE_INTERVAL) {
            lastExecutionTime = now;
            modifyElements();
        }
    }

    function initialize() {
        debugLog('Initializing script');
        window._airflowEnhancerStore = window._airflowEnhancerStore || ClassTransitionStore;

        modifyElements();

        // Create and configure MutationObserver
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length ||
                    (mutation.type === 'attributes' &&
                     (mutation.attributeName === 'style' ||
                      mutation.attributeName === 'class'))) {
                    throttledModifyElements();
                }
            });
        });

        // Start observing the document
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });

        // Periodic debug output
        if (CONFIG.DEBUG) {
            setInterval(() => {
                ClassTransitionStore.debug();
            }, 10000);
        }

        // Event listeners for dynamic content
        ['load', 'urlchange'].forEach(event =>
            window.addEventListener(event, throttledModifyElements));

        // Handle history state changes
        ['pushState', 'replaceState'].forEach(method => {
            const original = history[method];
            history[method] = function() {
                original.apply(history, arguments);
                throttledModifyElements();
            };
        });

        window.addEventListener('popstate', throttledModifyElements);

        // Cleanup on page unload
        window.addEventListener('unload', () => {
            observer.disconnect();
        });
    }

    // Start the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
