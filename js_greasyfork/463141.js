// ==UserScript==
// @name         Female Agent Image Fix
// @namespace    https://greasyfork.org/users/1052172
// @version      0.1
// @description  Fixes images when playing the online version of Female Agent with a save file created in the offline version
// @author       Cedenwar
// @match        https://www.femaleagentgame.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463141/Female%20Agent%20Image%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/463141/Female%20Agent%20Image%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fixImage(img) {
        img.src = img.src.replace("media/test", "");
    }

    function mutationObserved(mutations, observer) {
        document.querySelectorAll("img").forEach(img => fixImage(img));
    }

    var observer = new MutationObserver(mutationObserved);
    observer.observe(document, {subtree: true, childList: true});
})();