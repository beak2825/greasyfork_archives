// ==UserScript==
// @name         Direct Links From Steam
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Skips Steam's redirect page and causes external site links to be direct.
// @author       Guessed#8822
// @license      MIT
// @include      https://steamcommunity.com/*
// @include      https://store.steampowered.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/441486/Direct%20Links%20From%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/441486/Direct%20Links%20From%20Steam.meta.js
// ==/UserScript==

$(document).ready(function() {
    $('a').each(function() {
        try {
        if($(this).attr('href').indexOf('linkfilter') > -1) { //this looks for urls that include the redirect page
            var wrkstr = $(this).attr('href');
            wrkstr = wrkstr.slice(wrkstr.indexOf('url=http')+4); //slice off everything before the url= parameter
            if (wrkstr.indexOf('&') > -1) {
                wrkstr = wrkstr.substring(0, wrkstr.indexOf('&')); //remove any parameters after url
            }
            $(this).attr('href', wrkstr); //write the fixed URL to the href attribute
        }
        } catch(error) { //this handles a-tags that have no href value
        }
    });
});