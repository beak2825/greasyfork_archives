// ==UserScript==
// @name         IM2.0 Price Difference
// @namespace    http://tampermonkey.net/
// @version      2024-11-23.01
// @description  Shows the price increase in IM2.0 listings
// @author       LePluB
// @match        https://www.torn.com/page.php?sid=ItemMarket
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516720/IM20%20Price%20Difference.user.js
// @updateURL https://update.greasyfork.org/scripts/516720/IM20%20Price%20Difference.meta.js
// ==/UserScript==

// light, dark
const BG_COLORS = ["lime", "green"]
const FG_COLORS = ["black", "white"]
const obsOptions = { attributes: false, childList: true, subtree: true};
let observing = false;
let isDarkMode = false;


const callback = (mutationList, observer) => {

    stopTracking();
    getListings();
    startTracking();
}

const observer = new MutationObserver(callback);

function startTracking() {

    const targetObsNode = document.querySelector("ul[class^='itemList']");

    if (targetObsNode === null) {
        observing = false
    }

    if ( observing === false) {
        if (targetObsNode != null) {
            console.log("observing...");
            observer.observe(targetObsNode, obsOptions);
            observing = true;
        } else {
            console.log("Waiting...")

        }
    }
}

function stopTracking() {

    if (observer) {
        observer.disconnect();
        observing = false
        console.log("stopped observing");
    }
}

function Listing(node) {

    this.rawText = node.innerText.split("\n");

    this.vendor = this.rawText[0];
    this.price = parseInt(node.querySelector("div[class^='price']").innerText.replaceAll(",", "").replace(/\$(\d+)\n*.*/, "$1"));
    this.qty = parseInt(node.querySelector("div[class^='available']").innerText.split(" ")[0].replaceAll(",",""));

}

function updateListing(node, cheapest, total) {

    let current_price = node.querySelector("div[class^='price']");

    // invalid entry
    if (current_price === null) {
        return
    }

    //cleanListing(node);
    let nodeContents = `${cheapest}%`;
    let percent_node = current_price.querySelector("p.lp-listing-price");
    const bgColor = isDarkMode == false ? BG_COLORS[0] : BG_COLORS[1];
    const fgColor = isDarkMode == false ? FG_COLORS[0] : FG_COLORS[1];
    // Update the price instead of adding new nodes
    if ( percent_node ) {
        percent_node.innerHTML = nodeContents;
    } else {
        current_price.insertAdjacentHTML('beforeend', `<div class="lp-listing-price" style="background-color: ${bgColor};border: 2px ${bgColor} solid;border-radius: 999px;padding: 1px;font-weight: bold;color:${fgColor}">${nodeContents}</div>`);
    }

    let current_qty = node.querySelector("div[class^='available']");

    // invalid entry
    if (current_qty === null) {
        return
    }

    nodeContents = `${total}$`;
    current_qty.style.flexDirection = "column"
    current_qty.style.justifyContent = "inherit"
    current_qty.insertAdjacentHTML('beforeend', `<div class="lp-listing-price">(${nodeContents})</div>`);


}

function cleanListing(listing) {

    // Removes the custom percent node from a given listing
    const customPrice = listing.querySelectorAll("div.lp-listing-price");
    customPrice.forEach((x) => {
        x.remove();
    });
}


function getListings() {

    const rawListings = document.querySelector("li[class^='sellerListWrapper']")
    if (!rawListings) {
        console.log("closed probably");
        return
    }


    console.log("CB-------------------------------");

    let cheapest = null;
    for (const rawListing of rawListings.childNodes[0].childNodes) {
        cleanListing(rawListing);
        if (cheapest === null) {
            cheapest = new Listing(rawListing);
            continue
        }
        let current = new Listing(rawListing);
        let increase = ((current.price - cheapest.price) / cheapest.price) * 100
        let total = current.price * current.qty
        total = Intl.NumberFormat("en", {notation: "compact"}).format(total);
        updateListing(rawListing, increase.toFixed(1), total)
    }
}


(function() {
    'use strict';

    const watcherInterval = setInterval(function() {

        let darkModeNode = document.querySelector("body.dark-mode");
        if (darkModeNode === null) {
            isDarkMode = false;
        } else {
            isDarkMode = true;
        }
        startTracking();

    }, 125);
})();