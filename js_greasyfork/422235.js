// ==UserScript==
// @name         Roblox Status Revived
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Re-enable the Roblox status text
// @author       LeadRDRK
// @match        https://www.roblox.com/users/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422235/Roblox%20Status%20Revived.user.js
// @updateURL https://update.greasyfork.org/scripts/422235/Roblox%20Status%20Revived.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var statusElements = document.querySelectorAll("[user-status]");
    for (var i = 0; i < statusElements.length; ++i) {
        var statusElement = statusElements[i];
        statusElement.childNodes[0].classList.remove("ng-hide");
    }
})();