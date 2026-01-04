// ==UserScript==
// @name         Production & Dev instance warning
// @namespace    ahappyviking
// @version      1.0.0
// @description  Warns you if you are on the dev or prod instance of your web app (not on localhost)
// @match        https://*.[APP NAME HERE].com/*
// @icon         https://i.kym-cdn.com/entries/icons/original/000/027/475/Screen_Shot_2018-10-25_at_11.02.15_AM.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477490/Production%20%20Dev%20instance%20warning.user.js
// @updateURL https://update.greasyfork.org/scripts/477490/Production%20%20Dev%20instance%20warning.meta.js
// ==/UserScript==

const main = () => {
    const elem = document.createElement('div')
    elem.style.position = "fixed"
    elem.style.left = 0
    elem.style.right = 0
    elem.style.top = 0
    elem.style.height = "14px"
    elem.style.fontSize = "10px"
    elem.style.cursor = "pointer"
    elem.style.zIndex = 99999
    elem.style.fontWeight = "bold"
    elem.style.textAlign = "center"
    elem.addEventListener("click", () => (elem.style.display = "none"))
    document.body.appendChild(elem)
      
    if (window.location.hostname.startsWith("dev")){
      elem.style.backgroundColor = "#04d9ff"
      elem.innerText = "NOT ON LOCALHOST - DEV"
    }else{
      elem.style.backgroundColor = "yellow"
      elem.innerText = "NOT ON LOCALHOST - PRODUCTION"
    }
  }
  
  main()