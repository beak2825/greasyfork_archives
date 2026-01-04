// ==UserScript==
// @name         Export New Listings
// @namespace    https://greasyfork.org/en/users/1059737
// @version      0.1.1
// @description  Export New Listings from Binance in TradingView watchlist format.
// @author       muyexi
// @license      MIT
// @match        https://www.binance.com/*/markets/newListing
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/463943/Export%20New%20Listings.user.js
// @updateURL https://update.greasyfork.org/scripts/463943/Export%20New%20Listings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var text = "";
    var targets = document.getElementsByClassName('css-75wmgf');

    for( var i = 0; i < targets.length; i++ ) {
      text += "BINANCE:" + targets[i].innerText + "USDT\n";
    }

    let element = document.createElement('a');
    element.href = "data:application/octet-stream,"+encodeURIComponent(text);
    element.download = 'New Listing.txt';
    element.click();
})();
