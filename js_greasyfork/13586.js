// ==UserScript==
// @name         Jvc Blacklist Topics
// @namespace    https://choco.ovh
// @version      0.1
// @description  Blacklist les topics à partir d'une liste de mots clés
// @author       Chocolayte
// @match        http://www.jeuxvideo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13586/Jvc%20Blacklist%20Topics.user.js
// @updateURL https://update.greasyfork.org/scripts/13586/Jvc%20Blacklist%20Topics.meta.js
// ==/UserScript==

function blacklistTopic()
{
    if (!RegExp('^http://www.jeuxvideo.com/forums/').test(location)) {
         return;
    }
    // NEW selector
    jQuery.expr[':'].Contains = function(a, i, m) {
        return jQuery(a).text().toUpperCase()
        .indexOf(m[3].toUpperCase()) >= 0;
    };

    // OVERWRITES old selector
    jQuery.expr[':'].contains = function(a, i, m) {
        return jQuery(a).text().toUpperCase()
        .indexOf(m[3].toUpperCase()) >= 0;
    };

    var blacklist = ["islam", "migrants", "mot3", "mot4"];

    for (i=0; i < blacklist.length ; i++)
        $("tr:has(.titre-topic:contains("+blacklist[i]+"))").hide();
}

blacklistTopic();
addEventListener('instantclick:newpage', blacklistTopic);
