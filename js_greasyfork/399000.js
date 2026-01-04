// ==UserScript==
// @name        Weidian Search - Exporter
// @namespace   https://www.reddit.com/user/RobotOilInc
// @author      RobotOilInc
// @version     0.1.3
// @description Quickly export a Weidian search result to Markdown table
// @homepageURL https://greasyfork.org/nl/scripts/399000-weidian-exporter
// @supportURL  https://greasyfork.org/nl/scripts/399000-weidian-exporter
// @match       https://weidian.com/search_result*
// @match       https://www.weidian.com/search_result*
// @require     https://code.jquery.com/jquery-3.4.1.min.js
// @require     https://greasyfork.org/scripts/401399-gm-xhr/code/GM%20XHR.js?version=794597
// @connect     ecb.europa.eu
// @grant       GM_openInTab
// @grant       GM_xmlhttpRequest
// @run-at      document-end
// @icon        https://s.geilicdn.com/p5/shop/20203/images/common/favicon.178fdee5.ico
// @downloadURL https://update.greasyfork.org/scripts/399000/Weidian%20Search%20-%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/399000/Weidian%20Search%20-%20Exporter.meta.js
// ==/UserScript==

/* money.js 0.2, MIT license, http://openexchangerates.github.io/money.js */
(function(g,j){var b=function(a){return new i(a)};b.version="0.1.3";var c=g.fxSetup||{rates:{},base:""};b.rates=c.rates;b.base=c.base;b.settings={from:c.from||b.base,to:c.to||b.base};var h=b.convert=function(a,e){if("object"===typeof a&&a.length){for(var d=0;d<a.length;d++)a[d]=h(a[d],e);return a}e=e||{};if(!e.from)e.from=b.settings.from;if(!e.to)e.to=b.settings.to;var d=e.to,c=e.from,f=b.rates;f[b.base]=1;if(!f[d]||!f[c])throw"fx error";d=c===b.base?f[d]:d===b.base?1/f[c]:f[d]*(1/f[c]);return a*d},i=function(a){"string"===typeof a?(this._v=parseFloat(a.replace(/[^0-9-.]/g,"")),this._fx=a.replace(/([^A-Za-z])/g,"")):this._v=a},c=b.prototype=i.prototype;c.convert=function(){var a=Array.prototype.slice.call(arguments);a.unshift(this._v);return h.apply(b,a)};c.from=function(a){a=b(h(this._v,{from:a,to:b.base}));a._fx=b.base;return a};c.to=function(a){return h(this._v,{from:this._fx?this._fx:b.settings.from,to:a})};if("undefined"!==typeof exports){if("undefined"!==typeof module&&module.exports)exports=module.exports=b;exports.fx=fx}else"function"===typeof define&&define.amd?define([],function(){return b}):(b.noConflict=function(a){return function(){g.fx=a;b.noConflict=j;return b}}(g.fx),g.fx=b)})(this);

"use strict";

/* jshint esversion: 6 */
/* globals $:false, GM_XHR:false */

// Setup GM_XHR
$.ajaxSetup({ xhr: function() {return new GM_XHR; } });

const GetMoneyJS = async () => {
    const fx = window.fx
    fx.base = "EUR";
    fx.rates = {"EUR" : "1"}

    try {
        const result = await $.ajax({
            url: "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml",
            type: "GET",
            dataType: "xml",
        });

        $(result).find("Cube").each(function(i, el) {
            const currency = $(el).attr("currency"), rates = $(el).attr("rate")
            if (typeof currency === 'undefined' || typeof rates === 'undefined') {
                return;
            }

            fx.rates[currency] = rates;
        })

        return fx;
    } catch (error) {
        console.error("An error happened: " + error.statusText, error);
        return 1;
    }
}

const RetrieveType = (item) => {
    item = item.toLowerCase();

    if (item.indexOf("yeezy") !== -1) {
        return "Yeezy"
    }

    if (item.indexOf("sacai") !== -1) {
        return "Nike"
    }

    if (item.indexOf("aj1") !== -1) {
        return "AJ1"
    }

    if (item.indexOf("长袖t恤") !== -1) {
        return "Long sleeve T-shirt"
    }

    if (item.indexOf("长袖衬衫") !== -1) {
        return "Long sleeved blouse"
    }

    if (item.indexOf("t恤") !== -1) {
        return "T-shirt"
    }

    if (item.indexOf("风衣") !== -1) {
        return "Windbreaker"
    }

    if (item.indexOf("帽衫") !== -1) {
        return "Hoodie"
    }

    if (item.indexOf("衬衫") !== -1) {
        return "Shirt"
    }

    if (item.indexOf("套头毛衣针织衫") !== -1) {
        return "Pullover sweater"
    }

    if (item.indexOf("卫衣") !== -1 || item.indexOf("毛衣") !== -1) {
        return "Sweater"
    }

    if (item.indexOf("员羽绒服") !== -1 || item.indexOf("羽绒棉服") !== -1) {
        return "Down jacket"
    }

    if (item.indexOf("夹克") !== -1) {
        return "Jacket"
    }

    if (item.indexOf("外套") !== -1) {
        return "Coat"
    }

    if (item.indexOf("汗背心") !== -1) {
        return "Sweatshirt"
    }

    if (item.indexOf("运动卫裤") !== -1) {
        return "Track pants"
    }

    if (item.indexOf("慢跑裤") !== -1 || item.indexOf("运动加绒长裤") !== -1) {
        return "Jogging pants"
    }

    if (item.indexOf("短裤") !== -1) {
        return "Shorts"
    }

    if (item.indexOf("长裤") !== -1) {
        return "Trousers"
    }

    if (item.indexOf("裤子") !== -1) {
        return "Pants"
    }

    if( item.indexOf("裤") !== -1) {
        return "Trousers"
    }

    if (item.indexOf("钱包") !== -1) {
        return "Wallet"
    }

    if (item.indexOf("腰包") !== -1) {
        return "Waist bag"
    }

    if (item.indexOf("手提袋") !== -1 || item.indexOf("tote bag") !== -1) {
        return "Tote bag"
    }

    if (item.indexOf("斜挎包") !== -1 | item.indexOf("单肩包") !== -1) {
        return "Shoulder bag"
    }

    if (item.indexOf("背包") !== -1) {
        return "Backpack"
    }

    if (item.indexOf("袋") !== -1) {
        return "Bag"
    }

    if (item.indexOf("渔夫帽") !== -1) {
        return "Bucket hat"
    }

    if (item.indexOf("帽") !== -1) {
        return "Cap"
    }

    return "-"
}

(async function () {
    "use strict";

    const fx = await GetMoneyJS()
    const yearRegex = /(\d{4}|\d{2}[aAsSfFwW]{2})/

    const $button = $("#tb_title");
    $button.attr("title", "Create export for FashionReps");

    $button.click(function () {
        const brand = $("#tb_search2").val();
        const $container = $("<div/>", {class: "container"})
        $container.html(brand + "<br/>----<br/><br/>|Type|Name|Image|Price|<br/>|--|--|--|--|<br/>")

        $(".list-item").each(function() {
            const $item = $(this);

            const item = $item.find(".i_txt").text().trim();
            const image = $item.find(".proImg").attr("data-src")

            const year = yearRegex.exec(item) != null ? yearRegex.exec(item)[1].toUpperCase() : "-"
            const type = RetrieveType(item)
            const url = "https://weidian.com" + $item.find(".link").attr("href");
            const basePrice = parseFloat($item.find(".cur_price").text().trim())

            const yuanPrice = basePrice.toFixed(2);
            const usdPrice = fx.convert(basePrice, {from: "CNY", to: "USD"}).toFixed(2);
            const eurPrice = fx.convert(basePrice, {from: "CNY", to: "EUR"}).toFixed(2);

            $container.append($("<span/>").html("|"+type+"|["+item+"]("+url+")|[Image]("+image+")|¥ " + yuanPrice + " / $ " +usdPrice+ " / € "+eurPrice+"|<br/>"));
        })

        $("#search-content").prepend($container)
    });
})();