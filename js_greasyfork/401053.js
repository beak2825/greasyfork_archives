// ==UserScript==
// @name         Trade Offer Helper
// @namespace    http://knightsradiant.pw/
// @version      0.54
// @description  Auto-fill the trade form from URL parameters, allow purchasing by total price, and get rid of the trade confirmation pop-up
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @author       Talus
// @match        https://politicsandwar.com/nation/trade/create*
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/401053/Trade%20Offer%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/401053/Trade%20Offer%20Helper.meta.js
// ==/UserScript==

(function() {
    var AMOUNT_TEXT_SELECTOR = '#createTrade > div.row > div > table > tbody > tr:nth-child(3) > td:nth-child(1)';
    var UNITS_SELECTOR = '#createTrade > div.row > div > table > tbody > tr:nth-child(3)';
    var AMOUNT_SELECTOR = '#amount';
    var PRICE_PER_SELECTOR = '#priceper';
    var OFFER_TOTAL_PRICE_SELECTOR = '#offer_total_price';
    var BUY_BUTTON_SELECTOR = 'button.btn-lg:nth-child(2)';
    var SELL_BUTTON_SELECTOR = 'button.btn-success:nth-child(1)';

    var $ = window.jQuery;
    $.urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)', 'i').exec(window.location.href);
        if (results) {
            return results[1] || 0;
        }
    }

    $(AMOUNT_TEXT_SELECTOR).text('Desired Units:');
    var total_price = $(AMOUNT_SELECTOR).val() * $(PRICE_PER_SELECTOR).val();
    $(UNITS_SELECTOR).after('<tr><td>Desired Total Price:</td><td><input type="number" name="offer_total_price" minimum = "1" id="'+OFFER_TOTAL_PRICE_SELECTOR.substr(1)+'" style="width:100%;" value="'+total_price+'" class="right" /></td></tr>');
    $(AMOUNT_SELECTOR).on("keyup change", function() {
        $(OFFER_TOTAL_PRICE_SELECTOR).val(Math.floor($(AMOUNT_SELECTOR).val() * $(PRICE_PER_SELECTOR).val()));
        $(AMOUNT_SELECTOR).trigger("change");
    })
    $(OFFER_TOTAL_PRICE_SELECTOR).on("change", function() {
        $(AMOUNT_SELECTOR).val(Math.floor($(OFFER_TOTAL_PRICE_SELECTOR).val() / $(PRICE_PER_SELECTOR).val()));
        $(AMOUNT_SELECTOR).trigger("change");
    })
    $(PRICE_PER_SELECTOR).on("keyup change", function() {
        $(OFFER_TOTAL_PRICE_SELECTOR).val(Math.floor($(AMOUNT_SELECTOR).val() * $(PRICE_PER_SELECTOR).val()));
        $(PRICE_PER_SELECTOR).trigger("change");
    })

    if ($.urlParam('ppu')) {
        $(PRICE_PER_SELECTOR).val($.urlParam('ppu'));
    }
    if ($.urlParam('trade_amount')) {
        $(AMOUNT_SELECTOR).val($.urlParam('trade_amount'));
    }
    if ($.urlParam('t')) {
        var action = $.urlParam('t').toLowerCase();
        switch (action) {
            case 'b':
                $(BUY_BUTTON_SELECTOR).css('border-radius', '6px')
                $(SELL_BUTTON_SELECTOR).hide()
                break;
            case 's':
                $(SELL_BUTTON_SELECTOR).css('border-radius', '6px')
                $(BUY_BUTTON_SELECTOR).hide()
                break;
        }
    }
})();