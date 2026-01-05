// ==UserScript==
// @name         RARBG Show thumbnails in torrent lists
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Shows the thumbnail on every item of the torrent list.
// @author       French Bond
// @match        https://rarbg.to/torrents.php*
// @match        https://rarbg.to/top10
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24117/RARBG%20Show%20thumbnails%20in%20torrent%20lists.user.js
// @updateURL https://update.greasyfork.org/scripts/24117/RARBG%20Show%20thumbnails%20in%20torrent%20lists.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Show the thumbnails on RARBG listing

$('.lista a').each(function() {
    var string = $(this).attr('onmouseover');
    var regExp = /\\'([^)]+)\\'/;
    var matches = regExp.exec(string);
    if (matches) {
        var img = '<img src="' + matches[1] + '" height="120">';
        $(this).prepend(img);
    }
});