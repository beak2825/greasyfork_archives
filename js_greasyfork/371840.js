// ==UserScript==
// @name        KanaTrainer2 Continue on enter
// @namespace   xyz.upperlevel.snowy
// @description Automatically presses the continue button when the Enter key is pressed
// @version     1
// @include     http://ilearn.dandandin.it/kanatrainer-2.aspx
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/371840/KanaTrainer2%20Continue%20on%20enter.user.js
// @updateURL https://update.greasyfork.org/scripts/371840/KanaTrainer2%20Continue%20on%20enter.meta.js
// ==/UserScript==

window.onload = function() {
  'use strict';
  
  var input = document.getElementById("Textrisposta");
  var inputButton = document.getElementById("Buttonrisposta");
  var generateButton = document.getElementById("ButtonGenera");
  var parent = generateButton.parentElement;

  function isWriting() {
    return input.parentElement.style['display'] == 'none'
  }

  // Execute a function when the user releases a key on the keyboard
  document.getElementsByTagName('body')[0].addEventListener("keyup", function(event) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Trigger the button element with a click
      if (!isWriting()) {
        inputButton.click();
      } else {
        generateButton.click();
      }
    }
  });
  console.log("Continue on enter loaded");
}
