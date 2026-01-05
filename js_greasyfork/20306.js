// ==UserScript==
// @name         Skip quang cao phimmoi.net
// @namespace    http://www.phimmoi.net
// @version      1.0
// @description  Skip quang cao
// @author       Jkiller295
// @require 	http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @include 	http://www.phimmoi.net/*

// @downloadURL https://update.greasyfork.org/scripts/20306/Skip%20quang%20cao%20phimmoinet.user.js
// @updateURL https://update.greasyfork.org/scripts/20306/Skip%20quang%20cao%20phimmoinet.meta.js
// ==/UserScript==

function removeAd()
{
   $("#preroll-overlay").remove();
}
var tid = setInterval(removeAd, 2000);
$(document).ready(function()
{
    removeAd();
});

