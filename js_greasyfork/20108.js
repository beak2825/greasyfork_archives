// ==UserScript==
// @name          No Bad Sites
// @namespace http://tampermonkey.net/
// @version 0.1
// @description   Blocks terrible some terrible sites feel free to add and remove it is your personal website blocker
// @include /http*:\/\/www\.moviestarplanet\.com\/.*/
// @Johnluke
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/20108/No%20Bad%20Sites.user.js
// @updateURL https://update.greasyfork.org/scripts/20108/No%20Bad%20Sites.meta.js
// ==/UserScript==

(function () {
        var b = (document.getElementsByTagName("body")[0]);
        b.innerHTML = '';
        b.setAttribute('style', 'display:none!important');
        alert("This site has been blocked!");
})();