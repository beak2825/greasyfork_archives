// ==UserScript==
// @name         Wasabi Visited Links
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Track progress in Wasabi
// @author       Cezille07
// @match        https?://(www\.)?wasabi-jpn.com/*
// @match        https://www.wasabi-jpn.com/japanese-grammar/wasabis-online-japanese-grammar-reference/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381504/Wasabi%20Visited%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/381504/Wasabi%20Visited%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var styleEl = document.createElement('style');
    styleEl.type = 'text/css';
    var css = 'a:visited { color: red }';
    var text = document.createTextNode(css);
    styleEl.appendChild(text);
    document.head.append(styleEl);
})();