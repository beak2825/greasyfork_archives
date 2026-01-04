// ==UserScript==
// @name         youpin_list
// @namespace    http://tampermonkey.net/
// @version      2024.09.18.1
// @description  youpin list
// @author       jacky
// @license      MIT
// @match        https://www.youpin898.com/*
// @icon         https://www.google.com/s2/favicons?domain=www.youpin898.com
// @require      http://libs.baidu.com/jquery/1.10.1/jquery.min.js
// @connect      steamcommunity.com
// @connect      woowoo.top
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_addStyle
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/508072/youpin_list.user.js
// @updateURL https://update.greasyfork.org/scripts/508072/youpin_list.meta.js
// ==/UserScript==

GM_addStyle("table{border:solid 1px;border-collapse:collapse !important;}");
GM_addStyle("tr,td{border:solid 1px;border-collapse:collapse;padding-left:5px;padding-right:5px;color:white !important;}");

var g_rgWalletInfo = {"wallet_currency":23,"wallet_country":"CN","wallet_state":"","wallet_fee":"1","wallet_fee_minimum":"1","wallet_fee_percent":"0.05","wallet_publisher_fee_percent_default":"0.10","wallet_fee_base":"0"};
var publisherFee = g_rgWalletInfo['wallet_publisher_fee_percent_default'];

var g = 'csgo';
var st = 0; // 429: Too Many Requests
var timer = 10000;

var mg, app, ua, ub, up = false;
switch (g) {
    case 'dota':
        app = 570;
        ua = 'dota2';
        break;
    case 'csgo':
        app = 730;
        ua = 'csgo';
        break;
}

(function(open) {
    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
        this.addEventListener("load", function() {
            // https://api.youpin898.com/api/homepage/search/list
            // https://api.youpin898.com/api/homepage/es/template/GetCsGoPagedList
            if (up && (/search\/list|GetCsGoPagedList/.exec(this.responseURL))){
                parse(this.responseText);
            }
        }, false);
        open.call(this, method, url, async, user, pass);
    };
})(XMLHttpRequest.prototype.open);

window.addEventListener ("DOMContentLoaded", DOM_ContentReady);
window.addEventListener ("load", pageFullyLoaded);

function DOM_ContentReady () {
    $('.game-box').append('<div id="b"><table id="a"></table></div>');
    $('#b').append('<input id="up" type=button value="Enable" />');
    $('#b').after('<iframe id="iframeForm" name="iframeForm" style="display:none;"></iframe>');
    $('#b').after(`<form id="f" action="https://woowoo.top/you.php?g=${g}" method="post" target="iframeForm"></form>`);
    $('#b').after(`<form id="f2" action="https://woowoo.top/you.php?g=${g}" method="post" target="iframeForm"></form>`);
}

function pageFullyLoaded () {
    $('#up').click(function(){
        if (up) {
            up = false;
            this.value = "Enable";
        } else {
            up = true;
            this.value = "Disable";
        }
    });
}

function parse(html){
    var data = JSON.parse(html);
    if (data && data.Code==0){
        if ($('#b').length > 0) {
            $('#a').empty();
            $('#f').empty();
            $('#f2').empty();
        } else {
            $('.game-box').append('<div id="b"><table id="a"></table></div>');
            $('#b').append('<input id="up" type=button value="Enable" />');
            $('#b').after('<iframe id="iframeForm" name="iframeForm" style="display:none;"></iframe>');
            $('#b').after(`<form id="f" action="https://woowoo.top/you.php?g=${g}" method="post" target="iframeForm"></form>`);
            $('#b').after(`<form id="f2" action="https://woowoo.top/you.php?g=${g}" method="post" target="iframeForm"></form>`);
        }


        if (data.TotalCount >0){
            var k = 1, l = [], q = [];
            var d = data.Data.commodityTemplateList ? data.Data.commodityTemplateList : data.Data;
            $.each(d, function(k, v){
                // https://www.youpin898.com/goodInfo?id=108843&stickersIsSort=0&listType=10
                var bq = (v.Price / v.SteamPrice).toFixed(2);//0.87
                var c = co(bq);
                l[`.${v.Id}`] = {
                    't': v.CommodityName,
                    'p': v.Price,
                    'n': v.OnSaleCount,
                    's': v.SteamPrice,
                    'l': v.CommodityHashName
                };
                q.push(v.Id);
            });

            if (q.length > 0) {
                q = q.join();
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://woowoo.top/you.php?g=${g}&q=${q}`,
                    onload: function (response) {
                        var data = JSON.parse(response.responseText);
                        var k = 1, z = 1, r = [];
                        st = 0;
                        data['a'].forEach(function (v) {
                            var i = v['i'];
                            var j = l[`.${i}`];
                            $('#a').append(`<tr id=${i}><td><a target=_blank href="https://woowoo.top/you.php?g=${g}&q=${i}">${i}</a></td><td><a target=_blank href="/goodInfo?id=${i}&stickersIsSort=0&listType=10">${j['t']}</a><br><a target=_blank href="https://steamcommunity.com/market/listings/${app}/${v['l']}">${v['l']}</a></td><td>${j['p']}</td><td>${j['n']}</td></tr>`);
                            if (!v['n'] || v['n'] == 0){
                                r.push(v);
                            } else {
                                setTimeout(get_p, z++ * timer, i, v['n'], j['p']);
                            }
                        });
                        var q = r.length;
                        if (q > 0){
                            var f = true;
                            $('#f2').append('<input id="p2" type="submit" value="Submit" />');
                            $('#f2').after('<table id="c"></table>');
                            st = 0;
                            r.forEach(function (v) {
                                var i = v['i'];
                                var url = `https://steamcommunity.com/market/listings/${app}/${v['l']}`;
                                GM_xmlhttpRequest({
                                    method: 'GET',
                                    url: url,
                                    onload: function (response) {
                                        $('#p2').val(--q);
                                        var y = 0;
                                        var m = /Market_LoadOrderSpread\(\s*([0-9]+)/.exec(response.responseText);
                                        if (m){
                                            y = m[1];
                                        } else {
                                            m = /此物品不在货架上/.exec(response.responseText);
                                            if (m) {
                                                y = -1;
                                            }
                                        }
                                        if (y > 0) {
                                            setTimeout(get_p, z++ * timer, i, y, l[`.${i}`]['p']);
                                        }
                                        $('#f2').append(`<input type="hidden" name="${i}" value="${y}" />`);
                                        $('#c').append(`<tr><td>${i}</td><td>${y}</td></tr>`);
                                        if (q==0){
                                            $('#p2').click();
                                        }
                                    }
                                });
                            });
                        }

                        var p = data['b'].length;
                        if (p > 0){
                            $('#f').append('<input id="p" type="submit" value="Submit" />');
                            st = 0;
                            data['b'].forEach(function (v) {
                                var i = v;
                                var j = l[`.${i}`]['t'];
                                var k = l[`.${i}`]['l'];
                                var y = 0;
                                var url = `https://steamcommunity.com/market/listings/${app}/${k}`;
                                console.log(url);
                                GM_xmlhttpRequest({
                                    method: 'GET',
                                    url: url,
                                    onload: function (response) {
                                        $('#p').val(--p);
                                        var m = /Market_LoadOrderSpread\(\s*([0-9]+)/.exec(response.responseText);
                                        if (m){
                                            y = m[1];
                                        } else {
                                            m = /此物品不在货架上/.exec(response.responseText);
                                            if (m) {
                                                y = -1;
                                            }
                                        }
                                        if (y > 0){
                                            $('#a').append(`<tr id=${i}><td><a target=_blank href="https://woowoo.top/you.php?g=${g}&q=${i}">${i}</a></td><td><a target=_blank href="/goodInfo?id=${i}&stickersIsSort=0&listType=10">${j}</a><br><a target=_blank href="https://steamcommunity.com/market/listings/${app}/${k}">${k}</a></td><td>${l[`.${i}`]['p']}</td><td>${l[`.${i}`]['n']}</td></tr>`);
                                            setTimeout(get_p, z++ * timer, i, y, l[`.${i}`]['p']);
                                        }
                                        //$('#f').after(`<div>${j}|${k}|${y}</div>`);
                                        $('#f').append(`<input type="hidden" name="${i}" value="${j}^${k}^${y}" />`);
                                        if (p==0){
                                            $('#p').click();
                                        }
                                    },
                                    fail: function( data, status, xhr ){
                                        $('#f').append(`<input type="hidden" name="${i}" value="${j}^${k}^${y}" />`);
                                        $('#p').val(--p);
                                        if (p==0){
                                            $('#p').click();
                                            /*
                                setTimeout(function () {
                                    location.reload();
                                },3000);
                                */
                                        }
                                    }
                                });

                            });
                        }
                    }
                });
            }

        }
    }
}

function co(q)
{
    var c = "#FFFFFF";
    if (q < 0.65)
        c = "#00FF00";
    else if (q < 0.75)
        c = "#00FF7F";
    else if (q < 0.85)
        c = "#1E90FF";
    return c;
}

function get_p(i, n, j)
{
    $(`#${i}`).append(`<td><a target=_blank href="https://steamcommunity.com/market/itemordershistogram?country=CN&language=schinese&currency=23&item_nameid=${n}&two_factor=0">${n}</a></td>`);
    if (st == 429){
        $(`#${i}`).append(`<td>429: Too Many Requests</td>`);
    } else {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://steamcommunity.com/market/itemordershistogram?country=CN&language=schinese&currency=23&item_nameid=${n}&two_factor=0`,
            synchronous: false,
            onload: function (response) {
                st = response.status;
                if (st > 200){
                    $(`#${i}`).append(`<td>${st}</td>`);
                } else {
                    var data = JSON.parse(response.responseText);
                    if (data.success == 1){
                        var buy = 0,bp = 0, bq = 0, c, fee, l = 0;
                        // data.buy_order_graph.length
                        if (data.highest_buy_order) {
                            fee = CalculateFeeAmount(data.highest_buy_order, publisherFee);
                            buy = (data.highest_buy_order / 100).toFixed(2);
                            bp = ((data.highest_buy_order - fee.fees) / 100).toFixed(2);
                            bq = (j / bp).toFixed(2);//0.87
                            c = co(bq);
                        }
                        if (data.buy_order_graph.length > 0) {
                            l = data.buy_order_graph[0][1];
                        }
                        $(`#${i}`).append(`<td>${buy}</td><td>${bp}</td><td><span style="color: ${c};">${bq}</span></td><td><span>${l}</span></td>`);
                        var sell = 0, sp = 0, sq = 0;
                        // data.sell_order_graph.length
                        if (data.lowest_sell_order){
                            fee = CalculateFeeAmount(data.lowest_sell_order, publisherFee);
                            sell = (data.lowest_sell_order / 100).toFixed(2);
                            sp = ((data.lowest_sell_order - fee.fees) / 100).toFixed(2);
                            sq = (j / sp).toFixed(2);//0.87
                            c = co(sq);
                        }
                        l = 0
                        if (data.sell_order_graph.length > 0) {
                            l = data.sell_order_graph[0][1];
                        }
                        $(`#${i}`).append(`<td>${sell}</td><td>${sp}</td><td><span style="color: ${c};">${sq}</span></td><td><span>${l}</span></td>`);
                    }
                }
            },
            fail: function( data, status, xhr ){
                $(`#${i}`).append(`<td>${status}</td>`);
            }
        });
    }
}

// https://steamcommunity.com/market/priceoverview/?country=CN&currency=23&appid=730&market_hash_name=Sticker%20%7C%20God%20of%20Fortune
function get_p2(i, n, j)
{
    if (st == 429){
        $(`#${i}`).append(`<td>429: Too Many Requests</td>`);
    } else {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://steamcommunity.com/market/priceoverview/?country=CN&currency=23&appid=${app}&market_hash_name=${n}`,
            synchronous: false,
            onload: function (response) {
                st = response.status;
                if (st > 200){
                    $(`#${i}`).append(`<td>${st}</td>`);
                } else {
                    var data = JSON.parse(response.responseText);
                    if (data.success == 1){
                        var buy = 0,bp = 0, bq = 0, c, fee;
                        // lowest_price
                        // median_price
                        var m = /[0-9.]+/.exec(data.lowest_price);
                        if (m) {
                            fee = CalculateFeeAmount(m[0] * 100, publisherFee);
                            buy = m[0];
                            bp = (m[0] - fee.fees / 100).toFixed(2);
                            bq = (j / bp).toFixed(2);//0.87
                            c = co(bq);
                        }
                        $(`#${i}`).append(`<td>${buy}</td><td>${bp}</td><td><span style="color: ${c};">${bq}</span></td>`);
                    }
                }
            },
            fail: function( data, status, xhr ){
                $(`#${i}`).append(`<td>${status}</td>`);
            }
        });
    }
}

function CalculateFeeAmount( amount, publisherFee )
{
    if ( !g_rgWalletInfo['wallet_fee'] )
        return 0;
    publisherFee = ( typeof publisherFee == 'undefined' ) ? 0 : publisherFee;
    // Since CalculateFeeAmount has a Math.floor, we could be off a cent or two. Let's check:
    var iterations = 0; // shouldn't be needed, but included to be sure nothing unforseen causes us to get stuck
    var nEstimatedAmountOfWalletFundsReceivedByOtherParty = parseInt( ( amount - parseInt( g_rgWalletInfo['wallet_fee_base'] ) ) / ( parseFloat( g_rgWalletInfo['wallet_fee_percent'] ) + parseFloat( publisherFee ) + 1 ) );
    var bEverUndershot = false;
    var fees = CalculateAmountToSendForDesiredReceivedAmount( nEstimatedAmountOfWalletFundsReceivedByOtherParty, publisherFee );
    while ( fees.amount != amount && iterations < 10 )
    {
        if ( fees.amount > amount )
        {
            if ( bEverUndershot )
            {
                fees = CalculateAmountToSendForDesiredReceivedAmount( nEstimatedAmountOfWalletFundsReceivedByOtherParty - 1, publisherFee );
                fees.steam_fee += ( amount - fees.amount );
                fees.fees += ( amount - fees.amount );
                fees.amount = amount;
                break;
            }
            else
            {
                nEstimatedAmountOfWalletFundsReceivedByOtherParty--;
            }
        }
        else
        {
            bEverUndershot = true;
            nEstimatedAmountOfWalletFundsReceivedByOtherParty++;
        }
        fees = CalculateAmountToSendForDesiredReceivedAmount( nEstimatedAmountOfWalletFundsReceivedByOtherParty, publisherFee );
        iterations++;
    }
    // fees.amount should equal the passed in amount
    return fees;
}

function CalculateAmountToSendForDesiredReceivedAmount( receivedAmount, publisherFee )
{
    if ( !g_rgWalletInfo['wallet_fee'] )
        return receivedAmount;
    publisherFee = ( typeof publisherFee == 'undefined' ) ? 0 : publisherFee;
    var nSteamFee = parseInt( Math.floor( Math.max( receivedAmount * parseFloat( g_rgWalletInfo['wallet_fee_percent'] ), g_rgWalletInfo['wallet_fee_minimum'] ) + parseInt( g_rgWalletInfo['wallet_fee_base'] ) ) );
    var nPublisherFee = parseInt( Math.floor( publisherFee > 0 ? Math.max( receivedAmount * publisherFee, 1 ) : 0 ) );
    var nAmountToSend = receivedAmount + nSteamFee + nPublisherFee;

    return {
        steam_fee: nSteamFee,
        publisher_fee: nPublisherFee,
        fees: nSteamFee + nPublisherFee,
        amount: parseInt( nAmountToSend )
    };
}