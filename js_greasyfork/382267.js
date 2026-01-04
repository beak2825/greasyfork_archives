// ==UserScript==
// @name         Random Button for Derpibooru
// @namespace    http://fillydelphiaradio.net/
// @version      0.1
// @description  Gives a hotkey for loading a random image on Derpibooru (Ctrl-M)
// @author       Set-L
// @match        https://derpibooru.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382267/Random%20Button%20for%20Derpibooru.user.js
// @updateURL https://update.greasyfork.org/scripts/382267/Random%20Button%20for%20Derpibooru.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.onkeyup = function(e) {
        if(e.ctrlKey && e.which == 77) {
            window.location.replace('https://derpibooru.org/search?q=%2A&random_image=y');
        }
    }
    // Your code here...
})();