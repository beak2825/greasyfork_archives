// ==UserScript==
// @name         [PrivateHD.to] Fix Beta Downloads
// @namespace    pxgamer
// @version      0.2.0
// @description  Trying to download through beta beta.privatehd.to/download/torrent/*.torrent causes a 500 error. Simple bug fix to resolve this.
// @author       pxgamer
// @include      *beta.privatehd.to/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22335/%5BPrivateHDto%5D%20Fix%20Beta%20Downloads.user.js
// @updateURL https://update.greasyfork.org/scripts/22335/%5BPrivateHDto%5D%20Fix%20Beta%20Downloads.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';

    $('a[href^="https://beta.privatehd.to/download/"]').each(function(){
        let newLink = $(this).attr('href').replace('beta.','');
        $(this).attr('href', newLink);
    });
})();
