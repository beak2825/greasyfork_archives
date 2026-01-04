// ==UserScript==
// @name        Square Enix OTP autocomplete hint
// @description Makes it easier for 1Password to autocomplete SE OTP, per https://developer.1password.com/docs/web/compatible-website-design/
// @namespace   Violentmonkey Scripts
// @match       https://secure.square-enix.com/oauth/oa/*
// @grant       none
// @version     1.2
// @author      vivacious-memory
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/498992/Square%20Enix%20OTP%20autocomplete%20hint.user.js
// @updateURL https://update.greasyfork.org/scripts/498992/Square%20Enix%20OTP%20autocomplete%20hint.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    document.querySelector('input[name="otppw"]').autocomplete="one-time-code";
}, false);