// ==UserScript==
// @license MIT
// @name         Twitch sponsor banner removal
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  Remove sponsor banners on twitch
// @author       starr00
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480522/Twitch%20sponsor%20banner%20removal.user.js
// @updateURL https://update.greasyfork.org/scripts/480522/Twitch%20sponsor%20banner%20removal.meta.js
// ==/UserScript==

(function() {
    'use strict';
     function checkForEle(startTime, maxTime) {
        if(!document.hasFocus()) {
            setTimeout(() => checkForEle(Date.now(), maxTime), 3000);
            return;
        }
        if (Date.now() - startTime > maxTime) {
            return;
        }
        if (!document.getElementsByClassName("InjectLayout-sc-1i43xsx-0 channel-skins-overlay__interactive lmoovA")[0] && !document.getElementsByClassName("Layout-sc-1xcs6mc-0 jiRTcI")[0] && !document.getElementsByClassName("Layout-sc-1xcs6mc-0 iTwxsJ")[0]) {
            setTimeout(() => checkForEle(startTime, maxTime), 1000);
            return;
        }
        try {
        document.getElementsByClassName("InjectLayout-sc-1i43xsx-0 channel-skins-overlay__interactive lmoovA")[0].remove();
        } catch {}
        try {
        document.getElementsByClassName("Layout-sc-1xcs6mc-0 jiRTcI")[0].remove();
        } catch {}
        document.getElementsByClassName("Layout-sc-1xcs6mc-0 iTwxsJ")[0].remove();
     }
     document.addEventListener("readystatechange", () => {
        console.log(document.readyState);
        if(document.readyState == "complete"/* && document.URL.split("/").length == 4*/) {
            checkForEle(Date.now(), 240E3);
        }
     });
})();