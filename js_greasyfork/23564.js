// ==UserScript==
// @name         Add SteamDB info
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add SteamDB.info for lowest price and link
// @author       Shou Ya
// @match        http://store.steampowered.com/app/*
// @match        https://store.steampowered.com/app/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/23564/Add%20SteamDB%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/23564/Add%20SteamDB%20info.meta.js
// ==/UserScript==

(() => {
    'use strict';

    let $ = jQuery;

    let itemId = window.location.pathname.split('/')[2];
    let steamdbUrl = `https://steamdb.info/app/${itemId}/`;

    GM_xmlhttpRequest({
        method: "GET",
        url: steamdbUrl,
        onload: (response) => {
            let $steamdb = $(response.responseText);
            let lowestPrice = $steamdb.find('.owned td:nth-child(4)').first().text();
            let $label = $(`<span>(<a href="${steamdbUrl}" target="_blank">${lowestPrice}</a>)</span>`).css({
                'background-color': 'rgba(70, 117, 117, 0.83)',
                'margin-left': '10px'
            });
            $('.game_purchase_price').first().append($label);
        }
    });

})();
