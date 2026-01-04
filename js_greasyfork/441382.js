// ==UserScript==
// @name         Markethunt plugin for Mousehunt
// @author       Program
// @namespace    https://greasyfork.org/en/users/886222-program
// @license      MIT
// @version      1.7.0
// @description  Adds a price chart and Markethunt integration to the MH marketplace screen.
// @resource     jq_confirm_css https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css
// @resource     jq_toast_css https://cdnjs.cloudflare.com/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.css
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/highcharts/9.3.2/highstock.min.js
// @include      https://www.mousehuntgame.com/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
//
// @downloadURL https://update.greasyfork.org/scripts/441382/Markethunt%20plugin%20for%20Mousehunt.user.js
// @updateURL https://update.greasyfork.org/scripts/441382/Markethunt%20plugin%20for%20Mousehunt.meta.js
// ==/UserScript==

const markethuntDomain = 'markethunt.win';
const markethuntApiDomain = 'api.markethunt.win';

MutationObserver =
    window.MutationObserver ||
    window.WebKitMutationObserver ||
    window.MozMutationObserver;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const RoundToIntLocaleStringOpts = {
    maximumFractionDigits: 0
}

const isDarkMode = (() => {
    let isDark = null;

    return () => {
        if (isDark == null) {
            isDark = !!getComputedStyle(document.documentElement).getPropertyValue('--mhdm-white');
        }

        return isDark;
    }
})();

/*******************************
 * 
 *  Plugin settings  
 * 
 *******************************/

class SettingsController {
    // TODO: make settings property private and convert init into static initializer once greasyfork adds support
    static settings;

    static init() {
        let settingsObj = {};

        if (localStorage.markethuntSettings !== undefined) {
            settingsObj = JSON.parse(localStorage.markethuntSettings);
        }

        this.settings = new Proxy(settingsObj, {
            set(obj, prop, value) {
                obj[prop] = value;
                localStorage.markethuntSettings = JSON.stringify(obj);
                return true;
            }
        });
    }

    static getStartChartAtZero() {
        if (this.settings.startChartAtZero === undefined) {
            return false;
        } else {
            return this.settings.startChartAtZero;
        }
    }

    static setStartChartAtZero(value) {
        this.settings.startChartAtZero = value;
    }

    static getEnablePortfolioButtons() {
        if (this.settings.enablePortfolioButtons === undefined) {
            return true;
        } else {
            return this.settings.enablePortfolioButtons;
        }
    }

    static setEnablePortfolioButtons(value) {
        this.settings.enablePortfolioButtons = value;
    }

    static getEnableFloatingVolumeLabels() {
        if (this.settings.enableFloatingVolumeLabels === undefined) {
            return false;
        } else {
            return this.settings.enableFloatingVolumeLabels;
        }
    }

    static setEnableFloatingVolumeLabels(value) {
        this.settings.enableFloatingVolumeLabels = value;
    }

    static getEnableChartAnimation() {
        if (this.settings.enableChartAnimation === undefined) {
            return true;
        } else {
            return this.settings.enableChartAnimation;
        }
    }

    static setEnableChartAnimation(value) {
        this.settings.enableChartAnimation = value;
    }
}

SettingsController.init();

function openPluginSettings() {
    $.alert({
        title: 'Markethunt Plugin Settings',
        content: `
            <div id="markethunt-settings-container">
                <h1>Chart settings</h1>
                <label for="checkbox-start-chart-at-zero" class="cl-switch markethunt-settings-row">
                    <div class="markethunt-settings-row-input">
                        <input id="checkbox-start-chart-at-zero" type="checkbox" ${SettingsController.getStartChartAtZero() ? 'checked' : ''}>
                        <span class="switcher"></span>
                    </div>
                    <div class="label markethunt-settings-row-description">
                        <b>Y-axis starts at 0</b><br>
                        Make the Y-axis start at 0 gold/SB
                    </div>
                </label>
                <label for="checkbox-enable-floating-volume-labels" class="cl-switch markethunt-settings-row">
                    <div class="markethunt-settings-row-input">
                        <input id="checkbox-enable-floating-volume-labels" type="checkbox" ${SettingsController.getEnableFloatingVolumeLabels() ? 'checked' : ''}>
                        <span class="switcher"></span>
                    </div>
                    <div class="label markethunt-settings-row-description">
                        <b>Volume labels</b><br>
                        Place floating labels indicating volume amount on the left side of the chart
                    </div>
                </label>
                <label for="checkbox-enable-chart-animation" class="cl-switch markethunt-settings-row">
                    <div class="markethunt-settings-row-input">
                        <input id="checkbox-enable-chart-animation" type="checkbox" ${SettingsController.getEnableChartAnimation() ? 'checked' : ''}>
                        <span class="switcher"></span>
                    </div>
                    <div class="label markethunt-settings-row-description">
                        <b>Chart animation</b><br>
                        Enable chart animations
                    </div>
                </label>
                <h1>Other settings</h1>
                <label for="checkbox-enable-portfolio-buttons" class="cl-switch markethunt-settings-row">
                    <div class="markethunt-settings-row-input">
                        <input id="checkbox-enable-portfolio-buttons" type="checkbox" ${SettingsController.getEnablePortfolioButtons() ? 'checked' : ''}>
                        <span class="switcher"></span>
                    </div>
                    <div class="label markethunt-settings-row-description">
                        <b>Portfolio quick-add buttons</b><br>
                        Place "Add to portfolio" buttons in your marketplace history and journal log
                    </div>
                </label>
            </div>
        `,
        boxWidth: '450px',
        useBootstrap: false,
        closeIcon: true,
        draggable: true,
        onOpen: function(){
            const startChartAtZeroCheckbox = document.getElementById("checkbox-start-chart-at-zero");
            startChartAtZeroCheckbox.addEventListener('change', function(event) {
                SettingsController.setStartChartAtZero(event.currentTarget.checked);
            });

            const enablePortfolioButtonsCheckbox = document.getElementById("checkbox-enable-portfolio-buttons");
            enablePortfolioButtonsCheckbox.addEventListener('change', function(event) {
                SettingsController.setEnablePortfolioButtons(event.currentTarget.checked);
            });

            const enableFloatingVolumeLabelsCheckbox = document.getElementById("checkbox-enable-floating-volume-labels");
            enableFloatingVolumeLabelsCheckbox.addEventListener('change', function(event) {
                SettingsController.setEnableFloatingVolumeLabels(event.currentTarget.checked);
            });

            const enableChartAnimationCheckbox = document.getElementById("checkbox-enable-chart-animation");
            enableChartAnimationCheckbox.addEventListener('change', function(event) {
                SettingsController.setEnableChartAnimation(event.currentTarget.checked);
            });
        }
    });
}

/*******************************
 * 
 *  Chart functions  
 * 
 *******************************/

// chart vars
const UtcTimezone = "T00:00:00+00:00"

// style
const primaryLineColor = "#4f52aa";
const secondaryLineColor = "#b91a05";
const sbiLineColor = "#00c000"
const volumeColor = "#51cda0";
const volumeLabelColor = '#3ab28a';

const eventBandColor = "#f2f2f2";
const eventBandFontColor = "#888888"; // recommend to have same or close color as yGridLineColor for visual clarity
const xGridLineColor = "#bbbbbb";
const yGridLineColor = "#aaaaaa";
const yGridLineColorLighter = "#dddddd";
const axisLabelColor = "#444444";
const crosshairColor = "#252525";

// dark mode style overrides
const darkMode = {
    backgroundColor: "#222222",
    eventBandColor: "#303030",
    eventBandFontColor: "#909090",
    primaryLineColor: "#9e8dfc",
    crosshairColor: "#e0e0e0"
}

const chartFont = "tahoma,arial,sans-serif";

// set global opts
Highcharts.setOptions({
    chart: {
        style: {
            fontFamily: chartFont,
        },
        spacingLeft: 0,
        spacingRight: 5,
        spacingTop: 7,
        spacingBottom: 6,
    },
    lang: {
        rangeSelectorZoom :""
    },
    plotOptions: {
        series: {
            showInLegend: true,
        },
    },
    // must keep scrollbar enabled for dynamic scrolling, so hide the scrollbar instead
    scrollbar: {
        height: 0,
        buttonArrowColor: "#ffffff00",
    },
    title: {
        enabled: false,
    },
    credits: {
        enabled: false,
    },
    rangeSelector: {
        buttonPosition: {
            y: 5,
        },
        inputEnabled: false,
        labelStyle: {
            color: axisLabelColor,
        },
        verticalAlign: 'top',
        x: -5.5,
    },
    legend: {
        align: 'right',
        verticalAlign: 'top',
        y: -23,
        padding: 0,
        itemStyle: {
            color: '#000000',
            fontSize: "13px",
        },
    },
    tooltip: {
        animation: false,
        shared: true,
        split: false,
        headerFormat: '<span style="font-size: 11px; font-weight: bold">{point.key}</span><br/>',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        hideDelay: 0, // makes tooltip feel more responsive when crossing gap between plots
        style: {
            color: '#000000',
            fontSize: '11px',
            fontFamily: chartFont,
        }
    },
    navigator: {
        height: 25,
        margin: 0,
        maskInside: false,
        enabled: false,
    },
    xAxis: {
        tickColor: xGridLineColor,
        gridLineColor: xGridLineColor,
        labels: {
            style: {
                color: axisLabelColor,
                fontSize: '11px',
            }
        }
    },
    yAxis: {
        gridLineColor: yGridLineColor,
        labels: {
            style: {
                color: axisLabelColor,
                fontSize: '11px',
            },
            y: 3,
        }
    }
});

function setDarkThemeGlobalOpts() {
    Highcharts.setOptions({
        chart: {
            backgroundColor: darkMode.backgroundColor
        },
        legend: {
            itemStyle: {
                color: '#e0e0e0'
            },
            itemHoverStyle: {
                color: '#f0f0f0'
            },
            itemHiddenStyle: {
                color: '#777777'
            },
            title: {
                style: {
                    color: '#c0c0c0'
                }
            }
        },
        xAxis: {
            gridLineColor: '#707070',
            labels: {
                style: {
                    color: '#e0e0e0'
                }
            },
            lineColor: '#707070',
            minorGridLineColor: '#505050',
            tickColor: '#707070',
        },
        yAxis: {
            gridLineColor: '#707070',
            labels: {
                style: {
                    color: '#e0e0e0'
                }
            },
            lineColor: '#707070',
            minorGridLineColor: '#505050',
            tickColor: '#707070',
        },
        tooltip: {
            backgroundColor: '#000000',
            style: {
                color: '#f0f0f0'
            }
        },
        rangeSelector: {
            buttonTheme: {
                fill: '#444444',
                stroke: '#000000',
                style: {
                    color: '#cccccc'
                },
                states: {
                    hover: {
                        fill: '#707070',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    },
                    select: {
                        fill: '#000000',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    }
                }
            },
        },
    });
}

function UtcIsoDateToMillis(dateStr) {
    return (new Date(dateStr + UtcTimezone)).getTime();
}

function formatSISuffix(num, decimalPlaces) {
    const suffixes = ["", "K", "M", "B"];
    let order = Math.max(Math.floor(Math.log(num) / Math.log(1000)), 0);
    if (order > suffixes.length - 1) {
        order = suffixes.length - 1;
    }
    let significand = num / Math.pow(1000, order);
    return significand.toFixed(decimalPlaces) + suffixes[order];
}

function eventBand(IsoStrFrom, IsoStrTo, labelText) {
    return {
        from: UtcIsoDateToMillis(IsoStrFrom),
        to: UtcIsoDateToMillis(IsoStrTo),
        color: isDarkMode() ? darkMode.eventBandColor : eventBandColor,
        label: {
            text: labelText,
            rotation: 270,
            textAlign: 'right',
            y: 5, // pixels from top of chart
            x: 4, // fix slight centering issue
            style: {
                color: isDarkMode() ? darkMode.eventBandFontColor : eventBandFontColor,
                fontSize: '12px',
                fontFamily: chartFont,
            },
        },
    }
}

function updateEventData() {
    $.getJSON(`https://${markethuntApiDomain}/events?plugin_ver=${GM_info.script.version}`, function (response) {
        localStorage.markethuntEventDatesV2 = JSON.stringify(response);
        localStorage.markethuntEventDatesV2LastRetrieval = Date.now();
    });
}

function renderChartWithItemId(itemId, containerId, forceRender = false) {
    const containerElement = document.getElementById(containerId);

    if (forceRender === false && containerElement.dataset.lastRendered) {
        return;
    }

    itemId = Number(itemId);
    let eventData = [];

    if (localStorage.markethuntEventDatesV2LastRetrieval !== undefined) {
        JSON.parse(localStorage.markethuntEventDatesV2).forEach(event => eventData.push(eventBand(event.start_date, event.end_date, event.short_name)));

        if (Date.now() - Number(localStorage.markethuntEventDatesV2LastRetrieval) > 2 * 86400 * 1000) {
            updateEventData();
        }
    } else {
        updateEventData();
    }

    function renderChart(response) {
        // set HUD
        if (response.market_data.length > 0) {
            const newestPrice = response.market_data[response.market_data.length - 1];
            const utcTodayMillis = UtcIsoDateToMillis(new Date().toISOString().substring(0, 10));

            const priceDisplay = document.getElementById("infoboxPrice");
            const sbPriceDisplay = document.getElementById("infoboxSbPrice");
            const tradeVolDisplay = document.getElementById("infoboxTradevol");
            const goldVolDisplay = document.getElementById("infoboxGoldvol");
            const weeklyVolDisplay = document.getElementById("infobox7dTradevol");
            const weeklyGoldVolDisplay = document.getElementById("infobox7dGoldvol");

            // set gold price
            priceDisplay.innerHTML = newestPrice.price.toLocaleString();

            // set sb price
            try {
                let sbPriceText;
                let sbPrice = newestPrice.sb_price;
                
                if (sbPrice >= 100) {
                    sbPriceText = Math.round(sbPrice).toLocaleString();
                } else {
                    sbPriceText = sbPrice.toFixed(2).toLocaleString();
                }
                sbPriceDisplay.innerHTML = sbPriceText;
            } catch (e) {
                // do nothing
            }

            // set yesterday's trade volume
            let volText = '0';
            if (utcTodayMillis - UtcIsoDateToMillis(newestPrice.date) <= 86400 * 1000 && newestPrice.volume !== null) {
                volText = newestPrice.volume.toLocaleString();
            }
            tradeVolDisplay.innerHTML = volText;

            // set yesterday's gold volume
            let goldVolText = '0';
            if (utcTodayMillis - UtcIsoDateToMillis(newestPrice.date) <= 86400 * 1000 && newestPrice.volume !== null) {
                goldVolText = formatSISuffix(newestPrice.volume * newestPrice.price, 2);
            }
            goldVolDisplay.innerHTML = goldVolText;

            // set last week's trade volume
            let weeklyVolText = response.market_data.reduce(function(sum, dataPoint) {
                if (utcTodayMillis - UtcIsoDateToMillis(dataPoint.date) <= 7 * 86400 * 1000) {
                    return sum + (dataPoint.volume !== null ? dataPoint.volume : 0);
                } else {
                    return sum;
                }
            }, 0);
            weeklyVolDisplay.innerHTML = weeklyVolText.toLocaleString();

            // set last week's gold volume
            let weeklyGoldVol = response.market_data.reduce(function(sum, dataPoint) {
                if (utcTodayMillis - UtcIsoDateToMillis(dataPoint.date) <= 7 * 86400 * 1000) {
                    return sum + (dataPoint.volume !== null ? dataPoint.volume * dataPoint.price : 0);
                } else {
                    return sum;
                }
            }, 0);
            weeklyGoldVolDisplay.innerHTML = (weeklyGoldVol === 0) ? '0' : formatSISuffix(weeklyGoldVol, 2);
        }

        // process data for highcharts
        var dailyPrices = [];
        var dailyVolumes = [];
        var dailySbPrices = [];
        for (var i = 0; i < response.market_data.length; i++) {
            dailyPrices.push([
                UtcIsoDateToMillis(response.market_data[i].date),
                Number(response.market_data[i].price)
            ]);
            dailyVolumes.push([
                UtcIsoDateToMillis(response.market_data[i].date),
                Number(response.market_data[i].volume)
            ]);
            dailySbPrices.push([
                UtcIsoDateToMillis(response.market_data[i].date),
                Number(response.market_data[i].sb_price)
            ]);
        }

        if (isDarkMode()) {
            setDarkThemeGlobalOpts();
        }

        // Create the chart
        let chart = new Highcharts.stockChart(containerId, {
            chart: {
                // zoom animations
                animation: SettingsController.getEnableChartAnimation() ? { 'duration': 500 } : false,
            },
            plotOptions: {
                series: {
                    // initial animation
                    animation: SettingsController.getEnableChartAnimation() ? { 'duration': 900 } : false,
                    dataGrouping: {
                        enabled: itemId === 114,
                        units: [['day', [1]], ['week', [1]]],
                        groupPixelWidth: 3,
                    },
                },
            },
            rangeSelector: {
                buttons: [
                    {
                        type: 'month',
                        count: 1,
                        text: '1M'
                    }, {
                        type: 'month',
                        count: 3,
                        text: '3M'
                    }, {
                        type: 'month',
                        count: 6,
                        text: '6M'
                    }, {
                        type: 'year',
                        count: 1,
                        text: '1Y',
                    }, {
                        type: 'all',
                        text: 'All'
                    },
                ],
                selected: 3,
            },
            legend: {
                enabled: true
            },
            tooltip: {
                xDateFormat: '%b %e, %Y',
            },
            series: [
                {
                    name: 'Average price',
                    id: 'dailyPrice',
                    data: dailyPrices,
                    lineWidth: 1.5,
                    states: {
                        hover: {
                            lineWidthPlus: 0,
                            halo: false, // disable translucent halo on marker hover
                        }
                    },
                    yAxis: 0,
                    color: isDarkMode() ? darkMode.primaryLineColor : primaryLineColor,
                    marker: {
                        states: {
                            hover: {
                                lineWidth: 0,
                            }
                        },
                    },
                    tooltip: {
                        pointFormatter: function() {
                            return `<span style="color:${this.color}">\u25CF</span>`
                                + ` ${this.series.name}:`
                                + ` <b>${this.y.toLocaleString()}g</b><br/>`;
                        },
                    },
                    zIndex: 1,
                }, {
                    name: 'Volume',
                    type: 'column',
                    data: dailyVolumes,
                    pointPadding: 0, // disable point and group padding to simulate column area chart
                    groupPadding: 0,
                    yAxis: 2,
                    color: volumeColor,
                    tooltip: {
                        pointFormatter: function() {
                            let volumeAmtText = this.y !== 0 ? this.y.toLocaleString() : 'n/a';
                            return `<span style="color:${this.color}">\u25CF</span>`
                                    + ` ${this.series.name}:`
                                    + ` <b>${volumeAmtText}</b><br/>`;
                        },
                    },
                    zIndex: 0,
                }, {
                    name: 'SB Price',
                    id: 'sbi',
                    data: dailySbPrices,
                    visible: false,
                    lineWidth: 1.5,
                    states: {
                        hover: {
                            lineWidthPlus: 0,
                            halo: false, // disable translucent halo on marker hover
                        }
                    },
                    yAxis: 1,
                    color: sbiLineColor,
                    marker: {
                        states: {
                            hover: {
                                lineWidth: 0,
                            }
                        },
                    },
                    tooltip: {
                        pointFormatter: function() {
                            let sbiText;

                            if (this.y >= 1000) {
                                sbiText = Math.round(this.y).toLocaleString();
                            } else if (this.y >= 100) {
                                sbiText = this.y.toFixed(1).toLocaleString();
                            } else if (this.y >= 10) {
                                sbiText = this.y.toFixed(2).toLocaleString();
                            } else {
                                sbiText = this.y.toFixed(3).toLocaleString();
                            }
                            return `<span style="color:${this.color}">\u25CF</span>`
                                + ` SB Index:`
                                + ` <b>${sbiText} SB</b><br/>`;
                        },
                    },
                    zIndex: 2,
                },
            ],
            yAxis: [
                {
                    min: SettingsController.getStartChartAtZero() ? 0 : null,
                    labels: {
                        formatter: function() {
                            return this.value.toLocaleString() + 'g';
                        },
                        x: -8,
                    },
                    showLastLabel: true, // show label at top of chart
                    crosshair: {
                        dashStyle: 'ShortDot',
                        color: isDarkMode() ? darkMode.crosshairColor : crosshairColor,
                    },
                    opposite: false,
                    alignTicks: false, // disabled, otherwise autoranger will create too large a Y-window
                }, {
                    min: SettingsController.getStartChartAtZero() ? 0 : null,
                    gridLineWidth: 0,
                    labels: {
                        formatter: function() {
                            return this.value.toLocaleString() + ' SB';
                        },
                        x: 5,
                    },
                    showLastLabel: true, // show label at top of chart
                    opposite: true,
                    alignTicks: false,
                }, {
                    top: '75%',
                    height: '25%',
                    offset: 0,
                    min: 0,
                    opposite: false,
                    tickPixelInterval: 35,
                    allowDecimals: false,
                    alignTicks: false,
                    gridLineWidth: 0,
                    labels: {
                        enabled: SettingsController.getEnableFloatingVolumeLabels(),
                        align: 'left',
                        x: 0,
                        style: {
                            color: volumeLabelColor,
                        },
                    },
                    showLastLabel: true,
                    showFirstLabel: false,
            }],
            xAxis: {
                type: 'datetime',
                ordinal: false, // show continuous x axis if dates are missing
                plotBands: eventData,
                crosshair: {
                    dashStyle: 'ShortDot',
                    color: isDarkMode() ? darkMode.crosshairColor : crosshairColor,
                },
                dateTimeLabelFormats:{
                    day: '%b %e',
                    week: '%b %e, \'%y',
                    month: '%b %Y',
                    year: '%Y'
                },
                tickPixelInterval: 120,
            },
        });

        containerElement.dataset.lastRendered = Date.now().toString();
    }

    $.getJSON(`https://${markethuntApiDomain}/items/${itemId}?plugin_ver=${GM_info.script.version}`, function (response) {
        renderChart(response);
    });
}

function renderStockChartWithItemId(itemId, containerId, forceRender = false) {
    const containerElement = document.getElementById(containerId);

    if (forceRender === false && containerElement.dataset.lastRendered) {
        return;
    }

    itemId = Number(itemId);
    let eventData = [];

    if (localStorage.markethuntEventDatesV2LastRetrieval !== undefined) {
        JSON.parse(localStorage.markethuntEventDatesV2).forEach(event => eventData.push(eventBand(event.start_date, event.end_date, event.short_name)));
    }

    function renderStockChart(response) {
        const bid_data = [];
        const ask_data = [];
        const supply_data = [];

        response.stock_data.forEach(x => {
            bid_data.push([x.timestamp, x.bid]);
            ask_data.push([x.timestamp, x.ask]);
            supply_data.push([x.timestamp, x.supply]);
        })

        if (isDarkMode()) {
            setDarkThemeGlobalOpts();
        }

        // Create the chart
        let chart = new Highcharts.stockChart(containerId, {
            chart: {
                // zoom animations
                animation: SettingsController.getEnableChartAnimation() ? { 'duration': 500 } : false,
            },
            plotOptions: {
                series: {
                    // initial animation
                    animation: SettingsController.getEnableChartAnimation() ? { 'duration': 900 } : false,
                    dataGrouping: {
                        enabled: true,
                        units: [['hour', [2, 4, 6]], ['day', [1]], ['week', [1]]],
                        groupPixelWidth: 2,
                        dateTimeLabelFormats: {
                            hour: ['%b %e, %Y %H:%M UTC', '%b %e, %Y %H:%M UTC'],
                            day: ['%b %e, %Y']
                        }
                    },
                },
            },
            rangeSelector: {
                buttons: [
                    {
                        type: 'day',
                        count: 7,
                        text: '7D'
                    }, {
                        type: 'month',
                        count: 1,
                        text: '1M'
                    }, {
                        type: 'month',
                        count: 3,
                        text: '3M'
                    }, {
                        type: 'month',
                        count: 6,
                        text: '6M'
                    }, {
                        type: 'year',
                        count: 1,
                        text: '1Y'
                    }, {
                        type: 'all',
                        text: 'All'
                    },
                ],
                selected: 1,
            },
            legend: {
                enabled: true
            },
            tooltip: {
                xDateFormat: '%b %e, %Y %H:%M UTC',
            },
            series: [
                {
                    name: 'Ask',
                    id: 'ask',
                    data: ask_data,
                    lineWidth: 1.5,
                    states: {
                        hover: {
                            lineWidthPlus: 0,
                            halo: false, // disable translucent halo on marker hover
                        }
                    },
                    yAxis: 0,
                    color: isDarkMode() ? darkMode.primaryLineColor : primaryLineColor,
                    marker: {
                        states: {
                            hover: {
                                lineWidth: 0,
                            }
                        },
                    },
                    tooltip: {
                        pointFormatter: function() {
                            return `<span style="color:${this.color}">\u25CF</span>`
                                + ` ${this.series.name}:`
                                + ` <b>${this.y.toLocaleString(undefined, RoundToIntLocaleStringOpts)}g</b><br/>`;
                        },
                    },
                    zIndex: 1,
                }, {
                    name: 'Bid',
                    id: 'bid',
                    data: bid_data,
                    lineWidth: 1.5,
                    states: {
                        hover: {
                            lineWidthPlus: 0,
                            halo: false, // disable translucent halo on marker hover
                        }
                    },
                    yAxis: 0,
                    color: secondaryLineColor,
                    marker: {
                        states: {
                            hover: {
                                lineWidth: 0,
                            }
                        },
                    },
                    tooltip: {
                        pointFormatter: function() {
                            return `<span style="color:${this.color}">\u25CF</span>`
                                + ` ${this.series.name}:`
                                + ` <b>${this.y.toLocaleString(undefined, RoundToIntLocaleStringOpts)}g</b><br/>`;
                        },
                    },
                    zIndex: 2,
                }, {
                    name: 'Supply',
                    id: 'supply',
                    data: supply_data,
                    type: 'area',
                    lineWidth: 1.5,
                    states: {
                        hover: {
                            lineWidthPlus: 0,
                            halo: false, // disable translucent halo on marker hover
                        }
                    },
                    yAxis: 1,
                    color: volumeColor,
                    marker: {
                        states: {
                            hover: {
                                lineWidth: 0,
                            }
                        },
                    },
                    tooltip: {
                        pointFormatter: function() {
                            return `<span style="color:${this.color}">\u25CF</span>`
                                + ` ${this.series.name}:`
                                + ` <b>${this.y.toLocaleString(undefined, RoundToIntLocaleStringOpts)}</b><br/>`;
                        },
                    },
                    zIndex: 0,
                },
            ],
            yAxis: [
                {
                    min: SettingsController.getStartChartAtZero() ? 0 : null,
                    labels: {
                        formatter: function() {
                            return this.value.toLocaleString() + 'g';
                        },
                        x: -8,
                    },
                    showLastLabel: true, // show label at top of chart
                    opposite: false,
                    alignTicks: false
                }, {
                    top: '75%',
                    height: '25%',
                    offset: 0,
                    min: 0,
                    opposite: false,
                    tickPixelInterval: 35,
                    allowDecimals: false,
                    alignTicks: false,
                    gridLineWidth: 0,
                    labels: {
                        enabled: SettingsController.getEnableFloatingVolumeLabels(),
                        align: 'left',
                        x: 0,
                        style: {
                            color: volumeLabelColor,
                        },
                    },
                    showLastLabel: true,
                    showFirstLabel: false,
                }],
            xAxis: {
                type: 'datetime',
                ordinal: false, // show continuous x axis if dates are missing
                plotBands: eventData,
                crosshair: {
                    dashStyle: 'ShortDot',
                    color: isDarkMode() ? darkMode.crosshairColor : crosshairColor,
                },
                dateTimeLabelFormats:{
                    day: '%b %e',
                    week: '%b %e, \'%y',
                    month: '%b %Y',
                    year: '%Y'
                },
                tickPixelInterval: 120,
            }
        });

        containerElement.dataset.lastRendered = Date.now().toString();
    }

    $.getJSON(`https://${markethuntApiDomain}/items/${itemId}/stock?&plugin_ver=${GM_info.script.version}`, function (response) {
        renderStockChart(response);
    });
}

if (localStorage.markethuntEventDatesV2LastRetrieval === undefined) {
    updateEventData();
}

/*******************************
 * 
 *  Marketplace view observer  
 * 
 *******************************/

// chart-icon-90px.png minified with TinyPNG then converted to base 64
const chartIconImageData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAMAAAAPdrEwAAAAVFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU4H24AAAAG3RSTlMABvTkbYjGz8kamvoO0EYg6H0koqabYVSqNDILUie0AAABU0lEQVRYw+2V2Y6DMAx" +
    "FyUIgwLB1mxn//3+OhEQd6o5EypUqVT6PoBwcbmIXiqIo78b42traG7w5ftFCFeE1L+bFja7b0x0PVtesDmC1ZbWFpS/V2PQnYgIyfXOmBA9MP3KG/HlI+r9uY46vpj+It7f1tQvWhryL3lNC2" +
    "wz/BFhn3/CuoS3taU4CPK2Pv7tcc++IYbkIsDxaMv+W+RpGG9wawQ1Q8lPcT27JF147BTuG69y0qZEDzOsYYeKSm3tEwxP52WR2DMb1BSPlU3bHECULeX6f86JkwWBfU9ep+dIhZ4olpsdOwj2" +
    "bNdVjCzWlowVXmmMDNFYPLbTkVeXBsW/8toW6JPli12Z3QwnFns2i1bxZvJqR6cPUMn2UWqY/gtWUoGqxTJwZlFqeGZhanhmwmhI+Xi3SR6hl+jC1TB+spgRVq1rVqla1qlUNUSuKooD4Az6O4" +
    "MtRLQLhAAAAAElFTkSuQmCC";

// sb.png minified with TinyPNG then converted to base 64
const sbImageData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAABcVBMVEX+/v/5///+/fzwyJTuxJD1////6cn416z31ab206SOi4ny///t///b" +
    "///J///2/P/9/Pj4+Pjq6/b8+PPw8PPh4+7+9+3K5s//7M7/6Mb+5cP63bfv17b53LP21an1zJzWuprzzJDRrovpuoHmuXzktXu6k3Rd0HOzi2vp///Q//+z//+t///n/v/0+P/q7v/t7v79" +
    "+PjW//P/+/P2+vHZ7PHn6e3/+eft5+f/9ubi8eT/9OPw59//8t377dzh3tz+7dXN7dTa09Sv1tP35tHO1czX4cu+3cLazcLCysL44L3Uw7vDuLj32rar3LGvtbHq167gyK6S16nlyanl06je" +
    "w6jy06fxz6Z8oqSooKDszJ7Ls56MypvoxZqel5fQsZblwJWVkJB0xY3nvI10y4vswIv30IrvwInRp4jxyYeIg4XdtYPQq4LNpH65mnt9e3u+sXr0xHjZq3dZwHTPonR1dXHgqnC6kGtpbGnh" +
    "qWEs0UvWjFe8AAAA4klEQVQY02PACvgYITSvlbo4mCEY4V9awZUf4+ieUqUOFmFK5OKKjMtKCioW9zPRBAowAhFIJUSnFhBrczMwAJGIkKiomQhIkFWHj0GXQc+An4df3yfPlRUoxMNgaGFv" +
    "6uTpHF1SpqIA0StWWaCqzBwlL8+RngFxhnlhSJiblxSbhCRzEViE1ShNWlaGnZMzIFU1HqLLWFGOnZOZmYWFRcUD6g1FFg52DrnY3HINIahIpnJ2jpqGmlJCsjdUJFBJIViGTZJNOjwUKiLr" +
    "KyXhYGtpbediAxURExYWYGIAQgGgDwEEwCDFO/6WiQAAAABJRU5ErkJggg==";

const settingsImageData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACKElEQVR4nO2YMUucQRCGH9Cgoi" +
    "YgNolVqhAVm6SyNoGAyP0Q8TT+ABG0C3ZRbMU2gprC4vA/HNx5tQZTxSimCDHKJwsjHEe8b2bX1cV8DwzICTPvu+x+M7tQUFBwl3wFspzYI2G+Kwz8AjpJkCGF+Jt4Q4JMGQzMkiCLBgNfSIhhYAP4" +
    "bTBwBWwCr+5D4AegDiyI2Bu6gU/ApUF4a1wCK0BPy4IsSE1XO4gnQKOlaA1YAg4ChLdGQ3LW/vG70+DN3B2K9I1ZX/EDwEkCBk6BQR8DawmIzyRWreLdQfqbgPCs6bCPWQxUAorVZN+OAL0SI3Ke6g" +
    "F5K1rxJc8Cf4BpoKNNbve/GeDCs0ZJY+A1cOghfkK7QsA7DxOHok3FC6BqSO5W3krZkL8qmkw8A/aVe77dtrkNN1JrmuG+aPGiCziKOFl+zMl9JBqCOMsp0jwfWRlVNLFgrnKK9AXk7ld8/6MbcCJ8" +
    "eXofBk5zirgmlewW6lIcYtdhfZmPeYi1n9F6wGe0Eeszam1kbjyIedeoWhqZzyhxIeOBlvcxR4mSMXGziXLOo1WnrHzUYS50nK5Lhx2VHtEnf88H3qMr/E8XGuQalyUSn/G81P9IQPxP30s9Mmk+tI" +
    "EykR62NE1IG9+A5RgPW+2eFnvkWTDkaTEDtoHnsZ4WNbwE1o1G3IS7C4yTEFsGAzskyJzBgNsiyfHWYGCSBOkAzpUGmg9tUuwpxB8/tMiCgsfENevgYdmM/xZUAAAAAElFTkSuQmCC";

const kofiImageData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAABm1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8AAAD/Xluzs7PIyMj/XV7/Wmz/W2b/XW" +
    "D//f3/WXH/Wm7/W2n/XGT8/Pz/+Pn/XGLQ0ND/W2q6urq3t7esrKympqb/V3j/WHX/+vr19fX/ydDCwsKwsLCioqKMjIx9fX1YWFhKSko7Ozv9/f3//Pz5+fn/9fXm5ub/2tzb29v/0dXNzc3Ex" +
    "MT/pqf/mqX/kKX/n56enp6RkZH/kpD/joz/i4mIiIj/h4b/hIJubm5iYmJNTU0jIyMeHh4PDw8MDAz/4+TS0tL/xcj/u8jFxcW+vr7/rbT/lqz/k6D/jZ3/gZz/i5r/ipmYmJiXl5f/mJaVlZX/" +
    "lJWUlJT/kJP/eYz/comCgoJ5eXl0dHRra2s0NDQsLCwnJycTExMRERH4jQN3AAAAKXRSTlMAiqaR9J+W+/h6dQ+5rI6Jg4BvZ1ZJNycH1svGwmM9MyshCe/ksqE/Gb0RW4gAAAH8SURBVEjH7dR" +
    "nVxpBGIbhiVnpKki1JWrq+4KKi7pgaAqIIGrsGks09vTee//ZbmFndhTQ73p9fu4zs+fsLrlwnvhdl2posnnthNN5DU8h1PuNQSNuh2oY+7jzDy1WwtTjItSWGT/Ahm5D0AOnmfuDJhrU1Qgy28" +
    "XirzEJYGYfvWcJelBRmgFIYOvxQJx/8XrlSRTE7Kuvb7JiOXD4PO1YmobJ3+ZOGiyo+5V0Oj0y8m32bWSgr+/OsqgFdYQE2jEP8B3dNBgGWVZeRyKRAWU9OBgOP6YBuYITACE08cGyYT00FOv/w" +
    "gK78BdgGBv44KW2Dqvr/t7eLRZ0C3s0YA/93LgOBoP3jl0pgSY+eCjfJKatVbM0sLdiCqCAbj6ApZg81tbqAVrQ1uG8jrsSTO9ZuojmZjkY/aSuNfdHQbGAMvNOBmANb7B36SloxQbdP4iCSlor" +
    "bK7OAUDu0OJnQQ400Q19fxc4k6lDs5voTPgM9GJd3W/xeym3i+ZmYgjioJv6oNw/yrbvN38U9xFbbnFfXAgocSm4zvawiDLB4QkQgyZMAiPOTwETQofHZyc8F+ahmnGkd2c68CdUIZXw6sngtnD" +
    "wqOoBbaQCG/4vJOLxeKL8X0kmk6lUfvXd5wkU6AEcqwUra/GRyrqaL+salb+j0+myWm02b4BcOK+OAN6AtFxkFAmAAAAAAElFTkSuQmCC";

const mpObserverTarget = document.querySelector("#overlayPopup");

function CurrentViewedItemId() {
    const itemIdRaw = mpObserverTarget.querySelector(".marketplaceView-item.view")?.dataset.itemId;
    return itemIdRaw ? Number(itemIdRaw) : null;
}

const mpObserver = new MutationObserver(function () {
    // Check if the Marketplace interface is open
    if (!mpObserverTarget.querySelector(".marketplaceView")) {
        return;
    }

    // detect item page and inject chart
    const backButton = mpObserverTarget.querySelector("a.marketplaceView-breadcrumb");
    if (backButton) {
        const targetContainer = mpObserverTarget.querySelector(".marketplaceView-item-description");

        if (targetContainer && !mpObserverTarget.querySelector("#chartArea")) {
            // Disconnect and reconnect later to prevent mutation loop
            mpObserver.disconnect();

            // Setup chart divs
            const itemId = CurrentViewedItemId();

            targetContainer.insertAdjacentHTML(
                "beforebegin",
                `<div id="chartArea" style="display: flex; padding: 0 20px 0 20px; height: 315px;">
                    <div style="flex-grow: 1; position: relative">
                        <div id="chartContainer" style="text-align: center; height: 100%; width: 100%">
                            <img style="opacity: 0.07; margin-top: 105px" src="${chartIconImageData}" alt="Chart icon" class="${isDarkMode() ? 'inverted' : ''}">
                            <div style="color: grey">Loading ...</div>
                        </div>
                        <div id="stockChartContainer" style="text-align: center; position: absolute; background-color: ${isDarkMode() ? darkMode.backgroundColor : 'white'}; top: 0; left: 0; width: 100%; height: 100%; display: none">
                            <img style="opacity: 0.07; margin-top: 105px" src="${chartIconImageData}" alt="Chart icon" class="${isDarkMode() ? 'inverted' : ''}">
                            <div style="color: grey">Loading ...</div>
                        </div>
                    </div>
                    <div id="markethuntInfobox" style="text-align: center; display: flex; flex-direction: column; padding: 34px 0 12px 5px; position: relative;">
                        <div class="marketplaceView-item-averagePrice infobox-stat infobox-small-spans infobox-striped">
                            Trade volume:<br>
                            <span id="infoboxTradevol">--</span><br>
                            <span id="infoboxGoldvol" class="marketplaceView-goldValue">--</span>
                        </div>
                        <div class="marketplaceView-item-averagePrice infobox-stat infobox-small-spans">
                            7-day trade volume:<br>
                            <span id="infobox7dTradevol">--</span><br>
                            <span id="infobox7dGoldvol" class="marketplaceView-goldValue">--</span>
                        </div>
                        <div style="user-select: none; text-align: left">
                            <label class="cl-switch" for="markethuntShowStockData" style="cursor: pointer">
                                <input type="checkbox" id="markethuntShowStockData">
                                <span class="switcher"></span>
                                <span class="label">Stock chart</span>
                            </label>
                        </div>
                        <div style="flex-grow: 1"></div> <!-- spacer div -->
                        <div>
                            <div style="display: flex;">
                                <div style="flex-grow: 1;"></div>
                                <div>
                                    <a id="markethuntSettingsLink" href="#">
                                        <img src="${settingsImageData}" class="markethunt-settings-btn-img ${isDarkMode() ? 'inverted' : ''}">
                                    </a>
                                </div>
                                <div>
                                    <a href="https://ko-fi.com/vsong_program" target="_blank" alt="Donation Link">
                                        <img src="${kofiImageData}" class="markethunt-settings-btn-img" alt="Settings">
                                    </a>
                                </div>
                                <div style="flex-grow: 1;"></div>
                            </div>
                            <div style="font-size: 0.8em; color: grey">v${GM_info.script.version}</div>
                        </div>
                    </div>
                </div>`
            );

            const itemPriceContainer = mpObserverTarget.querySelector(".marketplaceView-item-averagePrice");
            itemPriceContainer.classList.add("infobox-stat");
            itemPriceContainer.insertAdjacentHTML(
                "beforeend",
                `<br><span id="infoboxSbPrice" class="marketplaceView-sbValue">--</span><img style="vertical-align: bottom" src="${sbImageData}" alt="SB icon" />`
            );

            const itemPriceDisplay = itemPriceContainer.querySelector("span");
            itemPriceDisplay.id = "infoboxPrice";

            const infoBox = document.getElementById("markethuntInfobox");
            infoBox.prepend(itemPriceContainer);

            // Set infobox minimum width to prevent layout shifts, *then* reset price display
            const infoBoxInitialWidth = $(infoBox).width();
            infoBox.style.minWidth = `${infoBoxInitialWidth}px`;

            itemPriceDisplay.innerHTML = "--";

            // Set stock chart checkbox listener
            const stockChartCheckbox = document.getElementById('markethuntShowStockData');
            stockChartCheckbox?.addEventListener('change', (e) => {
                if (e.target.checked) {
                    document.getElementById('stockChartContainer').style.display = 'block';
                    renderStockChartWithItemId(itemId, 'stockChartContainer');
                } else {
                    document.getElementById('stockChartContainer').style.display = 'none';
                    renderChartWithItemId(itemId, 'chartContainer');
                }
            });

            // Set Plugin Settings listener
            const settingsLink = document.getElementById("markethuntSettingsLink");
            settingsLink.addEventListener('click', openPluginSettings);

            // Render chart
            renderChartWithItemId(itemId, "chartContainer");

            // Re-observe after mutation-inducing logic
            mpObserver.observe(mpObserverTarget, {
                childList: true,
                subtree: true
            });
        }
    }

    // detect history page and inject portfolio buttons
    const historyTab = mpObserverTarget.querySelector("[data-tab=history].active");
    if (SettingsController.getEnablePortfolioButtons() && historyTab) {
        mpObserver.disconnect();

        let rowElem = mpObserverTarget.querySelectorAll(".marketplaceMyListings tr.buy");
        rowElem.forEach(function(row) {
            if (!row.querySelector(".mousehuntActionButton.tiny.addPortfolio")) {
                let itemElem = row.querySelector(".marketplaceView-itemImage");
                const itemId = itemElem.getAttribute("data-item-id");

                let qtyElem = row.querySelector("td.marketplaceView-table-numeric");
                const qty = Number(qtyElem.innerText.replace(/\D/g, ''));

                let priceElem = row.querySelector("td.marketplaceView-table-numeric .marketplaceView-goldValue");
                const price = Number(priceElem.innerText.replace(/\D/g, ''));

                let buttonContainer = row.querySelector("td.marketplaceView-table-actions");
                let addPortfolioBtn = document.createElement("a");
                addPortfolioBtn.href = `https://${markethuntDomain}/portfolio.php?action=add_position&item_id=${itemId}&add_qty=${qty}&add_mark=${price}`;
                addPortfolioBtn.innerHTML = "<span>+ Portfolio</span>";
                addPortfolioBtn.className = "mousehuntActionButton tiny addPortfolio lightBlue";
                addPortfolioBtn.target = "_blank";
                addPortfolioBtn.style.display = "block";
                addPortfolioBtn.style.marginTop = "2px";
                buttonContainer.appendChild(addPortfolioBtn);
            }
        });

        mpObserver.observe(mpObserverTarget, {
            childList: true,
            subtree: true
        });
    }
});

// Initial observe
mpObserver.observe(mpObserverTarget, {
    childList: true,
    subtree: true
});

const marketplaceCssOverrides = `
.marketplaceView-item {
    padding-top: 10px;
}
.marketplaceView-item-content {
    padding-top: 10px;
    padding-bottom: 0px;
    min-height: 0px;
}
.marketplaceView-item-descriptionContainer {
    padding-bottom: 5px;
    padding-top: 5px;
}
.marketplaceView-item-averagePrice {
    margin-top: 5px;
}
.marketplaceView-item-footer {
    padding-top: 10px;
    padding-bottom: 10px;
}
.markethunt-cross-link {
    color: #000;
    font-size: 10px;
    background: #fff;
    display: block;
    padding: 0.1em 0;
    margin: 0.4em 0;
    box-shadow: #797979 1px 1px 1px 0;
    border-radius: 0.2em;
    border: 1px solid #a8a8a8;
}
.markethunt-cross-link:hover {
    color: white;
    background-color: ${primaryLineColor};
}
.markethunt-settings-btn-img {
    height: 26px;
    padding: 3px;
    margin: 0 5px 0 5px;
    border-radius: 999px;
    box-shadow: 0px 0px 3px gray;
}
.markethunt-settings-btn-img:hover {
    box-shadow: 0px 0px 3px 1px gray;
}
.inverted {
    filter: invert(1);
}
.markethunt-settings-row-input {
    display: flex;
    align-items: center;
    padding-right: 5px;
}
.markethunt-settings-row {
    display: flex;
    padding: 5px;
}
.markethunt-settings-row-description {
}
.marketplaceView-item-averagePrice.infobox-stat {
    text-align: left;
    margin-bottom: 14px;
    white-space: nowrap;
}
.marketplaceView-item-leftBlock .marketplaceHome-block-viewAll {
    margin-top: 5px;
}
.infobox-striped {
}
.infobox-small-spans span {
    font-size: 11px;
}
.infobox-small-spans .marketplaceView-goldValue::after {
    width: 17px;
    height: 13px;
}
`;

const materialSwitchCss = `
.cl-switch input[type="checkbox"] {
    display: none;
    visibility: hidden;
}

.cl-switch .switcher {
    display: inline-block;
    border-radius: 100px;
    width: 2.25em;
    height: 1em;
    background-color: #ccc;
    position: relative;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    vertical-align: middle;
    cursor: pointer;
}

.cl-switch .switcher:before {
    content: "";
    display: block;
    width: 1.3em;
    height: 1.3em;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    margin-top: -0.15em;
    position: absolute;
    top: 0;
    left: 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    margin-right: 0;
    -webkit-transition: all 0.2s;
    -moz-transition: all 0.2s;
    -ms-transition: all 0.2s;
    -o-transition: all 0.2s;
    transition: all 0.2s;
}

.cl-switch .switcher:active:before {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.6), 0 0 0 1em rgba(63, 81, 181, 0.3);
    transition: all, 0.1s;
}

.cl-switch .label {
    cursor: pointer;
    vertical-align: middle;
}

.cl-switch input[type="checkbox"]:checked+.switcher {
    background-color: #8591d5;
}

.cl-switch input[type="checkbox"]:checked+.switcher:before {
    left: 100%;
    margin-left: -1.3em;
    background-color: #3f51b5;
}

.cl-switch [disabled]:not([disabled="false"])+.switcher {
    background: #ccc !important;
}

.cl-switch [disabled]:not([disabled="false"])+.switcher:active:before {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2) !important;
}

.cl-switch [disabled]:not([disabled="false"])+.switcher:before {
    background-color: #e2e2e2 !important;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2) !important;
}`;

/*******************************
 * 
 *  Journal observer  
 * 
 *******************************/

// add_portfolio_journal.png minified with TinyPNG then converted to base 64
const addPfolioBtnImgData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALBAMAAACEzBAKAAAAFVBMVEUAAAAAAAD/swD06DD6zhj///8PDgMsru0CAAAAAXRSTlMA" +
      "QObYZgAAADhJREFUCNdjCBQEAwEGYWMwMERmmBkbCoIZhkAobMgg4igo6Cjo4sggpKQIhEqKyAwgQGEwQk0GAIl6DBhSGEjXAAAAAElFTkSuQmCC";

function addJournalButtons(supplyTransferJournalEntries) {
    supplyTransferJournalEntries.forEach(function(supplyTransferEntry) {
        const journalActionsElem = supplyTransferEntry.querySelector(".journalactions");
        const textElem = supplyTransferEntry.querySelector(".journaltext");

        if (journalActionsElem.querySelector("a.actionportfolio")) {
            return;
        }
        if (textElem.textContent.includes("SUPER|brie+") || textElem.textContent.includes("Passing Parcel")) {
            return;
        }
        // Disable button on sending transfers until portfolio sending feature implemented
        if (textElem.textContent.includes("I sent")) {
            return;
        }

        const addPortfolioBtn = document.createElement("a");
        addPortfolioBtn.href = "#";
        addPortfolioBtn.className = "actionportfolio";
        addPortfolioBtn.addEventListener('click', addSbTradeToPortfolio);
        journalActionsElem.prepend(addPortfolioBtn)
    });
}

async function updateItemMetadata() {
    console.log("Retrieving marketplace item data");
    return new Promise((resolve, reject) => {
        hg.utils.Marketplace.getMarketplaceData(
            function (response) {
                const itemMetadata = response.marketplace_items.reduce(
                    function (items, item) {
                        items[normalizeItemName(item.name)] = item.item_id;
                        return items;
                    },
                    {}
                );
                localStorage.markethuntItemMetadata = JSON.stringify(itemMetadata);
                localStorage.markethuntItemMetadataLastRetrieval = Date.now();
                resolve(itemMetadata);
            },
            function (e) {
                reject(e);
            }
        );
    });
}

function normalizeItemName(name) {
    return name.trim();
}

async function addSbTradeToPortfolio(event) {
    event.preventDefault(); // prevent scroll to top

    const targetTransferJournalEntry = event.target.parentNode.parentNode.parentNode;
    const textElem = targetTransferJournalEntry.querySelector(".journaltext");
    const targetEntryId = Number(targetTransferJournalEntry.dataset.entryId);
    // group 1 = qty, group 2 = item name, group 3 = trade partner snuid
    const regex = /^I received (\d[\d,]*) (.+?) from <a href.+snuid=(\w+)/

    // get item and partner data
    const targetEntryMatch = textElem.innerHTML.match(regex);
    const targetItemQty = Number(targetEntryMatch[1].replace(",", ""));
    const targetItemName = targetEntryMatch[2];
    const partnerSnuid = targetEntryMatch[3];
    const partnerName = textElem.querySelector('a').innerHTML;

    // get item ID
    let targetItemId = undefined;
    if (localStorage.markethuntItemMetadata !== undefined) {
        const itemMetadata = JSON.parse(localStorage.markethuntItemMetadata);
        targetItemId = itemMetadata[normalizeItemName(targetItemName)];
    }

    if (targetItemId === undefined) {
        $.toast({
            text: "Please wait ...",
            heading: localStorage.markethuntItemMetadata === undefined ? 'Downloading item data' : 'Reloading item data',
            icon: 'info',
            position: 'top-left',
            loader: false,  // Whether to show loader or not. True by default
        });
        const itemMetadata = await updateItemMetadata();
        await sleep(600); // allow user to read toast before opening new tab
        targetItemId = itemMetadata[normalizeItemName(targetItemName)];
    }

    // detect all sb send entries
    const allSupplyTransferJournalEntries = document.querySelectorAll("#journalContainer div.entry.supplytransferitem");
    const matchingSbSendEntries = Array.from(allSupplyTransferJournalEntries).reduce(
        function(results, journalEntry) {
            const innerHTML = journalEntry.querySelector(".journaltext").innerHTML;
            if (!innerHTML.includes(partnerSnuid)) {
                return results;
            }
            const candidateSbMatch = innerHTML.match(/^I sent (\d[\d,]*) SUPER\|brie\+ to <a href/);
            if (!candidateSbMatch) {
                return results;
            }
            const candidateSbSent = Number(candidateSbMatch[1].replace(",", ""));
            const candidateEntryId = Number(journalEntry.dataset.entryId);
            results.push({sbSent: candidateSbSent, entryId: candidateEntryId});
            return results;
        },
        []
    );

    // choose best sb send entry
    let bestSbSendEntryMatch = null;
    let bestMatchDistance = null;
    matchingSbSendEntries.forEach(function(candidateEntry) {
        const entryPairDistance = Math.abs(targetEntryId - candidateEntry.entryId);
        if (bestMatchDistance === null || bestMatchDistance > entryPairDistance) {
            bestSbSendEntryMatch = candidateEntry;
            bestMatchDistance = entryPairDistance;
        }
    });

    let avgSbPriceString = "none";
    if (bestSbSendEntryMatch !== null) {
        const avgSbPrice = bestSbSendEntryMatch.sbSent / targetItemQty;
        avgSbPriceString = avgSbPrice.toFixed(2);
    }

    // prepare modal message
    let actionMsg = 'Markethunt plugin: ';
    if (bestSbSendEntryMatch !== null) {
        actionMsg += `Found a transfer of ${bestSbSendEntryMatch.sbSent.toLocaleString()} SB to ${partnerName}.` + 
            ` Buy price has been filled in for you.`;
    } else {
        actionMsg += 'No matching SB transfer found. Please fill in buy price manually.';
    }

    // open in new tab
    window.open(`https://${markethuntDomain}/portfolio.php?action=add_position` + 
        `&action_msg=${encodeURIComponent(actionMsg)}` +
        `&item_id=${targetItemId}` + 
        `&add_qty=${targetItemQty}` + 
        `&add_mark=${avgSbPriceString}` +
        `&add_mark_type=sb`,
        '_blank');
}

const journalObserverTarget = document.querySelector("#mousehuntContainer");
const journalObserver = new MutationObserver(function () {
    // Disconnect and reconnect later to prevent mutation loop
    journalObserver.disconnect();

    const journalContainer = journalObserverTarget.querySelector("#journalContainer");
    if (SettingsController.getEnablePortfolioButtons() && journalContainer) {
        // add portfolio buttons
        const supplyTransferJournalEntries = journalContainer.querySelectorAll("div.entry.supplytransferitem");
        addJournalButtons(supplyTransferJournalEntries);
    }

    // Reconnect observer once all mutations done
    journalObserver.observe(journalObserverTarget, {
        childList: true,
        subtree: true
    });
});

// Initial observe
journalObserver.observe(journalObserverTarget, {
    childList: true,
    subtree: true
});

const journalCssOverrides = `
.journalactions a {
    display: inline-block;
}
.journalactions a.actionportfolio {
    margin-right: 5px;
    background: url('${addPfolioBtnImgData}');
    width: 16px;
}
`;

/*******************************
 * 
 *  Import Portfolio  
 * 
 *******************************/

function addTouchPoint() {
    if ($('.invImport').length === 0) {
        const invPages = $('.inventory .torn_pages');
        //Inventory History Button
        const invImportElem = document.createElement('li');
        invImportElem.classList.add('crafting');
        invImportElem.classList.add('invImport');
        const invImportBtn = document.createElement('a');
        invImportBtn.href = "#";
        invImportBtn.innerText = "Export to Markethunt";
        invImportBtn.onclick = function () {
            onInvImportClick();
        };
        const icon = document.createElement("div");
        icon.className = "icon";
        invImportBtn.appendChild(icon);
        invImportElem.appendChild(invImportBtn);
        $(invImportElem).insertAfter(invPages);
    }
}

function submitInv() {
    if (!document.forms["import-form"].reportValidity()) {
        return;
    }

    const gold = Number($('.hud_gold').text().replaceAll(/[^\d]/g, ''));

    if (isNaN(gold)) {
        return;
    }

    const itemsToGet = ['weapon','base', 'trinket', 'bait', 'skin', 'crafting_item','convertible', 'potion', 'stat','collectible','map_piece','adventure']; //future proof this to allow for exclusions
    
    hg.utils.UserInventory.getItemsByClass(itemsToGet, true, function(data) {
        let importData = {
            itemsArray: [],
            inventoryGold: gold
        };
        data.forEach(function(arrayItem, index) {
            importData.itemsArray[index] = [arrayItem.item_id, arrayItem.quantity];
        });

        $('#import-data').val(JSON.stringify(importData));
        document.forms["import-form"].submit();
    })
}

function onInvImportClick(){
    $.dialog({
        title: 'Export inventory to Markethunt',
        content: `
        <form id="import-form" name="import-form" action="https://${markethuntDomain}/import_portfolio.php" method="post" target="_blank">
                <label for="import-portfolio-name">Portfolio name: <span style="color: red">*</span></label>
                <input type="text" id="import-portfolio-name" name="import-portfolio-name" required pattern=".+"/>
                <input type="hidden" id="import-data" name="import-data"/>
        </form>
        <div id="export-dialog-buttons" class="jconfirm-buttons" style="float: none; margin-top: 10px;"><button type="button" class="btn btn-primary">Export</button></div>`,
        boxWidth: '600px',
        useBootstrap: false,
        closeIcon: true,
        draggable: true,
        onOpen: function(){
            $('#import-portfolio-name').val('Portfolio ' + (new Date()).toISOString().substring(0, 10));
            this.$content.find('button').click(function(){
                submitInv();
            });
        }
    });
}

/*******************************
 * 
 *  Final setup and add css  
 * 
 *******************************/

$(document).ready(function() {
    GM_addStyle(GM_getResourceText("jq_confirm_css"));
    GM_addStyle(GM_getResourceText("jq_toast_css"));
    GM_addStyle(marketplaceCssOverrides);
    GM_addStyle(journalCssOverrides);
    GM_addStyle(materialSwitchCss);

    addTouchPoint();

    const supplyTransferJournalEntries = document.querySelectorAll("#journalContainer div.entry.supplytransferitem");
    addJournalButtons(supplyTransferJournalEntries);
});