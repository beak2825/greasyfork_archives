// ==UserScript==
// @name         site nightcafe - Claim Button Clicker
// @namespace    http://greasyfork.org
// @version      2024.07.23.0340
// @description  Automatically clicks the claim button on NightCafe
// @author       hg42
// @license      MIT
// @match        https://creator.nightcafe.studio/*claim*
// @grant        none
// @run-at       document-end
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/500862/site%20nightcafe%20-%20Claim%20Button%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/500862/site%20nightcafe%20-%20Claim%20Button%20Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function closeWindowIfClaimed() {
        let claimed = $("span:has(:contains('claimed'))")
        if (claimed) {
            window.close();
            console.log("'claimed' found -> close window");
        }
    }

    function clickClaimButton() {
        let button = $("button:has(:contains('Claim'))")
            button.click();
            console.log("Claim button clicked!");
            setTimeout(closeWindowIfClaimed, 5000);
    }

    window.addEventListener('load', function() {
        setTimeout(clickClaimButton, 7000);
        setTimeout(closeWindowIfClaimed, 7000+5000);
    });
})();
