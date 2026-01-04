// ==UserScript==
// @name          site aliexpress - Auto Collect Coins
// @namespace     http://greasyfork.org
// @version       2024.07.23.0340
// @license       MIT
// @description   Automatically presses the "Collect coins" button on AliExpress coin page
// @author        hg42
// @match         https://*.aliexpress.com/p/coin-*
// @grant         none
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/500871/site%20aliexpress%20-%20Auto%20Collect%20Coins.user.js
// @updateURL https://update.greasyfork.org/scripts/500871/site%20aliexpress%20-%20Auto%20Collect%20Coins.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function closeWindowIfEarnMoreCoins() {
        let buttons = document.querySelectorAll('div');
        //console.log("earn?", buttons)
        for (const button of buttons) {
            if (button.innerHTML.trim() == "Earn more coins") {
				        //console.log("earn:", button)
                window.close();
                console.log("Earn more coins button found -> close window");
                break;
            }
        }
    }

    function clickCollectCoinsButton() {
        let buttons = document.querySelectorAll('div');
        //console.log("collect?", buttons)
        for (const button of buttons) {
            if (button.innerHTML.trim() == "Collect") {
                //console.log("collect:", button)
                button.click();
                console.log("Collect coins button clicked");
                setTimeout(closeWindowIfEarnMoreCoins, 5000);
                break;
            }
        }
    }

    window.addEventListener('load', function() {
        setTimeout(clickCollectCoinsButton, 7000);
        setTimeout(closeWindowIfEarnMoreCoins, 7000+5000);
    });
})();