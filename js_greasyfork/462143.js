// ==UserScript==
// @name         New Userscript
// @namespace    https://yohoho.io/
// @version      0.1
// @description  unlimited coins in yohoho.io
// @author       You
// @match        https://yohoho.io
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462143/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/462143/New%20Userscript.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var a = 9999999999;
var b = localStorage.setItem("coinsOwned", a);
if (b < a) {
b = localStorage.setItem("coinsOwned", a);
}
})();