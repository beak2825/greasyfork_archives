// ==UserScript==
// @name         Steam Auto Search Inventory by Word
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Jorge Duarte
// @match        http://steamcommunity.com/id/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36718/Steam%20Auto%20Search%20Inventory%20by%20Word.user.js
// @updateURL https://update.greasyfork.org/scripts/36718/Steam%20Auto%20Search%20Inventory%20by%20Word.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var searchthing = "killstreak";
    document.getElementById("filter_control").value = searchthing;
    document.getElementById("filter_control").click();
})();