// ==UserScript==
// @name         Trade Confirmation Helper
// @namespace    http://knightsradiant.pw/
// @version      0.1
// @description  Get rid of the trade confirmation pop up
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @author       Talus
// @match        https://politicsandwar.com/nation/trade/create*
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/461491/Trade%20Confirmation%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/461491/Trade%20Confirmation%20Helper.meta.js
// ==/UserScript==

(function() {
    var BUY_BUTTON_SELECTOR = 'button.btn-lg:nth-child(2)';
    var SELL_BUTTON_SELECTOR = 'button.btn-success:nth-child(1)';

    var $ = window.jQuery;

    $(BUY_BUTTON_SELECTOR).attr('type', 'submit');
    $(BUY_BUTTON_SELECTOR).attr('name', 'submit');
    $(BUY_BUTTON_SELECTOR).attr('form', 'createTrade');
    $(BUY_BUTTON_SELECTOR).attr('value', 'Buy');
    $(BUY_BUTTON_SELECTOR).attr('data-toggle', null);
    $(BUY_BUTTON_SELECTOR).attr('data-target', null);

    $(SELL_BUTTON_SELECTOR).attr('type', 'submit');
    $(SELL_BUTTON_SELECTOR).attr('name', 'submit');
    $(SELL_BUTTON_SELECTOR).attr('form', 'createTrade');
    $(SELL_BUTTON_SELECTOR).attr('value', 'Sell');
    $(SELL_BUTTON_SELECTOR).attr('data-toggle', null);
    $(SELL_BUTTON_SELECTOR).attr('data-target', null);
})();