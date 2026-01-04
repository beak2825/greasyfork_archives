// ==UserScript==
// @name         Emojipedia bandaid 🩹
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fixes for emojipedia
// @author       aolko
// @match        http*://*emojipedia.org*
// @match        http*://emojipedia.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=emojipedia.org
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.1.min.js
// @license      cc-by-sa-4.0
// @downloadURL https://update.greasyfork.org/scripts/452513/Emojipedia%20bandaid%20%F0%9F%A9%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/452513/Emojipedia%20bandaid%20%F0%9F%A9%B9.meta.js
// ==/UserScript==

/*globals $*/


(function() {
    'use strict';
    GM_addStyle(`
            .sidebar > .block{
                border-radius: 8px !important;
            }

            .sidebar > .block li > a{
                display: flex !important;
                align-items: center;
                border-radius: 8px !important;
                gap: 10px;
            }
            .sidebar > .block li > a .emoji{
                display: flex !important;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
            }
        `);
})();

$(function() {
    $("#react-root > .app-nav > nav.emoji-navbar-desktop").remove();
    $(`head`).append(`
        <style>body {padding-left: 0;}</style>
    `);

});