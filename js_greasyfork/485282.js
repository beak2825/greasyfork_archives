// ==UserScript==
// @name        Lootlinks and Lootlabs Bypasser
// @namespace   Your Name Here
// @version     1.0.0
// @description Bypasses Lootlinks and Lootlabs on sites.
// @match       *
// @grant       none
// @run-at      document-body
// @downloadURL https://update.greasyfork.org/scripts/485282/Lootlinks%20and%20Lootlabs%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/485282/Lootlinks%20and%20Lootlabs%20Bypasser.meta.js
// ==/UserScript==

setInterval(function() {
    let lootLinks = document.body.querySelectorAll('.lootlinks');
    let lootLabs = document.body.querySelectorAll('.lootlabs');

    lootLinks.forEach(function(lootLink) {
        lootLink.remove();
    });

    lootLabs.forEach(function(lootLab) {
        lootLab.remove();
    });

}, 1000);
