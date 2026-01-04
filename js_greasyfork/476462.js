// ==UserScript==
// @name        aftenposten invite, no thanks
// @namespace   Violentmonkey Scripts
// @match       https://*.aftenposten.no/*
// @icon https://aftenposten.no/favicon.ico
// @grant       none
// @version     1.0
// @author      pwa
// @license     MIT
// @description 11/23/2022, 10:36:30 PM
// @downloadURL https://update.greasyfork.org/scripts/476462/aftenposten%20invite%2C%20no%20thanks.user.js
// @updateURL https://update.greasyfork.org/scripts/476462/aftenposten%20invite%2C%20no%20thanks.meta.js
// ==/UserScript==

// scroll:

//var intv = setInterval(function() {
//  document.getElementsByClassName('ch-list-item-special');
//  if (elems.length < 2){
//    return false;
//  }
//  //when element is found, clear the interval.
//  clearInterval(intv);
//  window.stopAllTimers();
//
//  window.adblock();
//}, 100);


window.stopAllTimers = function() {
  const highestTimeoutId = setTimeout(";");
  for (let i = 0 ; i < highestTimeoutId ; i++) {
    clearTimeout(i);
  }
}

window.adblock = function() {
  // allow scroll:
  document.body.style.overflow = "visible";

  // background:
  document.getElementById("widget-recirculation-matrix-most-read").nextSibling.nextElementSibling.hidden = true;
  elt = document.getElementById("widget-recirculation-matrix-most-read").nextSibling.nextElementSibling.children[0];
  elt.style.visibility = "hidden"
  elt.style.backgroundColor = ""
  // remove add:
  document.getElementsByClassName("ch-list-item-special")[0].children[0].style.display = "none"
}


window.addEventListener('load', function() {
  console.log("[+] load event");
  window.stopAllTimers();

  setInterval(() => {
    console.log("[+] timeout event");
    window.stopAllTimers();
    window.adblock();
  }, 100);

  window.adblock();

  let nag = document.getElementById('aid-overlay');
  if (nag)
    nag.setAttribute('hidden', true);

  let blur = document.querySelector('.aid-background-blur');
  if (blur)
    blur.style.filter = "blur(0px)";

  let d = document.body.appendChild(
      Object.assign(document.createElement('div'),{ id : 'pwa'})
  )

  d.style.top = 0;
  d.style.position = "absolute";
  d.style.background = "#f00";
  d.style.color = "#ccc";
  d.style.fontFamily = "var(--openSans)";
  d.style.textTransform = "uppercase";
  d.innerText = "Unblur 😈"
  d.style.zIndex = 999999;
});

