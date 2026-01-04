// ==UserScript==
// @name         VisBOS - Checkbox für Lieferscheine automatisch aktivieren
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Checkbox für Lieferscheine automatisch aktivieren
// @author       Simon Zöllner
// @match        https://client.visbos.com/*
// @license      MIT 
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463586/VisBOS%20-%20Checkbox%20f%C3%BCr%20Lieferscheine%20automatisch%20aktivieren.user.js
// @updateURL https://update.greasyfork.org/scripts/463586/VisBOS%20-%20Checkbox%20f%C3%BCr%20Lieferscheine%20automatisch%20aktivieren.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("generateVouchersInput").checked = "checked"

    // Your code here...
})();