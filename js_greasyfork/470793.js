// ==UserScript==
// @name        UnBlur: tb.no
// @namespace   pwa
// @match       https://*tb.no/*
// @icon        https://tb.no/favicon.ico
// @license     MIT
// @grant       none
// @author      pwa
// @description 11/7/2023, 01:01:01 PM
// @version 0.0.1.20230714063201
// @downloadURL https://update.greasyfork.org/scripts/470793/UnBlur%3A%20tbno.user.js
// @updateURL https://update.greasyfork.org/scripts/470793/UnBlur%3A%20tbno.meta.js
// ==/UserScript==

window.adblock = function() {
  try {
    document.querySelector('.aid-background-blur').style.filter = "blur(0px)"
    document.getElementById("aid-overlay").style.visibility = "hidden"

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

  } catch {
    console.log("[-] failed to unblur");
  }
}

window.addEventListener('load', function() {
  console.log("[+] load event");
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

