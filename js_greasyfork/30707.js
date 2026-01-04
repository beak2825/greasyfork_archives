// ==UserScript==
// @name        UpYoursFB
// @namespace   upyoursfb
// @description Hide Facebook Ads
// @author      d4rk3rnigh7
// @include     *://*.facebook.com/*
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @version     1.9.3
// @license     CC
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30707/UpYoursFB.user.js
// @updateURL https://update.greasyfork.org/scripts/30707/UpYoursFB.meta.js
// ==/UserScript==

$(document).ready(function(){
    var upyours = ['Suggested Offer', 'Suggested Post', 'Featured For You', 'A Video You May Like'];
    $(document).on('scroll', function(){
        // For Desktop
        if(window.location.href.indexOf('www.facebook') !== -1){
            $('span').each(function(){
                if($.inArray($(this).text(), upyours) !== -1){
                    $(this).parents().eq(4).hide();
                    //console.log('Got another one | Up yours fb');
                }
            });
        }
        // For Mobile
        else{
            $('header').each(function(){
                if($.inArray($(this).text(), upyours) !== -1){
                    $(this).parents().eq(1).hide();
                    //console.log('Got another one | Up yours fb');
                }
            });
        }
    });
});
