// ==UserScript==
// @name         Mass scavening tool
// @namespace    http://tampermonkey.net/
// @version      2024-02-06
// @description  tribal wars auto mass scavening tool
// @author       LZ
// @match        https://greasyfork.org/en
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @match        https://*/game.php?*screen=place&mode=scavenge_mass*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486856/Mass%20scavening%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/486856/Mass%20scavening%20tool.meta.js
// ==/UserScript==

(function() {
// Set premium button enabled to false
var premiumBtnEnabled = false;

    // Load external script
    $.getScript('https://shinko-to-kuma.com/scripts/massScavenge.js', function() {
        // After script is loaded, wait for 3 seconds
        setTimeout(function() {
            // Submit element with id "sendMass"
            document.getElementById('sendMass').click();

            // Wait for 8 seconds
            setTimeout(function() {
                // Submit all elements with id "sendMass" and class "btnSophie"
                var elements = document.querySelectorAll('.btnSophie#sendMass');
                var index = 0;
                var interval = setInterval(function() {
                    if (index < elements.length) {
                        elements[index].click();
                        index++;
                    } else {
                        clearInterval(interval);
                    }
                }, 1000); // Pause 1 second between clicks

                // Wait for 15 minutes
                setTimeout(function() {
                    // Reload the page
                    location.reload();
                }, 900000); // reload period ms
            }, 8000);
        }, 3000);
    });

})();