// ==UserScript==
// @author       @leoncastro
// @namespace    https://github.com/leoncastro
// @name         imgwet-captcha
// @version      0.02.1
// @description  Resolve ImgWet captcha
// @include      /^(?:https?:)?\/\/(?:www\.)?imgwet\.com\/img-.*/
// @compatible   firefox+greasemonkey
// @compatible   chrome+tampermonkey
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/19559/imgwet-captcha.user.js
// @updateURL https://update.greasyfork.org/scripts/19559/imgwet-captcha.meta.js
// ==/UserScript==
//
(function(){
 var img = document.querySelector('#cformi img[usemap="#captchaareas"]');
 if(img)
 {
  var drw = document.createElement('canvas');
  drw.width = img.width;
  drw.height = img.height;
  drw.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
  for(var i = 0; i < 5; i++)
  {
   var pix = drw.getContext('2d').getImageData(i * img.width / 5 + img.width / 10, 3, 1, 1).data;
   if(pix && !pix[0] && !pix[1] && !pix[2])
   {
    document.querySelector('#imgContinuei').value = i;
    document.querySelector('#cformi').submit();
   }
  }
 }
})();