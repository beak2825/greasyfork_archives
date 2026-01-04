// #region UserScript Metadata

// ==UserScript==

// #region Info

// @name        akkd-all-sites
// @namespace   93akkord/userscripts
// @version     0.0.9
// @description Akkd All Sites
// @copyright   2022+, Michael Barros (https://greasyfork.org/en/users/1123632-93akkord)
// @license     CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license     GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @author      93Akkord
// @run-at      document-start
// @icon        data:image/png;base64,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

// #endregion Info

// #region Matches/Includes/Excludes

// @include     /^.*$/

// #endregion Matches/Includes/Excludes

// #region Grants

// @grant       GM_addElement
// @grant       GM_addStyle
// @grant       GM_addValueChangeListener
// @grant       GM_cookie
// @grant       GM_deleteValue
// @grant       GM_download
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @grant       GM_getTab
// @grant       GM_getTabs
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_log
// @grant       GM_notification
// @grant       GM_openInTab
// @grant       GM_registerMenuCommand
// @grant       GM_removeValueChangeListener
// @grant       GM_saveTab
// @grant       GM_setClipboard
// @grant       GM_setValue
// @grant       GM_unregisterMenuCommand
// @grant       GM_webRequest
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @grant       window.close
// @grant       window.focus
// @grant       window.onurlchange

// #endregion Grants

// #region Resources

// #endregion Resources

// #region Requires

// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @require     https://greasyfork.org/scripts/474546-loglevel/code/loglevel.js
// @require     https://greasyfork.org/scripts/474549-akkd-common/code/akkd-common.js
// @require     https://greasyfork.org/scripts/474617-gm-config-93akkord-fork/code/GM_config-93Akkord-Fork.js

// #endregion Requires

// #region Other

// noframes
// @connect     *

// #endregion Other

// @downloadURL https://update.greasyfork.org/scripts/472596/akkd-all-sites.user.js
// @updateURL https://update.greasyfork.org/scripts/472596/akkd-all-sites.meta.js
// ==/UserScript==

// ==OpenUserJS==

// @author      93Akkord

// ==/OpenUserJS==

// #endregion UserScript Metadata

// #region Type References

/// <reference path='./node_modules/@types/tampermonkey/index.d.ts' />
/// <reference path='./node_modules/@types/jquery/index.d.ts' />
/// <reference path='./node_modules/@types/arrive/index.d.ts' />

// #endregion Type References

const logger = getLogger('akkd', { logLevel: log.levels.DEBUG });

function setupConfig(logger) {
    // demo: http://sizzlemctwizzle.github.io/GM_config/
    GM_config.init({
        id: `main-${location.host.replace(/\./g, '_')}`,
        title: 'Akkd All Sites Config',

        fields: {
            // test: https://www.codingwithjesse.com/demo/2007-05-16-detect-browser-window-focus/
            always_focus: {
                label: 'Always Focus',
                type: 'checkbox',
                default: false,
            },
        },

        events: {
            init: function () {
                init('loaded', () => alwaysOnFocus(GM_config.get('always_focus')));
            },
            open: function () {
                alwaysOnFocus(true);
            },
            save: function () {},
            close: function () {
                alwaysOnFocus(GM_config.get('always_focus'));
            },
            reset: function () {},
        },
    });
}

let contextMenusSetup = false;

function registryContextMenuItems() {
    try {
        if (!contextMenusSetup) {
            createCustomContextMenu(document.body);

            let menuId = GM_registerMenuCommand(`Config`, () => {
                GM_config.open();
            });

            // let markdownLinkToClipboardId = GM_registerMenuCommand(`Markdown link to clipboard`, () => {
            //     GM_setClipboard(`[${document.title}](${location.href})`);
            // });

            contextMenusSetup = true;
        }
    } catch (error) {
        setTimeout(() => {
            registryContextMenuItems();
        }, 100);
    }
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {any[]} arr
 * @returns {number}
 */
function getPadLength(arr) {
    let padLength = 0;

    for (const item of arr) {
        const width = String(item).length;

        if (width > padLength) {
            padLength = width;
        }
    }

    return padLength;
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {any[][]} arrs
 * @returns {number[]}
 */
function getPadLengthLists(arrs) {
    let cellCount = null;

    for (const arr of arrs) {
        if (cellCount === null) {
            cellCount = arr.length;
        } else {
            if (cellCount !== arr.length) {
                throw new Error(`Different cell counts ${cellCount} <-> ${arr.length} :: ${arr}`);
            }
        }
    }

    const padLengths = [];

    for (let i = 0; i < cellCount; i++) {
        const columnItems = arrs.map((lst) => lst[i]);

        padLengths.push(getPadLength(columnItems));
    }

    return padLengths;
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {HTMLTableElement} table
 * @returns {number[]}
 */
function getTablePadLengthList(table) {
    let rows = [];

    for (let i = 0; i < table.rows.length; i++) {
        let row = [];

        for (let j = 0; j < table.rows[i].cells.length; j++) {
            let cell = table.rows[i].cells[j];

            row.push(cell.textContent.trim());
        }

        rows.push(row);
    }

    return getPadLengthLists(rows);
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {HTMLTableElement} table
 * @returns {string}
 */
function htmlToMarkdown(table, firstRowHeader = true) {
    let padLengths = getTablePadLengthList(table);
    let markdown = [];

    for (let i = 0; i < table.rows.length; i++) {
        let row = table.rows[i];
        let cells = [];

        for (let j = 0; j < row.cells.length; j++) {
            let cell = row.cells[j];

            cells.push(cell.textContent.trim().padEnd(padLengths[j]));
        }

        markdown.push(`| ${cells.join(' | ')} |`);

        if (firstRowHeader && i === 0) {
            cells = [];

            for (let j = 0; j < row.cells.length; j++) {
                cells.push('-'.repeat(padLengths[j] + 2));
            }

            markdown.push(`|${cells.join('|')}|`);
        }
    }

    return markdown.join('\n');
}

function exposeGlobalVariables() {
    function safeExposeJQuery() {
        let toExpose = [];

        for (let i = 1; i <= 4; i++) {
            const jQueryVar = '$'.repeat(i);

            try {
                if (getWindow()[jQueryVar].toString().includes('[Command Line API]')) {
                    toExpose.push({ name: jQueryVar, value: window[jQueryVar] });
                }
            } catch (error) {}
        }

        return toExpose;
    }

    let variables = [
        // libs
        { name: 'jQuery', value: jQuery },
        // { name: '$', value: $ },

        // functions/variables
        { name: 'pp', value: pp },
        { name: 'pformat', value: pformat },
        { name: 'getObjProps', value: getObjProps },
        { name: 'getUserDefinedGlobalProps', value: getUserDefinedGlobalProps },
        { name: 'getLocalStorageSize', value: getLocalStorageSize },
        { name: 'unsafeWindow', value: unsafeWindow },
        { name: 'getWindow', value: getWindow },
        { name: 'getTopWindow', value: getTopWindow },
        { name: 'getStyle', value: getStyle },

        { name: 'GM_info', value: GM_info },

        { name: 'alwaysOnFocus', value: alwaysOnFocus },
    ];

    variables = variables.concat(safeExposeJQuery());

    GM_info.script.grant.forEach((grant) => {
        if (grant.includes('GM_')) {
            variables.push({
                name: grant,
                value: window[grant],
            });
        }
    });

    variables.forEach((variable, index, variables) => {
        try {
            setupWindowProps(getWindow(), variable.name, variable.value);
        } catch (error) {
            logger.error(`Unable to expose variable ${variable.name} into the global scope.`);
        }
    });
}

function startPerformanceMonitor() {
    // if (getWindow().top != getWindow().self) {
    // setTimeout(() => {
    let _window = 'unsafeWindow' in window ? getWindow() : window;

    class Stats {
        constructor({
            //
            containerId = 'performance-monitor-container',
            includeMem = true,
            includeMemOld = true,
            includeFps = true,
            includeMs = true,
        } = {}) {
            this.mode = 0;
            this.container = document.createElement('div');
            this.on = false;
            this.changing = false;

            this.includeMem = includeMem;
            this.includeMemOld = includeMemOld;
            this.includeFps = includeFps;
            this.includeMs = includeMs;

            this.container.id = containerId;
            this.container.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000';
            this.container.style.display = 'none';
            this.container.addEventListener('click', (ev) => {
                if (!this.me.moving && !this.me.keyPressed) {
                    ev.preventDefault();

                    this.showPanel(++this.mode % this.container.children.length);
                }
            });

            this.beginTime = (performance || Date).now();
            this.prevTime = this.beginTime;
            this.frames = 0;

            this.memPanel;

            /** @type {Panel} */
            this.memPanelOld;

            /** @type {Panel} */
            this.fpsPanel;

            /** @type {Panel} */
            this.msPanel;

            if (_window.self.performance && _window.self.performance.memory) {
                if (this.includeMem) {
                    this.memPanel = new MemoryStats();

                    this.container.appendChild(this.memPanel.domElement);
                }

                if (this.includeMemOld) {
                    this.memPanelOld = this.addPanel(new Panel('MB', '#f08', '#201'));
                }
            }

            if (this.includeFps) {
                this.fpsPanel = this.addPanel(new Panel('FPS', '#0ff', '#002'));
            }

            if (this.includeMs) {
                this.msPanel = this.addPanel(new Panel('MS', '#0f0', '#020'));
            }

            this.showPanel(0);

            this.REVISION = 16;
            this.dom = this.container;
            this.domElement = this.container;
            this.setMode = this.showPanel;

            this.me = new MoveableElement(this.container, true);
            this.me.init();
        }

        showPanel(id) {
            for (let i = 0; i < this.container.children.length; i++) {
                this.container.children[i].style.display = i === id ? 'block' : 'none';
            }

            this.mode = id;
        }

        addPanel(panel) {
            this.container.appendChild(panel.dom);

            return panel;
        }

        begin() {
            this.beginTime = (performance || Date).now();
        }

        end() {
            let time = (performance || Date).now();
            this.frames++;

            if (this.msPanel) {
                this.msPanel.update(time - this.beginTime, 200);
            }

            if (time >= this.prevTime + 1000) {
                if (this.fpsPanel) {
                    this.fpsPanel.update((this.frames * 1000) / (time - this.prevTime), 100);
                }

                this.prevTime = time;
                this.frames = 0;

                if (this.memPanel) {
                    this.memPanel.update(performance.memory.usedJSHeapSize / 1048576, performance.memory.jsHeapSizeLimit / 1048576);
                }

                if (this.memPanelOld) {
                    this.memPanelOld.update(performance.memory.usedJSHeapSize / 1048576, performance.memory.jsHeapSizeLimit / 1048576);
                }
            }

            return time;
        }

        update() {
            this.beginTime = this.end();
        }

        start(cb) {
            if (!this.on) {
                this.on = true;

                this.showPanel(this.mode);

                this.container.style.display = 'block';

                this.animate(cb);
            }
        }

        stop() {
            this.on = false;

            this.container.style.display = 'none';
        }

        animate(cb) {
            let _animate = () => {
                this.begin();

                if (cb) {
                    cb();
                }

                this.end();

                if (this.on) {
                    requestAnimationFrame(_animate);
                }
            };

            requestAnimationFrame(_animate);
        }
    }

    class Panel {
        constructor(name, foreground, background) {
            this.name = name;
            this.foreground = foreground;
            this.background = background;

            this.min = Infinity;
            this.max = 0;
            this.PR = Math.round(_window.devicePixelRatio || 1);
            this.WIDTH = 80 * this.PR;
            this.HEIGHT = 48 * this.PR;
            this.TEXT_X = 3 * this.PR;
            this.TEXT_Y = 2 * this.PR;
            this.GRAPH_X = 3 * this.PR;
            this.GRAPH_Y = 15 * this.PR;
            this.GRAPH_WIDTH = 74 * this.PR;
            this.GRAPH_HEIGHT = 30 * this.PR;
            this.canvas = document.createElement('canvas');

            this.canvas.width = this.WIDTH;
            this.canvas.height = this.HEIGHT;
            this.canvas.style.cssText = 'width:80px;height:48px;cursor:pointer';

            this.context = this.canvas.getContext('2d');

            this.context.font = 'bold ' + 9 * this.PR + 'px Helvetica,Arial,sans-serif';
            this.context.textBaseline = 'top';
            this.context.fillStyle = this.background;

            this.context.fillRect(0, 0, this.WIDTH, this.HEIGHT);

            this.context.fillStyle = this.foreground;

            this.context.fillText(this.name, this.TEXT_X, this.TEXT_Y);
            this.context.fillRect(this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT);

            this.context.fillStyle = this.background;
            this.context.globalAlpha = 0.9;

            this.context.fillRect(this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT);

            this.dom = this.canvas;
        }

        update(value, maxValue) {
            this.min = Math.min(this.min, value);
            this.max = Math.max(this.max, value);
            this.context.fillStyle = this.background;
            this.context.globalAlpha = 1;

            this.context.fillRect(0, 0, this.WIDTH, this.GRAPH_Y);

            this.context.fillStyle = this.foreground;

            this.context.fillText(Math.round(value) + ' ' + this.name + ' (' + Math.round(this.min) + '-' + Math.round(this.max) + ')', this.TEXT_X, this.TEXT_Y);
            this.context.drawImage(this.canvas, this.GRAPH_X + this.PR, this.GRAPH_Y, this.GRAPH_WIDTH - this.PR, this.GRAPH_HEIGHT, this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH - this.PR, this.GRAPH_HEIGHT);
            this.context.fillRect(this.GRAPH_X + this.GRAPH_WIDTH - this.PR, this.GRAPH_Y, this.PR, this.GRAPH_HEIGHT);

            this.context.fillStyle = this.background;
            this.context.globalAlpha = 0.9;

            this.context.fillRect(this.GRAPH_X + this.GRAPH_WIDTH - this.PR, this.GRAPH_Y, this.PR, Math.round((1 - value / maxValue) * this.GRAPH_HEIGHT));
        }
    }

    function MemoryStats() {
        let msMin = 100;
        let msMax = 0;
        let GRAPH_HEIGHT = 30;
        let GRAPH_WIDTH = 74;
        let redrawMBThreshold = GRAPH_HEIGHT;

        let container = document.createElement('div');
        container.style.display = 'none';
        container.id = 'stats';
        container.style.cssText = 'width:80px;height:48px;opacity:0.9;cursor:pointer;overflow:hidden;z-index:10000;will-change:transform;';

        let msDiv = document.createElement('div');
        msDiv.id = 'ms';
        msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#020;';
        container.appendChild(msDiv);

        let msText = document.createElement('div');
        msText.id = 'msText';
        msText.style.cssText = 'color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
        msText.innerHTML = 'Memory';
        msDiv.appendChild(msText);

        let msGraph = document.createElement('div');
        msGraph.id = 'msGraph';
        msGraph.style.cssText = 'position:relative;width:74px;height:' + GRAPH_HEIGHT + 'px;background-color:#0f0';
        msDiv.appendChild(msGraph);

        while (msGraph.children.length < GRAPH_WIDTH) {
            let bar = document.createElement('span');
            bar.style.cssText = 'width:1px;height:' + GRAPH_HEIGHT + 'px;float:left;background-color:#131';
            msGraph.appendChild(bar);
        }

        let updateGraph = function (dom, height, color) {
            let child = dom.appendChild(dom.firstChild);
            child.style.height = height + 'px';
            if (color) child.style.backgroundColor = color;
        };

        let redrawGraph = function (dom, oHFactor, hFactor) {
            [].forEach.call(dom.children, function (c) {
                let cHeight = c.style.height.substring(0, c.style.height.length - 2);

                // Convert to MB, change factor
                let newVal = GRAPH_HEIGHT - ((GRAPH_HEIGHT - cHeight) / oHFactor) * hFactor;

                c.style.height = newVal + 'px';
            });
        };

        // polyfill usedJSHeapSize
        if (_window.performance && !performance.memory) {
            performance.memory = { usedJSHeapSize: 0, totalJSHeapSize: 0 };
        }

        // support of the API?
        if (performance.memory.totalJSHeapSize === 0) {
            logger.warn('totalJSHeapSize === 0... performance.memory is only available in Chrome .');
        }

        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        let precision;
        let i;
        function bytesToSize(bytes, nFractDigit) {
            if (bytes === 0) return 'n/a';
            nFractDigit = nFractDigit !== undefined ? nFractDigit : 0;
            precision = Math.pow(10, nFractDigit);
            i = Math.floor(Math.log(bytes) / Math.log(1024));
            return Math.round((bytes * precision) / Math.pow(1024, i)) / precision + ' ' + sizes[i];
        }

        // TODO, add a sanity check to see if values are bucketed.
        // If so, remind user to adopt the --enable-precise-memory-info flag.
        // open -a "/Applications/Google Chrome.app" --args --enable-precise-memory-info

        let lastTime = Date.now();
        let lastUsedHeap = performance.memory.usedJSHeapSize;
        let delta = 0;
        let color = '#131';
        let ms = 0;
        let mbValue = 0;
        let factor = 0;
        let newThreshold = 0;

        return {
            domElement: container,

            update: function () {
                // update at 30fps
                if (Date.now() - lastTime < 1000 / 30) return;
                lastTime = Date.now();

                delta = performance.memory.usedJSHeapSize - lastUsedHeap;
                lastUsedHeap = performance.memory.usedJSHeapSize;

                // if memory has gone down, consider it a GC and draw a red bar.
                color = delta < 0 ? '#830' : '#131';

                ms = lastUsedHeap;
                msMin = Math.min(msMin, ms);
                msMax = Math.max(msMax, ms);
                msText.textContent = 'Mem: ' + bytesToSize(ms, 2);

                mbValue = ms / (1024 * 1024);

                if (mbValue > redrawMBThreshold) {
                    factor = (mbValue - (mbValue % GRAPH_HEIGHT)) / GRAPH_HEIGHT;
                    newThreshold = GRAPH_HEIGHT * (factor + 1);
                    redrawGraph(msGraph, GRAPH_HEIGHT / redrawMBThreshold, GRAPH_HEIGHT / newThreshold);
                    redrawMBThreshold = newThreshold;
                }

                updateGraph(msGraph, GRAPH_HEIGHT - mbValue * (GRAPH_HEIGHT / redrawMBThreshold), color);
            },
        };
    }

    let stats = new Stats({
        includeMemOld: false,
        // includeFps: false,
        // includeMs: false,
    });

    function initPerformanceMonitor() {
        if (!document.body) {
            setTimeout(() => {
                initPerformanceMonitor();
            }, 250);
        } else {
            function setupIFrameEvents() {
                setTimeout(() => {
                    let iframes = document.querySelectorAll('iframe');

                    for (let i = 0; i < iframes.length; i++) {
                        try {
                            const iframe = iframes[i];

                            /** @type {Window} */
                            let _window = iframe.contentWindow;

                            _window.document.addEventListener('keydown', function (e) {
                                if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() == 'm') {
                                    e.cancelBubble = true;
                                    e.preventDefault();
                                    e.stopImmediatePropagation();

                                    _window.parent.postMessage('performance-monitor-keybind', '*');
                                }
                            });
                        } catch (error) {}
                    }
                }, 5000);
            }

            document.body.appendChild(stats.dom);

            let changing = false;

            function startOrStop() {
                if (!changing) {
                    changing = true;

                    if (!stats.on) {
                        stats.start();
                    } else {
                        stats.stop();
                    }

                    setTimeout(() => {
                        changing = false;
                    }, 500);
                }
            }

            document.addEventListener('keydown', function (e) {
                if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() == 'm') {
                    e.cancelBubble = true;
                    e.preventDefault();
                    e.stopImmediatePropagation();

                    startOrStop();
                }
            });

            setupIFrameEvents();

            /**
             *
             *
             * @author Michael Barros <michaelcbarros@gmail.com>
             * @param {MessageEvent} ev
             */
            function messageEvent(ev) {
                if (ev.data === 'performance-monitor-keybind' || ev.message === 'performance-monitor-keybind') {
                    startOrStop();
                }
            }

            _window.removeEventListener('message', messageEvent);
            _window.addEventListener('message', messageEvent);
        }
    }

    if (getTopWindow() === getWindow()) {
        initPerformanceMonitor();
    }
}

function alwaysOnFocusOld() {
    let on = GM_getValue('always_focus', false);
    let focusMenuCommandID;

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {boolean} [init=false]
     */
    function registerAlwaysFocusMenuCommand(init = false) {
        if (!init) {
            on = !on;

            GM_setValue('always_focus', on);
        }

        if (focusMenuCommandID != undefined) {
            GM_unregisterMenuCommand(focusMenuCommandID);
        }

        focusMenuCommandID = GM_registerMenuCommand(`Always Focus: ${on ? 'on' : 'off'}`, () => {
            registerAlwaysFocusMenuCommand();
        });

        _alwaysOnFocus(on);
    }

    function _alwaysOnFocus(on) {
        if (!('originalFocusValues' in getWindow())) {
            getWindow().originalFocusValues = {
                'unsafeWindow.onblur': unsafeWindow.onblur,
                'unsafeWindow.blurred': unsafeWindow.blurred,
                'unsafeWindow.document.hasFocus': unsafeWindow.document.hasFocus,
                'unsafeWindow.window.onfocus': unsafeWindow.window.onfocus,

                'document.hidden': document.hidden,
                'document.mozHidden': document.mozHidden,
                'document.msHidden': document.msHidden,
                'document.webkitHidden': document.webkitHidden,
                'document.visibilityState': document.visibilityState,

                'unsafeWindow.document.onvisibilitychange': unsafeWindow.document.onvisibilitychange,
            };
        }

        if (!('__eventHandler__' in getWindow())) {
            getWindow().__eventHandler__ = function (event) {
                event.stopImmediatePropagation();
            };
        }

        function getNestedDot(obj, dotStr) {
            let parts = dotStr.split('.');

            while (parts.length > 0) {
                let part = parts.shift();

                obj = obj[part];
            }

            return obj;
        }

        if (on) {
            unsafeWindow.onblur = null;
            unsafeWindow.blurred = false;

            unsafeWindow.document.hasFocus = function () {
                return true;
            };
            unsafeWindow.window.onfocus = function () {
                return true;
            };

            Object.defineProperty(document, 'hidden', { value: false, configurable: true });
            Object.defineProperty(document, 'mozHidden', { value: false, configurable: true });
            Object.defineProperty(document, 'msHidden', { value: false, configurable: true });
            Object.defineProperty(document, 'webkitHidden', { value: false, configurable: true });
            Object.defineProperty(document, 'visibilityState', {
                get: function () {
                    return 'visible';
                },
                configurable: true,
            });

            unsafeWindow.document.onvisibilitychange = undefined;

            let events = [
                'visibilitychange',
                'webkitvisibilitychange',
                'blur', // may cause issues on some websites
                'mozvisibilitychange',
                'msvisibilitychange',
            ];

            for (let i = 0; i < events.length; i++) {
                const event = events[i];

                window.addEventListener(event, getWindow().__eventHandler__, true);
            }
        } else {
            let orig = getWindow().originalFocusValues;

            unsafeWindow.onblur = orig['unsafeWindow.onblur'];
            unsafeWindow.blurred = orig['unsafeWindow.blurred'];

            unsafeWindow.document.hasFocus = orig['unsafeWindow.document.hasFocus'];
            unsafeWindow.window.onfocus = orig['unsafeWindow.window.onfocus'];

            // Object.defineProperty(document, 'hidden', { value: orig['document.hidden'] });
            // Object.defineProperty(document, 'mozHidden', { value: orig['document.mozHidden'] });
            // Object.defineProperty(document, 'msHidden', { value: orig['document.msHidden'] });
            // Object.defineProperty(document, 'webkitHidden', { value: orig['document.webkitHidden'] });
            document.hidden = orig['document.hidden'];
            document.mozHidden = orig['document.mozHidden'];
            document.msHidden = orig['document.msHidden'];
            document.webkitHidden = orig['document.webkitHidden'];
            document.visibilityState = orig['document.visibilityState'];

            unsafeWindow.document.onvisibilitychange = orig['unsafeWindow.document.onvisibilitychange'];

            let events = [
                'visibilitychange',
                'webkitvisibilitychange',
                'blur', // may cause issues on some websites
                'mozvisibilitychange',
                'msvisibilitychange',
            ];

            for (let i = 0; i < events.length; i++) {
                const event = events[i];

                window.removeEventListener(event, getWindow().__eventHandler__, true);
            }
        }
    }

    registerAlwaysFocusMenuCommand(true);
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {boolean} on
 */
function alwaysOnFocus(on) {
    if (!('originalFocusValues' in getWindow())) {
        getWindow().originalFocusValues = {
            'unsafeWindow.onblur': unsafeWindow.onblur,
            'unsafeWindow.blurred': unsafeWindow.blurred,
            'unsafeWindow.document.hasFocus': unsafeWindow.document.hasFocus,
            'unsafeWindow.window.onfocus': unsafeWindow.window.onfocus,

            'document.hidden': document.hidden,
            'document.mozHidden': document.mozHidden,
            'document.msHidden': document.msHidden,
            'document.webkitHidden': document.webkitHidden,
            'document.visibilityState': document.visibilityState,

            'unsafeWindow.document.onvisibilitychange': unsafeWindow.document.onvisibilitychange,
        };
    }

    if (!('__eventHandler__' in getWindow())) {
        getWindow().__eventHandler__ = function (event) {
            event.stopImmediatePropagation();
        };
    }

    function getNestedDot(obj, dotStr) {
        let parts = dotStr.split('.');

        while (parts.length > 0) {
            let part = parts.shift();

            obj = obj[part];
        }

        return obj;
    }

    if (on) {
        unsafeWindow.onblur = null;
        unsafeWindow.blurred = false;

        unsafeWindow.document.hasFocus = function () {
            return true;
        };
        unsafeWindow.window.onfocus = function () {
            return true;
        };

        Object.defineProperty(document, 'hidden', { value: false, configurable: true });
        Object.defineProperty(document, 'mozHidden', { value: false, configurable: true });
        Object.defineProperty(document, 'msHidden', { value: false, configurable: true });
        Object.defineProperty(document, 'webkitHidden', { value: false, configurable: true });
        Object.defineProperty(document, 'visibilityState', {
            get: function () {
                return 'visible';
            },
            configurable: true,
        });

        unsafeWindow.document.onvisibilitychange = undefined;

        let events = [
            'visibilitychange',
            'webkitvisibilitychange',
            'blur', // may cause issues on some websites
            'mozvisibilitychange',
            'msvisibilitychange',
        ];

        for (let i = 0; i < events.length; i++) {
            const event = events[i];

            window.addEventListener(event, getWindow().__eventHandler__, true);
        }
    } else {
        let orig = getWindow().originalFocusValues;

        unsafeWindow.onblur = orig['unsafeWindow.onblur'];
        unsafeWindow.blurred = orig['unsafeWindow.blurred'];

        unsafeWindow.document.hasFocus = orig['unsafeWindow.document.hasFocus'];
        unsafeWindow.window.onfocus = orig['unsafeWindow.window.onfocus'];

        // Object.defineProperty(document, 'hidden', { value: orig['document.hidden'] });
        // Object.defineProperty(document, 'mozHidden', { value: orig['document.mozHidden'] });
        // Object.defineProperty(document, 'msHidden', { value: orig['document.msHidden'] });
        // Object.defineProperty(document, 'webkitHidden', { value: orig['document.webkitHidden'] });
        document.hidden = orig['document.hidden'];
        document.mozHidden = orig['document.mozHidden'];
        document.msHidden = orig['document.msHidden'];
        document.webkitHidden = orig['document.webkitHidden'];
        document.visibilityState = orig['document.visibilityState'];

        unsafeWindow.document.onvisibilitychange = orig['unsafeWindow.document.onvisibilitychange'];

        let events = [
            'visibilitychange',
            'webkitvisibilitychange',
            'blur', // may cause issues on some websites
            'mozvisibilitychange',
            'msvisibilitychange',
        ];

        for (let i = 0; i < events.length; i++) {
            const event = events[i];

            window.removeEventListener(event, getWindow().__eventHandler__, true);
        }
    }
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 */
async function init(when) {
    const DEFAULT_OPTIONS = {
        use_vanilla: false,
    };

    let options = typeof arguments[1] == 'object' ? arguments[1] : {};
    let func = typeof arguments[1] == 'object' ? arguments[2] : arguments[1];
    let args = typeof arguments[1] == 'object' ? arguments[3] : arguments[2];

    options = Object.assign(DEFAULT_OPTIONS, options);

    async function runCallback() {
        if (args && args.length > 0) {
            await func(...args);
        } else {
            await func();
        }
    }

    if (when == 'start') {
        await runCallback();
    } else if (when == 'ready') {
        if (!options.use_vanilla) {
            $(document).ready(async (e) => {
                await runCallback();
            });
        } else {
            document.addEventListener('DOMContentLoaded', async (e) => {
                await runCallback();
            });
        }
    } else if (when == 'loaded') {
        if (!options.use_vanilla) {
            $(document).on('readystatechange', async (e) => {
                if (e.target.readyState == 'complete') {
                    await runCallback();
                }
            });
        } else {
            document.addEventListener('readystatechange', async (e) => {
                if (e.target.readyState === 'complete') {
                    await runCallback();
                }
            });
        }
    }
}

class CustomContextMenuNew {
    /**
     * Example menuItems
     *
     * ```javascript
     * let menuItems = [
     *    {
     *        type: 'item',
     *        label: 'Test1',
     *        onClick: () => {
     *            alert('test1');
     *        },
     *    },
     *    {
     *        type: 'item',
     *        label: 'Test2',
     *        onClick: () => {
     *            console.debug('test2');
     *        },
     *    },
     *    {
     *        type: 'break',
     *    },
     *    {
     *        type: 'item',
     *        label: 'Test3',
     *        onClick: () => {
     *            console.debug('test3');
     *        },
     *    },
     * ];
     *   ```
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {HTMLElement} elemToAttachTo
     * @param {*} menuItems
     * @memberof CustomContextMenuNew
     */
    constructor(elemToAttachTo, menuItems, onContextMenu, { id, isSubMenu = false, parentMenu, plusCtrlDown = false, useGMaddStyle = false }) {
        this.cssElemId = `akkd-custom-context-menu-style`;

        this.elem = elemToAttachTo;
        this.menuItems = menuItems;
        this.menu = null;
        this.onContextMenu = onContextMenu;
        this.id = id;
        this.isSubMenu = isSubMenu;
        this.useGMaddStyle = useGMaddStyle;
        this.isSubMenuOpen = false;

        /** @type {MouseEvent} */
        this.contextMenuEvent;

        /** @type {CustomContextMenuNew} */
        this.parentMenu = parentMenu;
        this.plusCtrlDown = plusCtrlDown;

        this._addCss();
        this._createMenu();
        this._setupEvents();

        this.hide = this._debounce(this.hide.bind(this), 500, true);
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {number} top
     * @param {number} left
     * @memberof CustomContextMenuNew
     */
    show(top, left) {
        document.body.appendChild(this.menu);

        this.menu.style.display = 'block';

        this.menu.style.top = `${top}px`;
        this.menu.style.left = `${left}px`;

        this.menu.setAttribute('tabindex', '');
        this.menu.focus();
    }

    hide() {
        this.menu.style.display = 'none';

        if (document.body.contains(this.menu)) {
            this.menu.remove();
        }
    }

    _setupEvents() {
        if (this.elem) {
            this.elem.addEventListener('contextmenu', (ev) => {
                if ((this.plusCtrlDown && window.event.ctrlKey) || !this.plusCtrlDown) {
                    ev.preventDefault();

                    this.contextMenuEvent = ev;

                    if (this.onContextMenu) {
                        this.onContextMenu(ev);
                    }

                    this.show(ev.pageY, ev.pageX);
                }
            });
        }

        document.addEventListener('click', (ev) => {
            if (document.body.contains(this.menu) && !this._isHover(this.menu) && !this.isSubMenu) {
                if (!this.isSubMenuOpen) {
                    if (this.parentMenu) {
                        this.parentMenu.isSubMenuOpen = false;
                    }

                    this.hide();
                }
            }
        });

        window.addEventListener('blur', (ev) => {
            if (this.parentMenu) {
                this.parentMenu.isSubMenuOpen = false;
            }

            this.hide();
        });

        this.menu.addEventListener('blur', (ev) => {
            if (this.parentMenu) {
                this.parentMenu.isSubMenuOpen = false;
            }

            if (!this.isSubMenuOpen) {
                this.hide();
            }
        });
    }

    _createMenu() {
        this.menu = this._createMenuContainer();

        let actionsContainer = this.menu.querySelector('.actions-container');

        for (let i = 0; i < this.menuItems.length; i++) {
            let itemConfig = this.menuItems[i];
            /** @type {HTMLElement} */
            let menuItem;

            switch (itemConfig.type) {
                case 'item':
                    menuItem = this._createItem(itemConfig);

                    if (menuItem) {
                        actionsContainer.appendChild(menuItem);
                    }

                    break;

                case 'break':
                case 'divider':
                    menuItem = this._createBreak(itemConfig);

                    if (menuItem) {
                        actionsContainer.appendChild(menuItem);
                    }

                    break;

                case 'submenu':
                    menuItem = this._createSubMenu(itemConfig);

                    if (menuItem) {
                        actionsContainer.appendChild(menuItem);
                    }

                    break;

                default:
                    break;
            }
        }
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @returns {HTMLElement}
     * @memberof CustomContextMenuNew
     */
    _createMenuContainer() {
        let html = String.raw/* html */ `<div class="akkd-menu-container">
<div class="akkd-scrollable-element" role="presentation" style="overflow: hidden; box-shadow: rgba(0, 0, 0, 0.36) 0px 2px 4px">
    <div class="akkd-menu" role="presentation" style="overflow: hidden; max-height: 1294px">
        <div class="akkd-action-bar animated vertical" style="color: rgb(240, 240, 240); background-color: rgb(60, 60, 60)">
            <ul class="actions-container" role="toolbar" tabindex="0">

            </ul>
        </div>
    </div>
    <div role="presentation" aria-hidden="true" class="invisible scrollbar horizontal" style="position: absolute; width: 305px; height: 0px; left: 0px; bottom: 0px">
        <div class="slider" style="position: absolute; top: 0px; left: 0px; height: 10px; transform: translate3d(0px, 0px, 0px); contain: strict; width: 305px"></div>
    </div>
    <div role="presentation" aria-hidden="true" class="invisible scrollbar vertical" style="position: absolute; width: 7px; height: 384px; right: 0px; top: 0px">
        <div class="slider" style="position: absolute; top: 0px; left: 0px; width: 7px; transform: translate3d(0px, 0px, 0px); contain: strict; height: 384px"></div>
    </div>
    <div class="shadow"></div>
    <div class="shadow"></div>
    <div class="shadow"></div>
</div>
</div>`;

        let elem = this._createElementsFromHTML(html);

        if (this.id) {
            elem.id = this.id;
        }

        return elem;
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {*} itemConfig
     * @returns {HTMLElement}
     * @memberof CustomContextMenuNew
     */
    _createItem(itemConfig) {
        if (itemConfig.hide) return;

        let html = String.raw/* html */ `<li class="action-item" role="presentation" tabindex="0">
<a class="action-menu-item" role="menuitem" tabindex="0" aria-checked="" aria-posinset="1" aria-setsize="13" style="color: rgb(240, 240, 240)">
    <span class="menu-item-check codicon codicon-menu-selection" role="none" style="color: rgb(240, 240, 240)"></span>
    <span class="action-label" aria-label="${itemConfig.label}">${itemConfig.label}</span>
    <span class="keybinding">${''}</span>
</a>
</li>`;

        let elem = this._createElementsFromHTML(html);

        if (itemConfig.id) {
            elem.id = itemConfig.id;
        }

        if (itemConfig.onClick) {
            elem.addEventListener('click', (ev) => {
                itemConfig.onClick(this.contextMenuEvent);

                this.hide();
            });
        }

        return elem;
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @returns {HTMLElement}
     * @memberof CustomContextMenuNew
     */
    _createBreak(itemConfig) {
        if (itemConfig.hide) return;

        let html = String.raw/* html */ `<li class="action-item disabled" role="presentation">
        <a class="action-label codicon separator disabled" role="presentation" aria-disabled="true" style="border-bottom-color: rgb(187, 187, 187)"></a>
    </li>`;

        let elem = this._createElementsFromHTML(html);

        return elem;
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {*} itemConfig
     * @returns {HTMLElement}
     * @memberof CustomContextMenuNew
     */
    _createSubMenu(itemConfig) {
        if (itemConfig.hide) return;

        let html = String.raw/* html */ `<li class="action-item" role="presentation">
        <a class="action-menu-item akkd-submenu-item" role="menuitem" aria-checked="" tabindex="0" aria-haspopup="true" aria-expanded="false" aria-posinset="4" aria-setsize="13" style="color: rgb(240, 240, 240)">
            <span class="menu-item-check codicon codicon-menu-selection" role="none" style="color: rgb(240, 240, 240)"></span>
            <span class="action-label" aria-label="${itemConfig.label}">${itemConfig.label}</span>
            <span class="submenu-indicator codicon codicon-menu-submenu" aria-hidden="true" style="color: rgb(240, 240, 240)"></span>
        </a>
    </li>`;

        let elem = this._createElementsFromHTML(html);

        if (itemConfig.id) {
            elem.id = itemConfig.id;
        }

        elem.addEventListener('click', (ev) => {
            /** @type {CustomContextMenuNew} */
            let subMenu = itemConfig.menu(this, ev);

            subMenu.parentMenu.isSubMenuOpen = true;

            subMenu.show(ev.pageY, ev.pageX);
        });

        return elem;
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {string} htmlStr
     * @returns {HTMLElement}
     */
    _createElementsFromHTML(htmlStr) {
        let div = document.createElement('div');

        div.innerHTML = htmlStr.trim();

        return div.firstChild;
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {string} htmlStr
     * @returns {HTMLStyleElement}
     */
    _createStyleElementFromCss(css) {
        let style = document.createElement('style');

        style.innerHTML = css.trim();

        return style;
    }

    _isHover(elem) {
        return elem.parentElement.querySelector(':hover') === elem;
    }

    _addCss() {
        let css = String.raw`@font-face{font-family:codicon;src:url(data:font/truetype;charset=utf-8;base64,AAEAAAALAIAAAwAwR1NVQiCLJXoAAAE4AAAAVE9TLzI3T0YrAAABjAAAAGBjbWFwF8EkrgAACEwAABfiZ2x5ZsbQXdAAACNkAADY4GhlYWRYl6BTAAAA4AAAADZoaGVhAlsCwwAAALwAAAAkaG10eNz1//4AAAHsAAAGYGxvY2EnvfAWAAAgMAAAAzJtYXhwArkBgQAAARgAAAAgbmFtZc1a5AQAAPxEAAAB9XBvc3ShG3uZAAD+PAAAFjkAAQAAASwAAAAAASz////+AS4AAQAAAAAAAAAAAAAAAAAAAZgAAQAAAAEAAE+9MY9fDzz1AAsBLAAAAAB8JbCAAAAAAHwlsID////9AS4BLQAAAAgAAgAAAAAAAAABAAABmAF1ABcAAAAAAAIAAAAKAAoAAAD/AAAAAAAAAAEAAAAKADAAPgACREZMVAAObGF0bgAaAAQAAAAAAAAAAQAAAAQAAAAAAAAAAQAAAAFsaWdhAAgAAAABAAAAAQAEAAQAAAABAAgAAQAGAAAAAQAAAAQBKwGQAAUAAAC+ANIAAAAqAL4A0gAAAJAADgBNAAACAAUDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFBmRWQAwOpg6/8BLAAAABsBRwADAAAAAQAAAAAAAAAAAAAAAAACAAAAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASz//wEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLP//ASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAAAAABQAAAAMAAAAsAAAABAAABLIAAQAAAAADrAADAAEAAAAsAAMACgAABLIABAOAAAAAEAAQAAMAAOqI6ozqx+rJ6wnrTuv///8AAOpg6orqj+rJ6szrC+tQ//8AAAAAAAAAAAAAAAAAAAABABAAYABkANQA1AFOAdQAAAADANQBIwEgAKIBEQFkAQABQADrAUQAQwGNATUBPQE8AIMAMQEKAHgAtwDhADoBYgBtABYBiwCNAHoBHQD5APAA8QF1ALEAmACmAW8BTwB9AWABSAFXAVUBSQFYAV8BWgFTAKgBTgFcAAIABAAFAAoACwAMAA0ADgAPABAAEgAYABkAGgAbAE8AUABRAFIAVQBWAB4AHwAgACEAIgAlACcAKAApACoAKwAsAC0ALgAvADAANAA1ADYANwA4ADkAOwA8AD4APwBAAEIASABJAEoASwBaAFwAXgBhAGYAaABpAGoAawBsAG4AbwBwAHEAcgBzAHQAdQB2AHcAeQB7AH4AgQCCAIUAhgCHAIgAiQCKAIsAjACOAJAAkQCSAJMAlACVAJcAmQCaAJsAhgCcAJ0AngCjAKQApwCpAK0ArgCwALIAswC0ALUAugC7ALwAvQC+AL8AwADBANMA1QDWANkA3ADdAN4A3wDjAOQA5QDmAOcA6gDsAO0A7gDvAPMA9AD3APgA+wD8AQIBBgEHAQgBCQELAQwBDQEOAQ8BEAEVARYBFwEYARkBGgEbARwBHgEfASEBIgEkASUBJgEnASgBKQEqAS8BMAExATIBMwE0ATgBOQE6ATsBPgE/AUEBQgFDAUUBRgFKAUsBTAFNAVABUQFSAVQBVgFZAVsBXQFmAWcBcAFxAXIBcwF0AXYBdwF4AXkBegF+AYABgQGCAYUBhgGHAYkBigGOAY8BkAGRAZIBlgGXANcA2ADaANsAUwBUAGMAZABlAFcBXgBiAGcAYABOACMAJADoAH8AhACvAX8AAQAXAFgA0gD6ASwBYQEEAKUBNwE2AP4BRwEFARMATQGIAD0A6QCAAKoA4gD2ARQAJgEDAP0AMgAzAEEBYwGDAX0BewF8AKABKwEtAPUAXwGTAZUBlAFpAWoBawFsAW0BbgFoABEARwD/AI8BjABdALgAxADDAMIARgBFAEQAFAC5AJ8AoQBMAFsBLgCWAFkAFQCrAKwBAQAcAB0A4AATAYQA8gDRAMUAxgDLAMkAygDMAM0AzgDPANAAyADHAWUAtgESAHwABgAHAAgACQAAAQYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAATMAAAAAAAAAGYAADqYAAA6mAAAAADAADqYQAA6mEAAADUAADqYgAA6mIAAAEjAADqYwAA6mMAAAEgAADqZAAA6mQAAACiAADqZQAA6mUAAAERAADqZgAA6mYAAAFkAADqZwAA6mcAAAEAAADqaAAA6mgAAAFAAADqaQAA6mkAAADrAADqagAA6moAAAFEAADqawAA6msAAABDAADqbAAA6mwAAAGNAADqbQAA6m0AAAE1AADqbgAA6m4AAAE9AADqbwAA6m8AAAE8AADqcAAA6nAAAACDAADqcQAA6nEAAAAxAADqcgAA6nIAAAEKAADqcwAA6nMAAAB4AADqdAAA6nQAAAC3AADqdQAA6nUAAADhAADqdgAA6nYAAAA6AADqdwAA6ncAAAFiAADqeAAA6ngAAABtAADqeQAA6nkAAAAWAADqegAA6noAAAGLAADqewAA6nsAAACNAADqfAAA6nwAAAB6AADqfQAA6n0AAAEdAADqfgAA6n4AAAD5AADqfwAA6n8AAADwAADqgAAA6oAAAADxAADqgQAA6oEAAAF1AADqggAA6oIAAACxAADqgwAA6oMAAACYAADqhAAA6oQAAACmAADqhQAA6oUAAAFvAADqhgAA6oYAAAFPAADqhwAA6ocAAAB9AADqiAAA6ogAAAFgAADqigAA6ooAAAFIAADqiwAA6osAAAFXAADqjAAA6owAAAFVAADqjwAA6o8AAAFJAADqkAAA6pAAAAFYAADqkQAA6pEAAAFfAADqkgAA6pIAAAFaAADqkwAA6pMAAAFTAADqlAAA6pQAAACoAADqlQAA6pUAAAFOAADqlgAA6pYAAAFcAADqlwAA6pcAAAACAADqmAAA6pgAAAAEAADqmQAA6pkAAAAFAADqmgAA6poAAAAKAADqmwAA6psAAAALAADqnAAA6pwAAAAMAADqnQAA6p0AAAANAADqngAA6p4AAAAOAADqnwAA6p8AAAAPAADqoAAA6qAAAAAQAADqoQAA6qEAAAASAADqogAA6qIAAAAYAADqowAA6qMAAAAZAADqpAAA6qQAAAAaAADqpQAA6qUAAAAbAADqpgAA6qYAAABPAADqpwAA6qcAAABQAADqqAAA6qgAAABRAADqqQAA6qkAAABSAADqqgAA6qoAAABVAADqqwAA6qsAAABWAADqrAAA6qwAAAAeAADqrQAA6q0AAAAfAADqrgAA6q4AAAAgAADqrwAA6q8AAAAhAADqsAAA6rAAAAAiAADqsQAA6rEAAAAlAADqsgAA6rIAAAAnAADqswAA6rMAAAAoAADqtAAA6rQAAAApAADqtQAA6rUAAAAqAADqtgAA6rYAAAArAADqtwAA6rcAAAAsAADquAAA6rgAAAAtAADquQAA6rkAAAAuAADqugAA6roAAAAvAADquwAA6rsAAAAwAADqvAAA6rwAAAA0AADqvQAA6r0AAAA1AADqvgAA6r4AAAA2AADqvwAA6r8AAAA3AADqwAAA6sAAAAA4AADqwQAA6sEAAAA5AADqwgAA6sIAAAA7AADqwwAA6sMAAAA8AADqxAAA6sQAAAA+AADqxQAA6sUAAAA/AADqxgAA6sYAAABAAADqxwAA6scAAABCAADqyQAA6skAAABIAADqzAAA6swAAABJAADqzQAA6s0AAABKAADqzgAA6s4AAABLAADqzwAA6s8AAABaAADq0AAA6tAAAABcAADq0QAA6tEAAABeAADq0gAA6tIAAABhAADq0wAA6tMAAABmAADq1AAA6tQAAABoAADq1QAA6tUAAABpAADq1gAA6tYAAABqAADq1wAA6tcAAABrAADq2AAA6tgAAABsAADq2QAA6tkAAABuAADq2gAA6toAAABvAADq2wAA6tsAAABwAADq3AAA6twAAABxAADq3QAA6t0AAAByAADq3gAA6t4AAABzAADq3wAA6t8AAAB0AADq4AAA6uAAAAB1AADq4QAA6uEAAAB2AADq4gAA6uIAAAB3AADq4wAA6uMAAAB5AADq5AAA6uQAAAB7AADq5QAA6uUAAAB+AADq5gAA6uYAAACBAADq5wAA6ucAAACCAADq6AAA6ugAAACFAADq6QAA6ukAAACGAADq6gAA6uoAAACHAADq6wAA6usAAACIAADq7AAA6uwAAACJAADq7QAA6u0AAACKAADq7gAA6u4AAACLAADq7wAA6u8AAACMAADq8AAA6vAAAACOAADq8QAA6vEAAACQAADq8gAA6vIAAACRAADq8wAA6vMAAACSAADq9AAA6vQAAACTAADq9QAA6vUAAACUAADq9gAA6vYAAACVAADq9wAA6vcAAACXAADq+AAA6vgAAACZAADq+QAA6vkAAACaAADq+gAA6voAAACbAADq+wAA6vsAAACGAADq/AAA6vwAAACcAADq/QAA6v0AAACdAADq/gAA6v4AAACeAADq/wAA6v8AAACjAADrAAAA6wAAAACkAADrAQAA6wEAAACnAADrAgAA6wIAAACpAADrAwAA6wMAAACtAADrBAAA6wQAAACuAADrBQAA6wUAAACwAADrBgAA6wYAAACyAADrBwAA6wcAAACzAADrCAAA6wgAAAC0AADrCQAA6wkAAAC1AADrCwAA6wsAAAC6AADrDAAA6wwAAAC7AADrDQAA6w0AAAC8AADrDgAA6w4AAAC9AADrDwAA6w8AAAC+AADrEAAA6xAAAAC/AADrEQAA6xEAAADAAADrEgAA6xIAAADBAADrEwAA6xMAAADTAADrFAAA6xQAAADVAADrFQAA6xUAAADWAADrFgAA6xYAAADZAADrFwAA6xcAAADcAADrGAAA6xgAAADdAADrGQAA6xkAAADeAADrGgAA6xoAAADfAADrGwAA6xsAAADjAADrHAAA6xwAAADkAADrHQAA6x0AAADlAADrHgAA6x4AAADmAADrHwAA6x8AAADnAADrIAAA6yAAAADqAADrIQAA6yEAAADsAADrIgAA6yIAAADtAADrIwAA6yMAAADuAADrJAAA6yQAAADvAADrJQAA6yUAAADzAADrJgAA6yYAAAD0AADrJwAA6ycAAAD3AADrKAAA6ygAAAD4AADrKQAA6ykAAAD7AADrKgAA6yoAAAD8AADrKwAA6ysAAAECAADrLAAA6ywAAAEGAADrLQAA6y0AAAEHAADrLgAA6y4AAAEIAADrLwAA6y8AAAEJAADrMAAA6zAAAAELAADrMQAA6zEAAAEMAADrMgAA6zIAAAENAADrMwAA6zMAAAEOAADrNAAA6zQAAAEPAADrNQAA6zUAAAEQAADrNgAA6zYAAAEVAADrNwAA6zcAAAEWAADrOAAA6zgAAAEXAADrOQAA6zkAAAEYAADrOgAA6zoAAAEZAADrOwAA6zsAAAEaAADrPAAA6zwAAAEbAADrPQAA6z0AAAEcAADrPgAA6z4AAAEeAADrPwAA6z8AAAEfAADrQAAA60AAAAEhAADrQQAA60EAAAEiAADrQgAA60IAAAEkAADrQwAA60MAAAElAADrRAAA60QAAAEmAADrRQAA60UAAAEnAADrRgAA60YAAAEoAADrRwAA60cAAAEpAADrSAAA60gAAAEqAADrSQAA60kAAAEvAADrSgAA60oAAAEwAADrSwAA60sAAAExAADrTAAA60wAAAEyAADrTQAA600AAAEzAADrTgAA604AAAE0AADrUAAA61AAAAE4AADrUQAA61EAAAE5AADrUgAA61IAAAE6AADrUwAA61MAAAE7AADrVAAA61QAAAE+AADrVQAA61UAAAE/AADrVgAA61YAAAFBAADrVwAA61cAAAFCAADrWAAA61gAAAFDAADrWQAA61kAAAFFAADrWgAA61oAAAFGAADrWwAA61sAAAFKAADrXAAA61wAAAFLAADrXQAA610AAAFMAADrXgAA614AAAFNAADrXwAA618AAAFQAADrYAAA62AAAAFRAADrYQAA62EAAAFSAADrYgAA62IAAAFUAADrYwAA62MAAAFWAADrZAAA62QAAAFZAADrZQAA62UAAAFbAADrZgAA62YAAAFdAADrZwAA62cAAAFmAADraAAA62gAAAFnAADraQAA62kAAAFwAADragAA62oAAAFxAADrawAA62sAAAFyAADrbAAA62wAAAFzAADrbQAA620AAAF0AADrbgAA624AAAF2AADrbwAA628AAAF3AADrcAAA63AAAAF4AADrcQAA63EAAAF5AADrcgAA63IAAAF6AADrcwAA63MAAAF+AADrdAAA63QAAAGAAADrdQAA63UAAAGBAADrdgAA63YAAAGCAADrdwAA63cAAAGFAADreAAA63gAAAGGAADreQAA63kAAAGHAADregAA63oAAAGJAADrewAA63sAAAGKAADrfAAA63wAAAGOAADrfQAA630AAAGPAADrfgAA634AAAGQAADrfwAA638AAAGRAADrgAAA64AAAAGSAADrgQAA64EAAAGWAADrggAA64IAAAGXAADrgwAA64MAAADXAADrhAAA64QAAADYAADrhQAA64UAAADaAADrhgAA64YAAADbAADrhwAA64cAAABTAADriAAA64gAAABUAADriQAA64kAAABjAADrigAA64oAAABkAADriwAA64sAAABlAADrjAAA64wAAABXAADrjQAA640AAAFeAADrjgAA644AAABiAADrjwAA648AAABnAADrkAAA65AAAABgAADrkQAA65EAAABOAADrkgAA65IAAAAjAADrkwAA65MAAAAkAADrlAAA65QAAADoAADrlQAA65UAAAB/AADrlgAA65YAAACEAADrlwAA65cAAACvAADrmAAA65gAAAF/AADrmQAA65kAAAABAADrmgAA65oAAAAXAADrmwAA65sAAABYAADrnAAA65wAAADSAADrnQAA650AAAD6AADrngAA654AAAEsAADrnwAA658AAAFhAADroAAA66AAAAEEAADroQAA66EAAAClAADrogAA66IAAAE3AADrowAA66MAAAE2AADrpAAA66QAAAD+AADrpQAA66UAAAFHAADrpgAA66YAAAEFAADrpwAA66cAAAETAADrqAAA66gAAABNAADrqQAA66kAAAGIAADrqgAA66oAAAA9AADrqwAA66sAAADpAADrrAAA66wAAACAAADrrQAA660AAACqAADrrgAA664AAADiAADrrwAA668AAAD2AADrsAAA67AAAAEUAADrsQAA67EAAAAmAADrsgAA67IAAAEDAADrswAA67MAAAD9AADrtAAA67QAAAAyAADrtQAA67UAAAAzAADrtgAA67YAAABBAADrtwAA67cAAAFjAADruAAA67gAAAGDAADruQAA67kAAAF9AADrugAA67oAAAF7AADruwAA67sAAAF8AADrvAAA67wAAACgAADrvQAA670AAAErAADrvgAA674AAAEtAADrvwAA678AAAD1AADrwAAA68AAAABfAADrwQAA68EAAAGTAADrwgAA68IAAAGVAADrwwAA68MAAAGUAADrxAAA68QAAAFpAADrxQAA68UAAAFqAADrxgAA68YAAAFrAADrxwAA68cAAAFsAADryAAA68gAAAFtAADryQAA68kAAAFuAADrygAA68oAAAFoAADrywAA68sAAAARAADrzAAA68wAAABHAADrzQAA680AAAD/AADrzgAA684AAACPAADrzwAA688AAAGMAADr0AAA69AAAABdAADr0QAA69EAAAC4AADr0gAA69IAAADEAADr0wAA69MAAADDAADr1AAA69QAAADCAADr1QAA69UAAABGAADr1gAA69YAAABFAADr1wAA69cAAABEAADr2AAA69gAAAAUAADr2QAA69kAAAC5AADr2gAA69oAAACfAADr2wAA69sAAAChAADr3AAA69wAAABMAADr3QAA690AAABbAADr3gAA694AAAEuAADr3wAA698AAACWAADr4AAA6+AAAABZAADr4QAA6+EAAAAVAADr4gAA6+IAAACrAADr4wAA6+MAAACsAADr5AAA6+QAAAEBAADr5QAA6+UAAAAcAADr5gAA6+YAAAAdAADr5wAA6+cAAADgAADr6AAA6+gAAAATAADr6QAA6+kAAAGEAADr6gAA6+oAAADyAADr6wAA6+sAAADRAADr7AAA6+wAAADFAADr7QAA6+0AAADGAADr7gAA6+4AAADLAADr7wAA6+8AAADJAADr8AAA6/AAAADKAADr8QAA6/EAAADMAADr8gAA6/IAAADNAADr8wAA6/MAAADOAADr9AAA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b2RpY29uVmVyc2lvbiAxLjZjb2RpY29uVGhlIGljb24gZm9udCBmb3IgVmlzdWFsIFN0dWRpbyBDb2RlaHR0cDovL2ZvbnRlbGxvLmNvbQBjAG8AZABpAGMAbwBuAFIAZQBnAHUAbABhAHIAYwBvAGQAaQBjAG8AbgBjAG8AZABpAGMAbwBuAFYAZQByAHMAaQBvAG4AIAAxAC4ANgBjAG8AZABpAGMAbwBuAFQAaABlACAAaQBjAG8AbgAgAGYAbwBuAHQAIABmAG8AcgAgAFYAaQBzAHUAYQBsACAAUwB0AHUAZABpAG8AIABDAG8AZABlAGgAdAB0AHAAOgAvAC8AZgBvAG4AdABlAGwAbABvAC4AYwBvAG0AAAAAAgAAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGYAQIBAwEEAQUBBgEHAQgBCQEKAQsBDAENAQ4BDwEQAREBEgETARQBFQEWARcBGAEZARoBGwEcAR0BHgEfASABIQEiASMBJAElASYBJwEoASkBKgErASwBLQEuAS8BMAExATIBMwE0ATUBNgE3ATgBOQE6ATsBPAE9AT4BPwFAAUEBQgFDAUQBRQFGAUcBSAFJAUoBSwFMAU0BTgFPAVABUQFSAVMBVAFVAVYBVwFYAVkBWgFbAVwBXQFeAV8BYAFhAWIBYwFkAWUBZgFnAWgBaQFqAWsBbAFtAW4BbwFwAXEBcgFzAXQBdQF2AXcBeAF5AXoBewF8AX0BfgF/AYABgQGCAYMBhAGFAYYBhwGIAYkBigGLAYwBjQGOAY8BkAGRAZIBkwGUAZUBlgGXAZgBmQGaAZsBnAGdAZ4BnwGgAaEBogGjAaQBpQGmAacBqAGpAaoBqwGsAa0BrgGvAbABsQGyAbMBtAG1AbYBtwG4AbkBugG7AbwBvQG+Ab8BwAHBAcIBwwHEAcUBxgHHAcgByQHKAcsBzAHNAc4BzwHQAdEB0gHTAdQB1QHWAdcB2AHZAdoB2wHcAd0B3gHfAeAB4QHiAeMB5AHlAeYB5wHoAekB6gHrAewB7QHuAe8B8AHxAfIB8wH0AfUB9gH3AfgB+QH6AfsB/AH9Af4B/wIAAgECAgIDAgQCBQIGAgcCCAIJAgoCCwIMAg0CDgIPAhACEQISAhMCFAIVAhYCFwIYAhkCGgIbAhwCHQIeAh8CIAIhAiICIwIkAiUCJgInAigCKQIqAisCLAItAi4CLwIwAjECMgIzAjQCNQI2AjcCOAI5AjoCOwI8Aj0CPgI/AkACQQJCAkMCRAJFAkYCRwJIAkkCSgJLAkwCTQJOAk8CUAJRAlICUwJUAlUCVgJXAlgCWQJaAlsCXAJdAl4CXwJgAmECYgJjAmQCZQJmAmcCaAJpAmoCawJsAm0CbgJvAnACcQJyAnMCdAJ1AnYCdwJ4AnkCegJ7AnwCfQJ+An8CgAKBAoICgwKEAoUChgKHAogCiQKKAosCjAKNAo4CjwKQApECkgKTApQClQKWApcCmAKZAAdhY2NvdW50FGFjdGl2YXRlLWJyZWFrcG9pbnRzA2FkZAdhcmNoaXZlCmFycm93LWJvdGgRYXJyb3ctY2lyY2xlLWRvd24RYXJyb3ctY2lyY2xlLWxlZnQSYXJyb3ctY2lyY2xlLXJpZ2h0D2Fycm93LWNpcmNsZS11cAphcnJvdy1kb3duCmFycm93LWxlZnQLYXJyb3ctcmlnaHQQYXJyb3ctc21hbGwtZG93bhBhcnJvdy1zbWFsbC1sZWZ0EWFycm93LXNtYWxsLXJpZ2h0DmFycm93LXNtYWxsLXVwCmFycm93LXN3YXAIYXJyb3ctdXAMYXp1cmUtZGV2b3BzBWF6dXJlC2JlYWtlci1zdG9wBmJlYWtlcghiZWxsLWRvdARiZWxsBGJvbGQEYm9vawhib29rbWFyawticmFja2V0LWRvdA1icmFja2V0LWVycm9yCWJyaWVmY2FzZQlicm9hZGNhc3QHYnJvd3NlcgNidWcIY2FsZW5kYXINY2FsbC1pbmNvbWluZw1jYWxsLW91dGdvaW5nDmNhc2Utc2Vuc2l0aXZlCWNoZWNrLWFsbAVjaGVjawljaGVja2xpc3QMY2hldnJvbi1kb3duDGNoZXZyb24tbGVmdA1jaGV2cm9uLXJpZ2h0CmNoZXZyb24tdXAMY2hyb21lLWNsb3NlD2Nocm9tZS1tYXhpbWl6ZQ9jaHJvbWUtbWluaW1pemUOY2hyb21lLXJlc3RvcmUNY2lyY2xlLWZpbGxlZBNjaXJjbGUtbGFyZ2UtZmlsbGVkFGNpcmNsZS1sYXJnZS1vdXRsaW5lDmNpcmNsZS1vdXRsaW5lDGNpcmNsZS1zbGFzaA1jaXJjdWl0LWJvYXJkCWNsZWFyLWFsbAZjbGlwcHkJY2xvc2UtYWxsBWNsb3NlDmNsb3VkLWRvd25sb2FkDGNsb3VkLXVwbG9hZAVjbG91ZARjb2RlDGNvbGxhcHNlLWFsbApjb2xvci1tb2RlB2NvbWJpbmUSY29tbWVudC1kaXNjdXNzaW9uB2NvbW1lbnQOY29tcGFzcy1hY3RpdmULY29tcGFzcy1kb3QHY29tcGFzcwRjb3B5C2NyZWRpdC1jYXJkBGRhc2gJZGFzaGJvYXJkCGRhdGFiYXNlCWRlYnVnLWFsbA9kZWJ1Zy1hbHQtc21hbGwJZGVidWctYWx0J2RlYnVnLWJyZWFrcG9pbnQtY29uZGl0aW9uYWwtdW52ZXJpZmllZBxkZWJ1Zy1icmVha3BvaW50LWNvbmRpdGlvbmFsIGRlYnVnLWJyZWFrcG9pbnQtZGF0YS11bnZlcmlmaWVkFWRlYnVnLWJyZWFrcG9pbnQtZGF0YSRkZWJ1Zy1icmVha3BvaW50LWZ1bmN0aW9uLXVudmVyaWZpZWQZZGVidWctYnJlYWtwb2ludC1mdW5jdGlvbh9kZWJ1Zy1icmVha3BvaW50LWxvZy11bnZlcmlmaWVkFGRlYnVnLWJyZWFrcG9pbnQtbG9nHGRlYnVnLWJyZWFrcG9pbnQtdW5zdXBwb3J0ZWQNZGVidWctY29uc29sZRRkZWJ1Zy1jb250aW51ZS1zbWFsbA5kZWJ1Zy1jb250aW51ZQ5kZWJ1Zy1jb3ZlcmFnZRBkZWJ1Zy1kaXNjb25uZWN0EmRlYnVnLWxpbmUtYnktbGluZQtkZWJ1Zy1wYXVzZQtkZWJ1Zy1yZXJ1bhNkZWJ1Zy1yZXN0YXJ0LWZyYW1lDWRlYnVnLXJlc3RhcnQWZGVidWctcmV2ZXJzZS1jb250aW51ZRdkZWJ1Zy1zdGFja2ZyYW1lLWFjdGl2ZRRkZWJ1Zy1zdGFja2ZyYW1lLWRvdBBkZWJ1Zy1zdGFja2ZyYW1lC2RlYnVnLXN0YXJ0D2RlYnVnLXN0ZXAtYmFjaw9kZWJ1Zy1zdGVwLWludG8OZGVidWctc3RlcC1vdXQPZGVidWctc3RlcC1vdmVyCmRlYnVnLXN0b3AFZGVidWcQZGVza3RvcC1kb3dubG9hZBNkZXZpY2UtY2FtZXJhLXZpZGVvDWRldmljZS1jYW1lcmENZGV2aWNlLW1vYmlsZQpkaWZmLWFkZGVkDGRpZmYtaWdub3JlZA1kaWZmLW1vZGlmaWVkDGRpZmYtcmVtb3ZlZAxkaWZmLXJlbmFtZWQEZGlmZgdkaXNjYXJkBGVkaXQNZWRpdG9yLWxheW91dAhlbGxpcHNpcwxlbXB0eS13aW5kb3cLZXJyb3Itc21hbGwFZXJyb3IHZXhjbHVkZQpleHBhbmQtYWxsBmV4cG9ydApleHRlbnNpb25zCmV5ZS1jbG9zZWQDZXllCGZlZWRiYWNrC2ZpbGUtYmluYXJ5CWZpbGUtY29kZQpmaWxlLW1lZGlhCGZpbGUtcGRmDmZpbGUtc3VibW9kdWxlFmZpbGUtc3ltbGluay1kaXJlY3RvcnkRZmlsZS1zeW1saW5rLWZpbGUIZmlsZS16aXAEZmlsZQVmaWxlcw1maWx0ZXItZmlsbGVkBmZpbHRlcgVmbGFtZQlmb2xkLWRvd24HZm9sZC11cARmb2xkDWZvbGRlci1hY3RpdmUOZm9sZGVyLWxpYnJhcnkNZm9sZGVyLW9wZW5lZAZmb2xkZXIEZ2VhcgRnaWZ0C2dpc3Qtc2VjcmV0CmdpdC1jb21taXQLZ2l0LWNvbXBhcmUJZ2l0LW1lcmdlF2dpdC1wdWxsLXJlcXVlc3QtY2xvc2VkF2dpdC1wdWxsLXJlcXVlc3QtY3JlYXRlFmdpdC1wdWxsLXJlcXVlc3QtZHJhZnQQZ2l0LXB1bGwtcmVxdWVzdA1naXRodWItYWN0aW9uCmdpdGh1Yi1hbHQPZ2l0aHViLWludmVydGVkBmdpdGh1YgVnbG9iZQpnby10by1maWxlB2dyYWJiZXIKZ3JhcGgtbGVmdApncmFwaC1saW5lDWdyYXBoLXNjYXR0ZXIFZ3JhcGgHZ3JpcHBlchFncm91cC1ieS1yZWYtdHlwZQVoZWFydAdoaXN0b3J5BGhvbWUPaG9yaXpvbnRhbC1ydWxlBWh1Ym90BWluYm94BmluZGVudARpbmZvB2luc3BlY3QLaXNzdWUtZHJhZnQOaXNzdWUtcmVvcGVuZWQGaXNzdWVzBml0YWxpYwZqZXJzZXkEanNvbg5rZWJhYi12ZXJ0aWNhbANrZXkDbGF3DWxheWVycy1hY3RpdmUKbGF5ZXJzLWRvdAZsYXllcnMXbGF5b3V0LWFjdGl2aXR5YmFyLWxlZnQYbGF5b3V0LWFjdGl2aXR5YmFyLXJpZ2h0D2xheW91dC1jZW50ZXJlZA5sYXlvdXQtbWVudWJhchNsYXlvdXQtcGFuZWwtY2VudGVyFGxheW91dC1wYW5lbC1qdXN0aWZ5EWxheW91dC1wYW5lbC1sZWZ0EmxheW91dC1wYW5lbC1yaWdodAxsYXlvdXQtcGFuZWwTbGF5b3V0LXNpZGViYXItbGVmdBRsYXlvdXQtc2lkZWJhci1yaWdodBBsYXlvdXQtc3RhdHVzYmFyBmxheW91dAdsaWJyYXJ5EWxpZ2h0YnVsYi1hdXRvZml4CWxpZ2h0YnVsYg1saW5rLWV4dGVybmFsBGxpbmsLbGlzdC1maWx0ZXIJbGlzdC1mbGF0DGxpc3Qtb3JkZXJlZA5saXN0LXNlbGVjdGlvbglsaXN0LXRyZWUObGlzdC11bm9yZGVyZWQKbGl2ZS1zaGFyZQdsb2FkaW5nCGxvY2F0aW9uCmxvY2stc21hbGwEbG9jawZtYWduZXQJbWFpbC1yZWFkBG1haWwIbWFya2Rvd24JbWVnYXBob25lB21lbnRpb24EbWVudQVtZXJnZQltaWxlc3RvbmUGbWlycm9yDG1vcnRhci1ib2FyZARtb3ZlEG11bHRpcGxlLXdpbmRvd3MEbXV0ZQhuZXctZmlsZQpuZXctZm9sZGVyB25ld2xpbmUKbm8tbmV3bGluZQRub3RlEW5vdGVib29rLXRlbXBsYXRlCG5vdGVib29rCG9jdG9mYWNlDG9wZW4tcHJldmlldwxvcmdhbml6YXRpb24Gb3V0cHV0B3BhY2thZ2UIcGFpbnRjYW4LcGFzcy1maWxsZWQEcGFzcwpwZXJzb24tYWRkBnBlcnNvbglwaWUtY2hhcnQDcGluDHBpbm5lZC1kaXJ0eQZwaW5uZWQLcGxheS1jaXJjbGUEcGxheQRwbHVnDXByZXNlcnZlLWNhc2UHcHJldmlldxBwcmltaXRpdmUtc3F1YXJlB3Byb2plY3QFcHVsc2UIcXVlc3Rpb24FcXVvdGULcmFkaW8tdG93ZXIJcmVhY3Rpb25zC3JlY29yZC1rZXlzDHJlY29yZC1zbWFsbAZyZWNvcmQEcmVkbwpyZWZlcmVuY2VzB3JlZnJlc2gFcmVnZXgPcmVtb3RlLWV4cGxvcmVyBnJlbW90ZQZyZW1vdmULcmVwbGFjZS1hbGwHcmVwbGFjZQVyZXBseQpyZXBvLWNsb25lD3JlcG8tZm9yY2UtcHVzaAtyZXBvLWZvcmtlZAlyZXBvLXB1bGwJcmVwby1wdXNoBHJlcG8GcmVwb3J0D3JlcXVlc3QtY2hhbmdlcwZyb2NrZXQScm9vdC1mb2xkZXItb3BlbmVkC3Jvb3QtZm9sZGVyA3JzcwRydWJ5CXJ1bi1hYm92ZQdydW4tYWxsCXJ1bi1iZWxvdwpydW4tZXJyb3JzCHNhdmUtYWxsB3NhdmUtYXMEc2F2ZQtzY3JlZW4tZnVsbA1zY3JlZW4tbm9ybWFsC3NlYXJjaC1zdG9wBnNlYXJjaBJzZXJ2ZXItZW52aXJvbm1lbnQOc2VydmVyLXByb2Nlc3MGc2VydmVyDXNldHRpbmdzLWdlYXIIc2V0dGluZ3MGc2hpZWxkB3NpZ24taW4Ic2lnbi1vdXQGc21pbGV5D3NvcnQtcHJlY2VkZW5jZQ5zb3VyY2UtY29udHJvbBBzcGxpdC1ob3Jpem9udGFsDnNwbGl0LXZlcnRpY2FsCHNxdWlycmVsCnN0YXItZW1wdHkJc3Rhci1mdWxsCXN0YXItaGFsZgtzdG9wLWNpcmNsZQxzeW1ib2wtYXJyYXkOc3ltYm9sLWJvb2xlYW4Mc3ltYm9sLWNsYXNzDHN5bWJvbC1jb2xvcg9zeW1ib2wtY29uc3RhbnQSc3ltYm9sLWVudW0tbWVtYmVyC3N5bWJvbC1lbnVtDHN5bWJvbC1ldmVudAxzeW1ib2wtZmllbGQLc3ltYm9sLWZpbGUQc3ltYm9sLWludGVyZmFjZQpzeW1ib2wta2V5DnN5bWJvbC1rZXl3b3JkDXN5bWJvbC1tZXRob2QLc3ltYm9sLW1pc2MQc3ltYm9sLW5hbWVzcGFjZQ5zeW1ib2wtbnVtZXJpYw9zeW1ib2wtb3BlcmF0b3IQc3ltYm9sLXBhcmFtZXRlcg9zeW1ib2wtcHJvcGVydHkMc3ltYm9sLXJ1bGVyDnN5bWJvbC1zbmlwcGV0DXN5bWJvbC1zdHJpbmcQc3ltYm9sLXN0cnVjdHVyZQ9zeW1ib2wtdmFyaWFibGUMc3luYy1pZ25vcmVkBHN5bmMFdGFibGUDdGFnBnRhcmdldAh0YXNrbGlzdAl0ZWxlc2NvcGUNdGVybWluYWwtYmFzaAx0ZXJtaW5hbC1jbWQPdGVybWluYWwtZGViaWFuDnRlcm1pbmFsLWxpbnV4E3Rlcm1pbmFsLXBvd2Vyc2hlbGwNdGVybWluYWwtdG11eA90ZXJtaW5hbC11YnVudHUIdGVybWluYWwJdGV4dC1zaXplCnRocmVlLWJhcnMKdGh1bWJzZG93bgh0aHVtYnN1cAV0b29scwV0cmFzaA10cmlhbmdsZS1kb3duDXRyaWFuZ2xlLWxlZnQOdHJpYW5nbGUtcmlnaHQLdHJpYW5nbGUtdXAHdHdpdHRlchJ0eXBlLWhpZXJhcmNoeS1zdWIUdHlwZS1oaWVyYXJjaHktc3VwZXIOdHlwZS1oaWVyYXJjaHkGdW5mb2xkE3VuZ3JvdXAtYnktcmVmLXR5cGUGdW5sb2NrBnVubXV0ZQp1bnZlcmlmaWVkDnZhcmlhYmxlLWdyb3VwD3ZlcmlmaWVkLWZpbGxlZAh2ZXJpZmllZAh2ZXJzaW9ucwl2bS1hY3RpdmUKdm0tY29ubmVjdAp2bS1vdXRsaW5lCnZtLXJ1bm5pbmcCdm0Ed2FuZAd3YXJuaW5nBXdhdGNoCndoaXRlc3BhY2UKd2hvbGUtd29yZAZ3aW5kb3cJd29yZC13cmFwEXdvcmtzcGFjZS10cnVzdGVkEXdvcmtzcGFjZS11bmtub3duE3dvcmtzcGFjZS11bnRydXN0ZWQHem9vbS1pbgh6b29tLW91dAAAAAAA) format('truetype');font-weight:400;font-style:normal}.context{position:absolute}.akkd-menu-container{-webkit-text-size-adjust:auto;-webkit-box-direction:normal;user-select:none;-moz-outline-radius:unset !important;outline:unset !important;outline-color:unset !important;outline-style:unset !important;outline-width:unset !important;outline-offset:unset !important;height:fit-content;font-family:-apple-system,BlinkMacSystemFont,'Segoe WPC','Segoe UI',HelveticaNeue-Light,system-ui,Ubuntu,'Droid Sans',sans-serif;font-size:16px;position:absolute;width:fit-content}.akkd-action-bar{white-space:nowrap}.akkd-action-bar .actions-container{-webkit-box-align:center;-ms-flex-align:center;display:-webkit-box;display:-ms-flexbox;display:flex;margin:0 auto;padding:0;width:100%}li.action-item:hover:not(.disabled){color:#fff;background-color:#094771}.akkd-action-bar.vertical .actions-container{display:inline-block}.akkd-action-bar .action-item{-webkit-box-align:center;-ms-flex-align:center;-webkit-box-pack:center;-ms-flex-pack:center;align-items:center;cursor:pointer;display:block;justify-content:center;position:relative}.akkd-action-bar .action-item.disabled{cursor:default}.akkd-action-bar .action-item .codicon{display:block;-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-box;display:-ms-flexbox;display:flex;height:16px;width:16px}.akkd-action-bar .action-item.disabled .action-label,.akkd-action-bar .action-item.disabled .action-label:before,.akkd-action-bar .action-item.disabled .action-label:hover{opacity:.4}.akkd-action-bar.vertical{text-align:left}.akkd-action-bar.vertical .action-item{display:block}.akkd-action-bar.vertical .action-label.separator{border-bottom:1px solid #bbb;display:block;margin-left:.8em;margin-right:.8em;padding-top:1px}.akkd-action-bar .action-item .action-label.separator{background-color:#bbb;cursor:default;height:16px;min-width:1px;padding:0;width:1px}.akkd-scrollable-element>.invisible{opacity:0}.akkd-scrollable-element>.shadow{display:none;position:absolute}.codicon[class*='codicon-']{text-transform:none;-moz-user-select:none;font:normal normal normal 16px/1 codicon;display:inline-block;text-decoration:none;text-rendering:auto;text-align:center;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;user-select:none;-webkit-user-select:none;-ms-user-select:none}.akkd-menu .akkd-action-bar.vertical .action-item .action-menu-item:focus .action-label{stroke-width:1.2px}a.action-menu-item:hover{text-decoration:none}@media screen{.codicon-menu-selection:before{content:'\eab2'}.codicon-menu-submenu:before{content:'\eab6'}.akkd-scrollable-element>.scrollbar>.slider{background:rgba(121,121,121,0.4)}.akkd-scrollable-element>.scrollbar>.slider:hover{background:rgba(100,100,100,0.7)}}.akkd-menu .akkd-action-bar.vertical{margin-left:0;overflow:visible;overflow-x:visible;overflow-y:visible;padding:.5em 0;padding-top:.5em;padding-right:0;padding-bottom:.5em;padding-left:0}.akkd-menu .akkd-action-bar.vertical .keybinding,.akkd-menu .akkd-action-bar.vertical .submenu-indicator{display:inline-block;flex:2 1 auto;padding:0 1em;text-align:right;font-size:12px;line-height:1}.akkd-menu .akkd-action-bar.vertical .action-menu-item{flex:1 1 auto;display:flex;height:2em;align-items:center;position:relative;height:1.8em}.akkd-menu .akkd-action-bar .actions-container{display:flex;margin:0 auto;padding:0;width:100%;justify-content:flex-end}.akkd-menu .akkd-action-bar.vertical .actions-container{display:block}.akkd-menu .akkd-action-bar.vertical .action-item{border:thin solid transparent;position:static;overflow:visible;padding:0;transform:none;display:flex}.akkd-menu .akkd-action-bar.vertical .action-label.separator{display:block;border-bottom:1px solid #bbb;padding-top:0;margin-left:.8em;margin-right:.8em;margin-bottom:.5em;width:100%;height:0 !important;margin-left:.8em !important;margin-right:.8em !important;font-size:inherit;margin:.2em 0 .2em 0 !important}.akkd-menu .akkd-action-bar .action-item.disabled .action-label,.akkd-menu .akkd-action-bar .action-item.disabled .action-label:hover{opacity:.4}.akkd-menu .akkd-action-bar.vertical .action-label{flex:1 1 auto;text-decoration:none;padding:0 1em;background:0;font-size:12px;line-height:1}.akkd-menu{font-size:13px}.akkd-menu .akkd-action-bar.vertical .menu-item-check{position:absolute;visibility:hidden;width:1em;height:100%;font-size:inherit;width:2em}.akkd-menu .akkd-action-bar .action-item .codicon{display:flex;align-items:center;display:inline-block}.akkd-menu .akkd-action-bar.vertical .action-label:not(.separator){display:inline-block;box-sizing:border-box;margin:0}.akkd-menu .akkd-action-bar.vertical .action-label:not(.separator),.akkd-menu .akkd-action-bar.vertical .keybinding{font-size:inherit;padding:0 2em;padding-top:0;padding-right:2em;padding-bottom:0;padding-left:2em}`;

        this._removeCss();

        /** @type {HTMLStyleElement} */
        let elem = this.useGMaddStyle ? GM_addStyle(css) : this._createStyleElementFromCss(css);

        elem.id = this.cssElemId;

        document.head.append(elem);
    }

    _removeCss() {
        let styleElem = document.getElementById(this.cssElemId);

        if (styleElem) {
            styleElem.remove();
        }
    }

    /**
     * Returns a function, that, as long as it continues to be invoked, will not
     * be triggered. The function will be called after it stops being called for
     * N milliseconds. If `immediate` is passed, trigger the function on the
     * leading edge, instead of the trailing.
     *
     * @param {function} func
     * @param {Number} wait
     * @param {Boolean} immediate
     * @returns
     */
    _debounce(func, wait, immediate) {
        let timeout;

        return function () {
            let context = this,
                args = arguments;

            let later = function () {
                timeout = null;

                if (!immediate) func.apply(context, args);
            };

            let callNow = immediate && !timeout;

            clearTimeout(timeout);
            timeout = setTimeout(later, wait);

            if (callNow) func.apply(context, args);
        };
    }
}

function createCustomContextMenu(elem) {
    let menu = new CustomContextMenuNew(
        elem.parentElement,
        [
            {
                type: 'item',
                label: 'Markdown link to clipboard',
                onClick: () => {
                    GM_setClipboard(`[${document.title}](${location.href})`);
                },
                hide: false,
            },

            {
                type: 'item',
                label: 'HTML table to Markdown table clipboard',
                onClick: (ev) => {
                    let table = null;
                    let target = ev.target;

                    while (target) {
                        // Check if the clicked element is a table or is inside a table
                        if (target.tagName === 'TABLE') {
                            table = target;

                            break;
                        }

                        target = target.parentElement;
                    }

                    // If a table element is found, you can now work with it
                    if (table) {
                        let markdown = htmlToMarkdown(table);

                        GM_setClipboard(markdown);
                    }
                },
                hide: false,
            },

            {
                type: 'divider',
                hide: true,
            },

            {
                type: 'submenu',
                label: 'Explore data lineage',
                menu: (parentMenu, ev) => {
                    let menu = new CustomContextMenuNew(
                        null,
                        [
                            {
                                type: 'item',
                                label: 'Markdown link to clipboard',
                                onClick: () => {
                                    GM_setClipboard(`[${document.title}](${location.href})`);
                                },
                                hide: false,
                            },
                        ],
                        (ev) => {
                            elem.click();
                        },
                        { id: 'submenu-01', isSubMenu: true, parentMenu: parentMenu }
                    );

                    return menu;
                },
                onClick: () => {
                    // let monocleUrl = `https://${location.hostname}/workspace/data-integration/monocle/graph/datasets/${owner.stateNode.props.result.id}?upstream=true&branchId=${owner.stateNode.props.result.data.defaultBranch.name}`;

                    // window.open(monocleUrl, '_blank');
                    alert('Explore data lineage clicked!');
                },
                hide: true,
            },
        ],
        (ev) => {
            elem.click();
        },
        { id: 'main-menu', plusCtrlDown: true }
    );
}

(async function () {
    setupConfig(logger);
    registryContextMenuItems();

    GM_getTab((tab) => {
        tab.title = document.title;

        GM_saveTab(tab);
    });

    exposeGlobalVariables();
    startPerformanceMonitor();
})();
