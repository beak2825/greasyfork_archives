// ==UserScript==
// @name         Gatari Beatmaps Redirect
// @namespace    https://greasyfork.org/scripts/453918
// @version      0.2.2
// @description  Redirect Gatari Beatmaps to Bancho Website
// @author       Kotoki1337
// @match        *://osu.gatari.pw/b/*
// @match        *://osu.gatari.pw/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gatari.pw
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453918/Gatari%20Beatmaps%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/453918/Gatari%20Beatmaps%20Redirect.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('load', function() {
        var url = window.location.href;
        var redirect = url.replace("gatari.pw", "ppy.sh");

        var main = document.getElementsByClassName("main-content buttons-block");

        if (main != null) {
            main[0].innerHTML += `<a target="_blank" href="${redirect}" class="map-btn btn-pink">Open on Bancho<i class="fas fa-external-link-alt map-btn-icon"></i></a>`
        }
    }, false);
})();