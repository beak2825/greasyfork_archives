// ==UserScript==
// @name         nyaa.si anilist search
// @description  Turns the torrent title into a search for the anime on Anilist.
// @namespace    https://twitter.com/griindhouse

// @match        https://nyaa.si/view/*
// @grant        none
// @version      0.1
// @author       Griindhouse
// @description  26/12/2023, 18:51:47
// @downloadURL https://update.greasyfork.org/scripts/483184/nyaasi%20anilist%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/483184/nyaasi%20anilist%20search.meta.js
// ==/UserScript==

// Based on anidb script (https://update.greasyfork.org/scripts/376599/AniDB%20search%20for%20Nyaa.user.js)

var $ = unsafeWindow.jQuery;

(function() {
    'use strict';

    // from https://stackoverflow.com/a/9756789/8267008
    function quoteattr(s) {
        return ('' + s)
            .replace(/&/g, '&amp;')
            .replace(/'/g, '&apos;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\r\n/g, '&#13;')
            .replace(/[\r\n]/g, '&#13;');
    }

    // the part about Japanese characters is adapted from http://www.localizingjapan.com/blog/2012/01/20/regular-expressions-for-japanese-text/
    let h3 = $('div.container > div.panel > div.panel-heading > h3.panel-title').first(),
        text = h3.text(),
        title = text.replace('_',' ').replace(/^\s*\[[^\]]+\]\s*/,'').replace(/[[(].*/,'').replace(/ - [0-9]+.*/,'').replace(/\s+S(eason)?\s*[0-9]+\s+(E\s*[0-9]+\s+)?/ig,' ').replace(/[^a-zA-Zぁ-ゟ゠-ヿ㐀-䶵一-鿋豈-頻⺀-⿕ｦ-ﾟ]+/g,' '),
        // url = 'https://anidb.net/perl-bin/animedb.pl?adb.search=' + quoteattr(title) + '&show=animelist&do.search=search',
        url = 'https://anilist.co/search/anime?search=' + quoteattr(title) + '&sort=SEARCH_MATCH',
        h3_with_link = $('<h3 class="panel-title"><a href="'+url+'">'+text+'</a></h3>');
    h3.replaceWith(h3_with_link);
})();