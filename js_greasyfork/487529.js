// ==UserScript==
// @name         DF Poo Craft
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a Poo-craft tier to Mastercrafted items in Dead Frontier
// @author       Runonstof
// @match        *fairview.deadfrontier.com/onlinezombiemmo/index.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deadfrontier.com
// @license      MIT
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/487529/DF%20Poo%20Craft.user.js
// @updateURL https://update.greasyfork.org/scripts/487529/DF%20Poo%20Craft.meta.js
// ==/UserScript==

(async function () {
    await new Promise(resolve => {
        let checkMcDataInterval;

        function checkMcData() {
            if (unsafeWindow.mcData) {
                clearInterval(checkMcDataInterval);
                resolve();
            }
        }

        checkMcDataInterval = setInterval(checkMcData, 100);
    });

    unsafeWindow.mcData['001'] = ['#964B00', 'Poo', 'PC'];
    unsafeWindow.mcData['010'] = ['#964B00', 'Poo', 'PC'];
    unsafeWindow.mcData['100'] = ['#964B00', 'Poo', 'PC'];
    unsafeWindow.mcData['0100'] = ['#964B00', 'Poo', 'PC'];
    unsafeWindow.mcData['0001'] = ['#964B00', 'Poo', 'PC'];
})();