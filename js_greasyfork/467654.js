// ==UserScript==
// @name         CoNscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  stop accidental gold click by removing intel premium actions
// @author       Okjmn
// @match        *://*.conflictnations.com/*
// @match        *://*.conflictnations.com
// @match        *://conflictnations.com/*
// @match        *://conflictnations.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=conflictnations.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467654/CoNscript.user.js
// @updateURL https://update.greasyfork.org/scripts/467654/CoNscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    (window.opera ? document.body : document).addEventListener("mousemove", function(e) {
        document.querySelector("#func_instant_spy_actions").innerHTML = "<h3>Bye Bye accidental gold losses</h3>";
    });
    (window.opera ? document.body : document).addEventListener("click", function(e) {
        document.querySelector("#func_instant_spy_actions").innerHTML = "<h3>Bye Bye accidental gold losses</h3>";
    })
})();