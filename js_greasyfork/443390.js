// ==UserScript==
// @name         case auto-refresher
// @namespace    Eric Stanard
// @version      1.2
// @description  Auto-refresh function for the specified page
// @author       Eric Stanard astrobase9.net
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443390/case%20auto-refresher.user.js
// @updateURL https://update.greasyfork.org/scripts/443390/case%20auto-refresher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(autorefresh, 600000);

    function autorefresh() {
        const buttonBar = document.querySelector('force-list-view-manager-button-bar');
        if (buttonBar) {
            const buttons = buttonBar.getElementsByTagName('button');
            if (buttons.length > 0) {
                buttons[0].click();
            }
        }
        setTimeout(autorefresh, 600000);
        console.log('refreshed');
    }

    autorefresh();
})();