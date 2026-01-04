// ==UserScript==
// @name         [银河奶牛]闻闻屎气
// @namespace    http://tampermonkey.net/
// @version      1.0.8
// @description  更屎的代码
// @author       二次元最严厉的父亲
// @license      MIT
// @match        https://www.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @connect      raw.githubusercontent.com
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/ml-fft@1.3.5/dist/ml-fft.min.js
// @require     https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js
// @downloadURL https://update.greasyfork.org/scripts/546655/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E9%97%BB%E9%97%BB%E5%B1%8E%E6%B0%94.user.js
// @updateURL https://update.greasyfork.org/scripts/546655/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E9%97%BB%E9%97%BB%E5%B1%8E%E6%B0%94.meta.js
// ==/UserScript==


/*
 * 参考文献:
 *   - [银河奶牛]食用工具 (https://greasyfork.org/zh-CN/scripts/499963-银河奶牛-食用工具)
 *   - MWITools (https://greasyfork.org/zh-CN/scripts/494467-mwitools)
 *   - 牛牛聊天增强插件 (https://greasyfork.org/zh-CN/scripts/535795-牛牛聊天增强插件)
 */

// @ts-ignore
GM_addStyle(`
.lll_Button_battlePlayerFood__custom { background-color: #546ddb !important; color: white; border-radius: 5px; padding: 5px 10px; cursor: pointer; transition: background-color 0.15s ease-out; }
.lll_Button_battlePlayerFood__custom:hover { background-color: #6b84ff !important; }
.lll_Button_battlePlayerLoot__custom { background-color: #db5454 !important; color: white; border-radius: 5px; padding: 5px 10px; cursor: pointer; transition: background-color 0.15s ease-out; }
.lll_Button_battlePlayerLoot__custom:hover { background-color: #ff6b6b !important; }

:root {
    --button-close: rgb(187, 94, 94);
    --button-close-hover: rgb(228, 117, 117);
    --button-close-click: rgb(168, 86, 86);
    --button-settings: rgb(118, 130, 182);
    --button-settings-hover: rgb(135, 155, 230);
    --button-settings-click: rgb(100, 112, 151);

    --border: rgb(113, 123, 169);
    --border-separator: rgb(73, 81, 113);

    --card-background: rgb(42, 43, 66);
    --card-title-text: rgb(237, 239, 249);
    --card-title-background:rgb(57, 59, 88);

    --item-background:rgb(54, 60, 83);
    --item-border:rgb(103, 113, 149);
    --item-background-hover: #414662;
    --item-border-hover: rgb(123, 133, 179);

    --tab-background: rgb(28, 32, 47);
    --tab-button: var(--border);
    --tab-button-hover: rgba(108, 117, 160, 0.5);
    --tab-button-click:rgb(68, 75, 111);

    --title-text-shadow: 0 0 1.5px rgba(42, 43, 66, 0.6);
}


.lll_btn_noSelect { cursor: pointer; user-select: none; }
.lll_text_noSelect { cursor: default; user-select: none; }

/* popup */
.lll_popup_root { background-color: rgb(54, 59, 91); border: 2px solid rgba(74, 79, 111, 0.5); position: fixed; top: 50%; left: 50%; color: white; box-shadow: 0 0 5px 1px black; border-radius: 11px 11px 17px 17px; z-index: 10000; white-space: nowrap; display: flex; flex-direction: column; }

.lll_tab_btnContainer { margin: 5px 5px 0 5px; padding-right: 10px; align-items: start; display: flex; gap: 5px; flex: 1; }
.lll_tab_btnSettingsContainer { width: 37px; margin: 0 0 0 auto; cursor: pointer; display: flex; }
.lll_tab_btnCloseContainer { width: 37px; margin: 0 0 0 auto; cursor: pointer; display: flex; }
.lll_tab_btnClose { border-radius: 10px; background: var(--button-close); border: none; box-shadow: 0 0 1px black; height: 19px; width: 19px; margin: auto auto auto 8px; transition: background-color 0.1s ease-out; cursor: pointer; user-select: none; display: flex; align-items: center; justify-content: center; }
.lll_tab_btnCloseContainer:hover .lll_tab_btnClose { background: var(--button-close-hover); }
.lll_tab_btnCloseContainer:active .lll_tab_btnClose { background: var(--button-close-click); }
.lll_tab_btnSettings { border-radius: 10px; background: var(--button-settings); border: none; box-shadow: 0 0 1px black; height: 19px; width: 19px; margin: auto 8px auto auto; transition: background-color 0.1s ease-out; cursor: pointer; user-select: none; display: flex; align-items: center; justify-content: center; }
.lll_tab_btnSettingsContainer:hover .lll_tab_btnSettings { background: var(--button-settings-hover); }
.lll_tab_btnSettingsContainer:active .lll_tab_btnSettings { background: var(--button-settings-click); }

.lll_tab_btn { padding: 7px 18px; color: rgba(255, 255, 255, 0.7); font-size: 16px; font-weight: 500; text-shadow: var(--title-text-shadow); border-radius: 8px 8px 0 0; text-align: center; cursor: pointer; user-select: none; transition: background-color 0.1s ease-out; }
.lll_tab_btn:hover { background-color: var(--tab-button-hover); }
.lll_tab_btn:active { background-color: var(--tab-button-click); }
.lll_tab_btn.active { background-color: var(--tab-button); cursor: default; color: white; }
.lll_tab_pageContainer { margin: -1px -2px -2px -2px; border: 1.5px solid rgba(113, 123, 169, 0.5); border-radius: 8px 8px 15px 15px; background-color: var(--tab-background); min-height: 0; min-height: 0; display: flex; flex-direction: column; }
.lll_tab_pageTitle { display: block; margin: -1px; border-radius: 5px 5px 0 0; }
.lll_tab_pageTitleText { width: fit-content; padding: 0 30px; margin: auto; text-align: center; background-color: var(--border); border-radius: 0 0 5px 5px; font-size: 16px; font-weight: bold; }
.lll_tab_page { overflow: auto; display: none; }
.lll_tab_page.active { display: block; }

.lll_plainPopup_root { z-index: 200; position: fixed; top: 0; left: 0; height: 100%; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.lll_plainPopup_background { height: 100%; width: 100%; background-color: var(--color-midnight-800); opacity: .8; }
.lll_plainPopup_containerRoot { margin: -1px -2px -2px -2px; border: 1.5px solid rgba(214, 222, 255, 0.3); border-radius: 8px; background-color: var(--tab-background); display: flex; flex-direction: column; min-height: 0; position: absolute; min-width: 300px; max-width: 98%; min-height: 100px; max-height: 98%; padding: 10px; box-shadow: 0 0 5px 1px black; font-size: 14px; font-weight: 400; overflow: auto; }
.lll_plainPopup_container { width: 100%; height: 100%; color: rgb(231, 231, 231); display: flex; flex-direction: column; gap: 12px; }
.lll_plainPopup_title { font-size: 16px; font-weight: 500; color: rgb(231, 231, 231); text-align: center; }

/* content */
.lll_div_panelContent { margin: 20px; }
.lll_div_settingPanelContent { font-size: 15px; margin: 20px; display: flex; flex-direction: column; gap: 20px; }

.lll_separator { border-top: 1.5px solid var(--border-separator); }
.lll_div_card { padding: 10px; border-radius: 10px; background-color: var(--card-background); border: 1.5px solid var(--border); margin: 0px auto; overflow: hidden; display: flex; flex-direction: column; }
.lll_div_cardTitle { background-color: var(--card-title-background); text-align: center; font-size: 16px; color: var(--card-title-text); margin: -10px -10px 8px -10px; padding: 5px 0; user-select: none; }
.lll_div_cardTitle.large { margin-bottom: 10px; padding: 5px 0; font-size: 20px; font-weight: bold; text-shadow: 0 0 2px var(--tab-background); }
.lll_div_card .lll_separator { border-color: var(--border); }
.lll_div_item { display: flex; align-items: center; background-color: var(--item-background); border: 1.5px solid var(--item-border); border-radius: 5px; padding: 8px; white-space: nowrap; flex-shrink: 0; cursor: default; }
.lll_div_item:hover { background-color: var(--item-background-hover); border: 1.5px solid var(--item-border-hover); }

.lll_div_column { display: flex; flex-direction: column; gap: 15px; }
.lll_div_row { display: flex; gap: 15px; justify-content: center; }

.lll_label { margin: auto 0; text-align: center; }
.lll_btn { height: auto; position: sticky; margin: 5px; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px; }

.lll_input_checkbox { margin: auto 0; }
.lll_input_select { padding: 5px 10px 5px 5px; margin: auto 0; border: 1px solid #ced4da; border-radius: 5px; }
.lll_input { padding: 5px 10px 5px 5px; margin: auto 0; border: 1px solid #ced4da; border-radius: 5px; }
.lll_input_sliderWrapper { display: flex; gap: 10px; }
.lll_input_sliderLabel { min-width: 50px; margin: auto 0; text-align: left; }

/* battle */
.lll_btn_battleDropAnalyzer { background-color: #21967e !important; color: white; border-radius: 5px; padding: 5px 10px; cursor: pointer; transition: background-color 0.15s ease-out;  }
.lll_btn_battleDropAnalyzer:hover { background-color:rgb(37, 184, 152) !important; }

/* chest */
.lll_div_chestOpenContent { width: 100%; height: 100%; color: rgb(231, 231, 231); display: flex; flex-direction: column; gap: 12px; }
.lll_div_chestOpenContent .lll_div_row { width: 100%; gap: 10px; }
.lll_div_chestOpenContent .lll_div_card { border-radius: 8px; background-color: rgb(38, 42, 58); border: 1.5px solid rgba(117, 123, 148, 1); width: 100%; margin: 0; }
.lll_div_chestOpenContent .lll_div_card .lll_separator { border-color: rgba(117, 123, 148, 1); }
.lll_div_chestOpenContent .lll_div_cardTitle { background-color: rgb(66, 71, 90); text-align: center; font-size: 14px; text-align: left; color: var(--card-title-text); margin: -10px -10px 8px -10px; padding: 3px 10px; }
`);
function decompressInitClientData(compressedData) {
        try {
            // 使用lz-string库解压UTF16格式数据
            const decompressedJson = LZString.decompressFromUTF16(compressedData);
            if (!decompressedJson) {
                throw new Error("解压失败，数据可能为空或损坏");
            }

            // 解析为JSON对象
            return JSON.parse(decompressedJson);
        } catch (error) {
            console.error("还原initClientData时出错：", error);
            return null;
        }
    }
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
            // @ts-ignore
            event.chartId = chart.id; event.syncGroup = syncGroup; event.original = e; event.xValue = xScale.getValueForPixel(e.x);
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
            // @ts-ignore
            event.chartId = chart.id; event.syncGroup = syncGroup;
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
// @ts-ignore
Chart.register(TracePlugin);

/*
 * TODO:
 *   - 英语翻译
 *   - UI 重构
 *     - 非战斗全图模拟
 *   - 战斗统计
 *     - 历史记录
 *     - 期望掉落
 *   - 开箱统计
 *     - 设置
 *     - 运气底色
 *     - 历史记录
 *   - 强化统计
 *     - 强化运气
 *   - 任务
 *     - 期望收益（制作rarity=2写错了）
 *     - 计算是否应该刷新
 */

/** counted item
 * @typedef {{ hrid: string, count: number }} CountedItem
 */
/** init_character_data.characterInfo - CharacterInfo
 * @typedef {Object} CharacterInfo
 * @property {number} characterID
 * @property {number} offlineHourCap
 * @property {number} actionQueueCap
 * @property {number} loadoutSlotCap
 * @property {number} marketListingCap
 * @property {number} taskSlotCap
 * @property {boolean} isTutorialCompleted
 * @property {number} taskCooldownHours
 * @property {string} lastTaskTimestamp
 * @property {number} unreadTaskCount
 * @property {number} totalTaskPoints
 * @property {number} redeemedTaskPoints
 * @property {boolean} isCombatTaskBlockUnlocked
 * @property {number} famePoints
 * @property {boolean} fameLeaderboardOptOut
 */

(function () {
    'use strict';

    const dbg = console.log.bind(null, '%c[康康运气]%c', 'color:blue', 'color:black');
    const out = console.log.bind(null, '%c[康康运气]%c', 'color:green', 'color:black');
    const err = console.log.bind(null, '%c[康康运气]%c', 'color:red', 'color:black');

    // @ts-ignore
    const FFT = mlFft.FFT;

    const isCN = !['en'].some(lang => localStorage.getItem("i18nextLng")?.toLowerCase()?.startsWith(lang));
    let isMobile = window.innerWidth < 768; // 判断是否为移动设备
    window.addEventListener('resize', () => { isMobile = window.innerWidth < 768; });

    const Utils = new class {
        #inf = 0x3FFFFFFE;
        floor(n) { return n > this.#inf || n < -this.#inf ? Math.floor(n) : ((n + this.#inf) | 0) - this.#inf; }
        round(n) { return this.floor(n + 0.5); }
        randInt(l, r) { return l + Math.floor(Math.random() * (r - l)); }

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
        luckColor(luck) {
            luck = Math.min(Math.max(luck, 0), 1);
            const h = luck * 0.34;
            const s = 0.9 - luck * 0.25;
            const v = 1 - luck * 0.25;
            return Utils.HSVtoRGB(h, s, v).rgb;
        };

        /**
         * 格式化数字为带KMBT单位的价格
         * @param {number} value
         * @param {{ type?: 'fixedPrecision' | 'fixedLength' | 'mwi' | 'edible', precision?: number, threshold?: number}} style
         * @returns {string}
         */
        formatPrice(value, style = null) {
            const styleMap = {
                fixedPrecision(_, value, style) {
                    const precision = style?.precision ?? 4;
                    if (value < 10000) return value.toFixed(0);
                    const e = Math.floor(Math.log10(value));
                    const base = Math.min(12, 3 + Math.max(0, Math.floor((e - precision) / 3) * 3));
                    const unit = "1KMBT"[base / 3];
                    const a = value / Math.pow(10, base);
                    const decLen = precision - (e - base) - 1 - (a < 1 ? 1 : 0);
                    return a.toFixed(decLen) + unit;
                },
                fixedLength(isNegative, value, style) {
                    const precision = style?.precision ?? 4;
                    return this.fixedPrecision(isNegative, value, { precision: precision - (isNegative ? 1 : 0) });
                },
                mwi(_, value, style) {
                    const precision = style?.precision ?? 4;
                    if (value < 100000) return value.toFixed(0);
                    const e = Math.floor(Math.log10(value));
                    const base = Math.min(12, 3 + Math.max(0, Math.floor((e - precision) / 3) * 3));
                    const unit = "1KMBT"[base / 3];
                    const decLen = precision - (e - base) - 1;
                    return (value / Math.pow(10, base)).toFixed(decLen) + unit;
                },
                edible(_, value, style) {
                    // edible: threshold = 10, mwitools: threshold = 1
                    const threshold = style?.threshold ?? 10;
                    const precision = style?.precision ?? 1;
                    if (value >= 1e12 * threshold) return (value / 1e12).toFixed(precision) + 'T';
                    if (value >= 1e9 * threshold) return (value / 1e9).toFixed(precision) + 'B';
                    if (value >= 1e6 * threshold) return (value / 1e6).toFixed(precision) + 'M';
                    if (value >= 1e3 * threshold) return (value / 1e3).toFixed(precision) + 'K';
                    return value.toFixed(0);
                },
            };
            const isNegative = value < 0;
            value = Math.abs(value);
            const sign = (isNegative ? '-' : '');
            return sign + styleMap[style?.type ?? 'fixedLength'](isNegative, value, style);
        }
        /**
         * 每三个数之间加逗号
         * @param {number} value
         * @returns {string}
         */
        formatNumber(value) {
            return value.toString().replace(/\d+/, function (n) {
                return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
            })
        }
        formatLuck(value) {
            const ret = (value * 100).toFixed(2);
            return `${ret === '100.00' ? '100.0' : ret}%`;
        }
        /**
         * 格式化时间
         * @param {number} duration
         * @param {'hm' | 'hms' | 'h'} format
         * @returns {string}
         */
        formatDuration(duration, format = 'hm') {
            const h = Math.floor(duration / 3600);
            const m = Math.floor(duration / 60) % 60;
            const s = Math.floor(duration) % 60;
            const formatMap = {
                'hm': `${h}h ${m < 10 ? '0' : ''}${m}m`,
                'hms': `${h}h ${m < 10 ? '0' : ''}${m}m ${s < 10 ? '0' : ''}${s}s`,
                'h': `${Math.floor(duration / 3600).toFixed(1)}h`,
            };
            return formatMap[format];
        }
        /**
         * 格式化时间
         * @param {Date} date
         * @returns {string}
         */
        formatDate(date) {
            return date.toLocaleString()
        }

        /**
         * 二分查找 l <= x <= r 使得 f(x) = dest
         * @param {(x: number) => number} f 递增函数
         * @param {number} l
         * @param {number} r
         * @param {number} dest
         * @param {number} maxIter 最大迭代次数
         * @returns
         */
        binarySearch(f, l, r, dest, maxIter = 60) {
            for (let i = 0; i < maxIter; ++i) {
                let mid = (l + r) / 2;
                if (f(mid) < dest) l = mid;
                else r = mid;
            }
            return (l + r) / 2;
        };
    };

    const LocalStorageName = 'lll_data';
    const LocalStorageVersion = '0.1.11';
    const LocalStorageVerbose = true;
    const LocalStorageData = new class {
        constructor() {
            if (this.get('version') !== LocalStorageVersion) this.clearAll();
            this.set('version', LocalStorageVersion);
        }
        clearAll() {
            localStorage.removeItem(LocalStorageName);
        }
        get(key) {
            const data = JSON.parse(localStorage.getItem(LocalStorageName) ?? 'null');
            if (LocalStorageVerbose) out(`load ${key} from localStorage: ${key} =`, data?.[key]);
            return data?.[key];
        }
        set(key, value) {
            const data = JSON.parse(localStorage.getItem(LocalStorageName) ?? '{}');
            data[key] = value;
            localStorage.setItem(LocalStorageName, JSON.stringify(data));
            if (LocalStorageVerbose) out(`saved ${key} to localStorage: ${key} =`, value);
        }
    };

    let Config = {
        general: {
            /** @type {'default' | 'zh' | 'en'} */ language: 'default',
        },
        market: {
            /** @type {MarketDataSource} */ source: {
                type: 'mwi',
                addr: '',
            },
            autoUpdateInterval: 6, // (h)
            computeNetProfit: true,
            computeNonTradable: true,
        },
        charaFunc: {
            verbose: false,
            cdfIterSpeed: 0.9,
            cdfLimitEps: 1e-4,
            cdfMaxIter: 30,
            cdfEps: 1e-4,
            cdfWrapping: 0.4,
            rescaleSamples: 64,
            samples: isMobile ? 512 : 4096,
        },
        chart: {
            interpolatePoints: isMobile ? 128 : 512,
            tension: 0.4,
            defaultScale: { width: 600, height: 400 },
        },
        battleDrop: {
            verbose: false,
            analyzer: {
                minLimit: 1e8,
                perWaveLimit: 2e5,
            },
            ui: {
                overviewItemSortOrder: 'unitBid', // totalBid
                overviewItemMaxNumber: 10,
                overviewItemMinRarity: 0,
                overviewShowStdDev: true,
                overviewUseLegacyUi: isCN ? true : false,
                overviewShowFragment:false,
                overviewMsgFmt: isCN ? '总计价值: {income}   每天收入: {income.daily}/d   期望日入: {income.daily.mean}/d   当前运气: {luck}' : 'Income: {income}   Daily Income: {income.daily}/d   Expected Daily Income: {income.daily.mean}/d   Luck: {luck}',
                /** @type {'doubleClick' | 'ctrlClick' | 'disable'} */ overviewInsertToChatAction: isMobile ? 'doubleClick' : 'ctrlClick',
                customPanelShowSolo: false,
                customPanelMaxRunCount: 100000,
                customPanelMaxSliderValue: 1500,
                detailsChartCdfEps: 0.05,
                detailsChartSigmaCoeff: 2,
                customChartCdfEps: 0.005,
                customChartSigmaCoeff: 2,
            },
        },
        chestDrop: {
            verbose: false,
            // analyzer: { },
            ui: {
                useOriginalPopup: false,
                overviewItemSortOrder: 'rarity', // unitBit, totalBid, default
                customPanelMaxCount: 1000,
                customPanelMaxSliderValue: 100,
                detailsChartCdfEps: 0.05,
                detailsChartSigmaCoeff: 2,
                customChartCdfEps: 0.005,
                customChartSigmaCoeff: 2,
            }
        },
    };
    const defaultConfig = JSON.parse(JSON.stringify(Config));
    const ConfigManager = new class {
        storageDataName = 'config';
        constructor() { this.loadConfig(); }
        loadConfig() {
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
            Config = readConfig(Config, LocalStorageData.get(this.storageDataName) ?? {});
        }
        saveConfig() {
            LocalStorageData.set(this.storageDataName, Config);
        }
        reset() {
            LocalStorageData.set(this.storageDataName, {});
        }
    };

    const defaultLanguage = isCN ? 'zh' : 'en';
    let language;
    function updateLanguage() { language = Config.general.language === 'default' ? defaultLanguage : Config.general.language; }
    updateLanguage();

    const UiLocale = {
        chart: {
            expectation: { zh: '期望', en: 'Expectation' },
            stddev: { zh: '标准差', en: 'Standard Deviation' },
            median: { zh: '中位数', en: 'Median' },
            income: { zh: '收入', en: 'Income' },
        },
        battleDrop: {
            tabLabel: { zh: '战斗', en: 'Combat' },
            btnLabel: { zh: '统计', en: 'Statistics' },
            sortOrder: {
                totalBid: { zh: '总价值（卖）', en: 'Total price (bid)' },
                totalAsk: { zh: '总价值（买）', en: 'Total price (ask)' },
                unitBid: { zh: '单位价值（卖）', en: 'Unit price (bid)' },
                unitAsk: { zh: '单位价值（买）', en: 'Unit price (ask)' },
            },
            overview: {
                tabLabel: { zh: '概览', en: 'Overview' },
                income: { zh: '总计价值', en: 'Income' },
                dailyIncome: { zh: '每天收入', en: 'Daily Income' },
                dailyProfit: { zh: '每天利润', en: 'Daily Profit' },
                luck: { zh: '当前运气', en: 'Luck' },
                mean: { zh: '期望', en: 'mean' },
                stdDev: { zh: '标准差', en: 'std. dev.' },
                experience: { zh: '经验', en: ' EXP' },
                total: { zh: '总计', en: 'Total'},
                incomeExpt: { zh: '期望产值', en: 'E[income]' },
                fragmentExpt: { zh: '碎片效率', en: 'E[Frags]' },
                fragmentTotal: { zh: '期望总数', en: 'Total Frags' },
                dailyIncomeExpt: { zh: '期望日入', en: 'E[daily income]' },
                dailyProfitExpt: { zh: '期望日利', en: 'E[daily profit]' },
                info400: {
                    zh: r => `打了 ${r} 次<br>什么都没掉${['🤡', '😅', '😰', '😨', '😋', '😵', '🤯'][Utils.randInt(0, 7)]}`,
                    en: r => `${r} epochs,<br>get nothing${['🤡', '😅', '😰', '😨', '😋', '😵', '🤯'][Utils.randInt(0, 7)]}`,
                },
                info800: {
                    zh: r => `打了 ${r} 次<br>什么都没掉🤣👉`,
                    en: r => `${r} epochs,<br>get nothing🤣👉`,
                },
            },
            distribution: {
                tabLabel: { zh: '分布', en: 'Distribution' },
                allMap: { zh: '全图收益分布', en: 'Distributions for all maps' },
                mapSelect: { zh: '地图', en: 'Map' },
                epochInput: { zh: '战斗次数', en: 'Epochs' },
                back: { zh: '返回', en: 'Back' },
            },
            history: {
                tabLabel: { zh: '历史', en: 'History' },
            },
            settings: {
                tabLabel: { zh: '设置', en: 'Settings' },
                sortOrder: { zh: '掉落物排序方式', en: 'Loot items sorting order' },
                displayLimit: { zh: '掉落物最大显示数量', en: 'Loot items display limit' },
                showNormal: { zh: '显示普通掉落物', en: 'Show normal items' },
                insertToChatAction: { zh: '发送统计信息到聊天框', en: 'Insert statistics information to chat panel' },
                doubleClick: { zh: '双击', en: 'Double click' },
                ctrlClick: { zh: 'Ctrl + 单击', en: 'Ctrl + click' },
                disable: { zh: '禁用', en: 'Disable' },
                msgFmt: { zh: '消息格式', en: 'Chat message format' },
                msgFmtDesc: {
                    zh: `
                        {income}: 当前收入; <br>
                        {income.daily}: 每日收入; <br>
                        {profit}: 当前利润; <br>
                        {profit.daily}: 每日利润; <br>
                        {*.mean}: 期望（例如 {income.daily.mean} 表示期望日入）; <br>
                        {*.stddev}: 标准差; <br>
                    `,
                    en: `
                        {income}: Current income; <br>
                        {income.daily}: Daily income; <br>
                        {profit}: Current profit; <br>
                        {profit.daily}: Daily profit; <br>
                        {*.mean}: Expectation (e.g., {income.daily.mean} denotes expected income per day); <br>
                        {*.stddev}: Standard deviation; <br>
                    `
                },
                useLegacyUi: { zh: '使用旧版 UI', en: 'Use legacy UI' },
                showStdDev: { zh: '显示标准差', en: 'Show standard deviation' },
                showFragment: { zh: '显示碎片', en: 'Show fragment' },
            },
        },
        chestDrop: {
            tabLabel: { zh: '开箱', en: 'Chest Opening' },
            sortOrder: {
                default: { zh: '默认排序', en: 'Default' },
                rarity: { zh: '稀有度', en: 'Rarity' },
                totalBid: { zh: '总价值（卖）', en: 'Total price (bid)' },
                unitBid: { zh: '单位价值（卖）', en: 'Unit price (bid)' },
            },
            chestOpen: {
                tabLabel: { zh: '概览', en: 'Overview' },
                openedLoot: { zh: '打开的战利品', en: 'Opened Loot' },
                youFound: { zh: '你找到了', en: 'You found' },
                currentChest: { zh: '当前箱子', en: 'Current' },
                history: { zh: '历史记录', en: 'History' },
                close: { zh: '关闭', en: 'Close' },
                details: { zh: '详细', en: 'Details' },
                count: { zh: '开箱次数', en: 'Amount' },
                income: { zh: '开箱价值', en: 'Income' },
                profit: { zh: '当前利润', en: 'Profit' },
                luck: { zh: '当前运气', en: 'Luck' },
                incomeExpt: { zh: '期望价值', en: 'E[income]' },
                histLuck: { zh: '历史运气', en: 'Luck' },
                higherThanExpt: { zh: '高于期望', en: 'Higher' },
                lowerThanExpt: { zh: '低于期望', en: 'Lower' },
                stdDev: { zh: '标准差', en: 'std. dev.' },
            },
            distribution: {
                tabLabel: { zh: '分布', en: 'Distribution' },
                allChest: { zh: '所有箱子收益分布', en: 'Distributions for all chests' },
                chestSelect: { zh: '箱子', en: 'Chest' },
                cntInput: { zh: '开箱次数', en: 'Amount' },
                return: { zh: '返回', en: 'Return' },
            },
            settings: {
                tabLabel: { zh: '设置', en: 'Settings' },
                useOriPopup: { zh: '使用原版开箱界面', en: 'Use original popup' },
            },
        },
        taskAnalyzer: {
            tabLabel: { zh: '任务', en: 'Task' },
            btnLabel: { zh: '统计', en: 'Statistics' },
            tooltip: {
                tabLabel: { zh: '任务统计', en: 'Statistics' },
                overflowTime: { zh: '任务溢出时间', en: 'Task overflow time' },
                expectedRewards: {
                    zh: (price, coin, token) => `任务期望奖励: ${price} (${coin} 金币, ${token} 任务代币)`,
                    en: (price, coin, token) => `Expected rewards: ${price} (${coin} coins, ${token} task tokens)`
                },
                expectedEpochs: { zh: '期望次数', en: 'Expected epochs in each zone' },
                mapRunCount: {
                    zh: (z, tot, rest) => `图 ${z}: ${tot} 次 (剩 ${rest} 次)`,
                    en: (z, tot, rest) => `Z${z}: ${tot} (${rest} rest)`,
                }
            },
        },
        tooltip: {
            item: {
                count: { zh: '数量', en: 'Amount' },
                price: { zh: '价格', en: 'Price' },
            }
        },
        settings: {
            market: {
                tabLabel: { zh: '市场', en: 'Market' },
                apiSource: { zh: '市场数据源', en: 'Market API source' },
                apiAddr: { zh: 'API 地址', en: 'API address' },
                apiOfficial: { zh: '官方', en: 'Official' },
                apiOfficialCN: { zh: '中国镜像', en: 'OfficialCN' },
                apiCustom: { zh: '自定义', en: 'Custom' },
                autoUpdateTime: { zh: '自动更新间隔 (h)', en: 'Auto update time interval (h)' },
                updateMarket: { zh: '更新市场价格', en: 'Update market data' },
                fetchMarketDataFail: { zh: '获取价格失败', en: 'Fetch market data failed' },
                lastUpdated: { zh: '上次更新时间', en: 'Last updated' },
                updating: { zh: '更新中', en: 'Updating' },
                updateFinish: { zh: '更新完成', en: 'Update finished' },
                computeNetProfit: { zh: '计算净利润', en: 'Show net profit' },
                computeNetProfitDesc: { zh: '扣除 2% 的税 (牛铃扣 18%)', en: '2% taxed (18% for cowbells)' },
                computeNonTradable: { zh: '计算不可交易物品的卖价', en: 'Compute bid price of non-tradeable assets' },
                computeNonTradableDesc: { zh: '牛铃、背部装备等', en: 'Cowbells, back equipments' },
            },
            misc: {
                tabLabel: { zh: '其它', en: 'Misc.' },
                language: { zh: '语言', en: 'Language' },
                languageDefault: { zh: '默认', en: 'Default' },
                sampleRate: { zh: '采样数', en: 'Sample rate' },
                sampleRateDesc: { zh: '采样数越大，运气计算越精确、速度越慢', en: 'Better accuracy but longer running time for larger sample rate' },
                interpolationCount: { zh: '图表关键点数', en: 'Chart interpolation count' },
                interpolationCountDesc: { zh: '关键点越多，图表绘制越精细', en: 'Better chart for larger interpolation count' },
            },
        },
    };


    //#region Listener

    const MessageHandler = new class {
        /**
         * @typedef { 'init_client_data' | 'init_character_data'
         *   | 'new_battle' | 'action_completed'
         *   | 'loot_opened'
         *   | 'skills_updated' | 'character_info_updated'
         *   | 'quests_updated' | 'task_type_blocks_updated' | 'discard_random_task'
         * } MessageType
         */

        listeners = {};

        constructor() { this.hookWS(); }

        hookWS() {
            const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
            const oriGet = dataProperty.get;
            dataProperty.get = hookedGet;
            Object.defineProperty(MessageEvent.prototype, "data", dataProperty);
            const handleMessageRecv = this.handleMessageRecv.bind(this);

            function hookedGet() {
                const socket = this.currentTarget;
                if (!(socket instanceof WebSocket)) {
                    return oriGet.call(this);
                }
                if (socket.url.indexOf("api.milkywayidle.com/ws") <= -1 && socket.url.indexOf("api.milkywayidlecn.com/ws") <= -1 && socket.url.indexOf("api-test.milkywayidle.com/ws") <= -1) {
                    return oriGet.call(this);
                }
                const message = oriGet.call(this);
                Object.defineProperty(this, "data", { value: message }); // Anti-loop
                handleMessageRecv(message);
                return message;
            }
        }

        /**
         *
         * @param {MessageType} type
         * @param {(msg: string) => void} handler
         * @param {number} priority
         */
        addListener(type, handler, priority = 0) {
            (this.listeners[type] ??= []).push({
                handler: handler,
                priority: priority,
            });
        }

        handleMessageRecv(message) {
            let obj = JSON.parse(message);
            if (!obj) return message;
            if (!this.listeners.hasOwnProperty(obj.type)) return message;
            this.listeners[obj.type]
                .sort((a, b) => a.priority - b.priority)
                .forEach(f => { f.handler(obj); });
            return message;
        }
    };

    const Keyboard = new class {
        #isKeyDown = {};

        constructor() {
            document.addEventListener('keydown', (event) => {
                this.#isKeyDown[event.key] = true;
            });
            document.addEventListener('keyup', (event) => {
                this.#isKeyDown[event.key] = false;
            });
        }
        isKeyDown(key) {
            return this.#isKeyDown[key] ?? false;
        }
        isCtrlDown() {
            return this.isKeyDown('Control') || this.isKeyDown('Meta');
        }
    }

    //#endregion


    //#region Math

    /** Complex number
     * @typedef {number[]} Complex
     */
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

    /** Cumulative distribution function
     * @typedef {(x: number) => number} CDF
     */
    /** Characteristic function: (samples, scale) => [ MGF(scale * T * 2πi) : 0 <= T < samples ]
     * @typedef {(samples: number, scale: number) => Complex[]} CharaFunc
     */
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

    const DropAnalyzer = new class {
        /**
         * @typedef {Object} ItemDropData
         * @property {string} hrid 物品名称
         * @property {number[] | number} dropRate 掉落概率
         * @property {number} minCount 最少掉落数量
         * @property {number} maxCount 最多掉落数量
         * @property {number} price 物品价格
         */

        /**
         * @param {ItemDropData} item
         * @param {number} difficultyTier
         * @returns {number}
         */
        itemCountExpt(item, difficultyTier = 0) {
            let { minCount: l, maxCount: r, dropRate } = item;
            if (!(typeof dropRate === 'number')) {dropRate = dropRate[difficultyTier]}
            return dropRate * (l + r) / 2;
        }

        /**
         * @param {ItemDropData} item
         * @param {number} difficultyTier
         * @returns {number}
         */
        itemCountVar(item, difficultyTier = 0) {
            let { minCount: l, maxCount: r, dropRate } = item;
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
            const EX = this.itemCountExpt(item);
            if (!(typeof dropRate === 'number')) {dropRate = dropRate[difficultyTier]}
            return dropRate * EX2(l, r) - EX * EX;
        }

        /** Characteristic function for drop distribution (minCount, maxCount, dropRate, price).
         * @param {ItemDropData} data
         * @returns {CharaFunc}
         */
        charaFunc(data) {
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
                    const [cosR1, sinR1] = CharaFunc.getRoots(base * (R + 1), samples);
                    const [cosR, sinR] = CharaFunc.getRoots(base * R, samples);
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
                    const [cos, sin] = CharaFunc.getRoots(base, samples);
                    const [cosR, sinR] = CharaFunc.getRoots(base * R, samples);
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
                const [cos, sin] = CharaFunc.getRoots(base, samples);
                const [cosR, sinR] = CharaFunc.getRoots(base * R, samples);
                const [cosL, sinL] = CharaFunc.getRoots(base * L, samples);
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
    };

    //#endregion


    //#region UI

    const Ui = new class {
        constructor() {
            // 创建阴影效果
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            defs.innerHTML = `
                <filter id="lll_shadow" x="-20" y="-20" height="150" width="150">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                    <feOffset dx="0" dy="0" result="offsetblur"/>
                    <feFlood flood-color="rgba(0, 0, 0, 0.3)"/>
                    <feComposite in2="offsetblur" operator="in"/>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            `;
            svg.appendChild(defs);
            document.body.appendChild(svg);
        }

        /**
         * @param {HTMLElement} elem
         * @param {Object} options
         */
        applyOptions(elem, options) {
            if (typeof options === 'object') {
                Object.entries(options ?? {}).forEach(([key, value]) => {
                    if (key === 'style' && typeof value === 'object') {
                        Object.entries(value ?? {}).forEach(([k, v]) => { elem.style[k] = v; });
                    } else elem[key] = value;
                });
            } else elem.className = options;
        }

        elem(tagName, options = null, child = null) {
            const elem = document.createElement(tagName);
            this.applyOptions(elem, options);
            if (typeof child === 'object') {
                if (Array.isArray(child)) child.forEach(child => { if (child !== null) elem.appendChild(child); });
                else if (child) elem.appendChild(child);
            } else if (typeof child === 'string') elem.innerHTML = child;
            return elem;
        }

        div(options = null, childList = null) {
            return this.elem('div', options, childList);
        }

        button(text, options = null) {
            const button = Ui.elem('button', {
                className: 'Button_button__1Fe9z lll_btn',
                textContent: text,
            });
            this.applyOptions(button, options);
            return button;
        }

        /**
         * @param {{ checked: boolean, onchange: (checked: boolean) => void }} options
         * @param {Object} uiOptions
         */
        checkBox(options, uiOptions = null) {
            const input = Ui.elem('input', 'lll_input_checkbox');
            input.type = 'checkbox';
            input.checked = options.checked;
            input.onchange = () => { options.onchange(input.checked); };
            this.applyOptions(input, uiOptions);
            return input;
        }

        /**
         * @typedef {Object} SliderOptions
         * @property {number} initValue
         * @property {number} minValue
         * @property {number} maxValue
         * @property {(value: number) => number} mapFunc
         * @property {(sliderValue: number) => number} invMapFunc
         * @property {(value: number) => void} [oninput = null]
         * @property {(value: number) => void} [onchange = null]
         */
        /**
         * @param {SliderOptions} options
         * @param {Object} inputOptions
         * @param {Object} labelOptions
         * @param {Object} wrapperOptions
         */
        slider(options, inputOptions = null, labelOptions = null, wrapperOptions = null) {
            const input = Ui.elem('input', 'lll_input_slider');
            this.applyOptions(input, inputOptions);
            input.type = 'range';
            input.min = Math.ceil(options.invMapFunc(options.minValue)).toString();
            input.max = Math.floor(options.invMapFunc(options.maxValue)).toString();
            input.step = '1';
            input.value = Math.round(options.invMapFunc(options.initValue)).toString();
            const label = Ui.div('lll_input_sliderLabel', options.initValue.toString());
            this.applyOptions(label, labelOptions);
            const wrapper = Ui.div('lll_input_sliderWrapper', [input, label]);
            this.applyOptions(wrapper, wrapperOptions);
            input.oninput = () => {
                const value = options.mapFunc(parseInt(input.value));
                label.innerHTML = value.toString();
                options.oninput?.(value);
            };
            input.onchange = () => {
                const value = options.mapFunc(parseInt(input.value));
                label.innerHTML = value.toString();
                options.onchange?.(value);
            };
            return wrapper;
        }

        /**
         * @typedef {Object} NumberInputOptions
         * @property {number} initValue
         * @property {number} minValue
         * @property {number} maxValue
         * @property {(value: number) => void} [oninput = null]
         * @property {(value: number) => void} [onchange = null]
         */
        /**
         * @param {NumberInputOptions} options
         * @param {Object} uiOptions
         */
        numberInput(options, uiOptions = null) {
            let input = Ui.elem('input', 'lll_input');
            this.applyOptions(input, uiOptions);
            input.type = 'number';
            input.min = options.minValue.toString();
            input.max = options.maxValue.toString();
            input.step = 1;
            input.value = options.initValue.toString();
            input.oninput = () => {
                let val = Math.round(parseInt(input.value));
                options.oninput?.(val);
            }
            input.onchange = () => {
                let val = Math.round(parseInt(input.value));
                val = Math.min(Math.max(val, options.minValue), options.maxValue);
                input.value = val.toString();
                options.onchange?.(val);
            };
            return input;
        }

        itemSvgIcon(hrid, size = 20, useShadow = false) {
            // 创建图标
            let svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgIcon.setAttribute('width', size.toString());
            svgIcon.setAttribute('height', size.toString());
            svgIcon.style.verticalAlign = 'middle';

            let useElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            let item_icon_url = document.querySelector("div[class^='Item_itemContainer'] use")?.getAttribute("href")?.split("#")[0];
            item_icon_url ??= '/static/media/items_sprite.6d12eb9d.svg';
            useElement.setAttribute('href', `${item_icon_url}#${hrid.split('/').pop()}`);
            if (useShadow) useElement.setAttribute('filter', 'url(#lll_shadow)');
            svgIcon.appendChild(useElement);
            return svgIcon;
        }
    };

    const Tooltip = new class {
        root = null;
        tooltip = null;

        constructor() { this.init(); }

        init() {
            const rootClass = 'link-tooltip MuiPopper-root MuiTooltip-popper css-112l0a2';
            const tooltipClass = 'MuiTooltip-tooltip MuiTooltip-tooltipPlacementBottom css-1spb1s5';
            this.tooltip = Ui.div(tooltipClass);
            this.root = Ui.div({ className: rootClass, style: { zIndex: 100000, position: 'absolute' } }, this.tooltip);
            document.body.appendChild(this.root);
            this.hide();
        }

        /**
         * @param {Element} target
         * @param {Element | (() => Element)} content
         * @param {'left' | 'center'} align
         */
        attach(target, content, align = 'left') {
            const contentGen = typeof content === 'function' ? content : (() => content);
            target.addEventListener('mouseover', (e) => {
                this.show(contentGen().outerHTML, target, align);
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
                Ui.div('GuideTooltip_title__1QDN9', title),
                Ui.div('GuideTooltip_content__1_yqJ', Ui.div('GuideTooltip_paragraph__18Zcq', content)),
            ] : [
                Ui.div('GuideTooltip_paragraph__18Zcq', content)
            ];
            return Ui.div('GuideTooltip_guideTooltipText__PhA_Q', childList);
        }
        item(hrid, count) {
            const ask = Market.getPriceByHrid(hrid, 'ask');
            const bid = Market.getPriceByHrid(hrid, 'bid');
            const formatPrice = x => Utils.formatPrice(x, { precision: 3 });
            return Ui.div('ItemTooltipText_itemTooltipText__zFq3A', [
                Ui.div('ItemTooltipText_name__2JAHA', Localizer.hridToName(hrid)),
                Ui.div(null, `${UiLocale.tooltip.item.count[language]}: ${Utils.formatNumber(count)}`),
                Ui.div({ style: { color: '#804600' } },
                    `${UiLocale.tooltip.item.price[language]}: ${formatPrice(ask)} / ${formatPrice(bid)} (${formatPrice(ask * count)} / ${formatPrice(bid * count)})`
                ),
            ]);
        }
    }

    class Popup {
        parentNode = document.body;
        root = null;
        onclose = null;
        rescale() { }
        construct() {
            throw new Error("Method not implemented.");
        }
        open() {
            if (this.root) this.close();
            this.construct();
            this.parentNode.append(this.root);
            const onWindowResize = () => {
                if (!this.root) return;
                this.rescale();
            }
            onWindowResize();
            window.addEventListener('resize', () => { onWindowResize(); });
        }
        close() {
            if (!this.root) return;
            this.onclose?.();
            this.parentNode.removeChild(this.root);
            this.root = null;
        }
    };

    class TabbedPopup extends Popup {
        btnContainer = null;
        btns = null;
        showSettings = true;

        pageContainer = null;
        pages = null;
        generators = null;

        pageTitle = null;
        pageTitleText = null;
        pageTitles = null;

        createCloseSvg() {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '11px');
            svg.setAttribute('height', '11px');
            svg.setAttribute('viewBox', '0 0 1280 1280');
            svg.innerHTML = `
            <g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)" fill="#5b2f2f" stroke="none">
                <path d="M2321 12784 c-122 -33 -105 -17 -1184 -1093 -565 -565 -1041 -1046 -1057 -1070 -94 -140 -103 -331 -23 -471 16 -28 702 -722 1877 -1897 l1851 -1853 -1856 -1857 c-1511 -1512 -1860 -1867 -1878 -1906 -29 -64 -51 -152 -51 -202 0 -59 27 -161 57 -219 39 -74 2085 -2120 2159 -2159 137 -72 291 -74 427 -6 29 14 611 590 1899 1877 l1858 1857 1852 -1851 c1176 -1175 1870 -1861 1898 -1877 149 -86 343 -70 487 38 32 23 513 499 1069 1056 765 768 1017 1026 1037 1065 73 141 74 305 0 434 -16 28 -709 729 -1877 1898 l-1851 1852 1851 1853 c1168 1168 1861 1869 1877 1897 74 129 73 293 0 434 -20 39 -272 297 -1037 1065 -556 557 -1037 1033 -1069 1056 -144 108 -338 124 -487 38 -28 -16 -722 -702 -1898 -1877 l-1852 -1851 -1858 1857 c-1288 1287 -1870 1863 -1899 1877 -100 50 -219 63 -322 35z"/>
            </g>`;
            return svg;
        }
        createSettingsSvg() {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '13px');
            svg.setAttribute('height', '13px');
            svg.setAttribute('viewBox', '0 0 1280 1280');
            svg.innerHTML = `
            <g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)" fill="#2f3451" stroke="none">
                <path d="M6010 12794 c-25 -2 -103 -9 -175 -15 -143 -12 -390 -49 -503 -74
                l-72 -17 0 -529 0 -530 -139 -207 c-158 -234 -272 -376 -371 -461 -174 -150
                -329 -225 -570 -277 -67 -15 -129 -18 -290 -18 -216 0 -338 13 -540 59 l-103
                23 -366 366 -367 367 -139 -112 c-409 -327 -760 -689 -1070 -1102 l-58 -78
                355 -357 356 -357 40 -105 c99 -258 137 -439 137 -655 0 -152 -9 -214 -47
                -339 -97 -315 -393 -608 -871 -861 l-104 -55 -510 0 c-437 0 -512 -2 -516 -14
                -10 -26 -55 -336 -69 -471 -8 -82 -13 -266 -12 -495 0 -373 10 -553 54 -954
                11 -99 20 -183 20 -188 0 -4 227 -8 504 -8 l503 0 84 -34 c417 -169 661 -374
                800 -672 141 -299 140 -732 -2 -1218 l-21 -71 -356 -357 -356 -357 27 -40 c45
                -68 219 -281 350 -427 251 -282 517 -537 771 -740 l130 -105 371 371 371 370
                79 10 c142 17 511 23 645 11 434 -40 741 -184 989 -464 75 -86 193 -261 250
                -373 l41 -81 0 -525 0 -525 103 -16 c144 -23 406 -54 577 -69 189 -17 765 -16
                935 0 137 14 468 59 498 68 16 5 17 39 17 538 l0 532 46 95 c141 290 366 525
                634 659 117 59 291 114 445 141 113 20 164 23 385 24 154 0 302 -5 375 -14
                l120 -13 397 -400 398 -401 37 29 c85 63 356 286 468 384 302 265 573 556 755
                813 l34 48 -397 397 -397 397 -34 170 c-59 293 -70 384 -70 585 -1 143 4 204
                18 270 48 220 136 387 291 549 142 149 293 255 533 375 l132 66 575 0 575 0 5
                23 c7 35 34 248 50 407 52 515 43 1075 -26 1529 -11 75 -22 144 -25 154 -5 16
                -42 17 -589 17 l-584 0 -128 64 c-540 271 -784 609 -818 1136 -10 155 22 485
                75 760 l10 55 405 405 405 405 -64 93 c-205 303 -507 614 -872 897 -182 143
                -372 278 -382 273 -5 -1 -184 -174 -396 -383 -279 -274 -397 -384 -424 -393
                -20 -8 -100 -27 -177 -43 -747 -155 -1306 99 -1725 786 l-60 99 0 553 c0 455
                -2 553 -13 553 -8 0 -94 9 -193 20 -364 40 -536 51 -829 54 -165 2 -320 2
                -345 0z m725 -4200 c242 -29 482 -102 720 -219 252 -124 440 -260 636 -461
                291 -300 495 -679 589 -1095 65 -289 67 -678 4 -964 -181 -817 -764 -1463
                -1548 -1714 -241 -77 -425 -105 -691 -105 -372 0 -669 68 -1000 229 -332 161
                -616 393 -826 675 -113 152 -159 227 -239 392 -117 239 -193 507 -221 777 -16
                153 -6 431 20 586 123 727 562 1329 1214 1665 420 217 856 293 1342 234z"/>
            </g>`;
            return svg;
        }

        rescale() {
            // ref: 650px
            if (!window?.innerWidth) return;
            const maxWidth = 0.9 * window.innerWidth;
            const scale = Math.min(1, maxWidth / 650);
            this.root.style.transform = `translate(-50%, -50%) scale(${scale})`;
            this.root.style.maxWidth = `${90 / scale}%`;
            this.root.style.maxHeight = `${90 / scale}%`;
        }

        handleDrag(header, panel) {
            let offsetX, offsetY;
            let dragging = false;
            let dragStartTime = 0;
            const dragBegin = function (e, pos) {
                const rect = panel.getBoundingClientRect();
                const isResizing = e.clientX > rect.right - 10 || e.clientY > rect.bottom - 10;
                if (isResizing || e.target.className === "lll_tab_btn") return;
                dragging = true;
                offsetX = pos.clientX - panel.offsetLeft;
                offsetY = pos.clientY - panel.offsetTop;
                e.preventDefault();
            };
            const dragMove = function (e, pos) {
                if (!dragging) return;
                const now = Date.now();
                if (now - dragStartTime < 16) return; // 限制每16毫秒更新一次
                dragStartTime = now;

                var newX = pos.clientX - offsetX;
                var newY = pos.clientY - offsetY;
                panel.style.left = Math.round(newX) + "px";
                panel.style.top = Math.round(newY) + "px";
            };
            const dragEnd = function () { dragging = false; };

            header.addEventListener("mousedown", e => { dragBegin(e, e); });
            document.addEventListener("mousemove", e => { dragMove(e, e); });
            document.addEventListener("mouseup", dragEnd);

            header.addEventListener("touchstart", e => { dragBegin(e, e.touches[0]); });
            document.addEventListener("touchmove", e => { dragMove(e, e.touches[0]); });
            document.addEventListener("touchend", dragEnd);
        }

        construct() {
            this.btnContainer = Ui.div('lll_tab_btnContainer');
            this.btns = [];
            this.pageTitleText = Ui.div('lll_tab_pageTitleText');
            this.pages = [];
            this.pages = [];
            this.generators = [];
            this.pageTitle = Ui.div('lll_tab_pageTitle', this.pageTitleText);
            this.pageContainer = Ui.div('lll_tab_pageContainer', this.pageTitle);
            this.pageTitles = [];
            const settingsBtn = Ui.div('lll_tab_btnSettingsContainer', Ui.div('lll_tab_btnSettings', this.createSettingsSvg()));
            settingsBtn.onclick = () => { SettingsUi.showPopup(); };
            const closeBtn = Ui.div('lll_tab_btnCloseContainer', Ui.div('lll_tab_btnClose', this.createCloseSvg()));
            closeBtn.onclick = () => { this.close(); };
            this.root = Ui.div('lll_popup_root', [
                Ui.div({ style: 'display: flex;' }, [this.btnContainer, this.showSettings ? settingsBtn : null, closeBtn]),
                this.pageContainer
            ]);
            this.handleDrag(this.btnContainer, this.root);
        }
        switchTab(id) {
            for (let i = 0; i < this.pages.length; ++i) {
                this.pages[i].className = i === id ? 'lll_tab_page active' : 'lll_tab_page';
                this.btns[i].className = i === id ? 'lll_tab_btn active' : 'lll_tab_btn';
            }
            const currentPage = this.pages[id];
            if (currentPage.lastChild) {
                currentPage.removeChild(currentPage.lastChild);
            }
            currentPage.appendChild(this.generators[id]());
            if (this.pageTitles[id]) {
                this.pageTitleText.innerHTML = this.pageTitles[id];
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

            const page = Ui.div('lll_tab_page');
            this.pages.push(page);
            this.pageContainer.appendChild(page);
            const titleHTML = typeof title === 'object' ? title?.outerHTML : title;
            this.pageTitles.push(titleHTML);
            if (id === 0) this.switchTab(id);
        }
    };

    class PlainPopup extends Popup {
        title = '';
        contentGen = null;

        construct() {
            this.root = Ui.div('lll_plainPopup_root', [
                Ui.div({ className: 'lll_plainPopup_background', onclick: () => { this.close(); } }),
                Ui.div('lll_plainPopup_containerRoot',
                    Ui.div('lll_plainPopup_container', [
                        Ui.div('lll_plainPopup_title', this.title),
                        this.contentGen(),
                    ])
                )
            ]);
        }
        setContent(content, title = null) {
            this.contentGen = typeof content === 'function' ? content : (() => content);
            this.title = title;
        }
    };

    const ChartRenderer = new class {
        constructor() {
            this.initChartTooltip();
        }

        initChartTooltip() {
            // @ts-ignore
            Chart.Tooltip.positioners.myCustomPositioner = function (elements, eventPosition) {
                let x = 0, y = 0, count = 0;
                for (let e of elements) {
                    // @ts-ignore
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
            // @ts-ignore
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

        #generateDataSetCDF(f, l, r) {
            const N = Config.chart.interpolatePoints;
            let ret = [];
            for (let i = 0; i <= N; ++i) {
                const x = i * (r - l) / N + l;
                ret.push({ x: x, y: f(x) });
            }
            return ret;
        };
        #generateDataSetPDF(f, l, r) {
            const N = Config.chart.interpolatePoints;
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

        /**
         * @param {HTMLCanvasElement} canvas
         * @param {{
         *     limitL: number, limitR: number,
         *     datasets: { cdf: CDF, shadow: number, display: boolean, label: string, color: number}[]
         * }} data
         * @returns {Chart}
         */
        cdfPdfChart(canvas, data) {
            const rgbaColor = (color, a) => {
                return Utils.HSVtoRGB(color, 0.4, 1, a).rgba;
            }
            const generateCDF = (f, l = data.limitL, r = data.limitR) => this.#generateDataSetCDF(f, l, r);
            const generatePDF = (f, l = data.limitL, r = data.limitR) => this.#generateDataSetPDF(f, l, r);

            let datasets = [];
            for (const dataset of data.datasets) {
                datasets.push({
                    borderColor: rgbaColor(dataset.color, 1),
                    borderWidth: 2,
                    showLine: true,
                    hidden: !dataset.display,
                    label: dataset.label,
                    data: generateCDF(dataset.cdf),
                    interpolate: true,
                    pointRadius: 0,
                    tension: Config.chart.tension,
                    fill: false,
                    tag: "cdf",
                });
                datasets.push({
                    borderColor: rgbaColor(dataset.color, 1),
                    borderWidth: 2,
                    showLine: true,
                    hidden: !dataset.display,
                    label: dataset.label + "(PDF)",
                    data: generatePDF(dataset.cdf),
                    interpolate: true,
                    pointRadius: 0,
                    tension: Config.chart.tension,
                    fill: false,
                    tag: "pdf",
                });
                datasets.push({
                    backgroundColor: rgbaColor(dataset.color, 0.4),
                    borderWidth: 0,
                    showLine: true,
                    label: "",
                    data: [{ x: 0, y: 0 }, { x: dataset.shadow, y: 0 }],
                    pointRadius: 0,
                    fill: "-2",
                    tag: "aux",
                });
                datasets.push({
                    backgroundColor: rgbaColor(dataset.color, 0.4),
                    borderWidth: 0,
                    showLine: true,
                    label: "",
                    data: [{ x: 0, y: -1 }, { x: dataset.shadow, y: -1 }],
                    pointRadius: 0,
                    fill: "-2",
                    tag: "aux",
                });
            }

            const chart = new Chart(canvas.getContext('2d'), {
                type: "scatter",
                data: { datasets: datasets },
                options: {
                    // @ts-ignore
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
                                    for (let i = 0; i < data.datasets.length; ++i) {
                                        const dataset = data.datasets[i];
                                        chart.data.datasets[i * 4].data = generateCDF(dataset.cdf, start, end);
                                        chart.data.datasets[i * 4 + 1].data = generatePDF(dataset.cdf, start, end);
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
                        // @ts-ignore
                        x: {
                            min: data.limitL,
                            max: data.limitR,
                            type: 'linear',
                            title: { display: true, text: UiLocale.chart.income[language] },
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
            return chart;
        }

        /**
         * @param {HTMLCanvasElement} canvas
         * @param {{
         *     limitL: number, limitR: number,
         *     cdf: CDF, mu: number, sigma: number, median: number
         * }} data
         * @returns {Chart}
         */
        cdfPdfWithMedianMeanChart(canvas, data) {
            const rgbaColor = (color, a, s = 0.4, v = 1) => {
                return Utils.HSVtoRGB(color, s, v, a).rgba;
            }
            const generateCDF = (f, l = data.limitL, r = data.limitR) => this.#generateDataSetCDF(f, l, r);
            const generatePDF = (f, l = data.limitL, r = data.limitR) => this.#generateDataSetPDF(f, l, r);
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
                label: '',
                data: generateCDF(data.cdf),
                interpolate: true,
                pointRadius: 0,
                tension: Config.chart.tension,
                fill: false,
                tag: "cdf",
            });
            datasets.push({
                borderColor: rgbaColor(0, 1),
                borderWidth: 2,
                showLine: true,
                label: '',
                data: generatePDF(data.cdf),
                interpolate: true,
                pointRadius: 0,
                tension: Config.chart.tension,
                fill: false,
                tag: "pdf",
            });
            datasets.push({
                borderColor: rgbaColor(0, 1, 0.25),
                borderWidth: 2,
                showLine: true,
                label: UiLocale.chart.expectation[language],
                data: [{ x: data.mu, y: 0 }, { x: data.mu, y: interpolate(datasets[0].data, data.mu) }],
                pointRadius: 0,
                tag: "aux",
            });
            datasets.push({
                borderColor: rgbaColor(0, 1, 0.25),
                borderWidth: 2,
                showLine: true,
                label: "",
                data: [{ x: data.mu, y: -1 }, { x: data.mu, y: interpolate(datasets[1].data, data.mu) }],
                pointRadius: 0,
                tag: "aux",
            });
            datasets.push({
                backgroundColor: rgbaColor(0, 0.3, 0.3),
                borderWidth: 0,
                showLine: true,
                label: UiLocale.chart.stddev[language],
                data: [{ x: Math.max(0, data.mu - data.sigma), y: 0 }, { x: data.mu + data.sigma, y: 0 }],
                pointRadius: 0,
                fill: "-4",
                tag: "aux",
            });
            datasets.push({
                backgroundColor: rgbaColor(0, 0.3, 0.3),
                borderWidth: 0,
                showLine: true,
                label: "",
                data: [{ x: Math.max(0, data.mu - data.sigma), y: -1 }, { x: data.mu + data.sigma, y: -1 }],
                pointRadius: 0,
                fill: "-4",
                tag: "aux",
            });
            datasets.push({
                borderColor: rgbaColor(0.2, 1, 0.3),
                borderWidth: 2,
                showLine: true,
                label: UiLocale.chart.median[language],
                data: [{ x: data.median, y: 0 }, { x: data.median, y: interpolate(datasets[0].data, data.median) }],
                pointRadius: 0,
                tag: "aux",
            });
            datasets.push({
                borderColor: rgbaColor(0.2, 1, 0.3),
                borderWidth: 2,
                showLine: true,
                label: "",
                data: [{ x: data.median, y: -1 }, { x: data.median, y: interpolate(datasets[1].data, data.median) }],
                pointRadius: 0,
                tag: "aux",
            });

            const chart = new Chart(canvas.getContext('2d'), {
                type: "scatter",
                data: { datasets: datasets },
                options: {
                    // @ts-ignore
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
                                    chart.data.datasets[2].data = [{ x: data.mu, y: 0 }, { x: data.mu, y: interpolate(datasets[0].data, data.mu) }];
                                    chart.data.datasets[3].data = [{ x: data.mu, y: -1 }, { x: data.mu, y: interpolate(datasets[1].data, data.mu) }];
                                    chart.data.datasets[6].data = [{ x: data.median, y: 0 }, { x: data.median, y: interpolate(datasets[0].data, data.median) }];
                                    chart.data.datasets[7].data = [{ x: data.median, y: -1 }, { x: data.median, y: interpolate(datasets[1].data, data.median) }];
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
                        // @ts-ignore
                        x: {
                            min: data.limitL,
                            max: data.limitR,
                            type: 'linear',
                            title: { display: true, text: UiLocale.chart.income[language] },
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
            return chart;
        }

        /**
         * @returns {{ wrapper: HTMLElement, canvas: HTMLCanvasElement }}
         */
        getCanvas() {
            const canvasWidth = Config.chart.defaultScale.width;
            const canvasHeight = Config.chart.defaultScale.height;
            const canvas = Ui.elem('canvas', { width: canvasWidth, height: canvasHeight });
            const canvasDiv = Ui.div({ style: `min-width: ${canvasWidth}px; min-height: ${canvasHeight}px;` }, canvas);
            return { wrapper: canvasDiv, canvas: canvas };
        }
    };

    //#endregion


    //#region InGame

    const ClientData = new class {
        #data = null;
        #hrid2name = {};
        #name2hrid = {};
        constructor() {
            MessageHandler.addListener('init_client_data', msg => { this.set(msg); }, -100);
        }
        get() {
            if (!this.#data) this.set(decompressInitClientData(localStorage.getItem("initClientData")));
            return this.#data;
        }
        set(val) {
            this.#data = val;
            this.#hrid2name = {};
            const itemDetail = val.itemDetailMap;
            for (const key in itemDetail) {
                if (itemDetail[key] && typeof itemDetail[key] === 'object' && itemDetail[key].name) {
                    this.#hrid2name[key] = itemDetail[key].name;
                    this.#name2hrid[itemDetail[key].name] = key;
                }
            }
        }
        /**
         * @param {string} hrid
         * @returns {string}
         */
        hrid2name(hrid) {
            if (!hrid) return hrid;
            return this.#hrid2name[hrid] || hrid.split('/').pop();
        }
        /**
         * @param {string} itemName
         * @returns {string}
         */
        name2ItemHrid(itemName) {
            if (!itemName) return itemName;
            return this.#name2hrid[itemName] || `/items/${itemName.toLowerCase().split(' ').reduce((pre, cur) => pre + '_' + cur, '')}`;
        }
    };

    const CharacterData = new class {
        #data = null;

        playerId = null;
        playerName = null;

        /** @type {Object<string, number>} */
        skillLevel = {};

        constructor() {
            MessageHandler.addListener('init_character_data', msg => { this.onInitCharacterData(msg); }, -100);
            MessageHandler.addListener('skills_updated', msg => { this.onLevelUpdated(msg); });
        }
        get() { return this.#data; }

        onInitCharacterData(msg) {
            this.#data = msg;
            this.playerId = msg.character.id;
            this.playerName = msg.character.name;
            this.updateLevel(msg.characterSkills);
        }
        onLevelUpdated(msg) { this.updateLevel(msg.endCharacterSkills); }

        updateLevel(skills) {
            skills.forEach(m => {
                const name = m.skillHrid.split('/').pop();
                this.skillLevel[name] = m.level;
            });
            const { stamina, intelligence, defense, attack, power, ranged, magic } = this.skillLevel;
            this.skillLevel.combat = (stamina + intelligence + defense + Math.max(attack + power, ranged * 2, magic * 2)) / 5;
        }
    };

    const Market = new class {
        /**
         * @typedef {'ask' | 'bid' | 'vendor'} PriceType
         */
        /**
         * @typedef {Object} MarketDataEntry
         * @property {number} ask
         * @property {number} bid
         */
        /**
         * @typedef {Object} MarketData
         * @property {number} time 市场更新时间 (s)
         * @property {{ [itemHrid: string]: { [enhanceLevel: number]: MarketDataEntry } }} market 市场信息
         * @property {{ [itemHrid: string]: number }} vendor
         */
        /**
         * @typedef {Object} MarketDataSource
         * @property {'mwi' | 'milkyapi' | 'custom'} type
         * @property {string} [addr = null]
         */

        storageDataName = 'marketData';

        apiMap = {
            mwi: {
                desc: UiLocale.settings.market.apiOfficial[language],
                order: 1,
                addr: 'https://www.milkywayidle.com/game_data/marketplace.json'
            },
            mwi_cn: {
                desc: UiLocale.settings.market.apiOfficialCN[language],
                order: 2,
                addr: 'https://www.milkywayidlecn.com/game_data/marketplace.json'
            },
            milkyapi: {
                desc: 'HolyChikenz - MWIApi',
                order: 3,
                addr: 'https://raw.githubusercontent.com/holychikenz/MWIApi/main/milkyapi.json',
            },
            custom: {
                desc: UiLocale.settings.market.apiCustom[language],
                order: 4,
                addr: '',
            }
        };

        /** @type {MarketData} */ marketData = null;

        chestDropData = {};

        specialItemPrices = { '/items/coin': { ask: 1, bid: 1 } };
        chestCosts = {};

        constructor() {
            MessageHandler.addListener('init_client_data', msg => { this.onInitClientData(msg); }, -90);
        }

        onInitClientData(_) {
            this.marketData = LocalStorageData.get(this.storageDataName);
            const updateInterval = Config.market.autoUpdateInterval * 3600;
            if (!(this.marketData?.time > Date.now() / 1000 - updateInterval)) this.update();
            else this.initMarketData();
        }
        update(afterUpdated = null) {
            const source = Config.market.source;
            if (source.type !== 'custom') source.addr = this.apiMap[source.type].addr;
            out(`fetching market data from ${source.addr}`);
            fetch(source.addr).then(res => {
                res.json().then(data => {
                    this.marketData = this.formatMarketData(data);
                    LocalStorageData.set(this.storageDataName, this.marketData);
                    out(`market updated:`, new Date(this.marketData.time).toLocaleString());
                    this.initMarketData();
                    afterUpdated?.();
                });
            });
        }
        formatMarketData(raw) {
            const format = raw.market?.hasOwnProperty('Coin') ? 'milkyapi' : 'mwi';
            if (format === 'milkyapi') {
                const data = { market: {}, vendor: {}, time: raw.time };
                for (const [itemName, price] of Object.entries(raw.market)) {
                    const itemHrid = ClientData.name2ItemHrid(itemName);
                    (data.market[itemHrid] ??= {})[0] = { ask: price.ask, bid: price.bid };
                }
                return data;
            }
            if (format === 'mwi') {
                const data = { market: {}, vendor: {}, time: raw.timestamp };
                for (const [itemHrid, prices] of Object.entries(raw.marketData)) {
                    for (const [level, price] of Object.entries(prices)) {
                        (data.market[itemHrid] ??= {})[level] = { ask: price.a, bid: price.b };
                    }
                }
                return data;
            }
            throw "unknown market data format";
        }
        initMarketData() {
            this.#initVendorPrice();
            this.#initSpecialItemPrices();
            this.#initShopData();
            this.#initChestData();
            out("市场信息 (marketData)", this.marketData);
        }

        #initVendorPrice() {
            const itemDetails = ClientData.get().itemDetailMap;
            for (const [hrid, detail] of Object.entries(itemDetails)) {
                this.marketData.vendor[hrid] = detail.sellPrice ?? 0;
            }
        }

        #initSpecialItemPrices() {
            const computeNonTradable = Config.market.computeNonTradable;
            this.specialItemPrices = {
                '/items/coin': { ask: 1, bid: 1 },
                '/items/cowbell': {
                    ask: this.getPriceFromAPI('/items/bag_of_10_cowbells', 'ask') / 10,
                    bid: computeNonTradable ? this.getPriceFromAPI('/items/bag_of_10_cowbells', 'bid') / 10 : 0,
                },
                '/items/chimerical_quiver': {
                    ask: this.getPriceFromAPI('/items/mirror_of_protection', 'ask'),
                    bid: computeNonTradable ? this.getPriceFromAPI('/items/mirror_of_protection', 'bid') : 0,
                },
                '/items/sinister_cape': {
                    ask: this.getPriceFromAPI('/items/mirror_of_protection', 'ask'),
                    bid: computeNonTradable ? this.getPriceFromAPI('/items/mirror_of_protection', 'bid') : 0,
                },
                '/items/enchanted_cloak': {
                    ask: this.getPriceFromAPI('/items/mirror_of_protection', 'ask'),
                    bid: computeNonTradable ? this.getPriceFromAPI('/items/mirror_of_protection', 'bid') : 0,
                },
            };
            for (let itemName in this.specialItemPrices) {
                (this.marketData.market[itemName] ??= {})[0] = {
                    ask: this.specialItemPrices[itemName].ask,
                    bid: this.specialItemPrices[itemName].bid,
                };
            }

            this.chestCosts = {
                "/items/chimerical_chest": {
                    keyAsk: this.getPriceFromAPI('/items/chimerical_chest_key', 'ask') || 3000e3,
                    keyBid: this.getPriceFromAPI('/items/chimerical_chest_key', 'bid') || 3000e3,
                    entryAsk: this.getPriceFromAPI('/items/chimerical_entry_key', 'ask') || 280e3,
                    entryBid: this.getPriceFromAPI('/items/chimerical_entry_key', 'bid') || 280e3
                },
                "/items/sinister_chest": {
                    keyAsk: this.getPriceFromAPI('/items/sinister_chest_key', 'ask') || 5600e3,
                    keyBid: this.getPriceFromAPI('/items/sinister_chest_key', 'bid') || 5400e3,
                    entryAsk: this.getPriceFromAPI('/items/sinister_entry_key', 'ask') || 300e3,
                    entryBid: this.getPriceFromAPI('/items/sinister_entry_key', 'bid') || 280e3
                },
                "/items/enchanted_chest": {
                    keyAsk: this.getPriceFromAPI('/items/enchanted_chest_key', 'ask') || 7600e3,
                    keyBid: this.getPriceFromAPI('/items/enchanted_chest_key', 'bid') || 7200e3,
                    entryAsk: this.getPriceFromAPI('/items/enchanted_entry_key', 'ask') || 360e3,
                    entryBid: this.getPriceFromAPI('/items/enchanted_entry_key', 'bid') || 360e3
                },
                "/items/pirate_chest": {
                    keyAsk: this.getPriceFromAPI('/items/pirate_chest_key', 'ask') || 9400e3,
                    keyBid: this.getPriceFromAPI('/items/pirate_chest_key', 'bid') || 9200e3,
                    entryAsk: this.getPriceFromAPI('/items/pirate_entry_key', 'ask') || 460e3,
                    entryBid: this.getPriceFromAPI('/items/pirate_entry_key', 'bid') || 440e3
                },
                "/items/chimerical_refinement_chest": {
                    keyAsk: this.getPriceFromAPI('/items/chimerical_chest_key', 'ask') || 3000e3,
                    keyBid: this.getPriceFromAPI('/items/chimerical_chest_key', 'bid') || 3000e3,
                    entryAsk: 0,
                    entryBid: 0
                },
                "/items/sinister_refinement_chest": {
                    keyAsk: this.getPriceFromAPI('/items/sinister_chest_key', 'ask') || 5600e3,
                    keyBid: this.getPriceFromAPI('/items/sinister_chest_key', 'bid') || 5400e3,
                    entryAsk: 0,
                    entryBid: 0
                },
                "/items/enchanted_refinement_chest": {
                    keyAsk: this.getPriceFromAPI('/items/enchanted_chest_key', 'ask') || 7600e3,
                    keyBid: this.getPriceFromAPI('/items/enchanted_chest_key', 'bid') || 7200e3,
                    entryAsk: 0,
                    entryBid: 0
                },
                "/items/pirate_refinement_chest": {
                    keyAsk: this.getPriceFromAPI('/items/pirate_chest_key', 'ask') || 9400e3,
                    keyBid: this.getPriceFromAPI('/items/pirate_chest_key', 'bid') || 9200e3,
                    entryAsk: 0,
                    entryBid: 0
                }
            };
        }

        #initShopData() {
            const clientData = ClientData.get();
            const costItemValue = {};
            for (let details of Object.values(clientData.shopItemDetailMap)) {
                const { itemHrid, costs } = details;
                for (let cost of costs) {
                    const costHrid = cost.itemHrid;
                    if (costHrid === "/items/coin") continue;

                    const costCount = cost.count;
                    costItemValue[costHrid] ??= 0;

                    // 计算每种代币购买每个物品的收益
                    let bidValue = this.getPriceByHrid(itemHrid, "bid");
                    let profit = bidValue / (costs.length * costCount);

                    // 更新最赚钱的物品信息
                    if (profit > costItemValue[costHrid]) {
                        costItemValue[costHrid] = profit;
                        this.setPrice(costHrid, { ask: profit, bid: profit });
                    }
                }
            }
        }

        #initChestData() {
            const clientData = ClientData.get();

            // 迭代计算箱子价值
            this.chestDropData = {};
            const maxIter = 20;
            for (let iter = 0; iter < maxIter; ++iter) {
                for (let [boxHrid, items] of Object.entries(clientData.openableLootDropMap)) {
                    this.chestDropData[boxHrid] ??= {
                        order: clientData.itemDetailMap[boxHrid].sortIndex,
                        items: [],
                        totalAsk: 0,
                        totalBid: 0,
                    };
                    let totalAsk = 0, totalBid = 0;
                    for (let item of items) {
                        const itemName = ClientData.hrid2name(item.itemHrid);
                        const bidPrice = this.getPriceByName(itemName, "bid") ?? 0;
                        const askPrice = this.getPriceByName(itemName, "ask") ?? 0;
                        const expectedCount = DropAnalyzer.itemCountExpt(item);
                        totalAsk += askPrice * expectedCount;
                        totalBid += bidPrice * expectedCount;
                    }
                    this.chestDropData[boxHrid].totalAsk = totalAsk;
                    this.chestDropData[boxHrid].totalBid = totalBid;

                    if (boxHrid === '/items/bag_of_10_cowbells') continue;
                    if (this.chestCosts[boxHrid]) {
                        const { keyAsk, keyBid, entryAsk, entryBid } = this.chestCosts[boxHrid];
                        this.setPrice(boxHrid, {
                            ask: totalAsk - keyBid - entryBid>0?entryBid:0 ,
                            bid: totalBid - keyAsk - entryAsk>0?entryAsk:0,
                        });
                    } else {
                        this.setPrice(boxHrid, { ask: totalAsk, bid: totalBid });
                    }
                }

                // 更新任务代币（/items/task_token）价值
                let tokenValue = { ask: 0, bid: 0 };
                for (let [key, item] of Object.entries(clientData.taskShopItemDetailMap)) {
                    let itemName = item.name;
                    if (item.cost.itemHrid !== "/items/task_token") continue;
                    tokenValue.ask = Math.max(tokenValue.ask, this.getPriceByName(itemName, "ask") / item.cost.count);
                    tokenValue.bid = Math.max(tokenValue.bid, this.getPriceByName(itemName, "bid") / item.cost.count);
                }
                this.setPrice("/items/task_token", tokenValue);
            }

            // 计算箱子掉落物表
            for (let [boxHrid, items] of Object.entries(clientData.openableLootDropMap)) {
                for (let item of items) {
                    const { itemHrid, dropRate, minCount, maxCount } = item;
                    this.chestDropData[boxHrid].items.push({
                        hrid: itemHrid,
                        dropRate: dropRate,
                        minCount: minCount,
                        maxCount: maxCount,
                    });
                }
            }

            out("特殊物品价格表 (Market.specialItemPrices)", this.specialItemPrices);
            const Edible_Tools = JSON.parse(localStorage.getItem('Edible_Tools')) || {};
            const Edible_Tools_marketAPI_json = JSON.parse(localStorage.getItem('Edible_Tools_marketAPI_json')) || {};
            if(Edible_Tools){
                let Edible_Tools_prices=Edible_Tools.Chest_Drop_Data;
                let Edible_Tools_market_prices=Edible_Tools_marketAPI_json.market;
                console.log(Edible_Tools_prices);
                console.log(Edible_Tools_market_prices);
                this.specialItemPrices["/items/chimerical_chest"].ask=parseFloat(Edible_Tools_prices["Chimerical Chest"]["期望产出Ask"]) - parseFloat(Edible_Tools_market_prices["Chimerical Chest Key"]["bid"]) -  parseFloat(Edible_Tools_market_prices["Chimerical Entry Key"]["bid"]);
                this.specialItemPrices["/items/chimerical_chest"].bid=parseFloat(Edible_Tools_prices["Chimerical Chest"]["期望产出Bid"])- parseFloat(Edible_Tools_market_prices["Chimerical Chest Key"]["ask"]) -  parseFloat(Edible_Tools_market_prices["Chimerical Entry Key"]["ask"]);
                this.specialItemPrices["/items/chimerical_refinement_chest"].ask=parseFloat(Edible_Tools_prices["Chimerical Refinement Chest"]["期望产出Ask"])- parseFloat(Edible_Tools_market_prices["Chimerical Chest Key"]["bid"]); //-  parseFloat(Edible_Tools_market_prices["Chimerical Entry Key"]["bid"]);
                this.specialItemPrices["/items/chimerical_refinement_chest"].bid=parseFloat(Edible_Tools_prices["Chimerical Refinement Chest"]["期望产出Bid"])- parseFloat(Edible_Tools_market_prices["Chimerical Chest Key"]["ask"]);// -  parseFloat(Edible_Tools_market_prices["Chimerical Entry Key"]["ask"]) ;
                this.specialItemPrices["/items/chimerical_quiver"].ask=parseFloat(Edible_Tools_prices["Chimerical Chest"]["item"]["Chimerical Quiver"]["出售单价"]);
                this.specialItemPrices["/items/chimerical_quiver"].bid=parseFloat(Edible_Tools_prices["Chimerical Chest"]["item"]["Chimerical Quiver"]["收购单价"]);
                this.specialItemPrices["/items/chimerical_token"].ask=parseFloat(Edible_Tools_prices["Chimerical Chest"]["item"]["Chimerical Token"]["出售单价"]);
                this.specialItemPrices["/items/chimerical_token"].bid=parseFloat(Edible_Tools_prices["Chimerical Chest"]["item"]["Chimerical Token"]["收购单价"]);

                this.specialItemPrices["/items/sinister_chest"].ask=parseFloat(Edible_Tools_prices["Sinister Chest"]["期望产出Ask"]) - parseFloat(Edible_Tools_market_prices["Sinister Chest Key"]["bid"]) -  parseFloat(Edible_Tools_market_prices["Sinister Entry Key"]["bid"]);
                this.specialItemPrices["/items/sinister_chest"].bid=parseFloat(Edible_Tools_prices["Sinister Chest"]["期望产出Bid"])- parseFloat(Edible_Tools_market_prices["Sinister Chest Key"]["ask"]) -  parseFloat(Edible_Tools_market_prices["Sinister Entry Key"]["ask"]);
                this.specialItemPrices["/items/sinister_refinement_chest"].ask=parseFloat(Edible_Tools_prices["Sinister Refinement Chest"]["期望产出Ask"])- parseFloat(Edible_Tools_market_prices["Sinister Chest Key"]["bid"]); // -  parseFloat(Edible_Tools_market_prices["Sinister Entry Key"]["bid"]);
                this.specialItemPrices["/items/sinister_refinement_chest"].bid=parseFloat(Edible_Tools_prices["Sinister Refinement Chest"]["期望产出Bid"])- parseFloat(Edible_Tools_market_prices["Sinister Chest Key"]["ask"]) ; //-  parseFloat(Edible_Tools_market_prices["Sinister Entry Key"]["ask"]) ;
                this.specialItemPrices["/items/sinister_cape"].ask=parseFloat(Edible_Tools_prices["Sinister Chest"]["item"]["Sinister Cape"]["出售单价"]);
                this.specialItemPrices["/items/sinister_cape"].bid=parseFloat(Edible_Tools_prices["Sinister Chest"]["item"]["Sinister Cape"]["收购单价"]);
                this.specialItemPrices["/items/sinister_token"].ask=parseFloat(Edible_Tools_prices["Sinister Chest"]["item"]["Sinister Token"]["出售单价"]);
                this.specialItemPrices["/items/sinister_token"].bid=parseFloat(Edible_Tools_prices["Sinister Chest"]["item"]["Sinister Token"]["收购单价"]);

                this.specialItemPrices["/items/enchanted_chest"].ask=parseFloat(Edible_Tools_prices["Enchanted Chest"]["期望产出Ask"]) - parseFloat(Edible_Tools_market_prices["Enchanted Chest Key"]["bid"]) -  parseFloat(Edible_Tools_market_prices["Enchanted Entry Key"]["bid"]);
                this.specialItemPrices["/items/enchanted_chest"].bid=parseFloat(Edible_Tools_prices["Enchanted Chest"]["期望产出Bid"]) - parseFloat(Edible_Tools_market_prices["Enchanted Chest Key"]["ask"]) -  parseFloat(Edible_Tools_market_prices["Enchanted Entry Key"]["ask"]);
                this.specialItemPrices["/items/enchanted_refinement_chest"].ask=parseFloat(Edible_Tools_prices["Enchanted Refinement Chest"]["期望产出Ask"])- parseFloat(Edible_Tools_market_prices["Enchanted Chest Key"]["bid"]) ; //-  parseFloat(Edible_Tools_market_prices["Enchanted Entry Key"]["bid"]);
                this.specialItemPrices["/items/enchanted_refinement_chest"].bid=parseFloat(Edible_Tools_prices["Enchanted Refinement Chest"]["期望产出Bid"])- parseFloat(Edible_Tools_market_prices["Enchanted Chest Key"]["ask"]) ; //-  parseFloat(Edible_Tools_market_prices["Enchanted Entry Key"]["ask"]) ;
                this.specialItemPrices["/items/enchanted_cloak"].ask=parseFloat(Edible_Tools_prices["Enchanted Chest"]["item"]["Enchanted Cloak"]["出售单价"]);
                this.specialItemPrices["/items/enchanted_cloak"].bid=parseFloat(Edible_Tools_prices["Enchanted Chest"]["item"]["Enchanted Cloak"]["收购单价"]);
                this.specialItemPrices["/items/enchanted_token"].ask=parseFloat(Edible_Tools_prices["Enchanted Chest"]["item"]["Enchanted Token"]["出售单价"]);
                this.specialItemPrices["/items/enchanted_token"].bid=parseFloat(Edible_Tools_prices["Enchanted Chest"]["item"]["Enchanted Token"]["收购单价"]);

                this.specialItemPrices["/items/pirate_chest"].ask=parseFloat(Edible_Tools_prices["Pirate Chest"]["期望产出Ask"]) - parseFloat(Edible_Tools_market_prices["Pirate Chest Key"]["bid"]) -  parseFloat(Edible_Tools_market_prices["Pirate Entry Key"]["bid"]);
                this.specialItemPrices["/items/pirate_chest"].bid=parseFloat(Edible_Tools_prices["Pirate Chest"]["期望产出Bid"]) - parseFloat(Edible_Tools_market_prices["Pirate Chest Key"]["ask"]) -  parseFloat(Edible_Tools_market_prices["Pirate Entry Key"]["ask"]);
                this.specialItemPrices["/items/pirate_refinement_chest"].ask=parseFloat(Edible_Tools_prices["Pirate Refinement Chest"]["期望产出Ask"]) - parseFloat(Edible_Tools_market_prices["Pirate Chest Key"]["bid"]) ;//-  parseFloat(Edible_Tools_market_prices["Pirate Entry Key"]["bid"]);
                this.specialItemPrices["/items/pirate_refinement_chest"].bid=parseFloat(Edible_Tools_prices["Pirate Refinement Chest"]["期望产出Bid"])- parseFloat(Edible_Tools_market_prices["Pirate Chest Key"]["ask"]);// -  parseFloat(Edible_Tools_market_prices["Pirate Entry Key"]["ask"]) ;
                this.specialItemPrices["/items/pirate_token"].ask=parseFloat(Edible_Tools_prices["Pirate Chest"]["item"]["Pirate Token"]["出售单价"]);
                this.specialItemPrices["/items/pirate_token"].bid=parseFloat(Edible_Tools_prices["Pirate Chest"]["item"]["Pirate Token"]["收购单价"]);


            }
            out("特殊物品修复价格表 (Market.specialItemPrices)", this.specialItemPrices);



            out("箱子掉落物列表 (Market.chestDropData)", this.chestDropData);
        }

        setPrice(itemHrid, price, enhanceLevel = 0) {
            this.marketData.market[itemHrid] ??= {};
            this.marketData.market[itemHrid][enhanceLevel] ??= { ask: -1, bid: -1 };
            if (price.ask) this.marketData.market[itemHrid][enhanceLevel].ask = price.ask;
            if (price.bid) this.marketData.market[itemHrid][enhanceLevel].bid = price.bid;
            this.specialItemPrices[itemHrid] = price;
        }

        /**
         * @param {string} itemHrid
         * @param {PriceType} priceType
         * @param {number} enhanceLevel
         * @param {boolean} computeNetProfit
         * @returns {number}
         */
        getPriceFromAPI(itemHrid, priceType = 'bid', enhanceLevel = 0, computeNetProfit = null) {
            if (priceType === 'vendor') return this.marketData.vendor[itemHrid] ?? 0;
            const itemPrice = this.marketData.market[itemHrid]?.[enhanceLevel]?.[priceType];
            const netProfit = computeNetProfit ?? Config.market.computeNetProfit;
            if (typeof itemPrice === 'number' && itemPrice !== -1) {
                if (netProfit && priceType === 'bid') {
                    if (itemHrid === '/items/bag_of_10_cowbells') return Math.floor(itemPrice * 0.82);
                    return Math.floor(itemPrice * 0.98);
                }
                return itemPrice;
            }
            return null;
        }

        /**
         * @param {string} itemHrid
         * @param {PriceType} priceType
         * @param {number} enhanceLevel
         * @param {boolean} computeNetProfit
         * @returns {number}
         */
        getPriceByHrid(itemHrid, priceType = 'bid', enhanceLevel = 0, computeNetProfit = null) {
            if (!this.marketData?.market) return null;
            const netProfit = computeNetProfit ?? Config.market.computeNetProfit;
            if (this.specialItemPrices[itemHrid]) return this.specialItemPrices[itemHrid][priceType];
            const marketPrice = this.getPriceFromAPI(itemHrid, priceType, enhanceLevel, netProfit);
            if (marketPrice) return marketPrice;
            if (priceType === 'ask') {
                return Math.ceil(this.getPriceByHrid(itemHrid, 'bid', enhanceLevel, false) / 0.98);
            }
            if (priceType === 'bid' && this.marketData.market[itemHrid]) {
                const itemPrice = this.marketData.vendor[itemHrid];
                if (typeof itemPrice === 'number' && itemPrice > 0) {
                    return itemPrice * 3;
                }
            }
            return null;
        }

        /**
         * @param {string} itemName
         * @param {PriceType} priceType
         * @param {number} enhanceLevel
         * @returns {number}
         */
        getPriceByName(itemName, priceType = 'bid', enhanceLevel = 0) {
            const itemHrid = ClientData.name2ItemHrid(itemName);
            return this.getPriceByHrid(itemHrid, priceType, enhanceLevel);
        }

        /**
         * @param {CountedItem | CountedItem[]} items
         * @param {PriceType} priceType
         * @returns {number}
         */
        getTotalPrice(items, priceType = 'bid') {
            return (Array.isArray(items) ? items : [items])
                .reduce((pre, cur) => pre + cur.count * this.getPriceByHrid(cur.hrid, priceType), 0);
        }
    };

    const BattleData = new class {
        /**
         * @typedef {Object} MapDataInfo
         * @property {'solo' | 'group' | 'dungeon'} type
         * @property {0 | 1 | 2} eliteTier
         * @property {string} mapHrid
         * @property {number} mapIndex 地图序号（1~11）
         * @property {string} name 地图名字（英文）
         * @property {number} order 地图顺序
         */
        /**
         * @typedef {Object} MapData_ItemDropData
         * @property {boolean} isRare
         * @property {string} itemHrid
         * @property {number} dropRate
         * @property {number} minCount
         * @property {number} maxCount
         * @property {number} dropRatePerDifficultyTier
         */
        /**
         * @typedef {Object} MapData
         * @property {MapDataInfo} info
         * @property {SpawnInfo} spawnInfo
         * @property {Object<string, MapData_ItemDropData[]>} monsterDrops
         * @property {Object<string, MapData_ItemDropData[]>} bossDrops
         */

        /** @type {{ [mapHrid: string]: MapData }} */
        mapData = {};

        /** @type {{ [monsterHrid: string]: { type: 'boss' | 'monster', actionHrid: string, mapHrid: string } }} */
        monsterInfo = {};

        /** @type {Object<string, number>} */
        itemFreq = {};

        /** @type {string} */ currentMapHrid = null;
        /** @type {number} */ difficultyTier = 0;
        /** @type {boolean} */ inBattle = false;
        /** @type {boolean} */ inDungeon = false;
        /** 战斗开始时间 (s) @type {number} */ startTime = 0;
        /** 战斗持续时间 (s) @type {number} */ duration = 0;
        /** @type {number} */ runCount = 0;

        /** @type {string[]} */
        playerList = [];

        /**
         * @typedef {Object} PlayerStatus
         * @property {string} aura
         * @property {{ [skillHrid: string]: number }} skillExp
         * @property {number} combatDropQuantity
         * @property {number} combatDropRate
         * @property {number} combatRareFind
         */
        /** @type {{ [playerName: string]: PlayerStatus }} */
        playerStat = {};

        /**
         * @typedef {Object} PlayerLootInfo
         * @property {CountedItem[]} items
         * @property {() => number} price
         */
        /** @type {{ [playerName: string]: PlayerLootInfo }} */
        playerLoot = {};

        /**
         * @typedef {Object} PlayerFoodInfo
         * @property {{ [itemName: string]: CountedItem }} food
         * @property {number} drinkConcentration
         */
        /** @type {{ [playerName: string]: PlayerFoodInfo }} */
        playerFood = {};

        constructor() {
            MessageHandler.addListener('init_client_data', msg => { this.onInitClientData(msg); }, -90);
            MessageHandler.addListener('init_character_data', msg => { this.onInitCharacterData(msg); });
            MessageHandler.addListener('new_battle', msg => { this.onNewBattle(msg); }, -100);
            MessageHandler.addListener('action_completed', msg => { this.onActionCompleted(msg); });
        }

        onNewBattle(msg) {
            this.startTime = new Date(msg.combatStartTime).getTime() / 1000;
            this.duration = new Date().getTime() / 1000 - this.startTime;
            this.runCount = msg.battleId || 1;
            this.playerList = msg.players.map(p => p.character.name);
            for (let player of msg.players) {
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
                let playerLoot = { items: [], price: null };
                Object.values(player.totalLootMap).forEach(loot => {
                    playerLoot.items.push({
                        hrid: loot.itemHrid,
                        count: loot.count,
                    });
                });
                playerLoot.price = () => playerLoot.items.reduce((pre, item) => {
                    const bidPrice = Market.getPriceByHrid(item.hrid);
                    return pre + item.count * bidPrice;
                }, 0);
                this.playerLoot[playerName] = playerLoot;

                // 处理消耗品
                let playerFood = {
                    drinkConcentration: player.combatDetails.combatStats.drinkConcentration,
                    food: {},
                };
                player.combatConsumables.forEach(consumable => {
                    const itemName = ClientData.hrid2name(consumable.itemHrid);
                    playerFood.food[itemName] = {
                        hrid: consumable.itemHrid,
                        count: consumable.count,
                    };
                });
                this.playerFood[playerName] = playerFood;

                // 处理光环&经验
                const auraAbilities = [
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
                player.combatAbilities.forEach(ability => {
                    const isAura = auraAbilities.some(aura => ability.abilityHrid.endsWith(aura));
                    if (isAura) this.playerStat[playerName].aura = ability.abilityHrid;
                });
                Object.keys(player.totalSkillExperienceMap).forEach(hrid => {
                    this.playerStat[playerName].skillExp[hrid] = player.totalSkillExperienceMap[hrid];
                });
            }
        }

        onInitCharacterData(msg) { this.setCurrentMapHrid(msg.characterActions[0]); }
        onActionCompleted(msg) { this.setCurrentMapHrid(msg.endCharacterAction); }
        setCurrentMapHrid(charaAction) {
            const actionHrid = charaAction?.actionHrid;
            if (actionHrid?.startsWith("/actions/combat/")) {
                this.currentMapHrid = actionHrid;
                this.difficultyTier = charaAction?.difficultyTier || 0;
                this.inBattle = true;
                this.inDungeon = !this.mapData.hasOwnProperty(actionHrid);
            } else this.inBattle = false;
        }

        onInitClientData(msg) {
            this.initCombatMapData(msg);
            this.initMonsterInfo(msg);
            this.initItemFreq();
        }
        initCombatMapData(clientData) {
            // 处理战斗地图数据
            const monsterMap = clientData.combatMonsterDetailMap;
            const actionDetailMap = clientData.actionDetailMap;
            for (const [actionHrid, actionDetail] of Object.entries(actionDetailMap)) {
                if (!actionHrid.startsWith("/actions/combat/")) continue;
                if (!actionDetail.combatZoneInfo) continue;
                if (actionDetail.combatZoneInfo.isDungeon) {
                    const dungeonInfo = actionDetail.combatZoneInfo.dungeonInfo;
                    this.mapData[actionHrid] = {
                        info: {
                            type: 'dungeon',
                            eliteTier: 2,
                            mapHrid: actionHrid,
                            mapIndex: 0,
                            name: actionDetail.name,
                            order: actionDetail.sortIndex,
                        },
                        spawnInfo: {
                            bossWave: 1,
                            maxSpawnCount: 0,
                            maxTotalStrength: 0,
                            spawns: [],
                            expectedSpawns: {},
                        },
                        monsterDrops: {},
                        bossDrops: {
                            '_dungeon': dungeonInfo.rewardDropTable.map(item => ({
                                isRare: false, ...item
                            })),
                        },
                    }
                    continue;
                }
                const fightInfo = actionDetail.combatZoneInfo.fightInfo;
                const spawnInfo = fightInfo?.randomSpawnInfo;
                let spawns = spawnInfo?.spawns;
                if (!spawns || spawns.length === 0) continue;

                const totalRate = spawns.reduce((s, x) => s + x.rate, 0);
                spawns = spawns.map(s => ({
                    hrid: s.combatMonsterHrid,
                    strength: s.strength,
                    rate: s.rate / totalRate,
                }));
                const mapType = spawnInfo.spawns.length > 1 || spawnInfo.bossWave > 0 ? "group" : "solo";
                const mapHrid = actionDetail.category.replace("/action_categories/", "/actions/");
                const mapIndex = ClientData.get().actionCategoryDetailMap?.[actionDetail.category]?.sortIndex;

                // 合并普通掉落和稀有掉落
                const getDrops = (hrid, s) => [
                    hrid, [].concat(
                        monsterMap[hrid].dropTable
                            .map(item => ({ isRare: false, ...item }))
                    ).concat(
                        monsterMap[hrid].rareDropTable
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
                    expectedSpawns: null,
                };
                spawnInfoMod.expectedSpawns = BattleDropAnalyzer.computeExpectedSpawns(spawnInfoMod);
                this.mapData[actionHrid] = {
                    info: {
                        type: mapType,
                        eliteTier: actionHrid.includes('elite') ? 1 : 0,
                        mapHrid: mapHrid,
                        mapIndex: mapIndex,
                        name: actionDetail.name,
                        order: actionDetail.sortIndex,
                    },
                    spawnInfo: spawnInfoMod,
                    monsterDrops: monsterDrops,
                    bossDrops: bossDrops,
                }
            }

            out("地图信息 (BattleData.mapData)", this.mapData);
        }
        initItemFreq() {
            let itemTotalCount = {}, itemNum = {};
            for (let mapHrid in this.mapData) {
                if (this.mapData[mapHrid].info.type == 'solo') continue;
                const itemCount = {};
                const dropData = this.getDropData(mapHrid);
                for (const [_, drops] of Object.entries(dropData.bossDrops)) {
                    for (const item of drops) {
                        itemCount[item.hrid] ??= 0;
                        let itemCountTier = 0;
                        for (let tier = 0; tier < item.dropRate.length; tier++) {
                            itemCountTier += DropAnalyzer.itemCountExpt(item, tier);
                        }
                        itemCountTier /= item.dropRate.length;
                        itemCount[item.hrid] += itemCountTier;
                    }
                }
                const expectedSpawns = dropData.spawnInfo.expectedSpawns;
                for (const [hrid, drops] of Object.entries(dropData.monsterDrops)) {
                    const cnt = expectedSpawns[hrid] * 9;
                    for (const item of drops) {
                        itemCount[item.hrid] ??= 0;
                        let itemCountTier = 0;
                        for (let tier = 0; tier < item.dropRate.length; tier++) {
                            itemCountTier += DropAnalyzer.itemCountExpt(item, tier);
                        }
                        itemCountTier /= item.dropRate.length;
                        itemCount[item.hrid] += cnt * itemCountTier;
                    }
                }
                for (let hrid in itemCount) {
                    itemTotalCount[hrid] = (itemTotalCount[hrid] ?? 0) + itemCount[hrid];
                    itemNum[hrid] = (itemNum[hrid] ?? 0) + 1;
                }
            }

            this.itemFreq = {};
            for (let hrid in itemTotalCount) {
                let count = itemTotalCount[hrid] / itemNum[hrid];
                this.itemFreq[hrid] = count;
            }
        }
        initMonsterInfo(_) {
            for (let [mapHrid, detail] of Object.entries(this.mapData)) {
                if (detail.info.eliteTier !== 0) continue;
                if (detail.info.type !== 'group') {
                    for (let monsterHrid in detail.monsterDrops) {
                        this.monsterInfo[monsterHrid] ??= { type: 'monster', actionHrid: null, mapHrid: null };
                        this.monsterInfo[monsterHrid].actionHrid = mapHrid;
                    }
                } else {
                    for (let monsterHrid in detail.monsterDrops) {
                        this.monsterInfo[monsterHrid] ??= { type: 'monster', actionHrid: null, mapHrid: null };
                        this.monsterInfo[monsterHrid].mapHrid = mapHrid;
                    }
                    for (let monsterHrid in detail.bossDrops) {
                        this.monsterInfo[monsterHrid] = { type: 'boss', actionHrid: mapHrid, mapHrid: mapHrid };
                    }
                }
            }
            out('怪物信息 (BattleData.monsterInfo)', this.monsterInfo);
        }

        /**
         * @param {string} mapHrid
         * @param {number} runCount
         * @param {string} playerName
         * @returns {MapDropData}
         */
        getDropData(mapHrid, runCount = 11, playerName = null) {
            const mapData = this.mapData[mapHrid];
            const bossWave = mapData.spawnInfo.bossWave;
            const bossCount = bossWave ? Math.floor((runCount - 1) / bossWave) : 0;
            const normalCount = bossWave ? bossCount * (bossWave - 1) + (runCount - 1) % bossWave : runCount - 1;
            const /** @type {MapDropData} */ dropData = {
                spawnInfo: mapData.spawnInfo,
                bossCount: bossCount,
                normalCount: normalCount,
                bossDrops: {},
                monsterDrops: {},
            };

            const processDrop = (/** @type {MapData_ItemDropData} */ item) => {
                const itemName = ClientData.hrid2name(item.itemHrid);
                const price = Market.getPriceByName(itemName);

                let { minCount, maxCount, dropRate } = item;
                const dropRatePerTier = item.dropRatePerDifficultyTier || 0;

                if (playerName) {
                    const playerStat = this.playerStat[playerName];
                    const commonRateMultiplier = 1 + (playerStat.combatDropRate || 0);
                    const rareRateMultiplier = 1 + (playerStat.combatRareFind || 0);
                    const quantityMultiplier = (1 + (playerStat.combatDropQuantity || 0)) / this.playerList.length * (mapData.info.type === 'dungeon' ? 5 : 1);
                    const rateMultiplier = item.isRare ? rareRateMultiplier : commonRateMultiplier;
                    minCount *= quantityMultiplier;
                    maxCount *= quantityMultiplier;
                    const len = mapData.info.type === 'dungeon'? 3 : (mapData.info.type === 'group'? 6 : 1);
                    dropRate = Array.from({length: len}, (_, n) => {
                        let rate = dropRate + n * dropRatePerTier;
                        rate = rate * (1 + n * 0.1) * rateMultiplier;
                        return Math.min(Math.max(rate, 0), 1);
                    });
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

            for (let [hrid, drops] of Object.entries(mapData.bossDrops)){
                dropData.bossDrops[hrid] = drops.map(drop => processDrop(drop));}
            for (let [hrid, drops] of Object.entries(mapData.monsterDrops)){
                dropData.monsterDrops[hrid] = drops.map(drop => processDrop(drop));}
            return dropData;
        }
        /**
         * @param {string} playerName
         * @returns {MapDropData}
         */
        getCurrentDropData(playerName = null) {
            if (!this.currentMapHrid) return null;
            let dropData = this.getDropData(this.currentMapHrid, this.runCount, playerName);
            for (let [hrid, drops] of Object.entries(dropData.bossDrops)) {
                dropData.bossDrops[hrid] = drops.map(drop => {
                    const newDropRate = drop.dropRate?.[this.difficultyTier];
                    return {
                        ...drop,
                        dropRate: newDropRate
                    };
                });
            }

            for (let [hrid, drops] of Object.entries(dropData.monsterDrops)) {
                dropData.monsterDrops[hrid] = drops.map(drop => {
                    const newDropRate = drop.dropRate?.[this.difficultyTier];
                    return {
                        ...drop,
                        dropRate: newDropRate
                    };
                });
            }
            return dropData
        }
    };

    const Localizer = new class {
        // items, actions, monsters, abilities, skills
        ZhNameDict = {
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
            "/items/chimerical_refinement_chest": "\u5947\u5e7b\u7cbe\u70bc\u5b9d\u7bb1",
            "/items/sinister_chest": "\u9634\u68ee\u5b9d\u7bb1",
            "/items/sinister_refinement_chest": "\u9634\u68ee\u7cbe\u70bc\u5b9d\u7bb1",
            "/items/enchanted_chest": "\u79d8\u6cd5\u5b9d\u7bb1",
            "/items/enchanted_refinement_chest": "\u79d8\u6cd5\u7cbe\u70bc\u5b9d\u7bb1",
            "/items/pirate_chest": "\u6d77\u76d7\u5b9d\u7bb1",
            "/items/pirate_refinement_chest": "\u6d77\u76d7\u7cbe\u70bc\u5b9d\u7bb1",
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
            "/items/melee_coffee": "\u8fd1\u6218\u5496\u5561",
            "/items/ranged_coffee": "\u8fdc\u7a0b\u5496\u5561",
            "/items/magic_coffee": "\u9b54\u6cd5\u5496\u5561",
            "/items/super_stamina_coffee": "\u8d85\u7ea7\u8010\u529b\u5496\u5561",
            "/items/super_intelligence_coffee": "\u8d85\u7ea7\u667a\u529b\u5496\u5561",
            "/items/super_defense_coffee": "\u8d85\u7ea7\u9632\u5fa1\u5496\u5561",
            "/items/super_attack_coffee": "\u8d85\u7ea7\u653b\u51fb\u5496\u5561",
            "/items/super_melee_coffee": "\u8d85\u7ea7\u8fd1\u6218\u5496\u5561",
            "/items/super_ranged_coffee": "\u8d85\u7ea7\u8fdc\u7a0b\u5496\u5561",
            "/items/super_magic_coffee": "\u8d85\u7ea7\u9b54\u6cd5\u5496\u5561",
            "/items/ultra_stamina_coffee": "\u7a76\u6781\u8010\u529b\u5496\u5561",
            "/items/ultra_intelligence_coffee": "\u7a76\u6781\u667a\u529b\u5496\u5561",
            "/items/ultra_defense_coffee": "\u7a76\u6781\u9632\u5fa1\u5496\u5561",
            "/items/ultra_attack_coffee": "\u7a76\u6781\u653b\u51fb\u5496\u5561",
            "/items/ultra_melee_coffee": "\u7a76\u6781\u8fd1\u6218\u5496\u5561",
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
            "/items/retribution": "\u60e9\u6212",
            "/items/vampirism": "\u5438\u8840",
            "/items/revive": "\u590d\u6d3b",
            "/items/insanity": "\u75af\u72c2",
            "/items/invincible": "\u65e0\u654c",
            "/items/speed_aura": "\u901f\u5ea6\u5149\u73af",
            "/items/guardian_aura": "\u5b88\u62a4\u5149\u73af",
            "/items/fierce_aura": "\u7269\u7406\u5149\u73af",
            "/items/critical_aura": "\u66b4\u51fb\u5149\u73af",
            "/items/mystic_aura": "\u5143\u7d20\u5149\u73af",
            "/items/gobo_stabber": "\u54e5\u5e03\u6797\u957f\u5251",
            "/items/gobo_slasher": "\u54e5\u5e03\u6797\u5173\u5200",
            "/items/gobo_smasher": "\u54e5\u5e03\u6797\u72fc\u7259\u68d2",
            "/items/spiked_bulwark": "\u5c16\u523a\u91cd\u76fe",
            "/items/werewolf_slasher": "\u72fc\u4eba\u5173\u5200",
            "/items/griffin_bulwark": "\u72ee\u9e6b\u91cd\u76fe",
            "/items/griffin_bulwark_refined": "\u72ee\u9e6b\u91cd\u76fe\uff08\u7cbe\uff09",
            "/items/gobo_shooter": "\u54e5\u5e03\u6797\u5f39\u5f13",
            "/items/vampiric_bow": "\u5438\u8840\u5f13",
            "/items/cursed_bow": "\u5492\u6028\u4e4b\u5f13",
            "/items/cursed_bow_refined": "\u5492\u6028\u4e4b\u5f13\uff08\u7cbe\uff09",
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
            "/items/furious_spear_refined": "\u72c2\u6012\u957f\u67aa\uff08\u7cbe\uff09",
            "/items/regal_sword": "\u541b\u738b\u4e4b\u5251",
            "/items/regal_sword_refined": "\u541b\u738b\u4e4b\u5251\uff08\u7cbe\uff09",
            "/items/chaotic_flail": "\u6df7\u6c8c\u8fde\u67b7",
            "/items/chaotic_flail_refined": "\u6df7\u6c8c\u8fde\u67b7\uff08\u7cbe\uff09",
            "/items/soul_hunter_crossbow": "\u7075\u9b42\u730e\u624b\u5f29",
            "/items/sundering_crossbow": "\u88c2\u7a7a\u4e4b\u5f29",
            "/items/sundering_crossbow_refined": "\u88c2\u7a7a\u4e4b\u5f29\uff08\u7cbe\uff09",
            "/items/frost_staff": "\u51b0\u971c\u6cd5\u6756",
            "/items/infernal_battlestaff": "\u70bc\u72f1\u6cd5\u6756",
            "/items/jackalope_staff": "\u9e7f\u89d2\u5154\u4e4b\u6756",
            "/items/rippling_trident": "\u6d9f\u6f2a\u4e09\u53c9\u621f",
            "/items/rippling_trident_refined": "\u6d9f\u6f2a\u4e09\u53c9\u621f\uff08\u7cbe\uff09",
            "/items/blooming_trident": "\u7efd\u653e\u4e09\u53c9\u621f",
            "/items/blooming_trident_refined": "\u7efd\u653e\u4e09\u53c9\u621f\uff08\u7cbe\uff09",
            "/items/blazing_trident": "\u70bd\u7130\u4e09\u53c9\u621f",
            "/items/blazing_trident_refined": "\u70bd\u7130\u4e09\u53c9\u621f\uff08\u7cbe\uff09",
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
            "/items/knights_aegis_refined": "\u9a91\u58eb\u76fe\uff08\u7cbe\uff09",
            "/items/treant_shield": "\u6811\u4eba\u76fe",
            "/items/manticore_shield": "\u874e\u72ee\u76fe",
            "/items/tome_of_healing": "\u6cbb\u7597\u4e4b\u4e66",
            "/items/tome_of_the_elements": "\u5143\u7d20\u4e4b\u4e66",
            "/items/watchful_relic": "\u8b66\u6212\u9057\u7269",
            "/items/bishops_codex": "\u4e3b\u6559\u6cd5\u5178",
            "/items/bishops_codex_refined": "\u4e3b\u6559\u6cd5\u5178\uff08\u7cbe\uff09",
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
            "/items/sinister_cape_refined": "\u9634\u68ee\u6597\u7bf7\uff08\u7cbe\uff09",
            "/items/chimerical_quiver": "\u5947\u5e7b\u7bad\u888b",
            "/items/chimerical_quiver_refined": "\u5947\u5e7b\u7bad\u888b\uff08\u7cbe\uff09",
            "/items/enchanted_cloak": "\u79d8\u6cd5\u62ab\u98ce",
            "/items/enchanted_cloak_refined": "\u79d8\u6cd5\u62ab\u98ce\uff08\u7cbe\uff09",
            "/items/red_culinary_hat": "\u7ea2\u8272\u53a8\u5e08\u5e3d",
            "/items/snail_shell_helmet": "\u8717\u725b\u58f3\u5934\u76d4",
            "/items/vision_helmet": "\u89c6\u89c9\u5934\u76d4",
            "/items/fluffy_red_hat": "\u84ec\u677e\u7ea2\u5e3d\u5b50",
            "/items/corsair_helmet": "\u63a0\u593a\u8005\u5934\u76d4",
            "/items/corsair_helmet_refined": "\u63a0\u593a\u8005\u5934\u76d4\uff08\u7cbe\uff09",
            "/items/acrobatic_hood": "\u6742\u6280\u5e08\u515c\u5e3d",
            "/items/acrobatic_hood_refined": "\u6742\u6280\u5e08\u515c\u5e3d\uff08\u7cbe\uff09",
            "/items/magicians_hat": "\u9b54\u672f\u5e08\u5e3d",
            "/items/magicians_hat_refined": "\u9b54\u672f\u5e08\u5e3d\uff08\u7cbe\uff09",
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
            "/items/anchorbound_plate_body_refined": "\u951a\u5b9a\u80f8\u7532\uff08\u7cbe\uff09",
            "/items/maelstrom_plate_body": "\u6012\u6d9b\u80f8\u7532",
            "/items/maelstrom_plate_body_refined": "\u6012\u6d9b\u80f8\u7532\uff08\u7cbe\uff09",
            "/items/marine_tunic": "\u6d77\u6d0b\u76ae\u8863",
            "/items/revenant_tunic": "\u4ea1\u7075\u76ae\u8863",
            "/items/griffin_tunic": "\u72ee\u9e6b\u76ae\u8863",
            "/items/kraken_tunic": "\u514b\u62c9\u80af\u76ae\u8863",
            "/items/kraken_tunic_refined": "\u514b\u62c9\u80af\u76ae\u8863\uff08\u7cbe\uff09",
            "/items/icy_robe_top": "\u51b0\u971c\u888d\u670d",
            "/items/flaming_robe_top": "\u70c8\u7130\u888d\u670d",
            "/items/luna_robe_top": "\u6708\u795e\u888d\u670d",
            "/items/royal_water_robe_top": "\u7687\u5bb6\u6c34\u7cfb\u888d\u670d",
            "/items/royal_water_robe_top_refined": "\u7687\u5bb6\u6c34\u7cfb\u888d\u670d\uff08\u7cbe\uff09",
            "/items/royal_nature_robe_top": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u670d",
            "/items/royal_nature_robe_top_refined": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u670d\uff08\u7cbe\uff09",
            "/items/royal_fire_robe_top": "\u7687\u5bb6\u706b\u7cfb\u888d\u670d",
            "/items/royal_fire_robe_top_refined": "\u7687\u5bb6\u706b\u7cfb\u888d\u670d\uff08\u7cbe\uff09",
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
            "/items/cotton_robe_top": "\u68c9\u888d\u670d",
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
            "/items/anchorbound_plate_legs_refined": "\u951a\u5b9a\u817f\u7532\uff08\u7cbe\uff09",
            "/items/maelstrom_plate_legs": "\u6012\u6d9b\u817f\u7532",
            "/items/maelstrom_plate_legs_refined": "\u6012\u6d9b\u817f\u7532\uff08\u7cbe\uff09",
            "/items/marine_chaps": "\u822a\u6d77\u76ae\u88e4",
            "/items/revenant_chaps": "\u4ea1\u7075\u76ae\u88e4",
            "/items/griffin_chaps": "\u72ee\u9e6b\u76ae\u88e4",
            "/items/kraken_chaps": "\u514b\u62c9\u80af\u76ae\u88e4",
            "/items/kraken_chaps_refined": "\u514b\u62c9\u80af\u76ae\u88e4\uff08\u7cbe\uff09",
            "/items/icy_robe_bottoms": "\u51b0\u971c\u888d\u88d9",
            "/items/flaming_robe_bottoms": "\u70c8\u7130\u888d\u88d9",
            "/items/luna_robe_bottoms": "\u6708\u795e\u888d\u88d9",
            "/items/royal_water_robe_bottoms": "\u7687\u5bb6\u6c34\u7cfb\u888d\u88d9",
            "/items/royal_water_robe_bottoms_refined": "\u7687\u5bb6\u6c34\u7cfb\u888d\u88d9\uff08\u7cbe\uff09",
            "/items/royal_nature_robe_bottoms": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u88d9",
            "/items/royal_nature_robe_bottoms_refined": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u88d9\uff08\u7cbe\uff09",
            "/items/royal_fire_robe_bottoms": "\u7687\u5bb6\u706b\u7cfb\u888d\u88d9",
            "/items/royal_fire_robe_bottoms_refined": "\u7687\u5bb6\u706b\u7cfb\u888d\u88d9\uff08\u7cbe\uff09",
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
            "/items/dodocamel_gauntlets_refined": "\u6e21\u6e21\u9a7c\u62a4\u624b\uff08\u7cbe\uff09",
            "/items/sighted_bracers": "\u7784\u51c6\u62a4\u8155",
            "/items/marksman_bracers": "\u795e\u5c04\u62a4\u8155",
            "/items/marksman_bracers_refined": "\u795e\u5c04\u62a4\u8155\uff08\u7cbe\uff09",
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
            "/items/trainee_milking_charm": "\u5b9e\u4e60\u6324\u5976\u62a4\u7b26",
            "/items/basic_milking_charm": "\u57fa\u7840\u6324\u5976\u62a4\u7b26",
            "/items/advanced_milking_charm": "\u9ad8\u7ea7\u6324\u5976\u62a4\u7b26",
            "/items/expert_milking_charm": "\u4e13\u5bb6\u6324\u5976\u62a4\u7b26",
            "/items/master_milking_charm": "\u5927\u5e08\u6324\u5976\u62a4\u7b26",
            "/items/grandmaster_milking_charm": "\u5b97\u5e08\u6324\u5976\u62a4\u7b26",
            "/items/trainee_foraging_charm": "\u5b9e\u4e60\u91c7\u6458\u62a4\u7b26",
            "/items/basic_foraging_charm": "\u57fa\u7840\u91c7\u6458\u62a4\u7b26",
            "/items/advanced_foraging_charm": "\u9ad8\u7ea7\u91c7\u6458\u62a4\u7b26",
            "/items/expert_foraging_charm": "\u4e13\u5bb6\u91c7\u6458\u62a4\u7b26",
            "/items/master_foraging_charm": "\u5927\u5e08\u91c7\u6458\u62a4\u7b26",
            "/items/grandmaster_foraging_charm": "\u5b97\u5e08\u91c7\u6458\u62a4\u7b26",
            "/items/trainee_woodcutting_charm": "\u5b9e\u4e60\u4f10\u6728\u62a4\u7b26",
            "/items/basic_woodcutting_charm": "\u57fa\u7840\u4f10\u6728\u62a4\u7b26",
            "/items/advanced_woodcutting_charm": "\u9ad8\u7ea7\u4f10\u6728\u62a4\u7b26",
            "/items/expert_woodcutting_charm": "\u4e13\u5bb6\u4f10\u6728\u62a4\u7b26",
            "/items/master_woodcutting_charm": "\u5927\u5e08\u4f10\u6728\u62a4\u7b26",
            "/items/grandmaster_woodcutting_charm": "\u5b97\u5e08\u4f10\u6728\u62a4\u7b26",
            "/items/trainee_cheesesmithing_charm": "\u5b9e\u4e60\u5976\u916a\u953b\u9020\u62a4\u7b26",
            "/items/basic_cheesesmithing_charm": "\u57fa\u7840\u5976\u916a\u953b\u9020\u62a4\u7b26",
            "/items/advanced_cheesesmithing_charm": "\u9ad8\u7ea7\u5976\u916a\u953b\u9020\u62a4\u7b26",
            "/items/expert_cheesesmithing_charm": "\u4e13\u5bb6\u5976\u916a\u953b\u9020\u62a4\u7b26",
            "/items/master_cheesesmithing_charm": "\u5927\u5e08\u5976\u916a\u953b\u9020\u62a4\u7b26",
            "/items/grandmaster_cheesesmithing_charm": "\u5b97\u5e08\u5976\u916a\u953b\u9020\u62a4\u7b26",
            "/items/trainee_crafting_charm": "\u5b9e\u4e60\u5236\u4f5c\u62a4\u7b26",
            "/items/basic_crafting_charm": "\u57fa\u7840\u5236\u4f5c\u62a4\u7b26",
            "/items/advanced_crafting_charm": "\u9ad8\u7ea7\u5236\u4f5c\u62a4\u7b26",
            "/items/expert_crafting_charm": "\u4e13\u5bb6\u5236\u4f5c\u62a4\u7b26",
            "/items/master_crafting_charm": "\u5927\u5e08\u5236\u4f5c\u62a4\u7b26",
            "/items/grandmaster_crafting_charm": "\u5b97\u5e08\u5236\u4f5c\u62a4\u7b26",
            "/items/trainee_tailoring_charm": "\u5b9e\u4e60\u7f1d\u7eab\u62a4\u7b26",
            "/items/basic_tailoring_charm": "\u57fa\u7840\u7f1d\u7eab\u62a4\u7b26",
            "/items/advanced_tailoring_charm": "\u9ad8\u7ea7\u7f1d\u7eab\u62a4\u7b26",
            "/items/expert_tailoring_charm": "\u4e13\u5bb6\u7f1d\u7eab\u62a4\u7b26",
            "/items/master_tailoring_charm": "\u5927\u5e08\u7f1d\u7eab\u62a4\u7b26",
            "/items/grandmaster_tailoring_charm": "\u5b97\u5e08\u7f1d\u7eab\u62a4\u7b26",
            "/items/trainee_cooking_charm": "\u5b9e\u4e60\u70f9\u996a\u62a4\u7b26",
            "/items/basic_cooking_charm": "\u57fa\u7840\u70f9\u996a\u62a4\u7b26",
            "/items/advanced_cooking_charm": "\u9ad8\u7ea7\u70f9\u996a\u62a4\u7b26",
            "/items/expert_cooking_charm": "\u4e13\u5bb6\u70f9\u996a\u62a4\u7b26",
            "/items/master_cooking_charm": "\u5927\u5e08\u70f9\u996a\u62a4\u7b26",
            "/items/grandmaster_cooking_charm": "\u5b97\u5e08\u70f9\u996a\u62a4\u7b26",
            "/items/trainee_brewing_charm": "\u5b9e\u4e60\u51b2\u6ce1\u62a4\u7b26",
            "/items/basic_brewing_charm": "\u57fa\u7840\u51b2\u6ce1\u62a4\u7b26",
            "/items/advanced_brewing_charm": "\u9ad8\u7ea7\u51b2\u6ce1\u62a4\u7b26",
            "/items/expert_brewing_charm": "\u4e13\u5bb6\u51b2\u6ce1\u62a4\u7b26",
            "/items/master_brewing_charm": "\u5927\u5e08\u51b2\u6ce1\u62a4\u7b26",
            "/items/grandmaster_brewing_charm": "\u5b97\u5e08\u51b2\u6ce1\u62a4\u7b26",
            "/items/trainee_alchemy_charm": "\u5b9e\u4e60\u70bc\u91d1\u62a4\u7b26",
            "/items/basic_alchemy_charm": "\u57fa\u7840\u70bc\u91d1\u62a4\u7b26",
            "/items/advanced_alchemy_charm": "\u9ad8\u7ea7\u70bc\u91d1\u62a4\u7b26",
            "/items/expert_alchemy_charm": "\u4e13\u5bb6\u70bc\u91d1\u62a4\u7b26",
            "/items/master_alchemy_charm": "\u5927\u5e08\u70bc\u91d1\u62a4\u7b26",
            "/items/grandmaster_alchemy_charm": "\u5b97\u5e08\u70bc\u91d1\u62a4\u7b26",
            "/items/trainee_enhancing_charm": "\u5b9e\u4e60\u5f3a\u5316\u62a4\u7b26",
            "/items/basic_enhancing_charm": "\u57fa\u7840\u5f3a\u5316\u62a4\u7b26",
            "/items/advanced_enhancing_charm": "\u9ad8\u7ea7\u5f3a\u5316\u62a4\u7b26",
            "/items/expert_enhancing_charm": "\u4e13\u5bb6\u5f3a\u5316\u62a4\u7b26",
            "/items/master_enhancing_charm": "\u5927\u5e08\u5f3a\u5316\u62a4\u7b26",
            "/items/grandmaster_enhancing_charm": "\u5b97\u5e08\u5f3a\u5316\u62a4\u7b26",
            "/items/trainee_stamina_charm": "\u5b9e\u4e60\u8010\u529b\u62a4\u7b26",
            "/items/basic_stamina_charm": "\u57fa\u7840\u8010\u529b\u62a4\u7b26",
            "/items/advanced_stamina_charm": "\u9ad8\u7ea7\u8010\u529b\u62a4\u7b26",
            "/items/expert_stamina_charm": "\u4e13\u5bb6\u8010\u529b\u62a4\u7b26",
            "/items/master_stamina_charm": "\u5927\u5e08\u8010\u529b\u62a4\u7b26",
            "/items/grandmaster_stamina_charm": "\u5b97\u5e08\u8010\u529b\u62a4\u7b26",
            "/items/trainee_intelligence_charm": "\u5b9e\u4e60\u667a\u529b\u62a4\u7b26",
            "/items/basic_intelligence_charm": "\u57fa\u7840\u667a\u529b\u62a4\u7b26",
            "/items/advanced_intelligence_charm": "\u9ad8\u7ea7\u667a\u529b\u62a4\u7b26",
            "/items/expert_intelligence_charm": "\u4e13\u5bb6\u667a\u529b\u62a4\u7b26",
            "/items/master_intelligence_charm": "\u5927\u5e08\u667a\u529b\u62a4\u7b26",
            "/items/grandmaster_intelligence_charm": "\u5b97\u5e08\u667a\u529b\u62a4\u7b26",
            "/items/trainee_attack_charm": "\u5b9e\u4e60\u653b\u51fb\u62a4\u7b26",
            "/items/basic_attack_charm": "\u57fa\u7840\u653b\u51fb\u62a4\u7b26",
            "/items/advanced_attack_charm": "\u9ad8\u7ea7\u653b\u51fb\u62a4\u7b26",
            "/items/expert_attack_charm": "\u4e13\u5bb6\u653b\u51fb\u62a4\u7b26",
            "/items/master_attack_charm": "\u5927\u5e08\u653b\u51fb\u62a4\u7b26",
            "/items/grandmaster_attack_charm": "\u5b97\u5e08\u653b\u51fb\u62a4\u7b26",
            "/items/trainee_defense_charm": "\u5b9e\u4e60\u9632\u5fa1\u62a4\u7b26",
            "/items/basic_defense_charm": "\u57fa\u7840\u9632\u5fa1\u62a4\u7b26",
            "/items/advanced_defense_charm": "\u9ad8\u7ea7\u9632\u5fa1\u62a4\u7b26",
            "/items/expert_defense_charm": "\u4e13\u5bb6\u9632\u5fa1\u62a4\u7b26",
            "/items/master_defense_charm": "\u5927\u5e08\u9632\u5fa1\u62a4\u7b26",
            "/items/grandmaster_defense_charm": "\u5b97\u5e08\u9632\u5fa1\u62a4\u7b26",
            "/items/trainee_melee_charm": "\u5b9e\u4e60\u8fd1\u6218\u62a4\u7b26",
            "/items/basic_melee_charm": "\u57fa\u7840\u8fd1\u6218\u62a4\u7b26",
            "/items/advanced_melee_charm": "\u9ad8\u7ea7\u8fd1\u6218\u62a4\u7b26",
            "/items/expert_melee_charm": "\u4e13\u5bb6\u8fd1\u6218\u62a4\u7b26",
            "/items/master_melee_charm": "\u5927\u5e08\u8fd1\u6218\u62a4\u7b26",
            "/items/grandmaster_melee_charm": "\u5b97\u5e08\u8fd1\u6218\u62a4\u7b26",
            "/items/trainee_ranged_charm": "\u5b9e\u4e60\u8fdc\u7a0b\u62a4\u7b26",
            "/items/basic_ranged_charm": "\u57fa\u7840\u8fdc\u7a0b\u62a4\u7b26",
            "/items/advanced_ranged_charm": "\u9ad8\u7ea7\u8fdc\u7a0b\u62a4\u7b26",
            "/items/expert_ranged_charm": "\u4e13\u5bb6\u8fdc\u7a0b\u62a4\u7b26",
            "/items/master_ranged_charm": "\u5927\u5e08\u8fdc\u7a0b\u62a4\u7b26",
            "/items/grandmaster_ranged_charm": "\u5b97\u5e08\u8fdc\u7a0b\u62a4\u7b26",
            "/items/trainee_magic_charm": "\u5b9e\u4e60\u9b54\u6cd5\u62a4\u7b26",
            "/items/basic_magic_charm": "\u57fa\u7840\u9b54\u6cd5\u62a4\u7b26",
            "/items/advanced_magic_charm": "\u9ad8\u7ea7\u9b54\u6cd5\u62a4\u7b26",
            "/items/expert_magic_charm": "\u4e13\u5bb6\u9b54\u6cd5\u62a4\u7b26",
            "/items/master_magic_charm": "\u5927\u5e08\u9b54\u6cd5\u62a4\u7b26",
            "/items/grandmaster_magic_charm": "\u5b97\u5e08\u9b54\u6cd5\u62a4\u7b26",
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
            "/items/chimerical_refinement_shard": "\u5947\u5e7b\u7cbe\u70bc\u788e\u7247",
            "/items/acrobats_ribbon": "\u6742\u6280\u5e08\u5f69\u5e26",
            "/items/magicians_cloth": "\u9b54\u672f\u5e08\u7ec7\u7269",
            "/items/chaotic_chain": "\u6df7\u6c8c\u9501\u94fe",
            "/items/cursed_ball": "\u8bc5\u5492\u4e4b\u7403",
            "/items/sinister_refinement_shard": "\u9634\u68ee\u7cbe\u70bc\u788e\u7247",
            "/items/royal_cloth": "\u7687\u5bb6\u7ec7\u7269",
            "/items/knights_ingot": "\u9a91\u58eb\u4e4b\u952d",
            "/items/bishops_scroll": "\u4e3b\u6559\u5377\u8f74",
            "/items/regal_jewel": "\u541b\u738b\u5b9d\u77f3",
            "/items/sundering_jewel": "\u88c2\u7a7a\u5b9d\u77f3",
            "/items/enchanted_refinement_shard": "\u79d8\u6cd5\u7cbe\u70bc\u788e\u7247",
            "/items/marksman_brooch": "\u795e\u5c04\u80f8\u9488",
            "/items/corsair_crest": "\u63a0\u593a\u8005\u5fbd\u7ae0",
            "/items/damaged_anchor": "\u7834\u635f\u8239\u951a",
            "/items/maelstrom_plating": "\u6012\u6d9b\u7532\u7247",
            "/items/kraken_leather": "\u514b\u62c9\u80af\u76ae\u9769",
            "/items/kraken_fang": "\u514b\u62c9\u80af\u4e4b\u7259",
            "/items/pirate_refinement_shard": "\u6d77\u76d7\u7cbe\u70bc\u788e\u7247",
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
            "/actions/cheesesmithing/dodocamel_gauntlets_refined": "\u6e21\u6e21\u9a7c\u62a4\u624b\uff08\u7cbe\uff09",
            "/actions/cheesesmithing/corsair_helmet_refined": "\u63a0\u593a\u8005\u5934\u76d4\uff08\u7cbe\uff09",
            "/actions/cheesesmithing/knights_aegis_refined": "\u9a91\u58eb\u76fe\uff08\u7cbe\uff09",
            "/actions/cheesesmithing/anchorbound_plate_legs_refined": "\u951a\u5b9a\u817f\u7532\uff08\u7cbe\uff09",
            "/actions/cheesesmithing/maelstrom_plate_legs_refined": "\u6012\u6d9b\u817f\u7532\uff08\u7cbe\uff09",
            "/actions/cheesesmithing/griffin_bulwark_refined": "\u72ee\u9e6b\u91cd\u76fe\uff08\u7cbe\uff09",
            "/actions/cheesesmithing/furious_spear_refined": "\u72c2\u6012\u957f\u67aa\uff08\u7cbe\uff09",
            "/actions/cheesesmithing/chaotic_flail_refined": "\u6df7\u6c8c\u8fde\u67b7\uff08\u7cbe\uff09",
            "/actions/cheesesmithing/regal_sword_refined": "\u541b\u738b\u4e4b\u5251\uff08\u7cbe\uff09",
            "/actions/cheesesmithing/anchorbound_plate_body_refined": "\u951a\u5b9a\u80f8\u7532\uff08\u7cbe\uff09",
            "/actions/cheesesmithing/maelstrom_plate_body_refined": "\u6012\u6d9b\u80f8\u7532\uff08\u7cbe\uff09",
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
            "/actions/crafting/basic_milking_charm": "\u57fa\u7840\u6324\u5976\u62a4\u7b26",
            "/actions/crafting/basic_foraging_charm": "\u57fa\u7840\u91c7\u6458\u62a4\u7b26",
            "/actions/crafting/basic_woodcutting_charm": "\u57fa\u7840\u4f10\u6728\u62a4\u7b26",
            "/actions/crafting/basic_cheesesmithing_charm": "\u57fa\u7840\u5976\u916a\u953b\u9020\u62a4\u7b26",
            "/actions/crafting/basic_crafting_charm": "\u57fa\u7840\u5236\u4f5c\u62a4\u7b26",
            "/actions/crafting/basic_tailoring_charm": "\u57fa\u7840\u7f1d\u7eab\u62a4\u7b26",
            "/actions/crafting/basic_cooking_charm": "\u57fa\u7840\u70f9\u996a\u62a4\u7b26",
            "/actions/crafting/basic_brewing_charm": "\u57fa\u7840\u917f\u9020\u62a4\u7b26",
            "/actions/crafting/basic_alchemy_charm": "\u57fa\u7840\u70bc\u91d1\u62a4\u7b26",
            "/actions/crafting/basic_enhancing_charm": "\u57fa\u7840\u5f3a\u5316\u62a4\u7b26",
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
            "/actions/crafting/advanced_milking_charm": "\u9ad8\u7ea7\u6324\u5976\u62a4\u7b26",
            "/actions/crafting/advanced_foraging_charm": "\u9ad8\u7ea7\u91c7\u6458\u62a4\u7b26",
            "/actions/crafting/advanced_woodcutting_charm": "\u9ad8\u7ea7\u4f10\u6728\u62a4\u7b26",
            "/actions/crafting/advanced_cheesesmithing_charm": "\u9ad8\u7ea7\u5976\u916a\u953b\u9020\u62a4\u7b26",
            "/actions/crafting/advanced_crafting_charm": "\u9ad8\u7ea7\u5236\u4f5c\u62a4\u7b26",
            "/actions/crafting/advanced_tailoring_charm": "\u9ad8\u7ea7\u7f1d\u7eab\u62a4\u7b26",
            "/actions/crafting/advanced_cooking_charm": "\u9ad8\u7ea7\u70f9\u996a\u62a4\u7b26",
            "/actions/crafting/advanced_brewing_charm": "\u9ad8\u7ea7\u917f\u9020\u62a4\u7b26",
            "/actions/crafting/advanced_alchemy_charm": "\u9ad8\u7ea7\u70bc\u91d1\u62a4\u7b26",
            "/actions/crafting/advanced_enhancing_charm": "\u9ad8\u7ea7\u5f3a\u5316\u62a4\u7b26",
            "/actions/crafting/advanced_stamina_charm": "\u9ad8\u7ea7\u8010\u529b\u62a4\u7b26",
            "/actions/crafting/advanced_intelligence_charm": "\u9ad8\u7ea7\u667a\u529b\u62a4\u7b26",
            "/actions/crafting/advanced_attack_charm": "\u9ad8\u7ea7\u653b\u51fb\u62a4\u7b26",
            "/actions/crafting/advanced_defense_charm": "\u9ad8\u7ea7\u9632\u5fa1\u62a4\u7b26",
            "/actions/crafting/advanced_melee_charm": "\u9ad8\u7ea7\u8fd1\u6218\u62a4\u7b26",
            "/actions/crafting/advanced_ranged_charm": "\u9ad8\u7ea7\u8fdc\u7a0b\u62a4\u7b26",
            "/actions/crafting/advanced_magic_charm": "\u9ad8\u7ea7\u9b54\u6cd5\u62a4\u7b26",
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
            "/actions/crafting/expert_milking_charm": "\u4e13\u5bb6\u6324\u5976\u62a4\u7b26",
            "/actions/crafting/expert_foraging_charm": "\u4e13\u5bb6\u91c7\u6458\u62a4\u7b26",
            "/actions/crafting/expert_woodcutting_charm": "\u4e13\u5bb6\u4f10\u6728\u62a4\u7b26",
            "/actions/crafting/expert_cheesesmithing_charm": "\u4e13\u5bb6\u5976\u916a\u953b\u9020\u62a4\u7b26",
            "/actions/crafting/expert_crafting_charm": "\u4e13\u5bb6\u5236\u4f5c\u62a4\u7b26",
            "/actions/crafting/expert_tailoring_charm": "\u4e13\u5bb6\u7f1d\u7eab\u62a4\u7b26",
            "/actions/crafting/expert_cooking_charm": "\u4e13\u5bb6\u70f9\u996a\u62a4\u7b26",
            "/actions/crafting/expert_brewing_charm": "\u4e13\u5bb6\u917f\u9020\u62a4\u7b26",
            "/actions/crafting/expert_alchemy_charm": "\u4e13\u5bb6\u70bc\u91d1\u62a4\u7b26",
            "/actions/crafting/expert_enhancing_charm": "\u4e13\u5bb6\u5f3a\u5316\u62a4\u7b26",
            "/actions/crafting/expert_stamina_charm": "\u4e13\u5bb6\u8010\u529b\u62a4\u7b26",
            "/actions/crafting/expert_intelligence_charm": "\u4e13\u5bb6\u667a\u529b\u62a4\u7b26",
            "/actions/crafting/expert_attack_charm": "\u4e13\u5bb6\u653b\u51fb\u62a4\u7b26",
            "/actions/crafting/expert_defense_charm": "\u4e13\u5bb6\u9632\u5fa1\u62a4\u7b26",
            "/actions/crafting/expert_melee_charm": "\u4e13\u5bb6\u8fd1\u6218\u62a4\u7b26",
            "/actions/crafting/expert_ranged_charm": "\u4e13\u5bb6\u8fdc\u7a0b\u62a4\u7b26",
            "/actions/crafting/expert_magic_charm": "\u4e13\u5bb6\u9b54\u6cd5\u62a4\u7b26",
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
            "/actions/crafting/master_milking_charm": "\u5927\u5e08\u6324\u5976\u62a4\u7b26",
            "/actions/crafting/master_foraging_charm": "\u5927\u5e08\u91c7\u6458\u62a4\u7b26",
            "/actions/crafting/master_woodcutting_charm": "\u5927\u5e08\u4f10\u6728\u62a4\u7b26",
            "/actions/crafting/master_cheesesmithing_charm": "\u5927\u5e08\u5976\u916a\u953b\u9020\u62a4\u7b26",
            "/actions/crafting/master_crafting_charm": "\u5927\u5e08\u5236\u4f5c\u62a4\u7b26",
            "/actions/crafting/master_tailoring_charm": "\u5927\u5e08\u7f1d\u7eab\u62a4\u7b26",
            "/actions/crafting/master_cooking_charm": "\u5927\u5e08\u70f9\u996a\u62a4\u7b26",
            "/actions/crafting/master_brewing_charm": "\u5927\u5e08\u917f\u9020\u62a4\u7b26",
            "/actions/crafting/master_alchemy_charm": "\u5927\u5e08\u70bc\u91d1\u62a4\u7b26",
            "/actions/crafting/master_enhancing_charm": "\u5927\u5e08\u5f3a\u5316\u62a4\u7b26",
            "/actions/crafting/master_stamina_charm": "\u5927\u5e08\u8010\u529b\u62a4\u7b26",
            "/actions/crafting/master_intelligence_charm": "\u5927\u5e08\u667a\u529b\u62a4\u7b26",
            "/actions/crafting/master_attack_charm": "\u5927\u5e08\u653b\u51fb\u62a4\u7b26",
            "/actions/crafting/master_defense_charm": "\u5927\u5e08\u9632\u5fa1\u62a4\u7b26",
            "/actions/crafting/master_melee_charm": "\u5927\u5e08\u8fd1\u6218\u62a4\u7b26",
            "/actions/crafting/master_ranged_charm": "\u5927\u5e08\u8fdc\u7a0b\u62a4\u7b26",
            "/actions/crafting/master_magic_charm": "\u5927\u5e08\u9b54\u6cd5\u62a4\u7b26",
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
            "/actions/crafting/rippling_trident": "\u6d9f\u6f2a\u4e09\u53c9\u621f",
            "/actions/crafting/blooming_trident": "\u7efd\u653e\u4e09\u53c9\u621f",
            "/actions/crafting/blazing_trident": "\u70bd\u7130\u4e09\u53c9\u621f",
            "/actions/crafting/grandmaster_milking_charm": "\u5b97\u5e08\u6324\u5976\u62a4\u7b26",
            "/actions/crafting/grandmaster_foraging_charm": "\u5b97\u5e08\u91c7\u6458\u62a4\u7b26",
            "/actions/crafting/grandmaster_woodcutting_charm": "\u5b97\u5e08\u4f10\u6728\u62a4\u7b26",
            "/actions/crafting/grandmaster_cheesesmithing_charm": "\u5b97\u5e08\u5976\u916a\u953b\u9020\u62a4\u7b26",
            "/actions/crafting/grandmaster_crafting_charm": "\u5b97\u5e08\u5236\u4f5c\u62a4\u7b26",
            "/actions/crafting/grandmaster_tailoring_charm": "\u5b97\u5e08\u7f1d\u7eab\u62a4\u7b26",
            "/actions/crafting/grandmaster_cooking_charm": "\u5b97\u5e08\u70f9\u996a\u62a4\u7b26",
            "/actions/crafting/grandmaster_brewing_charm": "\u5b97\u5e08\u917f\u9020\u62a4\u7b26",
            "/actions/crafting/grandmaster_alchemy_charm": "\u5b97\u5e08\u70bc\u91d1\u62a4\u7b26",
            "/actions/crafting/grandmaster_enhancing_charm": "\u5b97\u5e08\u5f3a\u5316\u62a4\u7b26",
            "/actions/crafting/grandmaster_stamina_charm": "\u5b97\u5e08\u8010\u529b\u62a4\u7b26",
            "/actions/crafting/grandmaster_intelligence_charm": "\u5b97\u5e08\u667a\u529b\u62a4\u7b26",
            "/actions/crafting/grandmaster_attack_charm": "\u5b97\u5e08\u653b\u51fb\u62a4\u7b26",
            "/actions/crafting/grandmaster_defense_charm": "\u5b97\u5e08\u9632\u5fa1\u62a4\u7b26",
            "/actions/crafting/grandmaster_melee_charm": "\u5b97\u5e08\u8fd1\u6218\u62a4\u7b26",
            "/actions/crafting/grandmaster_ranged_charm": "\u5b97\u5e08\u8fdc\u7a0b\u62a4\u7b26",
            "/actions/crafting/grandmaster_magic_charm": "\u5b97\u5e08\u9b54\u6cd5\u62a4\u7b26",
            "/actions/crafting/bishops_codex_refined": "\u4e3b\u6559\u6cd5\u5178\uff08\u7cbe\uff09",
            "/actions/crafting/cursed_bow_refined": "\u5492\u6028\u4e4b\u5f13\uff08\u7cbe\uff09",
            "/actions/crafting/sundering_crossbow_refined": "\u88c2\u7a7a\u4e4b\u5f29\uff08\u7cbe\uff09",
            "/actions/crafting/rippling_trident_refined": "\u6d9f\u6f2a\u4e09\u53c9\u621f\uff08\u7cbe\uff09",
            "/actions/crafting/blooming_trident_refined": "\u7efd\u653e\u4e09\u53c9\u621f\uff08\u7cbe\uff09",
            "/actions/crafting/blazing_trident_refined": "\u70bd\u7130\u4e09\u53c9\u621f\uff08\u7cbe\uff09",
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
            "/actions/tailoring/cotton_robe_bottoms": "\u68c9\u888d\u88d9",
            "/actions/tailoring/rough_tunic": "\u7c97\u7cd9\u76ae\u8863",
            "/actions/tailoring/cotton_robe_top": "\u68c9\u888d\u670d",
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
            "/actions/tailoring/bamboo_robe_bottoms": "\u7af9\u888d\u88d9",
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
            "/actions/tailoring/collectors_boots": "\u6536\u85cf\u5bb6\u9774",
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
            "/actions/tailoring/griffin_chaps": "\u72ee\u9e6b\u76ae\u88e4",
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
            "/actions/tailoring/alchemists_top": "\u70bc\u91d1\u5e08\u4e0a\u8863",
            "/actions/tailoring/alchemists_bottoms": "\u70bc\u91d1\u5e08\u4e0b\u88c5",
            "/actions/tailoring/enhancers_top": "\u5f3a\u5316\u5e08\u4e0a\u8863",
            "/actions/tailoring/enhancers_bottoms": "\u5f3a\u5316\u5e08\u4e0b\u88c5",
            "/actions/tailoring/revenant_tunic": "\u4ea1\u7075\u76ae\u8863",
            "/actions/tailoring/griffin_tunic": "\u72ee\u9e6b\u76ae\u8863",
            "/actions/tailoring/gluttonous_pouch": "\u8d2a\u98df\u4e4b\u888b",
            "/actions/tailoring/guzzling_pouch": "\u66b4\u996e\u4e4b\u56ca",
            "/actions/tailoring/marksman_bracers": "\u795e\u5c04\u62a4\u8155",
            "/actions/tailoring/acrobatic_hood": "\u6742\u6280\u5e08\u515c\u5e3d",
            "/actions/tailoring/magicians_hat": "\u9b54\u672f\u5e08\u5e3d",
            "/actions/tailoring/kraken_chaps": "\u514b\u62c9\u80af\u76ae\u88e4",
            "/actions/tailoring/royal_water_robe_bottoms": "\u7687\u5bb6\u6c34\u7cfb\u888d\u88d9",
            "/actions/tailoring/royal_nature_robe_bottoms": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u88d9",
            "/actions/tailoring/royal_fire_robe_bottoms": "\u7687\u5bb6\u706b\u7cfb\u888d\u88d9",
            "/actions/tailoring/kraken_tunic": "\u514b\u62c9\u80af\u76ae\u8863",
            "/actions/tailoring/royal_water_robe_top": "\u7687\u5bb6\u6c34\u7cfb\u888d\u670d",
            "/actions/tailoring/royal_nature_robe_top": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u670d",
            "/actions/tailoring/royal_fire_robe_top": "\u7687\u5bb6\u706b\u7cfb\u888d\u670d",
            "/actions/tailoring/chimerical_quiver_refined": "\u5947\u5e7b\u7bad\u888b\uff08\u7cbe\uff09",
            "/actions/tailoring/sinister_cape_refined": "\u9634\u68ee\u6597\u7bf7\uff08\u7cbe\uff09",
            "/actions/tailoring/enchanted_cloak_refined": "\u79d8\u6cd5\u62ab\u98ce\uff08\u7cbe\uff09",
            "/actions/tailoring/marksman_bracers_refined": "\u795e\u5c04\u62a4\u8155\uff08\u7cbe\uff09",
            "/actions/tailoring/acrobatic_hood_refined": "\u6742\u6280\u5e08\u515c\u5e3d\uff08\u7cbe\uff09",
            "/actions/tailoring/magicians_hat_refined": "\u9b54\u672f\u5e08\u5e3d\uff08\u7cbe\uff09",
            "/actions/tailoring/kraken_chaps_refined": "\u514b\u62c9\u80af\u76ae\u88e4\uff08\u7cbe\uff09",
            "/actions/tailoring/royal_water_robe_bottoms_refined": "\u7687\u5bb6\u6c34\u7cfb\u888d\u88d9\uff08\u7cbe\uff09",
            "/actions/tailoring/royal_nature_robe_bottoms_refined": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u88d9\uff08\u7cbe\uff09",
            "/actions/tailoring/royal_fire_robe_bottoms_refined": "\u7687\u5bb6\u706b\u7cfb\u888d\u88d9\uff08\u7cbe\uff09",
            "/actions/tailoring/kraken_tunic_refined": "\u514b\u62c9\u80af\u76ae\u8863\uff08\u7cbe\uff09",
            "/actions/tailoring/royal_water_robe_top_refined": "\u7687\u5bb6\u6c34\u7cfb\u888d\u670d\uff08\u7cbe\uff09",
            "/actions/tailoring/royal_nature_robe_top_refined": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u670d\uff08\u7cbe\uff09",
            "/actions/tailoring/royal_fire_robe_top_refined": "\u7687\u5bb6\u706b\u7cfb\u888d\u670d\uff08\u7cbe\uff09",
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
            "/actions/brewing/melee_coffee": "\u8fd1\u6218\u5496\u5561",
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
            "/actions/brewing/super_melee_coffee": "\u8d85\u7ea7\u8fd1\u6218\u5496\u5561",
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
            "/actions/brewing/ultra_melee_coffee": "\u7a76\u6781\u8fd1\u6218\u5496\u5561",
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
            "/actions/combat/frog": "\u9752\u86d9",
            "/actions/combat/snake": "\u86c7",
            "/actions/combat/swampy": "\u6cbc\u6cfd\u866b",
            "/actions/combat/alligator": "\u590f\u6d1b\u514b",
            "/actions/combat/swamp_planet": "\u6cbc\u6cfd\u661f\u7403",
            "/actions/combat/sea_snail": "\u8717\u725b",
            "/actions/combat/crab": "\u8783\u87f9",
            "/actions/combat/aquahorse": "\u6c34\u9a6c",
            "/actions/combat/nom_nom": "\u54ac\u54ac\u9c7c",
            "/actions/combat/turtle": "\u5fcd\u8005\u9f9f",
            "/actions/combat/aqua_planet": "\u6d77\u6d0b\u661f\u7403",
            "/actions/combat/jungle_sprite": "\u4e1b\u6797\u7cbe\u7075",
            "/actions/combat/myconid": "\u8611\u83c7\u4eba",
            "/actions/combat/treant": "\u6811\u4eba",
            "/actions/combat/centaur_archer": "\u534a\u4eba\u9a6c\u5f13\u7bad\u624b",
            "/actions/combat/jungle_planet": "\u4e1b\u6797\u661f\u7403",
            "/actions/combat/gobo_stabby": "\u523a\u523a",
            "/actions/combat/gobo_slashy": "\u780d\u780d",
            "/actions/combat/gobo_smashy": "\u9524\u9524",
            "/actions/combat/gobo_shooty": "\u54bb\u54bb",
            "/actions/combat/gobo_boomy": "\u8f70\u8f70",
            "/actions/combat/gobo_planet": "\u54e5\u5e03\u6797\u661f\u7403",
            "/actions/combat/eye": "\u72ec\u773c",
            "/actions/combat/eyes": "\u53e0\u773c",
            "/actions/combat/veyes": "\u590d\u773c",
            "/actions/combat/planet_of_the_eyes": "\u773c\u7403\u661f\u7403",
            "/actions/combat/novice_sorcerer": "\u65b0\u624b\u5deb\u5e08",
            "/actions/combat/ice_sorcerer": "\u51b0\u971c\u5deb\u5e08",
            "/actions/combat/flame_sorcerer": "\u706b\u7130\u5deb\u5e08",
            "/actions/combat/elementalist": "\u5143\u7d20\u6cd5\u5e08",
            "/actions/combat/sorcerers_tower": "\u5deb\u5e08\u4e4b\u5854",
            "/actions/combat/gummy_bear": "\u8f6f\u7cd6\u718a",
            "/actions/combat/panda": "\u718a\u732b",
            "/actions/combat/black_bear": "\u9ed1\u718a",
            "/actions/combat/grizzly_bear": "\u68d5\u718a",
            "/actions/combat/polar_bear": "\u5317\u6781\u718a",
            "/actions/combat/bear_with_it": "\u718a\u718a\u661f\u7403",
            "/actions/combat/magnetic_golem": "\u78c1\u529b\u9b54\u50cf",
            "/actions/combat/stalactite_golem": "\u949f\u4e73\u77f3\u9b54\u50cf",
            "/actions/combat/granite_golem": "\u82b1\u5c97\u5ca9\u9b54\u50cf",
            "/actions/combat/golem_cave": "\u9b54\u50cf\u6d1e\u7a74",
            "/actions/combat/zombie": "\u50f5\u5c38",
            "/actions/combat/vampire": "\u5438\u8840\u9b3c",
            "/actions/combat/werewolf": "\u72fc\u4eba",
            "/actions/combat/twilight_zone": "\u66ae\u5149\u4e4b\u5730",
            "/actions/combat/abyssal_imp": "\u6df1\u6e0a\u5c0f\u9b3c",
            "/actions/combat/soul_hunter": "\u7075\u9b42\u730e\u624b",
            "/actions/combat/infernal_warlock": "\u5730\u72f1\u672f\u58eb",
            "/actions/combat/infernal_abyss": "\u5730\u72f1\u6df1\u6e0a",
            "/actions/combat/chimerical_den": "\u5947\u5e7b\u6d1e\u7a74",
            "/actions/combat/sinister_circus": "\u9634\u68ee\u9a6c\u620f\u56e2",
            "/actions/combat/enchanted_fortress": "\u79d8\u6cd5\u8981\u585e",
            "/actions/combat/pirate_cove": "\u6d77\u76d7\u57fa\u5730",

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

            '/skills/attack': '攻击',
            '/skills/defense': '防御',
            '/skills/intelligence': '智力',
            '/skills/melee': '近战',
            '/skills/stamina': '耐力',
            '/skills/magic': '魔法',
            '/skills/ranged': '远程',
        };
        EnNameDict = {};

        constructor() {
            MessageHandler.addListener('init_client_data', msg => { this.onInitClientData(msg); }, -99);
        }

        onInitClientData(client) {
            const inverseKV = (obj) => {
                const retobj = {};
                for (const key in obj) {
                    retobj[obj[key]] = key;
                }
                return retobj;
            };
            const initEnNameDict = detailMap => {
                for (const [hrid, detail] of Object.entries(detailMap)) {
                    this.EnNameDict[hrid] = detail.name;
                }
            };
            initEnNameDict(client.skillDetailMap);
            initEnNameDict(client.abilityDetailMap);
            initEnNameDict(client.itemDetailMap);
            initEnNameDict(client.combatMonsterDetailMap);
            initEnNameDict(client.actionDetailMap); ``
        }

        /**
         * @param {string} hrid
         * @param {'zh' | 'en'} lang
         */
        hridToName(hrid, lang = language) {
            return (lang === 'zh' ? this.ZhNameDict : this.EnNameDict)[hrid] || hrid;
        }
    };

    //#endregion


    //#region InGameController

    const ChatPanel = new class {
        /**
         * @param {HTMLElement} elem
         * @param {string | (() => string)} text
         * @param {'ctrlClick' | 'doubleClick' | 'disable'} method
         */
        attachInsertToChat(elem, text, method) {
            const gen = typeof text === 'string' ? () => text : text;
            if (method === 'ctrlClick') {
                elem.addEventListener('click', () => {
                    if (!Keyboard.isCtrlDown()) return;
                    ChatPanel.insertToChat(gen());
                });
            } else if (method === 'doubleClick') {
                elem.addEventListener('dblclick', () => {
                    ChatPanel.insertToChat(gen());
                });
            }
        }

        insertToChat(text) {
            const chatSelector = '#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_chatPanel__mVaVt > div > div.Chat_chatInputContainer__2euR8 > form > input';
            const chat = document.querySelector(chatSelector);
            this.insertToInput(chat, text);
        }

        insertToInput(inputElement, text) {
            // From 牛牛聊天增强插件 by HouGuoYu
            const start = inputElement.selectionStart;
            const end = inputElement.selectionEnd;
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                "value"
            ).set;
            nativeInputValueSetter.call(inputElement, inputElement.value.substring(0, start) + text + inputElement.value.substring(end));
            const event = new Event('input', {
                bubbles: true,
                cancelable: true
            });
            inputElement.dispatchEvent(event);
            inputElement.selectionStart = inputElement.selectionEnd = start + text.length;
            inputElement.focus();
        }
    };

    //#endregion


    //#region History

    const BattleHistory = new class {
        storageDataName = 'battleHistory';

        /**
         * @typedef {Object} BattleHistoryDataEntry
         * @property {string} startTimeLocale
         * @property {number} startTime
         * @property {number} duration
         * @property {number} runCount
         * @property {number} eph
         * @property {number} income
         * @property {number} profit
         * @property {number} luck
         * @property {CountedItem[]} drops
         */
        /**
         * @typedef {Object} BattleHistoryData
         * @property {string} playerName
         * @property {{ [mapHrid: string]: { [timeStamp: number]: BattleHistoryDataEntry } }} data
         */
        /** @type {{ [playerId: number]: BattleHistoryData }} */
        history = {};

        constructor() {
            MessageHandler.addListener('init_client_data', msg => { this.onInitClientData(msg); });
            MessageHandler.addListener('new_battle', msg => { this.onNewBattle(msg); });
        }

        onInitClientData(_) {
            this.load();
        }

        onNewBattle(_) {
            this.update();
        }

        update() {
            if (!BattleData.inBattle) return;
            const mapHrid = BattleData.currentMapHrid;
            const mapData = BattleData.mapData[mapHrid];
            if (!mapData) return;
            const bossWave = mapData.spawnInfo.bossWave;
            if (BattleData.runCount === 1) return;
            if (bossWave && (BattleData.runCount - 1) % bossWave !== 0) return;
            const stat = BattleDropAnalyzer.analyzeCurrent();
            const /** @type {BattleHistoryDataEntry} */ current = {
                startTimeLocale: Utils.formatDate(new Date(BattleData.startTime * 1000)),
                startTime: BattleData.startTime,
                duration: BattleData.duration,
                runCount: BattleData.runCount,
                eph: 3600 * (BattleData.runCount - 1) / BattleData.duration,
                income: stat.currentIncome.income,
                profit: stat.currentIncome.profit,
                luck: stat.luck,
                drops: BattleData.playerLoot[CharacterData.playerName].items,

            };
            const playerId = CharacterData.playerId;
            const key = Math.round(BattleData.startTime);
            this.history[playerId] ??= { playerName: CharacterData.playerName, data: {} };
            (this.history[playerId].data[mapHrid] ??= {})[key] = current;
            this.save();
        }

        load() {
            this.history = LocalStorageData.get(this.storageDataName) || {};
        }
        save() {
            LocalStorageData.set(this.storageDataName, this.history);
        }
    }

    const ChestOpenHistory = new class {
        /**
         * @typedef {Object} ChestOpenHistoryData
         * @property {string} playerName
         * @property {{ [mapHrid: string]: { [timeStamp: number]: BattleHistoryDataEntry } }} data
         */
        /** @type {{ [playerId: number]: BattleHistoryData }} */
        history = {};

        update() {

        }
        loadFromEdibleTools() {

        }
    }

    //#endregion


    const SettingsUi = new class {
        popup = new TabbedPopup();

        settingRow(text, desc, input) {
            const textDiv = Ui.div('lll_label', text);
            if (desc !== null) Tooltip.attach(textDiv, Tooltip.description(null, desc), 'center');
            return Ui.div('lll_div_row', [textDiv, input]);
        }

        constructUpdateMarket() {
            const locale = UiLocale.settings.market;
            let updateMarketInfo = Ui.div('lll_label',
                Market.marketData?.time ?
                    `${locale.lastUpdated[language]}: ${new Date(Market.marketData.time * 1000).toLocaleString()}` :
                    locale.fetchMarketDataFail[language]
            );
            let updateMarketBtn = Ui.button(locale.updateMarket[language]);
            updateMarketBtn.onclick = () => {
                updateMarketInfo.style.minWidth = getComputedStyle(updateMarketInfo).width;
                updateMarketInfo.innerHTML = `${locale.updating[language]}...`;
                Market.update(() => {
                    updateMarketInfo.innerHTML = `${locale.updateFinish[language]}: ${Utils.formatDate(new Date(Market.marketData.time * 1000))}`;
                });
            };
            return Ui.div('lll_div_row', [updateMarketBtn, updateMarketInfo]);
        }

        constructMarketPanel() {
            let panel = Ui.div('lll_div_settingPanelContent');
            const locale = UiLocale.settings.market;

            const /** @type {HTMLInputElement} */ apiAddrInput = Ui.elem('input', 'lll_input');
            const setApiAddrInput = () => {
                const src = Config.market.source;
                if (src.type !== 'custom') {
                    apiAddrInput.readOnly = true;
                    apiAddrInput.value = Market.apiMap[src.type].addr;
                } else {
                    apiAddrInput.readOnly = false;
                }
            };
            apiAddrInput.onchange = () => {
                Config.market.source.addr = apiAddrInput.value;
                ConfigManager.saveConfig();
            };
            setApiAddrInput();
            const apiSelect = Ui.elem('select', 'lll_input_select');
            const apiList = Object.entries(Market.apiMap)
                .sort((a, b) => a[1].order - b[1].order);
            for (let [type, info] of apiList) {
                const text = info.desc;
                let option = new Option(text, type);
                if (Config.market.source.type === type) option.selected = true;
                apiSelect.options.add(option);
            }
            apiSelect.onchange = () => {
                const type = apiSelect.options[apiSelect.selectedIndex].value;
                Config.market.source.type = type;
                setApiAddrInput();
                Config.market.source.addr = apiAddrInput.value;
                ConfigManager.saveConfig();
            };
            panel.appendChild(SettingsUi.settingRow(locale.apiSource[language], null, apiSelect));
            panel.appendChild(SettingsUi.settingRow(locale.apiAddr[language], null, apiAddrInput));
            panel.appendChild(SettingsUi.settingRow(locale.autoUpdateTime[language], null, Ui.numberInput({
                initValue: Config.market.autoUpdateInterval,
                minValue: 0,
                maxValue: 10000,
                onchange: val => {
                    Config.market.autoUpdateInterval = val;
                    ConfigManager.saveConfig();
                }
            })));
            panel.appendChild(this.constructUpdateMarket());

            panel.appendChild(Ui.div('lll_separator'));

            panel.appendChild(SettingsUi.settingRow(
                locale.computeNetProfit[language], locale.computeNetProfitDesc[language],
                Ui.checkBox({
                    checked: Config.market.computeNetProfit,
                    onchange: checked => {
                        Config.market.computeNetProfit = checked;
                        ConfigManager.saveConfig();
                        Market.initMarketData();
                    }
                })
            ));
            panel.appendChild(SettingsUi.settingRow(
                locale.computeNonTradable[language], locale.computeNonTradableDesc[language],
                Ui.checkBox({
                    checked: Config.market.computeNonTradable,
                    onchange: checked => {
                        Config.market.computeNonTradable = checked;
                        ConfigManager.saveConfig();
                        Market.initMarketData();
                    }
                })
            ));

            return panel;
        }

        constructMiscPanel() {
            let panel = Ui.div('lll_div_settingPanelContent');
            const locale = UiLocale.settings.misc;


            const langSelect = Ui.elem('select', 'lll_input_select');
            const langList = [
                ['default', locale.languageDefault[language]],
                ['zh', '中文'],
                ['en', 'English'],
            ]
            for (let [type, desc] of langList) {
                let option = new Option(desc, type);
                if (Config.general.language === type) option.selected = true;
                langSelect.options.add(option);
            }
            langSelect.onchange = () => {
                let type = langSelect.options[langSelect.selectedIndex].value;
                Config.general.language = type;
                updateLanguage();
                ConfigManager.saveConfig();
            };
            panel.appendChild(SettingsUi.settingRow(locale.language[language], null, langSelect));

            panel.appendChild(Ui.div('lll_separator'));

            panel.appendChild(SettingsUi.settingRow(
                locale.sampleRate[language], locale.sampleRateDesc[language],
                Ui.slider({
                    initValue: Config.charaFunc.samples,
                    minValue: 64,
                    maxValue: 65536,
                    mapFunc: x => Math.pow(2, x),
                    invMapFunc: x => Math.log2(x),
                    onchange: samples => {
                        Config.charaFunc.samples = samples;
                        ConfigManager.saveConfig();
                    },
                })
            ));
            panel.appendChild(SettingsUi.settingRow(
                locale.interpolationCount[language], locale.interpolationCountDesc[language],
                Ui.slider({
                    initValue: Config.chart.interpolatePoints,
                    minValue: 64,
                    maxValue: 4096,
                    mapFunc: x => Math.pow(2, x),
                    invMapFunc: x => Math.log2(x),
                    onchange: samples => {
                        Config.chart.interpolatePoints = samples;
                        ConfigManager.saveConfig();
                    },
                })
            ));

            return panel;
        }

        showPopup() {
            this.popup.showSettings = false;
            this.popup.open();
            this.popup.addTab(UiLocale.settings.market.tabLabel[language], () => this.constructMarketPanel(), null);
            this.popup.addTab(UiLocale.battleDrop.tabLabel[language], () => BattleDropAnalyzerUi.constructSettingsPanel(), null);
            this.popup.addTab(UiLocale.chestDrop.tabLabel[language], () => ChestDropAnalyzerUi.constructSettingsPanel(), null);
            this.popup.addTab(UiLocale.settings.misc.tabLabel[language], () => this.constructMiscPanel(), null);
        }

    }


    //#region BattleDropAnalyzer

    const BattleDropAnalyzer = new class {
        /**
         * @typedef {Object} SpawnInfo
         * @property {number} bossWave
         * @property {number} maxSpawnCount
         * @property {number} maxTotalStrength
         * @property {Object<string, number>} expectedSpawns
         * @property {{ hrid: string, strength: number, rate: number, eliterTier: number }[]} spawns
         */
        /**
         * @typedef {Object} MapDropData
         * @property {SpawnInfo} spawnInfo
         * @property {number} bossCount
         * @property {number} normalCount
         * @property {Object<string, ItemDropData[]>} bossDrops
         * @property {Object<string, ItemDropData[]>} monsterDrops
         */

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
                for (const item of drops) E += cnt * DropAnalyzer.itemCountExpt(item) * item.price;
            }
            const expectedSpawns = this.computeExpectedSpawns(dropData.spawnInfo);
            for (const [hrid, drops] of Object.entries(dropData.monsterDrops)) {
                const cnt = expectedSpawns[hrid] * dropData.normalCount;
                for (const item of drops) E += cnt * DropAnalyzer.itemCountExpt(item) * item.price;
            }
            return E;
        }
        dropVariance(dropData) {
            let Var = 0;
            for (const [_, drops] of Object.entries(dropData.bossDrops)) {
                const cnt = dropData.bossCount;
                for (const item of drops) Var += cnt * DropAnalyzer.itemCountVar(item) * item.price * item.price;
            }
            const expectedSpawns = this.computeExpectedSpawns(dropData.spawnInfo);
            for (const [hrid, drops] of Object.entries(dropData.monsterDrops)) {
                const cnt = expectedSpawns[hrid] * dropData.normalCount;
                for (const item of drops) Var += cnt * DropAnalyzer.itemCountVar(item) * item.price * item.price;
            }
            return Var;
        }
        dropFragExpt(dropData){
            let E = 0;
            for (const [_, drops] of Object.entries(dropData.bossDrops)) {
                const cnt = dropData.bossCount;
                for (const item of drops){
                    if(item.name.includes("Key Fragment")){
                        E = cnt * DropAnalyzer.itemCountExpt(item);
                    }
                }
            }
            return E;
        }

        #monsterCF(monsterDrops) {
            const cfs = [];
            for (const drop of monsterDrops) {
                cfs.push(DropAnalyzer.charaFunc(drop));
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
            if (Config.battleDrop.verbose) out("DropData:", dropData)
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
            const samples = Config.charaFunc.samples;
            const cf = BattleDropAnalyzer.battleCF(dropData);
            let cdf;
            const minLimit = Config.battleDrop.analyzer.minLimit;
            const dungeonDrop = dropData.bossDrops?.['_dungeon']?.[0];
            if (!dungeonDrop) {
                const perWaveLimit = Config.battleDrop.analyzer.perWaveLimit;
                const limit = Math.max(minLimit, perWaveLimit * (dropData.bossCount + dropData.normalCount));
                cdf = CharaFunc.getCDF(cf, samples, limit);
            } else {
                const chestPrice = Market.getPriceByName(dungeonDrop.name);
                const epoch = dropData.bossCount;
                const count = (dungeonDrop.minCount + dungeonDrop.maxCount) / 2;
                const baseCount = Math.floor(count);
                const basePrice = chestPrice * baseCount * epoch;
                const limit = Math.max(samples, epoch);
                const decCDF = CharaFunc.getCDF(CharaFunc.pow(DropAnalyzer.charaFunc({
                    hrid: dungeonDrop.hrid,
                    minCount: count - baseCount,
                    maxCount: count - baseCount,
                    dropRate: 1,
                    price: 1,
                }), epoch), samples, limit);
                cdf = {
                    limit: decCDF.limit * chestPrice + basePrice,
                    cdf: (x) => {
                        const chestCount = (x - basePrice) / chestPrice;
                        return decCDF.cdf(chestCount + 16 / samples);
                    },
                };
            }

            const end = new Date().getTime();
            if (Config.battleDrop.verbose) out(`${end - start}ms`);
            return cdf;
        }

        getItemRarity(itemHrid) {
            const value = Market.getPriceByHrid(itemHrid, 'bid', 0, false);
            const count = BattleData.itemFreq[itemHrid];
            let r = 0;
            if (count >= 1 || value <= 1000) {
                if (itemHrid.includes('_chest')) r = 0;
                else r = -1;
            } else if (itemHrid.includes('_aura')
                || itemHrid === '/items/revive'
                || itemHrid === '/items/insanity'
                || itemHrid === '/items/invincible') r = 6; // 蓝书
            else if (value >= 2e6) r = 5; // 发光红
            else if (value >= 8e5) r = 4; // 橙
            else if (value >= 2.5e5) r = 3; // 紫
            else if (value >= 2e5) r = 2; // 蓝
            else if (value >= 1e5 && count <= 0.02) r = 2; // 蓝
            else if (value >= 5e4 && count <= 7e-3) r = 2; // 蓝
            else if (value >= 3e4) r = 1; // 绿
            return r;
        }

        analyzeCurrent(playerName = null) {
            playerName ??= CharacterData.playerName;
            const foodConsumption = (player) => {
                const foodData = JSON.parse(localStorage.getItem('Edible_Tools') ?? '{}')
                    .Combat_Data?.Combat_Player_Data?.[player]?.Food_Data?.Statistics;
                if (!foodData || !foodData.Time) {
                    let totalFoodPrice = 0;
                    const playerFood = BattleData.playerFood[player];
                    for (let itemName in playerFood.food) {
                        const foodPrice = Market.getPriceByName(itemName, 'ask') || 500;
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
                let totalFoodPrice = 0;
                for (let [itemHrid, count] of Object.entries(foodData.Food)) {
                    const foodPrice = Market.getPriceByHrid(itemHrid, 'ask') || 500;
                    totalFoodPrice += foodPrice * count;
                }
                return { isSteady: true, price: totalFoodPrice / foodData.Time };
            };

            const food = foodConsumption(playerName);
            const dropData = BattleData.getCurrentDropData(playerName);
            const income = BattleData.playerLoot[playerName].price();
            const incomeExpectation = BattleDropAnalyzer.dropExpectation(dropData);
            const incomeVariance = BattleDropAnalyzer.dropVariance(dropData);
            const dailyIncome = 86400 * income / BattleData.duration;
            const dailyIncomeExpectation = 86400 * incomeExpectation / BattleData.duration;
            const dailyIncomeVariance = 86400 * incomeVariance / BattleData.duration;
            const profit = income - food.price * BattleData.duration;
            const profitExpectation = incomeExpectation - food.price * BattleData.duration;
            const dailyProfit = dailyIncome - 86400 * food.price;
            const dailyProfitExpectation = dailyIncomeExpectation - 86400 * food.price;
            const luck = BattleDropAnalyzer.battleCDF(dropData).cdf(income);
            const fragExptPerHour=3600 * BattleDropAnalyzer.dropFragExpt(dropData) / BattleData.duration;
            const fragExptTotal=BattleDropAnalyzer.dropFragExpt(dropData);
            return {
                /** @type {MapDropData} */ dropData: dropData,
                currentIncome: {
                    /** @type {number} */ income: income,
                    /** @type {number} */ expectation: incomeExpectation,
                    /** @type {number} */ variance: incomeVariance,
                    /** @type {number} */ stddev: Math.sqrt(incomeVariance),
                },
                dailyIncome: {
                    /** @type {number} */ income: dailyIncome,
                    /** @type {number} */ expectation: dailyIncomeExpectation,
                    /** @type {number} */ variance: dailyIncomeVariance,
                    /** @type {number} */ stddev: Math.sqrt(dailyIncomeVariance),
                },
                currentProfit: {
                    /** @type {number} */ profit: profit,
                    /** @type {number} */ expectation: profitExpectation,
                },
                dailyProfit: {
                    /** @type {number} */ profit: dailyProfit,
                    /** @type {number} */ expectation: dailyProfitExpectation,
                },
                /** @type {number} */ luck: luck,
                /** @type {boolean} */ isSteady: food.isSteady,
                frag:{
                    perHour:fragExptPerHour,
                    total:fragExptTotal,
                }
            }
        }
    };

    const BattleDropAnalyzerUi = new class {
        popup = new TabbedPopup();
        contentDiv = null;

        /** @type {Object<string, { desc: string, weight: (item: CountedItem) => number }>} */
        itemSortOrderMap = {
            'totalBid': {
                desc: UiLocale.battleDrop.sortOrder.totalBid[language],
                weight: item => Market.getPriceByHrid(item.hrid) * item.count,
            },
            'unitBid': {
                desc: UiLocale.battleDrop.sortOrder.unitBid[language],
                weight: item => Market.getPriceByHrid(item.hrid),
            },
        }

        constructor() {
            // 在加载完分赃按钮后添加统计按钮
            this.observe();

            document.addEventListener('copy', (e) => {
                // @ts-ignore
                if (!document.getElementById('lll_battle_overviewPanel')?.contains(e.target)) return;
                if (!e.clipboardData) return;
                let content = window?.getSelection().toString();
                content = content.replaceAll(/└|├|\x20/g, '').replaceAll('\t', '').replaceAll('\n', '   ').replaceAll(':', ': ');
                e.clipboardData.setData('text/plain', content.trim());
                e.preventDefault();
            });
        }

        observe() {
            const observer = new MutationObserver((mutationsList, observer) => {
                mutationsList.forEach(mutation => {
                    mutation.addedNodes.forEach(addedNode => {
                        // @ts-ignore
                        const classList = addedNode.classList;
                        if (!classList) return;

                        // 切换页面
                        if (classList.contains('MainPanel_subPanelContainer__1i-H9')) {
                            // @ts-ignore
                            if (addedNode.querySelector(".CombatPanel_combatPanel__QylPo")) {
                                this.addButtonBeforeEdible();
                            }
                        }

                        // 初始化
                        if (classList.contains('GamePage_contentPanel__Zx4FH')) {
                            // @ts-ignore
                            if (addedNode.querySelector('div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div.CombatPanel_combatPanel__QylPo')) {
                                dbg(addedNode);
                                this.addButtonBeforeEdible();
                            }
                        }

                        // 食用工具原来的按钮
                        if (classList.contains('Button_battlePlayerLoot__custom')) {
                            this.addButtonAfterEdible();
                        }
                    });
                });
            });
            const rootNode = document.body;
            const config = { childList: true, subtree: true };
            observer.observe(rootNode, config);
            this.addButtonBeforeEdible();
        }

        constructOverviewPanel() {
            const locale = UiLocale.battleDrop.overview;

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
                let svgIcon = Ui.itemSvgIcon(hrid);
                let itemDiv = Ui.div('lll_div_item', `
                    <span style="color: white; margin-right: 3px; text-align: center; font-size: 16px; line-height: 1.2;">
                        ${Utils.formatPrice(count)}
                    </span>
					${svgIcon.outerHTML}
					<span style="${itemStyle(rarity)} margin-left: 3px; white-space: nowrap; font-size: 16px; line-height: 1.2;">
                        ${Localizer.hridToName(hrid)}
                    </span>
				`)
                Tooltip.attach(itemDiv, Tooltip.item(hrid, count));
                return itemDiv;
            };
            const getPlayerDiv = (player) => {
                let playerName = Ui.div('lll_div_cardTitle large', player);
                playerName.onclick = () => {
                    const height = getComputedStyle(playerName).height;
                    playerName.style.height = height;
                    playerName.innerHTML = playerName.innerHTML === '' ? player : '';
                };
                let innerText = Ui.div({ style: 'fontSize: 16px;' });

                let playerDiv = Ui.div('lll_div_card', [playerName, innerText]);

                const stat = BattleDropAnalyzer.analyzeCurrent(player);
                const isBeatAvg = (stat.currentIncome.income - stat.currentIncome.expectation) / Math.sqrt(stat.currentIncome.variance); // -1 ~ 1
                const colorLuck = Utils.luckColor(stat.luck);
                const colorAvg = Utils.luckColor(isBeatAvg / 2 + 0.5);


                // 计算经验
                let maxSkill = null, maxXp = 0, totalXp = 0;
                if (BattleData.playerStat[player]?.skillExp) {
                    for (let skill in BattleData.playerStat[player].skillExp) {
                        let xp = BattleData.playerStat[player].skillExp[skill];
                        totalXp += xp
                        if (xp > maxXp) { maxXp = xp; maxSkill = skill; }
                    }
                }
                const xpName = Localizer.hridToName(maxSkill);
                const xpPerHour = Utils.formatPrice(3600 * maxXp / BattleData.duration);
                const totalXpPerHour = Utils.formatPrice(3600 * totalXp / BattleData.duration);

                // 绘制表格
                const legacyUi = Config.battleDrop.ui.overviewUseLegacyUi;
                const showStdDev = Config.battleDrop.ui.overviewShowStdDev;
                const showFragment = Config.battleDrop.ui.overviewShowFragment;

                const tabText = (x) => `<td style="text-align: left;">${x}:&thinsp;</td>`;
                const tabValue = (x) => {
                    let i = x.length - 1;
                    for (; i >= 0; --i) if (x[i] >= '0' && x[i] <= '9') break;
                    const unit = x.slice(i + 1);
                    let num = x.slice(0, i + 1);
                    return `<td style="text-align: left;"><span style="margin: 0 -2px 0 0;">${num}</span></td><td>${unit}</td>`;
                };
                const tabSeparator = () => Ui.elem('tr', null, '<td colspan="3"><div class="lll_separator" style="margin: 6px -3px"></div></td>');
                const tabPad = () => Ui.elem('tr', null, '<td colspan="3"><div style="margin-top: 3px"></div></td>');
                const tabRow = (color, child) => Ui.elem('tr', { style: `color: ${color};` }, child);
                const tabRowLight = (color, child) => Ui.elem('tr', { style: `color: ${color}; font-weight: normal;` }, child);
                const tabNoSel = (x) => `<span class="lll_text_noSelect" style="color: var(--border); font-family: sans-serif;">${x}</span>`;

                const tableOld = Ui.elem('table', { style: 'font-weight: bold; line-height: 1.2; width: 100%;' }, [
                    tabRow(colorLuck, tabText(locale.income[language]) + tabValue(Utils.formatPrice(stat.currentIncome.income))),
                    tabRow(colorLuck, tabText(locale.dailyIncome[language]) + tabValue(Utils.formatPrice(stat.dailyIncome.income) + '/d')),
                    tabRow(colorLuck, tabText(locale.luck[language]) + tabValue(Utils.formatLuck(stat.luck))),
                    tabSeparator(),
                    tabRow(colorAvg, tabText(locale.incomeExpt[language]) + tabValue(Utils.formatPrice(stat.currentIncome.expectation))),
                    showStdDev ? tabRow(colorAvg, tabText(tabNoSel('└') + locale.stdDev[language]) + tabValue(Utils.formatPrice(Math.sqrt(stat.currentIncome.variance)))) : null,
                    tabRow(colorAvg, tabText(locale.dailyIncomeExpt[language]) + tabValue(Utils.formatPrice(stat.dailyIncome.expectation) + '/d')),
                    showStdDev ? tabRow(colorAvg, tabText(tabNoSel('└') + locale.stdDev[language]) + tabValue(Utils.formatPrice(Math.sqrt(stat.dailyIncome.variance)))) : null,
                    tabRow(colorAvg, tabText(locale.dailyProfitExpt[language]) + tabValue(
                        (stat.isSteady ? '' : '<span style="margin: 0 1px 0 0;">≥</span>')
                        + Utils.formatPrice(stat.dailyProfit.expectation, { precision: stat.isSteady ? 4 : 3 })
                            .replace('-', '<span style="font-family: Consolas, monaco, monospace;">-</span>')
                        + '/d'
                    )),
                    //碎片
                    showFragment ? tabSeparator():null,
                    showFragment ? tabRow('#ffc107', tabText(locale.fragmentExpt[language]) + stat.frag.perHour.toFixed(2) + '/h'):null,
                    showFragment ? tabRow('#ffc107', tabText(locale.fragmentTotal[language]) +stat.frag.total.toFixed(2) ):null,
                    tabSeparator(),
                    tabRow('#ffc107', tabText(xpName + locale.experience[language]) + tabValue(xpPerHour + '/h')),
                    tabRow('#ffc107', tabText(locale.total[language] + locale.experience[language]) + tabValue(totalXpPerHour + '/h'))
                ]);
                const tableNew = Ui.elem('table', { style: 'font-weight: bold; line-height: 1.1; width: 100%;' }, [
                    tabRow(colorLuck, tabText(locale.luck[language]) + tabValue(Utils.formatLuck(stat.luck))),
                    tabPad(),
                    tabRow(colorLuck, tabText(locale.income[language]) + tabValue(Utils.formatPrice(stat.currentIncome.income))),
                    tabRowLight(colorAvg, tabText(tabNoSel(showStdDev ? '├' : '└') + locale.mean[language]) + tabValue(Utils.formatPrice(stat.currentIncome.expectation))),
                    showStdDev ? tabRowLight(colorAvg, tabText(tabNoSel('└') + locale.stdDev[language]) + tabValue(Utils.formatPrice(Math.sqrt(stat.currentIncome.variance)))) : null,
                    tabPad(),
                    tabRow(colorLuck, tabText(locale.dailyIncome[language]) + tabValue(Utils.formatPrice(stat.dailyIncome.income) + '/d')),
                    tabRowLight(colorAvg, tabText(tabNoSel(showStdDev ? '├' : '└') + locale.mean[language]) + tabValue(Utils.formatPrice(stat.dailyIncome.expectation) + '/d')),
                    showStdDev ? tabRowLight(colorAvg, tabText(tabNoSel('└') + locale.stdDev[language]) + tabValue(Utils.formatPrice(Math.sqrt(stat.dailyIncome.variance)))) : null,
                    tabPad(),
                    tabRow(colorLuck, tabText(locale.dailyProfit[language]) + tabValue(
                        (stat.isSteady ? '' : '<span style="margin: 0 1px 0 0;">≥</span>')
                        + Utils.formatPrice(stat.dailyProfit.profit, { precision: stat.isSteady ? 4 : 3 })
                            .replace('-', '<span style="font-family: Consolas, monaco, monospace;">-</span>')
                        + '/d'
                    )),
                    tabRowLight(colorAvg, tabText(tabNoSel('└') + locale.mean[language]) + tabValue(
                        (stat.isSteady ? '' : '<span style="margin: 0 1px 0 0;">≥</span>')
                        + Utils.formatPrice(stat.dailyProfit.expectation, { precision: stat.isSteady ? 4 : 3 })
                            .replace('-', '<span style="font-family: Consolas, monaco, monospace;">-</span>')
                        + '/d'
                    )),
                    //碎片
                    showFragment ? tabSeparator():null,
                    showFragment ? tabRow('#ffc107', tabText(locale.fragmentExpt[language]) + stat.frag.perHour.toFixed(2) + '/h'):null,
                    showFragment ? tabRow('#ffc107', tabText(locale.fragmentTotal[language]) +stat.frag.total.toFixed(2) ):null,
                    tabSeparator(),
                    tabRow('#ffc107', tabText(xpName + locale.experience[language]) + tabValue(xpPerHour + '/h')),
                    tabRow('#ffc107', tabText(locale.total[language] + locale.experience[language]) + tabValue(totalXpPerHour + '/h'))
                ]);
                const table = legacyUi ? tableOld : tableNew;
                const chatMsg = () => {
                    const msg = Config.battleDrop.ui.overviewMsgFmt
                        .replace('{income}', Utils.formatPrice(stat.currentIncome.income))
                        .replace('{income.mean}', Utils.formatPrice(stat.currentIncome.expectation))
                        .replace('{income.stddev}', Utils.formatPrice(stat.currentIncome.stddev))
                        .replace('{income.daily}', Utils.formatPrice(stat.dailyIncome.income))
                        .replace('{income.daily.mean}', Utils.formatPrice(stat.dailyIncome.expectation))
                        .replace('{income.daily.stddev}', Utils.formatPrice(stat.dailyIncome.stddev))
                        .replace('{profit}', Utils.formatPrice(stat.currentProfit.profit))
                        .replace('{profit.mean}', Utils.formatPrice(stat.currentProfit.expectation))
                        .replace('{profit.daily}', Utils.formatPrice(stat.dailyProfit.profit))
                        .replace('{profit.daily.mean}', Utils.formatPrice(stat.dailyProfit.expectation))
                        .replace('{luck}', Utils.formatLuck(stat.luck));
                    return msg;
                }
                ChatPanel.attachInsertToChat(table, chatMsg, Config.battleDrop.ui.overviewInsertToChatAction);
                innerText.appendChild(table);

                let itemsDiv = Ui.div({ style: 'margin-top: 10px; gap: 8px; display: flex; flex-direction: column;' });
                innerText.appendChild(itemsDiv);

                const order = this.itemSortOrderMap[Config.battleDrop.ui.overviewItemSortOrder].weight;
                const dropItems = BattleData.playerLoot[player].items.sort(
                    (a, b) => order(b) - order(a)
                );
                let itemCount = 0;
                for (let item of dropItems) {
                    const hrid = item.hrid;
                    const rarity = BattleDropAnalyzer.getItemRarity(hrid);
                    if (rarity < Config.battleDrop.ui.overviewItemMinRarity) continue;
                    itemsDiv.appendChild(itemText(hrid, rarity, item.count));
                    if (++itemCount >= Config.battleDrop.ui.overviewItemMaxNumber) break;
                }
                if (itemCount === 0) {
                    const runCount = BattleData.runCount - 1;
                    if (runCount >= 800) {
                        let info = `${UiLocale.battleDrop.overview.info800[language](runCount)}`;
                        let text = Ui.div({
                            style: {
                                textAlign: 'center',
                                color: 'rgb(252, 255, 188)',
                                margin: '0 0 10px 0',
                                textShadow: '0 0 1px rgb(167, 164, 0), 0 0 2px rgb(246, 255, 117), 0 0 3px rgb(251, 255, 201)',
                            }
                        }, info);
                        itemsDiv.appendChild(text);
                    } else if (runCount >= 400) {
                        let info = `${UiLocale.battleDrop.overview.info400[language](runCount)}`;
                        let text = Ui.div({
                            style: {
                                textAlign: 'center',
                                color: 'rgb(180, 180, 180)',
                                margin: '0 0 10px 0',
                            }
                        }, info);
                        itemsDiv.appendChild(text);
                    }
                }
                return playerDiv;
            };

            let panel = Ui.div({ id: 'lll_battle_overviewPanel' });
            panel.style.padding = '13px 20px 20px 20px';

            let contentDiv = document.createElement('div');
            contentDiv.style.display = 'flex';
            contentDiv.style.gap = '15px';
            panel.appendChild(contentDiv);
            for (let player of BattleData.playerList) {
                contentDiv.appendChild(getPlayerDiv(player));
            }
            return panel;
        }

        constructDetailsPanel() {
            let panel = document.createElement('div');
            panel.style.padding = '20px';

            const detailsPanel = () => {
                const contentDiv = document.createElement('div');
                panel.appendChild(contentDiv);

                // 创建图表
                const canvas = ChartRenderer.getCanvas();
                contentDiv.appendChild(canvas.wrapper);
                this.renderDetailsChart(canvas.canvas);

                // 添加自定义按钮
                const customButton = Ui.button(UiLocale.battleDrop.distribution.allMap[language]);
                customButton.onclick = () => {
                    panel.removeChild(contentDiv);
                    customPanel();
                };
                contentDiv.appendChild(Ui.div(null, customButton));
            }
            const customPanel = () => {
                const defaultPlayer = CharacterData.playerName;
                const defaultMap = BattleData.currentMapHrid;
                const defaultRunCount = BattleData.runCount;

                const maxRunCount = Config.battleDrop.ui.customPanelMaxRunCount;
                const maxSliderValue = Config.battleDrop.ui.customPanelMaxSliderValue;
                let runCount = defaultRunCount;
                const renderChart = (value = null) => {
                    const playerName = defaultPlayer;
                    const mapHrid = mapSelect.options[mapSelect.selectedIndex].value;
                    if (value !== null) runCount = value + 1;
                    while (canvasDiv.lastChild) canvasDiv.removeChild(canvasDiv.lastChild);
                    const canvas = ChartRenderer.getCanvas();
                    canvasDiv.appendChild(canvas.wrapper);
                    this.renderCustomChart(canvas.canvas, mapHrid, runCount, playerName);
                }

                const contentDiv = Ui.div('lll_div_column');
                panel.appendChild(contentDiv);

                // 设置
                const configDiv = Ui.div({ style: 'padding: 5px 0; gap: 15px; display: flex; justify-content: space-around;' });
                contentDiv.appendChild(configDiv);

                const mapSelectorDiv = Ui.div({ style: 'display: flex; gap: 10px;' });
                mapSelectorDiv.appendChild(Ui.div('lll_label', UiLocale.battleDrop.distribution.mapSelect[language]));
                const mapSelect = Ui.elem('select', 'lll_input_select');
                mapSelectorDiv.appendChild(mapSelect);
                const sortedMapData = Object.entries(BattleData.mapData)
                    .sort((a, b) => a[1].info.order - b[1].info.order);
                for (let [mapHrid, data] of sortedMapData) {
                    if (!Config.battleDrop.ui.customPanelShowSolo && data.info.type == 'solo') continue;
                    const text = Localizer.hridToName(mapHrid);
                    let option = new Option(text, mapHrid);
                    if (defaultMap === mapHrid) option.selected = true;
                    mapSelect.options.add(option);
                }
                mapSelect.onchange = () => { renderChart(); };
                configDiv.appendChild(mapSelectorDiv);

                let runCountInputDiv = Ui.div({ style: 'display: flex; gap: 10px;' });
                configDiv.appendChild(runCountInputDiv);
                runCountInputDiv.appendChild(Ui.div('lll_label', UiLocale.battleDrop.distribution.epochInput[language]));
                const getRunCount = (val, inv = 1) => {
                    const A = maxSliderValue * maxRunCount / (maxRunCount - maxSliderValue);
                    const x = parseInt(val);
                    return Math.round(A * x / (A - x * inv));
                };

                const runCountInput = Ui.slider({
                    initValue: defaultRunCount,
                    minValue: 1,
                    maxValue: maxRunCount,
                    mapFunc: x => getRunCount(x, 1),
                    invMapFunc: x => getRunCount(x, -1),
                    oninput: x => { if (!isMobile) renderChart(x); },
                    onchange: x => { renderChart(x); },
                }, null, { style: { minWidth: '60px' } })
                runCountInputDiv.appendChild(runCountInput);

                // 图表容器
                const canvasDiv = Ui.div();
                contentDiv.appendChild(canvasDiv);
                renderChart();

                // 返回到详细页面
                const customButton = Ui.button(UiLocale.battleDrop.distribution.back[language]);
                customButton.onclick = () => {
                    panel.removeChild(contentDiv);
                    detailsPanel();
                };
                contentDiv.appendChild(Ui.div(null, customButton));
            }
            detailsPanel();

            return panel;
        }
        renderDetailsChart(canvas) {
            let data = { limitL: 1e18, limitR: 0, datasets: [] };
            let limit = 0;
            for (let playerOrder = 0; playerOrder < BattleData.playerList.length; ++playerOrder) {
                const player = BattleData.playerList[playerOrder];
                const dropData = BattleData.getCurrentDropData(player);
                const dist = BattleDropAnalyzer.battleCDF(dropData);
                const income = BattleData.playerLoot[player].price();

                const mu = BattleDropAnalyzer.dropExpectation(dropData);
                const sigma = Math.sqrt(BattleDropAnalyzer.dropVariance(dropData));
                const coeff = Config.battleDrop.ui.detailsChartSigmaCoeff;
                data.limitL = Math.max(Math.min(data.limitL, mu - coeff * sigma), 0);
                data.limitR = Math.max(data.limitR, Math.max(income, mu + coeff * sigma));

                limit = Math.max(limit, dist.limit);
                data.datasets.push({
                    label: player,
                    display: player === CharacterData.playerName,
                    shadow: income,
                    color: [0, 0.2, 0.45, 0.7, 0.85][playerOrder % 5],
                    cdf: dist.cdf,
                });
            }

            const eps = Config.battleDrop.ui.detailsChartCdfEps;
            for (const player of data.datasets) {
                data.limitL = Math.min(data.limitL, Utils.binarySearch(player.cdf, 0, limit, eps));
                data.limitR = Math.max(data.limitR, Utils.binarySearch(player.cdf, 0, limit, 1 - eps));
            }

            ChartRenderer.cdfPdfChart(canvas, data);
        }
        renderCustomChart(canvas, mapHrid, runCount, playerName) {
            const dropData = BattleData.getDropData(mapHrid, runCount, playerName);
            const data = BattleDropAnalyzer.battleCDF(dropData);

            const eps = Config.battleDrop.ui.customChartCdfEps;
            let limitL = Utils.binarySearch(data.cdf, 0, data.limit, eps);
            let limitR = Utils.binarySearch(data.cdf, 0, data.limit, 1 - eps);
            const median = Utils.binarySearch(data.cdf, 0, data.limit, 0.5);
            const mu = BattleDropAnalyzer.dropExpectation(dropData);
            const sigma = Math.sqrt(BattleDropAnalyzer.dropVariance(dropData));
            const coeff = Config.battleDrop.ui.customChartSigmaCoeff;
            limitL = Math.max(Math.min(limitL, mu - coeff * sigma), 0);
            limitR = Math.max(limitR, mu + coeff * sigma);

            ChartRenderer.cdfPdfWithMedianMeanChart(canvas, {
                limitL: limitL,
                limitR: limitR,
                cdf: data.cdf,
                mu: mu,
                sigma: sigma,
                median: median,
            })
        }

        constructSettingsPanel() {
            let panel = Ui.div('lll_div_settingPanelContent');
            const locale = UiLocale.battleDrop.settings;

            let itemSortOrderSelect = Ui.elem('select', 'lll_input_select');
            for (let [key, order] of Object.entries(this.itemSortOrderMap)) {
                let option = new Option(order.desc, key);
                if (key === Config.battleDrop.ui.overviewItemSortOrder) option.selected = true;
                itemSortOrderSelect.options.add(option);
            }
            itemSortOrderSelect.onchange = () => {
                const order = itemSortOrderSelect.options[itemSortOrderSelect.selectedIndex].value;
                Config.battleDrop.ui.overviewItemSortOrder = order;
                ConfigManager.saveConfig();
            };
            panel.appendChild(SettingsUi.settingRow(locale.sortOrder[language], null, itemSortOrderSelect));

            panel.appendChild(SettingsUi.settingRow(
                locale.displayLimit[language], null, Ui.numberInput({
                    initValue: Config.battleDrop.ui.overviewItemMaxNumber,
                    minValue: 1,
                    maxValue: 20,
                    onchange: val => {
                        Config.battleDrop.ui.overviewItemMaxNumber = val;
                        ConfigManager.saveConfig();
                    }
                })
            ));
            panel.appendChild(SettingsUi.settingRow(
                locale.showNormal[language], null, Ui.checkBox({
                    checked: Config.battleDrop.ui.overviewItemMinRarity === -1,
                    onchange: checked => {
                        let val = checked ? -1 : 0;
                        Config.battleDrop.ui.overviewItemMinRarity = val;
                        ConfigManager.saveConfig();
                    }
                })
            ));

            panel.appendChild(Ui.div('lll_separator'));

            const actionSelect = Ui.elem('select', 'lll_input_select');
            const actionList = [
                ['doubleClick', locale.doubleClick[language]],
                ['ctrlClick', locale.ctrlClick[language]],
                ['disable', locale.disable[language]],
            ];
            for (let [type, text] of actionList) {
                let option = new Option(text, type);
                if (Config.battleDrop.ui.overviewInsertToChatAction === type) option.selected = true;
                actionSelect.options.add(option);
            }
            actionSelect.onchange = () => {
                const type = actionSelect.options[actionSelect.selectedIndex].value;
                Config.battleDrop.ui.overviewInsertToChatAction = type;
                ConfigManager.saveConfig();
            };
            panel.appendChild(SettingsUi.settingRow(locale.insertToChatAction[language], null, actionSelect));

            const msgFmtInput = Ui.elem('textarea', 'lll_input');
            msgFmtInput.value = Config.battleDrop.ui.overviewMsgFmt;
            msgFmtInput.onchange = () => {
                Config.battleDrop.ui.overviewMsgFmt = msgFmtInput.value;
                ConfigManager.saveConfig();
            };
            msgFmtInput.style.width = '250px';
            msgFmtInput.style.height = '100px';
            Tooltip.attach(msgFmtInput, Tooltip
                .description(null, locale.msgFmtDesc[language]), 'center');
            panel.appendChild(SettingsUi.settingRow(locale.msgFmt[language], null, msgFmtInput));

            panel.appendChild(Ui.div('lll_separator'));

            panel.appendChild(SettingsUi.settingRow(
                locale.useLegacyUi[language], null, Ui.checkBox({
                    checked: Config.battleDrop.ui.overviewUseLegacyUi,
                    onchange: checked => {
                        Config.battleDrop.ui.overviewUseLegacyUi = checked;
                        ConfigManager.saveConfig();
                    }
                })
            ));
            panel.appendChild(SettingsUi.settingRow(
                locale.showStdDev[language], null, Ui.checkBox({
                    checked: Config.battleDrop.ui.overviewShowStdDev,
                    onchange: checked => {
                        Config.battleDrop.ui.overviewShowStdDev = checked;
                        ConfigManager.saveConfig();
                    }
                })
            ));
            panel.appendChild(SettingsUi.settingRow(
                locale.showFragment[language], null, Ui.checkBox({
                    checked: Config.battleDrop.ui.overviewShowFragment,
                    onchange: checked => {
                        Config.battleDrop.ui.overviewShowFragment = checked;
                        ConfigManager.saveConfig();
                    }
                })
            ));

            return panel;
        }

        constructHistoryPanel() {
            let panel = document.createElement('div');
            panel.style.margin = '20px';

            let contentDiv = document.createElement('div');
            contentDiv.style.minWidth = '600px';
            contentDiv.style.minHeight = '400px';
            panel.appendChild(contentDiv);

            return panel;
        }

        showPopup() {
            this.popup.open();
            const inBattle = BattleData.duration > 0;
            if (inBattle && BattleData.runCount > 1) {
                const eph = `${(3600 * (BattleData.runCount - 1) / BattleData.duration).toFixed(1)} EPH`;
                const duration = Utils.formatDuration(BattleData.duration);
                const title = Ui.elem('span', null, [
                    Ui.elem('span', { style: 'margin-right: 15px; text-shadow: var(--title-text-shadow);' }, eph),
                    Ui.elem('span', { style: 'color:rgb(217, 220, 255)' }, duration),
                ])
                this.popup.addTab(UiLocale.battleDrop.overview.tabLabel[language], () => this.constructOverviewPanel(), title);
                this.popup.addTab(UiLocale.battleDrop.distribution.tabLabel[language], () => this.constructDetailsPanel(), null);
            }
            // this.popup.addTab(UiDict.battleDrop.history.tabLabel[language], () => this.constructHistoryPanel(), null);
            this.popup.addTab(UiLocale.battleDrop.settings.tabLabel[language], () => this.constructSettingsPanel(), null);
        }

        tabSelector = '#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div > div > div.TabsComponent_tabsContainer__3BDUp > div > div > div';
        btnBaseClassName = 'MuiButtonBase-root MuiTab-root MuiTab-textColorPrimary css-1q2h7u5';
        addButton(tabsContainer) {
            let button = Ui.div(this.btnBaseClassName + ' lll_btn_battleDropAnalyzer', UiLocale.battleDrop.btnLabel[language]);
            button.onclick = () => { this.showPopup(); };

            // 将按钮插入到最后一个标签后面
            let lastTab = tabsContainer.children[tabsContainer.children.length - 1];
            tabsContainer.insertBefore(button, lastTab.nextSibling);
        }
        addButtonBeforeEdible() {
            var tabsContainer = document.querySelector(this.tabSelector);
            if (!tabsContainer) return;
            if (tabsContainer.querySelector('.lll_btn_battleDropAnalyzer')) return;
            this.addButton(tabsContainer);
        }
        addButtonAfterEdible() {
            var tabsContainer = document.querySelector(this.tabSelector);
            if (!tabsContainer) return;
            if (tabsContainer.querySelector('.lll_Button_battlePlayerLoot__custom')) return;

            // 修改食用工具前俩按钮的样式
            let foodBtn = tabsContainer.querySelector('.Button_battlePlayerFood__custom');
            foodBtn.className = this.btnBaseClassName + ' lll_Button_battlePlayerFood__custom';
            let lootBtn = tabsContainer.querySelector('.Button_battlePlayerLoot__custom');
            lootBtn.className = this.btnBaseClassName + ' lll_Button_battlePlayerLoot__custom';

            const originalBtn = tabsContainer.querySelector('.lll_btn_battleDropAnalyzer');
            if (originalBtn) tabsContainer.removeChild(originalBtn);
            this.addButton(tabsContainer);
        }
    };

    //#endregion


    //#region TaskAnalyzer

    const TaskData = new class {
        /**
         * @typedef {Object} Task
         * @property {'monster' | 'action'} type
         * @property {string} actionHrid
         * @property {string} monsterHrid
         * @property {number} goalCount
         * @property {number} currentCount
         * @property {{ itemHrid: string, count: number }[]} rewards
         * @property {'in_progress' | 'completed' | 'claimed'} status
         * @property {{ coin: number, cowbell: number, mooPass: number }} rerollCount
         */

        /** @type {Map<number, Task>} */ tasks = new Map();
        /** @type {TaskActionType[]} */ blockedTypes = null;
        /** @type {CharacterInfo} */ charaInfo = null;

        /** @type {Object<string, { type: 'boss' | 'monster', actionHrid: string, mapHrid: string }>} */
        monsterInfo = {};

        constructor() {
            MessageHandler.addListener('init_character_data', msg => { this.onInitCharacterData(msg); });
            MessageHandler.addListener('character_info_updated', msg => { this.onCharacterInfoUpdated(msg); });
            MessageHandler.addListener('quests_updated', msg => { this.onQuestUpdated(msg); });
            MessageHandler.addListener('action_completed', msg => { this.onQuestUpdated(msg); });
            MessageHandler.addListener('discard_random_task', msg => { this.onDiscardTask(msg); });
            MessageHandler.addListener('task_type_blocks_updated', msg => { this.onTaskTypeBlocksUpdated(msg); });
        }

        onInitCharacterData(msg) {
            if (!msg.characterQuests) return;
            msg.characterQuests.forEach(t => { this.updateTask(t); });
            this.charaInfo = msg.characterInfo;
            this.onTaskTypeBlocksUpdated(msg);
            out('任务列表 (TaskData.tasks)', this.tasks);
        }
        onCharacterInfoUpdated(msg) {
            this.charaInfo = msg.characterInfo;
        }
        onQuestUpdated(msg) {
            if (!msg.endCharacterQuests) return;
            msg.endCharacterQuests.forEach(t => { this.updateTask(t); });
            out('【更新】任务列表 (TaskData.tasks)', this.tasks);
        }
        onDiscardTask(msg) {
            this.tasks.delete(msg.discardRandomTaskData.characterQuestId);
        }
        onTaskTypeBlocksUpdated(msg) {
            const blocks = msg.characterTaskTypeBlocks;
            if (!blocks) return;
            this.blockedTypes = [];
            blocks.forEach(t => {
                if (t.randomTaskTypeHrid === '') return;
                this.blockedTypes.push(t.randomTaskTypeHrid.split('/').pop());
            });
            out('屏蔽任务列表 (TaskData.blockedTypes)', this.blockedTypes);
        }

        updateTask(taskRaw) {
            const task = {
                type: taskRaw.type.split('/').pop(),
                actionHrid: taskRaw.actionHrid,
                monsterHrid: taskRaw.monsterHrid,
                goalCount: taskRaw.goalCount,
                currentCount: taskRaw.currentCount,
                rewards: JSON.parse(taskRaw.itemRewardsJSON),
                status: taskRaw.status.split('/').pop(),
                rerollCount: {
                    coin: taskRaw.coinRerollCount,
                    cowbell: taskRaw.cowbellRerollCount,
                    mooPass: taskRaw.mooPassRerollCount,
                },
            };
            if (task.status === 'completed' || task.status === 'claimed') this.tasks.delete(taskRaw.id);
            else this.tasks.set(taskRaw.id, task);
            return task;
        }
    };

    const TaskGenerator = new class {
        /**
         * @typedef {'milking' | 'foraging' | 'woodcutting' | 'cheesesmithing'
         *     | 'crafting' | 'tailoring' | 'cooking' | 'brewing' | 'combat'} TaskActionType
         */
        /**
         * @typedef {Object} TaskInfo
         * @property {TaskActionType} actionType
         * @property {string} actionHrid
         * @property {number} minLevel
         * @property {number} weight
         * @property {number} goalCount
         * @property {{ coin: number, taskToken: number }} rewards
         */

        /** @type {TaskActionType[]} */
        actionTypeList = ['milking', 'foraging', 'woodcutting', 'cheesesmithing',
            'crafting', 'tailoring', 'cooking', 'brewing', 'combat'];

        /** @type {{ [actionType: string]: { [actionHrid: string]: TaskInfo } }} */
        taskInfo = {};

        constructor() {
            MessageHandler.addListener('init_client_data', msg => { this.onInitClientData(msg); });
        }

        gatheringGoalCountTable = {
            1: 90.4,
            10: 219.9,
            20: 274.9,
            35: 474.7,
            50: 774.4,
            65: 1113.3,
            80: 1454.6,
        };
        productionGoalCountTable = {
            'Cheese Boots': 11.666666666666666,
            'Cheese Gauntlets': 11.5,
            'Cheese Sword': 5.333333333333333,
            'Cheese Brush': 9.11111111111111,
            'Cheese Hatchet': 8.833333333333334,
            'Cheese Shears': 9.428571428571429,
            'Cheese Spear': 8.875,
            'Cheese Chisel': 13.75,
            'Cheese Hammer': 14.272727272727273,
            'Cheese Needle': 14,
            'Cheese Pot': 14.714285714285714,
            'Cheese Spatula': 14.875,
            'Cheese Mace': 13.2,
            'Cheese Alembic': 20.333333333333332,
            'Cheese Buckler': 24.6,
            'Cheese Enhancer': 20.88888888888889,
            'Cheese Helmet': 27.571428571428573,
            'Cheese Bulwark': 13.222222222222221,
            'Cheese Plate Legs': 26.5,
            'Cheese Plate Body': 28.4,
            'Verdant Boots': 12.5,
            'Verdant Gauntlets': 13.9,
            'Verdant Sword': 5.454545454545454,
            'Verdant Brush': 8,
            'Verdant Hatchet': 8,
            'Verdant Shears': 8.571428571428571,
            'Verdant Spear': 7.125,
            'Verdant Chisel': 9.9,
            'Verdant Hammer': 9.76923076923077,
            'Verdant Needle': 9.6,
            'Verdant Pot': 9.8,
            'Verdant Spatula': 9.714285714285714,
            'Verdant Mace': 8.571428571428571,
            'Verdant Alembic': 11.5,
            'Verdant Buckler': 13.5,
            'Verdant Enhancer': 12,
            'Verdant Helmet': 16.6,
            'Verdant Bulwark': 7.769230769230769,
            'Verdant Plate Legs': 13.833333333333334,
            'Verdant Plate Body': 13.88888888888889,
            'Azure Boots': 8.363636363636363,
            'Azure Gauntlets': 9,
            'Azure Sword': 3.6923076923076925,
            'Azure Brush': 5.25,
            'Azure Hatchet': 5.111111111111111,
            'Azure Shears': 5,
            'Azure Spear': 4.222222222222222,
            'Azure Chisel': 6.1875,
            'Azure Hammer': 6.333333333333333,
            'Azure Needle': 6.166666666666667,
            'Azure Pot': 5.857142857142857,
            'Azure Spatula': 6.333333333333333,
            'Azure Mace': 5,
            'Azure Alembic': 6.8,
            'Azure Buckler': 7.625,
            'Azure Enhancer': 6.75,
            'Azure Helmet': 9.444444444444445,
            'Azure Bulwark': 4.333333333333333,
            'Azure Plate Legs': 7.166666666666667,
            'Azure Plate Body': 7.2,
            'Burble Boots': 8.555555555555555,
            'Burble Gauntlets': 8.692307692307692,
            'Burble Sword': 3.7142857142857144,
            'Burble Brush': 5.454545454545454,
            'Burble Hatchet': 5.090909090909091,
            'Burble Shears': 5,
            'Burble Spear': 4,
            'Burble Chisel': 5.916666666666667,
            'Burble Hammer': 5.75,
            'Burble Needle': 5.916666666666667,
            'Burble Pot': 5.333333333333333,
            'Burble Spatula': 6.333333333333333,
            'Burble Mace': 4.857142857142857,
            'Burble Alembic': 6.25,
            'Burble Buckler': 8,
            'Burble Enhancer': 6.357142857142857,
            'Burble Helmet': 8.555555555555555,
            'Burble Bulwark': 3.8333333333333335,
            'Burble Plate Legs': 7,
            'Burble Plate Body': 6.769230769230769,
            'Crimson Boots': 7.5,
            'Crimson Gauntlets': 8.5,
            'Crimson Sword': 4,
            'Crimson Brush': 5.545454545454546,
            'Crimson Hatchet': 5.2,
            'Crimson Shears': 5.6,
            'Crimson Spear': 4,
            'Crimson Chisel': 5.833333333333333,
            'Crimson Hammer': 6.166666666666667,
            'Crimson Needle': 5.8,
            'Crimson Pot': 6.3,
            'Crimson Spatula': 6,
            'Crimson Mace': 4.2,
            'Crimson Alembic': 6,
            'Crimson Buckler': 7.714285714285714,
            'Crimson Enhancer': 6.25,
            'Crimson Helmet': 9.5,
            'Crimson Bulwark': 4.125,
            'Crimson Plate Legs': 7,
            'Crimson Plate Body': 7.25,
            'Rainbow Boots': 8,
            'Rainbow Gauntlets': 8.615384615384615,
            'Rainbow Sword': 3.7142857142857144,
            'Rainbow Brush': 4.875,
            'Rainbow Hatchet': 4.714285714285714,
            'Rainbow Shears': 5.1,
            'Rainbow Spear': 3.888888888888889,
            'Rainbow Chisel': 5.470588235294118,
            'Rainbow Hammer': 5.444444444444445,
            'Rainbow Needle': 5.4375,
            'Rainbow Pot': 5.666666666666667,
            'Rainbow Spatula': 5.5625,
            'Rainbow Mace': 4.75,
            'Rainbow Alembic': 6.090909090909091,
            'Rainbow Buckler': 6.888888888888889,
            'Rainbow Enhancer': 5.846153846153846,
            'Rainbow Helmet': 8.357142857142858,
            'Rainbow Bulwark': 3.4285714285714284,
            'Rainbow Plate Legs': 7,
            'Rainbow Plate Body': 6,
            'Holy Boots': 6.833333333333333,
            'Holy Gauntlets': 6.555555555555555,
            'Holy Sword': 3,
            'Holy Brush': 3.909090909090909,
            'Holy Hatchet': 3.909090909090909,
            'Holy Shears': 3.8181818181818183,
            'Holy Spear': 3.4375,
            'Holy Chisel': 4.4,
            'Holy Hammer': 4.333333333333333,
            'Holy Needle': 4.75,
            'Holy Pot': 4.666666666666667,
            'Holy Spatula': 4.454545454545454,
            'Holy Mace': 4.142857142857143,
            'Holy Alembic': 4.666666666666667,
            'Holy Buckler': 5.625,
            'Holy Enhancer': 4.6,
            'Holy Helmet': 7,
            'Holy Bulwark': 3,
            'Holy Plate Legs': 5.230769230769231,
            'Holy Plate Body': 5.142857142857143,
            'Wooden Crossbow': 5.285714285714286,
            'Wooden Water Staff': 5.363636363636363,
            'Wooden Shield': 10.826086956521738,
            'Wooden Nature Staff': 9.37037037037037,
            'Wooden Bow': 10.192307692307692,
            'Wooden Fire Staff': 16.0625,
            'Birch Crossbow': 5.225806451612903,
            'Birch Water Staff': 5.44,
            'Birch Shield': 9.724137931034482,
            'Birch Nature Staff': 7.541666666666667,
            'Birch Bow': 6.333333333333333,
            'Birch Fire Staff': 8.6,
            'Cedar Crossbow': 3.4615384615384617,
            'Cedar Water Staff': 3.2857142857142856,
            'Cedar Shield': 6.153846153846154,
            'Cedar Nature Staff': 4.555555555555555,
            'Cedar Bow': 3.6129032258064515,
            'Cedar Fire Staff': 5.033333333333333,
            'Purpleheart Crossbow': 3.56,
            'Purpleheart Water Staff': 3.793103448275862,
            'Purpleheart Shield': 5.84375,
            'Purpleheart Nature Staff': 4,
            'Purpleheart Bow': 3.6774193548387095,
            'Purpleheart Fire Staff': 5.0476190476190474,
            'Ginkgo Crossbow': 3.5454545454545454,
            'Ginkgo Water Staff': 3.607142857142857,
            'Ginkgo Shield': 6.473684210526316,
            'Ginkgo Nature Staff': 4.393939393939394,
            'Ginkgo Bow': 3.6206896551724137,
            'Ginkgo Fire Staff': 5.032258064516129,
            'Redwood Crossbow': 3.3076923076923075,
            'Redwood Water Staff': 3.357142857142857,
            'Redwood Shield': 5.571428571428571,
            'Redwood Nature Staff': 4.071428571428571,
            'Redwood Bow': 3.44,
            'Redwood Fire Staff': 4.633333333333334,
            'Arcane Crossbow': 2.64,
            'Arcane Water Staff': 2.8529411764705883,
            'Arcane Shield': 4.8,
            'Arcane Nature Staff': 3.5454545454545454,
            'Arcane Bow': 2.7037037037037037,
            'Arcane Fire Staff': 3.793103448275862,
            'Cotton Boots': 12.083333333333334,
            'Rough Boots': 12.28,
            'Cotton Gloves': 21,
            'Rough Bracers': 20.807692307692307,
            'Cotton Hat': 28.8125,
            'Rough Hood': 28.958333333333332,
            'Cotton Robe Bottoms': 30.96153846153846,
            'Rough Chaps': 29.65,
            'Cotton Robe Top': 35.7,
            'Rough Tunic': 37.5,
            'Linen Boots': 11.333333333333334,
            'Reptile Boots': 10.5,
            'Linen Gloves': 13.583333333333334,
            'Reptile Bracers': 13.454545454545455,
            'Linen Hat': 13.307692307692308,
            'Reptile Hood': 13.571428571428571,
            'Linen Robe Bottoms': 12.842105263157896,
            'Reptile Chaps': 11.833333333333334,
            'Linen Robe Top': 12.366666666666667,
            'Reptile Tunic': 12.238095238095237,
            'Bamboo Boots': 8.928571428571429,
            'Gobo Boots': 9.785714285714286,
            'Bamboo Gloves': 10.80952380952381,
            'Gobo Bracers': 11.181818181818182,
            'Bamboo Hat': 11,
            'Gobo Hood': 10.666666666666666,
            'Bamboo Robe Bottoms': 8.571428571428571,
            'Gobo Chaps': 8.68,
            'Bamboo Robe Top': 8.863636363636363,
            'Gobo Tunic': 8.772727272727273,
            'Beast Boots': 8.172413793103448,
            'Silk Boots': 8.08695652173913,
            'Beast Bracers': 10.181818181818182,
            'Silk Gloves': 10.375,
            'Beast Hood': 9.318181818181818,
            'Silk Hat': 9.137931034482758,
            'Beast Chaps': 7.3,
            'Silk Robe Bottoms': 7.583333333333333,
            'Beast Tunic': 8.047619047619047,
            'Silk Robe Top': 7.75,
            'Radiant Boots': 7.9523809523809526,
            'Umbral Boots': 7.7272727272727275,
            'Radiant Gloves': 9.470588235294118,
            'Umbral Bracers': 9.857142857142858,
            'Radiant Hat': 8.846153846153847,
            'Umbral Hood': 8.8,
            'Radiant Robe Bottoms': 7.25,
            'Umbral Chaps': 7.375,
            'Radiant Robe Top': 7.208333333333333,
            'Umbral Tunic': 7.416666666666667,
        };
        brewingGoalCountTable = {
            'Milking Tea': 37.94444444444444,
            'Stamina Coffee': 38.2962962962963,
            'Foraging Tea': 84.14516129032258,
            'Intelligence Coffee': 83.13698630136986,
            'Gathering Tea': 115.75342465753425,
            'Woodcutting Tea': 132.7058823529412,
            'Cooking Tea': 94.79166666666667,
            'Defense Coffee': 94.53225806451613,
            'Brewing Tea': 139.18867924528303,
            'Attack Coffee': 152.27586206896552,
            'Gourmet Tea': 163.0793650793651,
            'Alchemy Tea': 183.74603174603175,
            'Enhancing Tea': 183.14492753623188,
            'Cheesesmithing Tea': 110.80701754385964,
            'Power Coffee': 115.14285714285714,
            'Crafting Tea': 160.8985507246377,
            'Ranged Coffee': 160.38983050847457,
            'Wisdom Coffee': 171.4047619047619,
            'Wisdom Tea': 167.62962962962962,
            'Magic Coffee': 217.41860465116278,
            'Tailoring Tea': 218.01960784313727,
            'Super Milking Tea': 69,
            'Super Stamina Coffee': 57.55555555555556,
            'Super Foraging Tea': 78,
            'Super Intelligence Coffee': 80.33333333333333,
            'Lucky Coffee': 302.96078431372547,
            'Processing Tea': 292.578125,
            'Super Woodcutting Tea': 97.14285714285714,
            'Super Cooking Tea': 102.2,
            'Super Defense Coffee': 94.4,
            'Super Attack Coffee': 140,
            'Super Brewing Tea': 120.11111111111111,
            'Ultra Milking Tea': 69.625,
            'Ultra Stamina Coffee': 66.33333333333333,
            'Efficiency Tea': 481.2857142857143,
            'Swiftness Coffee': 490.24528301886795,
            'Super Alchemy Tea': 159.5,
            'Super Enhancing Tea': 168.25,
            'Ultra Foraging Tea': 82.5,
            'Ultra Intelligence Coffee': 88.16666666666667,
            'Channeling Coffee': 645.4,
            'Super Cheesesmithing Tea': 144.4,
            'Super Power Coffee': 150,
            'Ultra Woodcutting Tea': 113.85714285714286,
            'Artisan Tea': 538.6,
            'Super Crafting Tea': 194.5,
            'Super Ranged Coffee': 185.5,
            'Ultra Cooking Tea': 113.88888888888889,
            'Ultra Defense Coffee': 107.75,
            'Catalytic Tea': 670.3770491803278,
            'Critical Coffee': 679.1,
            'Super Magic Coffee': 207.42857142857142,
            'Super Tailoring Tea': 221.28571428571428,
            'Ultra Attack Coffee': 146.66666666666666,
            'Ultra Brewing Tea': 153.16666666666666,
            'Blessed Tea': 841.0185185185185,
            'Ultra Alchemy Tea': 180.375,
            'Ultra Enhancing Tea': 202.83333333333334,
            'Ultra Cheesesmithing Tea': 225.4,
            'Ultra Power Coffee': 203.5,
            'Ultra Crafting Tea': 262.45454545454544,
            'Ultra Ranged Coffee': 252.125,
            'Ultra Magic Coffee': 328.5,
            'Ultra Tailoring Tea': 356.3333333333333,
        };

        matchFilter(name, filter) {
            let i = 0;
            for (; i < filter.length; ++i) {
                if (typeof filter[i] === 'string' || filter[i](name)) break;
            }
            return i;
        }
        getGatheringTaskInfo(detail) {
            const level = detail.levelRequirement.level;
            return {
                weight: 1,
                goalCount: this.gatheringGoalCountTable[level],
                taskToken: 0.1 * level + 2,
                coin: Math.pow(level + 20, 2.4),
            };
        }
        getCheesesmithingTaskInfo(detail) {
            const name = detail.name;
            const filters = [
                name => name.endsWith('Cheese'),
                name => name.includes('Cheese') || name.includes('Verdant') || name.includes('Azure') || name.includes('Burble')
                    || name.includes('Crimson') || name.includes('Rainbow') || name.includes('Holy'),
                'otherwise',
            ];
            const rarity = this.matchFilter(name, filters);
            const level = detail.levelRequirement.level;
            if (rarity === 0) return this.getGatheringTaskInfo(detail);
            if (rarity === 2) return {
                weight: 1 / 42,
                goalCount: 1,
                taskToken: 0.2 * level + 4,
                coin: Math.pow(1.34 * level + 26.5, 2.4),
            };
            return {
                weight: 0.1,
                goalCount: this.productionGoalCountTable[name],
                taskToken: 0.1 * level + 2,
                coin: Math.pow(level + 20, 2.4),
            };
        }
        getCraftingTaskInfo(detail) {
            const name = detail.name;
            if (name.includes('Task Badge') || name.includes('Key')) return null;
            const filters = [
                name => name.includes('Lumber'),
                name => name.includes('Wooden') || name.includes('Birch') || name.includes('Cedar') || name.includes('Purpleheart')
                    || name.includes('Ginkgo') || name.includes('Redwood') || name.includes('Arcane'),
                'otherwise',
            ];
            const rarity = this.matchFilter(name, filters);
            const level = detail.levelRequirement.level;
            if (rarity === 0) return this.getGatheringTaskInfo(detail);
            if (rarity === 2) return {
                weight: 0.07,
                goalCount: 1,
                taskToken: 0.2 * level + 4,
                coin: Math.pow(1.34 * level + 26.5, 2.4),
            }
            return {
                weight: 1 / 3,
                goalCount: this.productionGoalCountTable[name],
                taskToken: 0.1 * level + 2,
                coin: Math.pow(level + 20, 2.4),
            };
        }
        getTailoringTaskInfo(detail) {
            const name = detail.name;
            const filters = [
                name => name.includes('Leather') || name.includes('Fabric'),
                name => name.includes('Cotton') || name.includes('Linen') || name.includes('Bamboo') || name.includes('Silk') || name.includes('Radiant')
                    || name.includes('Rough') || name.includes('Reptile') || name.includes('Gobo') || name.includes('Beast') || name.includes('Umbral'),
                'otherwise',
            ];
            const rarity = this.matchFilter(name, filters);
            const level = detail.levelRequirement.level;
            if (rarity === 0) return {
                weight: 1,
                goalCount: {
                    1: 96.2,
                    15: 256.1,
                    35: 490.4,
                    55: 852.5,
                    75: 1447.0,
                }[level],
                taskToken: 0.1 * level + 2,
                coin: Math.pow(level + 20, 2.4),
            }
            if (rarity === 2) return {
                weight: 5 / 58,
                goalCount: 1,
                taskToken: 0.2 * level + 4,
                coin: Math.pow(1.34 * level + 26.5, 2.4),
            }
            return {
                weight: 0.4,
                goalCount: this.productionGoalCountTable[name],
                taskToken: 0.1 * level + 2,
                coin: Math.pow(level + 20, 2.4),
            };
        }
        getCookingTaskInfo(detail) {
            const level = detail.levelRequirement.level;
            return {
                weight: 1,
                goalCount: {
                    1: 76.2,
                    10: 188.2,
                    20: 225.4,
                    35: 392.1,
                    50: 649.6,
                    65: 1110.3,
                    80: 1526.0,
                }[level],
                taskToken: 0.1 * level + 2,
                coin: Math.pow(level + 20, 2.4),
            };
        }
        getBrewingTaskInfo(detail) {
            const name = detail.name;
            const filters = [
                name => !name.includes('Super') && !name.includes('Ultra'),
                'otherwise'
            ];
            const rarity = this.matchFilter(name, filters);
            const level = detail.levelRequirement.level;
            if (rarity === 0) return {
                weight: 1,
                goalCount: this.brewingGoalCountTable[name],
                taskToken: 0.1 * level + 2,
                coin: Math.pow(level + 20, 2.4),
            };
            return {
                weight: 0.1,
                goalCount: this.brewingGoalCountTable[name],
                taskToken: 0.2 * level + 4,
                coin: Math.pow(1.34 * level + 26.5, 2.4),
            };
        }
        getCombatTaskInfo(detail) {
            const mapData = BattleData.mapData[detail.hrid];
            if (!mapData) return null;
            if (mapData.info.eliteTier >= 1) return null;
            if (mapData.info.type === 'group') {
                const id = Math.min(mapData.info.mapIndex, 6) - 2; // 0,1,2,3,4
                if (id < 0) return null;
                const hrid = Object.keys(mapData.bossDrops)[0];
                const monsterDetail = ClientData.get().combatMonsterDetailMap[hrid];
                const level = monsterDetail.combatDetails.combatLevel;
                return {
                    weight: 1 / 60,
                    monsterLevel: level,
                    goalCount: [5, 6.3, 8.6, 9.4, 10][id],
                    taskToken: [10, 12.5, 17, 18.5, 20][id],
                    coin: [25653, 60834, 138242, 170250, 216800][id],
                };
            }
            const hrid = Object.keys(mapData.monsterDrops)[0];
            const monsterDetail = ClientData.get().combatMonsterDetailMap[hrid];
            const level = monsterDetail.combatDetails.combatLevel;
            return {
                weight: 1,
                monsterLevel: level,
                goalCount: 0.5 * level + 50,
                taskToken: 0.036 * level + 2.78,
                coin: Math.pow(0.4 * level + 20, 2.4),
            };
        }
        /**
         * @param {string} actionHrid
         * @returns {TaskInfo?}
         */
        getTaskInfo(actionType, actionHrid) {
            const detail = ClientData.get().actionDetailMap[actionHrid];
            const formatTaskInfo = info => {
                // dbg(detail.name, info);
                if (!info) return null;
                let level;
                if (actionType === 'combat') {
                    level = Math.min(Math.ceil(Math.pow(info.monsterLevel, 0.862)), 90);
                } else level = detail.levelRequirement.level;
                const /** @type {TaskInfo} */ ret = {
                    actionType: actionType,
                    actionHrid: detail.hrid,
                    minLevel: level,
                    weight: info.weight,
                    goalCount: info.goalCount,
                    rewards: {
                        taskToken: info.taskToken,
                        coin: info.coin,
                    },
                };
                return ret;
            };
            switch (actionType) {
                case 'milking': return formatTaskInfo(this.getGatheringTaskInfo(detail));
                case 'foraging': return formatTaskInfo(this.getGatheringTaskInfo(detail));
                case 'woodcutting': return formatTaskInfo(this.getGatheringTaskInfo(detail));
                case 'cheesesmithing': return formatTaskInfo(this.getCheesesmithingTaskInfo(detail));
                case 'crafting': return formatTaskInfo(this.getCraftingTaskInfo(detail));
                case 'tailoring': return formatTaskInfo(this.getTailoringTaskInfo(detail));
                case 'cooking': return formatTaskInfo(this.getCookingTaskInfo(detail));
                case 'brewing': return formatTaskInfo(this.getBrewingTaskInfo(detail));
                case 'combat': return formatTaskInfo(this.getCombatTaskInfo(detail));
            }
        }
        onInitClientData(client) {
            for (let hrid in client.actionDetailMap) {
                const /** @type {any} */ actionType = hrid.split('/')[2];
                const info = this.getTaskInfo(actionType, hrid);
                if (!info) continue;
                (this.taskInfo[actionType] ??= {})[hrid] = info;
            }
            out('任务生成信息 (TaskGenerator.taskInfo)', this.taskInfo);
        }

        /**
         * @param {TaskActionType} actionType
         * @param {number} level
         * @returns {number}
         */
        getActionWeight(actionType, level) {
            if (actionType !== 'combat') return level + 50;
            return 3 * level + 300;
        }

        /**
         * @param {{ [actionType: string]: number }} skillLevel
         * @param {TaskActionType[]} blockList
         * @returns {TaskInfo[]}
         */
        getTaskGenerationInfo(skillLevel, blockList) {
            const actionTypeList = this.actionTypeList.filter(name => !blockList.some(blockName => name === blockName));
            const actionWeightTotal = actionTypeList.reduce((pre, cur) => pre + this.getActionWeight(cur, skillLevel[cur]), 0);
            const actionWeight = {};
            actionTypeList.forEach(name => { actionWeight[name] = this.getActionWeight(name, skillLevel[name]) / actionWeightTotal });
            let ret = [];
            for (let [skill, weight] of Object.entries(actionWeight)) {
                const level = skillLevel[skill];
                const choices = Object.entries(this.taskInfo[skill]).filter(([_, info]) => level >= info.minLevel);
                const totalWeight = choices.reduce((pre, cur) => pre + cur[1].weight, 0);
                choices.forEach(([_, info]) => {
                    const w = weight * info.weight / totalWeight;
                    ret.push({ ...info, weight: w });
                });
            }
            return ret;
        }
    }

    const TaskAnalyzer = new class {
        computeOverflowDate() {
            const charaInfo = TaskData.charaInfo;
            const currentTaskCount = TaskData.tasks.size;
            const taskCooldown = charaInfo.taskCooldownHours * 3.6e6;
            const taskCount = charaInfo.unreadTaskCount + currentTaskCount;
            const availTaskCount = charaInfo.taskSlotCap - taskCount;
            const lastTaskDate = new Date(charaInfo.lastTaskTimestamp).getTime();
            const overflowDate = new Date(lastTaskDate + (availTaskCount + 1) * taskCooldown);
            return overflowDate;
        }

        /**
         * 需要打多少波怪完成任务
         * @param {Task} task
         * @returns {{ total: number, rest: number }}
         */
        computeCombatTaskWaves(task) {
            const monsterHrid = task.monsterHrid;
            const info = BattleData.monsterInfo[task.monsterHrid];
            const spawns = BattleData.mapData[info.mapHrid].spawnInfo.expectedSpawns;
            const bossWave = BattleData.mapData[info.mapHrid].spawnInfo.bossWave;
            const compute = (count) => {
                if (spawns[monsterHrid]) {
                    const normalCount = Math.ceil(count / spawns[monsterHrid]);
                    const bossCount = bossWave ? Math.floor((normalCount - 1) / (bossWave - 1)) : 0;
                    return normalCount + bossCount;
                }
                return count * bossWave;
            }
            return {
                total: compute(task.goalCount),
                rest: compute(task.goalCount - task.currentCount),
            }
        }

        /**
         * 每个图分别需要打多少波怪完成所有任务
         * @param {Map<number, Task>} tasks
         * @returns {Object<string, { total: number, rest: number }>} total: 一共多少波; rest: 还剩多少波
         */
        computeAllCombatTaskWaves(tasks = TaskData.tasks) {
            /** @type {Object<string, Object<string,{ total: number, rest: number }>>} */
            const grouped = {};
            tasks.forEach(task => {
                if (task.type != 'monster') return;
                const info = BattleData.monsterInfo[task.monsterHrid];
                const mapHrid = info.mapHrid;
                const current = this.computeCombatTaskWaves(task);
                (grouped[mapHrid] ??= {})[task.monsterHrid] ??= { total: 0, rest: 0 };
                grouped[mapHrid][task.monsterHrid].total += current.total;
                grouped[mapHrid][task.monsterHrid].rest += current.rest;
            });

            /** @type {Object<string, { total: number, rest: number }>} */
            const ret = {};
            for (const key in grouped) {
                ret[key] = Object.values(grouped[key]).reduce((pre, cur) => {
                    return {
                        total: Math.max(pre.total, cur.total),
                        rest: Math.max(pre.rest, cur.rest),
                    };
                }, { total: 0, rest: 0 });
            }
            return ret;
        }

        /**
         * @param {Task} task
         * @returns {{ coin: number, cowbell: number }} 下一次使用牛铃/钱刷新的价格
         */
        getTaskRerollCost(task) {
            const count = task.rerollCount;
            const getCost = (x) => {
                if (x >= 5) return 32;
                return Math.pow(x, 2);
            };
            return {
                coin: getCost(count.coin) * 10000,
                cowbell: getCost(count.cowbell),
            };
        }

        /**
         * @param {{ [actionType: string]: number }} skillLevel
         * @param {TaskActionType[]} blockList
         */
        getTaskExpectedRewards(skillLevel, blockList) {
            const ret = { coin: 0, taskToken: 0, price: 0 };
            const taskInfo = TaskGenerator.getTaskGenerationInfo(skillLevel, blockList);
            for (let info of taskInfo) {
                ret.coin += info.weight * info.rewards.coin;
                ret.taskToken += info.weight * info.rewards.taskToken;
            }
            const taskTokenPrice = Market.getPriceByName("Task Token") + Market.getPriceByName("Purple's Gift") / 50;
            ret.price = ret.coin + ret.taskToken * taskTokenPrice;
            return ret;
        }
    };

    const TaskAnalyzerUi = new class {
        constructor() {
            setInterval(() => { this.addButton(); }, 500);
        }

        constructTooltip() {
            const locale = UiLocale.taskAnalyzer.tooltip;

            const overflowDate = TaskAnalyzer.computeOverflowDate();
            const mapRunCount = [];
            Object.entries(TaskAnalyzer.computeAllCombatTaskWaves()).forEach(([hrid, cnt]) => {
                mapRunCount.push([BattleData.mapData[hrid].info.mapIndex, cnt]);
            });
            mapRunCount.sort((a, b) => a[0] - b[0]);
            const rewards = TaskAnalyzer.getTaskExpectedRewards(CharacterData.skillLevel, TaskData.blockedTypes);

            const descDiv = Ui.div(null, [
                Ui.div(null, `${locale.overflowTime[language]}: ${Utils.formatDate(overflowDate)}`),
                Ui.div(null, locale.expectedRewards[language](Utils.formatPrice(rewards.price), Utils.formatPrice(rewards.coin), rewards.taskToken.toFixed(2))),
                Ui.div(null, `${locale.expectedEpochs[language]}:`)
            ]);
            mapRunCount.forEach(([id, cnt]) => {
                descDiv.appendChild(Ui.div(null, locale.mapRunCount[language](id, cnt.total, cnt.rest)));
            });
            return descDiv;
        }

        addButton() {
            var tabsContainer = document.querySelector("#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(2) > div > div.TasksPanel_tabsComponentContainer__3Q2EX > div > div.TabsComponent_tabsContainer__3BDUp > div > div > div");
            var referenceTab = tabsContainer ? tabsContainer.children[1] : null;
            if (!tabsContainer || !referenceTab) return;
            if (tabsContainer.querySelector('.lll_btn_taskAnalyzer')) return;
            const baseClassName = referenceTab.className;

            let button = document.createElement('div');
            button.className = baseClassName + ' lll_btn_taskAnalyzer';
            button.setAttribute('script_translatedfrom', 'New Action');
            button.textContent = UiLocale.taskAnalyzer.btnLabel[language];
            button.onclick = () => { dbg("咕咕咕"); };

            Tooltip.attach(button, Tooltip.description(UiLocale.taskAnalyzer.tooltip.tabLabel[language], this.constructTooltip()));

            // 将按钮插入到最后一个标签后面
            let lastTab = tabsContainer.children[tabsContainer.children.length - 1];
            tabsContainer.insertBefore(button, lastTab.nextSibling);
        }
    };

    //#endregion


    //#region ChestDropAnalyzer

    const ChestDropAnalyzer = new class {
        /**
         * @param {string} chestHrid
         * @param {PriceType} priceType
         * @returns {ItemDropData[]}
         */
        getChestDropData(chestHrid, priceType = 'bid') {
            const items = [];
            const chest = Market.chestDropData[chestHrid];
            if (!chest) return null;
            chest.items.forEach(item => {
                items.push({
                    hrid: item.hrid,
                    dropRate: item.dropRate,
                    minCount: item.minCount,
                    maxCount: item.maxCount,
                    price: Market.getPriceByHrid(item.hrid, priceType),
                })
            });
            return items;
        }

        dropExpectation(dropData) {
            return dropData.reduce((pre, cur) => pre + DropAnalyzer.itemCountExpt(cur) * cur.price, 0);
        }
        dropVariance(dropData) {
            return dropData.reduce((pre, cur) => pre + DropAnalyzer.itemCountVar(cur) * cur.price * cur.price, 0);
        }

        chestCF(dropData, count) {
            if (Config.battleDrop.verbose) out("DropData:", count, dropData);
            const cf = CharaFunc.mulList(dropData.map(drop => DropAnalyzer.charaFunc(drop)));
            return CharaFunc.pow(cf, count);
        }

        /**
         * @param {CountedItem} openedItem
         * @param {PriceType} priceType
         * @returns {{ limit: number, cdf: CDF }}
         */
        chestCDF(openedItem, priceType = 'bid') {
            const start = new Date().getTime();
            const samples = Config.charaFunc.samples;
            const dropData = this.getChestDropData(openedItem.hrid, priceType);
            const minLimit = dropData.reduce((pre, cur) => Math.max(pre, cur.price * cur.maxCount), 0);
            const perChestLimit = this.dropExpectation(dropData) * 3;
            const cf = this.chestCF(dropData, openedItem.count);
            const limit = minLimit + perChestLimit * openedItem.count;
            let cdf = CharaFunc.getCDF(cf, samples, limit);

            const end = new Date().getTime();
            if (Config.chestDrop.verbose) out(`${end - start}ms`);
            return cdf;
        }

        /**
         * @param {CountedItem} openedItem
         * @returns {(item: CountedItem) => number} rarity of item
         */
        getRarity(openedItem) {
            const chest = this.getChestDropData(openedItem.hrid);
            if (!chest) return _ => 0;
            const baseRate = {}, baseCount = {};
            chest.forEach(item => {
                if (item.dropRate > (baseRate[item.hrid] ?? 0)) {
                    baseRate[item.hrid] = item.dropRate;
                    baseCount[item.hrid] = item.maxCount * openedItem.count;
                }
            });
            return item => {
                const rate = baseRate[item.hrid], count = baseCount[item.hrid];
                const price = Market.getPriceByHrid(item.hrid);
                const bonus = item.count > count * 2 ? 0.5 : 0;
                if (rate <= 0.001) return 6 + bonus;
                if (rate <= 0.01) return 5 + bonus;
                if (rate <= 0.02) return 4 + bonus;
                if (rate <= 0.05) return 3 + bonus;
                if (rate <= 0.15) return 2 + bonus;
                if (rate <= 0.5) return 1 + bonus;
                return 0 + bonus;
            };
        }

        /**
         * @param {CountedItem} openedItem
         * @param {number} income
         * @param {PriceType} priceType
         */
        analyze(openedItem, income, priceType = 'bid') {
            const dropData = this.getChestDropData(openedItem.hrid, priceType);
            const incomeExpectation = this.dropExpectation(dropData) * openedItem.count;
            const incomeVariance = this.dropVariance(dropData) * openedItem.count;
            const cdf = this.chestCDF(openedItem, priceType);
            const luck = cdf.cdf(income);
            let profit = income;
            const chestCost = Market.chestCosts[openedItem.hrid];
            if (chestCost) {
                const { keyAsk, keyBid, entryAsk, entryBid } = chestCost;
                const cost = priceType === 'bid' ? keyAsk + entryAsk : keyBid + entryBid;
                profit -= cost * openedItem.count;
            }

            return {
                /** @type {{ limit: number, cdf: CDF }} */ cdf: cdf,
                /** @type {number} */ income: income,
                /** @type {number} */ incomeExpectation: incomeExpectation,
                /** @type {number} */ incomeVariance: incomeVariance,
                /** @type {number} */ profit: profit,
                /** @type {number} */ luck: luck,
            }
        }
    }

    const ChestDropAnalyzerUi = new class {
        popup = new TabbedPopup();
        openChestPopup = new PlainPopup();

        /** @type {Object<string, { desc: string, weight: (item: CountedItem, rarity: number) => number }>} */
        itemSortOrderMap = {
            'default': {
                desc: UiLocale.chestDrop.sortOrder.default[language],
                weight: null,
            },
            'rarity': {
                desc: UiLocale.chestDrop.sortOrder.rarity[language],
                weight: (item, rarity) => rarity * 1e15 + Market.getPriceByHrid(item.hrid),
            },
            'totalBid': {
                desc: UiLocale.chestDrop.sortOrder.totalBid[language],
                weight: (item, rarity) => Market.getPriceByHrid(item.hrid) * item.count,
            },
            'unitBid': {
                desc: UiLocale.chestDrop.sortOrder.unitBid[language],
                weight: (item, rarity) => Market.getPriceByHrid(item.hrid),
            },
        }

        constructor() {
            MessageHandler.addListener('loot_opened', msg => { this.onLootOpened(msg); });

            document.addEventListener('copy', (e) => {
                // @ts-ignore
                if (!document.getElementById('lll_chestOpenPopup')?.contains(e.target)) return;
                if (!e.clipboardData) return;
                let content = window?.getSelection().toString();
                content = content.replaceAll(/└|├|\x20/g, '').replaceAll('\t', '').replaceAll('\n', '    ').replaceAll(':', ': ');
                e.clipboardData.setData('text/plain', content.trim());
                e.preventDefault();
            });
        }


        /**
         * @param {CountedItem} openedItem
         * @param {CountedItem[]} gainedItems
         */
        constructDetailsPanel(openedItem, gainedItems) {
            let panel = document.createElement('div');
            panel.style.padding = '20px';

            const detailsPanel = () => {
                const contentDiv = document.createElement('div');
                panel.appendChild(contentDiv);

                // 创建图表
                const canvas = ChartRenderer.getCanvas();
                contentDiv.appendChild(canvas.wrapper);
                this.renderDetailsChart(canvas.canvas, openedItem, gainedItems);

                // 添加自定义按钮
                const customButton = Ui.button(UiLocale.chestDrop.distribution.allChest[language]);
                customButton.onclick = () => {
                    panel.removeChild(contentDiv);
                    customPanel();
                };
                contentDiv.appendChild(Ui.div(null, customButton));
            }
            const customPanel = () => {
                const defaultChestHrid = openedItem.hrid;
                const defaultChestCount = openedItem.count;
                const maxCount = Config.chestDrop.ui.customPanelMaxCount;
                const maxSliderValue = Config.chestDrop.ui.customPanelMaxSliderValue;
                let count = defaultChestCount;
                const renderChart = (value = null) => {
                    const itemHrid = mapSelect.options[mapSelect.selectedIndex].value;
                    if (value !== null) count = value;
                    while (canvasDiv.lastChild) canvasDiv.removeChild(canvasDiv.lastChild);
                    const canvas = ChartRenderer.getCanvas();
                    canvasDiv.appendChild(canvas.wrapper);
                    this.renderCustomChart(canvas.canvas, { hrid: itemHrid, count: count });
                }

                const contentDiv = Ui.div('lll_div_column');
                panel.appendChild(contentDiv);

                // 设置
                const configDiv = Ui.div({ style: 'padding: 5px 0; gap: 15px; display: flex; justify-content: space-around;' });
                contentDiv.appendChild(configDiv);

                const mapSelectorDiv = Ui.div({ style: 'display: flex; gap: 10px;' });
                mapSelectorDiv.appendChild(Ui.div('lll_label', UiLocale.chestDrop.distribution.chestSelect[language]));
                const mapSelect = Ui.elem('select', 'lll_input_select');
                mapSelectorDiv.appendChild(mapSelect);
                const sortedChestData = Object.entries(Market.chestDropData)
                    .sort((a, b) => a[1].order - b[1].order);
                for (let [hrid, data] of sortedChestData) {
                    const text = Localizer.hridToName(hrid);
                    let option = new Option(text, hrid);
                    if (defaultChestHrid === hrid) option.selected = true;
                    mapSelect.options.add(option);
                }
                mapSelect.onchange = () => { renderChart(); };
                configDiv.appendChild(mapSelectorDiv);

                let runCountInputDiv = Ui.div({ style: 'display: flex; gap: 10px;' });
                configDiv.appendChild(runCountInputDiv);
                runCountInputDiv.appendChild(Ui.div('lll_label', UiLocale.chestDrop.distribution.cntInput[language]));
                const getRunCount = (val, inv = 1) => {
                    const A = maxSliderValue * maxCount / (maxCount - maxSliderValue);
                    const x = parseInt(val);
                    return Math.round(A * x / (A - x * inv));
                };

                const runCountInput = Ui.slider({
                    initValue: defaultChestCount,
                    minValue: 1,
                    maxValue: maxCount,
                    mapFunc: x => getRunCount(x, 1),
                    invMapFunc: x => getRunCount(x, -1),
                    oninput: x => { if (!isMobile) renderChart(x); },
                    onchange: x => { renderChart(x); },
                }, null, { style: { minWidth: '60px' } })
                runCountInputDiv.appendChild(runCountInput);

                // 图表容器
                const canvasDiv = Ui.div();
                contentDiv.appendChild(canvasDiv);
                renderChart();

                // 返回到详细页面
                const customButton = Ui.button(UiLocale.chestDrop.distribution.return[language]);
                customButton.onclick = () => {
                    panel.removeChild(contentDiv);
                    detailsPanel();
                };
                contentDiv.appendChild(Ui.div(null, customButton));
            }
            detailsPanel();

            return panel;
        }
        /**
         * @param {HTMLCanvasElement} canvas
         * @param {CountedItem} openedItem
         * @param {CountedItem[]} gainedItems
         */
        renderDetailsChart(canvas, openedItem, gainedItems) {
            const eps = Config.chestDrop.ui.detailsChartCdfEps;
            const coeff = Config.chestDrop.ui.detailsChartSigmaCoeff;

            const income = Market.getTotalPrice(gainedItems);
            const stat = ChestDropAnalyzer.analyze(openedItem, income);
            const dist = stat.cdf;

            const mu = stat.incomeExpectation;
            const sigma = Math.sqrt(stat.incomeVariance);
            const limit = dist.limit;
            const data = {
                limitL: Math.max(mu - coeff * sigma, 0),
                limitR: Math.max(income, mu + coeff * sigma),
                datasets: [{
                    label: Localizer.hridToName(openedItem.hrid),
                    display: true,
                    shadow: income,
                    color: 0,
                    cdf: dist.cdf,
                }],
            };

            for (const chest of data.datasets) {
                data.limitL = Math.min(data.limitL, Utils.binarySearch(chest.cdf, 0, limit, eps));
                data.limitR = Math.max(data.limitR, Utils.binarySearch(chest.cdf, 0, limit, 1 - eps));
            }

            ChartRenderer.cdfPdfChart(canvas, data);
        }
        /**
         * @param {HTMLCanvasElement} canvas
         * @param {CountedItem} openedItem
         */
        renderCustomChart(canvas, openedItem) {
            const eps = Config.chestDrop.ui.customChartCdfEps;
            const coeff = Config.chestDrop.ui.customChartSigmaCoeff;

            const stat = ChestDropAnalyzer.analyze(openedItem, 0);
            const dist = stat.cdf;

            let limitL = Utils.binarySearch(dist.cdf, 0, dist.limit, eps);
            let limitR = Utils.binarySearch(dist.cdf, 0, dist.limit, 1 - eps);
            const median = Utils.binarySearch(dist.cdf, 0, dist.limit, 0.5);
            const mu = stat.incomeExpectation;
            const sigma = Math.sqrt(stat.incomeVariance);
            limitL = Math.max(Math.min(limitL, mu - coeff * sigma), 0);
            limitR = Math.max(limitR, mu + coeff * sigma);

            ChartRenderer.cdfPdfWithMedianMeanChart(canvas, {
                limitL: limitL,
                limitR: limitR,
                cdf: dist.cdf,
                mu: mu,
                sigma: sigma,
                median: median,
            })
        }


        constructSettingsPanel() {
            let panel = Ui.div('lll_div_settingPanelContent');
            const locale = UiLocale.chestDrop.settings;

            panel.appendChild(SettingsUi.settingRow(
                locale.useOriPopup[language], null,
                Ui.checkBox({
                    checked: Config.chestDrop.ui.useOriginalPopup,
                    onchange: checked => {
                        Config.chestDrop.ui.useOriginalPopup = checked;
                        ConfigManager.saveConfig();
                    }
                })
            ));

            return panel;
        }

        /**
         * @param {CountedItem} openedItem
         * @param {CountedItem[]} gainedItems
         */
        showPopup(openedItem, gainedItems) {
            this.popup.open();
            // this.popup.addTab('概览', () => this.constructOverviewPanel(), null);
            this.popup.addTab(UiLocale.chestDrop.distribution.tabLabel[language], () => this.constructDetailsPanel(openedItem, gainedItems), null);
            // this.popup.addTab('历史', () => this.constructHistoryPanel(), null);
            this.popup.addTab(UiLocale.chestDrop.settings.tabLabel[language], () => this.constructSettingsPanel(), null);
        }

        /**
         * @param {CountedItem} openedItem
         * @param {CountedItem[]} gainedItems
         */
        constructOpenChestPopup(openedItem, gainedItems) {
            if (Config.chestDrop.verbose) out(openedItem, gainedItems);
            const itemStyle = rarity => {
                if (rarity === 0) return 'border: 1px solid rgba(96, 96, 109, 1); background-color:rgba(96, 96, 109, 0.5);';
                if (rarity === 0.5) return 'border: 1px solid rgb(121, 121, 131); background-color:rgba(112, 112, 126, 0.5); box-shadow: 0 0 3px 1px rgba(138, 138, 150, 0.8);';
                if (rarity === 1) return 'border: 1px solid rgba(107, 129, 109, 1); background-color: rgba(107, 129, 109, 0.5);';
                if (rarity === 1.5) return 'border: 1px solid rgb(118, 148, 120); background-color: rgba(117, 145, 120, 0.5); box-shadow: 0 0 3px 1px rgba(130, 159, 132, 0.8);';
                if (rarity === 2) return 'border: 1px solid rgba(121, 140, 165, 1); background-color: rgba(121, 140, 165, 0.5);';
                if (rarity === 2.5) return 'border: 1px solid rgb(134, 160, 180); background-color: rgba(146, 170, 189, 0.5); box-shadow: 0 0 3px 1px rgba(138, 171, 182, 0.8);';
                if (rarity === 3 || rarity === 3.5) return 'border: 1px solid rgba(139, 113, 156, 1); background-color: rgba(139, 113, 156, 0.5);';
                if (rarity === 4 || rarity === 4.5) return 'border: 1px solid rgba(208, 167, 127, 1); background-color: rgba(208, 167, 127, 0.5);';
                if (rarity === 5 || rarity === 5.5) return 'border: 1px solid rgb(196, 130, 130); background-color: rgba(189, 128, 128, 0.5); box-shadow: 0 0 3px 1px rgba(216, 143, 143, 0.8);';
                if (rarity === 6 || rarity === 6.5) return 'border: 1px solid rgba(234, 231, 147, 1); background-color: rgba(234, 231, 147, 0.5); box-shadow: 0 0 3px 1.5px rgba(234, 231, 147, 0.8);';
                return 'border: 1px solid rgba(96, 96, 109, 1); background-color:rgba(96, 96, 109, 0.5);';
            };
            const itemIcon = (item, rarity) => {
                const { hrid, count } = item;
                const ret = Ui.div(
                    { style: `margin: auto; width: 60px; height: 60px; font-size: 13px; display: grid; border-radius: 4px; ${itemStyle(rarity)}` },
                    [
                        Ui.div({ style: 'grid-area: 1/1; width: 42px; height: 42px; margin: auto;' },
                            Ui.itemSvgIcon(hrid, 42, true),
                        ),
                        Ui.div({ style: 'grid-area: 1/1; font-size: 13px; font-weight: 500; display: flex; align-items: flex-end; justify-content: flex-end; margin: 0 2px -1px 0; text-shadow: -1px 0 var(--color-background-game),0 1px var(--color-background-game),1px 0 var(--color-background-game),0 -1px var(--color-background-game); user-select: none;' }, Utils.formatPrice(count, { type: 'mwi' })),
                    ]
                );
                Tooltip.attach(ret, Tooltip.item(hrid, count), 'center');
                return ret;
            };
            const getRarity = ChestDropAnalyzer.getRarity(openedItem);
            const order = this.itemSortOrderMap[Config.chestDrop.ui.overviewItemSortOrder].weight;
            const sortedItems = order === null ? gainedItems : gainedItems.sort(
                (a, b) => order(b, getRarity(b)) - order(a, getRarity(a))
            );
            const itemIconList = [];
            sortedItems.forEach(item => {
                itemIconList.push(itemIcon(item, getRarity(item)))
            });

            const stat = ChestDropAnalyzer.analyze(openedItem, Market.getTotalPrice(gainedItems));

            const colorLuck = `color: ${Utils.luckColor(stat.luck)}`;
            const colorAvg = `color: ${Utils.luckColor(stat.income > stat.incomeExpectation)}`;
            const tablePrice = (x) => {
                let i = x.length - 1;
                for (; i >= 0; --i) if (x[i] >= '0' && x[i] <= '9') break;
                const unit = x.slice(i + 1);
                let num = x.slice(0, i + 1);
                return `<td style="text-align: right;"><span style="margin: 0 -3px 0 0;">${num}</span></td><td>${unit}</td>`;
            };
            const currentDiv = Ui.div({ style: 'margin: -2px -4px; font-size: 13px;' }, Ui.elem('table', { style: 'line-height: 1.1; width: 100%;' }, `
                <tr style="${colorLuck}">
                    <td style="text-align: right;">${UiLocale.chestDrop.chestOpen.count[language]}:</td>
                    ${tablePrice(Utils.formatPrice(openedItem.count))}
                </tr>
                <tr style="${colorLuck}">
                    <td style="text-align: right;">${UiLocale.chestDrop.chestOpen.income[language]}:</td>
                    ${tablePrice(Utils.formatPrice(stat.income))}
                </tr>
                ${stat.income == stat.profit ? '' : `
                <tr style="${colorLuck}">
                    <td style="text-align: right;">${UiLocale.chestDrop.chestOpen.profit[language]}:</td>
                    ${tablePrice(Utils.formatPrice(stat.profit).replace('-', '<span style="font-family: Consolas, monaco, monospace;">-</span>'))}
                </tr>
                `}
                <tr style="${colorLuck}">
                    <td style="text-align: right;">${UiLocale.chestDrop.chestOpen.luck[language]}:</td>
                    ${tablePrice(Utils.formatLuck(stat.luck))}
                </tr>
                <tr><td colspan="3"><div class="lll_separator" style="margin: 2px -3px"></div></td></tr>
                <tr style="${colorAvg}">
                    <td style="text-align: right;">${UiLocale.chestDrop.chestOpen.incomeExpt[language]}:</td>
                    ${tablePrice(Utils.formatPrice(stat.incomeExpectation))}
                </tr>
                <tr style="${colorAvg}">
                    <td style="text-align: right;"><span class="lll_text_noSelect" style="color: var(--border)">└</span>${UiLocale.chestDrop.chestOpen.stdDev[language]}:</td>
                    ${tablePrice(Utils.formatPrice(Math.sqrt(stat.incomeVariance)))}
                </tr>
                <tr style="${colorAvg}">
                    <td style="text-align: right;">
                        ${UiLocale.chestDrop.chestOpen[stat.income > stat.incomeExpectation ? 'higherThanExpt' : 'lowerThanExpt'][language]}:
                    </td>
                    ${tablePrice(Utils.formatPrice(Math.abs(stat.income - stat.incomeExpectation)))}
                </tr>
            `));

            const chestOpenHistory = JSON.parse(localStorage.getItem('Edible_Tools') ?? 'null')?.Chest_Open_Data?.[CharacterData.playerId]
                ?.开箱数据?.[ClientData.hrid2name(openedItem.hrid)];
            let historyDiv;
            if (!chestOpenHistory) historyDiv = Ui.div(null, '需安装食用工具');
            else {
                const count = chestOpenHistory.总计开箱数量 + openedItem.count;
                const income = Object.entries(chestOpenHistory.获得物品).reduce(
                    (pre, cur) => pre + cur[1].数量 * Market.getPriceByName(cur[0]), 0
                ) + stat.income;
                const historyStat = ChestDropAnalyzer.analyze({ hrid: openedItem.hrid, count: count }, income);
                const colorLuckHist = `color: ${Utils.luckColor(historyStat.luck)}`;
                const colorAvgHist = `color: ${Utils.luckColor(historyStat.income > historyStat.incomeExpectation)}`;
                historyDiv = Ui.div({ style: 'margin: -2px -4px; font-size:13px;' }, Ui.elem('table', { style: 'line-height: 1.1; width: 100%;' }, `
                    <tr style="${colorLuckHist}">
                        <td style="text-align: right;">${UiLocale.chestDrop.chestOpen.count[language]}:</td>
                        ${tablePrice(Utils.formatPrice(count))}
                    </tr>
                    <tr style="${colorLuckHist}">
                        <td style="text-align: right;">${UiLocale.chestDrop.chestOpen.income[language]}:</td>
                        ${tablePrice(Utils.formatPrice(historyStat.income))}
                    </tr>
                    ${historyStat.income == historyStat.profit ? '' : `
                    <tr style="${colorLuckHist}">
                        <td style="text-align: right;">${UiLocale.chestDrop.chestOpen.profit[language]}:</td>
                        ${tablePrice(Utils.formatPrice(historyStat.profit).replace('-', '<span style="font-family: Consolas, monaco, monospace;">-</span>'))}
                    </tr>
                    `}
                    <tr style="${colorLuckHist}">
                        <td style="text-align: right;">${UiLocale.chestDrop.chestOpen.histLuck[language]}:</td>
                        ${tablePrice(Utils.formatLuck(historyStat.luck))}
                    </tr>
                    <tr><td colspan="3"><div class="lll_separator" style="margin: 2px -3px"></div></td></tr>
                    <tr style="${colorAvgHist}">
                        <td style="text-align: right;">${UiLocale.chestDrop.chestOpen.incomeExpt[language]}:</td>
                        ${tablePrice(Utils.formatPrice(historyStat.incomeExpectation))}
                    </tr>
                    <tr style="${colorAvgHist}">
                        <td style="text-align: right;"><span class="lll_text_noSelect" style="color: var(--border)">└</span>${UiLocale.chestDrop.chestOpen.stdDev[language]}:</td>
                        ${tablePrice(Utils.formatPrice(Math.sqrt(historyStat.incomeVariance)))}
                    </tr>
                    <tr style="${colorAvgHist}">
                        <td style="text-align: right;">
                            ${UiLocale.chestDrop.chestOpen[historyStat.income > historyStat.incomeExpectation ? 'higherThanExpt' : 'lowerThanExpt'][language]}:
                        </td>
                        ${tablePrice(Utils.formatPrice(Math.abs(historyStat.income - historyStat.incomeExpectation)))}
                    </tr>
                `));
            }

            return Ui.div({ style: 'padding: 5px;', id: 'lll_chestOpenPopup' },
                Ui.div('lll_div_chestOpenContent', [
                    Ui.div('lll_div_row', itemIcon(openedItem, 0)),
                    Ui.div({ className: 'lll_div_row', style: 'margin-top: 8px;' }, Ui.div('lll_div_card', [
                        Ui.div('lll_div_cardTitle', UiLocale.chestDrop.chestOpen.youFound[language]),
                        Ui.div({ style: 'margin-top: 3px; width: 100%; display: grid; grid-template-columns: repeat(4,60px); grid-gap: 6px; justify-content: center;' }, itemIconList),
                    ])),
                    Ui.div('lll_div_row', [
                        Ui.div('lll_div_card', [
                            Ui.div('lll_div_cardTitle', UiLocale.chestDrop.chestOpen.currentChest[language]),
                            currentDiv,
                        ]),
                        Ui.div('lll_div_card', [
                            Ui.div('lll_div_cardTitle', UiLocale.chestDrop.chestOpen.history[language]),
                            historyDiv,
                        ]),
                    ]),
                    Ui.div('lll_div_row', [
                        Ui.elem('button', { className: 'Button_button__1Fe9z', style: 'margin: auto;', onclick: () => { this.openChestPopup.close(); } }, UiLocale.chestDrop.chestOpen.close[language]),
                        Ui.elem('button', { className: 'Button_button__1Fe9z', style: 'margin: auto;', onclick: () => { this.openChestPopup.close(); this.showPopup(openedItem, gainedItems) } }, UiLocale.chestDrop.chestOpen.details[language]),
                    ]),
                ])
            );
        }
        showOpenChestPopup(msg) {
            const formatter = item => ({ hrid: item.itemHrid, count: item.count });
            const openedItem = formatter(msg.openedItem);
            const gainedItems = msg.gainedItems.map(formatter);
            this.openChestPopup.setContent(this.constructOpenChestPopup(openedItem, gainedItems), UiLocale.chestDrop.chestOpen.openedLoot[language]);
            this.openChestPopup.open();
        }

        handleOriginalPopup(node) {
            let closeBtn = node.querySelector('div.Modal_background__2B88R');
            closeBtn.click?.();
        }
        observeOriginalPopup() {
            const observer = new MutationObserver((mutationsList, observer) => {
                mutationsList.forEach(mutation => {
                    mutation.addedNodes.forEach(addedNode => {
                        // @ts-ignore
                        if (addedNode.classList && addedNode.classList.contains('Modal_modalContainer__3B80m')) {
                            this.handleOriginalPopup(addedNode);
                            observer.disconnect();
                        }
                    });
                });
            });
            const rootNode = document.body;
            const config = { childList: true, subtree: true };
            observer.observe(rootNode, config);
        }

        onLootOpened(msg) {
            //TODO
            console.log("====kxz====",msg);
            if (Config.chestDrop.ui.useOriginalPopup) return;
            this.observeOriginalPopup();
            this.showOpenChestPopup(msg);
        }
    };

    //开空箱
    let chestObserver=new MutationObserver(function (mutationsList, observer) {
        addOpenEmptyChestButton();
    });
    chestObserver.observe(document,{ childList: true, subtree: true });

    const chestNameSelector = '#root > div > div > div.Modal_modalContainer__3B80m > div.Modal_modal__1Jiep > div.ItemDictionary_modalContent__WvEBY > div.ItemDictionary_itemAndDescription__28_he > div.Item_itemContainer__x7kH1 > div > div > div > svg > use';
    const itemSelector = '.ItemDictionary_drop__24I5f';
    function getItemNameFromElement(element) {
        const itemNameRaw = element.getAttribute('href').split('#').pop();
        return formatItemName(itemNameRaw);
    }
    function formatItemName(itemNameRaw) {
        return item_hrid_to_name[`/items/${itemNameRaw}`]
    }
    const item_hrid_to_name = {};
    const init_Client_Data_=decompressInitClientData(localStorage.getItem("initClientData"));
    for (const key in init_Client_Data_.itemDetailMap) {
        const item = init_Client_Data_.itemDetailMap[key];
        if (item && typeof item === 'object' && item.name) {
            item_hrid_to_name[key] = item.name;
        }
    }
    const iconSelector = '.Icon_icon__2LtL_ use';
    function addOpenEmptyChestButton(){
        const modalContainer = document.querySelector(".Modal_modalContainer__3B80m");
        if (!modalContainer) return; // 如果不存在 Modal_modalContainer__3B80m 元素，则直接返回

        const chestNameElem = document.querySelector(chestNameSelector);
        if (!chestNameElem) return;

        const chestName = getItemNameFromElement(chestNameElem);
        const items = document.querySelectorAll(itemSelector);

        //console.log("======chestName========",chestName);
        const dropListContainer = document.querySelector('.ItemDictionary_openToLoot__1krnv');
        if (!dropListContainer) return; // 检查 dropListContainer 是否存在

        const buttonId = 'open-empty-chest-btn';
        const existingButton = document.getElementById(buttonId);
        if (existingButton) return;
        const openButton = document.createElement('button');
        openButton.id = buttonId; // 绑定id
        openButton.textContent = '历史开箱';
        openButton.style.borderRadius = "5px";
        openButton.style.height = "30px";
        openButton.style.boxShadow = "none";
        openButton.style.border = "0px";
        openButton.style.backgroundColor = '#4357AF';
        openButton.style.color = 'white';
        openButton.style.display = "block"; // 块级元素才能用margin auto居中
        openButton.style.margin = "10px auto"; // 上下边距10px，左右自动（居中）
        openButton.addEventListener('click', () => {
            openEmptyChest(chestNameElem);
        });
        dropListContainer.appendChild(openButton);

    }
    function getUseItemHrid(useElement) {
        const hrefValue = useElement.getAttribute('href');
        if (!hrefValue) return ''; // 若href不存在，返回空
        const hashIndex = hrefValue.indexOf('#');
        if (hashIndex === -1) return ''; // 若没有 #，返回空
        const itemKey = hrefValue.slice(hashIndex + 1); // 截取 # 之后的内容
        return `/items/${itemKey}`;
    }
    function openEmptyChest(chest){

        const fakeMsg={
            "type": "loot_opened",
            "openedItem": {
                "itemHrid": `${getUseItemHrid(chest)}`,
                "count": 0,
            },
            "gainedItems": []
        };
        ChestDropAnalyzerUi.showOpenChestPopup(fakeMsg);
    }



    //#endregion

    MessageHandler.handleMessageRecv(JSON.stringify(decompressInitClientData(localStorage.getItem("initClientData"))));
})();