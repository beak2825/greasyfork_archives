// ==UserScript==
// @name         Abdo Ayman
// @namespace    Abdo
// @version      1.1
// @description  Pause LastPass by adding 'lpignore' to every input of type text or password.
// @author       Abdo
// @match     https://eservice.incometax.gov.eg/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492753/Abdo%20Ayman.user.js
// @updateURL https://update.greasyfork.org/scripts/492753/Abdo%20Ayman.meta.js
// ==/UserScript==

(function () {
    console.log('Adding LastPass Ignore on all input type text or password.');
    let inputs = document.querySelectorAll('input[name=Password], input[name=pwd]');
    for(let input of inputs) {
        input.setAttribute('type', 'password');
    }
})();