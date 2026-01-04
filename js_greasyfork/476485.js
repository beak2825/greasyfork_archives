// ==UserScript==
// @name        [AdBlock] aftenposten
// @namespace   Violentmonkey Scripts
// @match       https://*.aftenposten.no/*
// @icon https://aftenposten.no/favicon.ico
// @grant       none
// @author      pwa
// @license     MIT
// @description 11/23/2022, 10:36:30 PM
// @version 0.0.1.20231001103700
// @downloadURL https://update.greasyfork.org/scripts/476485/%5BAdBlock%5D%20aftenposten.user.js
// @updateURL https://update.greasyfork.org/scripts/476485/%5BAdBlock%5D%20aftenposten.meta.js
// ==/UserScript==

var wait_for_rx = '[id^="adPlacement"]';
var wait_for_rx_len = 12


window.adblock_impl = function() {
  // allow scrolling:
  document.body.style.overflow = "visible";

  // login to read nag:
  let elt = document.getElementById("widget-recirculation-matrix-most-read").nextSibling.nextElementSibling;
  elt.style.display = "none";

  // remove background blur:
  document.getElementsByClassName("ch-list-item-special")[0].children[0].style.display = "none"

  // remove ads:
  setTimeout(function() {
    let arr = document.querySelectorAll('[id^="adPlacement"]')
    arr.forEach((elt, index) => {
      //console.log(`${index}: parent: ${elt.parentNode.id}`)
      elt.parentNode.style.display = "none";
    });
  }, 1000);

  // remove ads:
  let arr = document.querySelectorAll('[id^="adPlacement"]')
  arr.forEach((elt) => {
    elt.parentNode.style.display = "none";
  });
}

window.adblock = function() {
  console.log("[+] adblock v.1.0")

  window.adblock_impl();
  setTimeout(function() {
    window.adblock_impl();
  }, 2000);
}


window.stopAllTimers = function() {
  const highestTimeoutId = setTimeout(";");
  for (let i = 0 ; i < highestTimeoutId ; i++) {
    clearTimeout(i);
  }
}

window.addEventListener('load', function() {
  console.log("[+] load event");
  window.stopAllTimers();

  var inter = setInterval(() => {
    let nag = document.getElementById("widget-recirculation-matrix-most-read").nextSibling.nextElementSibling
    let arr = document.querySelectorAll(wait_for_rx);

    console.log("[-] waiting for page, arr.length: ", arr.length, " nag:", nag);
    if (nag != null && arr.length >= wait_for_rx_len) {
      console.log("[+] page ready");
      clearInterval(inter);

      window.stopAllTimers();
      window.adblock();

    }

  }, 100);

});

