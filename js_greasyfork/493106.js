// ==UserScript==
// @name         Hentai + Corn AdLinks Private Bypasser
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Shake Your Dick Hard!!!!
// @author       Darkx
// @match        https://infinityskull.com/*
// @match        https://viewmyknowledge.com/*
// @match        https://iisfvirtual.in/*
// @match        https://funkeypagali.com/*
// @match        https://wikifilmia.com/*
// @match        https://careersides.com/*
// @match        https://subgiks.com/*
// @match        https://nayisahara.com/*
// @match        https://haryanakaushalrojgarnigam.com/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=careersides.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493106/Hentai%20%2B%20Corn%20AdLinks%20Private%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/493106/Hentai%20%2B%20Corn%20AdLinks%20Private%20Bypasser.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function clickButton(selector) {
        try {
            let buttonElement = document.querySelector(selector);
            if (buttonElement) {
                buttonElement.click();
                console.log("Clicked button with selector: " + selector);
            } else {
                console.log("Button element not found with selector: " + selector);
            }
        } catch (err) {
            console.error("Error clicking button with selector: " + selector + ". Error: " + err);
        }
    }

    // Get current URL
    var currentURL = window.location.href;

    // Define the @match URLs in a 2D array
    const matchURLs = [
        "https://viewmyknowledge.com/",
        "https://infinityskull.com/",
        "https://iisfvirtual.in/",
        "https://funkeypagali.com/",
        "https://wikifilmia.com/",
        "https://careersides.com/",
        "https://haryanakaushalrojgarnigam.com/",
        "https://subgiks.com/",
        "https://nayisahara.com/"

    ];

    // Define the @match domains
    const matchDomains = [
        "viewmyknowledge.com",
        "infinityskull.com",
        "iisfvirtual.in",
        "funkeypagali.com",
        "wikifilmia.com",
        "careersides.com",
        "haryanakaushalrojgarnigam.com",
        "subgiks.com",
        "nayisahara.com"
    ];

    // Get current domain
    var currentDomain = window.location.hostname;
    var currentUrl = window.location.href;

    // Check if the current domain matches any @match domain
    if (matchDomains.includes(currentDomain)) {
        // Define buttons to click
        let btnsToClick = ["#tp98", "#btn6", "#btn6 > button"];

        // Perform click actions for each button
        btnsToClick.forEach(function(selector) {
            clickButton(selector);
        });

        //document.querySelector("#wpsafe-link > a")

        if (currentDomain.includes(matchDomains[6]) || currentDomain.includes(matchDomains[7])) {
            if (currentUrl.endsWith(".com")) {
                try {
                    setTimeout(() => wpsafehuman() , 10000);
                }
                catch {
                    console.log("Err");
                }
            }

            else {
                try {
                    try {wpsafehuman()}
                    catch {}
                    try {document.querySelector("#wpsafe-link > a").click()}
                    catch{}
                }

                catch {
                    console.log("Error")
                }
            }
        }
    }

})();