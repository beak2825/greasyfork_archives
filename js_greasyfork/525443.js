// ==UserScript==
// @name         TBD Auto Rep, Thanks & Gift
// @version      1.69
// @namespace    
// @description  Automates adding reputation, thanking uploader, and gifting seedbonus on TorrentBD
// @match        https://www.torrentbd.com/torrents-details.php?id=*
// @match        https://www.torrentbd.net/torrents-details.php?id=*
// @match        https://www.torrentbd.me/torrents-details.php?id=*
// @match        https://www.torrentbd.org/torrents-details.php?id=*
// @icon         https://www.torrentbd.net/themes/material/static/favicon/favicon-32x32.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525443/TBD%20Auto%20Rep%2C%20Thanks%20%20Gift.user.js
// @updateURL https://update.greasyfork.org/scripts/525443/TBD%20Auto%20Rep%2C%20Thanks%20%20Gift.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var config = {
        clickDelay: 0,  
        seedbonusAmount: 1000 // Change to 50, 100, 200, 500, 1000 or 5000
    };

    function simulateClick(selector) {
        let element = document.querySelector(selector);
        if (element) {
            element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
            console.log(`Clicked: ${selector}`);
        } else {
            console.warn(`Element ${selector} not found!`);
        }
    }

    function giftSeedBonus() {
        if (typeof giftSb === "function") {
            console.log(`Executing giftSb(${config.seedbonusAmount})`);
            giftSb(config.seedbonusAmount);
        } else {
            console.error("giftSb function not found!");
        }
    }

    
    simulateClick("#thanks-button");
    simulateClick("#add-rep-button");
    giftSeedBonus();
})();
