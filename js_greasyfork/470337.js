// ==UserScript==
// @name        Press CTRL + ArrowLeft or ArrowRight to switch pages
// @namespace   Violentmonkey Scripts
// @match       https://inf-schule.de/*
// @grant       none
// @version     1.0
// @author      -
// @description 3/7/2023, 6:22:35 PM
// @downloadURL https://update.greasyfork.org/scripts/470337/Press%20CTRL%20%2B%20ArrowLeft%20or%20ArrowRight%20to%20switch%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/470337/Press%20CTRL%20%2B%20ArrowLeft%20or%20ArrowRight%20to%20switch%20pages.meta.js
// ==/UserScript==


document.addEventListener("keydown", function onEvent(e) {
   // if (e.ctrlKey == true){
      if (event.key === "ArrowLeft") {
        document.getElementsByClassName("toolbox__tool toolbox__tool--prevpage")[0].click()

      }else if (event.key === "ArrowRight") {
        document.getElementsByClassName("toolbox__tool toolbox__tool--nextpage")[0].click()
     // }
    }
});