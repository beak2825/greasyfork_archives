// ==UserScript==
// @name heise.de Auf einer Seite lesen
// @namespace
// @description opens articles always on one page
// @author Flo, dielec
// @match https://www.heise.de/*
// @version 16
// @grant none
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/30859/heisede%20Auf%20einer%20Seite%20lesen.user.js
// @updateURL https://update.greasyfork.org/scripts/30859/heisede%20Auf%20einer%20Seite%20lesen.meta.js
// ==/UserScript==

var links, thisLink, i;

// Ersten "auf einer Seite lesen"-Link laden.
// Das funktioniert auch dann, wenn man auf einer Spezialseiten wie
// about:newtab auf einen Link klickt.

links = document.evaluate("//a[contains(@href, 'seite=all')]", document, null,
XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

for (i = 0; i < links.snapshotLength; i++) {
thisLink = links.snapshotItem(i);
if (thisLink.textContent.indexOf("Auf einer Seite lesen") >= 0) {
window.location.replace(thisLink.href);
break;
}
}

// Auf heise.de zu allen Artikel-Links den Parameter "seite=all" hinzufügen,
// damit ein Neuladen mit der obigen Methode nicht nötig ist.
// Umleitungen wie z.B. von "heise.de/meldung" zu "heise.de/newsticker/meldung"
// müssen vermieden werden, damit der Parameter erhalten bleibt.

links = document.evaluate("//a[ \
contains(@href, 'meldung') or \
contains(@href, 'tp/features') or \
contains(@href, 'make/artikel') or \
contains(@href, 'autos/artikel') or \
contains(@href, 'meinung') or \
contains(@href, '/hintergrund') or \
contains(@href, '/select') or \
contains(@href, '/ratgeber') or \
contains(@href, '/news') or \
contains(@href, '/tests') \
]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

for (i = 0; i < links.snapshotLength; i++) {
thisLink = links.snapshotItem(i);
thisLink.href = thisLink.href.replace(/heise\.de\/meldung/, 'heise.de/newsticker/meldung');
thisLink.href = thisLink.href.replace(/\.html\?|\.html/, '.html?artikelseite=all&seite=all&');
}