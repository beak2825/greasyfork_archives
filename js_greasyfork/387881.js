// ==UserScript==
// @name         magicspoiler.com link for scryfall
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a link to look for current Magic The Gathering card in http://www.magicspoiler.com/
// @require      http://code.jquery.com/jquery-latest.js
// @author       rightdroid
// @match        https://scryfall.com/card/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387881/magicspoilercom%20link%20for%20scryfall.user.js
// @updateURL https://update.greasyfork.org/scripts/387881/magicspoilercom%20link%20for%20scryfall.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let $ = jQuery,
    url = $(location).attr('href'),
    parts = url.split("/"),
    cardName = parts[parts.length-1],
    cardNamePretty = $('meta[property="og:title"]').attr('content'),
    constructedUrl = 'http://www.magicspoiler.com/mtg-spoiler/' + cardName,
    style = 'width:100%;height:100%;display:inline-block;position:relative;padding:5px;',
    btnText = 'MagicSpoiler lookup [' + cardNamePretty + ']',
    node = '<li class="button-n"><a href="' + constructedUrl +'" target="_blank" class="mspoiler-link" title="'+btnText+'">'+btnText+'</a></li>';

    $('.toolbox-column:first-of-type ul.toolbox-links').prepend(node);
    $('.mspoiler-link').css({
        'width' : '100%',
        'height' : '100%',
        'display' : 'inline-block',
        'position' : 'relative',
        'padding' : '5px',
        'overflow': 'hidden',
        'text-overflow' : 'ellipsis',
        'white-space' : 'nowrap',
    });
})();