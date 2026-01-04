// ==UserScript==
// @name         AmiAmi Stock Levels
// @namespace    https://tharglet.me.uk/
// @version      1.4
// @description  Display stock level on AmiAmi product pages
// @author       tharglet
// @match        https://www.amiami.com/eng/*
// @require      http://code.jquery.com/jquery-2.1.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/420195/AmiAmi%20Stock%20Levels.user.js
// @updateURL https://update.greasyfork.org/scripts/420195/AmiAmi%20Stock%20Levels.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $().ready(() => {
        let oldHref = '';
        new MutationObserver(function(mutations) {
            if(oldHref != window.location.href) {
                $('.aasl-stock-available').remove();
                oldHref = window.location.href;
                if(oldHref.includes('scode') || oldHref.includes('gcode')) {
                    $('.item-detail__section-title').after(`<p class='item-detail__jpn aasl-stock-available'>Stock available: <i>Who knows?</i></p>`);
                }
            }
        }).observe(
            document.querySelector('title'),
            { subtree: true, characterData: true, childList: true }
        );
    });
})();