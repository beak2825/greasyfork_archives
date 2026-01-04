// ==UserScript==
// @name         Auto SeedBonus Gift
// @version      1.69
// @namespace    Pushiiii
// @description  Automates gifting seedbonus on TorrentBD
// @match        https://www.torrentbd.com/torrents-details.php?id*
// @match        https://www.torrentbd.net/torrents-details.php?id*
// @match        https://www.torrentbd.me/torrents-details.php?id*
// @match        https://www.torrentbd.org/torrents-details.php?id*
// @license      MIT
// @icon         https://www.torrentbd.net/themes/material/static/favicon/favicon-32x32.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525219/Auto%20SeedBonus%20Gift.user.js
// @updateURL https://update.greasyfork.org/scripts/525219/Auto%20SeedBonus%20Gift.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var seedbonusAmount = 1000;

    function giftSeedBonus() {
        if (typeof giftSb === "function") {
            console.log(`Executing giftSb(${seedbonusAmount})`);
            giftSb(seedbonusAmount);
        } else {
            console.error("giftSb function not found!");
        }
    }

    giftSeedBonus();
})();
