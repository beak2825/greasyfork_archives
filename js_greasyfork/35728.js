// ==UserScript==
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @name         El Mon .CAT
// @namespace    http://elmon.cat/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @include      http://elmon.cat/*
// @include      http://www.elmon.cat/*
// @downloadURL https://update.greasyfork.org/scripts/35728/El%20Mon%20CAT.user.js
// @updateURL https://update.greasyfork.org/scripts/35728/El%20Mon%20CAT.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        setInterval(function() {
            $('.billboard-section-ad').remove();
            $('.billboard-main').remove();
            $('.sadserver').remove();
            $('.adsbygoogle').parent().remove();
            $('.coldreta div[id^="sas_"]').parent().parent().parent().remove();
            $('.coldreta div[id^="sas_"]').closest('.coldreta').remove();
            $('div[id^="sas_"]').remove();
            $('.addoor_tw_slot').each(function(a,b) {
                if ($(b).find('a').attr('href').indexOf('elmon')===-1) $(b).remove();
            });
        }, 1);
    };
})();
