// ==UserScript==
// @name        Twitter Sessize Al
// @namespace   https://greasyfork.org/tr/scripts/384741-twitter-sessize-al
// @description Twitter'da karşınıza çıkan fetöcüleri "Kes Lan Fetöcü" butonu ile sessize alıp keyfinize bakabilirsiniz.
// @include     http*://twitter.com/*
// @include     http*://*.twitter.com/*
// @run-at      document-end
// @version     0.4
// @license     GPL-3.0-only
// @icon        https://i.imgur.com/22LkXvY.png
// @downloadURL https://update.greasyfork.org/scripts/384741/Twitter%20Sessize%20Al.user.js
// @updateURL https://update.greasyfork.org/scripts/384741/Twitter%20Sessize%20Al.meta.js
// ==/UserScript==


// Aşağıdaki değişkenler ile oynayarak kendi değişikliklerinizi yapabilirsiniz.

var muteText       = "Kes Lan Fetöcü";				// (Sessize alma butonuna yazılacak yazı.)
var unmuteText     = "Hadi Acıdım Açıyorum";	// (Sessizden çıkartma butonuna yazılacak yazı.)
var intervalSecond = 10;											// (Kaç saniyede bir yazılar kontrol edilsin.)	



// Yazıları değiştiren fonksiyon.
function changeText(){
  // Sessize al butonunun yazısını değiştirmek için.
 	var i = 0;
  document.querySelectorAll(".mute-user-item button").forEach(function(e){
    e.innerText = muteText;
    i++;
  });

  // Sesini açma butonunun yazısını değiştirmek için.
  var s = 0;
  document.querySelectorAll(".unmute-user-item button").forEach(function(e){
    e.innerText = unmuteText;
    s++;
  }); 
};


changeText();

setTimeout(function(){
  changeText();
},5000);

setInterval(function(){
  changeText();
},intervalSecond*1000);