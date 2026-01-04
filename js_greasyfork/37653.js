// ==UserScript==
// @name         Change MAL Club in Menu
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Changes the Clubs link in the profile dropdown from all clubs to your clubs
// @author       PurplePinapples
// @match        https://myanimelist.net/*
// @exclude      /^https:\/\/myanimelist\.net\/(anime|manga)list\/*
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/37653/Change%20MAL%20Club%20in%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/37653/Change%20MAL%20Club%20in%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("#header-menu").find("ul>li:contains('Clubs')>a").attr("href", $(".header-profile-button").attr("href") + "/clubs");
})();