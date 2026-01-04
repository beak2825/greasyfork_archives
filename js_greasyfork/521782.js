// ==UserScript==
// @name         Burglary Highlighter
// @namespace    http://tampermonkey.net/
// @version      2024-12-25-2
// @description  Highlights burgarly locations that are good based on given array list below
// @author       olesien
// @match        https://www.torn.com/loader.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521782/Burglary%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/521782/Burglary%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const goodCrimes = ["Foundry", "Fertilizer Plant", "Cottage", "Beach Hut", "Lake House", "Truckyard", "Mobile Home", "Suburban Home", "Printing Works", "Funeral Directors", "Dentists' Office", "Self Storage Facility", "Post Office", "Market"];

    const run = (element) => {
        const check = () => {
            const items = element.querySelectorAll(".virtual-item");
            Array.from(items)?.forEach(async (item) => {
                console.log(item);
                const itemId = ".crimeOptionSection___hslpu";
                const name = item.querySelector(itemId);
                console.log(name);
                console.log(name.innerText);
                const crimeOption = item.querySelector(".crime-option");
                if (name && goodCrimes.find(crime => name.innerText.includes(crime))) {
                    console.log("Setting color");
                    crimeOption.style.backgroundColor = "green";
                } else {
                crimeOption.style.backgroundColor = "inherit";
                }
            });
        }
        const observer = new MutationObserver((_, observer) => {
            check();
        });
        observer.observe(element, { subtree: true, childList: true });
        check();
    }

    const observer = new MutationObserver((_, observer) => {
        //Is donate (this is default as well)
        const element = document.querySelector(".burglary-root .virtualList___noLef"); //This is the element that has all items
        if (element) {
            console.log("Checking");
            run(element);
            observer.disconnect();
        }
    });

    observer.observe(document, { subtree: true, childList: true });
})();