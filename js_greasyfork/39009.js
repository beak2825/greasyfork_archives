// ==UserScript==
// @name         Spiegel Remove Adblocker Notifications
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes annoying "You're using an Adblocker"-Notification that renders the site unusable
// @author       You
// @match        http://www.spiegel.de/*
// @match        http://m.spiegel.de/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/39009/Spiegel%20Remove%20Adblocker%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/39009/Spiegel%20Remove%20Adblocker%20Notifications.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var targetNode = document.querySelector('body');
    var config = { childList: true };

    var callback = function(mutationsList) {
        for(var mutation of mutationsList) {
            if (mutation.addedNodes.length>0) { // Only trigger when node added, not when e.g. deleted
                var str = mutation.addedNodes[0].className;
                if (str.startsWith('sp_v') || str.startsWith('sp_m')){ // Select only divs with correct classnames
                    var badguy = mutation.addedNodes[0];
                    console.log('Removing annoying Adblock Notification:');
                    console.log(mutation);
                    badguy.parentNode.removeChild(badguy);
                    document.querySelector('html').removeAttribute("style"); // Remove some styles that disable scrolling
                    document.querySelector('body').removeAttribute("style"); // Remove some styles that disable scrolling
                }
            }
        }
    };
    var observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
})();