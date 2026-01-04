// ==UserScript==
// @name         Pinterest 2.0
// @author       Tehapollo Edit/Eisenpower Original
// @version      2.6
// @include      https://sofia*.pinadmin.com/*
// @include      https://api.pinterest.com/*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  Fixed some stuff
// @downloadURL https://update.greasyfork.org/scripts/373878/Pinterest%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/373878/Pinterest%2020.meta.js
// ==/UserScript==


$(document).ready(function(){
   var pin_interval = setInterval(function(){ pin_check(); }, 250);
   var hide_instructions = setInterval(function(){ instructions_check(); }, 250);
   var color_change = setInterval(function(){color_changer();}, 250);
   var number_check = setInterval(function(){task_count();},250);

    function instructions_check(){
        if ( $('h5:contains(Press ? to see some handy shortcuts used to navigate the assignment)').length ){

                  document.querySelector(`h3[class="panel-title"]`).click();
                  clearInterval(hide_instructions);
        }
    }

    function task_count(){
        if (!$('a:contains(Task 1/20)').length && !$('a:contains(Task 1/10)').length ){
            document.getElementsByClassName('panel-body')[1].style.backgroundColor = "purple";
            document.getElementsByClassName('page-header')[0].style.backgroundColor = "purple";
            clearInterval(number_check);
        }
        else {
            clearInterval(number_check);
        }
    }

    function color_changer(){
if ( $('a:contains(Task 18/20)').length || $('a:contains(Task 8/10)').length ){
document.getElementsByClassName('panel-body')[1].style.backgroundColor = "yellow";
document.getElementsByClassName('page-header')[0].style.backgroundColor = "yellow";
}
         else if ( $('a:contains(Task 19/20)').length || $('a:contains(Task 9/10)').length ){
document.getElementsByClassName('panel-body')[1].style.backgroundColor = "orange";
document.getElementsByClassName('page-header')[0].style.backgroundColor = "orange";
 }
         else if ( $('a:contains(Task 20/20)').length || $('a:contains(Task 10/10)').length  ){
document.getElementsByClassName('panel-body')[1].style.backgroundColor = "#ee4466";
document.getElementsByClassName('page-header')[0].style.backgroundColor = "#ee4466";
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
               setInterval(number_check);
               setTimeout(function() {
               $('button.btn.btn-default').click();
            }, 250);
        }

}

$(document).keydown(function (clickers) {
    if ($("h1:contains('Rate How Relevant a Pin Is to a Query')").length && clickers.keyCode === 77){
    document.getElementsByName("questionAnswers.q2")[0].click();
    }
else if ($("h1:contains('Rate How Relevant a Pin Is to a Query')").length && clickers.keyCode === 78){
    document.getElementsByName("questionAnswers.q2")[1].click();
}
    else if ($("h1:contains('Rate How Relevant a Pin Is to a Query')").length && clickers.keyCode === 66){
    document.getElementsByName("questionAnswers.q2")[2].click();
}
    else if ($("h1:contains('Rate How Relevant a Pin Is to a Query')").length && clickers.keyCode === 188){
    $('button.btn.btn-lg.btn-default')[0].click();
}
 });





    $(document).keypress(function(event){
        if (String.fromCharCode(event.which) == 1){
            // 1: Clicks 1st Radio and Advances
            $('input[type=radio]')[0].click();
            $('button.btn.btn-lg.btn-primary').click();
        } else if (String.fromCharCode(event.which) == 2){
            // 2: Clicks 2nd Radio and Advances
            $('input[type=radio]')[1].click();
            $('button.btn.btn-lg.btn-primary').click();
        } else if (String.fromCharCode(event.which) == 3){
            // 3: Clicks 3rd Radio and Advances
            $('input[type=radio]')[2].click();
            $('button.btn.btn-lg.btn-primary').click();
        } else if (String.fromCharCode(event.which) == 4){
            // 4: Clicks 4th Radio and Advances
            $('input[type=radio]')[3].click();
            $('button.btn.btn-lg.btn-primary').click();
        }else if (String.fromCharCode(event.which) == 5){
            // 5: Clicks 5th Radio and Advances
            $('input[type=radio]')[4].click();
            $('button.btn.btn-lg.btn-primary').click();
        }else if (String.fromCharCode(event.which) == 6){
            // 6: Clicks 6th Radio and Advances
            $('input[type=radio]')[5].click();
            $('button.btn.btn-lg.btn-primary').click();
        }else if (String.fromCharCode(event.which) == 7){
            // 7: Clicks 7th Radio and Advances
            $('input[type=radio]')[6].click();
            $('button.btn.btn-lg.btn-primary').click();
        }else if (String.fromCharCode(event.which) == 8){
            // 8: Clicks 8th Radio and Advances
            $('input[type=radio]')[7].click();
            $('button.btn.btn-lg.btn-primary').click();
        }else if (String.fromCharCode(event.which) == 9){
            // 9: Clicks 9th Radio and Advances
            $('input[type=radio]')[8].click();
            $('button.btn.btn-lg.btn-primary').click();
            // ` or Del will go back one pin
        }else if (event.keyCode === 110 || event.keyCode === 192){
        }

    });
});