// ==UserScript==
// @name         [银河奶牛]康康运气（测试）
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  更详细的统计数据
// @author       Weierstras@www.milkywayidle.com
// @license      MIT
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @connect      raw.githubusercontent.com
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/ml-fft@1.3.5/dist/ml-fft.min.js
// @downloadURL https://update.greasyfork.org/scripts/536800/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E5%BA%B7%E5%BA%B7%E8%BF%90%E6%B0%94%EF%BC%88%E6%B5%8B%E8%AF%95%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/536800/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E5%BA%B7%E5%BA%B7%E8%BF%90%E6%B0%94%EF%BC%88%E6%B5%8B%E8%AF%95%EF%BC%89.meta.js
// ==/UserScript==


/*
 * 参考文献:
 *   - [银河奶牛]食用工具 (https://greasyfork.org/zh-CN/scripts/499963-银河奶牛-食用工具)
 *   - MWITools (https://greasyfork.org/zh-CN/scripts/494467-mwitools)
 *   - 牛牛聊天增强插件 (https://greasyfork.org/zh-CN/scripts/535795-牛牛聊天增强插件)
 */


GM_addStyle(`
.lll_Button_battlePlayerFood__custom {
    background-color: #546ddb !important;
    color: white;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
    transition: background-color 0.3s;
}
.lll_Button_battlePlayerFood__custom:hover {
    background-color: #6b84ff !important;
}
.lll_Button_battlePlayerLoot__custom {
	background-color: #db5454 !important;
	color: white;
	border-radius: 5px;
	padding: 5px 10px;
	cursor: pointer;
	transition: background-color 0.3s ease;
}
.lll_Button_battlePlayerLoot__custom:hover {
	background-color: #ff6b6b !important;
}

.lll_btn_battleDropAnalyzer {
    background-color: #21967e !important;
    color: white;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.lll_btn_battleDropAnalyzer:hover {
    background-color:rgb(37, 184, 152) !important;
}

:root {
    background-color: #141418;
    --button-close: rgb(118, 130, 182);
    --border: rgb(113, 123, 169);
    --border-trans: rgba(108, 117, 160, 0.5);
    --title-text-shadow: 0 0 1.5px rgba(0, 0, 0, 0.5);
    --content-background: rgb(28, 32, 47);
    --content-inner-background2: #272a3b;
    --content-inner-background: #2a2b42;
    --content-inner-border: #3c3e66;
    --item-background:rgb(54, 60, 83);
    --item-border:rgb(103, 113, 149);
    --item-hover-background: #414662;
    --item-hover-border: rgb(113, 123, 169);
}

/* popup */
.lll_popup_root {
    position: fixed;
    top: 50%;
    left: 50%;
    color: white;
    transform: translate(-50%, -50%);
    background-color: rgb(54, 59, 91);
    border: 2px solid rgb(74, 79, 111);
    box-shadow: 0 0 5px 1px black;
    border-radius: 11px 11px 17px 17px;
    z-index: 10000;
    max-width: 90%;
    max-height: 90%;
    white-space: nowrap;
    display: flex;
    flex-direction: column;
}

.lll_tab_btnClose {
    border-radius: 10px;
    background: var(--button-close);
    border: none;
    position: absolute;
    box-shadow: 0 0 1px black;
    top: 12px;
    right: 12px;
    height: 18px;
    width: 18px;
    padding: 0;
    font-weight: 550;
    color: #2f3451;
    font-size: 19px;
    line-height: 0;
    cursor: pointer;
    user-select: none;
}

.lll_tab_btnContainer {
    margin: 5px 5px 0 5px;
    padding-right: 50px;
    align-items: start;
    display: flex;
    gap: 5px;
}

.lll_tab_btn {
    padding: 7px 18px;
    font-size: 16px;
    font-weight: 500;
    text-shadow: var(--title-text-shadow);
    border-radius: 8px 8px 0 0;
    text-align: center;
    display: flex;
    cursor: pointer;
    user-select: none;
}

.lll_tab_btn:hover {
    background-color: var(--border-trans);
}

.lll_tab_btn.active {
    background-color: var(--border);
    cursor: default;
}

.lll_tab_pageContainer {
    margin: -1px -2px -2px -2px;
    border: 3px solid var(--border);
    border-radius: 8px 8px 15px 15px;
    background-color: var(--content-background);
    min-height: 0;
    display: flex;
    flex-direction: column;
    min-height: 0;
    display: flex;
    flex-direction: column;
}

.lll_tab_pageTitle {
    display: block;
    margin: -1px;
    border-radius: 5px 5px 0 0;
}

.lll_tab_pageTitleText {
    width: fit-content;
    padding: 0 30px;
    margin: auto;
    text-align: center;
    background-color: var(--border);
    border-radius: 0 0 5px 5px;
    font-size: 16px;
    font-weight: bold;
    text-shadow: var(--title-text-shadow);
    cursor: default;
}

.lll_tab_page {
    overflow: auto;
    display: none;
}

.lll_tab_page.active {
    display: block;
}

.lll_tab_pageContent {
    padding: 20px;
}

.lll_tab_pageContent.withTitle {
    padding-top: 13px;
}

/* battle */
.lll_battleDropAnal_playerDrop {
    padding: 10px;
    border-radius: 10px;
    background-color: var(--content-inner-background);
    border: 2px solid var(--border);
    margin: 0px auto;
}

.lll_battleDropAnal_item {
    display: flex;
    align-items: center;
    background-color: var(--item-background);
    border: 1.5px solid var(--item-border);
    border-radius: 5px;
    padding: 8px;
    white-space: nowrap;
    flex-shrink: 0;
    cursor: default;
}

.lll_battleDropAnal_item:hover {
    background-color: var(--item-hover-background);
    border: 1.5px solid var(--item-hover-border);
}

.lll_seperator {
    margin: 8px 0;
    border-top: 1.5px solid var(--border);
}`);

var defaultOptions = {
    line: {
        color: '#F66',
        width: 1,
        dashPattern: []
    },
    sync: {
        enabled: false,
        group: 1,
        suppressTooltips: false
    },
    zoom: {
        enabled: true,
        zoomboxBackgroundColor: 'rgba(66,133,244,0.2)',
        zoomboxBorderColor: '#48F',
        zoomButtonText: 'Reset Zoom',
        zoomButtonClass: 'reset-zoom',
    },
    snap: {
        enabled: false,
    },
    callbacks: {
        beforeZoom: function (start, end) {
            return true;
        },
        afterZoom: () => { }
    }
};
function valueOrDefault(value, defaultValue) {
    return typeof value === 'undefined' ? defaultValue : value;
}

// chartjs-plugin-crosshair (https://cdn.jsdelivr.net/npm/chartjs-plugin-crosshair@2.0.0/dist/chartjs-plugin-crosshair.min.js)
const TracePlugin = {
    id: 'crosshair',

    afterInit: function (chart) {

        if (!chart.config.options.scales.x) {
            return
        }

        var xScaleType = chart.config.options.scales.x.type

        if (xScaleType !== 'linear' && xScaleType !== 'time' && xScaleType !== 'category' && xScaleType !== 'logarithmic') {
            return;
        }

        if (chart.options.plugins.crosshair === undefined) {
            chart.options.plugins.crosshair = defaultOptions;
        }

        chart.crosshair = {
            enabled: false,
            suppressUpdate: false,
            x: null,
            originalData: [],
            originalXRange: {},
            dragStarted: false,
            dragStartX: null,
            dragEndX: null,
            suppressTooltips: false,
            ignoreNextEvents: 0,
            reset: function () {
                this.resetZoom(chart, false, false);
            }.bind(this)
        };

        var syncEnabled = this.getOption(chart, 'sync', 'enabled');
        if (syncEnabled) {
            chart.crosshair.syncEventHandler = function (e) {
                this.handleSyncEvent(chart, e);
            }.bind(this);

            chart.crosshair.resetZoomEventHandler = function (e) {

                var syncGroup = this.getOption(chart, 'sync', 'group');

                if (e.chartId !== chart.id && e.syncGroup === syncGroup) {
                    this.resetZoom(chart, true);
                }
            }.bind(this);

            window.addEventListener('sync-event', chart.crosshair.syncEventHandler);
            window.addEventListener('reset-zoom-event', chart.crosshair.resetZoomEventHandler);
        }

        chart.panZoom = this.panZoom.bind(this, chart);
    },

    afterDestroy: function (chart) {
        var syncEnabled = this.getOption(chart, 'sync', 'enabled');
        if (syncEnabled) {
            window.removeEventListener('sync-event', chart.crosshair.syncEventHandler);
            window.removeEventListener('reset-zoom-event', chart.crosshair.resetZoomEventHandler);
        }
    },

    panZoom: function (chart, increment) {
        if (chart.crosshair.originalData.length === 0) {
            return;
        }
        var diff = chart.crosshair.end - chart.crosshair.start;
        var min = chart.crosshair.min;
        var max = chart.crosshair.max;
        if (increment < 0) { // left
            chart.crosshair.start = Math.max(chart.crosshair.start + increment, min);
            chart.crosshair.end = chart.crosshair.start === min ? min + diff : chart.crosshair.end + increment;
        } else { // right
            chart.crosshair.end = Math.min(chart.crosshair.end + increment, chart.crosshair.max);
            chart.crosshair.start = chart.crosshair.end === max ? max - diff : chart.crosshair.start + increment;
        }

        this.doZoom(chart, chart.crosshair.start, chart.crosshair.end);
    },

    getOption: function (chart, category, name) {
        return valueOrDefault(chart.options.plugins.crosshair[category] ? chart.options.plugins.crosshair[category][name] : undefined, defaultOptions[category][name]);
    },

    getXScale: function (chart) {
        return chart.data.datasets.length ? chart.scales[chart.getDatasetMeta(0).xAxisID] : null;
    },
    getYScale: function (chart) {
        return chart.scales[chart.getDatasetMeta(0).yAxisID];
    },

    handleSyncEvent: function (chart, e) {

        var syncGroup = this.getOption(chart, 'sync', 'group');

        // stop if the sync event was fired from this chart
        if (e.chartId === chart.id) {
            return;
        }

        // stop if the sync event was fired from a different group
        if (e.syncGroup !== syncGroup) {
            return;
        }

        var xScale = this.getXScale(chart);

        if (!xScale) {
            return;
        }

        // Safari fix
        var buttons = (e.original.native.buttons === undefined ? e.original.native.which : e.original.native.buttons);
        if (e.original.type === 'mouseup') {
            buttons = 0;
        }


        var newEvent = {
            // do not transmit click events to prevent unwanted changing of synced charts. We do need to transmit a event to stop zooming on synced charts however.
            type: e.original.type == "click" ? "mousemove" : e.original.type,
            chart: chart,
            x: xScale.getPixelForValue(e.xValue),
            y: e.original.y,
            native: {
                buttons: buttons
            },
            stop: true
        };
        chart._eventHandler(newEvent);
    },

    afterEvent: function (chart, event) {

        if (chart.config.options.scales.x.length == 0) {
            return
        }

        let e = event.event

        var xScaleType = chart.config.options.scales.x.type

        if (xScaleType !== 'linear' && xScaleType !== 'time' && xScaleType !== 'category' && xScaleType !== 'logarithmic') {
            return;
        }

        var xScale = this.getXScale(chart);

        if (!xScale) {
            return;
        }

        if (chart.crosshair.ignoreNextEvents > 0) {
            chart.crosshair.ignoreNextEvents -= 1
            return;
        }

        // fix for Safari
        var buttons = (e.native.buttons === undefined ? e.native.which : e.native.buttons);
        if (e.native.type === 'mouseup') {
            buttons = 0;
        }

        var syncEnabled = this.getOption(chart, 'sync', 'enabled');
        var syncGroup = this.getOption(chart, 'sync', 'group');

        // fire event for all other linked charts
        if (!e.stop && syncEnabled) {
            let event = new CustomEvent('sync-event');
            event.chartId = chart.id;
            event.syncGroup = syncGroup;
            event.original = e;
            event.xValue = xScale.getValueForPixel(e.x);
            window.dispatchEvent(event);
        }

        // suppress tooltips for linked charts
        var suppressTooltips = this.getOption(chart, 'sync', 'suppressTooltips');

        chart.crosshair.suppressTooltips = e.stop && suppressTooltips;

        chart.crosshair.enabled = (e.type !== 'mouseout' && (e.x > xScale.getPixelForValue(xScale.min) && e.x < xScale.getPixelForValue(xScale.max)));

        if (!chart.crosshair.enabled && !chart.crosshair.suppressUpdate) {
            if (e.x > xScale.getPixelForValue(xScale.max)) {
                // suppress future updates to prevent endless redrawing of chart
                chart.crosshair.suppressUpdate = true
                chart.update('none');
            }
            chart.crosshair.dragStarted = false // cancel zoom in progress
            return false;
        }
        chart.crosshair.suppressUpdate = false

        // handle drag to zoom
        var zoomEnabled = this.getOption(chart, 'zoom', 'enabled');

        if (buttons === 1 && !chart.crosshair.dragStarted && zoomEnabled) {
            chart.crosshair.dragStartX = e.x;
            chart.crosshair.dragStarted = true;
        }

        // handle drag to zoom
        if (chart.crosshair.dragStarted && buttons === 0) {
            chart.crosshair.dragStarted = false;

            var start = xScale.getValueForPixel(chart.crosshair.dragStartX);
            var end = xScale.getValueForPixel(chart.crosshair.x);

            if (Math.abs(chart.crosshair.dragStartX - chart.crosshair.x) > 1) {
                this.doZoom(chart, start, end);
            }
            chart.update('none');
        }

        chart.crosshair.x = e.x;


        chart.draw();

    },

    afterDraw: function (chart) {

        if (!chart.crosshair.enabled) {
            return;
        }

        if (chart.crosshair.dragStarted) {
            this.drawZoombox(chart);
        } else {
            this.drawTraceLine(chart);
            this.interpolateValues(chart);
            this.drawTracePoints(chart);
        }

        return true;
    },

    beforeTooltipDraw: function (chart) {
        // suppress tooltips on dragging
        return !chart.crosshair.dragStarted && !chart.crosshair.suppressTooltips;
    },

    resetZoom: function (chart) {

        var stop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var update = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        if (update) {
            if (chart.crosshair.originalData.length > 0) {
                // reset original data
                for (var datasetIndex = 0; datasetIndex < chart.data.datasets.length; datasetIndex++) {
                    var dataset = chart.data.datasets[datasetIndex];
                    dataset.data = chart.crosshair.originalData.shift(0);
                }
            }

            // reset original xRange
            if (chart.crosshair.originalXRange.min) {
                chart.options.scales.x.min = chart.crosshair.originalXRange.min;
                chart.crosshair.originalXRange.min = null;
            } else {
                delete chart.options.scales.x.min;
            }
            if (chart.crosshair.originalXRange.max) {
                chart.options.scales.x.max = chart.crosshair.originalXRange.max;
                chart.crosshair.originalXRange.max = null;
            } else {
                delete chart.options.scales.x.max;
            }
        }

        if (chart.crosshair.button && chart.crosshair.button.parentNode) {
            chart.crosshair.button.parentNode.removeChild(chart.crosshair.button);
            chart.crosshair.button = false;
        }

        var syncEnabled = this.getOption(chart, 'sync', 'enabled');

        if (!stop && update && syncEnabled) {

            var syncGroup = this.getOption(chart, 'sync', 'group');

            var event = new CustomEvent('reset-zoom-event');
            event.chartId = chart.id;
            event.syncGroup = syncGroup;
            window.dispatchEvent(event);
        }
        if (update) {
            chart.update('none');
        }
    },

    doZoom: function (chart, start, end) {

        // swap start/end if user dragged from right to left
        if (start > end) {
            var tmp = start;
            start = end;
            end = tmp;
        }

        // notify delegate
        var beforeZoomCallback = valueOrDefault(chart.options.plugins.crosshair.callbacks ? chart.options.plugins.crosshair.callbacks.beforeZoom : undefined, defaultOptions.callbacks.beforeZoom);

        if (!beforeZoomCallback(start, end)) {
            return false;
        }

        chart.crosshair.dragStarted = false

        if (chart.options.scales.x.min && chart.crosshair.originalData.length === 0) {
            chart.crosshair.originalXRange.min = chart.options.scales.x.min;
        }
        if (chart.options.scales.x.max && chart.crosshair.originalData.length === 0) {
            chart.crosshair.originalXRange.max = chart.options.scales.x.max;
        }

        if (!chart.crosshair.button) {
            // add restore zoom button
            var button = document.createElement('button');

            var buttonText = this.getOption(chart, 'zoom', 'zoomButtonText')
            var buttonClass = this.getOption(chart, 'zoom', 'zoomButtonClass')

            var buttonLabel = document.createTextNode(buttonText);
            button.appendChild(buttonLabel);
            button.className = buttonClass;
            button.addEventListener('click', function () {
                this.resetZoom(chart);
            }.bind(this));
            chart.canvas.parentNode.appendChild(button);
            chart.crosshair.button = button;
        }

        // set axis scale
        chart.options.scales.x.min = start;
        chart.options.scales.x.max = end;

        // make a copy of the original data for later restoration

        var storeOriginals = (chart.crosshair.originalData.length === 0) ? true : false;


        var filterDataset = (chart.config.options.scales.x.type !== 'category')

        if (filterDataset) {


            for (var datasetIndex = 0; datasetIndex < chart.data.datasets.length; datasetIndex++) {

                var newData = [];

                var index = 0;
                var started = false;
                var stop = false;
                if (storeOriginals) {
                    chart.crosshair.originalData[datasetIndex] = chart.data.datasets[datasetIndex].data;
                }

                var sourceDataset = chart.crosshair.originalData[datasetIndex];

                for (var oldDataIndex = 0; oldDataIndex < sourceDataset.length; oldDataIndex++) {

                    var oldData = sourceDataset[oldDataIndex];
                    // var oldDataX = this.getXScale(chart).getRightValue(oldData)
                    var oldDataX = oldData.x !== undefined ? oldData.x : NaN

                    // append one value outside of bounds
                    if (oldDataX >= start && !started && index > 0) {
                        newData.push(sourceDataset[index - 1]);
                        started = true;
                    }
                    if (oldDataX >= start && oldDataX <= end) {
                        newData.push(oldData);
                    }
                    if (oldDataX > end && !stop && index < sourceDataset.length) {
                        newData.push(oldData);
                        stop = true;
                    }
                    index += 1;
                }

                chart.data.datasets[datasetIndex].data = newData;
            }
        }

        chart.crosshair.start = start;
        chart.crosshair.end = end;


        if (storeOriginals) {
            var xAxes = this.getXScale(chart);
            chart.crosshair.min = xAxes.min;
            chart.crosshair.max = xAxes.max;
        }

        chart.crosshair.ignoreNextEvents = 2 // ignore next 2 events to prevent starting a new zoom action after updating the chart

        chart.update('none');


        var afterZoomCallback = this.getOption(chart, 'callbacks', 'afterZoom');

        afterZoomCallback(start, end);
    },

    drawZoombox: function (chart) {

        var yScale = this.getYScale(chart);

        var borderColor = this.getOption(chart, 'zoom', 'zoomboxBorderColor');
        var fillColor = this.getOption(chart, 'zoom', 'zoomboxBackgroundColor');

        chart.ctx.beginPath();
        chart.ctx.rect(chart.crosshair.dragStartX, yScale.getPixelForValue(yScale.max), chart.crosshair.x - chart.crosshair.dragStartX, yScale.getPixelForValue(yScale.min) - yScale.getPixelForValue(yScale.max));
        chart.ctx.lineWidth = 1;
        chart.ctx.strokeStyle = borderColor;
        chart.ctx.fillStyle = fillColor;
        chart.ctx.fill();
        chart.ctx.fillStyle = '';
        chart.ctx.stroke();
        chart.ctx.closePath();
    },

    drawTraceLine: function (chart) {

        var yScale = this.getYScale(chart);

        var lineWidth = this.getOption(chart, 'line', 'width');
        var color = this.getOption(chart, 'line', 'color');
        var dashPattern = this.getOption(chart, 'line', 'dashPattern');
        var snapEnabled = this.getOption(chart, 'snap', 'enabled');

        var lineX = chart.crosshair.x;

        if (snapEnabled && chart._active.length) {
            lineX = chart._active[0].element.x;
        }

        chart.ctx.beginPath();
        chart.ctx.setLineDash(dashPattern);
        chart.ctx.moveTo(lineX, yScale.getPixelForValue(yScale.max));
        chart.ctx.lineWidth = lineWidth;
        chart.ctx.strokeStyle = color;
        chart.ctx.lineTo(lineX, yScale.getPixelForValue(yScale.min));
        chart.ctx.stroke();
        chart.ctx.setLineDash([]);

    },

    drawTracePoints: function (chart) {

        for (var chartIndex = 0; chartIndex < chart.data.datasets.length; chartIndex++) {

            var dataset = chart.data.datasets[chartIndex];
            var meta = chart.getDatasetMeta(chartIndex);

            var yScale = chart.scales[meta.yAxisID];

            if ((meta.hidden ?? chart.data.datasets[chartIndex].hidden) || !dataset.interpolate) {
                continue;
            }

            chart.ctx.beginPath();
            chart.ctx.arc(chart.crosshair.x, yScale.getPixelForValue(dataset.interpolatedValue), 3, 0, 2 * Math.PI, false);
            chart.ctx.fillStyle = 'white';
            chart.ctx.lineWidth = 2;
            chart.ctx.strokeStyle = dataset.borderColor;
            chart.ctx.fill();
            chart.ctx.stroke();

        }

    },

    interpolateValues: function (chart) {
        for (var chartIndex = 0; chartIndex < chart.data.datasets.length; chartIndex++) {
            let dataset = chart.data.datasets[chartIndex];
            let meta = chart.getDatasetMeta(chartIndex);

            let xScale = chart.scales[meta.xAxisID];
            let xValue = xScale.getValueForPixel(chart.crosshair.x);

            if ((meta.hidden ?? chart.data.datasets[chartIndex].hidden) || !dataset.interpolate) {
                continue;
            }

            let data = dataset.data;
            let index = data.findIndex(function (o) {
                return o.x >= xValue;
            });
            let prev = data[index - 1];
            let next = data[index];

            if (chart.data.datasets[chartIndex].steppedLine && prev) {
                dataset.interpolatedValue = prev.y;
            } else if (prev && next) {
                let slope = (next.y - prev.y) / (next.x - prev.x);
                dataset.interpolatedValue = prev.y + (xValue - prev.x) * slope;
            } else {
                dataset.interpolatedValue = NaN;
            }
        }

    }

};
Chart.register(TracePlugin);

/*
 * TODO:
 *   - 英语翻译
 *   - UI 重构
 *   - 开箱统计
 *     - 开箱运气
 *   - 强化统计
 *     - 强化运气
 *   - 任务
 *     - 期望收益
 *     - 计算是否应该刷新
 */


const dbg = console.log.bind(null, '%c[康康运气]%c', 'color:red', 'color:black');
const out = console.log.bind(null, '%c[康康运气]%c', 'color:green', 'color:black');

(function () {
    'use strict';

    const MARKET_API_URL = "https://raw.githubusercontent.com/holychikenz/MWIApi/main/milkyapi.json";
    const MarketUpdateInterval = 1; // (days)
    const LocalStorageName = 'lll_data';

    const FFT = mlFft.FFT;

    const isCN = !['en'].some(lang => localStorage.getItem("i18nextLng")?.toLowerCase()?.startsWith(lang));
    let isMobile = window.innerWidth < 768; // 判断是否为移动设备
    window.onresize = () => { isMobile = window.innerWidth < 768; };

    const Utils = new class {
        #inf = 0x3FFFFFFE;
        floor(n) { return n > this.#inf || n < -this.#inf ? Math.floor(n) : ((n + this.#inf) | 0) - this.#inf; }
        round(n) { return this.floor(n + 0.5); }
        HSVtoRGB(h, s, v, a = 1) {
            var r, g, b, i, f, p, q, t;
            i = Math.floor(h * 6);
            f = h * 6 - i;
            p = v * (1 - s);
            q = v * (1 - f * s);
            t = v * (1 - (1 - f) * s);
            switch (i % 6) {
                case 0: r = v; g = t; b = p; break;
                case 1: r = q; g = v; b = p; break;
                case 2: r = p; g = v; b = t; break;
                case 3: r = p; g = q; b = v; break;
                case 4: r = t; g = p; b = v; break;
                case 5: r = v; g = p; b = q; break;
            }
            r = Math.round(r * 255);
            g = Math.round(g * 255);
            b = Math.round(b * 255);
            return {
                r: r, g: g, b: b,
                rgb: `rgba(${r}, ${g}, ${b})`,
                rgba: `rgba(${r}, ${g}, ${b}, ${a})`,
            };
        }
        formatPrice(value, threshold = 10, precision = 1) {
            const isNegative = value < 0;
            value = Math.abs(value);
            if (value >= 1e12 * threshold) {
                return (isNegative ? '-' : '') + (value / 1e12).toFixed(precision) + 'T';
            } else if (value >= 1e9 * threshold) {
                return (isNegative ? '-' : '') + (value / 1e9).toFixed(precision) + 'B';
            } else if (value >= 1e6 * threshold) {
                return (isNegative ? '-' : '') + (value / 1e6).toFixed(precision) + 'M';
            } else if (value >= 1e3 * threshold) {
                return (isNegative ? '-' : '') + (value / 1e3).toFixed(precision) + 'K';
            } else {
                return (isNegative ? '-' : '') + value.toFixed(0);
            }
        }
        formatNumber(value) {
            return value.toString().replace(/\d+/, function (n) {
                return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
            })
        }
        binarySearch(f, l, r, dest, maxIter = 60) {
            for (let i = 0; i < maxIter; ++i) {
                let mid = (l + r) / 2;
                if (f(mid) < dest) l = mid;
                else r = mid;
            }
            return (l + r) / 2;
        };
    };

    const LocalStorageData = new class {
        get(key) {
            const data = JSON.parse(localStorage.getItem(LocalStorageName) ?? 'null');
            dbg(`load ${key} from localStorage:`, data);
            return data?.[key];
        }
        set(key, value) {
            const data = JSON.parse(localStorage.getItem(LocalStorageName) ?? '{}');
            data[key] = value;
            localStorage.setItem(LocalStorageName, JSON.stringify(data));
            dbg(`saved ${key} to localStorage: ${key} =`, value);
        }
    };

    function readConfig(defaultConfig, userConfig) {
        if (typeof defaultConfig !== 'object') {
            return userConfig ?? defaultConfig;
        }
        const ret = {};
        for (const [key, value] of Object.entries(defaultConfig)) {
            if (userConfig.hasOwnProperty(key)) ret[key] = readConfig(value, userConfig[key]);
            else ret[key] = value;
        }
        return ret;
    }
    const Config = readConfig({
        charaFunc: {
            verbose: false,
            cdfIterSpeed: 0.9,
            cdfLimitEps: 1e-4,
            cdfMaxIter: 30,
            cdfEps: 1e-4,
            cdfWrapping: 0.4,
            rescaleSamples: 64,
        },
        battleDropAnalyzer: {
            verbose: false,
            samples: isMobile ? 512 : 4096,
            minLimit: 1e8,
            perWaveLimit: 2e5,
        },
        battleDropAnalyzerUi: {
            overviewItemSortOrder: 'unitBid', // totalBid
            overviewItemMaxNumber: 10,
            overviewItemMinRarity: 0,
            chartInterpolatePoints: isMobile ? 128 : 512,
            chartTension: 0.4,
            detailsChartCdfEps: 0.05,
            detailsChartSigmaCoeff: 2,
            customChartCdfEps: 0.005,
            customChartSigmaCoeff: 2,
            customPanelShowSolo: false,
            customPanelMaxRunCount: 100000,
            customPanelMaxSliderValue: 1500,
        }
    }, LocalStorageData.get('config') ?? {});

    //#region math

    // Complex number
    const Complex = new class {
        add = (a, b) => [a[0] + b[0], a[1] + b[1]]
        sub = (a, b) => [a[0] - b[0], a[1] - b[1]]
        mul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]]
        mulRe = (a, x) => [a[0] * x, a[1] * x]
        div = (a, b) => {
            const mag = b[0] * b[0] + b[1] * b[1];
            return [(a[0] * b[0] + a[1] * b[1]) / mag, (a[1] * b[0] - a[0] * b[1]) / mag];
        }
        abs = (c) => Math.sqrt(c[0] * c[0] + c[1] * c[1])
        pow = (c, x) => {
            const arg = Math.atan2(c[1], c[0]) * x;
            const mag = Math.pow(c[0] * c[0] + c[1] * c[1], x / 2);
            return [mag * Math.cos(arg), mag * Math.sin(arg)];
        }
    };

    const ComplexVector = new class {
        constantRe(n, a) {
            const v = Array(n);
            for (let i = 0; i < n; i += 4) {
                v[i] = [a, 0]; v[i + 1] = [a, 0]; v[i + 2] = [a, 0]; v[i + 3] = [a, 0];
                // v[i + 4] = [a, 0]; v[i + 5] = [a, 0]; v[i + 6] = [a, 0]; v[i + 7] = [a, 0];
            }
            return v;
        }
        mul(a, b) {
            const n = a.length, z = Array(n);
            for (let i = 0; i < n;) {
                z[i] = [a[i][0] * b[i][0] - a[i][1] * b[i][1], a[i][0] * b[i][1] + a[i][1] * b[i][0]]; ++i;
                z[i] = [a[i][0] * b[i][0] - a[i][1] * b[i][1], a[i][0] * b[i][1] + a[i][1] * b[i][0]]; ++i;
                z[i] = [a[i][0] * b[i][0] - a[i][1] * b[i][1], a[i][0] * b[i][1] + a[i][1] * b[i][0]]; ++i;
                z[i] = [a[i][0] * b[i][0] - a[i][1] * b[i][1], a[i][0] * b[i][1] + a[i][1] * b[i][0]]; ++i;
            }
            return z;
        }
        mulEq(a, b) {
            const n = a.length;
            for (let i = 0; i < n;) {
                a[i] = [a[i][0] * b[i][0] - a[i][1] * b[i][1], a[i][0] * b[i][1] + a[i][1] * b[i][0]]; ++i;
                a[i] = [a[i][0] * b[i][0] - a[i][1] * b[i][1], a[i][0] * b[i][1] + a[i][1] * b[i][0]]; ++i;
                a[i] = [a[i][0] * b[i][0] - a[i][1] * b[i][1], a[i][0] * b[i][1] + a[i][1] * b[i][0]]; ++i;
                a[i] = [a[i][0] * b[i][0] - a[i][1] * b[i][1], a[i][0] * b[i][1] + a[i][1] * b[i][0]]; ++i;
            }
            return a;
        }
        mulReEq(a, x) {
            const n = a.length;
            for (let i = 0; i < n;) {
                a[i][0] *= x; a[i][1] *= x; ++i;
                a[i][0] *= x; a[i][1] *= x; ++i;
                a[i][0] *= x; a[i][1] *= x; ++i;
                a[i][0] *= x; a[i][1] *= x; ++i;
            }
            return a;
        }
        addEq(a, b) {
            const n = a.length;
            for (let i = 0; i < n;) {
                a[i][0] += b[i][0]; a[i][1] += b[i][1]; ++i;
                a[i][0] += b[i][0]; a[i][1] += b[i][1]; ++i;
                a[i][0] += b[i][0]; a[i][1] += b[i][1]; ++i;
                a[i][0] += b[i][0]; a[i][1] += b[i][1]; ++i;
            }
            return a;
        }
        addMulEq(dest, a, b) {
            const n = dest.length;
            for (let i = 0; i < n;) {
                dest[i][0] += a[i][0] * b[i][0] - a[i][1] * b[i][1]; dest[i][1] += a[i][0] * b[i][1] + a[i][1] * b[i][0]; ++i;
                dest[i][0] += a[i][0] * b[i][0] - a[i][1] * b[i][1]; dest[i][1] += a[i][0] * b[i][1] + a[i][1] * b[i][0]; ++i;
                dest[i][0] += a[i][0] * b[i][0] - a[i][1] * b[i][1]; dest[i][1] += a[i][0] * b[i][1] + a[i][1] * b[i][0]; ++i;
                dest[i][0] += a[i][0] * b[i][0] - a[i][1] * b[i][1]; dest[i][1] += a[i][0] * b[i][1] + a[i][1] * b[i][0]; ++i;
            }
            return a;
        }
    };

    // Characteristic function
    // (samples, scale) => [ MGF(scale * T * 2πi) : 0 <= T < samples ]
    const CharaFunc = new class {
        // returns [exp(Tai) : 0 <= T < samples]
        getRoots(a, samples) {
            let sin = Array(samples), cos = Array(samples);
            sin[0] = 0; cos[0] = 1;
            sin[1] = Math.sin(a); cos[1] = Math.cos(a);
            sin[2] = sin[1] * cos[1] + cos[1] * sin[1]; cos[2] = cos[1] * cos[1] - sin[1] * sin[1];
            sin[3] = sin[1] * cos[2] + cos[1] * sin[2]; cos[3] = cos[1] * cos[2] - sin[1] * sin[2];
            for (let i = 4; i < samples; i += 4) {
                const j = Utils.floor(i / 2), k = i - j;
                sin[i] = sin[j] * cos[k] + cos[j] * sin[k]; cos[i] = cos[j] * cos[k] - sin[j] * sin[k];
                sin[i + 1] = sin[j] * cos[k + 1] + cos[j] * sin[k + 1]; cos[i + 1] = cos[j] * cos[k + 1] - sin[j] * sin[k + 1];
                sin[i + 2] = sin[j + 1] * cos[k + 1] + cos[j + 1] * sin[k + 1]; cos[i + 2] = cos[j + 1] * cos[k + 1] - sin[j + 1] * sin[k + 1];
                sin[i + 3] = sin[j + 1] * cos[k + 2] + cos[j + 1] * sin[k + 2]; cos[i + 3] = cos[j + 1] * cos[k + 2] - sin[j + 1] * sin[k + 2];
            }
            return [cos, sin];
        }

        constant(x) {
            return (samples, _) => ComplexVector.constantRe(samples, x);
        }
        mul(cf1, cf2) {
            return (samples, scale) => {
                const z = cf1(samples, scale);
                const y = cf2(samples, scale);
                ComplexVector.mulEq(z, y);
                return z;
            };
        }
        mulList(cfs) {
            if (cfs.length === 0) return this.constant(1);
            return (samples, scale) => {
                let z = cfs[0](samples, scale);
                for (let i = 1; i < cfs.length; ++i) {
                    const y = cfs[i](samples, scale);
                    ComplexVector.mulEq(z, y);
                }
                return z;
            };
        }
        pow(cf, n) {
            return (samples, scale) => {
                let z = cf(samples, scale);
                for (let T = 0; T < samples; ++T) z[T] = Complex.pow(z[T], n);
                return z;
            };
        }

        // Characteristic function for drop distribution (minCount, maxCount, dropRate, price).
        drop(data) {
            const { minCount: l, maxCount: r, dropRate, price } = data;
            const eps = 1e-8; // eps < 1/samples
            const L = Math.ceil(l);
            const R = Utils.floor(r);

            if (L > R || r - l < eps) {
                const p = (l + r) / 2 - R;
                const pr = p * dropRate;
                const mpr = (1 - p) * dropRate;
                const mr = 1 - dropRate;

                // p: R+1, 1-p: R
                return (samples, scale) => {
                    let val = Array(samples);
                    const base = 2 * Math.PI * scale * price;
                    const [cosR1, sinR1] = this.getRoots(base * (R + 1), samples);
                    const [cosR, sinR] = this.getRoots(base * R, samples);
                    for (let T = 0; T < samples; ++T) {
                        val[T] = [
                            cosR1[T] * pr + cosR[T] * mpr + mr,
                            sinR1[T] * pr + sinR[T] * mpr
                        ]
                    }
                    return val;
                };
            }
            if (L == R) {
                const pL = dropRate * (L - l) * (L - l) / ((r - l) * 2);
                const pR = dropRate * (r - R) * (r - R) / ((r - l) * 2);
                const mr = 1 - dropRate;
                // pL: R-1, pR: R+1
                return (samples, scale) => {
                    let val = Array(samples);
                    const base = 2 * Math.PI * scale * price;
                    const [cos, sin] = this.getRoots(base, samples);
                    const [cosR, sinR] = this.getRoots(base * R, samples);
                    for (let T = 0; T < samples; ++T) {
                        const a = [dropRate + (pL + pR) * (cos[T] - 1), (-pL + pR) * sin[T]];
                        val[T] = Complex.mul([cosR[T], sinR[T]], a);
                        val[T][0] += mr;
                    }
                    return val;
                };
            }

            const dL = L - l, dR = r - R;
            const dL2 = dL * dL, dR2 = dR * dR;
            const mr = 1 - dropRate;
            const invLen = dropRate / (r - l);
            return (samples, scale) => {
                let val = Array(samples);
                const base = 2 * Math.PI * scale * price;
                const [cos, sin] = this.getRoots(base, samples);
                const [cosR, sinR] = this.getRoots(base * R, samples);
                const [cosL, sinL] = this.getRoots(base * L, samples);
                for (let T = 0; T < samples; ++T) {
                    const ctm1d2 = (cos[T] - 1) / 2, std2 = sin[T] / 2;
                    const elt = [cosL[T], sinL[T]];
                    const ert = [cosR[T], sinR[T]];
                    const fL = Complex.mul([dL + dL2 * ctm1d2, -dL2 * std2], elt);
                    const fR = Complex.mul([dR + dR2 * ctm1d2, dR2 * std2], ert)
                    const irwin = ctm1d2 > -eps && std2 < eps && std2 > -eps ?
                        [(R - L) * elt[0], (R - L) * (elt[1] + std2 * (R - L - 1))] :
                        Complex.div([ert[0] - elt[0], ert[1] - elt[1]], [ctm1d2 * 2, std2 * 2]);
                    const fMid = Complex.mul(irwin, [1 + ctm1d2, std2]);
                    val[T] = [mr + invLen * (fL[0] + fR[0] + fMid[0]), invLen * (fL[1] + fR[1] + fMid[1])];
                }
                return val;
            };
        }

        // Compute cumulative distribution function given characteristic function.
        // return (x) => CDF(x / scale)
        getScaledCDF(cf, samples, scale) {
            const padding = 2;
            const offset = Config.charaFunc.cdfWrapping;

            const N = samples * padding;
            const val = cf(samples, scale * (1 - offset))
                .concat(Array(N - samples).fill([0, 0]));
            let re = val.map(a => a[0]);
            let im = val.map(a => a[1]);
            FFT.init(N);
            FFT.fft(re, im);
            re = re.map(a => a - 0.5);
            const sum = re.reduce((x, acc) => acc + x, 0);
            re = re.map(a => a / sum);

            let cdf = Array(N);
            cdf[0] = (re[0] + re[N - 1]) / 2;
            for (let i = 1; i < N; ++i) {
                cdf[i] = cdf[i - 1] + (re[i] + re[i - 1]) / 2;
            }
            const movingMedian = (a, siz) => {
                const n = a.length;
                let b = Array(n);
                for (let i = 0; i < n; ++i) {
                    let w = [];
                    for (let j = i - siz + 1; j <= i + siz; ++j) {
                        const p = a[(j + n) % n];
                        const x = j < 0 ? p - 1 : j >= n ? p + 1 : p;
                        w.push(x);
                    }
                    for (let i = 0; i <= siz; ++i) {
                        for (let j = i + 1; j < w.length; ++j) {
                            if (w[i] > w[j]) { const t = w[i]; w[i] = w[j]; w[j] = t; }
                        }
                    }
                    b[i] = (w[siz - 1] + w[siz]) / 2;
                }
                return b;
            }
            cdf = movingMedian(cdf, padding);
            let base = cdf[Utils.floor(N * (1 - offset))] - 1;
            for (let i = 0; i < N; ++i) cdf[i] -= base;
            for (let i = 1; i < N; ++i) if (cdf[i] < cdf[i - 1]) cdf[i] = cdf[i - 1];

            const interpolate = (acc, x) => {
                if (x < 0) return 0;
                if (x >= 1) return 1;
                const t = x * (1 - offset) * N - 0.5;
                const i = Utils.round(t), r = t - i;
                const L = i - 1 < 0 ? acc[i + N - 1] - 1 : acc[i - 1];
                const R = i + 1 >= N ? acc[i - N + 1] + 1 : acc[i + 1];
                const A = (acc[i] + L) / 2, B = (acc[i] + R) / 2;
                const kA = acc[i] - L, kB = R - acc[i];
                const ret = 2 * (r + 1) * (r - 0.5) * (r - 0.5) * A
                    + 2 * (1 - r) * (r + 0.5) * (r + 0.5) * B
                    + (r * r - 0.25) * ((r - 0.5) * kA + (r + 0.5) * kB);
                return ret < 0 ? 0 : ret > 1 ? 1 : ret;
            };
            return (x) => interpolate(cdf, x);
        }

        // return {limit, (x) => CDF(x)}
        getCDF(cf, samples, limit = 1e8, rescaleSamples = null) {
            const eps = Config.charaFunc.cdfEps;
            const speed = Config.charaFunc.cdfIterSpeed;
            const maxIter = Config.charaFunc.cdfMaxIter;
            rescaleSamples ??= Config.charaFunc.rescaleSamples;
            for (let i = 0; i < maxIter; ++i) {
                if (Config.charaFunc.verbose) out(`iteration ${i}: limit = ${limit}`);
                let cdf = this.getScaledCDF(cf, rescaleSamples, 1 / limit);
                if (cdf(speed) < 1 - eps) break;
                const x = Utils.binarySearch(cdf, 0, 1, 1 - eps);
                if (x / speed > 1 - Config.charaFunc.cdfLimitEps) break;
                limit *= x / speed;
            }
            let cdf = this.getScaledCDF(cf, samples, 1 / limit);
            return {
                limit: limit,
                cdf: (x) => cdf(x / limit),
            };
        }
    };

    const BattleDropAnalyzer = new class {
        itemExpectation(item) {
            const { minCount: l, maxCount: r, dropRate } = item;
            return dropRate * (l + r) / 2;
        }
        itemVariance(item) {
            const { minCount: l, maxCount: r, dropRate } = item;
            const F = (x) => {
                const a = Math.floor(x);
                const p = x - a;
                return a * ((a * a + 0.5) / 3 + p * (a + p)) + p * p / 2;
            };
            const EX2 = (l, r) => {
                if (r > l + 1e-5) {
                    return (F(r) - F(l)) / (r - l);
                } else {
                    const x = (l + r) / 2;
                    const a = Math.floor(x);
                    const p = x - a;
                    return a * a + 2 * a * p + p;
                }
            };
            const EX = this.itemExpectation(item);
            return dropRate * EX2(l, r) - EX * EX;
        }

        computeExpectedSpawns(spawnInfo) {
            const { spawns, maxSpawnCount: K, maxTotalStrength: N } = spawnInfo;
            const res = {};
            spawns.forEach(m => { res[m.hrid] = 0; });

            const dp = Array(N + 1);
            for (let i = 0; i <= N; ++i) dp[i] = Array(K + 1).fill(0);
            dp[0][0] = 1;

            for (let i = 0; i <= N; ++i) {
                for (let j = 0; j <= K; ++j) {
                    for (const monster of spawns) {
                        const ni = i + monster.strength, nj = j + 1;
                        if (ni > N || nj > K) continue;
                        let val = dp[i][j] * monster.rate;
                        dp[ni][nj] += val;
                        res[monster.hrid] += val;
                    }
                }
            }
            return res;
        }
        dropExpectation(dropData) {
            let E = 0;
            for (const [_, drops] of Object.entries(dropData.bossDrops)) {
                const cnt = dropData.bossCount;
                for (const item of drops) E += cnt * this.itemExpectation(item) * item.price;
            }
            const expectedSpawns = this.computeExpectedSpawns(dropData.spawnInfo);
            for (const [hrid, drops] of Object.entries(dropData.monsterDrops)) {
                const cnt = expectedSpawns[hrid] * dropData.normalCount;
                for (const item of drops) E += cnt * this.itemExpectation(item) * item.price;
            }
            return E;
        }
        dropVariance(dropData) {
            let Var = 0;
            for (const [_, drops] of Object.entries(dropData.bossDrops)) {
                const cnt = dropData.bossCount;
                for (const item of drops) Var += cnt * this.itemVariance(item) * item.price * item.price;
            }
            const expectedSpawns = this.computeExpectedSpawns(dropData.spawnInfo);
            for (const [hrid, drops] of Object.entries(dropData.monsterDrops)) {
                const cnt = expectedSpawns[hrid] * dropData.normalCount;
                for (const item of drops) Var += cnt * this.itemVariance(item) * item.price * item.price;
            }
            return Var;
        }

        #monsterCF(monsterDrops) {
            const cfs = [];
            for (const drop of monsterDrops) {
                cfs.push(CharaFunc.drop(drop));
            }
            return CharaFunc.mulList(cfs);
        }
        #getSpawnTransGraph(spawnInfo) {
            const { spawns, maxSpawnCount: K, maxTotalStrength: N } = spawnInfo;

            const idMap = {};
            const nodes = [];
            const hasId = (i, j) => { return idMap.hasOwnProperty(i * (K + 1) + j); };
            const getId = (i, j) => {
                const h = i * (K + 1) + j;
                if (!hasId(i, j)) {
                    idMap[h] = nodes.length;
                    nodes.push({ init: 0, edges: [] });
                }
                return idMap[h];
            };
            getId(0, 0);

            for (let i = 0; i <= N; ++i) {
                for (let j = 0; j <= K; ++j) {
                    if (!hasId(i, j)) continue;
                    const id = getId(i, j);
                    for (const monster of spawns) {
                        const ni = i + monster.strength, nj = j + 1;
                        if (ni > N || nj > K) {
                            nodes[id].init += monster.rate;
                            continue;
                        }
                        nodes[id].edges.push({
                            to: getId(ni, nj),
                            hrid: monster.hrid,
                        });
                    }
                }
            }
            return nodes;
        }
        #normalWaveCF(spawnInfo, monsterDrops) {
            const spawns = spawnInfo.spawns;
            const cfs = {};
            for (const monster of spawns) {
                cfs[monster.hrid] = this.#monsterCF(monsterDrops[monster.hrid]);
            }
            const transGraph = this.#getSpawnTransGraph(spawnInfo);
            return (samples, scale) => {
                const cfTab = {};
                for (const monster of spawns) {
                    const z = cfs[monster.hrid](samples, scale);
                    ComplexVector.mulReEq(z, monster.rate);
                    cfTab[monster.hrid] = z;
                }
                const val = Array(transGraph.length);
                for (let u = transGraph.length - 1; u >= 0; --u) {
                    val[u] = ComplexVector.constantRe(samples, transGraph[u].init);
                    for (const e of transGraph[u].edges) {
                        ComplexVector.addMulEq(val[u], val[e.to], cfTab[e.hrid]);
                    }
                }
                return val[0];
            };
        }
        battleCF(dropData) {
            if (Config.battleDropAnalyzer.verbose) out("DropData:", dropData)
            const normalCF = this.#normalWaveCF(dropData.spawnInfo, dropData.monsterDrops);
            const bossCF = CharaFunc.mulList(
                Object.values(dropData.bossDrops).map(m => this.#monsterCF(m)));
            return CharaFunc.mul(
                CharaFunc.pow(normalCF, dropData.normalCount),
                CharaFunc.pow(bossCF, dropData.bossCount)
            );
        }

        battleCDF(dropData) {
            const start = new Date().getTime();
            const samples = Config.battleDropAnalyzer.samples;
            const minLimit = Config.battleDropAnalyzer.minLimit;
            const perWaveLimit = Config.battleDropAnalyzer.perWaveLimit;
            const cf = BattleDropAnalyzer.battleCF(dropData);
            const limit = Math.max(minLimit, perWaveLimit * (dropData.bossCount + dropData.normalCount));
            let cdf = CharaFunc.getCDF(cf, samples, limit);

            const end = new Date().getTime();
            if (Config.battleDropAnalyzer.verbose) out(`${end - start}ms`);
            return cdf;
        }
    };

    const ChestDropAnalyzer = new class { };

    const EnhanceAnalyzer = new class { };

    const TaskAnalyzer = new class { };

    //#endregion

    //#region ui

    const Ui = new class {
        elem(tagName, options = null, child = null) {
            const elem = document.createElement(tagName);
            if (typeof options === 'object') {
                Object.entries(options ?? {}).forEach(([key, value]) => {
                    if (key === 'style' && typeof value === 'object') {
                        Object.entries(value ?? {}).forEach(([k, v]) => { elem.style[k] = v; });
                    } else elem[key] = value;
                });
            } else elem.className = options;
            if (typeof child === 'object') {
                (child ?? []).forEach(child => { elem.appendChild(child); });
            } else elem.innerHTML = child;
            return elem;
        }

        div(options = null, childList = null) {
            return this.elem('div', options, childList);
        }
    };

    const Tooltip = new class {
        root = null;
        tooltip = null;

        constructor() { this.init(); }
        init() {
            const rootClass = 'link-tooltip MuiPopper-root MuiTooltip-popper css-112l0a2';
            const tooltipClass = 'MuiTooltip-tooltip MuiTooltip-tooltipPlacementBottom css-1spb1s5';
            this.root = Ui.elem('div', { className: rootClass, style: { zIndex: 100000 } },
                [this.tooltip = Ui.elem('div', tooltipClass)]
            );
            document.body.appendChild(this.root);
            this.hide();
        }

        // align = 'left' / 'center'
        attach(target, content, align = 'left') {
            target.addEventListener('mouseover', (e) => {
                this.show(content.outerHTML, target, align);
            });
            target.addEventListener('mouseout', () => {
                this.hide();
            });
        }
        show(innerHTML, target = null, align = 'left') {
            const gap = 2;
            this.root.style.display = 'block';
            this.root.style.left = 0;
            this.root.style.top = 0;
            this.tooltip.innerHTML = innerHTML;
            if (target) {
                const targetRect = target.getBoundingClientRect();
                const tooltipRootRect = this.root.getBoundingClientRect();
                const tooltipRect = this.tooltip.getBoundingClientRect();
                let left = targetRect.left;
                if (align === 'center') left -= (tooltipRect.width - targetRect.width) / 2;
                let top = targetRect.bottom + gap;
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight + window.scrollY;
                if (left + tooltipRect.width > windowWidth) left = windowWidth - tooltipRect.width;
                if (left < 0) left = 0;
                if (top + tooltipRect.height > windowHeight) top = targetRect.top - tooltipRect.height - gap;
                this.root.style.left = `${left - (tooltipRootRect.width - tooltipRect.width) / 2}px`;
                this.root.style.top = `${top - (tooltipRootRect.height - tooltipRect.height) / 2}px`;
            }
        }
        hide() { this.root.style.display = 'none'; }

        description(title, content) {
            const childList = title !== null ? [
                Ui.elem('div', 'GuideTooltip_title__1QDN9', title),
                Ui.elem('div', 'GuideTooltip_content__1_yqJ', [
                    Ui.elem('div', 'GuideTooltip_paragraph__18Zcq', content)
                ]),
            ] : [
                Ui.elem('div', 'GuideTooltip_paragraph__18Zcq', content)
            ];
            return Ui.elem('div', 'GuideTooltip_guideTooltipText__PhA_Q', childList);
        }
        item(hrid, count) {
            const ask = Market.getPriceByHrid(hrid, 'ask');
            const bid = Market.getPriceByHrid(hrid, 'bid');
            const formatPrice = x => Utils.formatPrice(x, 1);
            return Ui.elem('div', 'ItemTooltipText_itemTooltipText__zFq3A', [
                Ui.elem('div', 'ItemTooltipText_name__2JAHA', Translation.hridToZH(hrid)),
                Ui.elem('div', null, `数量: ${Utils.formatNumber(count)}`),
                Ui.elem('div', { style: { color: '#804600' } },
                    `日均价: ${formatPrice(ask)} / ${formatPrice(bid)} (${formatPrice(ask * count)} / ${formatPrice(bid * count)})`
                ),
            ]);
        }
    }

    class Popup {
        root = null;
        open() {
            if (this.root) this.close();
            this.construct();
            document.body.append(this.root);
        }
        close() {
            if (!this.root) return;
            document.body.removeChild(this.root);
            this.root = null;
        }
    };

    class TabbedPopup extends Popup {
        btnContainer = null;
        btns = null;

        pageContainer = null;
        pageContents = null;
        pages = null;
        generators = null;

        pageTitle = null;
        pageTitleText = null;
        pageTitles = null;

        construct() {
            this.btnContainer = Ui.div('lll_tab_btnContainer');
            this.btns = [];
            this.pageTitleText = Ui.div('lll_tab_pageTitleText');
            this.pageContents = [];
            this.pages = [];
            this.generators = [];
            this.pageTitle = Ui.div('lll_tab_pageTitle', [this.pageTitleText]);
            this.pageContainer = Ui.div('lll_tab_pageContainer', [this.pageTitle]);
            this.pageTitles = [];
            const closeBtn = Ui.elem('button', 'lll_tab_btnClose', '×');
            closeBtn.onclick = () => { this.close(); };
            this.root = Ui.div('lll_popup_root', [closeBtn, this.btnContainer, this.pageContainer]);
        }
        switchTab(id) {
            for (let i = 0; i < this.pages.length; ++i) {
                this.pages[i].className = i === id ? 'lll_tab_page active' : 'lll_tab_page';
                this.btns[i].className = i === id ? 'lll_tab_btn active' : 'lll_tab_btn';
            }
            const currentPage = this.pageContents[id];
            if (currentPage.lastChild) {
                currentPage.removeChild(currentPage.lastChild);
            }
            currentPage.appendChild(this.generators[id]());
            if (this.pageTitles[id] !== null) {
                this.pageTitleText.textContent = this.pageTitles[id];
                this.pageTitle.style.display = 'block';
            } else this.pageTitle.style.display = 'none';
        }
        addTab(text, content, title = null) {
            const id = this.pages.length;
            const contentGen = typeof content === 'function' ? content : (() => content);
            this.generators.push(contentGen);

            const btn = Ui.div('lll_tab_btn', text);
            btn.onclick = () => { this.switchTab(id); };
            this.btns.push(btn);
            this.btnContainer.appendChild(btn);

            const pageContent = Ui.div(title === null ? 'lll_tab_pageContent' : 'lll_tab_pageContent withTitle');
            this.pageContents.push(pageContent);
            const page = Ui.div('lll_tab_page', [pageContent]);
            this.pages.push(page);
            this.pageContainer.appendChild(page);
            this.pageTitles.push(title);
            if (id === 0) this.switchTab(id);
        }
    };

    const BattleDropAnalyzerUi = new class {
        // statisticsButton = null;
        popup = new TabbedPopup();
        contentDiv = null;

        itemSortOrderDict = {
            'totalBid': {
                desc: '总价值（卖）',
                weight: item => Market.getPriceByHrid(item.itemHrid) * item.count,
            },
            'unitBid': {
                desc: '单位价值（卖）',
                weight: item => Market.getPriceByHrid(item.itemHrid),
            }
        }

        constructor() {
            Chart.Tooltip.positioners.myCustomPositioner = function (elements, eventPosition) {
                let x = 0, y = 0, count = 0;
                for (let e of elements) {
                    const datasets = eventPosition.chart?.data?.datasets;
                    if (datasets) this._datasets = datasets;
                    if (this._datasets[e.datasetIndex].tag != "cdf") continue;
                    x += e.element.x; y += e.element.y; ++count;
                }
                if (count == 0) return false;
                if (count > 0) { x /= count; y /= count; }
                else { x = eventPosition.x; y = eventPosition.y; }
                return { x: x, y: y };
            };
            Chart.Interaction.modes.myCustomMode = function (chart, e, options) {
                let items = [];
                for (let datasetIndex = 0; datasetIndex < chart.data.datasets.length; datasetIndex++) {
                    if (chart.data.datasets[datasetIndex].tag == "aux") continue;

                    let meta = chart.getDatasetMeta(datasetIndex);
                    if (meta.hidden ?? chart.data.datasets[datasetIndex].hidden) continue;

                    let xScale = chart.scales[meta.xAxisID];
                    let yScale = chart.scales[meta.yAxisID];
                    let xValue = xScale.getValueForPixel(e.x);
                    if (xValue > xScale.max || xValue < xScale.min) continue;

                    let data = chart.data.datasets[datasetIndex].data;
                    let index = data.findIndex(o => o.x >= xValue);
                    if (index === -1) continue;

                    // linear interpolate value
                    let prev = data[index - 1], next = data[index];
                    let interpolatedValue = NaN;
                    if (prev && next) {
                        let slope = (next.y - prev.y) / (next.x - prev.x);
                        interpolatedValue = prev.y + (xValue - prev.x) * slope;
                    }
                    if (isNaN(interpolatedValue)) continue;
                    let yPosition = yScale.getPixelForValue(interpolatedValue);
                    if (isNaN(yPosition)) continue;

                    // create a 'fake' event point
                    let fakePoint = {
                        hasValue: function () { return true; },
                        tooltipPosition: function () { return this._model },
                        value: { x: xValue, y: interpolatedValue },
                        skip: false,
                        stop: false,
                        x: e.x,
                        y: yPosition
                    }
                    items.push({ datasetIndex: datasetIndex, element: fakePoint, index: 0 });
                }
                return items;
            };
        }

        newSeperator(margin = 0, styles = null) {
            let div = document.createElement('div');
            div.style.margin = margin;
            div.style.borderTop = '1px solid #98a7e9';
            if (styles) {
                for (let [key, value] of Object.entries(styles)) {
                    div.style.setProperty(key, value);
                }
            }
            return div;
        }

        newButton(text) {
            let button = document.createElement('button');
            button.textContent = text;
            button.className = 'Button_button__1Fe9z';
            button.style.height = 'auto';
            button.style.position = 'sticky';
            button.style.bottom = '0';
            button.style.margin = isMobile ? '0 4px 0 4px' : '5px 5px 0 5px';
            // button.style.backgroundColor = '#4357af';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.padding = isMobile ? '4px 8px' : '10px 20px';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';
            button.style.fontSize = isMobile ? '10px' : '14px';
            return button;
        }

        newLabel(text, styles = null) {
            let p = document.createElement('div');
            p.style.color = '#ffffff';
            p.style.fontSize = isMobile ? '12px' : '15px';
            p.style.margin = 'auto';
            p.style.textAlign = 'center';
            if (styles) {
                for (let [key, value] of Object.entries(styles)) {
                    p.style.setProperty(key, value);
                }
            }
            p.innerHTML = text;
            return p;
        }

        constructOverviewPanel() {
            const coloredText = (color, text) => {
                const h = color * 0.34;
                const s = 1 - color * 0.35;
                const v = 1 - color * 0.25;
                let p = document.createElement('div');
                p.style.color = Utils.HSVtoRGB(h, s, v).rgb;
                p.style.fontWeight = 'bold';
                p.innerHTML = text;
                return p;
            };
            const itemStyle = (rarity) => {
                if (rarity == 6) return `color:rgb(100, 219, 255); text-shadow: 0 0 2px rgb(12, 59, 110), 0 0 3px rgb(64, 201, 236), 0 0 5px rgb(145, 231, 253);`;
                else if (rarity == 5) return `color: #ff8888; text-shadow: 0 0 1px #800000, 0 0 2px #ff0000;`;
                else if (rarity == 4) return `color:rgb(255, 168, 68);`;
                else if (rarity == 3) return `color:rgb(229, 134, 255);`;
                else if (rarity == 2) return `color:rgb(169, 213, 255);`;
                else if (rarity == 1) return `color:rgb(185, 241, 190);`;
                else if (rarity == 0) return `color:rgb(255, 255, 255);`;
                return `color:rgb(180, 180, 180);`;
            };
            const itemText = (hrid, rarity, count) => {
                // 创建图标
                let svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svgIcon.setAttribute('width', isMobile ? '12' : '20');
                svgIcon.setAttribute('height', isMobile ? '12' : '20');
                svgIcon.style.marginRight = '3px';
                svgIcon.style.verticalAlign = 'middle';

                let useElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                let item_icon_url = document.querySelector("div[class^='Item_itemContainer'] use")?.getAttribute("href")?.split("#")[0];
                // let item_icon_url = '/static/media/items_sprite.6d12eb9d.svg';
                // dbg(item_icon_url);
                useElement.setAttribute('href', `${item_icon_url}#${hrid.split('/').pop()}`);
                svgIcon.appendChild(useElement);

                let itemDiv = Ui.div('lll_battleDropAnal_item', `
                    <span style="color: white; margin-right: 3px; text-align: center; font-size: ${isMobile ? '10px' : '16px'}; line-height: 1.2;">
                        ${Utils.formatPrice(count)}
                    </span>
					${svgIcon.outerHTML}
					<span style="${itemStyle(rarity)} white-space: nowrap; font-size: ${isMobile ? '10px' : '16px'}; line-height: 1.2;">
                        ${Translation.hridToZH(hrid)}
                    </span>
				`)
                Tooltip.attach(itemDiv, Tooltip.item(hrid, count));
                return itemDiv;
            };
            const foodConsumption = (player) => {
                const foodData = JSON.parse(localStorage.getItem('Edible_Tools') ?? '{}')
                    .Combat_Data?.Combat_Player_Data?.[player]?.Food_Data?.Statistics;
                if (!foodData || !foodData.Time) {
                    let totalFoodPrice = 0;
                    const playerFood = BattleData.playerFood[player];
                    for (let itemName in playerFood.food) {
                        const foodPrice = Market.getPrice(itemName, 'ask') || 500;
                        const itemNameLower = itemName.toLowerCase();
                        let consumptionRate = 0;
                        if (itemNameLower.endsWith('coffee')) {
                            consumptionRate = 300 / (1 + (playerFood.drinkConcentration || 0));
                        } else if (itemNameLower.endsWith('donut') || itemNameLower.endsWith('cake')) {
                            consumptionRate = 60;
                        } else if (itemNameLower.endsWith('gummy') || itemNameLower.endsWith('yogurt')) {
                            consumptionRate = 60;
                        }
                        totalFoodPrice += foodPrice / consumptionRate;
                    }
                    return { isSteady: false, price: totalFoodPrice };
                }
                dbg("foodData from Edible_Tools", foodData);
                let totalFoodPrice = 0;
                for (let [itemHrid, count] of Object.entries(foodData.Food)) {
                    const foodPrice = Market.getPriceByHrid(itemHrid, 'ask') || 500;
                    totalFoodPrice += foodPrice * count;
                }
                return { isSteady: true, price: totalFoodPrice / foodData.Time };
            };

            let panel = document.createElement('div');

            let contentDiv = document.createElement('div');
            contentDiv.style.display = 'flex';
            contentDiv.style.gap = '15px';
            panel.appendChild(contentDiv);
            for (let player of BattleData.playerList) {
                let playerDiv = Ui.div('lll_battleDropAnal_playerDrop');
                contentDiv.appendChild(playerDiv);

                let playerName = document.createElement('h3');
                playerName.style.color = 'white';
                playerName.style.margin = isMobile ? '0 0 5px 0' : '0 0 10px 0';
                playerName.style.textAlign = 'center';
                playerName.style.fontSize = isMobile ? '12px' : '20px';
                playerName.innerHTML = player;
                playerDiv.appendChild(playerName);

                let innerText = document.createElement("div");
                innerText.style.fontSize = isMobile ? '10px' : '16px';
                playerDiv.appendChild(innerText);

                const dropData = BattleData.getCurrentDropData(player);
                const income = BattleData.playerLoot[player].price;
                if (income <= 0 || BattleData.playerList.length > 3) continue;
                const incomeExpectation = BattleDropAnalyzer.dropExpectation(dropData);
                const incomeVariance = BattleDropAnalyzer.dropVariance(dropData);
                const dailyIncome = 86400 * income / BattleData.duration;
                const dailyIncomeExpectation = 86400 * incomeExpectation / BattleData.duration;
                const dailyIncomeVariance = 86400 * incomeVariance / BattleData.duration;
                const luck = BattleDropAnalyzer.battleCDF(dropData).cdf(income);
                const isBeatAvg = income > incomeExpectation;

                innerText.appendChild(coloredText(luck, `总计价值: ${Utils.formatPrice(income)}`));
                innerText.appendChild(coloredText(luck, `每天收入: ${Utils.formatPrice(dailyIncome)}/d`));
                innerText.appendChild(coloredText(luck, `当前运气: ${(luck * 100).toFixed(2)}%`));
                innerText.appendChild(Ui.div('lll_seperator'));
                innerText.appendChild(coloredText(isBeatAvg, `期望产值: ${Utils.formatPrice(incomeExpectation)}`));
                innerText.appendChild(coloredText(isBeatAvg, `&emsp;标准差: ${Utils.formatPrice(Math.sqrt(incomeVariance))}`));
                innerText.appendChild(coloredText(isBeatAvg, `期望日入: ${Utils.formatPrice(dailyIncomeExpectation)}/d`));
                innerText.appendChild(coloredText(isBeatAvg, `&emsp;标准差: ${Utils.formatPrice(Math.sqrt(dailyIncomeVariance))}`));

                const food = foodConsumption(player);
                const dailyProfitExpectation = dailyIncomeExpectation - 86400 * food.price;
                innerText.appendChild(coloredText(isBeatAvg, `期望日利: ${food.isSteady ? '' : '≥'}${Utils.formatPrice(dailyProfitExpectation)}/d`));
                innerText.appendChild(Ui.div('lll_seperator'));

                // 计算经验
                let maxSkill = null, maxXp = 0;
                if (BattleData.playerStat[player]?.skillExp) {
                    for (let skill in BattleData.playerStat[player].skillExp) {
                        let xp = BattleData.playerStat[player].skillExp[skill];
                        if (xp > maxXp) {
                            maxXp = xp;
                            maxSkill = skill;
                        }
                    }
                }
                const xpName = Translation.skillToZH(maxSkill);
                const xpPerHour = Utils.formatPrice((60 * 60 * maxXp) / BattleData.duration);
                let expText = document.createElement('div');
                expText.style.color = '#ffc107';
                expText.style.fontWeight = 'bold';
                expText.style.textAlign = 'center';
                expText.style.margin = '0 0 10px 0';
                expText.innerHTML = `${xpName}经验: ${xpPerHour}/h`
                innerText.appendChild(expText);

                let itemsDiv = Ui.div({ style: 'gap: 8px; display: flex; flex-direction: column;' });
                innerText.appendChild(itemsDiv);

                const order = this.itemSortOrderDict[Config.battleDropAnalyzerUi.overviewItemSortOrder].weight;
                const dropItems = Object.values(BattleData.playerLoot[player].items).sort(
                    (a, b) => order(b) - order(a)
                );
                let itemCount = 0;
                for (let item of dropItems) {
                    const hrid = item.itemHrid;
                    const rarity = BattleData.itemRarity[hrid];
                    if (rarity < Config.battleDropAnalyzerUi.overviewItemMinRarity) continue;
                    itemsDiv.appendChild(itemText(hrid, rarity, item.count));
                    if (++itemCount >= Config.battleDropAnalyzerUi.overviewItemMaxNumber) break;
                }
                if (!itemsDiv.lastChild) {
                    const runCount = BattleData.runCount - 1;
                    if (runCount >= 1000) {
                        let info = `打了 ${runCount} 次<br>什么都没掉!`;
                        let text = this.newLabel(info);
                        text.style.textAlign = 'center';
                        text.style.color = 'rgb(252, 255, 188)';
                        text.style.margin = isMobile ? '0 0 5px 0' : '0 0 10px 0';
                        text.style.textShadow = '0 0 1px rgb(167, 164, 0), 0 0 2px rgb(246, 255, 117), 0 0 3px rgb(251, 255, 201)';
                        itemsDiv.appendChild(text);
                    } else if (runCount >= 400) {
                        let info = `打了 ${runCount} 次<br>什么都没掉...`;
                        let text = this.newLabel(info);
                        text.style.textAlign = 'center';
                        text.style.color = 'rgb(180, 180, 180)';
                        text.style.margin = isMobile ? '0 0 5px 0' : '0 0 10px 0';
                        itemsDiv.appendChild(text);
                    }
                }
            }
            return panel;
        }

        constructDetailsPanel() {
            let panel = document.createElement('div');

            // 创建图表
            let canvasDiv = document.createElement('div');
            panel.appendChild(canvasDiv);
            canvasDiv.style.minWidth = '600px';
            canvasDiv.style.minHeight = '400px';
            let canvas = document.createElement('canvas');
            canvas.width = '600';
            canvas.height = '400';
            canvasDiv.appendChild(canvas);
            this.renderDetailsChart(canvas);

            // 分割线
            if (!isMobile) panel.appendChild(this.newSeperator('5px 0 0 0'));

            // 按钮区域
            let buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'space-between';
            buttonContainer.style.paddingTop = '10px';
            panel.appendChild(buttonContainer);

            // 切换到 Overview 页面
            let overviewButton = this.newButton('概览');
            overviewButton.onclick = () => {
                this.contentDiv.removeChild(panel);
                this.constructOverviewPanel();
            };
            buttonContainer.appendChild(overviewButton);

            // 添加关闭按钮
            let closeButton = this.newButton('关闭');
            closeButton.onclick = () => { this.popup.close(); };
            buttonContainer.appendChild(closeButton);

            // 添加自定义按钮
            let customButton = this.newButton('全图收益分布');
            customButton.onclick = () => {
                this.contentDiv.removeChild(panel);
                this.constructCustomPanel();
            };
            buttonContainer.appendChild(customButton);

            return panel;
        }

        constructSettingsPanel() {
            let panel = document.createElement('div');

            let contentDiv = document.createElement('div');
            panel.appendChild(contentDiv);
            /***** 设置内容 *****/

            let itemSortOrderDiv = document.createElement('div');
            itemSortOrderDiv.style.padding = '10px 0';
            itemSortOrderDiv.style.gap = '15px';
            itemSortOrderDiv.style.display = 'flex';
            itemSortOrderDiv.style.justifyContent = 'center';
            contentDiv.appendChild(itemSortOrderDiv);
            itemSortOrderDiv.appendChild(this.newLabel('掉落物排序方式', { margin: 'auto 0' }));
            let itemSortOrderSelect = document.createElement('select');
            itemSortOrderSelect.style.padding = isMobile ? '2px 10px 2px 2px' : '5px 10px 5px 5px';
            itemSortOrderSelect.style.margin = 'auto 0';
            itemSortOrderSelect.style.border = '1px solid #ced4da';
            itemSortOrderSelect.style.borderRadius = '5px';
            for (let [key, order] of Object.entries(this.itemSortOrderDict)) {
                let option = new Option(order.desc, key);
                if (key === Config.battleDropAnalyzerUi.overviewItemSortOrder) option.selected = true;
                itemSortOrderSelect.options.add(option);
            }
            itemSortOrderDiv.appendChild(itemSortOrderSelect);
            itemSortOrderSelect.onchange = () => {
                const order = itemSortOrderSelect.options[itemSortOrderSelect.selectedIndex].value;
                Config.battleDropAnalyzerUi.overviewItemSortOrder = order;
                LocalStorageData.set('config', Config);
            };

            let itemMaxNumDiv = document.createElement('div');
            itemMaxNumDiv.style.padding = '10px 0';
            itemMaxNumDiv.style.gap = '15px';
            itemMaxNumDiv.style.display = 'flex';
            itemMaxNumDiv.style.justifyContent = 'center';
            contentDiv.appendChild(itemMaxNumDiv);
            itemMaxNumDiv.appendChild(this.newLabel('掉落物最大显示数量', { margin: 'auto 0' }));
            let itemMaxNumInput = document.createElement('input');
            itemMaxNumInput.type = 'number';
            itemMaxNumInput.min = 1;
            itemMaxNumInput.max = 20;
            itemMaxNumInput.step = 1;
            itemMaxNumInput.style.padding = isMobile ? '2px 10px 2px 2px' : '5px 10px 5px 5px';
            itemMaxNumInput.style.margin = 'auto 0';
            itemMaxNumInput.style.border = '1px solid #ced4da';
            itemMaxNumInput.style.borderRadius = '5px';
            itemMaxNumInput.value = Config.battleDropAnalyzerUi.overviewItemMaxNumber;
            itemMaxNumDiv.appendChild(itemMaxNumInput);
            itemMaxNumInput.onchange = () => {
                let val = Math.round(itemMaxNumInput.value);
                val = Math.min(Math.max(val, 1), 20);
                itemMaxNumInput.value = val;
                Config.battleDropAnalyzerUi.overviewItemMaxNumber = val;
                LocalStorageData.set('config', Config);
            };

            let itemMinRarityDiv = document.createElement('div');
            itemMinRarityDiv.style.padding = '10px 0';
            itemMinRarityDiv.style.gap = '15px';
            itemMinRarityDiv.style.display = 'flex';
            itemMinRarityDiv.style.justifyContent = 'center';
            contentDiv.appendChild(itemMinRarityDiv);
            itemMinRarityDiv.appendChild(this.newLabel('显示普通掉落物', { margin: 'auto 0' }));
            let itemMinRarityInput = document.createElement('input');
            itemMinRarityInput.type = 'checkbox';
            itemMinRarityInput.checked = Config.battleDropAnalyzerUi.overviewItemMinRarity === -1;
            itemMinRarityDiv.appendChild(itemMinRarityInput);
            itemMinRarityInput.onchange = () => {
                let val = itemMinRarityInput.checked ? -1 : 0;
                Config.battleDropAnalyzerUi.overviewItemMinRarity = val;
                LocalStorageData.set('config', Config);
            };

            contentDiv.appendChild(this.newSeperator(isMobile ? 0 : '5px 0 0 0', { 'border-top': '1px solid rgba(152, 167, 233, 0.5)' }));

            let samplesCountDiv = document.createElement('div');
            samplesCountDiv.style.padding = '10px 0';
            samplesCountDiv.style.gap = '15px';
            samplesCountDiv.style.display = 'flex';
            samplesCountDiv.style.justifyContent = 'center';
            contentDiv.appendChild(samplesCountDiv);
            const samplesCountLabel = this.newLabel('采样数', { margin: 'auto 0' });
            samplesCountDiv.appendChild(samplesCountLabel);
            Tooltip.attach(samplesCountLabel, Tooltip.description(null, '采样数越大，运气计算越精确、速度越慢'), 'center');
            let samplesCountInput = document.createElement('input');
            samplesCountInput.type = 'range';
            samplesCountInput.min = 6; // 64 = 2^6
            samplesCountInput.max = 16; // 65536 = 2^16
            samplesCountInput.step = 1;
            samplesCountInput.value = Math.round(Math.log2(Config.battleDropAnalyzer.samples));
            samplesCountDiv.appendChild(samplesCountInput);
            let samplesCountText = this.newLabel(Config.battleDropAnalyzer.samples);
            samplesCountText.style.margin = 'auto 0';
            samplesCountText.style.minWidth = '45px';
            samplesCountDiv.appendChild(samplesCountText);
            samplesCountInput.oninput = () => {
                const samples = Math.pow(2, samplesCountInput.value);
                samplesCountText.innerHTML = samples;
            };
            samplesCountInput.onchange = () => {
                const samples = Math.pow(2, samplesCountInput.value);
                samplesCountText.innerHTML = samples;
                Config.battleDropAnalyzer.samples = samples;
                LocalStorageData.set('config', Config);
            };

            let interpolateCountDiv = document.createElement('div');
            interpolateCountDiv.style.padding = '10px 0';
            interpolateCountDiv.style.gap = '15px';
            interpolateCountDiv.style.display = 'flex';
            interpolateCountDiv.style.justifyContent = 'center';
            contentDiv.appendChild(interpolateCountDiv);
            const interpolateCountLabel = this.newLabel('图表关键点数', { margin: 'auto 0' });
            interpolateCountDiv.appendChild(interpolateCountLabel);
            Tooltip.attach(interpolateCountLabel, Tooltip.description(null, '关键点越多，图表绘制越精细'), 'center');
            let interpolateCountInput = document.createElement('input');
            interpolateCountInput.type = 'range';
            interpolateCountInput.min = 6; // 64 = 2^6
            interpolateCountInput.max = 12; // 4096 = 2^12
            interpolateCountInput.step = 1;
            interpolateCountInput.value = Math.round(Math.log2(Config.battleDropAnalyzerUi.chartInterpolatePoints));
            interpolateCountDiv.appendChild(interpolateCountInput);
            let interpolateCountText = this.newLabel(Config.battleDropAnalyzerUi.chartInterpolatePoints);
            interpolateCountText.style.margin = 'auto 0';
            interpolateCountText.style.minWidth = '35px';
            interpolateCountDiv.appendChild(interpolateCountText);
            interpolateCountInput.oninput = () => {
                const samples = Math.pow(2, interpolateCountInput.value);
                interpolateCountText.innerHTML = samples;
            };
            interpolateCountInput.onchange = () => {
                const samples = Math.pow(2, interpolateCountInput.value);
                interpolateCountText.innerHTML = samples;
                Config.battleDropAnalyzerUi.chartInterpolatePoints = samples;
                LocalStorageData.set('config', Config);
            };

            let updateMarketDiv = document.createElement('div');
            updateMarketDiv.style.padding = '10px 0';
            updateMarketDiv.style.gap = '15px';
            updateMarketDiv.style.display = 'flex';
            updateMarketDiv.style.justifyContent = 'center';
            contentDiv.appendChild(updateMarketDiv);
            let updateMarketInfo = this.newLabel(`上次更新时间: ${new Date(Market.marketData.time * 1000).toLocaleString()}`);
            let updateMarketBtn = this.newButton('更新市场价格');
            updateMarketBtn.onclick = () => {
                updateMarketInfo.style.minWidth = getComputedStyle(updateMarketInfo).width;
                updateMarketInfo.innerHTML = '更新中...';
                Market.update(() => {
                    updateMarketInfo.innerHTML = `更新完成: ${new Date(Market.marketData.time * 1000).toLocaleString()}`;
                });
            };
            updateMarketDiv.appendChild(updateMarketBtn);
            updateMarketDiv.appendChild(updateMarketInfo);

            /***** 设置内容 *****/

            // 分割线
            panel.appendChild(this.newSeperator(isMobile ? 0 : '5px 0 0 0'));

            // 按钮区域
            let buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'space-between';
            buttonContainer.style.paddingTop = '10px';
            panel.appendChild(buttonContainer);

            // 添加关闭按钮
            let closeButton = this.newButton('关闭');
            closeButton.onclick = () => { this.popup.close(); };
            buttonContainer.appendChild(closeButton);

            // 返回到 Overview 页面
            let customButton = this.newButton('返回');
            customButton.onclick = () => {
                this.contentDiv.removeChild(panel);
                this.constructOverviewPanel();
            };
            buttonContainer.appendChild(customButton);

            return panel;
        }

        constructCustomPanel() {
            const defaultPlayer = CharacterData.playerName;
            const defaultMap = BattleData.currentMapId;
            const defaultRunCount = BattleData.runCount;

            const maxRunCount = Config.battleDropAnalyzerUi.customPanelMaxRunCount;
            const maxSliderValue = Config.battleDropAnalyzerUi.customPanelMaxSliderValue;
            const renderChart = () => {
                const playerName = defaultPlayer;
                const mapHrid = mapSelect.options[mapSelect.selectedIndex].value;
                const runCount = parseInt(runCountText.innerHTML) + 1;
                while (canvasDiv.lastChild) canvasDiv.removeChild(canvasDiv.lastChild);
                let canvas = document.createElement('canvas');
                canvasDiv.appendChild(canvas);
                canvas.width = Math.max(canvas.width, 600);
                canvas.height = canvas.width * 2 / 3;
                this.renderCustomChart(canvas, mapHrid, runCount, playerName);
            }

            let panel = document.createElement('div');

            let contentDiv = document.createElement('div');
            panel.appendChild(contentDiv);

            // 设置
            let configDiv = document.createElement('div');
            configDiv.style.padding = '5px 0';
            configDiv.style.gap = '15px';
            configDiv.style.display = 'flex';
            configDiv.style.justifyContent = 'space-around';
            panel.appendChild(configDiv);

            let mapSelectorDiv = document.createElement('div');
            mapSelectorDiv.style.display = 'flex';
            mapSelectorDiv.style.gap = '5px';
            configDiv.appendChild(mapSelectorDiv);
            mapSelectorDiv.appendChild(this.newLabel('地图'));
            let mapSelect = document.createElement('select');
            mapSelect.style.padding = isMobile ? '2px 10px 2px 2px' : '5px 10px 5px 5px';
            mapSelect.style.margin = '1px';
            mapSelect.style.border = '1px solid #ced4da';
            mapSelect.style.borderRadius = '5px';
            mapSelectorDiv.appendChild(mapSelect);
            for (let [mapHrid, data] of Object.entries(BattleData.mapData).sort(
                (a, b) => a[1].info.order - b[1].info.order
            )) {
                if (!Config.battleDropAnalyzerUi.customPanelShowSolo && data.info.type == 'solo') continue;
                const text = Translation.hridToZH(mapHrid);
                let option = new Option(text, mapHrid);
                if (defaultMap === mapHrid) option.selected = true;
                mapSelect.options.add(option);
            }
            mapSelect.onchange = renderChart;

            let runCountInputDiv = document.createElement('div');
            runCountInputDiv.style.display = 'flex';
            runCountInputDiv.style.gap = '5px';
            configDiv.appendChild(runCountInputDiv);
            runCountInputDiv.appendChild(this.newLabel('战斗次数'));
            const getRunCount = (val, inv = 1) => {
                const A = maxSliderValue * maxRunCount / (maxRunCount - maxSliderValue);
                const x = parseInt(val);
                return Math.round(A * x / (A - x * inv));
            };
            let runCountInput = document.createElement('input');
            runCountInput.type = 'range';
            runCountInput.min = 1;
            runCountInput.max = maxSliderValue;
            runCountInput.step = 1;
            runCountInput.value = getRunCount(defaultRunCount, -1);
            runCountInputDiv.appendChild(runCountInput);
            let runCountText = this.newLabel(defaultRunCount);
            runCountText.style.minWidth = '60px';
            runCountInputDiv.appendChild(runCountText);
            const setRunCountText = () => runCountText.innerHTML = getRunCount(runCountInput.value);
            if (isMobile) {
                runCountInput.oninput = setRunCountText;
                runCountInput.onchange = renderChart;
            } else runCountInput.oninput = () => {
                setRunCountText();
                renderChart();
            };

            // 图表容器
            let canvasDiv = document.createElement('div');
            panel.appendChild(canvasDiv);
            renderChart();

            // 分割线
            panel.appendChild(this.newSeperator(isMobile ? 0 : '5px 0 0 0'));

            // 按钮区域
            let buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'space-between';
            buttonContainer.style.paddingTop = '10px';
            panel.appendChild(buttonContainer);

            // 切换到 Overview 页面
            let overviewButton = this.newButton('概览');
            overviewButton.onclick = () => {
                this.contentDiv.removeChild(panel);
                this.constructOverviewPanel();
            };
            buttonContainer.appendChild(overviewButton);

            // 添加关闭按钮
            let closeButton = this.newButton('关闭');
            closeButton.onclick = () => { this.popup.close(); };
            buttonContainer.appendChild(closeButton);

            // 返回到自定义页面
            let customButton = this.newButton('返回');
            customButton.onclick = () => {
                this.contentDiv.removeChild(panel);
                this.constructDetailsPanel();
            };
            buttonContainer.appendChild(customButton);

            return panel;
        }


        // Chart renderer
        #generateDataSetCDF(f, l, r) {
            const N = Config.battleDropAnalyzerUi.chartInterpolatePoints;
            let ret = [];
            for (let i = 0; i <= N; ++i) {
                const x = i * (r - l) / N + l;
                ret.push({ x: x, y: f(x) });
            }
            return ret;
        };
        #generateDataSetPDF(f, l, r) {
            const N = Config.battleDropAnalyzerUi.chartInterpolatePoints;
            let ret = [], pre = f(l - (r - l) / N), max = 0;
            for (let i = 0; i <= N; ++i) {
                const x = i * (r - l) / N + l;
                const cur = f(x);
                ret.push({ x: x, y: cur - pre });
                max = Math.max(cur - pre, max);
                pre = cur;
            }
            for (let i = 0; i <= N; ++i) ret[i].y /= max;
            for (let i = 0; i <= N; ++i) ret[i].y = ret[i].y * 0.8 - 1;
            return ret;
        };
        renderDetailsChart(canvas) {
            // 渲染图表
            const rgbaColor = (color, a) => {
                return Utils.HSVtoRGB(color, 0.4, 1, a).rgba;
            }

            let data = {};
            let limitL = 1e18, limitR = 0;
            for (let playerOrder = 0; playerOrder < BattleData.playerList.length; ++playerOrder) {
                const player = BattleData.playerList[playerOrder];
                const dropData = BattleData.getCurrentDropData(player);
                const dist = BattleDropAnalyzer.battleCDF(dropData);
                const income = BattleData.playerLoot[player].price;

                const mu = BattleDropAnalyzer.dropExpectation(dropData);
                const sigma = Math.sqrt(BattleDropAnalyzer.dropVariance(dropData));
                const coeff = Config.battleDropAnalyzerUi.detailsChartSigmaCoeff;
                limitL = Math.max(Math.min(limitL, mu - coeff * sigma), 0);
                limitR = Math.max(limitR, mu + coeff * sigma);

                data.limit = Math.max(data.limit ?? 0, dist.limit);
                (data.cdfs ??= []).push({
                    name: player,
                    income: income,
                    color: [0, 0.2, 0.45, 0.7, 0.85][playerOrder % 5],
                    cdf: dist.cdf,
                });
            }

            const eps = Config.battleDropAnalyzerUi.detailsChartCdfEps;
            for (const player of data.cdfs) {
                limitL = Math.min(limitL, Utils.binarySearch(player.cdf, 0, data.limit, eps));
                limitR = Math.max(limitR, Utils.binarySearch(player.cdf, 0, data.limit, 1 - eps));
            }

            const generateCDF = (f, l = limitL, r = limitR) => this.#generateDataSetCDF(f, l, r);
            const generatePDF = (f, l = limitL, r = limitR) => this.#generateDataSetPDF(f, l, r);

            let datasets = [];
            for (const player of data.cdfs) {
                const display = player.name === CharacterData.playerName;
                datasets.push({
                    borderColor: rgbaColor(player.color, 1),
                    borderWidth: 2,
                    showLine: true,
                    hidden: !display,
                    label: player.name,
                    data: generateCDF(player.cdf),
                    interpolate: true,
                    pointRadius: 0,
                    tension: Config.battleDropAnalyzerUi.chartTension,
                    fill: false,
                    tag: "cdf",
                });
                datasets.push({
                    borderColor: rgbaColor(player.color, 1),
                    borderWidth: 2,
                    showLine: true,
                    hidden: !display,
                    label: player.name + "(PDF)",
                    data: generatePDF(player.cdf),
                    interpolate: true,
                    pointRadius: 0,
                    tension: Config.battleDropAnalyzerUi.chartTension,
                    fill: false,
                    tag: "pdf",
                });
                datasets.push({
                    backgroundColor: rgbaColor(player.color, 0.4),
                    borderWidth: 0,
                    showLine: true,
                    label: "",
                    data: [{ x: 0, y: 0 }, { x: player.income, y: 0 }],
                    pointRadius: 0,
                    fill: "-2",
                    tag: "aux",
                });
                datasets.push({
                    backgroundColor: rgbaColor(player.color, 0.4),
                    borderWidth: 0,
                    showLine: true,
                    label: "",
                    data: [{ x: 0, y: -1 }, { x: player.income, y: -1 }],
                    pointRadius: 0,
                    fill: "-2",
                    tag: "aux",
                });
            }


            const chart = new Chart(canvas.getContext('2d'), {
                type: "scatter",
                data: { datasets: datasets },
                options: {
                    animation: false,
                    interaction: {
                        intersect: false,
                        mode: 'myCustomMode',
                    },
                    plugins: {
                        crosshair: {
                            sync: { enabled: false },
                            zoom: { enabled: true },
                            callbacks: {
                                afterZoom: () => function (start, end) {
                                    for (let i = 0; i < data.cdfs.length; ++i) {
                                        const player = data.cdfs[i];
                                        chart.data.datasets[i * 4].data = generateCDF(player.cdf, start, end);
                                        chart.data.datasets[i * 4 + 1].data = generatePDF(player.cdf, start, end);
                                    }
                                    chart.update();
                                }
                            }
                        },
                        tooltip: {
                            enabled: true,
                            animation: false,
                            intersect: false,
                            position: 'myCustomPositioner',
                            filter: d => d.chart.data.datasets[d.datasetIndex].tag == "cdf",
                            callbacks: {
                                title: d => Utils.formatPrice(d[0].element.value.x),
                                label: d => {
                                    return d.chart.data.datasets[d.datasetIndex].label + ": " + d.element.value.y.toFixed(2);
                                }
                            }
                        },
                        legend: {
                            display: true,
                            labels: { filter: (a, d) => d.datasets[a.datasetIndex].tag == "cdf" },
                            onClick: function (e, legendItem, legend) {
                                const name = legendItem.text;
                                const index = legendItem.datasetIndex;
                                let ci = legend.chart;
                                [
                                    ci.getDatasetMeta(index),
                                    ci.getDatasetMeta(index + 1),
                                ].forEach(function (meta) {
                                    meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : !meta.hidden;
                                });
                                ci.update();
                            }
                        }
                    },
                    scales: {
                        x: {
                            min: limitL,
                            max: limitR,
                            type: 'linear',
                            title: { display: true, text: '收入' },
                            grid: { color: "rgba(255,255,255,0.15)" },
                            ticks: {
                                color: "#FFFFFF",
                                callback: (value, index, ticks) => Utils.formatPrice(value),
                            },
                            border: { color: "rgba(255,255,255,0.5)" },
                        },
                        y: {
                            min: -1,
                            max: 1,
                            title: { display: true, text: 'PDF | CDF' },
                            grid: {
                                color: function (context) {
                                    if (context.tick.value == 0 || context.tick.value == -1)
                                        return "rgba(255,255,255,0.5)";
                                    return "rgba(255,255,255,0.15)";
                                }
                            },
                            position: "left",
                            ticks: {
                                callback: (value, index, ticks) => value >= 0 ? value : "",
                            }
                        },
                    }
                },
            });
        }
        renderCustomChart(canvas, mapHrid, runCount, playerName) {
            const rgbaColor = (color, a, s = 0.4, v = 1) => {
                return Utils.HSVtoRGB(color, s, v, a).rgba;
            }

            const dropData = BattleData.getDropData(mapHrid, runCount, playerName);
            const data = BattleDropAnalyzer.battleCDF(dropData);

            const eps = Config.battleDropAnalyzerUi.customChartCdfEps;
            let limitL = Utils.binarySearch(data.cdf, 0, data.limit, eps);
            let limitR = Utils.binarySearch(data.cdf, 0, data.limit, 1 - eps);
            const median = Utils.binarySearch(data.cdf, 0, data.limit, 0.5);
            const mu = BattleDropAnalyzer.dropExpectation(dropData);
            const sigma = Math.sqrt(BattleDropAnalyzer.dropVariance(dropData));
            const coeff = Config.battleDropAnalyzerUi.customChartSigmaCoeff;
            limitL = Math.max(Math.min(limitL, mu - coeff * sigma), 0);
            limitR = Math.max(limitR, mu + coeff * sigma);

            const generateCDF = (f, l = limitL, r = limitR) => this.#generateDataSetCDF(f, l, r);
            const generatePDF = (f, l = limitL, r = limitR) => this.#generateDataSetPDF(f, l, r);
            const interpolate = (data, x) => {
                let index = data.findIndex(o => o.x >= x);
                if (index === -1) return NaN;
                let prev = data[index - 1], next = data[index];
                let y = NaN;
                if (prev && next) {
                    let slope = (next.y - prev.y) / (next.x - prev.x);
                    y = prev.y + (x - prev.x) * slope;
                }
                return y;
            }

            let datasets = [];
            datasets.push({
                borderColor: rgbaColor(0, 1),
                borderWidth: 2,
                showLine: true,
                label: "",
                data: generateCDF(data.cdf),
                interpolate: true,
                pointRadius: 0,
                tension: Config.battleDropAnalyzerUi.chartTension,
                fill: false,
                tag: "cdf",
            });
            datasets.push({
                borderColor: rgbaColor(0, 1),
                borderWidth: 2,
                showLine: true,
                label: "",
                data: generatePDF(data.cdf),
                interpolate: true,
                pointRadius: 0,
                tension: Config.battleDropAnalyzerUi.chartTension,
                fill: false,
                tag: "pdf",
            });
            datasets.push({
                borderColor: rgbaColor(0, 1, 0.25),
                borderWidth: 2,
                showLine: true,
                label: "期望",
                data: [{ x: mu, y: 0 }, { x: mu, y: interpolate(datasets[0].data, mu) }],
                pointRadius: 0,
                tag: "aux",
            });
            datasets.push({
                borderColor: rgbaColor(0, 1, 0.25),
                borderWidth: 2,
                showLine: true,
                label: "",
                data: [{ x: mu, y: -1 }, { x: mu, y: interpolate(datasets[1].data, mu) }],
                pointRadius: 0,
                tag: "aux",
            });
            datasets.push({
                backgroundColor: rgbaColor(0, 0.3, 0.3),
                borderWidth: 0,
                showLine: true,
                label: "标准差",
                data: [{ x: Math.max(0, mu - sigma), y: 0 }, { x: mu + sigma, y: 0 }],
                pointRadius: 0,
                fill: "-4",
                tag: "aux",
            });
            datasets.push({
                backgroundColor: rgbaColor(0, 0.3, 0.3),
                borderWidth: 0,
                showLine: true,
                label: "",
                data: [{ x: Math.max(0, mu - sigma), y: -1 }, { x: mu + sigma, y: -1 }],
                pointRadius: 0,
                fill: "-4",
                tag: "aux",
            });
            datasets.push({
                borderColor: rgbaColor(0.2, 1, 0.3),
                borderWidth: 2,
                showLine: true,
                label: "中位数",
                data: [{ x: median, y: 0 }, { x: median, y: interpolate(datasets[0].data, median) }],
                pointRadius: 0,
                tag: "aux",
            });
            datasets.push({
                borderColor: rgbaColor(0.2, 1, 0.3),
                borderWidth: 2,
                showLine: true,
                label: "",
                data: [{ x: median, y: -1 }, { x: median, y: interpolate(datasets[1].data, median) }],
                pointRadius: 0,
                tag: "aux",
            });

            const chart = new Chart(canvas.getContext('2d'), {
                type: "scatter",
                data: { datasets: datasets },
                options: {
                    animation: false,
                    interaction: {
                        intersect: false,
                        mode: 'myCustomMode',
                    },
                    plugins: {
                        crosshair: {
                            sync: { enabled: false },
                            zoom: { enabled: true },
                            callbacks: {
                                afterZoom: () => function (start, end) {
                                    chart.data.datasets[0].data = generateCDF(data.cdf, start, end);
                                    chart.data.datasets[1].data = generatePDF(data.cdf, start, end);
                                    chart.data.datasets[2].data = [{ x: mu, y: 0 }, { x: mu, y: interpolate(datasets[0].data, mu) }];
                                    chart.data.datasets[3].data = [{ x: mu, y: -1 }, { x: mu, y: interpolate(datasets[1].data, mu) }];
                                    chart.data.datasets[6].data = [{ x: median, y: 0 }, { x: median, y: interpolate(datasets[0].data, median) }];
                                    chart.data.datasets[7].data = [{ x: median, y: -1 }, { x: median, y: interpolate(datasets[1].data, median) }];
                                    chart.update();
                                }
                            }
                        },
                        tooltip: {
                            enabled: true,
                            animation: false,
                            intersect: false,
                            position: 'myCustomPositioner',
                            filter: d => d.chart.data.datasets[d.datasetIndex].tag == "cdf",
                            callbacks: {
                                title: d => Utils.formatPrice(d[0].element.value.x),
                                label: d => {
                                    return d.chart.data.datasets[d.datasetIndex].label + ": " + d.element.value.y.toFixed(2);
                                }
                            }
                        },
                        legend: {
                            display: true,
                            labels: { filter: (a, d) => d.datasets[a.datasetIndex].label != "" },
                            onClick: function (e, legendItem, legend) {
                                const name = legendItem.text;
                                const index = legendItem.datasetIndex;
                                let ci = legend.chart;
                                [
                                    ci.getDatasetMeta(index),
                                    ci.getDatasetMeta(index + 1),
                                ].forEach(function (meta) {
                                    meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : !meta.hidden;
                                });
                                ci.update();
                            }
                        }
                    },
                    scales: {
                        x: {
                            min: limitL,
                            max: limitR,
                            type: 'linear',
                            title: { display: true, text: '收入' },
                            grid: { color: "rgba(255,255,255,0.15)" },
                            ticks: {
                                color: "#FFFFFF",
                                callback: (value, index, ticks) => Utils.formatPrice(value),
                            },
                            border: { color: "rgba(255,255,255,0.5)" },
                        },
                        y: {
                            min: -1,
                            max: 1,
                            title: { display: true, text: 'PDF | CDF' },
                            grid: {
                                color: function (context) {
                                    if (context.tick.value == 0 || context.tick.value == -1)
                                        return "rgba(255,255,255,0.5)";
                                    return "rgba(255,255,255,0.15)";
                                }
                            },
                            position: "left",
                            ticks: {
                                callback: (value, index, ticks) => value >= 0 ? value : "",
                            }
                        },
                    }
                },
            });
        }

        showPopup() {
            // 创建标题
            this.popup.open();
            const ephTitle = `${(3600 * (BattleData.runCount - 1) / BattleData.duration).toFixed(1)} EPH`;
            this.popup.addTab('概览', () => this.constructOverviewPanel(), ephTitle);
            this.popup.addTab('详细', () => this.constructDetailsPanel(), null);
            this.popup.addTab('设置', () => this.constructSettingsPanel(), null);
        }

        addButton() {
            var tabsContainer = document.querySelector("#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div > div > div.TabsComponent_tabsContainer__3BDUp > div > div > div");
            var referenceTab = tabsContainer ? tabsContainer.children[1] : null;
            if (!tabsContainer || !referenceTab) return;
            if (tabsContainer.querySelector('.lll_btn_battleDropAnalyzer')) return;
            const baseClassName = referenceTab.className;

            // 修改食用工具前俩按钮的样式
            let foodBtn = tabsContainer.querySelector('.Button_battlePlayerFood__custom');
            foodBtn.className = baseClassName + ' lll_Button_battlePlayerFood__custom';
            let lootBtn = tabsContainer.querySelector('.Button_battlePlayerLoot__custom');
            lootBtn.className = baseClassName + ' lll_Button_battlePlayerLoot__custom';

            let button = document.createElement('div');
            button.className = baseClassName + ' lll_btn_battleDropAnalyzer';
            button.setAttribute('script_translatedfrom', 'New Action');
            button.textContent = isCN ? "统计" : "Statistics";
            button.onclick = () => { this.showPopup(); };

            // 将按钮插入到最后一个标签后面
            let lastTab = tabsContainer.children[tabsContainer.children.length - 1];
            tabsContainer.insertBefore(button, lastTab.nextSibling);
        }
    };

    const TaskAnalyzerUi = new class {

    };

    //#endregion

    //#region ingame

    const ClientData = new class {
        #data = null;
        #hrid2name = {};
        constructor() { this.get(); }
        get() {
            if (!this.#data) this.set(JSON.parse(localStorage.getItem("initClientData")));
            return this.#data;
        }
        set(val) {
            this.#data = val;
            this.#hrid2name = val.itemDetailMap;
            for (const key in this.#hrid2name) {
                if (this.#hrid2name[key] && typeof this.#hrid2name[key] === 'object' && this.#hrid2name[key].name) {
                    this.#hrid2name[key] = this.#hrid2name[key].name;
                }
            }
        }
        hrid2name(hrid) {
            return this.#hrid2name[hrid] || hrid.split('/').pop();
        }
    };

    const CharacterData = new class {
        #data = null;

        playerName = null;

        get() { return this.#data; }
        set(val) {
            this.#data = val;
            this.playerName = val.character.name;
        }
    };

    const Market = new class {
        marketData = null;
        chestDropData = {};

        specialItemPrices = { 'Coin': { ask: 1, bid: 1 } };
        chestCosts = {};

        constructor() {
            this.marketData = JSON.parse(LocalStorageData.get('marketData') || localStorage.getItem("MWITools_marketAPI_json") || "{}");
            if (!(this.marketData?.time > Date.now() / 1000 - MarketUpdateInterval * 86400)) this.update();
            else this.init();
        }

        update(afterUpdated = null) {
            out("updating market data");
            fetch(MARKET_API_URL).then(res => {
                res.json().then(data => {
                    this.marketData = data;
                    LocalStorageData.set('market', data);
                    out(`market updated:`, new Date(this.marketData.time * 1000).toLocaleString());
                    this.init();
                    afterUpdated?.();
                });
            });
        }
        init() {
            out("市场信息 (marketData)", this.marketData);
            this.#initSpecialItemPrices();
            this.#initShopData();
            this.#initChestData();
        };

        #initSpecialItemPrices() {
            this.specialItemPrices = {
                'Coin': { ask: 1, bid: 1 }, // 默认的特殊物品价值，包括 ask 和 bid 价值
                'Cowbell': {
                    ask: this.getPriceFromAPI('Bag Of 10 Cowbells', 'ask') / 10 || 21000,
                    bid: this.getPriceFromAPI('Bag Of 10 Cowbells', 'bid') / 10 || 20500
                },
                'Chimerical Token': {
                    ask: this.getPriceFromAPI('Chimerical Essence', 'ask') || 600,
                    bid: this.getPriceFromAPI('Chimerical Essence', 'bid') || 600
                },
                'Sinister Token': {
                    ask: this.getPriceFromAPI('Sinister Essence', 'ask') || 900,
                    bid: this.getPriceFromAPI('Sinister Essence', 'bid') || 900
                },
                'Enchanted Token': {
                    ask: this.getPriceFromAPI('Enchanted Essence', 'ask') || 2000,
                    bid: this.getPriceFromAPI('Enchanted Essence', 'bid') || 2000
                },
                'Pirate Token': {
                    ask: this.getPriceFromAPI('Pirate Essence', 'ask') || 4000,
                    bid: this.getPriceFromAPI('Pirate Essence', 'bid') || 4000
                },
                'Chimerical Quiver': {
                    ask: this.getPriceFromAPI('Mirror Of Protection', 'ask') || 12500000,
                    bid: this.getPriceFromAPI('Mirror Of Protection', 'bid') || 12000000
                },
                'Sinister Cape': {
                    ask: this.getPriceFromAPI('Mirror Of Protection', 'ask') || 12500000,
                    bid: this.getPriceFromAPI('Mirror Of Protection', 'bid') || 12000000
                },
                'Enchanted Cloak': {
                    ask: this.getPriceFromAPI('Mirror Of Protection', 'ask') || 12500000,
                    bid: this.getPriceFromAPI('Mirror Of Protection', 'bid') || 12000000
                },
            };

            this.chestCosts = {
                "Chimerical Chest": {
                    keyAsk: this.getPriceFromAPI('Chimerical Chest Key', 'ask') || 3000e3,
                    keyBid: this.getPriceFromAPI('Chimerical Chest Key', 'bid') || 3000e3,
                    entryAsk: this.getPriceFromAPI('Chimerical Entry Key', 'ask') || 280e3,
                    entryBid: this.getPriceFromAPI('Chimerical Entry Key', 'bid') || 280e3
                },
                "Sinister Chest": {
                    keyAsk: this.getPriceFromAPI('Sinister Chest Key', 'ask') || 5600e3,
                    keyBid: this.getPriceFromAPI('Sinister Chest Key', 'bid') || 5400e3,
                    entryAsk: this.getPriceFromAPI('Sinister Entry Key', 'ask') || 300e3,
                    entryBid: this.getPriceFromAPI('Sinister Entry Key', 'bid') || 280e3
                },
                "Enchanted Chest": {
                    keyAsk: this.getPriceFromAPI('Enchanted Chest Key', 'ask') || 7600e3,
                    keyBid: this.getPriceFromAPI('Enchanted Chest Key', 'bid') || 7200e3,
                    entryAsk: this.getPriceFromAPI('Enchanted Entry Key', 'ask') || 360e3,
                    entryBid: this.getPriceFromAPI('Enchanted Entry Key', 'bid') || 360e3
                },
                "Pirate Chest": {
                    keyAsk: this.getPriceFromAPI('Pirate Chest Key', 'ask') || 9400e3,
                    keyBid: this.getPriceFromAPI('Pirate Chest Key', 'bid') || 9200e3,
                    entryAsk: this.getPriceFromAPI('Pirate Entry Key', 'ask') || 460e3,
                    entryBid: this.getPriceFromAPI('Pirate Entry Key', 'bid') || 440e3
                }
            };
        }

        #initShopData() {
            const clientData = ClientData.get();
            const costItemValue = {};
            for (let details of Object.values(clientData.shopItemDetailMap)) {
                const { itemHrid, costs } = details;
                const itemName = ClientData.hrid2name(itemHrid);

                for (let cost of costs) {
                    const costItemName = ClientData.hrid2name(cost.itemHrid);
                    if (costItemName === "Coin") continue;

                    const costCount = cost.count;
                    costItemValue[costItemName] ??= 0;

                    // 计算每种代币购买每个物品的收益
                    let bidValue = this.getPrice(itemName, "bid");
                    let profit = bidValue / (costs.length * costCount);

                    // 更新最赚钱的物品信息
                    if (profit > costItemValue[costItemName]) {
                        costItemValue[costItemName] = profit;
                        (this.specialItemPrices[costItemName] ??= {}).ask = profit;
                        (this.specialItemPrices[costItemName] ??= {}).bid = profit;
                    }
                }
            }
        }

        #initChestData() {
            const clientData = ClientData.get();

            // 迭代计算箱子价值
            const maxIter = 20;
            for (let iter = 0; iter < maxIter; ++iter) {
                for (let [key, items] of Object.entries(clientData.openableLootDropMap)) {
                    const boxName = ClientData.hrid2name(key);
                    this.chestDropData[boxName] ??= { items: [] };
                    let totalAsk = 0, totalBid = 0;
                    for (let item of items) {
                        const itemName = ClientData.hrid2name(item.itemHrid);
                        const bidPrice = this.getPrice(itemName, "bid") ?? 0;
                        const askPrice = this.getPrice(itemName, "ask") ?? 0;
                        const expectedCount = BattleDropAnalyzer.itemExpectation(item);
                        totalAsk += askPrice * expectedCount;
                        totalBid += bidPrice * expectedCount;
                    }
                    this.chestDropData[boxName].totalAsk = totalAsk;
                    this.chestDropData[boxName].totalBid = totalBid;

                    this.specialItemPrices[boxName] ??= {};
                    if (this.chestCosts[boxName]) {
                        const { keyAsk, keyBid, entryAsk, entryBid } = this.chestCosts[boxName];
                        this.specialItemPrices[boxName].ask = totalAsk - (keyBid + entryBid);
                        this.specialItemPrices[boxName].bid = totalBid - (keyAsk + entryAsk);
                    } else {
                        this.specialItemPrices[boxName].ask = totalAsk;
                        this.specialItemPrices[boxName].bid = totalBid;
                    }
                }

                // 更新任务代币（Task Token）价值
                let tokenValue = { ask: 0, bid: 0 };
                for (let [key, item] of Object.entries(clientData.taskShopItemDetailMap)) {
                    let itemName = item.name;
                    if (item.cost.itemHrid !== "/items/task_token") continue;
                    tokenValue.ask = Math.max(tokenValue.ask, this.getPrice(itemName, "ask") / item.cost.count);
                    tokenValue.bid = Math.max(tokenValue.bid, this.getPrice(itemName, "bid") / item.cost.count);
                }
                this.specialItemPrices["Task Token"] = tokenValue;
            }


            // 更新 specialItemPrices 到 marketData
            for (let itemName in this.specialItemPrices) {
                if (this.specialItemPrices.hasOwnProperty(itemName)) {
                    this.marketData.market[itemName] = {
                        ask: this.specialItemPrices[itemName].ask,
                        bid: this.specialItemPrices[itemName].bid
                    };
                }
            }

            // 计算箱子掉落物表
            for (let [key, items] of Object.entries(clientData.openableLootDropMap)) {
                const boxName = ClientData.hrid2name(key);
                for (let item of items) {
                    const { itemHrid, dropRate, minCount, maxCount } = item;
                    const itemName = ClientData.hrid2name(itemHrid);
                    this.chestDropData[boxName].items.push({
                        name: itemName,
                        dropRate: dropRate,
                        minCount: minCount,
                        maxCount: maxCount,
                        price: this.getPrice(itemName) ?? 0,
                    });
                }
            }

            out("特殊物品价格表 (Market.specialItemPrices)", this.specialItemPrices);
            out("箱子掉落物列表 (Market.chestDropData)", this.chestDropData);
        }

        getPriceFromAPI(itemName, priceType = "bid") {
            if (this.marketData?.market?.[itemName]) {
                const itemPrice = this.marketData.market[itemName][priceType];
                if (itemPrice !== undefined && itemPrice !== -1) {
                    return itemPrice;
                }
            }
            return null;
        }

        getPrice(itemName, priceType = "bid") {
            if (this.marketData?.market?.[itemName]) {
                const itemPrice = this.marketData.market[itemName][priceType];
                if (itemPrice !== undefined && itemPrice !== -1) {
                    return itemPrice;
                }
            }
            if (this.specialItemPrices?.[itemName]) {
                const itemPrice = this.specialItemPrices[itemName][priceType];
                if (itemPrice !== undefined && itemPrice !== -1) {
                    return itemPrice;
                }
            }
            if (priceType === "ask") return this.getPrice(itemName, "bid") / 0.98;
            if (priceType === "bid" && this.marketData?.market?.[itemName]) {
                const itemPrice = this.marketData.market[itemName].vendor;
                if (itemPrice !== undefined && itemPrice !== 0) {
                    return itemPrice * 5;
                }
            }
            // console.error(`未找到物品 ${itemName} 的 ${priceType} 价格信息`);
            return null;
        }

        getPriceByHrid(itemHrid, priceType = "bid") {
            const itemName = ClientData.hrid2name(itemHrid);
            return this.getPrice(itemName, priceType);
        }
    };

    const Translation = new class {
        ZHitemNames = {
            "/items/coin": "\u91d1\u5e01",
            "/items/task_token": "\u4efb\u52a1\u4ee3\u5e01",
            "/items/chimerical_token": "\u5947\u5e7b\u4ee3\u5e01",
            "/items/sinister_token": "\u9634\u68ee\u4ee3\u5e01",
            "/items/enchanted_token": "\u79d8\u6cd5\u4ee3\u5e01",
            "/items/pirate_token": "\u6d77\u76d7\u4ee3\u5e01",
            "/items/cowbell": "\u725b\u94c3",
            "/items/bag_of_10_cowbells": "\u725b\u94c3\u888b (10\u4e2a)",
            "/items/purples_gift": "\u5c0f\u7d2b\u725b\u7684\u793c\u7269",
            "/items/small_meteorite_cache": "\u5c0f\u9668\u77f3\u8231",
            "/items/medium_meteorite_cache": "\u4e2d\u9668\u77f3\u8231",
            "/items/large_meteorite_cache": "\u5927\u9668\u77f3\u8231",
            "/items/small_artisans_crate": "\u5c0f\u5de5\u5320\u5323",
            "/items/medium_artisans_crate": "\u4e2d\u5de5\u5320\u5323",
            "/items/large_artisans_crate": "\u5927\u5de5\u5320\u5323",
            "/items/small_treasure_chest": "\u5c0f\u5b9d\u7bb1",
            "/items/medium_treasure_chest": "\u4e2d\u5b9d\u7bb1",
            "/items/large_treasure_chest": "\u5927\u5b9d\u7bb1",
            "/items/chimerical_chest": "\u5947\u5e7b\u5b9d\u7bb1",
            "/items/sinister_chest": "\u9634\u68ee\u5b9d\u7bb1",
            "/items/enchanted_chest": "\u79d8\u6cd5\u5b9d\u7bb1",
            "/items/pirate_chest": "\u6d77\u76d7\u5b9d\u7bb1",
            "/items/blue_key_fragment": "\u84dd\u8272\u94a5\u5319\u788e\u7247",
            "/items/green_key_fragment": "\u7eff\u8272\u94a5\u5319\u788e\u7247",
            "/items/purple_key_fragment": "\u7d2b\u8272\u94a5\u5319\u788e\u7247",
            "/items/white_key_fragment": "\u767d\u8272\u94a5\u5319\u788e\u7247",
            "/items/orange_key_fragment": "\u6a59\u8272\u94a5\u5319\u788e\u7247",
            "/items/brown_key_fragment": "\u68d5\u8272\u94a5\u5319\u788e\u7247",
            "/items/stone_key_fragment": "\u77f3\u5934\u94a5\u5319\u788e\u7247",
            "/items/dark_key_fragment": "\u9ed1\u6697\u94a5\u5319\u788e\u7247",
            "/items/burning_key_fragment": "\u71c3\u70e7\u94a5\u5319\u788e\u7247",
            "/items/chimerical_entry_key": "\u5947\u5e7b\u94a5\u5319",
            "/items/chimerical_chest_key": "\u5947\u5e7b\u5b9d\u7bb1\u94a5\u5319",
            "/items/sinister_entry_key": "\u9634\u68ee\u94a5\u5319",
            "/items/sinister_chest_key": "\u9634\u68ee\u5b9d\u7bb1\u94a5\u5319",
            "/items/enchanted_entry_key": "\u79d8\u6cd5\u94a5\u5319",
            "/items/enchanted_chest_key": "\u79d8\u6cd5\u5b9d\u7bb1\u94a5\u5319",
            "/items/pirate_entry_key": "\u6d77\u76d7\u94a5\u5319",
            "/items/pirate_chest_key": "\u6d77\u76d7\u5b9d\u7bb1\u94a5\u5319",
            "/items/donut": "\u751c\u751c\u5708",
            "/items/blueberry_donut": "\u84dd\u8393\u751c\u751c\u5708",
            "/items/blackberry_donut": "\u9ed1\u8393\u751c\u751c\u5708",
            "/items/strawberry_donut": "\u8349\u8393\u751c\u751c\u5708",
            "/items/mooberry_donut": "\u54de\u8393\u751c\u751c\u5708",
            "/items/marsberry_donut": "\u706b\u661f\u8393\u751c\u751c\u5708",
            "/items/spaceberry_donut": "\u592a\u7a7a\u8393\u751c\u751c\u5708",
            "/items/cupcake": "\u7eb8\u676f\u86cb\u7cd5",
            "/items/blueberry_cake": "\u84dd\u8393\u86cb\u7cd5",
            "/items/blackberry_cake": "\u9ed1\u8393\u86cb\u7cd5",
            "/items/strawberry_cake": "\u8349\u8393\u86cb\u7cd5",
            "/items/mooberry_cake": "\u54de\u8393\u86cb\u7cd5",
            "/items/marsberry_cake": "\u706b\u661f\u8393\u86cb\u7cd5",
            "/items/spaceberry_cake": "\u592a\u7a7a\u8393\u86cb\u7cd5",
            "/items/gummy": "\u8f6f\u7cd6",
            "/items/apple_gummy": "\u82f9\u679c\u8f6f\u7cd6",
            "/items/orange_gummy": "\u6a59\u5b50\u8f6f\u7cd6",
            "/items/plum_gummy": "\u674e\u5b50\u8f6f\u7cd6",
            "/items/peach_gummy": "\u6843\u5b50\u8f6f\u7cd6",
            "/items/dragon_fruit_gummy": "\u706b\u9f99\u679c\u8f6f\u7cd6",
            "/items/star_fruit_gummy": "\u6768\u6843\u8f6f\u7cd6",
            "/items/yogurt": "\u9178\u5976",
            "/items/apple_yogurt": "\u82f9\u679c\u9178\u5976",
            "/items/orange_yogurt": "\u6a59\u5b50\u9178\u5976",
            "/items/plum_yogurt": "\u674e\u5b50\u9178\u5976",
            "/items/peach_yogurt": "\u6843\u5b50\u9178\u5976",
            "/items/dragon_fruit_yogurt": "\u706b\u9f99\u679c\u9178\u5976",
            "/items/star_fruit_yogurt": "\u6768\u6843\u9178\u5976",
            "/items/milking_tea": "\u6324\u5976\u8336",
            "/items/foraging_tea": "\u91c7\u6458\u8336",
            "/items/woodcutting_tea": "\u4f10\u6728\u8336",
            "/items/cooking_tea": "\u70f9\u996a\u8336",
            "/items/brewing_tea": "\u51b2\u6ce1\u8336",
            "/items/alchemy_tea": "\u70bc\u91d1\u8336",
            "/items/enhancing_tea": "\u5f3a\u5316\u8336",
            "/items/cheesesmithing_tea": "\u5976\u916a\u953b\u9020\u8336",
            "/items/crafting_tea": "\u5236\u4f5c\u8336",
            "/items/tailoring_tea": "\u7f1d\u7eab\u8336",
            "/items/super_milking_tea": "\u8d85\u7ea7\u6324\u5976\u8336",
            "/items/super_foraging_tea": "\u8d85\u7ea7\u91c7\u6458\u8336",
            "/items/super_woodcutting_tea": "\u8d85\u7ea7\u4f10\u6728\u8336",
            "/items/super_cooking_tea": "\u8d85\u7ea7\u70f9\u996a\u8336",
            "/items/super_brewing_tea": "\u8d85\u7ea7\u51b2\u6ce1\u8336",
            "/items/super_alchemy_tea": "\u8d85\u7ea7\u70bc\u91d1\u8336",
            "/items/super_enhancing_tea": "\u8d85\u7ea7\u5f3a\u5316\u8336",
            "/items/super_cheesesmithing_tea": "\u8d85\u7ea7\u5976\u916a\u953b\u9020\u8336",
            "/items/super_crafting_tea": "\u8d85\u7ea7\u5236\u4f5c\u8336",
            "/items/super_tailoring_tea": "\u8d85\u7ea7\u7f1d\u7eab\u8336",
            "/items/ultra_milking_tea": "\u7a76\u6781\u6324\u5976\u8336",
            "/items/ultra_foraging_tea": "\u7a76\u6781\u91c7\u6458\u8336",
            "/items/ultra_woodcutting_tea": "\u7a76\u6781\u4f10\u6728\u8336",
            "/items/ultra_cooking_tea": "\u7a76\u6781\u70f9\u996a\u8336",
            "/items/ultra_brewing_tea": "\u7a76\u6781\u51b2\u6ce1\u8336",
            "/items/ultra_alchemy_tea": "\u7a76\u6781\u70bc\u91d1\u8336",
            "/items/ultra_enhancing_tea": "\u7a76\u6781\u5f3a\u5316\u8336",
            "/items/ultra_cheesesmithing_tea": "\u7a76\u6781\u5976\u916a\u953b\u9020\u8336",
            "/items/ultra_crafting_tea": "\u7a76\u6781\u5236\u4f5c\u8336",
            "/items/ultra_tailoring_tea": "\u7a76\u6781\u7f1d\u7eab\u8336",
            "/items/gathering_tea": "\u91c7\u96c6\u8336",
            "/items/gourmet_tea": "\u7f8e\u98df\u8336",
            "/items/wisdom_tea": "\u7ecf\u9a8c\u8336",
            "/items/processing_tea": "\u52a0\u5de5\u8336",
            "/items/efficiency_tea": "\u6548\u7387\u8336",
            "/items/artisan_tea": "\u5de5\u5320\u8336",
            "/items/catalytic_tea": "\u50ac\u5316\u8336",
            "/items/blessed_tea": "\u798f\u6c14\u8336",
            "/items/stamina_coffee": "\u8010\u529b\u5496\u5561",
            "/items/intelligence_coffee": "\u667a\u529b\u5496\u5561",
            "/items/defense_coffee": "\u9632\u5fa1\u5496\u5561",
            "/items/attack_coffee": "\u653b\u51fb\u5496\u5561",
            "/items/power_coffee": "\u529b\u91cf\u5496\u5561",
            "/items/ranged_coffee": "\u8fdc\u7a0b\u5496\u5561",
            "/items/magic_coffee": "\u9b54\u6cd5\u5496\u5561",
            "/items/super_stamina_coffee": "\u8d85\u7ea7\u8010\u529b\u5496\u5561",
            "/items/super_intelligence_coffee": "\u8d85\u7ea7\u667a\u529b\u5496\u5561",
            "/items/super_defense_coffee": "\u8d85\u7ea7\u9632\u5fa1\u5496\u5561",
            "/items/super_attack_coffee": "\u8d85\u7ea7\u653b\u51fb\u5496\u5561",
            "/items/super_power_coffee": "\u8d85\u7ea7\u529b\u91cf\u5496\u5561",
            "/items/super_ranged_coffee": "\u8d85\u7ea7\u8fdc\u7a0b\u5496\u5561",
            "/items/super_magic_coffee": "\u8d85\u7ea7\u9b54\u6cd5\u5496\u5561",
            "/items/ultra_stamina_coffee": "\u7a76\u6781\u8010\u529b\u5496\u5561",
            "/items/ultra_intelligence_coffee": "\u7a76\u6781\u667a\u529b\u5496\u5561",
            "/items/ultra_defense_coffee": "\u7a76\u6781\u9632\u5fa1\u5496\u5561",
            "/items/ultra_attack_coffee": "\u7a76\u6781\u653b\u51fb\u5496\u5561",
            "/items/ultra_power_coffee": "\u7a76\u6781\u529b\u91cf\u5496\u5561",
            "/items/ultra_ranged_coffee": "\u7a76\u6781\u8fdc\u7a0b\u5496\u5561",
            "/items/ultra_magic_coffee": "\u7a76\u6781\u9b54\u6cd5\u5496\u5561",
            "/items/wisdom_coffee": "\u7ecf\u9a8c\u5496\u5561",
            "/items/lucky_coffee": "\u5e78\u8fd0\u5496\u5561",
            "/items/swiftness_coffee": "\u8fc5\u6377\u5496\u5561",
            "/items/channeling_coffee": "\u541f\u5531\u5496\u5561",
            "/items/critical_coffee": "\u66b4\u51fb\u5496\u5561",
            "/items/poke": "\u7834\u80c6\u4e4b\u523a",
            "/items/impale": "\u900f\u9aa8\u4e4b\u523a",
            "/items/puncture": "\u7834\u7532\u4e4b\u523a",
            "/items/penetrating_strike": "\u8d2f\u5fc3\u4e4b\u523a",
            "/items/scratch": "\u722a\u5f71\u65a9",
            "/items/cleave": "\u5206\u88c2\u65a9",
            "/items/maim": "\u8840\u5203\u65a9",
            "/items/crippling_slash": "\u81f4\u6b8b\u65a9",
            "/items/smack": "\u91cd\u78be",
            "/items/sweep": "\u91cd\u626b",
            "/items/stunning_blow": "\u91cd\u9524",
            "/items/fracturing_impact": "\u788e\u88c2\u51b2\u51fb",
            "/items/shield_bash": "\u76fe\u51fb",
            "/items/quick_shot": "\u5feb\u901f\u5c04\u51fb",
            "/items/aqua_arrow": "\u6d41\u6c34\u7bad",
            "/items/flame_arrow": "\u70c8\u7130\u7bad",
            "/items/rain_of_arrows": "\u7bad\u96e8",
            "/items/silencing_shot": "\u6c89\u9ed8\u4e4b\u7bad",
            "/items/steady_shot": "\u7a33\u5b9a\u5c04\u51fb",
            "/items/pestilent_shot": "\u75ab\u75c5\u5c04\u51fb",
            "/items/penetrating_shot": "\u8d2f\u7a7f\u5c04\u51fb",
            "/items/water_strike": "\u6d41\u6c34\u51b2\u51fb",
            "/items/ice_spear": "\u51b0\u67aa\u672f",
            "/items/frost_surge": "\u51b0\u971c\u7206\u88c2",
            "/items/mana_spring": "\u6cd5\u529b\u55b7\u6cc9",
            "/items/entangle": "\u7f20\u7ed5",
            "/items/toxic_pollen": "\u5267\u6bd2\u7c89\u5c18",
            "/items/natures_veil": "\u81ea\u7136\u83cc\u5e55",
            "/items/life_drain": "\u751f\u547d\u5438\u53d6",
            "/items/fireball": "\u706b\u7403",
            "/items/flame_blast": "\u7194\u5ca9\u7206\u88c2",
            "/items/firestorm": "\u706b\u7130\u98ce\u66b4",
            "/items/smoke_burst": "\u70df\u7206\u706d\u5f71",
            "/items/minor_heal": "\u521d\u7ea7\u81ea\u6108\u672f",
            "/items/heal": "\u81ea\u6108\u672f",
            "/items/quick_aid": "\u5feb\u901f\u6cbb\u7597\u672f",
            "/items/rejuvenate": "\u7fa4\u4f53\u6cbb\u7597\u672f",
            "/items/taunt": "\u5632\u8bbd",
            "/items/provoke": "\u6311\u8845",
            "/items/toughness": "\u575a\u97e7",
            "/items/elusiveness": "\u95ea\u907f",
            "/items/precision": "\u7cbe\u786e",
            "/items/berserk": "\u72c2\u66b4",
            "/items/elemental_affinity": "\u5143\u7d20\u589e\u5e45",
            "/items/frenzy": "\u72c2\u901f",
            "/items/spike_shell": "\u5c16\u523a\u9632\u62a4",
            "/items/arcane_reflection": "\u5965\u672f\u53cd\u5c04",
            "/items/vampirism": "\u5438\u8840",
            "/items/revive": "\u590d\u6d3b",
            "/items/insanity": "\u75af\u72c2",
            "/items/invincible": "\u65e0\u654c",
            "/items/fierce_aura": "\u7269\u7406\u5149\u73af",
            "/items/aqua_aura": "\u6d41\u6c34\u5149\u73af",
            "/items/sylvan_aura": "\u81ea\u7136\u5149\u73af",
            "/items/flame_aura": "\u706b\u7130\u5149\u73af",
            "/items/speed_aura": "\u901f\u5ea6\u5149\u73af",
            "/items/critical_aura": "\u66b4\u51fb\u5149\u73af",
            "/items/gobo_stabber": "\u54e5\u5e03\u6797\u957f\u5251",
            "/items/gobo_slasher": "\u54e5\u5e03\u6797\u5173\u5200",
            "/items/gobo_smasher": "\u54e5\u5e03\u6797\u72fc\u7259\u68d2",
            "/items/spiked_bulwark": "\u5c16\u523a\u91cd\u76fe",
            "/items/werewolf_slasher": "\u72fc\u4eba\u5173\u5200",
            "/items/griffin_bulwark": "\u72ee\u9e6b\u91cd\u76fe",
            "/items/gobo_shooter": "\u54e5\u5e03\u6797\u5f39\u5f13",
            "/items/vampiric_bow": "\u5438\u8840\u5f13",
            "/items/cursed_bow": "\u5492\u6028\u4e4b\u5f13",
            "/items/gobo_boomstick": "\u54e5\u5e03\u6797\u706b\u68cd",
            "/items/cheese_bulwark": "\u5976\u916a\u91cd\u76fe",
            "/items/verdant_bulwark": "\u7fe0\u7eff\u91cd\u76fe",
            "/items/azure_bulwark": "\u851a\u84dd\u91cd\u76fe",
            "/items/burble_bulwark": "\u6df1\u7d2b\u91cd\u76fe",
            "/items/crimson_bulwark": "\u7edb\u7ea2\u91cd\u76fe",
            "/items/rainbow_bulwark": "\u5f69\u8679\u91cd\u76fe",
            "/items/holy_bulwark": "\u795e\u5723\u91cd\u76fe",
            "/items/wooden_bow": "\u6728\u5f13",
            "/items/birch_bow": "\u6866\u6728\u5f13",
            "/items/cedar_bow": "\u96ea\u677e\u5f13",
            "/items/purpleheart_bow": "\u7d2b\u5fc3\u5f13",
            "/items/ginkgo_bow": "\u94f6\u674f\u5f13",
            "/items/redwood_bow": "\u7ea2\u6749\u5f13",
            "/items/arcane_bow": "\u795e\u79d8\u5f13",
            "/items/stalactite_spear": "\u77f3\u949f\u957f\u67aa",
            "/items/granite_bludgeon": "\u82b1\u5c97\u5ca9\u5927\u68d2",
            "/items/furious_spear": "\u72c2\u6012\u957f\u67aa",
            "/items/regal_sword": "\u541b\u738b\u4e4b\u5251",
            "/items/chaotic_flail": "\u6df7\u6c8c\u8fde\u67b7",
            "/items/soul_hunter_crossbow": "\u7075\u9b42\u730e\u624b\u5f29",
            "/items/sundering_crossbow": "\u88c2\u7a7a\u4e4b\u5f29",
            "/items/frost_staff": "\u51b0\u971c\u6cd5\u6756",
            "/items/infernal_battlestaff": "\u70bc\u72f1\u6cd5\u6756",
            "/items/jackalope_staff": "\u9e7f\u89d2\u5154\u4e4b\u6756",
            "/items/rippling_trident": "\u6d9f\u6f2a\u4e09\u53c9\u621f",
            "/items/blooming_trident": "\u7efd\u653e\u4e09\u53c9\u621f",
            "/items/blazing_trident": "\u70bd\u7130\u4e09\u53c9\u621f",
            "/items/cheese_sword": "\u5976\u916a\u5251",
            "/items/verdant_sword": "\u7fe0\u7eff\u5251",
            "/items/azure_sword": "\u851a\u84dd\u5251",
            "/items/burble_sword": "\u6df1\u7d2b\u5251",
            "/items/crimson_sword": "\u7edb\u7ea2\u5251",
            "/items/rainbow_sword": "\u5f69\u8679\u5251",
            "/items/holy_sword": "\u795e\u5723\u5251",
            "/items/cheese_spear": "\u5976\u916a\u957f\u67aa",
            "/items/verdant_spear": "\u7fe0\u7eff\u957f\u67aa",
            "/items/azure_spear": "\u851a\u84dd\u957f\u67aa",
            "/items/burble_spear": "\u6df1\u7d2b\u957f\u67aa",
            "/items/crimson_spear": "\u7edb\u7ea2\u957f\u67aa",
            "/items/rainbow_spear": "\u5f69\u8679\u957f\u67aa",
            "/items/holy_spear": "\u795e\u5723\u957f\u67aa",
            "/items/cheese_mace": "\u5976\u916a\u9489\u5934\u9524",
            "/items/verdant_mace": "\u7fe0\u7eff\u9489\u5934\u9524",
            "/items/azure_mace": "\u851a\u84dd\u9489\u5934\u9524",
            "/items/burble_mace": "\u6df1\u7d2b\u9489\u5934\u9524",
            "/items/crimson_mace": "\u7edb\u7ea2\u9489\u5934\u9524",
            "/items/rainbow_mace": "\u5f69\u8679\u9489\u5934\u9524",
            "/items/holy_mace": "\u795e\u5723\u9489\u5934\u9524",
            "/items/wooden_crossbow": "\u6728\u5f29",
            "/items/birch_crossbow": "\u6866\u6728\u5f29",
            "/items/cedar_crossbow": "\u96ea\u677e\u5f29",
            "/items/purpleheart_crossbow": "\u7d2b\u5fc3\u5f29",
            "/items/ginkgo_crossbow": "\u94f6\u674f\u5f29",
            "/items/redwood_crossbow": "\u7ea2\u6749\u5f29",
            "/items/arcane_crossbow": "\u795e\u79d8\u5f29",
            "/items/wooden_water_staff": "\u6728\u5236\u6c34\u6cd5\u6756",
            "/items/birch_water_staff": "\u6866\u6728\u6c34\u6cd5\u6756",
            "/items/cedar_water_staff": "\u96ea\u677e\u6c34\u6cd5\u6756",
            "/items/purpleheart_water_staff": "\u7d2b\u5fc3\u6c34\u6cd5\u6756",
            "/items/ginkgo_water_staff": "\u94f6\u674f\u6c34\u6cd5\u6756",
            "/items/redwood_water_staff": "\u7ea2\u6749\u6c34\u6cd5\u6756",
            "/items/arcane_water_staff": "\u795e\u79d8\u6c34\u6cd5\u6756",
            "/items/wooden_nature_staff": "\u6728\u5236\u81ea\u7136\u6cd5\u6756",
            "/items/birch_nature_staff": "\u6866\u6728\u81ea\u7136\u6cd5\u6756",
            "/items/cedar_nature_staff": "\u96ea\u677e\u81ea\u7136\u6cd5\u6756",
            "/items/purpleheart_nature_staff": "\u7d2b\u5fc3\u81ea\u7136\u6cd5\u6756",
            "/items/ginkgo_nature_staff": "\u94f6\u674f\u81ea\u7136\u6cd5\u6756",
            "/items/redwood_nature_staff": "\u7ea2\u6749\u81ea\u7136\u6cd5\u6756",
            "/items/arcane_nature_staff": "\u795e\u79d8\u81ea\u7136\u6cd5\u6756",
            "/items/wooden_fire_staff": "\u6728\u5236\u706b\u6cd5\u6756",
            "/items/birch_fire_staff": "\u6866\u6728\u706b\u6cd5\u6756",
            "/items/cedar_fire_staff": "\u96ea\u677e\u706b\u6cd5\u6756",
            "/items/purpleheart_fire_staff": "\u7d2b\u5fc3\u706b\u6cd5\u6756",
            "/items/ginkgo_fire_staff": "\u94f6\u674f\u706b\u6cd5\u6756",
            "/items/redwood_fire_staff": "\u7ea2\u6749\u706b\u6cd5\u6756",
            "/items/arcane_fire_staff": "\u795e\u79d8\u706b\u6cd5\u6756",
            "/items/eye_watch": "\u638c\u4e0a\u76d1\u5de5",
            "/items/snake_fang_dirk": "\u86c7\u7259\u77ed\u5251",
            "/items/vision_shield": "\u89c6\u89c9\u76fe",
            "/items/gobo_defender": "\u54e5\u5e03\u6797\u9632\u5fa1\u8005",
            "/items/vampire_fang_dirk": "\u5438\u8840\u9b3c\u77ed\u5251",
            "/items/knights_aegis": "\u9a91\u58eb\u76fe",
            "/items/treant_shield": "\u6811\u4eba\u76fe",
            "/items/manticore_shield": "\u874e\u72ee\u76fe",
            "/items/tome_of_healing": "\u6cbb\u7597\u4e4b\u4e66",
            "/items/tome_of_the_elements": "\u5143\u7d20\u4e4b\u4e66",
            "/items/watchful_relic": "\u8b66\u6212\u9057\u7269",
            "/items/bishops_codex": "\u4e3b\u6559\u6cd5\u5178",
            "/items/cheese_buckler": "\u5976\u916a\u5706\u76fe",
            "/items/verdant_buckler": "\u7fe0\u7eff\u5706\u76fe",
            "/items/azure_buckler": "\u851a\u84dd\u5706\u76fe",
            "/items/burble_buckler": "\u6df1\u7d2b\u5706\u76fe",
            "/items/crimson_buckler": "\u7edb\u7ea2\u5706\u76fe",
            "/items/rainbow_buckler": "\u5f69\u8679\u5706\u76fe",
            "/items/holy_buckler": "\u795e\u5723\u5706\u76fe",
            "/items/wooden_shield": "\u6728\u76fe",
            "/items/birch_shield": "\u6866\u6728\u76fe",
            "/items/cedar_shield": "\u96ea\u677e\u76fe",
            "/items/purpleheart_shield": "\u7d2b\u5fc3\u76fe",
            "/items/ginkgo_shield": "\u94f6\u674f\u76fe",
            "/items/redwood_shield": "\u7ea2\u6749\u76fe",
            "/items/arcane_shield": "\u795e\u79d8\u76fe",
            "/items/sinister_cape": "\u9634\u68ee\u6597\u7bf7",
            "/items/chimerical_quiver": "\u5947\u5e7b\u7bad\u888b",
            "/items/enchanted_cloak": "\u79d8\u6cd5\u62ab\u98ce",
            "/items/red_culinary_hat": "\u7ea2\u8272\u53a8\u5e08\u5e3d",
            "/items/snail_shell_helmet": "\u8717\u725b\u58f3\u5934\u76d4",
            "/items/vision_helmet": "\u89c6\u89c9\u5934\u76d4",
            "/items/fluffy_red_hat": "\u84ec\u677e\u7ea2\u5e3d\u5b50",
            "/items/corsair_helmet": "\u63a0\u593a\u8005\u5934\u76d4",
            "/items/acrobatic_hood": "\u6742\u6280\u5e08\u515c\u5e3d",
            "/items/magicians_hat": "\u9b54\u672f\u5e08\u5e3d",
            "/items/cheese_helmet": "\u5976\u916a\u5934\u76d4",
            "/items/verdant_helmet": "\u7fe0\u7eff\u5934\u76d4",
            "/items/azure_helmet": "\u851a\u84dd\u5934\u76d4",
            "/items/burble_helmet": "\u6df1\u7d2b\u5934\u76d4",
            "/items/crimson_helmet": "\u7edb\u7ea2\u5934\u76d4",
            "/items/rainbow_helmet": "\u5f69\u8679\u5934\u76d4",
            "/items/holy_helmet": "\u795e\u5723\u5934\u76d4",
            "/items/rough_hood": "\u7c97\u7cd9\u515c\u5e3d",
            "/items/reptile_hood": "\u722c\u884c\u52a8\u7269\u515c\u5e3d",
            "/items/gobo_hood": "\u54e5\u5e03\u6797\u515c\u5e3d",
            "/items/beast_hood": "\u91ce\u517d\u515c\u5e3d",
            "/items/umbral_hood": "\u6697\u5f71\u515c\u5e3d",
            "/items/cotton_hat": "\u68c9\u5e3d",
            "/items/linen_hat": "\u4e9a\u9ebb\u5e3d",
            "/items/bamboo_hat": "\u7af9\u5e3d",
            "/items/silk_hat": "\u4e1d\u5e3d",
            "/items/radiant_hat": "\u5149\u8f89\u5e3d",
            "/items/dairyhands_top": "\u6324\u5976\u5de5\u4e0a\u8863",
            "/items/foragers_top": "\u91c7\u6458\u8005\u4e0a\u8863",
            "/items/lumberjacks_top": "\u4f10\u6728\u5de5\u4e0a\u8863",
            "/items/cheesemakers_top": "\u5976\u916a\u5e08\u4e0a\u8863",
            "/items/crafters_top": "\u5de5\u5320\u4e0a\u8863",
            "/items/tailors_top": "\u88c1\u7f1d\u4e0a\u8863",
            "/items/chefs_top": "\u53a8\u5e08\u4e0a\u8863",
            "/items/brewers_top": "\u996e\u54c1\u5e08\u4e0a\u8863",
            "/items/alchemists_top": "\u70bc\u91d1\u5e08\u4e0a\u8863",
            "/items/enhancers_top": "\u5f3a\u5316\u5e08\u4e0a\u8863",
            "/items/gator_vest": "\u9cc4\u9c7c\u9a6c\u7532",
            "/items/turtle_shell_body": "\u9f9f\u58f3\u80f8\u7532",
            "/items/colossus_plate_body": "\u5de8\u50cf\u80f8\u7532",
            "/items/demonic_plate_body": "\u6076\u9b54\u80f8\u7532",
            "/items/anchorbound_plate_body": "\u951a\u5b9a\u80f8\u7532",
            "/items/maelstrom_plate_body": "\u6012\u6d9b\u80f8\u7532",
            "/items/marine_tunic": "\u6d77\u6d0b\u76ae\u8863",
            "/items/revenant_tunic": "\u4ea1\u7075\u76ae\u8863",
            "/items/griffin_tunic": "\u72ee\u9e6b\u76ae\u8863",
            "/items/kraken_tunic": "\u514b\u62c9\u80af\u76ae\u8863",
            "/items/icy_robe_top": "\u51b0\u971c\u888d\u670d",
            "/items/flaming_robe_top": "\u70c8\u7130\u888d\u670d",
            "/items/luna_robe_top": "\u6708\u795e\u888d\u670d",
            "/items/royal_water_robe_top": "\u7687\u5bb6\u6c34\u7cfb\u888d\u670d",
            "/items/royal_nature_robe_top": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u670d",
            "/items/royal_fire_robe_top": "\u7687\u5bb6\u706b\u7cfb\u888d\u670d",
            "/items/cheese_plate_body": "\u5976\u916a\u80f8\u7532",
            "/items/verdant_plate_body": "\u7fe0\u7eff\u80f8\u7532",
            "/items/azure_plate_body": "\u851a\u84dd\u80f8\u7532",
            "/items/burble_plate_body": "\u6df1\u7d2b\u80f8\u7532",
            "/items/crimson_plate_body": "\u7edb\u7ea2\u80f8\u7532",
            "/items/rainbow_plate_body": "\u5f69\u8679\u80f8\u7532",
            "/items/holy_plate_body": "\u795e\u5723\u80f8\u7532",
            "/items/rough_tunic": "\u7c97\u7cd9\u76ae\u8863",
            "/items/reptile_tunic": "\u722c\u884c\u52a8\u7269\u76ae\u8863",
            "/items/gobo_tunic": "\u54e5\u5e03\u6797\u76ae\u8863",
            "/items/beast_tunic": "\u91ce\u517d\u76ae\u8863",
            "/items/umbral_tunic": "\u6697\u5f71\u76ae\u8863",
            "/items/cotton_robe_top": "\u68c9\u5e03\u888d\u670d",
            "/items/linen_robe_top": "\u4e9a\u9ebb\u888d\u670d",
            "/items/bamboo_robe_top": "\u7af9\u888d\u670d",
            "/items/silk_robe_top": "\u4e1d\u7ef8\u888d\u670d",
            "/items/radiant_robe_top": "\u5149\u8f89\u888d\u670d",
            "/items/dairyhands_bottoms": "\u6324\u5976\u5de5\u4e0b\u88c5",
            "/items/foragers_bottoms": "\u91c7\u6458\u8005\u4e0b\u88c5",
            "/items/lumberjacks_bottoms": "\u4f10\u6728\u5de5\u4e0b\u88c5",
            "/items/cheesemakers_bottoms": "\u5976\u916a\u5e08\u4e0b\u88c5",
            "/items/crafters_bottoms": "\u5de5\u5320\u4e0b\u88c5",
            "/items/tailors_bottoms": "\u88c1\u7f1d\u4e0b\u88c5",
            "/items/chefs_bottoms": "\u53a8\u5e08\u4e0b\u88c5",
            "/items/brewers_bottoms": "\u996e\u54c1\u5e08\u4e0b\u88c5",
            "/items/alchemists_bottoms": "\u70bc\u91d1\u5e08\u4e0b\u88c5",
            "/items/enhancers_bottoms": "\u5f3a\u5316\u5e08\u4e0b\u88c5",
            "/items/turtle_shell_legs": "\u9f9f\u58f3\u817f\u7532",
            "/items/colossus_plate_legs": "\u5de8\u50cf\u817f\u7532",
            "/items/demonic_plate_legs": "\u6076\u9b54\u817f\u7532",
            "/items/anchorbound_plate_legs": "\u951a\u5b9a\u817f\u7532",
            "/items/maelstrom_plate_legs": "\u6012\u6d9b\u817f\u7532",
            "/items/marine_chaps": "\u822a\u6d77\u76ae\u88e4",
            "/items/revenant_chaps": "\u4ea1\u7075\u76ae\u88e4",
            "/items/griffin_chaps": "\u72ee\u9e6b\u76ae\u88e4",
            "/items/kraken_chaps": "\u514b\u62c9\u80af\u76ae\u88e4",
            "/items/icy_robe_bottoms": "\u51b0\u971c\u888d\u88d9",
            "/items/flaming_robe_bottoms": "\u70c8\u7130\u888d\u88d9",
            "/items/luna_robe_bottoms": "\u6708\u795e\u888d\u88d9",
            "/items/royal_water_robe_bottoms": "\u7687\u5bb6\u6c34\u7cfb\u888d\u88d9",
            "/items/royal_nature_robe_bottoms": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u88d9",
            "/items/royal_fire_robe_bottoms": "\u7687\u5bb6\u706b\u7cfb\u888d\u88d9",
            "/items/cheese_plate_legs": "\u5976\u916a\u817f\u7532",
            "/items/verdant_plate_legs": "\u7fe0\u7eff\u817f\u7532",
            "/items/azure_plate_legs": "\u851a\u84dd\u817f\u7532",
            "/items/burble_plate_legs": "\u6df1\u7d2b\u817f\u7532",
            "/items/crimson_plate_legs": "\u7edb\u7ea2\u817f\u7532",
            "/items/rainbow_plate_legs": "\u5f69\u8679\u817f\u7532",
            "/items/holy_plate_legs": "\u795e\u5723\u817f\u7532",
            "/items/rough_chaps": "\u7c97\u7cd9\u76ae\u88e4",
            "/items/reptile_chaps": "\u722c\u884c\u52a8\u7269\u76ae\u88e4",
            "/items/gobo_chaps": "\u54e5\u5e03\u6797\u76ae\u88e4",
            "/items/beast_chaps": "\u91ce\u517d\u76ae\u88e4",
            "/items/umbral_chaps": "\u6697\u5f71\u76ae\u88e4",
            "/items/cotton_robe_bottoms": "\u68c9\u888d\u88d9",
            "/items/linen_robe_bottoms": "\u4e9a\u9ebb\u888d\u88d9",
            "/items/bamboo_robe_bottoms": "\u7af9\u888d\u88d9",
            "/items/silk_robe_bottoms": "\u4e1d\u7ef8\u888d\u88d9",
            "/items/radiant_robe_bottoms": "\u5149\u8f89\u888d\u88d9",
            "/items/enchanted_gloves": "\u9644\u9b54\u624b\u5957",
            "/items/pincer_gloves": "\u87f9\u94b3\u624b\u5957",
            "/items/panda_gloves": "\u718a\u732b\u624b\u5957",
            "/items/magnetic_gloves": "\u78c1\u529b\u624b\u5957",
            "/items/dodocamel_gauntlets": "\u6e21\u6e21\u9a7c\u62a4\u624b",
            "/items/sighted_bracers": "\u7784\u51c6\u62a4\u8155",
            "/items/marksman_bracers": "\u795e\u5c04\u62a4\u8155",
            "/items/chrono_gloves": "\u65f6\u7a7a\u624b\u5957",
            "/items/cheese_gauntlets": "\u5976\u916a\u62a4\u624b",
            "/items/verdant_gauntlets": "\u7fe0\u7eff\u62a4\u624b",
            "/items/azure_gauntlets": "\u851a\u84dd\u62a4\u624b",
            "/items/burble_gauntlets": "\u6df1\u7d2b\u62a4\u624b",
            "/items/crimson_gauntlets": "\u7edb\u7ea2\u62a4\u624b",
            "/items/rainbow_gauntlets": "\u5f69\u8679\u62a4\u624b",
            "/items/holy_gauntlets": "\u795e\u5723\u62a4\u624b",
            "/items/rough_bracers": "\u7c97\u7cd9\u62a4\u8155",
            "/items/reptile_bracers": "\u722c\u884c\u52a8\u7269\u62a4\u8155",
            "/items/gobo_bracers": "\u54e5\u5e03\u6797\u62a4\u8155",
            "/items/beast_bracers": "\u91ce\u517d\u62a4\u8155",
            "/items/umbral_bracers": "\u6697\u5f71\u62a4\u8155",
            "/items/cotton_gloves": "\u68c9\u624b\u5957",
            "/items/linen_gloves": "\u4e9a\u9ebb\u624b\u5957",
            "/items/bamboo_gloves": "\u7af9\u624b\u5957",
            "/items/silk_gloves": "\u4e1d\u624b\u5957",
            "/items/radiant_gloves": "\u5149\u8f89\u624b\u5957",
            "/items/collectors_boots": "\u6536\u85cf\u5bb6\u9774",
            "/items/shoebill_shoes": "\u9cb8\u5934\u9e73\u978b",
            "/items/black_bear_shoes": "\u9ed1\u718a\u978b",
            "/items/grizzly_bear_shoes": "\u68d5\u718a\u978b",
            "/items/polar_bear_shoes": "\u5317\u6781\u718a\u978b",
            "/items/centaur_boots": "\u534a\u4eba\u9a6c\u9774",
            "/items/sorcerer_boots": "\u5deb\u5e08\u9774",
            "/items/cheese_boots": "\u5976\u916a\u9774",
            "/items/verdant_boots": "\u7fe0\u7eff\u9774",
            "/items/azure_boots": "\u851a\u84dd\u9774",
            "/items/burble_boots": "\u6df1\u7d2b\u9774",
            "/items/crimson_boots": "\u7edb\u7ea2\u9774",
            "/items/rainbow_boots": "\u5f69\u8679\u9774",
            "/items/holy_boots": "\u795e\u5723\u9774",
            "/items/rough_boots": "\u7c97\u7cd9\u9774",
            "/items/reptile_boots": "\u722c\u884c\u52a8\u7269\u9774",
            "/items/gobo_boots": "\u54e5\u5e03\u6797\u9774",
            "/items/beast_boots": "\u91ce\u517d\u9774",
            "/items/umbral_boots": "\u6697\u5f71\u9774",
            "/items/cotton_boots": "\u68c9\u9774",
            "/items/linen_boots": "\u4e9a\u9ebb\u9774",
            "/items/bamboo_boots": "\u7af9\u9774",
            "/items/silk_boots": "\u4e1d\u9774",
            "/items/radiant_boots": "\u5149\u8f89\u9774",
            "/items/small_pouch": "\u5c0f\u888b\u5b50",
            "/items/medium_pouch": "\u4e2d\u888b\u5b50",
            "/items/large_pouch": "\u5927\u888b\u5b50",
            "/items/giant_pouch": "\u5de8\u5927\u888b\u5b50",
            "/items/gluttonous_pouch": "\u8d2a\u98df\u4e4b\u888b",
            "/items/guzzling_pouch": "\u66b4\u996e\u4e4b\u56ca",
            "/items/necklace_of_efficiency": "\u6548\u7387\u9879\u94fe",
            "/items/fighter_necklace": "\u6218\u58eb\u9879\u94fe",
            "/items/ranger_necklace": "\u5c04\u624b\u9879\u94fe",
            "/items/wizard_necklace": "\u5deb\u5e08\u9879\u94fe",
            "/items/necklace_of_wisdom": "\u7ecf\u9a8c\u9879\u94fe",
            "/items/necklace_of_speed": "\u901f\u5ea6\u9879\u94fe",
            "/items/philosophers_necklace": "\u8d24\u8005\u9879\u94fe",
            "/items/earrings_of_gathering": "\u91c7\u96c6\u8033\u73af",
            "/items/earrings_of_essence_find": "\u7cbe\u534e\u53d1\u73b0\u8033\u73af",
            "/items/earrings_of_armor": "\u62a4\u7532\u8033\u73af",
            "/items/earrings_of_regeneration": "\u6062\u590d\u8033\u73af",
            "/items/earrings_of_resistance": "\u6297\u6027\u8033\u73af",
            "/items/earrings_of_rare_find": "\u7a00\u6709\u53d1\u73b0\u8033\u73af",
            "/items/earrings_of_critical_strike": "\u66b4\u51fb\u8033\u73af",
            "/items/philosophers_earrings": "\u8d24\u8005\u8033\u73af",
            "/items/ring_of_gathering": "\u91c7\u96c6\u6212\u6307",
            "/items/ring_of_essence_find": "\u7cbe\u534e\u53d1\u73b0\u6212\u6307",
            "/items/ring_of_armor": "\u62a4\u7532\u6212\u6307",
            "/items/ring_of_regeneration": "\u6062\u590d\u6212\u6307",
            "/items/ring_of_resistance": "\u6297\u6027\u6212\u6307",
            "/items/ring_of_rare_find": "\u7a00\u6709\u53d1\u73b0\u6212\u6307",
            "/items/ring_of_critical_strike": "\u66b4\u51fb\u6212\u6307",
            "/items/philosophers_ring": "\u8d24\u8005\u6212\u6307",
            "/items/basic_task_badge": "\u57fa\u7840\u4efb\u52a1\u5fbd\u7ae0",
            "/items/advanced_task_badge": "\u9ad8\u7ea7\u4efb\u52a1\u5fbd\u7ae0",
            "/items/expert_task_badge": "\u4e13\u5bb6\u4efb\u52a1\u5fbd\u7ae0",
            "/items/celestial_brush": "\u661f\u7a7a\u5237\u5b50",
            "/items/cheese_brush": "\u5976\u916a\u5237\u5b50",
            "/items/verdant_brush": "\u7fe0\u7eff\u5237\u5b50",
            "/items/azure_brush": "\u851a\u84dd\u5237\u5b50",
            "/items/burble_brush": "\u6df1\u7d2b\u5237\u5b50",
            "/items/crimson_brush": "\u7edb\u7ea2\u5237\u5b50",
            "/items/rainbow_brush": "\u5f69\u8679\u5237\u5b50",
            "/items/holy_brush": "\u795e\u5723\u5237\u5b50",
            "/items/celestial_shears": "\u661f\u7a7a\u526a\u5200",
            "/items/cheese_shears": "\u5976\u916a\u526a\u5200",
            "/items/verdant_shears": "\u7fe0\u7eff\u526a\u5200",
            "/items/azure_shears": "\u851a\u84dd\u526a\u5200",
            "/items/burble_shears": "\u6df1\u7d2b\u526a\u5200",
            "/items/crimson_shears": "\u7edb\u7ea2\u526a\u5200",
            "/items/rainbow_shears": "\u5f69\u8679\u526a\u5200",
            "/items/holy_shears": "\u795e\u5723\u526a\u5200",
            "/items/celestial_hatchet": "\u661f\u7a7a\u65a7\u5934",
            "/items/cheese_hatchet": "\u5976\u916a\u65a7\u5934",
            "/items/verdant_hatchet": "\u7fe0\u7eff\u65a7\u5934",
            "/items/azure_hatchet": "\u851a\u84dd\u65a7\u5934",
            "/items/burble_hatchet": "\u6df1\u7d2b\u65a7\u5934",
            "/items/crimson_hatchet": "\u7edb\u7ea2\u65a7\u5934",
            "/items/rainbow_hatchet": "\u5f69\u8679\u65a7\u5934",
            "/items/holy_hatchet": "\u795e\u5723\u65a7\u5934",
            "/items/celestial_hammer": "\u661f\u7a7a\u9524\u5b50",
            "/items/cheese_hammer": "\u5976\u916a\u9524\u5b50",
            "/items/verdant_hammer": "\u7fe0\u7eff\u9524\u5b50",
            "/items/azure_hammer": "\u851a\u84dd\u9524\u5b50",
            "/items/burble_hammer": "\u6df1\u7d2b\u9524\u5b50",
            "/items/crimson_hammer": "\u7edb\u7ea2\u9524\u5b50",
            "/items/rainbow_hammer": "\u5f69\u8679\u9524\u5b50",
            "/items/holy_hammer": "\u795e\u5723\u9524\u5b50",
            "/items/celestial_chisel": "\u661f\u7a7a\u51ff\u5b50",
            "/items/cheese_chisel": "\u5976\u916a\u51ff\u5b50",
            "/items/verdant_chisel": "\u7fe0\u7eff\u51ff\u5b50",
            "/items/azure_chisel": "\u851a\u84dd\u51ff\u5b50",
            "/items/burble_chisel": "\u6df1\u7d2b\u51ff\u5b50",
            "/items/crimson_chisel": "\u7edb\u7ea2\u51ff\u5b50",
            "/items/rainbow_chisel": "\u5f69\u8679\u51ff\u5b50",
            "/items/holy_chisel": "\u795e\u5723\u51ff\u5b50",
            "/items/celestial_needle": "\u661f\u7a7a\u9488",
            "/items/cheese_needle": "\u5976\u916a\u9488",
            "/items/verdant_needle": "\u7fe0\u7eff\u9488",
            "/items/azure_needle": "\u851a\u84dd\u9488",
            "/items/burble_needle": "\u6df1\u7d2b\u9488",
            "/items/crimson_needle": "\u7edb\u7ea2\u9488",
            "/items/rainbow_needle": "\u5f69\u8679\u9488",
            "/items/holy_needle": "\u795e\u5723\u9488",
            "/items/celestial_spatula": "\u661f\u7a7a\u9505\u94f2",
            "/items/cheese_spatula": "\u5976\u916a\u9505\u94f2",
            "/items/verdant_spatula": "\u7fe0\u7eff\u9505\u94f2",
            "/items/azure_spatula": "\u851a\u84dd\u9505\u94f2",
            "/items/burble_spatula": "\u6df1\u7d2b\u9505\u94f2",
            "/items/crimson_spatula": "\u7edb\u7ea2\u9505\u94f2",
            "/items/rainbow_spatula": "\u5f69\u8679\u9505\u94f2",
            "/items/holy_spatula": "\u795e\u5723\u9505\u94f2",
            "/items/celestial_pot": "\u661f\u7a7a\u58f6",
            "/items/cheese_pot": "\u5976\u916a\u58f6",
            "/items/verdant_pot": "\u7fe0\u7eff\u58f6",
            "/items/azure_pot": "\u851a\u84dd\u58f6",
            "/items/burble_pot": "\u6df1\u7d2b\u58f6",
            "/items/crimson_pot": "\u7edb\u7ea2\u58f6",
            "/items/rainbow_pot": "\u5f69\u8679\u58f6",
            "/items/holy_pot": "\u795e\u5723\u58f6",
            "/items/celestial_alembic": "\u661f\u7a7a\u84b8\u998f\u5668",
            "/items/cheese_alembic": "\u5976\u916a\u84b8\u998f\u5668",
            "/items/verdant_alembic": "\u7fe0\u7eff\u84b8\u998f\u5668",
            "/items/azure_alembic": "\u851a\u84dd\u84b8\u998f\u5668",
            "/items/burble_alembic": "\u6df1\u7d2b\u84b8\u998f\u5668",
            "/items/crimson_alembic": "\u7edb\u7ea2\u84b8\u998f\u5668",
            "/items/rainbow_alembic": "\u5f69\u8679\u84b8\u998f\u5668",
            "/items/holy_alembic": "\u795e\u5723\u84b8\u998f\u5668",
            "/items/celestial_enhancer": "\u661f\u7a7a\u5f3a\u5316\u5668",
            "/items/cheese_enhancer": "\u5976\u916a\u5f3a\u5316\u5668",
            "/items/verdant_enhancer": "\u7fe0\u7eff\u5f3a\u5316\u5668",
            "/items/azure_enhancer": "\u851a\u84dd\u5f3a\u5316\u5668",
            "/items/burble_enhancer": "\u6df1\u7d2b\u5f3a\u5316\u5668",
            "/items/crimson_enhancer": "\u7edb\u7ea2\u5f3a\u5316\u5668",
            "/items/rainbow_enhancer": "\u5f69\u8679\u5f3a\u5316\u5668",
            "/items/holy_enhancer": "\u795e\u5723\u5f3a\u5316\u5668",
            "/items/milk": "\u725b\u5976",
            "/items/verdant_milk": "\u7fe0\u7eff\u725b\u5976",
            "/items/azure_milk": "\u851a\u84dd\u725b\u5976",
            "/items/burble_milk": "\u6df1\u7d2b\u725b\u5976",
            "/items/crimson_milk": "\u7edb\u7ea2\u725b\u5976",
            "/items/rainbow_milk": "\u5f69\u8679\u725b\u5976",
            "/items/holy_milk": "\u795e\u5723\u725b\u5976",
            "/items/cheese": "\u5976\u916a",
            "/items/verdant_cheese": "\u7fe0\u7eff\u5976\u916a",
            "/items/azure_cheese": "\u851a\u84dd\u5976\u916a",
            "/items/burble_cheese": "\u6df1\u7d2b\u5976\u916a",
            "/items/crimson_cheese": "\u7edb\u7ea2\u5976\u916a",
            "/items/rainbow_cheese": "\u5f69\u8679\u5976\u916a",
            "/items/holy_cheese": "\u795e\u5723\u5976\u916a",
            "/items/log": "\u539f\u6728",
            "/items/birch_log": "\u767d\u6866\u539f\u6728",
            "/items/cedar_log": "\u96ea\u677e\u539f\u6728",
            "/items/purpleheart_log": "\u7d2b\u5fc3\u539f\u6728",
            "/items/ginkgo_log": "\u94f6\u674f\u539f\u6728",
            "/items/redwood_log": "\u7ea2\u6749\u539f\u6728",
            "/items/arcane_log": "\u795e\u79d8\u539f\u6728",
            "/items/lumber": "\u6728\u677f",
            "/items/birch_lumber": "\u767d\u6866\u6728\u677f",
            "/items/cedar_lumber": "\u96ea\u677e\u6728\u677f",
            "/items/purpleheart_lumber": "\u7d2b\u5fc3\u6728\u677f",
            "/items/ginkgo_lumber": "\u94f6\u674f\u6728\u677f",
            "/items/redwood_lumber": "\u7ea2\u6749\u6728\u677f",
            "/items/arcane_lumber": "\u795e\u79d8\u6728\u677f",
            "/items/rough_hide": "\u7c97\u7cd9\u517d\u76ae",
            "/items/reptile_hide": "\u722c\u884c\u52a8\u7269\u76ae",
            "/items/gobo_hide": "\u54e5\u5e03\u6797\u76ae",
            "/items/beast_hide": "\u91ce\u517d\u76ae",
            "/items/umbral_hide": "\u6697\u5f71\u76ae",
            "/items/rough_leather": "\u7c97\u7cd9\u76ae\u9769",
            "/items/reptile_leather": "\u722c\u884c\u52a8\u7269\u76ae\u9769",
            "/items/gobo_leather": "\u54e5\u5e03\u6797\u76ae\u9769",
            "/items/beast_leather": "\u91ce\u517d\u76ae\u9769",
            "/items/umbral_leather": "\u6697\u5f71\u76ae\u9769",
            "/items/cotton": "\u68c9\u82b1",
            "/items/flax": "\u4e9a\u9ebb",
            "/items/bamboo_branch": "\u7af9\u5b50",
            "/items/cocoon": "\u8695\u8327",
            "/items/radiant_fiber": "\u5149\u8f89\u7ea4\u7ef4",
            "/items/cotton_fabric": "\u68c9\u82b1\u5e03\u6599",
            "/items/linen_fabric": "\u4e9a\u9ebb\u5e03\u6599",
            "/items/bamboo_fabric": "\u7af9\u5b50\u5e03\u6599",
            "/items/silk_fabric": "\u4e1d\u7ef8",
            "/items/radiant_fabric": "\u5149\u8f89\u5e03\u6599",
            "/items/egg": "\u9e21\u86cb",
            "/items/wheat": "\u5c0f\u9ea6",
            "/items/sugar": "\u7cd6",
            "/items/blueberry": "\u84dd\u8393",
            "/items/blackberry": "\u9ed1\u8393",
            "/items/strawberry": "\u8349\u8393",
            "/items/mooberry": "\u54de\u8393",
            "/items/marsberry": "\u706b\u661f\u8393",
            "/items/spaceberry": "\u592a\u7a7a\u8393",
            "/items/apple": "\u82f9\u679c",
            "/items/orange": "\u6a59\u5b50",
            "/items/plum": "\u674e\u5b50",
            "/items/peach": "\u6843\u5b50",
            "/items/dragon_fruit": "\u706b\u9f99\u679c",
            "/items/star_fruit": "\u6768\u6843",
            "/items/arabica_coffee_bean": "\u4f4e\u7ea7\u5496\u5561\u8c46",
            "/items/robusta_coffee_bean": "\u4e2d\u7ea7\u5496\u5561\u8c46",
            "/items/liberica_coffee_bean": "\u9ad8\u7ea7\u5496\u5561\u8c46",
            "/items/excelsa_coffee_bean": "\u7279\u7ea7\u5496\u5561\u8c46",
            "/items/fieriosa_coffee_bean": "\u706b\u5c71\u5496\u5561\u8c46",
            "/items/spacia_coffee_bean": "\u592a\u7a7a\u5496\u5561\u8c46",
            "/items/green_tea_leaf": "\u7eff\u8336\u53f6",
            "/items/black_tea_leaf": "\u9ed1\u8336\u53f6",
            "/items/burble_tea_leaf": "\u7d2b\u8336\u53f6",
            "/items/moolong_tea_leaf": "\u54de\u9f99\u8336\u53f6",
            "/items/red_tea_leaf": "\u7ea2\u8336\u53f6",
            "/items/emp_tea_leaf": "\u865a\u7a7a\u8336\u53f6",
            "/items/catalyst_of_coinification": "\u70b9\u91d1\u50ac\u5316\u5242",
            "/items/catalyst_of_decomposition": "\u5206\u89e3\u50ac\u5316\u5242",
            "/items/catalyst_of_transmutation": "\u8f6c\u5316\u50ac\u5316\u5242",
            "/items/prime_catalyst": "\u81f3\u9ad8\u50ac\u5316\u5242",
            "/items/snake_fang": "\u86c7\u7259",
            "/items/shoebill_feather": "\u9cb8\u5934\u9e73\u7fbd\u6bdb",
            "/items/snail_shell": "\u8717\u725b\u58f3",
            "/items/crab_pincer": "\u87f9\u94b3",
            "/items/turtle_shell": "\u4e4c\u9f9f\u58f3",
            "/items/marine_scale": "\u6d77\u6d0b\u9cde\u7247",
            "/items/treant_bark": "\u6811\u76ae",
            "/items/centaur_hoof": "\u534a\u4eba\u9a6c\u8e44",
            "/items/luna_wing": "\u6708\u795e\u7ffc",
            "/items/gobo_rag": "\u54e5\u5e03\u6797\u62b9\u5e03",
            "/items/goggles": "\u62a4\u76ee\u955c",
            "/items/magnifying_glass": "\u653e\u5927\u955c",
            "/items/eye_of_the_watcher": "\u89c2\u5bdf\u8005\u4e4b\u773c",
            "/items/icy_cloth": "\u51b0\u971c\u7ec7\u7269",
            "/items/flaming_cloth": "\u70c8\u7130\u7ec7\u7269",
            "/items/sorcerers_sole": "\u9b54\u6cd5\u5e08\u978b\u5e95",
            "/items/chrono_sphere": "\u65f6\u7a7a\u7403",
            "/items/frost_sphere": "\u51b0\u971c\u7403",
            "/items/panda_fluff": "\u718a\u732b\u7ed2",
            "/items/black_bear_fluff": "\u9ed1\u718a\u7ed2",
            "/items/grizzly_bear_fluff": "\u68d5\u718a\u7ed2",
            "/items/polar_bear_fluff": "\u5317\u6781\u718a\u7ed2",
            "/items/red_panda_fluff": "\u5c0f\u718a\u732b\u7ed2",
            "/items/magnet": "\u78c1\u94c1",
            "/items/stalactite_shard": "\u949f\u4e73\u77f3\u788e\u7247",
            "/items/living_granite": "\u82b1\u5c97\u5ca9",
            "/items/colossus_core": "\u5de8\u50cf\u6838\u5fc3",
            "/items/vampire_fang": "\u5438\u8840\u9b3c\u4e4b\u7259",
            "/items/werewolf_claw": "\u72fc\u4eba\u4e4b\u722a",
            "/items/revenant_anima": "\u4ea1\u8005\u4e4b\u9b42",
            "/items/soul_fragment": "\u7075\u9b42\u788e\u7247",
            "/items/infernal_ember": "\u5730\u72f1\u4f59\u70ec",
            "/items/demonic_core": "\u6076\u9b54\u6838\u5fc3",
            "/items/griffin_leather": "\u72ee\u9e6b\u4e4b\u76ae",
            "/items/manticore_sting": "\u874e\u72ee\u4e4b\u523a",
            "/items/jackalope_antler": "\u9e7f\u89d2\u5154\u4e4b\u89d2",
            "/items/dodocamel_plume": "\u6e21\u6e21\u9a7c\u4e4b\u7fce",
            "/items/griffin_talon": "\u72ee\u9e6b\u4e4b\u722a",
            "/items/acrobats_ribbon": "\u6742\u6280\u5e08\u5f69\u5e26",
            "/items/magicians_cloth": "\u9b54\u672f\u5e08\u7ec7\u7269",
            "/items/chaotic_chain": "\u6df7\u6c8c\u9501\u94fe",
            "/items/cursed_ball": "\u8bc5\u5492\u4e4b\u7403",
            "/items/royal_cloth": "\u7687\u5bb6\u7ec7\u7269",
            "/items/knights_ingot": "\u9a91\u58eb\u4e4b\u952d",
            "/items/bishops_scroll": "\u4e3b\u6559\u5377\u8f74",
            "/items/regal_jewel": "\u541b\u738b\u5b9d\u77f3",
            "/items/sundering_jewel": "\u88c2\u7a7a\u5b9d\u77f3",
            "/items/marksman_brooch": "\u795e\u5c04\u80f8\u9488",
            "/items/corsair_crest": "\u63a0\u593a\u8005\u5fbd\u7ae0",
            "/items/damaged_anchor": "\u7834\u635f\u8239\u951a",
            "/items/maelstrom_plating": "\u6012\u6d9b\u7532\u7247",
            "/items/kraken_leather": "\u514b\u62c9\u80af\u76ae\u9769",
            "/items/kraken_fang": "\u514b\u62c9\u80af\u4e4b\u7259",
            "/items/butter_of_proficiency": "\u7cbe\u901a\u4e4b\u6cb9",
            "/items/thread_of_expertise": "\u4e13\u7cbe\u4e4b\u7ebf",
            "/items/branch_of_insight": "\u6d1e\u5bdf\u4e4b\u679d",
            "/items/gluttonous_energy": "\u8d2a\u98df\u80fd\u91cf",
            "/items/guzzling_energy": "\u66b4\u996e\u80fd\u91cf",
            "/items/milking_essence": "\u6324\u5976\u7cbe\u534e",
            "/items/foraging_essence": "\u91c7\u6458\u7cbe\u534e",
            "/items/woodcutting_essence": "\u4f10\u6728\u7cbe\u534e",
            "/items/cheesesmithing_essence": "\u5976\u916a\u953b\u9020\u7cbe\u534e",
            "/items/crafting_essence": "\u5236\u4f5c\u7cbe\u534e",
            "/items/tailoring_essence": "\u7f1d\u7eab\u7cbe\u534e",
            "/items/cooking_essence": "\u70f9\u996a\u7cbe\u534e",
            "/items/brewing_essence": "\u51b2\u6ce1\u7cbe\u534e",
            "/items/alchemy_essence": "\u70bc\u91d1\u7cbe\u534e",
            "/items/enhancing_essence": "\u5f3a\u5316\u7cbe\u534e",
            "/items/swamp_essence": "\u6cbc\u6cfd\u7cbe\u534e",
            "/items/aqua_essence": "\u6d77\u6d0b\u7cbe\u534e",
            "/items/jungle_essence": "\u4e1b\u6797\u7cbe\u534e",
            "/items/gobo_essence": "\u54e5\u5e03\u6797\u7cbe\u534e",
            "/items/eyessence": "\u773c\u7cbe\u534e",
            "/items/sorcerer_essence": "\u6cd5\u5e08\u7cbe\u534e",
            "/items/bear_essence": "\u718a\u718a\u7cbe\u534e",
            "/items/golem_essence": "\u9b54\u50cf\u7cbe\u534e",
            "/items/twilight_essence": "\u66ae\u5149\u7cbe\u534e",
            "/items/abyssal_essence": "\u5730\u72f1\u7cbe\u534e",
            "/items/chimerical_essence": "\u5947\u5e7b\u7cbe\u534e",
            "/items/sinister_essence": "\u9634\u68ee\u7cbe\u534e",
            "/items/enchanted_essence": "\u79d8\u6cd5\u7cbe\u534e",
            "/items/pirate_essence": "\u6d77\u76d7\u7cbe\u534e",
            "/items/task_crystal": "\u4efb\u52a1\u6c34\u6676",
            "/items/star_fragment": "\u661f\u5149\u788e\u7247",
            "/items/pearl": "\u73cd\u73e0",
            "/items/amber": "\u7425\u73c0",
            "/items/garnet": "\u77f3\u69b4\u77f3",
            "/items/jade": "\u7fe1\u7fe0",
            "/items/amethyst": "\u7d2b\u6c34\u6676",
            "/items/moonstone": "\u6708\u4eae\u77f3",
            "/items/sunstone": "\u592a\u9633\u77f3",
            "/items/philosophers_stone": "\u8d24\u8005\u4e4b\u77f3",
            "/items/crushed_pearl": "\u73cd\u73e0\u788e\u7247",
            "/items/crushed_amber": "\u7425\u73c0\u788e\u7247",
            "/items/crushed_garnet": "\u77f3\u69b4\u77f3\u788e\u7247",
            "/items/crushed_jade": "\u7fe1\u7fe0\u788e\u7247",
            "/items/crushed_amethyst": "\u7d2b\u6c34\u6676\u788e\u7247",
            "/items/crushed_moonstone": "\u6708\u4eae\u77f3\u788e\u7247",
            "/items/crushed_sunstone": "\u592a\u9633\u77f3\u788e\u7247",
            "/items/crushed_philosophers_stone": "\u8d24\u8005\u4e4b\u77f3\u788e\u7247",
            "/items/shard_of_protection": "\u4fdd\u62a4\u788e\u7247",
            "/items/mirror_of_protection": "\u4fdd\u62a4\u4e4b\u955c",
        };
        ZHActionNames = {
            "/actions/milking/cow": "\u5976\u725b",
            "/actions/milking/verdant_cow": "\u7fe0\u7eff\u5976\u725b",
            "/actions/milking/azure_cow": "\u851a\u84dd\u5976\u725b",
            "/actions/milking/burble_cow": "\u6df1\u7d2b\u5976\u725b",
            "/actions/milking/crimson_cow": "\u7edb\u7ea2\u5976\u725b",
            "/actions/milking/unicow": "\u5f69\u8679\u5976\u725b",
            "/actions/milking/holy_cow": "\u795e\u5723\u5976\u725b",
            "/actions/foraging/egg": "\u9e21\u86cb",
            "/actions/foraging/wheat": "\u5c0f\u9ea6",
            "/actions/foraging/sugar": "\u7cd6",
            "/actions/foraging/cotton": "\u68c9\u82b1",
            "/actions/foraging/farmland": "\u7fe0\u91ce\u519c\u573a",
            "/actions/foraging/blueberry": "\u84dd\u8393",
            "/actions/foraging/apple": "\u82f9\u679c",
            "/actions/foraging/arabica_coffee_bean": "\u4f4e\u7ea7\u5496\u5561\u8c46",
            "/actions/foraging/flax": "\u4e9a\u9ebb",
            "/actions/foraging/shimmering_lake": "\u6ce2\u5149\u6e56\u6cca",
            "/actions/foraging/blackberry": "\u9ed1\u8393",
            "/actions/foraging/orange": "\u6a59\u5b50",
            "/actions/foraging/robusta_coffee_bean": "\u4e2d\u7ea7\u5496\u5561\u8c46",
            "/actions/foraging/misty_forest": "\u8ff7\u96fe\u68ee\u6797",
            "/actions/foraging/strawberry": "\u8349\u8393",
            "/actions/foraging/plum": "\u674e\u5b50",
            "/actions/foraging/liberica_coffee_bean": "\u9ad8\u7ea7\u5496\u5561\u8c46",
            "/actions/foraging/bamboo_branch": "\u7af9\u5b50",
            "/actions/foraging/burble_beach": "\u6df1\u7d2b\u6c99\u6ee9",
            "/actions/foraging/mooberry": "\u54de\u8393",
            "/actions/foraging/peach": "\u6843\u5b50",
            "/actions/foraging/excelsa_coffee_bean": "\u7279\u7ea7\u5496\u5561\u8c46",
            "/actions/foraging/cocoon": "\u8695\u8327",
            "/actions/foraging/silly_cow_valley": "\u50bb\u725b\u5c71\u8c37",
            "/actions/foraging/marsberry": "\u706b\u661f\u8393",
            "/actions/foraging/dragon_fruit": "\u706b\u9f99\u679c",
            "/actions/foraging/fieriosa_coffee_bean": "\u706b\u5c71\u5496\u5561\u8c46",
            "/actions/foraging/olympus_mons": "\u5965\u6797\u5339\u65af\u5c71",
            "/actions/foraging/spaceberry": "\u592a\u7a7a\u8393",
            "/actions/foraging/star_fruit": "\u6768\u6843",
            "/actions/foraging/spacia_coffee_bean": "\u592a\u7a7a\u5496\u5561\u8c46",
            "/actions/foraging/radiant_fiber": "\u5149\u8f89\u7ea4\u7ef4",
            "/actions/foraging/asteroid_belt": "\u5c0f\u884c\u661f\u5e26",
            "/actions/woodcutting/tree": "\u6811",
            "/actions/woodcutting/birch_tree": "\u6866\u6811",
            "/actions/woodcutting/cedar_tree": "\u96ea\u677e\u6811",
            "/actions/woodcutting/purpleheart_tree": "\u7d2b\u5fc3\u6811",
            "/actions/woodcutting/ginkgo_tree": "\u94f6\u674f\u6811",
            "/actions/woodcutting/redwood_tree": "\u7ea2\u6749\u6811",
            "/actions/woodcutting/arcane_tree": "\u5965\u79d8\u6811",
            "/actions/cheesesmithing/cheese": "\u5976\u916a",
            "/actions/cheesesmithing/cheese_boots": "\u5976\u916a\u9774",
            "/actions/cheesesmithing/cheese_gauntlets": "\u5976\u916a\u62a4\u624b",
            "/actions/cheesesmithing/cheese_sword": "\u5976\u916a\u5251",
            "/actions/cheesesmithing/cheese_brush": "\u5976\u916a\u5237\u5b50",
            "/actions/cheesesmithing/cheese_shears": "\u5976\u916a\u526a\u5200",
            "/actions/cheesesmithing/cheese_hatchet": "\u5976\u916a\u65a7\u5934",
            "/actions/cheesesmithing/cheese_spear": "\u5976\u916a\u957f\u67aa",
            "/actions/cheesesmithing/cheese_hammer": "\u5976\u916a\u9524\u5b50",
            "/actions/cheesesmithing/cheese_chisel": "\u5976\u916a\u51ff\u5b50",
            "/actions/cheesesmithing/cheese_needle": "\u5976\u916a\u9488",
            "/actions/cheesesmithing/cheese_spatula": "\u5976\u916a\u9505\u94f2",
            "/actions/cheesesmithing/cheese_pot": "\u5976\u916a\u58f6",
            "/actions/cheesesmithing/cheese_mace": "\u5976\u916a\u9489\u5934\u9524",
            "/actions/cheesesmithing/cheese_alembic": "\u5976\u916a\u84b8\u998f\u5668",
            "/actions/cheesesmithing/cheese_enhancer": "\u5976\u916a\u5f3a\u5316\u5668",
            "/actions/cheesesmithing/cheese_helmet": "\u5976\u916a\u5934\u76d4",
            "/actions/cheesesmithing/cheese_buckler": "\u5976\u916a\u5706\u76fe",
            "/actions/cheesesmithing/cheese_bulwark": "\u5976\u916a\u91cd\u76fe",
            "/actions/cheesesmithing/cheese_plate_legs": "\u5976\u916a\u817f\u7532",
            "/actions/cheesesmithing/cheese_plate_body": "\u5976\u916a\u80f8\u7532",
            "/actions/cheesesmithing/verdant_cheese": "\u7fe0\u7eff\u5976\u916a",
            "/actions/cheesesmithing/verdant_boots": "\u7fe0\u7eff\u9774",
            "/actions/cheesesmithing/verdant_gauntlets": "\u7fe0\u7eff\u62a4\u624b",
            "/actions/cheesesmithing/verdant_sword": "\u7fe0\u7eff\u5251",
            "/actions/cheesesmithing/verdant_brush": "\u7fe0\u7eff\u5237\u5b50",
            "/actions/cheesesmithing/verdant_shears": "\u7fe0\u7eff\u526a\u5200",
            "/actions/cheesesmithing/verdant_hatchet": "\u7fe0\u7eff\u65a7\u5934",
            "/actions/cheesesmithing/verdant_spear": "\u7fe0\u7eff\u957f\u67aa",
            "/actions/cheesesmithing/verdant_hammer": "\u7fe0\u7eff\u9524\u5b50",
            "/actions/cheesesmithing/verdant_chisel": "\u7fe0\u7eff\u51ff\u5b50",
            "/actions/cheesesmithing/verdant_needle": "\u7fe0\u7eff\u9488",
            "/actions/cheesesmithing/verdant_spatula": "\u7fe0\u7eff\u9505\u94f2",
            "/actions/cheesesmithing/verdant_pot": "\u7fe0\u7eff\u58f6",
            "/actions/cheesesmithing/verdant_mace": "\u7fe0\u7eff\u9489\u5934\u9524",
            "/actions/cheesesmithing/snake_fang_dirk": "\u86c7\u7259\u77ed\u5251",
            "/actions/cheesesmithing/verdant_alembic": "\u7fe0\u7eff\u84b8\u998f\u5668",
            "/actions/cheesesmithing/verdant_enhancer": "\u7fe0\u7eff\u5f3a\u5316\u5668",
            "/actions/cheesesmithing/verdant_helmet": "\u7fe0\u7eff\u5934\u76d4",
            "/actions/cheesesmithing/verdant_buckler": "\u7fe0\u7eff\u5706\u76fe",
            "/actions/cheesesmithing/verdant_bulwark": "\u7fe0\u7eff\u91cd\u76fe",
            "/actions/cheesesmithing/verdant_plate_legs": "\u7fe0\u7eff\u817f\u7532",
            "/actions/cheesesmithing/verdant_plate_body": "\u7fe0\u7eff\u80f8\u7532",
            "/actions/cheesesmithing/azure_cheese": "\u851a\u84dd\u5976\u916a",
            "/actions/cheesesmithing/azure_boots": "\u851a\u84dd\u9774",
            "/actions/cheesesmithing/azure_gauntlets": "\u851a\u84dd\u62a4\u624b",
            "/actions/cheesesmithing/azure_sword": "\u851a\u84dd\u5251",
            "/actions/cheesesmithing/azure_brush": "\u851a\u84dd\u5237\u5b50",
            "/actions/cheesesmithing/azure_shears": "\u851a\u84dd\u526a\u5200",
            "/actions/cheesesmithing/azure_hatchet": "\u851a\u84dd\u65a7\u5934",
            "/actions/cheesesmithing/azure_spear": "\u851a\u84dd\u957f\u67aa",
            "/actions/cheesesmithing/azure_hammer": "\u851a\u84dd\u9524\u5b50",
            "/actions/cheesesmithing/azure_chisel": "\u851a\u84dd\u51ff\u5b50",
            "/actions/cheesesmithing/azure_needle": "\u851a\u84dd\u9488",
            "/actions/cheesesmithing/azure_spatula": "\u851a\u84dd\u9505\u94f2",
            "/actions/cheesesmithing/azure_pot": "\u851a\u84dd\u58f6",
            "/actions/cheesesmithing/azure_mace": "\u851a\u84dd\u9489\u5934\u9524",
            "/actions/cheesesmithing/pincer_gloves": "\u87f9\u94b3\u624b\u5957",
            "/actions/cheesesmithing/azure_alembic": "\u851a\u84dd\u84b8\u998f\u5668",
            "/actions/cheesesmithing/azure_enhancer": "\u851a\u84dd\u5f3a\u5316\u5668",
            "/actions/cheesesmithing/azure_helmet": "\u851a\u84dd\u5934\u76d4",
            "/actions/cheesesmithing/azure_buckler": "\u851a\u84dd\u5706\u76fe",
            "/actions/cheesesmithing/azure_bulwark": "\u851a\u84dd\u91cd\u76fe",
            "/actions/cheesesmithing/azure_plate_legs": "\u851a\u84dd\u817f\u7532",
            "/actions/cheesesmithing/snail_shell_helmet": "\u8717\u725b\u58f3\u5934\u76d4",
            "/actions/cheesesmithing/azure_plate_body": "\u851a\u84dd\u80f8\u7532",
            "/actions/cheesesmithing/turtle_shell_legs": "\u9f9f\u58f3\u817f\u7532",
            "/actions/cheesesmithing/turtle_shell_body": "\u9f9f\u58f3\u80f8\u7532",
            "/actions/cheesesmithing/burble_cheese": "\u6df1\u7d2b\u5976\u916a",
            "/actions/cheesesmithing/burble_boots": "\u6df1\u7d2b\u9774",
            "/actions/cheesesmithing/burble_gauntlets": "\u6df1\u7d2b\u62a4\u624b",
            "/actions/cheesesmithing/burble_sword": "\u6df1\u7d2b\u5251",
            "/actions/cheesesmithing/burble_brush": "\u6df1\u7d2b\u5237\u5b50",
            "/actions/cheesesmithing/burble_shears": "\u6df1\u7d2b\u526a\u5200",
            "/actions/cheesesmithing/burble_hatchet": "\u6df1\u7d2b\u65a7\u5934",
            "/actions/cheesesmithing/burble_spear": "\u6df1\u7d2b\u957f\u67aa",
            "/actions/cheesesmithing/burble_hammer": "\u6df1\u7d2b\u9524\u5b50",
            "/actions/cheesesmithing/burble_chisel": "\u6df1\u7d2b\u51ff\u5b50",
            "/actions/cheesesmithing/burble_needle": "\u6df1\u7d2b\u9488",
            "/actions/cheesesmithing/burble_spatula": "\u6df1\u7d2b\u9505\u94f2",
            "/actions/cheesesmithing/burble_pot": "\u6df1\u7d2b\u58f6",
            "/actions/cheesesmithing/burble_mace": "\u6df1\u7d2b\u9489\u5934\u9524",
            "/actions/cheesesmithing/burble_alembic": "\u6df1\u7d2b\u84b8\u998f\u5668",
            "/actions/cheesesmithing/burble_enhancer": "\u6df1\u7d2b\u5f3a\u5316\u5668",
            "/actions/cheesesmithing/burble_helmet": "\u6df1\u7d2b\u5934\u76d4",
            "/actions/cheesesmithing/burble_buckler": "\u6df1\u7d2b\u5706\u76fe",
            "/actions/cheesesmithing/burble_bulwark": "\u6df1\u7d2b\u91cd\u76fe",
            "/actions/cheesesmithing/burble_plate_legs": "\u6df1\u7d2b\u817f\u7532",
            "/actions/cheesesmithing/burble_plate_body": "\u6df1\u7d2b\u80f8\u7532",
            "/actions/cheesesmithing/crimson_cheese": "\u7edb\u7ea2\u5976\u916a",
            "/actions/cheesesmithing/crimson_boots": "\u7edb\u7ea2\u9774",
            "/actions/cheesesmithing/crimson_gauntlets": "\u7edb\u7ea2\u62a4\u624b",
            "/actions/cheesesmithing/crimson_sword": "\u7edb\u7ea2\u5251",
            "/actions/cheesesmithing/crimson_brush": "\u7edb\u7ea2\u5237\u5b50",
            "/actions/cheesesmithing/crimson_shears": "\u7edb\u7ea2\u526a\u5200",
            "/actions/cheesesmithing/crimson_hatchet": "\u7edb\u7ea2\u65a7\u5934",
            "/actions/cheesesmithing/crimson_spear": "\u7edb\u7ea2\u957f\u67aa",
            "/actions/cheesesmithing/crimson_hammer": "\u7edb\u7ea2\u9524\u5b50",
            "/actions/cheesesmithing/crimson_chisel": "\u7edb\u7ea2\u51ff\u5b50",
            "/actions/cheesesmithing/crimson_needle": "\u7edb\u7ea2\u9488",
            "/actions/cheesesmithing/crimson_spatula": "\u7edb\u7ea2\u9505\u94f2",
            "/actions/cheesesmithing/crimson_pot": "\u7edb\u7ea2\u58f6",
            "/actions/cheesesmithing/crimson_mace": "\u7edb\u7ea2\u9489\u5934\u9524",
            "/actions/cheesesmithing/crimson_alembic": "\u7edb\u7ea2\u84b8\u998f\u5668",
            "/actions/cheesesmithing/crimson_enhancer": "\u7edb\u7ea2\u5f3a\u5316\u5668",
            "/actions/cheesesmithing/crimson_helmet": "\u7edb\u7ea2\u5934\u76d4",
            "/actions/cheesesmithing/crimson_buckler": "\u7edb\u7ea2\u5706\u76fe",
            "/actions/cheesesmithing/crimson_bulwark": "\u7edb\u7ea2\u91cd\u76fe",
            "/actions/cheesesmithing/crimson_plate_legs": "\u7edb\u7ea2\u817f\u7532",
            "/actions/cheesesmithing/vision_helmet": "\u89c6\u89c9\u5934\u76d4",
            "/actions/cheesesmithing/vision_shield": "\u89c6\u89c9\u76fe",
            "/actions/cheesesmithing/crimson_plate_body": "\u7edb\u7ea2\u80f8\u7532",
            "/actions/cheesesmithing/rainbow_cheese": "\u5f69\u8679\u5976\u916a",
            "/actions/cheesesmithing/rainbow_boots": "\u5f69\u8679\u9774",
            "/actions/cheesesmithing/black_bear_shoes": "\u9ed1\u718a\u978b",
            "/actions/cheesesmithing/grizzly_bear_shoes": "\u68d5\u718a\u978b",
            "/actions/cheesesmithing/polar_bear_shoes": "\u5317\u6781\u718a\u978b",
            "/actions/cheesesmithing/rainbow_gauntlets": "\u5f69\u8679\u62a4\u624b",
            "/actions/cheesesmithing/rainbow_sword": "\u5f69\u8679\u5251",
            "/actions/cheesesmithing/panda_gloves": "\u718a\u732b\u624b\u5957",
            "/actions/cheesesmithing/rainbow_brush": "\u5f69\u8679\u5237\u5b50",
            "/actions/cheesesmithing/rainbow_shears": "\u5f69\u8679\u526a\u5200",
            "/actions/cheesesmithing/rainbow_hatchet": "\u5f69\u8679\u65a7\u5934",
            "/actions/cheesesmithing/rainbow_spear": "\u5f69\u8679\u957f\u67aa",
            "/actions/cheesesmithing/rainbow_hammer": "\u5f69\u8679\u9524\u5b50",
            "/actions/cheesesmithing/rainbow_chisel": "\u5f69\u8679\u51ff\u5b50",
            "/actions/cheesesmithing/rainbow_needle": "\u5f69\u8679\u9488",
            "/actions/cheesesmithing/rainbow_spatula": "\u5f69\u8679\u9505\u94f2",
            "/actions/cheesesmithing/rainbow_pot": "\u5f69\u8679\u58f6",
            "/actions/cheesesmithing/rainbow_mace": "\u5f69\u8679\u9489\u5934\u9524",
            "/actions/cheesesmithing/rainbow_alembic": "\u5f69\u8679\u84b8\u998f\u5668",
            "/actions/cheesesmithing/rainbow_enhancer": "\u5f69\u8679\u5f3a\u5316\u5668",
            "/actions/cheesesmithing/rainbow_helmet": "\u5f69\u8679\u5934\u76d4",
            "/actions/cheesesmithing/rainbow_buckler": "\u5f69\u8679\u5706\u76fe",
            "/actions/cheesesmithing/rainbow_bulwark": "\u5f69\u8679\u91cd\u76fe",
            "/actions/cheesesmithing/rainbow_plate_legs": "\u5f69\u8679\u817f\u7532",
            "/actions/cheesesmithing/rainbow_plate_body": "\u5f69\u8679\u80f8\u7532",
            "/actions/cheesesmithing/holy_cheese": "\u795e\u5723\u5976\u916a",
            "/actions/cheesesmithing/holy_boots": "\u795e\u5723\u9774",
            "/actions/cheesesmithing/holy_gauntlets": "\u795e\u5723\u62a4\u624b",
            "/actions/cheesesmithing/holy_sword": "\u795e\u5723\u5251",
            "/actions/cheesesmithing/holy_brush": "\u795e\u5723\u5237\u5b50",
            "/actions/cheesesmithing/holy_shears": "\u795e\u5723\u526a\u5200",
            "/actions/cheesesmithing/holy_hatchet": "\u795e\u5723\u65a7\u5934",
            "/actions/cheesesmithing/holy_spear": "\u795e\u5723\u957f\u67aa",
            "/actions/cheesesmithing/holy_hammer": "\u795e\u5723\u9524\u5b50",
            "/actions/cheesesmithing/holy_chisel": "\u795e\u5723\u51ff\u5b50",
            "/actions/cheesesmithing/holy_needle": "\u795e\u5723\u9488",
            "/actions/cheesesmithing/holy_spatula": "\u795e\u5723\u9505\u94f2",
            "/actions/cheesesmithing/holy_pot": "\u795e\u5723\u58f6",
            "/actions/cheesesmithing/holy_mace": "\u795e\u5723\u9489\u5934\u9524",
            "/actions/cheesesmithing/magnetic_gloves": "\u78c1\u529b\u624b\u5957",
            "/actions/cheesesmithing/stalactite_spear": "\u77f3\u949f\u957f\u67aa",
            "/actions/cheesesmithing/granite_bludgeon": "\u82b1\u5c97\u5ca9\u5927\u68d2",
            "/actions/cheesesmithing/vampire_fang_dirk": "\u5438\u8840\u9b3c\u77ed\u5251",
            "/actions/cheesesmithing/werewolf_slasher": "\u72fc\u4eba\u5173\u5200",
            "/actions/cheesesmithing/holy_alembic": "\u795e\u5723\u84b8\u998f\u5668",
            "/actions/cheesesmithing/holy_enhancer": "\u795e\u5723\u5f3a\u5316\u5668",
            "/actions/cheesesmithing/holy_helmet": "\u795e\u5723\u5934\u76d4",
            "/actions/cheesesmithing/holy_buckler": "\u795e\u5723\u5706\u76fe",
            "/actions/cheesesmithing/holy_bulwark": "\u795e\u5723\u91cd\u76fe",
            "/actions/cheesesmithing/holy_plate_legs": "\u795e\u5723\u817f\u7532",
            "/actions/cheesesmithing/holy_plate_body": "\u795e\u5723\u80f8\u7532",
            "/actions/cheesesmithing/celestial_brush": "\u661f\u7a7a\u5237\u5b50",
            "/actions/cheesesmithing/celestial_shears": "\u661f\u7a7a\u526a\u5200",
            "/actions/cheesesmithing/celestial_hatchet": "\u661f\u7a7a\u65a7\u5934",
            "/actions/cheesesmithing/celestial_hammer": "\u661f\u7a7a\u9524\u5b50",
            "/actions/cheesesmithing/celestial_chisel": "\u661f\u7a7a\u51ff\u5b50",
            "/actions/cheesesmithing/celestial_needle": "\u661f\u7a7a\u9488",
            "/actions/cheesesmithing/celestial_spatula": "\u661f\u7a7a\u9505\u94f2",
            "/actions/cheesesmithing/celestial_pot": "\u661f\u7a7a\u58f6",
            "/actions/cheesesmithing/celestial_alembic": "\u661f\u7a7a\u84b8\u998f\u5668",
            "/actions/cheesesmithing/celestial_enhancer": "\u661f\u7a7a\u5f3a\u5316\u5668",
            "/actions/cheesesmithing/colossus_plate_body": "\u5de8\u50cf\u80f8\u7532",
            "/actions/cheesesmithing/colossus_plate_legs": "\u5de8\u50cf\u817f\u7532",
            "/actions/cheesesmithing/demonic_plate_body": "\u6076\u9b54\u80f8\u7532",
            "/actions/cheesesmithing/demonic_plate_legs": "\u6076\u9b54\u817f\u7532",
            "/actions/cheesesmithing/spiked_bulwark": "\u5c16\u523a\u91cd\u76fe",
            "/actions/cheesesmithing/dodocamel_gauntlets": "\u6e21\u6e21\u9a7c\u62a4\u624b",
            "/actions/cheesesmithing/corsair_helmet": "\u63a0\u593a\u8005\u5934\u76d4",
            "/actions/cheesesmithing/knights_aegis": "\u9a91\u58eb\u76fe",
            "/actions/cheesesmithing/anchorbound_plate_legs": "\u951a\u5b9a\u817f\u7532",
            "/actions/cheesesmithing/maelstrom_plate_legs": "\u6012\u6d9b\u817f\u7532",
            "/actions/cheesesmithing/griffin_bulwark": "\u72ee\u9e6b\u91cd\u76fe",
            "/actions/cheesesmithing/furious_spear": "\u72c2\u6012\u957f\u67aa",
            "/actions/cheesesmithing/chaotic_flail": "\u6df7\u6c8c\u8fde\u67b7",
            "/actions/cheesesmithing/regal_sword": "\u541b\u738b\u4e4b\u5251",
            "/actions/cheesesmithing/anchorbound_plate_body": "\u951a\u5b9a\u80f8\u7532",
            "/actions/cheesesmithing/maelstrom_plate_body": "\u6012\u6d9b\u80f8\u7532",
            "/actions/crafting/lumber": "\u6728\u677f",
            "/actions/crafting/wooden_crossbow": "\u6728\u5f29",
            "/actions/crafting/wooden_water_staff": "\u6728\u5236\u6c34\u6cd5\u6756",
            "/actions/crafting/basic_task_badge": "\u57fa\u7840\u4efb\u52a1\u5fbd\u7ae0",
            "/actions/crafting/advanced_task_badge": "\u9ad8\u7ea7\u4efb\u52a1\u5fbd\u7ae0",
            "/actions/crafting/expert_task_badge": "\u4e13\u5bb6\u4efb\u52a1\u5fbd\u7ae0",
            "/actions/crafting/wooden_shield": "\u6728\u76fe",
            "/actions/crafting/wooden_nature_staff": "\u6728\u5236\u81ea\u7136\u6cd5\u6756",
            "/actions/crafting/wooden_bow": "\u6728\u5f13",
            "/actions/crafting/wooden_fire_staff": "\u6728\u5236\u706b\u6cd5\u6756",
            "/actions/crafting/birch_lumber": "\u767d\u6866\u6728\u677f",
            "/actions/crafting/birch_crossbow": "\u6866\u6728\u5f29",
            "/actions/crafting/birch_water_staff": "\u6866\u6728\u6c34\u6cd5\u6756",
            "/actions/crafting/crushed_pearl": "\u73cd\u73e0\u788e\u7247",
            "/actions/crafting/birch_shield": "\u6866\u6728\u76fe",
            "/actions/crafting/birch_nature_staff": "\u6866\u6728\u81ea\u7136\u6cd5\u6756",
            "/actions/crafting/birch_bow": "\u6866\u6728\u5f13",
            "/actions/crafting/ring_of_gathering": "\u91c7\u96c6\u6212\u6307",
            "/actions/crafting/birch_fire_staff": "\u6866\u6728\u706b\u6cd5\u6756",
            "/actions/crafting/earrings_of_gathering": "\u91c7\u96c6\u8033\u73af",
            "/actions/crafting/cedar_lumber": "\u96ea\u677e\u6728\u677f",
            "/actions/crafting/cedar_crossbow": "\u96ea\u677e\u5f29",
            "/actions/crafting/cedar_water_staff": "\u96ea\u677e\u6c34\u6cd5\u6756",
            "/actions/crafting/cedar_shield": "\u96ea\u677e\u76fe",
            "/actions/crafting/cedar_nature_staff": "\u96ea\u677e\u81ea\u7136\u6cd5\u6756",
            "/actions/crafting/cedar_bow": "\u96ea\u677e\u5f13",
            "/actions/crafting/crushed_amber": "\u7425\u73c0\u788e\u7247",
            "/actions/crafting/cedar_fire_staff": "\u96ea\u677e\u706b\u6cd5\u6756",
            "/actions/crafting/ring_of_essence_find": "\u7cbe\u534e\u53d1\u73b0\u6212\u6307",
            "/actions/crafting/earrings_of_essence_find": "\u7cbe\u534e\u53d1\u73b0\u8033\u73af",
            "/actions/crafting/necklace_of_efficiency": "\u6548\u7387\u9879\u94fe",
            "/actions/crafting/purpleheart_lumber": "\u7d2b\u5fc3\u6728\u677f",
            "/actions/crafting/purpleheart_crossbow": "\u7d2b\u5fc3\u5f29",
            "/actions/crafting/purpleheart_water_staff": "\u7d2b\u5fc3\u6c34\u6cd5\u6756",
            "/actions/crafting/purpleheart_shield": "\u7d2b\u5fc3\u76fe",
            "/actions/crafting/purpleheart_nature_staff": "\u7d2b\u5fc3\u81ea\u7136\u6cd5\u6756",
            "/actions/crafting/purpleheart_bow": "\u7d2b\u5fc3\u5f13",
            "/actions/crafting/crushed_garnet": "\u77f3\u69b4\u77f3\u788e\u7247",
            "/actions/crafting/crushed_jade": "\u7fe1\u7fe0\u788e\u7247",
            "/actions/crafting/crushed_amethyst": "\u7d2b\u6c34\u6676\u788e\u7247",
            "/actions/crafting/catalyst_of_coinification": "\u70b9\u91d1\u50ac\u5316\u5242",
            "/actions/crafting/treant_shield": "\u6811\u4eba\u76fe",
            "/actions/crafting/purpleheart_fire_staff": "\u7d2b\u5fc3\u706b\u6cd5\u6756",
            "/actions/crafting/ring_of_regeneration": "\u6062\u590d\u6212\u6307",
            "/actions/crafting/earrings_of_regeneration": "\u6062\u590d\u8033\u73af",
            "/actions/crafting/fighter_necklace": "\u6218\u58eb\u9879\u94fe",
            "/actions/crafting/ginkgo_lumber": "\u94f6\u674f\u6728\u677f",
            "/actions/crafting/ginkgo_crossbow": "\u94f6\u674f\u5f29",
            "/actions/crafting/ginkgo_water_staff": "\u94f6\u674f\u6c34\u6cd5\u6756",
            "/actions/crafting/ring_of_armor": "\u62a4\u7532\u6212\u6307",
            "/actions/crafting/catalyst_of_decomposition": "\u5206\u89e3\u50ac\u5316\u5242",
            "/actions/crafting/ginkgo_shield": "\u94f6\u674f\u76fe",
            "/actions/crafting/earrings_of_armor": "\u62a4\u7532\u8033\u73af",
            "/actions/crafting/ginkgo_nature_staff": "\u94f6\u674f\u81ea\u7136\u6cd5\u6756",
            "/actions/crafting/ranger_necklace": "\u5c04\u624b\u9879\u94fe",
            "/actions/crafting/ginkgo_bow": "\u94f6\u674f\u5f13",
            "/actions/crafting/ring_of_resistance": "\u6297\u6027\u6212\u6307",
            "/actions/crafting/crushed_moonstone": "\u6708\u4eae\u77f3\u788e\u7247",
            "/actions/crafting/ginkgo_fire_staff": "\u94f6\u674f\u706b\u6cd5\u6756",
            "/actions/crafting/earrings_of_resistance": "\u6297\u6027\u8033\u73af",
            "/actions/crafting/wizard_necklace": "\u5deb\u5e08\u9879\u94fe",
            "/actions/crafting/ring_of_rare_find": "\u7a00\u6709\u53d1\u73b0\u6212\u6307",
            "/actions/crafting/catalyst_of_transmutation": "\u8f6c\u5316\u50ac\u5316\u5242",
            "/actions/crafting/earrings_of_rare_find": "\u7a00\u6709\u53d1\u73b0\u8033\u73af",
            "/actions/crafting/necklace_of_wisdom": "\u7ecf\u9a8c\u9879\u94fe",
            "/actions/crafting/redwood_lumber": "\u7ea2\u6749\u6728\u677f",
            "/actions/crafting/redwood_crossbow": "\u7ea2\u6749\u5f29",
            "/actions/crafting/redwood_water_staff": "\u7ea2\u6749\u6c34\u6cd5\u6756",
            "/actions/crafting/redwood_shield": "\u7ea2\u6749\u76fe",
            "/actions/crafting/redwood_nature_staff": "\u7ea2\u6749\u81ea\u7136\u6cd5\u6756",
            "/actions/crafting/redwood_bow": "\u7ea2\u6749\u5f13",
            "/actions/crafting/crushed_sunstone": "\u592a\u9633\u77f3\u788e\u7247",
            "/actions/crafting/chimerical_entry_key": "\u5947\u5e7b\u94a5\u5319",
            "/actions/crafting/chimerical_chest_key": "\u5947\u5e7b\u5b9d\u7bb1\u94a5\u5319",
            "/actions/crafting/eye_watch": "\u638c\u4e0a\u76d1\u5de5",
            "/actions/crafting/watchful_relic": "\u8b66\u6212\u9057\u7269",
            "/actions/crafting/redwood_fire_staff": "\u7ea2\u6749\u706b\u6cd5\u6756",
            "/actions/crafting/ring_of_critical_strike": "\u66b4\u51fb\u6212\u6307",
            "/actions/crafting/mirror_of_protection": "\u4fdd\u62a4\u4e4b\u955c",
            "/actions/crafting/earrings_of_critical_strike": "\u66b4\u51fb\u8033\u73af",
            "/actions/crafting/necklace_of_speed": "\u901f\u5ea6\u9879\u94fe",
            "/actions/crafting/arcane_lumber": "\u795e\u79d8\u6728\u677f",
            "/actions/crafting/arcane_crossbow": "\u795e\u79d8\u5f29",
            "/actions/crafting/arcane_water_staff": "\u795e\u79d8\u6c34\u6cd5\u6756",
            "/actions/crafting/sinister_entry_key": "\u9634\u68ee\u94a5\u5319",
            "/actions/crafting/sinister_chest_key": "\u9634\u68ee\u5b9d\u7bb1\u94a5\u5319",
            "/actions/crafting/arcane_shield": "\u795e\u79d8\u76fe",
            "/actions/crafting/arcane_nature_staff": "\u795e\u79d8\u81ea\u7136\u6cd5\u6756",
            "/actions/crafting/manticore_shield": "\u874e\u72ee\u76fe",
            "/actions/crafting/arcane_bow": "\u795e\u79d8\u5f13",
            "/actions/crafting/enchanted_entry_key": "\u79d8\u6cd5\u94a5\u5319",
            "/actions/crafting/enchanted_chest_key": "\u79d8\u6cd5\u5b9d\u7bb1\u94a5\u5319",
            "/actions/crafting/pirate_entry_key": "\u6d77\u76d7\u94a5\u5319",
            "/actions/crafting/pirate_chest_key": "\u6d77\u76d7\u5b9d\u7bb1\u94a5\u5319",
            "/actions/crafting/arcane_fire_staff": "\u795e\u79d8\u706b\u6cd5\u6756",
            "/actions/crafting/vampiric_bow": "\u5438\u8840\u5f13",
            "/actions/crafting/soul_hunter_crossbow": "\u7075\u9b42\u730e\u624b\u5f29",
            "/actions/crafting/rippling_trident": "\u6d9f\u6f2a\u4e09\u53c9\u621f",
            "/actions/crafting/blooming_trident": "\u7efd\u653e\u4e09\u53c9\u621f",
            "/actions/crafting/blazing_trident": "\u70bd\u7130\u4e09\u53c9\u621f",
            "/actions/crafting/frost_staff": "\u51b0\u971c\u6cd5\u6756",
            "/actions/crafting/infernal_battlestaff": "\u70bc\u72f1\u6cd5\u6756",
            "/actions/crafting/jackalope_staff": "\u9e7f\u89d2\u5154\u4e4b\u6756",
            "/actions/crafting/philosophers_ring": "\u8d24\u8005\u6212\u6307",
            "/actions/crafting/crushed_philosophers_stone": "\u8d24\u8005\u4e4b\u77f3\u788e\u7247",
            "/actions/crafting/philosophers_earrings": "\u8d24\u8005\u8033\u73af",
            "/actions/crafting/philosophers_necklace": "\u8d24\u8005\u9879\u94fe",
            "/actions/crafting/bishops_codex": "\u4e3b\u6559\u6cd5\u5178",
            "/actions/crafting/cursed_bow": "\u5492\u6028\u4e4b\u5f13",
            "/actions/crafting/sundering_crossbow": "\u88c2\u7a7a\u4e4b\u5f29",
            "/actions/tailoring/rough_leather": "\u7c97\u7cd9\u76ae\u9769",
            "/actions/tailoring/cotton_fabric": "\u68c9\u82b1\u5e03\u6599",
            "/actions/tailoring/rough_boots": "\u7c97\u7cd9\u9774",
            "/actions/tailoring/cotton_boots": "\u68c9\u9774",
            "/actions/tailoring/rough_bracers": "\u7c97\u7cd9\u62a4\u8155",
            "/actions/tailoring/cotton_gloves": "\u68c9\u624b\u5957",
            "/actions/tailoring/small_pouch": "\u5c0f\u888b\u5b50",
            "/actions/tailoring/rough_hood": "\u7c97\u7cd9\u515c\u5e3d",
            "/actions/tailoring/cotton_hat": "\u68c9\u5e3d",
            "/actions/tailoring/rough_chaps": "\u7c97\u7cd9\u76ae\u88e4",
            "/actions/tailoring/cotton_robe_bottoms": "\u68c9\u5e03\u888d\u88d9",
            "/actions/tailoring/rough_tunic": "\u7c97\u7cd9\u76ae\u8863",
            "/actions/tailoring/cotton_robe_top": "\u68c9\u5e03\u888d\u670d",
            "/actions/tailoring/reptile_leather": "\u722c\u884c\u52a8\u7269\u76ae\u9769",
            "/actions/tailoring/linen_fabric": "\u4e9a\u9ebb\u5e03\u6599",
            "/actions/tailoring/reptile_boots": "\u722c\u884c\u52a8\u7269\u9774",
            "/actions/tailoring/linen_boots": "\u4e9a\u9ebb\u9774",
            "/actions/tailoring/reptile_bracers": "\u722c\u884c\u52a8\u7269\u62a4\u8155",
            "/actions/tailoring/linen_gloves": "\u4e9a\u9ebb\u624b\u5957",
            "/actions/tailoring/reptile_hood": "\u722c\u884c\u52a8\u7269\u515c\u5e3d",
            "/actions/tailoring/linen_hat": "\u4e9a\u9ebb\u5e3d",
            "/actions/tailoring/reptile_chaps": "\u722c\u884c\u52a8\u7269\u76ae\u88e4",
            "/actions/tailoring/linen_robe_bottoms": "\u4e9a\u9ebb\u888d\u88d9",
            "/actions/tailoring/medium_pouch": "\u4e2d\u888b\u5b50",
            "/actions/tailoring/reptile_tunic": "\u722c\u884c\u52a8\u7269\u76ae\u8863",
            "/actions/tailoring/linen_robe_top": "\u4e9a\u9ebb\u888d\u670d",
            "/actions/tailoring/shoebill_shoes": "\u9cb8\u5934\u9e73\u978b",
            "/actions/tailoring/gobo_leather": "\u54e5\u5e03\u6797\u76ae\u9769",
            "/actions/tailoring/bamboo_fabric": "\u7af9\u5b50\u5e03\u6599",
            "/actions/tailoring/gobo_boots": "\u54e5\u5e03\u6797\u9774",
            "/actions/tailoring/bamboo_boots": "\u7af9\u9774",
            "/actions/tailoring/gobo_bracers": "\u54e5\u5e03\u6797\u62a4\u8155",
            "/actions/tailoring/bamboo_gloves": "\u7af9\u624b\u5957",
            "/actions/tailoring/gobo_hood": "\u54e5\u5e03\u6797\u515c\u5e3d",
            "/actions/tailoring/bamboo_hat": "\u7af9\u5e3d",
            "/actions/tailoring/gobo_chaps": "\u54e5\u5e03\u6797\u76ae\u88e4",
            "/actions/tailoring/bamboo_robe_bottoms": "\u7af9\u5e03\u888d\u88d9",
            "/actions/tailoring/large_pouch": "\u5927\u888b\u5b50",
            "/actions/tailoring/gobo_tunic": "\u54e5\u5e03\u6797\u76ae\u8863",
            "/actions/tailoring/bamboo_robe_top": "\u7af9\u888d\u670d",
            "/actions/tailoring/marine_tunic": "\u6d77\u6d0b\u76ae\u8863",
            "/actions/tailoring/marine_chaps": "\u822a\u6d77\u76ae\u88e4",
            "/actions/tailoring/icy_robe_top": "\u51b0\u971c\u888d\u670d",
            "/actions/tailoring/icy_robe_bottoms": "\u51b0\u971c\u888d\u88d9",
            "/actions/tailoring/flaming_robe_top": "\u70c8\u7130\u888d\u670d",
            "/actions/tailoring/flaming_robe_bottoms": "\u70c8\u7130\u888d\u88d9",
            "/actions/tailoring/beast_leather": "\u91ce\u517d\u76ae\u9769",
            "/actions/tailoring/silk_fabric": "\u4e1d\u7ef8",
            "/actions/tailoring/beast_boots": "\u91ce\u517d\u9774",
            "/actions/tailoring/silk_boots": "\u4e1d\u9774",
            "/actions/tailoring/beast_bracers": "\u91ce\u517d\u62a4\u8155",
            "/actions/tailoring/silk_gloves": "\u4e1d\u624b\u5957",
            "/actions/tailoring/collectors_boots": "\u6536\u85cf\u5bb6\u4e4b\u9774",
            "/actions/tailoring/sighted_bracers": "\u7784\u51c6\u62a4\u8155",
            "/actions/tailoring/beast_hood": "\u91ce\u517d\u515c\u5e3d",
            "/actions/tailoring/silk_hat": "\u4e1d\u5e3d",
            "/actions/tailoring/beast_chaps": "\u91ce\u517d\u76ae\u88e4",
            "/actions/tailoring/silk_robe_bottoms": "\u4e1d\u7ef8\u888d\u88d9",
            "/actions/tailoring/centaur_boots": "\u534a\u4eba\u9a6c\u9774",
            "/actions/tailoring/sorcerer_boots": "\u5deb\u5e08\u9774",
            "/actions/tailoring/giant_pouch": "\u5de8\u5927\u888b\u5b50",
            "/actions/tailoring/beast_tunic": "\u91ce\u517d\u76ae\u8863",
            "/actions/tailoring/silk_robe_top": "\u4e1d\u7ef8\u888d\u670d",
            "/actions/tailoring/red_culinary_hat": "\u7ea2\u8272\u53a8\u5e08\u5e3d",
            "/actions/tailoring/luna_robe_top": "\u6708\u795e\u888d\u670d",
            "/actions/tailoring/luna_robe_bottoms": "\u6708\u795e\u888d\u88d9",
            "/actions/tailoring/umbral_leather": "\u6697\u5f71\u76ae\u9769",
            "/actions/tailoring/radiant_fabric": "\u5149\u8f89\u5e03\u6599",
            "/actions/tailoring/umbral_boots": "\u6697\u5f71\u9774",
            "/actions/tailoring/radiant_boots": "\u5149\u8f89\u9774",
            "/actions/tailoring/umbral_bracers": "\u6697\u5f71\u62a4\u8155",
            "/actions/tailoring/radiant_gloves": "\u5149\u8f89\u624b\u5957",
            "/actions/tailoring/enchanted_gloves": "\u9644\u9b54\u624b\u5957",
            "/actions/tailoring/fluffy_red_hat": "\u84ec\u677e\u7ea2\u5e3d\u5b50",
            "/actions/tailoring/chrono_gloves": "\u65f6\u7a7a\u624b\u5957",
            "/actions/tailoring/umbral_hood": "\u6697\u5f71\u515c\u5e3d",
            "/actions/tailoring/radiant_hat": "\u5149\u8f89\u5e3d",
            "/actions/tailoring/umbral_chaps": "\u6697\u5f71\u76ae\u88e4",
            "/actions/tailoring/radiant_robe_bottoms": "\u5149\u8f89\u888d\u88d9",
            "/actions/tailoring/umbral_tunic": "\u6697\u5f71\u76ae\u8863",
            "/actions/tailoring/radiant_robe_top": "\u5149\u8f89\u888d\u670d",
            "/actions/tailoring/revenant_chaps": "\u4ea1\u7075\u76ae\u88e4",
            "/actions/tailoring/griffin_chaps": "\u72ee\u9e6b\u62a4\u817f",
            "/actions/tailoring/dairyhands_top": "\u6324\u5976\u5de5\u4e0a\u8863",
            "/actions/tailoring/dairyhands_bottoms": "\u6324\u5976\u5de5\u4e0b\u88c5",
            "/actions/tailoring/foragers_top": "\u91c7\u6458\u8005\u4e0a\u8863",
            "/actions/tailoring/foragers_bottoms": "\u91c7\u6458\u8005\u4e0b\u88c5",
            "/actions/tailoring/lumberjacks_top": "\u4f10\u6728\u5de5\u4e0a\u8863",
            "/actions/tailoring/lumberjacks_bottoms": "\u4f10\u6728\u5de5\u4e0b\u88c5",
            "/actions/tailoring/cheesemakers_top": "\u5976\u916a\u5e08\u4e0a\u8863",
            "/actions/tailoring/cheesemakers_bottoms": "\u5976\u916a\u5e08\u4e0b\u88c5",
            "/actions/tailoring/crafters_top": "\u5de5\u5320\u4e0a\u8863",
            "/actions/tailoring/crafters_bottoms": "\u5de5\u5320\u4e0b\u88c5",
            "/actions/tailoring/tailors_top": "\u88c1\u7f1d\u4e0a\u8863",
            "/actions/tailoring/tailors_bottoms": "\u88c1\u7f1d\u4e0b\u88c5",
            "/actions/tailoring/chefs_top": "\u53a8\u5e08\u4e0a\u8863",
            "/actions/tailoring/chefs_bottoms": "\u53a8\u5e08\u4e0b\u88c5",
            "/actions/tailoring/brewers_top": "\u996e\u54c1\u5e08\u4e0a\u8863",
            "/actions/tailoring/brewers_bottoms": "\u996e\u54c1\u5e08\u4e0b\u88c5",
            "/actions/tailoring/alchemists_top": "\u70bc\u91d1\u5e08\u7684\u4e0a\u8863",
            "/actions/tailoring/alchemists_bottoms": "\u70bc\u91d1\u5e08\u4e0b\u88c5",
            "/actions/tailoring/enhancers_top": "\u5f3a\u5316\u5e08\u4e0a\u8863",
            "/actions/tailoring/enhancers_bottoms": "\u5f3a\u5316\u5e08\u4e0b\u88c5",
            "/actions/tailoring/revenant_tunic": "\u4ea1\u7075\u76ae\u8863",
            "/actions/tailoring/griffin_tunic": "\u72ee\u9e6b\u76ae\u8863",
            "/actions/tailoring/gluttonous_pouch": "\u8d2a\u98df\u4e4b\u888b",
            "/actions/tailoring/guzzling_pouch": "\u66b4\u996e\u4e4b\u56ca",
            "/actions/tailoring/marksman_bracers": "\u795e\u5c04\u62a4\u8155",
            "/actions/tailoring/acrobatic_hood": "\u6742\u6280\u5e08\u515c\u5e3d",
            "/actions/tailoring/magicians_hat": "\u9b54\u672f\u5e08\u4e4b\u5e3d",
            "/actions/tailoring/kraken_chaps": "\u514b\u62c9\u80af\u76ae\u88e4",
            "/actions/tailoring/royal_water_robe_bottoms": "\u7687\u5bb6\u6c34\u7cfb\u888d\u88d9",
            "/actions/tailoring/royal_nature_robe_bottoms": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u88d9",
            "/actions/tailoring/royal_fire_robe_bottoms": "\u7687\u5bb6\u706b\u7cfb\u888d\u88d9",
            "/actions/tailoring/kraken_tunic": "\u514b\u62c9\u80af\u76ae\u8863",
            "/actions/tailoring/royal_water_robe_top": "\u7687\u5bb6\u6c34\u7cfb\u888d\u670d",
            "/actions/tailoring/royal_nature_robe_top": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u670d",
            "/actions/tailoring/royal_fire_robe_top": "\u7687\u5bb6\u706b\u7cfb\u888d\u670d",
            "/actions/cooking/donut": "\u751c\u751c\u5708",
            "/actions/cooking/cupcake": "\u7eb8\u676f\u86cb\u7cd5",
            "/actions/cooking/gummy": "\u8f6f\u7cd6",
            "/actions/cooking/yogurt": "\u9178\u5976",
            "/actions/cooking/blueberry_donut": "\u84dd\u8393\u751c\u751c\u5708",
            "/actions/cooking/blueberry_cake": "\u84dd\u8393\u86cb\u7cd5",
            "/actions/cooking/apple_gummy": "\u82f9\u679c\u8f6f\u7cd6",
            "/actions/cooking/apple_yogurt": "\u82f9\u679c\u9178\u5976",
            "/actions/cooking/blackberry_donut": "\u9ed1\u8393\u751c\u751c\u5708",
            "/actions/cooking/blackberry_cake": "\u9ed1\u8393\u86cb\u7cd5",
            "/actions/cooking/orange_gummy": "\u6a59\u5b50\u8f6f\u7cd6",
            "/actions/cooking/orange_yogurt": "\u6a59\u5b50\u9178\u5976",
            "/actions/cooking/strawberry_donut": "\u8349\u8393\u751c\u751c\u5708",
            "/actions/cooking/strawberry_cake": "\u8349\u8393\u86cb\u7cd5",
            "/actions/cooking/plum_gummy": "\u674e\u5b50\u8f6f\u7cd6",
            "/actions/cooking/plum_yogurt": "\u674e\u5b50\u9178\u5976",
            "/actions/cooking/mooberry_donut": "\u54de\u8393\u751c\u751c\u5708",
            "/actions/cooking/mooberry_cake": "\u54de\u8393\u86cb\u7cd5",
            "/actions/cooking/peach_gummy": "\u6843\u5b50\u8f6f\u7cd6",
            "/actions/cooking/peach_yogurt": "\u6843\u5b50\u9178\u5976",
            "/actions/cooking/marsberry_donut": "\u706b\u661f\u8393\u751c\u751c\u5708",
            "/actions/cooking/marsberry_cake": "\u706b\u661f\u8393\u86cb\u7cd5",
            "/actions/cooking/dragon_fruit_gummy": "\u706b\u9f99\u679c\u8f6f\u7cd6",
            "/actions/cooking/dragon_fruit_yogurt": "\u706b\u9f99\u679c\u9178\u5976",
            "/actions/cooking/spaceberry_donut": "\u592a\u7a7a\u8393\u751c\u751c\u5708",
            "/actions/cooking/spaceberry_cake": "\u592a\u7a7a\u8393\u86cb\u7cd5",
            "/actions/cooking/star_fruit_gummy": "\u6768\u6843\u8f6f\u7cd6",
            "/actions/cooking/star_fruit_yogurt": "\u6768\u6843\u9178\u5976",
            "/actions/brewing/milking_tea": "\u6324\u5976\u8336",
            "/actions/brewing/stamina_coffee": "\u8010\u529b\u5496\u5561",
            "/actions/brewing/foraging_tea": "\u91c7\u6458\u8336",
            "/actions/brewing/intelligence_coffee": "\u667a\u529b\u5496\u5561",
            "/actions/brewing/gathering_tea": "\u91c7\u96c6\u8336",
            "/actions/brewing/woodcutting_tea": "\u4f10\u6728\u8336",
            "/actions/brewing/cooking_tea": "\u70f9\u996a\u8336",
            "/actions/brewing/defense_coffee": "\u9632\u5fa1\u5496\u5561",
            "/actions/brewing/brewing_tea": "\u51b2\u6ce1\u8336",
            "/actions/brewing/attack_coffee": "\u653b\u51fb\u5496\u5561",
            "/actions/brewing/gourmet_tea": "\u7f8e\u98df\u8336",
            "/actions/brewing/alchemy_tea": "\u70bc\u91d1\u8336",
            "/actions/brewing/enhancing_tea": "\u5f3a\u5316\u8336",
            "/actions/brewing/cheesesmithing_tea": "\u5976\u916a\u953b\u9020\u8336",
            "/actions/brewing/power_coffee": "\u529b\u91cf\u5496\u5561",
            "/actions/brewing/crafting_tea": "\u5236\u4f5c\u8336",
            "/actions/brewing/ranged_coffee": "\u8fdc\u7a0b\u5496\u5561",
            "/actions/brewing/wisdom_tea": "\u7ecf\u9a8c\u8336",
            "/actions/brewing/wisdom_coffee": "\u7ecf\u9a8c\u5496\u5561",
            "/actions/brewing/tailoring_tea": "\u7f1d\u7eab\u8336",
            "/actions/brewing/magic_coffee": "\u9b54\u6cd5\u5496\u5561",
            "/actions/brewing/super_milking_tea": "\u8d85\u7ea7\u6324\u5976\u8336",
            "/actions/brewing/super_stamina_coffee": "\u8d85\u7ea7\u8010\u529b\u5496\u5561",
            "/actions/brewing/super_foraging_tea": "\u8d85\u7ea7\u91c7\u6458\u8336",
            "/actions/brewing/super_intelligence_coffee": "\u8d85\u7ea7\u667a\u529b\u5496\u5561",
            "/actions/brewing/processing_tea": "\u52a0\u5de5\u8336",
            "/actions/brewing/lucky_coffee": "\u5e78\u8fd0\u5496\u5561",
            "/actions/brewing/super_woodcutting_tea": "\u8d85\u7ea7\u4f10\u6728\u8336",
            "/actions/brewing/super_cooking_tea": "\u8d85\u7ea7\u70f9\u996a\u8336",
            "/actions/brewing/super_defense_coffee": "\u8d85\u7ea7\u9632\u5fa1\u5496\u5561",
            "/actions/brewing/super_brewing_tea": "\u8d85\u7ea7\u51b2\u6ce1\u8336",
            "/actions/brewing/ultra_milking_tea": "\u7a76\u6781\u6324\u5976\u8336",
            "/actions/brewing/super_attack_coffee": "\u8d85\u7ea7\u653b\u51fb\u5496\u5561",
            "/actions/brewing/ultra_stamina_coffee": "\u7a76\u6781\u8010\u529b\u5496\u5561",
            "/actions/brewing/efficiency_tea": "\u6548\u7387\u8336",
            "/actions/brewing/swiftness_coffee": "\u8fc5\u6377\u5496\u5561",
            "/actions/brewing/super_alchemy_tea": "\u8d85\u7ea7\u70bc\u91d1\u8336",
            "/actions/brewing/super_enhancing_tea": "\u8d85\u7ea7\u5f3a\u5316\u8336",
            "/actions/brewing/ultra_foraging_tea": "\u7a76\u6781\u91c7\u6458\u8336",
            "/actions/brewing/ultra_intelligence_coffee": "\u7a76\u6781\u667a\u529b\u5496\u5561",
            "/actions/brewing/channeling_coffee": "\u541f\u5531\u5496\u5561",
            "/actions/brewing/super_cheesesmithing_tea": "\u8d85\u7ea7\u5976\u916a\u953b\u9020\u8336",
            "/actions/brewing/ultra_woodcutting_tea": "\u7a76\u6781\u4f10\u6728\u8336",
            "/actions/brewing/super_power_coffee": "\u8d85\u7ea7\u529b\u91cf\u5496\u5561",
            "/actions/brewing/artisan_tea": "\u5de5\u5320\u8336",
            "/actions/brewing/super_crafting_tea": "\u8d85\u7ea7\u5236\u4f5c\u8336",
            "/actions/brewing/ultra_cooking_tea": "\u7a76\u6781\u70f9\u996a\u8336",
            "/actions/brewing/super_ranged_coffee": "\u8d85\u7ea7\u8fdc\u7a0b\u5496\u5561",
            "/actions/brewing/ultra_defense_coffee": "\u7a76\u6781\u9632\u5fa1\u5496\u5561",
            "/actions/brewing/catalytic_tea": "\u50ac\u5316\u8336",
            "/actions/brewing/critical_coffee": "\u66b4\u51fb\u5496\u5561",
            "/actions/brewing/super_tailoring_tea": "\u8d85\u7ea7\u7f1d\u7eab\u8336",
            "/actions/brewing/ultra_brewing_tea": "\u7a76\u6781\u51b2\u6ce1\u8336",
            "/actions/brewing/super_magic_coffee": "\u8d85\u7ea7\u9b54\u6cd5\u5496\u5561",
            "/actions/brewing/ultra_attack_coffee": "\u7a76\u6781\u653b\u51fb\u5496\u5561",
            "/actions/brewing/blessed_tea": "\u798f\u6c14\u8336",
            "/actions/brewing/ultra_alchemy_tea": "\u7a76\u6781\u70bc\u91d1\u8336",
            "/actions/brewing/ultra_enhancing_tea": "\u7a76\u6781\u5f3a\u5316\u8336",
            "/actions/brewing/ultra_cheesesmithing_tea": "\u7a76\u6781\u5976\u916a\u953b\u9020\u8336",
            "/actions/brewing/ultra_power_coffee": "\u7a76\u6781\u529b\u91cf\u5496\u5561",
            "/actions/brewing/ultra_crafting_tea": "\u7a76\u6781\u5236\u4f5c\u8336",
            "/actions/brewing/ultra_ranged_coffee": "\u7a76\u6781\u8fdc\u7a0b\u5496\u5561",
            "/actions/brewing/ultra_tailoring_tea": "\u7a76\u6781\u7f1d\u7eab\u8336",
            "/actions/brewing/ultra_magic_coffee": "\u7a76\u6781\u9b54\u6cd5\u5496\u5561",
            "/actions/alchemy/coinify": "\u70b9\u91d1",
            "/actions/alchemy/transmute": "\u8f6c\u5316",
            "/actions/alchemy/decompose": "\u5206\u89e3",
            "/actions/enhancing/enhance": "\u5f3a\u5316",
            "/actions/combat/fly": "\u82cd\u8747",
            "/actions/combat/rat": "\u6770\u745e",
            "/actions/combat/skunk": "\u81ed\u9f2c",
            "/actions/combat/porcupine": "\u8c6a\u732a",
            "/actions/combat/slimy": "\u53f2\u83b1\u59c6",
            "/actions/combat/smelly_planet": "\u81ed\u81ed\u661f\u7403",
            "/actions/combat/smelly_planet_elite": "\u81ed\u81ed\u661f\u7403 (\u7cbe\u82f1)",
            "/actions/combat/frog": "\u9752\u86d9",
            "/actions/combat/snake": "\u86c7",
            "/actions/combat/swampy": "\u6cbc\u6cfd\u866b",
            "/actions/combat/alligator": "\u590f\u6d1b\u514b",
            "/actions/combat/swamp_planet": "\u6cbc\u6cfd\u661f\u7403",
            "/actions/combat/swamp_planet_elite": "\u6cbc\u6cfd\u661f\u7403 (\u7cbe\u82f1)",
            "/actions/combat/sea_snail": "\u8717\u725b",
            "/actions/combat/crab": "\u8783\u87f9",
            "/actions/combat/aquahorse": "\u6c34\u9a6c",
            "/actions/combat/nom_nom": "\u54ac\u54ac\u9c7c",
            "/actions/combat/turtle": "\u5fcd\u8005\u9f9f",
            "/actions/combat/aqua_planet": "\u6d77\u6d0b\u661f\u7403",
            "/actions/combat/aqua_planet_elite": "\u6d77\u6d0b\u661f\u7403 (\u7cbe\u82f1)",
            "/actions/combat/jungle_sprite": "\u4e1b\u6797\u7cbe\u7075",
            "/actions/combat/myconid": "\u8611\u83c7\u4eba",
            "/actions/combat/treant": "\u6811\u4eba",
            "/actions/combat/centaur_archer": "\u534a\u4eba\u9a6c\u5f13\u7bad\u624b",
            "/actions/combat/jungle_planet": "\u4e1b\u6797\u661f\u7403",
            "/actions/combat/jungle_planet_elite": "\u4e1b\u6797\u661f\u7403 (\u7cbe\u82f1)",
            "/actions/combat/gobo_stabby": "\u523a\u523a",
            "/actions/combat/gobo_slashy": "\u780d\u780d",
            "/actions/combat/gobo_smashy": "\u9524\u9524",
            "/actions/combat/gobo_shooty": "\u54bb\u54bb",
            "/actions/combat/gobo_boomy": "\u8f70\u8f70",
            "/actions/combat/gobo_planet": "\u54e5\u5e03\u6797\u661f\u7403",
            "/actions/combat/gobo_planet_elite": "\u54e5\u5e03\u6797\u661f\u7403 (\u7cbe\u82f1)",
            "/actions/combat/eye": "\u72ec\u773c",
            "/actions/combat/eyes": "\u53e0\u773c",
            "/actions/combat/veyes": "\u590d\u773c",
            "/actions/combat/planet_of_the_eyes": "\u773c\u7403\u661f\u7403",
            "/actions/combat/planet_of_the_eyes_elite": "\u773c\u7403\u661f\u7403 (\u7cbe\u82f1)",
            "/actions/combat/novice_sorcerer": "\u65b0\u624b\u5deb\u5e08",
            "/actions/combat/ice_sorcerer": "\u51b0\u971c\u5deb\u5e08",
            "/actions/combat/flame_sorcerer": "\u706b\u7130\u5deb\u5e08",
            "/actions/combat/elementalist": "\u5143\u7d20\u6cd5\u5e08",
            "/actions/combat/sorcerers_tower": "\u5deb\u5e08\u4e4b\u5854",
            "/actions/combat/sorcerers_tower_elite": "\u5deb\u5e08\u4e4b\u5854 (\u7cbe\u82f1)",
            "/actions/combat/gummy_bear": "\u8f6f\u7cd6\u718a",
            "/actions/combat/panda": "\u718a\u732b",
            "/actions/combat/black_bear": "\u9ed1\u718a",
            "/actions/combat/grizzly_bear": "\u68d5\u718a",
            "/actions/combat/polar_bear": "\u5317\u6781\u718a",
            "/actions/combat/bear_with_it": "\u718a\u718a\u661f\u7403",
            "/actions/combat/bear_with_it_elite": "\u718a\u718a\u661f\u7403 (\u7cbe\u82f1)",
            "/actions/combat/magnetic_golem": "\u78c1\u529b\u9b54\u50cf",
            "/actions/combat/stalactite_golem": "\u949f\u4e73\u77f3\u9b54\u50cf",
            "/actions/combat/granite_golem": "\u82b1\u5c97\u5ca9\u9b54\u50cf",
            "/actions/combat/golem_cave": "\u9b54\u50cf\u6d1e\u7a74",
            "/actions/combat/golem_cave_elite": "\u9b54\u50cf\u6d1e\u7a74 (\u7cbe\u82f1)",
            "/actions/combat/zombie": "\u50f5\u5c38",
            "/actions/combat/vampire": "\u5438\u8840\u9b3c",
            "/actions/combat/werewolf": "\u72fc\u4eba",
            "/actions/combat/twilight_zone": "\u66ae\u5149\u4e4b\u5730",
            "/actions/combat/twilight_zone_elite": "\u66ae\u5149\u4e4b\u5730 (\u7cbe\u82f1)",
            "/actions/combat/abyssal_imp": "\u6df1\u6e0a\u5c0f\u9b3c",
            "/actions/combat/soul_hunter": "\u7075\u9b42\u730e\u624b",
            "/actions/combat/infernal_warlock": "\u5730\u72f1\u672f\u58eb",
            "/actions/combat/infernal_abyss": "\u5730\u72f1\u6df1\u6e0a",
            "/actions/combat/infernal_abyss_elite": "\u5730\u72f1\u6df1\u6e0a (\u7cbe\u82f1)",
            "/actions/combat/chimerical_den": "\u5947\u5e7b\u6d1e\u7a74",
            "/actions/combat/sinister_circus": "\u9634\u68ee\u9a6c\u620f\u56e2",
            "/actions/combat/enchanted_fortress": "\u79d8\u6cd5\u8981\u585e",
            "/actions/combat/pirate_cove": "\u6d77\u76d7\u57fa\u5730",
        };
        ZHOthersDic = {
            // monsterNames
            "/monsters/abyssal_imp": "\u6df1\u6e0a\u5c0f\u9b3c",
            "/monsters/acrobat": "\u6742\u6280\u5e08",
            "/monsters/anchor_shark": "\u6301\u951a\u9ca8",
            "/monsters/aquahorse": "\u6c34\u9a6c",
            "/monsters/black_bear": "\u9ed1\u718a",
            "/monsters/gobo_boomy": "\u8f70\u8f70",
            "/monsters/brine_marksman": "\u6d77\u76d0\u5c04\u624b",
            "/monsters/captain_fishhook": "\u9c7c\u94a9\u8239\u957f",
            "/monsters/butterjerry": "\u8776\u9f20",
            "/monsters/centaur_archer": "\u534a\u4eba\u9a6c\u5f13\u7bad\u624b",
            "/monsters/chronofrost_sorcerer": "\u971c\u65f6\u5deb\u5e08",
            "/monsters/crystal_colossus": "\u6c34\u6676\u5de8\u50cf",
            "/monsters/demonic_overlord": "\u6076\u9b54\u9738\u4e3b",
            "/monsters/deranged_jester": "\u5c0f\u4e11\u7687",
            "/monsters/dodocamel": "\u6e21\u6e21\u9a7c",
            "/monsters/dusk_revenant": "\u9ec4\u660f\u4ea1\u7075",
            "/monsters/elementalist": "\u5143\u7d20\u6cd5\u5e08",
            "/monsters/enchanted_bishop": "\u79d8\u6cd5\u4e3b\u6559",
            "/monsters/enchanted_king": "\u79d8\u6cd5\u56fd\u738b",
            "/monsters/enchanted_knight": "\u79d8\u6cd5\u9a91\u58eb",
            "/monsters/enchanted_pawn": "\u79d8\u6cd5\u58eb\u5175",
            "/monsters/enchanted_queen": "\u79d8\u6cd5\u738b\u540e",
            "/monsters/enchanted_rook": "\u79d8\u6cd5\u5821\u5792",
            "/monsters/eye": "\u72ec\u773c",
            "/monsters/eyes": "\u53e0\u773c",
            "/monsters/flame_sorcerer": "\u706b\u7130\u5deb\u5e08",
            "/monsters/fly": "\u82cd\u8747",
            "/monsters/frog": "\u9752\u86d9",
            "/monsters/sea_snail": "\u8717\u725b",
            "/monsters/giant_shoebill": "\u9cb8\u5934\u9e73",
            "/monsters/gobo_chieftain": "\u54e5\u5e03\u6797\u914b\u957f",
            "/monsters/granite_golem": "\u82b1\u5c97\u9b54\u50cf",
            "/monsters/griffin": "\u72ee\u9e6b",
            "/monsters/grizzly_bear": "\u68d5\u718a",
            "/monsters/gummy_bear": "\u8f6f\u7cd6\u718a",
            "/monsters/crab": "\u8783\u87f9",
            "/monsters/ice_sorcerer": "\u51b0\u971c\u5deb\u5e08",
            "/monsters/infernal_warlock": "\u5730\u72f1\u672f\u58eb",
            "/monsters/jackalope": "\u9e7f\u89d2\u5154",
            "/monsters/rat": "\u6770\u745e",
            "/monsters/juggler": "\u6742\u800d\u8005",
            "/monsters/jungle_sprite": "\u4e1b\u6797\u7cbe\u7075",
            "/monsters/luna_empress": "\u6708\u795e\u4e4b\u8776",
            "/monsters/magician": "\u9b54\u672f\u5e08",
            "/monsters/magnetic_golem": "\u78c1\u529b\u9b54\u50cf",
            "/monsters/manticore": "\u72ee\u874e\u517d",
            "/monsters/marine_huntress": "\u6d77\u6d0b\u730e\u624b",
            "/monsters/myconid": "\u8611\u83c7\u4eba",
            "/monsters/nom_nom": "\u54ac\u54ac\u9c7c",
            "/monsters/novice_sorcerer": "\u65b0\u624b\u5deb\u5e08",
            "/monsters/panda": "\u718a\u732b",
            "/monsters/polar_bear": "\u5317\u6781\u718a",
            "/monsters/porcupine": "\u8c6a\u732a",
            "/monsters/rabid_rabbit": "\u75af\u9b54\u5154",
            "/monsters/red_panda": "\u5c0f\u718a\u732b",
            "/monsters/alligator": "\u590f\u6d1b\u514b",
            "/monsters/gobo_shooty": "\u54bb\u54bb",
            "/monsters/skunk": "\u81ed\u9f2c",
            "/monsters/gobo_slashy": "\u780d\u780d",
            "/monsters/slimy": "\u53f2\u83b1\u59c6",
            "/monsters/gobo_smashy": "\u9524\u9524",
            "/monsters/soul_hunter": "\u7075\u9b42\u730e\u624b",
            "/monsters/squawker": "\u9e66\u9e49",
            "/monsters/gobo_stabby": "\u523a\u523a",
            "/monsters/stalactite_golem": "\u949f\u4e73\u77f3\u9b54\u50cf",
            "/monsters/swampy": "\u6cbc\u6cfd\u866b",
            "/monsters/the_kraken": "\u514b\u62c9\u80af",
            "/monsters/the_watcher": "\u89c2\u5bdf\u8005",
            "/monsters/snake": "\u86c7",
            "/monsters/tidal_conjuror": "\u6f6e\u6c50\u53ec\u5524\u5e08",
            "/monsters/treant": "\u6811\u4eba",
            "/monsters/turtle": "\u5fcd\u8005\u9f9f",
            "/monsters/vampire": "\u5438\u8840\u9b3c",
            "/monsters/veyes": "\u590d\u773c",
            "/monsters/werewolf": "\u72fc\u4eba",
            "/monsters/zombie": "\u50f5\u5c38",
            "/monsters/zombie_bear": "\u50f5\u5c38\u718a",

            // abilityNames
            "/abilities/poke": "\u7834\u80c6\u4e4b\u523a",
            "/abilities/impale": "\u900f\u9aa8\u4e4b\u523a",
            "/abilities/puncture": "\u7834\u7532\u4e4b\u523a",
            "/abilities/penetrating_strike": "\u8d2f\u5fc3\u4e4b\u523a",
            "/abilities/scratch": "\u722a\u5f71\u65a9",
            "/abilities/cleave": "\u5206\u88c2\u65a9",
            "/abilities/maim": "\u8840\u5203\u65a9",
            "/abilities/crippling_slash": "\u81f4\u6b8b\u65a9",
            "/abilities/smack": "\u91cd\u78be",
            "/abilities/sweep": "\u91cd\u626b",
            "/abilities/stunning_blow": "\u91cd\u9524",
            "/abilities/fracturing_impact": "\u788e\u88c2\u51b2\u51fb",
            "/abilities/shield_bash": "\u76fe\u51fb",
            "/abilities/quick_shot": "\u5feb\u901f\u5c04\u51fb",
            "/abilities/aqua_arrow": "\u6d41\u6c34\u7bad",
            "/abilities/flame_arrow": "\u70c8\u7130\u7bad",
            "/abilities/rain_of_arrows": "\u7bad\u96e8",
            "/abilities/silencing_shot": "\u6c89\u9ed8\u4e4b\u7bad",
            "/abilities/steady_shot": "\u7a33\u5b9a\u5c04\u51fb",
            "/abilities/pestilent_shot": "\u75ab\u75c5\u5c04\u51fb",
            "/abilities/penetrating_shot": "\u8d2f\u7a7f\u5c04\u51fb",
            "/abilities/water_strike": "\u6d41\u6c34\u51b2\u51fb",
            "/abilities/ice_spear": "\u51b0\u67aa\u672f",
            "/abilities/frost_surge": "\u51b0\u971c\u7206\u88c2",
            "/abilities/mana_spring": "\u6cd5\u529b\u55b7\u6cc9",
            "/abilities/entangle": "\u7f20\u7ed5",
            "/abilities/toxic_pollen": "\u5267\u6bd2\u7c89\u5c18",
            "/abilities/natures_veil": "\u81ea\u7136\u83cc\u5e55",
            "/abilities/life_drain": "\u751f\u547d\u5438\u53d6",
            "/abilities/fireball": "\u706b\u7403",
            "/abilities/flame_blast": "\u7194\u5ca9\u7206\u88c2",
            "/abilities/firestorm": "\u706b\u7130\u98ce\u66b4",
            "/abilities/smoke_burst": "\u70df\u7206\u706d\u5f71",
            "/abilities/minor_heal": "\u521d\u7ea7\u81ea\u6108\u672f",
            "/abilities/heal": "\u81ea\u6108\u672f",
            "/abilities/quick_aid": "\u5feb\u901f\u6cbb\u7597\u672f",
            "/abilities/rejuvenate": "\u7fa4\u4f53\u6cbb\u7597\u672f",
            "/abilities/taunt": "\u5632\u8bbd",
            "/abilities/provoke": "\u6311\u8845",
            "/abilities/toughness": "\u575a\u97e7",
            "/abilities/elusiveness": "\u95ea\u907f",
            "/abilities/precision": "\u7cbe\u786e",
            "/abilities/berserk": "\u72c2\u66b4",
            "/abilities/frenzy": "\u72c2\u901f",
            "/abilities/elemental_affinity": "\u5143\u7d20\u589e\u5e45",
            "/abilities/spike_shell": "\u5c16\u523a\u9632\u62a4",
            "/abilities/arcane_reflection": "\u5965\u672f\u53cd\u5c04",
            "/abilities/vampirism": "\u5438\u8840",
            "/abilities/revive": "\u590d\u6d3b",
            "/abilities/insanity": "\u75af\u72c2",
            "/abilities/invincible": "\u65e0\u654c",
            "/abilities/fierce_aura": "\u7269\u7406\u5149\u73af",
            "/abilities/aqua_aura": "\u6d41\u6c34\u5149\u73af",
            "/abilities/sylvan_aura": "\u81ea\u7136\u5149\u73af",
            "/abilities/flame_aura": "\u706b\u7130\u5149\u73af",
            "/abilities/speed_aura": "\u901f\u5ea6\u5149\u73af",
            "/abilities/critical_aura": "\u66b4\u51fb\u5149\u73af",
            "/abilities/promote": "\u664b\u5347",
        };
        ZHToItemHridMap = {};
        ZHToActionHridMap = {};
        ZHToOthersMap = {};

        constructor() {
            this.ZHToItemHridMap = this.#inverseKV(this.ZHitemNames);
            this.ZHToActionHridMap = this.#inverseKV(this.ZHActionNames);
            this.ZHToOthersMap = this.#inverseKV(this.ZHOthersDic);
        }
        #inverseKV(obj) {
            const retobj = {};
            for (const key in obj) {
                retobj[obj[key]] = key;
            }
            return retobj;
        }
        hridToZH(hrid) {
            return this.ZHitemNames[hrid] || this.ZHActionNames[hrid] || this.ZHOthersDic[hrid] || hrid;
        }
        skillToZH(skill) {
            const skillTranslation = {
                attack: isCN ? '攻击' : 'Attack',
                defense: isCN ? '防御' : 'Defense',
                intelligence: isCN ? '智力' : 'Intelligence',
                power: isCN ? '力量' : 'Power',
                stamina: isCN ? '耐力' : 'Stamina',
                magic: isCN ? '魔法' : 'Magic',
                ranged: isCN ? '远程' : 'Ranged',
            };
            return skillTranslation[skill];
        }
        getOthersFromZhName(zhName) {
            const key = this.ZHToOthersMap[zhName];
            if (!key) return "";
            return key;
        }
        getActionEnNameFromZhName(zhName) {
            const actionHrid = this.ZHToActionHridMap[zhName];
            if (!actionHrid) {
                out("Can not find EN name for action " + zhName);
                return "";
            }
            const enName = ClientData.get().actionDetailMap[actionHrid]?.name;
            if (!enName) {
                out("Can not find EN name for actionHrid " + actionHrid);
                return "";
            }
            return enName;
        }
    };

    const BattleData = new class {
        #data = null;

        mapData = {};
        itemRarity = {};

        currentMapId = null;
        duration = 0;
        runCount = 0;
        playerList = [];
        playerStat = {};
        playerLoot = {};
        playerFood = {};
        playerData = {};

        auraAbilities = [
            'revive',
            'insanity',
            'invincible',
            'fierce_aura',
            'aqua_aura',
            'sylvan_aura',
            'flame_aura',
            'speed_aura',
            'critical_aura'
        ];

        get() { return this.#data; }

        set(val) {
            this.#data = val;
            this.duration = (new Date() - new Date(val.combatStartTime)) / 1000;
            this.runCount = val.battleId || 1;
            this.playerList = val.players.map(p => p.character.name);
            for (let player of val.players) {
                const playerName = player.character.name;

                // 初始化玩家数据
                this.playerStat[playerName] = {
                    aura: null,
                    skillExp: {},
                    combatDropQuantity: player.combatDetails.combatStats.combatDropQuantity,
                    combatDropRate: player.combatDetails.combatStats.combatDropRate,
                    combatRareFind: player.combatDetails.combatStats.combatRareFind,
                };

                // 处理战利品
                let playerLoot = { items: {}, price: 0 };
                Object.values(player.totalLootMap).forEach(loot => {
                    const itemName = ClientData.hrid2name(loot.itemHrid);
                    let bidPrice = Market.getPrice(itemName) || 0;
                    playerLoot.price += bidPrice * loot.count;
                    playerLoot.items[itemName] = {
                        itemHrid: loot.itemHrid,
                        count: loot.count,
                    };
                });
                this.playerLoot[playerName] = playerLoot;

                // 处理消耗品
                let playerFood = {
                    drinkConcentration: player.combatDetails.combatStats.drinkConcentration,
                    food: {},
                };
                player.combatConsumables.forEach(consumable => {
                    const itemName = ClientData.hrid2name(consumable.itemHrid);
                    playerFood.food[itemName] = {
                        itemHrid: consumable.itemHrid,
                        count: consumable.count,
                    };
                });
                this.playerFood[playerName] = playerFood;

                // 处理光环&经验
                player.combatAbilities.forEach(ability => {
                    const isAura = this.auraAbilities.some(aura => ability.abilityHrid.endsWith(aura));
                    if (isAura) {
                        this.playerStat[playerName].aura = ability.abilityHrid;
                    }
                });
                Object.keys(player.totalSkillExperienceMap).forEach(hrid => {
                    const skill = hrid.replace('/skills/', '');
                    this.playerStat[playerName].skillExp[skill] = player.totalSkillExperienceMap[hrid];
                });
            }
        }

        initPlayerData() {
            const characterData = CharacterData.get();

            // 设置当前地图
            if (characterData?.characterActions[0]?.actionHrid?.startsWith("/actions/combat/")) {
                this.currentMapId = characterData.characterActions[0].actionHrid;
            }
        }

        initCombatMapData() {
            const clientData = ClientData.get();

            // 处理战斗地图数据
            const monsterMap = clientData.combatMonsterDetailMap;
            const actionDetailMap = clientData.actionDetailMap;
            for (const [actionHrid, actionDetail] of Object.entries(actionDetailMap)) {
                if (!actionHrid.startsWith("/actions/combat/")) continue;
                if (!actionDetail.combatZoneInfo || actionDetail.combatZoneInfo.isDungeon) continue;
                const fightInfo = actionDetail.combatZoneInfo.fightInfo;
                const spawnInfo = fightInfo?.randomSpawnInfo;
                let spawns = spawnInfo?.spawns;
                if (!spawns || spawns.length === 0) continue;

                const totalRate = spawns.reduce((s, x) => s + x.rate, 0);
                spawns = spawns.map(s => ({
                    hrid: s.combatMonsterHrid,
                    strength: s.strength,
                    rate: s.rate / totalRate,
                    eliteTier: s.eliteTier,
                }));
                const mapType = spawnInfo.spawns.length > 1 || spawnInfo.bossWave > 0 ? "group" : "solo";

                // 合并普通掉落和稀有掉落
                const getDrops = (hrid, s) => [
                    hrid, [].concat(
                        monsterMap[hrid].dropTable
                            .filter(item => item.minEliteTier <= s.eliteTier)
                            .map(item => ({ isRare: false, ...item }))
                    ).concat(
                        monsterMap[hrid].rareDropTable
                            .filter(item => item.minEliteTier <= s.eliteTier)
                            .map(item => ({ isRare: true, ...item }))
                    )
                ];
                const monsterDrops = Object.fromEntries(spawns.map(s => getDrops(s.hrid, s)));
                const bossDrops = Object.fromEntries(
                    (fightInfo.bossSpawns ?? []).map(s => getDrops(s.combatMonsterHrid, s)));

                const spawnInfoMod = {
                    maxSpawnCount: spawnInfo.maxSpawnCount,
                    maxTotalStrength: spawnInfo.maxTotalStrength,
                    bossWave: fightInfo.battlesPerBoss || 0,
                    spawns: spawns,
                };
                spawnInfoMod.expectedSpawns = BattleDropAnalyzer.computeExpectedSpawns(spawnInfoMod);
                this.mapData[actionHrid] = {
                    info: {
                        type: mapType,
                        name: actionDetail.name,
                        order: actionDetail.sortIndex,
                    },
                    spawnInfo: spawnInfoMod,
                    monsterDrops: monsterDrops,
                    bossDrops: bossDrops,
                }
            }

            this.initItemRarity();

            // 打印结果
            out("战斗地图列表 (BattleData.mapData)", this.mapData)
        }

        initItemRarity() {
            let itemTotalCount = {}, itemNum = {}, rarity = {};
            for (let mapHrid in this.mapData) {
                if (this.mapData[mapHrid].info.type == 'solo') continue;
                const itemCount = {};
                const dropData = this.getDropData(mapHrid);
                for (const [_, drops] of Object.entries(dropData.bossDrops)) {
                    for (const item of drops) {
                        itemCount[item.hrid] ??= 0;
                        itemCount[item.hrid] += BattleDropAnalyzer.itemExpectation(item);
                    }
                }
                const expectedSpawns = dropData.spawnInfo.expectedSpawns;
                for (const [hrid, drops] of Object.entries(dropData.monsterDrops)) {
                    const cnt = expectedSpawns[hrid] * 9;
                    for (const item of drops) {
                        itemCount[item.hrid] ??= 0;
                        itemCount[item.hrid] += cnt * BattleDropAnalyzer.itemExpectation(item);
                    }
                }
                for (let hrid in itemCount) {
                    itemTotalCount[hrid] = (itemTotalCount[hrid] ?? 0) + itemCount[hrid];
                    itemNum[hrid] = (itemNum[hrid] ?? 0) + 1;
                }
            }

            // let msg = ''
            for (let hrid in itemTotalCount) {
                let count = itemTotalCount[hrid] / itemNum[hrid];
                const value = Market.getPriceByHrid(hrid);
                let r = 0;
                if (count > 1 || value < 1000) r = -1; // 灰
                else if (count < 3e-3 && value > 3e6) r = 6; // 发光蓝（蓝书）
                else if (value >= 2e6) r = 5; // 发光红（超过2m）
                else if (value >= 8.5e5) r = 4; // 橙（超过0.85m）
                else if (value >= 2.5e5) r = 3; // 紫（超过0.25m）
                else if (value >= 2e5) r = 2; // 蓝
                else if (value >= 1e5 && count <= 0.02) r = 2; // 蓝
                else if (value >= 5e4 && count <= 7e-3) r = 2; // 蓝
                else if (value >= 3e4) r = 1; // 绿
                rarity[hrid] = r;
                // if (msg != '') msg += ',';
                // msg += `{${count},${value},${r}}`;
                // if (r >= 0) dbg(Translation.hridToZH(hrid), r, value, count);
            }

            // dbg(`{${msg}}`);
            this.itemRarity = rarity;
            out('物品稀有度 (BattleData.itemRarity)', this.itemRarity);
        }


        getDropData(mapHrid, runCount = 11, playerName = null) {
            const mapData = this.mapData[mapHrid];
            const bossWave = mapData.spawnInfo.bossWave;
            const bossCount = bossWave ? Math.floor((runCount - 1) / bossWave) : 0;
            const normalCount = bossWave ? bossCount * (bossWave - 1) + (runCount - 1) % bossWave : runCount - 1;
            const dropData = {
                spawnInfo: mapData.spawnInfo,
                bossCount: bossCount,
                normalCount: normalCount,
                bossDrops: {},
                monsterDrops: {},
            };

            const processDrop = (item) => {
                const itemName = ClientData.hrid2name(item.itemHrid);
                const price = Market.getPrice(itemName);

                let { minCount, maxCount, dropRate } = item;
                if (playerName) {
                    const playerStat = this.playerStat[playerName];
                    const commonRateMultiplier = 1 + (playerStat.combatDropRate || 0);
                    const rareRateMultiplier = 1 + (playerStat.combatRareFind || 0);
                    const quantityMultiplier = (1 + (playerStat.combatDropQuantity || 0)) / this.playerList.length;
                    const rateMultiplier = item.isRare ? rareRateMultiplier : commonRateMultiplier;
                    minCount *= quantityMultiplier;
                    maxCount *= quantityMultiplier;
                    dropRate = Math.min(dropRate * rateMultiplier, 1);
                }

                return {
                    hrid: item.itemHrid,
                    name: itemName,
                    price: price,
                    minCount: minCount,
                    maxCount: maxCount,
                    dropRate: dropRate,
                };
            };

            for (let [hrid, drops] of Object.entries(mapData.bossDrops))
                dropData.bossDrops[hrid] = drops.map(drop => processDrop(drop));
            for (let [hrid, drops] of Object.entries(mapData.monsterDrops))
                dropData.monsterDrops[hrid] = drops.map(drop => processDrop(drop));

            return dropData;
        }

        getCurrentDropData(playerName = null) {
            if (!this.currentMapId) return null;
            return this.getDropData(this.currentMapId, this.runCount, playerName);
        }

    };

    //#endregion

    //#region listener

    function hookWS() {
        const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
        const oriGet = dataProperty.get;
        dataProperty.get = hookedGet;
        Object.defineProperty(MessageEvent.prototype, "data", dataProperty);

        function hookedGet() {
            const socket = this.currentTarget;
            if (!(socket instanceof WebSocket)) {
                return oriGet.call(this);
            }
            if (socket.url.indexOf("api.milkywayidle.com/ws") <= -1 && socket.url.indexOf("api-test.milkywayidle.com/ws") <= -1) {
                return oriGet.call(this);
            }
            const message = oriGet.call(this);
            Object.defineProperty(this, "data", { value: message }); // Anti-loop
            handleMessage(message);
            return message;
        }
    }

    function handleMessage(message) {
        let obj = JSON.parse(message);
        if (!obj) return message;
        if (obj.type === "init_client_data") {
            ClientData.set(obj);
            BattleData.initCombatMapData();
        } else if (obj.type === "init_character_data") {
            CharacterData.set(obj);
            BattleData.initPlayerData();
        } else if (obj.type === "new_battle") {
            BattleData.set(obj);
        } else if (obj.type === "action_completed" && obj.endCharacterAction) {
            const actionHrid = obj.endCharacterAction.actionHrid;
            if (actionHrid.startsWith("/actions/combat/")) {
                BattleData.currentMapId = actionHrid;
            }
        }
        return message;
    }

    hookWS();
    handleMessage(localStorage.getItem("initClientData"));

    function observeNode(nodeSelector, rootSelector, addFunc = null, removeFunc = null) {
        const rootNode = document.querySelector(rootSelector);
        if (!rootNode) {
            setTimeout(() => observeNode(nodeSelector, rootSelector, addFunc, removeFunc), 1000);
            return;
        }
        dbg(`observing "${rootSelector}"`);
        const observer = new MutationObserver((mutationsList, observer) => {
            mutationsList.forEach((mutation) => {
                mutation.addedNodes.forEach((addedNode) => {
                    if (addedNode.matches && addedNode.matches(nodeSelector)) {
                        addFunc?.(observer);
                    }
                });
                mutation.removedNodes.forEach((removedNode) => {
                    if (removedNode.matches && removedNode.matches(nodeSelector)) {
                        removeFunc?.(observer);
                    }
                });
            });
        });
        const config = {
            childList: true,
            subtree: true,
        };
        observer.observe(rootNode, config);
        return observer;
    }

    // 在加载完分赃按钮后添加统计按钮
    observeNode(".Button_battlePlayerLoot__custom", "body", () => BattleDropAnalyzerUi.addButton());

    //#endregion

    //#region taskcard

    function handleTaskCard() {
        function getOriTextFromElement(elem) {
            if (!elem) {
                console.error("getTextFromElement null elem");
                return "";
            }
            const translatedfrom = elem.getAttribute("script_translatedfrom");
            if (translatedfrom) {
                return translatedfrom;
            }
            return elem.textContent;
        }

        function taskInfo(taskDiv) {
            const taskInfoDivs = taskDiv.querySelector("div.RandomTask_taskInfo__1uasf").children;
            const taskStr = getOriTextFromElement(taskInfoDivs[0]);
            const taskProgressStr = getOriTextFromElement(taskInfoDivs[1]);
            if (!taskStr.startsWith("Defeat - ") && !taskStr.startsWith("击败 - ")) {
                return null;
            }

            let monsterName = taskStr.replace("Defeat - ", "").replace("击败 - ", "").split(' ')[0];
            let actionHrid = null;
            if (isCN) {
                actionHrid = (
                    Translation.getOthersFromZhName(monsterName) ? Translation.getOthersFromZhName(monsterName) : Translation.getActionEnNameFromZhName(monsterName)
                )?.replaceAll("/monsters/", "/actions/combat/");
            }

            let actionObj = null;
            for (const action of Object.values(ClientData.get().actionDetailMap)) {
                if (action.hrid.includes("/combat/")) {
                    if (action.hrid === actionHrid || action.name.toLowerCase() === monsterName.toLowerCase()) {
                        actionObj = action;
                        break;
                    } else if (action.combatZoneInfo.fightInfo.battlesPerBoss === 10) {
                        if (
                            actionHrid?.replaceAll("/actions/combat/", "/monsters/") ===
                            action.combatZoneInfo.fightInfo.bossSpawns[0].combatMonsterHrid ||
                            "/monsters/" + monsterName.toLowerCase().replaceAll(" ", "_") ===
                            action.combatZoneInfo.fightInfo.bossSpawns[0].combatMonsterHrid
                        ) {
                            actionObj = action;
                            break;
                        }
                    }
                }
            }
            const actionCategoryHrid = actionObj?.category;
            const monsterHrid = actionHrid?.replace("/actions/combat/", "/monsters/");
            const mapIndex = ClientData.get().actionCategoryDetailMap?.[actionCategoryHrid]?.sortIndex;
            const mapHrid = actionCategoryHrid?.replace("/action_categories/", "/actions/");

            const spawns = BattleData.mapData[mapHrid].spawnInfo.expectedSpawns;
            const goalCount = taskProgressStr.split(' ').pop();
            const bossWave = BattleData.mapData[mapHrid].spawnInfo.bossWave;
            let count = goalCount * bossWave;
            if (spawns[monsterHrid]) {
                const normalCount = Math.ceil(goalCount / spawns[monsterHrid]);
                const bossCount = bossWave ? Math.ceil(normalCount / bossWave) - 1 : 0;
                count = normalCount + bossCount;
            }
            return {
                monsterHrid: monsterHrid,
                mapHrid: mapHrid,
                expectedCount: count,
            };
        }

        const taskDivs = document.querySelectorAll("div.RandomTask_randomTask__3B9fA");
        let totalCount = {};
        for (const taskDiv of taskDivs) {
            const info = taskInfo(taskDiv);
            if (!info) continue;
            const { monsterHrid, mapHrid, expectedCount } = info;
            totalCount[mapHrid] ??= {};
            totalCount[mapHrid][monsterHrid] = (totalCount[mapHrid][monsterHrid] || 0) + expectedCount;
        }
        for (let [mapHrid, monsters] of Object.entries(totalCount)) {
            for (let count of Object.values(monsters)) {
                totalCount[mapHrid].maxCount = Math.max(totalCount[mapHrid].maxCount ?? 0, count);
            }
        }
        for (const taskDiv of taskDivs) {
            const taskInfoDivs = taskDiv.querySelector("div.RandomTask_taskInfo__1uasf").children;
            if (!taskDiv.querySelector("span.script_taskMapIndex")) continue;
            if (taskDiv.querySelector("span.script_taskMapCount")) continue;
            const info = taskInfo(taskDiv);
            if (!info) continue;
            const { mapHrid, expectedCount } = info;
            if (mapHrid) {
                taskInfoDivs[0].insertAdjacentHTML(
                    "beforeend",
                    `<span class="script_taskMapCount" style="text-align: right; color: #eb8f1b;">
                        期望 ${expectedCount} (${totalCount[mapHrid].maxCount}) 次
                    </span>`
                );
            }
        }
    }
    setInterval(handleTaskCard, 500);

    //#endregion
})();
