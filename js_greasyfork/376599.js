// ==UserScript==
// @name         AniDB search for Nyaa
// @namespace    http://sushiyuki/
// @version      0.1
// @description  Turns the torrent title into a search for the anime on AniDB.
// @author       Yuki
// @match        https://nyaa.si/view/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/376599/AniDB%20search%20for%20Nyaa.user.js
// @updateURL https://update.greasyfork.org/scripts/376599/AniDB%20search%20for%20Nyaa.meta.js
// ==/UserScript==

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
        url = 'https://anidb.net/perl-bin/animedb.pl?adb.search=' + quoteattr(title) + '&show=animelist&do.search=search',
        h3_with_link = $('<h3 class="panel-title"><a href="'+url+'">'+text+'</a></h3>');
    h3.replaceWith(h3_with_link);
})();