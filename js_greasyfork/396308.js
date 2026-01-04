// ==UserScript==
// @name         Raid Den Names
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Add pokemon names to den lookup!
// @author       Catpuccino☆#0256
// @match        https://www.serebii.net/swordshield/maxraidbattledens.shtml
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// https://greasyfork.org/scripts/396308-raid-den-names/code/Raid%20Den%20Names.user.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396308/Raid%20Den%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/396308/Raid%20Den%20Names.meta.js
// ==/UserScript==


window.addEventListener('load', function() {
    (function() {
        'use strict';
        $('.sprt').each(function(_, obj) {
            var alt = $(this).attr("alt").replace(/ - .*/g,'');
            $(this).after('<br> ' + alt);
        });
    })();
}, false);