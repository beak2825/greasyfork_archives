// ==UserScript==
// @name         LpArchieve Night Mode
// @namespace    none
// @version      1
// @description  Night mode for LpArchieve. BTW this thing just changes elements on page without much regard for aestethics. Made it so reading on ipad at night would be a bit more tolerable.
// @author       Mara
// @match        https://lparchive.org/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28668/LpArchieve%20Night%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/28668/LpArchieve%20Night%20Mode.meta.js
// ==/UserScript==

$(document).ready(function() {
    var night = "#111";
    var text = "white";
    $('div, body, html').css("background-color", night);
    $('div#content').css("color", text);
    $('div#content').css("background-color", "#222");
});