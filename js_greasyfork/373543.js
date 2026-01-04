// ==UserScript==
// @name         Quora skip and ad removal
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Skip Button for better UI
// @author       Prabhu Teja
// @match        https://www.quora.com/
// @grant        none
// @require   https://code.jquery.com/jquery-2.2.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/373543/Quora%20skip%20and%20ad%20removal.user.js
// @updateURL https://update.greasyfork.org/scripts/373543/Quora%20skip%20and%20ad%20removal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function(){
        //Add Fixed button "Skip"
        $(".fixed_sidebar.fixable_fixed").after('<div class="skpwrp"><button class="nxt_btn">Skip</button></div>');
        $(".nxt_btn").prop('disabled', true).css({"position":"fixed","top": "50%","right" : "25%"});
        $(".skpwrp").css({"text-align":"center"});
        var btnContainer=""; //Variable to hold next id
        var count = 0; // count no of expanded stories

        // To store next id when "more" is clicked
        $('body').on('click', '.answer_body_preview, .truncated_answer', function() {
            $(".nxt_btn").prop('disabled', false);
            count++; //hide ads and links for dynamically added content
            if(count>2){
                hideshit();
                count=0;
            }
            btnContainer = $(this).parents("div.Bundle").parent().next().attr('id');
            console.log("Next id : "+btnContainer);
            setInterval(function(){$(".home_feed_ad").each(function() {
                $(this).parent().remove();
                //console.log('Removing Promotional bundles');
            });}, 3000);
        });
        //Display next story when "skip" is clicked
        $(".nxt_btn").on('click',function(){
            var element = document.getElementById(btnContainer);
            element.scrollIntoView();
            console.log("Skipped content");
        });

        //Hides links and ads except promotional ads
        function hideshit(){
            $(".Bundle").not(".AnswerStoryBundle,.SuggestedTopicsBundle,.SuggestedUsersBundle").each(function() {
                $(this).parent().remove();
                // console.log('Removing All other bundles except answers');
            });
        }

        hideshit();
    });
})();
