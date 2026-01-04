// ==UserScript==
// @name         RainCollector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://gamdom.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36869/RainCollector.user.js
// @updateURL https://update.greasyfork.org/scripts/36869/RainCollector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function()
                {
        if(document.getElementsByClassName( "claimRain" )[0] != undefined)
            document.getElementsByClassName( "claimRain" )[0].click();

    }, 1000);
})();