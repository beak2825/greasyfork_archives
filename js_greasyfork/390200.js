// ==UserScript==
// @name         Calculate Total Period Pay
// @namespace    http://idlewords.net
// @version      0.3
// @description  Show both completed pay amount and projected total including amount in queue
// @author       You
// @match        https://jobs.3playmedia.com/available_jobs*
// @match        https://jobs.3playmedia.com/assigned_jobs*
// @grant        none
// @require      https://greasyfork.org/scripts/390229-mutationsummary/code/MutationSummary.js?version=733946
// @downloadURL https://update.greasyfork.org/scripts/390200/Calculate%20Total%20Period%20Pay.user.js
// @updateURL https://update.greasyfork.org/scripts/390200/Calculate%20Total%20Period%20Pay.meta.js
// ==/UserScript==

function calculate_pay() {
    $("li#current_pay > div.main_text").attr('id', 'invoice_pay');
    var total_pay = 0;
    $("#current_pay > div > h2, #current_pay > h2").each(function(){
        curNumber = +$(this).text().replace('$','');
        total_pay = total_pay + curNumber;
    });

    total_pay = "&nbsp;/&nbsp;$" + total_pay.toFixed(2);
    $("#invoice_pay").find('h2').first().html($("#invoice_pay").find('h2:first').text() + total_pay);
}

calculate_pay();

var observer = new MutationSummary({
    callback: handlePayChange,
    queries: [{ element: "#invoice_pay" }]
});

function handlePayChange(summaries) {
    calculate_pay();
}