// ==UserScript==
// @name           HLTVNoBetting
// @namespace      ua.rkoten
// @description    Remove gambling content from HLTV.org
// @author         Roman Kotenko
// @version        1.4.1
// @match          https://www.hltv.org/*
// @grant          none
// @run-at         document-end
// @require        https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/369676/HLTVNoBetting.user.js
// @updateURL https://update.greasyfork.org/scripts/369676/HLTVNoBetting.meta.js
// ==/UserScript==

// It is expected that an adblock is on (author recommends uBlock Origin);
// this script removes betting leftovers.

(function(){
    'use strict';
    var keywords = [
        '22bet',
        'Betting',
        'betway',
        'bitskins',
        'buff88',
        'egb',
        'ggbet',
        'ggking',
        'lootbet',
        'pinnacle',
        'thunderpick',
        'unibet',
        'unikrn',
        'xbet',
    ];
    function removeIfSponsoredClass(elements) {
        for (var i = 0; i < elements.length; ++i) {
            var element = elements[i];
            for (var j = 0; j < keywords.length; ++j) {
                var keyword = keywords[j];
                if (element.className.search(new RegExp('.*'+keyword+'.*')) != -1) {
                    element.remove();
                    break;
                }
            }
        }
    }
    function removeIfSponsoredContent(elements) {
        for (var i = 0; i < elements.length; ++i) {
            var element = elements[i];
            for (var j = 0; j < keywords.length; ++j) {
                var keyword = keywords[j];
                if (element.innerHTML.indexOf(keyword) != -1) {
                    element.remove();
                    break;
                }
            }
        }
    }

    $('.betting-listing')    .remove(); // betting coeffs listing on matchpage
    $('.betting-section')    .remove(); // section with fantasy games, betting analytics, etc. on matchpage
    $('#matchpage_1')        .remove(); // full size ad banner on matchpage
    $('.bsec')               .remove(); // navigation bar bets page link
    $('.footer-responsible') .remove(); // bet responsibly message in site footer
    $('.live-match-sub-text').remove(); // bet responsibly message in featured match footer
    $('.buff-box')           .remove(); // sidebar buff88 banner
    $('.card-game')          .remove(); // match page epics card game banner
    $('.multi-bet-list')     .remove(); // sidebar betting block
    $('.kgN8P9bvyb2EqDJR')   .remove(); // matchpage ad block
    $('.v-wrapper')          .remove(); // useless vertical spaceres
    $('.footer-responsible-container').remove(); // "bet responsibly" footer
    $('.team-odds').remove();                              // sidebar featured match team odds
    $('.featured-match-container').css('height', '128px'); // fix container height correspondingly

    removeIfSponsoredClass($('div'));
    removeIfSponsoredClass($('a'));
    removeIfSponsoredContent($('.live-match-box'));                     // sidebar featured match block
    removeIfSponsoredContent($('.section-header.wide-widget'));         // matches page banner
    removeIfSponsoredContent($('.standard-box.featured-match-widget')); // event page featured match block
    removeIfSponsoredContent($('.widget-match-listing'));               // thunderpick sidebar match listing
    removeIfSponsoredContent($('.col-rek3'));
    removeIfSponsoredContent($('.three-quarter-width'));                // betting section on matchpage
}());
