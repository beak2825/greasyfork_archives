// ==UserScript==
// @name         Instagram-native-player
// @namespace    Kenya-West
// @version      0.4
// @description  This little script replaces Instagram's player with the native one built in browser
// @author       Kenya-West
// @include      *instagram.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27180/Instagram-native-player.user.js
// @updateURL https://update.greasyfork.org/scripts/27180/Instagram-native-player.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.onload = () => {
        getRidOfInstaPlayer();
    }

    function getRidOfInstaPlayer() {

        window.setInterval(() => {
            document.querySelector(".QvAa1") ? document.querySelector(".QvAa1 ").remove() : null;
            document.querySelector(".oujXn") ? document.querySelector(".oujXn").remove() : null;
            document.querySelector("._8jZFn") ? document.querySelector("._8jZFn").remove() : null;

            var video = document.querySelector(".tWeCl") ? document.querySelector(".tWeCl") : null;
            video.hasAttribute("controls") ? video.removeAttribute("controls") : null;
            video ? video.setAttribute("controls", "controls") : null;

            console.log("Successfully replaced Instagram videoplayer with a native one");
        }, 500);
    }
})();