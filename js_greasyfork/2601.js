// ==UserScript==
// @name        OCMP
// @namespace   DCI
// @include     https://wml.crowdcomputingsystems.com*
// @version     1.1
// @description x
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2601/OCMP.user.js
// @updateURL https://update.greasyfork.org/scripts/2601/OCMP.meta.js
// ==/UserScript==


document.addEventListener( "keydown", kas, false);

function kas(i) {
     if ( i.keyCode == 97 ) { // 1
     $('.cc-input.rating.required.answerInput').eq(0).click();
     $('.button.cc-button.submit-btn.btn.btn-primary').click();
         }    
     if ( i.keyCode == 98 ) { // 2
   $('.cc-input.rating.required.answerInput').eq(1).click();
   $('.button.cc-button.submit-btn.btn.btn-primary').click();          
     }
     if ( i.keyCode == 99 ) { // 3
   $('.cc-input.rating.required.answerInput').eq(2).click();
   $('.button.cc-button.submit-btn.btn.btn-primary').click();
     }
     if ( i.keyCode == 100 ) { // 4
   $('.cc-input.rating.required.answerInput').eq(3).click();
   $('.button.cc-button.submit-btn.btn.btn-primary').click();
         
     }
}