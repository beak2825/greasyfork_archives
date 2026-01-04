// ==UserScript==
// @name         Farmrpg autofarm uwu
// @namespace    http://tampermonkey.net/
// @version      2024-02-02
// @description  Autofarm for farmrpg.com
// @author       1011001
// @match        https://farmrpg.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @grant        none
// @require      https://greasyfork.org/scripts/469666-farmrpg-helper/code/FarmRPG%20Helper.user.js
// @license GPL3
// @downloadURL https://update.greasyfork.org/scripts/486314/Farmrpg%20autofarm%20uwu.user.js
// @updateURL https://update.greasyfork.org/scripts/486314/Farmrpg%20autofarm%20uwu.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function clickActionsModalButtonIfExists() { // Busca y si encuentra apreta el boton "yes"... yes honey...
        const actionsModalButton = document.querySelector('.actions-modal-button');
        if (actionsModalButton) {
            actionsModalButton.click();
        }
    }

    const execute = async () => {
        const harvestAndPlant = $('.last-bought-button.svelte-rr924h');

        harvestAndPlant.click();
        await timeout(2000);
        await clickActionsModalButtonIfExists();
    };

    setInterval(execute, 9000);

})();