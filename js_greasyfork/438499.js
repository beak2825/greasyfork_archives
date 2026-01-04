// ==UserScript==
// @name         Ebay for "according to description"
// @description  Tries to view the item description valid at the date of purchase
// @author       Werve
// @match        https://order.ebay.it/ord/*
// @icon         https://icons.duckduckgo.com/ip2/ebay.it.ico
// @grant        none
// @create       2022-01-13
// @lastmodified 2022-11-04
// @version      0.2
// @namespace    https://greasyfork.org/users/669237
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      CC BY 4.0
// @copyright    2022 Werve
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/438499/Ebay%20for%20%22according%20to%20description%22.user.js
// @updateURL https://update.greasyfork.org/scripts/438499/Ebay%20for%20%22according%20to%20description%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $.noConflict(true);
    $(".item-card-container").find(".card-content-description-box").append("<div id='try_old_desc'> <button id='old_desc'> View item description valid at the date of purchase </button></div>");
    $("button#old_desc").click(URL_desc);
})();

function URL_desc(){
    let URL = $(this).parent().parent().find(".card-content-actions").find(".eui-textual-display.eui-textual-display--action").attr("href");
    let productId = URL.match(/.*item.?id=(\d+)/)[1];
    let transactionId = URL.match(/.*transId=(\d+)/)[1];
    let URL2 = "https://ebay.it/ipp/"+ productId +"?transactionId="+ transactionId;
    window.open(URL2, '_blank').focus();
}
