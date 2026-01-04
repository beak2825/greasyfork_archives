// ==UserScript==
// @name         YouTube Smaller Thumbnails
// @namespace    http://greasyfork.org
// @version      0.0.8
// @description  Adds additional thumbnails per row
// @author       you
// @license      MIT
// @match        *://www.youtube.com/*
// @match        *://youtube.com/*
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addValueChangeListener
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @require https://update.greasyfork.org/scripts/470224/1506547/Tampermonkey%20Config.js
// @downloadURL https://update.greasyfork.org/scripts/533610/YouTube%20Smaller%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/533610/YouTube%20Smaller%20Thumbnails.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const DEFAULT_MAX_COLUMNS = 6; // Maximum amount of columns.
    const DEFAULT_MAX_SHORTS_COLUMNS = 12; // Maximum amount of columns for shorts.

    let cfg

    if (
        typeof GM_registerMenuCommand === 'undefined' ||
        typeof GM_unregisterMenuCommand === 'undefined' ||
        typeof GM_addValueChangeListener === 'undefined' ||
        typeof GM_getValue === 'undefined' ||
        typeof GM_setValue === 'undefined' ||
        typeof GM_deleteValue === 'undefined'
    ) {
        cfg = {
            params: {
                'columns': DEFAULT_MAX_COLUMNS,
                'shortsColumns': DEFAULT_MAX_SHORTS_COLUMNS,
                'shortsScale': 10,
                'applyStyles': true
            },
            get: function (key) {
                return typeof this.params[key] !== 'undefined' ? this.params[key] : null;
            }
        }
    } else {
        cfg = new GM_config({
            columns: {
                type: 'int',
                name: 'Videos Per Row',
                value: DEFAULT_MAX_COLUMNS,
                min: 1,
                max: 20
            },
            shortsColumns: {
                type: 'int',
                name: 'Shorts Per Row',
                value: DEFAULT_MAX_SHORTS_COLUMNS,
                min: 1,
                max: 20
            },
            shortsScale: {
                type: 'int',
                name: 'Shorts Scale (in %)',
                min: 10,
                max: 200,
                value: 10
            },
            applyStyles: {
                type: 'boolean',
                name: 'Apply Styles',
                value: true
            }
        })
    }

    function debug(...args) {
        console.log('%c[YouTube Smaller Thumbnails]', 'background: #111; color: green; font-weight: bold;', ...args)
    }

    function applyStyles() {
        if (!cfg.get('applyStyles')) {
            return
        }

        var style = document.createElement('style');
        style.appendChild(document.createTextNode(`
ytd-rich-item-renderer[is-slim-media] {
  width: ${cfg.get('shortsScale')}% !important;
}

ytd-rich-item-renderer[rendered-from-rich-grid][is-in-first-column] {
  margin-left: calc(var(--ytd-rich-grid-item-margin)/2) !important;
}
    	`));
        document.body.appendChild(style);
        debug('Applied styles')
    }

    document.addEventListener("DOMContentLoaded", applyStyles);
    document.addEventListener("load", applyStyles);


    function installStyle(contents) {
        var style = document.createElement('style');
        style.innerHTML = contents;
        document.body.appendChild(style);
    }

    function getTargetValue() {
        return currentOrDefault(+cfg.get('columns'), DEFAULT_MAX_COLUMNS)
    }

    function getShortsTargetValue() {
        return currentOrDefault(+cfg.get('shortsColumns'), DEFAULT_MAX_SHORTS_COLUMNS)
    }

    function currentOrDefault(value, defaultValue) {
        const num = parseInt(value, 10);
        if (!isNaN(num) && num.toString() === String(value).trim() && num > 0 && num < 100) {
            return num
        }
        return defaultValue
    }

    function isShorts(itemElement) {
        return null !== itemElement.getAttribute('is-slim-media')
    }

    function modifyGridStyle(gridElement) {
        const currentStyle = gridElement.getAttribute('style');
        if (!currentStyle) {
            return;
        }

        const itemsPerRowMatch = currentStyle.match(/--ytd-rich-grid-items-per-row:\s*(\d+)/);
        if (!itemsPerRowMatch) {
            return;
        }

        const currentValue = parseInt(itemsPerRowMatch[1], 10);

        if (isNaN(currentValue)) {
            return;
        }

        const newValue = getTargetValue();

        if (currentValue === newValue) {
            return;
        }

        const newStyle = currentStyle.replace(
            /--ytd-rich-grid-items-per-row:\s*\d+/,
            `--ytd-rich-grid-items-per-row: ${newValue}`
        );

        gridElement.setAttribute('style', newStyle);
        debug(`Modified items per row: ${currentValue} -> ${newValue}`);
    }

    function modifyItemsPerRow(itemElement) {
        const currentValue = parseInt(itemElement.getAttribute('items-per-row'), 10);

        if (isNaN(currentValue)) {
            return;
        }

        const newValue = isShorts(itemElement) ?
            getShortsTargetValue() :
            getTargetValue();

        if (currentValue === newValue) {
            return;
        }

        itemElement.setAttribute('items-per-row', newValue);
        debug(`Modified items per row: ${currentValue} -> ${newValue}`);
    }

    function modifyShortHidden(itemElement) {
        if (!isShorts(itemElement)) {
            return;
        }

        if (null === itemElement.getAttribute('hidden')) {
            return
        }

        itemElement.removeAttribute('hidden');
        debug(`Modified hidden`);
    }

    function modifyShelfRenderer(itemElement) {
        const currentStyle = itemElement.getAttribute('style');
        if (!currentStyle) {
            return;
        }

        const itemsCountMatch = currentStyle.match(/--ytd-rich-shelf-items-count:\s*(\d+)/);
        if (!itemsCountMatch) {
            return;
        }

        const currentValue = parseInt(itemElement.getAttribute('elements-per-row'), 10);
        if (isNaN(currentValue)) {
            return;
        }

        const newValue = getShortsTargetValue()
        if (currentValue === newValue) {
            return;
        }

        const newStyle = currentStyle.replace(
            /--ytd-rich-shelf-items-count:\s*\d+/,
            `--ytd-rich-shelf-items-count: ${newValue}`
        );

        itemElement.setAttribute('style', newStyle);
        itemElement.setAttribute('elements-per-row', newValue);
        debug(`Modified elements per row: ${currentValue} -> ${newValue}`);
    }

    function processExistingElements() {
        document.querySelectorAll('ytd-rich-grid-renderer').forEach(gridElement => {
            modifyGridStyle(gridElement);
        });

        document.querySelectorAll('ytd-rich-item-renderer').forEach(itemElement => {
            modifyItemsPerRow(itemElement);
            modifyShortHidden(itemElement);
        });
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.tagName === 'YTD-RICH-GRID-RENDERER') {
                            modifyGridStyle(node);
                        }
                        if (node.tagName === 'YTD-RICH-ITEM-RENDERER') {
                            modifyItemsPerRow(node);
                        }
                        if (node.tagName === 'YTD-RICH-SHELF-RENDERER') {
                            modifyShelfRenderer(node);
                            modifyGridStyle(node);
                        }

                        node.querySelectorAll('ytd-rich-grid-renderer').forEach(gridElement => {
                            modifyGridStyle(gridElement);
                        });
                        node.querySelectorAll('ytd-rich-item-renderer').forEach(itemElement => {
                            modifyItemsPerRow(itemElement);
                            modifyShortHidden(itemElement);
                        });
                        node.querySelectorAll('ytd-rich-shelf-renderer').forEach(itemElement => {
                            modifyShelfRenderer(itemElement);
                            modifyGridStyle(itemElement);
                        });
                    }
                });
            }

            if (mutation.type === 'attributes') {
                const target = mutation.target;

                if (target.tagName === 'YTD-RICH-GRID-RENDERER' && mutation.attributeName === 'style') {
                    modifyGridStyle(target);
                }
                if (target.tagName === 'YTD-RICH-ITEM-RENDERER' && mutation.attributeName === 'items-per-row') {
                    if (mutation.attributeName === 'items-per-row') {
                        modifyItemsPerRow(target);
                    }

                    if (mutation.attributeName === 'hidden') {
                        modifyShortHidden(target);
                    }

                }
                if (target.tagName === 'YTD-RICH-SHELF-RENDERER' && mutation.attributeName === 'elements-per-row') {
                    modifyShelfRenderer(target);
                }
            }
        });
    });

    function startObserver() {
        processExistingElements();
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'hidden', 'items-per-row', 'elements-per-row']
        });

        debug('Observer started');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserver);
    } else {
        startObserver();
    }

    setInterval(processExistingElements, 3000);
})();