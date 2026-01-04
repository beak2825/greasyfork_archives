// ==UserScript==
// @name         Hide Images On Hover
// @namespace    https://www.landviz.nl/what-is-a-namespace
// @version      0.2
// @description  Hide images
// @author       Landviz
// @match        https://www.cubecraft.net/threads/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39058/Hide%20Images%20On%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/39058/Hide%20Images%20On%20Hover.meta.js
// ==/UserScript==

var hoveringOverImage = false;
var image;

$("a.avatar img").on("mouseenter", function() {
    hoveringOverImage = true;
    image = this;
});

$("a.avatar img").on("mouseleave", function() {
    hoveringOverImage = false;
    image = null;
});

$('html').keyup(function(e){
    if(hoveringOverImage) {
        image.src = "http://via.placeholder.com/120x120";
        console.log("asd");
    }
});