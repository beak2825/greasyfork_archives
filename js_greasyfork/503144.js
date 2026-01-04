// ==UserScript==
// @name         NYTimes 'More to Discover' remover
// @namespace    mister_name
// @version      0.0.1
// @description  Remove the content-obscuring "More to Discover" popover from the bottom of NYTimes.com articles
// @author       mister_name
// @match        *://www.nytimes.com/*
// @icon         https://www.iconsdb.com/icons/download/gray/barber-scissors-64.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503144/NYTimes%20%27More%20to%20Discover%27%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/503144/NYTimes%20%27More%20to%20Discover%27%20remover.meta.js
// ==/UserScript==

let intervalWait = 250;
(function() {
    'use strict';

    let bottomNagSel = "aside#subscriber-recirculation-bottom-sheet";
    let recheckCountdown = 30, removeCount = 0;
    const intervalId = setInterval(function () {
        const subscriberAnnoyanceSheet = document.querySelector(bottomNagSel);
        if (subscriberAnnoyanceSheet !== null) {
            subscriberAnnoyanceSheet.remove();
            if (removeCount++ > 3) {
                console.error(`Could not remove ${bottomNagSel} from document after ${removeCount} tries.`);
                clearInterval(intervalId);
            }
        } else if (recheckCountdown-- <= 0) {
            clearInterval(intervalId);
            console.log(`Removed ${subscriberAnnoyanceSheet} after 3 checks`);
        }
    }, intervalWait);
})();
