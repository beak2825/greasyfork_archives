// ==UserScript==
// @name        OfferID Finder + Auto Refresh
// @namespace   Violentmonkey Scripts
// @match       https://www.amazon.*/_itm/dp/*
// @grant       GM.notification
// @grant       GM.xmlHttpRequest
// @version     0.000003_alpha_rc_new_final_new_2
// @author      @REEEEEEEEEEEEEEEEEEEEEE
// @description İzinsiz Dağıtmayın Tşkler
// @downloadURL https://update.greasyfork.org/scripts/426979/OfferID%20Finder%20%2B%20Auto%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/426979/OfferID%20Finder%20%2B%20Auto%20Refresh.meta.js
// ==/UserScript==

// Merchant IDs
var amzde_mid = "A3JWKAKR8XB7XF";
var amzes_mid = "A1AT7YVPFBWXBL";
var amzfr_mid = "A1X6FK5RDHNB96";
var amzit_mid = "A11IL2PNWYJU7H";
var amztr_mid = "A1UNQM1SR2CHM";
var amztrde_mid = "A3O5TP4R0OZYXZ";
var amzuk_mid = "A3P5ROKL5A1OLE";
var amzjp_mid = "AN1VRQENFRJN5";

var addtocart = document.getElementById("add-to-cart-button");
var offers = document.getElementById("buybox-see-all-buying-choices");
var ulke = location.hostname
var asin = document.getElementById("ASIN").value;
var sessionid = document.getElementById("session-id").value;
var merchantid = document.getElementById("merchantID").value;
var url = "http://157.90.248.166:8000/getofferid/?ulke=" + ulke + "&asin=" + asin

var buynowbildirim = {
    text: 'Ürün Sepete Eklendi! Sekmeye Gitmek İçin Tıkla.',
    title: window.location.href,
    timeout: 15000,
    onclick: function() { window.focus(); },
  };
var buyingoptionsbildirim = {
    text: 'Offers bulundu! Sekmeye Gitmek İçin Tıkla.',
    title: window.location.href,
    timeout: 15000,
    onclick: function() { window.focus(); },
  };
var offeridbildirim = {
    text: 'OfferID Bulundu! Sekmeye Gitmek İçin Tıkla.',
    title: window.location.href,
    timeout: 15000,
    onclick: function() { window.focus(); },
  };

GM.xmlHttpRequest({
method: "GET",
url: url,
onload: function(response) {
  responsetext = response.responseText;
  if (responsetext.includes("Bulunamadı")) {
    console.log("OfferID DBde Bulunamadı.");
    if (addtocart == null && offers == null) {
      console.log("Ürün Stokta Yok. Stokta görünene kadar refresh yapılacak.");
      setTimeout(function(){ location.reload(true); }, 2500);
    } else {
      if (addtocart) {
        if (merchantid == amzde_mid || merchantid == amzes_mid || merchantid == amzfr_mid || merchantid == amzit_mid || merchantid == amztr_mid || merchantid == amztrde_mid || merchantid == amzuk_mid || merchantid == amzjp_mid) {
          console.log("Merchant ID eşleşmesi bulundu!");
          if (document.getElementById("buy-now-button")) {
            GM.notification(buynowbildirim)
            console.log("buynow bulundu. tıklanıyor");
            document.getElementById("buy-now-button").click();
          } else {
          GM.notification(buynowbildirim)
          console.log("buynow bulunamadı. add to cart tıklanıyor");
          document.getElementById("add-to-cart-button").click();
          }
        } else {
          console.log("Satıcısı amazon degil. MID eşleşmesi bulunamadı. F5e devam.");
          setTimeout(function(){ location.reload(true); }, 2500);
        }
    } else if (offers) {
      console.log("options bulundu")
      offers.getElementsByTagName("a")[0].click()
      // Normalde buraya buying optionstan amazon var mı diye kontrol etme gelmeli ama çözemedim. TODO
      GM.notification(buyingoptionsbildirim)
    }}
  } else {
    // sessionlu
    var offeridurl = "https://" + ulke + "/gp/item-dispatch/ref=dp_ebb_1?ie=UTF8&registryItemID.1=&submit.addToCart=addToCart&registryID.1=&offeringID.1=" + responsetext +"&session-id=" + sessionid +"&itemCount=1"
    // sessionsuz
    //var offeridurl = "https://" + ulke + "/gp/item-dispatch/ref=dp_ebb_1?ie=UTF8&registryItemID.1=&submit.addToCart=addToCart&registryID.1=&offeringID.1=" + responsetext +"&itemCount=1"
    window.open(offeridurl);
    GM.notification(offeridbildirim);
    console.log("OfferID: " + responsetext);
  }
}
});