// ==UserScript==
// @name         WME City Remover w/ Wazewrap
// @description  Removes the primary city of the selected segment when Shift-T is pressed.  Does NOT check for anything else.  Make sure you want your primary city name gone before you apply this!
// @author       TxAgBQ
// @version      20230226.002
// @namespace    https://greasyfork.org/en/users/820296-txagbq/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @match        https://*.waze.com/*/editor*
// @match        https://*.waze.com/editor*
// @exclude      https://*.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/27023-jscolor/code/JSColor.js
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @connect      status.waze.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460813/WME%20City%20Remover%20w%20Wazewrap.user.js
// @updateURL https://update.greasyfork.org/scripts/460813/WME%20City%20Remover%20w%20Wazewrap.meta.js
// ==/UserScript==

(function() {
    'use strict';

new WazeWrap.Interface.Shortcut('customShortcut', 'Toggles Shortcut',
                                            'groupId', 'Group Title', "Shift+T", callback, null).add();
function callback() {
    // shortcut callback
        document.querySelector(".full-address-container .edit-button").click();
        console.log("Shift+T was pressed activating WME City Remover w/ Wazewrap Script")
        //document.querySelector(".in-label.toggle-empty wz-checkbox.empty-city").click();
        //setTimeout(function() {
            //document.querySelector(".action-buttons wz-button.save-button").click();
            //hold for debugging later  console.log("The apply key was simulated being pressed here");
        //}, 10); // Delay the execution of the function by 10 milliseconds
}







    function bootstrap(tries = 1) {
        if (W && W.map && WazeWrap.Ready) {
            log('Initializing...');
            init();
        } else {
            if (tries % 20 === 0) log('Bootstrap failed. Trying again...');
            setTimeout(() => bootstrap(++tries), 250);
        }
    }

    log('Bootstrap...');
    bootstrap();
})();