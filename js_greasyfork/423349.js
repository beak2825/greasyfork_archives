// ==UserScript==
// @name        AMZ Auto Refresh
// @namespace   Violentmonkey Scripts
// @match       https://www.amazon.*/gp/aws/cart/add.html
// @match       https://www.amazon.*/gp/aws/cart/add-res.html
// @grant       GM.notification
// @version     0.8
// @author      @REEEEEEEEEEEEEEEEEEEEEE
// @description İzinsiz Dağıtmayın Tşkler
// @downloadURL https://update.greasyfork.org/scripts/423349/AMZ%20Auto%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/423349/AMZ%20Auto%20Refresh.meta.js
// ==/UserScript==

var kontrol = document.getElementsByName("OfferListingId.1");
var bildirim = {
    text: 'Ürün Sepete Eklenebiliyor. Sekmeye Gitmek İçin Tıkla.',
    title: window.location.href,
    timeout: 15000,
    onclick: function() { window.focus(); },
  };

if (kontrol[0]) {
  // alert("Sepete Eklenebiliyor. Auto Refresh Durduruldu.");
  GM.notification(bildirim);
} else {
  if(window.location.href.indexOf("OfferListingId.1") == -1){setTimeout(function(){ location.reload(true); }, 5000);}
}