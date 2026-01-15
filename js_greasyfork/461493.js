// ==UserScript==
// @name        bs_games_info
// @namespace   http://tampermonkey.net/
// @description bs games info
// @license     MIT
// @include     https://www.fanatical.com/*
// @version     2026.01.13.1
// @run-at      document-start
// @connect     data.fixer.io
// @require     https://code.jquery.com/jquery-1.12.4.min.js
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_setClipboard
// @grant       unsafeWindow
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/461493/bs_games_info.user.js
// @updateURL https://update.greasyfork.org/scripts/461493/bs_games_info.meta.js
// ==/UserScript==

window.addEventListener ("DOMContentLoaded", DOM_ContentReady);
window.addEventListener ("load", pageFullyLoaded);

var be = GM_getValue("base", "EUR");
var r = JSON.parse(GM_getValue("rates", "{}"));
var tm = GM_getValue("timestamp", 0);
const p = ['AUD','CAD','EUR','GBP','JPY','RUB','USD'];
var token;

const { fetch: _fetch } = window;
unsafeWindow.fetch = async (...args) => {
    let [resource, config] = args;
    let response = await _fetch(resource, config);
    var m = /refresh-auth|products-group|pick-and-mix|star-deal|products\/|orders/.exec(resource);
    if (m){
        try {
            if ($('#d').length > 0)
                $('#d').empty();
            else
                $('.content').before('<div align="center" id="d"></div>');
            const _json = await response.clone().json();
            switch (m[0]){
                case 'refresh-auth':
                    token = _json.token;
                    break;

                case 'products-group':
                    parse(_json);
                    break;

                case 'pick-and-mix':
                    parse2(_json);
                    break;

                case 'star-deal':
                    parse3(_json);
                    break;

                case 'products/':
                    parse4(_json);
                    break;

                case 'orders':
                    $('#d').append('<table id="a"></table>');
                    if (/orders\/[a-f0-9]+/.exec(resource))
                        parse5(_json);
                    else
                        parse6(_json);
                    break;
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    return response;
};

function addSale(a, b){
    $(a).append(`<td>${b.from}<br>${b.until}</td>`);
}

function addReginLock(a, b, c){
    var inc = '';
    var d = [];
    if (b.length){
        d = [];
        for(const v of b)
            d.push(v.code);
        inc = d.join();
    }
    var exc = '';
    if (c.length){
        d = [];
        for(const v of c)
            d.push(v.code);
        exc = d.join();
    }
    $(a).append(`<td class="m">${inc}</td><td class="m">${exc}</td>`);
}

function addReginPrice(a, b, c){
    var d = {n:'',r:9999};
    for(const v of p) {
        var s = b[v] / 100;
        var l;
        if (c) {
            if (v==be)
                l = Number((r.CNY * s).toFixed(2));
            else
                l = Number((s * r.CNY / r[v]).toFixed(2));
            if (l < d.r)
                d = {n:v,r:l};
            $(a).append(`<td class="ri">${s}<br>${l}</td>`);
        } else {
            $(a).append(`<td class="ri">${s}</td>`);
        }
    }
    if (c)
        $(a.children()[p.indexOf(d.n)+7]).css({"font-weight":"bold", "color":"green"});
}

function addGames(a){
    var i = 1;
    for(const v of a) {
        var name = v.name;
        if (v.steam && v.steam.id){
            var sub = v.steam.sub ? 'sub' : 'app';
            var id = v.steam.id;
            name = `<a target=_blank href="https://store.steampowered.com/${sub}/${id}/">${v.name}</a>`;
        }
        var d = $(`<tr><td>${i++}</td><td>${name}</td><td>${v.type}</td><td></td><td></td></tr>`);
        $('#a').append(d);
        addReginLock(d, v.regions_included, v.regions_excluded);
        addReginPrice(d, v.price, false);
    }
}

function parse(data){
    var d;
    $('#d').append('<table id="a"></table>');
    $('#a').append('<tr><td>-</td><td>Name</td><td>Type</td><td>Sale</td><td>Start</td><td>Inc</td><td>Exc</td><td>AUD</td><td>CAD</td><td>EUR</td><td>GBP</td><td>JPY</td><td>RUB</td><td>USD</td></tr>');

    var name = data.name;
    if (data.editions && data.editions.length > 0) {
        $.each(data.editions, function(k, v) {
            if (data.steam.packages && data.steam.packages.length >0)
                name = `<a target=_blank href="https://store.steampowered.com/${data.steam.type}/${data.steam.packages[k]}/">${v.name}</a>`;
            else
                name = `<a target=_blank href="https://store.steampowered.com/${data.steam.type}/${data.steam.id}/">${v.name}</a>`;
            d = Math.floor(v.current_discount.percent * 100);
            d = $(`<tr><td>-</td><td>${name}</td><td>${data.type}</td><td>-${d}%</td></tr>`);
            $('#a').append(d);
            addSale(d, v.current_discount);
            addReginLock(d, data.regions_included, data.regions_excluded);
            addReginPrice(d, v.currentPrice, true);
        });
    } else {
        if (data.steam.id)
            name = `<a target=_blank href="https://store.steampowered.com/${data.steam.type}/${data.steam.id}/">${name}</a>`;
        d = Math.floor(data.current_discount.percent * 100);
        d = $(`<tr><td>-</td><td>${name}</td><td>${data.type}</td><td>-${d}%</td></tr>`);
        $('#a').append(d);
        addSale(d, data.current_discount);
        addReginLock(d, data.regions_included, data.regions_excluded);
        addReginPrice(d, data.currentPrice, true);
    }

    if (data.bundles) {
        for(const v of data.bundles) {
            d = $(`<tr><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>`);
            $('#a').append(d);
            addReginPrice(d, v.price, true);
            addGames(v.games);
        }
    }
}

function parse2(data){
    if (data.valid_from) {
        var t = (new Date(data.valid_from)).toLocaleString();
        $('#d').append(`<div>起始：${t}</div>`);
    }
    if (data.valid_until) {
        t = (new Date(data.valid_until)).toLocaleString();
        $('#d').append(`<div>截止：${t}</div>`);
    }

    $('#d').append('<table id="a"></table>');
    var i = 1;
    for(const v of data.products) {
        var name = v.name;
        if (v.steam && v.steam.id){
            var sub = v.steam.sub ? 'sub' : 'app';
            var id = v.steam.id;
            name = `<a target=_blank href="https://store.steampowered.com/${sub}/${id}/">${v.name}</a>`;
        }
        var inc = '';
        var c = [];
        if (v.regions_included.length){
            c = [];
            for(const d of v.regions_included)
                c.push(d.code);
            inc = c.join();
        }
        var exc = '';
        if (v.regions_excluded.length){
            c = [];
            for(const d of v.regions_excluded)
                c.push(d.code);
            exc = c.join();
        }
        var p1 = (v.price.USD / 100).toFixed(2);
        $('#a').append(`<tr><td>${i++}</td><td>${name}</td><td>${v.type}</td><td>${p1}</td><td>${inc}</td><td>${exc}</td></tr>`);
    }
    $('#d').append('<table id="b" style="text-align:right"><tr><td>-</td><td>AUD</td><td>CAD</td><td>EUR</td><td>GBP</td><td>JPY</td><td>RUB</td><td>USD</td></tr></table>');

    i = 1;
    for(const w of data.tiers) {
        var a = $(`<tr style="text-align:right"><td>${i++}</td></tr>`);
        var b = $(`<tr style="text-align:right"><td>-</td></tr>`);
        $('#b').append(a);
        $('#b').append(b);
        for(const v of p) {
            var s = w.price[v] / 100;
            var l;
            if (v==be)
                l = (r.CNY * s).toFixed(2);
            else
                l = (s * r.CNY / r[v]).toFixed(2);
            a.append(`<td>${s}</td>`);
            b.append(`<td>${l}</td>`);
        }
    }
}

function parse3(data){
    $('.stardeal-product-info-container').append('<div class="col-12 col-md-6 col-lg-12"><div id="info" class="p-3 pl-md-1 pl-lg-3 card-body"></div></div>');
    var inc = '';
    var c = [];
    if (data.product) {
        if (data.product.regions_included.length){
            c = [];
            for(const v of data.product.regions_included)
                c.push(v.code);
            inc = c.join();
        }
        $('#info').append(`<div style="word-wrap:break-word;">允许：${inc}</div>`);
        var exc = '';
        if (data.product.regions_excluded.length){
            c = [];
            for(const v of data.product.regions_excluded)
                c.push(v.code);
            exc = c.join();
        }
        $('#info').append(`<div style="word-wrap:break-word;">禁止：${exc}</div>`);
    }
    if (data.promoDiscountPercent) {
        var d = (1 - data.promoDiscountPercent).toFixed(2);
        var t = (new Date(data.endDate)).toLocaleString();
        $('#info').append(`<div>折扣：${d}</div>`);
        $('#info').append(`<div>截止：${t}</div>`);
    }
    if (data.promoPrice){
        $('#info').append('<table id="c" style="text-align:right"><tr><td>货币</td><td>原价</td><td>现价</td><td>折算</td></tr></table>');
        $.each(data.promoPrice, function(k, v) {
            var s = v / 100;
            var p = data.originalPrice[k] / 100;
            var l = ratio(k, 'CNY');
            l = (s * l).toFixed(2);
            $('#c').append(`<tr><td>${k}</td><td>${p}</td><td>${s}</td><td>${l}</td></tr>`);
        });
    }
}

function parse4(data){
    $('.product-commerce-container').append('<div class="col-12 col-md-6 col-lg-12"><div id="info" class="p-3 pl-md-1 pl-lg-3 card-body"></div></div>');
    var a = [];
    var inc = '';
    var c = [];
    if (data.regions_included.length){
        c = [];
        for(const v of data.regions_included)
            c.push(v.code);
        inc = c.join();
    }
    $('#info').append(`<div style="word-wrap:break-word;">允许：${inc}</div>`);
    var exc = '';
    if (data.regions_excluded.length){
        c = [];
        for(const v of data.regions_excluded)
            c.push(v.code);
        exc = c.join();
    }
    $('#info').append(`<div style="word-wrap:break-word;">禁止：${exc}</div>`);
    if (data.steam) {
        var sub = data.steam.sub ? 'sub' : 'app';
        var id = data.steam.id;
        $('#info').append(`<div">信息：<a target=_blank href="https://steamdb.info/${sub}/${id}/">${id}</a></div>`);
    }
    if (data.current_discount) {
        var d = (1 - data.current_discount.percent).toFixed(2);
        var t = (new Date(data.current_discount.until)).toLocaleString();
        $('#info').append(`<div>折扣：${d}</div>`);
        $('#info').append(`<div>截止：${t}</div>`);
    }
    if (data.currentPrice){
        $('#info').append('<table id="c" style="text-align:right"><tr><td>货币</td><td>原价</td><td>现价</td><td>折算</td></tr></table>');
        $.each(data.currentPrice, function(k, v) {
            var s = v / 100;
            var p = data.price[k] / 100;
            var b = {
                's': s,
                'p': p
            };
            a[k] = b;
            var l = ratio(k, 'CNY');
            l = (s * l).toFixed(2);
            $('#c').append(`<tr><td>${k}</td><td>${p}</td><td>${s}</td><td>${l}</td></tr>`);
        });
    }
}

function parse5(data) {
    var a = [];
    var t = (new Date(data.date)).toLocaleString();
    // status payment loc
    var pay = data.payment.total;
    if (pay) {
        pay = (data.payment.total / 100 ).toFixed(2);
    } else {
        pay = 0;
    }
    var cur = data.loc.currency_alphabetic_code ? data.loc.currency_alphabetic_code : 'USD';
    $('#a').append(`<tr id="${data._id}"><td>-</td><td>-</td><td>${data._id}</td><td>'${t}</td><td>${pay} ${cur}</td></tr>`);
    if (data.status == 'COMPLETE')
        $(`#${data._id}`).css("background-color", 'green');
    else
        $(`#${data._id}`).css("background-color", 'yellow');
    for(const e of data.items){
        var total = e.payment.total ? e.payment.total : e.payment.stotal;
        pay = (total / 100 ).toFixed(2);
        if (e.type == 'bundle')
            $('#a').append(`<tr style="background-color:blue;"><td>-</td><td>${e.name}</td><td></td><td></td><td>${pay} ${cur}</td></tr>`);
        else if( e.type == 'voucher' || e.status == 'refunded'){
            $('#a').append(`<tr><td>-</td><td>${e.name}</td><td></td><td></td><td>${pay} ${cur}</td></tr>`);
        } else {
            if (e.status == 'revealed')
                $('#a').append(`<tr><td>-</td><td>${e.name}</td><td>${e.key}</td><td></td><td>${pay} ${cur}</td></tr>`);
            else
                $('#a').append(`<tr><td>-</td><td>${e.name}</td><td id="${e._id}"></td><td id="b${e._id}"><a href="javascript:void(0);" onclick="redeem('', null, '${e.iid}', '${data._id}', '${e._id}', '${e.serialId}');">Redeem</a></td><td>${pay} ${cur}</td></tr>`);
        }
        for(const v of e.bundles){
            var i = 1;
            for(const w of v.games){
                var name = w.name;
                if (w.drm  && w.drm.steam){
                    var title = '';
                    if (w.mysteryGameDetails) {
                        title = `title="${w.mysteryGameDetails.price.USD}" `;
                        name = `<a target=_blank ${title}href="https://store.steampowered.com/${w.mysteryGameDetails.steam.type}/${w.mysteryGameDetails.steam.id}/">${name}</a>`;
                    }
                }
                if (w.status == 'revealed')
                    $('#a').append(`<tr><td>${i++}</td><td>${name}</td><td>${w.key}</td><td></td><td></td></tr>`);
                else
                    $('#a').append(`<tr><td>${i++}</td><td>${name}</td><td id="${w._id}"></td><td id="b${w._id}"><a href="javascript:void(0);" onclick="redeem('', '${e._id}', '${w.iid}', '${data._id}', '${w._id}', null);">Redeem</a></td><td>${pay} ${cur}</td></tr>`);
            }
        }
    }
}

function parse6(data) {
    var l = [], i = 1;
    for(const e of data){
        l.push(String(e._id));
        var t = (new Date(e.date)).toLocaleString();
        var r = [];
        for(const v of e.items)
            r.push(v.name);
        var item = r.join('<br>');
        $('#a').append(`<tr><td>${i++}</td><td><a target=_blank href="/en/orders/${e._id}">${e._id}</a></td><td>${item}</td><td>'${t}</td><td>${e.status}</td></tr>`);
    }
    $(`#d`).before(`<div><a href="javascript:void(0);" onclick="parse('${l}');">Parse</a></div>`);
}

unsafeWindow.parse = async function(str) {
    var list = str.split(',');
    if (list.length > 0) {
        for(const id of list){
            try {
                let response = await fetch(`/api/user/orders/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': token,
                    }
                });
                if (response.ok) {
                    const _json = await response.clone().json();
                    parse5(_json);
                }
            } catch (error) {
            }
        }
    }
}

unsafeWindow.redeem = async function(atok, bid, iid, oid, pid, serialId)
{
    try {
        var data = {
            "oid":oid,
            "bid":bid,
            "pid":pid,
            "iid":iid,
            "atok":atok
        };
        if (serialId != null)
            data['serialId'] = serialId;
        let response = await fetch('/api/user/orders/redeem', {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            const _json = await response.clone().json();
            $(`#${pid}`).append(_json.key);
            $(`#b${pid}`).empty();
        }
    } catch (error) {
    }
}

function DOM_ContentReady () {
    GM_addStyle("table{border:solid 1px white;border-collapse:collapse;font-size:16px !important;}");
    GM_addStyle("td{border:solid 1px white;border-collapse:collapse;padding-left:5px;padding-right:5px !important;}");
    GM_addStyle(".ri{text-align:right");
    GM_addStyle(".d{font-size:16px;color:white !important;}");
    GM_addStyle(".m{max-width:300px;word-break:break-all;}");
    r = ratio();

    $("body").on('click', '#fetch', function(){
        $('.key-container .btn.btn-primary.d-block').each(function(){
            $(this).click();
        });
    });

    $("body").on('click', '#copy', function(){
        var txt = '';
        $('#a tr').each(function(){
            $(this).children('td').each(function(){
                txt += $(this).text() + '\t';
            });
            txt += '\n';
        });
        GM_setClipboard(txt);
    });
}

function pageFullyLoaded () {
    $('.left-links-container').append('<a class="secondary-nav-link" id="fetch" title="Fetch">F</a>');
    $('.left-links-container').append('<a class="secondary-nav-link" id="copy" title="Copy">C</a>');
}

var ratio = function(){
    if (Date.now() - tm < 60 * 24 * 60000)
        return r;
    $.ajax({
        url: `https://data.fixer.io/api/latest?access_key=93bba107d8e24746fe6220b043df2695&symbols=CNY,JPY,RUB,AUD,CAD,USD,GBP`,
        type: "GET",
        async: false,
        success: function(data){
            if (data.success){
                be = data.base;
                GM_setValue("base", data.base);
                GM_setValue("rates", JSON.stringify(data.rates));
                GM_setValue("timestamp", data.timestamp * 1000);
                return data.rates;
            }
        },
        error: function(data){
        }
    });
    return r;
}