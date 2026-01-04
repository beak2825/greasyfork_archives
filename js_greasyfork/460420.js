// ==UserScript==
// @name        steam_bundle
// @namespace   http://tampermonkey.net/
// @author      jacky
// @license     jacky
// @description steam bundle more info
// @include     http://store.steampowered.com/bundle/*
// @include     https://store.steampowered.com/bundle/*
// @version     2024.02.19.2
// @connect     steamdb.info
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @run-at      document-start
// @require     http://libs.baidu.com/jquery/1.10.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/460420/steam_bundle.user.js
// @updateURL https://update.greasyfork.org/scripts/460420/steam_bundle.meta.js
// ==/UserScript==

GM_addStyle("table{border:solid 1px;border-collapse:collapse !important;}");
GM_addStyle("td{border:solid 1px;border-collapse:collapse;padding-left:5px;padding-right:5px;font-size:16px !important;}");

var m, id;
var isdb = '<img src="https://www.google.com/s2/favicons?sz=16&domain=steamdb.info" />';
var ibvg = '<img src="https://www.google.com/s2/favicons?sz=16&domain=barter.vg" />';
var isce = '<img src="https://www.google.com/s2/favicons?sz=16&domain=steamcardexchange.net" />';

window.addEventListener ("DOMContentLoaded", DOM_ContentReady);
window.addEventListener ("load", pageFullyLoaded);

function DOM_ContentReady () {
    $('.pageheader').after('<div class="page_content" id="a"></div>');
    $('#a').append('<table width="100%" id="b"></table>');
}

function pageFullyLoaded () {
    $('.game_area_purchase_game').each(function(i, r){
        var t = $(r).find('h1:first').text();
        var j = $(r).attr('data-ds-bundle-data');
        if (j){
            j = JSON.parse($(r).attr('data-ds-bundle-data'));
            var id = $(r).attr('data-ds-bundleid');
            var ds = (1 - j.m_nDiscountPct / 100).toFixed(2);
            var a = 0, b = 0, d = 0, ic = [];
            var bd = $(r).find(`.cart_item_desc a[href*=${id}]`);
            var html = `<a target=_blank href="${bd.attr('href')}">${bd.text()}</a>`;
            $('#b').append(`<tr><td><a target=_blank href="https://steamdb.info/bundle/${id}/">${id}</a></td><td><a target=_blank href="/bundle/${id}/">${t}</a></td><td></td><td></td><td>${j.m_bMustPurchaseAsSet}</td><td>-${j.m_nDiscountPct}</td></tr>`);
            $.each(j.m_rgItems, function (i, e) {
                var n = e.m_nBasePriceInCents ? e.m_nBasePriceInCents : 0;
                d = 0;
                a += n;
                b += e.m_nFinalPriceWithBundleDiscount;
                var h = [], cl = '';
                e.m_rgIncludedAppIDs.forEach(function (v) {
                    bd = $(`.bundle_package_item a[href*=${v}]`);
                    cl = (GDynamicStore.BIsAppOwned(v)) ? ' class="sih_owned"' : '';
                    if (bd.length > 0){
                        var t = bd.nextAll('.tab_item_content').children('.tab_item_name').text();
                        h.push(`<a target=_blank href="${bd.attr('href')}"><span ${cl}>${t}</span></a>&nbsp;<a target=_blank href="//steamdb.info/app/${v}/">${isdb}</a>&nbsp;<a target=_blank href="//barter.vg/steam/app/${v}/#bundles">${ibvg}</a>`);
                    }
                    else
                        h.push(`<a target=_blank href="/app/${v}/"><span ${cl}>${v}</span></a>&nbsp;<a target=_blank href="//steamdb.info/app/${v}/">${isdb}</a>&nbsp;<a target=_blank href="//barter.vg/steam/app/${v}/#bundles">${ibvg}</a>`);
                });
                h = h.join(',');
                cl = GDynamicStore.BIsPackageOwned(e.m_nPackageID) ? ' class="sih_owned"' : '';
                if (n > 0)
                    d = (e.m_nFinalPriceWithBundleDiscount / n).toFixed(2);
                $('#b').append(`<tr><td><a target=_blank href="//steamdb.info/sub/${e.m_nPackageID}/">${e.m_nPackageID}</a></td><td><a target=_blank href="/sub/${e.m_nPackageID}/"><span ${cl}>${e.m_nPackageID}</span></a>&nbsp;Apps&nbsp;:${h}</td><td>${n}</td><td>${e.m_nFinalPriceInCents}</td><td>${d}</td><td>${e.m_nFinalPriceWithBundleDiscount}</td></tr>`);
            });
            ic = ic.join(', ');
            d = (b / a).toFixed(2);
            a = (a / 100).toFixed(2);
            var p = (b / 100).toFixed(2);
            $('#b').append(`<tr><td></td><td></td><td>${a}</td><td></td><td>${d}</td><td>${p}</td></tr>`);
        }
    });
}