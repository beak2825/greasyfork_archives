// ==UserScript==
// @name        TuringMachine.io Option-Remover
// @namespace   Violentmonkey Scripts
// @match       *://turingmachine.io/*
// @grant       none
// @version     1.2
// @author      BlueSkyFox
// @description Removes dropdown options of predefined TMs for educational purposes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511935/TuringMachineio%20Option-Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/511935/TuringMachineio%20Option-Remover.meta.js
// ==/UserScript==

let repeatCheck;

function checkTextLayer(){
  let aceTextLayer = document.querySelector("div.ace_text-layer");
  if(aceTextLayer){
    while (aceTextLayer.firstChild) {
    aceTextLayer.removeChild(aceTextLayer.lastChild);
    }
    clearInterval(repeatCheck)
  }
}

window.addEventListener("load", function(){
  let optionGroup = document.querySelector("select#tm-doc-menu").children[1];
  preInstruction = document.querySelector("pre").style.display = "none";
  if(optionGroup && optionGroup.label == "Examples"){
    optionGroup.remove();
  }

  repeatCheck = setInterval(checkTextLayer, 50);

}, false)