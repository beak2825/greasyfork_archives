// ==UserScript==
// @name         PinsLanding Pages
// @author       Tehapollo
// @version      1.0
// @include      https://sofia*.pinadmin.com/*
// @include      https://api.pinterest.com/*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  Does magical stuff
// @downloadURL https://update.greasyfork.org/scripts/392636/PinsLanding%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/392636/PinsLanding%20Pages.meta.js
// ==/UserScript==
$(document).ready(function(){
   var hide_instructions = setInterval(function(){ instructions_check(); }, 250);
   var pin_interval = setInterval(function(){ pin_check(); }, 250);
   var Grab_Link = setInterval(function(){ I_Grab(); }, 250);



  function I_Grab(){
  var link1 = $(`[class="col-sm-8 col-sm-offset-NaN"]`).find('a').attr('href')
  var mywindow1 = window.open(link1,'win1', "height=1000,width=800,left=0,status=yes,toolbar=no,menubar=no,location=no");
  clearInterval(Grab_Link);
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

document.addEventListener("keydown", function(e){
    var Grab_Link = setInterval(function(){ I_Grab(); }, 250);
  function I_Grab(){
  var link1 = $(`[class="col-sm-8 col-sm-offset-NaN"]`).find('a').attr('href')
  var mywindow1 = window.open(link1,'win1', "height=1000,width=700,left=0,status=yes,toolbar=no,menubar=no,location=no");
   clearInterval(Grab_Link);
  }


if (e.keyCode == 81) {
  $('input[type=radio]')[0].click();
  $('input[type=radio]')[2].click();
  $('button.btn.btn-lg.btn-primary').click();
}
else if (e.keyCode == 87){
  $('input[type=radio]')[0].click();
  $('input[type=radio]')[3].click();
  $('button.btn.btn-lg.btn-primary').click();
}
else if (e.keyCode == 69){
  $('input[type=radio]')[0].click();
  $('input[type=radio]')[4].click();
  $('button.btn.btn-lg.btn-primary').click();
}
else if (e.keyCode == 82){
  $('input[type=radio]')[0].click();
  $('input[type=radio]')[5].click();
  $('button.btn.btn-lg.btn-primary').click();
}
else if (e.keyCode == 68){
  $('input[type=radio]')[1].click();
  $('button.btn.btn-lg.btn-primary').click();
}

})();
});