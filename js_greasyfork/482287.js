// ==UserScript==
// @name         Pozadí v i4
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Přihlas se.
// @author       You
// @match        https://i4.spse.cz/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @license MIT  
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482287/Pozad%C3%AD%20v%20i4.user.js
// @updateURL https://update.greasyfork.org/scripts/482287/Pozad%C3%AD%20v%20i4.meta.js
// ==/UserScript==

const imageUrl = 'url("https://www.spse.cz/img/zamestnanci/large/Cernoch.png")';

  // Funkce pro změnu pozadí
  function changeBackground() {
    document.querySelector(".x-autocontainer-outerCt").style.backgroundImage = imageUrl;
    document.querySelector(".x-autocontainer-outerCt").style.backgroundSize = "25%";
    document.querySelector(".vpt-welcome-container .cmp-welcome-panel").style.backgroundImage = imageUrl;
    document.querySelector(".vpt-welcome-container .cmp-welcome-panel").style.backgroundSize = "5%";
    document.querySelector(".vpt-welcome-container .cmp-welcome-panel").style.color = "#f0f";
    document.querySelector(".x-window-body-default").style.backgroundImage = imageUrl;
    document.querySelector(".x-window-body-default").style.backgroundSize = "15%";
    document.querySelector(".x-border-box *").style.color = "#f0f";
  }  

  // Posluchač události pro stisk klávesy
  document.addEventListener('keydown', function(event) {

    
   if (event.key === "2" || event.key === "Enter" || event.key === " ") {
    changeBackground();
}
  }); 