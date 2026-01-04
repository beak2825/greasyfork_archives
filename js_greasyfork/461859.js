// ==UserScript==
// @name        UnBlur: Nettavisen
// @license MIT
// @namespace   pwa
// @match       https://*nettavisen.no/*
// @icon https://nettavisen.no/favicon.ico
// @grant       none
// @version     1.1
// @author      pwa
// @description 7/6/2022, 4:54:57 PM
// @downloadURL https://update.greasyfork.org/scripts/461859/UnBlur%3A%20Nettavisen.user.js
// @updateURL https://update.greasyfork.org/scripts/461859/UnBlur%3A%20Nettavisen.meta.js
// ==/UserScript==

window.stopAllTimers = function() {
  const highestTimeoutId = setTimeout(";");
  for (let i = 0 ; i < highestTimeoutId ; i++) {
    clearTimeout(i);
  }
}


window.adblock = function() {
  matches = document.querySelectorAll("bazaar-ad");
  for (let i in matches) {
    try { matches[i].remove() }
    catch (error) {}
  }
}


window.addEventListener('load', function() {
  console.log("[+] load event");
  window.stopAllTimers();

  window.setInterval(() => {
    console.log("[+] timeout event");
    window.stopAllTimers();
    window.adblock();
  }, 1000);

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

