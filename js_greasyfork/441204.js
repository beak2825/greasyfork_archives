// ==UserScript==
// @name         5 Rotator by Grizon (coinlean.com)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  rotator coinlean.com
// @author          Grizon
// @copyright       2021, Grizon
// @match        https://www.coinlean.com/freecoin/*
// @match        https://westbit.online/*
// @icon         https://www.coinlean.com/favicon_32.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441204/5%20Rotator%20by%20Grizon%20%28coinleancom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/441204/5%20Rotator%20by%20Grizon%20%28coinleancom%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var data = [
        {url : "https://www.coinlean.com/freecoin/BTC/", coin : "BTC"},
        {url : "https://www.coinlean.com/freecoin/ETH/", coin : "ETH"},
        {url : "https://www.coinlean.com/freecoin/LTC/", coin : "LTC"},
        {url : "https://www.coinlean.com/freecoin/DOGE/", coin : "DOGE"},
        {url : "https://www.coinlean.com/freecoin/TRX/", coin : "TRX"},
        {url : "https://www.coinlean.com/freecoin/XRP/", coin : "XRP"},
        {url : "https://www.coinlean.com/freecoin/XLM/", coin : "XLM"},
        {url : "https://www.coinlean.com/freecoin/BCH/", coin : "BCH"},
        {url : "https://www.coinlean.com/freecoin/DASH/", coin : "DASH"},
        {url : "https://www.coinlean.com/freecoin/BNB/", coin : "BNB"},
        {url : "https://westbit.online/", coin : "online"}
    ];
    var address = "";
    var nextURL = "";
    var count = 0;
    for (let value of Object.values(data)) {
        count = count + 1;
        if ((window.location.href.includes("https://www.coinlean.com/freecoin/" + value.coin + "/"))
           || (window.location.href.includes("https://westbit." + value.coin + "/")))
            {
            address = value.address;
            if (count == data.length) {
                count = 0;
                nextURL = data[count].url;
            } else {
                nextURL = data[count].url;
            }
            break;
        }
    }
        setInterval(function() {
        if (document.querySelector(".h-captcha")) {
            if (document.querySelector(".h-captcha > iframe").getAttribute("data-hcaptcha-response").length > 0) {
                document.querySelector('a[class="btn_1 gradient"]').click();
            }
        }
    }, 11000);
        setInterval(function() {
        if (document.querySelector('div[style="color:#d55858;"]'))
           {
            window.location.href = nextURL;
        }
    }, 2000);
        setInterval(function() {
        if (document.querySelector('div[id="mono"]'))
           {
            window.location.href = nextURL;
        }
    }, 900000);
})();