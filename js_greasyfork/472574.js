// ==UserScript==
// @name     Hide Reddit posts with "Because you" and "Popular"
// @namespace HideRedditsPromotedPosts
// @description Hide Reddit's promoted posts for a cleaner experience.
// @author   CorvusSan
// @include  https://www.reddit.com/
// @include  https://www.reddit.com/r/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @license  MIT
// @version  1.0
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/472574/Hide%20Reddit%20posts%20with%20%22Because%20you%22%20and%20%22Popular%22.user.js
// @updateURL https://update.greasyfork.org/scripts/472574/Hide%20Reddit%20posts%20with%20%22Because%20you%22%20and%20%22Popular%22.meta.js
// ==/UserScript==

function hide_ads() {
    $('p:contains("Because you"),p:contains("Popular")').each(function(index){
        //$(this) is the current element in the iteration
        $(this).parent().parent().css('display','none');
    });
}

(function() {

    'use strict';
    hide_ads()
    //Rerun the code each time the document changes (i.e. new posts added when user scrolls)
    document.addEventListener("DOMNodeInserted", hide_ads);

})();
