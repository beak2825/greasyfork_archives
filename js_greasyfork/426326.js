// ==UserScript==
// @name         查看金投网白银价格
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  方便查看金投网白银价格
// @author       You
// @match        https://quote.cngold.org/gjs/yhzhj_ghzby1.html
// @icon         https://www.google.com/s2/favicons?domain=cngold.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426326/%E6%9F%A5%E7%9C%8B%E9%87%91%E6%8A%95%E7%BD%91%E7%99%BD%E9%93%B6%E4%BB%B7%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/426326/%E6%9F%A5%E7%9C%8B%E9%87%91%E6%8A%95%E7%BD%91%E7%99%BD%E9%93%B6%E4%BB%B7%E6%A0%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var img = new Image();
    function getPrice(){
        img.src="http://localhost:8080/silver/price?now="+document.querySelector("#now_price").innerHTML+"&time="+new Date().getTime();
        setTimeout(getPrice, 10000)
    }
    getPrice();
})();