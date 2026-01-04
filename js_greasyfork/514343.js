// ==UserScript==
// @name         Walmart Orders Open in New Tab
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Convert Walmart order buttons to clickable links, opening in current tab with left click and new tab with middle click
// @author       You
// @match        https://www.walmart.com/orders*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514343/Walmart%20Orders%20Open%20in%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/514343/Walmart%20Orders%20Open%20in%20New%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to replace order buttons with links
    function replaceOrderButtons() {
        const orderButtons = document.querySelectorAll("button[data-automation-id^='view-order-details-link-']");

        orderButtons.forEach(button => {
            const automationId = button.getAttribute("data-automation-id");
            const orderId = automationId.replace("view-order-details-link-", ""); // Extract order ID from automation ID

            if (orderId) {
                // Create a link element that opens the order page
                const link = document.createElement("a");
                link.href = `https://www.walmart.com/orders/${orderId}`;
                link.textContent = "Details ⮣"; // Change link text as needed

                // Style the link (optional)
                link.style.display = "inline-block"; // Display link inline like a button
                link.style.padding = "1px 4px"; // Add padding
                link.style.border = "1px solid #ccc"; // Add border
                link.style.borderRadius = "4px"; // Rounded corners
                link.style.textDecoration = "none"; // Remove underline
                link.style.color = "#0073e6"; // Link color
                link.style.backgroundColor = "#f0f0f0"; // Background color
                link.style.margin = "4px"; // Add some margin

                // Replace the original button with the link
                button.parentNode.replaceChild(link, button);
            }
        });
    }

    // Debounce function to limit how often replaceOrderButtons is called
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Run the function initially
    replaceOrderButtons();

    // Set up a MutationObserver with a debounced callback
    const observer = new MutationObserver(debounce(() => {
        replaceOrderButtons();
    }, 200)); // Adjust the delay if necessary

    // Start observing the body for added nodes
    observer.observe(document.body, { childList: true, subtree: true });
})();
