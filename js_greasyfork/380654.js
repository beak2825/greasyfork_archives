// ==UserScript==
// @name         Smores.tv Script
// @version      1.0
// @description  Skip straight to the ads for SmoresTV
// @author       Toni
// @match        http*://smores.tv/watch.php*
// @grant        none
// @namespace https://greasyfork.org/users/249948
// @downloadURL https://update.greasyfork.org/scripts/380654/Smorestv%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/380654/Smorestv%20Script.meta.js
// ==/UserScript==

function doStuff() {
    var btn = document.getElementsByClassName("brid-next-control")[0];
    if (!btn.className.includes("brid-disabled")) btn.click();
}

setInterval(doStuff, 2000)