// ==UserScript==
// @name         No Blank Page on Print Labels
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Changes container to not need blank page after print.
// @author       Shaun Greiner
// @match        https://walmart.geekseller.com/package_slip_no_shipping.php*
// @match        https://walmart.geekseller.com/order-print.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geekseller.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458870/No%20Blank%20Page%20on%20Print%20Labels.user.js
// @updateURL https://update.greasyfork.org/scripts/458870/No%20Blank%20Page%20on%20Print%20Labels.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
    .container{
        page-break-after: avoid !important;
    }
    `)
})();