// ==UserScript==
// @name         PriceRangeItemHider
// @namespace    http://tampermonkey.net/
// @version      2024-03-19
// @description  Hide items with price range from Ebay search results!
// @author       Lars Simonsen
// @match        www.ebay.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/28968/PriceRangeItemHider.user.js
// @updateURL https://update.greasyfork.org/scripts/28968/PriceRangeItemHider.meta.js
// ==/UserScript==

$('head').append('<style>.hiddenRangeItem {background-color:#eee;} .showHiddenRangeItem {cursor:pointer; background-color:#eee; border: 1px solid #ddd; margin: 1em; padding:0.25em; } .showHiddenRangeItem.showing { color:white;background-color:black; } .showHiddenRangeItem.hiding .hideIt, .showHiddenRangeItem.showing .showIt { display:none;}</style>');
function hideRangeItem($el) {
    $el.addClass('hiddenRangeItem').hide().before('<div class="showHiddenRangeItem hiding"><span class="showIt">Show</span><span class="hideIt">Hide</span> price range item</div>');
    $el.prev('.showHiddenRangeItem').click(function() {
        $(this).toggleClass('showing hiding').next('.hiddenRangeItem').slideToggle();
    });
}
function hideRangeItems($els) {
    $els.each(function() {
        if (!$(this).hasClass('hiddenRangeItem')) {
            hideRangeItem($(this));
        }
    });
}
setInterval(function() {
    hideRangeItems($('#Results .prRange').parents('.sresult,.srp-results'));
    hideRangeItems($('.DEFAULT:contains( to )').parents('.s-item'));
}, 1000);