// ==UserScript==
// @name         IGG-Games.com Direct Downloads
// @namespace    http://tampermonkey.net/
// @version      1.0.8
// @description  IGG Games download links all contain multiple forwarders before you get the actual download link. This automatically re-formats each available download link to be direct.
// @author       MooreR [http://moorer-software.com]
// @include      https://igg-games.com/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20656/IGG-Gamescom%20Direct%20Downloads.user.js
// @updateURL https://update.greasyfork.org/scripts/20656/IGG-Gamescom%20Direct%20Downloads.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var linkSections;
    var i = 0;
    var allLinks = $('a');
    if(allLinks.length != 0){
        $.each( allLinks, function( key, value ) {
            if(value.href.indexOf('xurl=') != -1){
                //console.log(value.href);
                var linkSections = value.href.split('://');
                value.setAttribute('href', '//' + linkSections[2]);
            }
            if(value.href.indexOf('-download.html') != -1){
                value.setAttribute('target', '_blank');
            }
        });
    }
})();