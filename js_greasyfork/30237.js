// ==UserScript==
// @name         Xossip Image AutoResize
// @namespace    http://tampermonkey.net/
// @version      1.51
// @description  Automatically resize Xossip images
// @author       Casinaar
// @grant        none
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @include      https://www.desiproject.com/showthread.php?*
// @include      https://desiproject.com/showthread.php?*
// @include      https://216.158.70.98/showthread.php?*
// @include      https://www.xossip.rocks/showthread.php?*
// @include      https://xossip.rocks/showthread.php?*
// @include      https://www.exbii.com/showthread.php?*
// @include      https://exbii.com/showthread.php?*
// @include      https://www.xossip.com/showthread.php?*
// @include      https://xossip.com/showthread.php?*
// @downloadURL https://update.greasyfork.org/scripts/30237/Xossip%20Image%20AutoResize.user.js
// @updateURL https://update.greasyfork.org/scripts/30237/Xossip%20Image%20AutoResize.meta.js
// ==/UserScript==

this.$ = window.jQuery.noConflict(true);
var images;
var width=[];
$(window).on('load',function(){
    images = $('div[id*="post_message"] img:not([src*="viewpost"])');
    images.each(function(i){
        width[i]=$(this).width();
    });
    resize();
});
$(window).resize(function(){
    resize();
});
function resize()
{
    images.each(function(i){
        if($(this).width() > $(window).width() || ($(this).width() < $(window).width()) && $(this).width() < width[i])
            $(this).animate({width: $(window).width()-100});
        else if(width[i] < $(window).width())
            $(this).animate({width: width[i]});
    });
}