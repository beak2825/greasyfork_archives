
// ==UserScript==
// @name         CoolMathGames No Ads
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically removes ads and skips to the game after it was loaded, no need to wait 15 seconds
// @author       darin
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410547/CoolMathGames%20No%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/410547/CoolMathGames%20No%20Ads.meta.js
// ==/UserScript==


setTimeout(function(){
    removePrerollAndDisplayGame()
}, 1500);