// ==UserScript==
// @name         Bandlab Warning Remover
// @namespace   http://tampermonkey.net/
// @version      2025-02-08
// @description  Removes the "Community Guidelines Violation" tab in Bandlab Notifications, because it never seems to go away.
// @author       You
// @match       https://www.bandlab.com/*
// @icon         https://raw.githubusercontent.com/BRINGBACKTHENOISE/customshowdown/main/nxte.png
// @grant        none
// @run-at      document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526307/Bandlab%20Warning%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/526307/Bandlab%20Warning%20Remover.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function removeNotification() {
        var targetDiv = document.querySelector('div[ng-repeat="warning in userWarnings"] div.notification-tile.notification-warning-tile.notification-activity-tile');

        if (targetDiv) {
            targetDiv.remove();
        }
    }

    var observer = new MutationObserver(function(mutationsList, observer) {
        removeNotification();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    removeNotification();
})();
