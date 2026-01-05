// ==UserScript==
// @name         Automatically Bypass Steam Age Verification
// @description  Sets your birthday to 1950 and submits the form.
// @version      1.0.1
// @namespace    skeeto
// @license      Public Domain
// @include      http://store.steampowered.com/agecheck/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/1519/Automatically%20Bypass%20Steam%20Age%20Verification.user.js
// @updateURL https://update.greasyfork.org/scripts/1519/Automatically%20Bypass%20Steam%20Age%20Verification.meta.js
// ==/UserScript==

(function(form) {
    form.ageYear.value = 1950;
    form.submit();
}(document.querySelector('#agegate_box form')));
