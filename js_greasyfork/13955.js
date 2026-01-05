// ==UserScript==
// @name            What.CD Format Highlighter
// @description   Allow a user stylesheet to highlight different formats on what.cd
// @version         1.2
// @include         https://what.cd/torrents.php*
// @include         https://what.cd/artist.php*
// @include         https://what.cd/collages.php*
// @include         https://what.cd/bookmarks.php*
// @grant             none
// @run-at           document-end
// @namespace https://greasyfork.org/users/20304
// @downloadURL https://update.greasyfork.org/scripts/13955/WhatCD%20Format%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/13955/WhatCD%20Format%20Highlighter.meta.js
// ==/UserScript==
var els = document.getElementsByClassName('torrent_row'),
es,
text,
text2;
[].forEach.call(els, function (e, i, a) {
        es = e.childNodes[1];
        text = es.childNodes[3].textContent.split(' / ');
        for (var x in text) {
            text[x] = '<a class=\'' + text[x].split(' ')[0] + ' torrent_label tooltip tl_free\' style=\'white-space: nowrap;\'>' + text[x] + '</a>';
        }
        es.childNodes[3].innerHTML = text.join(' / ');
});
var els = document.getElementsByClassName('torrent_info'),
es,
text,
text2;
[].forEach.call(els, function (e, i, a) {
        text = e.textContent.split(' / ');
        for (var x in text) {
            text[x] = '<a class=\'' + text[x].split(' ')[0] + ' torrent_label tooltip tl_free\' style=\'white-space: nowrap;\'>' + text[x] + '</a>';
        }
        e.innerHTML = text.join(' / ');
});