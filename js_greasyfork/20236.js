// ==UserScript==
// @name         Quora Truncate Answer
// @namespace    http://dhyeythakore.net/
// @version      1.0
// @description  Truncate button to shorten ans after clicking on more
// @author       Dhyey Thakore
// @match        https://www.quora.com/
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/20236/Quora%20Truncate%20Answer.user.js
// @updateURL https://update.greasyfork.org/scripts/20236/Quora%20Truncate%20Answer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    
    $(document).ready(function(){
        var startAt = 0; //to avoid more than one truncate button
        
        $(".more_link").click(function(){
            
            //selects the 3rd child of action_bar_inner,
            //if quora changes the order of comment btn change this
            var btnContainer = $(".action_bar_inner").children("[id$=link]");
            var length = btnContainer.length;
            //console.log("Length : "+length);
            for(var i= startAt;i<=length;i++){
                //console.log(i);
                //append a btn after comment btn
                $(btnContainer[i]).after("<button class='truncateBtn' >Truncate</button>");
            }
            $(".truncateBtn").click(function(){
                //console.log("pressed");
                //when truncate is clicked hidden class is added to expanded
                //answer and removed from truncated answer
                $("[id$=_truncated]").removeClass("hidden");
                $("[id$=_expanded]").addClass("hidden");
            });
            
            //for loop will not execute if no new que-ans is loaded via ajax
            startAt = length;
        });
        
        

    });

})();