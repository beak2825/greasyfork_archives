
// ==UserScript==
// @name         EOM
// @namespace    http://tampermonkey.net/ EOM
// @version      0.2.1.1
// @description  Make more money!
// @author       Bboy Tech
// @match        https://moretvtime.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521071/EOM.user.js
// @updateURL https://update.greasyfork.org/scripts/521071/EOM.meta.js
// ==/UserScript==
 
(function() {
    this.$ = this.jQuery = jQuery.noConflict(true);
    var claimTimer = setInterval (function() {claim(); }, Math.floor(Math.random() * 1000) + 2000);
    var claimbTimer = setInterval (function() {claimb(); }, Math.floor(Math.random() * 5000) + 6000);
    var refreshTimer = setInterval (function() {refresh(); }, Math.floor(Math.random() * 6000) + 7000);
    function claim(){
        document.elementFromPoint(680, 370).click();
    }
    function claimb(){
        document.getElementsByClassName("sc-survey-navigation btn disabled btn-success")[0].click();
    }
    function refresh(){
          document.elementFromPoint(770, 280).click(); document.elementFromPoint(775, 310).click(); var href = $('.btn .btn-sucess').click();
    }
})();