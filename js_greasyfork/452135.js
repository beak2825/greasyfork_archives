// ==UserScript==
// @name         Tradingview A股助手
// @namespace    https://github.com/xiaopc/tradingview-ashare
// @description  给 Tradingview 增加同花顺同步、拼音搜索等功能
// @version      0.7.6
// @author       xiaopc
// @supportURL   https://github.com/xiaopc/tradingview-ashare/issues
// @match        https://*.tradingview.com/chart/*
// @icon         https://static.tradingview.com/static/images/favicon.ico
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      t.10jqka.com.cn
// @connect      www.iwencai.com
// @connect      qt.gtimg.cn
// @connect      smartbox.gtimg.cn
// @require      https://unpkg.com/preact@10.11.0/dist/preact.min.umd.js
// @require      https://unpkg.com/preact@10.11.0/hooks/dist/hooks.umd.js
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/htm/3.1.0/htm.umd.min.js
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/lodash.js/4.17.21/lodash.min.js
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/lscache/1.3.0/lscache.min.js
// @downloadURL https://update.greasyfork.org/scripts/452135/Tradingview%20A%E8%82%A1%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/452135/Tradingview%20A%E8%82%A1%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// config
// * 显示智能分组
const SHOW_WENCAI_PLATE = true;

const tvhelperCss = `
  /* @import "https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/bulma/0.9.3/css/bulma-rtl.min.css"; */

  .card {
    background-color: #fff;
    border-radius   : .25rem;
    box-shadow      : 0 .5em 1em -.125em rgba(10, 10, 10, .1), 0 0 0 1px rgba(10, 10, 10, .02);
    color           : #4a4a4a;
    max-width       : 100%;
    position        : relative
  }

  .card-content:first-child,
  .card-footer:first-child,
  .card-header:first-child {
    border-top-left-radius : .25rem;
    border-top-right-radius: .25rem
  }

  .card-content:last-child,
  .card-footer:last-child,
  .card-header:last-child {
    border-bottom-left-radius : .25rem;
    border-bottom-right-radius: .25rem
  }

  .card-header {
    background-color: transparent;
    align-items     : stretch;
    box-shadow      : 0 .125em .25em rgba(10, 10, 10, .1);
    display         : flex
  }

  .card-header-title {
    align-items: center;
    color      : #363636;
    display    : flex;
    flex-grow  : 1;
    font-weight: 700;
    padding    : .75rem 1rem
  }

  .card-header-title.is-centered {
    justify-content: center
  }

  .card-header-icon {
    margin         : 0;
    padding        : 0;
    align-items    : center;
    display        : flex;
    justify-content: center;
    padding        : .5rem 1rem
  }

  .card-content {
    background-color: transparent;
    padding         : 1rem
  }

  .card-footer {
    background-color: transparent;
    border-top      : 1px solid #ededed;
    align-items     : stretch;
    display         : flex
  }

  .card-footer-item {
    align-items    : center;
    display        : flex;
    flex-basis     : 0;
    flex-grow      : 1;
    flex-shrink    : 0;
    justify-content: center;
    padding        : .75rem
  }

  .card-footer-item:not(:last-child) {
    border-left: 1px solid #ededed
  }

  .card .media:not(:last-child) {
    margin-bottom: 1.5rem
  }

  .notification {
    background-color: #f5f5f5;
    border-radius   : .375em;
    position        : relative;
    padding         : 1rem 2.25rem 1rem 1.25rem;
    margin          : 1rem 0
  }

  .notification.is-warning {
    background-color: #ffe08a;
    color           : rgba(0,0,0,.7)
  }

  .menu {
    font-size: 1rem
  }

  .menu-list {
    line-height: 1.25;
    list-style : none;
    margin     : -.5rem -.75rem 0 -.75rem
  }

  .menu-list a {
    border-radius  : 2px;
    color          : #4a4a4a;
    display        : block;
    padding        : .3em .75em;
    line-height    : 1;
    align-items    : center;
    justify-content: space-between;
    display        : flex;
  }

  .menu-list a:hover {
    background-color: #f5f5f5;
    color           : #363636
  }

  .menu-list a.is-active {
    background-color: #eff5fb
  }

  .menu-list li ul {
    border-right : 1px solid #dbdbdb;
    margin       : .75em;
    padding-right: .75em
  }

  .menu-label {
    color          : #7a7a7a;
    font-size      : .75em;
    letter-spacing : .1em;
    text-transform : uppercase;
    display        : flex;
    justify-content: space-between;
  }

  .menu-label:not(:first-child) {
    margin-top: 1em
  }

  .menu-label:not(:last-child) {
    margin-bottom: 1em
  }

  .tag:not(body) {
    align-items     : center;
    background-color: #f5f5f5;
    border-radius   : 4px;
    color           : #4a4a4a;
    display         : inline-flex;
    font-size       : .75rem;
    height          : 2em;
    justify-content : center;
    line-height     : 1.5;
    padding-left    : .75em;
    padding-right   : .75em;
    white-space     : nowrap
  }

  .tag:not(body) .delete {
    margin-right: .25rem;
    margin-left : -.375rem
  }

  .tag:not(body).is-white {
    background-color: #fff;
    color           : #0a0a0a
  }

  .tag:not(body).is-black {
    background-color: #0a0a0a;
    color           : #fff
  }

  .tag:not(body).is-light {
    background-color: #f5f5f5;
    color           : rgba(0, 0, 0, .7)
  }

  .tag:not(body).is-dark {
    background-color: #363636;
    color           : #fff
  }

  .tag:not(body).is-primary {
    background-color: #00d1b2;
    color           : #fff
  }

  .tag:not(body).is-primary.is-light {
    background-color: #ebfffc;
    color           : #00947e
  }

  .tag:not(body).is-link {
    background-color: #485fc7;
    color           : #fff
  }

  .tag:not(body).is-link.is-light {
    background-color: #eff1fa;
    color           : #3850b7
  }

  .tag:not(body).is-info {
    background-color: #3e8ed0;
    color           : #fff
  }

  .tag:not(body).is-info.is-light {
    background-color: #eff5fb;
    color           : #296fa8
  }

  .tag:not(body).is-success {
    background-color: #48c78e;
    color           : #fff
  }

  .tag:not(body).is-success.is-light {
    background-color: #effaf5;
    color           : #257953
  }

  .tag:not(body).is-warning {
    background-color: #ffe08a;
    color           : rgba(0, 0, 0, .7)
  }

  .tag:not(body).is-warning.is-light {
    background-color: #fffaeb;
    color           : #946c00
  }

  .tag:not(body).is-danger {
    background-color: #f14668;
    color           : #fff
  }

  .tag:not(body).is-danger.is-light {
    background-color: #feecf0;
    color           : #cc0f35
  }

  .b-icon {
    align-items    : center;
    display        : inline-flex;
    justify-content: center;
    height         : 1rem;
    width          : 1rem;
    fill           : #7a7a7a;
    border-radius  : 4px;
  }

  .b-icon:hover {
    background-color: #eff5fb
  }

  .b-icon.is-medium {
    height : 1.2rem;
    width  : 1.2rem;
    padding: .3rem;
  }

  #tvhelper {
    position  : absolute;
    display   : block;
    width     : 13rem;
    height    : 18rem;
    min-height: 3rem;
    max-height: 95vh;
    right     : 2.2rem;
    bottom    : 0;
    margin    : 0.8rem;
    padding   : 0;
    overflow  : auto;
    resize    : vertical;
  }

  #tvhelper>.card .card-header {
    position  : sticky;
    top       : 0;
    background: inherit;
  }

  #tvhelper>.card::-webkit-scrollbar {
    width           : 6px;
    height          : 6px;
    background-color: transparent;
    z-index         : 999;
  }

  #tvhelper>.card::-webkit-scrollbar-track,
  #tvhelper>.card::-webkit-scrollbar-corner {
    background-color: transparent;
  }

  #tvhelper>.card::-webkit-scrollbar-thumb {
    border-radius   : 3px;
    background-color: #f0f3fa;
  }

  #tvhelper>.card {
    height    : 100%;
    overflow-y: auto;
    overflow-y: overlay;
    overflow-x: hidden;
    margin    : 0;
    padding   : 0;
  }

  #tvhelper>.card .card-content aside {
    display: block;
  }

  #tvhelper>.card .card-content ul.menu-list span.symbol-name,
  #tvhelper>.card .card-content p.menu-label span.plate-name{
    display      : inline-block;
    max-width    : 7rem;
    white-space  : nowrap;
    overflow     : hidden;
    text-overflow: ellipsis;
    display      : flex;
    flex-grow    : 1;
  }

  #tvhelper-tooltip {
    position: absolute;
    display : none;
    width   : 33rem;
    height  : 18rem;
    margin  : 0.8rem;
    right   : 16rem;
    bottom  : 0rem;
  }

  #tvhelper-tooltip.is-active {
    display: block;
  }

  #tvhelper-tooltip img {
    width: 100%;
  }

  .disabled {
    opacity: 0.6;
  }

  span.tv-data-mode--delayed--for-symbol-list {
    margin-left: -6px;
    transform  : scale(0.6) translate(10px, -10px)
  }`;

const svgSprite = `<svg width="0" height="0" class="hidden"><symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id="refresh-outline"><title>Refresh</title><path d="M320 146s24.36-12-64-12a160 160 0 10160 160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 58l80 80-80 80"></path></symbol><symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 460" id="search-circle"><title>Search Circle</title><path d="m225,33c-105.87,0 -192,86.13 -192,192s86.13,192 192,192s192,-86.13 192,-192s-86.13,-192 -192,-192zm91.31,283.31a16,16 0 0 1 -22.62,0l-42.84,-42.83a88.08,88.08 0 1 1 22.63,-22.63l42.83,42.84a16,16 0 0 1 0,22.62z" id="svg_1"/><circle cx="201" cy="201" id="svg_2" r="56"/></symbol><symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 460" id="search-circle-outline"><title>Search Circle</title><path d="m230,54a176,176 0 1 0 176,176a176,176 0 0 0 -176,-176z" fill="none" id="svg_1" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path d="m206,134a72,72 0 1 0 72,72a72,72 0 0 0 -72,-72z" fill="none" id="svg_2" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path d="m257.64,257.64l52.36,52.36" fill="none" id="svg_3" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32"/></symbol><symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id="eye-outline"><title>Eye</title><path d="M255.66 112c-77.94 0-157.89 45.11-220.83 135.33a16 16 0 00-.27 17.77C82.92 340.8 161.8 400 255.66 400c92.84 0 173.34-59.38 221.79-135.25a16.14 16.14 0 000-17.47C428.89 172.28 347.8 112 255.66 112z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path><circle cx="256" cy="256" r="80" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"></circle></symbol><symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id="eye-off-outline"><title>Eye Off</title><path d="M432 448a15.92 15.92 0 01-11.31-4.69l-352-352a16 16 0 0122.62-22.62l352 352A16 16 0 01432 448zM255.66 384c-41.49 0-81.5-12.28-118.92-36.5-34.07-22-64.74-53.51-88.7-91v-.08c19.94-28.57 41.78-52.73 65.24-72.21a2 2 0 00.14-2.94L93.5 161.38a2 2 0 00-2.71-.12c-24.92 21-48.05 46.76-69.08 76.92a31.92 31.92 0 00-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416a239.13 239.13 0 0075.8-12.58 2 2 0 00.77-3.31l-21.58-21.58a4 4 0 00-3.83-1 204.8 204.8 0 01-51.16 6.47zM490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.66 96a227.34 227.34 0 00-74.89 12.83 2 2 0 00-.75 3.31l21.55 21.55a4 4 0 003.88 1 192.82 192.82 0 0150.21-6.69c40.69 0 80.58 12.43 118.55 37 34.71 22.4 65.74 53.88 89.76 91a.13.13 0 010 .16 310.72 310.72 0 01-64.12 72.73 2 2 0 00-.15 2.95l19.9 19.89a2 2 0 002.7.13 343.49 343.49 0 0068.64-78.48 32.2 32.2 0 00-.1-34.78z"></path><path d="M256 160a95.88 95.88 0 00-21.37 2.4 2 2 0 00-1 3.38l112.59 112.56a2 2 0 003.38-1A96 96 0 00256 160zM165.78 233.66a2 2 0 00-3.38 1 96 96 0 00115 115 2 2 0 001-3.38z"></path></symbol><symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id="caret-up-outline"><title>Caret Up</title><path d="M414 321.94L274.22 158.82a24 24 0 00-36.44 0L98 321.94c-13.34 15.57-2.28 39.62 18.22 39.62h279.6c20.5 0 31.56-24.05 18.18-39.62z"></path></symbol></svg>`;

(function(window) {
    'use strict';
    const marketMap = {sz: 'SZSE', sh: 'SSE', hk: 'HKEX', hsi: 'HSI', ny: 'NYSE', oq: 'NASDAQ', am: 'AMEX'}; // nq: 三板
    const currencyMap = {sz: 'CNY', sh: 'CNY', hk: 'HKD', hsi: 'HKD', ny: 'USD', oq: 'USD', am: 'USD'};

    // utils
    const cEl = function (tag) { return document.createElement(tag) };
    const gID = function (id) { return document.getElementById(id) };
    const deU = function (str) { return JSON.parse(`["${str}"]`)[0] };

    // gtimg
    const gtRealtimeFetcher = async (ids) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://qt.gtimg.cn/q=' + ids.join(','),
                responseType: 'arraybuffer',
                onload: function (response) {
                    const responseText = new TextDecoder('gbk').decode(response.response);
                    resolve(_.fromPairs(responseText.split('\n').filter(l => l.length > 2).map(l => {
                        let [key, val] = l.split('=');
                        return [key.slice(2), val.slice(1, -2)];
                    })));
                },
                onerror: function (err) {
                    reject(err);
                }
            });
        });
    };
    const gtSuggestRaw = async (text) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://smartbox.gtimg.cn/s3/?v=2&q=${encodeURIComponent(text)}&t=all&c=1`,
                onload: function (response) {
                    const line = deU(response.responseText.split('\n').filter(l => l.startsWith('v_hint'))[0].slice(8, -1));
                    if (line.startsWith('N')) {
                        resolve([]);
                    } else {
                        resolve(_.flatten([line.split('^')]).map(l => l.split('~')));
                    }
                },
                onerror: function (err) {
                    reject(err);
                }
            });
        });
    };
    const fetchDataToDict = function (data, keys) {
        return _.zipObject(Object.keys(data), Object.values(data).map(i => _.zipObject(keys, i.split('~'))));
    };
    const getRealtimeBasic = async (...args) => {
        const keys = ['_', 'name', 'code', 'last', 'prev_close', 'open', 'volume', 's', 'b',
                      'buy1', 'buy1_vol', 'buy2', 'buy2_vol', 'buy3', 'buy3_vol', 'buy4', 'buy4_vol', 'buy5', 'buy5_vol',
                      'sell1', 'sell1_vol', 'sell2', 'sell2_vol', 'sell3', 'sell3_vol', 'sell4', 'sell4_vol', 'sell5', 'sell5_vol',
                      'latest_deal', 'time', 'change', 'change_rate', 'high', 'low', 'p_v_m', '_volume', 'turnover', 'turn_rate',
                      'pe', 'status'];
        let ids = [...args];
        ids = ids.map(i => (i.startsWith('ny') || i.startsWith('oq') || i.startsWith('am')) ? 'us' + i.slice(2) : i);
        const data = await gtRealtimeFetcher(ids);
        return fetchDataToDict(data, keys);
    };
    const gtSuggest = async (text) => {
        const arr = await gtSuggestRaw(text);
        const typeMap = {GP: 'stock', 'GP-A': 'stock', 'GP-A-KCB': 'stock', ZS: 'index', ETF: 'fund', LOF: 'fund', 'QDII-LOF': 'fund'}; // KJ: 'fund'
        return arr.map(i => {
            const [type, description] = [typeMap[i[4]], i[2]];
            if (type == undefined) return null;
            let [exchange, symbol] = [i[0], i[1]];
            if (symbol.includes('.')) {
                [symbol, exchange] = symbol.split('.');
                if (exchange == 'n') exchange = 'ny';
            } else if (exchange == 'hk' && type == typeMap.GP) {
                symbol = Number(symbol).toString();
            } else if (exchange == 'hk' && type == typeMap.ZS) {
                exchange = 'hsi';
            }
            if (marketMap[exchange] == undefined) return null;
            return {
                "symbol": symbol,
                "description": description,
                "type": type,
                "exchange": marketMap[exchange],
                "currency_code": currencyMap[exchange],
                "provider_id": "ice",
                "country": currencyMap[exchange].slice(0, 2)
            };
        }).filter(i => !!i);
    };

    // tonghuashun
    const getThsSelfRaw = async () => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://t.10jqka.com.cn/newcircle/group/getSelfStockWithMarket",
                responseType: 'json',
                onload: function (response) {
                    resolve(response.response);
                },
                onerror: function (err) {
                    reject(err);
                }
            });
        });
    };
    const getWencaiPlateRaw = async () => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://www.iwencai.com/unifiedwap/self-stock/plate/list",
                data: 'stocks=0&ths=0',
                responseType: 'json',
                onload: function (response) {
                    resolve(response.response);
                },
                onerror: function (err) {
                    reject(err);
                }
            });
        });
    };
    const parseMarketCode = (obj, mark = 'mark', stock = 'stock') => {
        if (obj[mark] == '17' || obj[mark] == '20') return 'sh' + obj[stock];
        if (obj[mark] == '33' || obj[mark] == '36' || obj[mark] == '32') return 'sz' + obj[stock];
        if (obj[mark] == '16') return 'sh' + obj[stock].replace(/^1B/, '00');
        if (obj[mark] == '120' && obj[stock].startsWith('00')) return 'sh' + obj[stock];
        if (obj[mark] == '177') return 'hk0' + obj[stock].slice(2);
        if (obj[mark] == '169') return 'ny' + obj[stock];
        if (obj[mark] == '185') return 'oq' + obj[stock];
        return null;
    };
    const getThsSelf = async () => {
        const obj = await getThsSelfRaw();
        if (obj.errorCode != 0) return obj.errorMsg;
        return obj.result.map(obj => parseMarketCode(obj, 'marketid', 'code')).filter(c => !!c);
    };
    const getWencaiPlate = async () => {
        const obj = await getWencaiPlateRaw();
        if (!obj.success) return []; // TODO: show error
        return obj.data.map(g => {
            const stocks = g.list.map(obj => parseMarketCode(obj)).filter(c => !!c);
            return {
                id: g.sn,
                name: g.ln,
                items: stocks
            };
        });
    };

    // tradingview
    const { fetch: originalFetch, _exposed_chartWidgetCollection: tvChart } = window;
    const originalSetSymbol = tvChart?.setSymbol;
    const toTvSymbol = (id) => {
        const [market, code] = [marketMap[id.slice(0, 2)], id.slice(2)];
        return market + ':' + (market == 'HKEX' ? Number(code).toString() : code);
    };
    const fromTvSymbol = (symbol) => {
        if (!symbol) return null;
        let [market, code] = symbol.split(':');
        if (market == 'HKEX') code = _.padStart(code, 5, '0');
        market = _.findKey(marketMap, (m) => m == market);
        if (market == undefined) return null;
        return market + code;
    };
    let latestSearchKw = null, latestSearchRes = null;
    const updateTvSymbol = (id) => {
        if (typeof tvChart?.setSymbol != 'function') return;
        tvChart.setSymbol(toTvSymbol(id), null, tvChart._subscribedChartWidget);
    };
    const hookedTvSearch = async (...args) => {
        const [resource, config] = args;
        if (!resource.startsWith('https://symbol-search'))
            return await originalFetch(resource, config);
        const kw = new URL(resource).searchParams.get('text');
        latestSearchKw = kw;
        const symbols = await gtSuggest(kw);
        latestSearchRes = symbols;
        return {
            ok: true,
            status: 200,
            json: () => ({symbols: symbols, symbols_remaining: 0})
        };
    };

    // render app
    const {h, render} = preact;
    const {useState, useEffect, useMemo} = preactHooks;
    const html = htm.bind(h);

    function App (props) {
        // data
        const [plateData, setPlateData] = useState([]);
        const [marketData, setMarketData] = useState({});
        const [marketCache, setMarketCache] = useState({});
        // ui
        const [onRefresh, setOnRefresh] = useState(false);
        const [isLogin, setIsLogin] = useState(true);
        // hook
        const [enableSearchHook, setEnableSearchHook] = useState(false);
        const [curSymbolTv, setCurSymbolTv] = useState(null);

        useEffect(() =>{
            window.fetch = enableSearchHook ? hookedTvSearch : originalFetch;
        }, [enableSearchHook]);
        useEffect(() => {
            if (typeof originalSetSymbol != 'function') return;
            // const tvSymbols = tvChart.chartsSymbols();
            // if (Object.values(tvSymbols).length > 0) {
            //     setCurSymbolTv(fromTvSymbol(Object.values(tvSymbols)[0].symbol));
            // }
            tvChart.setSymbol = (...args) => {
                setCurSymbolTv(fromTvSymbol(args[0]));
                if (latestSearchKw == args[0] && latestSearchRes.length > 0) {
                    return originalSetSymbol.bind(tvChart)(latestSearchRes[0].symbol, null, tvChart._subscribedChartWidget);
                } else {
                    return originalSetSymbol.bind(tvChart)(...args);
                }
            };
        }, []);

        const cachePlateData = (data) => { lscache.set('plateData', data, 1e15); };
        const updatePlateData = async () => {
            if (onRefresh) return;
            setOnRefresh(true);
            // start update
            const selfData = await getThsSelf();
            if (typeof selfData == 'string') {
                setIsLogin(false);
                setOnRefresh(false);
                return;
            }
            setIsLogin(true);
            const newPlateData = await getWencaiPlate();
            const filteredPlateData = SHOW_WENCAI_PLATE ? newPlateData : newPlateData.filter(g => Number(g.id) > 0);
            const newData = [{id: 0, name: '自选股', items: selfData, open: true}, ...filteredPlateData];
            let saveData = [], insertedIds = [];
            plateData.forEach(g => {
                const ol = newData.filter(o => o.id == g.id);
                if (ol.length == 0) return;
                const d = g;
                [d.name, d.items] = [ol[0].name, ol[0].items];
                saveData.push(d);
                insertedIds.push(d.id);
            });
            saveData = _.concat(saveData, newData.filter(o => !insertedIds.includes(o.id)));
            setPlateData(saveData);
            cachePlateData(saveData);
            // end update
            setOnRefresh(false);
        };
        useEffect(() =>{
            const cache = lscache.get('plateData');
            if (cache) {
                setPlateData(cache);
                return;
            }
            updatePlateData();
        }, []);

        let interval;
        const getNow = (div = 0) => Math.floor(new Date().getTime() / (div == 0 ? 1 : div));
        const updateMarketData = async () => {
            let now = getNow();
            const stocks = _.uniq(_.flatten(plateData.filter((_, i) => getPlateOpen(i)).map(g => g.items)));
            const noDataStocks = _.difference(stocks, Object.keys(marketCache));
            const needUpdateStocks = Object.keys(marketCache).filter(i => stocks.includes(i)).sort((a, b) => marketCache[a] - marketCache[b]);
            const pass = _.slice([...noDataStocks, ...needUpdateStocks], 0, 20);
            if (pass.length == 0) {
                // clearInterval(interval);
                return;
            }
            const passData = await getRealtimeBasic(...pass);
            const passStocks = Object.keys(passData);
            const passCache = _.zipObject(passStocks, _.fill(Array(passStocks.length), getNow()));
            setMarketData({...marketData, ...passData});
            setMarketCache({...marketCache, ...passCache});
        };
        useEffect(() => {
            if (plateData.length == 0) return;
            interval = setInterval(updateMarketData, 5000);
            return () => { clearInterval(interval) };
        }, [plateData, marketData]);

        const showIntraday = _.debounce((e) => {
            if (e.type != "mouseover") {
                tooltipElement.classList.remove('is-active');
                return;
            }
            const id = e.srcElement.dataset.id;
            if (!id.startsWith('sz') && !id.match(/^sh[^0]/)) return;
            tooltipElement.innerHTML = `<img src="https://image.sinajs.cn/newchart/min/n/${id}.gif?_=${getNow(100000)}" referrerpolicy="no-referrer">`;
            tooltipElement.classList.add('is-active');
        }, 1000);
        function Item (props) {
            const id = (props.id.startsWith('ny') || props.id.startsWith('oq')) ? 'us' + props.id.slice(2) : props.id;
            const marketItem = marketData ? marketData[id] : null;
            const name = marketItem ? marketItem.name : id;
            const suspend = marketItem?.status == 'S';
            const percent = marketItem ? (suspend ? '停牌' : marketItem.change_rate) : '-';
            let spanClass = '';
            if (percent > 0) spanClass = 'is-success';
            else if (percent < 0) spanClass = 'is-danger';
            return html`
            <li>
              <a onclick=${updateTvSymbol.bind(null, props.id)} class="${props.id == curSymbolTv ? 'is-active' : ''}">
                <span class="symbol-name">${name}</span>
                <span class="tag is-info is-light ${spanClass}" data-id=${id} onmouseover=${showIntraday} onmouseout=${showIntraday}
                >${percent}%</span>
              </a>
            </li>`
        }
        function raisePlate (index) {
            if (index < 1) return;
            let newPlate = [...plateData];
            [newPlate[index - 1], newPlate[index]] = [newPlate[index], newPlate[index - 1]];
            setPlateData(newPlate);
            cachePlateData(newPlate);
        }
        function getPlateOpen (index) {
            const plate = plateData[index];
            return Object.keys(plate).includes('open') && plate.open;
        }
        function flipPlate (index) {
            let newPlate = [...plateData];
            newPlate[index].open = !getPlateOpen(index);
            setPlateData(newPlate);
            cachePlateData(newPlate);
        }
        function Plate (props) {
            const {group, groupid} = props;
            const visible = getPlateOpen(groupid);
            return html`
            <p class="menu-label">
              <span class="plate-name">${group.name}</span>
              <span>
                <svg class="b-icon" onclick=${flipPlate.bind(null, groupid)}>
                  <use xlink:href="#eye${visible ? '' : '-off'}-outline"/>
                </svg>
                <svg class="b-icon" onclick=${raisePlate.bind(null, groupid)}><use xlink:href="#caret-up-outline"/></svg>
              </span>
            </p>
            <ul class="menu-list" style="display: ${visible ? 'block' : 'none'};">
              ${group.items.map(i => html`<${Item} id="${i}" />`)}
            </ul>`
        }

        return html`
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">同花顺小窗</p>
            <span class="card-header-icon">
              <svg class="b-icon is-medium"
                   onclick=${() => setEnableSearchHook(!enableSearchHook)}>
                <use xlink:href="#search-circle${enableSearchHook ? '' : '-outline'}"/>
              </svg>
              <svg class="b-icon is-medium ${onRefresh ? 'disabled' : ''}"
                   onclick=${updatePlateData}>
                <use xlink:href="#refresh-outline"/>
              </svg>
            </span>
          </header>
          <div class="card-content">
            <div class="notification is-warning" style="display: ${!isLogin ? 'block' : 'none'};">
              未登录，
              <a
                href="https://www.10jqka.com.cn/"
                title="若无法加载自选板块，请登录后点击同花顺主页的“问财”"
                rel="noopener noreferrer"
                target="_blank">到同花顺官网登录</a>
            </div>
            <aside class="menu">
              ${plateData.map((g, gi) => html`<${Plate} group=${g} groupid=${gi} /`)}
            </aside>
          </div>
        </div>`
    }

    const container = cEl('div'), svgElement = cEl('div'), tooltipElement = cEl('div');
    container.id = 'tvhelper';
    container.className = tooltipElement.className = 'card';
    tooltipElement.id = 'tvhelper-tooltip';
    svgElement.innerHTML = svgSprite;
    document.body.appendChild(svgElement);
    document.body.appendChild(container);
    document.body.appendChild(tooltipElement);
    render(html`<${App} />`, container);

    GM_addStyle(tvhelperCss);

})(unsafeWindow ?? window);