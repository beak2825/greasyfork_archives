// ==UserScript==
// @name         Pinterest Meta Data
// @author       Tehapollo
// @version      1.3
// @include      https://sofia*.pinadmin.com/*
// @include      https://api.pinterest.com/*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  Does magical stuff
// @downloadURL https://update.greasyfork.org/scripts/390494/Pinterest%20Meta%20Data.user.js
// @updateURL https://update.greasyfork.org/scripts/390494/Pinterest%20Meta%20Data.meta.js
// ==/UserScript==

$(document).ready(function(){
   var hide_instructions = setInterval(function(){ instructions_check(); }, 250);
   var pin_interval = setInterval(function(){ pin_check(); }, 250);
   var Grab_Link = setInterval(function(){ I_Grab(); }, 250);



  function I_Grab(){
  var link1 = $(`[class="_mn _3m _3s _mp _56"]`).find('a').attr('href')
  var link2 = $('h1').find('a').attr('href')
  var mywindow1 = window.open(link1,'win1', "height=1000,width=800,left=0,status=yes,toolbar=no,menubar=no,location=no");
  var mywindow2 = window.open(link2,'win2', "height=1000,width=800,left=1400,status=yes,toolbar=no,menubar=no,location=no");
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
  var link1 = $(`[class="_mn _3m _3s _mp _56"]`).find('a').attr('href')
  var link2 = $('h1').find('a').attr('href')
  var mywindow1 = window.open(link1,'win1', "height=1000,width=700,left=0,status=yes,toolbar=no,menubar=no,location=no");
  var mywindow2 = window.open(link2,'win2', "height=1000,width=700,left=1500,status=yes,toolbar=no,menubar=no,location=no");
  clearInterval(Grab_Link);
  }


if (e.keyCode == 49 || e.keyCode == 97) {
  $('input[type=radio]')[3].click();
  $('input[type=radio]')[7].click();
  $('input[type=radio]')[11].click();
  $('button.btn.btn-lg.btn-primary').click();
}
else if (e.keyCode == 50 || e.keyCode == 98){
  $('input[type=radio]')[1].click();
  $('input[type=radio]')[5].click();
  $('input[type=radio]')[9].click();
  $('button.btn.btn-lg.btn-primary').click();
}
else if (e.keyCode == 51 || e.keyCode == 99){
  $('input[type=radio]')[1].click();
  $('input[type=radio]')[4].click();
  $('input[type=radio]')[9].click();
  $('button.btn.btn-lg.btn-primary').click();
}
else if (e.keyCode == 52 || e.keyCode == 100){
  $('input[type=radio]')[0].click();
  $('input[type=radio]')[4].click();
  $('input[type=radio]')[9].click();
  $('button.btn.btn-lg.btn-primary').click();
}
else if (e.keyCode == 53 || e.keyCode == 101){
  $('input[type=radio]')[2].click();
  $('input[type=radio]')[6].click();
  $('input[type=radio]')[10].click();
  $('button.btn.btn-lg.btn-primary').click();
}
else if (e.keyCode == 54 || e.keyCode == 102){
  $('input[type=radio]')[0].click();
  $('input[type=radio]')[5].click();
  $('input[type=radio]')[9].click();
  $('button.btn.btn-lg.btn-primary').click();
}
    });
});