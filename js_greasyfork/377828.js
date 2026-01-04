// ==UserScript==
// @name         StartPage shortcuts
// @namespace    https://wiki.gslin.org/wiki/StartPage_shortcuts
// @version      0.20190216.0
// @description  Add some shortcuts in StartPage's pages.
// @author       Gea-Suan Lin
// @match        https://www.startpage.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/377828/StartPage%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/377828/StartPage%20shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keyup', function(event) {
        if ('input' === document.activeElement.tagName.toLowerCase()) {
            return;
        }
        if ('d' === event.key) {
            let q = document.getElementById('query').value;
            let q_encoded = encodeURIComponent(q).replace(/%20/g, '+');
            let url = 'https://duckduckgo.com/?ia=&q=' + q_encoded;
            document.location = url;
        }
        if ('g' === event.key) {
            let q = document.getElementById('query').value;
            let q_encoded = encodeURIComponent(q).replace(/%20/g, '+');
            let url = 'https://www.google.com/search?q=' + q_encoded;
            document.location = url;
        }
    });
})();