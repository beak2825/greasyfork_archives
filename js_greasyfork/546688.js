// ==UserScript==
// @name         MusicBrainz: Align Columns in Merge Edits
// @namespace    https://musicbrainz.org/user/chaban
// @version      2.4.2
// @tag          ai-created
// @description  Aligns columns in merge edit tables for easier comparison.
// @author       chaban
// @license      MIT
// @match        *://*.musicbrainz.org/edit/*
// @match        *://*.musicbrainz.org/search/edits*
// @match        *://*.musicbrainz.org/*/*/edits
// @match        *://*.musicbrainz.org/*/*/open_edits
// @match        *://*.musicbrainz.org/user/*/edits*
// @icon         https://musicbrainz.org/static/images/favicons/android-chrome-512x512.png
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @grant        GM.unregisterMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/546688/MusicBrainz%3A%20Align%20Columns%20in%20Merge%20Edits.user.js
// @updateURL https://update.greasyfork.org/scripts/546688/MusicBrainz%3A%20Align%20Columns%20in%20Merge%20Edits.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    // Set to true to enable performance and status logging in the console.
    const DEBUG = false;
    // -------------------

    const SCRIPT_NAME = GM.info.script.name;

    const CONTEXT_SELECTOR = 'table[class^="details merge-"]';
    const CONTENT_SIZED_COLUMNS = new Set([
        'AcoustIDs', 'Attributes', 'Begin', 'Code', 'End', 'Gender', 'ISRCs',
        'ISWC', 'Length', 'Lyrics languages', 'Releases', 'Type', 'Year',
        'Ordering type', 'Date', 'Time'
    ]);
    const MUTATION_OBSERVER_CONFIG = {
        childList: true,
        subtree: true,
        characterData: true,
    };

    function time(name, func) {
        const startTime = performance.now();
        if (DEBUG) console.time(`[${SCRIPT_NAME}] ${name}`);
        func();
        const endTime = performance.now();
        if (DEBUG) console.timeEnd(`[${SCRIPT_NAME}] ${name}`);
        return endTime - startTime;
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    class ReactiveConfig {
        #options = {};
        #listeners = {};
        #configDefinition;

        constructor(configDefinition) {
            this.#configDefinition = configDefinition;
            configDefinition.forEach(opt => {
                this.#listeners[opt.name] = [];
            });
        }

        async load() {
            await Promise.all(
                this.#configDefinition.map(async (opt) => {
                    this.#options[opt.name] = await GM.getValue(opt.key, opt.defaultValue);
                })
            );
        }

        get(optionName) {
            return this.#options[optionName];
        }

        getAll() {

            return { ...this.#options };

        }
        async update(optionName, newValue) {
            if (this.#options[optionName] === newValue) return;

            this.#options[optionName] = newValue;
            const config = this.#configDefinition.find(opt => opt.name === optionName);
            if (config) {
                await GM.setValue(config.key, newValue);
            }
            this.#listeners[optionName]?.forEach(callback => callback(newValue));
        }

        subscribe(optionName, callback) {
            this.#listeners[optionName]?.push(callback);
            callback(this.#options[optionName]);
        }
    }

    class TableAligner {
        #contextElement;
        #tables;
        #styleElement;
        #observer;
        #config;
        #uniqueId;
        #observedNodes;
        #scheduler;

        constructor(contextElement, config, scheduler) {
            this.#contextElement = contextElement;
            this.#config = config;
            this.#scheduler = scheduler;
            this.#tables = Array.from(contextElement.querySelectorAll('.tbl'));
            if (this.#tables.length < 2) return;

            this.#uniqueId = `mb-align-${Math.random().toString(36).substring(2, 9)}`;
            this.#contextElement.dataset.alignId = this.#uniqueId;
            this.#styleElement = document.createElement('style');
            document.head.appendChild(this.#styleElement);

            this.#setupObserver();
            this.#subscribeToConfigChanges();
        }

        runAlignment() {
            if (this.#tables.some(table => !document.body.contains(table))) {
                this.disconnect();
                return 0;
            }

            if (DEBUG) console.log(`%c[${SCRIPT_NAME}] Running alignment for ${this.#uniqueId}...`, 'font-weight: bold; color: royalblue;');
            this.#observer.disconnect();

            let duration = 0;
            try {
                duration = time(`Alignment for ${this.#uniqueId}`, () => {
                    this.#resetStyles();
                    const headerMaps = this.#getHeaderMaps();
                    if (headerMaps.some(h => h.length === 0)) return;

                    const collapsedColumns = this.#findCollapsedColumns(headerMaps);
                    const columnWidths = this.#calculateColumnWidths(headerMaps, collapsedColumns);
                    if (DEBUG) console.log(`[${SCRIPT_NAME}] Calculated column widths for ${this.#uniqueId}:`, columnWidths);
                    this.#applyColumnStyles(columnWidths, headerMaps, collapsedColumns);
                });
            } catch (error) {
                console.error(`[${SCRIPT_NAME}] Error during alignment for ${this.#uniqueId}:`, error);
            } finally {
                this.#reconnectObserver();
            }
            return duration;
        }

        #calculateColumnWidths(headerMaps, collapsedColumns) {
            const columnWidths = new Map();
            const originalStyles = new Map();
            const tempStyleElement = document.createElement('style');
            document.head.appendChild(tempStyleElement);

            try {
                const tempSelector = `[data-align-id="${this.#uniqueId}"] .tbl th, [data-align-id="${this.#uniqueId}"] .tbl td`;
                tempStyleElement.textContent = `${tempSelector} { white-space: nowrap !important; }`;
                this.#tables.forEach(t => {
                    originalStyles.set(t, t.style.cssText);
                    t.style.cssText = 'table-layout: auto; width: 1px;';
                });
                this.#contextElement.offsetHeight;
                this.#tables.forEach((table, tableIndex) => {
                    const currentHeaders = headerMaps[tableIndex];
                    table.querySelectorAll('thead th, tbody td').forEach(cell => {
                        const headerName = currentHeaders?.[cell.cellIndex];
                        if (!headerName || collapsedColumns.has(headerName)) return;
                        const width = cell.getBoundingClientRect().width;
                        columnWidths.set(headerName, Math.max(columnWidths.get(headerName) || 0, width));
                    });
                });
            } finally {
                tempStyleElement.remove();
                this.#tables.forEach(t => {
                    t.style.cssText = originalStyles.get(t);
                });
            }
            return columnWidths;
        }

        #subscribeToConfigChanges() {
            this.#config.subscribe('collapseEmpty', () => this.#scheduler(this));
            this.#config.subscribe('widenTableContainer', (shouldWiden) => {
                this.#updateContainerStyle(shouldWiden);
                this.#scheduler(this);
            });
            if (DEBUG) console.log(`[${SCRIPT_NAME}] TableAligner instance ${this.#uniqueId} subscribed to config changes.`);
        }

        #updateContainerStyle(shouldWiden) {
            this.#contextElement.querySelectorAll('tbody > tr').forEach(row => {
                const header = row.querySelector('th');
                if (header && ['Merge:', 'Into:'].includes(header.textContent.trim())) {
                    const dataCell = row.querySelector('td');
                    header.style.display = shouldWiden ? 'none' : '';
                    if (dataCell) dataCell.colSpan = shouldWiden ? 2 : 1;
                }
            });
        }

        #findCollapsedColumns(headerMaps) {
            if (!this.#config.get('collapseEmpty')) {
                return new Set();
            }
            const collapsedColumns = new Set();
            const allHeaderNames = [...new Set(headerMaps.flat())];
            for (const headerName of allHeaderNames) {
                const isCompletelyEmpty = this.#tables.every(table => {
                    const tableIndex = this.#tables.indexOf(table);
                    const colIndex = headerMaps[tableIndex].indexOf(headerName);
                    if (colIndex === -1) return true;
                    const cells = Array.from(table.querySelectorAll(`tbody td:nth-child(${colIndex + 1})`));
                    return !cells.some(cell => !this.#isCellVisuallyEmpty(cell));
                });
                if (isCompletelyEmpty) {
                    collapsedColumns.add(headerName);
                }
            }
            return collapsedColumns;
        }

        #resetStyles() {
            this.#styleElement.textContent = '';
            this.#tables.forEach(t => {
                t.style.cssText = '';
                Array.from(t.rows).forEach(r => r.style.height = '');
            });
        }

        #getHeaderMaps() {
            return this.#tables.map(t => Array.from(t.querySelectorAll('thead th')).map(th => th.textContent.trim()));
        }

        #isCellVisuallyEmpty(c) {
            const cl = c.cloneNode(true);
            cl.querySelectorAll('script').forEach(s => s.remove());
            return cl.textContent.trim() === '';
        }

        #applyColumnStyles(columnWidths, headerMaps, collapsedColumns) {
            const containerWidth = this.#contextElement.clientWidth;
            let rigidWidthTotal = 0;
            let flexibleIdealTotal = 0;
            const allVisibleHeaders = [...columnWidths.keys()].filter(n => !collapsedColumns.has(n));
            for (const n of allVisibleHeaders) {
                const w = columnWidths.get(n) || 0;
                if (CONTENT_SIZED_COLUMNS.has(n)) {
                    rigidWidthTotal += w;
                } else {
                    flexibleIdealTotal += w;
                }
            }
            const useProportional = rigidWidthTotal >= containerWidth && flexibleIdealTotal > 0;
            const cssRules = [];
            const p = `[data-align-id="${this.#uniqueId}"] .tbl`;
            for (const n of [...new Set(headerMaps.flat())]) {
                const indices = [...new Set(headerMaps.flatMap((m, ti) => m.reduce((a, name, i) => {
                    if (name === n && this.#tables[ti].querySelector(`thead th:nth-child(${i + 1})`)) a.push(i + 1);
                    return a;
                }, [])))];
                if (indices.length === 0) continue;
                const s = indices.map(i => `${p} th:nth-child(${i}), ${p} td:nth-child(${i})`).join(',\n');
                if (collapsedColumns.has(n)) {
                    cssRules.push(`${s} { display: none; }`);
                } else {
                    const w = columnWidths.get(n) || 0;
                    let ws;
                    if (useProportional) {
                        const t = rigidWidthTotal + flexibleIdealTotal;
                        ws = `width: ${t > 0 ? (w / t) * 100 : 0}%;`;
                    } else if (CONTENT_SIZED_COLUMNS.has(n)) {
                        ws = `width: ${w}px;`;
                    } else {
                        const pct = flexibleIdealTotal > 0 ? (w / flexibleIdealTotal) * 100 : 0;
                        ws = `width: calc((100% - ${rigidWidthTotal}px) * ${pct / 100});`;
                    }
                    cssRules.push(`${s} { ${ws} }`);
                }
            }
            cssRules.push(`${p} th { overflow: hidden; text-overflow: ellipsis; }`);
            this.#styleElement.textContent = cssRules.join('\n');
            this.#tables.forEach(t => {
                t.style.tableLayout = 'fixed';
                t.style.width = '100%';
            });
        }

        #setupObserver() {
            this.#observer = new MutationObserver(() => this.#scheduler(this));
            this.#observedNodes = this.#tables.map(t => t.querySelector('tbody')).filter(Boolean);
            this.#reconnectObserver();
        }

        #reconnectObserver() {
            this.#observedNodes.forEach(tbody => {
                if (document.body.contains(tbody)) this.#observer.observe(tbody, MUTATION_OBSERVER_CONFIG);
            });
        }

        disconnect() {
            if (this.#observer) this.#observer.disconnect();
            if (this.#styleElement) this.#styleElement.remove();
        }
    }

    async function init() {
        const OPTIONS_CONFIG = [
            { name: 'collapseEmpty', key: 'collapse-empty-columns', text: 'Collapse Empty Columns', defaultValue: true },
            { name: 'widenTableContainer', key: 'widen-table-container', text: 'Widen Table Container', defaultValue: true },
        ];

        const config = new ReactiveConfig(OPTIONS_CONFIG);
        await config.load();
        if (DEBUG) console.log(`[${SCRIPT_NAME}] Initial configuration loaded:`, config.getAll());

        const dirtyAligners = new Set();
        const runDirtyAlignments = debounce(() => {
            if (dirtyAligners.size === 0) return;
            const taskCount = dirtyAligners.size;
            if (DEBUG) console.log(`%c[${SCRIPT_NAME}] Scheduler dispatching ${taskCount} alignment tasks...`, 'font-weight: bold; color: darkgreen;');

            let completedTasks = 0;
            let totalCpuTime = 0;

            dirtyAligners.forEach(aligner => {
                setTimeout(() => {
                    const executionTime = aligner.runAlignment();
                    if (typeof executionTime === 'number') {
                        totalCpuTime += executionTime;
                    }
                    completedTasks++;

                    if (completedTasks === taskCount) {
                        if (DEBUG) console.log(`%c[${SCRIPT_NAME}] Batch of ${taskCount} tasks finished. Total CPU time: ${totalCpuTime.toFixed(2)} ms`, 'font-weight: bold; color: darkgreen;');
                    }
                }, 0);
            });

            dirtyAligners.clear();
        }, 250);


        const scheduleAlignment = (aligner) => {
            dirtyAligners.add(aligner);
            runDirtyAlignments();
        };

        document.querySelectorAll(CONTEXT_SELECTOR).forEach(context => {
            const aligner = new TableAligner(context, config, scheduleAlignment);
            if (aligner.runAlignment) {
                scheduleAlignment(aligner);
            }
        });

        const commandIds = {};
        const registerAllCommands = async () => {
            for (const id of Object.values(commandIds)) await GM.unregisterMenuCommand(id);
            for (const opt of OPTIONS_CONFIG) {
                const commandText = `${opt.text}: ${config.get(opt.name) ? 'ON' : 'OFF'}`;
                commandIds[opt.key] = await GM.registerMenuCommand(commandText, async () => {
                    await config.update(opt.name, !config.get(opt.name));
                    await registerAllCommands();
                });
            }
        };
        await registerAllCommands();
    }
    init().catch(err => console.error(`[${SCRIPT_NAME}] Initialization failed:`, err));

})();