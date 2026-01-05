// ==UserScript==
// @name        Highlight Oculus Rift games on Humble Store
// @namespace   org.olemartin.oculus-rift-highlight
// @description Highlights games that supports the Oculus Rift on the Humble Store, so that you don't have to hover over the 'platforms' icon to know which games have a VR mode
// @include     https://www.humblebundle.com/store*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27225/Highlight%20Oculus%20Rift%20games%20on%20Humble%20Store.user.js
// @updateURL https://update.greasyfork.org/scripts/27225/Highlight%20Oculus%20Rift%20games%20on%20Humble%20Store.meta.js
// ==/UserScript==

(function ($) {

    var highlighter = function () {
        $('.storefront-list-product .hb-oculus')
            .closest('.storefront-list-product')
            .css({background: '#a3e5b4'});
    };
    
    $(document).ajaxSuccess(highlighter).ready(highlighter);
    
})(jQuery);