// ==UserScript==
// @name         Steam市场汇率转换小工具
// @namespace    http://pronax.wtf/
// @version      0.1.1
// @description  try to take over the world!
// @author       Pronax
// @include      *://steamcommunity.com/market/listings/*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @connect      v6.exchangerate-api.com
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/419853/Steam%E5%B8%82%E5%9C%BA%E6%B1%87%E7%8E%87%E8%BD%AC%E6%8D%A2%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/419853/Steam%E5%B8%82%E5%9C%BA%E6%B1%87%E7%8E%87%E8%BD%AC%E6%8D%A2%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function updateRate() {
        console.log("同步最新汇率");
        GM_xmlhttpRequest({
            url: "https://v6.exchangerate-api.com/v6/6c4647edadf8a30d48167bab/latest/CNY",
            method: "get",
            onload: function (response) {
                var data = JSON.parse(response.responseText);
                if (data.result == "success") {
                    let country = data.conversion_rates.ARS;
                    data.conversion_rates.time_next_update_unix = data.time_next_update_unix;
                    exchangeRateList = data.conversion_rates;
                    GM_setValue("country", country);
                    GM_setValue("time_next_update_unix", data.time_next_update_unix);
                    GM_setValue("exchangeRateList", data.conversion_rates);
                } else {
                    console.log("更新汇率时出错：", data.error - type);
                }
            },
            onerror: function (err) {
                console.log("更新汇率时出错：", err);
            }
        });
    }

    function roundToTwo(num) {
        return Math.round((num * 100)) / 100;
    }

    var exchangeRateList = GM_getValue("exchangeRateList");
    var timestamp = GM_getValue("time_next_update_unix");
    var country = GM_getValue("country");

    if (exchangeRateList && timestamp && country) {
        if (Math.round(new Date().getTime() / 1000) >= timestamp) {
            updateRate();
        }
    } else {
        updateRate();
    }

    function addPrice() {
        var originalPriceList = $(".market_listing_price_with_fee");
        for (let i = 0; i < originalPriceList.length; i++) {
            let originalPrice = originalPriceList[i].innerText.slice(5).replace(".", "").replace(",", ".");
            let cnyPrice = roundToTwo(originalPrice / country);
            $(originalPriceList[i]).append($("<span class='market_listing_price market_listing_price_with_publisher_fee_only' style='display:block'></span>").text("¥ " + cnyPrice));
        }
    }

    setTimeout(addPrice, 2000);

})();