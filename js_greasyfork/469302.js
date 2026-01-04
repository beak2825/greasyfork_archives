// ==UserScript==
// @name         Fibalivestats football live url
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Přesměruje livestats na fibalivestats.
// @author       Martin Kaprál
// @match        livestats.dcd.shared.geniussports.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469302/Fibalivestats%20football%20live%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/469302/Fibalivestats%20football%20live%20url.meta.js
// ==/UserScript==

(function() {
    'use strict';
// Získání aktuální URL adresy
var url = window.location.href;

// Nahrazení "pre" za "live"
var modifiedUrl = url.replace("livestats", "fibalivestats");

// Přidání "/index" na konec URL
modifiedUrl += "index.html";

// Přesměrování na upravenou URL
window.location.href = modifiedUrl;


})();