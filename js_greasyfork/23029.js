// ==UserScript==
// @name        Ads Blocker by FaB
// @namespace   sponsor_fb
// @description Ads blocker for Facebook
// @include     https://www.facebook.com/
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23029/Ads%20Blocker%20by%20FaB.user.js
// @updateURL https://update.greasyfork.org/scripts/23029/Ads%20Blocker%20by%20FaB.meta.js
// ==/UserScript==


var k = 0;
window.onload = function () {
  window.addEventListener('scroll', function () {
    k++;
    if (k > 12) {
      for (var i = 0; i < document.all.length; i++)
      {
        if (document.all[i].tagName == 'SPAN') {
          if (document.all[i].innerHTML == 'Post consigliato') {
            document.all[i].innerHTML = 'Spoiler';
          }
          if (document.all[i].className == 'uiStreamAdditionalLogging _5paw _4dcu')
          {
            
            //modifico alcune scritte
            for (var j = 3; j < 7; j++) {
              
              document.all[i - j].innerHTML = 'Ads Blocked by FaB';
              document.all[i + j + 1].innerHTML = '';
            } 
            //modifico immagine  

            for (var j = 10; j < 15; j++) {
              //alert(j + ' ' + document.all[i - j].href);
              document.all[i - j].src = 'https://image.freepik.com/free-icon/facebook-logo_318-49940.jpg' 
            }
            //modifico il link dell'immagine e la card associata 

            for (var j = 10; j < 20; j++) {
              document.all[i - j].href = '';
              if (document.all[i - j].attributes[0].name == 'data-hovercard') {
                document.all[i - j].attributes[0].value = 'FaB'
              }
            }
          }
        }
      }
      k = 1;
    }
  });
}
