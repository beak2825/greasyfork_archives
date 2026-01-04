// ==UserScript==
// @name         imslp.org wait skipper
// @namespace    https://greasyfork.org/en/users/184736-teymyro
// @version      0.1
// @description  skip waiting time on imslp.org
// @author       t3Y
// @match        https://imslp.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389974/imslporg%20wait%20skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/389974/imslporg%20wait%20skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    try {
        var link = document.getElementById("sm_dl_wait").attributes["data-id"].value
        location.href = link;
    } catch (e) {}
})();