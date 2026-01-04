// ==UserScript==
// @name        Fantasi Gaming Script
// @namespace   http://tampermonkey.net/
// @version     0.1
// @description Script to perform actions on fantasigaming.com
// @match       https://www.fantasigaming.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/477929/Fantasi%20Gaming%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/477929/Fantasi%20Gaming%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to click the element with class "acc" after a 1-second delay
    setTimeout(function() {
        var accElement = document.querySelector('.acc');
        if (accElement) {
            accElement.click();
        }
    }, 1000);

    // Function to redirect to 'https://www.google.com/search...' after 1 minute
    setTimeout(function() {
        window.location.href = 'https://www.google.com/search?q=cerita+gelap+gelap+asik+di+dunia+mimpi&oq=c&gs_lcrp=EgZjaHJvbWUqCAgCEEUYJxg7MgYIABBFGDwyCAgBEEUYJxg7MggIAhBFGCcYOzIECAMQBTIECAQQBTIECAUQBTIGCAYQRRg5MgYIBxBFGDwyBggIEEUYOzINCAkQABiDARixAxiABNIBCDE3MDdqMGo5qAIAsAIA&client=ms-android-xiaomi-rvo2&sourceid=chrome-mobile&ie=UTF-8';
    }, 60000); // 1 minute is equivalent to 60000 milliseconds

    // Function to click the img element with class "inserted-btn mtz" 2 seconds before the redirect
    setTimeout(function() {
        var imgElement = document.querySelector('img.inserted-btn.mtz');
        if (imgElement) {
            imgElement.click();
        }
    }, 58000); // 2 seconds before the redirect

})();
