// ==UserScript==
// @name Kek smileys
// @namespace KPI
// @version 1.1
// @description Changing the default smileys
// @run-at document-idle
// @require https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @include https://www.facebook.com/*
// @include http://www.facebook.com/*
// @grant none
// @copyright  2016+, John
// @downloadURL https://update.greasyfork.org/scripts/17396/Kek%20smileys.user.js
// @updateURL https://update.greasyfork.org/scripts/17396/Kek%20smileys.meta.js
// ==/UserScript==

$("body").on("DOMSubtreeModified", function(){
    $('.userContentWrapper .UFILikeLink._48-k').one('mouseenter',function(){
        setTimeout(function() { 
            $('._iuz').css("backgroundImage", "url(//i.imgur.com/YGvQ01i.png)" );
        }, 600);
    });
});