// ==UserScript==
// @name        Theme baramangaonline
// @namespace   http://tampermonkey.net/
// @version     0.0.1

// @description Theming the styles baramangaonline
// @author      You
// @match       http*://baramangaonline.com/*
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/29607/Theme%20baramangaonline.user.js
// @updateURL https://update.greasyfork.org/scripts/29607/Theme%20baramangaonline.meta.js
// ==/UserScript==

$(".subheader").hide();

var div = document.getElementById("subheader");

if (div) {
    div.style.display = "none"; // Hides it
    // Or
    // div.parentNode.removeChild(div); // Removes it entirely
}

