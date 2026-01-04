// ==UserScript==
// @name        YGGTorrent Direct Download Button V2.1
// @version     2.1.1
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @match       https://*.yggtorrent.*/*
// @description Insert download link next the NFO icon
// @grant       none
// @namespace https://greasyfork.org/fr/users/166827-sakimotor
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487662/YGGTorrent%20Direct%20Download%20Button%20V21.user.js
// @updateURL https://update.greasyfork.org/scripts/487662/YGGTorrent%20Direct%20Download%20Button%20V21.meta.js
// ==/UserScript==

jQuery(function ($) {

    // We need to wait a few seconds since some tables are dynamically loaded
    setTimeout(function () {
        $("[id=get_nfo]").each(function () {
            var nfoLink = $(this);
            nfoLink.addClass("foo");
            var target = nfoLink.attr("target");
            nfoLink.after("<a href=\"/engine/download_torrent?id=" + target + "\" ><span class=\"ico_download\"></span></a>");
        });
    }, 3000);
});