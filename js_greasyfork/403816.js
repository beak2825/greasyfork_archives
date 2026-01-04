// ==UserScript==
// @name         MzHelperTransfers
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  pokazuje ktorzy zawodnicy sprzedani + usuwa nie sprzedanych po najechaniu na link
// @author       kostrzak16 (Michal Kostrzewski)
// @match        https://www.managerzone.com/*
// @grant        none
// @license MIT 

// @downloadURL https://update.greasyfork.org/scripts/403816/MzHelperTransfers.user.js
// @updateURL https://update.greasyfork.org/scripts/403816/MzHelperTransfers.meta.js
// ==/UserScript==

function podswietlSprzedanychNaLiscieObserwowanych(removeRest)
{
$(".bid_history_lite").each(function(){
    var godz = parseInt($(this).find("dd:nth(1) span:nth(1)").text().substr($(".bid_history_lite:first").find("dd:nth(1) span:nth(1)").text().indexOf(" ")+1,2),10);
    var minuty = parseInt($(this).find("dd:nth(1) span:nth(1)").text().substr($(".bid_history_lite:first").find("dd:nth(1) span:nth(1)").text().indexOf(" ")+4,2),10);
    var dzien = parseInt($(this).find("dd:nth(1) span:nth(1)").text().substr(0,2),10);
    var dzienNow = parseInt(new Date().getDate());
    var godzNow = parseInt(new Date().getHours());
    var minutyNow = parseInt(new Date().getMinutes());
    console.log($(this).find("dd:nth(1) span:nth(1)").text().substr($(".bid_history_lite:first").find("dd:nth(1) span:nth(1)").text().indexOf(" ")+1,2));
    console.log(dzien + " " + godz+ " " + minuty  + " " + dzienNow + " " + godzNow + " " + minutyNow + " ");
    if(dzienNow > dzien || (dzienNow == dzien && godzNow > godz) || (dzienNow == dzien && godzNow == godz && minutyNow > minuty) )
       {
       $(this).closest(".bid-history-lite-wrapper").css("background-color","#b8ffb8");
           console.log("pf");
       }
    else if(removeRest)
    {
    $(this).closest(".playerContainer").remove();
    }

});
}

function ukrywaczBlokow(){
$('.attributes-wrapper div[style*="width: 100px"]').click(function(){
    var ind =  $('.attributes-wrapper div[style*="width: 100px"]').index(this);

if( $(this).css("background-color") != "rgb(184, 255, 184)")
   {
       $(this).css("background-color","#b8ffb8");
            $('.player_skills').each(function(){

                //dont hide

      var isGreen =  $(this).find("tr:nth("+ind+") div.skill:first img:first").attr("src") != "data:image/gif;base64,R0lGODlhDAAKAJEDAP///8zM/wAA/////yH5BAEAAAMALAAAAAAMAAoAAAIk3CIpYZ0BABJtxvjMgojTIVwKpl0dCQbQJX3T+jpLNDXGlDUFADs=";
    isGreen = !isGreen;
                var isOver7 = $(this).find("tr:nth("+ind+") div.skill:first img").length > 6;
       console.log( $(this).closest(".playerContainer").find('.player_name').html() + " " + isGreen + " " + isOver7 + " " + (!isGreen && !isOver7));
       if((!isGreen && !isOver7))
       { $(this).find("tr:nth("+ind+") div.skill:first img").closest(".playerContainer").hide();} });

   }
    else
    {
     $(this).css("background-color","");
    }



});

}

function ukrywaczBlokow2() {

$('.attributes-wrapper div[style*="width: 100px"]').each(function(){
    var ind =  $('.attributes-wrapper div[style*="width: 100px"]').index(this);

if( $(this).css("background-color") == "rgb(184, 255, 184)") //ukrywamy bloki
   {
          $('.player_skills').each(function(){

                //dont hide

      var isGreen =  $(this).find("tr:nth("+ind+") div.skill:first img:first").attr("src") != "data:image/gif;base64,R0lGODlhDAAKAJEDAP///8zM/wAA/////yH5BAEAAAMALAAAAAAMAAoAAAIk3CIpYZ0BABJtxvjMgojTIVwKpl0dCQbQJX3T+jpLNDXGlDUFADs=";
    isGreen = !isGreen;
                var isOver7 = $(this).find("tr:nth("+ind+") div.skill:first img").length > 6;
              var isLP1or2 =   $(this).find("tr:nth("+ind+") td:first").hasClass("gm_s1") || $(this).find("tr:nth("+ind+") td:first").hasClass("gm_s2") ;
              if(isLP1or2)
              console.log(    $(this).find("tr:nth("+ind+") td:first").text());


   //    console.log( $(this).closest(".playerContainer").find('.player_name').html() + " " + isGreen + " " + isOver7 + " " + (!isGreen && !isOver7));
    //   if(((!isGreen && !isOver7) || !isNonLP))
       if(((!isGreen && !isOver7) || isLP1or2 ))
       { $(this).find("tr:nth("+ind+") div.skill:first img").closest(".playerContainer").hide();} });
   }



});

}


(function() {
    'use strict';

$( document ).ajaxComplete(function() {
    setTimeout(function(){  ukrywaczBlokow2(); },2000); });
    setTimeout(function(){  podswietlSprzedanychNaLiscieObserwowanych();
                          ukrywaczBlokow();
     $('a[href="/?p=shortlist&sub=removeall"]').mouseenter(function(){
        podswietlSprzedanychNaLiscieObserwowanych(true);   });

                         }, 1000);


    // Your code here...
})();