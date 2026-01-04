// ==UserScript==
// @name         Car-Part.com Hide Rows Containing $Call and Count Them
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hide any table row that includes "$Call" in its content and display a count of hidden rows.
// @author       Your Name
// @match        https://www.car-part.com/*
// @run-at       document-end
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525490/Car-Partcom%20Hide%20Rows%20Containing%20%24Call%20and%20Count%20Them.user.js
// @updateURL https://update.greasyfork.org/scripts/525490/Car-Partcom%20Hide%20Rows%20Containing%20%24Call%20and%20Count%20Them.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create and style a div element to show the counter
    const counterDiv = document.createElement('div');
    counterDiv.id = "hiddenCallCounter";
    counterDiv.style.position = "fixed";
    counterDiv.style.bottom = "10px";
    counterDiv.style.right = "10px";
    counterDiv.style.padding = "10px";
    counterDiv.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    counterDiv.style.color = "#fff";
    counterDiv.style.fontSize = "14px";
    counterDiv.style.borderRadius = "4px";
    counterDiv.style.zIndex = "9999";
    document.body.appendChild(counterDiv);

    // Function to update the counter display by counting rows marked as hidden
    function updateHiddenCounter() {
        // Count rows that we've marked as hidden using a custom data attribute
        const hiddenCount = document.querySelectorAll("tr[data-hidden-call='true']").length;
        counterDiv.textContent = `Rows hidden containing $Call: ${hiddenCount}`;
    }

    // Function to hide rows that contain "$Call"
    function hideCallRows() {
        // Select all table rows
        const rows = document.querySelectorAll("tr");
        rows.forEach(row => {
            // Check if the row contains "$Call" (case-sensitive). Adjust if needed.
            if (row.textContent.includes("$Call")) {
                // Only hide and mark the row if it hasn't already been marked
                if (!row.dataset.hiddenCall) {
                    row.style.display = "none";
                    row.dataset.hiddenCall = "true"; // mark this row as hidden by our script
                    console.log("Hiding row:", row);
                }
            }
        });
        updateHiddenCounter();
    }

    // Run the function after the DOM is loaded
    hideCallRows();

    // Use a MutationObserver in case new rows are added dynamically.
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // If the node itself is a row, process it:
                    if (node.matches("tr")) {
                        if (node.textContent.includes("$Call") && !node.dataset.hiddenCall) {
                            node.style.display = "none";
                            node.dataset.hiddenCall = "true";
                            console.log("Hiding newly added row:", node);
                        }
                    }
                    // Also check any descendant rows in case a container is added
                    node.querySelectorAll && node.querySelectorAll("tr").forEach(childRow => {
                        if (childRow.textContent.includes("$Call") && !childRow.dataset.hiddenCall) {
                            childRow.style.display = "none";
                            childRow.dataset.hiddenCall = "true";
                            console.log("Hiding descendant row:", childRow);
                        }
                    });
                }
            });
        });
        updateHiddenCounter();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
