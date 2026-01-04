// ==UserScript==
// @name         moretvtime auto
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       richman
// @match        https://moretvtime.online/*
// @match        https://moretvtime.site/*
// @match        https://moretvtime.com/*
// @match        https://moretvtime.gb.net/*
// @match        https://moretvtime.pw/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402374/moretvtime%20auto.user.js
// @updateURL https://update.greasyfork.org/scripts/402374/moretvtime%20auto.meta.js
// ==/UserScript==
(function() {
    this.$ = this.jQuery = jQuery.noConflict(true);
     var claimTimer = setInterval (function() {claim(); }, Math.floor(Math.random() * 1000) + 2000);
    var claimbTimer = setInterval (function() {claimb(); }, Math.floor(Math.random() * 3000)+2000 );
    var refreshTimer = setInterval (function() {refresh(); }, Math.floor(Math.random() * 3000) + 1000);
    var successTimer = setInterval (function() {success(); }, Math.floor(Math.random() * 3000) + 2000);
    function claim(){
     document.getElementsByClassName("card-body border-primary")[0].click();




    }
    function claimb(){
         document.getElementsByClassName("sc-survey-navigation btn")[0].click();

        document.getElementsByClassName("sc-survey-navigation btn disabled btn-success")[0].click();


    }
    function refresh(){


    }
    function success(){

          document.getElementsByClassName("btn btn-success")[0].click();
    }
})();