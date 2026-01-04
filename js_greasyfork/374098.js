// ==UserScript==
// @name         Ocmp5
// @author       Tehapollo
// @version      1.2
// @include      *mturkcontent.com*
// @include      *s3.amazonaws.com*
// @include      *wml1.crowdcomputingsystems.com*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  keystroke with submit
// @downloadURL https://update.greasyfork.org/scripts/374098/Ocmp5.user.js
// @updateURL https://update.greasyfork.org/scripts/374098/Ocmp5.meta.js
// ==/UserScript==


$(document).ready(function () {
   
        if ($("h2:contains('Which Product Type')").length) {
document.querySelector('input.cc-input.answer.required.check_one.answerInput').focus()    
$(document).keypress(function(event){
        if (String.fromCharCode(event.which) == 1){
            $('input[type=radio]')[0].click();
             setTimeout(function() {
             $('a.button.cc-button.submit-btn.btn.btn-primary').click();
             },200);
       }else if (String.fromCharCode(event.which) == 2){
         $('input[type=radio]')[1].click();
             setTimeout(function() {
             $('a.button.cc-button.submit-btn.btn.btn-primary').click();
             },200);
       }else  if (String.fromCharCode(event.which) == 3){
         $('input[type=radio]')[2].click();
             setTimeout(function() {
             $('a.button.cc-button.submit-btn.btn.btn-primary').click();
             },200);
       }else if (String.fromCharCode(event.which) == 4){
          $('input[type=radio]')[3].click();
             setTimeout(function() {
             $('a.button.cc-button.submit-btn.btn.btn-primary').click();
             },200);
         }
         });

    }
})();