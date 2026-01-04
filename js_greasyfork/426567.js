// ==UserScript==
// @name         Gats.io - No Camera Movement
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  helps if you're used to other io games' fixed view
// @author       Nitrogem 35
// @match        https://gats.io/
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/426567/Gatsio%20-%20No%20Camera%20Movement.user.js
// @updateURL https://update.greasyfork.org/scripts/426567/Gatsio%20-%20No%20Camera%20Movement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener ("load", onload);

    function onload() {
        let processMessageTmp = processMessage;
        processMessage = function(event) {
            processMessageTmp(event);
            let decoded = new TextDecoder().decode(event.data);
            if (!decoded.includes("a,")) return;
            camera.update = function() {
                let player = Player.pool[selfId];
                if (camera.trackingId) {
                    camera.x = player.x - hudXPosition;
                    camera.y = player.y - hudYPosition;
                }
            }
        }
    }
})();