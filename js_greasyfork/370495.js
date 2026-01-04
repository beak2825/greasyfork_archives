// ==UserScript==
// @name         Ihikarinoakariost.info direct link generator.
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  Decodes and replaces all links to the direct URI format, bypassing the 3 second wait redirector page.
// @author       MooreR [http://moorer-software.com]
// @include      https://hikarinoakariost.info/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/370495/Ihikarinoakariostinfo%20direct%20link%20generator.user.js
// @updateURL https://update.greasyfork.org/scripts/370495/Ihikarinoakariostinfo%20direct%20link%20generator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var linkSections;
    var i = 0;
    var allLinks = $('a');
    if(allLinks.length != 0){
        $.each( allLinks, function( key, value ) {
            if(value.href.indexOf('/out/?') != -1){
                var linkSections = value.href.split('/?');
                value.setAttribute('href', atob(linkSections[1]));
            }
        });
    }
})();