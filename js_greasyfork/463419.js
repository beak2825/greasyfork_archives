// ==UserScript==
// @name         Egg Alert 2023
// @namespace    eggalert.2023
// @version      1.0.1
// @description  Send an alert when an egg is on the page
// @author       Heasleys4hemp [1468764]
// @match        https://www.torn.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463419/Egg%20Alert%202023.user.js
// @updateURL https://update.greasyfork.org/scripts/463419/Egg%20Alert%202023.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const eg_observer = new MutationObserver(function(mutations) {
        if (document.getElementById("easter-egg-hunt-root")) {
            eg_observer.disconnect();
            alert('Egg on page.');
            return;
        }
    });
    eg_observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});

})();