// ==UserScript==
// @name         Tabbed Cheevos Page
// @namespace    pxgamer
// @version      0.2
// @description  Creates a tab system for the achievements page.
// @author       pxgamer
// @include      *kat.cr/achievements/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19585/Tabbed%20Cheevos%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/19585/Tabbed%20Cheevos%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('h1').after(
        '<div class="tabs"> <ul class="tabNavigation"> <li><a class="darkButton allCheevos cheevoTab"><span>All</span></a></li> <li><a class="darkButton specialCheevos cheevoTab"><span>Special</span></a></li> <li><a class="darkButton goldCheevos cheevoTab"><span>Gold</span></a></li> <li><a class="darkButton silverCheevos cheevoTab"><span>Silver</span></a></li> <li><a class="darkButton bronzeCheevos cheevoTab"><span>Bronze</span></a></li> <li><a class="darkButton simpleCheevos cheevoTab"><span>Simple</span></a></li> </ul> <hr class="tabsSeparator"></div>'
    );

    $('.cheevoTab').css('cursor', 'pointer');

    $('.cheevoTab').on('click', function() {
        $('.achTable tbody tr').hide();
        var tabType = $(this).attr('class').split(" ")[1];
        switch (tabType) {
            case 'allCheevos':
                $('.achTable tbody tr').show();
                break;
            case 'specialCheevos':
                $('img[src="//kastatic.com/images/achMedal_special.jpg"]').parent().parent().show();
                break;
            case 'goldCheevos':
                $('img[src="//kastatic.com/images/achMedal_gold.jpg"]').parent().parent().show();
                break;
            case 'silverCheevos':
                $('img[src="//kastatic.com/images/achMedal_silver.jpg"]').parent().parent().show();
                break;
            case 'bronzeCheevos':
                $('img[src="//kastatic.com/images/achMedal_bronze.jpg"]').parent().parent().show();
                break;
            case 'simpleCheevos':
                $('img[src="//kastatic.com/images/achMedal_simple.jpg"]').parent().parent().show();
                break;
            default:
                $('.achTable tbody tr').show();
        }
    });
})();
