// ==UserScript==
// @name         UPS WMD Tweaks
// @version      2025-03-19
// @description  ups myChoice premium gonna suck ya hog
// @author       You
// @match        https://www.ups.com/wmd/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ups.com
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1447862
// @downloadURL https://update.greasyfork.org/scripts/530309/UPS%20WMD%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/530309/UPS%20WMD%20Tweaks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function tweakWmd() {
        window.getPollingInterval = (_proxCode) => {
            // "premium" services get 180 second polling, while "normal" get 300.
            // i want 30.
            return "30000";
        };

        const getWMDInfo_impl = window.getWMDInfo;
        window.getWMDInfo = (_incShipDetFlag, _loadEdwCdw) => {
            return getWMDInfo_impl(true, true);
        };
    }

    if (typeof(getWMDInfo) == "undefined") {
        document.querySelector('script[src*="webwmd/wmd"]').addEventListener("load", (_evt) => tweakWmd());
    } else {
        tweakWmd();
    }
})();