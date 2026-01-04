// ==UserScript==
// @name         Duden.de remove anti-adblocker layer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  as the name says
// @author       PS
// @match        https://www.duden.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=duden.de
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458037/Dudende%20remove%20anti-adblocker%20layer.user.js
// @updateURL https://update.greasyfork.org/scripts/458037/Dudende%20remove%20anti-adblocker%20layer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        document.getElementById("numero-antiadblocker").remove();
    });
})();