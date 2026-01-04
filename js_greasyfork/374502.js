// ==UserScript==
// @name         Allen NLP Keypress Custom Questions
// @author       Tehapollo
// @version      1.2
// @include      *mturkcontent.com*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  Create custom questions and fill them with 0-9
// @downloadURL https://update.greasyfork.org/scripts/374502/Allen%20NLP%20Keypress%20Custom%20Questions.user.js
// @updateURL https://update.greasyfork.org/scripts/374502/Allen%20NLP%20Keypress%20Custom%20Questions.meta.js
// ==/UserScript==

(function() {
    'use strict';




$(document).ready(function(){
    var hide_stuff = setInterval(function(){ Please_Hide(); }, 250);
    function Please_Hide(){
         if ( $('h2:contains(Complex question answering with high-Level reasoning and inference)').length ){
         document.getElementById('collapse_link').click()
         document.querySelector('input#ai-answer').focus();
         clearInterval(hide_stuff);
         }

         else if ( $('h2:contains(Complex question answering with high-level reasoning and inference)').length ) {
         document.getElementById('collapse_link').click()
         document.querySelector('input#ai-answer').focus();
            clearInterval(hide_stuff);
        }
         else {
              clearInterval(hide_stuff);
         }
}


    $(document).keydown(function (e) {
        if(e.keyCode == 96){
            //
            document.getElementById("input-question").value="Change Me";

        } else if (e.keyCode == 97){
            // 
            document.getElementById("input-question").value="Change Me";

        } else if (e.keyCode == 98){
            // 
             document.getElementById("input-question").value="Change Me";

        } else if (e.keyCode == 99){
            // 
             document.getElementById("input-question").value="Change Me";

        }else if (e.keyCode == 100){
            // 
             document.getElementById("input-question").value="Change Me";

        }else if (e.keyCode == 101){
            // 6
             document.getElementById("input-question").value="Change Me";

        }else if (e.keyCode == 102){
            // 
             document.getElementById("input-question").value="Change Me";

        }else if (e.keyCode == 103){
            // 
            document.getElementById("input-question").value="Change Me";

        }else if (e.keyCode == 104){
            // 
             document.getElementById("input-question").value="Change Me";

        }else if (e.keyCode == 105){
            //
             document.getElementById("input-question").value="Change Me";

        }
    });


});
})();