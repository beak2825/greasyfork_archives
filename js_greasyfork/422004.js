// ==UserScript==
// @name         GooCalReloadOnFocus
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  reload web page when focused
// @author       Liam Wang
// @match        https://calendar.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422004/GooCalReloadOnFocus.user.js
// @updateURL https://update.greasyfork.org/scripts/422004/GooCalReloadOnFocus.meta.js
// ==/UserScript==

var blurTime = 0;

(function() {
    document.addEventListener("visibilitychange", function() {
        if (document.visibilityState === 'visible') {
            var focusTime = Date.now()
            console.log("Time since last visible:")
            console.log(focusTime - blurTime)
            if (blurTime === 0) {
                return;
            }
            if (focusTime - blurTime > 1000*60*5) {
                location.reload()
            }
        } else {
            blurTime = Date.now()
        }
    });

})();