// ==UserScript==
// @name         Twitch Drop Helper
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Combined with auto drop collector. Refresh the channel if not live.
// @author       Kevincj
// @match        https://www.twitch.tv/rainbow6
// @match        https://www.twitch.tv/kinggeorge
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440276/Twitch%20Drop%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/440276/Twitch%20Drop%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function () {
        if (document.getElementsByClassName("live-indicator-container").length == 0){
            console.log("Not live");
        } else {
            console.log("Live")
        }
        setInterval(function(){ window.location.reload();}, 30*1000*60);

    }, 30000);

})();