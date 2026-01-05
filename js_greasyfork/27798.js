// ==UserScript==
// @name        TorrentShack.me Fixes
// @namespace   torrentshackme-fixes
// @description Misc fixes for TorrentShack.me
// @version     6
// @include     http://www.torrentshack.me*
// @include     https://www.torrentshack.me*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27798/TorrentShackme%20Fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/27798/TorrentShackme%20Fixes.meta.js
// ==/UserScript==

$(function() {

  var rsl_type = "release_type=" + $("input[name=release_type]:checked").val();

  $("#torrent_table a[href*=\\?filter_cat]").attr('href', function(i, h) {
    return h + (h.indexOf('?') != -1 ? "&"+rsl_type : "?"+rsl_type);
  });

});