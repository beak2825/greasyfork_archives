// ==UserScript==
// @name         NO Proton Mail promotions
// @namespace    http://tampermonkey.net/
// @version      0.22
// @description  Remove annoying Proton Mail promotional buttons
// @author       cosmicRice
// @match        https://mail.proton.me/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-idle
 // @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/499211/NO%20Proton%20Mail%20promotions.user.js
// @updateURL https://update.greasyfork.org/scripts/499211/NO%20Proton%20Mail%20promotions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const removePromo = () => {
        const a = document.querySelector('div.flex.bg-promotion.relative');
        if (!a) { return false; }
        a.remove();
        return true;
    }

    const removeUpgrade = () => {
        const a = document.querySelector('li.topnav-listItem.topnav-listItem--noCollapse');
        if (!a) { return false; }
        a.remove();
        return true;
    }

    let giveUpCounter = 0;
    let isPromoRemoved = false;
    let isUpgradeRemoved = false;

    const interval = setInterval(() => {
        isPromoRemoved = isPromoRemoved || removePromo();
        isUpgradeRemoved = isUpgradeRemoved || removeUpgrade();

        if ((isPromoRemoved && isUpgradeRemoved) || giveUpCounter > 30) {
            clearInterval(interval);
        }

        giveUpCounter++;
    }, 500);
})();