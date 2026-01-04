// ==UserScript==
// @name         1337x to Zeta Torrent Web Interface
// @namespace    https://1337x.to/torrent
// @version      1.0
// @description  This is a very specific script to be used with 1337x.to and Zeta Torrent for android. This scripts create a new link on the download page of 1337x above the magnet button. This new link you open a URL that adds the torrent to yout Zeta Torrent for android with web interface enabled. It's required to inform your zeta's URL in the script.
// @author       You
// @match        https://1337x.to/torrent/*/*
// @icon         https://www.google.com/s2/favicons?domain=1337x.to
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427604/1337x%20to%20Zeta%20Torrent%20Web%20Interface.user.js
// @updateURL https://update.greasyfork.org/scripts/427604/1337x%20to%20Zeta%20Torrent%20Web%20Interface.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var zeta_torrent_url = "http://192.168.1.52:9090/";
    var zeta_torrent_bind_fn = function() {
        if ($("a[href^='magnet:?']").length > 0) {
            var href = $("a[href^='magnet:?']:first").attr("href");
            var classes = $("a[href^='magnet:?']:first").attr("class");
            $("a[href^='magnet:?']").parent().prepend('<a href="' + zeta_torrent_url + 'command/download?urls=' + href + '" target="_blank" style="background-color: #2196f3; margin-bottom: 7px;" class="' + classes + '"><span class="icon zeta" style="background-color: #1976d2"><i class="flaticon-android"></i></span>Send to ZetaTorrent</a><style>.icon.zeta:after { border-left-color: #1976d2; }</style>');
        } else {
            zeta_torrent_setTimeout(bind_fn, 1000);
        }
    }
    $(document).ready(function() {
        zeta_torrent_bind_fn();
    });
})();