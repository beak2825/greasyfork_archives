// ==UserScript==
// @name         RARBG thumbnails
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Shows the thumbnail on every item of the torrent list.
// @author       Phus Lu
// @match        https://rarbgprx.org/torrents.php*
// @match        https://rarbgproxy.org/torrents.php*
// @match        https://proxyrarbg.org/torrents.php*
// @match        https://rargb.to/torrents.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390064/RARBG%20thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/390064/RARBG%20thumbnails.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

// Show the thumbnails on RARBG listing

$('.lista2').each(function() {
    var link = $("td.lista:eq(1) a[onmouseover]", this)
	if (link.length) {
        $("td.lista:first-of-type img", this).attr("src", /src=\\'(.*?)\\'/ig.exec(link.attr("onmouseover").toString())[1])
	}
});