// ==UserScript==
// @name         Bookie Calculator
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Calculates your total winnnings and profit in the Torn bookie
// @author       LordBusiness
// @match        https://www.torn.com/bookie.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368072/Bookie%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/368072/Bookie%20Calculator.meta.js
// ==/UserScript==

// a minimal jQuery library for reacting to innerHTML changes
(function($) {
  $.fn.change = function(cb, e) {
    e = e || { subtree:true, childList:true, characterData:true };
    $(this).each(function() {
      function callback(changes) { cb.call(node, changes, this); }
      var node = this;
      (new MutationObserver(callback)).observe(node, e);
    });
  };
})(jQuery);

var betTimer = setInterval(function() {
    if($(".bookie-main-wrap").length > 0) {
        betCalc();
    }
}, 3000);

function betCalc() {
    if(($(".betRes").length == 0) && ($(".confirm-bet").length > 0)) {
        $('.confirm-bet').change(function(changes, observer) {
            try {
                var betMoney = $(this).text();
                betMoney = /\$[0-9,]+/gm.exec(betMoney);
                var origBetMoney = parseInt(betMoney[0].replace(/[^0-9]/g, ''));
                console.log("Cons = " +betMoney);
                var betMultiplier = $(this).parent("ul.item").children("li.multiplier").first().text();
                betMultiplier = parseFloat(betMultiplier.replace(/[^0-9.]/gi, ''));
                betMoney = parseInt(origBetMoney * betMultiplier);
                if(isNaN(betMoney))
                    throw 666;
                $("span.betRes").html(" Win: $" + betMoney.toLocaleString() + " Profit: $" + (betMoney - origBetMoney).toLocaleString());
            }
            catch(err) {
                console.log("Err:" + err);
            }
        });
        $(".info-msg").find(".msg").append('<span class="betRes"></span>');
    }
}

console.log("Made by LordBusiness. Send me something if you like it ;)");