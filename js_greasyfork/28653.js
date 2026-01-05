// ==UserScript==
// @name         Twitter Night Mode
// @namespace    https://juanjosalvador.me
// @version      0.1
// @description  I don't like Twitter's background.
// @author       Juan José Salvador Piedra
// @match        https://*.twitter.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28653/Twitter%20Night%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/28653/Twitter%20Night%20Mode.meta.js
// ==/UserScript==

$(document).ready(function() {
    var dark = "#444";
    // add your custom colors here

    $('body').css("background-color", dark);
    // add your custom elements here
});