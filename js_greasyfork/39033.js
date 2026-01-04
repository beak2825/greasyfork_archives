// ==UserScript==
// @name         Add download links on Japanesepod101 site
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Search for <source> tags and append download urls below them
// @author       CometZero
// @include      *japanesepod101*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/39033/Add%20download%20links%20on%20Japanesepod101%20site.user.js
// @updateURL https://update.greasyfork.org/scripts/39033/Add%20download%20links%20on%20Japanesepod101%20site.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('audio').each(function( index ) {

        var source = $(this).find('source').attr('src');

        if ( source != '' ) {
            $(this).after('<a href="' + source + '" class="audio-download" download>Download</a>');
        }

    });

    GM_addStyle("a.audio-download{margin-top:1em;background:#eee;padding:.2em 1em;border-radius:5px;display:inline-block;text-decoration: none;color: black;}a.audio-download:hover{background:#ddd}");
})();