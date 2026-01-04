// ==UserScript==
// @name         Melvor Idle Offline Limit Remover
// @namespace    https://zeldo.net
// @version      0.1
// @description  Remove 12 Hr Offline Idle Limit from Melvor Idle
// @author       Zeldo
// @match        https://*.melvoridle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410931/Melvor%20Idle%20Offline%20Limit%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/410931/Melvor%20Idle%20Offline%20Limit%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function Main() {
        if (typeof updateOffline === "undefined") {
            return;
        }

        console.log("Attempting to modify Main.js updateOffline");
        var UpdateOfflineNew = updateOffline.toString();

        UpdateOfflineNew = UpdateOfflineNew.replace("if (timeDiff > 43200000) timeDiff = 43200000;", "let hoursGone = (timeDiff / 1000 / 60 / 60);");

        if (UpdateOfflineNew == updateOffline.toString()) {
            console.error("Failed to find 12 hour limitor");
            return;
        }

        UpdateOfflineNew = UpdateOfflineNew.replace(/if \(timeGone >= 12\) goneFor \+= .+?\r\n/i, "");
        UpdateOfflineNew = UpdateOfflineNew.replace(/if \(timeGone >= 12\) goneFor \+= .+?\n/i, "");

        if (UpdateOfflineNew == updateOffline.toString()) {
            console.error("Failed to find 12 hour message for removal.");
        }

        UpdateOfflineNew = UpdateOfflineNew.replace("Loading your offline progress.", "Loading \' + ((hoursGone > 1) ? (Math.floor(hoursGone) + \" hours\") : Math.floor(hoursGone * 60) + \" minutes\") + \' of offline progress.");
        if (UpdateOfflineNew == updateOffline.toString()) {
            console.error("Failed to find 12 hour message for removal.");
        }

        updateOffline = eval("(" + UpdateOfflineNew + ")");

        console.log("Successfully removed 12 hour limit.");
    }

    var script = document.createElement('script');
    script.textContent = `try {(${Main})();} catch (e) {console.error(e);}`;
    document.body.appendChild(script).parentNode.removeChild(script);

})();