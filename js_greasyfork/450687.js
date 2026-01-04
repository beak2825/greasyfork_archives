// ==UserScript==
// @name         Distraction Free Evernote
// @namespace    http://bomelino.de
// @version      0.1
// @description  hit alt+m while a note is open to hide the navbar, header and footer, also activate fullscreen. a second alt+m reverts these changes.
// @author       tino bomelino
// @match        https://www.evernote.com/client/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450687/Distraction%20Free%20Evernote.user.js
// @updateURL https://update.greasyfork.org/scripts/450687/Distraction%20Free%20Evernote.meta.js
// ==/UserScript==





(function() {
    'use strict';
    var mode = false;

    function doc_keyUp(e) {

  if (e.altKey && e.key === "h") {// change hotkey here
      openFullscreen(document.documentElement);
      var bar = document.getElementById("qa-FORMATTING_BAR_CONTAINER");
       var header = document.getElementById("qa-NOTE_HEADER");
       var footer = document.getElementById("qa-NOTE_FOOTER");
      var button = document.getElementById("qa-NOTE_FULLSCREEN_BTN")

      if(!mode){ // turn on distraction free mode
          mode = true;
          // hide sidebar
          if(button.getBoundingClientRect().x > 20){
              button.click()
          }
          bar.parentElement.parentElement.style.display = "none";
          header.style.display = "none";
          footer.style.display = "none";
      }else { // turn off distraction free mode
          mode = false;
          if(button.getBoundingClientRect().x < 20){
              button.click()
          }
          bar.parentElement.parentElement.style.display = "flex";
          header.style.display = "grid";
          footer.style.display = "flex";
      }
  }
}

    function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}


    //
    // keylistener
    document.addEventListener("keyup", doc_keyUp, false);
})();