// ==UserScript==
// @name         deview
// @namespace    dragonboy
// @version      0.3
// @description  deview_auto submit 
// @author       dragonboy
// @match        *://deview.kr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390663/deview.user.js
// @updateURL https://update.greasyfork.org/scripts/390663/deview.meta.js
// ==/UserScript==

(function() {
    console.log("auto submit");

    $( "#name" ).val("정한룡");
    $( "#email" ).val("hr102601@gmail.com");
    $( "#job" ).val("NAVER");
    $( "#privacyAgree" ).click();
    $("#submit").click()

})();