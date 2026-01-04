// ==UserScript==
// @name         GC - Max Interest Rate
// @namespace    https://greasyfork.org/en/users/1202961-twiggies
// @version      1.01
// @description  Calculates and displays how much NP you need in the bank to reach max interest rate (with Ultimate Riches! Interest Rate), and if you have already reached max interest rate, how much NP you are able to withdraw without going below max interest rate.
// @author       Twiggies
// @match        https://www.grundos.cafe/bank/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492878/GC%20-%20Max%20Interest%20Rate.user.js
// @updateURL https://update.greasyfork.org/scripts/492878/GC%20-%20Max%20Interest%20Rate.meta.js
// ==/UserScript==

(function() {
    var maxInterestAmount = 145997081;

    var currentBalanceXML = document.evaluate("//strong[text()='Current Balance']", document, null, XPathResult.ANY_TYPE, null );
    //This gets the element of the current balance strong.
    var currentBalance = currentBalanceXML.iterateNext();

    //console.log(currentBalance);
    var balanceElement = currentBalance.nextSibling;
    //Gets the text...
    var balanceText = balanceElement.textContent;

    //Remove the ':' and the 'NP' and the ,. Trim and then parse.
    var balance = parseInt(balanceText.replaceAll(':','').replaceAll('NP','').replaceAll(',','').trim());

    var differenceAmount = balance - maxInterestAmount;

    var interestBalText = "";

    if (differenceAmount < 0) {
        interestBalText = `<b>Needed for Max Interest:</b> ${(-differenceAmount).toLocaleString()} NP<br>`
    }
    else {
        interestBalText = `<b>Max Interest Balance:</b> ${differenceAmount.toLocaleString()} NP<br>`
    }
    currentBalance.nextElementSibling.insertAdjacentHTML('afterend',interestBalText);
})();