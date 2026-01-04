// ==UserScript==
// @name         Pinterest 2.0 night mode
// @author       Tehapollo Edit/Eisenpower Original
// @version      2.5
// @include      https://sofia*.pinadmin.com/*
// @include      https://api.pinterest.com/*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  night mode
// @downloadURL https://update.greasyfork.org/scripts/378174/Pinterest%2020%20night%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/378174/Pinterest%2020%20night%20mode.meta.js
// ==/UserScript==


$(document).ready(function(){
   var pin_interval = setInterval(function(){ pin_check(); }, 250);
   var hide_instructions = setInterval(function(){ instructions_check(); }, 250);
   var color_change = setInterval(function(){color_changer();}, 250);
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
       }
    });
    function instructions_check(){
   if ( $('h5:contains(Press ? to see some handy shortcuts used to navigate the assignment)').length ){
       document.querySelector(`h3[class="panel-title"]`).click();
       clearInterval(hide_instructions);
   }
}

function color_changer(){
   $('body').css('color','#cbccd1');
   $('a,._5k').css('color','#69f');
   $('div,nav,html').css('background-color','#43464A');
   if ( $('a:contains(Task 20/20)').length || $('a:contains(Task 10/10)').length  ){
       document.getElementsByClassName('panel-body')[1].style.backgroundColor = "#8d7d1a";
       document.getElementsByClassName('page-header')[0].style.backgroundColor = "#8d7d1a";
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
      // setInterval(hide_instructions);
       setTimeout(function() {
           $('button.btn.btn-default').click();
       }, 250);
   }
}
});