// ==UserScript==
// @name         Steam Collection fix height
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A fix for Steam's odd decision to make collections a strange height
// @author       You
// @match        https://steamcommunity.com/sharedfiles/managecollection/*
// @icon         https://www.google.com/s2/favicons?domain=steamcommunity.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450371/Steam%20Collection%20fix%20height.user.js
// @updateURL https://update.greasyfork.org/scripts/450371/Steam%20Collection%20fix%20height.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.querySelector('#MySubscribedItems').style.height = "100%";
})();