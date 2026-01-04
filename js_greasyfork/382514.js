// ==UserScript==
// @name        PTP Replace Torrent Icons (generic)
// @namespace   https://passthepopcorn.me/user.php?id=121003
// @description Replaces unicode check mark chars with images.
// @include     https://passthepopcorn.me/torrents.php*
// @include     https://passthepopcorn.me/artist.php?*
// @include     https://passthepopcorn.me/collages.php?*
// @include     https://passthepopcorn.me/bookmarks.php*
// @exclude     /^https://passthepopcorn.me/torrents.php?.*\bid=.*$/
// @version     1.2
// @run-at      document-end
// @grant       none
// @icon        https://ptpimg.me/732co1.png
// @downloadURL https://update.greasyfork.org/scripts/382514/PTP%20Replace%20Torrent%20Icons%20%28generic%29.user.js
// @updateURL https://update.greasyfork.org/scripts/382514/PTP%20Replace%20Torrent%20Icons%20%28generic%29.meta.js
// ==/UserScript==

var stringsMap = {
  '☐': '<img src="/static/common/x.png">',
  '☑': '<img src="/static/common/check.png">',
  '✿': '<img src="/static/common/quality.gif">'
},
regex = new RegExp(Object.keys(stringsMap).join('|'), 'gi'),
rowSelector = 'tr.basic-movie-list__torrent-row > td:not([colspan]):nth-child(1), ' + 
              'tr.compact-movie-list__details-row > td[colspan="1"]';

var rows = document.querySelectorAll(rowSelector);
rows.forEach(function (row) {
  row.innerHTML = row.innerHTML.replace(regex, function (match) {
    return stringsMap[match];
  });
});
