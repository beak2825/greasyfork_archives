// ==UserScript==
// @name         Quora ADblock
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Skip
// @author       zenglu liu
// @match        https://www.quora.com/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/489965/Quora%20ADblock.user.js
// @updateURL https://update.greasyfork.org/scripts/489965/Quora%20ADblock.meta.js
// ==/UserScript==

(function() {
    //
    $("div.q-box[width='356']")[0].remove();
    GM_addStyle("#mainContent{width:60pc !important}");
    GM_addStyle(".dom_annotate_multifeed_home>div>div>div:not(.dom_annotate_multifeed_bundle_AnswersBundle){display:none !important}");


})();