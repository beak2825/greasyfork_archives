// ==UserScript==
// @name         Alliance-First Bank Selector
// @namespace    http://www.knightsradiant.pw
// @version      0.12
// @description  Change the default first displayed option for sending bank resources to Alliance
// @author       Talus
// @match        https://politicsandwar.com/alliance/*&display=bank
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      GPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395863/Alliance-First%20Bank%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/395863/Alliance-First%20Bank%20Selector.meta.js
// ==/UserScript==

(function(){
    var bankSelectPath = "#rightcolumn > div.row > div:nth-child(2) > form > table > tbody > tr:nth-child(14) > td > p:nth-child(2) > select";
    var newBankHtml = "<option value=\"Leader\">Leader</option><option value=\"Alliance\" selected>Alliance</option><option value=\"Nation\">Nation</option>";
    var $ = window.jQuery;
    $(bankSelectPath).html(newBankHtml);
})();