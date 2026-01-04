// ==UserScript==
// @name         Stand Blur Account Info
// @version      1.0
// @description  Blur Stand Account ID and Activation Key
// @author       AptemCat
// @match        https://stand.gg/account/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stand.gg
// @grant        none
// @license      GNU GPLv3
// @namespace    https://greasyfork.org/users/923789
// @downloadURL https://update.greasyfork.org/scripts/461698/Stand%20Blur%20Account%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/461698/Stand%20Blur%20Account%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector("#account-id").style.filter = "blur(4px)";
    document.querySelector("#activation-key").style.filter = "blur(4px)";
})();