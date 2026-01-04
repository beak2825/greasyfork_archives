// ==UserScript==
// @name        meet.google.com.not-fukink-borders-on-share-screen
// @namespace   Violentmonkey Scripts
// @match        https://*.meet.google.com/*
// @grant       none
// @version     1.0
// @author      theevil24a
// @description this extencion is for delete borders and diferent clients sharing screen
// @compatible   firefox >=52
// @compatible   chrome >=55
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445411/meetgooglecomnot-fukink-borders-on-share-screen.user.js
// @updateURL https://update.greasyfork.org/scripts/445411/meetgooglecomnot-fukink-borders-on-share-screen.meta.js
// ==/UserScript==
;(function () {
  let button = document.createElement('button')
  button.innerText = '{=}'
  button.id = "moneyscript"
  button.style = "position: fixed;top: 0;left: 0;z-index: 99999;"
  document.querySelector("body").appendChild(button)
  document.querySelector("#moneyscript").addEventListener("click", (event) => {
    event.preventDefault()
    for(let key of document.querySelectorAll("[data-allocation-index]")){
      param = key.getAttribute("data-allocation-index") 
      if (param != 0){
        document.querySelector(`[data-allocation-index="${param}"]`).remove()
      }
    }
    document.body.style.zoom=1.0;this.blur();
  }, false);
})()