// ==UserScript==
// @name         Remove steam spoilers
// @namespace    http://tampermonkey.net/
// @version      2025-04-02 Ver 1
// @description  removes spoiler censoring from steam
// @author       FishCat2431 on discord
// @match        https://steamcommunity.com/sharedfiles/filedetails/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @license      GNU GPLv3 https://choosealicense.com/licenses/gpl-3.0/
// @downloadURL https://update.greasyfork.org/scripts/531627/Remove%20steam%20spoilers.user.js
// @updateURL https://update.greasyfork.org/scripts/531627/Remove%20steam%20spoilers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll('.bb_spoiler').forEach(element => {element.classList.remove('bb_spoiler');});
    // simple right???
})();