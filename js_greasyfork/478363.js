// ==UserScript==
// @name         steam_market_get_price
// @namespace    http://tampermonkey.net/
// @version      2025.12.01.2
// @description  steam market get price
// @author       jacky
// @license      MIT
// @include      https://steamcommunity.com/profiles/*/inventory*
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @run-at       document-end
// @connect      woowoo.top
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/478363/steam_market_get_price.user.js
// @updateURL https://update.greasyfork.org/scripts/478363/steam_market_get_price.meta.js
// ==/UserScript==

var gp = GM_getValue("goo_price", 0);
var dt = GM_getValue("last_upd", 0);
if (Date.now() - dt > 60 * 6 * 60000 || gp == 0){
    getGems();
}

var lowest_sell_order = 0;
var highest_buy_order = 0;
var goo = 0;
var publisherFee = g_rgWalletInfo['wallet_publisher_fee_percent_default'];
var gf = Math.floor(gp - CalculateFeeAmount(gp, publisherFee).fees);

(function(open) {
    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
        this.addEventListener("load", function() {
            if (/raw_asset_properties/.exec(this.responseURL)){
                parse2(this.response);
            }
        }, false);
        open.call(this, method, url, async, user, pass);
    };
})(XMLHttpRequest.prototype.open);

const { fetch: _fetch } = window;
unsafeWindow.fetch = async (...args) => {
    let [resource, config] = args;
    let response = await _fetch(resource, config);
    var m = /ajaxgetgoovalueforitemtype|itemordershistogram/.exec(resource);
    if (m){
        try {
            const _json = await response.clone().json();
            switch (m[0]){
                case 'ajaxgetgoovalueforitemtype':
                    getgoo(_json);
                    break;

                case 'itemordershistogram':
                    parse(_json);
                    break;
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    return response;
};

function co(q)
{
    var c = "#FF0000";
    if (q < 0.65)
        c = "#00FF00";
    else if (q < 0.75)
        c = "#00FF7F";
    else if (q < 0.85)
        c = "#1E90FF";
    return c;
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
                    gp = data.lowest_sell_order;
                    console.log(gp);
                    GM_setValue("goo_price", gp);
                    GM_setValue("last_upd", Date.now());
                }}
        },
        fail: function( data, status, xhr ){
        }
    });
}

window.addEventListener("DOMContentLoaded", DOM_ContentReady);
window.addEventListener("load", pageFullyLoaded);

function DOM_ContentReady () {
    GM_addStyle("table{border:solid 1px;border-collapse:collapse !important;}");
    GM_addStyle("tr,td{border:solid 1px;border-collapse:collapse;padding-left:5px;padding-right:5px !important;}");
    $('#tabcontent_inventory').after('<table id="a"></table>');
    $('#tabcontent_inventory').after('<table id="k"></table>');
    $('#tabcontent_inventory').append('&nbsp;<a href="javascript:void(0);" onclick="fff();">FFF</a>');
    $('#tabcontent_inventory').after('<a class="c" data-p="0" data-c="5000">LIST</a>');
    // 12236791045
    // 4835558033
    $('#tabcontent_inventory').after('<a class="c" data-p="32590160562" data-c="20">LIST2</a>&nbsp;');
    $('#tabcontent_inventory').after('<iframe id="iframeForm" name="iframeForm" style="display:none;"></iframe>');
    $('#tabcontent_inventory').after(`<form id="f" action="https://woowoo.top/goo.php" method="post" target=_blank></form>`);
}

function pageFullyLoaded() {
    /*
    (function(open) {
        XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
            this.addEventListener("load", function() {
                // https://steamcommunity.com/market/priceoverview/?country=CN&currency=23&appid=570&market_hash_name=Frozen%20Touch
                // {success: true, lowest_price: "¥ 0.99", volume: "4", median_price: "¥ 0.88"}
                // https://steamcommunity.com/market/itemordershistogram?language=english&country=CN&currency=23&item_nameid=2006775
                // https://steamcommunity.com/market/pricehistory/?appid=570&market_hash_name=LGD%27s%20Golden%20Skipper
                // https://steamcommunity.com/auction/ajaxgetgoovalueforitemtype/?appid=33120&item_type=3&border_color=0
                if (/itemordershistogram/.exec(this.responseURL)){
                    parse(this.response);
                } else if (/\/\d+\?/.exec(this.responseURL)){
                    parse2(this.response);
                } else if (/ajaxgetgoovalueforitemtype/.exec(this.responseURL)) {
                    getgoo(this.response);
                }
            }, false);
            open.call(this, method, url, async, user, pass);
        };
    })(XMLHttpRequest.prototype.open);
*/

    $("body").on('click', '.c', function(){
        var d = $(this);
        var a = d.data("p");
        var b = d.data("c");
        if (start > 0)
            a = start;
        var url = `/inventory/${g_steamID}/753/6?l=schinese&count=${b}&start_assetid=${a}`;
        $.ajax({
            url: url,
            type: "GET",
            success: function( data, status, xhr ){
                if (data.success == 1){
                    if (data.more_items)
                        d.data("p", data.last_assetid);
                    else
                        d.data("p", d.attr("data-p"));
                }
            },
            fail: function( data, status, xhr ){
                alert(status);
            }
        });
    });
}

function getgoo(data) {
    // "{"success":1,"goo_value":"40"}"
    goo = 0;
    if (data && data.success == 1){
        goo = data.goo_value;
        /*
        var p1 = (goo * gp / 100000).toFixed(2);
        var p = (lowest_sell_order / goo * 10).toFixed(2);
        var sq = (lowest_sell_order / goo / gp * 1000).toFixed(2);
        var c = co(sq);
        var fee = (CalculateFeeAmount(goo * gp /1000, publisherFee).fees / 100).toFixed(2);
        //$('.item_scrap_price').append(`<div>出售宝珠价格：${p1} - ${fee}</div>`);
        //$('.item_scrap_price').append(`<div style="color: ${c};">转换宝珠成本：${p} / ${gp}（${gf}）/ ${sq}</div>`);
        */
    }
}

function parse(data){
    if (data && data.success==1){
        var h,l;
        if (data.highest_buy_order > 0)
            h = `${data.buy_order_graph[0][0]}(${data.buy_order_graph[0][1]})`;
        if (data.lowest_sell_order > 0)
            l = `${data.sell_order_graph[0][0]}(${data.sell_order_graph[0][1]})`;
        if ($('#iteminfo9').length > 0)
            $('#iteminfo9').empty();
        else
            $('.inventory_page_right #iteminfo0').before('<div id="iteminfo9"></div>');
        $('#iteminfo9').append(`<div style="min-height: 3em; margin-left: 1em;">求购价：${h}；出售价：${l}</div>`);
        if (goo > 0) {
            var p1 = (goo * gp / 100000).toFixed(2);
            var p = (data.lowest_sell_order / goo * 10).toFixed(2);
            var sq = (data.lowest_sell_order / goo / gp * 1000).toFixed(2);
            var c = co(sq);
            var fee = (CalculateFeeAmount(goo * gp /1000, publisherFee).fees / 100).toFixed(2);
            $('#iteminfo9').append(`<div>出售${goo}宝珠价格：${p1} - ${fee}</div>`);
            $('#iteminfo9').append(`<div style="color: ${c};">转换宝珠成本：${p} / ${gp}（${gf}）/ ${sq}</div>`);
        }
    }
}

var r3 = [];
var r2 = [];
unsafeWindow.fff = function()
{
    if (r2.length > 0 && r2.length < 21) {
        var q = r2.join();
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://woowoo.top/goo.php?q=${q}`,
            onload: function (response) {
                var data = JSON.parse(response.responseText);
                data['a'].forEach(function (v) {
                    var id = v['i'];
                    var hash = v['h'];
                    var app = v['a'];
                    var type = v['t'];
                    var color = v['c'];
                    var mark = v['m'];
                    var val = v['v'];
                    var h = hash.replace(/&#039;/g, '^');

                    var g = -1;
                    $.ajax({
                        url: `/auction/ajaxgetgoovalueforitemtype/?appid=${app}&item_type=${type}&border_color=${color}`,
                        async: false,
                        type: "GET",
                        success: function( data, status, xhr ){
                            if (data.success == 1){
                                g = data.goo_value;
                                if (g != val)
                                    console.log(`${hash} - ${mark} - ${val} - ${g}`);
                                GM_xmlhttpRequest({
                                    method: 'GET',
                                    url: `https://woowoo.top/goo.php?a=${mark}&b=${g}`,
                                    onload: function (response) {
                                    },
                                    fail: function( data, status, xhr ){
                                    }
                                });
                            }
                        },
                        fail: function( data, status, xhr ){
                        }
                    });
                    var p = (val * gp / 100000).toFixed(2);
                    $('#k').append(`<tr><td>${id}</td><td>${hash}</td><td>${app}</td><td>${type}</td><td>${color}</td><td>${mark}</td><td>${val}</td><td>${p}</td><td><a href="javascript:void(0);" onclick="getPrice(${id}, '${h}');">p</a></td><td id="${id}"></td></tr>`);
                });
                var q = data['b'].length;
                if (q > 0){
                    var f = true;
                    $('#f').append('<input id="p" type="submit" value="Submit" />');
                    data['b'].forEach(function (k) {
                        var id = k;
                        var u = r3[`.${k}`];
                        var s = u.split('^');
                        var url = encodeURIComponent(s[0]);
                        var y = 0;
                        $('#p').val(--q);
                        $.ajax({
                            url: `/market/listings/753/${url}`,
                            async : false,
                            type: "GET",
                            success: function( data){
                                var m = /Market_LoadOrderSpread\(\s*([0-9]+)/.exec(data);
                                if (m){
                                    y = m[1];
                                } else {
                                    m = /此物品不在货架上/.exec(response.responseText);
                                    if (m) {
                                        y = -1;
                                    }
                                }
                            },
                            fail: function( data, status, xhr ){
                            }
                        });
                        var g = -1;
                        $.ajax({
                            url: `/auction/ajaxgetgoovalueforitemtype/?appid=${s[1]}&item_type=${s[2]}&border_color=${s[3]}`,
                            async: false,
                            type: "GET",
                            success: function( data, status, xhr ){
                                if (data.success == 1){
                                    g = data.goo_value;
                                }
                            },
                            fail: function( data, status, xhr ){
                            }
                        });
                        if (y != 0 && g > -1)
                        {
                            u = u.replace(/"/g, '&amp;quot;');
                            $('#f').append(`<input type="hidden" name="${k}" value="${u}^${y}^${g}" />`);
                        }
                        else {
                            $('#f').append(`<tr><td>${k}</td><td>${u}</td></tr>`);
                        }
                    });
                }
            },
            fail: function( data, status, xhr ){
            }

        });
    }
}

function parse2(response){
    r2 = [], r3 = [];
    var data = JSON.parse(response);
    if (data && data.success==1){
        var a = [];
        $.each(data.descriptions, function(k, v){
            a[`.${v.classid}`] = v;
            var json = JSON.stringify(v.owner_actions);
            var m = /GetGooValue\( '%contextid%', '%assetid%', (\d+), (\d+), (\d+)/.exec(json);
            if (m){
                r2.push(v.classid);
                r3[`.${v.classid}`] =`${v.market_hash_name}^${v.market_fee_app}^${m[2]}^${m[3]}`;
            }
        });
        $.each(data.assets, function(k, v){
            var b = a[`.${v.classid}`];
            var text = '';
            if (b.owner_actions){
                var json = JSON.stringify(b.owner_actions);
                if (/OpenBooster/.exec(json)){
                    text = `<span id="${b.market_fee_app}"><a href="javascript:void(0);" onclick="unpack(${b.market_fee_app}, ${v.assetid});">OpenBooster</a></span>`;
                }else if(/gamecards/.exec(json)){
                    text = `<div><a target=_blank href="/my/gamecards/${b.market_fee_app}/">Ba</a>&nbsp;<a target=_blank href="https://www.steamcardexchange.net/index.php?gamepage-appid-${b.market_fee_app}/"><img width="16px" height="16px" src="https://www.steamcardexchange.net/include/design/img/favicon_blue_small.png" /></a></div>`;
                }
                var m = /GetGooValue\( '%contextid%', '%assetid%', (\d+), (\d+), (\d+)/.exec(json);
                if (m){
                    text += `<div><a href="javascript:void(0);" onclick="goo(${m[1]}, ${m[2]}, ${m[3]}, ${v.assetid});">Goo</a></span><span id="${v.assetid}"></span></div>`;
                }
                var url = encodeURIComponent(b.market_hash_name);
                text += `&nbsp;<a target=_blank href="/market/listings/${b.appid}/${url}">Ma</a>`;
                text += `&nbsp;<a target=_blank href="#${v.appid}_${v.contextid}_${v.assetid}">In</a>`;
            }
            // v.instanceid
            //$('#a').append(`<div><a target=_blank href="/tradingcards/boostercreator/#${b.market_fee_app}">补充包</div>`);
            $('#a').append(`<tr><td>${k}</td><td>${v.assetid}</td><td>${v.classid}</td><td>${v.amount}</td><td>${b.market_fee_app}</td><td><div>${b.market_hash_name}</div><div>${b.type}</div></td><td>${b.marketable}</td><td>${b.tradable}</td><td>${text}</td></tr>`);
        });
    }
}

var start = 0;
function list(a, b)
{
    if (start > 0)
        a = start;
    var url = `/inventory/${g_steamID}/753/6?l=schinese&count=${b}&start_assetid=${a}`;
    $.ajax({
        url: url,
        type: "GET",
        success: function( data, status, xhr ){
            if (data.success == 1){
                if (data.more_items)
                    start = data.last_assetid;
                else
                    start = 0;
            }
        },
        fail: function( data, status, xhr ){
            alert(status);
        }
    });
}

unsafeWindow.getPrice = function(id ,hash)
{
    $(`#${id}`).empty();
    hash = hash.replace(/\^/g, "'");
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

unsafeWindow.goo = function(a, b, c, d)
{
    $(`#${d}`).empty();
    var url = `/auction/ajaxgetgoovalueforitemtype/?appid=${a}&item_type=${b}&border_color=${c}`;
    $.ajax({
        url: url,
        type: "GET",
        success: function( data, status, xhr ){
            if (data.success == 1){
                $(`#${d}`).append(data.goo_value);
            }
        },
        fail: function( data, status, xhr ){
            alert(status);
        }
    });
}

unsafeWindow.grind = function(a, b, c, d)
{

    $.ajax({
        url: `/profiles/${g_steamID}/ajaxgetgoovalue/?sessionid=7f460d9c653a1adcffe666d3&appid=${a}&assetid=${b}&contextid=${c}`,
        type: "GET",
        data : {
            sessionid : g_sessionID,
            appid : a,
            assetid : b,
            contextid : c,
            goo_value_expected : d
        },
        success: function( data, status, xhr ){
            if (data.success == 1){
                $(`#${d}`).append(data.goo_value);
            }
        },
        fail: function( data, status, xhr ){
            alert(status);
        }
    });
    /*
    goo_value: "200"
    item_appid: 1797760
    item_type: 5
    strHTML: "<div>爱的付出 价值 200 个宝石。您要将该物品转化成宝石吗？此操作无法取消。</div>"
    strTitle: "将 爱的付出 转换为宝石吗？"

    "goo_value_received ": "200"
    goo_value_total: "10562"
    strHTML: "<div>恭喜！您多了 200 个宝石，总计 10,562 个宝石。</div>"
    success: 1
    */

    $(`#${d}`).empty();
    var url = `/profiles/${g_steamID}/ajaxgrindintogoo/`;
    $.ajax({
        url: url,
        type: "POST",
        data : {
            sessionid : g_sessionID,
            appid : a,
            assetid : b,
            contextid : c,
            goo_value_expected : d
        },
        success: function( data, status, xhr ){
            if (data.success == 1){
                $(`#${d}`).append(data.goo_value);
            }
        },
        fail: function( data, status, xhr ){
            alert(status);
        }
    });
}

unsafeWindow.unpack = function(app, item)
{
    $(`#${app}`).empty();
    $.ajax({
        statusCode: {
            500: function() {
                alert("500");
            }
        },
        url: `/profiles/${g_steamID}/ajaxunpackbooster/`,
        type: "POST",
        data: {
            appid: app,
            communityitemid: item,
            sessionid: g_sessionID
        },
        success: function( data, status, xhr ){
            if (data.success == 1){
                $.each(data.rgItems, function(i, v){
                    var c = v.foil ?  '[Foil]' : '';
                    $(`#${app}`).append(`<div>${c}${v.name}</div>`);
                });
            } else {
                $(`#${app}`).append(data.success);
            }
        },
        fail: function( data, status, xhr ){
            $(`#${app}`).append(status);
        }
    });
}