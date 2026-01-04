// ==UserScript==
// @name        E-Hentai Show Filenames
// @description Shows filenames under images in galleries 
// @author      sanitysama
// @namespace   95.211.209.53-e85f8079-b847-455f-b080-8467e2977711@sanitysama
// @include     https://exhentai.org/g/*/*/*
// @include     https://e-hentai.org/g/*/*/*
// @description Shows filenames under images in galleries
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js
// @version     1.1.1
// @downloadURL https://update.greasyfork.org/scripts/392940/E-Hentai%20Show%20Filenames.user.js
// @updateURL https://update.greasyfork.org/scripts/392940/E-Hentai%20Show%20Filenames.meta.js
// ==/UserScript==

// This script is from:
// https://userscripts-mirror.org/scripts/show/171622

$(document).ready(function() {

    $('.gdtl').attr('style','height: 327px');
    $('.gdtl a').attr('style','word-wrap: break-word').each(function() {
        var fn = $(this).find('img').map(function() {
            return this.title;
        }).get();
        $(this).append(' - ' + fn);
    });

});