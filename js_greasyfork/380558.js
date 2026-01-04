// ==UserScript==
// @name         Secondary Laptop Guy Script
// @version      2.0
// @description  For the rare laptop guy windows
// @author       You
// @match        http*://static.jungroup.com/static_skins/boomerang_iframe*
// @match        http*://www2.webmd.com/static_skins/boomerang_iframe*
// @match        http*://static.hyprmx.com/static_skins/boomerang_iframe*
// @namespace https://greasyfork.org/users/249948
// @downloadURL https://update.greasyfork.org/scripts/380558/Secondary%20Laptop%20Guy%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/380558/Secondary%20Laptop%20Guy%20Script.meta.js
// ==/UserScript==

function doStuff() {
    var nextButton2 = document.getElementsByClassName("nextstepimg");
    if (nextButton2.length > 0) nextButton2[0].click();
}

setInterval(doStuff, 1000);