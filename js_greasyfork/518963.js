// ==UserScript==
// @name         BLU | Enhanced Torrent Visibility
// @version      4.0
// @description  Upgraded torrent visibility on Blutopia with color-coded rows based on activity indicators, enhanced icons for free torrents, awards, and high-speed statuses.
// @author       Anil & Claude v4.5
// @license      MIT
// @match        https://blutopia.cc/*
// @grant        none
// @icon         https://ptpimg.me/iuua2k.png
// @run-at       document-idle
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/518963/BLU%20%7C%20Enhanced%20Torrent%20Visibility.user.js
// @updateURL https://update.greasyfork.org/scripts/518963/BLU%20%7C%20Enhanced%20Torrent%20Visibility.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        colors: {
            seeding: '#19280F',
            leeching: '#570E10',
            completed: '#675204'
        },
        animations: {
            fade: { duration: '1.75s', opacity: '0.25' },
            flip: { duration: '1.75s' }
        },
        performance: {
            throttleDelay: 100,
            batchSize: 50,
            observerDebounce: 50,
            maxProcessingTime: 16,
            idleTimeout: 2000,
            intersectionThreshold: 0.1,
            intersectionRootMargin: '50px'
        }
    };

    const SELECTORS = {
        activityIndicators: {
            seeding: "td.torrent-activity-indicator--seeding",
            leeching: "td.torrent-activity-indicator--leeching",
            completed: "td.torrent-activity-indicator--completed"
        },
        icons: {
            free: "i.fa-star",
            award: "i.fa-award-simple",
            highSpeed: "i.fa-bolt-lightning",
            calendarStar: "i.fa-calendar-star",
            magic: "i.fa-magic"
        },
        containers: [
            'table tbody',
            '.torrent-card__container',
            '.table-responsive',
            '[data-torrent-id]'
        ],
        excludes: ".ratio-bar__tokens i.fa-star, .meta-chip-wrapper.meta-chip i.fa-star, .torrent-card__rating i.fa-star, .panel__heading i.fa-star, .badge-user i.fa-star, [title='Donor']"
    };

    class ElementCache {
        constructor() {
            this.processedRows = new WeakSet();
            this.processedIcons = new WeakSet();
            this.styleCache = new Map();
            this.stats = {
                processed: 0,
                cached: 0,
                hitRate: 0,
                lastReset: Date.now()
            };
        }

        hasProcessedRow(row) {
            const result = this.processedRows.has(row);
            if (result) this.stats.cached++;
            return result;
        }

        hasProcessedIcon(icon) {
            const result = this.processedIcons.has(icon);
            if (result) this.stats.cached++;
            return result;
        }

        markRowProcessed(row) {
            this.processedRows.add(row);
            this.stats.processed++;
        }

        markIconProcessed(icon) {
            this.processedIcons.add(icon);
            this.stats.processed++;
        }

        clear() {
            this.processedRows = new WeakSet();
            this.processedIcons = new WeakSet();
            this.styleCache.clear();
            this.stats = {
                processed: 0,
                cached: 0,
                hitRate: 0,
                lastReset: Date.now()
            };
        }

        getStats() {
            const total = this.stats.processed + this.stats.cached;
            this.stats.hitRate = total > 0 ? (this.stats.cached / total * 100).toFixed(2) : 0;
            return { ...this.stats };
        }
    }

    function createDebouncer(delay) {
        let timeoutId;
        let abortController;
        let lastExecution = 0;

        return function(fn) {
            const now = Date.now();

            clearTimeout(timeoutId);
            abortController?.abort();
            abortController = new AbortController();

            const timeSinceLastExecution = now - lastExecution;
            const actualDelay = Math.max(0, delay - timeSinceLastExecution);

            timeoutId = setTimeout(() => {
                if (!abortController.signal.aborted) {
                    lastExecution = Date.now();
                    fn();
                }
            }, actualDelay);

            return abortController;
        };
    }

    function processElementsBatch(elements, processor, batchSize = CONFIG.performance.batchSize) {
        if (!elements.length) return Promise.resolve();

        return new Promise(resolve => {
            let index = 0;
            const startTime = performance.now();

            function processBatch() {
                const batchStartTime = performance.now();
                const endIndex = Math.min(index + batchSize, elements.length);

                while (index < endIndex &&
                       (performance.now() - batchStartTime) < CONFIG.performance.maxProcessingTime) {
                    processor(elements[index]);
                    index++;
                }

                if (index < elements.length) {
                    requestAnimationFrame(processBatch);
                } else {
                    resolve();
                }
            }

            requestAnimationFrame(processBatch);
        });
    }

    const cache = new ElementCache();
    const debouncer = createDebouncer(CONFIG.performance.observerDebounce);

    const StyleManager = {
        initializeCSSVariables() {
            if (document.getElementById('blu-enhanced-styles')) return;

            const styleSheet = document.createElement('style');
            styleSheet.id = 'blu-enhanced-styles';
            styleSheet.textContent = `
                :root {
                    --blu-seeding-color: ${CONFIG.colors.seeding};
                    --blu-leeching-color: ${CONFIG.colors.leeching};
                    --blu-completed-color: ${CONFIG.colors.completed};
                    --blu-high-speed-color: #89AFE0;
                    --blu-transition-duration: 0.2s;
                }

                .blu-enhanced-row {
                    transition: background-color var(--blu-transition-duration) ease;
                }

                .blu-enhanced-row td {
                    transition: background-color var(--blu-transition-duration) ease;
                }

                .blu-seeding-row td {
                    background-color: var(--blu-seeding-color) !important;
                }

                .blu-leeching-row td {
                    background-color: var(--blu-leeching-color) !important;
                }

                .blu-completed-row td {
                    background-color: var(--blu-completed-color) !important;
                }

                .blu-high-speed-icon {
                    color: var(--blu-high-speed-color);
                    filter: drop-shadow(0 0 3px currentColor);
                }

                .blu-magic-background {
                    background: url(https://ptpimg.me/z7zdq7.gif) center/contain no-repeat;
                    background-blend-mode: multiply;
                }
            `;
            document.head.appendChild(styleSheet);
        },

        applyRowColorByActivity(activityCell, colorVar) {
            const row = activityCell.closest("tr");
            if (!row || cache.hasProcessedRow(row)) return;

            cache.markRowProcessed(row);

            row.classList.add('blu-enhanced-row');

            const classMap = {
                '--blu-seeding-color': 'blu-seeding-row',
                '--blu-leeching-color': 'blu-leeching-row',
                '--blu-completed-color': 'blu-completed-row'
            };

            const className = classMap[colorVar];
            if (className) {
                row.classList.add(className);
            }

            requestAnimationFrame(() => {
                const cells = row.querySelectorAll("td");
                cells.forEach(td => {
                    td.style.setProperty('background-color', `var(${colorVar})`, 'important');
                });
            });
        },

        applyFadeAnimation(icon) {
            if (cache.hasProcessedIcon(icon) || icon.closest(SELECTORS.excludes)) return;

            cache.markIconProcessed(icon);

            icon.style.setProperty('--fa-animation-duration', CONFIG.animations.fade.duration);
            icon.style.setProperty('--fa-fade-opacity', CONFIG.animations.fade.opacity);
            icon.classList.add('fa-fade');
        },

        applyFlipAnimation(icon) {
            if (cache.hasProcessedIcon(icon)) return;

            cache.markIconProcessed(icon);
            icon.style.setProperty('--fa-animation-duration', CONFIG.animations.flip.duration);
            icon.classList.add('fa-flip');
        },

        applyMagicBackground(icon) {
            if (cache.hasProcessedIcon(icon)) return;

            cache.markIconProcessed(icon);
            icon.classList.add('blu-magic-background');
        },

        applyHighSpeedStyle(icon) {
            if (cache.hasProcessedIcon(icon)) return;

            cache.markIconProcessed(icon);
            icon.classList.add('blu-high-speed-icon');

            icon.style.setProperty('--fa-animation-duration', CONFIG.animations.fade.duration);
            icon.style.setProperty('--fa-fade-opacity', CONFIG.animations.fade.opacity);
            icon.classList.add('fa-fade');
        }
    };

    async function highlight() {
        try {
            StyleManager.initializeCSSVariables();

            const processors = [
                { selector: SELECTORS.activityIndicators.seeding, fn: cell => StyleManager.applyRowColorByActivity(cell, '--blu-seeding-color') },
                { selector: SELECTORS.activityIndicators.leeching, fn: cell => StyleManager.applyRowColorByActivity(cell, '--blu-leeching-color') },
                { selector: SELECTORS.activityIndicators.completed, fn: cell => StyleManager.applyRowColorByActivity(cell, '--blu-completed-color') },

                { selector: SELECTORS.icons.free, fn: StyleManager.applyFadeAnimation.bind(StyleManager) },
                { selector: SELECTORS.icons.award, fn: StyleManager.applyFadeAnimation.bind(StyleManager) },
                { selector: SELECTORS.icons.calendarStar, fn: StyleManager.applyFlipAnimation.bind(StyleManager) },

                { selector: SELECTORS.icons.highSpeed, fn: StyleManager.applyHighSpeedStyle.bind(StyleManager) },
                { selector: SELECTORS.icons.magic, fn: StyleManager.applyMagicBackground.bind(StyleManager) }
            ];

            const processingPromises = processors.map(async ({ selector, fn }) => {
                const elements = Array.from(document.querySelectorAll(selector));
                if (elements.length > 0) {
                    await processElementsBatch(elements, fn);
                }
            });

            await Promise.all(processingPromises);

        } catch (error) {
        }
    }

    let isHighlighting = false;
    let highlightQueue = 0;

    function throttledHighlight() {
        if (isHighlighting) {
            highlightQueue++;
            return;
        }

        isHighlighting = true;
        highlightQueue = 0;

        requestAnimationFrame(async () => {
            try {
                await highlight();

                if (highlightQueue > 0) {
                    setTimeout(throttledHighlight, CONFIG.performance.throttleDelay);
                }
            } finally {
                setTimeout(() => {
                    isHighlighting = false;
                }, CONFIG.performance.throttleDelay);
            }
        });
    }

    function isRelevantMutation(mutation) {
        if (mutation.type === 'childList') {
            return Array.from(mutation.addedNodes).some(node => {
                if (node.nodeType !== Node.ELEMENT_NODE) return false;

                const activitySelectors = Object.values(SELECTORS.activityIndicators);
                const iconSelectors = Object.values(SELECTORS.icons);
                const allSelectors = [...activitySelectors, ...iconSelectors];

                const hasRelevantElement = allSelectors.some(selector =>
                    node.matches?.(selector) || node.querySelector?.(selector)
                );

                const hasRelevantContainer = SELECTORS.containers.some(container =>
                    node.matches?.(container) || node.querySelector?.(container)
                );

                return hasRelevantElement || hasRelevantContainer;
            });
        }

        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const allSelectors = [
                ...Object.values(SELECTORS.activityIndicators),
                ...Object.values(SELECTORS.icons)
            ].join(',');
            return mutation.target.matches(allSelectors);
        }

        return false;
    }

    const intersectionObserver = new IntersectionObserver((entries) => {
        const visibleEntries = entries.filter(entry => entry.isIntersecting);

        if (visibleEntries.length > 0) {
            debouncer(throttledHighlight);
        }
    }, {
        threshold: CONFIG.performance.intersectionThreshold,
        rootMargin: CONFIG.performance.intersectionRootMargin
    });

    const mutationObserver = new MutationObserver((mutations) => {
        const relevantMutations = mutations.filter(isRelevantMutation);

        if (relevantMutations.length > 0) {
            debouncer(throttledHighlight);
        }

        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' &&
                (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                const target = mutation.target;

                if (target.tagName === 'TD') {
                    const row = target.closest('tr.blu-enhanced-row');
                    if (row) {
                        const colorClass = row.className.match(/blu-(seeding|leeching|completed)-row/)?.[0];
                        if (colorClass && !target.classList.contains('preserved-style')) {
                            const colorMap = {
                                'blu-seeding-row': '--blu-seeding-color',
                                'blu-leeching-row': '--blu-leeching-color',
                                'blu-completed-row': '--blu-completed-color'
                            };
                            const colorVar = colorMap[colorClass];
                            if (colorVar) {
                                target.style.setProperty('background-color', `var(${colorVar})`, 'important');
                            }
                        }
                    }
                }
            }
        });
    });

    function setupObservers() {
        const containers = [
            ...document.querySelectorAll(SELECTORS.containers.join(', ')),
            document.body
        ].filter(Boolean);

        containers.forEach(container => {
            mutationObserver.observe(container, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'style']
            });

            intersectionObserver.observe(container);
        });
    }

    function setupNavigationHandlers() {
        const events = ['turbolinks:load', 'pjax:complete', 'ajax:complete', 'popstate'];

        events.forEach(event => {
            window.addEventListener(event, () => {
                cache.clear();
                throttledHighlight();
                setupObservers();
            }, { passive: true });
        });

        let lastUrl = location.href;
        const urlWatcher = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                cache.clear();

                setTimeout(() => {
                    throttledHighlight();
                    setupObservers();
                }, 400);
            }
        });

        urlWatcher.observe(document, { subtree: true, childList: true });

        window.addEventListener('beforeunload', () => {
            mutationObserver.disconnect();
            intersectionObserver.disconnect();
            urlWatcher.disconnect();
        }, { once: true });
    }

    async function initialize() {
        try {
            await highlight();
            setupObservers();
            setupNavigationHandlers();

        } catch (error) {
        }
    }

    function startScript() {
        if (window.requestIdleCallback) {
            window.requestIdleCallback(initialize, {
                timeout: CONFIG.performance.idleTimeout
            });
        } else {
            setTimeout(initialize, 100);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startScript, { once: true });
    } else {
        startScript();
    }

    window.addEventListener('load', throttledHighlight, { once: true, passive: true });

})();