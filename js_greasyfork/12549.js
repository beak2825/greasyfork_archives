// ==UserScript==
// @name       KAT - Open All Torrent Links
// @namespace  OpenAllTorrents
// @version    1.00
// @description  Highlight torrent links on mod work thread then right click to open
// @include       *kat.cr/community/show/torrents-need-updating-kat-changing-mod-work-thread-only-v5/*
// @downloadURL https://update.greasyfork.org/scripts/12549/KAT%20-%20Open%20All%20Torrent%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/12549/KAT%20-%20Open%20All%20Torrent%20Links.meta.js
// ==/UserScript==

$('div[id^="content_"]').mousedown(function(e) 
{
    if (e.button == 2)
    {
        var text=getSelectedText();
        var regex = /https:\/\/kat\.cr\/.+\.html#?/g; 
        var m;
        while ((m = regex.exec(text)) !== null)
        {
            window.open(m, "_blank");
        }
    }
});

function getSelectedText() {
    if (window.getSelection) {
        return window.getSelection().toString();
    } else if (document.selection) {
        return document.selection.createRange().text;
    }
    return '';
}