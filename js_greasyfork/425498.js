// ==UserScript==
// @name         bestbuy add to cart
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  buying bot
// @author       Bboy Tech
// @include      https://www.bestbuy.com/site*
// @icon         https://www.google.com/s2/favicons?domain=bestbuy.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425498/bestbuy%20add%20to%20cart.user.js
// @updateURL https://update.greasyfork.org/scripts/425498/bestbuy%20add%20to%20cart.meta.js
// ==/UserScript==

(function() {
    var claimTimer = setInterval (function() {claim(); }, Math.floor(Math.random() * 500) + 600);
    var claimaTimer = setInterval (function() {claima(); }, Math.floor(Math.random() * 7000) + 7500);
    function claim(){
        document.getElementsByClassName("btn btn-primary btn-lg btn-block btn-leading-ficon add-to-cart-button")[0].click();
    }
    function claima(){
        var a = document.getElementsByClassName("btn btn-disabled btn-lg btn-block add-to-cart-button")[0].innerHTML;
        if (a == "Sold Out")
        {
            var link = location.href;
            location.href = link;
        }
    }
})();