// ==UserScript==
// @name          Pinboard.in bookmarks with favicons
// @namespace     http://userscripts.org/users/260303
// @description   Adds favicons for bookmarks at http://pinboard.in/.
// @author        Maranchuk Sergey <slav0nic0@gmail.com>
// @include       *://pinboard.in/*
// @version       0.3
// @downloadURL https://update.greasyfork.org/scripts/3514/Pinboardin%20bookmarks%20with%20favicons.user.js
// @updateURL https://update.greasyfork.org/scripts/3514/Pinboardin%20bookmarks%20with%20favicons.meta.js
// ==/UserScript==


var bookmarks = document.getElementsByClassName('bookmark_title');

for (var i = 0; i < bookmarks.length; i++) {
    bookmarks[i].innerHTML = '<img src="https://external-content.duckduckgo.com/ip3/' + bookmarks[i].href.split(/\/+/g)[1] + '.ico" height="14" width="14" loading="lazy"/> ' + bookmarks[i].innerHTML;
}
