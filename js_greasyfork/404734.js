// ==UserScript==
// @name         Reddit: Bigger Arrows
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.reddit.com/r/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/404734/Reddit%3A%20Bigger%20Arrows.user.js
// @updateURL https://update.greasyfork.org/scripts/404734/Reddit%3A%20Bigger%20Arrows.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function GM_addStyle(css) {
        const style = document.getElementById("GM_addStyle") || (function() {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = "GM_addStyle";
            document.head.appendChild(style);
            return style;
        })();
        const sheet = style.sheet;
        sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
    }

    GM_addStyle ( '.voteButton { height:50px!important;width:50px!important;}' );
    GM_addStyle ( '.voteButton>span{width :50px}' );
    GM_addStyle ( 'i.icon-upvote{font-size:25px}' );
    GM_addStyle ( 'i.icon-downvote{font-size:25px}' );

})();