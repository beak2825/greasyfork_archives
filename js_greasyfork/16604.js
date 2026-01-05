// ==UserScript==
// @name         MyAnimeList(MAL) - Popup for "Edit Details"
// @version      1.1.2
// @description  This script will show a popup when you click "Edit details" on any anime/manga page.
// @author       Cpt_mathix
// @match        https://myanimelist.net/anime/*
// @match        https://myanimelist.net/manga/*
// @match        https://myanimelist.net/anime.php*
// @match        https://myanimelist.net/manga.php*
// @exclude      /^https?:\/\/myanimelist\.net\/(anime|manga)\/[^0-9]+/
// @license      GPL-2.0-or-later
// @grant        none
// @namespace https://greasyfork.org/users/16080
// @downloadURL https://update.greasyfork.org/scripts/16604/MyAnimeList%28MAL%29%20-%20Popup%20for%20%22Edit%20Details%22.user.js
// @updateURL https://update.greasyfork.org/scripts/16604/MyAnimeList%28MAL%29%20-%20Popup%20for%20%22Edit%20Details%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function popupForEditDetails() {
        var pageEdit = document.querySelector('#addtolist > table > tbody > tr > td:nth-child(2) > small > a');
        if (pageEdit) {
            pageEdit.className = "Lightbox_Script button_add";
            pageEdit.href += "?hideLayout=1";
        }

        var pageAddDetails = document.querySelector('#addtolistresult > a');
        if (pageAddDetails) {
            pageAddDetails.className = "Lightbox_Script button_add";
            pageAddDetails.href += "&hideLayout=1";
        }

        $('.Lightbox_Script').fancybox({
            'width'			: 700,
            'height'		: '85%',
            'overlayShow'	: false,
            'titleShow'     : false,
            'type'          : 'iframe'
        });
    }

    var script = document.createElement('script');
    script.appendChild(document.createTextNode('('+ popupForEditDetails +')();'));
    (document.body || document.head || document.documentElement).appendChild(script);
})();