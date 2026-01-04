// ==UserScript==
// @name         Free Crypto Auto Clicker
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Auto clicker for free crypto websites
// @author       ME AND USE MY REFERALS THANKS
// @match        https://freematic.com/*
// @match        https://freepancake.com/*
// @match        https://freeshibainu.com/*
// @match        https://freebitcoin.io/*
// @match        https://freecardano.com/*
// @match        https://freesteam.io/*
// @match        https://freetether.com/*
// @match        https://freeusdcoin.com/free*
// @match        https://coinfaucet.io/*
// @match        https://freenem.com/*
// @match        https://freebinancecoin.com/*
// @match        https://freeethereum.com/*
// @match        https://free-tron.com/*
// @match        https://freedash.io/*
// @match        https://freechainlink.io/*
// @match        https://freeneo.io/*
// @match        https://free-ltc.com/free*
// @match        https://free-doge.com/*
// @match        https://freecryptom.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466299/Free%20Crypto%20Auto%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/466299/Free%20Crypto%20Auto%20Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickRollButton() {
        // Check if the roll button is visible
        if (document.querySelector("div[class='roll-wrapper']").style.display !== "none") {
            // Click the roll button
            document.querySelector("button[class='main-button-2 roll-button bg-2']").click();
            console.log("Roll button clicked");
        } else {
            console.log("Roll button not visible");
        }
    }

    function refreshPage() {
        console.log("Refreshing page...");
        location.reload();
    }

    // Check for the roll button every minute
    setInterval(function() {
        console.log("Checking for roll button...");
        clickRollButton();
    }, 60*1000); // 1 minute interval

    // Refresh the page every 30 minutes
    setInterval(function() {
        console.log("Refreshing page...");
        location.reload();
    }, 30*60*1000); // 30 minute interval

    // Refresh the page and click the roll button when the timer reaches 0 or negative value
    setInterval(function() {
        let timerContainer = document.querySelector("div[class='timeout-container']");
        if (timerContainer) {
            let timer = timerContainer.querySelector("div[class='seconds'] > div[class='digits']").textContent;
            if (timer === "-1" || timer === "0") {
                console.log("Timer reached 0 or negative value");
                refreshPage();
                setTimeout(function() {
                    clickRollButton();
                }, 30000); // Wait 30 seconds before clicking the roll button
            }
        } else {
            console.log("Timer container not found");
            refreshPage();
        }
    }, 1000); // 1 second interval

})();