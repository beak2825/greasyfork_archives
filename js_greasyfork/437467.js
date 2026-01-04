// ==UserScript==
// @name         General Ads Bypasser
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bypass Gerenal Skip button Websites
// @author       JethaLal_420
// @match        https://getthot.com/*
// @icon         https://www.google.com/s2/favicons?domain=getthot.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437467/General%20Ads%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/437467/General%20Ads%20Bypasser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(window.location.href.includes('https://getthot.com/')) {
        var text = document.querySelector('body > script:nth-child(10)').innerText
        var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        var url = text.match(urlRegex)[0]
        console.log(url)
        window.open(url, '_self')
    }
    
})();