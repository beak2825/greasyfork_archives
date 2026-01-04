// ==UserScript==
// @name         CloudF
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  trytotake
// @author       You
// @match        https://challenges.cloudflare.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claimclicks.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462362/CloudF.user.js
// @updateURL https://update.greasyfork.org/scripts/462362/CloudF.meta.js
// ==/UserScript==

(function() {
    'use strict';


    setInterval(function(){
        document.querySelector("#cf-stage > div.ctp-checkbox-container > label > span").click();
    },7000);


})();