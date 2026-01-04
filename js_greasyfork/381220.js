// ==UserScript==
// @name         VolKno 1st part
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto click the hot!
// @author       Bboy Tech
// @match        https://volkno.com/media*
// @include      https://volkno.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381220/VolKno%201st%20part.user.js
// @updateURL https://update.greasyfork.org/scripts/381220/VolKno%201st%20part.meta.js
// ==/UserScript==

(function() {
    var claimTimer = setInterval (function() {claim(); }, Math.floor(Math.random() * 2000) + 5000);

    function claim(){
        document.getElementsByClassName("sprite sprite-flame-white")[0].click();
    }
})();