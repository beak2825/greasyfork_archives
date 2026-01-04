// ==UserScript==
// @name         Baka Native 2
// @author       Lp
// @version      0.0.2
// @description  LoremLoremLorem.
// @license      MIT License.
// @namespace https://greasyfork.org/users/164367
// @include *
// @downloadURL https://update.greasyfork.org/scripts/372743/Baka%20Native%202.user.js
// @updateURL https://update.greasyfork.org/scripts/372743/Baka%20Native%202.meta.js
// ==/UserScript==
//***********************************
function tl() {
    $('.next-sentence-translate-view').click();
    $('.translation-textarea').text('');

    var text_trans = $('.source-text').text();
    translate(text_trans, bahasa).then(text => { // translate('kata', 'bahasa')
        $('.translation-textarea').append(text);
    });
};
tl();
document.addEventListener("keydown", KeyCheck);  //or however you are calling your method
function KeyCheck(event)
{
   var KeyID = event.keyCode;
   switch(KeyID)
   {
      case 32:
      setTimeout(function() {
        $('.green').click();
            setTimeout(tl(), 600);
    }, 300);
        
        
      break; 
      default:
      break;
   }
}