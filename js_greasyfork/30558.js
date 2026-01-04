// ==UserScript==
// @name WorldArt - Anime Search by default
// @description Set the search category to anime (it faster, than full search)
// @author Last8Exile
// @license MIT
// @version 1.1
// @noframes
// @match *://www.world-art.ru/*
// @namespace https://greasyfork.org/users/61164
// @downloadURL https://update.greasyfork.org/scripts/30558/WorldArt%20-%20Anime%20Search%20by%20default.user.js
// @updateURL https://update.greasyfork.org/scripts/30558/WorldArt%20-%20Anime%20Search%20by%20default.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.top != window.self)
    {
        return;
    }

    var selector = document.getElementsByName("global_sector");
    if (selector.length != 1)
    {
        return;
    }

    selector[0].value = "animation";
})();