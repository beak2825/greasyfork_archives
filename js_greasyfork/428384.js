// ==UserScript==
// @name         Nobitext USDT Title
// @namespace    Nobitext
// @version      0.1
// @description  Nobitex!
// @author       amiwrpremium
// @match        https://nobitex.ir/current-prices/
// @icon         https://www.google.com/s2/favicons?domain=nobitex.ir
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428384/Nobitext%20USDT%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/428384/Nobitext%20USDT%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var title = document.getElementsByTagName('title')[0];
    setInterval(function(){
        var usdt = document.querySelector('#new-app-design > div:nth-child(2) > section:nth-child(3) > div > main > div > div > div.market-overview__body.w-100.bg-white.light-shadow.table-responsive > table > tbody > tr:nth-child(11) > td:nth-child(3) > div > span.text-title.fs-15.fw-700').innerText.substr(4,6);
        title.innerHTML = usdt;
    }, 1000);

})();