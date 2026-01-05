// ==UserScript==
// @author Mamun Sardar
// @name        Youtube - Remove Recommended
// @namespace   youtube-remove-recommended
// @include     *youtube.com/
// @include     *youtube.com/index?ytsession*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @version     1.01
// @grant       none
// @description Remove recommended videoes from youtube
// @downloadURL https://update.greasyfork.org/scripts/22305/Youtube%20-%20Remove%20Recommended.user.js
// @updateURL https://update.greasyfork.org/scripts/22305/Youtube%20-%20Remove%20Recommended.meta.js
// ==/UserScript==

var filters = [
    "Recommended video",
    "Recommended channel",
    "Recommended",
    "Recommended channel for you"
];

$.each(filters, function( i, val ){
    $('li>div.feed-item-container:contains('+ val +')').remove();
});


(function() {
    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', function() {
            setTimeout(function(){
                $.each(filters, function( i, val ){
                    $('li>div.feed-item-container:contains('+ val +')').remove();
                });
            }, 200);
        });
        origOpen.apply(this, arguments);
    };
})();