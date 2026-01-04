// ==UserScript==
// @name         Sticky Header
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  None
// @author       You
// @match      https://community.appinventor.mit.edu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450405/Sticky%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/450405/Sticky%20Header.meta.js
// ==/UserScript==


(function() {
    'use strict';
     document.getElementById("ember7").classList.remove("d-header-wrap");

})();
