// ==UserScript==
// @name         KissAnime Anti Anti-AdBlocker
// @namespace    https://kissanime.to/
// @version      0.2
// @description  KissAnime I am disappoint. I'm in your scripts murdering your code.
// @author       You
// @match        *://*.kissanime.to/*
// @require      http://code.jquery.com/jquery-latest.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20098/KissAnime%20Anti%20Anti-AdBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/20098/KissAnime%20Anti%20Anti-AdBlocker.meta.js
// ==/UserScript==

function waitForVideo() {
    if ($('video').parent().hasClass('vjs-playing')) {
        $('body').find('a').each(function (index) {
            if ($(this).html() === 'Hide') $(this).click();
        });
        return;
    }
    setTimeout(waitForVideo, 500);
}

(function() {
    'use strict';

    $('body').find('iframe').each(function (index) {
        if ($(this).attr('src') === '/xyz/check.aspx') $(this).remove();
    });
    if ($('body').find('video').length > 0) setTimeout(waitForVideo, 3000);
})();
