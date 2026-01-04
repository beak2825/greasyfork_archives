/* globals selectIdp */

// ==UserScript==
// @name         SelfService Tools
// @namespace    merkur.at
// @version      1.0.0
// @description  Funktionen die das Verhalten von Infoniqa verbessern (beispielweise AutoLogin)
// @author       Julian
// @license      MIT
// @match        https://hcm.merkur.net/hcm/common/samlDiscovery.do*
// @match        https://hcm.merkur.net/hcm/sp/selfserviceapp/start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=merkur.net
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://code.jquery.com/jquery-1.11.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/452105/SelfService%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/452105/SelfService%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log(window.location);

    console.log(window.location.search);
    console.log(window.location.pathname);

    const urlParams = new URLSearchParams(window.location.search);
    console.log()

    switch(window.location.pathname) {
            // Auto-Login
        case "/hcm/common/samlDiscovery.do": {
            if(urlParams.get("time")) {
                GM_setValue('time', true);
            }
            console.log("Versuche automatischen Login");
            selectIdp('default');
            break;
        }
        case "/hcm/sp/selfserviceapp/start": {
            if(GM_getValue("time")) {
                GM_setValue('time', false);
                window.location.href = "/hcm/function/TIME_SYSTEM_LINK";
            }
        }
    }
})();