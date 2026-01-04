// ==UserScript==
// @name         Bloxflip Ad Remover
// @namespace    Mohalk
// @version      1.0
// @description  Ad remover for bloxflip
// @author       Mohalk
// @match        https://bloxflip.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467590/Bloxflip%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/467590/Bloxflip%20Ad%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeAdElement() {
        var adDiv = document.getElementById("nitro-ad-deposit");
        if (adDiv) {
            adDiv.remove();
            observer.disconnect();
        }
    }

    var observer = new MutationObserver(function(mutationsList, observer) {
        for (var mutation of mutationsList) {
            if (mutation.type === "childList") {
                if (document.getElementById("nitro-ad-deposit")) {
                    removeAdElement();
                }
            }
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    if (document.getElementById("nitro-ad-deposit")) {
        removeAdElement();
    }
})();
