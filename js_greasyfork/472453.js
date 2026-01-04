// ==UserScript==
// @name         CloudFlare Challenge
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  cloudflare
// @author       You
// @match        https://challenges.cloudflare.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cloudflare.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472453/CloudFlare%20Challenge.user.js
// @updateURL https://update.greasyfork.org/scripts/472453/CloudFlare%20Challenge.meta.js
// ==/UserScript==

(function() {
    'use strict';


    setInterval(function(){
        document.querySelector("#cf-stage > div.ctp-checkbox-container > label > span")?.click();
    },7000);

    setInterval(function(){
        document.querySelector("input[value='Verify you are human']")?.click();
        //document.querySelector('#challenge-stage')?.querySelector('input[type="checkbox"]')?.click();
        document.querySelector('.ctp-checkbox-label')?.click();
    },3000);

})();