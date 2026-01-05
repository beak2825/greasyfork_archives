// ==UserScript==
// @name         MyDealz Toggle Comments
// @namespace    http://www.mydealz.de/profile/richi2k
// @version      0.8
// @description  Adds functionallity to toggles cascaded comments on mydealz.de 
// @author       richi2k
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @match        http://www.mydealz.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22253/MyDealz%20Toggle%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/22253/MyDealz%20Toggle%20Comments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    
    // BEGIN REQUIRED ONE TIME INIT 
    // hides all quoted content except those without a header
    $(".bbcode_quote_head:not(:empty)  ~ .bbcode_quote_body").hide();

    // sets 'pointer' as cursor to indicate, that the element is clickable
    $(".bbcode_quote_head:not(:empty)").css("cursor", "pointer").each(function(){
        var onlyText = $(this).siblings(".bbcode_quote_body").clone()	//clone the element
        .children()	//select all the children
        .remove()	//remove all the children
        .end()	//again go back to selected element
        .text();	//get the text of element
        
        $(this).append( $( '<span class="comment-quote-preview"> - ' + onlyText.substring(0,80) + ' [...] </span>' ) );
    });
    // END REQUIRED ONE TIME INIT
    
    $(document).on( "click",".bbcode_quote_head", function(){
        // toggles the related content area
        $(this).siblings(".bbcode_quote_body").slideToggle(); 
        $(this).children(".comment-quote-preview").toggle();
    });
    // 
    $(document).on('DOMNodeInserted DOMNodeRemoved',".comments-item", function(event) {
        if (event.type == 'DOMNodeInserted') {
            // Here we need to set the same things up, that we setup in the one time init section, 
            // because we get a new set of dom elements 
            if($(this).hasClass("comments-item")){
                $(this).find(".bbcode_quote_head:not(:empty)  ~ .bbcode_quote_body").hide();
                $(this).find(".bbcode_quote_head:not(:empty)").css("cursor", "pointer");
            }
            
        }
    });
    
})();