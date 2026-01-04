// ==UserScript==
// @name         Pinterest Two Clickers
// @author       Tehapollo 
// @version      1
// @include      https://sofia*.pinadmin.com/*
// @include      https://api.pinterest.com/*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  works for the relevant 2 clickers
// @downloadURL https://update.greasyfork.org/scripts/376033/Pinterest%20Two%20Clickers.user.js
// @updateURL https://update.greasyfork.org/scripts/376033/Pinterest%20Two%20Clickers.meta.js
// ==/UserScript==


$(document).ready(function(){

    var pin_interval = setInterval(function(){ pin_check(); }, 250);
    var hide_instructions = setInterval(function(){ instructions_check(); }, 250);
    var twoclicker = 2
 function instructions_check(){
        if ( $('h5:contains(Press ? to see some handy shortcuts used to navigate the assignment)').length ){

                  document.querySelector(`h3[class="panel-title"]`).click();
                  clearInterval(hide_instructions);
        }
 }
    function pin_check () {
        if ( $('h4:contains(No Tasks Available)').length ) {
            // Refresh if No Tasks
            window.location.reload();
        }
        else if ( $('h4:contains(Loading)').length ) {
            return;
        }
        else if ( $('h4:contains(Slow Down!)').length ) {
            // Refresh if Slow Down Message
            setTimeout(function() {
                window.location.reload();
            }, 1000*10);
        }

        else if ( $('h1:contains(Thanks for your help)').length ) {
          // Clicks Reload Button
               setInterval(hide_instructions);
               setTimeout(function() {
               $('button.btn.btn-default').click();
            }, 250);
        }

}


    $(document).keydown(function (e) {
        if(e.keyCode == 97 && twoclicker == 2){
            // 1: Clicks 1st Radio and Advances
            $('input[type=radio][name="questionAnswers.q1"]')[0].click();
             twoclicker--
        } else if(e.keyCode == 98 && twoclicker == 2){
            // 2: Clicks 2nd Radio and Advances
            $('input[type=radio][name="questionAnswers.q1"]')[1].click();
            twoclicker--
        } else if(e.keyCode == 99 && twoclicker == 2){
            // 3: Clicks 3rd Radio and Advances
            $('input[type=radio][name="questionAnswers.q1"]')[2].click();
            twoclicker--
        } else if(e.keyCode == 100 && twoclicker == 2){
            // 4: Clicks 4th Radio and Advances
            $('input[type=radio][name="questionAnswers.q1"]')[3].click();
            twoclicker--
        } else if(e.keyCode == 101 && twoclicker == 2){
            // 5: Clicks 5th Radio and Advances
            $('input[type=radio][name="questionAnswers.q1"]')[4].click();
            twoclicker--
        } else if(e.keyCode == 102 && twoclicker == 2){
            // 6: Clicks 6th Radio and Advances
            $('input[type=radio][name="questionAnswers.q1"]')[5].click();
            twoclicker--
        } else if(e.keyCode == 103 && twoclicker == 2){
            // 7: Clicks 7th Radio and Advances
            $('input[type=radio][name="questionAnswers.q1"]')[6].click();
            twoclicker--
        } else if(e.keyCode == 104 && twoclicker == 2){
            // 8: Clicks 8th Radio and Advances
            $('input[type=radio][name="questionAnswers.q1"]')[7].click();
           twoclicker--
        } else if(e.keyCode == 96 && twoclicker == 2){
            // 9: Clicks 9th Radio and Advances
            $('input[type=radio][name="questionAnswers.q1"]')[8].click();
            twoclicker--
        }  else if(e.keyCode == 96 && twoclicker == 1){
                 $('input[type=radio][name="questionAnswers.q2"]')[4].click();
            twoclicker++
            $('button.btn.btn-lg.btn-primary').click();
        }  else if(e.keyCode == 97 && twoclicker == 1){
                 $('input[type=radio][name="questionAnswers.q2"]')[0].click();
            twoclicker++
            $('button.btn.btn-lg.btn-primary').click();
        }  else if(e.keyCode == 98 && twoclicker == 1){
                 $('input[type=radio][name="questionAnswers.q2"]')[1].click();
            twoclicker++
            $('button.btn.btn-lg.btn-primary').click();
         }  else if(e.keyCode == 99 && twoclicker == 1){
                 $('input[type=radio][name="questionAnswers.q2"]')[2].click();
            twoclicker++
             $('button.btn.btn-lg.btn-primary').click();
         }  else if(e.keyCode == 100 && twoclicker == 1){
                 $('input[type=radio][name="questionAnswers.q2"]')[3].click();
            twoclicker++
             $('button.btn.btn-lg.btn-primary').click();

        }
    });

   
});