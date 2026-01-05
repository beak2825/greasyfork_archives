// ==UserScript==
// @name         Poloniex Exchange
// @namespace    http://poloniex.net/
// @version      0.1
// @description  try to convert usd to rmb!
// @author       Shevckcccc
// @match        https://poloniex.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28435/Poloniex%20Exchange.user.js
// @updateURL https://update.greasyfork.org/scripts/28435/Poloniex%20Exchange.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // TODO:需要由api异步获取
    var rate = 6.8802;
    setInterval(function(){
        var eth_price_element = $('#marketRowusdt_eth .price');
        var eth_name_element = $('#marketRowusdt_eth .colName');
        var usd_price = eth_price_element.text();
        var rmb_price = usd_price * rate;
        var html = "<span style='color:red'>" + rmb_price +"</span>";
        eth_name_element.html(html);
        $(document).attr("title", rmb_price);
    },2000);
})();