// ==UserScript==
// @name         Company Max Withdrawal Calculator
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Calculates the maximum amount you can withdraw from the company bank.
// @author       LordBusiness [2052465]
// @match        https://www.torn.com/companies.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369403/Company%20Max%20Withdrawal%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/369403/Company%20Max%20Withdrawal%20Calculator.meta.js
// ==/UserScript==

//Insert Your Torn API key here .. e.g. var APIkey = "HkU48qd86vjkNHaO";
var APIkey = "";

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

var url = "https://api.torn.com/company/?selections=employees&key=" + APIkey;
$("#ui-id-10").click(function() {
    $('#funds').change(function(changes, observer) {
            try {
                var sum = 0;
                if((changes.length == 11) && ($("#funds > .withdraw").find(".m-bottom5").length == 1)) {
                    $.getJSON( url )
                        .done(function( json ) {
                        sum = 0;
                        for (var key in json.company_employees) {
                            sum += parseInt(json.company_employees[key].wage);
                        }
                        var maxWithdraw = $("#funds > .withdraw").find(".bold").text();
                        maxWithdraw = /\$[0-9,]+/gm.exec(maxWithdraw);
                        maxWithdraw = parseInt(maxWithdraw[0].replace(/[^0-9]/g, ''));
                        $("#funds > .withdraw").find(".m-bottom5").html("You can withdraw a maximum of $" + (maxWithdraw - (sum * 7)).toLocaleString());
                    })
                        .fail(function( jqxhr, textStatus, error ) {
                        var err = textStatus + ", " + error;
                        console.log( "Request Failed: " + err );
                    });
                }

            }
            catch(err) {
                console.log("Err:" + err);
            }
        });
});

console.log("Made by LordBusiness.");