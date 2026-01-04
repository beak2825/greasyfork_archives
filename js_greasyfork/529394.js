// ==UserScript==
// @name         Time.is Ad-Removal
// @namespace    tisadremoval
// @version      0.0.1
// @description  remove annoying ad and banner
// @author       Rizuwan
// @match        https://time.is/
// @require      http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529394/Timeis%20Ad-Removal.user.js
// @updateURL https://update.greasyfork.org/scripts/529394/Timeis%20Ad-Removal.meta.js
// ==/UserScript==

(function() {
    'use strict';


    setInterval(async function() {
        $(".fs-sticky-footer, iframe").remove()
    }, 100)
    // Your code here...
})();