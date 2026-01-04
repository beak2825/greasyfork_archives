// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://learn.freecodecamp.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390084/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/390084/New%20Userscript.meta.js
// ==/UserScript==


document.addEventListener("keydown", function(e) {
  if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.keyCode == 83) {
    e.preventDefault();
    document.getElementsByClassName("btn btn-primary btn-block")[0].click();
  }else if(e.keyCode == 89 ){
      let maybeLater = document.getElementsByClassName("maybe-later-container")[0];
      if(maybeLater){
          maybeLater.firstElementChild.click();
          return;
      }
    let nextButton = document.getElementsByClassName("btn btn-lg btn-primary btn-block")[0];
      if(nextButton){
       nextButton.click();
         return;
      }
  }
}, false);