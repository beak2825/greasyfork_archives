// ==UserScript==
// @name         Planets.nu Ignore Script
// @namespace    https://greasyfork.org/users/2984
// @version      0.5
// @description  Ignore those pesky other users!
// @author       Dotman
// @copyright	  2014, Dotman
// @license       CC BY-NC-ND 4.0 (http://creativecommons.org/licenses/by-nc-nd/4.0/)
// @include       http://planets.nu/#/*
// @include       http://planets.nu/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/21314/Planetsnu%20Ignore%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/21314/Planetsnu%20Ignore%20Script.meta.js
// ==/UserScript==

/*
(function() {
    'use strict';

    alert("IgnoreScript3!");
    alert($('div.eaccountfeedtitle').length);
    
    $(document).ready(function() {
        alert($('div.eaccountfeedtitle').length);
        $('div.eaccountfeedtitle').remove();
    });
})();
*/

var getIgnoredUserList = function() {
    //alert(GM_getValue("ignoredusers"));   
    return JSON.parse(GM_getValue("ignoredusers"));   
};


var addUserToIgnoreList = function(uname) {
    var userIgnoreList = getIgnoredUserList();
    if (userIgnoreList === null) {
        userIgnoreList = [];
    }
    userIgnoreList.push(uname);
    GM_setValue("ignoredusers",JSON.stringify(userIgnoreList));   
};

var clearUserIgnoreList = function() {
     GM_setValue("ignoredusers",JSON.stringify([]));
     alert("User Ignore List Cleared.");
    location.reload();
    
};


var getIgnoredThreadList = function() {
    alert(GM_getValue("ignoredthreads"));   
    return JSON.parse(GM_getValue("ignoredthreads"));   
};


var addThreadToIgnoreList = function(tname) {
    var threadIgnoreList = getIgnoredThreadList();
    if (threadIgnoreList === null) {
        threadIgnoreList = [];
    }
    threadIgnoreList.push(tname);
    GM_setValue("ignoredthreads",JSON.stringify(threadIgnoreList));   
};

var clearThreadIgnoreList = function() {
     GM_setValue("ignoredthreads",JSON.stringify([]));
     alert("Thread Ignore List Cleared.");
    
};

var hideMessages = function() {

           // Check the ignored user list and clear anything that should be ignored
           var ignoredUsers = getIgnoredUserList();
    
    // Handle the activity feed
           $('div.eaccountfeedline:has(div.etimeago:has(a[href^="#/account/"]:has(span)))').each(function(index, elem) {
              //console.log($(this > div.etimeago).text()); 
               //console.log("INDEX: " + index + " >>> Timeagoelems: " + $('this > div.etimeago:has(a[href^="#/account/"]:has(span)', elem).text());
              // console.log("INDEX: " + index + " >>> Timeagoelems: " + $('div.etimeago',elem));
               // console.log($('div.etimeago:has(a):has(span)',elem));
               console.log("Index: " + index + ">>>");
               console.log($('div.eaccountfeedline:has(div.etimeago:has(a[href^="#/account/"]:has(span)))',elem));
               $('div.etimeago > a[href^="#/account/"] > span',elem).each(function(ind,e) {
                   console.log("***");
                   console.log($(e).text());
                  //if ($(e).text() == "rsk") {
                   if (ignoredUsers.indexOf($(e).text()) >= 0) {
                      console.log("FOUNDFOUNDFOUND: " + $(e).text());
                      //$(elem).remove();
                      console.log($(e).parent().parent().next('div.efeedmessage'));
                      $(e).parent().parent().next('div.efeedmessage').remove();
                      $(e).parent().parent().remove();
                   }
               });
               console.log($('div.etimeago > a[href^="#/account/"] > span',elem).text());
               console.log($('div.etimeago > a[href^="#/account/"] > span',elem).length);
              
               console.log("<<<");
           });
    
console.log("Handling full feed.");
    // Handle the full activity feed
           //$('div.efeedline:has(div:has(div.etimeago:has(a[href^="#/account/"]:has(span))))').each(function(index, elem) {
    
    $('div.efeedtitle:has(a[href^="#/account/"]:has(span))').each(function(index,elem) {
      //console.log(elem);
      //console.log($('a[href^="#/account/"] > span',elem).text());
      //if ($('a[href^="#/account/"] > span',elem).text() == "ace rimmer") {
        if (ignoredUsers.indexOf($('a[href^="#/account/"] > span',elem).text()) >= 0) {
            if ($(elem).parent().parent().prop('className') == "efeedline") {
                console.log("****** IN ");
                $(elem).next().next().remove();
                $(elem).next().remove();
                $(elem).parent().prev().html("");
                $(elem).remove();
            }
            else {
                $(elem).parent().parent().remove();
            }
        }
      });
    /*
    $('div.efeedline:has(div:has(div.etimeago:has(a[href^="#/account/"])))').each(function(index, elem) {
              //console.log($(this > div.etimeago).text()); 
               //console.log("INDEX: " + index + " >>> Timeagoelems: " + $('this > div.etimeago:has(a[href^="#/account/"]:has(span)', elem).text());
              // console.log("INDEX: " + index + " >>> Timeagoelems: " + $('div.etimeago',elem));
               // console.log($('div.etimeago:has(a):has(span)',elem));
               console.log("EFIndex: " + index + ">>>");
               console.log($('div.efeedline:has(div.etimeago:has(a[href^="#/account/"]:has(span)))',elem));
               $('div.etimeago > a[href^="#/account/"] > span',elem).each(function(ind,e) {
                   console.log("***");
                   console.log($(e).text());
                  //if ($(e).text() == "rsk") {
                   if (ignoredUsers.indexOf($(e).text()) >= 0) {
                      console.log("FOUNDFOUNDFOUND: " + $(e).text());
                      //$(elem).remove();
                      console.log($(e).parent().parent().next('div.efeedmessage'));
                      $(e).parent().parent().next('div.efeedmessage').remove();
                      $(e).parent().parent().remove();
                   }
               });
               console.log($('div.etimeago > a[href^="#/account/"] > span',elem).text());
               console.log($('div.etimeago > a[href^="#/account/"] > span',elem).length);
              
               console.log("<<<");
           });
           */
};

var addIgnoreKeys = function() {
           $('div.eaccountstartfeed').after("<a class='dotclearuignore'>Clear Ignored Userlist</a>");
           
           //$('div.etimeago').append(" ");
           //$('div.etimeago').append("<a class='dottignore'>Ignore Thread</a>");
           $('div.etimeago').append(" ");
           $('div.etimeago').append("<a class='dotuignore'>Ignore User</a>");
           
           $('.dotclearuignore').click(function() {
              clearUserIgnoreList(); 
           });
           
           $('.dottignore').click(function() {
               var thread = $(this).parent();
               //$('div.eaccountfeedline').remove();
           });
           
           $('.dotuignore').click(function() {
               var parparclass = $(this).parent().parent().parent().prop('className').trim();
               
               console.log("ParPar:  >>" + parparclass + "<<");
             
               if (parparclass === "ereply" || parparclass === "efeedline") {    
                   console.log("In parparclass");
                   var user = $(this).parent().parent().children('div.efeedtitle').children('a:first-child').children('span').text();
               }
               else {          
                   var user = $(this).parent().children('a:first-child').children('span').text();
               }
  //             alert(user);
               //GM_setValue("ignoredusers",user);
               addUserToIgnoreList(user);
               //var tt = GM_getValue("ignoredusers");
               var tt = getIgnoredUserList();
    //           alert(tt);
               hideMessages();
               //$('div.eaccountfeedline').remove();
           });
           
           
           
           hideMessages();
           
           /*
           // Check the ignored user list and clear anything that should be ignored
           var ignoredUsers = getIgnoredUserList();
           $('div.eaccountfeedline:has(div.etimeago:has(a[href^="#/account/"]:has(span)))').each(function(index, elem) {
              //console.log($(this > div.etimeago).text()); 
               //console.log("INDEX: " + index + " >>> Timeagoelems: " + $('this > div.etimeago:has(a[href^="#/account/"]:has(span)', elem).text());
              // console.log("INDEX: " + index + " >>> Timeagoelems: " + $('div.etimeago',elem));
               // console.log($('div.etimeago:has(a):has(span)',elem));
               console.log("Index: " + index + ">>>");
               console.log($('div.eaccountfeedline:has(div.etimeago:has(a[href^="#/account/"]:has(span)))',elem));
               $('div.etimeago > a[href^="#/account/"] > span',elem).each(function(ind,e) {
                   console.log("***");
                   console.log($(e).text());
                  //if ($(e).text() == "rsk") {
                   if (ignoredUsers.indexOf($(e).text()) >= 0) {
                      console.log("FOUNDFOUNDFOUND: " + $(e).text());
                      //$(elem).remove();
                      console.log($(e).parent().parent().next('div.efeedmessage'));
                      $(e).parent().parent().next('div.efeedmessage').remove();
                      $(e).parent().parent().remove();
                   }
               });
               console.log($('div.etimeago > a[href^="#/account/"] > span',elem).text());
               console.log($('div.etimeago > a[href^="#/account/"] > span',elem).length);
              
               console.log("<<<");
               
           });
           */
           
       };


//alert("IgnoreScript6!");
    //GM_setValue("ignoredusers","aguy");
    //addUserToIgnoreList("aguy");
    //alert(getIgnoredUserList());

     $(document).ready(function() {
         
         $(window).hashchange( function(){
    // Alerts every time the hash changes!
             //alert("Hash change!");
    setTimeout(addIgnoreKeys, 1000);
             
  });
       setTimeout(addIgnoreKeys, 2000);
     });


         
           /*
           var a = [1, 2, 3];
GM_setValue("key", JSON.stringify(a));

var b = JSON.parse(GM_getValue("key"));
*/

/*

function wrapper() {
    alert("IgnoreScript5!");
    //GM_setValue("ignoredusers","aguy");
    addUserToIgnoreList("aguy");
    alert(getIgnoredUserList());
    $(document).ready(function() {
       setTimeout(function() {
           //alert($('div.eaccountfeedline').length);
         //  $('div.eaccountfeedtitle').empty();
          // $('div.eaccountfeedline').remove();
           //$('div#eactivitycol').remove();
           //alert($('div.eaccountfeedtitle').length);
           
  
           
           
           
           $('div.etimeago').append(" ");
           $('div.etimeago').append("<a class='dottignore'>Ignore Thread</a>");
           $('div.etimeago').append(" ");
           $('div.etimeago').append("<a class='dotuignore'>Ignore User</a>");
           
           $('.dottignore').click(function() {
               var thread = $(this).parent();
               //$('div.eaccountfeedline').remove();
           });
           
           $('.dotuignore').click(function() {
               var user = $(this).parent().children('a:first-child').children('span').text();
               alert(user);
               GM_setValue("ignoredusers",user);
               var tt = GM_getValue("ignoredusers");
               alert(tt);
               //$('div.eaccountfeedline').remove();
           });

           
       }, 2000);
        
    });
    
    
      
}

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);
document.body.removeChild(script);

*/