// ==UserScript==
// @name         steam_market_calc_fee
// @namespace    http://tampermonkey.net/
// @version      2025.11.28.1
// @description  calc fee for steam market
// @author       jacky
// @license      MIT
// @match        https://steamcommunity.com/market/listings/*
// @require      http://libs.baidu.com/jquery/1.10.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/507876/steam_market_calc_fee.user.js
// @updateURL https://update.greasyfork.org/scripts/507876/steam_market_calc_fee.meta.js
// ==/UserScript==

var hash, app, publisherFee;

window.addEventListener ("DOMContentLoaded", DOM_ContentReady);
window.addEventListener ("load", pageFullyLoaded);

(function(open) {
    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
        this.addEventListener("load", function() {
            // https://steamcommunity.com/market/itemordershistogram?language=english&country=CN&currency=23&item_nameid=2006775
            if (/itemordershistogram/.exec(this.responseURL)){
                parse(this.responseText);
            }
        }, false);
        open.call(this, method, url, async, user, pass);
    };
})(XMLHttpRequest.prototype.open);



function DOM_ContentReady() {
    publisherFee = g_rgWalletInfo['wallet_publisher_fee_percent_default'];
    var m = /Market_LoadOrderSpread\(\s*([0-9]+)/.exec(document.body.innerHTML);
    if (m)
        $('#market_commodity_order_spread').before(`<div><a target=_blank href="/market/itemordershistogram?country=CN&language=schinese&currency=23&item_nameid=${m[1]}&two_factor=0">${m[1]}</a></div>`);
    m = /(\d+)_name', (\d+), '(\d+)', '(\d+)'/.exec(document.body.innerHTML);
    if(m) {
        var g = g_rgAssets[m[2]][m[3]][m[4]];
        hash = g.market_hash_name;
        app = g.market_fee_app;
        $('#market_commodity_order_spread').before(`<div><a target=_blank href="/market/multisell?appid=753&contextid=6&items[]=${g.market_hash_name}">以请求价格出售</a></div>`);
        $('#market_commodity_order_spread').before(`<div id="c${app}"></div>`);
    }
}

function pageFullyLoaded() {
}

unsafeWindow.createbuyorder = function(hash, p, id){
    hash = hash.replace(/\^/g, "'");
    var da = {
        sessionid: g_sessionID,
        currency: 23,
        appid: 753,
        market_hash_name: hash,
        price_total: p,
        quantity: 1,
        billing_state: '',
        save_my_address: 0
    };
    var w = '#c' + id;
    $(w).empty();
    $(w).append('正在购买 ...');
    $.ajax({
        url: '/market/createbuyorder/',
        type: 'POST',
        async: false,
        data: da,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        }
    }).done(function (data) {
        $(w).empty();
        if (data.success === 1)
        {
            setTimeout(getbuyorderstatus, 3000, data.buy_orderid, w);
        }
        else
        {
            $(w).append(data.message);
        }
    }).fail(function (xhr) {
        alert(xhr);
    });
}

unsafeWindow.getbuyorderstatus = function(buy_orderid, w){
    $.ajax({
        url: '/market/getbuyorderstatus/',
        type: 'GET',
        async: false,
        data: {
            sessionid: g_sessionID,
            buy_orderid: buy_orderid
        }
    }).done(function (data) {
        $(w).empty();
        if (data.success === 1)
            $(w).append(buy_orderid);
        else
            $(w).append(data);
    }).fail(function (xhr) {
        alert(xhr);
    });
}

function parse(html){
    var data = JSON.parse(html);
    if (data && data.success==1){
        var s = (data.lowest_sell_order / 100).toFixed(2);
        if ($('#ab').length >0)
            $('#ab').remove();
        $('#market_commodity_order_spread').before(`<a id="ab" href="javascript:void(0);" onclick="createbuyorder('${hash}',${data.lowest_sell_orderp},${app});">购买 ${data.lowest_sell_order}</a>`);
        var fee = CalculateFeeAmount(data.lowest_sell_order, publisherFee);
        s = ((data.lowest_sell_order - fee.fees) / 100).toFixed(2);
        $('#market_commodity_forsale>span:last').append(` | ${s}`);
        var b = (data.highest_buy_order / 100).toFixed(2);
        fee = CalculateFeeAmount(data.highest_buy_order, publisherFee);
        b = ((data.highest_buy_order - fee.fees) / 100).toFixed(2);
        $('#market_commodity_buyrequests>span:last').append(` | ${b}`);
    }
}