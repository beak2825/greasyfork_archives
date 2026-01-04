// ==UserScript==
// @name         Remove sign in gate on The Guardian
// @namespace    http://tampermonkey.net/
// @version      2024-12-12
// @description  Hide the "please make an account" nag
// @author       SomeFunGuy
// @match        https://www.theguardian.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=theguardian.com
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/520528/Remove%20sign%20in%20gate%20on%20The%20Guardian.user.js
// @updateURL https://update.greasyfork.org/scripts/520528/Remove%20sign%20in%20gate%20on%20The%20Guardian.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeSignInGate() {
        const gateElement = document.querySelector('div[data-testid="sign-in-gate-main"]');
        if (gateElement) {
            gateElement.remove();
            console.log('Sign-in gate removed.');
        } else {
            //console.log('Sign-in gate not found.');
        }
    }


    window.addEventListener('load', removeSignInGate);

    // Run periodically in case the element is dynamically added later
    const observer = new MutationObserver(removeSignInGate);
    observer.observe(document.body, { childList: true, subtree: true });


})();