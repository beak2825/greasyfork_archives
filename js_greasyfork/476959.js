// ==UserScript==
// @name        PwnLadicah
// @namespace   pwa
// @match       https://ladicah.com/*
// @icon        https://chess.com/favicon.ico
// @license     MIT
// @grant       none
// @author      pwa
// @description 08/9/2023, 01:01:01 PM
// @version 0.0.1.20231008150320
// @downloadURL https://update.greasyfork.org/scripts/476959/PwnLadicah.user.js
// @updateURL https://update.greasyfork.org/scripts/476959/PwnLadicah.meta.js
// ==/UserScript==


window.hack = function() {
  let addToBasket_btn = document.querySelector(".product-form__buttons").children[0]
  console.log("addToBasket_btn", addToBasket_btn)

  //alert("product available, hacking...:)");
  //---- TEMP -------------------------
  //addToBasket_btn.disabled = false
  //location.reload();
  //------------------------------------
  let buy_div = document.querySelector(".product-form__buttons").children[1]
  console.log("[!] buy_div", buy_div)

  let buy_btn = buy_div.getElementsByTagName("button")[0];
  console.log("[!] buy_btn", buy_btn)

  console.log("[+] adding two items..\n");
  document.getElementsByName("plus")[0].click()

  console.log("[+] adding to basket..\n");
  addToBasket_btn.click();

  setTimeout(function(){
    console.log("[+] buying...\n")
    buy_btn.click();
    alert("product added 😆")
  }, 1000);
}

var rid = setInterval(function() {
  console.log("[+] checking availability...");
  //location.reload();

  addItem_btn = document.querySelector(".product-form__buttons").children[0]
  console.log("btn", addItem_btn.disabled)
  if (addItem_btn.disabled !== true) {
    console.log("!!! PRODUCT IS AVAILABLE !!!")
    window.hack();
    clearInterval(rid);
    return;
  }
  console.log("not yet available");
  //location.replace("https://ladicah.com/products/star-pants")
  //window.location.reload()
  window.location.reload(1);
  window.location.href = window.location.href


}, 1000);

