// ==UserScript==
// @name         Wykop propaganda blocker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Blokuje propagandowe wpisy
// @author       You
// @match        http://www.wykop.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28164/Wykop%20propaganda%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/28164/Wykop%20propaganda%20blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    var blockedSources = [
        // lewica
        'neuropa.pl', 'wiadomo.co', 'wyborcza.pl',
        'www.tvn24.pl', 'fakty.tvn24.pl', 'tvnwarszawa.tvn24.pl',
        'www.rmf24.pl',
        'oko.press'
    ];
    
    var blockedUsers = [
        'Zdejm_Kapelusz', 'Ospen'
    ];
    
    // advertisments
    jQuery('a[href="http://www.wykop.pl/reklama/"]').parents('.article').hide();

    // websites
    jQuery('.article span.create a.affect').each( function(_, article) {
        var source = article.hostname;
        if (jQuery.inArray(source, blockedSources) > -1) {
            console.log("blocked host: " + source);
            jQuery(article).parents('.article').hide();
        }
    });
    
    // users - mirko
    jQuery('div.wblock a.showProfileSummary b').each( function(_, node) {
        var nick = node.innerHTML;
        if (jQuery.inArray(nick, blockedUsers) > -1) {
            console.log('blocked user: ' + nick);
            jQuery(node).parents('.wblock').hide();
        }
    });
})();