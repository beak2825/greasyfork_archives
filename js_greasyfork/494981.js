// ==UserScript==
// @name         Turnstile
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  :;
// @author       LTW
// @license      none
// @match        https://challenges.cloudflare.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494981/Turnstile.user.js
// @updateURL https://update.greasyfork.org/scripts/494981/Turnstile.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
setTimeout(() => document.querySelectorAll('.cb-lb-t').forEach(e => e.click()),1000);
    },3000);
})();