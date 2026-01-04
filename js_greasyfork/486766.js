// ==UserScript==
// @name         Minting tool
// @namespace    http://tampermonkey.net/
// @version      2024-02-06
// @description  tribal wars auto minting tool
// @author       LZ
// @match        https://greasyfork.org/en
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @match        https://*/game.php?*screen=snob*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486766/Minting%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/486766/Minting%20tool.meta.js
// ==/UserScript==

(function() {
    $.getScript('https://twscripts.dev/scripts/mintHelper.js', function() {
        // Step 2: Wait for 30 seconds
        setTimeout(function() {
            // Step 3: Find the button element with the text "Razit" and click it
            var buttons = document.querySelectorAll('input[type="submit"]');
            for (var i = 0; i < buttons.length; i++) {
                if (buttons[i].value === "Razit") {
                    buttons[i].click();
                    break; // Stop looping once we find and click the button
                }
            }

            // Step 4: Wait for an additional 2 seconds
            setTimeout(function() {
                // Step 5: Simulate refreshing the page using location.reload()
                location.reload();
            }, 2000);
        }, 30000); // 30 seconds in milliseconds
    });

})();