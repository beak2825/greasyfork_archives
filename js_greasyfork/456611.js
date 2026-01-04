// ==UserScript==
// @name        Suruga-ya.jp Stock Price
// @namespace   Violentmonkey Scripts
// @match       https://www.suruga-ya.jp/product/detail/*
// @grant       none
// @version     1.0
// @author      -
// @description -
// @downloadURL https://update.greasyfork.org/scripts/456611/Suruga-yajp%20Stock%20Price.user.js
// @updateURL https://update.greasyfork.org/scripts/456611/Suruga-yajp%20Stock%20Price.meta.js
// ==/UserScript==

window.addEventListener("load", function() {
  console.log("Loaded");
  if(document.querySelector(".price-buy") !== null) return;
  const scripts = document.querySelectorAll("script");
  for(let script of scripts) {
    if(script.type === "application/ld+json") {
      const obj = JSON.parse(script.innerText);
      if(obj.length === 1 && obj[0]["@type"] === "product") {
        let p = document.createElement("div");
        p.innerText = "Predicted Price: " + obj[0]["offers"][0]["price"] + "円";
        console.log(p);
        document.querySelector(".item-price-note-wrap").appendChild(p);
      }
    }
  }
});