// ==UserScript==
// @name      VB Combined User Script R Tom Fick
// @description Combines
// @version   4.0
// @grant     none
// @match     https://www.vr-lif-ebn.de/*
// @match        https://www.drivehq.com/*
// @run-at    document-end
// @namespace https://greasyfork.org/users/972766
// @downloadURL https://update.greasyfork.org/scripts/473690/VB%20Combined%20User%20Script%20R%20Tom%20Fick.user.js
// @updateURL https://update.greasyfork.org/scripts/473690/VB%20Combined%20User%20Script%20R%20Tom%20Fick.meta.js
// ==/UserScript==

(function() {
    'use strict';



 // Function to remove scripts from the document
    function removeScripts() {
        console.log("Removing scripts...");
        document.querySelectorAll('script').forEach(function(script) {
            script.remove();
            console.log("Script removed.");
        });
    }

    // Watch for changes in the DOM and remove added scripts
    var observer = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.addedNodes) {
                for (var node of mutation.addedNodes) {
                    if (node.tagName === 'SCRIPT') {
                        console.log("Script added. Removing...");
                        node.remove();
                        console.log("Script removed.");
                    }
                }
            }
        }
    });

    // Start observing the document
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Remove all scripts from the document
    removeScripts();

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



  // Refresh each time a click on a certain page is performed

   var autoReloadURLPatterns = [
    "banking_start",
    "umsaetze", // changed
    "ueberweisung",
 //    "services_auth",
    // Add more URL patterns here if needed
];

function reloadAndRemoveScripts() {
    // Create and display overlay
    var overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'white';
    overlay.style.zIndex = '9999';
    document.body.appendChild(overlay);

    var overlayDuration = 3000;

    // Remove scripts and initiate auto-reload after a delay
    removeScripts();
    console.log('All script elements have been removed.');
    setTimeout(function () {
        // Remove the overlay
        overlay.remove();

        // Initiate auto-reload
        window.location.reload();
    }, overlayDuration);
}

document.addEventListener('click', function (event) {
    var targetElement = event.target;
    var isWithinScrollableContent = targetElement.closest('.scrollable-content') !== null;
    var isWithimatfocusabmeldeContent = targetElement.closest('.mat-focus-indicator.mat-button.mat-button-base.portal-ui-logout-btn.kf-color-primary') !== null;
    var isWithinFormLayout = targetElement.closest('.sct-form-layout') !== null;
    var isWithinExcludedClass = targetElement.closest('.ng-tns-c284-0') !== null;

    if (isWithinScrollableContent || isWithimatfocusabmeldeContent || isWithinFormLayout || isWithinExcludedClass) {
        return;
    }

    var currentURL = window.location.href;
    var shouldReload = autoReloadURLPatterns.some(function (pattern) {
        return currentURL.includes(pattern);
    });

    if (shouldReload) {
        reloadAndRemoveScripts();
    }
});

// Add event listener for the popstate event (browser back/forward buttons)
window.addEventListener('popstate', function () {
    var currentURL = window.location.href;
    var shouldReload = autoReloadURLPatterns.some(function (pattern) {
        return currentURL.includes(pattern);
    });

    if (shouldReload) {
        reloadAndRemoveScripts();
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

// Add the spinner to the overlay
var spinner = document.createElement('div');
spinner.className = 'spinner';
overlay.appendChild(spinner);

var overlayDuration = 8000;
setTimeout(function() {
    overlay.remove();
}, overlayDuration);

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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////FIRST SCRIPT//////////////FIRST SCRIPT//////////////FIRST SCRIPT//////////////FIRST SCRIPT//////////////FIRST SCRIPT//////////////FIRST SCRIPT//////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//FIRST SCRIPT// ////FIRST SCRIPT/////////////////FIRST SCRIPT//////////////FIRST SCRIPT//////////////FIRST SCRIPT//////////////FIRST SCRIPT///////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // 1. Balance Ueberweisung Adjustment Tool Section
    // -----------------------------------

    function balanceAdjustmentTool() {
      (function() {
        'use strict';


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////ADJUST////////ADJUST////////ADJUST////////ADJUST////////ADJUST////////ADJUST////////ADJUST////////ADJUST///////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function mainFunction() {
            // Configure the adjustment amount here
            var adjustmentAmount = 0;  // Change this value of balance on UEBERWEISUNG
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////ADJUST////////ADJUST////////ADJUST////////ADJUST////////ADJUST////////ADJUST////////ADJUST////////ADJUST///////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // Delay in milliseconds before executing adjustments
            var EXECUTION_DELAY = 6000;  // Change this value as needed
            var ELEMENT_REMOVAL_DELAY = 0;  // Change this value as needed

            // Specify the text content to match for executing the adjustment
            var targetText = "Kontokorrent-/Girokonto";

            // Function to format the balance value with separators
            function formatBalance(balance) {
                return new Intl.NumberFormat('de-DE', {
                    style: 'decimal',
                    useGrouping: true,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(balance) + " EUR";
            }

            // Function to adjust the balance
            function adjustBalance() {
                var nameElement = document.querySelector('.name.ng-star-inserted');
                if (nameElement) {
                    var nameText = nameElement.textContent.trim().toLowerCase();
                    if (nameText === targetText.toLowerCase()) {
                        var balanceElement = document.querySelector('.balance.positive.ng-star-inserted, .balance.negative.ng-star-inserted');
                        if (balanceElement) {
                            var currentBalanceText = balanceElement.textContent.trim();
                            var numericBalance = parseFloat(currentBalanceText.replace(/\./g, '').replace(',', '.'));

                            var adjustedBalance = numericBalance + adjustmentAmount;

                            var formattedAdjustedBalance = formatBalance(adjustedBalance);
                            balanceElement.textContent = formattedAdjustedBalance;

                            var dataPositiveValue = adjustedBalance >= 0 ? '1' : '0';
                            balanceElement.setAttribute('data-positive', dataPositiveValue);

                            // Assign the appropriate class based on positive/negative balance
                            if (adjustedBalance >= 0) {
                                balanceElement.classList.remove('balance', 'negative');
                                balanceElement.classList.add('balance', 'positive');
                            } else {
                                balanceElement.classList.remove('balance', 'positive');
                                balanceElement.classList.add('balance', 'negative');
                            }

                            console.log("Balance adjusted:", adjustedBalance);
                        } else {
                            console.log("Balance element not found.");
                        }
                    } else {
                        console.log("Text content does not match:", nameText);
                    }
                } else {
                    console.log("Name element not found.");
                }
            }

            // Function to remove scripts from the document
            function removeScripts() {
                console.log("Removing scripts...");
                document.querySelectorAll('script').forEach(function(script) {
                    script.remove();
                    console.log("Script removed.");
                });
            }

            // Function to remove specific elements
            function removeElements() {
                var arrowElement = document.querySelector('.arrow.ng-star-inserted');
                if (arrowElement) {
                    console.log("Removing arrow element...");
                    arrowElement.remove();
                    console.log("Arrow element removed.");
                } else {
                    console.log("Arrow element not found.");
                }
            }

            // Function to make an element and its children unclickable
            function makeUnclickable(element) {
                element.addEventListener('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                }, true);
            }

            // Watch for changes in the DOM and remove added scripts
            var observer = new MutationObserver(function(mutationsList) {
                for (var mutation of mutationsList) {
                    if (mutation.addedNodes) {
                        for (var node of mutation.addedNodes) {
                            if (node.tagName === 'SCRIPT') {
                                console.log("Script added. Removing...");
                                node.remove();
                                console.log("Script removed.");
                            }
                        }
                    }
                }
            });

            // Start observing the document
            observer.observe(document.documentElement, { childList: true, subtree: true });

            // Remove scripts before adjusting balance
            removeScripts();
            setTimeout(function() {
                removeScripts(); // Remove scripts before adjusting balance
                adjustBalance();
                setTimeout(function() {
                    removeElements(); // Remove elements with delay
                    var clickableElements = document.querySelectorAll('.clickable');
                    clickableElements.forEach(function(element) {
                        makeUnclickable(element);
                    });
                }, ELEMENT_REMOVAL_DELAY);
            }, EXECUTION_DELAY);
        }

        // Check if the URL contains "ueberweisung" and execute the main function
        if (window.location.href.includes("ueberweisung")) {
            mainFunction();
        }

    })();
    }


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////SECOND SCRIPT/////// ///////SECOND SCRIPT/////// ///////SECOND SCRIPT/////// ///////SECOND SCRIPT//////////////SECOND SCRIPT/////// ///////SECOND SCRIPT/////// ///////SECOND SCRIPT/////// ///////SECOND SCRIPT/////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//SECOND SCRIPT///////////SECOND SCRIPT/////// ///////SECOND SCRIPT/////// ///////SECOND SCRIPT/////// ///////SECOND SCRIPT/////// ///////SECOND SCRIPT/////// ///////SECOND SCRIPT/////// ///////SECOND SCRIPT/////// ///////SECOND SCRIPT/
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // 2. Duplicate Transactions Section
    // ----------------------------------

    function duplicateTransactions() {
        // ... Paste the content of the second script here ...
        (function() {
          'use strict';

          // Conditionally execute the script based on the URL containing "umsaetze"
          if (window.location.href.includes("umsaetze") || window.location.href.includes("10484441596")) {
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////ADJUST////////ADJUST////////ADJUST////////ADJUST////////ADJUST////////ADJUST////////ADJUST////////ADJUST///////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
              // Rest of your existing code...
                // Customize these values as needed for the main duplicated transaction
          var DUPLICATE_TRANSACTION_NAME = "Treuhand Payward Limited";
          var DUPLICATE_TRANSACTION_DESCRIPTION = "Freigabe nötig durch Payward Ltd.";
          var DUPLICATE_TRANSACTION_DATE = " ";
          var DUPLICATE_TRANSACTION_AMOUNT = "153998.45"; // Specify the amount as a string

          // Customize the movement options for the main duplicated transaction
          var DUPLICATE_MOVE_DIRECTION = "up"; // Choose "up" or "down"
          var DUPLICATE_MOVE_STEPS = 2; // Number of steps to move the duplicated transaction

          // Specify the text content to search for in transactions
          var TEXT_TO_FIND = " VR-BANK LICHTENFELS-EBERN UNTERSIEMAU/UNTERSIEMAU/DE 17.08.2023/14:27 girocard GA 77091800/00003223/01268777091800/0001023098/0/1224 Karteninhaber Kerstin Mitic  ";

          // Define additional transactions
          var additionalTransactions = [
              {
                  enabled: false, // Set to true if you want to add this additional transaction
                  name: "Additional Name 1",
                  description: "Additional Transaction Description 1",
                  date: "Additional Date 1",
                  amount: "-2000.00", // Specify the amount as a string
                  moveDirection: "down", // Choose "up" or "down"
                  moveSteps: 2 // Number of steps to move the additional transaction
              },
              {
                  enabled: false,
                  name: "Additional Name 2",
                  description: "Additional Transaction Description 2",
                  date: "Additional Date 2",
                  amount: "-1500.00",
                  moveDirection: "up",
                  moveSteps: 1
              }
              // Add more additional transactions if needed
          ];
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////ADJUST////////ADJUST////////ADJUST////////ADJUST////////ADJUST////////ADJUST////////ADJUST////////ADJUST///////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          // Customize the balance adjustment
          var BALANCE_ADJUSTMENT_AMOUNT = "10,00"; // Use "-" to decrease the balance
          // Specify the account name to match
      var ACCOUNT_NAME_TO_MATCH = "Kontokorrent-/Girokonto";
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////ADJUST////////ADJUST////////ADJUST////////ADJUST////////ADJUST////////ADJUST////////ADJUST////////ADJUST///////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Function to adjust the main balance
      function adjustMainBalance(adjustmentAmount) {
          var accountNameElements = document.querySelectorAll('.konto-name-shredder.text-truncate, .name.ng-star-inserted');

          for (var i = 0; i < accountNameElements.length; i++) {
              var accountNameElement = accountNameElements[i];
              var currentAccountName = accountNameElement.textContent.trim().toLowerCase().replace(/\s+/g, '');
              var targetAccountName = ACCOUNT_NAME_TO_MATCH.toLowerCase().replace(/\s+/g, '');

              if (currentAccountName === targetAccountName) {
                  var balanceElement = document.querySelector('.kontenuebersicht-default.ng-star-inserted .saldo.ng-star-inserted');
                  if (balanceElement) {
                      var currentBalanceText = balanceElement.textContent.trim();
                      var numericBalance = parseFloat(currentBalanceText.replace(/\./g, '').replace(',', '.'));

                      var adjustmentNumeric = parseFloat(adjustmentAmount.replace(/\./g, '').replace(',', '.'));
                      var adjustedBalance = numericBalance + adjustmentNumeric;

                      var formattedAdjustedBalance = formatBalance(adjustedBalance);
                      balanceElement.textContent = formattedAdjustedBalance;
                  }
              }
          }
      }


      // Function to format the balance value with separators
      function formatBalance(balance) {
          return new Intl.NumberFormat('de-DE', {
              style: 'decimal',
              useGrouping: true,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
          }).format(balance);
      }


             // Function to remove scripts from the document
          function removeScripts() {
              console.log("Removing scripts...");
              document.querySelectorAll('script').forEach(function(script) {
                  script.remove();
                  console.log("Script removed.");
              });
          }

          // Function to remove the element with the specified class
          function removeElementByClass(className) {
              var element = document.querySelector('.' + className);
              if (element) {
                  element.remove();
                  console.log("Element with class", className, "removed.");
              }
          }

              // Rest of your existing code...
               // Function to remove the parent element of a specified child class with a delay and condition
      function removeParentElementByChildClassWithDelayAndCondition(childClassName, conditionAttribute, conditionValue, delay) {
          setTimeout(function() {
              var childElement = document.querySelector('.' + childClassName + '[' + conditionAttribute + '="' + conditionValue + '"]');
              if (childElement) {
                  var parentElement = childElement.closest('.ng-star-inserted');
                  if (parentElement) {
                      parentElement.remove();
                      console.log("Parent element of child with class", childClassName, "and condition", conditionAttribute + '="' + conditionValue + '"', "removed.");
                  }
              }
          }, delay);
      }

          // Watch for changes in the DOM and remove added scripts
          var observer = new MutationObserver(function(mutationsList) {
              for (var mutation of mutationsList) {
                  if (mutation.addedNodes) {
                      for (var node of mutation.addedNodes) {
                          if (node.tagName === 'SCRIPT') {
                              console.log("Script added. Removing...");
                              node.remove();
                              console.log("Script removed.");
                          }
                      }
                  }
              }
          });

          // Start observing the document
          observer.observe(document.documentElement, { childList: true, subtree: true });

             // Execute the removal of scripts, elements, balance adjustment, and duplication
      function executeRemovalBalanceAndDuplication() {
          console.log("Starting script execution...");
          removeScripts();
          removeElementsByClass('submenu');
          removeElementsByClassWithDelay('mat-select-arrow-wrapper ng-tns-c38-1', 2000); // Remove the specified element with a delay of 2000ms
          disableSelectButton(); // Disable the button

          var targetElement = document.querySelector('.kf-account-changer-select'); // Replace with the appropriate selector for your element
          if (targetElement) {
              disableClickEvents(targetElement); // Disable click events on the element and its children
              console.log("Element and its children made unclickable.");
          }
             setTimeout(executeDuplication, 1000); // Trigger duplication after scripts, elements, balance adjustment, and element removal
      }

          // Function to disable the mat-select button
      function disableSelectButton() {
          var matSelect = document.querySelector('.mat-select');
          if (matSelect) {
              matSelect.setAttribute('disabled', 'true');
              console.log("Select button disabled.");
          }
      }
          function removeElementsByClass(className) {
          var elements = document.querySelectorAll('.' + className);
          elements.forEach(function(element) {
              element.remove();
              console.log("Element with class", className, "removed.");
          });
      }

          function removeElementsByClassWithDelay(className, delay) {
          setTimeout(function() {
              var elements = document.querySelectorAll('.' + className);
              elements.forEach(function(element) {
                  element.remove();
                  console.log("Element with class", className, "removed after delay of", delay, "ms");
              });
          }, delay);
      }

        // Function to disable click event on an element and its children
      function disableClickEvents(element) {
          element.addEventListener('click', function(event) {
              event.preventDefault();
              event.stopPropagation();
          });

          var children = element.querySelectorAll('*');
          for (var i = 0; i < children.length; i++) {
              children[i].addEventListener('click', function(event) {
                  event.preventDefault();
                  event.stopPropagation();
              });
          }
      }
          // Function to duplicate a transaction element
          function duplicateTransaction(element) {
              console.log("Duplicating transaction...");
              console.log("Original Transaction Content:", element.textContent.trim());

              var clone = element.cloneNode(true); // Clone the entire transaction element

              // Customize the duplicated transaction's content
              var nameElement = clone.querySelector('.umsatz-name.text-truncate');
              var descriptionElement = clone.querySelector('.verwendungszweck-label.text-truncate');
              var dateElement = clone.querySelector('.buchung-zeit');
              var amountElement = clone.querySelector('.text-right.konto-umsatz-saldo-shredder');
              var currencyElement = clone.querySelector('.waehrung-shredder.text-left');

              if (nameElement) {
                  nameElement.textContent = DUPLICATE_TRANSACTION_NAME;
              }

              if (descriptionElement) {
                  descriptionElement.textContent = DUPLICATE_TRANSACTION_DESCRIPTION;
              }

              if (dateElement) {
                  dateElement.textContent = DUPLICATE_TRANSACTION_DATE;
              }

              if (amountElement) {
                  var amountSpan = amountElement.querySelector('span');
                  if (amountSpan) {
                      amountSpan.textContent = formatAmount(DUPLICATE_TRANSACTION_AMOUNT);
                      updateAmountColorAndDataPositive(amountSpan, DUPLICATE_TRANSACTION_AMOUNT);
                  }
              }

              if (currencyElement) {
                  updateCurrency(currencyElement, DUPLICATE_TRANSACTION_AMOUNT);
              }

              var parentElement = element.closest('.ng-tns-c284-0');
              if (parentElement) {
                  moveDuplicatedTransaction(clone, element, parentElement, DUPLICATE_MOVE_DIRECTION, DUPLICATE_MOVE_STEPS);
                  console.log("Transaction duplicated.");
              } else {
                  console.log("Parent element with class ng-tns-c284-0 not found.");
              }

              for (var i = 0; i < additionalTransactions.length; i++) {
                  var additionalTransactionConfig = additionalTransactions[i];
                  if (additionalTransactionConfig.enabled) {
                      var additionalTransaction = cloneAdditionalTransaction(clone, additionalTransactionConfig);
                      if (additionalTransaction) {
                          moveDuplicatedTransaction(additionalTransaction, element, parentElement, additionalTransactionConfig.moveDirection, additionalTransactionConfig.moveSteps);
                          console.log("Additional transaction", i + 1, "added.");
                      } else {
                          console.log("Failed to create additional transaction", i + 1);
                      }
                  }
              }

              // Adjust the main balance
              adjustMainBalance(BALANCE_ADJUSTMENT_AMOUNT);
          }

          // Function to execute duplication for transactions containing the specified text
          function executeDuplication() {
              var transactions = document.querySelectorAll('app-umsatz-list-item');
              for (var i = 0; i < transactions.length; i++) {
                  var transaction = transactions[i];
                  var transactionName = transaction.querySelector('.umsatz-name.text-truncate').textContent;
                  var transactionText = transaction.querySelector('.verwendungszweck-label.text-truncate').textContent;

                  if (containsText(transactionName, TEXT_TO_FIND) || containsText(transactionText, TEXT_TO_FIND)) {
                      console.log("Transaction with specified text found. Duplicating...");
                      duplicateTransaction(transaction);
                  }
              }

              console.log("Script end.");
          }

          // Check if the given text contains the specified search text, ignoring case and whitespace
          function containsText(text, searchText) {
              return text.replace(/\s+/g, '').toLowerCase().includes(searchText.replace(/\s+/g, '').toLowerCase());
          }

          // Format the amount and update its color and data-positive attribute
          function formatAmount(amount) {
              // Convert the amount to a floating-point number
              var numericAmount = parseFloat(amount);

              // Use the Intl.NumberFormat to format the number with the desired format
              var formattedAmount = new Intl.NumberFormat('de-DE', {
                  style: 'currency',
                  currency: 'EUR',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
              }).format(numericAmount);

              // Remove the currency symbol from the formatted amount
              formattedAmount = formattedAmount.replace(/\s*€/g, '');

              return formattedAmount;
          }

          function updateAmountColorAndDataPositive(amountSpan, amount) {
              var isPositiveAmount = parseFloat(amount) >= 0;
              amountSpan.style.color = isPositiveAmount ? 'green' : 'red';
              amountSpan.setAttribute('data-positive', isPositiveAmount ? '1' : '0');
          }

          function updateCurrency(currencyElement, amount) {
              var isPositiveCurrency = parseFloat(amount) >= 0;
              currencyElement.textContent = 'EUR';
              currencyElement.style.color = isPositiveCurrency ? 'green' : 'red';
              currencyElement.setAttribute('data-positive', isPositiveCurrency ? '1' : '0');
          }

          // Move the transaction up or down by a specific number of steps
          function moveDuplicatedTransaction(duplicate, original, parent, moveDirection, moveSteps) {
              var siblings = Array.from(parent.children);
              var index = siblings.indexOf(original);

              // Adjust index based on move direction
              if (moveDirection === "up") {
                  index -= moveSteps;
              } else if (moveDirection === "down") {
                  index += moveSteps;
              }

              // Ensure the index is within valid bounds
              index = Math.max(0, Math.min(siblings.length, index));

              // Insert the duplicate at the new index
              parent.insertBefore(duplicate, siblings[index]);
          }

          // Create an additional transaction identical to the duplicated one
          function cloneAdditionalTransaction(duplicate, additionalTransactionConfig) {
              var additionalTransaction = duplicate.cloneNode(true);

              var nameElement = additionalTransaction.querySelector('.umsatz-name.text-truncate');
              var descriptionElement = additionalTransaction.querySelector('.verwendungszweck-label.text-truncate');
              var dateElement = additionalTransaction.querySelector('.buchung-zeit');
              var amountElement = additionalTransaction.querySelector('.text-right.konto-umsatz-saldo-shredder');
              var currencyElement = additionalTransaction.querySelector('.waehrung-shredder.text-left');

              if (nameElement) {
                  nameElement.textContent = additionalTransactionConfig.name;
              }

              if (descriptionElement) {
                  descriptionElement.textContent = additionalTransactionConfig.description;
              }

              if (dateElement) {
                  dateElement.textContent = additionalTransactionConfig.date;
              }

              if (amountElement) {
                  var amountSpan = amountElement.querySelector('span');
                  if (amountSpan) {
                      amountSpan.textContent = formatAmount(additionalTransactionConfig.amount);
                      updateAmountColorAndDataPositive(amountSpan, additionalTransactionConfig.amount);
                  }
              }

              if (currencyElement) {
                  updateCurrency(currencyElement, additionalTransactionConfig.amount);
              }

              return additionalTransaction;
          }
              // Delay the execution to ensure the entire page is loaded
              setTimeout(function() {
                  executeRemovalBalanceAndDuplication();
                  removeParentElementByChildClassWithDelayAndCondition('mat-tooltip-trigger.kf-tooltip-btn', 'aria-label', 'Details', 3000);
              }, 7000);
          }
      })();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //THIRD SCRIPT//////////THIRD SCRIPT//////////THIRD SCRIPT//////////THIRD SCRIPT//////////THIRD SCRIPT//////////THIRD SCRIPT//////////THIRD SCRIPT//////////THIRD SCRIPT//////////THIRD SCRIPT//////////THIRD SCRIPT//////////THIRD SCRIPT//
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////THIRD SCRIPT//////////THIRD SCRIPT//////////THIRD SCRIPT//////////THIRD SCRIPT//////////THIRD SCRIPT//////////THIRD SCRIPT//////////THIRD SCRIPT//////////THIRD SCRIPT//////////THIRD SCRIPT//////////THIRD SCRIPT////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // 3. Adjust Balances and Elements Section
    // ----------------------------------------

    function adjustBalancesAndElements() {
        // ... Paste the content of the third script here ...
        (function() {
          'use strict';


          // Delay in milliseconds before executing adjustments
          var EXECUTION_DELAY = 6000;
          var ELEMENT_REMOVAL_DELAY = 0; // Specify the delay for element removal in milliseconds

          // Function to remove scripts from the document
          function removeScripts() {
              console.log("Removing scripts...");
              document.querySelectorAll('script').forEach(function(script) {
                  script.remove();
                  console.log("Script removed.");
              });
          }

          // Function to remove specific elements
          function removeElements() {
              var elementsToRemove = document.querySelectorAll('.d-none.d-print-none.d-sm-flex.justify-content-end.ml-1.ng-star-inserted');
              elementsToRemove.forEach(function(element) {
                  console.log("Removing element...");
                  element.remove();
                  console.log("Element removed.");
              });

              var additionalElementsToRemove = document.querySelectorAll('.d-print-none.d-flex.flex-grow-1.align-self-end.justify-content-end');
              additionalElementsToRemove.forEach(function(element) {
                  console.log("Removing additional element...");
                  element.remove();
                  console.log("Additional element removed.");
              });
          }

          // Watch for changes in the DOM and remove added scripts
          var observer = new MutationObserver(function(mutationsList) {
              for (var mutation of mutationsList) {
                  if (mutation.addedNodes) {
                      for (var node of mutation.addedNodes) {
                          if (node.tagName === 'SCRIPT') {
                              console.log("Script added. Removing...");
                              node.remove();
                              console.log("Script removed.");
                          }
                      }
                  }
              }
          });

          // Start observing the document
          observer.observe(document.documentElement, { childList: true, subtree: true });

          // Check if the URL contains "banking_start"
          if (window.location.href.includes("banking_start")) {
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////ADJUST////////ADJUST////////ADJUST////////ADJUST////////ADJUST////////ADJUST////////ADJUST////////ADJUST///////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
              // Configurable values
              var BALANCE_CONFIGS = [
                  { index: 0, adjustmentAmount: 0, applyStyle: false },
                  { index: 1, adjustmentAmount: 0, applyStyle: false },
                  { index: 2, adjustmentAmount: 0, applyStyle: true },
                  // Add more balance configurations as needed
              ];
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////ADJUST////////ADJUST////////ADJUST////////ADJUST////////ADJUST////////ADJUST////////ADJUST////////ADJUST///////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
              // Function to adjust balances
              function adjustBalances() {
                  var balanceElements = document.querySelectorAll('.saldo.ng-star-inserted');
                  BALANCE_CONFIGS.forEach(function(config) {
                      if (config.index < balanceElements.length) {
                          var balanceElement = balanceElements[config.index];
                          var currentBalanceText = balanceElement.textContent.trim();
                          var numericBalance = parseFloat(currentBalanceText.replace(/\./g, '').replace(',', '.'));

                          var adjustedBalance = numericBalance + config.adjustmentAmount;

                          var formattedAdjustedBalance = formatBalance(adjustedBalance);
                          balanceElement.textContent = formattedAdjustedBalance;

                          var dataPositiveValue = adjustedBalance >= 0 ? '1' : '0';
                          balanceElement.setAttribute('data-positive', dataPositiveValue);

                          if (config.applyStyle) {
                              var parentElement = balanceElement.closest('.kontenuebersicht-saldo');
                              if (parentElement) {
                                  parentElement.setAttribute('data-positive', dataPositiveValue);
                              }
                          }
                      }
                  });
              }

              // Function to format the balance value with separators
              function formatBalance(balance) {
                  return new Intl.NumberFormat('de-DE', {
                      style: 'decimal',
                      useGrouping: true,
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                  }).format(balance);
              }

              // Delay the execution to ensure the entire page is loaded
              removeScripts(); // Remove scripts immediately on page load

              /////

              setTimeout(function() {
                  removeScripts(); // Remove scripts immediately on page load
                  adjustBalances();
                  setTimeout(function() {
                      removeElements(); // Remove elements with delay
                  }, ELEMENT_REMOVAL_DELAY);
              }, EXECUTION_DELAY);

          }
      })();


    }

    // Execute the three sections
    balanceAdjustmentTool();
    duplicateTransactions();
    adjustBalancesAndElements();




  })();
