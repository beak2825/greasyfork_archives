// ==UserScript==
// @name        DLCM Redeem Button Transformer
// @namespace   Violentmonkey Scripts
// @match       *://dlcm.app/*
// @grant       none
// @version     1.0
// @author      Raman Sinclair
// @description 17/11/2024, 20:36:51
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/539547/DLCM%20Redeem%20Button%20Transformer.user.js
// @updateURL https://update.greasyfork.org/scripts/539547/DLCM%20Redeem%20Button%20Transformer.meta.js
// ==/UserScript==

// prevent JQuery conflicts, see http://wiki.greasespot.net/@grant
this.$ = this.jQuery = jQuery.noConflict(true);

// Wait for the DOM to be fully loaded
$(document).ready(function () {
    // Function to click the button when found
    function clickRedeemButton() {
        var redeemButton = $("button:contains('Generate Bandcamp Code')");
        if (redeemButton.length) {
            console.log("Button found:", redeemButton);
            redeemButton[0].click(); // Trigger the button click
        }

        var redeemBandcampLink = $("a:contains('Redeem')");
        if (redeemBandcampLink.length) {
            console.log("Link found:", redeemBandcampLink);
            redeemBandcampLink[0].click(); // Trigger the button click
            observer.disconnect(); // Stop observing once the button is clicked
        }
    }

    // Set up a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(() => {
        clickRedeemButton();
    });

    // Observe the entire document for child node additions
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Try clicking immediately in case the button is already loaded
    clickRedeemButton();
});