// ==UserScript==
// @name         Ruckus
// @author       Tehapollo
// @version      1.3
// @include      *mturkcontent.com*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  Does Stuff
// @downloadURL https://update.greasyfork.org/scripts/377008/Ruckus.user.js
// @updateURL https://update.greasyfork.org/scripts/377008/Ruckus.meta.js
// ==/UserScript==


(function() {
    'use strict';

    if ($("p:contains('Please review the provided Webpage:')").length) {
    $("input[name=external_feedback][value=NO]").click();
    $('li').eq(7).css('font-size',19).css("font-weight", "bold");
    var website = $('td').find('a').attr('href')
    var url_win = window.open(website,null, "height=700,width=1000,status=yes,toolbar=no,menubar=no,location=no,left=800");
    url_win.open()
 $(document).keydown(function (keys) {
   if (keys.keyCode == 96 ||keys.keyCode == 48){
       $("select[name=captcha_challenge_response]").val("0");
     url_win.close()
     setInterval(function() {
               $('input#submitButton').click();
            }, 250);
   }
   else if (keys.keyCode == 97 ||keys.keyCode == 49) {
     $("select[name=captcha_challenge_response]").val("1");
     url_win.close()
     setInterval(function() {
               $('input#submitButton').click();
            }, 250);
 }
   else if (keys.keyCode == 98 ||keys.keyCode == 50) {
     $("select[name=captcha_challenge_response]").val("2");
     url_win.close()
         setInterval(function() {
               $('input#submitButton').click();
            }, 250);
        }
   else if (keys.keyCode == 99 ||keys.keyCode == 51) {
     $("select[name=captcha_challenge_response]").val("3");
     url_win.close()
         setInterval(function() {
               $('input#submitButton').click();
            }, 250);
 }
   else if (keys.keyCode == 100 ||keys.keyCode == 52) {
     $("select[name=captcha_challenge_response]").val("4");
     url_win.close()
         setInterval(function() {
               $('input#submitButton').click();
            }, 250);
 }
   else if (keys.keyCode == 101 ||keys.keyCode == 53) {
     $("select[name=captcha_challenge_response]").val("5");
     url_win.close()
         setInterval(function() {
               $('input#submitButton').click();
            }, 250);
 }
   else if (keys.keyCode == 102 ||keys.keyCode == 54) {
     $("select[name=captcha_challenge_response]").val("6");
     url_win.close()
         setInterval(function() {
               $('input#submitButton').click();
            }, 250);
 }
   else if (keys.keyCode == 103 ||keys.keyCode == 55) {
     $("select[name=captcha_challenge_response]").val("7");
     url_win.close()
         setInterval(function() {
               $('input#submitButton').click();
            }, 250);
 }
   else if (keys.keyCode == 104 ||keys.keyCode == 56) {
     $("select[name=captcha_challenge_response]").val("8");
     url_win.close()
         setInterval(function() {
               $('input#submitButton').click();
            }, 250);
 }
   else if (keys.keyCode == 105 ||keys.keyCode == 57) {
     $("select[name=captcha_challenge_response]").val("9");
     url_win.close()
         setInterval(function() {
               $('input#submitButton').click();
            }, 250);

   }
});

}
})();