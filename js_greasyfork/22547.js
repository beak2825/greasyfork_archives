// ==UserScript==
// @name         Kinopoisk fast switch
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Quick switch kinopoisk sorting
// @author       Burlaka.net
// @match       *://kinopoisk.ru/*
// @match       *://*.kinopoisk.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22547/Kinopoisk%20fast%20switch.user.js
// @updateURL https://update.greasyfork.org/scripts/22547/Kinopoisk%20fast%20switch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = window.location.href;
    var nametrigger;

    if(url.indexOf('www.kinopoisk.ru/name/') != -1) {
        $('.sort_people_name').css('cursor', 'pointer').hover(function() {
            $(this).css("color", "#f60");
        }, function(){
            $(this).css("color", "#333");
        }).click(function() {
            if (nametrigger == '1') {
                location.hash = "!all";
                nametrigger = 0;
            }
            else {
                location.hash = "!/sort/kp/";
                nametrigger = '1';
            }
        });
    }
    // little corrections for instagram window
    $('.rg-image-wrapper').css('background','#2f2f2f');
    $('.rg-caption li').css('padding','7px');
})();