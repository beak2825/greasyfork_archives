// ==UserScript==
// @name         DC Egg Grab AutoRefresh
// @version      1.0.5
// @author       Mythbyte
// @namespace    Mythbyte
// @description  If you fail to grab an egg, it automatically brings you back to the biome you were in.
// @include      https://dragcave.net/get/*
// @grant        none
// @license     CC0-1.0; See https://creativecommons.org/publicdomain/zero/1.0/legalcode for more information
// @downloadURL https://update.greasyfork.org/scripts/474057/DC%20Egg%20Grab%20AutoRefresh.user.js
// @updateURL https://update.greasyfork.org/scripts/474057/DC%20Egg%20Grab%20AutoRefresh.meta.js
// ==/UserScript==

setTimeout(function() {
    if (document.getElementsByClassName('_j_0')[0]) {
        var Biomeclick = document.querySelector("#middle");
        Biomeclick.querySelector("a").click();
    }
}, 500);