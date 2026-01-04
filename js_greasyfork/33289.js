// ==UserScript==
// @name         Hotsplots Hotspot Autologin
// @namespace    hotsplots-login
// @version      0.1
// @match        https://www.hotsplots.de/*
// @description Automatically login to Hotsplots hotspots
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33289/Hotsplots%20Hotspot%20Autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/33289/Hotsplots%20Hotspot%20Autologin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById("checkAGB").checked = true;
    document.getElementsByTagName('form')[0].submit();
})();