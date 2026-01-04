// ==UserScript==
// @name         YoutubePopularUserPage
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Redirects to Most Popular Videos
// @author       ceberous
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34075/YoutubePopularUserPage.user.js
// @updateURL https://update.greasyfork.org/scripts/34075/YoutubePopularUserPage.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var ending = "view=0&sort=p&flow=grid";
    var ytUserPagePattern = /^https:\/\/www.youtube.com\/user\/([^\/]+)\/videos/;
    function checkAndFix() {
        var url = window.location.href;
        if ( ytUserPagePattern.test( url ) ) {
            var wNU = url.split("videos?");
            if ( wNU[1] !== ending ) {
                wNU = wNU[0] + "videos?" + ending;
                window.location.replace( wNU );
            }
        }
    }
    checkAndFix();
    document.addEventListener( "click" , function( event ) { checkAndFix(); });
})();