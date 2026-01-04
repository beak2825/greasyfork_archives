// ==UserScript==
// @name         TORN - Quick Bazaar
// @namespace    bazaar
// @version      1.0
// @description  Helps add items to your bazaar quicker by copying the item quantity available and value to the clipboard so you just need to Ctl+V.
// @author       DrCode[1973772]
// @match        https://www.torn.com/bazaar.php
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        GM_setClipboard
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/39879/TORN%20-%20Quick%20Bazaar.user.js
// @updateURL https://update.greasyfork.org/scripts/39879/TORN%20-%20Quick%20Bazaar.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var observer = new MutationObserver(function(mutations) {
        if($("div.amount").length) {
            observer.disconnect();
        }
        $("div.amount").children("input.clear-all").focus(function() {
            var rgx = /.* x(.*)$/g;
            var quantityText = $(this).parent().parent().parent().prev().children(".name-wrap").text();
            var match = rgx.exec(quantityText);
            var quantity = match == null ? 1 : match[1];
            GM_setClipboard(quantity, "text");
        });
        $("div.price").children("div.input-money-group").children("input.clear-all").focus(function() {
            var priceText = $(this).parent().parent().parent().next().children().text().substring(1).replace(/\D/g, '');
            var price = Math.ceil(parseInt(priceText) * 0.9999);
            GM_setClipboard(price, "text");
        });
    });
    var observerTarget = $(".content-wrapper")[0];
    var observerConfig = { attributes: false, childList: true, characterData: false, subtree: true };
    observer.observe(observerTarget, observerConfig);
})();