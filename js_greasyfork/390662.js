// ==UserScript==
// @name         deview_internal
// @namespace    dragonboy
// @version      0.3
// @description  deview_auto submit 
// @author       dragonboy
// @match        *://deview-internal.navercorp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390662/deview_internal.user.js
// @updateURL https://update.greasyfork.org/scripts/390662/deview_internal.meta.js
// ==/UserScript==

(function() {
    console.log("auto submit");
    $( "#privacyAgree" ).click();
    $("#submit").click()

})();