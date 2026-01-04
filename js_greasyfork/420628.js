// ==UserScript==
// @name         Håll Nordea levande
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hindra Nordea från att logga ut pga inaktivitet
// @author       Oscar Jonsson
// @match        https://internetbanken.privat.nordea.se/nsp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420628/H%C3%A5ll%20Nordea%20levande.user.js
// @updateURL https://update.greasyfork.org/scripts/420628/H%C3%A5ll%20Nordea%20levande.meta.js
// ==/UserScript==

(function() {
    'use strict';

   function keepAlive() {
       var time = new Date();
       var button=document.querySelector("#timeoutWarningForm > p > input:nth-child(1)");
       console.log("timer keep alive! "+(time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds()));
       button.click();
   }
    setInterval(keepAlive,270000);
    function mutationEvent() {
        var time = new Date();
      console.log("mutation!");
        var button=document.querySelector("#timeoutWarningForm > p > input:nth-child(1)");
        if (button.offsetParent) {
           console.log("found button, mutation "+(time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds()));
           button.click();
           console.log("håll vaken med mutation! "+(time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds()));
       } else {
         console.log("mutation, element not visible "+(time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds()));
       }
    }
    (new MutationObserver(mutationEvent)).observe(document.body, { attributes: true, childList: true, subtree: true });
})();