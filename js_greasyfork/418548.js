// ==UserScript==
// @name         YggTorrent weserv Fix
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Fix Weserv URL
// @author       NoTag ;)
// @match        https://www2.yggtorrent.si/torrent/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418548/YggTorrent%20weserv%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/418548/YggTorrent%20weserv%20Fix.meta.js
// ==/UserScript==

/* global $:readonly */

(function() {
    $("img").each(function(){
        $(this).attr("src", $(this).attr('src').replace(/https:\/\/images.weserv.nl\/\?url=/g, ''));
        });
})();