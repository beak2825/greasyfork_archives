// ==UserScript==
// @name         Ininate Scroll Ebay
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        http://www.ebay.co.uk/sch/*
// @grant        none
// @locale       en
// @downloadURL https://update.greasyfork.org/scripts/11377/Ininate%20Scroll%20Ebay.user.js
// @updateURL https://update.greasyfork.org/scripts/11377/Ininate%20Scroll%20Ebay.meta.js
// ==/UserScript==



$.getScript('https://cdnjs.cloudflare.com/ajax/libs/jquery-infinitescroll/2.0b2.120519/jquery.infinitescroll.min.js', function() {

    $.getScript('https://cdnjs.cloudflare.com/ajax/libs/jquery.lazyload/1.9.1/jquery.lazyload.min.js', function() {
        $('#GalleryViewInner').infinitescroll({
            dataType: 'html',
            navSelector  : "#PaginationAndExpansionsContainer",            
            // selector for the paged navigation (it will be hidden)
            nextSelector : ".next",    
            // selector for the NEXT link (to page 2)
            itemSelector : "#GalleryViewInner"          
            // selector for all items you'll retrieve
        },function(arrayOfNewElems){
            $('.null').each(function(item, thing){
                var myself = $(this),
                    image = myself.find('img'),
                    imageTag = image.attr('imgurl');

                myself.removeClass('null');
                image.attr('src',imageTag);
            });
            // optional callback when new content is successfully loaded in.

            // keyword `this` will refer to the new DOM content that was just added.
            // as of 1.5, `this` matches the element you called the plugin on (e.g. #content)
            //                   all the new elements that were found are passed in as an array

        });          
    });
});