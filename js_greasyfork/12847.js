// ==UserScript==
// @name         ExtraTorrent Direct Torrent Link
// @namespace    http://www.duh.org/
// @version      0.1
// @description  Skips the interstitial page for ExtraTorrent links
// @author       tv@duh.org
// @match        https://extratorrent.cc/torrent/*
// @grant        none
// @copyright    Public domain
// @downloadURL https://update.greasyfork.org/scripts/12847/ExtraTorrent%20Direct%20Torrent%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/12847/ExtraTorrent%20Direct%20Torrent%20Link.meta.js
// ==/UserScript==

window.addEventListener("load", function() {
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; ++i) {
        var a = links[i];
        var n = a.href.indexOf("/torrent_download/");
        if (n >= 0) {
            a.href = a.href.substring(0, n) + "/download/" + a.href.substring(n + 18);
        }
    }
}, false);