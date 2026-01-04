// ==UserScript==
// @name         PrintStockPrice
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the stock world!
// @author       kevin.ql
// @match        http://guba.eastmoney.com/list*
// @icon         https://p0.meituan.net/travelcube/9215d23b78ead652745defc43dbf7ecc3238.png?domain=eastmoney.com
// @grant        window.setInterval
// @downloadURL https://update.greasyfork.org/scripts/435214/PrintStockPrice.user.js
// @updateURL https://update.greasyfork.org/scripts/435214/PrintStockPrice.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.style.visibility = 'hidden';
    setInterval(function () {
        var p = document.getElementById('hqzdf').textContent;
        console.log(p);
        document.title = 'P:' + p;
    }, 3000);
})();