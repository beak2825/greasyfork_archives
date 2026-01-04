// ==UserScript==
// @name         Enable LKComic ComicFury Dropdown Navigation
// @namespace    https://revelromp.com/
// @version      1.0
// @description  Uncomments the dropdown navigation on Latchkey Kingdom's new ComicFury page and adjust the jumpTo function to work.
// @author       Retl
// @match        *://latchkeykingdom.thecomicseries.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394780/Enable%20LKComic%20ComicFury%20Dropdown%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/394780/Enable%20LKComic%20ComicFury%20Dropdown%20Navigation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var sn = document.querySelector("#sidenav");
var newHTML = sn.innerHTML.replace("<!--", "").replace("-->", "");
newHTML = newHTML.replace("jumpTo", "var jumpTo = function (loc) {window.location.href='http://latchkeykingdom.thecomicseries.com/' + loc}; jumpTo");
sn.innerHTML = newHTML;
})();