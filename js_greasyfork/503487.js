// ==UserScript==
// @name         Pixiv Show Request Price
// @author       MahdeenSky
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  For each artwork on Pixiv, show the request price if available and sort artworks by price.
// @match        https://www.pixiv.net/request/creators/works/illust
// @match        https://www.pixiv.net/request/creators/works/illust?*
// @match        https://www.pixiv.net/bookmark_new_illust.php
// @match        https://www.pixiv.net/discovery
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/503487/Pixiv%20Show%20Request%20Price.user.js
// @updateURL https://update.greasyfork.org/scripts/503487/Pixiv%20Show%20Request%20Price.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const button = document.createElement("button");
    button.innerText = "Show Request Price (0/0)";
    button.style.position = "fixed";
    button.style.bottom = "10px";
    button.style.left = "10px";
    button.style.zIndex = "9999";
    button.style.padding = "10px";
    button.style.backgroundColor = "blue";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    document.body.appendChild(button);

    const sortButton = document.createElement("button");
    sortButton.innerText = "Sort by Price";
    sortButton.style.position = "fixed";
    sortButton.style.bottom = "50px";
    sortButton.style.left = "10px";
    sortButton.style.zIndex = "9999";
    sortButton.style.padding = "10px";
    sortButton.style.backgroundColor = "green";
    sortButton.style.color = "white";
    sortButton.style.border = "none";
    sortButton.style.borderRadius = "5px";
    sortButton.style.cursor = "pointer";
    document.body.appendChild(sortButton);

    const MAX_PARALLEL_IFRAMES = 2;
    let activeIframes = 0;
    let globalIndex = 0;
    let artistUrls = [];
    let artworks = [];
    let updatedCount = 0;

    function updateButtonText() {
        button.innerText = `Show Request Price (${updatedCount}/${artworks.length})`;
    }

    function waitForRequestPriceElement(wrapperDiv, iframe, artistUrl, artwork) {
        iframe.addEventListener('load', () => {
            let requestPriceElement = iframe.contentDocument.querySelector("p.sc-a5e65548-7");
            if (requestPriceElement) {
                const requestPrice = requestPriceElement.innerText;
                console.log(
                    "######################## " +
                    artistUrl +
                    " ##############" +
                    requestPrice
                );
    
                const priceElement = document.createElement("div");
                priceElement.classList.add("request-price");
                priceElement.innerText = `Request Price: ${requestPrice}`;
                priceElement.style.backgroundColor = "#f0f0f0";
                priceElement.style.color = "#333";
                priceElement.style.padding = "10px";
                priceElement.style.marginBottom = "10px";
                priceElement.style.border = "1px solid #ccc";
                priceElement.style.borderRadius = "5px";
                priceElement.style.fontSize = "14px";
                priceElement.style.fontWeight = "bold";
                priceElement.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
    
                priceElement.style.opacity = "0";
                priceElement.style.transition = "opacity 0.5s ease-in-out";
    
                artwork.insertBefore(priceElement, artwork.firstChild);
    
                requestAnimationFrame(() => {
                    priceElement.style.opacity = "1";
                });
    
                updatedCount++;
                updateButtonText();
            } else {
                console.log("Request price element not found, skipping...");
            }

            activeIframes--;
            console.log("Active iframes after decrement: " + activeIframes);
            processArtist();

            // reload the iframe then remove the wrapper div
            iframe.src = "about:blank";
            wrapperDiv.innerHTML = "<iframe style='display: none;'></iframe>";
            setTimeout(() => {
                wrapperDiv.remove();
            }, 1000);
        });
    }

    function processArtist() {
        if (globalIndex >= artistUrls.length) {
            console.log("All artists processed");
            return; // All artists processed
        }

        if (activeIframes >= MAX_PARALLEL_IFRAMES) {
            console.log("Max parallel iframes reached, retrying...");
            setTimeout(processArtist, 100); // Retry after 100ms
            return;
        }

        activeIframes++;
        console.log("Processing " + artistUrls[globalIndex]);
        const artistUrl = artistUrls[globalIndex];
        const artwork = artworks[globalIndex];

        const wrapperDiv = document.createElement("div");
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";

        iframe.src = artistUrl + "/request";
        console.log("Visiting " + iframe.src);
        globalIndex++;

        wrapperDiv.appendChild(iframe);
        document.body.appendChild(wrapperDiv);

        waitForRequestPriceElement(wrapperDiv, iframe, artistUrl, artwork);
    }

    function scrapeArtworks() {
        // do a case by case check for different kind of css selectors for artworks
        const selectors = ["li.PKpFw", "li.kFAPOq"];
        let selector = null;
        if (document.querySelector(selectors[0])) {
            selector = selectors[0];
        } else if (document.querySelector(selectors[1])) {
            selector = selectors[1];
        } else {
            console.error("No artworks found");
            return { artistUrls: [], artworks: [] };
        }

        const artworks = document.querySelectorAll(selector);
        const artistUrls = [];

        artworks.forEach((artwork) => {
            // Check if the artwork already has the price element with the class "request-price"
            const existingPriceElement = artwork.querySelector('.request-price');
            if (existingPriceElement) {
                return; // Skip this artwork if it already has the price
            }
            let selector = "a.sc-1rx6dmq-2";
            if (document.querySelector("a.pPtWa")) {
                selector = "a.pPtWa";
            }

            const artistLink = artwork.querySelector(selector);
            const artistUrl = artistLink.href;

            artistUrls.push(artistUrl);
        });

        return { artistUrls, artworks };
    }

    function getPrices() {
        let scrapedData = scrapeArtworks();
        artistUrls = scrapedData.artistUrls;
        artworks = scrapedData.artworks;

        updateButtonText(); // Update button text with initial counts

        // Start processing up to MAX_PARALLEL_IFRAMES artists initially
        for (let i = 0; i < MAX_PARALLEL_IFRAMES; i++) {
            setTimeout(processArtist, 300 * i);
        }
    }

    function sortArtworksByPrice() {
        const artworksContainer = document.querySelector("ul.sc-e6de33c8-0");
        const artworksArray = Array.from(document.querySelectorAll("li.sc-9111aad9-0"));

        const sortedArtworks = artworksArray.sort((a, b) => {
            const priceA = parseFloat(a.querySelector(".request-price").innerText.replace(/[^0-9.-]+/g, ""));
            const priceB = parseFloat(b.querySelector(".request-price").innerText.replace(/[^0-9.-]+/g, ""));
            return priceA - priceB;
        });

        sortedArtworks.forEach((artwork) => {
            artworksContainer.appendChild(artwork);
        });
    }

    button.addEventListener("click", getPrices);
    sortButton.addEventListener("click", sortArtworksByPrice);
})();