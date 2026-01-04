// ==UserScript==
// @name            OSRS Wiki Prices Extender
// @namespace       owpe
// @license         MIT
// @description     Extends the OSRS Wiki Prices page with flipping-oriented utilities
// @include         https://prices.runescape.wiki/osrs/owpe
// @version         2.0.2
// @run-at          document-end
// @grant           unsafeWindow
// @grant           GM_xmlhttpRequest
// @grant           GM_addStyle
// @grant           GM_getValue
// @grant           GM_setValue
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @require         https://unpkg.com/bootstrap-table@1.21.4/dist/bootstrap-table.min.js
// @require         https://unpkg.com/bootstrap-table@1.21.4/dist/extensions/sticky-header/bootstrap-table-sticky-header.min.js
// @require         https://unpkg.com/bootstrap-table@1.21.4/dist/extensions/multiple-sort/bootstrap-table-multiple-sort.js
// @require         https://unpkg.com/simple-statistics@7.8.8/dist/simple-statistics.min.js
// @connect         prices.runescape.wiki
// @downloadURL https://update.greasyfork.org/scripts/466192/OSRS%20Wiki%20Prices%20Extender.user.js
// @updateURL https://update.greasyfork.org/scripts/466192/OSRS%20Wiki%20Prices%20Extender.meta.js
// ==/UserScript==

const Log = console.log, DB = {}, ID = {}, print = false, REFRESH_DELAY = 100, REFRESH_BUFFER = 2000, requestsTotal = 13;
let timeSeriesCache = {};
const ss = window.ss;
const PIN_EMPTY = 'https://i.imgur.com/qKiR1MX.png';
const PIN_FILLED = 'https://i.imgur.com/UHrCX5q.png';
const IMG_HARDCODES = {
    '23490': 'Larran%27s_key_1.png',
    '26945': 'Pharaoh%27s_sceptre_%28uncharged%29.png',
    '27616': 'Ancient_essence_500.png'
};
const lastFetch = {
    'latest': {
        client: { dtm: null, data: null },
        server: { age: null, dtm: null, expiry: null, data: null },
    },
    '5m': {
        client: { dtm: null, data: null },
        server: { age: null, dtm: null, expiry: null, data: null },
    },
    '1h': {
        client: { dtm: null, data: null },
        server: { age: null, dtm: null, expiry: null, data: null },
    },
    '6h': {
        client: { dtm: null, data: null },
        server: { age: null, dtm: null, expiry: null, data: null },
    },
    '24h': {
        client: { dtm: null, data: null },
        server: { age: null, dtm: null, expiry: null, data: null },
    }
};
const defaultMaxPrice = 20000000;
const defaultCapital = 20000000;

var requestsDone = 0;
var AUTO_REFRESH = GM_getValue('OWPE_AutoRefresh', true);
var USE_MAX_PRICE = GM_getValue('OWPE_UseMaxPrice', true);
var USE_CAPITAL = GM_getValue('OWPE_UseCapital', true);
var MAX_PRICE_SHOWN = GM_getValue('OWPE_MaxPrice', defaultMaxPrice);
var CAPITAL_AMOUNT = GM_getValue('OWPE_Capital', defaultCapital);
var HIDE_GREY_DATA = GM_getValue('OWPE_HideGreyData', false);
var HIDE_RED_DATA = GM_getValue('OWPE_HideRedData', false);
var HIDE_LOW_Q1HVLR = GM_getValue('OWPE_HideLowQ1HVLR', false);
var COLUMN_SETTINGS = JSON.parse(GM_getValue('OWPE_ColumnSettings', '{}'));
var SCORE_WEIGHT = JSON.parse(GM_getValue('OWPE_ScoreWeight', '{}'));
var FAVOURITES = JSON.parse(GM_getValue('OWPE_Favourites', '{}'));

const CONFIG = {
    geTaxMultiplier: 0.02, // 2% tax on buy/sell
    confidenceLevel: 0.8, // Confidence for buy/sell order fills
    timeHorizon: {
        short: 5 * 60 * 1000, // 5 minutes in ms
        medium: 60 * 60 * 1000, // 1 hour in ms
        long: 4 * 60 * 60 * 1000 // 4 hours in ms (buy limit period)
    },
    volatilityWindow: 48, // How many data points to use for volatility calculation
    minDataPoints: 12, // Minimum data points required for reliable prediction
    riskAversion: 0.8, // 0-1 scale: higher values prioritize fill probability over profit
    opportunityCostWeight: 0.6, // 0-1 scale: weight for opportunity cost in decision making
    minAcceptableProb: 0.20, // e.g. require at least a 15% chance to book a limit order
    maxPriceRisk: 0.03, // Maximum acceptable price movement risk (as fraction)
    maxPriceCeilingFactor: 1.03, // No more than 3% above current high price
    minPriceFloorFactor: 0.97, // No less than 3% below current low price
    priceHistoryWeight: 0.7, // Weight more toward historical prices
    historicalQuantile: {
        buy: 0.1, // 5th percentile for buy (lower = more conservative)
        sell: 0.9 // 95th percentile for sell (higher = more conservative)
    },
    minHoldingTime: 5 * 60 * 1000, // Minimum holding time
    maxHoldingTime: 12 * 60 * 60 * 1000, // Maximum holding time
    maxWaitTime: 48 * 60 * 60 * 1000, // 48 hours maximum estimated wait
    minWaitTime: 5 * 60 * 1000,       // 5 minutes minimum wait time
    frequencyThreshold: 0.2 // Require price to have hit target at least 20% of time
};

Math.sum = (...a) => Array.prototype.reduce.call(a,(a,b) => a+b)
Math.avg = (...a) => Math.sum(...a)/a.length;

async function doGET(url) {
    let r = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            nocache: true,
            onerror: reject,
            ontimeout: reject,
            onload: e => resolve(e)
        });
    });
    if (requestsDone < requestsTotal)
        $('#loading').html(`Loaded ${(++requestsDone)}/${requestsTotal} API requests`);
    return r;
}

function jsonHeaders(s) {
    let safe = s.trim().replace(/"/g, '\\"').replace(/\: /g, '": "').replace(/\r\n/g, '",\r\n"');
    return JSON.parse('{"' + safe + '"}');
}

function setup() {
    unsafeWindow.document.head.innerHTML = `
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css">
        <link rel="stylesheet" href="https://unpkg.com/bootstrap-table@1.21.4/dist/bootstrap-table.min.css">
        <link href="https://unpkg.com/bootstrap-table@1.21.4/dist/extensions/sticky-header/bootstrap-table-sticky-header.css" rel="stylesheet">
        <style>
            body {background: #fff; font-size: 0.9em;}
            #main {margin: 1px 2px;}
            #loading {padding: 20px; font-size: 2em;}
            #maxprice {max-width: 8em;}
            .itemIcon { height: 30px; }
            .table>:not(caption)>*>* { padding: 0.15rem 0.15rem !important; }
            .bootstrap-table .fixed-table-toolbar .settings {
                position: relative;
                margin: 6px 0 6px 20px;
            }
            .bootstrap-table .fixed-table-container .table thead th .th-inner {
                padding: 0.125em 0.125em 0.125em 0.1em !important;
            }
            .form-check {
                min-height: 1.2rem;
                margin-bottom: 0.1rem;
            }
            .mb-3 {
                margin-bottom: 0.1rem !important;
                max-width: 350px;
            }
        </style>
    `;
    unsafeWindow.document.body.innerHTML = `
        <div id="main">
            <div id="loading">Loaded ${requestsDone}/${requestsTotal} API requests</div>
            <table id="items"></table>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
    `;
    
    unsafeWindow.document.title = 'OWPE';
}

async function main() {
    setup();
    await getData();
    $('#loading').remove();
    await showData();

    if (document.readyState === 'complete') {
        initializeUI();
    } else {
        unsafeWindow.addEventListener('load', initializeUI);
    }
}

function customSearch(data, text) {
    return data.filter(function (row) {
        let name = row.name.split('">')[1].toLowerCase().replace(/\'/g, '');
        let searchText = text.toLowerCase().replace(/\'/g, '');
        return name.indexOf(searchText) > -1
    });
}

function customSort(sortName, sortOrder, data) {
    let order = sortOrder === 'desc' ? -1 : 1;
    data.sort(function (a, b) {
        let _a = a[sortName];
        let _b = b[sortName];
        let f_a = FAVOURITES[a.name];
        let f_b = FAVOURITES[b.name];
        if (_a < _b || f_a)
            return order * -1;
        if (_a > _b || f_b)
            return order;
        return 0;
    });
}

function avg(a, b) {
    if (isNaN(a) && isNaN(b)) return 0;
    if (isNaN(a) || a == 0) return Math.round(b);
    if (isNaN(b) || b == 0) return Math.round(a);
    return Math.round((a + b) / 2);
}

function getPin(item) {
    let isFavourite = FAVOURITES[item.name] != null;
    return isFavourite ? PIN_FILLED : PIN_EMPTY;
}

function calcTax(price) {
    return Math.min(5000000, Math.floor((price ?? 0) * CONFIG.geTaxMultiplier));
}

function calcMargin(low, high) {
    return Math.max(0, (high ?? 0) - (low ?? 0));
}

function calcProfit(margin, tax) {
    return margin - tax;
}

function calcROI(low, profit) {
    return low > 0 ? (profit / low * 100) : 0;
}

function calcAlch(alch, low) {
    let n = alch - low - DB[ID[561]].lastbuy.price;
    return isNaN(n) ? '-' : n;
}

function getScore(item) {
    let p = 0.66;
    
    /* 
        Need a 'mean regression' vs Q1H 'profit'
            (Previous mean - current low) * min(limit, q1h.lowvolume)
    */
    
    let profit = Math.log(Math.max(1, item.profit));
    let profitLC = Math.log(Math.max(1, item.profitlimitcapital));
    
    // Initial score based on possible profit in set time blocks
    let q5mProfitWeighted = SCORE_WEIGHT.fastProfit ? Math.pow(item.profitq5m, 2) : item.profitq5m;
    let q1hProfitWeighted = SCORE_WEIGHT.fastProfit ? Math.sqrt(item.profitq1h) : item.profitq1h;
    let v0 = SCORE_WEIGHT.slowProfit ? item.profitq6h : (q1hProfitWeighted * Math.max(1, q5mProfitWeighted));
    //let v0 = item.profitq1h * Math.log(1 + item.roi);
    
    // Trade volumes at the low and high prices over past 5 minutes
    let q5low = Math.max(p / 10, SCORE_WEIGHT.lowVolume ? 1 : Math.log(1 + item.q5m.volume.low));
    let q5high = Math.max(p / 3, SCORE_WEIGHT.lowVolume ? 1 : Math.log(1 + item.q5m.volume.high));
    let q5mVol = SCORE_WEIGHT.slowProfit ? (1 + Math.log(q5low * q5high)) : Math.pow(q5low * q5high, SCORE_WEIGHT.fastProfit ? 2 : 1);
    let q1hVol = SCORE_WEIGHT.highVolume ? Math.pow(item.q1h.volume.total, 0.7) : 1;
    
    
    // Total profit over past hour at margin
    let h1 = Math.max(p, Math.log(item.q1h.avg.high == 0 || item.q1h.avg.low == 0 ? p : 1 + (calcROI(item.q1h.avg.low, calcProfit(calcMargin(item.q1h.avg.low, item.q1h.avg.high), calcTax(item.q1h.avg.high))) * Math.max(p, Math.min(item.limit, item.q1h.volume.total)))));
    
    // Total profit over past 6 hours at margin
    let h6 = Math.max(p, Math.log(item.q6h.avg.high == 0 || item.q6h.avg.low == 0 ? p : 1 + (calcROI(item.q6h.avg.low, calcProfit(calcMargin(item.q6h.avg.low, item.q6h.avg.high), calcTax(item.q6h.avg.high))) * Math.max(p, Math.min(item.limit * 2, item.q6h.volume.total)))));
    
    // Total profit over past day at margin
    let h24 = Math.max(p, Math.log(item.q24h.avg.high == 0 || item.q24h.avg.low == 0 ? p : 1 + (calcROI(item.q24h.avg.low, calcProfit(calcMargin(item.q24h.avg.low, item.q24h.avg.high), calcTax(item.q24h.avg.high))) * Math.max(p, Math.min(item.limit * 6, item.q24h.volume.total)))));
    
    // Whether current low price is manipulated compared to a day ago's average
    let ml = Math.pow(avg(item.q24h.avg.low, item.q24h.avg.high) / item.lastbuy.price, 2);
    let inf = Math.pow(Math.abs(1 - ((item.inflation.low + 100) / 100)), 2);
    
    // Buy:Sell ratio over past hour
    let q1h_ratio = Math.sqrt(item.q1h.volume.ratio);
    
    // If margin excess is significant, ie margin > low price, it's unreliable
    let mex = item.margin > item.lastbuy.price ? item.lastbuy.price / item.margin : 1;
    
    //let v1 = profit * v0 * q5low * q5high * q1hVol * h1 * h24 * ml * q1h_ratio * mex;
    //let v1 = profit * v0 * q5mVol * q1hVol * ml * q1h_ratio * mex * (SCORE_WEIGHT.slowProfit ? (h6 / inf) : 1);
    let v1 = profit * profitLC * v0 * q5mVol * q1hVol * ml * q1h_ratio * mex 
                * (SCORE_WEIGHT.slowProfit ? (h6 / inf) : 1);
    let v = (item.members ? 1 : p) * Math.log(v1);
    
    if (print) {
        let tab = '\t'.repeat(Math.max(0, 8 - Math.floor(item.name.length / 5)));
        Log(`${item.name} ${tab}v0: ${v0} \tq5mLowVol: ${item.q5m.volume.low} \tq5mHighVol: ${item.q5m.volume.high} \tq1hLowVol: ${item.q1h.volume.low} \tq1hHighVol: ${item.q1h.volume.high}`);
    }
    return isNaN(v) || v < 0.001 ? 0 : v;
}

function floatFormatter(value) {
    return typeof value == 'number' ? (parseFloat(value.toFixed(2))).toLocaleString('en-US') : value;
}

function priceFormatter(value) {
    return typeof value == 'number' ? value.toLocaleString('en-US') : value;
}

function ratioFormatter(value) {
    return typeof value == 'number' ? (value > 999 ? value.toLocaleString('en-US') : value.toFixed(1)) : value;
}

function roiFormatter(value) {
    return (typeof value == 'number' ? (parseFloat(value.toFixed(2))).toLocaleString('en-US') : value) + '%';
}

function rowStyle(row, index) {
    let style = {css: {}};
    let q5mValid = row.q5mvolume > 0 && row.q5mlow > 0;
    
    /*
        Weight based on mean disparity more specifically:
            Mild drop in low but inflated high = unsustainable flip
            Big drop in low safer but likely to get undercut
    */
    
    // If over-valued
    if (!!row.red)
        style.css.color = '#e00';
    
    // If either a fantastic q5m or q1h candidate
    if (!!row.bold)
        style.css['font-weight'] = 'bold';
    
    // If a reasonable overnight flip (high volume or very stable)
    if (!!row.blue)
        style.css['background-color'] = '#ddf';
    
    // If either a reasonable q5m or q1h candidate
    if (!!row.green)
        style.css['background-color'] = '#dfd';
    
    // If unreliably low trade volume or suspiciously large margins
    if (!!row.grey)
        style.css.color = '#bbb';
    
    return style;
}

function now() {
    return (new Date).getTime();
}

function getItemData() {
    let itemData = [];
    
    for (let name in DB) {
        let item = DB[name];
        let i = {
            members: `<img src="https://oldschool.runescape.wiki/images/${item.members ? 'Member' : 'Free-to-play'}_icon.png">`,
            icon: `<div class="itemIcon"><img src="${item.icon}"></div>`,
            id: item.id,
            name: `<a href="https://prices.runescape.wiki/osrs/item/${item.id}" target="_blank">${item.name}</a>`,
            limit: item.limit,
            q7davg3d: avg(item.q7d.avg.low3d, item.q7d.avg.high3d),
            q24hvolume: item.q24h.volume.total,
            q24havg: avg(item.q24h.avg.low, item.q24h.avg.high),
            q1hvolume: item.q1h.volume.total,
            q1hratio: item.q1h.volume.ratio,
            q1havg: avg(item.q1h.avg.low, item.q1h.avg.high),
            q5mvolume: item.q5m.volume.total,
            q5mlow: item.q5m.avg.low,
            q5mhigh: item.q5m.avg.high,
            alch: item.alch,
            lastbuy: item.lastbuy.price,
            lastsell: item.lastsell.price,
            margin: item.margin,
            profit: item.profit,
            profitq1h: item.profitq1h,
            profitq5m: item.profitq5m,
            profitlimitcapital: item.profitlimitcapital,
            q1hvolumelimitratio: item.q1hvolumelimitratio,
            roi: item.roi,
            inflationlow: item.inflation.low,
            inflationhigh: item.inflation.high,
            inflationmean: item.inflation.avg,
            score: getScore(item),
            pin: `<div class="favourite" name="${item.name}"><img src="${getPin(item)}"></div>`,
            show: item.show ?? true
        };
        
        let q5mValid = i.q5mvolume > 0 && i.q5mlow > 0;

        // If over-valued
        if (i.inflationlow > 0 || i.inflationhigh > 10)
            i.red = true;
        
        // If either a fantastic q5m or q1h candidate
        if (i.profitq5m > 150000 && i.roi >= 4 && i.roi < 500 && i.q1hratio >= 0.8 && q5mValid)
            i.bold = true;
        if (i.profitq1h > 250000 && i.roi >= 3 && i.roi < 500 && i.q1hratio >= 1 && q5mValid && i.inflationlow <= 0)
            i.bold = true;
        
        // If a reasonable overnight flip (high volume or very stable)
        if ((i.profitq6h > 250000) && i.roi >= 1 && i.roi < 50 && i.inflationlow <= 2 && i.q1hvolume > i.limit)
            i.blue = true;
        
        // If either a reasonable q5m or q1h candidate
        if ((i.profitq5m > 100000 || i.profitq1h > 100000) && i.roi >= 2 && i.q5mvolume > 0)
            i.green = true;
        
        // If unreliably low trade volume or suspiciously large margins
        if (i.q5mvolume == null || i.q5mvolume == 0 || i.margin > i.lastbuy)
            i.grey = true;
        
        if ((!!HIDE_GREY_DATA && !!i.grey) || (!!HIDE_RED_DATA && !!i.red) || (!!HIDE_LOW_Q1HVLR && i.q1hvolumelimitratio < 1))
            i.show = false;
        
        if ((!USE_MAX_PRICE || i.lastbuy <= MAX_PRICE_SHOWN) && (!USE_CAPITAL || i.lastbuy <= CAPITAL_AMOUNT) && !!i.show)
            itemData.push(i);
    }

    return itemData;
}

async function showData() {
    $('#items').bootstrapTable({
        pagination: true,
        pageSize: 200,
        search: true,
        searchAlign: 'left',
        sortName: 'score',
        sortOrder: 'desc',
        rowStyle: rowStyle,
        customSearch: customSearch,
        customSort: customSort,
        columns: [
            {field: 'members', title: ''},
            {field: 'icon', title: ''},
            {field: 'name', title: 'Name', sortable: true},
            {field: 'limit', title: 'GE Limit', formatter: priceFormatter, titleTooltip: 'Purchase limit per 4 hours'},
            {field: 'q24hvolume', title: '24-hour Volume', sortable: true, formatter: priceFormatter, titleTooltip: 'Total volume traded over past 24 hours'},
            {field: 'q1hvolume', title: '1-hour Volume', sortable: true, formatter: priceFormatter, titleTooltip: 'Total volume traded over past 1 hour'},
            {field: 'q5mvolume', title: '5-min Volume', sortable: true, formatter: priceFormatter, visible: false, titleTooltip: 'Total volume traded over past 5 minutes'},
            {field: 'q7davg3d', title: '7-day Avg', sortable: true, formatter: priceFormatter, titleTooltip: 'Average price (low+high)/2 over past 7 days'},
            {field: 'q24havg', title: '24-hour Avg', sortable: true, formatter: priceFormatter, titleTooltip: 'Average price (low+high)/2 over past 24 hours'},
            {field: 'q1havg', title: '1-hour Avg', sortable: true, formatter: priceFormatter, titleTooltip: 'Average price (low+high)/2 over past 1 hour'},
            {field: 'q1hratio', title: '1-hour Buy:Sell Ratio', formatter: floatFormatter, titleTooltip: 'Volume Ratio Low:High over past 1 hour'},
            {field: 'q5mlow', title: '5-min Low', sortable: true, formatter: priceFormatter, titleTooltip: 'Lowest price over the last 5 minutes', visible: !COLUMN_SETTINGS.hideQ5MPrices},
            {field: 'q5mhigh', title: '5-min High', sortable: true, formatter: priceFormatter, titleTooltip: 'Highest price over the last 5 minutes', visible: !COLUMN_SETTINGS.hideQ5MPrices},
            {field: 'lastbuy', title: 'Last Low', sortable: true, formatter: priceFormatter, titleTooltip: 'Latest lowest price'},
            {field: 'lastsell', title: 'Last High', sortable: true, formatter: priceFormatter, titleTooltip: 'Latest highest price'},
            {field: 'margin', title: 'Margin', sortable: true, formatter: priceFormatter, titleTooltip: 'Latest high - latest low', visible: !COLUMN_SETTINGS.hideMargin},
            {field: 'profit', title: 'Profit', sortable: true, formatter: priceFormatter, titleTooltip: 'Margin - tax (1%)'},
            {field: 'profitq1h', title: 'Est. Profit 1-hour', sortable: true, formatter: priceFormatter, titleTooltip: 'Projected profit if you flipped at the volume traded past 1 hour OR the GE limit (whichever is lower)'},
            {field: 'profitq5m', title: 'Est. Profit 5-min', sortable: true, formatter: priceFormatter, titleTooltip: 'Projected profit if you flipped at the volume traded past 5 minutes OR the GE limit (whichever is lower)'},
            {field: 'profitlimitcapital', title: 'Profit Limit Capital', sortable: true, formatter: priceFormatter, titleTooltip: 'Profit if you flipped at the trade limit or using all available capital (whichever is lower)'},
            {field: 'q1hvolumelimitratio', title: 'Q1HVol:Limit Ratio', sortable: true, formatter: ratioFormatter, titleTooltip: 'Ratio of 1-hour volume to the buy limit'},
            {field: 'roi', title: 'ROI%', sortable: true, formatter: roiFormatter, titleTooltip: 'Return on investment'},
            {field: 'inflationlow', title: 'Low Disparity%', sortable: true, formatter: roiFormatter, titleTooltip: 'Whether the current low price is higher than the historical low'},
            {field: 'inflationhigh', title: 'High Disparity%', sortable: true, formatter: roiFormatter, titleTooltip: 'Whether the current high price is higher than the historical high'},
            {field: 'inflationmean', title: 'Mean Disparity%', sortable: true, formatter: roiFormatter, titleTooltip: 'Whether the current mean price is higher than the historical average'},
            {field: 'alch', title: 'Alch Profit', sortable: true, formatter: priceFormatter, titleTooltip: 'Projected high alch profit if you buy the item/nature runes at the latest low price', visible: !COLUMN_SETTINGS.hideAlch},
            {field: 'score', title: 'Score', sortable: true, formatter: floatFormatter, titleTooltip: 'Algorithmic score based on a variety of factors attempting to identify good flips', visible: !COLUMN_SETTINGS.hideScore},
            {field: 'predict', title: 'Predict', sortable: true,
                formatter: function(value, row) { return `<button class="predict-btn" data-id="${row.id}">Predict</button>`; },
                events: { 'click .predict-btn': function(e, value, row) { showPredictionDetails(row.id, row.name); } },
                titleTooltip: 'Pr3ediction model', visible: !COLUMN_SETTINGS.hidePrediction
            }
            //{field: 'pin', title: 'Pin', sortable: true, titleTooltip: 'Pin row to top'}
        ],
        data: getItemData(),
        stickyHeader: true,
        onClickCell: function(field, value, row, element) {
            if (field == 'score')
                getScore(DB[ID[row.id]], true);
        }
    });
    
    $('div.fixed-table-toolbar').append(`
        <div class="float-left settings">
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="preferenceLowVolume" ${SCORE_WEIGHT.lowVolume ? 'checked' : ''}>
                <label class="form-check-label" for="preferenceLowVolume">Prefer low volume items</label>
            </div>
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="preferenceHighVolume" ${SCORE_WEIGHT.highVolume ? 'checked' : ''}>
                <label class="form-check-label" for="preferenceHighVolume">Prefer high volume items</label>
            </div>
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="preferenceSlowProfit" ${SCORE_WEIGHT.slowProfit ? 'checked' : ''}>
                <label class="form-check-label" for="preferenceSlowProfit">Prefer slower/stable profits</label>
            </div>
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="preferenceFastProfit" ${SCORE_WEIGHT.fastProfit ? 'checked' : ''}>
                <label class="form-check-label" for="preferenceFastProfit">Prefer faster/volatile profits</label>
            </div>
        </div>
        <div class="float-left settings">
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <div class="input-group-text" style="display: block;">
                        <input type="checkbox" id="usemaxprice" aria-label="Use maximum single item price" ${USE_MAX_PRICE ? 'checked' : ''}>
                        <span style="color: #777;">Max per item price shown</span>
                    </div>
                </div>
                <input type="text" class="form-control" id="maxprice" aria-label="GP price" placeholder="Max per item price" value="${MAX_PRICE_SHOWN}">
            </div>
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <div class="input-group-text" style="display: block;">
                        <input type="checkbox" id="usecapital" aria-label="Use maximum single item price" ${USE_CAPITAL ? 'checked' : ''}>
                        <span style="color: #777;">Total GP to invest</span>
                    </div>
                </div>
                <input type="text" class="form-control" id="capital" aria-label="GP price" placeholder="GP amount" value="${CAPITAL_AMOUNT}">
            </div>
        </div>
        <div class="float-left settings">
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="columnToggleMargin" ${COLUMN_SETTINGS.hideMargin ? 'checked' : ''}>
                <label class="form-check-label" for="columnToggleMargin">Hide margin column</label>
            </div>
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="columnToggleAlch" ${COLUMN_SETTINGS.hideAlch ? 'checked' : ''}>
                <label class="form-check-label" for="columnToggleAlch">Hide alch profit column</label>
            </div>
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="columnToggleScore" ${COLUMN_SETTINGS.hideScore ? 'checked' : ''}>
                <label class="form-check-label" for="columnToggleScore">Hide score column</label>
            </div>
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="columnToggleQ5MPrices" ${COLUMN_SETTINGS.hideQ5MPrices ? 'checked' : ''}>
                <label class="form-check-label" for="columnToggleq5mPrices">Hide Q5M Low/High Prices</label>
            </div>
        </div>
        <div class="float-left settings">
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="columnToggleGreyData" ${HIDE_GREY_DATA ? 'checked' : ''}>
                <label class="form-check-label" for="columnToggleGreyData">Hide Greyed Items</label>
            </div>
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="columnToggleRedData" ${HIDE_RED_DATA ? 'checked' : ''}>
                <label class="form-check-label" for="columnToggleRedData">Hide Red Items</label>
            </div>
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="columnToggleLowQ1HVLR" ${HIDE_LOW_Q1HVLR ? 'checked' : ''}>
                <label class="form-check-label" for="columnToggleLowQ1HVLR">Hide Low Q1HVLR Items</label>
            </div>
        </div>
        <div class="float-left settings">
            <!--<button type="button" class="btn btn-primary btn-sm" id="refresh">Refresh Data</button>-->
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="autoRefresh" ${AUTO_REFRESH ? 'checked' : ''}>
                <label class="form-check-label" for="autoRefresh">Auto refresh data <span id="refreshTimer"></span></label>
            </div>
        </div>
    `);
    
    $('#maxprice').change(function(e) {
        let textVal = e.target.value.replace(/ ,/g, '');
        let mult = textVal.match(/[mM]/g) ? 1000000 : (textVal.match(/[kK]/g) ? 1000 : 1);
        let maxVal = parseFloat(textVal.match(/[0-9\.]+/g)[0] ?? defaultMaxPrice) * mult;
        MAX_PRICE_SHOWN = maxVal;
        GM_setValue('OWPE_MaxPrice', MAX_PRICE_SHOWN);
    });
    
    $('#capital').change(function(e) {
        let textVal = e.target.value.replace(/ ,/g, '');
        let mult = textVal.match(/[mM]/g) ? 1000000 : (textVal.match(/[kK]/g) ? 1000 : 1);
        let maxVal = parseFloat(textVal.match(/[0-9\.]+/g)[0] ?? defaultCapital) * mult;
        CAPITAL_AMOUNT = maxVal;
        GM_setValue('OWPE_Capital', CAPITAL_AMOUNT);
        
        for (const item in DB) {
            item.profitlimitcapital = item?.lastbuy?.price ? item.profit * Math.min(item.limit, Math.floor(CAPITAL_AMOUNT / item.lastbuy.price)) : 0;
        }
        $('#items').bootstrapTable('load', getItemData());
    });
    
    $('#usemaxprice').change(function(e) {
        let maxPriceToggle = $(e.target).is(":checked");
        USE_MAX_PRICE = maxPriceToggle;
        GM_setValue('OWPE_UseMaxPrice', USE_MAX_PRICE);
    });
    
    $('#usecapital').change(function(e) {
        let capitalToggle = $(e.target).is(":checked");
        USE_CAPITAL = capitalToggle;
        GM_setValue('OWPE_UseCapital', USE_CAPITAL);
    });
    
    $('#columnToggleMargin').change(function(e) {
        COLUMN_SETTINGS.hideMargin = $(e.target).is(":checked");
        $('#items').bootstrapTable(($(e.target).is(":checked") ? 'hide' : 'show') + 'Column', 'margin');
        spaceToLinebreak();
        GM_setValue('OWPE_ColumnSettings', JSON.stringify(COLUMN_SETTINGS));
    });
    
    $('#columnToggleAlch').change(function(e) {
        COLUMN_SETTINGS.hideAlch = $(e.target).is(":checked");
        $('#items').bootstrapTable(($(e.target).is(":checked") ? 'hide' : 'show') + 'Column', 'alch');
        spaceToLinebreak();
        GM_setValue('OWPE_ColumnSettings', JSON.stringify(COLUMN_SETTINGS));
    });
    
    $('#columnToggleQ5MPrices').change(function(e) {
        COLUMN_SETTINGS.hideQ5MPrices = $(e.target).is(":checked");
        $('#items').bootstrapTable(($(e.target).is(":checked") ? 'hide' : 'show') + 'Column', 'q5mlow');
        $('#items').bootstrapTable(($(e.target).is(":checked") ? 'hide' : 'show') + 'Column', 'q5mhigh');
        spaceToLinebreak();
        GM_setValue('OWPE_ColumnSettings', JSON.stringify(COLUMN_SETTINGS));
    });
    
    $('#columnToggleGreyData').change(function(e) {
        let greyDataToggle = $(e.target).is(":checked");
        HIDE_GREY_DATA = greyDataToggle;
        GM_setValue('OWPE_HideGreyData', HIDE_GREY_DATA);
        
        for (const name in DB) {
            const item = DB[name];
            if (!!HIDE_GREY_DATA && !!item.grey) {
                item.show = false;
                console.log(item);
            }
        }
        
        $('#items').bootstrapTable('load', getItemData());
    });
    
    $('#columnToggleRedData').change(function(e) {
        let redDataToggle = $(e.target).is(":checked");
        HIDE_RED_DATA = redDataToggle;
        GM_setValue('OWPE_HideRedData', HIDE_RED_DATA);
        
        for (const name in DB) {
            const item = DB[name];
            if (!!HIDE_RED_DATA && !!item.red) {
                item.show = false;
            console.log(item);}
        }
        
        $('#items').bootstrapTable('load', getItemData());
    });
    
    $('#columnToggleLowQ1HVLR').change(function(e) {
        let lowQ1HVLRToggle = $(e.target).is(":checked");
        HIDE_LOW_Q1HVLR = lowQ1HVLRToggle;
        GM_setValue('OWPE_HideLowQ1HVLR', HIDE_LOW_Q1HVLR);
        
        for (const name in DB) {
            const item = DB[name];
            if (!!HIDE_LOW_Q1HVLR && item.q1hvolumelimitratio < 1) {
                item.show = false;
            }
        }
        
        $('#items').bootstrapTable('load', getItemData());
    });
    
    $('#columnToggleScore').change(function(e) {
        COLUMN_SETTINGS.hideScore = $(e.target).is(":checked");
        $('#items').bootstrapTable(($(e.target).is(":checked") ? 'hide' : 'show') + 'Column', 'score');
        spaceToLinebreak();
        GM_setValue('OWPE_ColumnSettings', JSON.stringify(COLUMN_SETTINGS));
    });
    
    $('#preferenceLowVolume').change(function(e) {
        SCORE_WEIGHT.lowVolume = $(e.target).is(":checked");
        if ($(e.target).is(":checked") && $('#preferenceHighVolume').is(":checked"))
            $('#preferenceHighVolume').click();
        updateScoreWeight();
    });
    
    $('#preferenceHighVolume').change(function(e) {
        SCORE_WEIGHT.highVolume = $(e.target).is(":checked");
        if ($(e.target).is(":checked") && $('#preferenceLowVolume').is(":checked"))
            $('#preferenceLowVolume').click();
        updateScoreWeight();
    });
    
    $('#preferenceSlowProfit').change(function(e) {
        SCORE_WEIGHT.slowProfit = $(e.target).is(":checked");
        if ($(e.target).is(":checked") && $('#preferenceFastProfit').is(":checked"))
            $('#preferenceFastProfit').click();
        updateScoreWeight();
    });
    
    $('#preferenceFastProfit').change(function(e) {
        SCORE_WEIGHT.fastProfit = $(e.target).is(":checked");
        if ($(e.target).is(":checked") && $('#preferenceSlowProfit').is(":checked"))
            $('#preferenceSlowProfit').click();
        updateScoreWeight();
    });
    
    $('#autoRefresh').change(function(e) {
        AUTO_REFRESH = $(e.target).is(":checked");
        if (AUTO_REFRESH) {
            refreshTableData(['all']);
            refreshTableDataLoop();
        }
        GM_setValue('OWPE_AutoRefresh', AUTO_REFRESH);
    });
    
    $('div.favourite').click(function(e) {
        console.log(e.target);
        let div = $(e.target).parent('div.favourite');
        let name = div.attr('name');
        let pinIsEmpty = div.find('img').attr('src') == PIN_EMPTY;
        let pinIsFull = div.find('img').attr('src') == PIN_FILLED;
        let item = DB[name];
        console.log(`name: ${name}  pinIsEmpty: ${pinIsEmpty}  pinIsFull: ${pinIsFull}`);
        console.log(item);
        FAVOURITES[name] = pinIsEmpty && !pinIsFull;
        GM_setValue('OWPE_Favourites', JSON.stringify(FAVOURITES));
        div.html(`<img src="${FAVOURITES[name] ? PIN_FILLED : PIN_EMPTY}">`);
    });
    
    $("#refresh").click(async function() {
        await refreshTableData(['all']);
    });
    
    spaceToLinebreak();
    await refreshTableDataLoop();
}

function updateScoreWeight() {
    $('#items').bootstrapTable('load', getItemData());
    GM_setValue('OWPE_ScoreWeight', JSON.stringify(SCORE_WEIGHT));
}

async function refreshTableData(times) {
    if (times[0] == 'all')
        await getData();
    else {
        let dataReq = [];
        if (times[0] != null && times.length > 0) {
            for (let i = 0; i < times.length; i++) {
                dataReq.push(refreshHistoricalPrices(times[i], times[i].substring(1)));
            }
        }
        dataReq.push(refreshLatestPrices());
        await Promise.all(dataReq);
    }
    $('#items').bootstrapTable('load', getItemData());
}

async function refreshTableDataLoop() {
    let now = (new Date).getTime();
    $('#refreshTimer').html(`(${(((lastFetch.latest.server.expiry + REFRESH_BUFFER) - (1000 * Math.floor(now / 1000))) / 1000)})`);
    
    if (now > lastFetch['5m'].server.expiry + (REFRESH_BUFFER / 2))
        await refreshTableData(['q5m']);
    else if (now > lastFetch['1h'].server.expiry + (REFRESH_BUFFER / 2))
        await refreshTableData(['q5m', 'q1h']);
    else if (now > lastFetch['6h'].server.expiry + (REFRESH_BUFFER / 2))
        await refreshTableData(['q5m', 'q1h', 'q6h']);
    else if (now > lastFetch['24h'].server.expiry + (REFRESH_BUFFER / 2))
        await refreshTableData(['all']);
    else if (now > (lastFetch.latest.server.expiry + REFRESH_BUFFER))
        await refreshTableData([null]);
    
    if (AUTO_REFRESH)
        setTimeout(refreshTableDataLoop, REFRESH_DELAY);
}

function spaceToLinebreak() {
    $('#items').find('thead').find('div.th-inner').map(function() {
        this.innerHTML = this.innerHTML.replace(/ /g, '<br />');
    });
}

function iconURL(item) {
    let s = escape(item.icon.replace(/ /g, '_')).replace(/\+/g, '%2B');
    return IMG_HARDCODES[item.id] ? IMG_HARDCODES[item.id] : s;
}

async function getItemMapping() {
    let mapReq = await doGET('https://prices.runescape.wiki/api/v1/osrs/mapping');
    let map = JSON.parse(mapReq.responseText);
    for (let item of map) {
        ID[item.id] = item.name;
        DB[item.name] = {
            id: item.id,
            name: item.name,
            icon: 'https://oldschool.runescape.wiki/images/' + iconURL(item),
            members: item.members,
            limit: item.limit ?? 4,
            value: item.value,
            lowalch: item.lowalch,
            highalch: item.highalch,
            lastsell: {price: 0, dtm: 0},
            lastbuy: {price: 0, dtm: 0},
            q5m: {volume: {low: 0, high: 0}, avg: {low: 0, high: 0}},
            q1h: {volume: {low: 0, high: 0}, avg: {low: 0, high: 0}},
            q6h: {volume: {low: 0, high: 0}, avg: {low: 0, high: 0}},
            q24h: {volume: {low: 0, high: 0}, avg: {low: 0, high: 0}},
            q2d: {volume: {low: 0, high: 0}, avg: {low: 0, high: 0}},
            q3d: {volume: {low: 0, high: 0}, avg: {low: 0, high: 0}},
            q4d: {volume: {low: 0, high: 0}, avg: {low: 0, high: 0}},
            q5d: {volume: {low: 0, high: 0}, avg: {low: 0, high: 0}},
            q6d: {volume: {low: 0, high: 0}, avg: {low: 0, high: 0}},
            q7d: {volume: {low: 0, high: 0}, avg: {low: 0, high: 0}},
            q14d: {volume: {low: 0, high: 0}, avg: {low: 0, high: 0}},
            tax: 0,
            margin: 0,
            profit: 0,
            profitq5m: 0,
            profitq1h: 0,
            profitq6h: 0,
            profitlimitcapital: 0,
            q1hvolumelimitratio: 0,
            roi: 0,
            inflation: {low: 0, high: 0, avg: 0},
            alch: 0
        };
    }
}

async function refreshVolumes() {
    let latestReq = await doGET('https://prices.runescape.wiki/api/v1/osrs/volumes');
    let latest = JSON.parse(latestReq.responseText).data;
    for (let id in latest) {
        let name = ID[id], item = latest[id];
        if (DB[name] == null)
            continue;
        DB[name].daily.volume = item.high ?? 0;
    }
    console.log(`Refreshed volumes at ${(new Date).toString()}`);
}

async function refreshLatestPrices() {
    let latestReq = await doGET('https://prices.runescape.wiki/api/v1/osrs/latest');
    let reqHeaders = jsonHeaders(latestReq.responseHeaders);
    let latest = JSON.parse(latestReq.responseText).data;
    
    lastFetch.latest.server.age = reqHeaders.age == null ? 57 : parseInt(reqHeaders.age);
    lastFetch.latest.server.dtm = new Date(reqHeaders.date);
    
    Log(`Refreshed latest prices at ${lastFetch.latest.server.dtm.toString()}, Age=${reqHeaders.age}`);
    if (lastFetch.latest.server.data == latestReq.responseText) {
        Log(`Turns out there wasn't any new latest prices? Expiry should have been ${(new Date(lastFetch.latest.server.dtm.getTime() + (1000 * lastFetch.latest.server.age)))}`);
        if (reqHeaders.age == null)
            lastFetch.latest.server.age = 59;
    }
    else
        lastFetch.latest.server.data = latestReq.responseText;
    
    lastFetch.latest.server.expiry = lastFetch.latest.server.dtm.getTime() + (1000 * (60 - lastFetch.latest.server.age));
    if (isNaN(lastFetch.latest.server.expiry))
        Log(lastFetch.latest.server.dtm, lastFetch.latest.server.age);
    
    for (let id in latest) {
        let name = ID[id], item = latest[id];
        if (DB[name] == null)
            continue;
        DB[name].lastsell.price = item.high ?? 0;
        DB[name].lastsell.dtm = item.highTime;
        DB[name].lastbuy.price = item.low ?? 0;
        DB[name].lastbuy.dtm = item.lowTime;
        DB[name].tax = calcTax(item.high);
        DB[name].margin = calcMargin(item.low, item.high);
        DB[name].profit = calcProfit(DB[name].margin, DB[name].tax);
        DB[name].profitlimitcapital = DB[name].profit * Math.min(DB[name].limit, Math.floor(CAPITAL_AMOUNT / DB[name].lastbuy.price));
        DB[name].roi = calcROI(DB[name].lastbuy.price, DB[name].profit);
        DB[name].alch = calcAlch(DB[name].highalch, DB[name].lastbuy.price);
    }
}

async function refreshHistoricalPrices(time, endpoint, timestamp) {
    let timestampQuery = timestamp ? ('?timestamp=' + timestamp) : '';
    let req = await doGET('https://prices.runescape.wiki/api/v1/osrs/' + endpoint + timestampQuery);
    let reqHeaders = jsonHeaders(req.responseHeaders);
    let reqData = JSON.parse(req.responseText).data;
    
    if (['5m', '1h', '6h', '24h'].includes(endpoint)) {
        lastFetch[endpoint].server.age = parseInt(reqHeaders.age) ?? 5;
        lastFetch[endpoint].server.dtm = new Date(reqHeaders.date);
        lastFetch[endpoint].server.data = req.responseText;
        lastFetch[endpoint].server.expiry = new Date(reqHeaders.expires);
        
        Log(`Refreshed ${time} prices at ${lastFetch[endpoint].server.dtm.toString()}`);
        
        if (isNaN(lastFetch.latest.server.expiry))
            Log(lastFetch[endpoint].server.dtm, lastFetch[endpoint].server.age);
    }
    
    for (let id in reqData) {
        let name = ID[id], item = reqData[id];
        if (DB[name] == null)
            continue;
        DB[name][time].volume.low = item.lowPriceVolume ?? 0;
        DB[name][time].volume.high = item.highPriceVolume ?? 0;
        DB[name][time].volume.total = (item.lowPriceVolume + item.highPriceVolume) ?? 0;
        DB[name][time].volume.ratio = (item.lowPriceVolume ?? 0) / Math.max(1, item.highPriceVolume ?? 1);
        DB[name][time].avg.low = item.avgLowPrice ?? 0;
        DB[name][time].avg.high = item.avgHighPrice ?? 0;
        DB[name][time].avg.mean = (DB[name][time].avg.low + DB[name][time].avg.high) / 2;
        
        if (time == 'q5m')
            DB[name].profitq5m = DB[name].profit * Math.min(Math.min(DB[name].q5m.volume.low, DB[name].q5m.volume.high), DB[name].limit);
        else if (time == 'q1h') {
            DB[name].profitq1h = DB[name].profit * Math.min(Math.min(DB[name].q1h.volume.low, DB[name].q1h.volume.high), DB[name].limit);
            DB[name].q1hvolumelimitratio = Math.min(DB[name].q1h.volume.low, DB[name].q1h.volume.high) / Math.max(1, DB[name].limit);
        }
        else if (time == 'q6h')
            DB[name].profitq6h = DB[name].profit * Math.min(Math.min(DB[name].q6h.volume.low, DB[name].q6h.volume.high), DB[name].limit * 2);
        else if (time == 'q7d') {
            DB[name].q7d.volume.total3d = DB[name].q5d.volume.total + DB[name].q6d.volume.total + DB[name].q7d.volume.total;
            DB[name].q7d.volume.ratio3d = Math.sum(
                DB[name].q24h.volume.low,
                DB[name].q3d.volume.low,
                DB[name].q4d.volume.low,
                DB[name].q5d.volume.low,
                DB[name].q6d.volume.low,
                DB[name].q7d.volume.low
            ) / Math.max(1, Math.sum(
                DB[name].q24h.volume.high,
                DB[name].q3d.volume.high,
                DB[name].q4d.volume.high,
                DB[name].q5d.volume.high,
                DB[name].q6d.volume.high,
                DB[name].q7d.volume.high
            ));
            DB[name].q7d.avg.low3d = Math.avg(
                DB[name].q24h.avg.low,
                DB[name].q3d.avg.low,
                DB[name].q4d.avg.low,
                DB[name].q5d.avg.low,
                DB[name].q6d.avg.low,
                DB[name].q7d.avg.low
            );
            DB[name].q7d.avg.high3d = Math.avg(
                DB[name].q24h.avg.high,
                DB[name].q3d.avg.high,
                DB[name].q4d.avg.high,
                DB[name].q5d.avg.high,
                DB[name].q6d.avg.high,
                DB[name].q7d.avg.high
            );
            DB[name].q7d.avg.mean3d = (DB[name].q7d.avg.low3d + DB[name].q7d.avg.high3d) / 2;
        }
        else if (time == 'q14d') {
            DB[name].inflation.low = (-1 + (DB[name].lastbuy.price / ((DB[name].q14d.avg.low + (2 * DB[name].q7d.avg.low3d) + DB[name].q24h.avg.low) / 4))) * 100;
            DB[name].inflation.high = (-1 + (DB[name].lastsell.price / ((DB[name].q14d.avg.high + (2 * DB[name].q7d.avg.high3d) + DB[name].q24h.avg.high) / 4))) * 100;
            DB[name].inflation.avg = (-1 + (((DB[name].lastbuy.price + DB[name].lastsell.price) / 2) / ((DB[name].q14d.avg.mean + (2 * DB[name].q7d.avg.mean3d) + DB[name].q24h.avg.mean) / 4))) * 100;
        }
    }
}

async function getData() {
    try {
        await getItemMapping();
        await refreshLatestPrices();
        
        await Promise.all([
            refreshHistoricalPrices('q5m', '5m'),
            refreshHistoricalPrices('q1h', '1h'),
            refreshHistoricalPrices('q6h', '6h'),
            refreshHistoricalPrices('q24h', '24h'),
        ]);
        
        let qxdReq = [];
        for (let day = 1; day < 6; day++) {
            let timeDiff = (parseInt((new Date()).getTime() / 86400000) * 86400) - (86400 * day);
            qxdReq.push(refreshHistoricalPrices('q' + (day + 1) + 'd', '24h', timeDiff));
        }
        await Promise.all(qxdReq);
        
        await refreshHistoricalPrices('q7d', '24h', (parseInt((new Date()).getTime() / 86400000) * 86400) - (86400 * 6));
        await refreshHistoricalPrices('q14d', '24h', (parseInt((new Date()).getTime() / 86400000) * 86400) - (86400 * 13));
    }
    catch(err) {
        $('#loading').html($('#loading').html() + ': Error in script, cannot continue');
        console.error(err);
    }
}





/**
 * Improved predictOptimalPrices function that addresses conservative buy/sell price issues
 * @param {Object} item - Item data object from your existing script
 * @returns {Object} Predicted optimal prices and metadata with more aggressive targets
 */
function improvedPredictOptimalPrices(item) {
    const ts = getTimeSeries(item.id);
    const stats = calculateStatistics(ts, item);
    if (!stats.valid)
        return { success: false, message: stats.reason };
  
    unsafeWindow.ts = ts;
    unsafeWindow.stats = stats;
    unsafeWindow.item = item;

    // 1) Start with the current market prices as baseline
    let buyPrice = item.lastbuy.price;
    let sellPrice = item.lastsell.price;
    
    // 2) Calculate more aggressive buy price based on historical data
    // Instead of using the 5th percentile (CONFIG.historicalQuantile.buy = 0.1),
    // use a more aggressive approach based on recent volume and volatility
    const lows = stats.lowPrices.slice().sort((a,b) => a-b);
    const highs = stats.highPrices.slice().sort((a,b) => a-b);
    
    // Adjust quantile based on item's recent volume and limit ratio
    // Higher volume/limit ratio = can be more aggressive (lower buy price)
    const volLimitRatio = Math.min(3, item.q1hvolumelimitratio || 1);
    const buyQuantileAdjusted = Math.max(0.15, 0.25 - (volLimitRatio * 0.05));
    const sellQuantileAdjusted = Math.min(0.85, 0.75 + (volLimitRatio * 0.05));
    
    const buyIdx = Math.floor(lows.length * buyQuantileAdjusted);
    const sellIdx = Math.floor(highs.length * sellQuantileAdjusted);
    
    // 3) Calculate prices based on adjusted quantiles
    const historicalBuyPrice = lows[buyIdx] || buyPrice;
    const historicalSellPrice = highs[sellIdx] || sellPrice;
    
    // 4) Incorporate recent price volatility to adjust aggressiveness
    // More volatile items = less aggressive to avoid missing fills
    // Cap volatility factor to prevent dominating the calculation
    const volatilityFactor = Math.min(0.6, Math.max(0.1, stats.volatilityLow * 10));
    const stabilityFactor = 1 - volatilityFactor;
    
    // 5) Weight historical prices more heavily to ensure we're not just using current prices
    // This helps make recommendations more aggressive while still being based on actual data
    buyPrice = Math.ceil(buyPrice * volatilityFactor + 
                         historicalBuyPrice * stabilityFactor);
    sellPrice = Math.floor(sellPrice * volatilityFactor + 
                          historicalSellPrice * stabilityFactor);
                          
    // 5b) Apply additional biasing to ensure we get prices that differ from current market
    // This moves buy prices somewhat lower and sell prices somewhat higher
    //const priceBias = 0.03; // 3% bias
    //buyPrice = Math.floor(buyPrice * (1 - priceBias));
    //sellPrice = Math.ceil(sellPrice * (1 + priceBias));
    
    // Always ensure buy price is below current low by a meaningful amount
    // Calculate a percentage discount based on price level and volume
    //const volumeBonusBuy = Math.min(0.5, (item.q1hvolumelimitratio || 0.5) / 3);
    
    // For items with consistent trading patterns, be more aggressive
    const lowPriceVolatilityAdjustment = Math.max(0, (stats.volatilityLow || 0));
    buyPrice = Math.floor(Math.min(buyPrice, item.lastbuy.price) * (1 - lowPriceVolatilityAdjustment));
    
    // Always ensure sell price is above current high by a meaningful amount
    // Calculate a percentage markup based on price level and volume
    //const volumeBonusSell = Math.min(0.5, (item.q1hvolumelimitratio || 0.5) / 3);
    
    // For items with consistent trading patterns, be more aggressive
    const highPriceVolatilityAdjustment = Math.max(0, (stats.volatilityHigh || 0));
    sellPrice = Math.floor(Math.max(sellPrice, item.lastsell.price) * (1 + highPriceVolatilityAdjustment));
    

    // Calculate improved fill probabilities based on historical price frequency and adjusted for recency of data points
    let buyProb = calculateImprovedFillProbability(buyPrice, stats, 'buy'), buyPriceAdjustmentCounter = 0;
    while (buyProb < CONFIG.confidenceLevel && buyPrice < item.lastbuy.price && buyPriceAdjustmentCounter < Math.max(100, Math.abs(item.lastsell.price - item.lastbuy.price) * 2)) {
        console.log(`Poor confidence (${buyProb}) in buy price (${buyPrice}), adjusting (iteration ${buyPriceAdjustmentCounter})`);
        buyPrice = Math.min(item.lastbuy.price, buyPrice + Math.max(1, Math.round(buyPrice * 0.001)));
        buyProb = calculateImprovedFillProbability(buyPrice, stats, 'buy');
        buyPriceAdjustmentCounter++;        
    }

    let sellProb = calculateImprovedFillProbability(sellPrice, stats, 'sell'), sellPriceAdjustmentCounter = 0;
    while (sellProb < CONFIG.confidenceLevel && sellPrice > item.lastsell.price && sellPriceAdjustmentCounter < Math.max(100, Math.abs(item.lastsell.price - item.lastbuy.price) * 2)) {
        console.log(`Poor confidence (${sellProb}) in sell price (${sellPrice}), adjusting (iteration ${sellPriceAdjustmentCounter})`);
        sellPrice = Math.max(item.lastsell.price, sellPrice - Math.max(1, Math.round(sellPrice * 0.001)));
        sellProb = calculateImprovedFillProbability(sellPrice, stats, 'sell');
        sellPriceAdjustmentCounter++;
    }

    if (buyPrice == sellPrice) {
        sellPrice += 1;
        sellProb = calculateImprovedFillProbability(sellPrice, stats, 'sell');
    }

    // Estimate holding time based on volume and price distance
    let holdingTime = estimateRealisticHoldingTime(buyPrice, sellPrice, stats, item);
    
    // Calculate profit metrics
    const profit = (sellPrice - buyPrice) - calcTax(sellPrice);
    const totalProb = buyProb * sellProb;
    const expectedProfit = profit * totalProb;
    const priceRisk = calculatePriceRisk(stats, buyPrice);
    const opportunityCost = calculateOpportunityCost(item, holdingTime);
    
    // Calculate risk-adjusted score
    const score = calculateRiskAdjustedScore(
        expectedProfit,
        1 - totalProb,
        priceRisk,
        opportunityCost,
        (profit / buyPrice * 100),
        item
    );
  
    return {
        success: true,
        item: item.name,
        optimalBuyPrice: buyPrice,
        optimalSellPrice: sellPrice,
        buyFillProbability: buyProb,
        sellFillProbability: sellProb,
        executionRisk: 1 - totalProb,
        potentialProfit: profit,
        expectedProfit: expectedProfit,
        priceRisk: priceRisk,
        opportunityCost: opportunityCost,
        estHoldingTime: holdingTime,
        roi: (profit / buyPrice * 100),
        riskAdjustedScore: score,
        stats,
        recommendation: getFlipRecommendation({
            optimalBuyPrice: buyPrice,
            optimalSellPrice: sellPrice,
            buyFillProbability: buyProb,
            sellFillProbability: sellProb,
            roi: (profit / buyPrice * 100),
            stats: stats,
            potentialProfit: profit
        })
    };
}

/**
 * Improved fill probability calculation that accounts for recent price frequency
 * and trading velocity to provide more realistic estimates
 * @param {number} price - The limit order price
 * @param {Object} stats - Statistical measures
 * @param {string} orderType - 'buy' or 'sell'
 * @returns {number} Estimated fill probability (0-1)
 */
function calculateImprovedFillProbability(price, stats, orderType) {
    // Base case - orders at or better than current price get high probability
    if (orderType === 'buy' && price >= stats.currentLow) {
        return 0.99;
    }
    if (orderType === 'sell' && price <= stats.currentHigh) {
        return 0.99;
    }
    
    // Calculate price distance from current price as percentage
    const priceDelta = orderType === 'buy' 
        ? (stats.currentLow - price) / stats.currentLow
        : (price - stats.currentHigh) / stats.currentHigh;
    
    // Get ~30 hours historical Q5M average prices
    const prices = orderType === 'buy' ? stats.lowPrices : stats.highPrices;
    
    if (!prices || prices.length < 5) {
        // Without enough data, use an optimistic distance-based approximation
        // Adjusted to be more optimistic about fill probabilities
        return Math.max(0.15, 1 - (priceDelta * 15));
    }

    const Q12HPrices = prices.slice(prices.length - (12 * 12) - 1, prices.length - 1);
    const Q6HPrices = prices.slice(prices.length - (12 * 6) - 1, prices.length - 1);
    const Q2HPrices = prices.slice(prices.length - (12 * 2) - 1, prices.length - 1);
    
    // Calculate historical frequency (how often price hits this level)
    const hitCount = orderType === 'buy' ? prices.filter(p => p <= price).length : prices.filter(p => p >= price).length;
    const Q12HHitCount = orderType === 'buy' ? Q12HPrices.filter(p => p <= price).length : Q12HPrices.filter(p => p >= price).length;
    const Q6HHitCount = orderType === 'buy' ? Q6HPrices.filter(p => p <= price).length : Q6HPrices.filter(p => p >= price).length;
    const Q2HHitCount = orderType === 'buy' ? Q2HPrices.filter(p => p <= price).length : Q2HPrices.filter(p => p >= price).length;
    
    let allFrequency = hitCount / prices.length;
    let Q12HFrequency = Q12HHitCount / Q12HPrices.length;
    let Q6HFrequency = Q6HHitCount / Q6HPrices.length;
    let Q2HFrequency = Q2HHitCount / Q2HPrices.length;
    
    // Adjust for recent trend direction
    const trendFactor = 0.1;
    const trendAdjustment = stats.trendStrength * trendFactor; // Downtrend makes buys more likely, uptrend makes sells more likely
    
    allFrequency = Math.min(0.95, allFrequency + trendAdjustment);
    Q12HFrequency = Math.min(0.95, Q12HFrequency + trendAdjustment);
    Q6HFrequency = Math.min(0.95, Q6HFrequency + trendAdjustment);
    Q2HFrequency = Math.min(0.95, Q2HFrequency + trendAdjustment);
    
    // Adjust for volume relative to limit (more volume = higher fill chance)
    const volumeFactor = Math.sqrt(1 + stats.q1hvolumelimitratio);
    const baseProbability = ((allFrequency + (Q12HFrequency * 2) + (Q6HFrequency * 3) + (Q2HFrequency * 4)) / 10) * volumeFactor;
    
    const sigmoidFactor = 8;
    const sigmoidShift = 4;
    const normalizedProb = 1 / (1 + Math.exp(sigmoidFactor * priceDelta - sigmoidShift));
    
    return Math.min(0.99, (baseProbability * 0.8) + (normalizedProb * 0.2));
}


/**
 * Fetches time series data from the Wiki API
 * @param {string} itemID - The item ID
 * @param {string} window - The window ie 5 minutes or 1 hour
 * @returns {Promise<Object>} Time series data
 */
async function fetchTimeSeries(itemID, window = "5m") {
    if (timeSeriesCache[itemID]?.[window]) {
        // Return cached data if it's fresh (less than 5 minutes old)
        const cacheAge = Date.now() - timeSeriesCache[itemID][window].timestamp;
        if (cacheAge < 5 * 60 * 1000) {
            return timeSeriesCache[itemID][window].data;
        }
    }

    if (timeSeriesCache[itemID] == null)
        timeSeriesCache[itemID] = {};
    
    try {
        const response = await doGET(`https://prices.runescape.wiki/api/v1/osrs/timeseries?id=${itemID}&timestep=${window}`);
        const data = JSON.parse(response.responseText).data;

        console.log('Retrieved ' + window + ' time series data for ' + DB[itemID]);
        
        // Cache the result
        timeSeriesCache[itemID][window] = {
            data: data,
            timestamp: Date.now()
        };
        
        return data;
    } catch (error) {
        console.error(`Error fetching ${window} time series for item ${itemID}:`, error);
        return null;
    }
}

/**
 * Checks if we have sufficient time series data for prediction
 * @param {string} itemId - The item ID
 * @param {string} window - The window ie 5 minutes or 1 hour
 * @returns {boolean} Whether we have data
 */
function hasTimeSeriesData(itemId, window = "5m") {
    return timeSeriesCache[itemId]?.[window] && 
           timeSeriesCache[itemId][window].data && 
           timeSeriesCache[itemId][window].data.length >= CONFIG.minDataPoints;
}

/**
 * Gets time series data, either from cache or by fetching
 * @param {string} itemId - The item ID
 * @param {string} window - The window ie 5 minutes or 1 hour
 * @returns {Array} Time series data
 */
function getTimeSeries(itemId, window = "5m") {
    if (!hasTimeSeriesData(itemId, window)) {
        return [];
    }
    return timeSeriesCache[itemId][window].data;
}

/**
 * Calculates statistical measures for the time series
 * @param {Array} timeSeries - Time series data
 * @param {Object} item - Item data object
 * @returns {Object} Statistical measures
 */
function calculateStatistics(timeSeries, item) {
    if (!timeSeries || timeSeries.length < CONFIG.minDataPoints) {
        return { valid: false, reason: "Insufficient data points" };
    }

    // Extract prices and volumes
    let highPrices = timeSeries.map(d => d.avgHighPrice).filter(p => p !== null && p > 0);
    let lowPrices = timeSeries.map(d => d.avgLowPrice).filter(p => p !== null && p > 0);
    let highVolumes = timeSeries.map(d => d.highPriceVolume).filter(v => v !== null);
    let lowVolumes = timeSeries.map(d => d.lowPriceVolume).filter(v => v !== null);
    
    if (highPrices.length < CONFIG.minDataPoints || lowPrices.length < CONFIG.minDataPoints) {
        return { valid: false, reason: "Insufficient valid price points" };
    }

    // Find price extremes (min/max values)
    const minLowPrice = Math.min(...lowPrices);
    const maxLowPrice = Math.max(...lowPrices);
    const minHighPrice = Math.min(...highPrices);
    const maxHighPrice = Math.max(...highPrices);
    
    // Calculate price ranges
    const lowPriceRange = maxLowPrice - minLowPrice;
    const highPriceRange = maxHighPrice - minHighPrice;
    
    // Calculate historical frequency distribution
    const lowPriceHistogram = calculateHistogram(lowPrices, 10);
    const highPriceHistogram = calculateHistogram(highPrices, 10);
    
    // Check if current price is at historical extremes
    const lowPricePercentile = calculatePercentile(item.lastbuy.price, lowPrices);
    const highPricePercentile = calculatePercentile(item.lastsell.price, highPrices);

    const trend = robustTrend(lowPrices);
    //const trend = detectTrend(lowPrices);
    
    // Calculate summary statistics
    const stats = {
        valid: true,
        
        // Current prices
        currentHigh: item.lastsell.price,
        currentLow: item.lastbuy.price,
        
        // Store raw price arrays for detailed analysis
        lowPrices: lowPrices,
        highPrices: highPrices,
        
        // Price statistics
        meanHigh: calculateMean(highPrices),
        meanLow: calculateMean(lowPrices),
        medianHigh: calculateMedian(highPrices),
        medianLow: calculateMedian(lowPrices),
        stdDevHigh: calculateStdDev(highPrices),
        stdDevLow: calculateStdDev(lowPrices),
        
        // Price extremes and ranges
        minLowPrice: minLowPrice,
        maxLowPrice: maxLowPrice,
        minHighPrice: minHighPrice,
        maxHighPrice: maxHighPrice,
        lowPriceRange: lowPriceRange,
        highPriceRange: highPriceRange,
        
        // Current price relative to history
        lowPricePercentile: lowPricePercentile,
        highPricePercentile: highPricePercentile,
        
        // Price change statistics
        highPriceChanges: calculatePriceChanges(highPrices),
        lowPriceChanges: calculatePriceChanges(lowPrices),
        
        // Volatility (using log returns)
        volatilityHigh: calculateVolatility(highPrices, CONFIG.volatilityWindow),
        volatilityHighDay: calculateDailyVolatility(highPrices),
        volatilityLow: calculateVolatility(lowPrices, CONFIG.volatilityWindow),
        volatilityLowDay: calculateDailyVolatility(lowPrices),
        
        // Volume statistics
        meanHighVolume: calculateMean(highVolumes),
        meanLowVolume: calculateMean(lowVolumes),
        totalVolume: calculateSum(highVolumes) + calculateSum(lowVolumes),
        
        // Trading dynamics
        volumeRatio: calculateSum(lowVolumes) / Math.max(1, calculateSum(highVolumes)),
        
        // Trend indicators
        isUptrend: trend > 0.05, // Require stronger trend 
        isDowntrend: trend < -0.05, // Require stronger trend
        trendStrength: Math.abs(trend),
        trendStrengthRaw: trend,
        
        // Seasonal patterns (if detectable)
        seasonality: detectSeasonality(timeSeries),
        
        // Additional GE-specific data
        q1hvolumelimitratio: item.q1hvolumelimitratio,
        buyLimit: item.limit,
        spread: item.margin,
        tax: Math.min(5000000, Math.floor(item.lastsell.price * CONFIG.geTaxMultiplier))
    };
    
    return stats;
}

/**
 * Calculates the risk of adverse price movement after buying
 * @param {Object} stats - Statistical measures
 * @param {number} buyPrice - The buy price
 * @returns {number} Price risk factor (0-1)
 */
function calculatePriceRisk(stats, buyPrice) {
    // Risk is higher for more volatile items
    const volatilityRisk = stats.volatilityLow;
    
    // Risk is higher in a downtrend
    const trendRisk = stats.isDowntrend ? stats.trendStrength : 0;
    
    // Risk is higher if the current price is significantly above historical average
    const historicalPremium = stats.currentLow / stats.meanLow;
    const premiumRisk = Math.max(0, (historicalPremium - 1) * 0.5);
    
    // Combine risk factors, with weights
    let riskFactor = (volatilityRisk * 0.4) + (trendRisk * 0.4) + (premiumRisk * 0.2);
    
    // Cap the risk
    return Math.min(CONFIG.maxPriceRisk, riskFactor);
}

/**
 * A helper function to format holding time for display
 * @param {number} milliseconds - Time in milliseconds
 * @returns {string} Formatted time string
 */
function formatHoldingTime(milliseconds) {
    const minutes = Math.floor(milliseconds / (60 * 1000));
    
    if (minutes < 60) {
        return `${minutes} minutes`;
    } 
    else if (minutes < 24 * 60) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        
        if (remainingMinutes === 0) {
            return `${hours} hours`;
        } else {
            return `${hours} hours, ${remainingMinutes} minutes`;
        }
    } 
    else {
        const days = Math.floor(minutes / (24 * 60));
        const remainingHours = Math.floor((minutes % (24 * 60)) / 60);
        
        if (remainingHours === 0) {
            return `${days} days`;
        } else {
            return `${days} days, ${remainingHours} hours`;
        }
    }
}

/**
 * Calculates opportunity cost based on estimated holding time
 * @param {Object} item - Item data object
 * @param {number} holdingTime - Estimated holding time in ms
 * @returns {number} Opportunity cost in gold
 */
function calculateOpportunityCost(item, holdingTime) {
    // Base opportunity cost on capital tied up and time
    const capitalTiedUp = item.lastbuy.price;
    const holdingTimeHours = holdingTime / (60 * 60 * 1000);
    
    // Assume a baseline hourly profit rate for alternative flips
    const baselineHourlyProfitRate = 0.01; // 1% per hour
    
    return capitalTiedUp * baselineHourlyProfitRate * holdingTimeHours;
}

/**
 * Calculates the risk-adjusted score for an item
 * @param {number} expectedProfit - Expected profit
 * @param {number} executionRisk - Execution risk factor
 * @param {number} priceRisk - Price risk factor
 * @param {number} opportunityCost - Opportunity cost
 * @param {number} roi - Return on investment percentage
 * @param {Object} item - Item data object
 * @returns {number} Risk-adjusted score
 */
function calculateRiskAdjustedScore(expectedProfit, executionRisk, priceRisk, opportunityCost, roi, item) {
    // Base score on expected profit
    let score = Math.log(Math.max(1, expectedProfit));
    
    // Adjust for execution confidence (higher is better)
    score *= Math.pow(executionRisk, CONFIG.riskAversion);
    
    // Adjust for price risk (lower is better)
    score *= (1 - priceRisk);
    
    // Adjust for opportunity cost (lower is better)
    score *= (1 - (CONFIG.opportunityCostWeight * (opportunityCost / Math.max(1, expectedProfit))));
    
    // Adjust for ROI (higher is better)
    score *= Math.log(1 + roi/100);
    
    // Consider buy limit in relation to item price
    // Items with high buy limits relative to price can yield higher total profit
    const limitFactor = Math.log(1 + (item.limit * (1000 / Math.max(1, item.lastbuy.price))));
    score *= limitFactor;
    
    // Consider volume-to-limit ratio (higher is better for reliable execution)
    const volumeLimitRatio = Math.min(5, item.q1hvolumelimitratio); // Cap at 5x
    score *= Math.sqrt(1 + volumeLimitRatio);
    
    return score;
}

/**
 * Provides a more realistic recommendation based on the prediction results
 * @param {Object} prediction - The prediction results
 * @returns {string} Recommendation message
 */
function getFlipRecommendation(prediction) {
    // Calculate key metrics
    const totalConfidence = prediction.buyFillProbability * prediction.sellFillProbability;
    const expectedROI = prediction.roi * totalConfidence;
    const holdingTimeHours = prediction.estHoldingTime / (60 * 60 * 1000);
    
    // Check if it's a pure market order flip (instant)
    const isMarketFlip = prediction.optimalBuyPrice >= prediction.stats.currentLow && 
                        prediction.optimalSellPrice <= prediction.stats.currentHigh;
    
    // For non-market flips, evaluate based on ROI, fill probability, and holding time
    if (isMarketFlip) {
        if (prediction.roi > 2) {
            return "Market Flip: Immediate execution with good profit. Recommended.";
        } else if (prediction.roi > 0.5) {
            return "Quick Flip: Fast execution with modest profit. Consider if capital needs rotation.";
        } else {
            return "Low Margin: Current spread too small for profitable flipping.";
        }
    }
    
    if (expectedROI > 10 && totalConfidence > 0.7) {
        return "Strong Buy: High expected return with strong probability of execution.";
    }
    
    if (expectedROI > 5 && totalConfidence > 0.5) {
        return "Good Opportunity: Solid expected return with reasonable execution probability.";
    }
    
    if (holdingTimeHours < 1 && prediction.roi > 3) {
        return "Quick Profit: Fast turnover with good margin. Good for capital rotat`i`on.";
    }
    
    if (holdingTimeHours > 12 && expectedROI > 8) {
        return "Patience Play: Longer holding time but substantial return if executed.";
    }
    
    if (expectedROI > 3 && prediction.potentialProfit > 100000) {
        return "Volume Play: Modest ROI but good absolute profit. Consider for high capital.";
    }
    
    if (totalConfidence < 0.3) {
        return "High Risk: Low probability of complete execution. Consider alternatives.";
    }
    
    return "Moderate Opportunity: Average return and execution probability.";
}

/**
 * Provides more realistic holding time estimates for GE flips
 * @param {number} buyPrice - Buy price
 * @param {number} sellPrice - Sell price
 * @param {Object} stats - Statistical measures
 * @param {Object} item - Item data
 * @returns {number} Estimated holding time in milliseconds
 */
function estimateRealisticHoldingTime(buyPrice, sellPrice, stats, item) {
    // Base holding times (in milliseconds)
    const instantTime = 5 * 60 * 1000; // 5 minutes for market orders
    const minHoldingTime = 10 * 60 * 1000; // 10 minutes minimum
    const maxHoldingTime = 24 * 60 * 60 * 1000; // 24 hours maximum
    
    // Check if both are effectively market orders
    if (buyPrice >= stats.currentLow && sellPrice <= stats.currentHigh) {
        return instantTime;
    }
    
    // Calculate price distance as percentage from current
    const buyDelta = buyPrice < stats.currentLow 
        ? (stats.currentLow - buyPrice) / stats.currentLow 
        : 0;
    const sellDelta = sellPrice > stats.currentHigh 
        ? (sellPrice - stats.currentHigh) / stats.currentHigh 
        : 0;
    
    // Calculate volume factor - higher volume = faster fills
    const volumeFactor = Math.min(1, Math.max(0.1, (item.q1hvolumelimitratio || 0.5) / 2));
    
    // Calculate volatility factor - higher volatility = faster price movements
    const volatilityFactor = Math.min(1, Math.max(0.2, (stats.volatilityLow + stats.volatilityHigh) * 5));
    
    // Estimate base time based on price distance and modifiers
    // Higher distances = exponentially longer times
    const totalDelta = buyDelta + sellDelta;
    const baseTimeMultiplier = Math.exp(totalDelta * 5) - 1;
    
    // Combine factors - higher volume and volatility reduce holding time
    const timeReductionFactor = (volumeFactor + volatilityFactor) / 2;
    
    // Calculate final holding time estimate (in milliseconds)
    // Higher volume & volatility and smaller price distances = faster fills
    const holdingTimeEstimate = minHoldingTime + (baseTimeMultiplier * 60 * 60 * 1000 * (1 - timeReductionFactor));
    
    // Cap within reasonable limits
    return Math.min(maxHoldingTime, Math.max(minHoldingTime, holdingTimeEstimate));
}

// ===== Utility Functions =====

/**
 * Calculates the z-score for a given confidence level
 * @param {number} confidenceLevel - Confidence level (0-1)
 * @returns {number} Z-score
 */
function calculateZScore(confidenceLevel) {
    // Simple lookup table for common confidence levels
    if (confidenceLevel >= 0.99) return 2.576;
    if (confidenceLevel >= 0.98) return 2.326;
    if (confidenceLevel >= 0.95) return 1.96;
    if (confidenceLevel >= 0.90) return 1.645;
    if (confidenceLevel >= 0.85) return 1.44;
    if (confidenceLevel >= 0.80) return 1.282;
    return 1.0; // Default for lower confidence levels
}

/**
 * Calculates the mean of an array of numbers
 * @param {Array<number>} data - Array of numbers
 * @returns {number} Mean value
 */
function calculateMean(data) {
    if (!data || data.length === 0) return 0;
    return data.reduce((sum, val) => sum + val, 0) / data.length;
}

/**
 * Calculates the median of an array of numbers
 * @param {Array<number>} data - Array of numbers
 * @returns {number} Median value
 */
function calculateMedian(data) {
    if (!data || data.length === 0) return 0;
    const sorted = [...data].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    } else {
        return sorted[middle];
    }
}

/**
 * Calculates the standard deviation of an array of numbers
 * @param {Array<number>} data - Array of numbers
 * @returns {number} Standard deviation
 */
function calculateStdDev(data) {
    if (!data || data.length <= 1) return 0;
    const mean = calculateMean(data);
    const squaredDiffs = data.map(val => Math.pow(val - mean, 2));
    const variance = calculateMean(squaredDiffs);
    return Math.sqrt(variance);
}

/**
 * Calculates percent changes between consecutive values
 * @param {Array<number>} data - Array of numbers
 * @returns {Array<number>} Array of percent changes
 */
function calculatePriceChanges(data) {
    if (!data || data.length <= 1) return [];
    const changes = [];
    for (let i = 1; i < data.length; i++) {
        const change = (data[i] - data[i-1]) / data[i-1];
        changes.push(change);
    }
    return changes;
}

/**
 * Calculates price volatility as the standard deviation of log returns
 * @param {Array<number>} prices - Array of price values
 * @param {number} window - Number of data points to use
 * @returns {number} Volatility measure
 */
function calculateVolatility(prices, window) {
    if (!prices || prices.length <= 1) return 0;
    
    // Use only the most recent window of data
    const recentPrices = prices.slice(-window);
    
    // Calculate log returns
    const logReturns = [];
    for (let i = 1; i < recentPrices.length; i++) {
        const logReturn = Math.log(recentPrices[i] / recentPrices[i-1]);
        logReturns.push(logReturn);
    }
    
    // Standard deviation of log returns is a measure of volatility
    return calculateStdDev(logReturns);
}

/**
 * Calculates daily price volatility as the standard deviation of log returns
 * @param {Array<number>} prices - Array of price values
 * @returns {number} Volatility measure
 */
function calculateDailyVolatility(prices, periodMinutes = 5) {
    if (prices.length <= 1) return 0;
  
    const logR = [];
    for (let i = 1; i < prices.length; i++)
        logR.push(Math.log(prices[i] / prices[i - 1]));
  
    const sigmaPerPeriod = calculateStdDev(logR);          // your helper
    const periodsPerDay  = 24 * 60 / periodMinutes;
    return sigmaPerPeriod * Math.sqrt(periodsPerDay);
  }

/**
 * Calculates the percentile of a value within an array
 * @param {number} value - The value to calculate percentile for
 * @param {Array<number>} data - Array of numbers
 * @returns {number} Percentile (0-1)
 */
function calculatePercentile(value, data) {
    if (!data || data.length === 0) return 0.5;
    
    const sortedData = [...data].sort((a, b) => a - b);
    
    // Count values below our target
    const belowCount = sortedData.filter(v => v < value).length;
    
    // Calculate percentile
    return belowCount / sortedData.length;
}

/**
 * Creates a histogram from array values
 * @param {Array<number>} data - Array of numbers
 * @param {number} bins - Number of bins
 * @returns {Object} Histogram data
 */
function calculateHistogram(data, bins = 10) {
    if (!data || data.length === 0) return { bins: [], counts: [] };
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    const binWidth = range / bins;
    
    const binEdges = Array(bins + 1).fill(0).map((_, i) => min + i * binWidth);
    const counts = Array(bins).fill(0);
    
    // Count values in each bin
    data.forEach(value => {
        const binIndex = Math.min(bins - 1, Math.floor((value - min) / binWidth));
        counts[binIndex]++;
    });
    
    return {
        binEdges: binEdges,
        counts: counts,
        binWidth: binWidth
    };
}

/**
 * Calculates the sum of an array of numbers
 * @param {Array<number>} data - Array of numbers
 * @returns {number} Sum
 */
function calculateSum(data) {
    if (!data || data.length === 0) return 0;
    return data.reduce((sum, val) => sum + val, 0);
}

/**
 * Detect a linear price trend.
 * @param {number[]} prices  – price[i] is the price at time[i]
 * @param {number[]} [time]  – epoch ms for each observation. If omitted, i = 0..n-1
 * @returns {number} in [-1, 1]  negative = down-trend, positive = up-trend
 */
function detectTrend(prices, time = null) {
    const n = prices?.length ?? 0;
    if (n < 3) return 0;               // need ≥3 points for any confidence
  
    // Use supplied timestamps or indices
    const getX = time
      ? (i) => (time[i] - time[0]) / 1000   // seconds since start
      : (i) => i;
  
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
        const x = getX(i);
        const y = prices[i];
        if (!Number.isFinite(y))
            return 0;    // guard bad data
        sumX  += x;
        sumY  += y;
        sumXY += x * y;
        sumX2 += x * x;
    }
  
    const denom = n * sumX2 - sumX * sumX;
    if (denom === 0)
        return 0;
  
    const slope = (n * sumXY - sumX * sumY) / denom;
  
    const meanPrice = sumY / n;
    if (!Number.isFinite(meanPrice) || meanPrice === 0)
        return 0;
  
    // Scale: percent change per full span of data
    const span = getX(n - 1) || 1;  // avoid /0 if timestamps identical
    const normalizedSlope = (slope * span) / meanPrice;
  
    // tan⁻¹ compresses large values smoothly into (-π/2, π/2)
    const score = Math.atan(normalizedSlope) * (2 / Math.PI);

    console.log({
        meanPrice,
        slope,                  // raw units: gp per index
        normalizedSlope,        // before clamping
        trendScore: Math.max(-1, Math.min(1, score))
    });
  
    return Math.max(-1, Math.min(1, score));
}

/**
 * Robust median-slope estimator (Theil–Sen)
 * @param {[number, number][]} pts  array of [x, y] pairs
 * @returns {number}  slope
 */
function theilSenSlope(pts) {
    const n = pts.length;
    if (n < 2) return 0;
  
    const slopes = [];
    for (let i = 0; i < n - 1; i++) {
      const [x1, y1] = pts[i];
      for (let j = i + 1; j < n; j++) {
        const [x2, y2] = pts[j];
        if (x2 !== x1) slopes.push((y2 - y1) / (x2 - x1));
      }
    }
    // use simple-statistics’ median to finish the job
    return window.ss.median(slopes);
}

/**
 * Drop points whose price is > k·MAD away from the series median.
 */
function madFilter(prices, k = 3) {
    const median = ss.median(prices);
    const mad = ss.median(prices.map(p => Math.abs(p - median))) || 1;
    const thresh = k * 1.4826 * mad;          // 1.4826 → convert MAD to σ
    return prices
        .map((p, i) => ({ p, i }))
        .filter(({ p }) => Math.abs(p - median) <= thresh);
}

/**
 * Robust trend score: MAD-trim  ➜  Theil–Sen  ➜  atan scaling to (-1,1)
 */
function robustTrend(prices, times = null) {
    if (!prices || prices.length < 3)
        return 0;

    // Trim extreme values
    const kept = madFilter(prices, 4);
    if (kept.length < 3) return 0;            // everything was an outlier

    // 2Build [x,y] pairs for Theil–Sen
    const pts = kept.map(({ p, i }) => [
        times ? (times[i] - times[0]) / 1000 : i,   // seconds or index
        p
    ]);

    // Median of all pair slopes
    let slopes = [];
    for (let a = 0; a < pts.length - 1; a++) {
        for (let b = a + 1; b < pts.length; b++) {
            const dx = pts[b][0] - pts[a][0];
            if (dx)
                slopes.push((pts[b][1] - pts[a][1]) / dx);
        }
    }
    const slope = ss.quantileSorted(slopes.sort((a, b) => a - b), 0.6);

    // Scale to a handy -1…1 score
    const mean  = ss.mean(kept.map(o => o.p));
    const span  = pts[pts.length - 1][0] || 1;
    return Math.atan((slope * span) / mean) * (2 / Math.PI);
}

/**
 * Detects seasonal patterns in time series
 * @param {Array<Object>} timeSeries - Time series data
 * @returns {Object} Detected seasonality information
 */
function detectSeasonality(timeSeries) {
    // This is a placeholder for more complex seasonality detection
    // In a real implementation, we might look for daily, weekly patterns
    // For now, return a simple object with no detected patterns
    return {
        detected: false,
        pattern: 'none',
        strength: 0
    };
}

// ===== Integration with existing script =====

/**
 * Enhanced getScore function that uses the prediction algorithm
 * @param {Object} item - Item data from the existing script
 * @param {boolean} debug - Whether to print debug information
 * @returns {number} Score value for ranking
 */
function enhancedGetScore(item, debug = false) {
    // Try to use the prediction algorithm first
    try {
        const prediction = improvedPredictOptimalPrices(item);
        
        if (prediction.success) {
            if (debug) {
                console.log(`${item.name} - Advanced Prediction Results:`, prediction);
            }
            return prediction.riskAdjustedScore;
        }
    } catch (error) {
        console.warn(`Error in advanced prediction for ${item.name}:`, error);
        // Fall back to original scoring method
    }
    
    // If prediction failed, use the original scoring algorithm
    return getScore(item, debug);
}

// Make functions available to the parent script
unsafeWindow.enhancedGetScore = enhancedGetScore;
unsafeWindow.improvedPredictOptimalPrices = improvedPredictOptimalPrices;
unsafeWindow.calculateImprovedFillProbability = calculateImprovedFillProbability;
unsafeWindow.detectTrend = detectTrend;
unsafeWindow.robustTrend = robustTrend;
unsafeWindow.madFilter = madFilter;
unsafeWindow.hasTimeSeriesData = hasTimeSeriesData;
unsafeWindow.fetchTimeSeries = fetchTimeSeries;

// Initialize time series data for all items
async function initializeTimeSeriesData() {
    console.log("Initializing time series data for flipping predictions...");
    
    // Get top 100 items by volume or other criteria to prioritize
    const itemIds = Object.keys(DB).map(name => DB[name].id).slice(0, 100);
    
    // Fetch time series data for these items
    for (const itemId of itemIds) {
        try {
            await Promise.all([
                fetchTimeSeries(itemId, "5m"),
                fetchTimeSeries(itemId, "1h")
            ]);
            console.log(`Fetched time series data for item ${itemId}`);
        } catch (error) {
            console.error(`Failed to fetch time series for item ${itemId}:`, error);
        }
    }
    
    console.log("Time series initialization complete");
}

// Call this function after the main script has loaded the item data
// This should be integrated into your main script's initialization
// unsafeWindow.addEventListener('load', initializeTimeSeriesData);



// ==UserScript UI Extension==
// UI components for the OSRS Wiki Prices Extender prediction algorithm
// This module provides UI for visualizing predictions and optimal buy/sell ranges

/**
 * Creates and initializes the prediction UI components
 */
function initPredictionUI() {
    // Add CSS styles for prediction UI
    addPredictionStyles();
    
    // Add prediction button to each row
    extendTableWithPredictionButtons();
    
    // Create modal container for prediction details
    createPredictionModal();
    
    console.log("GE Prediction UI components initialized");
}

/**
 * Adds CSS styles for the prediction UI
 */
function addPredictionStyles() {
    GM_addStyle(`
        .predict-btn {
            cursor: pointer;
            background-color: #567b3a;
            color: white;
            border: none;
            border-radius: 3px;
            padding: 2px 5px;
            font-size: 0.8em;
            margin-left: 5px;
        }
        
        .predict-btn:hover {
            background-color: #699249;
        }
        
        #prediction-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 1000;
        }
        
        .prediction-content {
            position: relative;
            background-color: #fff;
            margin: 5% auto;
            padding: 20px;
            width: 80%;
            max-width: 900px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .prediction-close {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
        }
        
        #prediction-details h2 {
            margin-top: 0;
            color: #3e5026;
        }
        
        .prediction-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .prediction-section {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .prediction-section h3 {
            margin-top: 0;
            color: #3e5026;
            font-size: 1.1em;
            border-bottom: 1px solid #ddd;
            padding-bottom: 8px;
        }
        
        .prediction-data-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 0.9em;
        }
        
        .prediction-data-label {
            font-weight: bold;
            color: #555;
        }
        
        .prediction-data-value {
            text-align: right;
        }
        
        .prediction-chart-container {
            position: relative;
            height: 250px;
            margin-top: 20px;
        }
        
        .high-confidence {
            color: #2e7d32;
        }
        
        .medium-confidence {
            color: #f57c00;
        }
        
        .low-confidence {
            color: #c62828;
        }
        
        .recommendation {
            font-weight: bold;
            font-size: 1.1em;
            text-align: center;
            padding: 10px;
            margin-top: 10px;
            border-radius: 5px;
            background-color: #f0f7e9;
        }
    `);
}

/**
 * Extends the table with prediction buttons on each row
 */
function extendTableWithPredictionButtons() {
    // Create a new action column for the prediction button
    $('#items').bootstrapTable('showColumn', 'predict');

    // Apply the formatter to add buttons to each row
    $('#items').on('post-body.bs.table', function() {
        $('.item-row').each(function() {
            const itemId = $(this).data('id');
            const itemName = $(this).find('td:nth-child(3)').text();
            
            if (!$(this).find('.predict-btn').length) {
                const $predictBtn = $('<button class="predict-btn">Predict</button>');
                
                $predictBtn.on('click', function(e) {
                    e.stopPropagation();
                    showPredictionDetails(itemId, itemName);
                });
                
                $(this).find('td:last-child').append($predictBtn);
            }
        });
    });
}

/**
 * Creates the modal container for prediction details
 */
function createPredictionModal() {
    const modalHtml = `
        <div id="prediction-modal">
            <div class="prediction-content">
                <span class="prediction-close">&times;</span>
                <div id="prediction-details">
                    <h2>Loading prediction...</h2>
                </div>
            </div>
        </div>
    `;
    
    $('body').append(modalHtml);
    
    // Close modal when clicking the X or outside the modal
    $('.prediction-close').click(function() {
        $('#prediction-modal').hide();
    });
    
    $(window).click(function(event) {
        if (event.target === document.getElementById('prediction-modal')) {
            $('#prediction-modal').hide();
        }
    });
}

/**
 * Shows prediction details for a specific item
 * @param {string} itemId - The item ID
 * @param {string} itemName - The item name
 */
async function showPredictionDetails(itemId, itemName) {
    // Show the modal with loading state
    $('#prediction-modal').show();
    $('#prediction-details').html('<h2>Loading prediction for ' + itemName + '...</h2>');
    
    try {
        // Ensure we have time series data
        if (!hasTimeSeriesData(itemId)) {
            await Promise.all([
                fetchTimeSeries(itemId, "5m"),
                fetchTimeSeries(itemId, "1h")
            ]);
        }
        
        const item = DB[ID[itemId]];
        if (!item) {
            $('#prediction-details').html('<h2>Error: Item not found</h2>');
            return;
        }
        
        // Get prediction
        const prediction = improvedPredictOptimalPrices(item);
        
        if (!prediction.success) {
            $('#prediction-details').html(`
                <h2>Unable to generate prediction</h2>
                <p>Reason: ${prediction.message || 'Insufficient data'}</p>
                <p>Try another item with more active trading history.</p>
            `);
            return;
        }
        
        // Create the UI for prediction results
        const detailsHtml = createPredictionDetailsHTML(item, prediction);
        $('#prediction-details').html(detailsHtml);
        
        // Initialize the price chart
        initializePriceChart(itemId, prediction);
        
    } catch (error) {
        console.error('Error generating prediction:', error);
        $('#prediction-details').html(`
            <h2>Error Generating Prediction</h2>
            <p>An error occurred while generating the prediction:</p>
            <pre>${error.message}</pre>
        `);
    }
}

/**
 * Creates the HTML for prediction details
 * @param {Object} item - The item data
 * @param {Object} prediction - The prediction result
 * @returns {string} HTML for prediction details
 */
function createPredictionDetailsHTML(item, prediction) {
    // Format numbers with commas
    const formatNumber = num => num.toLocaleString('en-US');
    
    // Format probabilities as percentages
    const formatProb = prob => Math.round(prob * 100) + '%';
    
    // Determine confidence levels for buy and sell
    const getBuyConfidenceClass = prob => {
        if (prob >= 0.85) return 'high-confidence';
        if (prob >= 0.7) return 'medium-confidence';
        return 'low-confidence';
    };
    
    const getSellConfidenceClass = prob => {
        if (prob >= 0.85) return 'high-confidence';
        if (prob >= 0.7) return 'medium-confidence';
        return 'low-confidence';
    };
    
    // Generate the recommendation text
    let recommendation = '';
    const totalConfidence = prediction.buyFillProbability * prediction.sellFillProbability;
    const expectedROI = prediction.roi * totalConfidence;
    
    if (expectedROI >= 3 && prediction.priceRisk < 0.02) {
        recommendation = 'Strong Buy: High expected return with low risk.';
    } else if (expectedROI >= 1 && prediction.priceRisk < 0.03) {
        recommendation = 'Buy: Good expected return with manageable risk.';
    } else if (prediction.priceRisk > 0.04 || totalConfidence < 0.5) {
        recommendation = 'Avoid: High risk or low probability of execution.';
    } else {
        recommendation = 'Consider: Moderate potential but watch market conditions.';
    }
    
    return `
        <h2>Prediction for <a href="https://prices.runescape.wiki/osrs/item/${item.id}" target="_blank">${item.name}</a></h2>
        
        <div class="prediction-grid">
            <div class="prediction-section">
                <h3>Optimal Buy Order</h3>
                <div class="prediction-data-row">
                    <span class="prediction-data-label">Current Low Price:</span>
                    <span class="prediction-data-value">${formatNumber(item.lastbuy.price)}</span>
                </div>
                <div class="prediction-data-row" style="color: blue;">
                    <span class="prediction-data-label">Optimal Buy Price:</span>
                    <span class="prediction-data-value">${formatNumber(prediction.optimalBuyPrice)}</span>
                </div>
                <div class="prediction-data-row">
                    <span class="prediction-data-label">6-hour Fill Probability:</span>
                    <span class="prediction-data-value ${getBuyConfidenceClass(prediction.buyFillProbability)}">
                        ${formatProb(prediction.buyFillProbability)}
                    </span>
                </div>
                <div class="prediction-data-row">
                    <span class="prediction-data-label">Expected Holding Time:</span>
                    <span class="prediction-data-value">
                        ${Math.round(prediction.estHoldingTime / (60 * 1000))} minutes
                    </span>
                </div>
            </div>
            
            <div class="prediction-section">
                <h3>Optimal Sell Order</h3>
                <div class="prediction-data-row">
                    <span class="prediction-data-label">Current High Price:</span>
                    <span class="prediction-data-value">${formatNumber(item.lastsell.price)}</span>
                </div>
                <div class="prediction-data-row" style="color: blue;">
                    <span class="prediction-data-label">Optimal Sell Price:</span>
                    <span class="prediction-data-value">${formatNumber(prediction.optimalSellPrice)}</span>
                </div>
                <div class="prediction-data-row">
                    <span class="prediction-data-label">Fill Probability:</span>
                    <span class="prediction-data-value ${getSellConfidenceClass(prediction.sellFillProbability)}">
                        ${formatProb(prediction.sellFillProbability)}
                    </span>
                </div>
                <div class="prediction-data-row">
                    <span class="prediction-data-label">GE Tax (${Math.round(CONFIG.geTaxMultiplier * 100)}%):</span>
                    <span class="prediction-data-value">${formatNumber(Math.floor(prediction.optimalSellPrice * CONFIG.geTaxMultiplier))}</span>
                </div>
            </div>
            
            <div class="prediction-section">
                <h3>Profit Analysis</h3>
                <div class="prediction-data-row">
                    <span class="prediction-data-label">Potential Profit (per):</span>
                    <span class="prediction-data-value">${formatNumber(prediction.potentialProfit)}</span>
                </div>
                <div class="prediction-data-row">
                    <span class="prediction-data-label">Expected Profit (per):</span>
                    <span class="prediction-data-value">${formatNumber(Math.round(prediction.expectedProfit))}</span>
                </div>
                <div class="prediction-data-row">
                    <span class="prediction-data-label">ROI:</span>
                    <span class="prediction-data-value">${prediction.roi.toFixed(2)}%</span>
                </div>
                <div class="prediction-data-row">
                    <span class="prediction-data-label">Buy Limit:</span>
                    <span class="prediction-data-value">${formatNumber(item.limit)}</span>
                </div>
                <div class="prediction-data-row">
                    <span class="prediction-data-label">Limit Profit:</span>
                    <span class="prediction-data-value">${formatNumber(Math.floor(Math.min(prediction.expectedProfit, prediction.potentialProfit) * item.limit))} - ${formatNumber(Math.floor(Math.max(prediction.expectedProfit, prediction.potentialProfit) * item.limit))}</span>
                </div>
            </div>
            
            <div class="prediction-section">
                <h3>Risk Assessment</h3>
                <div class="prediction-data-row">
                    <span class="prediction-data-label">Price Risk:</span>
                    <span class="prediction-data-value">${(prediction.priceRisk * 100).toFixed(2)}%</span>
                </div>
                <div class="prediction-data-row">
                    <span class="prediction-data-label">Execution Risk:</span>
                    <span class="prediction-data-value">${formatProb(prediction.executionRisk)}</span>
                </div>
                <div class="prediction-data-row">
                    <span class="prediction-data-label">Volume Stability:</span>
                    <span class="prediction-data-value">${prediction.stats.q1hvolumelimitratio.toFixed(2)}x limit</span>
                </div>
                <div class="prediction-data-row">
                    <span class="prediction-data-label">Daily Volatility (%):</span>
                    <span class="prediction-data-value">${(prediction.stats.volatilityLowDay * 100).toFixed(1)}%</span>
                </div>
                <div class="prediction-data-row">
                    <span class="prediction-data-label">Market Trend:</span>
                    <span class="prediction-data-value">
                        ${prediction.stats.isUptrend ? 'Uptrend' : (prediction.stats.isDowntrend ? 'Downtrend' : 'Sideways')} (${prediction.stats.trendStrengthRaw.toFixed(3)})
                    </span>
                </div>
            </div>
        </div>
        
        <div class="prediction-chart-container">
            <canvas id="price-prediction-chart"></canvas>
        </div>
        
        <div class="recommendation">
            ${recommendation}
        </div>
    `;
}

/**
 * Initializes the price prediction chart
 * @param {string} itemId - The item ID
 * @param {Object} prediction - The prediction result
 */
function initializePriceChart(itemId, prediction) {
    const timeSeries = getTimeSeries(itemId, "1h").slice(-20); // Last X data points
    unsafeWindow.timeSeriesCache = timeSeriesCache;
    unsafeWindow.timeSeries = timeSeries;
    // Prepare data for the chart
    const timestamps = timeSeries.map(d => new Date(d.timestamp * 1000));
    const highPrices = timeSeries.map(d => d.avgHighPrice);
    const lowPrices = timeSeries.map(d => d.avgLowPrice);
    
    // Calculate prediction interval for visualization
    const stats = prediction.stats;
    const stdDevLow = stats.stdDevLow;
    const stdDevHigh = stats.stdDevHigh;
    
    // Create future timestamps for prediction
    const lastTimestamp = timestamps[timestamps.length - 1].getTime();
    const futureTimestamps = [];
    for (let i = 1; i <= 2; i++) {
        futureTimestamps.push(new Date(lastTimestamp + i * 60 * 60 * 1000));
    }
    
    // Create datasets for the chart
    const entryWidth = Math.max(lowPrices.length, highPrices.length);
    const chartData = {
        labels: [...timestamps, ...futureTimestamps],
        datasets: [
            {
                label: 'Low Prices',
                data: [...lowPrices, null, null, null, null, null],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                pointRadius: 3,
                tension: 0.2
            },
            {
                label: 'High Prices',
                data: [...highPrices, null, null, null, null, null],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                pointRadius: 3,
                tension: 0.2
            },
            {
                label: 'Predicted Low Range',
                data: [...Array(entryWidth - futureTimestamps.length).fill(null, entryWidth, entryWidth + 5), ...Array(4).fill(prediction.optimalBuyPrice), prediction.optimalBuyPrice],
                borderColor: 'rgba(255, 99, 132, 0.5)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false,
                tension: 0
            },
            {
                label: 'Predicted High Range',
                data: [...Array(entryWidth - futureTimestamps.length).fill(null, entryWidth, entryWidth + 5), ...Array(4).fill(prediction.optimalSellPrice), prediction.optimalSellPrice],
                borderColor: 'rgba(54, 162, 235, 0.5)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false,
                tension: 0
            },
            {
                label: 'Current Low',
                data: [...Array(entryWidth).fill(null, entryWidth, entryWidth + 5), prediction.stats.currentLow, ...Array(futureTimestamps.length).fill(null, 0, futureTimestamps.length)],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 1)',
                pointRadius: 5,
                pointStyle: 'triangle',
                showLine: false
            },
            {
                label: 'Current High',
                data: [...Array(entryWidth).fill(null, entryWidth, entryWidth + 5), prediction.stats.currentHigh, ...Array(futureTimestamps.length).fill(null, 0, futureTimestamps.length)],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 1)',
                pointRadius: 5,
                pointStyle: 'triangle',
                showLine: false
            }
        ]
    };
    
    // Create the chart
    const ctx = document.getElementById('price-prediction-chart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'hour',
                        displayFormats: {
                            hour: 'MMM D, HH:mm'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price (gp)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Price History and Prediction',
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    labels: {
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

// Make the functions available to the parent script
window.initPredictionUI = initPredictionUI;

// Load Chart.js from CDN if not already loaded
function loadChartJS() {
    if (typeof Chart !== 'undefined') return Promise.resolve();
    
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Load moment.js for time handling in charts
function loadMomentJS() {
    if (typeof moment !== 'undefined') return Promise.resolve();
    
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/moment@2.29.1/moment.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Load chart adapter for time axis
function loadChartJSAdapter() {
    if (typeof Chart !== 'undefined' && Chart.adapters) return Promise.resolve();
    
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chartjs-adapter-moment@1.0.0/dist/chartjs-adapter-moment.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Initialize the UI when the page is ready
async function initializeUI() {
    try {
        await Promise.all([
            loadChartJS(),
            loadMomentJS()
        ]);
        await loadChartJSAdapter();
        initPredictionUI();
    } catch (error) {
        console.error('Failed to load prediction UI dependencies:', error);
    }
}

// Initialize when the document is ready
if (document.readyState === 'complete') {
    initializeUI();
} else {
    window.addEventListener('load', initializeUI);
}

main();