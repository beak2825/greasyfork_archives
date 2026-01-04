// ==UserScript==
// @name         EnhancedOnlinePNGTools - No Waiting For Downloads
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Don't wait 10 seconds of your life to download some image on onlinepngtools.com
// @author       kkMihai
// @match        https://onlinepngtools.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onlinepngtools.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481168/EnhancedOnlinePNGTools%20-%20No%20Waiting%20For%20Downloads.user.js
// @updateURL https://update.greasyfork.org/scripts/481168/EnhancedOnlinePNGTools%20-%20No%20Waiting%20For%20Downloads.meta.js
// ==/UserScript==

(function() {
    function updatePage() {
        document.querySelector('.output .widget-save-as').dataset.subscription = 'premium';

        var btnUpgrade = document.getElementById('btn-upgrade');
        if (btnUpgrade) {
            btnUpgrade.remove();
        }
    }

    setInterval(updatePage, 500);
})();
