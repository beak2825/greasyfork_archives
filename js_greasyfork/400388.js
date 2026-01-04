// ==UserScript==
// @name         YWOT Tile Grid
// @namespace    https://greasyfork.org/en/users/501887-spitfirex86
// @version      1.1
// @description  Dotted tile borders.
// @author       ~spitfire
// @match        http*://www.yourworldoftext.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400388/YWOT%20Tile%20Grid.user.js
// @updateURL https://update.greasyfork.org/scripts/400388/YWOT%20Tile%20Grid.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;
    var css='.tilecont {border: 1px dotted #0000002e; outline: 1px dotted #ffffff2e;}';
    $('<style>').attr('type','text/css').html(css).appendTo('head');
})();