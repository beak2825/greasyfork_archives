// ==UserScript==
// @name         Hide Models for Attacks
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide Models on attack page
// @author       Jox[1714547]
// @match        https://www.torn.com/loader.php?sid=attack*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/448505/Hide%20Models%20for%20Attacks.user.js
// @updateURL https://update.greasyfork.org/scripts/448505/Hide%20Models%20for%20Attacks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle ( `

    .modelLayers___MO2bn {
        visibility: hidden !important;
        display: none !important;
    }

    ` );
})();