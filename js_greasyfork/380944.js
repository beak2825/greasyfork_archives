// ==UserScript==
// @name         Change MAL Friends link in Menu
// @namespace    https://greasyfork.org/en/users/96096-purplepinapples
// @version      0.2
// @description  Changes the Friends link in the profile dropdown to the friends page linked to your profile
// @author       PurplePinapples
// @match        https://myanimelist.net/*
// @exclude      https://myanimelist.net/animelist/*
// @exclude      https://myanimelist.net/mangalist/*
// @downloadURL https://update.greasyfork.org/scripts/380944/Change%20MAL%20Friends%20link%20in%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/380944/Change%20MAL%20Friends%20link%20in%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("#header-menu").find("ul>li:contains('Friends')>a").attr("href", $(".header-profile-button").attr("href") + "/friends");
})();