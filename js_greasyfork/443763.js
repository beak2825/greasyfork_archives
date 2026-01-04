// ==UserScript==
// @name         Endorse 5cc 
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Endorse Erepublik article with 5cc!
// @license      MIT
// @author       Soulshiv3r
// @match        https://www.erepublik.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/443763/Endorse%205cc.user.js
// @updateURL https://update.greasyfork.org/scripts/443763/Endorse%205cc.meta.js
// ==/UserScript==

(function() {
    'use strict';

})();


window.addEventListener('load', function() {

    document.querySelector(".post .post_side_wrapper .post_endorse .endorses_wrapper .endorse.endorse_5").click();
    setTimeout(() => {console.log("Thank you for your donation!"); }, 6000);
    document.querySelector(".confirmationAlert .footer .ctaBtn").click();
    location.reload();

}, false);