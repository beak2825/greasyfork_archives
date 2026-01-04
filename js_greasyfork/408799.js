// ==UserScript==
// @name         RYM artist page release filter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Allows to filter releases by year, collaboration, credits, composer
// @author       mapple
// @match        https://rateyourmusic.com/artist/*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/408799/RYM%20artist%20page%20release%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/408799/RYM%20artist%20page%20release%20filter.meta.js
// ==/UserScript==
(function(){
     'use strict';
//alert('Hello World !');

//Shows all the releases

var btn =document.querySelectorAll("span.disco_expand_section_link")
for (i = 0; i < btn.length; i++) {
          btn[i].click();
                                 }
      function Main(){


       //Creates the search field, go and close buttons,

    $('body').append('<input type="text" value="Year / Composer / Collab" id="Srch1">')
    $("#Srch1").css("position", "fixed").css("top", 110).css("left", 110);

    $('body').append('<input type="button" value="Go" id="go1">')
    $("#go1").css("position", "fixed").css("top", 110).css("left", 300);

    $('body').append('<input type="text" value="Title / Credit" id="Srch2">')
    $("#Srch2").css("position", "fixed").css("top", 80).css("left", 110);

    $('body').append('<input type="button" value="Go" id="go2">')
    $("#go2").css("position", "fixed").css("top", 80).css("left", 300);

    $('body').append('<input type="button" value="Close" id="close">')
    $("#close").css("position", "fixed").css("top", 110).css("left", 350);


    //Close button

      $("#close").click( function(){
           //alert('Hello World !');
          var Releases=document.querySelectorAll("div.disco_release")
          $("#Srch1").remove();
          $("#go1").remove();
           $("#Srch2").remove();
          $("#go2").remove();
          $("#close").remove();
           for (i = 0; i < Releases.length; i++) {
          Releases[i].style.display = ""
                                                 }
           }
                      );

// Go button
 $("#go1").click(

         function Filter1(){
             //alert('Hello World !');
          var s12=document.getElementById('Srch1').value
          var s13=s12.toLowerCase()
          var Releases=document.querySelectorAll("div.disco_release")
          var Mainlines=document.querySelectorAll("div.disco_mainline")
          var Sublines=document.querySelectorAll("div.disco_subline")
          //console.log(Releases.length);

        for (i = 0; i < Sublines.length; i++) {
           var txt = Sublines[i].textContent
           var txt2=txt.toLowerCase()
           //console.log(txt2)

            if (txt2.includes(s13)==true) {
                Releases[i].style.display = ""
            } else {
                Releases[i].style.display = "none"
                   }
                                             }
           }
         )
 $("#go2").click(


         function Filter2(){
           //alert('Hello World !');
       //var s=document.getElementById('Srch').ontypedown
          var s22=document.getElementById('Srch2').value
          var s23=s22.toLowerCase()
          var Releases=document.querySelectorAll("div.disco_release")
          var Mainlines=document.querySelectorAll("div.disco_mainline")
          var Sublines=document.querySelectorAll("div.disco_subline")
          //console.log(Releases.length);

        for (i = 0; i < Mainlines.length; i++) {
           var txt = Mainlines[i].textContent
           var txt2=txt.toLowerCase()

            if (txt2.includes(s23)==true) {
                Releases[i].style.display = ""
            } else {
                Releases[i].style.display = "none"
                   }
                                             }
           }
         )
     }

    Main()
    })()
