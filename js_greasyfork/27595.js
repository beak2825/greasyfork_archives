// ==UserScript==
// @name        Remove Useless Segments of the Ecomonist
// @namespace   antisunny
// @description Remove top and bottom popups of Economists, right sidebar ads and the limit on the number of articles you can view for free on The Economist's site.
// @include     http://*.economist.com/*
// @version     0.11
// @require     http://cdn.staticfile.org/jquery/2.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/27595/Remove%20Useless%20Segments%20of%20the%20Ecomonist.user.js
// @updateURL https://update.greasyfork.org/scripts/27595/Remove%20Useless%20Segments%20of%20the%20Ecomonist.meta.js
// ==/UserScript==
(function(A){
    document.cookie="ec_limit=allow";
    A(".fe-blogs__top-ad-wrapper, .main-content__related-column, #piano__in-line-paywall").remove();
    A(".blog-post__text").css("display","block");
    var window_w = A(window).width();
    if (window_w >= 1114) {
        A(".main-content__main-column").css({"width":"70.999%"});
    }
    else if (window_w >= 960) {
        A(".main-content__main-column").css({"width":"90.999%"});
    }
})(jQuery);