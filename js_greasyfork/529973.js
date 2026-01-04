// ==UserScript==
// @name         .<*Gartic-Viewer*>.
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  A Gartic script that allows you to enter a room as a viewer with a simple right-click on the desired room name in Gartic.
// @author       Scripter_Plus
// @match        *://gartic.io/*
// @grant        none
// @icon         https://static.roocket.ir/images/avatar/2024/4/29/f2Sqmpbwyp6tvzs6kMVRVilOBr7fRO0RIYnW3Tzt.png
// @downloadURL https://update.greasyfork.org/scripts/529973/%3C%2AGartic-Viewer%2A%3E.user.js
// @updateURL https://update.greasyfork.org/scripts/529973/%3C%2AGartic-Viewer%2A%3E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('contextmenu', function(event) {
        let target = event.target.closest('a');
        if (target && target.href.includes("gartic.io")) {
            event.preventDefault();
            let viewerURL = target.href + "/viewer";
            window.open(viewerURL, '_blank');
        }
    });
})();
