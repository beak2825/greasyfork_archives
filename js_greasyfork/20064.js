// ==UserScript==
// @name         Tabbed Translator Page
// @namespace    ElBrado AKA Bart AKA Boba Fett
// @version      0.000001
// @description  Separates the columns into tabs.
// @author       ElBrado AKA Bart AKA Boba Fett
// @include      *kat.cr/people/translators/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20064/Tabbed%20Translator%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/20064/Tabbed%20Translator%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';


    $('h1').after(
        '<div class="tabs"> <ul class="tabNavigation"> <li><a class="siteButton premierColl elbradosTab"><span>1st</span></a></li> <li><a class="siteButton secondeColl elbradosTab"><span>2nd</span></a></li> <li><a class="siteButton troisiemeColl elbradosTab"><span>3rd</span></a></li> <li><a class="siteButton quatrièmeColl elbradosTab"><span>All</span></a></li> </ul> <hr class="tabsSeparator"></div>'
    );

    $('.elbradosTab').css('cursor', 'pointer');

    $('.elbradosTab').on('click', function() {
        $('.firstColl').hide();
        var tabType = $(this).attr('class').split(" ")[1];
        switch (tabType) {
            case 'premierColl':
                $('.firstColl').parent().parent().show();
                break;
            default:
                $('.firstColl').show();
        $('.secondColl').hide();
                $(this).attr('class').split(" ");
        switch (tabType) {
            case 'secondeColl':
                $('.secondColl').parent().parent().show();
                break;
            default:
                $('.secondColl').show();
        $('.thirdColl').hide();
        switch (tabType) {
            case 'troisiemeColl':
                $('.thirdColl').parent().parent().show();
                break;
            default:
                $('.thirdColl').show();
         $('.thirdColl').hide();
        switch (tabType) {
            case 'quatrièmeColl':
                $('.thirdColl').show();
                break;
            default:
                $('.thirdColl').show();
        }
        }
        }
        }
    });
})();