// ==UserScript==
// @name        Remove Chess.com User Stylesheets
// @namespace   http://xyxyx.org/
// @description Remove custom stylesheets from group and user pages
// @include     http://www.chess.com/*
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/495/Remove%20Chesscom%20User%20Stylesheets.user.js
// @updateURL https://update.greasyfork.org/scripts/495/Remove%20Chesscom%20User%20Stylesheets.meta.js
// ==/UserScript==

var links = document.getElementsByTagName("link");
console.log("links = " + links);
for (var i = 0; i < links.length; i++) {
    var link = links.item(i);
    var rel = link.getAttribute("rel");
    console.log("Rel = " + rel);
    if (rel === "stylesheet") {
        var href = link.getAttribute("href");

        if (!href.match( /custom_group_css/ ) && !href.match( /custom_css/ )) {
            console.log("Leaving CSS: " + href);
        } else {
            console.log("Removing CSS: " + href);
            link.disabled = true;
        }
    }
}

