// ==UserScript==
// @name         BTC USD Price
// @namespace    CES
// @version      0.2
// @description  Displays the price in USD under the BTC price.
// @author       eskodhi
// @match        https://www.cryptopia.co.nz/Exchange?market=*_BTC
// @grant        none
// @copyright    2017 eskodhi
// @downloadURL https://update.greasyfork.org/scripts/35869/BTC%20USD%20Price.user.js
// @updateURL https://update.greasyfork.org/scripts/35869/BTC%20USD%20Price.meta.js
// ==/UserScript==

(function() {

    var last_update;
    var last_price;
    var fetching = false;

    function get_price() {
        return new Promise(function(resolve, reject) {
            // was the last update at least 3 seconds ago?
            if (last_update) {
                var delta = (Date.now() - last_update) / 1000;
                if (delta < 5) {
                    if (window.debug) {
                        console.log("delta is", delta);
                        console.log("using cached response");
                    }
                    return resolve(last_price);
                }
            }

            console.log("delay has been", (Date.now() - last_update) / 1000);

            if (fetching) { console.log("already fetching"); return resolve(1); }
            if (window.debug) console.log("fetching live price");
            fetching = true;
            $.get('https://api.gdax.com/products/BTC-USD/ticker')
                .done(function(result) {
                fetching = false;
                last_update = Date.now();
                last_price = parseFloat(result.price);
                resolve(parseFloat(result.price));
            })
                .fail(reject);
        });
    }

    // select the target node
    var $price = $('b.ticker-last');
    var target = $price[0];

    var _updateTicker = window.updateTicker;
    window.updateTicker = function(n) {
        _updateTicker(n);
        var btc_price = parseFloat($price.text().split("\n")[0]);
        get_price().then(function(btc_usd) {
            $price.text($price.text() + "\n" + "$" + (btc_price * btc_usd).toFixed(8));
        });
    };
 })();