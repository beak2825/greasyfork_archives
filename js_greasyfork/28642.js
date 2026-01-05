// ==UserScript==
// @name         Reddit /r/place Zoom
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Use mouse wheel to zoom
// @author       Plumbus
// @match        https://www.reddit.com/place*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28642/Reddit%20rplace%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/28642/Reddit%20rplace%20Zoom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var placeViewer = document.getElementById("place-viewer");

    document.addEventListener("wheel", function(e){
        e.preventDefault();
        var scale = parseFloat(placeViewer.style.transform.match(/\((.*?),/)[1]);
        scale += event.wheelDeltaY/500;
        scale = Math.max(scale, 0.1);
        placeViewer.style.transform = "scale("+ scale +"," + scale +")";
    });
})();