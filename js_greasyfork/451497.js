// ==UserScript==
// @name         Emalltina
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  change all ebay.com products page 'add to cart' buttons to malltina.com static links!
// @author       You
// @match        https://www.ebay.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ebay.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451497/Emalltina.user.js
// @updateURL https://update.greasyfork.org/scripts/451497/Emalltina.meta.js
// ==/UserScript==

window.addEventListener('load', function () {
var anchors = document.getElementsByTagName("a");

for (var i = 0; i < anchors.length; i++) {
    var str = anchors[i].href;
    var regex = /[?].*/;
    var regex2 = /^[^_]*itm/;
    str = str.replace(regex, "");
    var str2 = str;
    str2 = str2.replace(regex2, "https://malltina.com/eproduct");
    anchors[i].href = str2
}
})