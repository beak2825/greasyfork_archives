// ==UserScript==
// @name         Pinterest for Weblinks
// @author       Tehapollo Edit/Eisenpower Original
// @version      1.0
// @include      https://sofia*.pinadmin.com/*
// @include      https://api.pinterest.com/*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  Fixed some stuff
// @downloadURL https://update.greasyfork.org/scripts/375198/Pinterest%20for%20Weblinks.user.js
// @updateURL https://update.greasyfork.org/scripts/375198/Pinterest%20for%20Weblinks.meta.js
// ==/UserScript==


$(document).ready(function(){

    var pin_interval = setInterval(function(){ pin_check(); }, 250);
    var hide_instructions = setInterval(function(){ instructions_check(); }, 250);
    var Grab_Link = setInterval(function(){ I_Grab(); }, 500);

    function I_Grab(){
          if ( $('h5:contains(Press ? to see some handy shortcuts used to navigate the assignment)').length ){
         var showlink = $('div.col-sm-12.col-sm-offset-NaN').find('a').attr('href')
        $('div._su._st._sv._sl._5k._sn._sr._nl._nm._nn._no').append("<b><br>"+showlink+"</br></b>");
        clearInterval(Grab_Link);

         }
    }

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


    $(document).keypress(function(event){
        var Grab_Link = setInterval(function(){ I_Grab(); }, 500);

    function I_Grab(){
          if ( $('h5:contains(Press ? to see some handy shortcuts used to navigate the assignment)').length ){
         var showlink = $('div.col-sm-12.col-sm-offset-NaN').find('a').attr('href')
        $('div._su._st._sv._sl._5k._sn._sr._nl._nm._nn._no').append("<b><br>"+showlink+"</br></b>");
        clearInterval(Grab_Link);

         }
    }
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
});