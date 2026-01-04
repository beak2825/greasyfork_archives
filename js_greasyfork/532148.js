// ==UserScript==
// @name        Calculadora Atacadao
// @license          Creative Commons Attribution Non Commercial Share Alike 4.0 International (CC BY-NC-SA 4.0)
// @namespace   Violentmonkey Scripts
// @include     https://www.atacadao.com.br/*
// @grant       none
// @version     1.0
// @author      Gabriela Perini
// @description Pequenina calculadora por peso para o site Atacadao
// @downloadURL https://update.greasyfork.org/scripts/532148/Calculadora%20Atacadao.user.js
// @updateURL https://update.greasyfork.org/scripts/532148/Calculadora%20Atacadao.meta.js
// ==/UserScript==
  (function () {
    // Wait for the DOM to load
    document.addEventListener("DOMContentLoaded", (function () {
        console.log("DOM fully loaded. Setting up MutationObserver...");

        // Set up a MutationObserver to watch for changes in the DOM
        const observer = new MutationObserver(function (mutations) {
            console.log("MutationObserver callback triggered");

            // Temporarily disconnect the observer to prevent infinite loops
            observer.disconnect();

            // Find all product cards
            const productCards = document.querySelectorAll('[data-product-card-content="true"]');

            // If product cards are found, process them
            if (productCards.length > 0) {
                productCards.forEach(function (card) {
                    // Check if the log content has already been added to this card
                    if (card.querySelector(".product-log")) {
                        return; // Skip if already processed
                      console.log("return");
                    }

                    // Extract the title
                    const titleElement = card.querySelector("h3");
                    if (titleElement) {
                        const title = titleElement.textContent.trim();

                        // Extract the quantity and unit from the title
                        const quantityMatch = title.replace(/[^\d,]/g, "");
                        const quantity = parseFloat((quantityMatch ? quantityMatch : "N/A").replace(",", ".")); // Convert to decimal
                        const unit = title.replace(/^\D+/g, "").replace(/[^a-z]/gi, "");

                        // Extract the price elements
                      if (card.querySelector(".flex.items-center.gap-1"))
                         {
                        const priceElementSingle = card.querySelector(".text-sm.text-neutral-500.font-bold");
                        const priceElementBulk = card.querySelector(".flex.items-center.flex-wrap");
                        const priceSingle = parseFloat(
                            (priceElementSingle ? priceElementSingle.textContent.trim(): "N/A")
                                .replace(/[^\d,]/g, "")
                                .replace(",", ".")
                                                      )
                        const priceBulk = parseFloat(
                            (priceElementBulk ? priceElementBulk.textContent.trim(): "N/A")
                                .replace(/[^\d,]/g, "")
                                .replace(",", ".")
                                                    )
                        console.log("caso1");




                         const logMessage = `Varejo ${(priceSingle/quantity).toFixed(2)} por ${unit} Atacado ${(priceBulk/quantity).toFixed(2)} por ${unit}`

                                                 // Log to the console
                        console.log(logMessage);

                        // Create a container for the log content
                        const logContainer = document.createElement("div");
                        logContainer.className = "product-log";
                        logContainer.style.marginTop = "10px";
                        logContainer.style.padding = "5px";
                        logContainer.style.backgroundColor = "#f0f0f0";
                        logContainer.style.borderRadius = "4px";
                        logContainer.style.fontSize = "12px";
                        logContainer.style.color = "#333";
                        logContainer.textContent = logMessage;

                        // Append the log container to the product card
                        card.appendChild(logContainer);
                         } else {
                        const priceElementSingle =card.querySelector(".flex.flex-col.gap-1");
                        const priceSingle = parseFloat(
                            (priceElementSingle ? priceElementSingle.textContent.trim(): "N/A")
                                .replace(/[^\d,]/g, "")
                                .replace(",", ".")
                                                      )
                        const logMessage = `Varejo ${(priceSingle/quantity).toFixed(2)} por ${unit}`
                                              // Log to the console
                        console.log(logMessage);

                        // Create a container for the log content
                        const logContainer = document.createElement("div");
                        logContainer.className = "product-log";
                        logContainer.style.marginTop = "10px";
                        logContainer.style.padding = "5px";
                        logContainer.style.backgroundColor = "#f0f0f0";
                        logContainer.style.borderRadius = "4px";
                        logContainer.style.fontSize = "12px";
                        logContainer.style.color = "#333";
                        logContainer.textContent = logMessage;

                        // Append the log container to the product card
                        card.appendChild(logContainer);
                      }


                        ;

                        // Create a log message


;


                    }
                });
            } else {
                console.log("No product cards found yet.");
            }

            // Reconnect the observer after processing
            observer.observe(document.body, { childList: true, subtree: true });
        });

        // Start observing the document body for changes
        console.log("Starting MutationObserver...");
        observer.observe(document.body, { childList: true, subtree: true });
    })());
})();