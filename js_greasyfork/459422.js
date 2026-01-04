// ==UserScript==
// @name         Kinopoisk - folders extender
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Increase size of folders menu and size of scrollbar under poster
// @author       Blackmeser
// @match        https://kinopoisk.ru/*
// @match        https://www.kinopoisk.ru/*
// @match        https://*kinopoisk.ru/*
// @compatible   firefox
// @compatible   chrome
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant    GM_addStyle
// @run-at   document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459422/Kinopoisk%20-%20folders%20extender.user.js
// @updateURL https://update.greasyfork.org/scripts/459422/Kinopoisk%20-%20folders%20extender.meta.js
// ==/UserScript==

GM_addStyle ( `
    .styles_root__JykRA {
        position: relative;
        display: flex;
        flex: 1;
        flex-direction: column;
        min-height: 1200px !important;
    }
` );

GM_addStyle ( `
    .styles_itemWrapper__gbOgm {
        display: inline-flex;
        overflow: auto;
        overflow-y: auto;
        flex-direction: column;
        width: 100%;
        max-height: 500px !important;
        scrollbar-width: thin;
    }
` );

GM_addStyle ( `
    .styles_itemWrapper__gbOgm::-webkit-scrollbar {
        width: 15px !important;
        height: 12px;
    }
` );

/*.styles_itemWrapper__gbOgm {
    display: inline-flex;
    overflow: auto;
    overflow-y: auto;
    flex-direction: column;
    width: 100%;
    max-height: 500px !important;
    scrollbar-width: 20px;
}*/



(function() {
    'use strict';

    // Your code here...
})();
