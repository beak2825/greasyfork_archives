// ==UserScript==
// @name         PayPal_OVERRIDE
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.paypal.com/*
// @grant        none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @require       https://unpkg.com/xhook@latest/dist/xhook.min.js
// @downloadURL https://update.greasyfork.org/scripts/373734/PayPal_OVERRIDE.user.js
// @updateURL https://update.greasyfork.org/scripts/373734/PayPal_OVERRIDE.meta.js
// ==/UserScript==
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
(function() {
    $('#js_transactionCollection').hide();
    var newRule = ".transactionRow, #js_transactionCollection, .btn-group.splitButtonHoverOut{display:none !important;}";
    $("style").prepend(newRule);
    xhook.after(function(request, response) {
        console.log(request.url);
        if(request.url.match(/get\-invoices/)) {
            response.text = response.text.replaceAll('52,000','42,000');
            response.text = response.text.replaceAll('77,000','67,000');
            response.text = response.text.replaceAll('45,000','30,000');
            response.text = response.text.replaceAll('500.00','200.00');
        }
    });
    xhook.after(function(request, response) {
        console.log(request.url);
        if(request.url.match(/transactions\/details\/inline/)) {
            response.text = response.text.replaceAll('52,000','42,000.00');
            response.text = response.text.replaceAll('2,303.00','1,848.00');
            response.text = response.text.replaceAll('49,697.00','40,152.00');
            response.text = response.text.replaceAll('500.00','200.00');
        }
    });
    xhook.after(function(request, response) {
        console.log(request.url);
        if(request.url.match(/transactions\/filter/)) {
            response.text = response.text.replaceAll('52,000','42,000.00');
            response.text = response.text.replaceAll('2,303.00','1,848.00');
            response.text = response.text.replaceAll('49,697.00','40,152.00');
             response.text = response.text.replaceAll('500.00','200.00');
        }
    });
    /**
     * 1848 = 40152
     */
    $(document).ready(function(){
    $.each($('.transactionDescription'), function(i, ele){
        var parent = $(ele).parents('.transactionRow');
        if ($(ele).text().indexOf('Infopay') !== -1 || $(ele).text().indexOf('Accucom') !== -1) {
            var amountObj = $(parent).find('.transactionAmount .isPositive.vx_h4');
            amountObj.text('₱40,152.00');
        }
        if ($(ele).text().indexOf('Bank account') !== -1 || $(ele).text().indexOf('China') !== -1 || $(ele).text().indexOf('Metrobank') !== -1  || $(ele).text().indexOf('eBay') !== -1 || $(ele).text().indexOf('NBA') !== -1) {
            parent.hide();
        }
    });
        $('#js_transactionCollection').show();
        $('#itemPrice_0').val('42000.00');
        $('#itemAmount_0').val('42,000.00');
        $('td.invoiceFinalTotal').text('42,000.00 PHP');
    });
    $.each($('.itemprice, .itemamount'), function(i, ele){
        if ($(ele).text().indexOf('52,000') !== -1) {
            $(ele).text('₱42,000.00');
        }
        if ($(ele).text().indexOf('25,000') !== -1) {
            $(ele).text('₱25,000.00');
        }
        if ($(ele).text().indexOf('45,000') !== -1) {
            $(ele).text('₱30,000.00');
        }
        if ($(ele).text().indexOf('$500.00') !== -1) {
            $(ele).text('$200.00');
        }
    });

    $.each($('#invoiceTotals td.text-right'), function(i, td){
        var text = $(td).text();
        if (text === '₱52,000.00') {
            $(td).text('₱42,000.00');
        }
        if (text === '-₱52,000.00') {
            $(td).text('-₱42,000.00');
        }
        if (text === '₱45,000.00') {
            $(td).text('₱30,000.00');
        }
        if (text === '-₱45,000.00') {
            $(td).text('-₱30,000.00');
        }
        if (text === '-₱77,000.00') {
            $(td).text('-₱67,000.00');
        }
        if (text === '₱77,000.00') {
            $(td).text('₱67,000.00');
        }
        if (text === '-$500.00') {
            $(td).text('-$200.00');
        }
        if (text === '$500.00') {
            $(td).text('$200.00');
        }
    });
    $('#copyButton, #printInvoiceButton, .moreInvAction, .transactionHistory').hide();
})();