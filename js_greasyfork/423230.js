// ==UserScript==
// @name         Neopets: Auto-Copy Shop Stock
// @namespace    http://lince.somnolescent.net
// @version      0.1
// @description  Automatically copy your source code when you go to a shop stock page. Also provides a convenient link the JellyNeo's shop stock checker.
// @author       metalynx/dotcomboom
// @match        http://www.neopets.com/market.phtml?type=your
// @match        http://www.neopets.com/market.phtml?order_by=id&type=your&lim=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423230/Neopets%3A%20Auto-Copy%20Shop%20Stock.user.js
// @updateURL https://update.greasyfork.org/scripts/423230/Neopets%3A%20Auto-Copy%20Shop%20Stock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var e = document.createElement("textarea");
    document.body.appendChild(e);
    e.innerText = document.documentElement.outerHTML;
    e.select(); document.execCommand("copy"); document.body.removeChild(e);

    document.getElementsByClassName("contentModuleHeader")[0].innerHTML += " [source copied! <a target=\"_blank\" href=\"https://items.jellyneo.net/tools/shop-stock-price-checker/\">check prices</a>]]";

    /* Bookmarklet ver
    javascript:(function(){javascript:!function(a){var b=document.createElement("textarea"),c=document.getSelection();b.textContent=a,document.body.appendChild(b),c.removeAllRanges(),b.select(),document.execCommand("copy"),c.removeAllRanges(),document.body.removeChild(b)}(document.documentElement.outerHTML)})() */
})();