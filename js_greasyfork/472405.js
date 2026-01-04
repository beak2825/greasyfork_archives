// ==UserScript==
// @name        meet.google.com.remove-borders-on-shared-screen
// @namespace   https://greasyfork.org/en/users/1143605-denulu
// @match       https://*.meet.google.com/*
// @grant       none
// @version     1.0
// @author      denulu
// @description Hide all the borders when watching another participant's shared screen
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/472405/meetgooglecomremove-borders-on-shared-screen.user.js
// @updateURL https://update.greasyfork.org/scripts/472405/meetgooglecomremove-borders-on-shared-screen.meta.js
// ==/UserScript==
//
// Based on https://greasyfork.org/en/scripts/445411-meet-google-com-not-fukink-borders-on-share-screen/
//
;(function () {
  let button = document.createElement('button')
  button.innerText = '{=}'
  button.id = "moneyscript"
  button.style = "position: fixed;top: 0;left: 0;z-index: 99999;"
  document.querySelector("body").appendChild(button)
  document.querySelector("#moneyscript").addEventListener("click", (event) => {
    event.preventDefault()
    for(let element of document.querySelectorAll("[data-side]")){
      let param = element.getAttribute("data-side") ;
      if (param != 0){
          let currentVisibility = element.style.display;
          element.style.display = currentVisibility === 'none' ? '' : 'none';
      }
    }
    document.body.style.zoom=1.0;this.blur();
  }, false);
})()