// ==UserScript==
// @name         Danbooru: Left and right arrow navigation
// @namespace    dbmod.io
// @version      0.1
// @description  Enables the use of left and right arrows to navigate Danbooru, in addition to the A and D keys.
// @author       FPX
// @match        https://danbooru.donmai.us/posts/*
// @match        http://danbooru.donmai.us/posts/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22741/Danbooru%3A%20Left%20and%20right%20arrow%20navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/22741/Danbooru%3A%20Left%20and%20right%20arrow%20navigation.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    function backForward(event) {
        if (event.altKey === false) {
            var links = [];
            if (event.code == "ArrowRight") {
                links = document.getElementsByClassName("active next");
            }
            else if (event.code == "ArrowLeft") {
                links = document.getElementsByClassName("active prev");
            }
            document.location.href = links[0].href;
        }
    }
    document.addEventListener("keydown", backForward);
})();