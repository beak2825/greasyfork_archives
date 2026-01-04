// ==UserScript==
// @name         Spent on Ali
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get full amount of money spent on products
// @author       Peter Willemsen <peter@codebuffet.co>
// @match        https://trade.aliexpress.com/orderList.htm?*
// @match        https://trade.aliexpress.com/orderList.htm
// @grant GM_setValue
// @grant GM_getValue
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/373076/Spent%20on%20Ali.user.js
// @updateURL https://update.greasyfork.org/scripts/373076/Spent%20on%20Ali.meta.js
// ==/UserScript==

var kFullPrice = "full_price"
var kStarted = "started"
this.$ = this.jQuery = jQuery.noConflict(true);
$(function() {
    var $btn = $("<input type='button' value='Check full spend amount'/>");
    $btn.click(function() {
        GM_setValue(kFullPrice, 0);
        GM_setValue(kStarted, true);
        window.location.reload();
    });
    $('#simple-search').append($btn);
});

(function() {
    if(!GM_getValue(kStarted, false)) {
        return;
    }
    var floatify = function(text) {
        return parseFloat(text.replace(",", ".").replace(/[^\d.-]/g, ''));
    };
    var countOrdersTick = function() {
        var currentPrice = 0;
        $("p.amount-num").each(function() {
            currentPrice += floatify($(this).text());
        });
        console.log("current page price: " + currentPrice);
        var fullPrice = GM_getValue(kFullPrice, 0);
        GM_setValue(kFullPrice, fullPrice + currentPrice);
        console.log("current full price: " + (fullPrice + currentPrice));
        var $nextBtn = $("a.ui-pagination-next.ui-goto-page:first")
        if($nextBtn.length === 0) {
         alert('Your total amount spent on AliExpress: ' + (fullPrice + currentPrice).toFixed(2))
         GM_deleteValue(kStarted)
        }
        else {
            $nextBtn.get(0).click()
        }
    }
    setTimeout(countOrdersTick, 1000);
})();
