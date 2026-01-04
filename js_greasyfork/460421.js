// ==UserScript==
// @name        steam_cart
// @namespace   http://tampermonkey.net/
// @author      jacky
// @license     jacky
// @description steam cart more info
// @include     http*://store.steampowered.com/cart*
// @version     2024.02.19.2
// @run-at      document-body
// @require     http://libs.baidu.com/jquery/1.10.1/jquery.min.js
// @connect     steamdb.info
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/460421/steam_cart.user.js
// @updateURL https://update.greasyfork.org/scripts/460421/steam_cart.meta.js
// ==/UserScript==

GM_addStyle("table{border:solid 1px;border-collapse:collapse !important;}");
GM_addStyle("td{border:solid 1px;border-collapse:collapse;padding-left:5px;padding-right:5px;font-size:14px !important;}");
GM_addStyle("td{border:solid 1px;border-collapse:collapse;padding-left:5px;padding-right:5px;font-size:14px !important;}");
GM_addStyle(".owned{background-color: #9CCC65;}");

window.addEventListener ("DOMContentLoaded", DOM_ContentReady);
window.addEventListener ("load", pageFullyLoaded);

var match = /sessionid=([a-z0-9]+);/.exec(document.cookie);
var sid = match[1];
var isdb = '<img src="https://www.google.com/s2/favicons?sz=16&domain=steamdb.info" />';
var ibvg = '<img src="https://www.google.com/s2/favicons?sz=16&domain=barter.vg" />';
var isce = '<img src="https://www.google.com/s2/favicons?sz=16&domain=steamcardexchange.net" />';

function DOM_ContentReady () {
    $('.supernav_container').append('<a class="menuitem supernav" href="/cart/" data-tooltip-type="selector" data-tooltip-content=".submenu_myli">快速</a>');
    $('.supernav_container').append('<div class="submenu_myli" style="display: none;"><div>');
    $('.supernav_container').append('<a class="menuitem" href="javascript:void(0);" onclick="dlc();">DLC</a>');

    $('.submenu_myli').append('<a class="submenuitem myli" href="javascript:void(0);" onclick="addme(\'36555,36556,35221,34972,33298,31174\', 49520);">无主2</a>');
    $('.submenu_myli').append('<a class="submenuitem myli" href="javascript:void(0);" onclick="addme(\'15373\', 206440);">去月球</a>');
    // <span style="color:red; font-weight: bold;"></span>
    $('.myli').click(function () {
        addme($(this).attr('subs').split(','), $(this).attr('app'));
    });

    $('.pageheader').after('<table id="b"></table>');
    $('.pageheader').after('<table width="100%" id="bundle"></table>');
}

function pageFullyLoaded () {
    var dt = new Date().toLocaleDateString();
    $('.cart_row').each(function(i, r){
        var l = '';
        var m = /"type":"([^"]+)","id":"?(\d+)/.exec($(r).attr('onmouseover'));
        if (m){
            l = m[1] + '/' + m[2];
        }
        var p = '';
        var ds = '';
        var pv = $(r).find('.price');
        if (pv.length > 1){
            var p1 = $(pv[0]).text().replace(/¥\s*/, '');
            p = $(pv[1]).text().replace(/¥\s*/, '');
            ds = (p / p1).toFixed(2);
        } else {
            p = $(pv[0]).text().replace(/¥\s*/, '');
        }
        var ps = '', ic = '';
        switch (m[1]){
            case 'bundle':
                var j = JSON.parse($(r).attr('data-ds-bundle-data'));
                var id = $(r).attr('data-ds-bundleid');
                //ds = (1 - j.m_nDiscountPct / 100).toFixed(2);
                var a = 0, b = 0, d = 0;
                var bd = $(r).find(`.cart_item_desc a[href*=${id}]`);
                var html = `<a target=_blank href="${bd.attr('href')}">${bd.text()}</a>`;
                $('#bundle').append(`<tr><td><a target=_blank href="https://steamdb.info/bundle/${id}/">${id}</a></td><td>${html}</td><td></td><td></td><td>${j.m_bMustPurchaseAsSet}</td><td>-${j.m_nDiscountPct}</td></tr>`);
                ic = [];
                $.each(j.m_rgItems, function (i, e) {
                    var n = e.m_nBasePriceInCents ? e.m_nBasePriceInCents : 0;
                    d = 0;
                    a += n;
                    b += e.m_nFinalPriceWithBundleDiscount
                    var h = [], cl = '';
                    e.m_rgIncludedAppIDs.forEach(function (v) {
                        bd = $(`.package_contents a[href*=${v}]`);
                        cl = GDynamicStore.BIsAppOwned(v) ? ' class="owned"' : '';
                        if (bd.length > 0){
                            h.push(`<a target=_blank href="${bd.attr('href')}"><span ${cl}>${bd.text()}</span></a>&nbsp;<a target=_blank href="//steamdb.info/app/${v}/">${isdb}</a>&nbsp;<a target=_blank href="//barter.vg/steam/app/${v}/#bundles">${ibvg}</a>`);
                            ic.push(`${v}: ${bd.text()}`);
                        }
                        else
                            h.push(`<a target=_blank href="/app/${v}/"><span ${cl}>${v}</span></a>&nbsp;<a target=_blank href="//steamdb.info/app/${v}/">${isdb}</a>&nbsp;<a target=_blank href="//barter.vg/steam/app/${v}/#bundles">${ibvg}</a>`);
                    });
                    h = h.join(',');
                    cl = GDynamicStore.BIsPackageOwned(e.m_nPackageID) ? ' class="owned"' : '';
                    if (n > 0)
                        d = (e.m_nFinalPriceWithBundleDiscount / n).toFixed(2);
                    $('#bundle').append(`<tr><td><a target=_blank href="//steamdb.info/sub/${e.m_nPackageID}/">${e.m_nPackageID}</a></td><td><a target=_blank href="/sub/${e.m_nPackageID}/"><span ${cl}>${e.m_nPackageID}</span></a>&nbsp;Apps&nbsp;:${h}</td><td>${n}</td><td>${e.m_nFinalPriceInCents}</td><td>${d}</td><td>${e.m_nFinalPriceWithBundleDiscount}</td></tr>`);
                });
                ic = ic.join(', ');
                d = (b / a).toFixed(2);
                a = (a / 100).toFixed(2);
                ds = (p / a).toFixed(2);
                var p2 = (b / 100).toFixed(2);
                $('#bundle').append(`<tr><td></td><td></td><td>${a}</td><td></td><td>${d}</td><td>${p2}</td></tr>`);
                break;
        }
        var t = $(this).find('.cart_item_desc a').text();
        $('#b').append(`<tr><td>${l}</td><td>${t}</td><td></td><td>${ds}</td><td></td><td>${p}</td><td></td><td>${ic}</td><td>${dt}</td></tr>`);
    });
}

unsafeWindow.dlc = function() {
    $('#b').empty();
    var id = prompt('Enter App:');
    if ( id == null )
        return;
    $.ajax({
        url: `/dlc/${id}`,
        method: 'GET',
        success: function (d) {
            var g = new RegExp(`${id}\\/([^\\/]+)\\/list`, 'g');;
            var m = g.exec(d);
            if (m)
                list(id, m[1]);
        },
        error: function () {
            alert('fail');
        }
    });
}

unsafeWindow.list = function(app, name) {
    var da = {
        query: '',
        count: 1000,
        tagids: '',
        sort: 'discounted',
        app_types: '',
        curations: '',
        reset: true
    };
    var url  = `/dlc/${app}/${name}/ajaxgetfilteredrecommendations/render/`;
    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json',
        data: da,
        success: function (d) {
            if (d.success){
                var html = d.results_html;
                var i = 1;
                html = html.replace(/<img[^<>]*>/g, '');
                var l = [];
                $(html).find('.recommendation').each(function(){
                    var a = $(this).find('a');
                    var id = 0;
                    if (a.length > 0)
                        id = $(a[0]).attr('data-ds-appid');
                    var t = $.trim($(this).find('.color_created').text());
                    var dt = $.trim($(this).find('.curator_review_date').text());
                    var v = $(this).find('.discount_block');
                    var p = '';
                    var s = '';
                    var d = '';
                    if (v.length > 0){
                        d = $(v[0]).find('.discount_pct').text();
                        p = $(v[0]).find('.discount_original_price').text();
                        s = $(v[0]).find('.discount_final_price').text();
                    } else {
                        p = $.trim($(this).find('.game_purchase_price').text());
                    }
                    var cl = GDynamicStore.BIsAppOwned(id) ? ' class="owned"' : '';
                    l.push(`<tr title="${d}"><td><a target=_blank href="/app/${id}/"><span ${cl}>${t}</span></a><br>${dt}</td><td>${p}</td><td>${s}</td><td>${d}</td><td id="${id}"><a href="javascript:void(0);" onclick="getlow(${id});">check</a></td></tr>`);
                });
                l.sort();
                $('#b').append(l.join());
            }
        },
        error: function () {
            alert('fail');
        }
    });
}

unsafeWindow.getlow = function(app) {
    GM_xmlhttpRequest({
        method: "GET",
        url: `https://steamdb.info/api/ExtensionGetPrice/?appid=${app}&currency=CNY`,
        onload: function(response) {
            var r = JSON.parse(response.responseText);
            var id = `#${app}`;
            if (r.success){
                if (r.data){
                    var l = r.data.lowest;
                    $(id).append(`<div>${l.price}</div><div>-${l.discount}%</div><div>${l.date}</div>`);
                }
            }
        },
        onerror:  function(response) {
        },
        ontimeout:  function(response) {
        },
    });
}

unsafeWindow.addme = function(subs, app) {
    var da = {
        action: 'add_to_cart',
        sessionid: sid,
        'subid[]': subs
    };
    $.ajax({
        url: '/cart/',
        method: 'POST',
        beforeSend: function (request)
        {
            request.setRequestHeader('Referer', 'http://store.steampowered.com/app/' + app);
        },
        dataType: 'json',
        data: da,
        success: function (d) {
            alert(d);
        },
        error: function () {
            alert('fail');
        }
    });
}
