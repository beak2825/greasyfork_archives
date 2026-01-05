// ==UserScript==
// @name        Bibliotik - Highlight Retail
// @namespace   bibliotik-highlight-retail
// @include     http*://bibliotik.me/*torrents*
// @include     http*://bibliotik.me/collections/*
// @include     http*://bibliotik.me/uploads*
// @include     http*://bibliotik.me/users/*
// @include     http*://bibliotik.me/tags/*/torrents/*
// @include     http*://bibliotik.me/creators/*/torrents/*
// @include     http*://bibliotik.me/publishers/*/torrents/*
// @include     http*://bibliotik.me/bookmarks*
// @grant	none
// @version     0.2.1
// @description color highlight for retail
// @downloadURL https://update.greasyfork.org/scripts/16532/Bibliotik%20-%20Highlight%20Retail.user.js
// @updateURL https://update.greasyfork.org/scripts/16532/Bibliotik%20-%20Highlight%20Retail.meta.js
// ==/UserScript==

var spans = document.querySelectorAll('span.title');
for (var i=0; cell=spans[i].parentNode; i++) {
    if (cell.textContent.indexOf("[Retail]") != -1) {
        cell.style.backgroundColor='#FFF5DB';
        if (cell.textContent.indexOf("[MOBI]") != -1 || cell.textContent.indexOf("[AZW3]") != -1) {
            cell.style.backgroundColor='#BFFFC6'
        }
        if (cell.textContent.indexOf("[PDF]") != -1) {
            cell.style.backgroundColor='#FFDBF0';
        }
        if (cell.textContent.indexOf("[EPUB]") != -1) {
            cell.style.backgroundColor='#DBFFFF';
        }
    }
    else {
        if (cell.textContent.indexOf("[MOBI]") != -1 || cell.textContent.indexOf("[AZW3]") != -1) {
            cell.style.backgroundColor='#E6FFE8';
        }
    }
    //else if (cell.textContent.indexOf("[Freeload!]") != -1) {
    //    cell.style.backgroundColor='#FFFFCC';
    //}
}