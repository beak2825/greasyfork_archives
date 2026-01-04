// ==UserScript==
// @name         BT之家
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  try to take over the world!
// @author       Leo
// @match        *://*.btbtt88.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40722/BT%E4%B9%8B%E5%AE%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/40722/BT%E4%B9%8B%E5%AE%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var links = document.querySelectorAll( 'a.ajaxdialog[ajaxdialog="{showtitle: false, cache: true, position: 6, modal: false}"]' );
    [].forEach.call(links, function(link) {
        link.click();
    });
})();