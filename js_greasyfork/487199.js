// ==UserScript==
// @name Plasma Center Donor Links
// @namespace http://tampermonkey.net/
// @version 2.0
// @description Adds Links for donor profiles to queue pages, linking the User ID to their profile.
// @author Ayeliss
// @match https://nextgenprd.cslg1.cslg.net/st.dnr/ui/donorQueue/*
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487199/Plasma%20Center%20Donor%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/487199/Plasma%20Center%20Donor%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //get each donor from the list
    $('table.tableSearchResultData td:first-child').each(function(){

      //get the donor number
      var donor=$(this)[0].innerHTML;

      //strip off the parentheses
      donor=(donor.slice(donor.indexOf("(") + 1,  donor.indexOf(")")));

      //create the link to the profile
      var donorlink="https://nextgenprd.cslg1.cslg.net/st.dnr/ui/donor/"+donor;

      //show profile link, and create a container for the visit
      $(this).html($(this)[0].innerHTML.replace(/ *\([^)]*\) */g, "<BR><a href='"+donorlink+"'>Donor Chart: "+donor+"</a><div id='"+donor+"L1'>"+donorlink+"</div>"));

      //get the donor URL
      donorlink = $('#'+donor+'L1').text();

      //target the visit link
      var donorelement = "#donorChartSideBar> div:nth-child(2)>div>a"

      //format the ajax call
      var ajaxcall = donorlink + " " + donorelement;

      //load visit via ajax
      $('#'+donor+'L1').load(ajaxcall, function(responseTxt, statusTxt, xhr){

        //create a container for the stage
        $("<div class='L2'>...</div>").appendTo('#'+donor+'L1');

        //get the visit URL
        var donorlink2 = $('#'+donor+'L1 a').attr('href');

        //target the stage link
        var donorelement2 = ".divCoreSection > div:nth-child(3) > div > div > div > div:nth-child(1) > div.formContentCell > span"

        //format the ajax call
        var ajaxcall2 = donorlink2 + " " + donorelement2;

      //load stage via ajax
        $('#'+donor+'L1 .L2').load(ajaxcall2, function(responseTxt, statusTxt, xhr){

          //show stage
          $('#'+donor+'L1 .L2').prepend("Stage: ");

        //close all the scopes
        });
      });
    });
})();