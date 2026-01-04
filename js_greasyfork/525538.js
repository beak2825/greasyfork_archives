// ==UserScript==
// @name         Warframe Wiki Redirect
// @namespace    Violentmonkey Scripts
// @match        *://warframe.fandom.com/*
// @grant        none
// @version      0.1
// @author       Eneman
// @description  Redirect fandom Warframe wiki to new wiki
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/525538/Warframe%20Wiki%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/525538/Warframe%20Wiki%20Redirect.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Get the current URL
    let currentUrl = window.location.href;

    //Modify URL
    let newUrl = currentUrl.replace('warframe.fandom.com/wiki', 'wiki.warframe.com/w')

    //Replace URL
    window.location.replace(newUrl)


})();