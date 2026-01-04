// ==UserScript==
// @name 10fastfingers poop
// @namespace Violentmonkey Scripts
// @author solojazz
// @description Hack for 10fastfingers
// @version 1.0.6
// @match https://10fastfingers.com/typing-test/*
// @match https://10fastfingers.com/advanced-typing-test/*
// @match https://10fastfingers.com/multiplayer
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/382390/10fastfingers%20poop.user.js
// @updateURL https://update.greasyfork.org/scripts/382390/10fastfingers%20poop.meta.js
// ==/UserScript==

window.onload = function() {
  //var textField = document.getElementById("inputfield");
  var wordCount = document.getElementById("row1").childElementCount;
  var textField = document.getElementsByTagName('input');

  function sendKey(key) {
    var keyEvent = new Event('keyup');
    
    keyEvent.which = key.charCodeAt(0);
    console.log(key.charCodeAt(0));
    
    let input = textField[0];
    
    input.dispatchEvent(new Event('keydown'));
    input.dispatchEvent(keyEvent);
    input.value += key;
  }

  function getKey() {
    return document.getElementsByClassName("highlight")[0].innerHTML;
  }

  function typeWord() {
      var str = getKey();
      for (let i = 0; i < str.length; i++) {
          sendKey(str[i]);
    } 
      sendKey(' ')
      textField[0].value = "";
  }

  textField[0].onclick = function() { 
      for (let i = 0; i < wordCount; i++) {
        typeWord();
      } 
  }
  
  console.log("Script loaded...");
}