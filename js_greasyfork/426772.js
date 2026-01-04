// ==UserScript==
// @name        Semi Auto Buy
// @namespace   Violentmonkey Scripts
// @match       https://www.amazon.*/_itm/dp/*
// @match       https://arcus-www.amazon.*/_itm/dp/*
// @grant       GM.notification
// @version     0.0001_beta
// @author      @REEEEEEEEEEEEEEEEEEEEEE
// @description 5/20/2021, 1:05:34 PM
// @downloadURL https://update.greasyfork.org/scripts/426772/Semi%20Auto%20Buy.user.js
// @updateURL https://update.greasyfork.org/scripts/426772/Semi%20Auto%20Buy.meta.js
// ==/UserScript==

amzde_mid = "A3JWKAKR8XB7XF";
amzes_mid = "A1AT7YVPFBWXBL";
amzfr_mid = "A1X6FK5RDHNB96";
amzit_mid = "A11IL2PNWYJU7H";
amztr_mid = "A1UNQM1SR2CHM";
amztrde_mid = "A3O5TP4R0OZYXZ";
amzuk_mid = "A3P5ROKL5A1OLE";
amzjp_mid = "AN1VRQENFRJN5";
merchantid = document.getElementById("merchantID").value;
kontrol1 = document.getElementById("add-to-cart-button");
kontrol2 = document.getElementById("buybox-see-all-buying-choices");
var bildirim = {
    text: 'Ürün Sepete Eklendi! Sekmeye Gitmek İçin Tıkla. Bol şanslar.',
    title: document.title,
    timeout: 15000,
    onclick: function() { window.focus(); },
  };
var bildirim2 = {
    text: 'Offers bulundu! Sekmeye Gitmek İçin Tıkla. Bol şanslar.',
    title: document.title,
    timeout: 15000,
    onclick: function() { window.focus(); },
  };

if (kontrol1 == null && kontrol2 == null) {
  console.log("Ürün Stokta Yok. Stokta görünene kadar refresh yapılacak.");
  setTimeout(function(){ location.reload(true); }, 2500);
} else {
  if (kontrol1) {
    if (merchantid == amzde_mid || merchantid == amzes_mid || merchantid == amzfr_mid || merchantid == amzit_mid || merchantid == amztr_mid || merchantid == amztrde_mid || merchantid == amzuk_mid || merchantid == amzjp_mid) {
    console.log("bulundu!");
    if (document.getElementById("buy-now-button")) {
      GM.notification(bildirim)
      console.log("buynow bulundu. tıklanıyor");
      document.getElementById("buy-now-button").click();
    } else {
      GM.notification(bildirim)
      console.log("buynow bulunamadı. add to cart tıklanıyor");
      document.getElementById("add-to-cart-button").click();
    }
    } else {
    console.log("Satıcısı amazon degil galiba. MID eşleşmesi bulunamadı. F5e devam.");
    setTimeout(function(){ location.reload(true); }, 2500);
  }
  } else if (kontrol2) {
    kontrol2.getElementsByTagName("a")[0].click()
    GM.notification(bildirim2)
  }
}