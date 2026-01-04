// ==UserScript==
// @name        webarchieve theme
// @namespace   pwa
// @match       https://web.archive.org/*
// @grant       none
// @version     1.0
// @author      -
// @description 10/13/2023, 2:41:33 PM
// @downloadURL https://update.greasyfork.org/scripts/486282/webarchieve%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/486282/webarchieve%20theme.meta.js
// ==/UserScript==


window.onload = () => {
  console.log("[+] onload")

  document.bgColor = "#eee";

  // possibly controversial:
  document.getElementById("wm-ipp-base").remove();
  document.getElementsByTagName("tr")[0].remove();

  elt = document.getElementsByTagName("font")
  for (i = 0; i < elt.length; i++) {
    elt[i].color = "#000";
  }
  elt = document.getElementsByClassName("highlit-code")
  for (let i = 0; i < elt.length; i++) {
    elt[i].style.color = "#c22"
  }
  elt = document.getElementsByTagName("img")
  for (i = 0; i < elt.length; i++) {
    elt[i].style.color = "#000"
  }
  elt = document.getElementsByTagName("a")
  for (i = 0; i < elt.length; i++) {
    elt[i].style.color = "#00c"
  }
}

