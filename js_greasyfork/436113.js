// ==UserScript==
// @name         Move to PC Page on Wikipedia
// @version      0.1
// @description  move from mobile page to PC page on Wikipedia, Wiktionary etc...
// @author       Linuxmetel
// @namespace    https://twitter.com/linuxmetel
// @license      MIT

// @match        *.m.wikipedia.org/*
// @match        *.m.wiktionary.org/*
// @match        *.m.wikibooks.org/*
// @match        *.m.wikisource.org/*
// @match        *.m.wikinews.org/*
// @match        *.m.wikiversity.org/*
// @match        *.m.wikidata.org/*
// @match        *.m.wikimedia.org/*
// @match        *.m.wikiquote.org/*
// @match        *.m.wikivoyage.org/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436113/Move%20to%20PC%20Page%20on%20Wikipedia.user.js
// @updateURL https://update.greasyfork.org/scripts/436113/Move%20to%20PC%20Page%20on%20Wikipedia.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var re=/^(.*)m\.(.*)$/;
    location.host = location.host.replace(re, "$1$2");
    // Your code here...
})();