// ==UserScript==
// @name         Auto OServer for AnimeHeaven.ru
// @version      0.3
// @description  Automatically set server to OServer (the superior server) on AnimeHeaven.ru
// @author       Lewis5441
// @match        https://animeheaven.ru/watch/*
// @grant        none
// @namespace https://greasyfork.org/users/684913
// @downloadURL https://update.greasyfork.org/scripts/410759/Auto%20OServer%20for%20AnimeHeavenru.user.js
// @updateURL https://update.greasyfork.org/scripts/410759/Auto%20OServer%20for%20AnimeHeavenru.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("#selectServer").attr("atrl", "oserver");
    $("select option").filter(function() {
        //may want to use $.trim in here
        return $(this).text().includes("oserver");
    }).prop('selected', true);
})();