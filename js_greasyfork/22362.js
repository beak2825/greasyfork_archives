// ==UserScript==
// @name         MyDealz Toggle Description
// @namespace    http://www.mydealz.de/profile/richi2k
// @version      0.2
// @description  functionality to toggle deal descriptions on mydealz.de 
// @author       richi2k
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @match        http://www.mydealz.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22362/MyDealz%20Toggle%20Description.user.js
// @updateURL https://update.greasyfork.org/scripts/22362/MyDealz%20Toggle%20Description.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    $(".thread-body div.section-sub:not(:contains('Weiterlesen'))").each(function(){ 
            var dealDescTogglerElement = $('<div class="deal-desc-toggler">Mehr</div>');
            dealDescTogglerElement.addClass("link");

            $(this).css({
                "max-height": $(this).height() + "px",
                "height": "100px",
                "overflow" : "hidden"
            }).addClass("toggled").after(dealDescTogglerElement);
        
    });
    $(document).on("click", ".deal-desc-toggler", function() {
        var dealDescription = $(this).siblings(".thread-body .section-sub");
        
        if(dealDescription.hasClass("toggled")) {
            dealDescription.removeClass("toggled").animate({"height": dealDescription.css("max-height")});
            $(this).text("Weniger");
        } else {
            dealDescription.addClass("toggled").animate({"height": "50px"});
            $(this).text("Mehr");
        }
    });
})();