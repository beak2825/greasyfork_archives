// ==UserScript==
// @name         Lichess Board Coords
// @namespace    https://en.lichess.org/
// @version      1.1
// @description  Add coords and other features to lichess board
// @author       Abuda Dumiaty
// @match        https://*.lichess.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21138/Lichess%20Board%20Coords.user.js
// @updateURL https://update.greasyfork.org/scripts/21138/Lichess%20Board%20Coords.meta.js
// ==/UserScript==
var rev = $('.cg-board').hasClass('orientation-black') ? "rev" : "";
$(document).ready(function() {
    $(".cg-board").attr("style", "background-image: url(https://res.cloudinary.com/abuda/image/upload/v1467632336/greycoords" + rev + ".jpg)");
    $("<style>").text(".cg-board > square { opacity: 0.6; }").appendTo("head");
    $(document).keypress(function(event) {
        if (event.which == 102 && !$("input").is(":focus") && !$("textarea").is(":focus")) {
            rev = (rev === "") ? "rev" : "";
            $(".cg-board").attr("style", "background-image: url(https://res.cloudinary.com/abuda/image/upload/v1467632336/greycoords" + rev + ".jpg)");
        }
    });
});