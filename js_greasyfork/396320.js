// ==UserScript==
// @name         Prevent Swedbank from automatically logging out after 5 minutes of inactivity
// @namespace    http://tampermonkey.net/
// @version      3
// @description  Hindra swedbank eller sparbankerna från att logga ut en efter en stund
// @author       Oscar Jonsson
// @match        https://online.swedbank.se/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396320/Prevent%20Swedbank%20from%20automatically%20logging%20out%20after%205%20minutes%20of%20inactivity.user.js
// @updateURL https://update.greasyfork.org/scripts/396320/Prevent%20Swedbank%20from%20automatically%20logging%20out%20after%205%20minutes%20of%20inactivity.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function mutationEvent(mutationsList, observer) {
        var keepLoggedInBtn=document.querySelector(".mat-dialog-container acorn-modal-section acorn-button-container>acorn-button[label='Stanna kvar']");
        if (keepLoggedInBtn) {
          keepLoggedInBtn.click();
            console.log("keep awake");
        }
    }
    (new MutationObserver(mutationEvent)).observe(document.body, { attributes: true, childList: true, subtree: true });
})();