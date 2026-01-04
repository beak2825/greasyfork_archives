// ==UserScript==
// @name         bucksify faucet
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       bboytech
// @description  Make money
// @match        https://bucksify.com/faucet/*
// @icon         https://www.google.com/s2/favicons?domain=bucksify.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431595/bucksify%20faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/431595/bucksify%20faucet.meta.js
// ==/UserScript==

(function() {
    var claimTimer = setInterval (function() {claim(); }, Math.floor(Math.random() * 60000) + 61000);
    var claimaTimer = setInterval (function() {claima(); }, Math.floor(Math.random() * 1000) + 1500);
    var claimbTimer = setInterval (function() {claimb(); }, Math.floor(Math.random() * 41000) + 41500);

 function claimb() {
     document.getElementsByClassName("btn waves-effect width-md waves-light faucet-btn btn-bordered-success")[0].click();
 }
 function claima() {
     document.getElementsByClassName("btn btn-bordered-secondary waves-effect width-md waves-light faucet-btn")[0].click();
 }

 function claim() {
            var linke = 'https://bucksify.com/faucet/';
            location.href = linke;
 }
})();