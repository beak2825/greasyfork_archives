// ==UserScript==
// @name         Amalltina
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  change all amazon.com products page 'add to cart' buttons to malltina.com static links!
// @author       You
// @match        https://www.amazon.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448845/Amalltina.user.js
// @updateURL https://update.greasyfork.org/scripts/448845/Amalltina.meta.js
// ==/UserScript==

window.addEventListener('load', function () {
var anchors = document.getElementsByTagName("a");

for (var i = 0; i < anchors.length; i++) {
    var str = anchors[i].href;
    var regex = /[?].*/;
    var regex2 = /^[^_]*dp/;
    str = str.replace(regex, "");
    var str2 = str;
    str2 = str2.replace(regex2, "https://malltina.com/product");
    anchors[i].href = str2
}
})