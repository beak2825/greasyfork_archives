// ==UserScript==
// @name         pubg_key_list
// @namespace    http://tampermonkey.net/
// @version      2024.09.19.1
// @description  pubg key list
// @license      MIT
// @author       jacky
// @match        https://steamcommunity.com/market/search?appid=578080&q=key
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @require      http://libs.baidu.com/jquery/1.10.1/jquery.min.js
// @run-at       document-end
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/509284/pubg_key_list.user.js
// @updateURL https://update.greasyfork.org/scripts/509284/pubg_key_list.meta.js
// ==/UserScript==

GM_addStyle("table{border:solid 1px;border-collapse:collapse !important;}");
GM_addStyle("tr,td{border:solid 1px;border-collapse:collapse;padding-left:5px;padding-right:5px !important;}");

$('#searchResultsRows').after('<table id="a"></table>');
var list = {"175986688":"AVIATOR KEY", "175977917":"WEAPON SKIN KEY", "175955677":"EARLY BIRD KEY", "176035385":"EAST ERANGEL POLICE KEY"};
var publisherFee = g_rgWalletInfo['wallet_publisher_fee_percent_default'];

var i = 0;
$.each(list, function(k, v){
    $('#a').append(`<tr id="${k}"><td><a target=_blank href="/market/listings/578080/${v}">${v}</a></td></tr>`);
    setTimeout(getp, i++ * 5000, k);
});

function getp(i)
{
    var k = i;
    $.ajax({
        url: `/market/itemordershistogram?country=CN&language=schinese&currency=23&item_nameid=${i}&two_factor=0`,
        type: 'GET',
        async: true
    }).done(function (data) {
        if (data.success == 1){
            var buy = 0,bp = 0, bq = 0, c, fee, l = 0;
            // data.buy_order_graph.length
            if (data.highest_buy_order) {
                fee = CalculateFeeAmount(data.highest_buy_order, publisherFee);
                buy = (data.highest_buy_order / 100).toFixed(2);
                bp = ((data.highest_buy_order - fee.fees) / 100).toFixed(2);
            }
            if (data.buy_order_graph.length > 0) {
                l = data.buy_order_graph[0][1];
            }
            $(`#${k}`).append(`<td>${buy}</td><td>${bp}</td><td>${l}</td>`);
            var sell = 0, sp = 0, sq = 0;
            // data.sell_order_graph.length
            if (data.lowest_sell_order){
                fee = CalculateFeeAmount(data.lowest_sell_order, publisherFee);
                sell = (data.lowest_sell_order / 100).toFixed(2);
                sp = ((data.lowest_sell_order - fee.fees) / 100).toFixed(2);
            }
            l = 0
            if (data.sell_order_graph.length > 0) {
                l = data.sell_order_graph[0][1];
            }
            $(`#${k}`).append(`<td>${sell}</td><td>${sp}</td><td>${l}</td>`);
        }
    }).fail(function (xhr) {
        $(`#${k}`).append(`<td>-</td><td>-</td><td>-</td>`);
    });
}