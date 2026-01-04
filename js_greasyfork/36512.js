// ==UserScript==
// @name         Amazon Sponsored Products / Ad block
// @version      0.2
// @author       Michael with some help from the internet
// @description  Blocks sponsored search results on amazon.com, amazon.co.uk and amazon.de and some banner ads
// @include      *://www.amazon.de/*
// @include      *://www.amazon.com/*
// @include      *://www.amazon.co.uk/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @run-at document-end
// @namespace https://greasyfork.org/users/163754
// @downloadURL https://update.greasyfork.org/scripts/36512/Amazon%20Sponsored%20Products%20%20Ad%20block.user.js
// @updateURL https://update.greasyfork.org/scripts/36512/Amazon%20Sponsored%20Products%20%20Ad%20block.meta.js
// ==/UserScript==

$ = jQuery.noConflict(true);
var pageContentchanged = false;
$('body').bind("DOMSubtreeModified", function() {
    pageContentchanged = true;
});
setInterval(removeSponsoredAds, 200);
console.log("amazon-sponsored-items-blocker loaded");

function removeSponsoredAds() {
    if (pageContentchanged) {
        var count = 0;
        $('.celwidget').each(function(i, obj) {
            if ($(this).find(".s-sponsored-info-icon").length > 0) {
                //console.log("Object " + i + " contains an ad");
                //$(this).css('background-color', 'red');
                (this).remove();
                count++;
            }
        });
        console.log("amazon-sponsored-items-blocker: " + count + " ads removed!");
        $(".slot__ad").hide();
        $(".slot__feedback").hide();
        $("[id*='ape_']").hide();
        $("[id*='sponsored']").hide();
        $("[id*='sp_']").hide();
        $("[id*='advertising']").hide();
        pageContentchanged = false;
    }

}
