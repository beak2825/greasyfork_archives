// ==UserScript==
// @name         Roblox Status Revivedv 
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  -
// @author       Genpro
// @match        https://*.roblox.com/users/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441429/Roblox%20Status%20Revivedv.user.js
// @updateURL https://update.greasyfork.org/scripts/441429/Roblox%20Status%20Revivedv.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var statusElements = document.querySelectorAll("[user-status]");
    for (var i = 0; i < statusElements.length; ++i) {
        var statusElement = statusElements[i];
        statusElement.childNodes[0].classList.remove("ng-hide");
    }
})();