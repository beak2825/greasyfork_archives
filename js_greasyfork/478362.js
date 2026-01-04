// ==UserScript==
// @name         steam_booster_creator
// @namespace    http://tampermonkey.net/
// @version      2025.11.28.2
// @description  steam market get price
// @author       jacky
// @license      MIT
// @match        https://steamcommunity.com/tradingcards/boostercreator/*
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @run-at       document-end
// @connect      www.steamcardexchange.net
// @connect      woowoo.top
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/478362/steam_booster_creator.user.js
// @updateURL https://update.greasyfork.org/scripts/478362/steam_booster_creator.meta.js
// ==/UserScript==

GM_addStyle("table{border:solid 1px;border-collapse:collapse !important;}");
GM_addStyle("tr,td{border:solid 1px;border-collapse:collapse;padding-left:5px;padding-right:5px !important;}");
$('.booster_creator_right').after('<table id="a"></table>');
$('.booster_creator_right').after('<div id="b"></div>');
$('.booster_creator_right').after('<div id="c"></div>');
$('.booster_creator_right').after('<div id="iframeForm"></div>');
$('.booster_creator_right').after('<div><a href="javascript:void(0);" onclick="allcheck();">检查补充包售价</a></div>');
$('.booster_creator_right').after('<div><a href="javascript:void(0);" onclick="getList();">补充包列表</a><div>');
$('.booster_creator_goostatus').after('<div><a href="javascript:void(0);" onclick="checkPrice();">检查</a></div>');
//$('.booster_creator_goostatus').after('<div><a href="javascript:void(0);" onclick="sellItem(234530, 27883442160, 250);">sellItem</a></div>');
var g_rgWalletInfo = {"wallet_currency":23,"wallet_country":"CN","wallet_state":"","wallet_fee":"1","wallet_fee_minimum":"1","wallet_fee_percent":"0.05","wallet_publisher_fee_percent_default":"0.10","wallet_fee_base":"0"};
var publisherFee = g_rgWalletInfo['wallet_publisher_fee_percent_default'];
const us = 7.2916;
var list = [];
var gl = {"262830":"14282177"};
// 234530-War%20of%20the%20Vikings%20Booster%20Pack

$('#a').after('<form id="f" action="https://woowoo.top/booster.php?i=i" method="post" target="iframeForm"><input id="p" type="submit" value="0" /></form>');

var gem = GM_getValue("goo_price", 0);
var dt = GM_getValue("last_upd", 0);
if (Date.now() - dt > 60 * 2 * 60000 || gem == 0){
    getGems();
}

function getGems()
{
    $.ajax({
        url : '/market/itemordershistogram',
        type: 'GET',
        data: {
            country: "CN",
            language: "schinese",
            currency: 23,
            item_nameid: 26463978,
            two_factor: 0
        },
        success: function( data, status, xhr ){
            if (data.success == 1){
                if (data.lowest_sell_order) {
                    gem = data.lowest_sell_order;
                    console.log(gem);
                    GM_setValue("goo_price", gem);
                    GM_setValue("last_upd", Date.now());
                }}
        },
        fail: function( data, status, xhr ){
        }
    });
}

unsafeWindow.allcheck =function(){
    $('.h').each(function(i, k){
        setTimeout(function () {
            $(k).click();
        },1000 * i);
    });
}

unsafeWindow.checkPrice = function()
{
    $('#a').empty();
    $('#f').empty();
    $('#f').append('<input id="p" type="submit" value="0" />');
    var id = $('option:selected').val();
    var k = CBoosterCreatorPage.sm_rgBoosterData[id];
    var j = (k.price * gem / 100000).toFixed(2);

    GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://woowoo.top/booster.php',
        data: `q=${id}`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function (response) {
            console.log(response.responseText);
            var data = JSON.parse(response.responseText);
            data['a'].forEach(function (v) {
                if (v.h){
                    $('#a').append(`<tr id="${v.i}"><td><a target=_blank href="/tradingcards/boostercreator/#${v.i}">${v.i}</a></td><td><a target=_blank href="/market/listings/753/${v.h}">${v.h}</a></td><td>${j}</td><td>-</td><td>${v.n}</td><td>-</td><td><a class="h" href="javascript:void(0);" onclick="get_p(${v.i}, ${v.n}, ${j});">P</a></td></tr>`);
                    if (k.unavailable)
                        $(`#${v.i} td:first`).attr('title', k.available_at_time);
                } else{
                    getHash(v.i);
                }
            });
            data['b'].forEach(function (v) {
                getHash(v);
            });
        },
        fail: function( data, status, xhr ){
        }
    });
}

unsafeWindow.createBooster = function(id, p)
{
    $.ajax({
        url: "/tradingcards/ajaxcreatebooster/",
        type: "POST",
        data: {
            sessionid: g_sessionID,
            appid: id,
            series: 1,
            tradability_preference: 2
        },
        success: function( data, status, xhr ){
            if (data.purchase_result.success > 0) {
                // https://steamcommunity.com/inventory/76561198104311295/753/6?l=schinese&count=1&start_assetid=27723693913
                // https://steamcommunity.com/profiles/76561198104311295/inventory/#753_6_2986779918
                $(`#${id}`).append(`<td><a target=_blank href="/profiles/${g_steamID}/inventory/#753_6_${data.purchase_result.communityitemid}">${data.purchase_result.communityitemid}</a></td>`);
                $(`#${id}`).append(`<td><a href="javascript:void(0);" onclick="sellItem(${id}, ${data.purchase_result.communityitemid}, ${p})";>Sell</a></td>`);
                sellItem(id, data.purchase_result.communityitemid, p);
            } else {
                console.log(data);
                $(`#${id}`).append('<td>Failed</td>');
            }
        },
        fail: function( data, status, xhr ){
            $(`#${id}`).append(`<td>${status}</td>`);
        }
    });
}

unsafeWindow.sellItem = function(i, id, p)
{
    $.ajax({
        url: "/market/sellitem/",
        type: "POST",
        data: {
            sessionid: g_sessionID,
            appid: 753,
            contextid: 6,
            assetid: id,
            amount: 1,
            price: p
        },
        headers: {
            "Referer": `https://steamcommunity.com/profiles/${g_steamID}/inventory/`
        },
        success: function( data, status, xhr ){
            // {"success":true,"requires_confirmation":0}
            // https://steamcommunity.com/inventory/76561198104311295/753/6?l=schinese&count=1&start_assetid=27723693913
            // https://steamcommunity.com/profiles/76561198104311295/inventory/#753_6_27723693913
            // https://steamcommunity.com/market/pricehistory/?appid=753&market_hash_name=234530-War%20of%20the%20Vikings%20Booster%20Pack
            // https://steamcommunity.com/market/itemordershistogram?country=CN&language=english&currency=23&item_nameid=8565377&two_factor=0
            if (data.success) {
                if (data.requires_confirmation > 0)
                    $(`#${i}`).append('<td>Confirm</td>');
                else
                    $(`#${i}`).append('<td>Success</td>');
            } else {
                console.log(data);
                $(`#${i}`).append('<td>Failed</td>');
            }
        },
        fail: function( data, status, xhr ){
            $(`#${i}`).append(`<td>${status}</td>`);
        }
    });
}

function getSess()
{
    var s = null;
    $.ajax({
        url: `/profiles/${g_steamID}/inventory/`,
        type: "GET",
        async:false,
        success: function( data, status, xhr ){
            var m = /g_sessionID = "([0-9a-f]+)";/.exec(data);
            if (m)
                s = m[1];
        },
        fail: function( data, status, xhr ){
        }
    });
    return s;
}

unsafeWindow.getList = function()
{
    var a = [];
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://www.steamcardexchange.net/api/request.php?GetBoosterPrices',
        onload: function (response) {
            var data = JSON.parse(response.responseText);
            data.data.forEach(function (v) {
                /*
                0: id,name
                1: card num
                2: booster price
                3: ratio, price for 3 cards
                4: ratio, price for booster cresator
                5: timestamp
                */
                a[`.${v[0][0]}`] = [v[1],v[2],v[3][1],v[4][1]];
            });
            var i = 0;
            var b = [], q=[];
            $.each(CBoosterCreatorPage.sm_rgBoosterData, function(k, v){
                var p = (v.price * gem / 100000).toFixed(2);
                var y = a[`.${v.appid}`];
                var c=0, d=0, e=0, l="#FFFFFF";
                list[`.${v.appid}`] = v;
                if (y){
                    c = Math.floor(y[1].substr(1) * us * 100);
                    var fee = CalculateFeeAmount(c, publisherFee);
                    c = ((c - fee.fees) / 100).toFixed(2);
                    d = (y[2] * us).toFixed(2);
                    e = y[0];
                    if (c > p){
                        b[`.${v.appid}`] = [v.appid, v.price, p, c];
                        q.push(v.appid);
                        //l = "#00FF00";
                        //$('#a').append(`<tr id="${v.appid}"><td>${v.appid}</td><td>${v.name}</td><td>${v.price}</td><td>${p}</td><td><span style="color: ${l};">${c}</span></td><td>${e}</td><td>${d}</td></tr>`);
                        //setTimeout(getHash, i++ * 3000, v.appid);
                    }
                }
            });

            if (q.length > 0) {
                q = q.join();
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://woowoo.top/booster.php',
                    data: `q=${q}`,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    onload: function (response) {
                        var data = JSON.parse(response.responseText);
                        var i = 0, j = 0, k = 1;
                        data['a'].forEach(function (v) {
                            var y = b[`.${v.i}`];
                            if (v.h){
                                $('#a').append(`<tr id="${y[0]}"><td>${k++}</td><td><a target=_blank href="/tradingcards/boostercreator/#${y[0]}">${y[0]}</a></td><td><a target=_blank href="/market/listings/753/${v.h}">${v.h}</a></td><td>${y[1]}</td><td>${y[2]}</td><td>${v.n}</td><td>${y[3]}</td><td><a class="h" href="javascript:void(0);" onclick="get_p(${v.i}, ${v.n}, ${y[2]});">P</a></td></tr>`);
                                if (v.n > 0){
                                    //setTimeout(get_p, j++ * 600, v.i, v.n, y[2]);
                                }
                            }
                            else{
                                setTimeout(getHash, i++ * 3000, v.i);
                            }
                        });
                        data['b'].forEach(function (v) {
                            setTimeout(getHash, i++ * 3000, v);
                        });
                    },
                    fail: function( data, status, xhr ){
                    }
                });
            }
        },
        fail: function( data, status, xhr ){
            alert('fail');
        }

    });
}

unsafeWindow.getHash = function(id)
{
    console.log(id);
    var url = `/market/search/render/?query=&count=10&search_descriptions=0&sort_column=popular&sort_dir=desc&appid=753&category_753_item_class%5B%5D=tag_item_class_5&category_753_Game%5B%5D=tag_app_${id}&norender=1`;
    $.ajax({
        url: url,
        type: "GET",
        success: function( data, status, xhr ){
            if (data.success === true && data.results.length > 0 ){
                data = data.results[0];
                // data.asset_description.classid
                // data.asset_description.market_hash_name
                var r = data.hash_name;
                r = r.replace(/% /g, "%25 ");
                r = r.replace(/#/g, "%23");
                $(`#${id}`).append(`<td>${r}</td>`);
                url = `/market/listings/753/${r}`;
                $.ajax({
                    url: url,
                    type: "GET",
                    success: function( data, status, xhr ){
                        var y = 0;
                        var m = /Market_LoadOrderSpread\(\s*([0-9]+)/.exec(data);
                        if (m){
                            y = m[1];
                        } else {
                            m = /此物品不在货架上/.exec(data);
                            if (m) {
                                y = -1;
                            }
                        }
                        r = r.replace(/'/g, "&amp;#039;");
                        r = r.replace(/™/g, "&amp;trade;");
                        var g = CBoosterCreatorPage.sm_rgBoosterData[id];
                        var name = g.name;
                        name = name.replace(/'/g, "&amp;#039;");
                        name = name.replace(/™/g, "&amp;trade;");
                        name = `${name}^${r}^${y}^${g.price}`;
                        console.log(name);
                        $('#p').before(`<input type="hidden" name="${id}" value="${name}" />`);
                        $('#p').val(parseInt($('#p').val())+1);
                    },
                    fail: function( data, status, xhr ){
                        console.log(status);
                    }
                });
            }
        },
        fail: function( data, status, xhr ){
            console.log(status);
        }
    });
}

unsafeWindow.getPrice = function(id ,hash)
{
    $(`#${id}`).empty();
    hash = hash.replace(/\^/g, "'");
    hash = hash.replace(/% /g, "%25 ");
    hash = encodeURIComponent(hash);
    var url = `/market/priceoverview/?country=CN&currency=23&appid=753&market_hash_name=${hash}`;
    $.getJSON(url, function (data) {
        var v = -1;
        if (data.success === true) {
            var l = data.lowest_price;
            if (l){
                v = l;
            } else {
                v = 0;
            }
        }
        $(`#${id}`).append(`<a target=_blank href="/market/listings/753/${hash}">${v}</a>`);
    }).done(function () {
    }).fail(function( xhr, status, text ){
        $(`#${id}`).append(text);//xhr.statusText
    });
}

function co(q)
{
    var c = "#8F98A0";
    if (q < 0.85)
        c = "#00FF00";
    else if (q < 1)
        c = "#1E90FF";
    return c;
}

unsafeWindow.get_p = function(i, n, j)
{
    $.ajax({
        url: `/market/itemordershistogram?country=CN&language=schinese&currency=23&item_nameid=${n}&two_factor=0`,
        type: "GET",
        success: function( data, status, xhr ){
            if (data.success == 1){
                var buy = 0,bp = 0, bq = 0, c, fee;
                // data.buy_order_graph.length
                if (data.highest_buy_order) {
                    fee = CalculateFeeAmount(data.highest_buy_order, publisherFee);
                    buy = (data.highest_buy_order / 100).toFixed(2);
                    bp = ((data.highest_buy_order - fee.fees) / 100).toFixed(2);
                    bq = (j / bp).toFixed(2);//0.87
                    c = co(bq);
                }
                $(`#${i}`).append(`<td>${buy}</td><td>${bp}</td><td><span style="color: ${c};">${bq}</span></td>`);
                var sell = 0, sp = 0;
                // data.sell_order_graph.length
                if (data.lowest_sell_order){
                    fee = CalculateFeeAmount(data.lowest_sell_order, publisherFee);
                    sell = (data.lowest_sell_order / 100).toFixed(2);
                    sp = ((data.lowest_sell_order - fee.fees) / 100).toFixed(2);
                }
                $(`#${i}`).append(`<td>${sell}</td><td>${sp}</td>`);
            }
        },
        fail: function( data, status, xhr ){
            console.log(status);
        }
    });
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