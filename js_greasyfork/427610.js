// ==UserScript==
// @name         ctrl^C + ctrl^V = 💪
// @namespace    http://tampermonkey.net/
// @version      ver-6.9
// @description  pressing "Numpad Subtract" to copy and paste the very last message in the chat!!
// @author       vflc
// @match        https://meet.google.com/*
// @downloadURL https://update.greasyfork.org/scripts/427610/ctrl%5EC%20%2B%20ctrl%5EV%20%3D%20%F0%9F%92%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/427610/ctrl%5EC%20%2B%20ctrl%5EV%20%3D%20%F0%9F%92%AA.meta.js
// ==/UserScript==

(function() {
  'use strict';

  document.body.onkeyup = function(e) {
    // 109 is the keycode for "Numpad Subtract"
    // here's the keycode list
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    if(e.keyCode == 109){
      e.stopPropagation();
      e.preventDefault();

      let chat = document.getElementsByClassName("oIy2qc");
      let text = chat[chat.length - 1].innerHTML;

      let input = document.getElementsByClassName("KHxj8b tL9Q4c");
      input[0].value = text;

      let send = document.getElementsByClassName("uArJ5e Y5FYJe cjq2Db IOMpW Cs0vCd RDPZE");
      send[0].setAttribute("aria-disabled",false);
      send[0].click();
      send[0].setAttribute("aria-disabled",true);
      document.activeElement.blur();
    }
  };

})();
