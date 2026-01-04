// ==UserScript==
// @name         Add Game Title in PS Store
// @version      0.1
// @namespace    https://greasyfork.org/users/179168
// @description  As title for the new PS Store
// @match        https://store.playstation.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/414913/Add%20Game%20Title%20in%20PS%20Store.user.js
// @updateURL https://update.greasyfork.org/scripts/414913/Add%20Game%20Title%20in%20PS%20Store.meta.js
// ==/UserScript==

(function() {
    'use strict';
    waitForKeyElements('div.ems-sdk-product-tile-image__container span img', addGameTitle);

    function addGameTitle (jNode) {
        var alt = $(jNode).attr('alt');
        var grandpa = $(jNode).parent().parent().parent().parent();
        if ($(grandpa).find('section div.game-title').length == 0) {
            $(grandpa).find('section div.price__container').before('<div class="game-title">' + alt + '</div>');
        }
    }
})();

GM_addStyle( `
    .game-title {
        font-size: 14px;
        margin-top: .25rem;
        overflow: hidden;
        display: block;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
`);