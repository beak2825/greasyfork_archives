// ==UserScript==
// @name         AliExpress Review Fix
// @namespace    https://greasyfork.org/en/users/10118-drhouse
// @version      1.1
// @description  fixes the 'review' button function and if a product has reviews, they will automatically be displayed on page load
// @match        https://www.aliexpress.com/*
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @grant        GM_info
// @author       drhouse
// @license      CC-BY-NC-SA-4.0
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliexpress.com
// @downloadURL https://update.greasyfork.org/scripts/475425/AliExpress%20Review%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/475425/AliExpress%20Review%20Fix.meta.js
// ==/UserScript==
/* global jQuery, $ */
this.$ = this.jQuery = jQuery.noConflict(true);
(function($){
    
    var numReviews = $("#root > div.pdp-wrap.pdp-body > div.pdp-body-left > div.pdp-info > div.pdp-info-right > div > a").text()
    numReviews = parseInt(numReviews.match(/\d+/)[0]);

    if (numReviews > 0){
            $('html, body').animate({scrollTop:$(document).height()}, 'fast');
            setTimeout(function(){
                $("#nav-review > div.ae-evaluation-list > div.ae-evaluation-view-more > button")[0].click()
                $('html, body').animate({scrollTop:0}, 'fast');
            }, 1000);
    }

    var review = $("#root > div.pdp-wrap.pdp-body > div.pdp-body-left > div.pdp-info > div.pdp-info-right > div.product-reviewer > a")

    $(review).click(function(event){
        event.preventDefault();
        $("#nav-review > div.ae-evaluation-list > div.ae-evaluation-view-more > button").click()
    });

})(jQuery);