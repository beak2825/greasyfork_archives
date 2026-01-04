// ==UserScript==
// @name         Chat clarification
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  readbility
// @author       Laïn
// @match        https://www.dreadcast.net/Main*
// @icon         https://www.dreadcast.net/favicon.ico
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/539983/Chat%20clarification.user.js
// @updateURL https://update.greasyfork.org/scripts/539983/Chat%20clarification.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // All your custom CSS rules are placed inside the backticks (`).
    // The '!important' flag is used to ensure these styles override the site's default styles.
    const myCss = `
        /* Rule 1: Sets color for .couleur5 to white */
        .couleur5 {
            color: #fff !important;
        }

        /* Rule 2: Sets color and font-size for .white */
        .white {
            color: #fff !important;
            font-size: 14px !important;
        }

        /* Rule 3: Styles the chat info zone */
        #zone_chat .zone_infos {
            color: #58dcf9 !important;
            text-transform: none !important;
            font-size: 14px !important;
            line-height: 1.2rem !important;
        }
    `;

    // This function injects the CSS into the page.
    GM_addStyle(myCss);

})();