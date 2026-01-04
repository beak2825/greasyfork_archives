// ==UserScript==
// @name         WME UR Hotkeys
// @description  Adds hotkeys to go to UR-MP and URC-E
// @author       TxAgBQ
// @version      20230322.004
// @namespace    https://greasyfork.org/en/users/820296-txagbq/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @match        https://*.waze.com/*/editor*
// @match        https://*.waze.com/editor*
// @exclude      https://*.waze.com/user/editor*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462219/WME%20UR%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/462219/WME%20UR%20Hotkeys.meta.js
// ==/UserScript==

/* global W */

(function() {
    'use strict';

    // F2 for UR-MP
    document.addEventListener('keydown', (event) => {
        if (event.key === 'F2') {
            if (
                ($('wz-navigation-item[data-for="userscript_tab"]') .length > 0)
                && (Boolean($('wz-navigation-item[data-for="userscript_tab"]')[0].selected) === false)
            ) {
              $('wz-navigation-item[data-for="userscript_tab"]').click()
            }
            $('a[href="#sidepanel-urt"]').click()
        }
        // F4 for URC-E
        if (event.key === 'F4') {
            if (
                ($('wz-navigation-item[data-for="userscript_tab"]') .length > 0)
                && (Boolean($('wz-navigation-item[data-for="userscript_tab"]')[0].selected) === false)
            ) {
              $('wz-navigation-item[data-for="userscript_tab"]').click()
            }
            $('span[title="URC-E"]').click()
        }
    });
})();
