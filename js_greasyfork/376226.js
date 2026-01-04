// ==UserScript==
// @name	Google Books Page Downloader
// @namespace   https://greasyfork.org/it/scripts/376226  
// @description	Download page from any book from books.google.* - Aggiunge link per scaricar singola immagine del libro
// @include	https://books.google.*
// @version	0.11
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/376226/Google%20Books%20Page%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/376226/Google%20Books%20Page%20Downloader.meta.js
// ==/UserScript==


function update_newa1() {
    src = $ (".pageImageDisplay img")[0].src;
    pgDn = src.split("&");
    pgDn1 = pgDn[2];
    pgDn2 = pgDn1.split("PA")[1]
    newa1.href = src;
    newa1.textContent = "Scarica Pg." + pgDn2;
    newa1.download = "PA" + pgDn2 + ".jpg";
}

var src, pgDn, pgDn1, pgDn2;
var newa1 = document.createElement("a");
newa1.id = "newa1";
newa1.onmousemove=update_newa1;
$ (".jfk-button-label").before(newa1);
update_newa1();
