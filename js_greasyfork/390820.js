// ==UserScript==
// @name        YGGTorrent Direct Download Button
// @version     2
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @match       https://*.yggtorrent.li/*
// @description Insert download link next the NFO icon
// @grant       none
// @namespace https://greasyfork.org/users/384032
// @downloadURL https://update.greasyfork.org/scripts/390820/YGGTorrent%20Direct%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/390820/YGGTorrent%20Direct%20Download%20Button.meta.js
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